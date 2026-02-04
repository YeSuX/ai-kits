import { registerApiProvider } from "../api-registry";
import { streamKimi } from "./kimi";

export function registerBuiltInApiProviders(): void {
    console.log('registerBuiltInApiProviders');
    registerApiProvider({
        api: "kimi-messages",
        stream: streamKimi,
        streamSimple: null,
    });
}

registerBuiltInApiProviders();