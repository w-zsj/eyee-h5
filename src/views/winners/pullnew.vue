<template>
  <div class="register">
    <loader class="load" from="5" ref="load" :id="teamid" v-if="!$root.ISAPP">
      <img src="/static/img/bull/download_app.png?c=1" alt />
    </loader>
    <div class="banner">
      <img src="https://files.eyee.com/eyeeh5/img/pullnew/new_banner.jpg" alt />
    </div>
    <!-- 注册逻辑 -->
    <div class="login" v-if="!isShowLogin&&!$root.ISAPP">
      <div class="title">
        <img src="https://files.eyee.com/eyeeh5/img/pullnew/new_reg_bg.png?d=1" alt />
      </div>
      <div class="form">
        <div class="tell flex flex-aic">
          <span @click="goToCountry()" class="flex flex-center">{{currentCode}}</span>
          <input type="number" placeholder="输入手机号码" v-model="tellPhone" />
        </div>
        <div class="code flex flex-aic">
          <input type="number" placeholder="输入验证码" v-model="enterCode" />
          <span @click.stop="getValiCode" class="flex flex-end">{{regValiWords}}</span>
        </div>
        <div class="reg-btn" @click.stop="loginIn"></div>
      </div>
    </div>
    <!-- 领奖板块 -->
    <div class="get-award">
      <img src="https://files.eyee.com/eyeeh5/img/pullnew/new_lot.png?r=2.2" alt />
    </div>
    <!-- 周盈镑 -->
    <!-- <div class="content" v-if="weekprofitlist&&weekprofitlist.length>0">
      <div class="con-wrap">
        <div class="win-list">
          <div class="title-bg flex flex-center">周盈利榜 {{weekdate}}</div>
          <div class="subhead-title flex flex-air">
            <div
              v-for="(item,index) in secTitle"
              :key="index"
              class="flex flex-center list"
              :class="{'lot-icon':index==0}"
            >{{item}}</div>
          </div>
          <div class="pop-list">
            <div class="flex-center" v-if="weekprofitlist.length===0">暂无数据~</div>
            <div
              class="subhead-title pop flex flex-air"
              v-for="(item,i) in weekprofitlist"
              :key="i+'pop'"
              v-else
            >
              <div v-if="i<3" class="lot-icon list flex flex-center">
                <img :src="`https://files.eyee.com/eyeeh5/img/winner/no${i+1}.png`" alt />
              </div>
              <div v-else class="list lot-icon flex flex-center">{{i+1}}</div>
              <div class="list flex flex-center">{{item.nickname}}</div>
              <div class="list flex flex-center">{{item.sellnum}}</div>
              <div class="list flex flex-center">{{item.buyprice}}</div>
              <div class="list flex flex-center">{{item.sellprice}}</div>
              <div class="list flex flex-center last">￥{{item.totalprofit}}</div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

    <!-- 底部 -->
    <div class="footer">
      <img v-if="!$root.ISAPP" src="https://files.eyee.com/eyeeh5/img/pullnew/new_code.jpg" alt />
      <img src="https://files.eyee.com/eyeeh5/img/pullnew/new_logo.jpg" alt />
    </div>
    <CaptchaWithImg v-if="isCaptchaWithImg" :isPassValidate="isPassValidate" :captchaWithImgInfo="captchaWithImgInfo"
                    @changeIsPassValidate="isPassValidate = !isPassValidate" @cancel="cancelVerifyCaptchaCode" @verifyCode="verifyCaptchaCode" ></CaptchaWithImg>
  </div>
