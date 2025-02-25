"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnvStage = exports.loadEnvStage = exports.getConfigStorage = exports.getEnvStageKey = void 0;
const storage = require("node-persist");
const childProcess = require("child_process");
const util_1 = require("util");
const path_1 = require("path");
const env_1 = require("./env");
let isStorageInitialized = false;
const exec = (0, util_1.promisify)(childProcess.exec);
const getEnvStageKey = () => 'envStage';
exports.getEnvStageKey = getEnvStageKey;
const getConfigStorage = async () => {
    if (!isStorageInitialized) {
        const { stdout } = await exec('pnpm root -w');
        const dir = (0, path_1.resolve)(stdout, '..', '.saas-boilerplate');
        await storage.init({ encoding: 'utf-8', dir });
        isStorageInitialized = false;
    }
    return storage;
};
exports.getConfigStorage = getConfigStorage;
const loadEnvStage = async () => {
    var _a, _b;
    const storage = await (0, exports.getConfigStorage)();
    const value = (_b = (_a = (await storage.getItem((0, exports.getEnvStageKey)()))) !== null && _a !== void 0 ? _a : process.env.ENV_STAGE) !== null && _b !== void 0 ? _b : env_1.ENV_STAGE_LOCAL;
    process.env.ENV_STAGE = value;
    return value;
};
exports.loadEnvStage = loadEnvStage;
const setEnvStage = async (value) => {
    const storage = await (0, exports.getConfigStorage)();
    await storage.setItem((0, exports.getEnvStageKey)(), value);
};
exports.setEnvStage = setEnvStage;
//# sourceMappingURL=storage.js.map