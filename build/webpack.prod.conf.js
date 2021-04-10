var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// var PrerenderSpaPlugin = require('prerender-spa-plugin')
// const Renderer = PrerenderSpaPlugin.PuppeteerRenderer

var env = config.build.env

if (process.env.NODE_ENV === 'development') {
  env.NODE_ENV = '"development"'
}

var webpackConfig = merge(baseWebpackConfig, {
  stats: {
    excludeAssets: 'img'
  },

  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash:3].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash:3].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        pure_funcs: env.NODE_ENV === '"production"' ? ['console.log', 'console.info', 'console.group', 'console.groupCollapsed'] : []
      },
      sourceMap: false
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash:3].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
      cdnInject: (process.env.NODE_ENV.includes('prod') ? `<script>var _0xde02=["\x6C\x65\x6E\x67\x74\x68","","\x64\x65\x62\x75\x67\x67\x65\x72","\x63\x6F\x6E\x73\x74\x72\x75\x63\x74\x6F\x72"];!(function test(){try{!(function _0x6ba3x2(_0x6ba3x3){((_0xde02[1]+ _0x6ba3x3/ _0x6ba3x3)[_0xde02[0]]!== 1|| _0x6ba3x3=== 0)&& function(){}[_0xde02[3]](_0xde02[2])(),_0x6ba3x2(++_0x6ba3x3)}(0))}catch(e){setTimeout(test,80)}}())</script>`
        : `<script src="//files.eyee.com/mcdn/3rd/vconsole.min.js"></script><script>var vConsole = new VConsole()</script>`) +
        `<script src="//files.eyee.com/mcdn/3rd/polyfill.min.js"></script>
        <script src="//cdn.jsdelivr.net/combine/npm/vue@2.5.21/dist/vue.min.js,npm/vue-router@3.0.1/dist/vue-router.min.js,npm/vuex@3.0.1/dist/vuex.min.js,npm/mint-ui@2.2.3/lib/index.js,npm/vue-carousel@0.18.0/dist/vue-carousel.min.js"></script>`
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
      }
    }),

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor-vue',
    //   minChunks: function (module, count) {
    //     // any required modules inside node_modules are extracted to vendor
    //     return module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules/vue')) === 0
    //   },
    //   chunks: ['vendor']
    // }),

    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])

    // 预渲染
    // new PrerenderSpaPlugin(path.resolve(__dirname, `../dist/prerender`), ['/aboutus', '/privacy', '/slas', '/shoppingtips', '/coupondescription'])

    // new PrerenderSpaPlugin({
    //   staticDir: path.join(__dirname, `../dist`),
    //   outputDir: path.join(__dirname, `../dist/prerender`),
    //   routes: ['/aboutus', '/privacy', '/slas', '/shoppingtips', '/coupondescription'],
    //   renderer: new Renderer({
    //     renderAfterElementExists: '#app',
    //     headless: true // Display the browser window when rendering. Useful for debugging.
    //   })
    // })
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + config.build.productionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
