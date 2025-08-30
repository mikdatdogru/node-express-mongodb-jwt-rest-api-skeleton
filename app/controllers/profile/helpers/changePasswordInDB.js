const User = require('../../../models/user')
const {
  itemNotFound,
  buildErrObject,
  buildSuccObject
} = require('../../../middleware/utils')

/**
 * Changes password in database
 * @param {string} id - user id
 * @param {Object} req - request object
 */
const changePasswordInDB = async (id = '', req = {}) => {
  try {
    const user = await User.findById(id, '+password')
    await itemNotFound(null, user, 'NOT_FOUND')

    // Assigns new password to user
    user.password = req.newPassword

    // Saves in DB
    await user.save()
    return buildSuccObject('PASSWORD_CHANGED')
  } catch (error) {
    if (error.code) {
      throw error
    }
    throw buildErrObject(422, error.message)
  }
}

module.exports = { changePasswordInDB }
