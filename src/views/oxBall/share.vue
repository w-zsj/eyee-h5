<template>
  <div class="ball-share" :class="{'ipx':getIsIphonex}">
    <div class="share-header flex-start flex-col">
      <div class="img flex-start">
        <img :src="userBaseInfo.headimgurl||'http://api.eyee.com/EYEE/Icons/defaulthead.jpg'" alt />
        <span class="flex-center">{{userBaseInfo.nickname}}</span>
      </div>
      <div class="txt">{{userBaseInfo.prompt}}</div>
    </div>
    <!-- toast 提示 -->
    <div class="hasget" :class="{'act':hasget}">
      <img src="https://files.eyee.com/mcdn/img/ball/toast.png" alt />
    </div>
    <!-- 底部 -->
    <div class="footer">
      <div :class="[{'act':cangetpack},'redpack']">
        <img src="https://files.eyee.com/mcdn/img/ball/ball_red_down.png" alt />
        <img src="https://files.eyee.com/mcdn/img/ball/ball_red_top.png" class="top" alt />
        <img src="https://files.eyee.com/mcdn/img/ball/ball_money.png" class="money" alt />
        <div class="cot">
          <div class="lot-info">
            <div
              class="txt flex-center flex-col"
              v-if="prizeresult&&prizeresult.isnew==0&&prizeresult.isouttime==0"
            >
              <p>此红包为</p>
              <p>新用户/老用户回归</p>
              <p>专享红包</p>
            </div>
            <div class="txt flex-center flex-col" v-else>
              <div class="title">恭喜你获得</div>
              <div class="num">{{prizeresult.newballs}}牛丸</div>
              <div class="ox-moy">≈{{prizeresult.newballs/100}}元</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 登录 -->
      <div class="login" v-if="!uid">
        <!-- 手机号 验证码 -->
        <div class="inputheight flex-start">
          <span class="flex-center" @click="goToCountry()">{{selectCountryCode}}</span>
          <input
            type="text"
            v-model="loginParms.mobile"
            placeholder="请输入你的手机号"
            @blur="blur"
            @focus="focus"
          />
        </div>
        <div class="login-verify flex-between inputheight">
          <input
            type="text"
            v-model="loginParms.code"
            placeholder="请输入验证码"
            @blur="blur"
            @focus="focus"
          />
          <p class="btn" :class="{btnclicked:timeSecs>1}" @click="getValiCode">{{sentCode}}</p>
        </div>
        <!-- 登录按钮 -->
        <div class="btn_box flex-center" @click="loginRegist">立即领取</div>
      </div>
      <div class="has-login" v-else>
        <div class="txt">
          上斗牛APP，赚取海量牛丸！
          <p>现金，球鞋、潮服任你换！</p>
        </div>
        <div
          class="btn flex-col flex-center"
          :class="{'height':!!prizeresult.isnew||!!prizeresult.isouttime}"
          @click.stop="loadAPP"
        >
          <!-- {{(!!prizeresult.isnew||!!prizeresult.isouttime)?',立即提现':''}} -->
          <p class="open">打开斗牛APP</p>
          <p
            class="tishi"
            v-if="!!prizeresult.isnew||!!prizeresult.isouttime"
          >（新用户/回归老用户登录APP再送100牛丸）</p>
        </div>
      </div>
    </div>
    <CaptchaWithImg v-if="isCaptchaWithImg" :isPassValidate="isPassValidate" :captchaWithImgInfo="captchaWithImgInfo"
                    @changeIsPassValidate="isPassValidate = !isPassValidate" @cancel="cancelVerifyCaptchaCode" @verifyCode="verifyCaptchaCode" ></CaptchaWithImg>
  </div>
</template>

