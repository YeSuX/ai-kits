import type { Api, ApiProvider, ApiProviderInternal, Context, Model, RegisteredApiProvider } from "./types";

/**
 * API 提供商全局注册表
 * 存储所有已注册的 API 提供商实现
 */
const apiProviderRegistry = new Map<string, RegisteredApiProvider>();

/**
 * 获取指定 API 类型的提供商实现
 * 
 * @param api - API 类型标识
 * @returns API 提供商实现，如果未找到则返回 undefined
 * 
 * @example
 * ```ts
 * const provider = getApiProvider('kimi-messages');
 * if (provider) {
 *   const stream = provider.stream(model, context, options);
 * }
 * ```
 */
export function getApiProvider(api: Api): ApiProviderInternal | undefined {
    return apiProviderRegistry.get(api)?.provider;
}

/**
 * 注册 API 提供商到全局注册表
 * 
 * @param provider - API 提供商实现
 * @param sourceId - 来源标识，用于调试和追踪（可选）
 * 
 * @remarks
 * - 注册时会对 stream 和 streamSimple 函数进行包装，添加 API 类型校验
 * - 如果同一 API 类型被多次注册，后注册的会覆盖先注册的
 * 
 * @example
 * ```ts
 * registerApiProvider({
 *   api: 'custom-api',
 *   stream: myStreamFunction,
 *   streamSimple: null
 * }, 'my-plugin');
 * ```
 */
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

/**
 * 包装流式函数，添加 API 类型校验
 * 
 * @param api - 期望的 API 类型
 * @param stream - 原始流式函数
 * @returns 包装后的流式函数
 * 
 * @throws 当模型的 API 类型与期望不匹配时抛出错误
 */
function wrapStream<TApi extends Api>(
    api: TApi,
    stream: any,
): any {
    return (model: Model, context: Context, options: any) => {
        if (model.api !== api) {
            throw new Error(`Mismatched api: ${model.api} expected ${api}`);
        }
        return stream(model, context, options);
    };
}

/**
 * 包装简化流式函数，添加 API 类型校验
 * 
 * @param api - 期望的 API 类型
 * @param streamSimple - 原始简化流式函数
 * @returns 包装后的简化流式函数
 * 
 * @throws 当模型的 API 类型与期望不匹配时抛出错误
 */
function wrapStreamSimple<TApi extends Api>(
    api: TApi,
    streamSimple: any,
): any {
    if (streamSimple === null) {
        return null;
    }
    return (model: Model, context: Context, options: unknown) => {
        if (model.api !== api) {
            throw new Error(`Mismatched api: ${model.api} expected ${api}`);
        }
        return streamSimple(model, context, options);
    };
}