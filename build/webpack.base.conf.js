var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
const CleanWebpackPlugin = require('clean-webpack-plugin')


function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

console.log('---> base build config: ', process.env.NODE_ENV, config.build)
console.log('-------------------------------------------------------')

const pathsToClean = [
  'dist/prerender',
  'dist/static'
]

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'mint-ui': 'MINT',
    'vue-carousel': 'VueCarousel'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      // 'vue$': 'vue/dist/vue.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: utils.assetsPath('img/[name].[contenthash:3].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1,
          name: utils.assetsPath('fonts/[name].[contenthash:3].[ext]')
        }
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(path.join(__dirname, '../dist'), { root: resolve('/') })
    new CleanWebpackPlugin(pathsToClean, { root: resolve('/') })
  ]
}
