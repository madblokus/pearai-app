"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const color_1 = require("@oclif/color");
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const docker_1 = require("../../lib/docker");
const baseCommand_1 = require("../../baseCommand");
class WorkersDeploy extends baseCommand_1.BaseCommand {
    async run() {
        const { flags } = await this.parse(WorkersDeploy);
        const { envStage, version, awsAccountId, awsRegion } = await (0, init_1.initConfig)(this, { requireAws: true });
        await (0, docker_1.dockerHubLogin)();
        this.log(`Deploying workers:
  envStage: ${color_1.color.green(envStage)}
  version: ${color_1.color.green(version)}
  AWS account: ${color_1.color.green(awsAccountId)}
  AWS region: ${color_1.color.green(awsRegion)}
`);
        const verb = flags.diff ? 'diff' : 'deploy';
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', `workers:${verb}`]);
    }
}
WorkersDeploy.description = 'Deploys workers to AWS using previously built artifact';
WorkersDeploy.examples = [`$ <%= config.bin %> <%= command.id %>`];
WorkersDeploy.flags = {
    diff: core_1.Flags.boolean({
        default: false,
        description: 'Perform a dry run and list all changes that would be applied in AWS account',
        required: false,
    }),
};
exports.default = WorkersDeploy;
//# sourceMappingURL=deploy.js.map