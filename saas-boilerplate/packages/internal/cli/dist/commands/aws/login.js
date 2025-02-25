"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../config/init");
const runCommand_1 = require("../../lib/runCommand");
const awsVault_1 = require("../../lib/awsVault");
const baseCommand_1 = require("../../baseCommand");
class AwsLogin extends baseCommand_1.BaseCommand {
    async run() {
        await (0, init_1.initConfig)(this, { requireAws: true });
        await (0, awsVault_1.assertAwsVaultInstalled)();
        await (0, runCommand_1.runCommand)('aws-vault', ['login']);
    }
}
AwsLogin.description = 'Use aws-vault to log into AWS Web Console';
AwsLogin.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = AwsLogin;
//# sourceMappingURL=login.js.map