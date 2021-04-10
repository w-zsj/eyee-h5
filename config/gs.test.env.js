var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  QQZONE_TEST: '"yes"',
  DATA_REPORT: '"no"',
  SITE_DOMIN: '"https://qzone.eyee.com"',
  GS_DONMIN: '"https://1105894809.urlshare.cn"'
})
