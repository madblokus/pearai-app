import { BaseCommand } from '../../baseCommand';
export default class WorkersDeploy extends BaseCommand<typeof WorkersDeploy> {
    static description: string;
    static examples: string[];
    static flags: {
        diff: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
