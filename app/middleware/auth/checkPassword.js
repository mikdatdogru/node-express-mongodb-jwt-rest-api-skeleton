const { buildErrObject } = require('../../middleware/utils')

/**
 * Checks is password matches
 * @param {string} password - password
 * @param {Object} user - user object
 * @returns {boolean}
 */
const checkPassword = async (password = '', user = {}) => {
  try {
    const isMatch = await user.comparePassword(password)
    return isMatch
  } catch (error) {
    throw buildErrObject(422, error.message)
  }
}

module.exports = { checkPassword }
