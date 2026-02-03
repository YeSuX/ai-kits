// 导出所有类型
export * from './types';

import type { Model, Provider, Context, AssistantMessage, StreamResult } from './types';

export * from './model';

/**
 * 流式调用模型
 */
export function stream(model: Model, context: Context): StreamResult {
  throw new Error('Not implemented: stream');
}

/**
 * 非流式调用模型，返回完整响应
 */
export async function complete(model: Model, context: Context): Promise<AssistantMessage> {
  throw new Error('Not implemented: complete');
}

// ============ Utility Types for TypeBox (placeholder) ============

// 暂时提供简单的类型占位符，后续可以集成真正的 TypeBox
export const Type = {
  Object: (props: any) => ({ type: 'object', ...props }),
  String: (opts?: any) => ({ type: 'string', ...opts }),
  Number: (opts?: any) => ({ type: 'number', ...opts }),
  Boolean: (opts?: any) => ({ type: 'boolean', ...opts }),
  Optional: (schema: any) => ({ ...schema, optional: true }),
};

export const StringEnum = <T extends string[]>(...values: T) => ({
  type: 'string',
  enum: values,
});
