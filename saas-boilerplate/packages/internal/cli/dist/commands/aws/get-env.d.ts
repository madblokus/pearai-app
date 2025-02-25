import { BaseCommand } from '../../baseCommand';
export default class GetEnv extends BaseCommand<typeof GetEnv> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
