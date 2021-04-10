<template>
    <div>
       <div class="add-info-mask" v-if="hasdata==1">
            <div class="add-info bgbold">
                 <span id="close" @click="offClose">x</span>
                <div class="give " >
                <p class="title">领取新人礼包</p>
                <!-- {{errorInfo}} -->
                <div class="logReg_panel">
                    <form class="log_reg">
                        <label>
                        <!-- @click="goToCountry()" -->
                            <span class="country_code" @click.stop="goToCountry()">{{currentCode}}<em></em></span>
                            <input type="number" placeholder="请输入手机号码" v-model="registerUser.mobile">
                        </label>
                        <div class="classGetCode">
                             <label class="labelCur">
                                <input type="number" placeholder="请输入验证码" v-model="registerUser.validcode">
                            </label>
                            <span class="iden_btn" @click.stop="getValiCode()" :class="checkphone?'selectedBtn':''">{{regValiWords}}</span>
                        </div>

                    </form>
                </div>
                <div class="go-btn" @click.stop="regisOrLogin()">确认</div>

                </div>
            </div>
        </div>
        <SelectSex v-else-if="hasdata==2"></SelectSex>
        <GetFail v-else-if="hasdata==3"></GetFail>
    </div>

</template>
<script>
// import {UpdateInfo} from '../../common/api/user'
import { MD5, Checking } from "../../common/util";
import * as api from "../../common/api/user";
import { mapGetters } from "vuex";
import SelectSex from "./SelectSex.vue";
import GetFail from "./GetFail.vue";
const elBody = document.getElementsByTagName("body")[0];
export default {
  components: {
    SelectSex,
    GetFail
  },
  data() {
    return {
      deviceHei: "",
      currentCode: "",
      pwdValicodeLogin: false,
      valiWords: "获取验证码",
      regValiWords: "获取验证码",
      loginUser: {},
      registerUser: {},
      timerun: {},
      isregis: "",
      type: 3,
      hasdata: 1,
      focusstate: true,
      errorInfo: "" // 报错信息
    };
  },
  computed: {
    ...mapGetters({
      baseValue: "baseValue",
      selectCountryCode: "selectCountryCode",
      localUserInfos: "userInfo"
    }),
    // localUserInfos() {
    //   return JSON.parse(localStorage.getItem('currentUser'))
    // },
    checkphone() {
      return Checking(this.registerUser.mobile, "phone");
    },
    baseRegImg() {
      let bv = this.baseValue;
      return (bv.configs && bv.configs.registerbgimg) || "";
    }
  },
  mounted() {
    console.log('mounted')
    elBody.classList.add("lock");
    this.currentCode = this.selectCountryCode;
  },
  methods: {
    decpadleft(val) {
      if (val < 10) return "0" + val;
      else return val;
    },
    offClose() {
      this.hasdata = 4;
      elBody.classList.remove("lock");
      sessionStorage.setItem("flg", "1");
    },
    regisOrLogin() {
      // 注册或者登录判断
      this.registerNum();
    },
    registerNum() {
      // 注册
      this.errorInfo = "";
      if (
        this.currentCode == "+86" &&
        !Checking(this.registerUser.mobile, "phone")
      ) {
        this.toast("请输入合法的手机号码");
        // this.errorInfo = '请输入合法的手机号码';
        // this.$refs.inputTel.focus();
        // this.$refs.importCode.blur()
        // this.focusstate = true
        return false;
      }
      if (Checking(this.registerUser.validcode, "validcode")) {
        // this.toast(Checking(this.registerUser.validcode,'validcode'))
        this.errorInfo = Checking(this.registerUser.validcode, "validcode");
        return false;
      }

      let option = {
        mobile: this.currentCode + "-" + this.registerUser.mobile,
        validcode: this.registerUser.validcode
      };
      api
        .AdjustRegister(option)
        .then(res => {
          if (res) {
            // this.toast('注册成功');
            sessionStorage.setItem('newpeople','1')//判断新人礼包 在有token的时候是否显示
            this.hasdata = 2;
            this.$store.dispatch("setUserInfo", res);

          }
        })
        .catch(e => {
          if (e && e.code == 1511533) {
            // this.toast('请输入正确的验证码');
            this.errorInfo = "请输入正确的验证码";
          } else if (e && e.code == 1511532) {
            // this.toast('请发送验证码');
            this.errorInfo = "请发送验证码";
          }
        });
    },
    getValiCode() {
      // 验证码登录
      let checkMobile = "",
        checkTypes = this.type;
      this.errorInfo = "";
      checkMobile = this.registerUser.mobile;
      // 验证手机号
      if (this.currentCode == "+86" && !Checking(checkMobile, "phone")) {
        // this.focusstate = true

        this.toast("请输入合法的手机号码");
        // this.errorInfo = '请输入合法的手机号码';
        // this.$refs.inputTel.focus();
        // this.$refs.importCode.blur()
        // console.log(this.focusstate, 'yyyy')
        return false;
      }
      var option = {
        checktype: checkTypes,
        mobile: this.currentCode + "-" + checkMobile
      };
      console.log(option);
      api
        .SendCaptcha(option)
        .then(res => {
          // 发送验证码
          if (!res) {
            var time_secs = 60;
            var tips_word = "";
            this.toast("发送成功");
            // this.focusstate = false
            // this.$refs.inputTel.blur();
            // this.$refs.importCode.focus()
            this.timerun = setInterval(() => {
              if (time_secs > 1) {
                time_secs--;
                tips_word = "已发送" + this.decpadleft(time_secs) + "s";
                this.regValiWords = tips_word;
              } else {
                this.regValiWords = "再次发送";
                clearInterval(this.timerun);
                this.timerun = null;
              }
            }, 1000);
          }
        })
        .catch(e => {
          this.isregis = e.msg;
          if (e && e.code == 1511531) {
            this.toast("验证码发送频繁,请60s之后再试");
          } else if (e && e.code == 1511543) {
            // this.hasdata = 2
            // this.toast('未注册号码');
          } else if (e && e.code == 1511544) {
            this.hasdata = 3;
            this.toast("账号已被注册");
          }
        });
    },
    goToCountry() {
      this.$router.push("/country");
    }
  }
};
</script>
<style scoped>
#close {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 15px;
  /* width: 15px;
    height: 15px; */
  color: #fff;
  font-size: 20px;
  line-height: 20px;
}
.add-info-mask {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.add-info {
  /*居中*/
  width: 240px;
  height: 316px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  border-radius: 14px;
  background: url("../../../static/img/addinfo3.png") 0 0 no-repeat;
  background-size: 100% 100%;
  /* overflow: hidden; */
}
.add-info.bgbold {
  background: #222;
}
.add-info.bgbold .title {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 20px;
  text-align: center;
  margin-top: 30px;
}
.add-info .img-wrap {
  width: 260px;
  height: 200px;
}
.add-info .img-wrap img {
  width: 100%;
  height: 100%;
}
.give {
  width: 80%;
  margin: 10px auto 0;
  font-size: 12px;
}
.classGetCode {
  position: relative;
}
.classGetCode .iden_btn {
  position: absolute;
  top: 0;
  right: 0;
}
.give .give-info {
  width: 100%;
  text-align: center;
  line-height: 18px;
  color: #3ca0d1;
}
.give .go-btn {
  height: 35px;
  line-height: 35px;
  width: 200px;
  background: #ffc700;
  border-radius: 4px;
  text-align: center;
  margin: 5px auto;
  color: white;
  position: absolute;
  left: 50%;
  margin-left: -100px;
  bottom: 30px;
  font-size: 18px;
}
.close {
  position: absolute;
  width: 30px;
  height: 30px;
  left: 50%;
  margin-left: -15px;
  bottom: -50px;
  border-radius: 50%;
  border: 1px solid #ccc;
  overflow: hidden;
  text-align: center;
}
.close img {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  margin-top: 3px;
}
form.log_reg label {
  position: relative;
  display: block;
  height: 40px;
  line-height: 40px;
  margin-bottom: 5px;
  color: #999;
  border-bottom: 1px solid #f1f1f1;
  margin-top: 20px;
}
form.log_reg label.labelCur {
  border-bottom: 0;
  margin-top: 20px;
}
form.log_reg label > span.country_code {
  display: inline-block;
  float: left;
  position: relative;
  margin-right: 8px;
}
form.log_reg label input {
  background: none;
  color: #fff;
  width: 70%;
}
form.log_reg label.labelCur input {
  width: 50%;
  height: 100%;
  border-bottom: 1px solid #f1f1f1;
}
form.log_reg label > span.country_code > em {
  display: inline-block;
  margin-left: 8px;
  width: 0;
  height: 0;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-top: 8px solid #999;
}
.iden_btn,
.confirm_btn {
  text-align: center;
  font-size: 14px;
  line-height: 40px;
  color: #fff;
  border-radius: 5px;
  width: 110px;
  height: 40px;
}
.iden_btn {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 80px;
  display: inline-block;
  background: rgba(224, 222, 222, 0.7);
}
.iden_btn.selectedBtn {
  background: #ffc700;
}
</style>

