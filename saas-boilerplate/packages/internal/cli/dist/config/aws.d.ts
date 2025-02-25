import { Command } from '@oclif/core';
type LoadAWSCredentialsOptions = {
    envStage: string;
    validateEnvStageVariables: boolean;
    skipERCLogin?: boolean;
};
type LoginToECROptions = {
    awsAccountId: string;
    awsRegion: string;
};
export declare const loginToECR: (context: Command, { awsRegion, awsAccountId }: LoginToECROptions) => Promise<null | undefined>;
export declare const initAWS: (context: Command, options: LoadAWSCredentialsOptions) => Promise<{
    awsAccountId: string | undefined;
    awsRegion: string | undefined;
}>;
export {};
