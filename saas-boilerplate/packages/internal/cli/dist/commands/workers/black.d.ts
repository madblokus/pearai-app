import { BaseCommand } from '../../baseCommand';
export default class WorkersBlack extends BaseCommand<typeof WorkersBlack> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
