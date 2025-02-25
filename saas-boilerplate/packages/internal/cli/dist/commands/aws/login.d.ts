import { BaseCommand } from '../../baseCommand';
export default class AwsLogin extends BaseCommand<typeof AwsLogin> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
