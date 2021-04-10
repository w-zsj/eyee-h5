// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './utils/extend'
import './utils/log'
import Vue from 'vue'
// import { mapGetters } from 'vuex'
import VueRouter from 'vue-router'
import MintUi from 'mint-ui'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Cookies from 'js-cookie'
window.$ck = Cookies

import routes from './common/route.js'
import store from './store'
import App from './App'

import { getUrlParam } from './common/util'
import { LoadScene } from './utils/enum'

import { WxShare } from './common/api/wxShare'
import { LoginAuto } from "./common/api/user";
// import { getIp } from "./utils/api/base";
import globalPlugins from "./globalPlugins";


const ISDEV = process.env.NODE_ENV !== 'production'

// const ls = window.localStorage
const dom = window.document
const body = dom.querySelector('body')
const shellsClass = ['waiting-home', 'waiting-product']

// Set this to false to prevent the production tip on Vue startup.
Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(MintUi)
Vue.use(VueAwesomeSwiper)
Vue.use(globalPlugins)
// console.log(JSON.parse(ls.getItem('currentUser')).token)
const router = new VueRouter({
  mode: 'history', routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(savedPosition)
        }, 300)
      })
    } else return { x: 0, y: 0 }
  }
})
router.beforeEach((to, from, next) => {
  window._from = from.fullPath
  let cName = to.meta.shell || ''
  if (cName) body.classList.add(cName)
  else body.classList.remove(...shellsClass)
  // console.log('页面进入'+to.path,from)
  try {
    $log({ e: 'pageappear', p: {}, t: 0, ext: 1 })
  } catch (err) { console.error('request error report error: ', err) }
  let wss = window.sessionStorage
  let launchKey = 'FC_LAUNCHED'
  if ((to.path === '/' || to.path == '/loadApp') && !ENV.ua.mobile) {
    next('/downApp')
    return
  }
  if (to.path == '/downApp' && ENV.ua.mobile) {
    next('/loadApp')
    return
  }
  if (to.path === '/' && !wss.getItem(launchKey)) {
    wss.setItem(launchKey, true)
    next('/launch')
    return
  }

  if (!wss.getItem(launchKey)) wss.setItem(launchKey, true)

  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    if ((store.getters.userInfo || {}).token) {
      next()
    } else {
      store.dispatch('setUserInfo', {})
      next('/login')
    }
  } else next()
})
router.afterEach((to, from) => {
  // console.log('to,from', to, from)
  setTimeout(() => {
    $log({ e: $log.event.pv, p: location.search })
    if (to.path != from.path) $log({ e: 'pagedisappear', p: {}, t: 0, ext: 1 })
  }, 300);

  MintUi.MessageBox.close()
})
/* 全局混合 */
Vue.mixin({
  methods: {
    $zip(img, scale) {
      // scale: 1 满屏，2 半屏，3 三分之一屏  以750为屏宽计算
      if (img.includes('api.eyee') || img.includes('files.eyee')) {
        if (img.includes('!')) img = img.split('!')[0]
        scale = scale !== 1 && scale !== 2 && scale !== 3 ? 1 : scale
        img = img + '!2x' + scale
      }
      return img
    },
    $loader(text = '加载中···') {
      let loader = MintUi.Indicator
      loader.open({
        text,
        spinnerType: 'triple-bounce' // 'snake''fading-circle''double-bounce''triple-bounce'
      })
      return loader
    },
    setToolBar({ title, bgcolor, textcolor, showshoppingcarticon, disbounce }) {
      // if (!title.includes('斗牛')) title = title + '-斗牛，Let\'s DoNew!'
      dom.title = title
      let _ = this
      if (_.$root.ISAPP) {
        let params = {}
        if (title) params.title = title
        if (bgcolor) params.bgcolor = bgcolor
        if (textcolor) params.textcolor = textcolor
        params.showshoppingcarticon = !!showshoppingcarticon
        params.disbounce = !!disbounce

        // console.log('javascriptBridge setAppToolbar: ', params)
        _.javascriptBridge({
          name: "setAppToolbar", params
        });
      }
    },
    getQueryParamUser(params) {

      let _ = this, queryParam = params || getUrlParam("param");
      // APP进入时先清空登录态再重新通过链接参数自动登录, 防止更换账号未同步更换
      return new Promise((resolve, reject) => {
        if (_.$root.ISAPP || _.$root.ISMP) {
          // 链接参数登录处理
          if (queryParam) {
            try {
              // ?param=%7B"mobile"%3A"%2B86-18571756408","os"%3A"android","deviceid"%3A"867666030892350","version"%3A"3.4.6","token"%3A"j24kWwQP9x%252BY3SddEsWL3vZfPAo4zFTetMnO3wslOOGddllA6oSkiMuA4aOqkcVrs8DOCDKkoSN1rl%252BjLJCl%252BEUEtFxoh5N%252FMEwbmtFSyov1DXu3Ai1W%252BQAJm6wx5BqDWuXds%252Fy%252F7FQ%253D","distributionId"%3A""%7D
              let param = JSON.parse(decodeURIComponent(queryParam)),
                user = _.user || store.getters.userInfo || {};
              if (param.token && (!user.token || user.token != param.token)) {
                _.$store.dispatch("setUserInfo", {});
                LoginAuto(param)
                  .then(res => {
                    _.$store.dispatch("setUserInfo", res);

                    resolve({ param, user: res })
                    $log({ e: 'autologin', p: {}, t: 0, ext: 1 })
                  })
                  .catch(e => {
                    console.error("链接参数自动登录异常: ", e);
                    reject({ code: 3, param, e })
                  });
              } else resolve({ param, user: store.getters.userInfo })
            } catch (e) {
              console.error("deal url query param error: ", e);
              reject({ code: 2, query: queryParam, e })
            }
          } else reject({ code: 1 })
        } else reject({ code: 0 })
      })
    },
    javascriptBridge: window._JSB,
    /**
     * 兼容qzone的跳转
     * @param {String} path 跳转路径
     * @param {String} type 跳转方式，仅使用自带路由时有效，同 路由跳转方式
     */
    qzoneGo(path, type = 'push') { // , route = false
      this.$router[type](path)
    },
    https(val) {
      if (val) {
        let rgx = /http:\/\/(files|api)\.eyee\.com(?!\.(jpg|png|gif|jpeg)).+?\.(jpg|png|gif|jpeg)/gi
        return val.replace(rgx, function (match) {
          return match.replace('http://', 'https://')
        })
      } else return val
    },

    /*
     * 提示
     * msg:String,必须,提示内容
     * icon:String,可无,自定义icon图标类名,若传值则提示位于屏幕中心
     */
    toast(msg, icon = '') {
      if (window._toast) window._toast.close()
      let data = { message: msg, position: 'middle', duration: 3000 }
      if (icon && icon.length > 0) {
        data.iconClass = icon
        data.position = 'middle'
      }
      window._toast = MintUi.Toast(data)
    },
    /*
    * 确认提示框
    * 以对象形式传参
    * msg:String,必须,确认提示信息
    * okText:String,可无,确认按钮文本,默认为'确定'
    * cancelText:String,可无取消按钮文本,默认为'取消'
    * ok:Function,可无,确认操作后的回调函数
    * cancel:Function,可无,取消操作后的回调函数
    * closeOnClickModal 可无，点击背景是否关闭，默认为false
    */
    confirm({ msg, closeOnClickModal = false, confirmButtonClass = '', cancelButtonClass = '', cancelBtn = 0, title = '确认提示', okText = '确定', cancelText = '取消', ok = () => { }, cancel = () => { } }) {
      let data = {
        title: title,
        message: msg,
        confirmButtonText: okText,
        showCancelButton: !cancelBtn,
        cancelButtonText: cancelText,
        confirmButtonClass: confirmButtonClass,
        cancelButtonClass: cancelButtonClass,
        closeOnClickModal: closeOnClickModal
      }
      console.log(title)
      MintUi.MessageBox(data).then(action => {
        if (action === 'confirm') ok()
        else cancel()
      })
    },
    /*
    * 初始化分享
    * sharetype 分享类型 0资讯，1商城，2其他，不传默认2
    * info 分享数据 {title:分享标题,desc:分享描述,img:分享图标/图片}
    */
    initShare({ sharetype = 2, info = {} } = {}) {
      let _ = this
      console.log('分享的数据：' + JSON.stringify(info))
      if (_.$root.ISWX) {
        let url = info.url || window.location.href
        let share = {
          title: info.title || '',
          desc: info.desc || '',
          link: url,
          imgUrl: info.img || ''
        }

        let defaultShare = store.getters.baseValue.shareinfos
        let metaDesc = dom.querySelector('meta[name=description]')
        defaultShare = defaultShare && defaultShare[sharetype]
        if (sharetype === 2) {

        } else {
          console.log('资讯或商城分享', defaultShare)
          if (defaultShare) {
            if (!share.title) share.title = defaultShare.title
            if (!share.desc) share.desc = defaultShare.content
            if (!share.imgUrl) share.imgUrl = defaultShare.icon
          }
        }
        if (!share.title) share.title = dom.title
        if (!share.desc) share.desc = metaDesc && metaDesc.content
        if (!share.imgUrl) share.imgUrl = 'https://files.eyee.com/EYEE/icons/sharelogo.png'

        let result = WxShare(share, store)
        result === false ? console.error('分享初始化失败了') : console.log('初始化分享--', share)
      }
    },

    /*
    * 跳转下载app
    * type === -1 时 为缺省功能提示前往APP的弹框
    */
    loadApp(type) {
      // console.log('跳转下载app', type)
      let option
      if (type === -1) {
        option = {
          title: '',
          msg: '我还在完善中，前往 斗牛APP 操作吧~',
          cancelText: '知道了~',
          okText: '立即前往',
          ok: () => {
            this.sceneLoad()
            // window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee', '_blank');
          }
        }
      } else {
        option = {
          msg: '立即跳转至斗牛APP ?',
          okText: '跳转',
          ok: () => {
            this.openAppClient(type)
            // window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee', '_blank');
          }
        }
      }
      this.confirm(option)
    },
    sceneLoad(scene) {
      let appStore = 'https://itunes.apple.com/cn/app/eyee/id962223967?mt=8'
      let loadLink = 'https://gio.ren/oVxWLoO' // http://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee
      let wxLoadLink = 'https://gio.ren/oVxWLoO'

      switch (scene) {
        case LoadScene.newUserHelp:
          appStore = 'https://gio.ren/rBDmJM1'
          loadLink = 'https://gio.ren/r3Mmv1Y'
          wxLoadLink = 'https://gio.ren/o3p99rd'
          break;
      }

      if (this.$root.ISIOS) window.location = appStore
      else if (this.$root.ISWX) window.location = wxLoadLink
      else window.open(loadLink, '_blank')
    },
    /*
    * 打开APP 或跳转到下载APP页面
    */
    openAppClient(type) {
      const nv = window.navigator
      let _ = this, { path, params, name, query } = _.$route
      // console.log(type)
      // console.log(this.$route.path)
      var pagetype = ''
      let productid, oshoppid, articleid, articletype, brandid, itemid, brandname, categoryname, seriesid, shoeid
      var jsonPara
      var config = {
        /* scheme:必须*/
        scheme_IOS: 'eyee://eyee/h5?paramter=',
        timeout: 600
      }
      // 浏览器所有版本信息
      var browser = {
        versions: (function () {
          let u = nv.userAgent
          // let app = nv.appVersion
          return {
            // 移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, // IE内核
            presto: u.indexOf('Presto') > -1, // opera内核
            webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, // 是否iPad
            webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
            eyee: u.indexOf('platform/app') !== -1
          }
        })(),
        language: (nv.browserLanguage || nv.language).toLowerCase()
      }

      let appStore = 'https://itunes.apple.com/cn/app/eyee/id962223967?mt=8'
      let loadLink = 'https://gio.ren/oVxWLoO' // http://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee

      // APP内直接跳转下载
      if (browser.versions.eyee) {
        window.location.href = browser.versions.ios ? appStore : loadLink
        return
      }

      if (path.indexOf('/mall/limit') >= 0) {
        pagetype = 2
        console.log('limit')
      } else if (path.indexOf('/productDetail') >= 0) {
        pagetype = 3
        productid = params.id
        console.log('productDetail')
      } else if (path.indexOf('/shop/shopdetail') >= 0) {
        pagetype = 4
        oshoppid = params.id
        console.log('shopdetail')
      } else if (path.indexOf('/ghost') >= 0) {
        pagetype = 5
        console.log('ghost')
      } else if (path.indexOf('/news/detail') >= 0) {
        pagetype = 8
        articletype = type
        articleid = params.id
        console.log('articledetl')
      } else if (path.indexOf('/news/picrecomd/') >= 0) {
        pagetype = 8
        articletype = 1
        articleid = params.id
        console.log('picrecomd')
      } else if (path.indexOf('brand') >= 0) {
        if (name.indexOf('brandstore') >= 0) {
          pagetype = 10
          console.log('brandlist')
        }
      } else if (path.indexOf('/brandInfo/') >= 0) {
        pagetype = 11
        brandid = params.id
        console.log('brandinfo')
      } else if (path.indexOf('/BrandDetail/') >= 0) {
        pagetype = 12
        itemid = params.id
        brandname = query.name
        console.log('branditeminfo')
      } else if (path.indexOf('/sneakerSeries/') >= 0) {
        pagetype = 13
        categoryname = params.catyname
        seriesid = params.seriesid
      } else if (path.indexOf('/sneakerDetail/') >= 0) {
        pagetype = 14
        shoeid = params.shoeid
      } else if (path.indexOf('/coupon') >= 0) {
        pagetype = 16
        console.log(pagetype)
      } else if (path.indexOf('/footwearclub/response') >= 0) {
        pagetype = 58
        console.log(pagetype)
      }
      switch (pagetype) {
        // 限量发售页
        case 2:
          jsonPara = '{"pagetype":' + pagetype + '}'
          break
        // 商品详情页
        case 3:
          jsonPara = '{"productid":"' + productid + '","pagetype":' + pagetype + '}'
          break
        // 店铺详情
        case 4:
          jsonPara = '{"shopid":"' + oshoppid + '","pagetype":' + pagetype + '}'
          break
        // 鬼市
        case 5:
          jsonPara = '{"pagetype":' + pagetype + '}'
          break
        // 资讯详情
        case 8:
          jsonPara = '{"articleid":"' + articleid + '","pagetype":' + pagetype + ',"articletype":' + articletype + '}'
          break
        // 品牌库列表页
        case 10:
          jsonPara = '{"pagetype":' + pagetype + '}'
          break
        // 品牌库二级详情
        case 11:
          jsonPara = '{"brandid":"' + brandid + '","pagetype":' + pagetype + '}'
          break
        // 品牌库三级子详情
        case 12:
          jsonPara = '{"itemid":"' + itemid + '","pagetype":' + pagetype + ',"brandname":' + brandname + '}'
          break
        // 潮鞋专区系列页面
        case 13:
          jsonPara = '{"categoryname":"' + categoryname + '","pagetype":' + pagetype + ',"seriesid":' + seriesid + '}'
          break
        // 潮鞋专区详情页面
        case 14:
          jsonPara = '{"shoeid":"' + shoeid + '","pagetype":' + pagetype + '}'
          break
        // 优惠券列表页
        case 16:
          jsonPara = '{"pagetype":' + pagetype + '}'
          break
        // 潮友团广场
        case 58:
          jsonPara = '{"pagetype":' + pagetype + ',"tabindex":' + 0 + '}'
          break
        // 潮友团首页
        case 60:
          jsonPara = '{"pagetype":' + pagetype + '"teamid":' + itemid + '"tabindex":' + 2 + '}'
          break
      }
      var ifr = dom.createElement('iframe')
      ifr.style.display = 'none'
      dom.body.appendChild(ifr)
      // console.log(jsonPara)
      ifr.src = config.scheme_IOS + jsonPara

      // 判断系统浏览器
      var loadDateTime = new Date()
      setTimeout(function () {
        var timeOutDateTime = new Date()
        if (timeOutDateTime - loadDateTime < 5000) {
          if (browser.versions.mobile) {
            // 判断是否是移动设备打开。browser代码在下面
            var uaa = nv.userAgent.toLowerCase() // 获取判断用的对象
            if (browser.versions.ios) {
              if (/micromessenger/.test(uaa)) {
                window.open(appStore, '_blank') // 'http://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee'
              } else if (uaa.match(/QQ/i) == 'qq') {
                setTimeout(function () {
                  window.location = appStore // 'https://itunes.apple.com/cn/app/eyee/id962223967?mt=8'
                }, 10)
              } else {
                setTimeout(function () {
                  window.location = appStore // 'https://itunes.apple.com/cn/app/eyee/id962223967?mt=8'
                }, 10)
              }
            } else if (browser.versions.android) {
              var state = null
              if (/micromessenger/.test(uaa)) {
                window.open(loadLink, '_blank') // 'http://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee'
              } else if (uaa.match(/QQ/i) == 'qq') {
                state = null
                try {
                  state = window.open(loadLink, '_blank') // 'http://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee'
                } catch (e) {
                }
                if (state) {
                  window.close()
                } else {
                  window.location = config.scheme_IOS + jsonPara
                }
              } else {
                state = null
                try {
                  state = window.open(loadLink, '_blank') // 'http://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee'
                } catch (e) {
                }
                if (state) {
                  window.close()
                } else {
                  window.location = config.scheme_IOS + jsonPara
                }
              }
            }
          }
        } else {
          window.close()
        }
      }, 500)
      window.location = config.scheme_IOS + jsonPara
    }
  }
})

