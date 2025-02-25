"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const client_lambda_1 = require("@aws-sdk/client-lambda");
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const baseCommand_1 = require("../../baseCommand");
var StackName;
(function (StackName) {
    StackName["Global"] = "global";
    StackName["Main"] = "main";
    StackName["Db"] = "db";
    StackName["Ci"] = "ci";
    StackName["Components"] = "components";
})(StackName || (StackName = {}));
class InfraDeploy extends baseCommand_1.BaseCommand {
    async run() {
        const { flags, args } = await this.parse(InfraDeploy);
        const { projectName } = await (0, init_1.initConfig)(this, { requireAws: true });
        const lambdaClient = new client_lambda_1.LambdaClient();
        const verb = flags.diff ? 'diff' : 'deploy';
        if (!args.stackName || args.stackName === StackName.Global) {
            await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', `infra-shared:${verb}:global`]);
            if (verb === 'deploy') {
                const functionName = `${projectName}-ecr-sync-get-image-tags`;
                this.log(`Invoking ${functionName} lambda function to trigger docker hub mirror synchronisation`);
                await lambdaClient.send(new client_lambda_1.InvokeCommand({
                    FunctionName: functionName,
                }));
            }
        }
        if (!args.stackName || args.stackName === StackName.Main) {
            await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', `infra-shared:${verb}:main`]);
        }
        if (!args.stackName || args.stackName === StackName.Db) {
            await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', `infra-shared:${verb}:db`]);
        }
        if (!args.stackName || args.stackName === StackName.Ci) {
            await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', `infra-shared:${verb}:ci`]);
        }
        if (!args.stackName || args.stackName === StackName.Components) {
            await (0, runCommand_1.runCommand)('pnpm', [
                'nx',
                'run',
                `infra-shared:${verb}:components`,
            ]);
        }
    }
}
InfraDeploy.description = 'Deploy infrastructure of a currently selected environment stage to AWS account';
InfraDeploy.examples = [`$ <%= config.bin %> <%= command.id %>`];
InfraDeploy.flags = {
    diff: core_1.Flags.boolean({
        default: false,
        description: 'Perform a dry run and list all changes that would be applied',
        required: false,
    }),
};
InfraDeploy.args = {
    stackName: core_1.Args.string({
        description: 'Name of the stack to deploy. If not specified all will be deployed',
        required: false,
        options: Object.values(StackName),
    }),
};
exports.default = InfraDeploy;
//# sourceMappingURL=deploy.js.map