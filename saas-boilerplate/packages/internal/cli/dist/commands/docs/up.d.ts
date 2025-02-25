import { BaseCommand } from '../../baseCommand';
export default class DocsUp extends BaseCommand<typeof DocsUp> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
