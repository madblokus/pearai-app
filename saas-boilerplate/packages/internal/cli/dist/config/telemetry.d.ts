import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
export declare const isEnabled: boolean;
export declare const traceExporter: OTLPTraceExporter;
export declare const provider: NodeTracerProvider;
