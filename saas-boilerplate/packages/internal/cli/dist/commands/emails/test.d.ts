import { BaseCommand } from '../../baseCommand';
export default class EmailsTest extends BaseCommand<typeof EmailsTest> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
