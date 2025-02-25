import { BaseCommand } from '../../baseCommand';
export default class BackendShell extends BaseCommand<typeof BackendShell> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
