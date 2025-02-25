"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telemetry_1 = require("../../config/telemetry");
const hook = async function () {
    telemetry_1.provider.register();
};
exports.default = hook;
//# sourceMappingURL=instrumentation.js.map