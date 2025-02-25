"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("@oclif/color");
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const env_1 = require("../../config/env");
const chamber_1 = require("../../lib/chamber");
const baseCommand_1 = require("../../baseCommand");
class DocsBuild extends baseCommand_1.BaseCommand {
    async run() {
        const { envStage, version, awsRegion, awsAccountId, projectEnvName } = await (0, init_1.initConfig)(this, { requireAws: 'allow-local' });
        if (envStage !== env_1.ENV_STAGE_LOCAL) {
            await (0, chamber_1.assertChamberInstalled)();
            await (0, chamber_1.loadChamberEnv)(this, {
                serviceName: `env-${projectEnvName}-docs`,
            });
        }
        this.log(`Building docs:
  envStage: ${color_1.color.green(envStage)}
  version: ${color_1.color.green(version)}
  AWS account: ${awsAccountId ? color_1.color.green(awsAccountId) : 'none'}
  AWS region: ${awsRegion ? color_1.color.green(awsRegion) : 'none'}
`);
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'docs:build']);
    }
}
DocsBuild.description = 'Build docs artifact';
DocsBuild.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = DocsBuild;
//# sourceMappingURL=build.js.map