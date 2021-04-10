// import wx from 'weixin-js-sdk'

var directLink = function (url) {
  window.location.href = url
}

const JsSdkReady = function (call) {
  let $js = document.querySelector('_wx_js_sdk')
  if (!$js) {
    $js = document.createElement('script')
    $js.id = '_wx_js_sdk'
    $js.src = '//res.wx.qq.com/open/js/jweixin-1.2.0.js'
    $js.head.appendChild($js)
  }
  $js.onload = call
}

function WxPay(params, ordernum, uToken, isc2c) {
  // wx.config({
  //   debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  //   appId: params.appid, // 必填，公众号的唯一标识
  //   timestamp: params.timestamp, // 必填，生成签名的时间戳
  //   nonceStr: params.noncestr, // 必填，生成签名的随机串
  //   signature: params.paysign, // 必填，签名，见附录1
  //   jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  // })
  // wx.ready(function () {
  //
  // })
  // JsSdkReady(function () {
  wx.ready(function () {
    wx.chooseWXPay({
      timestamp: params.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: params.noncestr, // 支付签名随机串，不长于 32 位
      package: params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: params.signtype, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: params.paysign, // 支付签名
      success: function (res) {
        // alert('支付成功:' + JSON.stringify(res))
        // alert('支付成功' + window.location.origin + '/paysuccess/' + ordernum + '?timestamp=' + ((new Date()).getTime() + Math.random()))
        if (isc2c) {
          directLink(window.location.origin + '/sneaker/payResult/' + ordernum)
        } else {
          directLink(window.location.origin + '/paysuccess/' + ordernum)
        }
      },
      fail: function (res) {
        alert('支付失败: ' + JSON.stringify(res))
        if (isc2c) {
          directLink(window.location.origin + '/sneaker/payResult/' + ordernum + '?timestamp=' + ((new Date()).getTime() + Math.random()))
        } else {
          directLink(window.location.origin + '/payfail/' + ordernum + '?timestamp=' + ((new Date()).getTime() + Math.random()))
        }
      },
      cancel: function (res) {
        // alert('支付取消: ' + JSON.stringify(res))
        if (isc2c) {
          directLink(window.location.origin + '/sneaker/payResult/' + ordernum + '?timestamp=' + ((new Date()).getTime() + Math.random()))
        } else {
          directLink(window.location.origin + '/payfail/' + ordernum + '?timestamp=' + ((new Date()).getTime() + Math.random()))
        }
      }
    })
  })
  wx.error(function (res) {
    alert('error: ' + JSON.stringify(res))
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    /* alert("config信息验证失败");*/
  })
  // })
}


function WxPaySneaker(params, successUrl, failUrl) {
  // JsSdkReady(function () {
  wx.ready(function () {
    wx.chooseWXPay({
      timestamp: params.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: params.noncestr, // 支付签名随机串，不长于 32 位
      package: params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: params.signtype, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: params.paysign, // 支付签名
      success: function (res) {
        // alert('支付成功:' + JSON.stringify(res))
        // alert('支付成功' + window.location.origin + '/paysuccess/' + ordernum + '?timestamp=' + ((new Date()).getTime() + Math.random()))
        directLink(window.location.origin + successUrl)
      },
      fail: function (res) {
        // alert('支付失败: '+JSON.stringify(res))
        directLink(window.location.origin + failUrl + '?timestamp=' + ((new Date()).getTime() + Math.random()))
      },
      cancel: function (res) {
        // alert('支付取消: ' + JSON.stringify(res))
        directLink(window.location.origin + failUrl + '?timestamp=' + ((new Date()).getTime() + Math.random()))
      }
    })
  })
  wx.error(function (res) {
    alert('error: ' + JSON.stringify(res))
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    /* alert("config信息验证失败");*/
  })
  // })
}

export {
  WxPay,
  WxPaySneaker
}
