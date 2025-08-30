const {
  initializeRedis,
  getRedisClient,
  closeRedis,
  isRedisAvailable
} = require('./redisClient')

const {
  cacheMiddleware,
  generateCacheKey,
  invalidateCache,
  invalidateUserCache,
  getCacheStats,
  flushCache
} = require('./cacheMiddleware')

const {
  cacheInvalidationMiddleware,
  InvalidationPresets,
  CachePatterns
} = require('./invalidationMiddleware')

module.exports = {
  // Redis client management
  initializeRedis,
  getRedisClient,
  closeRedis,
  isRedisAvailable,

  // Cache middleware and utilities
  cacheMiddleware,
  generateCacheKey,
  invalidateCache,
  invalidateUserCache,
  getCacheStats,
  flushCache,

  // Cache invalidation
  cacheInvalidationMiddleware,
  InvalidationPresets,
  CachePatterns
}
