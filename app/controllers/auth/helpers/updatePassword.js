const { itemNotFound } = require('../../../middleware/utils')

/**
 * Updates a user password in database
 * @param {string} password - new password
 * @param {Object} user - user object
 */
const updatePassword = async (password = '', user = {}) => {
  try {
    user.password = password
    const item = await user.save()
    await itemNotFound(null, item, 'NOT_FOUND')
    return item
  } catch (error) {
    throw error
  }
}

module.exports = { updatePassword }
