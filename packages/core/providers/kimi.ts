import OpenAI from "openai";
import { getEnvApiKey } from "../env-api-keys";
import type { Api, Context, Model } from "../types";

function mergeHeaders(...headerSources: (Record<string, string> | undefined)[]): Record<string, string> {
    const merged: Record<string, string> = {};
    for (const headers of headerSources) {
        if (headers) {
            Object.assign(merged, headers);
        }
    }
    return merged;
}

function convertMessages(
    messages: any[],
    model: Model,
    isOAuthToken: boolean,
    cacheControl?: { type: "ephemeral"; ttl?: "1h" },
): any[] {
    // TODO: Transform messages for cross-provider compatibility
    return messages
}

function buildParams(
    model: Model,
    context: Context,
    isOAuthToken: boolean,
    options?: any,
): any {
    // TODO: get cache control支持

    const params: any = {
        model: model.id,
        messages: convertMessages(context.messages, model, isOAuthToken),
        max_tokens: options?.maxTokens || (model.maxTokens / 3) | 0,
        stream: true,
    };

    if (context.systemPrompt) {
        // Add cache control to system prompt for non-OAuth tokens
        params.system = [
            {
                type: "text",
                text: context.systemPrompt,
            },
        ];
    }

    if (options?.temperature !== undefined) {
        params.temperature = options.temperature;
    }

    if (context.tools) {
        // TODO: convertTools支持
        // params.tools = convertTools(context.tools, isOAuthToken);
    }

    if (options?.thinkingEnabled && model.reasoning) {
        // TODO: thinkingEnabled支持
        // params.thinking = {
        //     type: "enabled",
        //     budget_tokens: options.thinkingBudgetTokens || 1024,
        // };
    }

    if (options?.toolChoice) {
        // TODO: toolChoice支持
        // if (typeof options.toolChoice === "string") {
        //     params.tool_choice = { type: options.toolChoice };
        // } else {
        //     params.tool_choice = options.toolChoice;
        // }
    }

    return params;
}

function createClient(
    model: Model,
    apiKey: string,
    interleavedThinking: boolean,
    optionsHeaders?: Record<string, string>,
) {
    // const betaFeatures = ["fine-grained-tool-streaming-2025-05-14"];
    if (interleavedThinking) {
        // TODO: interleavedThinking支持
        // betaFeatures.push("interleaved-thinking-2025-05-14");
    }

    // TODO: 需要根据实际情况判断是否需要 OAuth 认证

    const defaultHeaders = mergeHeaders(
        {
            accept: "application/json",
        },
        optionsHeaders,
    );


    const client = new OpenAI({
        apiKey,
        baseURL: model.baseUrl,
        // 默认关闭 Web 浏览器支持，以避免泄露 API 密钥。若需在浏览器端使用，请显式设置 dangerouslyAllowBrowser 为 true。
        // 注意：在浏览器端暴露密钥有被窃取等安全风险。仅在受信任的内部环境、权限受控或用于开发调试时才建议开启。
        // React Native 当前不支持。
        dangerouslyAllowBrowser: true,
        defaultHeaders,
    });

    return { client, isOAuthToken: false };
}

export const streamKimi: unknown = (
    model: Model,
    context: Context,
    options?: any,
): any => {
    const apiKey = options?.apiKey ?? getEnvApiKey(model.provider) ?? "";

    const { client, isOAuthToken } = createClient(
        model,
        apiKey,
        options?.interleavedThinking ?? true,
        options?.headers,
    );

    const params = buildParams(model, context, isOAuthToken, options);
    options?.onPayload?.(params);

    const kimiStream = client.chat.completions.stream(
        { ...params, stream: true },
        { signal: options?.signal }
    );

    // 返回符合接口的对象
    return {
        async result() {
            try {
                // 必须先完全消费流，才能获取最终的 usage 信息
                const completion = await kimiStream.finalChatCompletion();

                console.log('---sx.completion---', completion.choices[0]?.usage);


                // 在流完成后获取 usage
                const usage = completion.choices[0]?.usage || {
                    prompt_tokens: 0,
                    completion_tokens: 0,
                    total_tokens: 0
                };

                // 构造符合格式的响应
                const content: any[] = [];

                if (completion.choices[0]?.message?.content) {
                    content.push({
                        type: 'text',
                        text: completion.choices[0].message.content
                    });
                }

                const inputCost = (usage.prompt_tokens || 0) * (model.cost.input || 0);
                const outputCost = (usage.completion_tokens || 0) * (model.cost.output || 0);

                return {
                    role: "assistant",
                    content,
                    api: model.api as Api,
                    provider: model.provider,
                    model: model.id,
                    usage: {
                        input: usage.prompt_tokens || 0,
                        output: usage.completion_tokens || 0,
                        cacheRead: 0,
                        cacheWrite: 0,
                        totalTokens: usage.total_tokens || 0,
                        cost: {
                            input: inputCost,
                            output: outputCost,
                            cacheRead: 0,
                            cacheWrite: 0,
                            total: inputCost + outputCost
                        },
                    },
                    stopReason: completion.choices[0]?.finish_reason || "stop",
                    timestamp: Date.now(),
                };
            } catch (error) {
                console.error('---sx.error---', error);
                throw error;
            }
        }
    };
};