import { BaseCommand } from '../../baseCommand';
export default class BackendMakemigrations extends BaseCommand<typeof BackendMakemigrations> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
