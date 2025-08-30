const jwt = require('jsonwebtoken')
const { buildErrObject } = require('../../../middleware/utils')
const { decrypt } = require('../../../middleware/auth')

/**
 * Gets user id from token
 * @param {string} token - Encrypted and encoded token
 */
const getUserIdFromToken = async (token = '') => {
  try {
    // Decrypts, verifies and decode token
    const decoded = jwt.verify(decrypt(token), process.env.JWT_SECRET)
    return decoded.data._id
  } catch (unusedError) {
    throw buildErrObject(409, 'BAD_TOKEN')
  }
}

module.exports = { getUserIdFromToken }
