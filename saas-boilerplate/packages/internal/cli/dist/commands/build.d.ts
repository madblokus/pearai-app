import { BaseCommand } from '../baseCommand';
export default class Build extends BaseCommand<typeof Build> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
