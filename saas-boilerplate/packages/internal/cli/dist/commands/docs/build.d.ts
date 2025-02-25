import { BaseCommand } from '../../baseCommand';
export default class DocsBuild extends BaseCommand<typeof DocsBuild> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
