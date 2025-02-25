"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const docker_1 = require("../../lib/docker");
const baseCommand_1 = require("../../baseCommand");
class BackendMigrate extends baseCommand_1.BaseCommand {
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
            'python ./manage.py migrate',
        ], {
            cwd: rootPath,
        });
    }
}
BackendMigrate.description = 'Shorthand to run backend migrations using local database. If you need more control use' +
    '`saas backend shell` and run `./manage.py migrate` manually';
BackendMigrate.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = BackendMigrate;
//# sourceMappingURL=migrate.js.map