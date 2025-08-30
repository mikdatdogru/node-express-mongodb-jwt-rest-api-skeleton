const { addHours } = require('date-fns')
const HOURS_TO_BLOCK = 2

const { buildErrObject } = require('../../../middleware/utils')

/**
 * Blocks a user by setting blockExpires to the specified date based on constant HOURS_TO_BLOCK
 * @param {Object} user - user object
 */
const blockUser = async (user = {}) => {
  try {
    user.blockExpires = addHours(new Date(), HOURS_TO_BLOCK)
    const result = await user.save()
    if (result) {
      return buildErrObject(409, 'BLOCKED_USER')
    }
  } catch (error) {
    throw buildErrObject(422, error.message)
  }
}

module.exports = { blockUser }
