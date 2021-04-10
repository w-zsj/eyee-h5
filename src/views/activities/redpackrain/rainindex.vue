<template>
  <div class="rain_wrap" :class="{ pf: isOverdue }">
    <div class="rule_btn" @click="goRule()">活动规则</div>
    <!--活动未结束-->
    <div v-if="!isOverdue">
      <div class="invitation_wrap_start">
        <div class="money" @click="goAllOver()">
          红包金额: <span>{{ amount.toFixed(2) }}</span>
        </div>
        <div class="residue">
          剩余次数：<span class="residue-count">{{ overcount }}</span> 次
        </div>
        <!-- <div class="countdown">
          <div class="hour">{{countDown[0]}}</div>
          <div class="minute">{{countDown[1]}}</div>
          <div class="second">{{countDown[2]}}</div>
        </div> -->
        <div class="invitation_header">
          <div
            class="invitation_header_item"
            v-for="(item, index) in userList"
            :key="'u' + index"
          >
            <img :src="item" />
          </div>
          <div
            class="invitation_header_item"
            v-for="(item, index) in 10 - userList.length"
            :key="'n' + index"
            @click="showInvitationFriend"
          ></div>
        </div>
        <div class="invitation_btn" @click="showInvitationFriend"></div>
      </div>
      <!-- <div class="invitation_rule">
        <div>1、邀新斗牛新用户组队参与活动，即可额外获得受邀新用户之后每场红包雨所抢到红包金额的30%！</div>
        <div>2、邀新斗牛老用户组队参与活动，即可额外获得受邀老用户之后每场红包雨所抢到红包金额的5%！</div>
        <div>
          3、红包雨场次
          <br />日期：12月20日-12月24日，持续5天
          <br />场次：11:00、15:00、20:00，每天三场。
          <br />12月25日14:00，当天一场。
          <br />日期：12月30日-12月31日，持续5天。
          <br />场次：11:00、15:00、20:00，每天三场。
          <br />1月1日14:00，当天一场。
        </div>
      </div>-->
      <!--未登录-->
      <div class="start" :class="showStart ? 'start-ani' : ''" @click="remind(false)" v-if="!uid && !isStart">
        {{ showStart ? "立即开始" : "游戏明天继续" }}
      </div>
      <!--已登录&&未提醒-->
      <div
        class="start"
        :class="showStart ? 'start-ani' : ''"
        v-if="uid && !isOrder && !isStart"
        @click="remind(showStart)"
      >
        {{ showStart ? "立即开始" : "游戏明天继续" }}
      </div>
      <!--已登录&&已提醒-->
      <div
        class="start"
        :class="showStart ? 'start-ani' : ''"
        v-if="uid && isOrder && !isStart"
        @click="goStart(showStart)"
      >
        {{ showStart ? "立即开始" : "游戏明天继续" }}
      </div>
      <!--已开始-->
      <div class="start" :class="overcount > 0  ? 'start-ani' : ''" v-if="isStart" @click="goStart(true)">{{ overcount > 0 ? '立即开始' : '游戏明天继续'}}</div>
    </div>
    <!--活动已结束-->
    <div v-if="isOverdue">
      <div class="invitation_wrap_end"></div>
      <!--已结束 未登录-->
      <div class="start" @click="order()" v-if="!uid">未登录</div>
      <!--已结束 已登录&&未参与-->
      <div class="start" v-if="uid && !isJoin">未参与</div>
      <!--已开始 已登录&&已参与-->
      <div class="start" v-if="uid && isJoin" @click="myPackRed()">
        我的红包
      </div>
    </div>
    <!--提醒成功后提示框-->
    <transition-group name="fade">
      <div class="mask" v-if="maskByRemind" key="maskByRemind"></div>
      <div class="order_box" v-if="maskByRemind" key="maskByRemindBox">
        <div class="order_box_title">提醒成功</div>
        <div class="order_box_text">
          邀请好友组队，最高抢200元无门槛红包！最多可邀请10人组队！
          <br />邀新斗牛新用户组队参与活动，即可额外获得受邀新用户之后每场红包雨所抢到红包金额的30%！
          <br />邀新斗牛老用户组队参与活动，即可额外获得受邀老用户之后每场红包雨所抢到红包金额的5%！
        </div>
        <div class="order_box_btn red" @click="invitationFriend">立即邀请</div>
        <div class="order_box_btn white" @click.stop="closeBox">以后再说</div>
      </div>
    </transition-group>
    <!--邀请人数已达上限提示框-->
    <transition-group name="fade">
      <div
        class="mask"
        v-if="maskByInvitationNum"
        key="maskByInvitationNum"
      ></div>
      <div
        class="order_box"
        v-if="maskByInvitationNum"
        key="maskByInvitationNumBox"
      >
        <div class="order_box_title">温馨提示</div>
        <div class="order_box_text" style="text-align:center">
          邀请人数已达上限,是否继续邀请?
        </div>
        <div class="order_box_btn red" @click="invitationFriend">继续邀请</div>
        <div class="order_box_btn white" @click.stop="closeBox">以后再说</div>
      </div>
    </transition-group>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { DateDiff } from "@/common/util";
