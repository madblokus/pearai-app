"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const baseCommand_1 = require("../../baseCommand");
class WebappTest extends baseCommand_1.BaseCommand {
    async run() {
        const { flags } = await this.parse(WebappTest);
        await (0, init_1.initConfig)(this, {});
        if (flags.includeLibs) {
            await (0, runCommand_1.runCommand)('pnpm', [
                'nx',
                'run-many',
                '--target=test',
                '--projects=webapp*',
            ]);
        }
        else {
            await (0, runCommand_1.runCommand)('pnpm', [
                'nx',
                'run',
                'webapp:test',
                `--watchAll=${flags.watchAll}`,
            ]);
        }
    }
}
WebappTest.description = 'Runs all webapp tests';
WebappTest.examples = [`$ <%= config.bin %> <%= command.id %>`];
WebappTest.flags = {
    watchAll: core_1.Flags.string({
        default: 'false',
    }),
    includeLibs: core_1.Flags.boolean({
        default: false,
    }),
};
exports.default = WebappTest;
//# sourceMappingURL=test.js.map