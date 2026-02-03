import { MODELS } from "./model.constant";
import type { ModelId, Provider } from "./types";

const modelRegistry = new Map();

for (const [provider, models] of Object.entries(MODELS)) {
    const providerModels = new Map();
    for (const [id, model] of Object.entries(models)) {
        providerModels.set(id, model);
    }
    modelRegistry.set(provider, providerModels);
}

export function getModel(provider: Provider, modelId: ModelId) {
    const providerModels = modelRegistry.get(provider);
    
    if (!providerModels) {
        throw new Error(`Invalid provider: ${provider}`);
    }
    
    const model = providerModels.get(modelId);
    
    if (!model) {
        throw new Error(`Invalid model: ${modelId} for provider: ${provider}`);
    }
    
    return model;
}