"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const baseCommand_1 = require("../../baseCommand");
class InfraBootstrap extends baseCommand_1.BaseCommand {
    async run() {
        const { awsAccountId, awsRegion } = await (0, init_1.initConfig)(this, {
            requireAws: true,
            validateEnvStageVariables: false,
        });
        await (0, runCommand_1.runCommand)('pnpm', [
            'cdk',
            'bootstrap',
            `aws://${awsAccountId}/${awsRegion}`,
        ]);
        await (0, runCommand_1.runCommand)('pnpm', [
            'cdk',
            'bootstrap',
            `aws://${awsAccountId}/us-east-1`,
        ]);
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'infra-shared:bootstrap']);
    }
}
InfraBootstrap.description = 'Bootstrap infrastructure in AWS account by creating resources necessary to start working with SaaS ' +
    'Boilerplate';
InfraBootstrap.examples = [`<%= config.bin %> <%= command.id %>`];
exports.default = InfraBootstrap;
//# sourceMappingURL=bootstrap.js.map