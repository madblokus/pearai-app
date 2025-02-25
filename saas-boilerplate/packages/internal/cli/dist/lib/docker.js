"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dockerHubLogin = exports.assertDockerIsRunning = void 0;
const core_1 = require("@oclif/core");
const childProcess = require("child_process");
const util_1 = require("util");
const api_1 = require("@opentelemetry/api");
const { CLIError } = core_1.Errors;
const tracer = api_1.trace.getTracer('docker');
const exec = (0, util_1.promisify)(childProcess.exec);
const assertDockerIsRunning = async () => {
    return tracer.startActiveSpan('assertDockerIsRunning', async (span) => {
        try {
            await exec('docker info');
            span.end();
            return true;
        }
        catch (err) {
            throw new CLIError(`It seems that docker daemon is not running. Here's a result from \`docker info\` command:

${err}
    `);
        }
    });
};
exports.assertDockerIsRunning = assertDockerIsRunning;
const dockerHubLogin = async () => {
    const username = process.env.DOCKER_USERNAME;
    const password = process.env.DOCKER_PASSWORD;
    if (username && password) {
        return tracer.startActiveSpan('dockerHubLogin', async (span) => {
            await exec(`docker login -u "${username}" -p "${password}"`);
            span.end();
        });
    }
};
exports.dockerHubLogin = dockerHubLogin;
//# sourceMappingURL=docker.js.map