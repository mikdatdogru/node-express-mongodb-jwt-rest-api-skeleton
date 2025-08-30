const uuid = require('uuid')
const User = require('../../../models/user')
const { buildErrObject } = require('../../../middleware/utils')

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItemInDb = async ({
  name = '',
  email = '',
  password = '',
  role = '',
  phone = '',
  city = '',
  country = ''
}) => {
  try {
    const user = new User({
      name,
      email,
      password,
      role,
      phone,
      city,
      country,
      verification: uuid.v4()
    })
    let item = await user.save()

    item = JSON.parse(JSON.stringify(item))

    delete item.password
    delete item.blockExpires
    delete item.loginAttempts

    return item
  } catch (error) {
    throw buildErrObject(422, error.message)
  }
}

module.exports = { createItemInDb }
