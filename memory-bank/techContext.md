# Tech Context: Node.js Express MongoDB JWT REST API Skeleton

## Technology Stack (2024 - Latest)

### Core Backend Technologies

* **Node.js**: 22.0.0+ (Latest LTS with modern features)
* **Express.js**: 5.1.0 (Latest with built-in body parsing)
* **MongoDB**: 3.6+ requirement (Modern aggregation pipeline support)
* **Mongoose**: 8.7.0 (Async/await only, no callback support)

### Authentication & Security

* **JWT**: jsonwebtoken 9.0.2 (Latest security patches)
* **Password Hashing**: bcrypt 6.0.0 (Modern async implementation)
* **Passport**: 0.7.0 + passport-jwt 4.0.1
* **Security Headers**: helmet 8.1.0
* **CORS**: cors 2.8.5

### Caching & Performance

* **Redis Client**: ioredis 5.4.1 (Modern Redis client with TypeScript support)
* **Compression**: compression 1.7.4
* **Response Optimization**: Built-in Express compression

### Validation & Utilities

* **Input Validation**: express-validator 7.2.0
* **Data Validation**: validator 13.12.0
* **Request Processing**: trim-request 1.0.6
* **Date Handling**: date-fns 4.1.0
* **UUID Generation**: uuid 11.1.0

### Development & Testing

* **Testing Framework**: Jest 30.0.0 (Unit tests) + Mocha 11.7.1 (E2E)
* **HTTP Testing**: supertest 7.0.0
* **Coverage**: nyc 17.1.0 + istanbul-merge 2.0.0
* **Mocking**: @faker-js/faker 10.0.0

### Code Quality & Development

* **ESLint**: 9.13.0 (Flat config)
* **Prettier**: 3.3.3
* **Babel**: 7.26.0 (ES6+ transpilation)
* **Husky**: 9.1.6 (Git hooks)
* **Cross-platform**: cross-env 10.0.0

### Environment & Configuration

* **Environment Management**: dotenv-safe 9.1.0
* **Process Management**: PM2 (production)
* **Internationalization**: i18n 0.15.1
* **Template Engine**: ejs 3.1.10

## Development Setup

### Prerequisites

```bash
Node.js: >=22.0.0
npm: >=8.0.0
MongoDB: >=3.6
Redis: >=5.0 (optional but recommended)
```

### Environment Configuration

```bash
# Environment files structure
.env.development    # Development specific
.env.test          # Test environment
.env.production    # Production environment
.env.example       # Template file
```

### Key Environment Variables

```bash
# Database
MONGO_URI=mongodb://localhost:27017/express-db

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRATION=4320  # minutes (3 days)

# Redis Cache (Optional)
USE_REDIS=true
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_TLS=false
REDIS_KEY_PREFIX=express_cache:

# Email Configuration
MAILGUN_API_KEY=your-mailgun-key
MAILGUN_DOMAIN=your-domain.com

# Application
PORT=3000
NODE_ENV=development
```

### Development Scripts

```json
{
  "dev": "cross-env NODE_ENV=development node --watch server.js",
  "start": "cross-env NODE_ENV=production pm2 start server.js",
  "test": "npm run coverage:clean && npm run test:unit && npm run test:e2e && npm run coverage",
  "test:unit": "cross-env NODE_ENV=test jest --coverage",
  "test:e2e": "cross-env NODE_ENV=test npm run fresh && npm run mocha",
  "fresh": "npm run clean && npm run seed",
  "clean": "node clean.js",
  "seed": "node seed.js"
}
```

## Architecture & Infrastructure

### Database Architecture

* **Primary DB**: MongoDB with Mongoose ODM
* **Connection**: Single connection with auto-reconnection
* **Indexing**: Automatic indexing via Mongoose schemas
* **Migration**: Seed scripts for development data

### Cache Architecture

* **Cache Layer**: Redis with ioredis client
* **Strategy**: Cache-aside pattern
* **TTL**: Configurable per endpoint (default 5 minutes)
* **Invalidation**: Pattern-based and user-specific
* **Fallback**: Graceful degradation without Redis

