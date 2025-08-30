const Redis = require('ioredis')

let redisClient = null

/**
 * Initialize Redis client with modern ioredis
 * @returns {Redis|null} Redis client instance or null if connection fails
 */
const initializeRedis = () => {
  if (process.env.USE_REDIS !== 'true') {
    console.log('Redis cache disabled by environment variable')
    return null
  }

  try {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
      db: parseInt(process.env.REDIS_DB || '0', 10),
      connectTimeout: 10000,
      lazyConnect: true,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        console.log(`Redis reconnection attempt ${times}, delay: ${delay}ms`)
        return delay
      },
      maxRetriesPerRequest: 3,
      enableAutoPipelining: true,
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'express_cache:'
    }

    // Add TLS support if enabled
    if (process.env.REDIS_TLS === 'true') {
      redisConfig.tls = {}
    }

    redisClient = new Redis(redisConfig)

    // Connection event handlers
    redisClient.on('connect', () => {
      console.log('✅ Redis: Connected successfully')
    })

    redisClient.on('ready', () => {
      console.log('✅ Redis: Ready to receive commands')
    })

    redisClient.on('error', (err) => {
      console.error('❌ Redis connection error:', err.message)
    })

    redisClient.on('close', () => {
      console.log('⚠️ Redis: Connection closed')
    })

    redisClient.on('reconnecting', (delay) => {
      console.log(`🔄 Redis: Reconnecting in ${delay}ms...`)
    })

    redisClient.on('end', () => {
      console.log('❌ Redis: Connection ended')
    })

    return redisClient
  } catch (error) {
    console.error('❌ Redis initialization failed:', error.message)
    return null
  }
}

/**
 * Get Redis client instance
 * @returns {Redis|null} Redis client or null
 */
const getRedisClient = () => {
  if (!redisClient && process.env.USE_REDIS === 'true') {
    return initializeRedis()
  }
  return redisClient
}

/**
 * Close Redis connection gracefully
 */
const closeRedis = async () => {
  if (redisClient) {
    try {
      await redisClient.quit()
      console.log('✅ Redis: Connection closed gracefully')
    } catch (error) {
      console.error('❌ Redis: Error closing connection:', error.message)
    }
    redisClient = null
  }
}

/**
 * Check if Redis is available and connected
 * @returns {Promise<boolean>} Connection status
 */
const isRedisAvailable = async () => {
  const client = getRedisClient()
  if (!client) {
    return false
  }

  try {
    await client.ping()
    return true
  } catch (error) {
    console.error('❌ Redis ping failed:', error.message)
    return false
  }
}

module.exports = {
  initializeRedis,
  getRedisClient,
  closeRedis,
  isRedisAvailable
}
