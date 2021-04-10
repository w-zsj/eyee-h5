<template>
  <div class="invite-list">
    <div class="ball-tabs flex-between">
      <div :class="[{'act':acttabs==1},'tab tab1']" @click.stop="tabs(1)">
        <span>新用户邀请列表</span>
      </div>
      <div :class="[{'act':acttabs==2},'tab tab2']" @click.stop="tabs(2)">
        <span>老友邀请列表</span>
      </div>
    </div>
    <v-list
      :load-handle="reload"
      :more-handle="loadmore"
      :more-handling="loading"
      :isend="isend&&!!hasdata"
    >
      <div class="cont">
        <div class="recording flex-center" :class="{'blue':acttabs==2}">
          <div class="flex-center flex-col">
            <div class="special-font">
              {{oxballcount.logincount||0}}
              <i>位</i>
            </div>
            <div class="txt">累计邀请</div>
          </div>
          <div class="flex-center flex-col get-ball">
            <div class="special-font">
              {{oxballcount.gottenamount||0}}
              <i>牛丸</i>
            </div>
            <div class="txt">
              邀请累计
              <p>获得牛丸</p>
            </div>
          </div>
          <div class="flex-center flex-col">
            <div class="special-font">
              {{oxballcount.gettingamount||0}}
              <i>牛丸</i>
            </div>
            <div class="txt">待到账收益</div>
          </div>
        </div>
        <!-- 邀请好友列表 -->
        <div class="friend-list" v-if="hasdata">
          <div class="list" :class="{'blue':acttabs==2}" v-for="(item,index) in list" :key="index">
            <div class="header flex-tops">
              <div class="flex-start">
                <img :src="item.headimgurl" alt />
                <div class="user">
                  <span class="name">{{item.nickname}}</span>
                  <span class="timer flex-col flex-start">邀请日期:{{item.relationdate}}</span>
                </div>
              </div>
              <div
                class="btn"
                :class="{'red':item.status==0}"
                @click="goshare(item)"
              >{{item.status==0?'提醒登录':item.status==1?'奖励超时':'邀请成功'}}</div>
            </div>
            <!-- 进度条 -->
            <div class="progress-bar flex-between">
              <div class="line" :class="{'blue':acttabs==2}">
                <div class="bar" :style="{'width':item.leftval+'%'}"></div>
                <span class="felx-center" :style="{'left':item.leftval+'%'}">
                  <i class="felx-center">已获得{{item.gottenamount}}牛丸</i>
                </span>
              </div>
              <div class="ball-num">
                <span>{{item.unitamount||0}}</span>
                <i>牛丸</i>
              </div>
            </div>
            <!-- 已获得的牛丸 -->
            <div class="get-ox" v-if="item.txt">{{item.txt}}</div>
          </div>
        </div>
        <!-- 缺省页面 -->
        <div class="nodata" v-else :class="{'blue':acttabs==2}">
          <div class="title">暂无邀请{{acttabs==2?'老友':'新用户'}}</div>
          <img src="/static/imgs/ball/no_bg.png?c=1" alt v-if="acttabs==1" />
          <img src="/static/imgs/ball/no_bg_blue.png?c=1" alt v-else />
          <div class="btn" @click.stop="goball">立即邀请</div>
        </div>
      </div>
    </v-list>

    <!-- iphone x 填充 底色 -->
    <div class="ipx" v-if="getIsIphonex"></div>
  </div>
</template>
<script >
import { mapGetters } from "vuex";
import {
  BallListInfo,
  BallListInviteUser,
  BallListInviteRemind
} from "@/utils/api/oxball";
let page = 1,
  _loader,
  shareInfo = {};
