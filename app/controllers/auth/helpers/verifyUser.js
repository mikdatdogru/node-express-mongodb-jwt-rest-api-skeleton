const { buildErrObject } = require('../../../middleware/utils')

/**
 * Verifies an user
 * @param {Object} user - user object
 */
const verifyUser = async (user = {}) => {
  try {
    user.verified = true
    const item = await user.save()
    return {
      email: item.email,
      verified: item.verified
    }
  } catch (error) {
    throw buildErrObject(422, error.message)
  }
}

module.exports = { verifyUser }
