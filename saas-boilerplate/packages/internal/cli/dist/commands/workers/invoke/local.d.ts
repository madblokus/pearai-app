import { BaseCommand } from '../../../baseCommand';
export default class WorkersInvokeLocal extends BaseCommand<typeof WorkersInvokeLocal> {
    static description: string;
    static examples: string[];
    static flags: {
        function: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        data: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
