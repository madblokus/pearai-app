import { BaseCommand } from '../../baseCommand';
export default class BackendTest extends BaseCommand<typeof BackendTest> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
