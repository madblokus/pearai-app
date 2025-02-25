import { BaseCommand } from '../../baseCommand';
export default class BackendSecrets extends BaseCommand<typeof BackendSecrets> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
