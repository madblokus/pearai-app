import { BaseCommand } from '../../baseCommand';
export default class BackendBuild extends BaseCommand<typeof BackendBuild> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
