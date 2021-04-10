<template>
  <div>
    <div class="banner" @click="imgGoToUrl()">
      <img src="/static/imgs/ball/banner.png?c=1" />
    </div>

    <TaskCard @change="handleTaskChange" v-if="inviteTaskData" :item="inviteTaskData"></TaskCard>

    <div class="signIn" v-if="signInData.day >= 0">
      <div class="signIn-title">
        <div>
          <div class="title">服务签到</div>
          <div class="sub-title">本周进度 {{ signInData.day }}/7</div>
        </div>
        <div class="btn" @click="signInStatus.fun" :class="signInStatus.css">{{ signInStatus.text }}</div>
      </div>
      <div class="signIn-content">
        <div
          class="signIn-content-item"
          :class="signInData.day <= index ? 'noSignIn' : ''"
          v-for="(item, index) in 7"
          :key="index"
          :style="index === 3 ? ' margin-right: 0px;' : ''"
        >
          <div class="day">第{{ index + 1 }}天</div>
          <div class="count">+{{ signInData[`day${index + 1}`] }}</div>
        </div>
      </div>
    </div>

    <Title>每日任务</Title>
    <TaskCard
      @change="handleTaskChange"
      v-for="(item, index) in taskList"
      :key="index"
      :item="item"
    ></TaskCard>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  GetBallTaskListApi,
  GetBallApi,
  GetUserBallNumApi,
  SigninShow,
  ReceiveReward,
  getInviteTask
} from "@/utils/api/oxball";
import { getIosVersion } from "@/common/util";

import Title from "../components/Title";
import TaskCard from "../components/TaskCard";

