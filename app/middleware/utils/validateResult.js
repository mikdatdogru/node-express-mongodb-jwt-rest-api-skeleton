const { validationResult } = require('express-validator')
const { handleError } = require('./handleError')
const { buildErrObject } = require('./buildErrObject')

/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
const validateResult = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      [err.param || err.path]: err.msg
    }))
    return handleError(res, buildErrObject(422, extractedErrors))
  }

  if (req.body && req.body.email) {
    req.body.email = req.body.email.toLowerCase()
  }
  return next()
}

module.exports = { validateResult }
