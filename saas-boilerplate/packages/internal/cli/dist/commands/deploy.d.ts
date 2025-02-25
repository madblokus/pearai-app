import { BaseCommand } from '../baseCommand';
export default class Deploy extends BaseCommand<typeof Deploy> {
    static description: string;
    static examples: string[];
    static flags: {
        diff: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    run(): Promise<void>;
}
