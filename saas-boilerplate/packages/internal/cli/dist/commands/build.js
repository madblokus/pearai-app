"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../config/init");
const runCommand_1 = require("../lib/runCommand");
const docker_1 = require("../lib/docker");
const baseCommand_1 = require("../baseCommand");
class Build extends baseCommand_1.BaseCommand {
    async run() {
        await (0, init_1.initConfig)(this, { requireAws: true });
        await (0, docker_1.dockerHubLogin)();
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'backend:build']);
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'webapp:build']);
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'workers:build']);
    }
}
Build.description = 'Build all deployable artifacts';
Build.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = Build;
//# sourceMappingURL=build.js.map