"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("@oclif/color");
const client_ecs_1 = require("@aws-sdk/client-ecs");
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const baseCommand_1 = require("../../baseCommand");
class RemoteShell extends baseCommand_1.BaseCommand {
    async run() {
        var _a;
        const { projectName, envStage, awsRegion } = await (0, init_1.initConfig)(this, {
            requireAws: true,
        });
        if (!awsRegion) {
            this.error('AWS Region is missing');
        }
        const projectEnvName = `${projectName}-${envStage}`;
        const clusterName = `${projectEnvName}-main`;
        const serviceName = `${projectEnvName}-api`;
        const ecsClient = new client_ecs_1.ECSClient();
        const taskList = await ecsClient.send(new client_ecs_1.ListTasksCommand({
            cluster: clusterName,
            serviceName: serviceName,
        }));
        const taskArn = (_a = taskList.taskArns) === null || _a === void 0 ? void 0 : _a[0];
        if (!taskArn) {
            this.error(`No tasks found in ${clusterName} cluster for ${serviceName} service`);
        }
        this.log(`Calling ecs execute-command for
  cluster: ${color_1.color.green(clusterName)}
  service: ${color_1.color.green(serviceName)}
  region: ${color_1.color.green(awsRegion)}
  taskArn: ${color_1.color.green(taskArn)}
  container: ${color_1.color.green('backend')}
    `);
        await (0, runCommand_1.runCommand)('aws', [
            'ecs',
            'execute-command',
            '--cluster',
            clusterName,
            '--region',
            awsRegion,
            '--task',
            taskArn,
            '--container',
            'backend',
            '--command',
            '/bin/bash',
            '--interactive',
        ]);
    }
}
RemoteShell.description = 'Use aws execute-command to start a /bin/bash session inside a running backend task in ' +
    'ECS cluster';
RemoteShell.examples = [`<%= config.bin %> <%= command.id %>`];
RemoteShell.flags = {};
RemoteShell.args = {};
exports.default = RemoteShell;
//# sourceMappingURL=remote-shell.js.map