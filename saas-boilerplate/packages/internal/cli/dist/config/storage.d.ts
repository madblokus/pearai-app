import * as storage from 'node-persist';
export declare const getEnvStageKey: () => string;
export declare const getConfigStorage: () => Promise<typeof storage>;
export declare const loadEnvStage: () => Promise<string>;
export declare const setEnvStage: (value: string) => Promise<void>;
