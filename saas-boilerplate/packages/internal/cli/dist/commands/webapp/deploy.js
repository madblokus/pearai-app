"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const baseCommand_1 = require("../../baseCommand");
class WebappDeploy extends baseCommand_1.BaseCommand {
    async run() {
        const { flags } = await this.parse(WebappDeploy);
        await (0, init_1.initConfig)(this, { requireAws: true });
        const verb = flags.diff ? 'diff' : 'deploy';
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', `webapp:${verb}`]);
    }
}
WebappDeploy.description = 'Deploys webapp to AWS using previously built artifact';
WebappDeploy.examples = [`$ <%= config.bin %> <%= command.id %>`];
WebappDeploy.flags = {
    diff: core_1.Flags.boolean({
        default: false,
        description: 'Perform a dry run and list all changes that would be applied in AWS account',
        required: false,
    }),
};
exports.default = WebappDeploy;
//# sourceMappingURL=deploy.js.map