// ============ Model Types ============

export type Provider = 'kimi';

export interface Model {
  provider: Provider;
  name: string;
}

// ============ Content Types ============

export interface TextContent {
  type: 'text';
  text: string;
}

export interface ImageContent {
  type: 'image';
  source: {
    type: 'url' | 'base64';
    url?: string;
    data?: string;
    mediaType?: string;
  };
}

export interface ToolCallContent {
  type: 'toolCall';
  id: string;
  name: string;
  arguments: Record<string, any>;
}

export interface ThinkingContent {
  type: 'thinking';
  text: string;
}

export type ContentBlock = TextContent | ImageContent | ToolCallContent | ThinkingContent;

// ============ Message Types ============

export interface UserMessage {
  role: 'user';
  content: string | ContentBlock[];
  timestamp?: number;
}

export interface AssistantMessage {
  role: 'assistant';
  content: ContentBlock[];
  timestamp: number;
  model: string;
  usage: Usage;
  finishReason?: FinishReason;
}

export interface ToolResultMessage {
  role: 'toolResult';
  toolCallId: string;
  toolName: string;
  content: ContentBlock[];
  isError: boolean;
  timestamp: number;
}

export type Message = UserMessage | AssistantMessage | ToolResultMessage;

// ============ Tool Types ============

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>; // TypeBox schema
}

// ============ Context Types ============

export interface Context {
  systemPrompt?: string;
  messages: Message[];
  tools?: Tool[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
}

// ============ Usage & Cost Types ============

export interface Cost {
  input: number;
  output: number;
  total: number;
}

export interface Usage {
  input: number;
  output: number;
  cost: Cost;
}

// ============ Stream Event Types ============

export type FinishReason = 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'error';

export interface StartEvent {
  type: 'start';
  partial: Partial<AssistantMessage> & { model: string };
}

export interface TextStartEvent {
  type: 'text_start';
  contentIndex: number;
}

export interface TextDeltaEvent {
  type: 'text_delta';
  delta: string;
  contentIndex: number;
}

export interface TextEndEvent {
  type: 'text_end';
  contentIndex: number;
}

export interface ThinkingStartEvent {
  type: 'thinking_start';
  contentIndex: number;
}

export interface ThinkingDeltaEvent {
  type: 'thinking_delta';
  delta: string;
  contentIndex: number;
}

export interface ThinkingEndEvent {
  type: 'thinking_end';
  contentIndex: number;
}

export interface ToolCallStartEvent {
  type: 'toolcall_start';
  contentIndex: number;
}

export interface ToolCallDeltaEvent {
  type: 'toolcall_delta';
  contentIndex: number;
  partial: Partial<AssistantMessage>;
}

export interface ToolCallEndEvent {
  type: 'toolcall_end';
  contentIndex: number;
  toolCall: ToolCallContent;
}

export interface DoneEvent {
  type: 'done';
  reason: FinishReason;
}

export interface ErrorEvent {
  type: 'error';
  error: string;
}

export type StreamEvent =
  | StartEvent
  | TextStartEvent
  | TextDeltaEvent
  | TextEndEvent
  | ThinkingStartEvent
  | ThinkingDeltaEvent
  | ThinkingEndEvent
  | ToolCallStartEvent
  | ToolCallDeltaEvent
  | ToolCallEndEvent
  | DoneEvent
  | ErrorEvent;

// ============ Stream Result Types ============

export interface StreamResult extends AsyncIterable<StreamEvent> {
  result(): Promise<AssistantMessage>;
}
