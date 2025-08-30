const { getRedisClient, isRedisAvailable } = require('./redisClient')

/**
 * Generate cache key from request including query parameters
 * @param {Request} req - Express request object
 * @param {string} customKey - Custom key prefix
 * @returns {string} Generated cache key
 */
const generateCacheKey = (req, customKey = '') => {
  const { method, originalUrl, user, query } = req
  const userId = user ? user._id.toString() : 'anonymous'

  // Create base key
  let baseKey = customKey || `${method}:${originalUrl.split('?')[0]}`

  // Add query parameters for pagination and sorting to ensure unique cache keys
  const relevantParams = ['page', 'limit', 'sort', 'order', 'filter', 'fields']
  const queryParams = []

  relevantParams.forEach((param) => {
    if (query[param] !== undefined && query[param] !== '') {
      queryParams.push(`${param}:${query[param]}`)
    }
  })

  // Sort params for consistent key generation
  queryParams.sort()

  // Build final cache key
  if (queryParams.length > 0) {
    baseKey += ':' + queryParams.join(':')
  }

  return `${baseKey}:user:${userId}`
}

/**
 * Cache middleware for Express routes
 * @param {Object} options - Cache options
 * @param {number} options.ttl - Time to live in seconds (default: 300)
 * @param {string} options.keyPrefix - Custom key prefix
 * @param {Function} options.condition - Condition function to determine if caching should occur
 * @returns {Function} Express middleware function
 */
const cacheMiddleware = (options = {}) => {
  const {
    ttl = 300, // 5 minutes default
    keyPrefix = '',
    condition = () => true,
    skipOnError = true
  } = options

  return async (req, res, next) => {
    // Skip if Redis is not available
    if (!(await isRedisAvailable())) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Cache: Redis not available, skipping cache')
      }
      return next()
    }

    // Skip if condition is not met
    if (!condition(req)) {
      return next()
    }

    // Only cache GET requests by default
    if (req.method !== 'GET') {
      return next()
    }

    const cacheKey = generateCacheKey(req, keyPrefix)
    const redis = getRedisClient()

    try {
      // Try to get cached response
      const cachedResponse = await redis.get(cacheKey)

      if (cachedResponse) {
        const parsedResponse = JSON.parse(cachedResponse)

        // Set cache headers
        res.set({
          'X-Cache': 'HIT',
          'X-Cache-Key': cacheKey,
          'X-Cache-TTL': await redis.ttl(cacheKey)
        })

        if (process.env.NODE_ENV === 'development') {
          console.log(`🎯 Cache HIT: ${cacheKey}`)
        }

        return res
          .status(parsedResponse.statusCode || 200)
          .json(parsedResponse.data)
      }

      // Cache miss - continue to route handler
      if (process.env.NODE_ENV === 'development') {
        console.log(`❌ Cache MISS: ${cacheKey}`)
      }

      // Override res.json to cache the response
      const originalJson = res.json
      res.json = function (data) {
        // Cache the response asynchronously
        setImmediate(async () => {
          try {
            const responseToCache = {
              statusCode: res.statusCode,
              data: data,
              timestamp: new Date().toISOString()
            }

            await redis.setex(cacheKey, ttl, JSON.stringify(responseToCache))

            if (process.env.NODE_ENV === 'development') {
              console.log(`💾 Cache SET: ${cacheKey} (TTL: ${ttl}s)`)
            }
          } catch (cacheError) {
            console.error(
              '❌ Cache: Error saving to cache:',
              cacheError.message
            )
          }
        })

        // Set cache headers
        res.set({
          'X-Cache': 'MISS',
          'X-Cache-Key': cacheKey
        })

        // Call original json method
        return originalJson.call(this, data)
      }

      next()
    } catch (error) {
      console.error('❌ Cache: Middleware error:', error.message)

      if (skipOnError) {
        // Continue without caching on error
        next()
        return
      } else {
        next(error)
        return
      }
    }
  }
}

/**
 * Invalidate cache by pattern
 * @param {string} pattern - Redis key pattern (supports wildcards)
 * @returns {Promise<number>} Number of deleted keys
 */
const invalidateCache = async (pattern) => {
  const redis = getRedisClient()
  if (!redis || !(await isRedisAvailable())) {
    return 0
  }

  try {
    const keys = await redis.keys(pattern)
    if (keys.length === 0) {
      return 0
    }

    const deletedCount = await redis.del(...keys)

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `🗑️ Cache: Invalidated ${deletedCount} keys matching pattern: ${pattern}`
      )
    }

    return deletedCount
  } catch (error) {
    console.error('❌ Cache: Error invalidating cache:', error.message)
    return 0
  }
}

/**
 * Invalidate all cache entries for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of deleted keys
 */
const invalidateUserCache = async (userId) => {
  const pattern = `*:user:${userId}`
  return invalidateCache(pattern)
}

/**
 * Get cache statistics
 * @returns {Promise<Object>} Cache statistics
 */
const getCacheStats = async () => {
  const redis = getRedisClient()
  if (!redis || !(await isRedisAvailable())) {
    return { available: false }
  }

  try {
    const info = await redis.info('memory')
    const keyCount = await redis.dbsize()

    return {
      available: true,
      keyCount,
      memory: info,
      connected: redis.status === 'ready'
    }
  } catch (error) {
    console.error('❌ Cache: Error getting stats:', error.message)
    return { available: false, error: error.message }
  }
}

/**
 * Flush all cache entries
 * @returns {Promise<boolean>} Success status
 */
const flushCache = async () => {
  const redis = getRedisClient()
  if (!redis || !(await isRedisAvailable())) {
    return false
  }

  try {
    await redis.flushdb()
    console.log('🗑️ Cache: All cache entries flushed')
    return true
  } catch (error) {
    console.error('❌ Cache: Error flushing cache:', error.message)
    return false
  }
}

module.exports = {
  cacheMiddleware,
  generateCacheKey,
  invalidateCache,
  invalidateUserCache,
  getCacheStats,
  flushCache
}
