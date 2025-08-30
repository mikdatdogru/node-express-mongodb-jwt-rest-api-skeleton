const User = require('../../../models/user')
const { itemNotFound, buildErrObject } = require('../../../middleware/utils')

/**
 * Checks against user if has quested role
 * @param {Object} data - data object
 * @param {*} next - next callback
 */
const checkPermissions = async ({ id = '', roles = [] }, next) => {
  try {
    const result = await User.findById(id)
    await itemNotFound(null, result, 'USER_NOT_FOUND')
    if (roles.indexOf(result.role) > -1) {
      return next()
    }
    throw buildErrObject(401, 'UNAUTHORIZED')
  } catch (error) {
    throw error
  }
}

module.exports = { checkPermissions }
