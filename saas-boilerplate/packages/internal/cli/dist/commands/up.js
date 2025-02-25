"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const util = require("node:util");
const node_child_process_1 = require("node:child_process");
const init_1 = require("../config/init");
const runCommand_1 = require("../lib/runCommand");
const docker_1 = require("../lib/docker");
const baseCommand_1 = require("../baseCommand");
const exec = util.promisify(node_child_process_1.exec);
async function getBackendEndpoint(context) {
    var _a;
    const expectedBackendPort = 5001;
    const { stdout: psResultStr } = await exec('docker compose ps --format=json');
    let psResult;
    try {
        psResult = JSON.parse(psResultStr);
    }
    catch (e) {
        // new docker returns JSONL instead of JSON so need to filter empty lines and parse every line separately
        psResult = psResultStr
            .split(/\r?\n/)
            .filter((line) => line.trim() !== '')
            .map((v) => JSON.parse(v));
    }
    const backendContainerExists = psResult.some(({ Service: service }) => service === 'backend');
    if (!backendContainerExists) {
        context.error('running backend container not found');
    }
    const hasExpectedPort = ({ PublishedPort }) => PublishedPort === expectedBackendPort;
    const backendContainer = psResult.find(({ Service: service, Publishers: publishers }) => service === 'backend' && (publishers === null || publishers === void 0 ? void 0 : publishers.some(hasExpectedPort)));
    if (!backendContainer) {
        context.error(`backend container does not expose expected port ${expectedBackendPort}. Web app will not be able to send requests
to API. Make sure that backend service in docker-compose.yml exposes ${expectedBackendPort}. Read more on
docker compose networking in official documentation: https://docs.docker.com/compose/networking/`);
    }
    const publisher = (_a = backendContainer.Publishers) === null || _a === void 0 ? void 0 : _a.find(hasExpectedPort);
    return `http://${publisher === null || publisher === void 0 ? void 0 : publisher.URL}:${publisher === null || publisher === void 0 ? void 0 : publisher.PublishedPort}`;
}
async function waitForBackend(context, { url, stepTime = 500, retryCount }) {
    core_1.ux.action.start('Backend server is not ready yet.\n You can run `docker compose logs backend -f` ' +
        'to see logs from backend container.\n Waiting');
    for (let i = 0; i < retryCount; i += 1) {
        try {
            await fetch(url, { method: 'GET' });
            core_1.ux.action.stop();
            return;
        }
        catch (error) {
            await new Promise((resolve) => setTimeout(resolve, stepTime));
        }
    }
    context.error('Timeout: Backend dev server failed to start. Run `docker compose logs backend -f` to understand why it' +
        'happened');
}
class Up extends baseCommand_1.BaseCommand {
    async run() {
        await (0, init_1.initConfig)(this, { requireLocalEnvStage: true });
        await (0, docker_1.assertDockerIsRunning)();
        await (0, docker_1.dockerHubLogin)();
        await (0, runCommand_1.runCommand)('pnpm', ['saas', 'emails', 'build']);
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'core:docker-compose:up']);
        const backendEndpoint = await getBackendEndpoint(this);
        await waitForBackend(this, { url: backendEndpoint, retryCount: 200 });
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'webapp:start']);
    }
}
Up.description = 'Starts both backend and frontend';
Up.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = Up;
//# sourceMappingURL=up.js.map