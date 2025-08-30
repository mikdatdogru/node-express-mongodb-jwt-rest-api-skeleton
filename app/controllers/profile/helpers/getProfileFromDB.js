const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
const getProfileFromDB = async (id = '') => {
  try {
    const user = await User.findById(id, '-_id -updatedAt -createdAt')
    await itemNotFound(null, user, 'NOT_FOUND')
    return user
  } catch (error) {
    throw error
  }
}

module.exports = { getProfileFromDB }
