import type { MODELS } from "./model.constant";

/**
 * AI 服务提供商类型
 * 当前支持：kimi
 */
export type Provider = 'kimi';

/**
 * 从 MODELS 常量中提取所有可用的模型 ID
 * 例如：'kimi-k2.5'
 */
export type ModelId = {
  [P in keyof typeof MODELS]: keyof typeof MODELS[P]
}[keyof typeof MODELS];

/**
 * 模型配置对象类型
 * 包含模型的所有配置信息：ID、名称、API类型、定价等
 */
export type Model = {
  [P in keyof typeof MODELS]: (typeof MODELS[P])[keyof typeof MODELS[P]]
}[keyof typeof MODELS];

/**
 * 对话上下文
 * 包含系统提示词、消息历史和可用工具
 */
export interface Context {
  /** 系统提示词，用于设定 AI 的行为和角色 */
  systemPrompt?: string;
  /** 对话消息列表 */
  messages: Message[];
  /** 可供 AI 调用的工具列表 */
  tools?: Tool[];
}

/**
 * 消息类型
 * 可以是用户消息、助手消息或系统消息
 */
export interface Message {
  /** 消息角色 */
  role: 'user' | 'assistant' | 'system';
  /** 消息内容，可以是纯文本或包含多种内容类型 */
  content: string | MessageContent[];
}

/**
 * 消息内容块
 * 支持文本、图片等多种类型
 */
export type MessageContent = TextContent | ImageContent;

/**
 * 文本内容块
 */
export interface TextContent {
  type: 'text';
  text: string;
}

/**
 * 图片内容块
 */
export interface ImageContent {
  type: 'image';
  source: {
    type: 'url' | 'base64';
    data: string;
  };
}

/**
 * AI 工具定义
 * 允许 AI 调用外部功能
 */
export interface Tool {
  /** 工具名称 */
  name: string;
  /** 工具描述 */
  description: string;
  /** 工具参数的 JSON Schema */
  parameters: Record<string, any>;
}

/**
 * 已知的 API 类型
 * 包括主流 AI 服务的 API 规范
 */
export type KnownApi =
  | "openai-completions"
  | "openai-responses"
  | "azure-openai-responses"
  | "openai-codex-responses"
  | "anthropic-messages"
  | "bedrock-converse-stream"
  | "google-generative-ai"
  | "google-gemini-cli"
  | "google-vertex"
  | "kimi-messages";

/**
 * API 类型
 * 支持已知类型和自定义字符串
 */
export type Api = KnownApi | (string & {});

/**
 * 已注册的 API 提供商记录
 */
export type RegisteredApiProvider = {
  /** 提供商实现 */
  provider: ApiProviderInternal;
  /** 来源标识（用于调试和追踪） */
  sourceId?: string;
};

/**
 * API 提供商接口
 * 定义了如何与特定 API 交互
 */
export interface ApiProvider<TApi extends Api = Api, TOptions = unknown> {
  /** API 类型标识 */
  api: TApi;
  /** 流式响应函数 */
  stream: StreamFunction<TOptions>;
  /** 简化流式响应函数（可选） */
  streamSimple: StreamSimpleFunction<TOptions> | null;
}

/**
 * 内部使用的 API 提供商接口
 */
export interface ApiProviderInternal {
  /** API 类型标识 */
  api: Api;
  /** 流式响应函数 */
  stream: StreamFunction<any>;
  /** 简化流式响应函数 */
  streamSimple: StreamSimpleFunction<any> | null;
}

/**
 * 流式响应函数类型
 */
export type StreamFunction<TOptions = unknown> = (
  model: Model,
  context: Context,
  options?: TOptions
) => StreamResponse;

/**
 * 简化流式响应函数类型
 */
export type StreamSimpleFunction<TOptions = unknown> = (
  model: Model,
  context: Context,
  options?: TOptions
) => AsyncIterable<string>;

/**
 * 流式响应对象
 * 提供获取最终结果的方法
 */
export interface StreamResponse {
  /** 获取完整的响应结果 */
  result(): Promise<CompletionResult>;
}

/**
 * 完成响应结果
 * 包含 AI 的回复和使用统计
 */
export interface CompletionResult {
  /** 响应角色 */
  role: 'assistant';
  /** 响应内容 */
  content: MessageContent[];
  /** 使用的 API 类型 */
  api: Api;
  /** 服务提供商 */
  provider: Provider;
  /** 使用的模型 ID */
  model: string;
  /** Token 使用统计 */
  usage: UsageInfo;
  /** 停止原因 */
  stopReason: 'stop' | 'length' | 'tool_use' | 'end_turn';
  /** 响应时间戳 */
  timestamp: number;
}

/**
 * Token 使用统计信息
 */
export interface UsageInfo {
  /** 输入 token 数量 */
  input: number;
  /** 输出 token 数量 */
  output: number;
  /** 从缓存读取的 token 数量 */
  cacheRead: number;
  /** 写入缓存的 token 数量 */
  cacheWrite: number;
  /** 总 token 数量 */
  totalTokens: number;
  /** 费用统计 */
  cost: CostInfo;
}

/**
 * 费用统计信息
 */
export interface CostInfo {
  /** 输入费用 */
  input: number;
  /** 输出费用 */
  output: number;
  /** 缓存读取费用 */
  cacheRead: number;
  /** 缓存写入费用 */
  cacheWrite: number;
  /** 总费用 */
  total: number;
}

