import { BaseCommand } from '../../baseCommand';
export default class BackendMigrate extends BaseCommand<typeof BackendMigrate> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