</template>
<script>
import { MD5, Checking, getUrlParam } from "../../common/util";
import { AntiBrushCaptchaWithImg } from "../../common/anti-brush";
import * as api from "../../common/api/user";
import { mapGetters } from "vuex";
import { Profitlist } from "../../common/api/bull";
import Loader from "@/comps/Loader";
import CaptchaWithImg from "@/comps/CaptchaWithImg";
const tdAdRegister = uid => {
  window.TDH5SDK && window.TDH5SDK.account.register(uid);
};
export default {
  components: { Loader, CaptchaWithImg },
  data() {
    return {
      manderuserid: "", //团长用户id
      participation: false, // 是否 为鞋友帮分享页面进入
      tellPhone: "", // 手机号
      currentCode: "", // 区域号
      enterCode: "", // 验证码code
      isClickCode: true, // 防止重复点击
      regValiWords: "获取验证码", // 按钮文言
      weekdate: "", //周盈利榜，周交易榜时间
      secTitle: ["榜单", "昵称", "卖出数量", "买入均价", "卖出均价", "总盈利"],
      weekprofitlist: [], //周盈利榜
      mylevel: null, //0普通鞋头 1 高级鞋头
      teamid: "",
      captchaWithImgInfo: {},
      isCaptchaWithImg: false,
      isPassValidate: true
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
      selectCountryCode: "selectCountryCode"
    }),
    isShowLogin() {
      return !!(this.userInfo && this.userInfo.token);
    }
  },
  watch: {
    tellPhone: function(n, o) {
      if (n && n.length >= 11) {
        this.tellPhone = n.slice(0, 11);
      }
    }
  },
  mounted() {
    let _ = this;
    _.currentCode = _.selectCountryCode;
    _.manderuserid = getUrlParam("userid") || "";
    _.participation = !!getUrlParam("participation");
    _.mylevel = !!getUrlParam("mylevel") || null;
    _.teamid = _.$route.query.teamid || "";
    if (_.isShowLogin && !_.$root.ISAPP) {
      if (_.participation) _.$router.back();
      else _.$refs.load.$el.click();
    }
    // _.popList();
  },
  methods: {
    getValiCode() {
      let _ = this,
        { tellPhone, currentCode } = _;
      if (!_.isClickCode) return;
      // 获取验证码
      // 验证手机号
      if (currentCode == "+86" && !Checking(currentCode + tellPhone, "phone")) {
        _.toast("请输入合法的手机号码");
        return false;
      }
      this.validSendCaptchaInfo = {
        checktype: 1,
        mobile: currentCode + "-" + tellPhone
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
            console.log(res);
            _.toast("发送成功");
            _.isClickCode = false;
            _.isCaptchaWithImg = false;
            _.isPassValidate = true;
            var time_secs = 60;
            _.timeRun = setInterval(() => {
              if (time_secs > 1) {
                time_secs--;
                _.regValiWords = _.decpadleft(time_secs) + "s";
              } else {
                _.regValiWords = "重新获取验证码";
                _.isClickCode = true;
                clearInterval(_.timeRun);
                _.timeRun = null;
              }
            }, 1000);
          }
        })
        .catch(e => {
          _.isClickCode = true;
          _.loading = false;
          if (e && e.code == 1511531) {
            _.toast("验证码发送频繁,请60s之后再试");
          } else if (e && e.code == 1511543) {
            //   _.toast("新用户请先注册");
          } else if (e && e.code == 1511544) {
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
    loginIn() {
      let _ = this;
      if (_.currentCode == "+86" && !Checking(_.tellPhone, "phone")) {
        _.toast("请输入合法的手机号码");
        return false;
      }
      if (Checking(_.enterCode, "validcode")) {
        _.toast(Checking(_.enterCode, "validcode"));
        return false;
      }
      let paramCode = {
        mobile: this.currentCode + "-" + _.tellPhone,
        validcode: _.enterCode
      };
      if (_.manderuserid) paramCode.i = _.manderuserid;
      console.log(paramCode);
      api
        .LoginByCode(paramCode)
        .then(res => {
          console.log("loginByCode", res);
          if (res) {
            //登录渠道 0 无 1 一键登录 2 手机号验证码登录 3 账号密码登录 4 微信 5 QQ
            let source = _.mylevel == 0 || _.mylevel == 1 ? 1 : 0;
            sessionStorage.setItem("loginchannle", 2);
            $log({ e: "login", p: {}, t: 0, ext: 1 });
            $log({
              e: "clickToJoinShoeGroup",
              p: { mylevel: _.mylevel, userid: _.manderuserid, source }
            });
            tdAdRegister(res.uid);
            _.$store.dispatch("setUserInfo", res);
            if (_.participation) {
              // _.toast("已登录，未加团"); // 验证码登录成功
              _.$router.go(-1);
            } else {
              _.toast("登录成功，前往下载斗牛DoNew APP"); // 验证码登录成功
              setTimeout(() => {
                _.$refs.load.$el.click();
              }, 500);
            }
          }
        })
        .catch(e => {
          console.log(e);
          let _ = this;
          _.enterCode = "";
          if (e && e.code == 1511532) {
            _.toast("请发送验证码");
            //   this.errorInfo = "请发送验证码";
          }
          if (e && e.code == 1511533) {
            _.toast("无效的验证码");
            //   this.errorInfo = "无效的验证码";
          }
        });
    },
    decpadleft(val) {
      if (val < 10) return "0" + val;
      else return val;
    },
    goToCountry() {
      // 国外手机号区域处理
      let _ = this,
        path = "/country";
      _.$router.push(path);
    },
    popList() {
      let _ = this;
      Profitlist()
        .then(res => {
          if (res) {
            if (res.weekprofitlist && res.weekprofitlist.length > 0)
              _.weekprofitlist = res.weekprofitlist;
            _.weekdate = res.weekdate || "";
            if (res.weekshare) {
              let shareInfo = {
                sharecontent: res.weekshare.content,
                sharepicurl: res.weekshare.icon,
                shareurl: res.weekshare.url,
                sharetitle: res.weekshare.title,
                callbackname: ""
              };
              // app 分享信息
              if (_.$root.ISAPP) {
                _.javascriptBridge({
                  name: "getAppActivityShareContent",
                  params: shareInfo
                });
              } else {
                _.initShare({
                  info: {
                    title: res.weekshare.title,
                    desc: res.weekshare.content,
                    img: res.weekshare.icon,
                    url: res.weekshare.url
                  }
                });
              }
            }
          }
        })
        .catch(e => {
          console.error(e);
          _.toast(e && e.msg);
        });
    }
  }
};
</script>
<style lang="scss">
.tcaptcha-transform {
  position: fixed !important;
}
</style>
<style scoped>
.banner {
  width: 100%;
  min-height: 90vw;
}
.register {
  background: #910a1c;
  overflow: hidden;
  width: 100%;
}
img {
  display: block;
  width: 100%;
  font-size: 0;
  line-height: 0;
}
.login {
  margin: 0 5.333vw;
  background: url("https://files.eyee.com/eyeeh5/img/pullnew/new_bg.png?r=2") 0
    0 no-repeat;
  background-size: 100% 100%;
  padding: 4.4vw 6.13vw;
  border-radius: 20px;
  overflow: hidden;
  color: #671111;
  font-size: 4.26;
  margin-bottom: 9.06vw;
}
.login .title {
  width: 100%;
  margin-bottom: 3.33vw;
  background: #910a1c;
}
input {
  list-style: none;
  outline-style: none;
  color: #fff;
  padding: 0;
  margin: 0;
  background: #aa4e5c;
  border-radius: 2.66vw;
  padding-right: 5px;
  position: relative;
  z-index: 2;
  font-size: 4.26vw;
  caret-color: #f0f0f0;
  height: 100%;
}
input::-webkit-input-placeholder {
  font-size: 3.5vw;
  color: #671111;
  padding-left: 5px;
  line-height: 4.5vw;
}

.login .tell,
.login .code {
  color: #671111;
  margin-bottom: 3.33vw;
  height: 13.33vw;
  background: #aa4e5c;
  border: 2px solid #6d171e;
  border-radius: 2.66vw;
  line-height: 13.33vw;
}
.login .tell input {
  padding-left: 5px;
}
.login .tell span {
  width: 15.46vw;
  display: inline-block;
  /* border-right: 1px solid #671111; */
  text-align: center;
  position: relative;
}
.login .tell span::before {
  content: "";
  /* height: 40%; */
  height: 4vw;
  right: 0;
  width: 1px;
  background: #671111;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.login .tell input {
  color: #fff;
  width: 57vw;
  display: inline-block;
}
.login .code input {
  width: 60%;
  color: #fff;
  padding-left: 10px;
}
.login .code span {
  width: 50%;
  padding-right: 5.73vw;
  font-size: 3.73vw;
  color: #fff;
}
.login .reg-btn {
  width: 57.46vw;
  height: 14.4vw;
  background: url("https://files.eyee.com/eyeeh5/img/pullnew/new_btn.png?r=1") 0
    0 no-repeat;
  background-size: 100% 100%;
  margin: 0 auto;
}
.get-award {
  line-height: 0;
  font-size: 0;
  overflow: hidden;
  letter-spacing: 0;
  min-height: 110vw;
}
.get-award img {
  display: block;
  float: left;
  width: 100%;
  margin: 0;
  padding: 0;
  /* vertical-align:top; */
}
.content {
  background: url("https://files.eyee.com/eyeeh5/img/pullnew/new_bg_top.png")
      left top no-repeat,
    url("https://files.eyee.com/eyeeh5/img/pullnew/new_bg_botom.png") left
      bottom no-repeat,
    #770d1b;
  background-size: 100% auto;
  margin: 0 5.333vw;
  padding: 1.86vw;
  border-radius: 6.5vw;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  overflow: hidden;
}
.content .con-wrap {
  background: #f2d6c0;
  padding: 7.73vw 2vw 4.66vw 2vw;
  border-radius: 5vw;
}
.content .win-list {
  background: url("https://files.eyee.com/eyeeh5/img/winner/bg_border.png?r=1")
    0 0 no-repeat;
  background-size: 100% 100%;
  padding: 17vw 2.5vw 4.13vw 2.5vw;
  position: relative;
  margin-bottom: 8.4vw;
}
.win-list .txt {
  font-size: 2.6vw;
  font-weight: bold;
  line-height: 5vw;
  color: #000;
}
.content .win-list:last-child {
  margin-bottom: 0;
}
.content .win-list .title-bg {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -2vw;
  border: 2px solid #232323;
  border-radius: 4px;
  background: #e26f35;
  color: #ffe4b7;
  font-size: 5vw;
  font-weight: bold;
  padding: 2.2vw 3.6vw;
  text-shadow: 0.1em 0.1em #333;
  white-space: nowrap;
}
.content .subhead-title {
  font-size: 2.93vw;
  color: #ef6035;
  font-weight: bold;
}
.pop-list {
  margin-top: 6vw;
}
.content .subhead-title.pop {
  margin-bottom: 6.13vw;
  color: #141414;
}
.content .subhead-title .list.last {
  color: #ef6035;
}
.content .subhead-title .list {
  width: 22.5%;
}
.content .subhead-title .lot-icon {
  width: 11%;
}
.content .subhead-title .lot-icon img {
  width: 5.33vw;
  height: 5.33vw;
}
</style>


