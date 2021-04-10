<template>
  <div class="join-home">
    <div class="jn-vip">
      <div class="jn-head">
        <div class="hd-avatar" :class="vipInfo.openvip?'open':'unopen'">
          <img v-if="user.imageurl"
            :src="user.imageurl"
            alt
          >
        </div>
        <div class="hd-info">
          <h2>{{user.username||'--'}}</h2>
          <p>未成为潮牌合伙人</p>
        </div>
      </div>
      <div class="jn-card">
        <h3>合伙人权益</h3>
        <p>按去年用户消费计算 一年预计省 ¥{{vipInfo.saveamount}}</p>
        <p class="jn-see">查看合伙人<span class="font-price">12</span>大权益</p>
        <div>
          <img
            src="//files.eyee.com/activity/vip/card-vip.png"
            alt="斗牛年卡"
          >
        </div>
        <div class="jn-info">
          <img
            src="//files.eyee.com/activity/vip/bg-weal-light.png?c=1"
            alt
          >
        </div>
      </div>
  </div>
  <div class="jn-footer">
    <p>加入即视为同意 <span class="hd-tip" @click="gotovip">斗牛潮牌合伙人服务协议</span></p>
    <div class="jn-btn" @click="payBtnHandle">点击付款 开启合伙人之旅</div>
  </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'VipJoin',
  data() {
    return {
      vipInfo: {}
    }
  },
  beforeMount() {
    const _ = this
    const { via } = _.$route.query
    console.log(' invite code: ', via)
    if (!via) return _.$router.replace('/vip/prejoin')
    _.setToolBar({
      title: '加入潮牌合伙人',
      bgcolor: '#232323',
      textcolor: '#ffffff'
    })
    _.vipInfo = JSON.parse(sessionStorage.getItem("vipInfo"))
  },
  mounted() {
    let _ = this
    // let { hostName } = _
    window._appPayCallback = function(ret) {
      // 0：支付失败，1：支付成功，2：取消支付，3：弹框的确认操作
      console.log('_appPayCallback status:', ret)
      if (Number(ret) === 1) {
        // _.$router.replace('/vip')
        _.$router.go(-1)
      }
    };
  },
  computed: {
    ...mapGetters({ user: 'userInfo' })
  },
  methods: {
    payBtnHandle() {
      let _ = this
      const { via } = _.$route.query
      if(!via) {
        _.$router.replace('/vip/invite')
      } else {
        _.javascriptBridge({
          name: "callAppPayment",
          params: {
            callbackname: "_appPayCallback",
            paymoney: _.vipInfo.payamount, //orderinfo.paymoney,
            listreq: {
              orderno: _.vipInfo.orderno,
              paytype: 2
            },
            prepayreq: {
              orderno: _.vipInfo.orderno,
              paysource: 26,
              dataid: via
            }
          }
        })
      }
    },
    gotovip() {
      let _ = this
      window.location.href = _.vipInfo.viptexturl
    },
  }
}
</script>
<style lang="scss" scoped>
.join-home {
  background-color: #F5F5F5;

  img {
    display: block;
  }
  .jn-vip {
    position: relative;
    padding-bottom: 140px;
    overflow: hidden;

    &::before {
      position: absolute;
      z-index: 1;
      content: '';
      top: 0;
      right: 0;
      left: 0;
      height: 30%;
      background: linear-gradient(0deg, #464545 0%, #232323 100%);
    }
    &::after {
      position: absolute;
      content: '';
      top: -4%;
      right: 0;
      left: 0;
      width: 93%;
      height: 48.1%;
      background: linear-gradient(0deg, #464545 0%, #464545 100%);
      transform: rotate(131deg) skewY(22deg);
    }
  }
  .jn-head {
    position: relative;
    z-index: 1;
    display: flex;
    padding: 15px 15px 15px 20px;
  }
  .hd-avatar {
    width: 40px;
    height: 40px;
    background: url(//files.eyee.com//user/defaultUserIcon.png) no-repeat;
    background-size: contain;
    border-radius: 100%;
    overflow: hidden;
  }
  .open {
    border: 1px solid #EAC39D;
  }
  .unopen {
    border: 1px solid #fff;
  }
  .hd-info {
    flex: 1;
    line-height: 22px;
    padding-left: 10px;

    h2 {
      font-size: 16px;
      color: #fff;
    }
    p {
      font-size: 12px;
      color: #CBCBCB;
    }
  }
  .jn-card {
    position: relative;
    z-index: 1;
    min-height: 135px;
    background-color: #fff;
    border-radius: 10px;
    margin: 0 15px;
    padding: 20px 15px 15px 15px;
    text-align: center;
    line-height: 22px;
    font-size: 13px;
    color: #523A23;

    h3 {
      background: linear-gradient(306deg, #dfa46c 0%, #eaaf78 47%, #ffc791 57%, #e8ad76 65%, #bb834d 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 15px;
      font-size: 22px;
      font-weight: 900;
      color: #523A23;
    }
    span {
      padding: 0 3px;
      font-size: 18px;
      font-weight: bold;
    }
    .jn-see {
      padding: 5px 0 5px;
    }
  }
  .jn-info {
    margin-top: 10px;
  }
  .jn-footer {
    position: fixed;
    z-index: 1;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 20px 15px;
    background-color: #fff;
    box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 1px rgba(0,0,0,.12);
    text-align: center;
    font-size: 13px;
    p {
      color: #646464;
    }
    span {
      color: #232323;
    }
  }
  .jn-btn {
    margin-top: 15px;
    line-height: 50px;
    background-color: #232323;
    border-radius: 2px;
    text-align: center;
    color: #FFEEDE;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
