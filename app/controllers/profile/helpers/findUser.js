const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Finds user by id
 * @param {string} id - user id
 */
const findUser = async (id = '') => {
  try {
    const user = await User.findById(id, 'password email')
    await itemNotFound(null, user, 'USER_DOES_NOT_EXIST')
    return user
  } catch (error) {
    throw error
  }
}

module.exports = { findUser }
