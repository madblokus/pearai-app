"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const baseCommand_1 = require("../../baseCommand");
class DocsUp extends baseCommand_1.BaseCommand {
    async run() {
        await (0, init_1.initConfig)(this, { requireLocalEnvStage: true });
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'docs:start']);
    }
}
DocsUp.description = 'Starts local docusaurus server';
DocsUp.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = DocsUp;
//# sourceMappingURL=up.js.map