import { MD5, POSTGROUP } from '@/common/util'

const sign = stamp => MD5(stamp + window.atob('RE9VTkVXQGV5ZWUkMjAxOTAzMjE='))
// const getIp = $ => window.returnCitySN && window.returnCitySN['cip']
const ssKey = 'MEMBER_LOG_SESSION'
const logKey = ($ => {
  let now = parseInt(performance.timeOrigin)
  let key = sessionStorage.getItem(ssKey) || now
  console.log('session key', key)
  // 30分过期, 30 * 60 * 60 * 1000 = 108000000
  if (!(key && now - key < 108000000)) key = +new Date()
  sessionStorage.setItem(ssKey, key)
  return key
})()
const getUd = $ => JSON.parse(localStorage.getItem('currentUser') || '{}').uid || ''

const getUa = $ => {
  let ua = []
  for (const k in ENV.ua) {
    const u = ENV.ua[k];
    if (u) ua.push(k)
  }
  return ua.join(',')
}
// 获取手机版本号
let getOsVersion = () => {
  var u = navigator.userAgent, version = ''
  if (u.indexOf('Mac OS X') > -1) {
    // ios
    var regStr_saf = /OS [\d._]*/gi
    var verinfo = u.match(regStr_saf)
    version = 'IOS' + (verinfo + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.')
  } else if (u.indexOf('Android') > -1 ||
    u.indexOf('Linux') > -1) {
    // android
    version = 'Android' + u.substr(u.indexOf('Android') + 8, u.indexOf(';', u.indexOf('Android')) - u.indexOf('Android') - 8)
  } else if (u.indexOf('BB10') > -1) {
    // 黑莓bb10系统
    version = 'blackberry' + u.substr(u.indexOf('BB10') + 5, u.indexOf(';', u.indexOf('BB10')) - u.indexOf('BB10') - 5)
  } else if (u.indexOf('IEMobile') > -1) {
    // windows phone
    version = 'winphone' + u.substr(u.indexOf('IEMobile') + 9, u.indexOf(';', u.indexOf('IEMobile')) - u.indexOf('IEMobile') - 9)
  }
  return version
}
let get_status = () => { // 判断当前使用的是wifi还是流量
  var wifi = true;
  var ua = window.navigator.userAgent;
  var con = window.navigator.connection;
  // 如果是微信 www.bcty365.com
  if (/MicroMessenger/.test(ua)) {
    // 如果是微信6.0以上版本，用UA来判断
    if (/NetType/.test(ua)) {
      var match = ua.match(/NetType\/(\S*)$/)
      if (match && match[1] != 'WIFI') {
        wifi = false;
      }
      // 如果是微信6.0以下版本，调用微信私有接口WeixinJSBridge
    } else {
      document.addEventListener("WeixinJSBridgeReady", function onBridgeReady() {
        WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
          if (e.err_msg != "network_type:wifi") {
            wifi = false;
          }
        });
      });
    }
    // 如果支持navigator.connection
  } else if (con) {
    var network = con.type || con.effectiveType;
    if (network != "wifi" && network != "2" && network != "unknown") { // unknown是为了兼容Chrome Canary
      wifi = false;
    }
  }
  return wifi
}
// ext	扩展字段	N	String
let getExt = (lc = 0) => {
  let locl = sessionStorage.getItem('loginchannle')
  lc = locl || lc
  var loginchannle = { m: getUa(), osv: getOsVersion(), n: get_status() ? "wifi" : "4G", lc }
  return JSON.stringify(loginchannle)
}

/**
 *
  ud	登录用户id	N	String
  // dd	设备id	N	String
  // ia	广告标识idfa	N	String	ios 需要传
  i	登录ip	N	String
  tl	终端类型	N	String	IOS/Android/H5/小程序
  v	版本号	N	String
  // mt	app市场	N	String	ios:appstore
  ts	时间戳	Y	Int	精确到毫秒
  pp	前一个页面位置	N	String
  cp	当前页面位置	N	String
  e	事件名称	N	String
  p	业务参数	N	String	可为空，反之 json字符串
  ext	扩展字段	N	String
  sig	签名	Y	String	安全验证参数
  tsp	时间戳	Y	String	安全验证参数精确到毫秒
  t	事件类型	Y	int	事件类型 0 普通 1 pv 2 转化 3 点击
  ext	扩展字段	N	String
 */
window.$log = ({ e = '', p, ts, t = 0, ext = 0 }) => {
  try {
    // if (ENV.debug) return
    setTimeout(() => {
      let param = {
        dd: 'sk:' + logKey,
        ud: getUd(),
        i: '',
        tl: 'H5',
        v: ENV.version,
        ts: ts || +new Date(),
        pp: window._from || '',
        cp: location.pathname,
        e,
        t,
        p: (p && JSON.stringify(p)) || '',
        ext: getExt()
      }
      param.tsp = +new Date()
      param.sig = sign(param.tsp)
    }, 200)
  } catch (err) {
    console.error(' log error: ', err)
  }
}

window.$log.event = {
  enter: 'enter',
  pv: 'pv',
  click: 'click'
}
