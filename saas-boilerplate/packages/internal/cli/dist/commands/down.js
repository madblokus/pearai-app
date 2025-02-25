"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../config/init");
const runCommand_1 = require("../lib/runCommand");
const docker_1 = require("../lib/docker");
const baseCommand_1 = require("../baseCommand");
class Down extends baseCommand_1.BaseCommand {
    async run() {
        await (0, init_1.initConfig)(this, { requireLocalEnvStage: true });
        await (0, docker_1.assertDockerIsRunning)();
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'core:docker-compose:down']);
    }
}
Down.description = 'Starts both backend and frontend';
Down.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = Down;
//# sourceMappingURL=down.js.map