const uuid = require('uuid')
const User = require('../../../models/user')
const { buildErrObject } = require('../../../middleware/utils')

/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const registerUser = async (req = {}) => {
  try {
    const user = new User({
      name: req.name,
      email: req.email,
      password: req.password,
      verification: uuid.v4()
    })
    const item = await user.save()
    return item
  } catch (error) {
    throw buildErrObject(422, error.message)
  }
}

module.exports = { registerUser }
