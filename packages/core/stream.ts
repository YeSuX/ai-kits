import { getApiProvider } from "./api-registry";
import type { Api, Context, Model } from "./types";

export async function complete(
    model: Model,
    context: Context,
    options?: unknown,
) {
    const s = stream(model, context, options);
    return s.result();
}

export function stream(
    model: Model,
    context: Context,
    options?: unknown,
) {
    const provider = resolveApiProvider(model.api);
    return provider.stream(model, context, options);
}

function resolveApiProvider(api: Api) {
    const provider = getApiProvider(api);
    if (!provider) {
        throw new Error(`No API provider registered for api: ${api}`);
    }
    return provider;
}