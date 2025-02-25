import { BaseCommand } from '../../baseCommand';
export default class EmailsSecrets extends BaseCommand<typeof EmailsSecrets> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
