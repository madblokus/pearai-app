import { BaseCommand } from '../../baseCommand';
export default class WebappStorybook extends BaseCommand<typeof WebappStorybook> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
