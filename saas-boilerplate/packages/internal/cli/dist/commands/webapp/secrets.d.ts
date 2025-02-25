import { BaseCommand } from '../../baseCommand';
export default class WebappSecrets extends BaseCommand<typeof WebappSecrets> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
