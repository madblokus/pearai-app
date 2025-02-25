import { Command } from '@oclif/core';
type InitConfigOptions = {
    requireAws?: boolean | 'allow-local';
    validateEnvStageVariables?: boolean;
    requireLocalEnvStage?: boolean;
    skipERCLogin?: boolean;
};
export declare const initConfig: (context: Command, { requireAws, validateEnvStageVariables, requireLocalEnvStage, skipERCLogin, }: InitConfigOptions) => Promise<{
    rootPath: string;
    projectName: string;
    projectEnvName: string;
    envStage: string;
    version: string;
    awsRegion: string | undefined;
    awsAccountId: string | undefined;
}>;
export {};
