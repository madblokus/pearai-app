"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const docker_1 = require("../../lib/docker");
const baseCommand_1 = require("../../baseCommand");
class BackendBuildDocs extends baseCommand_1.BaseCommand {
    async run() {
        await (0, init_1.initConfig)(this, {});
        await (0, docker_1.dockerHubLogin)();
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'backend:build-docs']);
    }
}
BackendBuildDocs.description = 'Build backend docs and put results into docs package';
BackendBuildDocs.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = BackendBuildDocs;
//# sourceMappingURL=build-docs.js.map