"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../config/init");
const baseCommand_1 = require("../../baseCommand");
class GetEnv extends baseCommand_1.BaseCommand {
    async run() {
        const { envStage } = await (0, init_1.initConfig)(this, {});
        this.log(envStage);
    }
}
GetEnv.description = 'Get currently selected ENV stage';
GetEnv.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = GetEnv;
//# sourceMappingURL=get-env.js.map