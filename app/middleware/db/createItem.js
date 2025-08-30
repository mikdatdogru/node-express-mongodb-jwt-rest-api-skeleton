const { buildErrObject } = require('../../middleware/utils')

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
const createItem = async (req = {}, model = {}) => {
  try {
    const item = await model.create(req)
    return item
  } catch (error) {
    throw buildErrObject(422, error.message)
  }
}

module.exports = { createItem }
