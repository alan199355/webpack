'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: "'http://dev_balance_api.ihibuilding.cn'",
  // API_ROOT: "'http://test_balance_api.ihibuilding.cn'",
  OPEN_API_ROOT: "'http://dev_console_api.ihibuilding.cn'",
  // OPEN_API_ROOT: "'http://test_console_api.ihibuilding.cn'",
  AUTH_CODE: "'34AE1C98-6491-E500-5176-F247462152B5'",
  // AUTH_CODE: "'2BC1DC0C-7006-36C3-DC28-4C9E08E975A8'",
  ossUrl: "'123'"
})
