/**
 * Gets browser info from user
 * @param {*} req - request object
 */
const getBrowserInfo = ({ headers = {} }) =>
  headers['user-agent'] || 'test-environment'

module.exports = { getBrowserInfo }
