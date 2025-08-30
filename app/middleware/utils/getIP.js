const requestIp = require('request-ip')

/**
 * Gets IP from user
 * @param {*} req - request object
 */
const getIP = (req) => requestIp.getClientIp(req) || '127.0.0.1'

module.exports = { getIP }
