"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const init_1 = require("../../../config/init");
const runCommand_1 = require("../../../lib/runCommand");
const docker_1 = require("../../../lib/docker");
const baseCommand_1 = require("../../../baseCommand");
class WorkersInvokeLocal extends baseCommand_1.BaseCommand {
    async run() {
        const { flags } = await this.parse(WorkersInvokeLocal);
        const { rootPath } = await (0, init_1.initConfig)(this, {
            requireLocalEnvStage: true,
        });
        await (0, docker_1.assertDockerIsRunning)();
        await (0, docker_1.dockerHubLogin)();
        await (0, runCommand_1.runCommand)('docker', [
            'compose',
            'run',
            '--rm',
            '-T',
            'workers',
            `pnpm sls invoke local -f=${flags.function} ${flags.data ? `d=${flags.data}` : ''}`,
        ], {
            cwd: rootPath,
        });
    }
}
WorkersInvokeLocal.description = 'Invoke an async worker task';
WorkersInvokeLocal.examples = [`$ <%= config.bin %> <%= command.id %>`];
WorkersInvokeLocal.flags = {
    function: core_1.Flags.boolean({
        char: 'f',
        default: false,
        description: 'The name of the function in your service that you want to invoke locally',
        required: true,
    }),
    data: core_1.Flags.boolean({
        char: 'd',
        default: false,
        description: 'String containing data to be passed as an event to your function.',
        required: false,
    }),
};
exports.default = WorkersInvokeLocal;
//# sourceMappingURL=local.js.map