import type { Api, RegisteredApiProvider } from "./types";

const apiProviderRegistry = new Map<string, RegisteredApiProvider>();

export function getApiProvider(api: Api): unknown | undefined {
    return apiProviderRegistry.get(api)?.provider;
}