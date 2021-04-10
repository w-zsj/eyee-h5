<template>
  <div class="box">
    <!-- 顶部 -->
    <!-- <v-header :showback="true" :bg="dark" v-if="!$root.ISAPP">
      <div class="nav-tab2 ellipsis">{{title}}</div>
    </v-header>-->
    <loader class="load" from="2">
      <img src="/static/img/bull/download_app.png?c=1" alt />
    </loader>
    <div :class="{'sneaker-mall': hasdata===1,}" v-if="hasdata===1">
      <div class="monitor_card">
        <img src="https://files.eyee.com/eyeeh5/img/monitor/card.png" alt />
      </div>
      <div class="monitor_Box">
        <div class="monitor_info_box">
          <div class="info" v-if="monitorInfo.remain >0 && !monitorInfo.isget">
            <img class="word1" src="https://files.eyee.com/eyeeh5/img/monitor/word1.png" alt />
            <p>{{monitorInfo.remain}}</p>
            <img class="word2" src="https://files.eyee.com/eyeeh5/img/monitor/word2.png" alt />
          </div>
          <div class="info" v-else-if="monitorInfo.isget">
            <img class="word3" src="https://files.eyee.com/eyeeh5/img/monitor/word3.png" alt />
          </div>
          <div class="info" v-else-if="monitorInfo.remain <= 0">
            <img class="word4" src="https://files.eyee.com/eyeeh5/img/monitor/word4.png" alt />
          </div>
        </div>
        <div class="btn_box">
          <div
            class="btn"
            @click="shareFriend(1)"
            v-if="monitorInfo.remain >0 && !monitorInfo.isget"
          >分享立即解锁，GOT’EM!</div>
          <div class="btn" @click="shareFriend(2)" v-else-if="monitorInfo.isget">邀请更多好友来使用</div>
        </div>
        <div class="explain_box">
          <img class="word4" src="https://files.eyee.com/eyeeh5/img/monitor/monitor_exp.png" alt />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { MonitorShare, Internalactive } from "../../../common/api/monitor";
import Loader from "@/comps/Loader";
let loader;

export default {
  components: { Loader },
  data() {
    return {
      title: "斗牛球鞋监控",
      hasdata: 2,
      monitorInfo: {}
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    notloged() {
      return !(this.user && this.user.uid);
    }
  },
  beforeDestroy() {
    document.body.classList.remove("lock");
  },
  mounted() {
    let _ = this;
    _.setToolBar({ title: _.title });
    _.hasdata = 1;

    if (_.$root.ISAPP) {
      _.getQueryParamUser().then(res => {
        _.handleInit();
      });
    } else if (_.user && _.user.token) {
      _.handleInit();
    } else {
      // h5 未登录
      _.handleInit();
    }
  },
  methods: {
    handleInit() {
      let _ = this,
        userid = _.user.uid;
      MonitorShare({ userid })
        .then(res => {
          _.monitorInfo = res;
          _.hasdata = 1;
        })
        .catch(e => {
          _.toast(e && e.msg ? e.msg : "");
        });
    },
    // 分享朋友 解锁
    shareFriend(type) {
      //  type == 1 解锁 type == 2 是分享
      let _ = this,
        userid = _.user.uid,
        shareInfo = _.monitorInfo.share;
      if (_.$root.ISAPP && shareInfo) {
        $log({
          e: "monitorShareClick",
          p: { userid: userid, describe: "监控卡分享" }
        });

        loader = _.$loader("正在调起微信分享···");
        setTimeout(() => {
          loader.close();
          if (type == 1) {
            // 分享成功后
            // 调激活的接口
            Internalactive()
              .then(res => {
                _.toast("激活成功~");
                // 页面重新加载一遍
                _.handleInit();
              })
              .catch(e => {
                _.toast(e && e.msg ? e.msg : "");
              });
          }
        }, 3000);
        // 自测可用下面代码
        // window._shareCallBack(1, "ios");
        // return
        _.javascriptBridge({
          name: "callAppDirectlyShare",
          params: {
            sharecontent: shareInfo.content,
            sharetitle: shareInfo.content,
            xcxurl: shareInfo.xcxurl,
            xcxicon: shareInfo.xcxicon || "",
            xcxid: shareInfo.xcxid || "gh_038ca9308eac",
            shareurl: "",
            type: 2,
            platform: 2,
            callbackname: "_shareCallBack"
          }
        });
      } else {
        _.loadApp("请前往【斗牛DoNew】APP参与活动~");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.load {
  position: sticky;
  top: 0;

  img {
    display: block;
    width: 100vw;
  }
}
.sneaker-mall {
  background: #fff;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  font-family: Arial, Helvetica, sans-serif;
}
.monitor_card {
  width: 100%;
  height: auto;
  img {
    display: block;
    width: 100%;
  }
}
.monitor_Box {
  width: 100%;
  min-height: 60.5vh;
  padding: 0 0 40px 0;
  background: url("https://files.eyee.com/eyeeh5/img/monitor/monitor_bg.png")
    center center no-repeat;
  background-size: 100% 100%;
}
.monitor_info_box {
  padding: 26px 0;
  .info {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 20px;
      &.word1 {
        width: 36px;
      }
      &.word2 {
        width: 90px;
      }
      &.word3 {
        width: 262px;
      }
      &.word4 {
        width: 180px;
        height: 48px;
      }
    }
    p {
      line-height: 20px;
      height: 20px;
      font-size: 24px;
      color: #fa2337;
      text-align: center;
      font-family: 'OswaldBold';
      padding: 0 4px;
    }
  }
}
.btn_box {
  width: 100%;
  padding: 0 8vw 8vw;
  .btn {
    width: 100%;
    text-align: center;
    font-size: 16px;
    color: #fff;
    background: #fa2337;
    border-radius: 25px;
    height: 50px;
    line-height: 50px;
    font-weight: bold;
    &.cover {
      background: #969696;
    }
  }
}
.explain_box {
  padding: 0 9vw;
  .explain_item {
    margin-bottom: 10px;
    h2 {
      font-size: 16px;
      color: #232323;
      font-weight: normal;
      height: 30px;
      line-height: 30px;
    }
    .info {
      font-size: 12px;
      color: #646464;
      line-height: 20px;
    }
    .info_t {
      font-size: 12px;
      color: #646464;
      line-height: 20px;
      padding-left: 10px;
    }
  }
}
</style>

