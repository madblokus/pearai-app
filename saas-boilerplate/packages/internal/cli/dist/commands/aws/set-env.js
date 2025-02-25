"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const storage_1 = require("../../config/storage");
const init_1 = require("../../config/init");
const baseCommand_1 = require("../../baseCommand");
class SetEnv extends baseCommand_1.BaseCommand {
    async run() {
        const { args } = await this.parse(SetEnv);
        const { envStage: currentEnvStage } = await (0, init_1.initConfig)(this, {});
        if (currentEnvStage === args.envStage) {
            this.log(`Your environment stage is already set to ${args.envStage}.`);
            return;
        }
        await (0, storage_1.setEnvStage)(args.envStage);
        this.log(`Switched environment stage to ${args.envStage}.`);
    }
}
SetEnv.description = 'Select ENV stage';
SetEnv.examples = [
    `$ <%= config.bin %> <%= command.id %> local`,
    `$ <%= config.bin %> <%= command.id %> qa`,
    `$ <%= config.bin %> <%= command.id %> staging`,
    `$ <%= config.bin %> <%= command.id %> production`,
];
SetEnv.args = {
    envStage: core_1.Args.string({
        description: 'Env stage to select',
        required: true,
    }),
};
exports.default = SetEnv;
//# sourceMappingURL=set-env.js.map