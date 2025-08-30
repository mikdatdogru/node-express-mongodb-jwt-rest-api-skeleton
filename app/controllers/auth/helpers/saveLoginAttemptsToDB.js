const { buildErrObject } = require('../../../middleware/utils')

/**
 * Saves login attempts to dabatabse
 * @param {Object} user - user object
 */
const saveLoginAttemptsToDB = async (user = {}) => {
  try {
    const result = await user.save()
    if (result) {
      return true
    }
  } catch (error) {
    throw buildErrObject(422, error.message)
  }
}

module.exports = { saveLoginAttemptsToDB }
