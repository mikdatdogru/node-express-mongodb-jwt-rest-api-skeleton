const { buildErrObject } = require('../../../middleware/utils')

/**
 * Checks if blockExpires from user is greater than now
 * @param {Object} user - user object
 */
const userIsBlocked = (user = {}) => {
  if (user.blockExpires > new Date()) {
    throw buildErrObject(409, 'BLOCKED_USER')
  }
  return true
}

module.exports = { userIsBlocked }
