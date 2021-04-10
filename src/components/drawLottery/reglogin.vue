<template>
    <div>
        <div class="log_reg lotter" >
            <p class="title">手机号码</p>
            <div>
                <label for="">
                    <span class="country_code" @click="goToCountry()">{{currentCode}}
                    <em></em></span>
                    <input type="number" placeholder="请输入手机号码" v-model="loginParms.mobile">
                </label>
            </div>
            <div class="classGetCode">
                <label class="labelCur">
                    <input type="number" placeholder="请输入验证码" v-model="loginParms.code">
                </label>
                <span class="iden_btn specialBgCode" @click.stop="getValiCode">{{sentCode}}</span>
            </div>
            <div class="go-lotter" :class="{'btnBg':btnBg}" @click.stop="loginRegist">
                立即抽奖
            </div>
            <div class="introduce">
                <p>若您的手机号未注册，将会进入注册流程注册即视为您已阅读并同意《用户服务协议》</p>
                <p>斗牛承诺保障您的手机号码及账号信息隐私安全</p>
            </div>
        </div>
      <CaptchaWithImg v-if="isCaptchaWithImg" :isPassValidate="isPassValidate" :captchaWithImgInfo="captchaWithImgInfo"
                      @changeIsPassValidate="isPassValidate = !isPassValidate" @cancel="cancelVerifyCaptchaCode" @verifyCode="verifyCaptchaCode" ></CaptchaWithImg>
    </div>
</template>
<script>
import { AntiBrushCaptchaWithImg } from "../../common/anti-brush";
import * as api from "../../common/api/user";
import { mapGetters } from "vuex";
import { MD5, Checking } from "../../common/util";
import CaptchaWithImg from "@/comps/CaptchaWithImg";
export default {
  components: {  CaptchaWithImg },
  data() {
    return {
      sentCode: "发送验证码",
      currentCode: "", // 区域号
      loginParms: {
        mobile: null,
        code: null
      },
      captchaWithImgInfo: {},
      isCaptchaWithImg: false,
      isPassValidate: true
    };
  },
  mounted() {
    let _ = this;
    _.currentCode = _.selectCountryCode;
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo",
      selectCountryCode: "selectCountryCode"
    }),
    btnBg() {
      if (this.loginParms.mobile && this.loginParms.code) {
        return true;
      } else return false;
    }
  },
  methods: {
    goToCountry() {
      // 选择区域
      this.$router.push("/country");
    },
    loginRegist() {
      let _ = this;
      if (_.currentCode == "+86" && !Checking(_.loginParms.mobile, "phone")) {
        _.toast("请输入合法的手机号码");
        return false;
      }
      let sin = MD5("+86-" + _.loginParms.mobile + "3111.2.7.1511");
      let option = {
        code: _.loginParms.code,
        mobile: _.currentCode + "-" + _.loginParms.mobile,
        nonceStr: sin
      };
      api
        .postUserRegister(option)
        .then(res => {
          // _.toast("注册成功");
          window.localStorage.setItem("currentUser", JSON.stringify(res));
          this.$store.dispatch('setUserInfo', res)
          _.$emit("register", "success");
          //   _.lotterData();
        })
        .catch(e => {
          console.error(e);
        });
    },
    getValiCode() {
      // 验证手机号
      let _ = this;
      if (_.currentCode == "+86" && !Checking(_.loginParms.mobile, "phone")) {
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
      api
        .ValidSendCaptcha(param)
        .then(res => {
          // 发送验证码
          if (!res) {
            var timeSecs = 60;
            _.toast("发送成功");
            _.isCaptchaWithImg = false;
            _.isPassValidate = true;
            _.timeRun = setInterval(() => {
              if (timeSecs > 1) {
                timeSecs--;
                _.sentCode = "已发送" + _.decpadleft(timeSecs) + "s";
              } else {
                _.sentCode = "再次发送";
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
  },
  watch: {
    selectCountryCode: function(val, oldVal) {
      this.currentCode = val;
    }
  }
};
</script>
<style scoped>

.log_reg {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 2;
  background: #fff;
  padding:20px 35px 5px 35px;
}
.log_reg .title {
  color: #333;
  font-size: 16px;
  font-weight: bold;
}
.log_reg label {
  position: relative;
  display: block;
  height: 40px;
  line-height: 40px;
  margin-bottom: 5px;
  color: #999;
  border-bottom: 1px solid #333;
  /* margin-top: 20px; */
}
.log_reg label > span.country_code {
  display: inline-block;
  float: left;
  position: relative;
  margin-right: 8px;
  width: 20%;
}
.log_reg label > span.country_code > em {
  display: inline-block;
  margin-left: 8px;
  width: 0;
  height: 0;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-top: 8px solid #999;
}
.log_reg label input {
  background: none;
  /* color: #fff; */
  width: 75%;
  height: 100%;
}
.classGetCode {
  position: relative;
}
.classGetCode label.labelCur {
  border-bottom: 0;
  margin-top: 10px;
}
.classGetCode label.labelCur input {
  width: 50%;
  height: 100%;
  border-bottom: 1px solid #333;
}
.iden_btn {
  text-align: center;
  font-size: 14px;
  line-height: 40px;
  border-radius: 5px;
  width: 110px;
  height: 40px;
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(224, 222, 222);
}
.go-lotter {
  height: 37px;
  line-height: 37px;
  text-align: center;
  font-size: 17px;
  color: #fff;
  background: #999;
  margin-top: 15px;
  border-radius: 5px;
}
.btnBg{
  background: #333;
}
.introduce {
  font-size: 10px;
  color: #999;
  margin-top: 10px;
  line-height: 24px;
}
.introduce p:nth-child(2) {
  color: #ccc;
}
</style>


