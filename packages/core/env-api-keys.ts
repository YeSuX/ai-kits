import type { Provider } from "./types";

/**
 * 从环境变量中获取指定提供商的 API 密钥
 * 
 * @param provider - 服务提供商标识
 * @returns API 密钥，如果未设置则返回 undefined
 * 
 * @remarks
 * 环境变量命名规则：`{PROVIDER}_API_KEY`
 * 例如：
 * - Kimi: `KIMI_API_KEY`
 * 
 * 推荐在项目根目录创建 `.env` 文件来配置密钥：
 * ```
 * KIMI_API_KEY=your-api-key-here
 * ```
 * 
 * Bun 会自动加载 .env 文件，无需额外配置
 * 
 * @example
 * ```ts
 * const apiKey = getEnvApiKey('kimi');
 * if (!apiKey) {
 *   throw new Error('KIMI_API_KEY not found in environment');
 * }
 * ```
 */
export function getEnvApiKey(provider: Provider): string | undefined {
    const envKey = `${provider.toUpperCase()}_API_KEY`;
    return process.env[envKey];
}

/**
 * 检查指定提供商的 API 密钥是否已配置
 * 
 * @param provider - 服务提供商标识
 * @returns 密钥是否已配置
 * 
 * @example
 * ```ts
 * if (!hasEnvApiKey('kimi')) {
 *   console.warn('Kimi API key not configured');
 * }
 * ```
 */
export function hasEnvApiKey(provider: Provider): boolean {
    return getEnvApiKey(provider) !== undefined;
}