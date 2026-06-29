let cacheHits = 0;
let cacheMisses = 0;
let rateLimitBlocks = 0;

export const incrementCacheHits = () => { cacheHits++; };
export const incrementCacheMisses = () => { cacheMisses++; };
export const incrementRateLimitBlocks = () => { rateLimitBlocks++; };

export const getPrometheusMetrics = () => {
  const memory = process.memoryUsage();
  return [
    `app_cache_hits_total ${cacheHits}`,
    ``,

    `app_cache_misses_total ${cacheMisses}`,
    ``,

    `app_rate_limit_blocks_total ${rateLimitBlocks}`,
    ``,

    `process_memory_rss_bytes ${memory.rss}`
  ].join("\n");
};
