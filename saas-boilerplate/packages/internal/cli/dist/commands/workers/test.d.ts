import { BaseCommand } from '../../baseCommand';
export default class WorkersTest extends BaseCommand<typeof WorkersTest> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
