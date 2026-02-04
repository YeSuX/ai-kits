import { registerApiProvider } from "../api-registry";

export function registerBuiltInApiProviders(): void {
    console.log('registerBuiltInApiProviders');
    registerApiProvider({
        api: "kimi-messages",
        stream: streamKimi,
        streamSimple: streamSimpleKimi,
    });
}

registerBuiltInApiProviders();