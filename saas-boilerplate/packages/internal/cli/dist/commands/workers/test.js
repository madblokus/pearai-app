"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const docker_1 = require("../../lib/docker");
const baseCommand_1 = require("../../baseCommand");
class WorkersTest extends baseCommand_1.BaseCommand {
    async run() {
        await (0, init_1.initConfig)(this, { requireAws: 'allow-local' });
        await (0, docker_1.assertDockerIsRunning)();
        await (0, docker_1.dockerHubLogin)();
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'workers:test']);
    }
}
WorkersTest.description = 'Run all tests inside workers docker container';
WorkersTest.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = WorkersTest;
//# sourceMappingURL=test.js.map