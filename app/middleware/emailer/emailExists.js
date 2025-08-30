const User = require('../../models/user')
const { buildErrObject } = require('../../middleware/utils')

/**
 * Checks User model if user with an specific email exists
 * @param {string} email - user email
 */
const emailExists = async (email = '') => {
  try {
    const item = await User.findOne({ email })

    if (item) {
      throw buildErrObject(422, 'EMAIL_ALREADY_EXISTS')
    }
    return false
  } catch (err) {
    if (err.code) {
      throw err
    }
    throw buildErrObject(422, err.message)
  }
}

module.exports = { emailExists }
