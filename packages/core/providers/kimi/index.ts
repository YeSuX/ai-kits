import { getEnvApiKey } from "../../env-api-keys";
import type { Context, Model, StreamResponse, CompletionResult, MessageContent } from "../../types";
import { createClient } from "./client";
import { buildParams, type BuildParamsOptions } from "./params-builder";

/**
 * Kimi 流式请求选项
 */
export interface KimiStreamOptions extends BuildParamsOptions {
  /** API 密钥，未提供时从环境变量读取 */
  apiKey?: string;
  /** 是否启用交错思考模式 */
  interleavedThinking?: boolean;
  /** 自定义 HTTP 请求头 */
  headers?: Record<string, string>;
  /** 请求中止信号 */
  signal?: AbortSignal;
  /** 请求参数回调，用于调试或日志记录 */
  onPayload?: (payload: any) => void;
}

/**
 * 创建 Kimi 模型的流式响应
 * 
 * @param model - 模型配置
 * @param context - 对话上下文
 * @param options - 流式请求选项
 * @returns 流式响应对象
 * 
 * @remarks
 * 此函数使用 OpenAI SDK 与 Kimi API 进行交互
 * 返回的对象包含 result() 方法，调用后会等待流完成并返回最终结果
 * 
 * @example
 * ```ts
 * const stream = streamKimi(model, context, {
 *   temperature: 0.7,
 *   maxTokens: 2000
 * });
 * 
 * const result = await stream.result();
 * console.log(result.content);
 * ```
 */
export function streamKimi(
  model: Model,
  context: Context,
  options?: KimiStreamOptions,
): StreamResponse {
  // 获取 API 密钥：优先使用选项中的密钥，否则从环境变量读取
  const apiKey = options?.apiKey ?? getEnvApiKey(model.provider) ?? "";

  // 创建 OpenAI 客户端实例
  const { client, isOAuthToken } = createClient(
    model,
    apiKey,
    options?.interleavedThinking ?? true,
    options?.headers,
  );

  // 构建请求参数
  const params = buildParams(model, context, isOAuthToken, options);

  // 调试回调：记录实际发送的请求参数
  options?.onPayload?.(params);

  // 创建流式响应
  const kimiStream = client.chat.completions.stream(
    { ...params, stream: true },
    { signal: options?.signal }
  );

  // 返回符合 StreamResponse 接口的对象
  return {
    async result(): Promise<CompletionResult> {
      try {
        // 必须先完全消费流，才能获取最终的 usage 信息
        const completion = await kimiStream.finalChatCompletion();

        console.log('---sx.completion---', completion.choices[0]?.usage);

        // 提取 usage 信息
        const usage = completion.choices[0]?.usage || {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        };

        // 构造响应内容
        const content: MessageContent[] = [];
        if (completion.choices[0]?.message?.content) {
          content.push({
            type: 'text',
            text: completion.choices[0].message.content
          });
        }

        // 计算费用
        const inputCost = (usage.prompt_tokens || 0) * (model.cost.input || 0);
        const outputCost = (usage.completion_tokens || 0) * (model.cost.output || 0);

        // 构造完整响应结果
        return {
          role: "assistant",
          content,
          api: model.api,
          provider: model.provider,
          model: model.id,
          usage: {
            input: usage.prompt_tokens || 0,
            output: usage.completion_tokens || 0,
            cacheRead: 0,
            cacheWrite: 0,
            totalTokens: usage.total_tokens || 0,
            cost: {
              input: inputCost,
              output: outputCost,
              cacheRead: 0,
              cacheWrite: 0,
              total: inputCost + outputCost
            },
          },
          stopReason: (completion.choices[0]?.finish_reason as any) || "stop",
          timestamp: Date.now(),
        };
      } catch (error) {
        console.error('---sx.error---', error);
        throw error;
      }
    }
  };
}