<script>
  import { AntiBrushCaptchaWithImg } from "../../common/anti-brush";
  import { mapGetters } from "vuex";
  import { MD5, Checking } from "../../common/util";
  import * as api from "../../common/api/user";
  import { BallShareInfo, BallRelateto } from "@/utils/api/oxball";
  import CaptchaWithImg from "@/comps/CaptchaWithImg";

  const rgxMobile = /^1[3-9]\d{9}$/;
  const regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
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

        userBaseInfo: {}, // 分享者 基本信息 （头像，昵称。。。）
        inviteid: "", // 邀请者id

        cangetpack: false, // 是否可以领红包
        isnewuser: 0, // 0 新用户 1 老用户
        prizeresult: {}, // 领奖结果

        hasget: false, // 已领取弹框

        getCode: true,
        captchaWithImgInfo: {},
        isCaptchaWithImg: false,
        isPassValidate: true
      };
    },
    beforeCreate: function () {
      document.body.classList.add("add_bg");
    },
    beforeDestroy: function () {
      document.body.classList.remove("add_bg");
    },
    computed: {
      ...mapGetters({user: "userInfo", selectCountryCode: "selectCountryCode"}),
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
        }
      }
    },
    watch: {
      selectCountryCode: function (val, oldVal) {
        this.currentCode = val;
      },
      "loginParms.mobile": function (val, oldVal) {
        let _ = this;
        _.loginParms.mobile = val
          .replace(/[^0-9.]+/, "")
          .replace(regStr, "")
          .replace(/\s+/g, "");
        if (val && val.length >= 11) _.loginParms.mobile = val.substr(0, 11);
      },
      "loginParms.code": function (val, oldVal) {
        let _ = this;
        _.loginParms.code = val.replace(/[^0-9.]+/, "");
        if (val && val.length >= 4) _.loginParms.code = val.substr(0, 4);
      }
    },
    mounted() {
      let _ = this;
      _.currentCode = _.selectCountryCode;
      // 获取地址栏参数  邀请者id
      _.inviteid = _.$route.query.userid || "";
      console.log("邀请者id--->>>", _.inviteid);
      _.getredpack();
      // window.scrollTo(0, 0);
    },
    methods: {
      getredpack() {
        // 领取红包
        let _ = this;
        BallShareInfo(_.inviteid)
          .then(res => {
            if (res) {
              console.log("分享页面基本信息", res);
              _.userBaseInfo = res;
              _.isself(0);
              if (res.share) {
                _.initShare({
                  info: {
                    title: res.share.title,
                    desc: res.share.content,
                    img: res.share.icon,
                    url: res.share.url
                  }
                });
              }
            }
          })
          .catch(e => {
            console.error("获取关系发起人信息--", e);
          });
      },
      isself(isnew) {
        let _ = this;
        if (_.uid) {
          // console.log("uid---", _.inviteid === _.user.uid);
          if (_.inviteid === _.user.uid) {
            _.cangetpack = true;
            _.prizeresult.isnew = 0;
            _.prizeresult.isouttime = 0;
            console.log("本人进入该分享链接---->>", _.prizeresult);
            // _.relateto();

            // _.toast("本人进入该分享链接---->>");
          } else _.relateto(isnew);
        }
      },
      blur() {
        setTimeout(() => {
          window.scrollTo(0, 1);
        }, 100);
      },
      focus() {
        setTimeout(() => {
          window.scrollTo(0, 9999);
        }, 110);
      },
      relateto(isnew) {
        // 与被推荐人建立关联
        let _ = this,
          {inviteid} = _;
        BallRelateto(inviteid, isnew)
          .then(res => {
            // "isnew": 1, //
            // "isouttime": 0, //isnew isouttime都为0时，提示用户只有新用户/唤醒老人才能领
            // "hasgotten": 1, //为1时，提示用户已经领过； 为0时 恭喜用户获得88
            // "newballs": 88 ,
            if (res) {
              _.prizeresult = res;
              _.cangetpack = true;
              if (res.isouttime || res.isnew) {
                if (!res.hasgotten) {
                  _.toast("领取成功");
                } else {
                  // _.toast("你已经领取过红包,登录APP立即提现!");
                  _.hasget = true;
                  setTimeout(() => {
                    _.hasget = false;
                  }, 2000);
                }
              }
            }
            $log({
              e: "click_ball_loadapp",
              p: {
                userid: _.user.uid || _.inviteid
              }
            });
          })
          .catch(e => {
            console.error("建立关系失败", e);
          });
      },
      loadAPP() {
        let _ = this;
        _.openAppClient();
        $log({
          e: "click_ball_share",
          p: {
            userid: _.user.uid || _.inviteid
          }
        });
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
            _.$store.dispatch("setUserInfo", res);
            let isnew = res.isnewuser || 0;
            _.isself(isnew);
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
        window.scrollTo(0, 1);
        if (_.getCode) {
          _.getCode = false;
          AntiBrushCaptchaWithImg((res, params) => {
            if (res === 'success') {
              _.isCaptchaWithImg = true;
              _.captchaWithImgInfo = params;
            }
            if (res === 'jump') {
              this.apiValidSendCaptcha({...this.validSendCaptchaInfo});
            }
            if (res === 'error') {
              _.toast("验证码获取失败", 'error');
            }
            _.getCode = true;
          })
        }
      },
      apiValidSendCaptcha(param) {
        const _ = this;
        _.getCode = true;
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
                  _.sentCode = "重新发送" + _.decpadleft(_.timeSecs) + "s";
                } else {
                  _.sentCode = "重新获取验证码";
                  clearInterval(_.timeRun);
                  _.timeRun = null;
                }
              }, 1000);
            }
          })
          .catch(e => {
            _.isPassValidate = false;
            if (e && e.code == 1511531) {
              _.toast("验证码发送频繁,请60s之后再试");
            } else if (e && e.code == 1511543) {
              _.toast = "未注册号码";
              // _.toast('未注册号码')
            } else if (e && e.code == 1511544) {
              _.toast = "账号已被注册";
              // _.toast('账号已被注册')
            } else _.toast("验证码发送失败");
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
<style>
  .add_bg {
    overflow: hidden;
    background: #020c47;
    position: fixed;
    width: 100%;
    height: 100vh;
    transform: translateZ(0);
  }
</style>
<style scoped lang='scss'>
  $fs14: 3.733vw;
  $fs12: 3.2vw;
  $fs16: 4.266vw;

  input {
    padding: 0;
    margin: 0;
    list-style: none;
    outline-style: none;
    background: none;
  }

  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    color: #d7d4f1;
  }

  .hasget {
    position: fixed;
    z-index: 10;
    left: 11.733vw;
    right: 11.733vw;
    top: 50%;
    transform: translateY(100vh) translateZ(0);
    transition: all 0.2s linear;

    &.act {
      transform: translateY(-50%);
    }
  }

  .ball-share {
    background: #020c47 url("https://files.eyee.com/mcdn/img/ball/bg.jpg") center center no-repeat;
    background-size: 100% 100%;
    min-height: 100vh;
    overflow: hidden;
    position: relative;

    &.ipx {
      background: #020c47 url("https://files.eyee.com/mcdn/img/ball/bg.jpg") center 18.667vw no-repeat;
      background-size: 100% 100%;
      height: 100vh;
    }

    .share-header {
      padding: 5.666vw 0 0 8vw;
      font-size: $fs14;
      color: #fff;
      font-weight: bold;

      .img {
        // margin-bottom: 7px;
        img {
          display: block;
          width: 11.7333vw;
          height: 11.7333vw;
          border-radius: 50%;
          margin-right: 2.666vw;
        }
      }

      .txt {
        padding-left: 14.4vw;
        font-size: 3.733vw;
        width: 73.8667vw;
        font-weight: 400;
        // transform: scale(0.9);
      }
    }

    .footer {
      position: fixed;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%) translateZ(0);
      background: url("https://files.eyee.com/mcdn/img/ball/ball_login_bg.png?c=1");
      background-size: 100% 100%;
      height: 40vh; // 70.8vw
      width: 89.333vw;
      z-index: 2;

      img {
        display: block;
      }

      .redpack {
        width: 45.53333vw;
        position: absolute;
        left: 50%;
        top: -42.666vw;
        transform: translateX(-50%);

        .top {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: -18.1333vw;
          transition: all 0.2s 0.2s linear;
          opacity: 1;
        }

        .money {
          width: 16.2vw;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 1.9vw;
          transition: all 0.2s linear;
        }

        .cot {
          width: 37.733vw;
          height: 26.2666vw;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: -17.2666vw;
          overflow: hidden;
          border-radius: 0 0 1.6vw 1.6vw;

          .lot-info {
            position: absolute;
            left: 0;
            top: 30vw;
            width: 100%;
            height: 100%;
            transition: all 0.3s 0.2s linear;
            background: url("https://files.eyee.com/mcdn/img/ball/ball_red_cot.png");
            background-size: 100% 100%;

            .txt {
              padding-top: 4vw;
              color: #2b081f;
              font-size: $fs14;
              font-weight: bold;
              font-family: Arial;

              p {
                font-size: $fs14;
              }

              .title {
                line-height: 4.5333vw;
              }

              .num {
                font-size: 6.9333vw;
                line-height: 9.866vw;
              }

              .ox-moy {
                font-size: $fs12;
                opacity: 0.6;
              }
            }
          }
        }

        &.act {
          .top {
            // display: none;
            opacity: 0;
          }

          .money {
            top: 17.6vw;
          }

          .cot {
            .lot-info {
              top: 0;
            }
          }
        }
      }

      .has-login {
        position: absolute;
        width: 75.666vw;
        left: 50%;
        transform: translateX(-50%);
        top: 20vw;
        z-index: 2;
        text-align: center;
        color: #fff;
        font-family: Arial, Helvetica, sans-serif;

        .txt {
          line-height: 7.2vw;
          font-size: 4vw;
          margin-bottom: 10.666vw;
          font-weight: bold;
        }

        .btn {
          height: 12.2666vw;
          background: url("/static/imgs/ball/login_btn_bg.png?c=1") 0 0 no-repeat;
          background-size: 100% 100%;
          font-size: $fs12;

          color: #fff;

          &.height {
            height: 14.9333vw;
          }

          .open {
            opacity: 1;
            font-size: $fs14;
            font-weight: bold;
          }

          .tishi {
            opacity: 0.89;
          }
        }
      }

      .login {
        position: absolute;
        width: 74.666vw;
        left: 50%;
        transform: translateX(-50%);
        top: 15vw;
        z-index: 2;

        .inputheight {
          height: 11.733vw;
          background: url("/static/imgs/ball/login_bg.png?c=1") 0 0 no-repeat;
          background-size: 100% 100%;
          margin-bottom: 5.333vw;
          color: #fff;
          font-weight: bold;
          font-size: $fs14;

          &.login-verify {
            input {
              padding-left: 5.333vw;
            }

            .btn {
              padding: 0 2.666vw;
              background: #271c8a;
              margin: 1px;
              height: 11.2vw;
              line-height: 11.2vw;
              border-radius: 0 2.9333vw 2.9333vw 0;
              border-left: 1px solid #6a5af7;
              text-align: center;
              white-space: nowrap;
            }
          }

          input {
            height: 100%;
            font-size: $fs14;
            color: #fff;
            width: 50%;
            font-weight: bold;
            padding-left: 2.133vw;
          }

          span {
            padding: 0 4.8vw;
            position: relative;

            &::before {
              content: "";
              position: absolute;
              right: 0;
              width: 1px;
              background: #8172ff;
              height: 4.266vw;
              top: 50%;
              transform: translateY(-50%);
            }
          }
        }

        .btn_box {
          height: 12.2666vw;
          background: url("/static/imgs/ball/login_btn_bg.png?c=1") 0 0 no-repeat;
          background-size: 100% 100%;
          color: #fff;
          font-size: 4vw;
          font-weight: bold;
        }
      }
    }
  }

  .ipx {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    background: #020c47;
    height: 34px;
    transform: translateZ(0);
  }
</style>
