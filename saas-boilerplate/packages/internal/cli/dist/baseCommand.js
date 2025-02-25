"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCommand = void 0;
const core_1 = require("@oclif/core");
const errors_1 = require("@oclif/core/lib/errors");
const api_1 = require("@opentelemetry/api");
const telemetry = require("./config/telemetry");
const formatAttrs = (obj = {}, prefix = '') => {
    return Object.fromEntries(Object.keys(obj).map((key) => {
        return [[prefix, key].join('.'), obj[key]];
    }));
};
class BaseCommand extends core_1.Command {
    constructor() {
        super(...arguments);
        this.tracer = null;
        this.span = null;
    }
    async init() {
        await super.init();
        const { args, flags } = await this.parse({
            flags: this.ctor.flags,
            baseFlags: super.ctor.baseFlags,
            args: this.ctor.args,
            strict: this.ctor.strict,
        });
        this.flags = flags;
        this.args = args;
        if (telemetry.isEnabled) {
            this.printTelemetryInfo();
            this.tracer = api_1.trace.getTracer('command', this.config.version);
        }
    }
    async _run() {
        let err;
        let result;
        try {
            // remove redirected env var to allow subsessions to run autoupdated client
            // @ts-ignore
            this.removeEnvVar('REDIRECTED');
            await this.init();
            if (telemetry.isEnabled && this.tracer) {
                result = await this.tracer.startActiveSpan(`command.${this.ctor.id}`, {
                    attributes: {
                        ...formatAttrs(this.flags, 'flags'),
                    },
                }, async (span) => {
                    this.span = span;
                    return await this.run();
                });
            }
            else {
                result = await this.run();
            }
        }
        catch (error) {
            err = error;
            await this.catch(error);
        }
        finally {
            await this.finally(err);
        }
        if (result && this.jsonEnabled())
            this.logJson(this.toSuccessJson(result));
        return result;
    }
    async catch(err) {
        var _a, _b, _c;
        if (telemetry.isEnabled) {
            if (!(err instanceof errors_1.ExitError) || err.oclif.exit !== 0) {
                (_a = this.span) === null || _a === void 0 ? void 0 : _a.addEvent('Command error');
                (_b = this.span) === null || _b === void 0 ? void 0 : _b.recordException(err);
                (_c = this.span) === null || _c === void 0 ? void 0 : _c.setStatus({ code: api_1.SpanStatusCode.ERROR });
            }
        }
        return super.catch(err);
    }
    async finally(_) {
        var _a, _b;
        if (telemetry.isEnabled) {
            (_a = this.span) === null || _a === void 0 ? void 0 : _a.addEvent('Command finished');
            (_b = this.span) === null || _b === void 0 ? void 0 : _b.end();
            // Need to wait en event loop for the internal promise in exporter to be visible
            await new Promise((resolve) => setTimeout(() => resolve(true)));
            // wait for the exporter to send data
            await telemetry.traceExporter.forceFlush();
        }
        return super.finally(_);
    }
    printTelemetryInfo() {
        this.log(`\x1b[2m
------ Notice ------
This CLI collects various anonymous events, warnings, and errors to improve the CLI tool and enhance your user experience.
Read more: https://docs.demo.saas.apptoku.com/working-with-sb/dev-tools/telemetry
If you want to opt out of telemetry, you can set the environment variable SB_TELEMETRY_DISABLED to 1 in your shell.
For example:
   export SB_TELEMETRY_DISABLED=1
    \x1b[0m`);
    }
}
exports.BaseCommand = BaseCommand;
BaseCommand.baseFlags = {};
//# sourceMappingURL=baseCommand.js.map