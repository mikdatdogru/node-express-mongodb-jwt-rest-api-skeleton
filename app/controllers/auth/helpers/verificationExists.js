const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Checks if verification id exists for user
 * @param {string} id - verification id
 */
const verificationExists = async (id = '') => {
  try {
    const user = await User.findOne({
      verification: id,
      verified: false
    })
    await itemNotFound(null, user, 'NOT_FOUND_OR_ALREADY_VERIFIED')
    return user
  } catch (error) {
    throw error
  }
}

module.exports = { verificationExists }
