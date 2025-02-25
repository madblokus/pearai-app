"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initConfig = void 0;
const color_1 = require("@oclif/color");
const api_1 = require("@opentelemetry/api");
const env_1 = require("./env");
const aws_1 = require("./aws");
const storage_1 = require("./storage");
const tracer = api_1.trace.getTracer('command-init');
const initConfig = async (context, { requireAws = false, validateEnvStageVariables = true, requireLocalEnvStage = false, skipERCLogin = false, }) => {
    return tracer.startActiveSpan('initConfig', async (span) => {
        const rootPath = await (0, env_1.getRootPath)();
        const version = await (0, env_1.loadVersionEnv)();
        const envStage = await (0, storage_1.loadEnvStage)();
        (0, env_1.disableNxEnvFiles)();
        const projectName = process.env.PROJECT_NAME;
        if (!projectName) {
            context.error('PROJECT_NAME environmental variable needs to be defined. You can set it in <root>/.env file or in the system');
        }
        if (requireLocalEnvStage && envStage !== env_1.ENV_STAGE_LOCAL) {
            context.error(`This command should only be run on a local environment stage.
Please call \`saas aws set-env local\` first or open a new terminal.`);
        }
        let awsAccountId;
        let awsRegion;
        if (requireAws) {
            if (envStage === env_1.ENV_STAGE_LOCAL && requireAws !== 'allow-local') {
                context.error(`Remote environment stage required.\nPlease call \`${color_1.color.green('saas aws set-env [stage-name]')}\` first. Do not use \`local\` value.`);
            }
            if (envStage !== env_1.ENV_STAGE_LOCAL) {
                const awsMetadata = await (0, aws_1.initAWS)(context, {
                    envStage,
                    validateEnvStageVariables,
                    skipERCLogin,
                });
                awsAccountId = awsMetadata.awsAccountId;
                awsRegion = awsMetadata.awsRegion;
            }
        }
        if (envStage !== env_1.ENV_STAGE_LOCAL) {
            process.env.COMPOSE_PATH_SEPARATOR = ':';
            process.env.COMPOSE_FILE = 'docker-compose.yml:docker-compose.ci.yml';
        }
        const projectEnvName = `${projectName}-${envStage}`;
        span.end();
        return {
            rootPath,
            projectName,
            projectEnvName,
            envStage,
            version,
            awsRegion,
            awsAccountId,
        };
    });
};
exports.initConfig = initConfig;
//# sourceMappingURL=init.js.map