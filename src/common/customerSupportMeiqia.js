// 打开客服

var mechatMetadataInter
function isServability(servability) {
  // $rootScope.isServability = servability;
}
function initMeiqia() {
  ; (function (m, ei, q, i, a, j, s) {
    m[a] =
      m[a] ||
      function () {
        ; (m[a].a = m[a].a || []).push(arguments)
      }
    ; (j = ei.createElement(q)), (s = ei.getElementsByTagName(q)[0])
    j.async = true
    j.charset = 'UTF-8'
    j.src = i
    s.parentNode.insertBefore(j, s)
  })(window, document, 'script', '//eco-api.meiqia.com/dist/meiqia.js', '_MEIQIA')

  _MEIQIA('entId', 4187)
  _MEIQIA('withoutBtn', true)
  _MEIQIA('getUnreadMsg', getmeg)
  _MEIQIA('allSet', isServability)
  // $rootScope.msgUnreadNum = $rootScope.msgUnreadNum || 0;
}
function getmeg(msg) {
  var text = '',
      num = 0

  if (msg === 'hasBeenRead') {
    // 消息已被阅读
    num = 0
  } else if (typeof msg === 'object') {
    var unreadNum = $rootScope.msgUnreadNum,
        lastMsg = msg[msg.length - 1]
    num = isNaN(+unreadNum) ? msg.length : +unreadNum + msg.length

    // content_type 是消息的类型， text（文字）、photo（图片）
    if (lastMsg.content_type === 'text') {
      // 文字消息中可能会存在表情图片，由于路径问题，将文字消息中的图片处理为文字'[表情]'
      text = lastMsg.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, '[表情]')
    } else if (lastMsg.content_type === 'photo') {
      text = '[图片]'
    } else {
      text = '[新消息]'
    }
  }
  var mechatMetadataInterTime = 10
  mechatMetadataInter = setInterval(function () {
    if (_MEIQIA._SENDMETADATA) {
      sendMetadata()
      clearInterval(mechatMetadataInter)
    }
    mechatMetadataInterTime--
    if (mechatMetadataInterTime < 0) {
      clearInterval(mechatMetadataInter)
    }
  }, 500)
}
// initMeiqia()
function sendMetadata() {
  var userData = {}
  var user = ls.getItem('currentUser')
  user = JSON.parse(user)
  if (user && user.username) {
    userData.name = username
    userData.tel = user.mobile
  }
  userData.page = window.location.href
  _MEIQIA._SENDMETADATA(userData)
}
function showSupport() {
  initMeiqia()
  setTimeout(() => {
    sendMetadata()
    _MEIQIA._SHOWPANEL()
  }, 500)
}

export { showSupport }

