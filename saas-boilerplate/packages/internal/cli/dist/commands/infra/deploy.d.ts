import { BaseCommand } from '../../baseCommand';
export default class InfraDeploy extends BaseCommand<typeof InfraDeploy> {
    static description: string;
    static examples: string[];
    static flags: {
        diff: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: {
        stackName: import("@oclif/core/lib/interfaces").Arg<string | undefined, Record<string, unknown>>;
    };
    run(): Promise<void>;
}
