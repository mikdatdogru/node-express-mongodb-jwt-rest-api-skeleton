const uuid = require('uuid')
const ForgotPassword = require('../../../models/forgotPassword')
const {
  getIP,
  getBrowserInfo,
  getCountry,
  buildErrObject
} = require('../../../middleware/utils')

/**
 * Creates a new password forgot
 * @param {Object} req - request object
 */
const saveForgotPassword = async (req = {}) => {
  try {
    const forgot = new ForgotPassword({
      email: req.body.email,
      verification: uuid.v4(),
      ipRequest: getIP(req),
      browserRequest: getBrowserInfo(req),
      countryRequest: getCountry(req)
    })
    const item = await forgot.save()
    return item
  } catch (error) {
    throw buildErrObject(422, error.message)
  }
}

module.exports = { saveForgotPassword }
