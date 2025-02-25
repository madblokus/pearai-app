import { BaseCommand } from '../baseCommand';
export default class Up extends BaseCommand<typeof Up> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
