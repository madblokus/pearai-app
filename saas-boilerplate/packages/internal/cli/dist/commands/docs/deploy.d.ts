import { BaseCommand } from '../../baseCommand';
export default class DocsDeploy extends BaseCommand<typeof DocsDeploy> {
    static description: string;
    static examples: string[];
    static flags: {
        diff: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
