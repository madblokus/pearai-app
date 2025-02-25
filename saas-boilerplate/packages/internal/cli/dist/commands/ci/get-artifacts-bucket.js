"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_cloudformation_1 = require("@aws-sdk/client-cloudformation");
const ramda_1 = require("ramda");
const init_1 = require("../../config/init");
const baseCommand_1 = require("../../baseCommand");
async function getOutputsFromStack({ stackName }) {
    var _a, _b;
    const client = new client_cloudformation_1.CloudFormationClient();
    const describeStackResult = await client.send(new client_cloudformation_1.DescribeStacksCommand({ StackName: stackName }));
    const stack = (_a = describeStackResult === null || describeStackResult === void 0 ? void 0 : describeStackResult.Stacks) === null || _a === void 0 ? void 0 : _a[0];
    return (0, ramda_1.indexBy)((0, ramda_1.prop)('ExportName'), (_b = stack === null || stack === void 0 ? void 0 : stack.Outputs) !== null && _b !== void 0 ? _b : []);
}
class CiGetArtifactsBucket extends baseCommand_1.BaseCommand {
    async run() {
        var _a;
        const { projectEnvName } = await (0, init_1.initConfig)(this, {
            requireAws: true,
            skipERCLogin: true,
        });
        const globalStackOutputs = await getOutputsFromStack({
            stackName: `${projectEnvName}-CiStack`,
        });
        const { OutputValue: artifactsBucketName } = (_a = globalStackOutputs[`${projectEnvName}-artifactsBucketName`]) !== null && _a !== void 0 ? _a : {};
        if (!artifactsBucketName) {
            this.error('Failed to fetch bucket name');
        }
        this.log(`Bucket name: ${artifactsBucketName}`);
    }
}
CiGetArtifactsBucket.description = 'Returns name of the bucket that external-ci user can upload code artifact to trigger a deployment';
CiGetArtifactsBucket.examples = [`$ <%= config.bin %> <%= command.id %>`];
CiGetArtifactsBucket.flags = {};
exports.default = CiGetArtifactsBucket;
//# sourceMappingURL=get-artifacts-bucket.js.map