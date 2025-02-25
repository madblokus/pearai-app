"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../../config/init");
const runCommand_1 = require("../../../lib/runCommand");
const docker_1 = require("../../../lib/docker");
const baseCommand_1 = require("../../../baseCommand");
class BackendStripeSync extends baseCommand_1.BaseCommand {
    async run() {
        const { rootPath } = await (0, init_1.initConfig)(this, {
            requireLocalEnvStage: true,
        });
        await (0, docker_1.assertDockerIsRunning)();
        await (0, docker_1.dockerHubLogin)();
        await (0, runCommand_1.runCommand)('docker', [
            'compose',
            'run',
            '--rm',
            '-T',
            'backend',
            'sh',
            '-c',
            'python ./manage.py djstripe_sync_models',
        ], {
            cwd: rootPath,
        });
    }
}
BackendStripeSync.description = 'Run stripe synchronisation command inside backend docker container. Requires environmental variables with ' +
    'stripe credentials to be set.';
BackendStripeSync.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = BackendStripeSync;
//# sourceMappingURL=sync.js.map