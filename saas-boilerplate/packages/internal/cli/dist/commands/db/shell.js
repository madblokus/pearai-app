"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const docker_1 = require("../../lib/docker");
const baseCommand_1 = require("../../baseCommand");
class DbShell extends baseCommand_1.BaseCommand {
    async run() {
        const { rootPath } = await (0, init_1.initConfig)(this, {
            requireLocalEnvStage: true,
        });
        await (0, docker_1.assertDockerIsRunning)();
        await (0, docker_1.dockerHubLogin)();
        await (0, runCommand_1.runCommand)('docker', ['compose', 'exec', 'db', 'psql'], {
            env: {
                ...process.env,
                PGUSER: 'backend',
                PGPASSWORD: 'backend',
                PGDATABASE: 'backend',
            },
            cwd: rootPath,
        });
    }
}
DbShell.description = 'Start a psql client shell in local `db` container. It allows you to run some raw queries when needed.';
DbShell.examples = [`<%= config.bin %> <%= command.id %>`];
DbShell.flags = {};
DbShell.args = {};
exports.default = DbShell;
//# sourceMappingURL=shell.js.map