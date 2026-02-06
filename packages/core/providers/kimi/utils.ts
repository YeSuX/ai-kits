/**
 * 合并多个 HTTP 请求头对象
 * @param headerSources - 请求头对象数组，可以包含 undefined
 * @returns 合并后的请求头对象
 * 
 * @example
 * ```ts
 * const headers = mergeHeaders(
 *   { 'Content-Type': 'application/json' },
 *   { 'Authorization': 'Bearer token' }
 * );
 * // { 'Content-Type': 'application/json', 'Authorization': 'Bearer token' }
 * ```
 */
export function mergeHeaders(
  ...headerSources: (Record<string, string> | undefined)[]
): Record<string, string> {
  const merged: Record<string, string> = {};
  for (const headers of headerSources) {
    if (headers) {
      Object.assign(merged, headers);
    }
  }
  return merged;
}
