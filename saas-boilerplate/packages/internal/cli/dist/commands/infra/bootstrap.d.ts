import { BaseCommand } from '../../baseCommand';
export default class InfraBootstrap extends BaseCommand<typeof InfraBootstrap> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
