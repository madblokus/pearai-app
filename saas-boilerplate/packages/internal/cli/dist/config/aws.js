"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAWS = exports.loginToECR = void 0;
const client_sts_1 = require("@aws-sdk/client-sts");
const client_ecr_1 = require("@aws-sdk/client-ecr");
const color_1 = require("@oclif/color");
const api_1 = require("@opentelemetry/api");
const childProcess = require("child_process");
const util_1 = require("util");
const dotenv = require("dotenv");
const env_1 = require("./env");
const awsVault_1 = require("../lib/awsVault");
const chamber_1 = require("../lib/chamber");
const runCommand_1 = require("../lib/runCommand");
const exec = (0, util_1.promisify)(childProcess.exec);
const tracer = api_1.trace.getTracer('config:aws');
async function loadStageEnv(context, envStage, shouldValidate = true) {
    await (0, chamber_1.assertChamberInstalled)();
    await (0, chamber_1.loadChamberEnv)(context, { serviceName: envStage });
    if (shouldValidate) {
        const validationResult = await (0, env_1.validateStageEnv)();
        Object.assign(process.env, validationResult);
    }
}
const initAWSVault = async () => {
    return tracer.startActiveSpan('initAwsVault', async (span) => {
        const awsVaultProfile = process.env.AWS_VAULT_PROFILE;
        const { stdout } = await exec(`aws-vault export ${awsVaultProfile}`);
        const credentials = dotenv.parse(stdout);
        // @ts-ignore
        dotenv.populate(process.env, credentials);
        span.end();
    });
};
const loginToECR = async (context, { awsRegion, awsAccountId }) => {
    var _a;
    const ecrClient = new client_ecr_1.ECRClient();
    const getAuthorizationTokenCommand = new client_ecr_1.GetAuthorizationTokenCommand({});
    const { authorizationData } = await ecrClient.send(getAuthorizationTokenCommand);
    if (!((_a = authorizationData === null || authorizationData === void 0 ? void 0 : authorizationData[0]) === null || _a === void 0 ? void 0 : _a.authorizationToken)) {
        return null;
    }
    const decodedAuthToken = Buffer.from(authorizationData[0].authorizationToken, 'base64').toString('utf8');
    const password = decodedAuthToken.split(':')[1];
    try {
        const mirrorRepoUrl = `${awsAccountId}.dkr.ecr.${awsRegion}.amazonaws.com`;
        await (0, runCommand_1.runCommand)('docker', ['login', '--username', 'AWS', '-p', password, mirrorRepoUrl], { silent: true });
        process.env.SB_MIRROR_REPOSITORY = `${mirrorRepoUrl}/dockerhub-mirror/`;
        process.env.SB_PULL_THROUGH_CACHE_REPOSITORY = `${mirrorRepoUrl}/ecr-public/docker/library/`;
        context.log(`Successfully logged into ECR repository.
  SB_MIRROR_REPOSITORY=${process.env.SB_MIRROR_REPOSITORY}
  SB_PULL_THROUGH_CACHE_REPOSITORY=${process.env.SB_PULL_THROUGH_CACHE_REPOSITORY}`);
    }
    catch (error) {
        context.warn('Login to ECR registry failed.');
        context.warn(error);
    }
};
exports.loginToECR = loginToECR;
const initAWS = async (context, options) => {
    return tracer.startActiveSpan('initAWS', async (span) => {
        if (await (0, awsVault_1.isAwsVaultInstalled)()) {
            await initAWSVault();
        }
        let awsAccountId;
        try {
            const stsClient = new client_sts_1.STSClient();
            const { Account } = await stsClient.send(new client_sts_1.GetCallerIdentityCommand({}));
            awsAccountId = Account;
        }
        catch (error) {
            context.error('No valid AWS Credentials found in environment variables. We recommend installing aws-vault to securely manage AWS profiles');
        }
        context.log(`----------
"${color_1.color.red(options.envStage)}" is set as a current environment stage. Live AWS session credentials are being used.
----------\n`);
        await loadStageEnv(context, options.envStage, options.validateEnvStageVariables);
        const { skipERCLogin = false } = options;
        const awsRegion = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
        if (awsAccountId && awsRegion && !skipERCLogin) {
            await (0, exports.loginToECR)(context, {
                awsAccountId,
                awsRegion,
            });
        }
        span.end();
        return {
            awsAccountId,
            awsRegion,
        };
    });
};
exports.initAWS = initAWS;
//# sourceMappingURL=aws.js.map