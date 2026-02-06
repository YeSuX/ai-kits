/**
 * AI 模型配置常量
 * 
 * @remarks
 * 此对象定义了所有支持的 AI 模型及其配置信息
 * 包括：模型 ID、名称、API 类型、基础 URL、定价、上下文窗口等
 * 
 * 配置说明：
 * - id: 模型的唯一标识符
 * - name: 模型的显示名称
 * - api: 使用的 API 协议类型
 * - provider: 服务提供商标识
 * - baseUrl: API 基础 URL
 * - reasoning: 是否支持推理/思考模式
 * - input: 支持的输入类型（文本、图片等）
 * - cost: 定价信息（每百万 token 的费用）
 * - contextWindow: 上下文窗口大小（token 数）
 * - maxTokens: 单次输出的最大 token 数
 * 
 * @example
 * ```ts
 * const kimiModel = MODELS.kimi['kimi-k2.5'];
 * console.log(kimiModel.name); // "Kimi K2.5"
 * console.log(kimiModel.contextWindow); // 262144
 * ```
 */
export const MODELS = {
    'kimi': {
        'kimi-k2.5': {
            /** 模型唯一标识符 */
            id: "kimi-k2.5",
            /** 模型显示名称 */
            name: "Kimi K2.5",
            /** API 协议类型 */
            api: "kimi-messages" as const,
            /** 服务提供商 */
            provider: "kimi" as const,
            /** API 基础 URL */
            baseUrl: "https://api.moonshot.cn/v1",
            /** 是否支持推理模式 */
            reasoning: true,
            /** 支持的输入类型 */
            input: ["text", "image"] as const,
            /** 定价信息（每百万 token） */
            cost: {
                /** 输入费用 */
                input: 0,
                /** 输出费用 */
                output: 0,
                /** 缓存读取费用 */
                cacheRead: 0,
                /** 缓存写入费用 */
                cacheWrite: 0,
            },
            /** 上下文窗口大小（token 数） */
            contextWindow: 262144,
            /** 单次输出最大 token 数 */
            maxTokens: 32768,
        }
    }
} as const;