/// <reference types="node" />
import { SpawnOptionsWithoutStdio } from 'node:child_process';
type RunCommandOptions = SpawnOptionsWithoutStdio & {
    silent?: boolean;
};
export declare function runCommand(command: string, args: string[], options?: RunCommandOptions): Promise<void>;
export {};