### Security Architecture

* **Authentication**: JWT with double encryption (JWT + custom encryption)
* **Authorization**: Role-based access control (user, admin)
* **Rate Limiting**: Built-in brute force protection
* **Input Sanitization**: express-validator + trim-request
* **Security Headers**: helmet.js with CORS

### Testing Architecture

```
Unit Tests (Jest)
├── Fast execution
├── Isolated components
├── Mocked dependencies
└── Code coverage reports

E2E Tests (Mocha + Supertest)
├── Full API testing
├── Database integration
├── Real HTTP requests
└── End-to-end workflows
```

## Modern Features & Constraints

### Express 5.x Specific Features

* **Built-in Body Parsing**: No need for body-parser package
* **Enhanced Router**: Improved route handling
* **Better Error Handling**: Enhanced error middleware
* **Performance**: Optimized request/response cycle

### Mongoose 8.x Specific Features

* **Async/Await Only**: No callback support
* **Better TypeScript**: Enhanced type definitions
* **Performance**: Optimized queries and connections
* **Modern Schema Features**: Enhanced validation and middleware

### Node.js 22+ Features Used

* **ESM Support**: Modern import/export ready
* **Performance**: V8 engine optimizations
* **Watch Mode**: Built-in `--watch` flag for development
* **Built-in Test Runner**: Native test runner available

## Technical Constraints & Decisions

### Database Constraints

* **MongoDB Version**: Minimum 3.6 for aggregation pipeline
* **Connection Pool**: Single connection model for simplicity
* **Schema Design**: Embedded documents for related data
* **Pagination**: Mongoose-paginate-v2 for large datasets

### Performance Constraints

* **Memory**: Redis cache adds memory overhead
* **CPU**: Encryption/decryption for JWT tokens
* **Network**: MongoDB connection latency considerations
* **Disk I/O**: Log file management for production

### Security Constraints

* **Password Policy**: Enforced via bcrypt configuration
* **Token Expiration**: Fixed 3-day expiration (configurable)
* **Rate Limiting**: Per-IP and per-user limits
* **HTTPS Only**: Production deployment assumption

### Development Constraints

* **Code Style**: ESLint + Prettier enforced via pre-commit hooks
* **Test Coverage**: Minimum 80% coverage target
* **Documentation**: JSDoc comments required for public APIs
* **Version Control**: Husky pre-commit and pre-push hooks

## Integration Points

### External Service Dependencies

```javascript
// Email Service (Mailgun)
MAILGUN_API_KEY     // Required for email functionality
MAILGUN_DOMAIN      // Domain configuration

// Redis (Optional)
REDIS_CONNECTION    // Cache performance enhancement

// MongoDB (Required)
MONGO_URI          // Primary data store
```

### API Integration Standards

* **REST Conventions**: Standard HTTP methods and status codes
* **JSON Communication**: All requests/responses in JSON
* **CORS Ready**: Cross-origin requests supported
* **API Versioning**: URL-based versioning ready

### Third-party Package Philosophy

* **Minimal Dependencies**: Only essential packages included
* **Regular Updates**: Monthly dependency updates
* **Security First**: Regular security audits via npm audit
* **Performance Focused**: Lightweight alternatives preferred

## Development Workflow

### Code Quality Pipeline

```
Local Development
├── ESLint (syntax & style)
├── Prettier (formatting)
├── Jest (unit tests)
└── Pre-commit hooks

CI/CD Ready
├── Automated testing
├── Coverage reports
├── Security scanning
└── Deployment scripts
```

### Environment-Specific Features

* **Development**: Hot reload, detailed logging, debug mode
* **Test**: Isolated database, mock external services
* **Production**: PM2 clustering, error monitoring, log aggregation

### Monitoring & Observability

* **Logging**: Morgan for HTTP requests (development only)
* **Error Tracking**: Centralized error handling patterns
* **Health Checks**: Basic endpoint health monitoring
* **Performance**: Redis cache hit/miss ratios
