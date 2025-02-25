"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const baseCommand_1 = require("../../baseCommand");
class WebappTypeCheck extends baseCommand_1.BaseCommand {
    async run() {
        const { flags } = await this.parse(WebappTypeCheck);
        await (0, init_1.initConfig)(this, {});
        if (flags.includeLibs) {
            await (0, runCommand_1.runCommand)('pnpm', [
                'nx',
                'run-many',
                '--target=type-check',
                '--projects=webapp*',
            ]);
        }
        else {
            await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'webapp:type-check']);
        }
    }
}
WebappTypeCheck.description = 'Runs all webapp linters';
WebappTypeCheck.examples = [`$ <%= config.bin %> <%= command.id %>`];
WebappTypeCheck.flags = {
    includeLibs: core_1.Flags.boolean({
        default: false,
    }),
};
exports.default = WebappTypeCheck;
//# sourceMappingURL=type-check.js.map