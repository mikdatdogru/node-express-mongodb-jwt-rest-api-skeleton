const { invalidateCache } = require('./cacheMiddleware')

/**
 * Cache invalidation middleware for data mutations
 * @param {string|string[]} patterns - Cache key patterns to invalidate
 * @returns {Function} Express middleware function
 */
const cacheInvalidationMiddleware = (patterns) => {
  return async (req, res, next) => {
    // Store original res.json to intercept successful responses
    const originalJson = res.json

    res.json = function (data) {
      // Only invalidate cache on successful responses (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Invalidate cache asynchronously after response is sent
        setImmediate(async () => {
          try {
            const patternsArray = Array.isArray(patterns)
              ? patterns
              : [patterns]

            for (const pattern of patternsArray) {
              // Replace placeholders with actual values from request
              let finalPattern = pattern

              // Replace :id with actual ID from params
              if (req.params.id) {
                finalPattern = finalPattern.replace(':id', req.params.id)
              }

              // Replace :userId with actual user ID
              if (req.user && req.user._id) {
                finalPattern = finalPattern.replace(
                  ':userId',
                  req.user._id.toString()
                )
              }

              const deletedCount = await invalidateCache(finalPattern)

              if (process.env.NODE_ENV === 'development') {
                console.log(
                  `🗑️ Cache invalidated: ${finalPattern} (${deletedCount} keys deleted)`
                )
              }
            }
          } catch (error) {
            console.error('❌ Cache invalidation error:', error.message)
          }
        })
      }

      // Call original json method
      return originalJson.call(this, data)
    }

    next()
  }
}

/**
 * Common cache invalidation patterns for different resources
 */
const CachePatterns = {
  // Cities patterns
  CITIES_ALL: '*cities:all*',
  CITIES_LIST: '*cities:list*',
  CITIES_DETAIL: '*cities:detail*',
  CITIES_USER: '*cities:*:user:*',

  // Users patterns
  USERS_ALL: '*users:*',
  USERS_DETAIL: '*users:detail*',

  // Auth patterns
  AUTH_USER: '*:user::userId*',

  // Generic patterns
  ALL_CACHE: '*',
  USER_SPECIFIC: '*:user::userId*'
}

/**
 * Pre-configured invalidation middleware for common scenarios
 */
const InvalidationPresets = {
  // Cities invalidation
  citiesCreate: () =>
    cacheInvalidationMiddleware([
      CachePatterns.CITIES_ALL,
      CachePatterns.CITIES_LIST
    ]),

  citiesUpdate: () =>
    cacheInvalidationMiddleware([
      CachePatterns.CITIES_ALL,
      CachePatterns.CITIES_LIST,
      CachePatterns.CITIES_DETAIL
    ]),

  citiesDelete: () =>
    cacheInvalidationMiddleware([
      CachePatterns.CITIES_ALL,
      CachePatterns.CITIES_LIST,
      CachePatterns.CITIES_DETAIL
    ]),

  // Users invalidation
  usersCreate: () => cacheInvalidationMiddleware([CachePatterns.USERS_ALL]),

  usersUpdate: () =>
    cacheInvalidationMiddleware([
      CachePatterns.USERS_ALL,
      CachePatterns.USERS_DETAIL,
      CachePatterns.AUTH_USER
    ]),

  usersDelete: () =>
    cacheInvalidationMiddleware([
      CachePatterns.USERS_ALL,
      CachePatterns.USERS_DETAIL,
      CachePatterns.AUTH_USER
    ]),

  // User profile invalidation
  profileUpdate: () =>
    cacheInvalidationMiddleware([
      CachePatterns.AUTH_USER,
      CachePatterns.USERS_DETAIL
    ])
}

module.exports = {
  cacheInvalidationMiddleware,
  InvalidationPresets,
  CachePatterns
}
