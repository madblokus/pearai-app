import { BaseCommand } from '../../baseCommand';
export default class WorkersShell extends BaseCommand<typeof WorkersShell> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
