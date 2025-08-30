const { buildSuccObject, itemNotFound } = require('../../middleware/utils')

/**
 * Deletes an item from database by id
 * @param {string} id - id of item
 */
const deleteItem = async (id = '', model = {}) => {
  try {
    const item = await model.findByIdAndDelete(id)
    await itemNotFound(null, item, 'NOT_FOUND')
    return buildSuccObject('DELETED')
  } catch (error) {
    throw error
  }
}

module.exports = { deleteItem }
