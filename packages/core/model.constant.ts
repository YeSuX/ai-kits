export const MODELS = {
    'kimi': {
        'kimi-k2.5': {
            id: "k2.5",
            name: "Kimi K2.5",
            api: "kimi-messages",
            provider: "kimi",
            baseUrl: "https://api.moonshot.cn/v1",
            reasoning: true,
            input: ["text", "image"],
            cost: {
                input: 0,
                output: 0,
                cacheRead: 0,
                cacheWrite: 0,
            },
            contextWindow: 262144,
            maxTokens: 32768,
        }
    }
} as const;