import type { Context, Model, Message } from "../../types";

/**
 * 缓存控制配置
 */
interface CacheControl {
  type: "ephemeral";
  ttl?: "1h";
}

/**
 * 构建请求参数的选项
 */
export interface BuildParamsOptions {
  /** 最大输出 token 数 */
  maxTokens?: number;
  /** 温度参数，控制输出随机性 (0-1) */
  temperature?: number;
  /** 是否启用思考模式 */
  thinkingEnabled?: boolean;
  /** 思考模式预算 token 数 */
  thinkingBudgetTokens?: number;
  /** 工具选择策略 */
  toolChoice?: string | { type: string; name?: string };
  /** 缓存控制配置 */
  cacheControl?: CacheControl;
}

/**
 * 转换消息格式以适配不同的 AI 服务提供商
 * 
 * @param messages - 原始消息列表
 * @param model - 目标模型配置
 * @param isOAuthToken - 是否使用 OAuth 认证
 * @param cacheControl - 缓存控制配置
 * @returns 转换后的消息列表
 * 
 * @remarks
 * 不同的 AI 提供商可能有不同的消息格式要求
 * 此函数负责将标准格式转换为目标提供商的格式
 */
export function convertMessages(
  messages: Message[],
  model: Model,
  isOAuthToken: boolean,
  cacheControl?: CacheControl,
): any[] {
  // TODO: 实现跨提供商消息格式转换
  // 例如：处理图片、文件、工具调用等特殊消息类型
  return messages;
}

/**
 * 构建 API 请求参数
 * 
 * @param model - 模型配置
 * @param context - 对话上下文
 * @param isOAuthToken - 是否使用 OAuth 认证
 * @param options - 构建选项
 * @returns API 请求参数对象
 * 
 * @remarks
 * 此函数将标准的 Context 对象转换为特定 API 所需的请求参数格式
 * 包括：模型 ID、消息、最大 token、温度、工具等配置
 */
export function buildParams(
  model: Model,
  context: Context,
  isOAuthToken: boolean,
  options?: BuildParamsOptions,
): any {
  const params: any = {
    model: model.id,
    messages: convertMessages(
      context.messages,
      model,
      isOAuthToken,
      options?.cacheControl
    ),
    // 默认使用模型最大 token 的 1/3 作为输出上限
    max_tokens: options?.maxTokens || Math.floor(model.maxTokens / 3),
    stream: true,
  };

  // 添加系统提示词
  if (context.systemPrompt) {
    params.system = [
      {
        type: "text",
        text: context.systemPrompt,
      },
    ];
  }

  // 设置温度参数
  if (options?.temperature !== undefined) {
    params.temperature = options.temperature;
  }

  // 添加工具配置
  if (context.tools && context.tools.length > 0) {
    // TODO: 实现工具格式转换
    // params.tools = convertTools(context.tools, isOAuthToken);
  }

  // 启用思考模式（仅支持推理能力的模型）
  if (options?.thinkingEnabled && model.reasoning) {
    // TODO: 实现思考模式配置
    // params.thinking = {
    //   type: "enabled",
    //   budget_tokens: options.thinkingBudgetTokens || 1024,
    // };
  }

  // 设置工具选择策略
  if (options?.toolChoice) {
    // TODO: 实现工具选择策略配置
    // if (typeof options.toolChoice === "string") {
    //   params.tool_choice = { type: options.toolChoice };
    // } else {
    //   params.tool_choice = options.toolChoice;
    // }
  }

  return params;
}
