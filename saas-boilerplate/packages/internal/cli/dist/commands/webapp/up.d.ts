import { BaseCommand } from '../../baseCommand';
export default class WebappUp extends BaseCommand<typeof WebappUp> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
