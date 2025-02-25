import { BaseCommand } from '../../baseCommand';
export default class CiGetArtifactsBucket extends BaseCommand<typeof CiGetArtifactsBucket> {
    static description: string;
    static examples: string[];
    static flags: {};
    run(): Promise<void>;
}
