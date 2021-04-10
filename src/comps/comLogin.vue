<template>
  <!-- 登录 -->
  <div :class="[fatherClass]">
    <div class="login-wrap" :class="{'act':isShow}">
      <div class="mock_box">
        <span v-if="fatherClass == 'getCoupon_box' || fatherClass == 'wheel_box'" class="close_butn" @click="closemodel"></span>
        <div class="login">
          <!-- 标题 -->
          <div class="title"></div>
          <!-- 手机号 验证码 -->
          <div class="inputdiv">
            <div class="phone-code">
              <input type="text" v-model="loginParms.mobile" placeholder="请输入你的手机号" v-on:blur.prevent="blurInpt" />
            </div>
            <div class="login-verify flex-between phone-code">
              <input type="text" maxlength="4" v-model="loginParms.code" placeholder="验证码" v-on:blur.prevent="blurInpt" />
              <p class="btn" :class="{btnclicked:timeSecs>1}" @click="getValiCode">{{sentCode}}</p>
            </div>
          </div>
          <!-- 登录按钮 -->
          <div class="btn_box flex-center">
            <div class="btnitem" :class="{'ableBunt':fatherClass == 'wheel_box' && sentCode.length>0}" @click="loginRegist">{{fatherClass == 'wheel_box' ? '立即领取':'确认'}}</div>
          </div>
        </div>
      </div>
    </div>
    <CaptchaWithImg v-if="isCaptchaWithImg" :isPassValidate="isPassValidate" :captchaWithImgInfo="captchaWithImgInfo"
                    @changeIsPassValidate="isPassValidate = !isPassValidate" @cancel="cancelVerifyCaptchaCode" @verifyCode="verifyCaptchaCode" ></CaptchaWithImg>
  </div>
</template>
<script>
import { AntiBrushCaptchaWithImg } from "../common/anti-brush";
import { mapGetters } from "vuex";
import { MD5, Checking } from "../common/util";
import * as api from "../common/api/user";
import CaptchaWithImg from "@/comps/CaptchaWithImg";
const rgxMobile = /^1[3-9]\d{9}$/;
export default {
  components: {  CaptchaWithImg },
  data() {
    return {
      loginParms: {
        mobile: null,
        code: null
      },
      currentCode: "", // 区域号
      sentCode: "获取验证码",
      timeSecs: 0,
      captchaWithImgInfo: {},
      isCaptchaWithImg: false,
      isPassValidate: true
    };
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    fatherClass:{
      type:String,
      default:''
    }
  },
  computed: {
    ...mapGetters({ user: "userInfo", selectCountryCode: "selectCountryCode" }),
    btnBg() {
      if (this.loginParms.mobile && this.loginParms.code) {
        return true;
      } else return false;
    }
  },
  watch: {
    isShow: function(n, o) {
      if (n) document.body.classList.add("lock");
      else document.body.classList.remove("lock");
    },
    selectCountryCode: function(val, oldVal) {
      this.currentCode = val;
    },
    "loginParms.mobile": function(val, oldVal) {
      let _ = this;
      _.loginParms.mobile = val.replace(/[^0-9.]+/, "");
      if (val && val.length >= 11) _.loginParms.mobile = val.substr(0, 11);
      // console.log('val---', _.loginParms.mobile)
    },
    "loginParms.code": function(val, oldVal) {
      let _ = this;
      _.loginParms.code = val.replace(/[^0-9.]+/, "");
      if (val && val.length >= 4) _.loginParms.code = val.substr(0, 4);
      // console.log('val---', _.loginParms.code)
    }
  },
  mounted() {
    let _ = this;
    _.currentCode = _.selectCountryCode;
  },
  methods: {
    blurInpt(){
      var currentPosition,timer, speed = 1;
      timer = setInterval(function(){
        currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
        currentPosition -= speed;
        window.scrollTo(0,currentPosition);//页面向上滚动
        currentPosition += speed; //speed变量
        window.scrollTo(0,currentPosition);//页面向下滚动
        clearInterval(timer);
      },1);
    },
    closemodel() {
      let _ = this;
      document.body.classList.remove("lock");
      _.$emit("close", "关闭");
    },
    clearMobile() {
      this.loginParms.mobile = "";
    },
    //登录方法
    loginRegist() {
      let _ = this;
      if (_.currentCode == "+86" && !rgxMobile.test(_.loginParms.mobile)) {
        _.toast("请输入合法的手机号码");
        return;
      }
      if (!_.loginParms.code) {
        _.toast("请输入验证码");
        return;
      }
      let sin = MD5("+86-" + _.loginParms.mobile + "3111.2.7.1511");
      let option = {
        validCode: _.loginParms.code,
        mobile: _.currentCode + "-" + _.loginParms.mobile,
        nonceStr: sin
      };
      api
        .LoginByCode(option)
        .then(res => {
          // _.toast("登录成功");
          // window.localStorage.setItem("currentUser", JSON.stringify(res));
          _.$store.dispatch("setUserInfo", res);
          _.closemodel();
          _.$emit("loginSuc", "登录成功");
        })
        .catch(e => {
          if (e && e.code == 1511533) {
            _.toast(e.msg);
          } else _.toast("登录失败");
          console.error(e);
        });
    },
    getValiCode() {
      // 验证手机号
      let _ = this;
      console.log("mobile", _.loginParms.mobile);
      if (_.timeSecs > 1) return;

      if (_.currentCode == "+86" && !rgxMobile.test(_.loginParms.mobile)) {
        _.toast("请输入合法的手机号码");
        return false;
      }
      this.validSendCaptchaInfo = {
        checktype: 1,
        mobile: _.currentCode + "-" + _.loginParms.mobile
      };
      AntiBrushCaptchaWithImg((res, params) => {
        if (res === 'success') {
          _.isCaptchaWithImg = true;
          _.captchaWithImgInfo = params;
        }
        if (res === 'jump') {
          this.apiValidSendCaptcha({...this.validSendCaptchaInfo});
        }
        if (res === 'error') {
          _.toast("验证码获取失败");
        }
      })
    },
    apiValidSendCaptcha(param) {
      let _ = this;
      api.ValidSendCaptcha(param)
        .then(res => {
          // 发送验证码
          if (!res) {
            _.timeSecs = 60;
            _.toast("发送成功");
            _.isCaptchaWithImg = false;
            _.isPassValidate = true;
            _.timeRun = setInterval(() => {
              if (_.timeSecs > 1) {
                _.timeSecs--;
                _.sentCode = _.decpadleft(_.timeSecs) + "s";
              } else {
                _.sentCode = "重新获取验证码";
                clearInterval(_.timeRun);
                _.timeRun = null;
              }
            }, 1000);
          }
        })
        .catch(e => {
          if (e && e.code == 1511531) {
            _.toast("验证码发送频繁,请60s之后再试");
          } else if (e && e.code == 1511543) {
            _.toast = "未注册号码";
            // _.toast('未注册号码')
          } else if (e && e.code == 1511544) {
            _.toast = "账号已被注册";
            // _.toast('账号已被注册')
          } else _.toast("验证码发送失败");
          _.isPassValidate = false;
        });
    },
    verifyCaptchaCode(prop) {
      this.apiValidSendCaptcha({ ...prop, ...this.validSendCaptchaInfo });
    },
    cancelVerifyCaptchaCode() {
      this.isCaptchaWithImg = false;
    },
    decpadleft(val) {
      if (val < 10) return "0" + val;
      else return val;
    }
  }
};
</script>
<style scoped>
.login-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  pointer-events: none;
  background: transparent;
  transition: background 0.3s ease-in;
  display: none;
}
.login-wrap.act {
  display: block;
  pointer-events: unset;
  background: rgba(0, 0, 0, 0.5);
}
.mock_box {
  position: absolute;
  width: 87.77vw;
  height: 103.6vw;
  background: url("https://files.eyee.com/eyeeh5/img/store/modal_bg_1.png") 0 0
    no-repeat;
  background-size: cover;
  left: 51.5%;
  top: 45%;
  transform: translate(-50%, -50%);
  transition: transform 0.2s ease-in;
  z-index: 200;
  padding: 13.34vw 4.8vw 2.7vw;
  box-sizing: border-box;
}