export default {
  name: "oxballget",
  components: {
    Title,
    TaskCard
  },
  data() {
    return {
      imgUrl: "/ball/summmon",
      taskList: [],
      signInData: {},
      inviteTaskData: undefined
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo"
    }),
    uid() {
      return !!(this.user && this.user.uid);
    },
    signInStatus() {
      let status = this.signInData.rewardstatus;
      switch (status) {
        case 1:
          return {
            css: "can",
            fun: this.getAward,
            text: "领取"
          };
        case 2:
          return {
            css: "done",
            fun: () => {},
            text: "已完成"
          };
        case 3:
          return {
            css: "",
            fun: this.goSignIn,
            text: "去签到"
          };
        default:
          return {
            fun: () => {},
            css: "",
            text: ""
          };
      }
    }
  },
  mounted() {
    let _ = this;
    setTimeout(() => {
      if (_.$root.loging) {
        _.$root.loging
          .then($ => {
            _.getTaskList();
            this.getSignInList();
            this.handleGetInviteTask();
          })
          .catch(e => {
            console.error(e);
          });
      } else {
        _.checkLogin(() => {
          _.getTaskList();
          this.getSignInList();
          this.handleGetInviteTask();
        });
      }
    }, 300);

    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json).then(res => {
          _.getTaskList();
        });
      } else _.toast("登录失败~");
    };
  },
  methods: {
    // physicalReturn() {
    //   let _ = this;
    //   _.javascriptBridge({
    //     name: "gotoAppMallCenterPage",
    //     params: {
    //       homepageindex: 4
    //     }
    //   });
    // },
    handleTaskChange() {
      console.log("asdasdasd");
      this.getTaskList();
      this.getUserBall();
      this.handleGetInviteTask();
    },
    handleGetInviteTask() {
      getInviteTask()
        .then(res => {
          console.log("TCL: handleGetInviteTask -> res", res);
          if (res) {
            this.inviteTaskData = res;
          } else {
            this.inviteTaskData = undefined;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    getAward() {
      console.log("领取奖品");
      ReceiveReward()
        .then(res => {
          this.toast("牛丸领取成功");
          this.getUserBall();
          this.getSignInList();
        })
        .catch(err => {
          console.error(err);
        });
    },
    goSignIn() {
      console.log("去签到");
      this.javascriptBridge({
        name: "gotoAppServiceVIPPage"
      });
    },
    getSignInList() {
      // return
      SigninShow()
        .then(res => {
          console.log("TCL: getSignInList -> res", res);
          this.signInData = res;
        })
        .catch(err => {
          console.error(err);
        });
    },
    imgGoToUrl() {
      let _ = this;
      $log({ e: "click_ball_banner_friend" });
      _.$router.push({
        path: _.imgUrl
      });
    },
    getTaskList() {
      let _ = this;
      GetBallTaskListApi()
        .then(res => {
          if (res) {
            _.taskList = res;
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    goToTask(type, auctionid) {
      let _ = this;
      if (type === 7) {
      } else if (type === 8) {
        if (auctionid) _.$router.push("/auction/" + auctionid);
      } else if (type === 9) {
        _.javascriptBridge({
          name: "gotoAppSearchAuctionProductPage"
        });
      } else {
        _.javascriptBridge({
          name: "gotoAppMallCenterPage"
        });
      }
    },
    getBall(code) {
      let _ = this;
      let { user } = _;
      GetBallApi(code)
        .then(res => {
          _.getTaskList();
          _.getUserBall();
          _.toast("领取牛丸成功");
          $log({
            e: "click_get_ball_task",
            p: { code: code, userid: user.uid }
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    getUserBall() {
      let _ = this;
      let data = {};
      GetUserBallNumApi()
        .then(res => {
          data.totalnewballnum = res.totalnewballnum;
          data.todaynewballnum = res.todaynewballnum;
          data.nownewballnum = res.nownewballnum;
          data.showBallToCash = res.isshowimg;
          _.$store.dispatch("getOxBallData", data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    checkLogin(call) {
      let _ = this;
      if (_.uid) call();
      else {
        _.confirm({
          title: "登录提示",
          msg: "请登录后重试~",
          okText: "前往登录",
          cancelText: "容我想想",
          ok: () => {
            _.javascriptBridge({
              name: "callAppLoginPage",
              params: { callbackname: "_appLoginCallback" }
            });
          }
        });
      }
    }
  },
  filters: {
    typeToText(type) {
      let text;
      switch (type) {
        case 3:
          text = "去社区发帖";
          break;
        case 4:
          text = "去分享";
          break;
        case 5:
          text = "去评论";
          break;
        case 6:
          text = "去点赞";
          break;
        case 7:
          text = "未完成"; //消息推送
          break;
        case 8:
          text = "去拍卖会场";
          break;
        case 9:
          text = "去发拍";
          break;
        case 10:
          text = "去发帖";
          break;
      }
      return text;
    }
  }
};
</script>

<style lang="scss" scoped>
.banner {
  width: 92vw;
  height: auto;
  margin: 4vw auto;
  border-radius: 1.0667vw;
  overflow: hidden;
}
.banner img {
  display: block;
  width: 100vw;
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 21.3333vw;
  height: 8.8vw;
  border-radius: 0.5333vw;
  border: 1px solid #fa4b4b;
  font-size: 3.7333vw;
  font-weight: 600;
  color: #fa2337;
}

.can {
  background: #fa2337;
  color: #fff;
}

.done {
  background: #dcdcdc;
  color: #fff;
  border: none;
}

.signIn {
  margin: 0 auto;
  width: 92vw;
  height: 72.8vw;
  background: #fff;
  border-radius: 1.6vw;
  overflow: hidden;
  padding: 4vw 4vw 8vw 4vw;
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4.2667vw;
  }

  .noSignIn {
    color: #969696;
    background-image: url("/static/imgs/ball/no-signInBg.png?c=1");
  }

  &-content {
    display: flex;
    flex-wrap: wrap;
    &-item {
      color: #903d0c;
      width: 19.2vw;
      height: 21.3333vw;
      background: url("/static/imgs/ball/signInBg.png?c=1");
      background-size: cover;
      border-radius: 0.5333vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: 2.4vw;
      margin-bottom: 2.6667vw;

      .day {
        margin-top: 3.4667vw; /*13 */
        font-size: 3.2vw;
        font-weight: 400;
        line-height: 4.5333vw;
        margin-bottom: 1.6vw;
      }

      .count {
        font-size: 6.4vw;
        font-weight: bold;
        line-height: 10.1333vw;
        font-family: "OswaldBold";
      }
    }
  }
}

.title {
  color: #232323;
  font-size: 4.2667vw;
  font-weight: 600;
}
.sub-title {
  font-size: 3.4667vw;
  font-weight: 400;
  color: #646464;
}
</style>