export default {
  data() {
    return {
      hasdata: 1,
      acttabs: 1,
      isend: false,
      loading: false,

      oxballcount: {}, //牛丸数量
      list: []
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
  mounted() {
    let _ = this;
    // tabs 选中类型
    _.acttabs = (_.$route.query && _.$route.query.type) || 1;
    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json).then(res => {
          _.getInfo();
        });
      } else _.toast("登录失败~");
    };
    _.checkLogin(() => {
      _.reqmain();
      _.reload();
    });
    if (!_.$root.ISAPP) {
      _.confirm({
        msg: "请在【斗牛DoNew】APP内操作?",
        okText: "立即前往",
        cancelBtn: 1,
        ok: () => {
          _.openAppClient();
          setTimeout(() => {
            _.$router.replace("/loadapp");
          }, 800);
        }
      });
    }
  },
  methods: {
    //   主接口
    reqmain() {
      let _ = this;
      BallListInfo(_.acttabs)
        .then(res => {
          console.log("主接口数据-->>>", res);
          if (res) _.oxballcount = res;
          if (res.share) {
            shareInfo = res.share;
            // if (_.$root.ISAPP)
            //   _.javascriptBridge({
            //     name: "getAppActivityShareContent",
            //     params: {
            //       sharecontent: shareInfo.content,
            //       sharepicurl: shareInfo.icon,
            //       shareurl: shareInfo.url,
            //       sharetitle: shareInfo.title,
            //       callbackname: "",
            //       hideshareicon: false
            //     }
            //   });
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    tabs(i) {
      let _ = this;
      if (_.acttabs == i) return;
      _.acttabs = i;
      _.reqmain();
      _.reload();
    },
    goshare(item) {
      let _ = this;
      if (item.status == 0) {
        if (shareInfo && shareInfo.url) _.doShare();
        $log({
          e: "click_ball_list_remind",
          p: {
            userid: _.user.uid
          }
        });
      } else {
        // _.toast("不可点击");
      }
    },
    doShare() {
      let _ = this;
      /**
       * callAppDirectlyShare
        {
          "sharecontent":"分享内容",
          "sharepicurl":"分享图片地址",
          "shareurl":"分享链接",
          "sharetitle":"分享标题",
          "callbackname":"分享结果回调方法名",
          "xcxurl":"小程序的分享地址",
          "xcxicon":"小程序的封面图",
          "xcxid":"小程序的原始id",
          "type":"分享内容内型，1：是分享图片，2：是分享H5链接",
          "platform":"分享平台，1：是分享到朋友圈，2：是分享给微信好友"
        }
       */
      _loader = _.$loader("正在调起分享···");
      _.javascriptBridge({
        name: "callAppDirectlyShare",
        params: {
          sharecontent: shareInfo.content,
          sharepicurl: shareInfo.icon,
          shareurl: shareInfo.url,
          sharetitle: shareInfo.title,
          type: 2,
          platform: 2
        }
      });
      setTimeout(() => {
        _loader && _loader.close();
      }, 3000);
    },
    reload() {
      page = 1;
      window.scrollTo(0, 0);
      // this.list = [];
      this.load();
    },
    loadmore() {
      let _ = this,
        { isend } = _;
      if (isend) return;
      page++;
      _.load();
    },
    load() {
      let _ = this,
        type = _.acttabs;
      _.loading = true;
      // console.log("page--", _.isend, page);
      BallListInviteUser({ page, type })
        .then(res => {
          if (res.list && res.list.length > 0) {
            if (page === 1) _.list = res.list;
            else _.list = _.list.concat(res.list);
            _.list = _.list.map(i => {
              // status	邀请该当前的状态用户	Y	Integer	0=正常，1=过期未完成，2=全部领完
              switch (i.status) {
                case 0:
                  i.txt = `提醒他再活跃${i.times}天，你就能获得全部奖励`;
                  i.leftval = 21.428 * (3 - i.times); // 进度条
                  break;
                case 1:
                  i.txt = `你已获得${i.gottenamount}牛丸奖励`;
                  i.leftval = 21.428 * (3 - i.times); // 进度条
                  break;
                case 2:
                  i.txt = `你已获得该用户产生的全部奖励`;
                  i.leftval = 65.386;
                  break;
              }
              return i;
            });
          } else if (page === 1) _.list = [];

          if (_.list && _.list.length) _.hasdata = 1;
          else _.hasdata = 0;

          _.isend = res.page * res.size >= res.total;

          _.loading = false;
          console.log("BallListInviteUser res: ", _.list);
        })
        .catch(e => {
          console.error("ParticipateList error: ", e);
          _.loading = false;
          _.hasdata = 0;
          _.toast("加载失败~");
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
    },
    goball() {
      this.$router.push("/ball/summmon");
    }
  }
};
</script>
<style scoped lang='scss'>
$fs14: 3.733vw;
$fs12: 3.2vw;
$fs16: 4.266vw;
.mint-loadmore {
  background: none;
  color: #fff;
  min-height: 90vh;
}
.load-more {
  color: #fff !important;
}
.invite-list {
  // background: linear-gradient(#060e3b 20%, #151180);
  background: #060e3b url("/static/imgs/ball/list_bg.png?c=1") 0 12vw no-repeat;
  background-size: 100% auto;
  min-height: 100vh;
  padding-top: 13.333vw;
  box-sizing: border-box;
  .ball-tabs {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 3;
    .tab {
      font-size: 4vw;
      color: #fff;
      font-weight: bold;
      flex: 1;
      height: 13.333vw;
      span {
        display: block;
        height: 12vw;
        line-height: 12vw;
        text-align: center;
        margin-right: 1.333vw;
        margin-bottom: 1.333vw;
        border-radius: 0 0 1.6vw 0;
        border: 1px solid transparent;
      }
      &.tab1 {
        background: #f7624a;
        overflow: hidden;
        &.act {
          background: #b82f19;
          span {
            background: #f7624a;
            border: 1px solid #ff6850;
          }
        }
      }
      &.tab2 {
        background: #0e2de9;
        overflow: hidden;
        &.act {
          background: #0715b9;
          span {
            background: #0e2de9;
            border: 1px solid #243fe3;
          }
        }
      }
    }
  }
  .cont {
    padding-bottom: 2vw;
    .recording {
      font-family: "OswaldBold";
      color: #fff;
      font-size: 3.2vw;
      padding: 8.2666vw 0 6.9333vw;
      &.blue {
        .special-font {
          color: #6957fd;
        }
      }
      .get-ball {
        margin: 0 10.666vw 0 13.8666vw;
      }
      .txt {
        height: 9.0666vw;
      }
      .special-font {
        font-size: 28px;
        color: #f7624a;
        line-height: 11.2vw;
        margin-bottom: 3.466vw;

        i {
          font-size: 14px;
          color: #fff;
          font-weight: bold;
        }
      }
    }
    .friend-list {
      margin: 0 3.6993vw 0 2.666vw;

      .list {
        // background: url("/static/imgs/ball/ball_list_bg.png") 0 0 no-repeat;
        // background-size: 100% 100%;
        padding: 2.133vw 3.466vw 3.466vw 3.466vw;
        margin-bottom: 4vw;
        background: #ffebeb;
        border: 1.333vw solid #fdc44a;
        box-shadow: 1.0333vw 1.0333vw 0px 0px #da8f00;
        border-radius: 1.0666vw;
        &.blue {
          background: rgba(227, 223, 255, 1);
          box-shadow: 1.0333vw 1.0333vw 0px 0px rgba(31, 19, 144, 1);
          border: 1.333vw solid rgba(63, 48, 191, 1);
        }
        .header {
          justify-content: space-between;
          margin-bottom: 4.8vw;
          img {
            width: 11.7333vw;
            height: 11.7333vw;
            border-radius: 50%;
            margin-right: 2.66vw;
          }
          .name {
            color: #010724;
            font-size: $fs14;
            font-weight: bold;
            margin-bottom: 2px;
          }
          .timer {
            color: #010724;
            font-size: $fs12;
          }
          .btn {
            height: 7.466vw;
            padding: 0 1.3333vw;
            background: rgba(169, 169, 169, 1);
            box-shadow: 0px 0.5333vw 0px 0px rgba(121, 121, 121, 1),
              0px 0.5333vw 0.8vw 0px rgba(206, 206, 206, 0.5);
            border-radius: 1.0666vw;
            font-size: $fs12;
            color: #fff;
            font-weight: bold;
            line-height: 8.066vw;
            text-align: center;
            font-family: Arial, Helvetica, sans-serif;
            &.red {
              background: linear-gradient(
                360deg,
                rgba(237, 62, 35, 1) 0%,
                rgba(237, 62, 35, 1) 100%
              );
              box-shadow: 0px 0.5333vw 0px 0px rgba(155, 30, 16, 1),
                0px 0.5333vw 0.8vw 0px rgba(255, 143, 143, 0.5);
              border-radius: 1.0666vw;
              // border: 1.0666vw solid rgba(253, 196, 74, 1);
            }
          }
        }
        .progress-bar {
          margin-bottom: 3.733vw;
          .line {
            width: 63.466vw;
            height: 1.333vw;
            border-radius: 0.666vw;
            background: #ffdfdf;
            position: relative;
            &.blue {
              background: #d5cffd;
            }
            .bar {
              position: absolute;
              width: 0;
              left: 0;
              height: 100%;
              top: 0;
              border-radius: 0.666vw;
              background: linear-gradient(to right, #f76b1c, #fad961);
            }
            span {
              // padding: 0 1.33vw;
              background: #060825;
              // height: 4.8vw;
              border-radius: 2.5vw;
              color: #fff;
              border: 1px solid #fad15c;
              font-size: $fs12;
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              font-weight: bold;
              white-space: nowrap;
              i {
                line-height: 4.8vw;
                display: block;
                transform: scale(0.8333);
              }
            }
          }
          .ball-num {
            font-size: 5.333vw;
            color: #060825;
            font-family: OswaldBold;
            i {
              font-size: $fs12;
              font-weight: bold;
            }
          }
        }
        .get-ox {
          color: rgba(6, 8, 37, 0.69);
          font-size: $fs12;
        }
      }
    }
    .nodata {
      width: 92.533vw;
      height: 112.5333vw;
      margin: 0 auto;
      background: #ffebeb;
      border: 1.333vw solid #fdc44a;
      box-shadow: 1.0333vw 1.0333vw 0px 0px #da8f00;
      border-radius: 1.0666vw;
      text-align: center;
      &.blue {
        background: rgba(227, 223, 255, 1);
        box-shadow: 1.0333vw 1.0333vw 0px 0px rgba(31, 19, 144, 1);
        border: 1.333vw solid rgba(63, 48, 191, 1);
      }
      .title {
        margin: 17.333vw 0 6.4vw 0;
        color: #010724;
        font-size: $fs14;
        opacity: 0.69;
      }
      img {
        width: 66.133vw;
        margin-bottom: 8.8vw;
        min-height: 24vw;
      }
      .btn {
        width: 32vw;
        height: 11.2vw;
        margin: 0 auto;
        color: #fff;
        font-size: $fs14;
        line-height: 11.2vw;
        font-weight: bold;
        background: linear-gradient(360deg, #ed3e23 0%, #ed3e23 100%);
        box-shadow: 0px 0.5333vw 0px 0px #9b1e10,
          0px 0.5333vw 0.8vw 0px rgba(255, 143, 143, 0.5);
        border-radius: 1.0666vw;
      }
    }
  }
}
.ipx {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  background: #050d3e;
  height: 34px;
  transform: translateZ(0);
}
</style>