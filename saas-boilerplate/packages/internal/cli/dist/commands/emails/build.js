"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("@oclif/color");
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const baseCommand_1 = require("../../baseCommand");
class EmailsBuild extends baseCommand_1.BaseCommand {
    async run() {
        const { envStage, version, awsRegion, awsAccountId } = await (0, init_1.initConfig)(this, { requireAws: 'allow-local' });
        this.log(`Building emails:
  envStage: ${color_1.color.green(envStage)}
  version: ${color_1.color.green(version)}
  AWS account: ${awsAccountId ? color_1.color.green(awsAccountId) : 'none'}
  AWS region: ${awsRegion ? color_1.color.green(awsRegion) : 'none'}
`);
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'webapp-emails:build']);
    }
}
EmailsBuild.description = 'Build emails artifact and place it in workers package';
EmailsBuild.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = EmailsBuild;
//# sourceMappingURL=build.js.map