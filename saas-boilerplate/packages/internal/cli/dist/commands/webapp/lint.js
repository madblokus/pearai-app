"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const baseCommand_1 = require("../../baseCommand");
class WebappLint extends baseCommand_1.BaseCommand {
    async run() {
        const { flags } = await this.parse(WebappLint);
        await (0, init_1.initConfig)(this, {});
        if (flags.includeLibs) {
            await (0, runCommand_1.runCommand)('pnpm', [
                'nx',
                'run-many',
                '--target=lint',
                '--projects=webapp*',
            ]);
        }
        else {
            await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'webapp:lint']);
        }
    }
}
WebappLint.description = 'Runs all webapp linters';
WebappLint.examples = [`$ <%= config.bin %> <%= command.id %>`];
WebappLint.flags = {
    includeLibs: core_1.Flags.boolean({
        default: false,
    }),
};
exports.default = WebappLint;
//# sourceMappingURL=lint.js.map