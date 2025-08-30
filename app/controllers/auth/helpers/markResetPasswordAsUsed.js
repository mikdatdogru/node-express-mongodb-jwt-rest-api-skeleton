const {
  getIP,
  getBrowserInfo,
  getCountry,
  itemNotFound,
  buildSuccObject
} = require('../../../middleware/utils')

/**
 * Marks a request to reset password as used
 * @param {Object} req - request object
 * @param {Object} forgot - forgot object
 */
const markResetPasswordAsUsed = async (req = {}, forgot = {}) => {
  try {
    forgot.used = true
    forgot.ipChanged = getIP(req)
    forgot.browserChanged = getBrowserInfo(req)
    forgot.countryChanged = getCountry(req)
    const item = await forgot.save()
    await itemNotFound(null, item, 'NOT_FOUND')
    return buildSuccObject('PASSWORD_CHANGED')
  } catch (error) {
    throw error
  }
}

module.exports = { markResetPasswordAsUsed }
