import { Command, Interfaces } from '@oclif/core';
import { Span, Tracer } from '@opentelemetry/api';
export type Flags<T extends typeof Command> = Interfaces.InferredFlags<(typeof BaseCommand)['baseFlags'] & T['flags']>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>;
export declare abstract class BaseCommand<T extends typeof Command> extends Command {
    protected tracer: Tracer | null;
    protected span: Span | null;
    static baseFlags: {};
    protected flags: Flags<T>;
    protected args: Args<T>;
    init(): Promise<void>;
    _run(): Promise<any>;
    protected catch(err: Error & {
        exitCode?: number;
    }): Promise<any>;
    protected finally(_: Error | undefined): Promise<any>;
    protected printTelemetryInfo(): void;
}
