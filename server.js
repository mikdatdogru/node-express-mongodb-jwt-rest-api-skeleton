// Load environment variables automatically based on NODE_ENV
require('dotenv-flow').config()
const express = require('express')
// body-parser is now built-in to Express 5.x
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
const app = express()
const i18n = require('i18n')
const initMongo = require('./config/mongo')
const path = require('path')

// Setup express server port from ENV, default: 3000
app.set('port', process.env.PORT || 3000)

// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Modern Redis cache with ioredis
if (process.env.USE_REDIS === 'true') {
  const { initializeRedis } = require('./app/middleware/cache')

  // Initialize Redis connection
  const redisClient = initializeRedis()

  if (redisClient) {
    console.log('🚀 Redis cache initialized with ioredis')

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      const { closeRedis } = require('./app/middleware/cache')
      await closeRedis()
    })

    process.on('SIGINT', async () => {
      const { closeRedis } = require('./app/middleware/cache')
      await closeRedis()
      process.exit(0)
    })
  }
}

// for parsing json (Express 5.x built-in)
app.use(
  express.json({
    limit: '20mb'
  })
)
// for parsing application/x-www-form-urlencoded (Express 5.x built-in)
app.use(
  express.urlencoded({
    limit: '20mb',
    extended: true
  })
)

// i18n
i18n.configure({
  locales: ['en', 'es'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en',
  objectNotation: true
})
app.use(i18n.init)

// Init all other stuff
app.use(cors())
app.use(passport.initialize())
app.use(compression())
app.use(helmet())
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(require('./app/routes'))
app.listen(app.get('port'))

// Init MongoDB
initMongo()

module.exports = app // for testing