import {
  RedPackRainOpenMainApi,
  RedPackRainMainApi,
  RedPackRainAppointmentApi,
  RedPackRainBeginGameApi,
  shareRainToFriendApi,
  RedPackRainAllOverApi
} from "@/utils/api/redpackrain";
export default {
  name: "rainindex",
  data() {
    return {
      overcount: 3, //剩余次数
      shareUserId: "", // 分享者ID
      scene: 0, // 活动场次
      maskByRemind: false, // 提醒成功后提示框状态控制
      maskByInvitationNum: false, // 人数达到上限弹窗状态控制
      isOrder: false, // 用户是否被提醒
      isStart: 1, // 是否正在进行
      isOverdue: false, // 活动是否已结束
      isJoin: false, // 用户是否参与过该活动
      userList: [], // 邀请的好友头像
      countDown: [], // 倒计时数组
      remaintime: 0, // 倒计时时间戳
      timeRun: null, // 倒计时对象
      nowTime: Date.now(),
      showStart: false,
      amount: 0
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo"
    }),
    uid() {
      return !!(this.user && this.user.uid);
    },
    getIsIphonex() {
      if (this.$root.ISIOS) {
        if (screen.height == 812 && screen.width == 375) {
          return true;
        } else {
          return false;
        }
      }
    },
    startGame(){
      if(uid){

      }else{
        return ""
      }
    }
  },
  mounted() {
    let _ = this;
    _.remaintime = 0;
    _.shareUserId = _.$route.query.shareUserId || "";
    console.log(_.uid, "uid");
    //判断用户是否在APP或者小程序登录  _.$root.loging
    if (_.$root.loging) {
      _.$root.loging
        .then($ => {
          console.log(_.uid, "uid");
          console.log(_.shareUserId, "shareUserId");
          _.getMainInfo();
          _.getmyPackRed();
        })
        .catch(e => {
          console.error("query prams auto login error:", e);
        });
    } else {
      if (_.uid) {
        _.getMainInfo();
        _.getmyPackRed();
      } else {
        _.getOpenMainInfo();
      }
    }

    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json).then(res => {
          _.getMainInfo();
          _.getmyPackRed();
        });
      } else _.toast("登录失败~");
    };
    // if (!_.$root.ISAPP && !_.$root.ISMP) {
    //   _.confirm({
    //       msg: "请在【斗牛DoNew】APP内操作?",
    //       okText: "立即前往",
    //       cancelBtn: 1,
    //       ok: () => {
    //         _.openAppClient();
    //         setTimeout(() => {
    //           _.$router.replace("/loadapp");
    //         }, 800);
    //       }
    //   });
    // }
  },
  beforeCreate() {
    document.getElementsByTagName("body")[0].className = "rain_wrap_body";
  },
  beforeDestroy() {
    let _ = this;
    document.body.removeAttribute("class", "rain_wrap_body");
    _.remaintime = 0;
    _.isOverdue = false;
    _.isStart = false;
    clearTimeout(_.timeRun);
  },
  methods: {
    goAllOver() {
      let _ = this;
      if (!_.uid) {
        _.loginConfirm();
      } else {
        _.$router.push("/rainallover");
      }
    },
    getmyPackRed() {
      let _ = this;
      RedPackRainAllOverApi()
        .then(res => {
          console.log(res);
          _.amount = res.amount;
        })
        .catch(e => {
          console.log(e);
        });
    },
    goRule() {
      let _ = this;
      _.$router.push("/rainrule");
    },
    getOpenMainInfo() {
      let _ = this;
      RedPackRainOpenMainApi()
        .then(res => {
          _.remaintime = res.countdown; // 下一场倒计时
          _.isOverdue = res.overdue; // 活动是否已经全部结束
          _.isStart = res.start;
          // _.countdownTime();
        })
        .catch(e => {
          console.log(e);
        });
    },
    getMainInfo() {
      let _ = this;
      RedPackRainMainApi(_.shareUserId)
        .then(res => {
        console.log("TCL: getMainInfo -> res", res)
          _.scene = res.scene; // 活动场次
          _.isOrder = res.appointment; // 是否预约
          _.isStart = res.start; // 活动是否开始
          _.isOverdue = res.overdue; // 活动是否已经全部结束
          _.isJoin = res.partake; // 是否参加
          _.userList = res.shareuser; // 邀请的用户头像列表
          _.remaintime = res.countdown; // 下一场倒计时
          _.overcount = res.overcount;
          // _.countdownTime();
        })
        .catch(e => {
          console.log(e);
        });
    },
    countdownTime() {
      let _ = this;
      var ts = DateDiff({
        destination: new Date(_.nowTime + _.remaintime),
        type: "H"
      });
      console.log(ts, "~~~~");
      if (ts.H <= 0 && ts.m <= 0 && ts.s <= 0) {
        _.countDown = ["00", "00", "00"];
        _.showStart = true;
        return;
      }
      let H = ts.H < 10 ? "0" + ts.H : ts.H;
      let M = ts.m < 10 ? "0" + ts.m : ts.m;
      let S = ts.s < 10 ? "0" + ts.s : ts.s;
      _.countDown = [H, M, S];
      if (ts.H === 0 && ts.m === 0 && ts.s === 1) {
        _.countDown = ["00", "00", "00"];
        _.showStart = true;
        clearTimeout(_.timeRun);
      } else {
        _.timeRun = setTimeout(() => {
          // _.countdownTime();
        }, 1000);
      }
    },
    showInvitationFriend() {
      let _ = this;
      if (_.uid) {
        if (_.userList.length >= 10) {
          if (_.$root.ISAPP) {
            _.maskByInvitationNum = true;
          } else if (_.$root.ISMP) {
            //小程序
            wx.miniProgram.navigateTo({
              url: "/pages/home/rainshare?id=10"
            });
          }
        } else {
          if (_.$root.ISAPP) {
            _.shareApp();
          } else if (_.$root.ISMP) {
            wx.miniProgram.navigateTo({
              url: "/pages/home/rainshare?id=1"
            });
          }
        }
      } else {
        _.loginConfirm();
      }
    },
    invitationFriend() {
      let _ = this;
      if (_.uid) {
        _.shareApp();
      } else {
        _.loginConfirm();
      }
    },
    remind(start) {
      let _ = this;
      if (_.uid) { //已经登陆
        if (start) { //活动是否开始
          RedPackRainBeginGameApi(_.scene)
            .then(res => {
              let rainList = res.repacketRain;
              localStorage.setItem("rainList", JSON.stringify(rainList));
              _.$router.push("/raincountdown");
            })
            .catch(e => {
              _.toast(e.msg);
            });
        } else {
          
          // RedPackRainAppointmentApi(_.scene)
          //   .then(res => {
          //     _.isOrder = true;
          //     if (_.$root.ISAPP) {
          //       // _.maskByRemind = true;
          //     } else {
          //       if (_.userList.length <= 10) {
          //         wx.miniProgram.navigateTo({
          //           url: "/pages/home/rainshare?id=1"
          //         });
          //       } else {
          //         wx.miniProgram.navigateTo({
          //           url: "/pages/home/rainshare?id=10"
          //         });
          //       }
          //     }
          //   })
          //   .catch(e => {
          //     console.log(e);
          //   });
        }
      } else {
        _.loginConfirm();
      }
    },
    goStart(start) {
      let _ = this;
      if(this.overcount <= 0){
        return
      }
      if (start) {
        if (!_.uid) {
          _.loginConfirm();
        } else {
          RedPackRainMainApi()
            .then(res => {
              if (res.start) {
                RedPackRainBeginGameApi(_.scene)
                  .then(res => {
                    let rainList = res.repacketRain;
                    localStorage.setItem("rainList", JSON.stringify(rainList));
                    _.$router.push("/raincountdown");
                  })
                  .catch(e => {
                    _.toast(e.msg);
                  });
              } else {
                _.toast("当前访问用户人数过多,请刷新页面");
              }
            })
            .catch(e => {
              console.log(e);
            });
        }
      }
    },
    myPackRed() {
      let _ = this;
      _.$router.push("/rainallover");
    },
    closeBox() {
      let _ = this;
      _.maskByRemind = false;
      _.maskByInvitationNum = false;
    },
    shareApp() {
      let _ = this;
      shareRainToFriendApi()
        .then(res => {
          let loader = _.$loader("正在调起微信分享···");
          setTimeout(() => {
            loader.close();
          }, 3000);
          let shareInfo = {
            sharecontent: res.sharecontent || "",
            sharepicurl: res.sharepicurl || "",
            shareurl: res.shareurl || "",
            sharetitle: res.sharecontent || "",
            callbackname: res.callbackname || "",
            xcxurl: res.xcxurl || "",
            xcxicon: res.xcxicon || "",
            xcxid: res.xcxid || "",
            type: 2,
            platform: 2
          };
          if (_.$root.ISAPP) {
            _.javascriptBridge({
              name: "callAppDirectlyShare",
              params: shareInfo
            });
          } else if (_.$root.ISMP) {
            wx.miniProgram.postMessage({ data: shareInfo });
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    order() {
      let _ = this;
      _.loginConfirm();
    },
    loginConfirm() {
      let _ = this;
      _.confirm({
        title: "登录提示",
        msg: "请登录后重试~",
        okText: "前往登录",
        cancelText: "容我想想",
        ok: () => {
          if (_.$root.ISAPP) {
            _.javascriptBridge({
              name: "callAppLoginPage",
              params: { callbackname: "_appLoginCallback" }
            });
          } else if (_.$root.ISMP) {
            wx.miniProgram.navigateTo({
              url: "/pages/other/bind"
            });
          } else {
            _.$router.push("/login");
          }
        }
      });
    }
  }
};

// ok: () => {
//   if (ENV.ua.eyee) {
//     _.javascriptBridge({
//       name: "callAppLoginPage",
//       params: { callbackname: "_appLoginCallback" }
//     });
//   } else if (ENV.ua.mini) {
//     wx.miniProgram.navigateTo({
//       url: "/pages/other/bind"
//     });
//   } else _.$router.push("/login");
// }
</script>
<style>
.rain_wrap_body {
  width: 100%;
  height: 100%;
  background: url("/static/imgs/redpackrain/ipx.png") repeat-y;
  background-size: 100% 9.0667vw;
}
</style>
<style lang="scss" scoped>
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: rgba(0, 0, 0, 0.6);
}
.myredpack .close_btn {
  position: absolute;
  right: 0vw;
  top: 0vw;
  width: 8vw;
  height: 7.6vw;
  background: url("/static/imgs/redpackrain/close_btn.png") no-repeat;
  background-size: 100% 100%;
}
/*我的红包*/

/*提示框*/
.order_box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 76vw;
  height: auto;
  background: rgba(246, 246, 246, 1);
  border-radius: 6px;
  z-index: 2;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.order_box_title {
  font-size: 20px;
  font-weight: 800;
  line-height: 16vw;
  text-align: center;
  color: #0f0f0f;
}
.order_box_text {
  padding: 0 5.5155vw 4.8vw;
  font-size: 14px;
  color: #444444;
  text-align: justify;
  line-height: 6.9333vw;
}
.order_box_btn {
  margin: 0 auto;
  width: 65.3333vw;
  height: 11.7333vw;
  line-height: 11.7333vw;
  text-align: center;
  font-size: 16px;
  text-align: center;
  border-radius: 5px;
}
.order_box_btn.red {
  background: #f13237;
  color: #f7f7f7;
}
.order_box_btn.white {
  color: #444444;
}

.rain_wrap {
  width: 100%;
  height: 100%;
  padding-bottom: 10vw;
  overflow: hidden;
  position: relative;
  min-height: 100vh;
  background: url("/static/imgs/redpackrain/bg.jpg?qwqw") no-repeat;
  background-size: 100% 255.2vw;
}
.rule_btn {
  position: absolute;
  right: 0;
  top: 11.4667vw;
  width: 18.4vw;
  height: 7.0667vw;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-top-left-radius: 3.4667vw;
  border-bottom-left-radius: 3.4667vw;
  font-size: 14px;
  line-height: 7.0667vw;
  text-align: center;
}
.invitation_wrap_start {
  width: 86.8vw;
  height: 92.6667vw;
  background: url("/static/imgs/redpackrain/invitation_bg.png") no-repeat;
  background-size: 100% 100%;
  margin: 50vw auto 0;
  position: relative;
  overflow: hidden;
}
.invitation_wrap_end {
  width: 86.8vw;
  height: 79.3333vw;
  background: url("/static/imgs/redpackrain/invitation_end_bg.png") no-repeat;
  background-size: 100% 100%;
  margin: 66.4vw auto 0;
  position: relative;
  overflow: hidden;
}
/* .pf {
  position: fixed;
} */
.invitation_wrap_start .money {
  margin: 7.7333vw auto 0;
  width: 60.5333vw;
  height: 11.4667vw;
  background: #f41437;
  border-radius: 5px;
  box-shadow: 1px 1px 8px 0px rgba(85, 23, 23, 0.61);
  font-size: 23px;
  font-weight: bold;
  color: #ffe5c5;
  text-align: center;
  line-height: 11.4667vw;
}
.invitation_wrap_start .money span {
  font-family: OswaldBold;
}
.countdown {
  margin: 4.6667vw auto 0;
  width: 61.0667vw;
  height: 6.1333vw;
  background: url("/static/imgs/redpackrain/countdown_bg.png") no-repeat;
  background-size: 100% 100%;
  font-size: 4.8vw;
  font-weight: bold;
  color: #fff;
  line-height: 6.1333vw;
  text-align: center;
}
.countdown .hour {
  position: absolute;
  left: 30.9vw;
  top: 23.7333vw;
  width: 7.8667vw;
  height: 6.1333vw;
}
.countdown .minute {
  position: absolute;
  left: 45.4vw;
  top: 23.7333vw;
  width: 7.8667vw;
  height: 6.1333vw;
}
.countdown .second {
  position: absolute;
  left: 60.2vw;
  top: 23.7333vw;
  width: 7.8667vw;
  height: 6.1333vw;
}
.invitation_header {
  margin: 5.7333vw auto 0;
  width: 70.6667vw;
  height: 28.2667vw;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.invitation_header_item {
  width: 11.0667vw;
  height: 11.0667vw;
  background: url("/static/imgs/redpackrain/invitation_header_item.png")
    no-repeat;
  background-size: 100% 100%;
  margin: 0 0.8vw;
}
.invitation_header_item img {
  width: 11.0667vw;
  height: 11.0667vw;
  border: 1px solid #fff;
  border-radius: 50%;
}
.invitation_btn {
  position: absolute;
  width: 73.3333vw;
  height: 16.5333vw;
  background: url("/static/imgs/redpackrain/invitation_btn.png") no-repeat;
  background-size: 100% 100%;
  left: 7.8667vw;
  top: 67.4667vw;
}
.invitation_rule {
  width: 71.6vw;
  margin: 1.6vw auto 0;
  overflow: hidden;
  color: #fef2dc;
  font-size: 14px;
  font-weight: 400;
}
.invitation_rule div {
  margin-top: 5.3333vw;
  line-height: 20px;
  text-align: justify;
}
.start {
  margin: 6.4vw auto 0;
  width: 90vw;
  height: 18.1333vw;
  background: url("/static/imgs/redpackrain/start.png") no-repeat;
  background-size: 100% 100%;
  font-size: 25px;
  font-weight: bold;
  color: #fff;
  line-height: 18.1333vw;
  text-align: center;
}

.start-ani{
  animation:start 1s infinite;
}

@keyframes start
{
0% {
  transform: scale(0.95)
}
50% {
  transform: scale(1)
}
100%{
  transform: scale(0.95)
}
}

.residue {
  font-size: 18px;
  font-weight: 400;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  &-count {
    width: 30px;
    height: 23px;
    display: inline-block;
    font-weight: bold;
    // padding: 5px 20px;
    background: #0f0f0f;
    border-radius: 3px;
    overflow: hidden;
    line-height: 23px;
    text-align: center;
    margin-right: 6px;
  }
}
</style>