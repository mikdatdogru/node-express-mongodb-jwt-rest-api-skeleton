const UserAccess = require('../../../models/userAccess')
const { setUserInfo } = require('./setUserInfo')
const { generateToken } = require('./generateToken')
const {
  getIP,
  getBrowserInfo,
  getCountry,
  buildErrObject
} = require('../../../middleware/utils')

/**
 * Saves a new user access and then returns token
 * @param {Object} req - request object
 * @param {Object} user - user object
 */
const saveUserAccessAndReturnToken = async (req = {}, user = {}) => {
  try {
    const userAccess = new UserAccess({
      email: user.email,
      ip: getIP(req),
      browser: getBrowserInfo(req),
      country: getCountry(req)
    })
    await userAccess.save()
    const userInfo = await setUserInfo(user)
    // Returns data with access token
    return {
      token: generateToken(user._id),
      user: userInfo
    }
  } catch (error) {
    throw buildErrObject(422, error.message)
  }
}

module.exports = { saveUserAccessAndReturnToken }
