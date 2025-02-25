"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStageEnv = exports.disableNxEnvFiles = exports.loadVersionEnv = exports.SB_TELEMETRY_KEY = exports.SB_TELEMETRY_URL = exports.SB_TELEMETRY_DEBUG = exports.SB_TELEMETRY_DISABLED = exports.IS_CI = exports.ENV_STAGE_LOCAL = exports.getRootPath = void 0;
const childProcess = require("child_process");
const util_1 = require("util");
const path_1 = require("path");
const dotenv = require("dotenv");
const envalid = require("envalid");
const sbTelemetry = require('@apptension/saas-boilerplate-telemetry');
const getRootPath = () => {
    const stdout = childProcess.execSync('pnpm root -w');
    return (0, path_1.resolve)(stdout.toString(), '..');
};
exports.getRootPath = getRootPath;
dotenv.config({ path: (0, path_1.resolve)((0, exports.getRootPath)(), '.env') });
exports.ENV_STAGE_LOCAL = 'local';
exports.IS_CI = Boolean((_a = process.env.CI) !== null && _a !== void 0 ? _a : false);
exports.SB_TELEMETRY_DISABLED = exports.IS_CI || process.env.SB_TELEMETRY_DISABLED == '1';
exports.SB_TELEMETRY_DEBUG = exports.IS_CI || process.env.SB_TELEMETRY_DEBUG == '1';
exports.SB_TELEMETRY_URL = (_b = process.env.SB_TELEMETRY_URL) !== null && _b !== void 0 ? _b : sbTelemetry[0];
exports.SB_TELEMETRY_KEY = (_c = process.env.SB_TELEMETRY_KEY) !== null && _c !== void 0 ? _c : sbTelemetry[1];
const exec = (0, util_1.promisify)(childProcess.exec);
async function loadVersionEnv() {
    if (process.env.VERSION) {
        return process.env.VERSION;
    }
    let versionRaw = '';
    try {
        const { stdout } = await exec('git describe --tags --first-parent --abbrev=11 --long --dirty --always');
        versionRaw = stdout;
    }
    catch {
        versionRaw = '0.0.1';
    }
    const version = versionRaw.trim();
    process.env.VERSION = version;
    return version;
}
exports.loadVersionEnv = loadVersionEnv;
const disableNxEnvFiles = () => {
    process.env.NX_LOAD_DOT_ENV_FILES = 'false';
};
exports.disableNxEnvFiles = disableNxEnvFiles;
async function validateStageEnv() {
    return envalid.cleanEnv(process.env, {
        PROJECT_NAME: envalid.str({
            desc: 'The name of your project (best if 3-5 characters to avoid AWS names being to long)',
            example: 'saas',
        }),
        AWS_DEFAULT_REGION: envalid.str({
            desc: 'Default AWS region code',
            example: 'eu-west-1',
        }),
        COMPOSE_FILE: envalid.str({
            desc: 'Specifies the path to a Compose file. Specifying multiple Compose files is supported. Visit https://docs.docker.com/compose/environment-variables/envvars/#compose_file to read more',
            example: 'docker-compose.yml:docker-compose.ci.yml',
            default: 'docker-compose.yml:docker-compose.ci.yml',
        }),
        SB_HOSTED_ZONE_ID: envalid.str({
            desc: 'Id of a AWS Route53 hosted zone of a domain used to host services of this environment',
        }),
        SB_HOSTED_ZONE_NAME: envalid.str({
            desc: 'Name of a AWS Route53 hosted zone of a domain used to host services of this environment',
            example: 'example.com',
        }),
        SB_DOMAIN_ADMIN_PANEL: envalid.str({
            desc: 'A domain used to host an admin panel service',
            example: 'admin.example.com',
        }),
        SB_DOMAIN_API: envalid.str({
            desc: 'A domain used to host an API backend service',
            example: 'api.example.com',
        }),
        SB_DOMAIN_WEB_APP: envalid.str({
            desc: 'A domain used to host the web application',
            example: 'app.example.com',
        }),
        SB_DOMAIN_DOCS: envalid.str({
            desc: 'A domain used to host the documentation',
            example: 'docs.example.com',
        }),
        SB_DOMAIN_CDN: envalid.str({
            desc: 'A domain used to static assets delivery',
            example: 'cdn.example.com',
        }),
        SB_BASIC_AUTH: envalid.str({
            default: '',
            desc: 'Username and password separated by colon (":") used to protect website form unauthorized access',
            example: 'admin:password',
        }),
        COMPOSE_PATH_SEPARATOR: envalid.str({
            desc: 'Specifies a different path separator for items listed in COMPOSE_FILE. Visit https://docs.docker.com/compose/environment-variables/envvars/#compose_path_separator to read more',
            default: ':',
        }),
        SB_CLOUDFRONT_CERTIFICATE_ARN: envalid.str({
            desc: 'ARN of already generated certificate that should be attached to CloudFront distribution. This certificate needs to be generated in us-east-1 region.',
            default: '',
        }),
        SB_LOAD_BALANCER_CERTIFICATE_ARN: envalid.str({
            desc: 'ARN of already generated certificate that should be attached to Load Balancer. This certificate needs to be generated in the same region as the application.',
            default: '',
        }),
        SB_CERTIFICATE_DOMAIN: envalid.str({
            desc: 'The domain will be used to generate a certificate, if not provided will be used envStage and hosted zone name',
            default: '',
        }),
    });
}
exports.validateStageEnv = validateStageEnv;
//# sourceMappingURL=env.js.map