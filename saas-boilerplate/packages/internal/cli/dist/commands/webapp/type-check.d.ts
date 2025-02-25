import { BaseCommand } from '../../baseCommand';
export default class WebappTypeCheck extends BaseCommand<typeof WebappTypeCheck> {
    static description: string;
    static examples: string[];
    static flags: {
        includeLibs: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
