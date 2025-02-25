"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSecretsEditor = void 0;
const runCommand_1 = require("./runCommand");
const runSecretsEditor = async ({ serviceName, rootPath, }) => {
    await (0, runCommand_1.runCommand)('pnpm', ['nx', 'run', 'ssm-editor:compose-build-image']);
    await (0, runCommand_1.runCommand)('docker', ['compose', 'run', '--rm', 'ssm-editor', serviceName], {
        cwd: rootPath,
    });
};
exports.runSecretsEditor = runSecretsEditor;
//# sourceMappingURL=secretsEditor.js.map