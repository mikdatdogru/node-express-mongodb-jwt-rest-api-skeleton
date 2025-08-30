const mongoose = require('mongoose')
const { buildErrObject } = require('./buildErrObject')

/**
 * Checks if given ID is good for MongoDB
 * @param {string} id - id to check
 */
const isIDGood = (id = '') => {
  const goodID = mongoose.Types.ObjectId.isValid(id)
  if (!goodID) {
    throw buildErrObject(422, 'ID_MALFORMED')
  }
  return id
}

module.exports = { isIDGood }
