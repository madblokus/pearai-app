import { BaseCommand } from '../../baseCommand';
export default class SetVar extends BaseCommand<typeof SetVar> {
    static description: string;
    static examples: string[];
    static args: {
        name: import("@oclif/core/lib/interfaces").Arg<string, Record<string, unknown>>;
        value: import("@oclif/core/lib/interfaces").Arg<string, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