.login-wrap.act .mock_box {
  transform: translate(-50%, -50%);
}
.login .title {
  background: url("https://files.eyee.com/eyeeh5/img/store/txt1.png") 0 0
    no-repeat;
  background-size: cover;
  width: 43.734vw;
  height: 17.34vw;
  margin-bottom: 19.47vw;
}
.inputdiv,
.btn_box {
  padding-left: 0.8vw;
  padding-right: 4vw;
}
.btn_box {
  padding-top: 2.667vw;
}
.phone-code {
  margin-bottom: 3.2vw;
  position: relative;
  width: 100%;
  height: 13.34vw;
  line-height: 13.34vw;
  background: #fff9f9;
  box-shadow: 0px 2px 5px 0px rgba(234, 190, 183, 0.4) inset;
  border-radius: 6px;
  padding: 0;
}
.phone-code input {
  width: 100%;
  margin: 0;
  padding: 0;
  height: 13.34vw;
  padding: 2.5vw 0;
  line-height: 8.34vw;
  padding-left: 4vw;
  background: transparent;
  font-size: 15px;
}
.login-verify.phone-code input {
  width: 45%;
}
.login-verify .btn.btnclicked {
  color: #232323;
  font-weight: normal;
}
.login-verify .btn {
  color: #d7221f;
  font-size: 15px;
  height: 13.34vw;
  line-height: 13.34vw;
  width: 55%;
  text-align: right;
  font-weight: bold;
  padding-right: 4vw;
}
.btnitem {
  width: 43vw;
  height: 11.73vw;
  background: linear-gradient(
    180deg,
    rgba(216, 103, 116, 1) 0%,
    rgba(222, 73, 75, 1) 12%,
    rgba(193, 5, 34, 1) 100%
  );
  box-shadow: 0px 2px 5px 0px rgba(83, 0, 14, 1);
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  line-height: 11.73vw;
  text-align: center;
}
</style>
<style lang="scss">
.tcaptcha-transform {
  position: fixed !important;
  z-index: 300;
}
</style>


