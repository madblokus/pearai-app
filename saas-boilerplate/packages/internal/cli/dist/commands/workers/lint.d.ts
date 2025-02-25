import { BaseCommand } from '../../baseCommand';
export default class WorkersLint extends BaseCommand<typeof WorkersLint> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
