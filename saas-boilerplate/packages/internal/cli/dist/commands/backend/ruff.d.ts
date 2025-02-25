import { BaseCommand } from '../../baseCommand';
export default class BackendRuff extends BaseCommand<typeof BackendRuff> {
    static description: string;
    static examples: string[];
    run(): Promise<void>;
}
