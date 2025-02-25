import { BaseCommand } from '../../../baseCommand';
export default class WebappGraphqlDownloadSchema extends BaseCommand<typeof WebappGraphqlDownloadSchema> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
