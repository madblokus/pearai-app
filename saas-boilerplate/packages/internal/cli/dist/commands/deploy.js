"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const init_1 = require("../config/init");
const runCommand_1 = require("../lib/runCommand");
const baseCommand_1 = require("../baseCommand");
class Deploy extends baseCommand_1.BaseCommand {
    async run() {
        const { flags } = await this.parse(Deploy);
        await (0, init_1.initConfig)(this, { requireAws: true });
        const verb = flags.diff ? 'diff' : 'deploy';
        await (0, runCommand_1.runCommand)('pnpm', [
            'nx',
            'run-many',
            '--output-style=stream',
            `--target=${verb}`,
            '--projects=backend,workers,webapp',
        ]);
    }
}
Deploy.description = 'Deploy all previously built artifacts to AWS';
Deploy.examples = [`$ <%= config.bin %> <%= command.id %>`];
Deploy.flags = {
    diff: core_1.Flags.boolean({
        default: false,
        description: 'Perform a dry run and list all changes that would be applied in AWS account',
        required: false,
    }),
};
exports.default = Deploy;
//# sourceMappingURL=deploy.js.map