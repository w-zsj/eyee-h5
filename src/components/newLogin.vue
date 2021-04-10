<template>
  <div class="login">
    <div class="tog-login flex-btwn" v-if="!wxBindTell&&tellOrCode">
      <span class="back com-color" @click="close">X</span>
      <span class="code-txt" @click.stop="tagLoginType">{{passwordLogin?"验证码登录":"账号密码登录"}}</span>
    </div>
    <div class="form">
      <div class="log-meth com-color">
        <div v-if="wxBindTell">
          <div class="title">{{tellOrCode?"绑定手机号":"输入验证码"}}</div>
          <div class="illustrate">{{tellOrCode?"再次登录可直接使用手机号":"验证码已发送至 "+tellPhone}}</div>
        </div>
        <div v-if="passwordLogin">
          <div class="title">账号密码登录</div>
        </div>
        <div v-else>
          <div class="title">{{tellOrCode?"验证码登录":"输入验证码"}}</div>
          <div class="illustrate" v-if="tellOrCode" v-html="base.alltext">
            无需注册，新用户可领取
            <span>{{base&&base.text?base.text:'大礼包'}}</span>
          </div>
          <div class="illustrate" v-else>验证码已发送至 {{tellPhone}}</div>
        </div>
      </div>
      <!-- 验证手机号  -->
      <div v-if="tellOrCode">
        <div class="tell form-menu">
          <span @click="goToCountry()">
            {{currentCode}}
            <i></i>
          </span>
          <input
            type="number"
            maxlength="13"
            placeholder="请输入手机号"
            v-model="tellPhone"
            @keypress="keypress"
          />
          <span class="back com-color" @click.stop="clearCode" v-if="tellPhone">X</span>
        </div>
        <div class="password form-menu" v-if="passwordLogin">
          <input :type="openpassword" v-model="password" placeholder="请输入密码" @keypress="keypress" />
          <span class="eye" :class="{'open':openpassword=='text'}" @click="openEye"></span>
        </div>
        <div class="form-menu flex-center btn" :class="{'act':btnBg}" @click.stop="getValiCode">
          <span v-if="!loading">{{regValiWords}}</span>

          <img v-else src="/static/img/loading.png" class="loading" />
        </div>
      </div>
      <!-- 输入验证码 -->
      <div class="auth-code" v-else>
        <div class="mask">
          <input type="number" v-model="enterCode" ref="blurIpt" v-focus="!tellOrCode" />
          <div class="mask-layer flex-center">
            <span class="flex-center">{{arrCode[0]||''}}</span>
            <span class="flex-center">{{arrCode[1]||''}}</span>
            <span class="flex-center">{{arrCode[2]||''}}</span>
            <span class="flex-center">{{arrCode[3]||''}}</span>
          </div>
        </div>
        <div class="count-down" @click.stop="getValiCode">{{tips_word}}</div>
      </div>
    </div>

    <!-- 微信登录 -->
    <!-- <div
      class="other-login flex-center flex-col"
      v-if="$root.ISWX&&!passwordLogin&&tellOrCode&&!wxBindTell"
    >
      <div class="title">其它方式登录</div>
      <div class="icon" @click="wxLogin('weixin://')">
        <img src="../../static/img/login/wx_icon.png" v-show="showIcon == 0">
        <img src="../../static/img/yellow_weixin.png" v-show="showIcon == 1">
      </div>
      <div class="com-color" @click="goPrivacy">
        登录或注册即同意
        <i>用户服务协议</i>
      </div>
    </div>-->

    <p class="hint">
      登录或注册即同意
      <router-link to="/privacy" tag="span">《用户服务协议》</router-link>和
      <router-link to="/about/secret" tag="span">《隐私政策》</router-link>
    </p>

    <guide-modal
      :show="showGuide"
      :loged="true"
      :gift="base.text"
      :config="guideConfig"
      @tap="guideHandle"
    ></guide-modal>
    <CaptchaWithImg v-if="isCaptchaWithImg" :isPassValidate="isPassValidate" :captchaWithImgInfo="captchaWithImgInfo"
                    @changeIsPassValidate="isPassValidate = !isPassValidate" @cancel="cancelVerifyCaptchaCode" @verifyCode="verifyCaptchaCode" ></CaptchaWithImg>
  </div>
