const { blockIsExpired } = require('./blockIsExpired')
const { buildErrObject } = require('../../../middleware/utils')

/**
 *
 * @param {Object} user - user object.
 */
const checkLoginAttemptsAndBlockExpires = async (user = {}) => {
  try {
    // Let user try to login again after blockexpires, resets user loginAttempts
    if (blockIsExpired(user)) {
      user.loginAttempts = 0
      const result = await user.save()
      if (result) {
        return true
      }
    }
    // User is not blocked, check password (normal behaviour)
    return true
  } catch (error) {
    throw buildErrObject(422, error.message)
  }
}

module.exports = { checkLoginAttemptsAndBlockExpires }
