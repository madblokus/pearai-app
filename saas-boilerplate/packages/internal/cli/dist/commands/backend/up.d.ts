import { BaseCommand } from '../../baseCommand';
export default class BackendUp extends BaseCommand<typeof BackendUp> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
