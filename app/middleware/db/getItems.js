const { buildErrObject } = require('../../middleware/utils')

const { listInitOptions } = require('./listInitOptions')
const { cleanPaginationID } = require('./cleanPaginationID')

/**
 * Gets items from database
 * @param {Object} req - request object
 * @param {Object} query - query object
 */
const getItems = async (req = {}, model = {}, query = {}) => {
  try {
    const options = await listInitOptions(req)
    const items = await model.paginate(query, options)
    return cleanPaginationID(items)
  } catch (err) {
    throw buildErrObject(422, err.message)
  }
}

module.exports = { getItems }
