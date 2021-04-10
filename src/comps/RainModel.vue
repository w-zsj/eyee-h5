<template>
  <div v-if="moty!=0" @click="closemodel">
    <!-- 红包倒计时 -->
    <div class="mock_box" v-if="moty==1" @click.stop>
      <div class="redcount flex-col flex-center">
        <img class src="//files.eyee.com/activity/year-shopping/koi-text.png" alt>
        <div class="redpacket flex-center">
          <p class="count">{{cutdownNum}}</p>
          <img src="//files.eyee.com/activity/year-shopping/redpacket.png" alt>
        </div>
        <div class="clickX" @click="closemodel"></div>
        <img class="footer" src="//files.eyee.com/activity/year-shopping/redpacket-more.png" alt>
      </div>
    </div>
    <!-- 活动规则 -->
    <div class="mock_box" v-if="moty==2">
      <div class="rules">
        <img src="https://files.eyee.com/activity/year-activity/tanchuang.png" alt>
        <div class="content flex-center flex-col">
          <p class="clickx" @click="closemodel"></p>
          <p class="title">
            <img src="https://files.eyee.com/activity/year-activity/huodongguize.png" alt>
          </p>
          <div class="item flex">
            <p class="txtno">1.</p>
            <p class="txt">活动时间:19年1月29日0点-19年2月10日24点</p>
          </div>
          <div class="item flex">
            <p class="txtno">2.</p>
            <p class="txt">活动期间，用户每天可进入活动页面参与抢锦鲤，每个场次抢锦鲤时间为15秒</p>
          </div>
          <div class="item flex">
            <p class="txtno">3.</p>
            <p class="txt">每天整点场(20 点场、14点场、20点场)会有大礼包可派送</p>
          </div>
          <div class="item flex">
            <p class="txtno">4.</p>
            <p class="txt">每场次每个用户ID仅限参与一次,分享可获得多参与一次的机会</p>
          </div>
          <div class="item flex">
            <p class="txtno">5.</p>
            <p class="txt">本活动为斗牛APP用户专享,同一ID、手机号、同一设备均视为同一ID</p>
          </div>
          <div class="item flex">
            <p class="txtno">6.</p>
            <p class="txt">若发现存在任何异常行为(恶意刷奖)的用户，斗牛官方将取消参与资格，若礼包发出则有权收回</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 游戏结束 -->
    <div class="mock_box" v-if="moty==3" @click.stop.prevent :class="{'appRedPack':$root.ISAPP}">
      <div class="game-end" @click.stop.prevent>
        <img src="https://files.eyee.com/activity/year-activity/tanchuang.png" alt>
        <div class="content flex-center flex-col">
          <p class="clickx" @click.stop="closemodelMain()"></p>
          <p class="txt">
            <img src="https://files.eyee.com/activity/year-activity/hongbaoquan.png" alt>
          </p>
          <p class="txt">即将开启你的潮流之旅~</p>

          <div class="totleMoney">
            <img src="https://files.eyee.com/activity/year-activity/rotterrusult.png" alt>
            <span>{{CheckgiftData.totalprice}}</span>
          </div>
          <p class="txt toast-txt">分享可再来一次，相信你的运气会更好～</p>
          <div class="btnlist flex flex-between">
            <div class="btnitem" @click.stop="goShare">分享给好友</div>
            <div class="btnitem" @click.stop="checkModel()">查看礼包</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看礼包 -->
    <div class="mock_box" :class="{'appRedPack':$root.ISAPP}" v-if="moty==4">
      <div class="couponList">
        <img src="https://files.eyee.com/activity/year-activity/tanchuang.png" alt>
        <div class="content flex-center flex-col">
          <p class="clickx" @click="closemodel"></p>
          <p class="txt">
            <img src="https://files.eyee.com/activity/year-activity/douniulibao.png" alt>
          </p>
          <p class="title" v-if="businessitxt">{{fullname}}</p>

          <div
            class="coupon-item flex-center"
            v-for="(item,indx) in CheckgiftData.coupons"
            :key="'CheckgiftData'+indx"
          >
            <img src="https://files.eyee.com/activity/year-activity/libaoBg.png" alt>
            <div class="coupon-info flex-around">
              <div class="infoleft flex">
                <p class="icon">¥</p>
                <p class="money">{{item.facevalue}}</p>
              </div>
              <div class="inforight">
                <p>{{item.title}}</p>
                <p>{{item.usecondition}}</p>
              </div>
            </div>
          </div>

          <div class="btnlist flex-center">
            <div class="btnitem" @click.stop="shopdetail">进{{businessitxt?"店":"场"}}买起来</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 登录 -->
    <div class="mock_box" v-if="moty==5">
      <div class="login" @click.stop>
        <img src="https://files.eyee.com/activity/year-activity/tanchuang.png" alt>
        <div class="content flex-center flex-col">
          <p class="clickx" @click.stop="closemodel"></p>
          <p class="title">
            <img src="https://files.eyee.com/activity/year-activity/bangdingshoujihao.png" alt>
          </p>
          <div class="inputdiv">
            <p class="errtxt">{{errmsg}}</p>
            <input type="text" v-model="loginParms.mobile" placeholder="手机号">
            <div class="codediv flex">
              <p>请输入验证码</p>
              <p class="errtxt" v-if="codeerrmsg">{{'('+ codeerrmsg + ')'}}</p>
            </div>
            <div class="login-verify flex-between">
              <input type="number" maxlength="6" v-model="loginParms.code" placeholder="验证码">
              <p class="btn" :class="{btnclicked:timeSecs>1}" @click.stop="getValiCode">{{sentCode}}</p>
            </div>
          </div>
          <div
            class="btnitem"
            :class=" loginParms.mobile &&loginParms.code ? '' : 'nologin'"
            @click="loginRegist"
          >登录</div>
        </div>
      </div>
    </div>
    <div
      class="ser_home mock_box"
      :class="{'appRedPack':$root.ISAPP}"
      v-if="moty==6"
      @click.stop.prevent
    >
      <ul class="red_packet" id="red_packet">
        <template v-for="(item, index) in liParams">
          <li
            :key="'liParams'+index"
            :style="{ left: item.left, animationDuration: item.durTime, webkitAnimationDuration: item.durTime}"
            :class="item.cls"
            @webkitAnimationEnd="removeDom"
            @click.stop="robPacket(index)"
            v-if="item.src"
          >
            <i :style="{ transform: item.transforms, webkitTransform: item.transforms}">
              <img :src="item.src" alt>
            </i>
          </li>
        </template>
      </ul>
      <p class="btnclose" @click.stop="closemodel"></p>
      <div class="count flex-aic-end">
        <img src="https://files.eyee.com/activity/year-activity/shijian.png">
        <i>{{countTime}}s</i>
      </div>
      <div class="packet-footer">
        <img src="https://files.eyee.com/activity/year-activity/hongbaodui.png" alt>
      </div>
    </div>
    <!-- 分享 -->
    <shareModel @closeShareModel="shareClose" v-if="moty==7" :shareContent="shareContent"></shareModel>
  </div>
