"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const init_1 = require("../../../config/init");
const runCommand_1 = require("../../../lib/runCommand");
const baseCommand_1 = require("../../../baseCommand");
class WebappGraphqlDownloadSchema extends baseCommand_1.BaseCommand {
    async run() {
        await (0, init_1.initConfig)(this, {});
        await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'webapp:graphql:download-schema']);
    }
}
WebappGraphqlDownloadSchema.description = 'Download graphql schemas and merge them';
WebappGraphqlDownloadSchema.examples = [`$ <%= config.bin %> <%= command.id %>`];
exports.default = WebappGraphqlDownloadSchema;
//# sourceMappingURL=download-schema.js.map