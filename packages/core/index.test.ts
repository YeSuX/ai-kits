import { describe, it, expect, vi, beforeEach } from 'vitest';
import { complete, getModel, type Context, type ModelId, type Provider } from './index';

describe('pi-ai core API', () => {
  describe('getModel', () => {
    it('应该能够通过 provider 和 model name 获取模型实例', () => {
      const model = getModel('kimi', 'kimi-k2.5');

      expect(model).toBeDefined();
      expect(model.provider).toBe('kimi');
      expect(model.name).toBe('Kimi K2.5');
    });

    // TODO: 支持多个 provider，deepseek 和 minimax
    // it('应该支持多个 provider', () => {
    //   const openaiModel = getModel('openai', 'gpt-4o');
    //   const anthropicModel = getModel('anthropic', 'claude-3-5-sonnet-20241022');

    //   expect(openaiModel.provider).toBe('openai');
    //   expect(anthropicModel.provider).toBe('anthropic');
    // });

    it('应该在无效的 provider 或 model 时抛出错误', () => {
      expect(() => getModel('invalid' as any, 'model' as ModelId)).toThrow();
      expect(() => getModel('openai' as Provider, 'invalid-model' as ModelId)).toThrow();
    });
  });

  describe('complete - 非流式调用', () => {
    let context: Context;

    beforeEach(() => {
      context = {
        systemPrompt: 'You are a helpful assistant.',
        messages: [{ role: 'user', content: 'Hello!' }]
      };
    });

    it('应该返回完整的响应消息', async () => {
      const model = getModel('kimi', 'kimi-k2.5');
      const response = await complete(model, context);

      expect(response).toBeDefined();
      expect(response.role).toBe('assistant');
      expect(response.content).toBeInstanceOf(Array);
      expect(response.timestamp).toBeTypeOf('number');
      expect(response.model).toBe('gpt-4o-mini');
    });

    it('应该包含 usage 信息', async () => {
      const model = getModel('openai', 'gpt-4o-mini');
      const response = await complete(model, context);

      expect(response.usage).toBeDefined();
      expect(response.usage.input).toBeGreaterThan(0);
      expect(response.usage.output).toBeGreaterThan(0);
      expect(response.usage.cost).toBeDefined();
      expect(response.usage.cost.input).toBeGreaterThanOrEqual(0);
      expect(response.usage.cost.output).toBeGreaterThanOrEqual(0);
      expect(response.usage.cost.total).toBeGreaterThanOrEqual(0);
    });

    it('应该正确处理文本内容', async () => {
      const model = getModel('openai', 'gpt-4o-mini');
      const response = await complete(model, context);

      const textBlocks = response.content.filter(b => b.type === 'text');
      expect(textBlocks.length).toBeGreaterThan(0);
      expect(textBlocks[0]).toHaveProperty('text');
      expect(typeof textBlocks[0].text).toBe('string');
    });
  });

  // describe('stream - 流式调用', () => {
  //   let context: Context;

  //   beforeEach(() => {
  //     context = {
  //       systemPrompt: 'You are a helpful assistant.',
  //       messages: [{ role: 'user', content: 'Count to 3' }]
  //     };
  //   });

  //   it('应该返回异步迭代器', async () => {
  //     const model = getModel('openai', 'gpt-4o-mini');
  //     const s = stream(model, context);

  //     expect(s).toBeDefined();
  //     expect(typeof s[Symbol.asyncIterator]).toBe('function');
  //   });

  //   it('应该接收 start 事件', async () => {
  //     const model = getModel('openai', 'gpt-4o-mini');
  //     const s = stream(model, context);

  //     const events = [];
  //     for await (const event of s) {
  //       events.push(event);
  //       if (event.type === 'start') break;
  //     }

  //     const startEvent = events.find(e => e.type === 'start');
  //     expect(startEvent).toBeDefined();
  //     expect(startEvent?.partial).toBeDefined();
  //     expect(startEvent?.partial.model).toBe('gpt-4o-mini');
  //   });

  //   it('应该接收 text 相关事件', async () => {
  //     const model = getModel('openai', 'gpt-4o-mini');
  //     const s = stream(model, context);

  //     const events = [];
  //     for await (const event of s) {
  //       events.push(event);
  //     }

  //     const textStart = events.find(e => e.type === 'text_start');
  //     const textDelta = events.find(e => e.type === 'text_delta');
  //     const textEnd = events.find(e => e.type === 'text_end');

  //     expect(textStart).toBeDefined();
  //     expect(textDelta).toBeDefined();
  //     expect(textDelta?.delta).toBeTypeOf('string');
  //     expect(textEnd).toBeDefined();
  //   });

  //   it('应该接收 done 事件', async () => {
  //     const model = getModel('openai', 'gpt-4o-mini');
  //     const s = stream(model, context);

  //     const events = [];
  //     for await (const event of s) {
  //       events.push(event);
  //     }

  //     const doneEvent = events.find(e => e.type === 'done');
  //     expect(doneEvent).toBeDefined();
  //     expect(doneEvent?.reason).toBeDefined();
  //     expect(['stop', 'length', 'tool_calls']).toContain(doneEvent?.reason);
  //   });

  //   it('应该通过 result() 返回最终消息', async () => {
  //     const model = getModel('openai', 'gpt-4o-mini');
  //     const s = stream(model, context);

  //     // 消费所有事件
  //     for await (const event of s) {
  //       // 处理事件
  //     }

  //     const finalMessage = await s.result();
  //     expect(finalMessage).toBeDefined();
  //     expect(finalMessage.role).toBe('assistant');
  //     expect(finalMessage.content).toBeInstanceOf(Array);
  //     expect(finalMessage.usage).toBeDefined();
  //   });
  // });

  // describe('tools - 工具调用', () => {
  //   let context: Context;
  //   let tools: Tool[];

  //   beforeEach(() => {
  //     // 注意：这里需要 TypeBox 的实际实现，暂时用 mock 结构
  //     tools = [{
  //       name: 'get_time',
  //       description: 'Get the current time',
  //       parameters: {
  //         type: 'object',
  //         properties: {
  //           timezone: {
  //             type: 'string',
  //             description: 'Optional timezone (e.g., America/New_York)'
  //           }
  //         }
  //       }
  //     }];

  //     context = {
  //       systemPrompt: 'You are a helpful assistant.',
  //       messages: [{ role: 'user', content: 'What time is it?' }],
  //       tools
  //     };
  //   });

  //   it('应该在 complete 中返回工具调用', async () => {
  //     const model = getModel('openai', 'gpt-4o-mini');
  //     const response = await complete(model, context);

  //     const toolCalls = response.content.filter(b => b.type === 'toolCall');
  //     if (toolCalls.length > 0) {
  //       expect(toolCalls[0]).toHaveProperty('name');
  //       expect(toolCalls[0]).toHaveProperty('arguments');
  //       expect(toolCalls[0]).toHaveProperty('id');
  //     }
  //   });

  //   it('应该在 stream 中接收 toolcall 事件', async () => {
  //     const model = getModel('openai', 'gpt-4o-mini');
  //     const s = stream(model, context);

  //     const events = [];
  //     for await (const event of s) {
  //       events.push(event);
  //     }

  //     const toolcallStart = events.find(e => e.type === 'toolcall_start');
  //     const toolcallEnd = events.find(e => e.type === 'toolcall_end');

  //     if (toolcallStart) {
  //       expect(toolcallStart.contentIndex).toBeTypeOf('number');
  //     }

  //     if (toolcallEnd) {
  //       expect(toolcallEnd.toolCall).toBeDefined();
  //       expect(toolcallEnd.toolCall.name).toBeTypeOf('string');
  //       expect(toolcallEnd.toolCall.arguments).toBeDefined();
  //     }
  //   });

  //   it('应该支持 toolResult 消息', async () => {
  //     const model = getModel('openai', 'gpt-4o-mini');
  //     const response = await complete(model, context);

  //     const toolCalls = response.content.filter(b => b.type === 'toolCall');
  //     if (toolCalls.length > 0) {
  //       const toolCall = toolCalls[0];

  //       context.messages.push(response);
  //       context.messages.push({
  //         role: 'toolResult',
  //         toolCallId: toolCall.id,
  //         toolName: toolCall.name,
  //         content: [{ type: 'text', text: 'Current time is 10:00 AM' }],
  //         isError: false,
  //         timestamp: Date.now()
  //       });

  //       const continuation = await complete(model, context);
  //       expect(continuation).toBeDefined();
  //       expect(continuation.role).toBe('assistant');
  //     }
  //   });
  // });

  // describe('thinking - 推理过程', () => {
  //   let context: Context;

  //   beforeEach(() => {
  //     context = {
  //       systemPrompt: 'You are a helpful assistant.',
  //       messages: [{ role: 'user', content: 'Solve: 123 * 456' }]
  //     };
  //   });

  //   it('应该在支持的模型中接收 thinking 事件', async () => {
  //     // 某些模型（如 o1）支持 thinking
  //     const model = getModel('openai', 'o1-mini');
  //     const s = stream(model, context);

  //     const events = [];
  //     for await (const event of s) {
  //       events.push(event);
  //     }

  //     const thinkingStart = events.find(e => e.type === 'thinking_start');
  //     const thinkingDelta = events.find(e => e.type === 'thinking_delta');
  //     const thinkingEnd = events.find(e => e.type === 'thinking_end');

  //     // thinking 事件可能不存在（取决于模型）
  //     if (thinkingStart) {
  //       expect(thinkingStart.contentIndex).toBeTypeOf('number');
  //     }

  //     if (thinkingDelta) {
  //       expect(thinkingDelta.delta).toBeTypeOf('string');
  //     }
  //   });
  // });

  // describe('error handling - 错误处理', () => {
  //   it('应该在 API 错误时发出 error 事件', async () => {
  //     const model = getModel('openai', 'gpt-4o-mini');

  //     // 使用无效的 context 触发错误
  //     const context: Context = {
  //       systemPrompt: '',
  //       messages: []
  //     };

  //     const s = stream(model, context);
  //     const events = [];

  //     try {
  //       for await (const event of s) {
  //         events.push(event);
  //         if (event.type === 'error') {
  //           expect(event.error).toBeDefined();
  //           expect(typeof event.error).toBe('string');
  //           break;
  //         }
  //       }
  //     } catch (error) {
  //       // 流式调用可能直接抛出异常
  //       expect(error).toBeDefined();
  //     }
  //   });

  //   it('应该在 complete 失败时抛出错误', async () => {
  //     const model = getModel('openai', 'gpt-4o-mini');

  //     const context: Context = {
  //       systemPrompt: '',
  //       messages: []
  //     };

  //     await expect(complete(model, context)).rejects.toThrow();
  //   });
  // });

  // describe('context management - 上下文管理', () => {
  //   it('应该支持多轮对话', async () => {
  //     const model = getModel('openai', 'gpt-4o-mini');

  //     const context: Context = {
  //       systemPrompt: 'You are a helpful assistant.',
  //       messages: [
  //         { role: 'user', content: 'My name is Alice' }
  //       ]
  //     };

  //     const response1 = await complete(model, context);
  //     context.messages.push(response1);

  //     context.messages.push({ role: 'user', content: 'What is my name?' });
  //     const response2 = await complete(model, context);

  //     expect(response2).toBeDefined();
  //     // 理论上应该回答 Alice，但这需要实际的 AI 响应
  //   });

  //   it('应该支持图片消息（多模态）', async () => {
  //     const model = getModel('openai', 'gpt-4o-mini');

  //     const context: Context = {
  //       systemPrompt: 'You are a helpful assistant.',
  //       messages: [{
  //         role: 'user',
  //         content: [
  //           { type: 'text', text: 'What is in this image?' },
  //           { 
  //             type: 'image',
  //             source: {
  //               type: 'url',
  //               url: 'https://example.com/image.jpg'
  //             }
  //           }
  //         ]
  //       }]
  //     };

  //     const response = await complete(model, context);
  //     expect(response).toBeDefined();
  //   });
  // });

  // describe('type safety - 类型安全', () => {
  //   it('Model 应该包含 provider 和 name', () => {
  //     const model = getModel('openai', 'gpt-4o-mini');

  //     // TypeScript 编译时检查
  //     const provider: string = model.provider;
  //     const name: string = model.name;

  //     expect(provider).toBe('openai');
  //     expect(name).toBe('gpt-4o-mini');
  //   });

  //   it('Context 应该是可序列化的', () => {
  //     const context: Context = {
  //       systemPrompt: 'Test',
  //       messages: [{ role: 'user', content: 'Hello' }]
  //     };

  //     const serialized = JSON.stringify(context);
  //     const deserialized = JSON.parse(serialized);

  //     expect(deserialized.systemPrompt).toBe('Test');
  //     expect(deserialized.messages.length).toBe(1);
  //   });
  // });
});
