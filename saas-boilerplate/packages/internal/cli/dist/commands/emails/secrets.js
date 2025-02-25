"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseCommand_1 = require("../../baseCommand");
class EmailsSecrets extends baseCommand_1.BaseCommand {
    async run() {
        this.error('Emails package do not have their own separate secrets service. Use `saas workers secrets` instead.');
    }
}
EmailsSecrets.description = 'Runs an ssm-editor helper tool in docker container to set runtime environmental variables of webapp service. ' +
    'Underneath it uses chamber to both fetch and set those variables in AWS SSM Parameter Store';
EmailsSecrets.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = EmailsSecrets;
//# sourceMappingURL=secrets.js.map