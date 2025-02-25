import { BaseCommand } from '../../baseCommand';
export default class BackendBlack extends BaseCommand<typeof BackendBlack> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
