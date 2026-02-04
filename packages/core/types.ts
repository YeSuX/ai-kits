import type { MODELS } from "./model.constant";

export type Provider = 'kimi';

// 提取所有 model ID 的类型
export type ModelId = {
  [P in keyof typeof MODELS]: keyof typeof MODELS[P]
}[keyof typeof MODELS];

// 提取 model 配置对象的类型
export type Model = {
  [P in keyof typeof MODELS]: (typeof MODELS[P])[keyof typeof MODELS[P]]
}[keyof typeof MODELS];

export interface Context {
  systemPrompt?: string;
  messages: Message[];
  tools?: Tool[];
}

export type Message = unknown;

export type Tool = unknown;

export type KnownApi =
  | "openai-completions"
  | "openai-responses"
  | "azure-openai-responses"
  | "openai-codex-responses"
  | "anthropic-messages"
  | "bedrock-converse-stream"
  | "google-generative-ai"
  | "google-gemini-cli"
  | "google-vertex";

export type Api = KnownApi | (string & {});

export type RegisteredApiProvider = {
  provider: ApiProviderInternal;
  sourceId?: string;
};

export interface ApiProvider<TApi extends Api = Api, TOptions extends unknown = unknown> {
  api: TApi;
  stream: any;
  streamSimple: any;
}

export interface ApiProviderInternal {
  api: Api;
  stream: any;
  streamSimple: any;
}

