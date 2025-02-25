"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const docker_1 = require("../../lib/docker");
const baseCommand_1 = require("../../baseCommand");
class BackendMakemigrations extends baseCommand_1.BaseCommand {
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
            'bash',
            '-c',
            `python ./manage.py makemigrations`,
        ], {
            cwd: rootPath,
        });
    }
}
BackendMakemigrations.description = 'Shorthand to generate django backend migrations. If you need more control use ' +
    '`saas backend shell` and run `./manage.py makemigrations` manually';
BackendMakemigrations.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = BackendMakemigrations;
//# sourceMappingURL=makemigrations.js.map