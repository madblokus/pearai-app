"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const docker_1 = require("../../lib/docker");
const baseCommand_1 = require("../../baseCommand");
class WorkersBlack extends baseCommand_1.BaseCommand {
    async run() {
        const { rootPath } = await (0, init_1.initConfig)(this, {});
        await (0, docker_1.assertDockerIsRunning)();
        await (0, docker_1.dockerHubLogin)();
        await (0, runCommand_1.runCommand)('docker', [
            'compose',
            'run',
            '--rm',
            '-T',
            '--no-deps',
            'workers',
            'black',
            '--config=pyproject.toml',
            '.',
        ], {
            cwd: rootPath,
        });
    }
}
WorkersBlack.description = 'Runs black inside workers docker container';
WorkersBlack.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = WorkersBlack;
//# sourceMappingURL=black.js.map