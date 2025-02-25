import { BaseCommand } from '../../baseCommand';
export default class EmailsBuild extends BaseCommand<typeof EmailsBuild> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
