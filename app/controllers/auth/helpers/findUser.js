const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
const findUser = async (email = '') => {
  try {
    const item = await User.findOne({ email }).select(
      'password loginAttempts blockExpires name email role verified verification'
    )
    await itemNotFound(null, item, 'USER_DOES_NOT_EXIST')
    return item
  } catch (error) {
    throw error
  }
}

module.exports = { findUser }
