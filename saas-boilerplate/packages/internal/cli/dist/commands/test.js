"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../config/init");
const runCommand_1 = require("../lib/runCommand");
const baseCommand_1 = require("../baseCommand");
class Test extends baseCommand_1.BaseCommand {
    async run() {
        await (0, init_1.initConfig)(this, {});
        await (0, runCommand_1.runCommand)('pnpm', [
            'nx',
            'run-many',
            '--output-style=stream',
            '--target=test',
        ]);
    }
}
Test.description = 'Test all projects';
Test.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = Test;
//# sourceMappingURL=test.js.map