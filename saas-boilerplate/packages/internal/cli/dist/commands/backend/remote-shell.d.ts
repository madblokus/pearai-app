import { BaseCommand } from '../../baseCommand';
export default class RemoteShell extends BaseCommand<typeof RemoteShell> {
    static description: string;
    static examples: string[];
    static flags: {};
    static args: {};
    run(): Promise<void>;
}
