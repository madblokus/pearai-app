import { BaseCommand } from '../../../baseCommand';
export default class BackendDeployApi extends BaseCommand<typeof BackendDeployApi> {
    static description: string;
    static examples: string[];
    static flags: {
        diff: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
