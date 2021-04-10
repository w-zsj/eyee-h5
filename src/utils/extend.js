// import { hexMD5 as MD5, de } from '../common/md5'
// import { SetPoints } from "../common/api/base";

const ISDEV = process.env.NODE_ENV !== 'production'

/**
 * 补差计时器
 * @param {Function} callback 回调函数
 * @param {Number} interval 时间间隔
 * @param {Boolean} firstCall 是否首次立即回调

  example:
  $timer(function (timer, count) {
    console.log('$timer ', ...arguments)
    let date = new Date()
    document.writeln(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`)

    // 暂停计时器, 在 callback 里 clearTimeout
    // clearTimeout(timer)
  }, 1000, 1)
 */

window.$timer = (callback = () => { }, interval = 1000, firstCall = false) => {
  let count = 0
  let start = +new Date()
  // start = start.getTime() - start.getMilliseconds()
  let timer
  // console.log('  ⏰ -> start:' + start + ', interval:' + interval)

  const loop = () => {
    let diff = +new Date() - (start + count * interval)
    let next = interval - diff
    if (next < 0) next = 0
    // console.log('  -> count:' + count + ', diff:' + diff + 'ms, next:' + next)

    count++

    timer = setTimeout(loop, next)

    callback(timer, count)
  }

  // 非首次执行时 需将count++ 因为在实际第一次执行时已经有一个时间间隔的延迟
  if (firstCall) loop()
  else timer = setTimeout(loop, interval, count++)
}
const ua = navigator.userAgent
const ua2 = ua.toLowerCase()
// 全局环境变量
window.ENV = {
  debug: process.env.NODE_ENV !== 'production',
  version: '5.1.0', // 跟随API版本号，与项目发布版本区分
  dpr: (() => {
    if (window.devicePixelRatio && window.devicePixelRatio > 1) {
      return window.devicePixelRatio;
    }
    return 1;
  })(),
  ua: {
    mobile: !!ua.match(/AppleWebKit.*Mobile.*/) || /Android|webOS|iPhone|iPod|BlackBerry/i.test(ua),

    ios: !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    android: ua.indexOf('Android') > -1,

    eyee: ua2.indexOf('platform/app') !== -1,

    wx: /micromessenger/.test(ua2),
    mini: /miniprogram/.test(ua2),
    qq: /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/.test(ua2) || /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/.test(ua2), // /qq/.test(ua2),
    weibo: /weibo/.test(ua2),
    alipay: /alipayclient/.test(ua2),
    tt: /toutiaomicroapp/.test(ua2),
  }
}

window.$DONEW = window.$DONEW || {}
/* global WebViewJavascriptBridge */
window._JSB = function (val, cb) {
  if (!ENV.ua.eyee) return

  const setupWebViewJavascriptBridge = callback => {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge)
    } else {
      document.addEventListener('WebViewJavascriptBridgeReady', function () {
        callback(WebViewJavascriptBridge)
      }, false)
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback)
    }
    window.WVJBCallbacks = [callback]
    var WVJBIframe = document.createElement('iframe')
    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
    document.documentElement.appendChild(WVJBIframe)
    setTimeout(function () {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  }

  console.log(' -> bridge call:', val.name, val.params)
  // cb = cb || function (response) { console.log('  --> bridge[' + val.name + '] response: ', response) }
  var fnCB = function (res, isDev) {
    // 回调只接收1个参数
    console.log('  --> ' + (isDev ? '*' : '') + 'bridge[' + val.name + '] response: ', res)
    cb && cb(res)
  }
  // console.log('bridge step1: ', val)
  setupWebViewJavascriptBridge(function (bridge) {
    // console.log('bridge step2: ', val)
    bridge.callHandler(val.name, val.params, fnCB)
  })

  if (!location.origin.includes('eyee.com')) {
    if (val.name === 'callAppAuth') fnCB({ token: JSON.parse(localStorage.getItem('currentUser')).token || "" }, 1)
    else fnCB('debug', 1)
  }
}

