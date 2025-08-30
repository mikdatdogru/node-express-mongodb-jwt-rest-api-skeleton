const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')
const { cacheMiddleware, InvalidationPresets } = require('../middleware/cache')

const {
  getAllCities,
  getCities,
  createCity,
  getCity,
  updateCity,
  deleteCity
} = require('../controllers/cities')

const {
  validateCreateCity,
  validateGetCity,
  validateUpdateCity,
  validateDeleteCity
} = require('../controllers/cities/validators')

/*
 * Cities routes
 */

/*
 * Get all items route
 */
router.get(
  '/all',
  cacheMiddleware({ ttl: 600, keyPrefix: 'cities:all' }),
  getAllCities
)

/*
 * Get items route
 */
router.get(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  cacheMiddleware({ ttl: 300, keyPrefix: 'cities:list' }),
  getCities
)

/*
 * Create new item route
 */
router.post(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateCreateCity,
  InvalidationPresets.citiesCreate(),
  createCity
)

/*
 * Get item route
 */
router.get(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateGetCity,
  cacheMiddleware({ ttl: 600, keyPrefix: 'cities:detail' }),
  getCity
)

/*
 * Update item route
 */
router.patch(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateUpdateCity,
  InvalidationPresets.citiesUpdate(),
  updateCity
)

/*
 * Delete item route
 */
router.delete(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateDeleteCity,
  InvalidationPresets.citiesDelete(),
  deleteCity
)

module.exports = router