</template>


<script>
import shareModel from "../components/templates/h5ShareModel";
const elBody = document.getElementsByTagName("body")[0];
import {
  Nextraintime,
  Remaincount,
  Assignredpacket,
  Increasesharecount,
  Checkgiftpackage
} from "../utils/api/activities";

import { AntiBrush } from "../common/anti-brush";
import { mapGetters } from "vuex";
import { MD5, Checking } from "../common/util";
import * as api from "../common/api/user";

import { setTimeout } from "timers";
window._appShareCallback = function(res, via) {
  console.log("APP分享结果：" + res + "，渠道：" + via);
  // var result
  if (Number(res) === 1) {
    Increasesharecount()
      .then(res => {
        // _.updRemainCount();
      })
      .catch(e => {
        console.error(e);
      });
  }
};
export default {
  name: "RainModel",
  components: { shareModel },
  data() {
    return {
      shareContent: "分享后可再次获取一次机会哦~",
      liParams: [],
      timer: null,
      downtimer: null,
      threeTimer: null,
      lottertimer: null,
      countTime: 15,
      cutdownNum: 3,
      ishit: false,
      moty: 0,
      ishit: 0,
      businessid: "",
      CheckgiftData: [], //查看礼包数据
      duration: 15000, // 定义时间
      appShare: {},

      loginParms: {
        mobile: null,
        code: null
      },
      currentCode: "", // 区域号
      codeerrmsg: "",
      errmsg: "",
      sentCode: "获取验证码",
      timeSecs: 0,
      onoff: true,
      fullname: "",
      businessitxt: true
    };
  },
  props: {
    modelType: { type: Number, default: 0 },
    shareInfo: { type: Object },
    IsmainOrsub:{
      type:Boolean,default:true
    }
  },
  mounted() {
    let _ = this;
    _.currentCode = _.selectCountryCode;
    if (_.$root.ISAPP && _.modelType != 2 && _.IsmainOrsub) {
      _.getQueryParamUser().then(res => {
        Remaincount()
          .then(res => {
            if (res.remaincount > 0 || res.cancurrentgrap) {
              _.moty = 6;
              _.lotter();
            } else {
              _.moty = 0;
            }
          })
          .catch(e => {
            _.moty = 0;
            elBody.classList.remove("lock");
            console.error(e);
          });
      });
    } else {
      setTimeout(() => {
        _.moty = _.modelType;
        if (_.moty != 0) elBody.classList.add("lock");
        if (_.moty == 6) _.lotter();
      }, 500);
    }
  },
  computed: {
    ...mapGetters({
      selectCountryCode: "selectCountryCode"
    }),
    btnBg() {
      if (this.loginParms.mobile && this.loginParms.code) {
        return true;
      } else return false;
    }
  },
  methods: {
    closemodelMain() {
      let _ = this;
      _.$router.push("/20190128/main");
    },
    closemodel() {
      let _ = this;
      clearTimeout(_.downtimer);
      clearInterval(_.threeTimer);
      clearInterval(_.lottertimer);
      clearTimeout(_.timer);
      _.$emit("close");
      _.moty = 0;
      // _.updRemainCount();
      _.appcloseVebView();
      elBody.classList.remove("lock");
    },
    appcloseVebView() {
      let _ = this;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "closeAppWebView"
        });
      }
    },
    shopdetail() {
      let _ = this,
        url = "";
      if (_.businessid == "platform") {
        if (_.$root.isdebug) url = "http://qzone.eyee.com/20190128/main";
        else url = "https://m.eyee.com/20190128/main";
      } else {
        if (_.$root.isdebug)
          url =
            "http://qzone.eyee.com/20190128/sub?at=7&businessid=" +
            _.businessid;
        else
          url =
            "https://m.eyee.com/20190128/sub?at=7&businessid=" + _.businessid;
      }
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "openNewAppWebView",
          params: { url }
        });
      } else {
        window.location.href = url;
      }
      // _.$router.push("/shop/shopdetail/" + _.businessid);
    },
    checkModel() {
      this.moty = 4;
    },
    check(goto) {
      let _ = this;
      // console.log(goto)
      Checkgiftpackage(_.businessid)
        .then(res => {
          if (res) {
            _.CheckgiftData = res;
            _.fullname = _.CheckgiftData.coupons[0].fullname;
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    shareClose() {
      let _ = this;
      _.$emit("close");
      _.appcloseVebView();
      _.moty = 0;
    },
    // updRemainCount() {
    //   let _ = this;
    //   Remaincount()
    //     .then(res => {
    //       if (res.remaincount > 0 || res.cancurrentgrap) {
    //         _.moty = 0;
    //         _.$emit("close");
    //       }
    //     })
    //     .catch(e => {
    //       _.moty = 0;
    //       elBody.classList.remove("lock");
    //       console.error(e);
    //     });
    // },
    goShare() {
      let _ = this;

      if (_.$root.ISAPP) {
        Nextraintime()
          .then(res => {
            if (res && res.share) {
              let shareInfo = res.share;
              _.appShare.sharecontent = shareInfo.content;
              _.appShare.sharetitle = shareInfo.title;
              _.appShare.sharepicurl = shareInfo.icon;
              _.appShare.shareurl = shareInfo.url;
              _.appShare.xcxurl = shareInfo.xcxurl || "";
              _.appShare.callbackname = "_appShareCallback";
              _.javascriptBridge({
                name: "callAppShareDialog",
                params: { ..._.appShare }
              });
            }
          })
          .catch(e => {
            console.error(e);
          });
      } else {
        _.moty = 7;
        Increasesharecount()
          .then(res => {})
          .catch(e => {
            console.error(e);
          });
      }
    },
    lotter() {
      let _ = this;
      _.lottertimer = setInterval(() => {
        _.countTime--;
        if (_.countTime < 1) {
          _.countTime = 0;
          clearTimeout(_.timer);
          clearInterval(_.lottertimer);
          _.liParams = [];
          clearTimeout(_.downtimer);
          elBody.classList.remove("lock");
          if (!_.ishit) {
            _.toast("哎呀~~差一点就中奖啦~");
            _.moty = 0;
            _.appcloseVebView();
          } else {
            setTimeout(() => {
              //
              Assignredpacket(_.ishit)
                .then(res => {
                  if (res) {
                    console.log("res.businessid", res);
                    _.moty = 3;
                    _.businessid = res;
                    if (_.businessid == "platform") _.businessitxt = false;
                    else _.businessitxt = true;
                    _.check();
                  }
                })
                .catch(e => {
                  _.toast("哎呀~~差一点就中奖啦~");
                  _.moty = 0;
                  _.appcloseVebView();
                  console.error(e);
                });
            }, 2000);
          }
        }
      }, 1000);
      _.liParams = [];
      _.timer = setInterval(() => {
        _.startRedPacket();
      }, 30);
    },
    /**
     * 开启动画
     */
    startRedPacket() {
      let _ = this;
      let win =
        document.documentElement.clientWidth || document.body.clientWidth;
      let left = parseInt(Math.random() * (win - 50) - 5);
      var srcList = [
        // "https://files.eyee.com/activity/year-shopping/packet_pink.png",
        // "https://files.eyee.com/activity/year-shopping/packet_big.png",
        // "https://files.eyee.com/activity/year-shopping/packet_cap.png",
        "https://files.eyee.com/activity/year-activity/hongbao.png",
        // "https://files.eyee.com/activity/year-shopping/packet_bag.png",
        // "https://files.eyee.com/activity/year-shopping/packet_gu.png",
        // "https://files.eyee.com/activity/year-shopping/packet_red.png",
        "https://files.eyee.com/activity/year-activity/hongbao.png"
      ];
      let rotate = parseInt(Math.random() * (45 - -45) - 45) + "deg"; // 旋转角度
      let scales = (Math.random() * (12 - 8 + 1) + 8) * 0.3; // 图片尺寸
      let durTime = Math.random() * (2.5 - 1.2 + 1) + 2 + "s"; // 时间 1.2和1.2这个数值保持一样
      let src = srcList[Math.ceil(Math.random() * 9) - 1];
      _.liParams.push({
        left: left + "px",
        cls: "move_1",
        src,
        transforms: "rotate(" + rotate + ") scale(" + scales + ")",
        durTime: durTime
      });
      //  console.log('durTime',this.liParams)

      _.downtimer = setTimeout(() => {
        // 多少时间结束
        clearTimeout(_.timer);
        return;
      }, 13000);
    },
    robPacket(i) {
      let _ = this;
      if (Math.ceil(Math.random() * 10) > 5) {
        _.ishit = 1;
        _.liParams[i].src =
          "https://files.eyee.com/activity/year-shopping/packet_win.gif";
      } else {
        _.liParams[i].src =
          "https://files.eyee.com/activity/year-shopping/packet_not.gif";
      }
      setTimeout(() => {
        if (_.liParams && _.liParams[i]) _.liParams[i].src = "";
      }, 500);
    },
    /**
     * 回收dom节点
     */
    removeDom(e) {
      let target = e.currentTarget;
      // document.querySelector('#red_packet').removeChild(target)
    },

    //登录方法
    loginRegist() {
      let _ = this;
      if (_.currentCode == "+86" && !Checking(_.loginParms.mobile, "phone")) {
        _.toast("请输入合法的手机号码");
        return;
      }
      if (!_.loginParms.code) {
        _.toast("请输入验证码");
        return;
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
          _.toast("登录成功");
          // window.localStorage.setItem("currentUser", JSON.stringify(res));
          _.$store.dispatch("setUserInfo", res);
          _.closemodel();
        })
        .catch(e => {
          if (e && e.code == 1511533) {
            _.codeerrmsg = e.msg;
            setTimeout(() => {
              _.codeerrmsg = "";
            }, 1800);
          }
          _.toast("登录失败");
          console.error(e);
        });
    },
    getValiCode() {
      // 验证手机号
      let _ = this;
      if (_.timeSecs > 1) return;

      if (_.currentCode == "+86" && !Checking(_.loginParms.mobile, "phone")) {
        _.toast("请输入合法的手机号码");
        return false;
      }
      let option = {
        checktype: 1,
        mobile: _.currentCode + "-" + _.loginParms.mobile
      };
      AntiBrush(option, res => {
        if (res) {
          api
            .ValidSendCaptcha(res)
            .then(res => {
              // 发送验证码
              if (!res) {
                _.timeSecs = 60;
                _.toast("发送成功");
                _.timeRun = setInterval(() => {
                  if (_.timeSecs > 1) {
                    _.timeSecs--;
                    _.sentCode =
                      "(" + _.decpadleft(_.timeSecs) + "s" + ")" + "重新获取";
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
            });
        } else {
          _.toast("验证失败了~");
        }
      });
    },
    decpadleft(val) {
      if (val < 10) return "0" + val;
      else return val;
    }
  },
  watch: {
    modelType: function(newVal, olVal) {
      this.moty = newVal;
    },

    selectCountryCode: function(val, oldVal) {
      this.currentCode = val;
    }
  }
};
</script>
<style scoped>
.mock_box {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  /* background:none; */
  z-index: 999999;
}
.mock_box.appRedPack {
  background: url("https://files.eyee.com/activity/year-activity/home_rain_bg.jpg")
    0 0 no-repeat;
  background-size: 100% 100%;
}
.ser_home {
  width: 100%;
  height: 100vh;
  /* position: relative; */
}
.ser_home .btnclose {
  position: absolute;
  bottom: auto;
  right: 40px;
  top: 50px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  z-index: 101;
  background: url("https://files.eyee.com/activity/year-activity/guanbi.png") 0
    0 no-repeat;
  background-size: 100% 100%;
}
.red_packet {
  display: block;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

li {
  list-style: none;
  outline: none;
  position: absolute;
  animation: all 5s linear;
  width: 50px;
  height: 69px;
  top: -100px;
  z-index: 100;
}
li.move_1 {
  -webkit-animation: aim_move 10s linear 1 forwards;
  animation: aim_move 10s linear 1 forwards;
}

.packet-footer,
.count {
  position: fixed;
  width: 100%;
  height: 71px;
  left: 0;
  bottom: 0;
  z-index: 100;
}
.count {
  left: 10px;
  top: 20px;
  bottom: auto;
  width: 19.2vw;
  height: 11.66vw;
}
.count i {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 15px;
  width: 40px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  font-style: normal;
}
.packet-footer img,
.count img {
  width: 100%;
  display: block;
}
@keyframes aim_move {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(120vh);
    transform: translateY(120vh);
  }
}

.redcount {
  width: 100%;
  height: 100%;
}
.redcount img {
  width: 70%;
}
.redcount .redpacket {
  margin: 10% 0 3% 0;
  position: relative;
}
.redcount .redpacket img {
  width: 63%;
}
.redcount .redpacket p.count {
  position: absolute;
  top: 32%;
  left: 50%;
  transform: translate(-50%, 0);
  color: #d53010;
  font-size: 13.3333vw;
  font-weight: 700;
  text-align: center;
}
.content .clickx {
  border-radius: 50%;
  width: 25px;
  height: 25px;
  position: absolute;
  left: 50%;
  bottom: -40px;
  transform: translateX(-50%);
  background: url("https://files.eyee.com/activity/year-activity/guanbi.png") 0
    0 no-repeat;
  background-size: 100% 100%;
}
.redcount img.footer {
  width: 100%;
  position: fixed;
  bottom: 0;
}

.rules {
  margin: 30% 10% 0 10%;
  /* background-image: url("//files.eyee.com/activity/year-shopping/model-bg.png");
  background-size: 100% 100%; */
  color: #fff;
  position: relative;
}
.rules img {
  width: 100%;
}
.rules .content {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.rules .content p.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 50px;
  text-align: center;
  width: 30%;
  /* margin-top: 10px; */
}
.rules .content .item {
  font-size: 13px;
  line-height: 17px;
  margin: 1.5vw 8vw;
}
.rules .content p.txt {
  align-self: flex-start;
}
/* .rules .content p.clickx {
  width: 10%;
  text-align: center;
  font-size: 15px;
  align-self: flex-end;
  margin: 6.1333vw 4.6667vw;
} */

.game-end {
  margin: 30% 10% 0 10%;
  /* background-image: url("//files.eyee.com/activity/year-shopping/model-bg.png");
  background-size: 100% 100%; */
  color: #fff;
  position: relative;
}
.game-end img {
  width: 100%;
}
.game-end .content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.game-end .content .totleMoney {
  width: 40%;
  margin: 0 auto;
  position: relative;
}
.game-end .content .totleMoney span {
  position: absolute;
  left: 38%;
  top: 17px;
  font-size: 26px;
  font-weight: bold;
  color: #d50c0c;
}
.game-end .content p.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 25px;
  text-align: center;
}
.game-end .content p.txt {
  font-size: 13px;
  line-height: 17px;
  margin: 4vw 8vw 5vw 8vw;
  white-space: nowrap;
  text-align: center;
  width: 40%;
}
.game-end .content p.txt.toast-txt {
  width: 100%;
}
/* .game-end .content p.clickx {
  width: 10%;
  text-align: center;
  font-size: 20px;
  align-self: flex-end;
  margin: 5vw 3vw 0 0;
} */
.game-end .content .btnlist {
  width: 100%;
  padding: 2vw 8vw;
}
.game-end .content .btnlist .btnitem {
  width: 43%;
  background: url("https://files.eyee.com/activity/year-activity/denglu-2.png")
    0 0 no-repeat;
  background-size: 100% 100%;
  border-radius: 5px;
  overflow: hidden;
  color: #fff;
  font-weight: bold;
  font-size: 13px;
  padding: 2.1333vw 2.6667vw;
  text-align: center;
}

.couponList {
  margin: 30% 10% 0 10%;
  /* background-image: url("//files.eyee.com/activity/year-shopping/model-bg.png");
  background-size: 100% 100%; */
  color: #fff;
  position: relative;
}
.couponList img {
  width: 100%;
}
.couponList .content {
  position: absolute;
  top: 0;
  left: 0;
}
.couponList .content img {
  width: 70%;
}

.couponList .content p.title {
  width: 60%;
  font-size: 14px;
  line-height: 23px;
  text-align: center;
  margin-bottom: 5.3333vw;
}
.couponList .content p.txt {
  font-size: 13px;
  line-height: 17px;
  margin: 4vw 8vw 5vw 8vw;
  text-align: center;
}

.couponList .content .coupon-item {
  position: relative;
  margin: 1.3333vw 0;
}
.couponList .content .coupon-item .coupon-info {
  position: absolute;
  top: 10%;
  left: 16%;
  width: 70%;
  color: #d50c0c;
}
.couponList .content .coupon-item .coupon-info .infoleft .icon {
  width: 3.5vw;
  height: 3.5vw;
  background-color: #d50c0c;
  border-radius: 50%;
  color: #fcc87e;
  text-align: center;
  font-size: 2.6667vw;
  line-height: 3.57vw;
}
.couponList .content .coupon-item .coupon-info .infoleft .money {
  font-size: 8vw;
  line-height: 7vw;
}
.couponList .content .coupon-item .coupon-info .inforight {
  font-size: 3.5vw;
  line-height: 6.1333vw;
}
/* 
.couponList .content p.clickx {
  width: 10%;
  text-align: center;
  font-size: 20px;
  align-self: flex-end;
  margin: 5vw 3vw 0 0;
} */
.couponList .content .btnlist {
  width: 100%;
  padding: 2vw 8vw;
}
.couponList .content .btnlist .btnitem {
  background: url("https://files.eyee.com/activity/year-activity/denglu-2.png")
    0 0 no-repeat;
  background-size: 100% 100%;
  border-radius: 5px;
  overflow: hidden;
  color: #fff;
  font-weight: bold;
  font-size: 13px;
  padding: 2.1333vw 2.6667vw;
  text-align: center;
  white-space: nowrap;
}

.login {
  margin: 30% 10% 0 10%;
  /* background-image: url("//files.eyee.com/activity/year-shopping/model-bg.png");
  background-size: 100% 100%; */
  color: #fff;
  position: relative;
}
.login img {
  width: 100%;
}
.login .content {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.login .content p.title {
  font-weight: 600;
  font-size: 18px;
  line-height: 80px;
  text-align: center;
  letter-spacing: 2px;
  width: 55%;
}
.login .content p.txt {
  font-size: 13px;
  line-height: 17px;
  margin: 4vw 8vw 5vw 8vw;
}
/* .login .content p.clickx {
  width: 10%;
  text-align: center;
  font-size: 20px;
  align-self: flex-end;
  margin: 5vw 3vw 0 0;
} */

.login .content .btnitem {
  width: 35%;
  background: url("https://files.eyee.com/activity/year-activity/denglu-2.png")
    0 0 no-repeat;
  background-size: 100% 100%;
  border-radius: 5px;
  overflow: hidden;
  color: #333;
  font-weight: bold;
  font-size: 13px;
  padding: 2.1333vw 2.6667vw;
  text-align: center;
}
.login .content .nologin {
  width: 35%;
  background-color: #cccccc;
  border-radius: 5px;
  overflow: hidden;
  color: #fff;
  font-weight: bold;
  font-size: 13px;
  padding: 2.1333vw 2.6667vw;
  text-align: center;
}
.login .content .inputdiv {
  width: 75%;
}
.login .content .inputdiv input {
  width: 100%;
  height: 8.5333vw;
  margin: 5.3333vw 0;
  border: 1px #fff solid;
  background-color: transparent;
  color: #fff;
}

.login .content .inputdiv input:-moz-placeholder,
textarea:-moz-placeholder {
  color: #fff;
}

.login .content .inputdiv input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: #fff;
}

.login .content .inputdiv input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #fff;
}

.login .content .inputdiv .codediv {
  font-size: 13px;
  line-height: 17px;
}
.login .content .inputdiv .codediv .errtxt {
  font-size: 13px;
  line-height: 17px;
  color: #fee900;
  margin-left: 2.6667vw;
}
.login .content .inputdiv {
  margin-bottom: 30%;
}
.login .content .inputdiv .login-verify {
  margin: 2vw 0 0 0;
}
.login .content .inputdiv .login-verify input {
  margin: 0;
  width: 58%;
}
.login .content .inputdiv .login-verify .btn {
  width: 40%;
  border: 1px solid #fccd89;
  color: #fccd89;
  text-align: center;
  font-size: 11px;
  background: #999;
  padding: 3% 1%;
}

.login .content .inputdiv .login-verify .btnclicked {
  /* color: #564cc0;
  background-color: transparent;
  border-color: #fff; */
}
</style>
