/*global ysf */
function initQiyu(callback = () => { }) {
  let dom = window.document

  const init = () => {
    let user = JSON.parse(window.localStorage.getItem('currentUser'))
    let conf = { uid: '', name: '', email: '', mobile: '' }
    if (user && user.uid) {
      conf = {
        uid: user.uid,
        data: JSON.stringify([
          { key: 'real_name', value: user.username },
          { key: 'mobile_phone', value: user.mobile },
          { key: 'email', value: user.email },
          { index: 0, key: 'account', label: '账号', value: user.username, href: user.imageurl },
          { index: 1, key: 'sex', label: '性别', value: user.sex }
        ])
      }
    }

    ysf.on({
      onload: function () {
        ysf.config(conf)
        callback()
      },
      unread: function (msg) {
        // 未读消息处理
        if (msg.total) {
          console.log('unread')
        }
      }
    })
  }

  let ysfjs = dom.querySelector('#wyqiyu')
  if (!ysfjs) {
    ysfjs = dom.createElement('script')
    ysfjs.id = 'wyqiyu'
    ysfjs.src = 'https://qiyukf.com/script/6b154b1fb33760620640be11c78484e8.js'
    ysfjs.setAttribute('charset', 'UTF-8')
    dom.querySelector('body').appendChild(ysfjs)
    ysfjs.onload = function () {
      init()
    }
  } else init()

  /*
    var user = JSON.parse(localStorage.getItem('currentUser'))
    var ISIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    console.log(user, ISIOS)
    if (ISIOS) {
      if (user && user.uid) {
        ysf.on({
          onload: function () {
            ysf.config({
              uid: user.uid,
              data: JSON.stringify([
                { key: 'real_name', value: user.username },
                { key: 'mobile_phone', value: user.mobile },
                { key: 'email', value: user.email },
                { index: 0, key: 'account', label: '账号', value: user.username, href: user.imageurl },
                { index: 1, key: 'sex', label: '性别', value: user.sex }
              ])
            })
          },
          unread: function (msg) {
            if (msg.total) {
              console.log('unread')
            }
          }
        })
      } else {
        ysf.on({
          onload: function () {
            ysf.config({
              uid: '',
              name: '',
              email: '',
              mobile: ''
            })
          },
          unread: function (msg) {
            if (msg.total) {
              console.log('unread')
            }
          }
        })
      }
    } else {
      if (user && user.uid) {
        ysf.config({
          uid: user.uid,
          // name: user.username,
          // email: user.email,
          // mobile: user.mobile,
          data: JSON.stringify([
            { key: 'real_name', value: user.username },
            { key: 'mobile_phone', value: user.mobile },
            { key: 'email', value: user.email },
            { index: 0, key: 'account', label: '账号', value: user.username, href: user.imageurl },
            { index: 1, key: 'sex', label: '性别', value: user.sex == 0 ? '男' : '女' }
          ])
        })
      } else {
        ysf.config({
          uid: '',
          name: '',
          email: '',
          mobile: ''
        })
      }
    }*/
}



function QiyuProd(params, notnew) {
  // console.log('QiyuProd this: ', this)

  // let vm = this
  // vm.confirm({
  //   msg: '为了带给您更好的体验，请下载斗牛APP进行客服咨询~',
  //   okText: '立即前往',
  //   ok: () => {
  //     vm.openAppClient()
  //   },
  //   cancelText: '继续咨询',
  //   cancel: () => {
  doQiyuProd(params, notnew)
  //   }
  // })
}
function doQiyuProd(params, notnew) {
  let calldo = function () {
    let url = ysf.url()
    // if (!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))
    url = url + (url.indexOf('?') > -1 ? '&' : '?') + '_wwv=128' // _wv=1&
    if (window.mqq && !notnew) {
      window.mqq.invoke('ui', 'openUrl', {
        url: url,
        target: 1,
        style: 1
      })
    } else window.location.href = url
  }
  initQiyu(() => {
    var currentLink = window.location.href
    if (currentLink.indexOf('productDetail') > -1) {
      ysf.product({
        show: 1, // 1为打开，  其他参数为隐藏（包括非零元素）
        title: params.title,
        desc: params.desc,
        picture: params.picture,
        note: '¥' + params.note,
        url: params.url,
        success: function () {
          // 成功回调
          // window.location.href = ysf.url()
          calldo()
        },
        error: function () {
          // 错误回调
          // handle error
        }
      })
    } else calldo()
    // {
    // ysf.open({
    //     templateId: 2485909
    // })
    // window.location.href = ysf.url()
    // }
  })
}

const QiyuCall = newopen => {
  QiyuProd({}, !newopen)
}

export { QiyuProd, QiyuCall }
