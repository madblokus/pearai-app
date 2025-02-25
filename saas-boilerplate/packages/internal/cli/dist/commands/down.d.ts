import { BaseCommand } from '../baseCommand';
export default class Down extends BaseCommand<typeof Down> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
