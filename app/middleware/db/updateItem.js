const { itemNotFound } = require('../../middleware/utils')

/**
 * Updates an item in database by id
 * @param {string} id - item id
 * @param {Object} req - request object
 */
const updateItem = async (id = '', model = {}, req = {}) => {
  try {
    const item = await model.findByIdAndUpdate(id, req, {
      new: true,
      runValidators: true
    })
    await itemNotFound(null, item, 'NOT_FOUND')
    return item
  } catch (error) {
    throw error
  }
}

module.exports = { updateItem }
