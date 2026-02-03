import { MODELS } from "./model.constant";
import type { Provider } from "./types";

const modelRegistry = new Map();

for (const [provider, models] of Object.entries(MODELS)) {
    const providerModels = new Map();
    for (const [id, model] of Object.entries(models)) {
        providerModels.set(id, model);
    }
    modelRegistry.set(provider, providerModels);
}

export function getModel(provider: Provider, modelId: string) {
    const providerModels = modelRegistry.get(provider);
    return providerModels?.get(modelId);
}