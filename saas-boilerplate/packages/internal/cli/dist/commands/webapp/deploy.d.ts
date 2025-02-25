import { BaseCommand } from '../../baseCommand';
export default class WebappDeploy extends BaseCommand<typeof WebappDeploy> {
    static description: string;
    static examples: string[];
    static flags: {
        diff: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
