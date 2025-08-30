const City = require('../../../models/city')
const { buildErrObject } = require('../../../middleware/utils')

/**
 * Gets all items from database
 */
const getAllItemsFromDB = async () => {
  try {
    const items = await City.find({}, '-updatedAt -createdAt').sort({ name: 1 })
    return items
  } catch (error) {
    throw buildErrObject(422, error.message)
  }
}

module.exports = { getAllItemsFromDB }
