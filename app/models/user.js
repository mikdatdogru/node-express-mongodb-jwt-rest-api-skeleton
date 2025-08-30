const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const mongoosePaginate = require('mongoose-paginate-v2')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: 'EMAIL_IS_NOT_VALID'
      },
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    verification: {
      type: String
    },
    verified: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    urlTwitter: {
      type: String,
      validate: {
        validator(v) {
          return v === '' ? true : validator.isURL(v)
        },
        message: 'NOT_A_VALID_URL'
      },
      lowercase: true
    },
    urlGitHub: {
      type: String,
      validate: {
        validator(v) {
          return v === '' ? true : validator.isURL(v)
        },
        message: 'NOT_A_VALID_URL'
      },
      lowercase: true
    },
    loginAttempts: {
      type: Number,
      default: 0,
      select: false
    },
    blockExpires: {
      type: Date,
      default: Date.now,
      select: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const hash = async (user, salt) => {
  try {
    const newHash = await bcrypt.hash(user.password, salt)
    user.password = newHash
    return user
  } catch (error) {
    throw error
  }
}

const genSalt = async (user, SALT_FACTOR) => {
  try {
    const salt = await bcrypt.genSalt(SALT_FACTOR)
    return await hash(user, salt)
  } catch (error) {
    throw error
  }
}

UserSchema.pre('save', async function (next) {
  try {
    const that = this
    const SALT_FACTOR = 5
    if (!that.isModified('password')) {
      return next()
    }
    await genSalt(that, SALT_FACTOR)
    return next()
  } catch (error) {
    return next(error)
  }
})

UserSchema.methods.comparePassword = async function (passwordAttempt) {
  try {
    const isMatch = await bcrypt.compare(passwordAttempt, this.password)
    return isMatch
  } catch (error) {
    throw error
  }
}
UserSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('User', UserSchema)
