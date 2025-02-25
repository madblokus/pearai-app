import { BaseCommand } from '../baseCommand';
export default class Test extends BaseCommand<typeof Test> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
