"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const docker_1 = require("../../lib/docker");
const baseCommand_1 = require("../../baseCommand");
class WorkersShell extends baseCommand_1.BaseCommand {
    async run() {
        const { rootPath } = await (0, init_1.initConfig)(this, {});
        await (0, docker_1.assertDockerIsRunning)();
        await (0, docker_1.dockerHubLogin)();
        await (0, runCommand_1.runCommand)('docker', ['compose', 'run', '--rm', '-T', 'workers', 'bash'], {
            cwd: rootPath,
        });
    }
}
WorkersShell.description = 'Runs shell inside workers docker container';
WorkersShell.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = WorkersShell;
//# sourceMappingURL=shell.js.map