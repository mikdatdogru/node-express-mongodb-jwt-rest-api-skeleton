const City = require('../../../models/city')
const { buildErrObject } = require('../../../middleware/utils')

/**
 * Checks if a city already exists in database
 * @param {string} name - name of item
 */
const cityExists = async (name = '') => {
  try {
    const item = await City.findOne({ name })

    if (item) {
      throw buildErrObject(422, 'CITY_ALREADY_EXISTS')
    }
    return false
  } catch (error) {
    if (error.code) {
      throw error
    }
    throw buildErrObject(422, error.message)
  }
}

module.exports = { cityExists }
