import type { Api, Context, Model } from "../types";

export const streamKimi: unknown = (
    model: Model,
    context: Context,
    options?: unknown,
): unknown => {
    const stream = null;

    (async () => {
        const output: unknown = {
            role: "assistant",
            content: [],
            api: model.api as Api,
            provider: model.provider,
            model: model.id,
            usage: {
                input: 0,
                output: 0,
                cacheRead: 0,
                cacheWrite: 0,
                totalTokens: 0,
                cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
            },
            stopReason: "stop",
            timestamp: Date.now(),
        };

        try {
            // const apiKey = options?.apiKey ?? getEnvApiKey(model.provider) ?? "";
            // const { client, isOAuthToken } = createClient(
            //     model,
            //     apiKey,
            //     options?.interleavedThinking ?? true,
            //     options?.headers,
            // );
            // const params = buildParams(model, context, isOAuthToken, options);
            // options?.onPayload?.(params);
            // const anthropicStream = client.messages.stream({ ...params, stream: true }, { signal: options?.signal });
            // stream.push({ type: "start", partial: output });

            // type Block = (ThinkingContent | TextContent | (ToolCall & { partialJson: string })) & { index: number };
            // const blocks = output.content as Block[];

            // for await (const event of anthropicStream) {
            //     if (event.type === "message_start") {
            //         // Capture initial token usage from message_start event
            //         // This ensures we have input token counts even if the stream is aborted early
            //         output.usage.input = event.message.usage.input_tokens || 0;
            //         output.usage.output = event.message.usage.output_tokens || 0;
            //         output.usage.cacheRead = event.message.usage.cache_read_input_tokens || 0;
            //         output.usage.cacheWrite = event.message.usage.cache_creation_input_tokens || 0;
            //         // Anthropic doesn't provide total_tokens, compute from components
            //         output.usage.totalTokens =
            //             output.usage.input + output.usage.output + output.usage.cacheRead + output.usage.cacheWrite;
            //         calculateCost(model, output.usage);
            //     } else if (event.type === "content_block_start") {
            //         if (event.content_block.type === "text") {
            //             const block: Block = {
            //                 type: "text",
            //                 text: "",
            //                 index: event.index,
            //             };
            //             output.content.push(block);
            //             stream.push({ type: "text_start", contentIndex: output.content.length - 1, partial: output });
            //         } else if (event.content_block.type === "thinking") {
            //             const block: Block = {
            //                 type: "thinking",
            //                 thinking: "",
            //                 thinkingSignature: "",
            //                 index: event.index,
            //             };
            //             output.content.push(block);
            //             stream.push({ type: "thinking_start", contentIndex: output.content.length - 1, partial: output });
            //         } else if (event.content_block.type === "tool_use") {
            //             const block: Block = {
            //                 type: "toolCall",
            //                 id: event.content_block.id,
            //                 name: isOAuthToken
            //                     ? fromClaudeCodeName(event.content_block.name, context.tools)
            //                     : event.content_block.name,
            //                 arguments: (event.content_block.input as Record<string, any>) ?? {},
            //                 partialJson: "",
            //                 index: event.index,
            //             };
            //             output.content.push(block);
            //             stream.push({ type: "toolcall_start", contentIndex: output.content.length - 1, partial: output });
            //         }
            //     } else if (event.type === "content_block_delta") {
            //         if (event.delta.type === "text_delta") {
            //             const index = blocks.findIndex((b) => b.index === event.index);
            //             const block = blocks[index];
            //             if (block && block.type === "text") {
            //                 block.text += event.delta.text;
            //                 stream.push({
            //                     type: "text_delta",
            //                     contentIndex: index,
            //                     delta: event.delta.text,
            //                     partial: output,
            //                 });
            //             }
            //         } else if (event.delta.type === "thinking_delta") {
            //             const index = blocks.findIndex((b) => b.index === event.index);
            //             const block = blocks[index];
            //             if (block && block.type === "thinking") {
            //                 block.thinking += event.delta.thinking;
            //                 stream.push({
            //                     type: "thinking_delta",
            //                     contentIndex: index,
            //                     delta: event.delta.thinking,
            //                     partial: output,
            //                 });
            //             }
            //         } else if (event.delta.type === "input_json_delta") {
            //             const index = blocks.findIndex((b) => b.index === event.index);
            //             const block = blocks[index];
            //             if (block && block.type === "toolCall") {
            //                 block.partialJson += event.delta.partial_json;
            //                 block.arguments = parseStreamingJson(block.partialJson);
            //                 stream.push({
            //                     type: "toolcall_delta",
            //                     contentIndex: index,
            //                     delta: event.delta.partial_json,
            //                     partial: output,
            //                 });
            //             }
            //         } else if (event.delta.type === "signature_delta") {
            //             const index = blocks.findIndex((b) => b.index === event.index);
            //             const block = blocks[index];
            //             if (block && block.type === "thinking") {
            //                 block.thinkingSignature = block.thinkingSignature || "";
            //                 block.thinkingSignature += event.delta.signature;
            //             }
            //         }
            //     } else if (event.type === "content_block_stop") {
            //         const index = blocks.findIndex((b) => b.index === event.index);
            //         const block = blocks[index];
            //         if (block) {
            //             delete (block as any).index;
            //             if (block.type === "text") {
            //                 stream.push({
            //                     type: "text_end",
            //                     contentIndex: index,
            //                     content: block.text,
            //                     partial: output,
            //                 });
            //             } else if (block.type === "thinking") {
            //                 stream.push({
            //                     type: "thinking_end",
            //                     contentIndex: index,
            //                     content: block.thinking,
            //                     partial: output,
            //                 });
            //             } else if (block.type === "toolCall") {
            //                 block.arguments = parseStreamingJson(block.partialJson);
            //                 delete (block as any).partialJson;
            //                 stream.push({
            //                     type: "toolcall_end",
            //                     contentIndex: index,
            //                     toolCall: block,
            //                     partial: output,
            //                 });
            //             }
            //         }
            //     } else if (event.type === "message_delta") {
            //         if (event.delta.stop_reason) {
            //             output.stopReason = mapStopReason(event.delta.stop_reason);
            //         }
            //         // Only update usage fields if present (not null).
            //         // Preserves input_tokens from message_start when proxies omit it in message_delta.
            //         if (event.usage.input_tokens != null) {
            //             output.usage.input = event.usage.input_tokens;
            //         }
            //         if (event.usage.output_tokens != null) {
            //             output.usage.output = event.usage.output_tokens;
            //         }
            //         if (event.usage.cache_read_input_tokens != null) {
            //             output.usage.cacheRead = event.usage.cache_read_input_tokens;
            //         }
            //         if (event.usage.cache_creation_input_tokens != null) {
            //             output.usage.cacheWrite = event.usage.cache_creation_input_tokens;
            //         }
            //         // Anthropic doesn't provide total_tokens, compute from components
            //         output.usage.totalTokens =
            //             output.usage.input + output.usage.output + output.usage.cacheRead + output.usage.cacheWrite;
            //         calculateCost(model, output.usage);
            //     }
            // }

            // if (options?.signal?.aborted) {
            //     throw new Error("Request was aborted");
            // }

            // if (output.stopReason === "aborted" || output.stopReason === "error") {
            //     throw new Error("An unknown error occurred");
            // }

            // stream.push({ type: "done", reason: output.stopReason, message: output });
            // stream.end();
        } catch (error) {
            console.error('---sx.error---', error);

            // for (const block of output.content) delete (block as any).index;
            // output.stopReason = options?.signal?.aborted ? "aborted" : "error";
            // output.errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
            // stream.push({ type: "error", reason: output.stopReason, error: output });
            // stream.end();
        }
    })();

    return stream;
};