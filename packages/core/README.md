# AI Kit Core

基于 TDD 范式开发的通用 AI 模型调用工具包。

## 当前状态

✅ **TDD Red 阶段完成**

已编写完整的测试用例（21 个测试），当前状态：

- 19 个测试失败（预期，因为功能未实现）
- 2 个测试通过（类型安全和错误处理相关）

## 测试覆盖功能

### 1. 模型管理 (`getModel`)

- ✓ 通过 provider 和 model name 获取模型实例
- ✓ 支持多个 provider (openai, anthropic, google, deepseek)
- ✓ 无效参数时抛出错误

### 2. 完整调用 (`complete`)

- ✓ 返回完整的响应消息
- ✓ 包含 usage 信息（token 统计和成本）
- ✓ 正确处理文本内容
- ✓ 支持多轮对话
- ✓ 支持多模态（图片）消息

### 3. 流式调用 (`stream`)

- ✓ 返回异步迭代器
- ✓ 接收 `start` 事件
- ✓ 接收 `text_start`、`text_delta`、`text_end` 事件
- ✓ 接收 `done` 事件，包含 finishReason
- ✓ 通过 `result()` 方法获取最终消息

### 4. 工具调用 (Tool Calls)

- ✓ 在 complete 中返回工具调用
- ✓ 在 stream 中接收 `toolcall_start`、`toolcall_delta`、`toolcall_end` 事件
- ✓ 支持 `toolResult` 消息类型

### 5. 推理过程 (Thinking)

- ✓ 支持的模型中接收 `thinking_start`、`thinking_delta`、`thinking_end` 事件

### 6. 错误处理

- ✓ API 错误时发出 `error` 事件
- ✓ complete 失败时抛出错误

### 7. 类型安全

- ✓ 完整的 TypeScript 类型定义
- ✓ Context 可序列化（跨模型传递）

## 项目结构

```
packages/core/
├── index.ts              # 主入口，导出所有 API
├── types.ts              # 完整的类型定义
├── index.test.ts         # 测试用例（21个）
├── vitest.config.ts      # Vitest 配置
├── package.json          # 依赖和脚本
└── README.md            # 本文档
```

## 运行测试

```bash
# 进入 core 包目录
cd packages/core

# 运行测试（watch 模式）
bun run test

# 单次运行测试
bun run test:run

# 生成覆盖率报告
bun run test:coverage
```

## API 设计示例

```typescript
import { getModel, stream, complete, Context, Tool } from "@ai-kit/core";

// 1. 获取模型
const model = getModel("openai", "gpt-4o-mini");

// 2. 定义上下文
const context: Context = {
  systemPrompt: "You are a helpful assistant.",
  messages: [{ role: "user", content: "What time is it?" }],
  tools: [
    {
      name: "get_time",
      description: "Get the current time",
      parameters: {
        type: "object",
        properties: {
          timezone: { type: "string", description: "Optional timezone" },
        },
      },
    },
  ],
};

// 3. 流式调用
const s = stream(model, context);
for await (const event of s) {
  switch (event.type) {
    case "text_delta":
      process.stdout.write(event.delta);
      break;
    case "toolcall_end":
      console.log(`Tool: ${event.toolCall.name}`);
      break;
    // ... 处理其他事件
  }
}

// 4. 获取最终结果
const message = await s.result();
context.messages.push(message);

// 5. 非流式调用
const response = await complete(model, context);
console.log(response.content);
```

## 下一步计划（TDD Green 阶段）

1. **实现 `getModel` 函数**

   - 模型配置管理
   - Provider 验证

2. **实现 `complete` 函数**

   - 调用各 provider 的 API
   - 统一响应格式转换
   - Token 使用统计和成本计算

3. **实现 `stream` 函数**

   - SSE/流式响应处理
   - 事件流转换
   - 异步迭代器实现

4. **集成 Provider SDKs**

   - OpenAI SDK
   - Anthropic SDK
   - Google Generative AI SDK
   - DeepSeek SDK

5. **TDD Refactor 阶段**
   - 代码优化和重构
   - 性能优化
   - 文档完善

## 核心设计原则

1. **类型安全**：完整的 TypeScript 类型支持，编译时错误检查
2. **统一接口**：抽象各 provider 的差异，提供一致的 API
3. **可序列化**：Context 可以在不同模型间传递和持久化
4. **流式优先**：原生支持流式响应，提升用户体验
5. **工具调用**：原生支持 Function Calling / Tool Use
6. **成本追踪**：自动计算每次调用的 token 使用和成本

## 依赖项

- `vitest`: 测试框架
- `@types/bun`: TypeScript 类型定义
- TypeScript 5+

## License

MIT
