"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertAwsVaultInstalled = exports.isAwsVaultInstalled = void 0;
const core_1 = require("@oclif/core");
const lookpath_1 = require("lookpath");
const { CLIError } = core_1.Errors;
const isAwsVaultInstalled = async () => {
    return await (0, lookpath_1.lookpath)('aws-vault');
};
exports.isAwsVaultInstalled = isAwsVaultInstalled;
const assertAwsVaultInstalled = async () => {
    const isInstalled = await (0, exports.isAwsVaultInstalled)();
    if (!isInstalled) {
        throw new CLIError(`aws-vault executable not found. Make sure it is installed in the system and re-run the
    command. Go to https://github.com/99designs/aws-vault and learn how to install and configure it.`);
    }
};
exports.assertAwsVaultInstalled = assertAwsVaultInstalled;
//# sourceMappingURL=awsVault.js.map