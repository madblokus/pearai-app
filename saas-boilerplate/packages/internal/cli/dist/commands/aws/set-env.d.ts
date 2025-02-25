import { BaseCommand } from '../../baseCommand';
export default class SetEnv extends BaseCommand<typeof SetEnv> {
    static description: string;
    static examples: string[];
    static args: {
        envStage: import("@oclif/core/lib/interfaces").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
