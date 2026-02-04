export function getEnvApiKey(provider: any): string | undefined {
    return process.env[`${provider.toUpperCase()}_API_KEY`];
}