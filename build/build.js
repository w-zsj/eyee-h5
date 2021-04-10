require('./check-versions')()

var args = process.argv.slice(2)
var isCdn = process.env.BUILD_CDN === 'yes'
var uploadAll = isCdn && args.includes('--all')

process.env.ENV_NAME = (process.env.NODE_ENV === 'production' ? 'prod' : process.env.NODE_ENV) + '.env'
console.log('---> process.env.ENV_NAME: ' + process.env.ENV_NAME)

var ora = require('ora')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var imgRgx = /\.(png|jpg|jpeg|gif|ico|icon)$/i

var spinner = ora(`building for ${isCdn ? '[cdn]' : ''}${process.env.NODE_ENV}...`)
spinner.start()

var putCdn = function () {
  console.log(chalk.yellow('开始上传静态文件到cdn...\n'))
  var fs = require('fs')
  var upyun = require('../node_modules/upyun/dist/upyun.common')

  var service = new upyun.Service('eyeefiles', 'eyeeadmin', 'Eyee@934')
  var client = new upyun.Client(service)

  var localPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)

  var putFiles = []
  var walker = function (nextPath) {
    fs.readdir(nextPath, (err, data) => {
      if (err) console.error('readdir error', err)
      data.forEach(i => {
        var next = path.join(nextPath, i)
        fs.stat(next, (statErr, info) => {
          if (statErr) console.error('stat error', err)
          if (info.isDirectory()) walker(next)
          else {
            // 非上传全部时 不处理图片资源
            if (uploadAll || !imgRgx.test(next)) putFiles.push(next)
          }
        })
      })
    })
  }
  var idx = 0
  var uploader = function () {
    if (idx < putFiles.length) {
      var localFile = putFiles[idx]
      var putFile = path.join(config.build.cdnPath, config.build.assetsSubDirectory, localFile.replace(localPath, ''))
      // console.log('---', localPath, '\ni--', localFile, '--', putFile)
      // console.log(idx, file)
      idx++
      upload(localFile, putFile)
    } else {
      spinner.stop()
      console.log(chalk.green('  ✔ 上传完了.\n'))
    }
  }
  var upload = function (localFilePath, uploadPath) {
    var uploadCallback = function (err, data) {
      // console.log('uploadCallback', idx, uploadPath)
      spinner = ora(`[${idx}/${putFiles.length}] ${localFilePath} 正在上传...`)
      spinner.start()
      if (err) {
        spinner.stop()
        throw err
      }

      uploadPath = uploadPath.replace(/\\/g, '/')

      // application/javascript; charset=UTF-8
      // text/css

      // spinner.stop()
      // console.log('upload', localFilePath, '★', uploadPath, config.build.assetsPublicPath)
      // uploader()

      client
        .putFile(uploadPath, data) //, { 'Content-Type': 'text/css' }
        .then(res => {
          // console.log('putFile', res)
          spinner.stop()
          uploader()
        })
        .catch(e => {
          spinner.stop()
          console.error(uploadPath + ' putFile error', e)
        })
    }

    // svg Content-Type为 test/xml
    if (imgRgx.test(localFilePath)) fs.readFile(localFilePath, uploadCallback)
    else fs.readFile(localFilePath, 'utf-8', uploadCallback)
  }

  console.log(chalk.yellow(` 正在读取目录：[${localPath}]...\n`))
  walker(localPath)
  setTimeout(() => {
    // console.log('putFiles: ', putFiles)
    console.log(chalk.yellow(` 目录读取完成，共${putFiles.length}个文件上传...\n`))
    uploader()
  }, 300)
}

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(
    stats.toString({


      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n'
  )

  console.log(chalk.cyan('  Build complete.\n'))
  // console.log(chalk.yellow('  Tip: built files are meant to be served over an HTTP server.\n' + "  Opening index.html over file:// won't work.\n"))

  if (isCdn) putCdn()
})

/* 2018-01-30 备份

require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n'
    )

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow('  Tip: built files are meant to be served over an HTTP server.\n' + "  Opening index.html over file:// won't work.\n"))
  })
})

*/
