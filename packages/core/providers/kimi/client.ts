import OpenAI from "openai";
import type { Model } from "../../types";
import { mergeHeaders } from "./utils";

/**
 * 客户端创建结果
 */
export interface ClientResult {
  /** OpenAI 客户端实例 */
  client: OpenAI;
  /** 是否使用 OAuth Token 认证 */
  isOAuthToken: boolean;
}

/**
 * 创建 OpenAI 兼容的客户端实例
 * 
 * @param model - 模型配置信息
 * @param apiKey - API 密钥
 * @param interleavedThinking - 是否启用交错思考模式
 * @param optionsHeaders - 额外的 HTTP 请求头
 * @returns 客户端实例和认证类型信息
 * 
 * @remarks
 * - 使用 OpenAI SDK 创建客户端，但配置为指向模型的 baseUrl
 * - 在浏览器环境中默认允许使用（dangerouslyAllowBrowser: true）
 * - 注意：在生产环境的浏览器端使用需要额外的安全措施
 * 
 * @example
 * ```ts
 * const { client, isOAuthToken } = createClient(
 *   model,
 *   'your-api-key',
 *   true,
 *   { 'Custom-Header': 'value' }
 * );
 * ```
 */
export function createClient(
  model: Model,
  apiKey: string,
  interleavedThinking: boolean,
  optionsHeaders?: Record<string, string>,
): ClientResult {
  // TODO: 未来可能需要支持 Beta 特性
  // const betaFeatures = ["fine-grained-tool-streaming-2025-05-14"];
  // if (interleavedThinking) {
  //   betaFeatures.push("interleaved-thinking-2025-05-14");
  // }

  // TODO: 根据实际情况判断是否需要 OAuth 认证
  // 当前默认使用 API Key 认证
  const isOAuthToken = false;

  // 合并默认请求头和用户自定义请求头
  const defaultHeaders = mergeHeaders(
    {
      accept: "application/json",
    },
    optionsHeaders,
  );

  // 创建 OpenAI 客户端实例
  const client = new OpenAI({
    apiKey,
    baseURL: model.baseUrl,
    defaultHeaders,
    // 默认关闭 Web 浏览器支持，以避免泄露 API 密钥
    // 若需在浏览器端使用，请显式设置 dangerouslyAllowBrowser 为 true
    // 注意：在浏览器端暴露密钥有被窃取等安全风险
    // 仅在受信任的内部环境、权限受控或用于开发调试时才建议开启
    // React Native 当前不支持此选项
    dangerouslyAllowBrowser: true,
  });

  return { client, isOAuthToken };
}
