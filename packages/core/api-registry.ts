import type { Api, ApiProvider, ApiProviderInternal, Context, Model, RegisteredApiProvider } from "./types";

const apiProviderRegistry = new Map<string, RegisteredApiProvider>();

export function getApiProvider(api: Api): ApiProviderInternal | undefined {
    return apiProviderRegistry.get(api)?.provider;
}

export function registerApiProvider(
    provider: ApiProvider,
    sourceId?: string,
): void {
    apiProviderRegistry.set(provider.api, {
        provider: {
            api: provider.api,
            stream: wrapStream(provider.api, provider.stream),
            streamSimple: wrapStreamSimple(provider.api, provider.streamSimple),
        },
        sourceId,
    });
}

function wrapStream<TApi extends Api, TOptions extends unknown>(
    api: TApi,
    stream: any,
): unknown {
    return (model: Model, context: Context, options: TOptions) => {
        if (model.api !== api) {
            throw new Error(`Mismatched api: ${model.api} expected ${api}`);
        }
        return stream(model, context, options);
    };
}

function wrapStreamSimple<TApi extends Api>(
    api: TApi,
    streamSimple: any,
): unknown {
    return (model: Model, context: Context, options: unknown) => {
        if (model.api !== api) {
            throw new Error(`Mismatched api: ${model.api} expected ${api}`);
        }
        return streamSimple(model, context, options);
    };
}