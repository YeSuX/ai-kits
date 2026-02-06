import { registerApiProvider } from "../api-registry";
import { streamKimi } from "./kimi";

/**
 * 注册所有内置的 API 提供商
 * 
 * @remarks
 * 此函数在模块加载时自动执行，将所有内置的 AI 服务提供商注册到全局注册表中
 * 当前支持的提供商：
 * - Kimi (kimi-messages)
 * 
 * 扩展新的提供商时，只需在此函数中添加新的 registerApiProvider 调用
 */
export function registerBuiltInApiProviders(): void {
    console.log('registerBuiltInApiProviders');
    
    // 注册 Kimi API 提供商
    registerApiProvider({
        api: "kimi-messages",
        stream: streamKimi,
        streamSimple: null,
    });
}

// 模块加载时自动注册所有内置提供商
registerBuiltInApiProviders();