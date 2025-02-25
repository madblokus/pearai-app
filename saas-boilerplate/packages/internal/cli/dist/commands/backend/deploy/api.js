"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const color_1 = require("@oclif/color");
const init_1 = require("../../../config/init");
const runCommand_1 = require("../../../lib/runCommand");
const baseCommand_1 = require("../../../baseCommand");
class BackendDeployApi extends baseCommand_1.BaseCommand {
    async run() {
        const { flags } = await this.parse(BackendDeployApi);
        const { envStage, version, awsRegion, awsAccountId } = await (0, init_1.initConfig)(this, { requireAws: true });
        this.log(`Deploying backend:
  envStage: ${color_1.color.green(envStage)}
  version: ${color_1.color.green(version)}
  AWS account: ${color_1.color.green(awsAccountId)}
  AWS region: ${color_1.color.green(awsRegion)}
`);
        const verb = flags.diff ? 'diff' : 'deploy';
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', `backend:${verb}:api`]);
    }
}
BackendDeployApi.description = 'Deploys backend API to AWS using previously built artifact';
BackendDeployApi.examples = [`$ <%= config.bin %> <%= command.id %>`];
BackendDeployApi.flags = {
    diff: core_1.Flags.boolean({
        default: false,
        description: 'Perform a dry run and list all changes that would be applied in AWS account',
        required: false,
    }),
};
exports.default = BackendDeployApi;
//# sourceMappingURL=api.js.map