const User = require('../../models/user')
const { buildErrObject } = require('../../middleware/utils')

/**
 * Checks User model if user with an specific email exists but excluding user id
 * @param {string} id - user id
 * @param {string} email - user email
 */
const emailExistsExcludingMyself = async (id = '', email = '') => {
  try {
    const item = await User.findOne({
      email,
      _id: {
        $ne: id
      }
    })

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

module.exports = { emailExistsExcludingMyself }
