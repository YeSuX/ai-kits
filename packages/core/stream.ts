import { getApiProvider } from "./api-registry";
import type { Api, Context, Model, CompletionResult, StreamResponse } from "./types";

/**
 * 执行完整的 AI 对话请求（非流式）
 * 
 * @param model - 模型配置
 * @param context - 对话上下文
 * @param options - 请求选项（如温度、最大 token 等）
 * @returns 完整的响应结果
 * 
 * @remarks
 * 此函数内部使用流式 API，但会等待流完成后返回最终结果
 * 适用于不需要实时响应的场景
 * 
 * @example
 * ```ts
 * const result = await complete(model, {
 *   systemPrompt: 'You are a helpful assistant',
 *   messages: [{ role: 'user', content: 'Hello!' }]
 * });
 * console.log(result.content[0].text);
 * ```
 */
export async function complete(
    model: Model,
    context: Context,
    options?: any,
): Promise<CompletionResult> {
    const s = stream(model, context, options);
    return s.result();
}

/**
 * 创建流式 AI 对话请求
 * 
 * @param model - 模型配置
 * @param context - 对话上下文
 * @param options - 请求选项
 * @returns 流式响应对象
 * 
 * @throws 当模型的 API 类型未注册时抛出错误
 * 
 * @remarks
 * 返回的对象包含 result() 方法，调用后会等待流完成并返回最终结果
 * 适用于需要处理流式响应的场景
 * 
 * @example
 * ```ts
 * const streamResponse = stream(model, context, {
 *   temperature: 0.7,
 *   onPayload: (params) => console.log('Request params:', params)
 * });
 * 
 * const result = await streamResponse.result();
 * ```
 */
export function stream(
    model: Model,
    context: Context,
    options?: any,
): StreamResponse {
    const provider = resolveApiProvider(model.api);
    return provider.stream(model, context, options);
}

/**
 * 解析并获取 API 提供商
 * 
 * @param api - API 类型标识
 * @returns API 提供商实现
 * 
 * @throws 当 API 类型未注册时抛出错误
 * 
 * @remarks
 * 这是一个内部辅助函数，用于从注册表中查找对应的提供商实现
 */
function resolveApiProvider(api: Api) {
    const provider = getApiProvider(api);
    if (!provider) {
        throw new Error(`No API provider registered for api: ${api}`);
    }
    return provider;
}