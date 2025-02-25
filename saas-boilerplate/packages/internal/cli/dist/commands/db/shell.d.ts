import { BaseCommand } from '../../baseCommand';
export default class DbShell extends BaseCommand<typeof DbShell> {
    static description: string;
    static examples: string[];
    static flags: {};
    static args: {};
    run(): Promise<void>;
}
