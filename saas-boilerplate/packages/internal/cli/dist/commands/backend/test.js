"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const baseCommand_1 = require("../../baseCommand");
class BackendTest extends baseCommand_1.BaseCommand {
    async run() {
        await (0, init_1.initConfig)(this, {});
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'backend:test']);
    }
}
BackendTest.description = 'Runs all backend tests in docker container';
BackendTest.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = BackendTest;
//# sourceMappingURL=test.js.map