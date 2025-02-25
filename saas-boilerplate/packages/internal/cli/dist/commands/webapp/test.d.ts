import { BaseCommand } from '../../baseCommand';
export default class WebappTest extends BaseCommand<typeof WebappTest> {
    static description: string;
    static examples: string[];
    static flags: {
        watchAll: import("@oclif/core/lib/interfaces").OptionFlag<string, import("@oclif/core/lib/interfaces").CustomOptions>;
        includeLibs: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
