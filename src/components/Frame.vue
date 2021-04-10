<template>
  <div class="fix-frame">
    <iframe :src="link" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</template>
<script>
const domain = process.env.SITE_DOMIN // 'https://m.eyee.com' // 'https://qzone.eyee.com'
const getUrl = route => {
  let path = route.params.path
  let query = route.query

  // if (path.indexOf('wxpaybin') > -1) return decodeURIComponent(route.query.link)
  // else {
  let url = `${/https?:\/\//.test(path) ? '' : domain}${path}${window.location.search}`
  let openData = JSON.parse(window.localStorage.getItem('FC_QZONE_OPENDATA') || '{}')
  return `${url}${url.indexOf('?') > -1 ? '&' : '?'}openid=${openData.openid || query.openid || ''}&_wwv=128&ADTAG=qzone` // ${!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? '&_nav_bgclr=ffffff&_wv=1' : ''}
  // }
}
export default {
  data() {
    return {
      link: ''
    }
  },
  beforeRouteEnter: (to, from, next) => {
    console.log('frame path', to.params.path)
    let path = to.params.path
    if (path.indexOf('/pay/') > -1) {
      let url = getUrl(to)
      if (window.mqq) {
        window.mqq.invoke('ui', 'openUrl', {
          url: url,
          // 0为当前webview打开,1为新的webview打开,2为外部浏览器打开
          target: 1,
          // 0: 顶部标题栏模式（无底部工具栏）,1: 顶部标题栏无分享入口（无底部工具栏）,2: 底部工具栏模式（顶部标题依然会存在）,3: 底部工具栏模式且顶部无分享入口（顶部标题依然会存在）
          style: 1
        })
        next(vm => {
          vm.$router.back()
        })
        return
      }
    }
    next()
  },
  beforeMount() {
    // let path = this.$route.params.path
    // let url = `${/https?:\/\//.test(path) ? '' : domain}${path}${window.location.search}`
    // let openData = JSON.parse(window.localStorage.getItem('FC_QZONE_OPENDATA') || '{}')
    // this.link = `${url}${url.indexOf('?') > -1 ? '&' : '?'}openid=${openData.openid || ''}`
    this.link = getUrl(this.$route)
    // console.log('frame beforeMount', this.link, this.$route)

    // if (window.mqq) {
    //   // 配置webview顶部按钮的标题、点击回调等
    //   window.mqq.ui.setTitleButtons({
    //     left: {
    //       title: '潮物',
    //       callback: function () {
    //         // var history = window.history
    //         // if (history.state && history.state.key !== (window.firstState || {}).key) history.back()
    //         // else window.mqq.ui.popBack()
    //         window.mqq.ui.popBack()
    //       }
    //     }
    //   })
    // }
  }
}
</script>

