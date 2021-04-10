<template>
  <div class="wrapper flex flex-col">
    <v-headerscopy v-if="!$root.ISAPP && !$root.ISMP" bg="luckDraw">
      <div class="nav-tab2">
        <h3 style="color: #000">斗牛穿搭学院</h3>
      </div>
    </v-headerscopy>
    <div class="header-wrapper flex flex-col">
      <!-- <span class="back_icon"
            @click="goBack"
            v-if="!$root.ISAPP && !$root.ISMP"></span> -->
      <div class="reward-explain"
           @click="toRoute('https://m.eyee.com/active/dbae51e111b74491bcc150ebf3bc7ec5')">奖励说明</div>
      <img class="header-img"
           :src="`https://files.eyee.com/eyeeh5/img/promote/school-bg.png?c=${new Date().getTime()}`">
      <div class="block-bg">
      </div>
      <div class="card-block">
        <div class="card">
          <div class="flex flex-between flex-aic">
            <span class="card-reward">获得奖励</span>
            <div class="card-order"
                 @click="toRoute('/promotion/order/detail')">
              返利订单
              <span class="icon-right-white"></span>
            </div>
          </div>
          <div class="flex flex-btwn white-card-content">
            <div class="white-card flex flex-col flex-center">
              <p class="white-card-price"> <span class="yen">¥</span>{{countInfo && countInfo.finishsettle || 0.00}}</p>
              <p class="white-card-txt">累积已结算</p>
            </div>
            <div class="white-card flex flex-col flex-center">
              <p class="white-card-price"><span class="yen">¥</span>{{countInfo && countInfo.waitsettle || 0.00}}</p>
              <p class="white-card-txt">待结算</p>
            </div>
          </div>

          <div v-if="countInfo && !countInfo.isbindalipay"
               class="card-bindpay flex flex-center"
               @click="bindZFB">
            请完成支付宝绑定，便于快速结算
            <span class="icon-right-orange"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { rebateinfo ,identifyinfo} from '@/common/api/active'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      countInfo: null,
      idinfo: null
    }
  },
  computed: {
    ...mapGetters({ user: 'userInfo' }),
    uid() {
      return !!(this.user && this.user.uid)
    }
  },
  created() {
    const _ = this
    if (_.$root.loging) {
      _.$root.loging
        .then(($) => {
          this.islogin()
        })
        .catch((e) => {
          this.islogin()
          console.error('query prams auto login error:', e)
        })
    } else {
      this.islogin()
    }
  },
  mounted() {
    const _ = this
    this.setToolBar({
      title: '斗牛穿搭学院',
      bgcolor: '#f5f5f5',
      textcolor: '#323232'
    })
    window._appcallback = (ret) => {
      if (ret == 1) {
        // 支付成功条转抽抽乐抽奖页面
        _.toast('绑定成功~')
        _.islogin()
        console.log('ret--', ret)
        delete window._appcallback
      } else {
        _.toast('绑定失败~')
      }
    }
    window._appLoginCallback = function (json) {
      if (json) {
        _.toast('登录成功~')
        _.getQueryParamUser(json).then((res) => {
          _.getInfo()
        })
      } else _.toast('登录失败~')
    }
  },
  methods: {
    islogin() {
      const _ = this
      if (!this.uid) {
        _.confirm({
          title: '登录提示',
          msg: '请登录后重试~',
          okText: '前往登录',
          cancelText: '容我想想',
          ok: () => {
            if (ENV.ua.eyee) {
              _.javascriptBridge({
                name: 'callAppLoginPage',
                params: { callbackname: '_appLoginCallback' }
              })
            } else if (ENV.ua.mini) {
              wx.miniProgram.navigateTo({
                url: '/pages/other/bind'
              })
            } else _.$router.push('/login')
          }
        })
        return
      } else {
        this.getInfo()
      }
    },
    bindZFB() {
      if (this.$root.ISAPP) {
        identifyinfo().then(res=>{
           this.javascriptBridge({
            name: 'callAppBindAlipay',
            params: {
              needidentify: res.needidentify,
              callbackname: '_appcallback'
            }
          })
        })
      } else if (this.$root.ISMP) {
        this.toast('暂不支持提现绑定 请下载或者打开 斗牛APP 进行绑定～')
      }
    },
    getInfo() {
      const _ = this
      rebateinfo()
        .then((res) => {
          console.log('穿搭学院结果 ==>', res)
          if (res) {
            this.countInfo = Object.assign({}, res)
          }
        })
        .catch((err) => {
          console.error('穿搭学院报错 ===> ', err)
        })
    },
    goBack() {
      this.$router.go(-1)
    },
    toRoute(url) {
      if (!url) return
      if (url.includes('http')) {
        url = url.split('active')[1]
        this.$router.push('/active' + url)
      } else {
        this.$router.push(url)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header-wrapper {
  position: relative;
  flex: 1;
}

.icon-right-white {
  display: inline-block;
  width: 3.2vw;
  height: 3.2vw;
  background: url('https://files.eyee.com/eyeeh5/img/promote/icon_white.png')
    no-repeat;
  background-size: contain;
}

.icon-right-orange {
  display: inline-block;
  width: 3.2vw;
  height: 3.2vw;
  background: url('https://files.eyee.com/eyeeh5/img/promote/icon_black.png')
    no-repeat;
  background-size: contain;
}

.back_icon {
  display: inline-block;
  width: 8vw;
  height: 8vw;
  background: url('https://files.eyee.com/eyeeh5/img/promote/school-back.png')
    no-repeat;
  background-size: contain;
  position: absolute;
  top: 13.33vw;
  left: 2.67vw;
}
.txt-over-2 {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-block {
  position: absolute;
  left: 0;
  top: 77.33vw;
  width: 100%;
  padding: 0 4vw;
}

.card-wrapper {
  padding: 0 4vw;
  position: relative;
}

.card {
  width: 100%;
  min-height: 40vw;
  background: linear-gradient(276.9deg, #5451bc 0%, #121a7a 100%);
  border-radius: 3.2vw;
  padding: 4vw;
  color: #fff;
}

.card-reward {
  font-weight: 600;
  font-size: 4.8vw;
  color: #ffffff;
}

.card-order {
  font-weight: 600;
  font-size: 3.73vw;
  color: #ffffff;
}

.white-card-content {
  padding-top: 4vw;
}

.white-card {
  width: 40.8vw;
  height: 24.27vw;
  background-color: #fff;
  border-radius: 2.67vw;
}

.white-card-price {
  font-family: 'OswaldBold';
  font-weight: bold;
  font-size: 6.4vw;
  color: #000000;
  margin-bottom: 1.33vw;
}

.white-card-txt {
  font-weight: 500;
  font-size: 3.73vw;
  text-align: center;
  color: #000000;
}

.card-bindpay {
  width: 100%;
  height: 8.53vw;
  line-height: 8.53vw;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 9.07vw;
  font-weight: normal;
  font-size: 3.73vw;
  color: #ffa000;
  margin-top: 4vw;
}

.classCard {
  width: 100%;
  height: 41.33vw;
  background: linear-gradient(276.9deg, #5451bc 0%, #121a7a 100%);
  border-radius: 3.2vw;
  margin-top: 3.2vw;
}

.classCard-img {
  width: 100%;
  height: 100%;
  border-radius: 3.2vw;
}

.classCard-title {
  display: inline-block;
  font-weight: normal;
  font-size: 3.47vw;
  color: #ffffff;
  margin-bottom: 2.67vw;
}

.classCard-content {
  padding-top: 4vw;
  // border-top: 1px solid rgba(111, 251, 163, 0.3);
}

.content-left-img {
  width: 21.33vw;
  height: auto;
  border-radius: 3.2vw;
  vertical-align: bottom;
}

.content-left {
  width: 21.33vw;
  height: 21.33vw;
  border-radius: 3.2vw;
  margin-right: 3.2vw;
  background: #fff;
}

.content-right {
  color: #fff;
  width: 59.47vw;
}

.content-right-des {
  font-weight: 600;
  font-size: 4vw;
}

.content-right-btn {
  width: 22.93vw;
  height: 9.6vw;
  line-height: 9.6vw;
  text-align: center;
  border-radius: 9.07vw;
  background: #00b4c3;
  font-weight: 600;
  font-size: 3.73vw;
}

.content-right-watchnum {
  font-weight: normal;
  font-size: 3.47vw;
  align-items: flex-end;
}

.reward-explain {
  width: 17.07vw;
  height: 7.49vw;
  line-height: 7.49vw;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  border-top-left-radius: 4vw;
  border-bottom-left-radius: 4vw;
  font-weight: 500;
  font-size: 3.2vw;
  color: #fff;
  z-index: 1;
  position: absolute;
  top: 10.13vw;
  right: 0;
}

.yen {
  font-family: OswaldBold;
  font-weight: bold;
  font-size: 4.27vw;
  margin-right: 4px;
}

.header-img {
  vertical-align: bottom;
}

.block-bg {
  flex: 1;
  width: 100%;
  background: linear-gradient(#06C5CD, #01ACBE);
}
</style>
