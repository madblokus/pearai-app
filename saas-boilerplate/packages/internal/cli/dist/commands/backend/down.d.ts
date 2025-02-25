import { BaseCommand } from '../../baseCommand';
export default class BackendDown extends BaseCommand<typeof BackendDown> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
