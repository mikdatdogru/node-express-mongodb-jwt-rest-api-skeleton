const ForgotPassword = require('../../../models/forgotPassword')
const { itemNotFound } = require('../../../middleware/utils')

/**
 * Checks if a forgot password verification exists
 * @param {string} id - verification id
 */
const findForgotPassword = async (id = '') => {
  try {
    const item = await ForgotPassword.findOne({
      verification: id,
      used: false
    })
    await itemNotFound(null, item, 'NOT_FOUND_OR_ALREADY_USED')
    return item
  } catch (error) {
    throw error
  }
}

module.exports = { findForgotPassword }
