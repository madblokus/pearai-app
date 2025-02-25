"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provider = exports.traceExporter = exports.isEnabled = void 0;
const os = require("node:os");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const resources_1 = require("@opentelemetry/resources");
const sdk_trace_node_1 = require("@opentelemetry/sdk-trace-node");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const exporter_trace_otlp_proto_1 = require("@opentelemetry/exporter-trace-otlp-proto");
const env_1 = require("./env");
exports.isEnabled = !env_1.SB_TELEMETRY_DISABLED;
exports.traceExporter = new exporter_trace_otlp_proto_1.OTLPTraceExporter({
    url: env_1.SB_TELEMETRY_URL,
    headers: {
        'x-honeycomb-team': env_1.SB_TELEMETRY_KEY,
    },
});
exports.provider = new sdk_trace_node_1.NodeTracerProvider({
    resource: resources_1.Resource.default().merge(new resources_1.Resource({
        [semantic_conventions_1.SemanticResourceAttributes.SERVICE_NAME]: 'saas-cli',
        [semantic_conventions_1.SemanticResourceAttributes.OS_TYPE]: os.type(),
        [semantic_conventions_1.SemanticResourceAttributes.OS_DESCRIPTION]: os.release(),
        [semantic_conventions_1.SemanticResourceAttributes.OS_VERSION]: os.version(),
    })),
});
exports.provider.addSpanProcessor(new sdk_trace_base_1.SimpleSpanProcessor(exports.traceExporter));
//# sourceMappingURL=telemetry.js.map