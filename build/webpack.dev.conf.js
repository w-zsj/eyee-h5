var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

// console.dir(utils.styleLoaders({ sourceMap: config.dev.cssSourceMap }))

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      cdnInject: `<script src="//files.eyee.com/mcdn/3rd/polyfill.min.js"></script>
                  <script src="//cdn.jsdelivr.net/combine/npm/vue@2.5.21/dist/vue.js,npm/vue-router@3.0.1/dist/vue-router.js,npm/vuex@3.0.1/dist/vuex.js,npm/mint-ui@2.2.3/lib/index.js,npm/vue-carousel@0.18.0/dist/vue-carousel.min.js"></script>
                  <script src="//files.eyee.com/mcdn/3rd/vconsole.min.js"> </script>
                  <script>var vConsole = new VConsole()</script>`
    }),
    new FriendlyErrorsPlugin()
  ]
})