</template>
<script>
// 1. 绑定手机号 需要多返回一层 中间有授权操作
// 2. 没有选择性别,或者用户名为系统生成，跳转到完善信息页面.
// sessionStorage.getItem("backhistory")

// 选择国外手机号区域 回退时防止直接 授权 以免导致绑定失败
// sessionStorage.getItem("pathFromLogin")

import { MD5, Checking } from "../common/util";
import { AntiBrushCaptchaWithImg } from "../common/anti-brush";
import * as api from "../common/api/user";
import { mapGetters } from "vuex";
import { weixinApp } from "../common/api/oauthAPI";

import GuideModal from "@/comps/GuideModal";
import { GetGuideInfo } from "@/utils/api/base";
import CaptchaWithImg from "@/comps/CaptchaWithImg";

const tdAdRegister = uid => {
  window.TDH5SDK && window.TDH5SDK.account.register(uid);
};
const dom = window.document;
const body = dom.querySelector("body");
const MemberPathKey = "MEMBER_DO_LOGIN_PATH";
// var fromPath = "";
export default {
  components: { GuideModal, CaptchaWithImg },
  data() {
    return {
      timeRun: null, // 倒计时
      tips_word: "", // 倒计时文言
      tellOrCode: true, // true 输入手机号页面 false 输入验证码页面
      passwordLogin: false, // false 验证码登录 true 密码登录
      tellPhone: "", // 手机号
      password: "", // 密码
      currentCode: "", // 区域号
      enterCode: "", // 验证码code
      regValiWords: "获取验证码", // 按钮文言
      isClickCode: true, // 防止重复点击
      isnewuser: 1, // 1 新用户 0 老用户
      loading: false,
      openpassword: "password", // 是否显示密码
      showIcon: 0, // 0：无上次使用 1：上次使用为微信 2：上次使用为qq
      wxBindTell: false, // 微信授权绑定手机号

      showGuide: false,
      guideConfig: {},
      captchaWithImgInfo: {},
      isCaptchaWithImg: false,
      isPassValidate: true
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
      selectCountryCode: "selectCountryCode",
      baseValue: "baseValue"
    }),
    btnBg() {
      let bol = false,
        _ = this;
      if (!_.passwordLogin) {
        if (_.tellPhone) bol = true;
      } else {
        if (_.tellPhone && _.password) bol = true;
      }

      return bol;
    },
    base() {
      let _ = this,
        obj = {};
      if (_.baseValue.configs && _.baseValue.configs.newergiftpacks) {
        obj = JSON.parse(_.baseValue.configs.newergiftpacks);
      }
      obj.alltext =
        obj.alltext &&
        obj.alltext.replace(
          obj.importanttext,
          `<span style='color:#fa2337;font-weight:900;'>${obj.importanttext}</span>`
        );
      return obj;
    },
    arrCode() {
      let arr = this.enterCode.split("") || [];
      // console.log('arr---------',arr)
      return arr;
    }
  },
  destroyed() {
    sessionStorage.removeItem("loginchannle");
  },
  watch: {
    enterCode: function(n, o) {
      if (n.length == 1) {
        $log({ e: "enterCode", p: { value: n } });
      }
      if (n.length >= 4) {
        this.$refs.blurIpt.blur();
        this.enterCode = this.enterCode.slice(0, 4);
        if (this.wxBindTell) this.bindCellphone();
        else this.loginIn();
      }
    },

    tellPhone: function(n, o) {
      if (n.length > 11) this.tellPhone = n.slice(0, 11);
    },
    selectCountryCode: function(val, oldVal) {
      this.currentCode = val;
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   // 判断路由离开
  //   // 输入验证码回退时 1. 跳完善信息页面 2 老用户不回退 走nest()
  //   let _ = this;
  //   if (!_.tellOrCode && to.path !== "/user/completeInfo" && _.isnewuser != 0) {
  //     _.tellOrCode = true;
  //     _.passwordLogin = false;
  //     _.isClickCode = true;
  //     clearInterval(_.timeRun);
  //     next(false);
  //   } else next();
  // },
  // beforeRouteEnter(to, from, next) {
  //   console.log("------------>", from);
  //   let { fullPath, name } = from,
  //     member = localStorage.getItem(MemberPathKey);
  //   if (!/login/i.test(fullPath) && name !== null)
  //     localStorage.setItem(MemberPathKey, fullPath);
  //   fromPath = window.location.origin + from.fullPath;
  //   next();
  // },
  created() {
    let _ = this;
    _.changeShowIcon();
    // console.log(_.showIcon);
  },
  mounted() {
    let _ = this;
    _.currentCode = _.selectCountryCode;
    // if (_.userInfo && _.userInfo.sex == 2) {
    //   _.$router.push("/user/completeInfo?isnewuser=1");
    //   return;
    // } else
    // if (_.userInfo && _.userInfo.token) {
    //   _.$router.push("/sneaker/mall");
    //   return;
    // }
    // 微信绑定国外手机号 处理
    if (sessionStorage.getItem("pathFromLogin")) {
      _.wxBindTell = true;
      _.tellOrCode = true;
      _.passwordLogin = false;
    } else _.wx_code();
  },
  methods: {
    guideHandle(e) {
      let _ = this;
      // console.log("guideHandle ", e);
      // 1 去完善信息，2 先逛逛
      switch (e) {
        case 1:
          _.goUpdInfo();
          break;
        case 2:
          if (history.length < 2) {
            _.$router.replace("/");
          } else _.$router.go(-1);
          break;
      }
    },
    getGuideInfo() {
      let _ = this;
      GetGuideInfo()
        .then(res => {
          // res = {
          //   couponpopwindow: {
          //     productid: "kjahsfkjahs",
          //     size: "43.5",
          //     image:
          //       "https://files.eyee.com/Shop/system/main/c794e5aab27045ea921ace90c245b2b7.jpg",
          //     lastprice: 1345.67,
          //     indate: 3,
          //     remainingindate: 2,
          //     isshow: 1
          //   }
          // };
          console.log("GetGuideInfo res ", res);

          if (res && res.couponpopwindow && res.couponpopwindow.isshow) {
            _.guideConfig = res.couponpopwindow;
            _.showGuide = true;
          } else _.goUpdInfo();
        })
        .catch(e => {
          console.error("GetGuideInfo error: ", e);
          _.goUpdInfo();
        });
    },
    goUpdInfo() {
      sessionStorage.removeItem("backhistory");
      this.$router.replace("/user/completeInfo?isnewuser=1");
    },
    keypress(event) {
      if (event.keyCode == 13) {
        //如果按的是enter键 13是enter
        event.preventDefault(); //禁止默认事件（默认是换行）
        this.getValiCode();
      }
    },
    tagLoginType() {
      // 切换登录方式
      this.passwordLogin = !this.passwordLogin;
      this.regValiWords = this.passwordLogin ? "登录" : "获取验证码";
    },
    openEye() {
      if (this.openpassword == "password") this.openpassword = "text";
      else this.openpassword = "password";
    },
    clearCode() {
      // 清除手机号
      this.tellPhone = "";
      this.loading = false;
    },
    getValiCode() {
      let _ = this,
        { tellPhone, currentCode, passwordLogin } = _;
      if (!_.isClickCode) return;
      if (passwordLogin) {
        // 密码登录
        _.loginIn();
        sessionStorage.setItem("loginchannle", 3);
        $log({ e: "login", p: {}, t: 0, ext: 3 });
      } else {
        // 获取验证码
        // 验证手机号
        if (
          currentCode == "+86" &&
          !Checking(currentCode + tellPhone, "phone")
        ) {
          _.toast("请输入合法的手机号码");
          return false;
        }
        _.loading = true;
        this.validSendCaptchaInfo = {
          checktype: 1,
          mobile: currentCode + "-" + tellPhone
        };
        sessionStorage.setItem("loginchannle", 2);
        $log({ e: "login", p: {}, t: 0, ext: 2 });
        AntiBrushCaptchaWithImg((res, params) => {
          if (res === 'success') {
            _.isCaptchaWithImg = true;
            _.captchaWithImgInfo = params;
          }
          if (res === 'jump') {
            this.apiValidSendCaptcha({ ...this.validSendCaptchaInfo });
          }
          if (res === 'error') {
            _.toast("验证码获取失败", 'error');
          }
          _.loading = false;
        })
      }
    },
    apiValidSendCaptcha(params) {
      const _ = this;
      api.ValidSendCaptcha(params)
        .then(res => {
          // 发送验证码
          if (!res) {
            console.log(res);
            _.toast("发送成功");
            _.tellOrCode = false;
            _.isClickCode = false;
            _.isCaptchaWithImg = false;
            _.isPassValidate = true;
            var time_secs = 60;
            _.timeRun = setInterval(() => {
              if (time_secs > 1) {
                time_secs--;
                _.tips_word = _.decpadleft(time_secs) + "s后可重新获取";
              } else {
                _.tips_word = "获取验证码";
                _.isClickCode = true;
                clearInterval(_.timeRun);
                _.timeRun = null;
              }
            }, 1000);
          }
        })
        .catch(e => {
          _.isPassValidate = false;
          _.isClickCode = true;
          _.toast((e && e.msg) || "操作失败~");
        });
    },
    verifyCaptchaCode(prop) {
      this.apiValidSendCaptcha({ ...prop, ...this.validSendCaptchaInfo });
    },
    cancelVerifyCaptchaCode() {
      this.isCaptchaWithImg = false;
    },
    bindCellphone() {
      // 第三方注册 绑定手机号
      if (Checking(this.tellPhone, "validcode")) {
        this.toast(Checking(this.password, "validcode"));
        return false;
      }
      if (Checking(this.enterCode, "validcode")) {
        this.toast(Checking(this.enterCode, "validcode"));
        return false;
      }
      let option = {
        Id: sessionStorage.getItem("unionid"),
        Mobile: this.currentCode + "-" + this.tellPhone,
        RegisterType: 0,
        RegisterTypeCode: 0,
        ValidCode: this.enterCode
      };
      // alert(JSON.stringify(option))
      api
        .RegisterOpen(option)
        .then(res => {
          if (res) {
            this.toast("绑定成功");
            this.$store.dispatch("setUserInfo", res);
            sessionStorage.removeItem("pathFromLogin");
            // alert(history.length)
            if (res.sex == 2)
              this.$router.push("/user/completeInfo?isnewuser=1");
            else {
              if (history.length < 2) {
                this.$router.push("/sneaker/mall");
              } else this.$router.go(-2);
            }
          }
        })
        .catch(e => {
          // alert(JSON.stringify(e))
          this.enterCode = "";
          // if (e && e.code == 1511533) {
          //   this.toast("请输入正确的验证码");
          // } else if (e && e.code == 1511532) {
          //   this.toast("请发送验证码");
          // } else {
          //   this.toast(e.msg);
          // }
          this.toast((e && e.msg) || "操作失败~");
        });
    },
    loginIn() {
      //登录
      let _ = this;
      if (_.currentCode == "+86" && !Checking(_.tellPhone, "phone")) {
        _.toast("请输入合法的手机号码");
        return false;
      }
      if (_.passwordLogin) {
        if (!_.password) {
          _.toast("请输入密码");
          return false;
        }
        let paramPhone = {
          mobile: _.currentCode + "-" + _.tellPhone,
          password: MD5(_.password)
        };

        api
          .Login(paramPhone)
          .then(res => {
            console.log("login", res);
            if (res) {
              //登录渠道 0 无 1 一键登录 2 手机号验证码登录 3 账号密码登录 4 微信 5 QQ
              sessionStorage.setItem("loginchannle", 3);
              $log({ e: "login", p: {}, t: 0, ext: 1 });
              tdAdRegister(res.uid);
              _.$store.dispatch("setUserInfo", res);
              if (history.length < 2) {
                _.$router.push("/sneaker/mall");
              } else _.$router.go(-1);
              //   this.toast("登录成功");
            }
          })
          .catch(e => {
            console.error("请求异常", e);
            sessionStorage.setItem("loginchannle", 3);
            $log({ e: "login", p: {}, t: 0, ext: 3 });
            _.toast((e && e.msg) || "登录失败~");
          });
      } else {
        console.log("验证码登录", _.enterCode);
        if (Checking(_.enterCode, "validcode")) {
          _.toast(Checking(_.enterCode, "validcode"));
          return false;
        }
        let paramCode = {
          mobile: this.currentCode + "-" + _.tellPhone,
          validcode: _.enterCode
        };
        console.log(paramCode);

        api
          .LoginByCode(paramCode)
          .then(res => {
            console.log("loginByCode", res);
            if (res) {
              //登录渠道 0 无 1 一键登录 2 手机号验证码登录 3 账号密码登录 4 微信 5 QQ
              sessionStorage.setItem("loginchannle", 2);
              $log({ e: "login", p: {}, t: 0, ext: 1 });
              tdAdRegister(res.uid);
              //   this.toast("登录成功"); // 密码登录成功
              _.$store.dispatch("setUserInfo", res);
              _.isnewuser = res.isnewuser;
              if (_.isnewuser == 1) {
                _.getGuideInfo();
              } else {
                if (history.length < 2) {
                  this.$router.push("/sneaker/mall");
                } else {
                  // 绑定手机号 需要多返回一层
                  sessionStorage.getItem("backhistory") == 1
                    ? _.$router.go(-2)
                    : _.$router.go(-1);
                }
              }
            }
          })
          .catch(e => {
            console.error(e);
            let _ = this;
            _.enterCode = "";
            sessionStorage.setItem("loginchannle", 2);
            $log({ e: "login", p: {}, t: 0, ext: 1 });
            // if (e && e.code == 1511532) {
            //   _.toast("请发送验证码");
            //   //   this.errorInfo = "请发送验证码";
            // }
            // if (e && e.code == 1511533) {
            //   _.toast("无效的验证码");
            //   //   this.errorInfo = "无效的验证码";
            // }
            _.toast((e && e.msg) || "登录失败~");
          });
      }
    },
    wxLogin(url) {
      var path = window.location.origin + window.location.pathname;
      var link = weixinApp.get_authorize_base_link(path, "weixinJ");
      window.location = link;
    },
    wx_code() {
      // 微信静默登录返回uid
      //  alert(JSON.stringify(window.location.href))
      if (window.location.href.indexOf("code") > 0) {
        var weixincode = window.location.href
          .split("code=")[1]
          .split("&state")[0];
        api
          .WXRegisterAuth({ wxcode: weixincode })
          .then(res => {
            //获取unionid
            if (res && res.unionid) {
              sessionStorage.setItem("unionid", res.unionid);

              api
                .LoginOpen({ id: res.unionid, registertype: 0 })
                .then(res => {
                  if (res) {
                    //登录渠道 0 无 1 一键登录 2 手机号验证码登录 3 账号密码登录 4 微信 5 QQ
                    sessionStorage.setItem("loginchannle", 1);
                    $log({ e: "login", p: {}, t: 0, ext: 1 });
                    if (!res.mobile) {
                      // 绑定手机号
                      this.wxBindTell = true;
                      this.tellOrCode = true;
                      this.passwordLogin = false;
                    } else {
                      this.$store.dispatch("setUserInfo", res);
                      this.toast("登录成功" + history.length);
                      this.setCookie("lastlogin", 1, 365);
                      sessionStorage.removeItem("backhistory");
                      let path = localStorage.getItem(MemberPathKey);
                      if (/productDetail|sneaker\/detail/.test(path)) {
                        this.$router.push(path);
                      } else if (history.length < 2) {
                        this.$router.push("/");
                      } else _.$router.go(-3); // 跳过授权的历史
                    }
                  }
                })
                .catch(err => {
                  // 获取用户信息失败，新用户注册
                  if (err.code == 1511543) {
                    // alert('未绑定手机号: ' + JSON.stringify(err))
                    // 绑定手机号 需要多返回一层
                    sessionStorage.setItem("backhistory", "1");
                    this.toast("绑定手机号");
                    this.wxBindTell = true;
                    this.tellOrCode = true;
                    this.passwordLogin = false;
                  }
                });
            }
          })
          .catch(err => {
            this.toast("获取uid失败");
          });
      }
    },
    close() {
      // this.$router.push("/sneaker/mall");
      this.$router.back();
    },
    decpadleft(val) {
      if (val < 10) return "0" + val;
      else return val;
    },
    changeShowIcon() {
      var lastlogin = this.getCookie("lastlogin");
      if (lastlogin) {
        this.showIcon = lastlogin;
      }
    },
    setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toGMTString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
    goPrivacy() {
      // 注册协议
      this.$router.push("/privacy");
    },
    goToCountry() {
      // 国外手机号区域处理
      let _ = this,
        path = "/country" + (_.wxBindTell ? "?pathFromLogin=1" : "");
      _.$router.push(path);
    }
  }
};
</script>

<style scoped lang="scss">
.hint {
  position: absolute;
  left: 0;
  top: 92vh;
  width: 100%;
  color: #666;
  font-size: 3.2vw;
  text-align: center;

  span {
    font-weight: 600;
    color: #fa2337;
  }
}
.login {
  padding: 0 5vw;
}
.loading {
  width: 20px;
  height: 20px;
  animation: load 0.5s linear infinite;
}
@keyframes load {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.com-color {
  color: #232323;
}
.tog-login {
  font-size: 12px;
  line-height: 44px;
  .back {
    font-weight: bold;
  }
  .code-txt {
    color: #646464;
  }
}
.form {
  margin: 20px 5.33vw;
  .log-meth {
    margin-bottom: 10px;
  }
  .title {
    font-size: 8.533vw;
    font-weight: 600;
  }
  .illustrate {
    font-size: 3.733vw;
    line-height: 9.6vw;
    span {
      color: #fa2337;
      font-weight: bold;
    }
  }
  .form-menu {
    height: 50px;
    line-height: 50px;
    background: #f0f0f0;
    margin-bottom: 20px;
    border-radius: 3px;
    padding: 0 15px;
    position: relative;
    .eye {
      position: absolute;
      width: 22px;
      height: 22px;
      background: url("/static/img/close_eye.png") 0 0 no-repeat;
      background-size: cover;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      &.open {
        background: url("/static/img/open_eye.png") 0 0 no-repeat;
        background-size: cover;
      }
    }
    input {
      height: 50px;
      background: none;
      padding: 0;
      margin: 0;
      width: 70%;
      font-size: 15px;
    }
    input::-webkit-input-placeholder {
      font-size: 12px;
      color: #b4b4b4;
    }
    .back {
      position: absolute;
      right: 5px;
      font-size: 14px;
      width: 30px;
      text-align: center;
    }
    i {
      display: inline-block;
      //   margin-left: 8px;
      width: 0;
      height: 0;
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
      border-top: 8px solid #999;
    }
    &.btn {
      color: #fff;
      background: #cdcdcd;
    }
    &.act {
      background: #fa2337;
    }
    &.password {
      input {
        width: 100%;
      }
    }
  }
}
.other-login {
  font-size: 12px;
  color: #646464;
  // position: absolute;
  width: 100%;
  margin-top: 40vh;
  // bottom: 16vw;
  // left: 0;
  i {
    font-style: normal;
    color: #fa2337;
  }
  .icon {
    width: 30px;
    height: 30px;
    margin: 5px auto;
  }
}
.auth-code {
  .mask {
    height: 80px;
    background: #fff;
    position: relative;
    width: 100%;
    input {
      margin: 0;
      padding: 0;
      background: none;
      // padding-left: 10.5%;
      // letter-spacing: 18vw;
      position: absolute;
      // font-size: 22px;
      // font-weight: bold;
      left: 0;
      top: 0;
      width: 100%;
      height: 80px;
      z-index: 2;
      opacity: 0;
    }
    .mask-layer {
      position: absolute;
      width: 100%;
      left: 0;
      top: 0;
      z-index: 1;
      // background: #f0f0f0;
      height: 80px;
      span {
        width: 25%;
        background: #f0f0f0;
        height: 80px;
        font-size: 22px;
        font-weight: bold;
        // color: #fff;
        &:nth-child(2) {
          margin: 0 2%;
        }
        &:nth-child(3) {
          margin-right: 2%;
        }
      }
    }
  }
  .count-down {
    font-size: 12px;
    color: #ff4b00;
    margin-top: 20px;
  }
}
</style>
