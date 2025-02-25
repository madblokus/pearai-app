import { BaseCommand } from '../../../baseCommand';
export default class BackendStripeSync extends BaseCommand<typeof BackendStripeSync> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
