import { BaseCommand } from '../../baseCommand';
export default class WorkersBuild extends BaseCommand<typeof WorkersBuild> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
