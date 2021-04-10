<template>
  <div class="getcoupon-page">
    <!-- <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3 class="bold">斗牛DoNew</h3>
      </div>
    </v-header> -->
    <div class="content_box">
      <img src="https://files.eyee.com/mcdn/img/coupon/getcoupon_01.png" alt="">
      <div class="coupon_box">
        <div class="getcoupoon_butn" :class="{'toApp_butn':isGetCoupon}" @click="getCoupon"></div>
      </div>
      <img src="https://files.eyee.com/mcdn/img/coupon/getcoupon_07.png" alt="">
    </div>
    <!-- 登录组件 -->
    <com-login-util :fatherClass='getCoupon_box' :isShow="loginModel" :IsmainOrsub="false" @close="loginModel=false" @loginSuc='loginSuccess'></com-login-util>
  </div>
</template>
<script>
import comLoginUtil from "@/comps/comLogin";
import { GetCouponByCdKey } from '@/common/api/marketing.js'
import { mapGetters } from "vuex";
export default {
  components: { comLoginUtil },
  data() {
    return {
      getCoupon_box:'getCoupon_box',
      loginModel:false,
      isGetCoupon:false,
      couponCode:'A2grn6'
    }
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    uid() {
      return !!(this.user && this.user.uid);
    },
    getIsIphonex() {
      if (this.$root.ISIOS) {
        if ( (screen.height == 812 && screen.width == 375) || (screen.width === 414 && screen.height === 896)) {
          return true;
        } else {
          return false;
        }
      }else if(screen.height>736){
        return true
      }else{
        return false
      }
    }
  },
  // beforeCreate: function() {
  //   document.getElementsByTagName("body")[0].className = "getcoupon_bg";
  // },
  // beforeDestroy: function() {
  //   document.body.removeAttribute("class", "getcoupon_bg");
  // },
  mounted() {
    console.log(this.$root.isdebug)
    let domain = this.$root.isdebug ? 'https://qzone.eyee.com':'https://m.eyee.com'
    this.initShare({
      info: {
        title: '斗牛周年庆来袭，巨额优惠券绝密大放送！',
        desc: '全场通用，有效期7天！',
        img: 'https://files.eyee.com/mcdn/img/coupon/getcoupon_06.png',
        url: domain + '/getcoupon'
      }
    });
  },
  methods: {
    getCoupon(){
      let _ = this
      if (!_.$root.ISAPP && !_.isGetCoupon) {
        if (!_.uid) {
          _.loginModel = true
        } else {
          _.getMyCoupons()
        }
      }
      if(!_.$root.ISAPP && _.isGetCoupon){
        _.openAppClient()
      }
    },
    // 领取优惠券
    getMyCoupons(){
      let option = {
        token: this.user.token,
        cdkey: this.couponCode
      };
      GetCouponByCdKey(option).then(res => {
        this.toast("优惠券领取成功!");
        this.isGetCoupon = true
      }).catch(err => {
        console.log(err.msg);
        if (err && err.msg ) {
          if(err.msg == '已领取'){
            this.toast('您已领取过优惠券，请前往斗牛APP使用')
            this.isGetCoupon = true
          }else{
            this.toast(err.msg);
            this.isGetCoupon = false
          }
        }
      });
    },
    loginSuccess(msg){
      console.log(msg)
      this.getMyCoupons()
    }
  }
};
</script>
<style>
  /* .getcoupon_bg{
    height:95.81vh;
    background: url('https://files.eyee.com/mcdn/img/coupon/footer_bg.png') repeat center;
  } */

  .getCoupon_box .login-wrap.act .mock_box{
    position: relative;
    width: 82.67vw;
    height: 80vw;
    padding: 6.27vw 7.2vw 8vw;
    background: url('https://files.eyee.com/mcdn/img/coupon/getcoupon_pop.png') 0 0 no-repeat;
    background-size: 100%;
  }
  .getCoupon_box .login-wrap.act .mock_box .close_butn{
    position: absolute;
    right: 23px;
    top: 18px;
    width: 24px;
    height: 25px;
    background-image: url(https://files.eyee.com/mcdn/img/coupon/icon_close.png);
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
  }
  .getCoupon_box .login-wrap.act .title{
    width: 48vw;
    background: none;
    height: 21.2vw;
    margin-bottom: 5.33vw;
  }
  .getCoupon_box .login-wrap.act .inputdiv, .getCoupon_box .login-wrap.act .btn_box {
    padding-left: 0;
    padding-right: 0;
  }
  .getCoupon_box .login-wrap .phone-code{
    height: 10.67vw;
    line-height: 10.67vw;
    background: transparent;
    box-shadow: none;
    position: relative;
  }
  .getCoupon_box .login-wrap .phone-code:first-child::before{
    position: absolute;
    left: 0;
    top: 0.27vw;
    width: 13vw;
    height: 10.67vw;
    line-height: 10.67vw;
    padding: 0 0 0 10px;
    content:'+86 |';
    font-size: 12px;
    color: #434343;
  }

  .getCoupon_box .login-wrap .phone-code input{
     height: 10.67vw;
    /* line-height: 10.67vw; */
    padding: 3.47vw 2.67vw;
    background: #fff9f9;
    border-radius: 2.13vw;
    font-size: 3.73vw;
    line-height: 3.73vw;
    line-height: normal;
    line-height: 22px\9;
  }
  .getCoupon_box .login-wrap .phone-code:first-child input{
    padding-left: 11.73vw;
  }
  .getCoupon_box .login-wrap .login-verify.phone-code input{
    width: 42.67vw;
  }
  .getCoupon_box .login-wrap .login-verify .btn{
    width: 25.3vw;
    height: 10.67vw;
    text-align: center;
    padding-right: 0;
    font-size: 12px;
    color: #3d3d3d;
    margin-left: 1.6vw;
    line-height: 10.67vw;
    background-image: url(https://files.eyee.com/mcdn/img/coupon/getcoupon_bg.png);
    background-repeat: no-repeat;
    background-size: 192vw;
    background-position: -82.93vw -19.73vw;
    border-radius: 2.13vw;
    background-color: transparent;
  }
  .getCoupon_box .login-wrap .btn_box{
    width: 100%;
    height: 10.3vw;
    padding-top: 0;
    background-color: transparent;
    border-radius: 2.13vw;
    overflow: hidden;
  }
  .getCoupon_box .login-wrap .btnitem{
    width: 100%;
    height: 10.3vw;
    line-height: 10.3vw;
    color: transparent;
    background-color: transparent;
    background-image: url(https://files.eyee.com/mcdn/img/coupon/getcoupon_bg.png);
    background-repeat: no-repeat;
    background-size: 333.87vw;
    background-position: -10.93vw -77.6vw;

  }
</style>
<style scoped>
  .getcoupon-page{
    background-color: #DD704D;
  }
  .getcoupon-page .content_box img{
    display: block;
  }
  .coupon_box{
    height: 97.87vw;
    background-image: url('https://files.eyee.com/mcdn/img/coupon/getcoupon_02.png');
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: center;
    margin-top: -0.27vw;
    padding-top: 74.13vw;
  }
  .getcoupoon_butn{
    width: 89.33vw;
    height: 11.6vw;
    margin: 0 auto;
    background-image: url(https://files.eyee.com/mcdn/img/coupon/getcoupon_bg.png);
    background-repeat: no-repeat;
    background-size: 347.74vw;
    background-position: -11.2vw -39.47vw;
    border-radius: 2.14vw;
  }
  .getcoupoon_butn.toApp_butn{
    background-size: 346.67vw;
    background-position: -105.33vw -80.27vw;
  }
</style>

