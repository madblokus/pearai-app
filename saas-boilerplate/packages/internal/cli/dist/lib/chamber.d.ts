import { Command } from '@oclif/core';
export declare const isChamberInstalled: () => Promise<string | undefined>;
export declare const assertChamberInstalled: () => Promise<void>;
type LoadChamberEnvOptions = {
    serviceName: string;
};
export declare function loadChamberEnv(context: Command, { serviceName }: LoadChamberEnvOptions): Promise<void>;
export {};