/* eslint-disable no-new */
window.$vue = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  data: {
    ISAPP: ENV.ua.eyee, // 判断是否在APP中打开h5页面
    ISIOS: ENV.ua.ios, // 判断移动端是否为ios
    ISWX: ENV.ua.wx, // 判断是否在微信中
    ISMP: ENV.ua.mini, // 判断是否在微信小程序中
    ISOpenBee: true,
    isdebug: ISDEV,
    share: {
      title: '', // 分享标题
      desc: '', // 分享描述
      link: '', // 分享链接
      imgUrl: '' // 分享图标
    },
    Bus: new Vue(), // 非父子组件用来传递事件和接收事件
    showLoadModal: false
  },
  beforeCreate() {
    console.log('===> inject $DONEW:', window.$DONEW)

    setTimeout(() => {
      let pf = performance.getEntries()[0] || {}
      $log({ e: $log.event.enter, p: { d: pf.domInteractive | 0, l: pf.duration | 0 }, ts: parseInt(performance.timeOrigin) })
    }, 1800);
    // getIp().then(ip => window.getip = ip)
    // 阻止冒泡的点击统计不到
    // document.addEventListener('click', function (e) {
    //   let tg = e.target || e.currentTarget
    //   let param = {
    //     s: window.scrollY,
    //     x: e.pageX,
    //     y: e.pageY,
    //     t: tg.tagName || tg.nodeName,
    //     c: tg.className
    //   }
    //   // console.log('-----------', param, e)
    //   $log({ e: $log.event.click, p: param })
    // })

    // 微信环境下引入微信jssdk
    if (/micromessenger/.test(window.navigator.userAgent.toLowerCase())) {
      var wxJsSdk = dom.createElement('script')
      wxJsSdk.id = '_wx_js_sdk'
      // wxJsSdk.src = '//res.wx.qq.com/open/js/jweixin-1.2.0.js'
      wxJsSdk.src = '//res.wx.qq.com/open/js/jweixin-1.3.2.js'
      dom.head.appendChild(wxJsSdk)
    }

    window.gio = function () { }
  },
  created() {
    // 组件创建完后获取数据，
    // 此时 data 已经被 observed 了
    this._initAgent()
    // 页面pv统计页面被打开多少次
    // $log({ e: 'pagecreate', p: {}, t: 0, ext: 1 })
  },
  methods: {
    _initAgent() {
      let _ = this
      // let u = window.navigator.userAgent
      // _.ISAPP = u.indexOf('platform/app') !== -1
      // _.ISIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      // _.ISWX = /micromessenger/.test(u.toLowerCase())
      // _.ISMP = /miniprogram/.test(u.toLowerCase())

      function ready() {
        _.ISMP = window.__wxjs_environment === 'miniprogram'
      }
      if (!window.WeixinJSBridge || !WeixinJSBridge.invoke) {
        document.addEventListener('WeixinJSBridgeReady', ready, false)
      } else {
        ready()
      }
    }
  }
})
