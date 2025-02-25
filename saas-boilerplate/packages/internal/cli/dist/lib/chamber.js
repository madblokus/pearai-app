"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadChamberEnv = exports.assertChamberInstalled = exports.isChamberInstalled = void 0;
const childProcess = require("child_process");
const util_1 = require("util");
const lookpath_1 = require("lookpath");
const core_1 = require("@oclif/core");
const dotenv = require("dotenv");
const { CLIError } = core_1.Errors;
const exec = (0, util_1.promisify)(childProcess.exec);
const isChamberInstalled = async () => {
    return await (0, lookpath_1.lookpath)('chamber');
};
exports.isChamberInstalled = isChamberInstalled;
const assertChamberInstalled = async () => {
    const isInstalled = await (0, exports.isChamberInstalled)();
    if (!isInstalled) {
        throw new CLIError(`chamber executable not found. Make sure it is installed in the system and re-run the
    command. Go to https://github.com/segmentio/chamber and learn how to install and configure it.`);
    }
};
exports.assertChamberInstalled = assertChamberInstalled;
async function loadChamberEnv(context, { serviceName }) {
    await (0, exports.assertChamberInstalled)();
    let chamberOutput;
    try {
        const { stdout } = await exec(`chamber export ${serviceName} --format dotenv`);
        chamberOutput = stdout;
    }
    catch (err) {
        context.error(`Failed to load environmental variables from SSM Parameter Store using chamber: ${err}`);
    }
    const parsed = dotenv.parse(Buffer.from(chamberOutput));
    context.log(`Loaded environmental variables from SSM Parameter Store using chamber:
  service (prefix): ${serviceName}
  count: ${Object.keys(parsed).length}\n`);
    // @ts-ignore
    dotenv.populate(process.env, parsed, { override: true });
}
exports.loadChamberEnv = loadChamberEnv;
//# sourceMappingURL=chamber.js.map