import { BaseCommand } from '../../baseCommand';
export default class WebappBuild extends BaseCommand<typeof WebappBuild> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
