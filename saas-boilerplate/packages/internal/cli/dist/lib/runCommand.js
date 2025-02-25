"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommand = void 0;
const node_child_process_1 = require("node:child_process");
function runCommand(command, args, options) {
    return new Promise((resolve, reject) => {
        if (!(options === null || options === void 0 ? void 0 : options.silent)) {
            console.log([command, ...args].join(' '));
        }
        const cmd = (0, node_child_process_1.spawn)(command, args, {
            shell: process.platform === 'win32',
            stdio: 'inherit',
            ...options,
        });
        cmd.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`"${command} ${args.join(' ')}" failed with code ${code}`));
            }
            else {
                resolve();
            }
        });
    });
}
exports.runCommand = runCommand;
//# sourceMappingURL=runCommand.js.map