<template>
  <div class="wheel-page">
    <!-- <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3 class="bold">斗牛DoNew</h3>
      </div>
    </v-header>-->
    <loader-app class="load" ref="load" from="13" :showLoadModal='1' v-show="false"></loader-app>
    <div class="content_box">
      <img v-lazy="'https://files.eyee.com/mcdn/img/coupon/bg1.png'" alt />
      <img v-lazy="'https://files.eyee.com/mcdn/img/coupon/bg2.png'" alt />
      <div class="coupon_box flex-center flex-col">
        <div class="getcoupoon_butn" :class="{'toApp_butn':isGetCoupon}" @click="getCoupon"></div>
        <div class="detl_butn" @click="gotoDetl">活动详情</div>
      </div>
    </div>
    <!-- 登录组件 -->
    <com-login-util
      :fatherClass="wheel_box"
      :isShow="loginModel"
      :IsmainOrsub="false"
      @close="loginModel=false"
      @loginSuc="loginSuccess"
    ></com-login-util>
  </div>
</template>
<script>
import comLoginUtil from "@/comps/comLogin";
import { GetCouponByCdKey } from "@/common/api/marketing.js";
import { mapGetters } from "vuex";
import { LoadScene } from "@/utils/enum";
import LoaderApp from "@/comps/Loader";
export default {
  components: { comLoginUtil, LoaderApp },
  data() {
    return {
      wheel_box: "wheel_box",
      loginModel: false,
      isGetCoupon: false,
      couponCode: "A9qg5e"
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    uid() {
      return !!(this.user && this.user.uid);
    },
    getIsIphonex() {
      if (this.$root.ISIOS) {
        if (
          (screen.height == 812 && screen.width == 375) ||
          (screen.width === 414 && screen.height === 896)
        ) {
          return true;
        } else {
          return false;
        }
      } else if (screen.height > 736) {
        return true;
      } else {
        return false;
      }
    }
  },
  beforeCreate: function() {
    document.getElementsByTagName("body")[0].className = "wheel_bg";
  },
  beforeDestroy: function() {
    document.body.removeAttribute("class", "wheel_bg");
  },
  mounted() {
    console.log(this.$root.isdebug);
    let domain = this.$root.isdebug
      ? "https://qzone.eyee.com"
      : "https://m.eyee.com";
    this.initShare({
      info: {
        title: "斗牛DoNew",
        desc: "潮流收藏品交易品台",
        img: "",
        url: domain + "/wheel"
      }
    });
  },
  methods: {
    gotoDetl() {
      this.$router.push("/active/4e3d570b822a4213b1ebf44bae2d14fd");
    },
    getCoupon() {
      let _ = this;
      if (!_.isGetCoupon) {
        if (!_.uid) {
          _.loginModel = true;
        } else {
          _.getMyCoupons();
        }
      }
      if (_.isGetCoupon) {
        // _.openAppClient()
        _.load();
      }
    },
    // 领取优惠券
    getMyCoupons() {
      let _ = this,
        option = {
          token: _.user.token,
          cdkey: _.$root.isdebug ? "At3r23" : "A9qg5e"
        };
      GetCouponByCdKey(option)
        .then(res => {
          _.toast("优惠券领取成功!");
          _.isGetCoupon = true;
          setTimeout(() => {
            _.load();
          }, 1500);
        })
        .catch(err => {
          console.log(err.msg);
          if (err && err.msg) {
            if (err.msg == "已领取") {
              _.toast("您已领取过优惠券，请前往斗牛APP使用");
              _.isGetCoupon = true;
              setTimeout(() => {
                _.load();
              }, 1500);
            } else {
              _.toast(err.msg);
              _.isGetCoupon = false;
            }
          }
        });
    },
    loginSuccess(msg) {
      console.log(msg);
      this.getMyCoupons();
    },
    load() {
      let _ = this;
      _.$refs.load.$el.click();
      //   url = "https://files.eyee.com/app/update/eyee.apk";
      // if (_.$root.ISIOS)
      //   url = "https://itunes.apple.com/cn/app/eyee/id962223967?mt=8";
      // window.location.href = url;
    }
  }
};
</script>
<style>
body.wheel_bg {
  height: 100%;
  background-color: #fff1e6;
}
.wheel_box .login-wrap.act .mock_box {
  position: relative;
  width: 82.4vw;
  height: 102.4vw;
  left: 50%;
  padding: 45.07vw 6.67vw 0;
  background: url("https://files.eyee.com/mcdn/img/coupon/whel04.png") 0 0
    no-repeat;
  background-size: 100%;
}
.wheel_box .login-wrap.act .mock_box .close_butn {
  position: absolute;
  right: 6.13vw;
  top: 4.8vw;
  width: 3.73vw;
  height: 3.73vw;
  background-image: url(https://files.eyee.com/mcdn/img/coupon/whel06.png);
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
}
.wheel_box .login-wrap.act .title {
  width: 0;
  background: none;
  height: 0;
  margin-bottom: 0;
}
.wheel_box .login-wrap.act .inputdiv,
.wheel_box .login-wrap.act .btn_box {
  padding-left: 0;
  padding-right: 0;
}
.wheel_box .login-wrap .phone-code {
  position: relative;
  height: 11.2vw;
  line-height: 11.2vw;
  background: transparent;
  box-shadow: none;
  margin-bottom: 5.33vw;
}

.wheel_box .login-wrap .phone-code input {
  height: 11.2vw;
  /* line-height: 10.67vw; */
  padding: 3.47vw 4vw;
  background: transparent;
  border-radius: 2.13vw;
  color: #060007;
  border-radius: 6.67vw;
  border: 0.53vw solid #232323;
  font-weight: 600;
  font-size: 4.27vw;
  line-height: 4.27vw;
  line-height: normal;
  line-height: 16px\9;
}
.wheel_box .login-wrap .login-verify.phone-code input {
  width: 41.6vw;
}
.wheel_box .login-wrap .login-verify .btn {
  width: 24.8vw;
  height: 11.47vw;
  text-align: center;
  padding-right: 0;
  font-size: 12px;
  color: #232323;
  margin-left: 1.6vw;
  line-height: 11.47vw;
  background-image: url(https://files.eyee.com/mcdn/img/coupon/whel07.png);
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  background-color: transparent;
}
.wheel_box .login-wrap .login-verify .btn.btnclicked {
  background-image: url(https://files.eyee.com/mcdn/img/coupon/whel10.png);
}
.wheel_box .login-wrap .btn_box {
  width: 100%;
  padding-top: 0;
  background-color: transparent;
  overflow: hidden;
}
.wheel_box .login-wrap .btnitem {
  width: 100%;
  height: 13.33vw;
  line-height: 13.33vw;
  color: #fff;
  background: none;
  /* border-radius: 25px; */
  background-image: url(https://files.eyee.com/mcdn/img/coupon/whel09.png);
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  /* border:2px solid #060007; */
  box-shadow: none;
  /* background-color: yellow; */
}
.wheel_box .login-wrap .btnitem.ableBunt {
  background-image: url(https://files.eyee.com/mcdn/img/coupon/whel08.png);
}
</style>
<style scoped>
.wheel-page {
  background-color: #fff1e6;
}
.wheel-page .content_box {
  position: relative;
}
.wheel-page .content_box img {
  display: block;
}
.wheel-page .coupon_box {
  width: 100%;
  /* height: 30vw; */
}
.getcoupoon_butn {
  width: 85.07vw;
  height: 20.8vw;
  margin: 6vw auto 0;
  background-image: url(https://files.eyee.com/mcdn/img/coupon/whel01.png);
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: 0 0;
  border-radius: 0;
}
.getcoupoon_butn.toApp_butn {
  background-image: url(https://files.eyee.com/mcdn/img/coupon/whel011.png);
}
.detl_butn {
  width: 22.67vw;
  height: 5.87vw;
  margin: 0 auto;
  color: #232323;
  font-size: 16px;
  margin-top: 10px;
  background-image: url(https://files.eyee.com/mcdn/img/coupon/whel05.png);
  background-repeat: no-repeat;
  background-size: 14px 11px;
  background-position: right center;
  border-radius: 0;
}
</style>

