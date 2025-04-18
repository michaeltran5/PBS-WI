import NodeCache from 'node-cache';

export const createCache = (timeout: number) => new NodeCache({ stdTTL: timeout });

/**
 * Generic function to handle cache logic with custom timeouts.
 * @param cacheInstance The NodeCache instance
 * @param cacheKey The unique key for the cached data
 * @param fetchFn A function that fetches fresh data if not cached
 * @returns Cached or fresh data
 */
export const cacheFetch = async <T>(
    cacheInstance: NodeCache,
    cacheKey: string,
    fetchFn: () => Promise<T>
): Promise<T> => {
    const cachedData = cacheInstance.get<T>(cacheKey);
    if (cachedData) return cachedData;

    const freshData = await fetchFn();
    cacheInstance.set(cacheKey, freshData);
    return freshData;
};

export const CACHE_TIMEOUT = 60 * 60 * 24;
export const cache = createCache(CACHE_TIMEOUT);

type Params = Record<string, any>;

export const generateCacheKey = (prefix: string, params: Params = {}): string => {
    const paramString = Object.entries(params)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, value]) => `${key}:${value}`)
        .join('|');
    return `${prefix}-${paramString}`;
}