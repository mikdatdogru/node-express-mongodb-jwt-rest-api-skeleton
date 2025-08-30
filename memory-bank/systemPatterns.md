# System Patterns: Node.js Express MongoDB JWT REST API Skeleton

## Architectural Patterns

### 1. Layered Architecture (MVC+)
```
┌─── Routes Layer ────────────────────────────────────┐
│  • HTTP routing ve middleware chain                │
│  • Request/Response handling                       │
│  • Route-level validation                          │
└─────────────────────────────────────────────────────┘
┌─── Controllers Layer ──────────────────────────────┐
│  • Business logic orchestration                   │
│  • Request data processing                        │
│  • Response formatting                            │
└─────────────────────────────────────────────────────┘
┌─── Helpers Layer ──────────────────────────────────┐
│  • Specific business operations                   │
│  • Reusable business functions                    │
│  • Controller support functions                   │
└─────────────────────────────────────────────────────┘
┌─── Middleware Layer ───────────────────────────────┐
│  • Cross-cutting concerns                         │
│  • Authentication/Authorization                   │
│  • Validation, Logging, Caching                   │
└─────────────────────────────────────────────────────┘
┌─── Models Layer ───────────────────────────────────┐
│  • Data models ve schemas                         │
│  • Database interactions                          │
│  • Data validation rules                          │
└─────────────────────────────────────────────────────┘
```

### 2. Module Pattern
Each controller creates its own ecosystem:
```
/controllers/auth/
├── index.js           # Export aggregator
├── login.js           # Main controller
├── register.js        # Main controller
├── helpers/           # Business logic helpers
│   ├── findUser.js
│   ├── generateToken.js
│   └── saveUserAccess.js
└── validators/        # Input validation
    ├── validateLogin.js
    └── validateRegister.js
```

### 3. Dynamic Loading Pattern (Express 5.x Compatible)
System modules are loaded dynamically:
```javascript
// Routes auto-loading (Express 5.x compatible)
fs.readdirSync(routesPath).filter((file) => {
  const routeFile = removeExtensionFromFile(file)
  return routeFile !== 'index' && routeFile !== 'auth'
    ? router.use(`/${routeFile}`, require(`./${routeFile}`))
    : ''
})

// Models auto-loading (Mongoose 8.x async/await only)
fs.readdirSync(modelsPath).filter((file) => {
  const modelFile = removeExtensionFromFile(file)
  return modelFile !== 'index' ? require(`./${modelFile}`) : ''
})
```

## Design Patterns

### 1. Factory Pattern
Controller helpers use factory pattern:
```javascript
// Error object factory
const buildErrObject = (code, message) => ({
  code,
  message
})

// Success object factory  
const buildSuccObject = (message, data = {}) => ({
  message,
  ...data
})
```

### 2. Middleware Pattern
Express.js middleware chain pattern:
```javascript
// Authentication middleware chain
router.post('/login', 
  trimRequest.all,        // Input sanitization
  validateLogin,          // Input validation
  login                   // Controller
)

// Protected route chain
router.get('/token',
  requireAuth,            // JWT verification
  roleAuthorization(['user', 'admin']), // Role check
  trimRequest.all,        // Input sanitization
  getRefreshToken         // Controller
)
```

### 3. Repository Pattern (Mongoose 8.x Async/Await)
Database operations abstracted through helpers:
```javascript
// Modern async/await only operations (Mongoose 8.x)
const createItem = async (collection, data) => {
  return await collection.create(data) // No callbacks supported
}
const getItem = async (collection, id) => {
  return await collection.findById(id) // Pure async/await
}
const updateItem = async (collection, id, data) => {
  return await collection.findByIdAndUpdate(id, data, { new: true })
}
const deleteItem = async (collection, id) => {
  return await collection.findByIdAndDelete(id)
}
```

### 4. Observer Pattern (Mongoose 8.x)
Modern Mongoose middleware hooks:
```javascript
UserSchema.pre('save', async function (next) {
  // Modern async/await password hashing (bcrypt 6.0.0)
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(SALT_FACTOR)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})
```

## Security Patterns

### 1. Defense in Depth
```
┌─── Network Layer ──────────────────────────────────┐
│  • CORS configuration                             │
│  • Rate limiting                                  │
│  • Request size limits                            │
└─────────────────────────────────────────────────────┘
┌─── Application Layer ──────────────────────────────┐
│  • Input validation                               │
│  • Authentication/Authorization                   │
│  • Error handling                                 │
└─────────────────────────────────────────────────────┘
┌─── Data Layer ─────────────────────────────────────┐
│  • Password hashing                               │
│  • Token encryption                               │
│  • Database validation                            │
└─────────────────────────────────────────────────────┘
```

### 2. JWT Token Pattern (Enhanced Security)
```javascript
// Modern double encryption pattern (jsonwebtoken 9.0.2)
const encryptedPayload = encrypt(payload)
const token = jwt.sign({ data: encryptedPayload }, secret, {
  algorithm: 'HS256',
  expiresIn: process.env.JWT_EXPIRATION + 'm'
})

// Enhanced token verification with modern error handling
try {
  const decryptedToken = decrypt(token)
  const payload = jwt.verify(decryptedToken, secret)
  return payload
} catch (error) {
  throw buildErrObject(401, 'INVALID_TOKEN')
}
```

### 3. Brute Force Protection Pattern
```javascript
// Login attempt tracking
const checkLoginAttemptsAndBlockExpires = async (user) => {
  if (user.isBlocked && user.blockExpires > Date.now()) {
    throw buildErrObject(429, 'BLOCKED_USER')
  }
  if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    await blockUser(user)
    throw buildErrObject(429, 'BLOCKED_USER')
  }
}
```

## Data Patterns

### 1. Schema-First Design
```javascript
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: { validator: validator.isEmail },
    unique: true,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  loginAttempts: {
    type: Number,
    default: 0,
    select: false  // Security: hide sensitive fields
  }
})
```

### 2. Pagination Pattern
```javascript
const listInitOptions = (req) => ({
  sort: buildSort(req),
  page: req.query.page || 1,
  limit: req.query.limit || 5,
  populate: getPopulateOptions(req)
})
```

### 3. Soft Delete Pattern (Implicit)
Block/unblock pattern instead of hard delete:
```javascript
const blockUser = async (user) => {
  user.blockExpires = addMinutes(new Date(), HOURS_TO_BLOCK * 60)
  return user.save()
}
```

## Error Handling Patterns

### 1. Centralized Error Handling
```javascript
const handleError = (res, err) => {
  const statusCode = err.code || 422
  res.status(statusCode).json({
    errors: {
      msg: err.message
    }
  })
}
```

### 2. Error Context Pattern
```javascript
// Controller level error handling
try {
  const user = await findUser(email)
  // ... business logic
} catch (error) {
  handleError(res, error)
}
```

### 3. Validation Error Pattern
```javascript
const validateResult = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      [err.param]: err.msg
    }))
    return handleError(res, buildErrObject(422, extractedErrors))
  }
  return next()
}
```

## Component Interaction Patterns

### 1. Request Flow Pattern
```
HTTP Request →
Route Handler →
Middleware Chain →
Controller →
Helper Functions →
Database Layer →
Response Formatting →
HTTP Response
```

### 2. Authentication Flow Pattern
```
Login Request →
Input Validation →
User Lookup →
Password Verification →
Token Generation →
Token Encryption →
Access Logging →
Response with Token
```

### 3. Authorization Flow Pattern
```
Protected Request →
Token Extraction →
Token Decryption →
JWT Verification →
User Lookup →
Role Verification →
Request Processing →
Response
```
