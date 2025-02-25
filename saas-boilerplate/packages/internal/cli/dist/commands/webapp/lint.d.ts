import { BaseCommand } from '../../baseCommand';
export default class WebappLint extends BaseCommand<typeof WebappLint> {
    static description: string;
    static examples: string[];
    static flags: {
        includeLibs: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
