const User = require('../../../models/user')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Updates profile in database
 * @param {Object} req - request object
 * @param {string} id - user id
 */
const updateProfileInDB = async (req = {}, id = '') => {
  try {
    const user = await User.findByIdAndUpdate(id, req, {
      new: true,
      runValidators: true,
      select: '-role -_id -updatedAt -createdAt'
    })
    await itemNotFound(null, user, 'NOT_FOUND')
    return user
  } catch (error) {
    throw error
  }
}

module.exports = { updateProfileInDB }
