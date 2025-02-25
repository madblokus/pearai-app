"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("@oclif/color");
const init_1 = require("../../config/init");
const docker_1 = require("../../lib/docker");
const secretsEditor_1 = require("../../lib/secretsEditor");
const baseCommand_1 = require("../../baseCommand");
class WebappSecrets extends baseCommand_1.BaseCommand {
    async run() {
        const { envStage, awsAccountId, awsRegion, rootPath } = await (0, init_1.initConfig)(this, {
            requireAws: true,
        });
        await (0, docker_1.assertDockerIsRunning)();
        await (0, docker_1.dockerHubLogin)();
        this.log(`Settings secrets in AWS SSM Parameter store for:
  service: ${color_1.color.green('workers')}
  envStage: ${color_1.color.green(envStage)}
  AWS account: ${color_1.color.green(awsAccountId)}
  AWS region: ${color_1.color.green(awsRegion)}
`);
        await (0, secretsEditor_1.runSecretsEditor)({ serviceName: 'workers', rootPath });
    }
}
WebappSecrets.description = 'Runs an ssm-editor helper tool in docker container to set runtime environmental variables of workers service. ' +
    'Underneath it uses chamber to both fetch and set those variables in AWS SSM Parameter Store';
WebappSecrets.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = WebappSecrets;
//# sourceMappingURL=secrets.js.map