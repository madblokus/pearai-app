import { BaseCommand } from '../../baseCommand';
export default class BackendBuildDocs extends BaseCommand<typeof BackendBuildDocs> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
