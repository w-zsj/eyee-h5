import { WxShareHelp } from './base'

var configed = false

function WxShare(params, store) {
  let shareData = store.getters.wxShareData
  // console.log('wxshare ', shareData)
  if (params && params.link) {
    let currData = shareData[params.link], appid = shareData.appId
    if (currData && appid) {
      params.appId = appid
      params.timestamp = currData.timestamp
      params.nonceStr = currData.nonceStr
      params.signature = currData.signature
      _setConfig(params)
      _setShare(params)
    } else _reShare(params, store)
  } else return false
}

function _reShare(params, store) {
  WxShareHelp({ url: window.location.href.split('#')[0] }).then(res => {
    // console.log('wxshare request new');

    if (res && res.appid && res.signature) {
      params.appId = res.appid
      params.timestamp = res.timestamp
      params.nonceStr = res.noncestr
      params.signature = res.signature
      store.dispatch('setWxShareData', params)
      _setConfig(params)
      _setShare(params)
    }
  })
}
function _setConfig(params) {
  // alert('_setConfig ' + JSON.stringify(params));
  if (params && params.appId && params.signature && !configed) {
    // console.log('_setConfig', params)
    configed = true
    wx.config({
      debug: false,
      ...params,
      jsApiList: [
        'checkJsApi',
        'chooseWXPay',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareQZone'
      ],
      success: function () {
        alert('分享成功')
      }
    })
  }
}
function _setShare(params) {
  // console.log('_setShare', params);
  // alert('_setShare ' + JSON.stringify(params));
  params.success = function () {
    alert('分享成功')
  }
  params.cancel = function () {
    alert('取消分享')
  }
  params.fail = function () {
    alert('分享失败')
  }

  wx.checkJsApi({
    jsApiList: ['checkJsApi',
      'chooseWXPay',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareQZone'],
    success: function (res) {
      // 以键值对的形式返回，可用的api值true，不可用为false
      // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
      // alert('checkJsApi success' + JSON.stringify(res));
      console.log('微信配置成功', res)
    },
    fail: function (res) {
      // alert('checkJsApi fail' + JSON.stringify(res));
      console.log('微信配置失败', res)
    }
  })
  wx.error(function (res) {
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    // console.error('wx js-sdk error', res)
    // _reShare(params)
  })

  wx.ready(function () {
    /* {
      title: '', // 分享标题
      desc: '',
      link: '',
      imgUrl: '', // 分享图标
      trigger: function (res) {
        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
      },
      success: function (res) {
        // 分享成功执行此回调函数
        alert('分享成功');
      },
      cancel: function (res) {
        alert('取消分享');
      },
      fail: function (res) {
        alert('分享失败');
      }
    }*/
    // 分享到朋友圈
    wx.onMenuShareTimeline(params)
    // 分享给朋友
    wx.onMenuShareAppMessage(params)
    // 分享到QQ
    wx.onMenuShareQQ(params)
    // 分享到QQ空间
    wx.onMenuShareQZone(params)
  })
}

export { WxShare }
