const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds user by ID
 * @param {string} id - user´s id
 */
const findUserById = async (userId = '') => {
  try {
    const item = await User.findById(userId)
    await itemNotFound(null, item, 'USER_DOES_NOT_EXIST')
    return item
  } catch (error) {
    throw error
  }
}

module.exports = { findUserById }
