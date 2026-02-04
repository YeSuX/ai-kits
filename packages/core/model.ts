import { MODELS } from "./model.constant";
import type { Model, ModelId, Provider } from "./types";

const modelRegistry = new Map<Provider, Map<ModelId, Model>>();

for (const [provider, models] of Object.entries(MODELS)) {
    const providerModels = new Map<ModelId, Model>();
    for (const [id, model] of Object.entries(models)) {
        providerModels.set(id as ModelId, model as Model);
    }
    modelRegistry.set(provider as Provider, providerModels as Map<ModelId, Model>);
}

export function getModel(provider: Provider, modelId: ModelId): Model {
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