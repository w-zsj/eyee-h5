
var _oahthServer = window.location.origin

function _queryStringParse(str) {
  if (typeof str !== 'string') { return {} }
  str = str.trim().replace(/^(\?|#|&)/, '')
  if (!str) { return {} }
  return str.split('&').reduce(function (ret, param) {
    var parts = param.replace(/\+/g, ' ').split('=')
    var key = parts.shift()
    var val = parts.length > 0 ? parts.join('=') : undefined
    key = decodeURIComponent(key)
    val = val === undefined ? null : decodeURIComponent(val)
    if (!ret.hasOwnProperty(key)) {
      ret[key] = val
    } else if (Array.isArray(ret[key])) {
      ret[key].push(val)
    } else {
      ret[key] = [ret[key], val]
    }
    return ret
  }, {})
}

const weixinApp = {
  get_authorize_base_link: function (callbackUrl, state) {
    let query = window.location.search.replace('?', '&')
    var link = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxef296596d9e16189'
    link += '&redirect_uri=' + encodeURIComponent(callbackUrl)
    link += '&response_type=code'
    link += '&scope=snsapi_userinfo'
    if (state) { link += '&state=' + state }
    link += query
    link += '#wechat_redirect'
    return link
  }
}
export { weixinApp }
