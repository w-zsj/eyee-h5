var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  QQZONE_TEST: '"yes"',
  DATA_REPORT: '"no"',
  SITE_DOMIN: '""',
  GS_DONMIN: '""'
})
