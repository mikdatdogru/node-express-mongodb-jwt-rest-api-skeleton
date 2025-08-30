const City = require('../../../models/city')
const { buildErrObject } = require('../../../middleware/utils')

/**
 * Checks if a city already exists excluding itself
 * @param {string} id - id of item
 * @param {string} name - name of item
 */
const cityExistsExcludingItself = async (id = '', name = '') => {
  try {
    const item = await City.findOne({
      name,
      _id: {
        $ne: id
      }
    })

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

module.exports = { cityExistsExcludingItself }
