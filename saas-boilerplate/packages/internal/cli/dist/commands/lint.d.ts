import { BaseCommand } from '../baseCommand';
export default class Lint extends BaseCommand<typeof Lint> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
