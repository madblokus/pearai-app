"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("@oclif/color");
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const docker_1 = require("../../lib/docker");
const baseCommand_1 = require("../../baseCommand");
class WorkersBuild extends baseCommand_1.BaseCommand {
    async run() {
        const { envStage, version, awsAccountId, awsRegion } = await (0, init_1.initConfig)(this, { requireAws: true });
        await (0, docker_1.dockerHubLogin)();
        this.log(`Building workers:
  envStage: ${color_1.color.green(envStage)}
  version: ${color_1.color.green(version)}
  AWS account: ${color_1.color.green(awsAccountId)}
  AWS region: ${color_1.color.green(awsRegion)}
`);
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', `workers:build`]);
    }
}
WorkersBuild.description = 'Build workers artifact ready to be deployed to AWS';
WorkersBuild.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = WorkersBuild;
//# sourceMappingURL=build.js.map