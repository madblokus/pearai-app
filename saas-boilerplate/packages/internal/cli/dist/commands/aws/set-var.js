"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const init_1 = require("../../config/init");
const baseCommand_1 = require("../../baseCommand");
const chamber_1 = require("../../lib/chamber");
const runCommand_1 = require("../../lib/runCommand");
class SetVar extends baseCommand_1.BaseCommand {
    async run() {
        const { args } = await this.parse(SetVar);
        const { envStage } = await (0, init_1.initConfig)(this, {
            requireAws: true,
        });
        await (0, chamber_1.assertChamberInstalled)();
        await (0, runCommand_1.runCommand)('chamber', ['write', envStage, args.name, args.value]);
    }
}
SetVar.description = 'Set a variable inside an env stage. It will be set as environmental variable for every ' +
    'command you run when a non-local env stage is selected. \n' +
    'Requires `chamber` executable installed on your machine';
SetVar.examples = [
    `$ <%= config.bin %> <%= command.id %> SB_HOSTED_ZONE_ID XYZ`,
    `$ <%= config.bin %> <%= command.id %> SB_HOSTED_ZONE_NAME example.com`,
    `$ <%= config.bin %> <%= command.id %> SB_DOMAIN_ADMIN_PANEL admin.qa.example.com`,
    `$ <%= config.bin %> <%= command.id %> SB_DOMAIN_API api.qa.example.com`,
    `$ <%= config.bin %> <%= command.id %> SB_DOMAIN_CDN cdn.qa.example.com`,
    `$ <%= config.bin %> <%= command.id %> SB_DOMAIN_DOCS docs.qa.example.com`,
    `$ <%= config.bin %> <%= command.id %> SB_DOMAIN_WEB_APP app.qa.example.com`,
];
SetVar.args = {
    name: core_1.Args.string({
        description: 'Env variable name',
        required: true,
    }),
    value: core_1.Args.string({
        description: 'Env variable value',
        required: true,
    }),
};
exports.default = SetVar;
//# sourceMappingURL=set-var.js.map