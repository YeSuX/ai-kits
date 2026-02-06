import { MODELS } from "./model.constant";
import type { Model, ModelId, Provider } from "./types";

/**
 * 模型注册表
 * 双层 Map 结构：Provider -> ModelId -> Model
 * 支持快速查找特定提供商的特定模型
 */
const modelRegistry = new Map<Provider, Map<ModelId, Model>>();

/**
 * 初始化模型注册表
 * 将 MODELS 常量中的模型配置加载到注册表中
 */
function initializeModelRegistry(): void {
    for (const [provider, models] of Object.entries(MODELS)) {
        const providerModels = new Map<ModelId, Model>();
        for (const [id, model] of Object.entries(models)) {
            providerModels.set(id as ModelId, model as Model);
        }
        modelRegistry.set(provider as Provider, providerModels as Map<ModelId, Model>);
    }
}

// 模块加载时初始化注册表
initializeModelRegistry();

/**
 * 获取指定提供商的指定模型配置
 * 
 * @param provider - 服务提供商标识
 * @param modelId - 模型 ID
 * @returns 模型配置对象
 * 
 * @throws 当提供商不存在时抛出错误
 * @throws 当模型不存在时抛出错误
 * 
 * @example
 * ```ts
 * const model = getModel('kimi', 'kimi-k2.5');
 * console.log(model.name); // "Kimi K2.5"
 * console.log(model.maxTokens); // 32768
 * ```
 */
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

/**
 * 获取指定提供商的所有可用模型
 * 
 * @param provider - 服务提供商标识
 * @returns 模型配置数组，如果提供商不存在则返回空数组
 * 
 * @example
 * ```ts
 * const kimiModels = getAllModels('kimi');
 * console.log(kimiModels.length); // 1
 * ```
 */
export function getAllModels(provider: Provider): Model[] {
    const providerModels = modelRegistry.get(provider);
    if (!providerModels) {
        return [];
    }
    return Array.from(providerModels.values());
}

/**
 * 检查指定的模型是否存在
 * 
 * @param provider - 服务提供商标识
 * @param modelId - 模型 ID
 * @returns 模型是否存在
 * 
 * @example
 * ```ts
 * if (hasModel('kimi', 'kimi-k2.5')) {
 *   const model = getModel('kimi', 'kimi-k2.5');
 * }
 * ```
 */
export function hasModel(provider: Provider, modelId: ModelId): boolean {
    const providerModels = modelRegistry.get(provider);
    if (!providerModels) {
        return false;
    }
    return providerModels.has(modelId);
}