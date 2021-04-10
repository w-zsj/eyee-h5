<template>
  <div class="page">
    <div class="top">
      <div class="rule" @click="handleToRule">
        <span>牛丸规则</span>
      </div>
      <div class="now_text">
        <span>当前牛丸</span>
      </div>
      <div class="now_num">{{ oxballNowOwn }}</div>
      <div class="today_get">
        <div class="text">今日获取</div>
        <div class="num">{{ oxballTodayGet }}</div>
      </div>
      <div class="all_get">
        <div class="text">累计获取</div>
        <div class="num">{{ oxballTotalGet }}</div>
      </div>
    </div>

    <div :class="navClass" class="navwrap">
      <div class="ball_to_cash" v-if="showBallToCash"></div>
      <router-link
        active-class="active"
        replace
        :to="{ path: '/oxballdetail/' + item.url }"
        :key="index"
        tag="span"
        v-for="(item, index) in navItem"
        @click.native="changeIndex(index)"
      >{{ item.tit }}</router-link>
    </div>

    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { GetUserBallNumApi } from "@/utils/api/oxball";
export default {
  name: "OxballDetail",
  watch: {
    $route(to, from) {
      let _ = this;
      if (to.path.includes("get")) {
        _.navClass = "navwrap_get";
        _.currIndex = 0;
      } else if (to.path.includes("market")) {
        _.navClass = "navwrap_market";
        _.currIndex = 1;
      } else if (to.path.includes("record")) {
        _.navClass = "navwrap_record";
        _.currIndex = 1;
      }
    }
  },
  data() {
    return {
      navItem: [
        { tit: "获取牛丸", url: "get" },
        { tit: "牛丸商城", url: "market" },
        { tit: "牛丸记录", url: "record" }
      ],
      currIndex: 0,
      navClass: "navwrap_get"
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo",
      oxballNowOwn: "oxballNowOwn",
      oxballTodayGet: "oxballTodayGet",
      oxballTotalGet: "oxballTotalGet",
      showBallToCash: "showBallToCash"
    }),
    uid() {
      return !!(this.user && this.user.uid);
    }
  },
  beforeCreate() {
    document
      .querySelector("body")
      .setAttribute("style", "background-color:#f2f2f2");
  },
  mounted() {
    let _ = this;
    setTimeout(() => {
      if (_.$root.loging) {
        _.$root.loging
          .then($ => {
            _.getUserBall();
          })
          .catch(e => {
            console.error(e);
          });
      } else {
        _.checkLogin(() => {
          _.getUserBall();
        });
      }
    }, 300);

    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json).then(res => {
          _.getUserBall();
        });
      } else _.toast("登录失败~");
    };

    // if (!_.$root.ISAPP) {
    //   _.confirm({
    //     msg: "请在【斗牛DoNew】APP内操作?",
    //     okText: "立即前往",
    //     cancelBtn: 1,
    //     ok: () => {
    //       _.openAppClient();
    //       setTimeout(() => {
    //         _.$router.replace("/loadapp");
    //       }, 800);
    //     }
    //   });
    // }
    if (this.$route.path.includes("get")) {
      _.navClass = "navwrap_get";
      _.currIndex = 0;
    } else if (this.$route.path.includes("market")) {
      _.navClass = "navwrap_market";
      _.currIndex = 1;
    } else if (this.$route.path.includes("record")) {
      _.navClass = "navwrap_record";
      _.currIndex = 2;
    }
  },
  beforeDestroy() {
    document.querySelector("body").removeAttribute("style");
  },
  methods: {
    handleToRule() {
      window.location.href =
        "https://m.eyee.com/active/c7d9b39ac39f4a0dba799f5a3d8e9099";
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
    changeIndex(index) {
      let _ = this;
      if (index === _.currIndex) return;
      if (index === 0) {
        _.navClass = "navwrap_get";
      } else if (index === 1) {
        _.navClass = "navwrap_market";
      } else {
        _.navClass = "navwrap_record";
      }
      _.currIndex = index;
      $log({ e: "click_ball_index_tab", p: { type: index } });
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
  }
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f2f2f2;
  overflow: hidden;
}
.top {
  position: relative;
  width: 100%;
  height: 34.133vw;
  background: url("/static/imgs/ball/bg.png?c=1?c=1") no-repeat;
  background-size: 100% 100%;
}
.now_text {
  position: absolute;
  left: 8.333vw;
  top: 5.6vw; /*21px */
  width: 27.2vw;
  height: 8.8vw;
  background: url("/static/imgs/ball/nowOxball.png?c=1?c=1");
  background-size: cover;
  text-align: center;
  line-height: 7.8333vw;
}
.now_text span {
  font-size: 3.7333vw;
  color: #fff;
  line-height: 6.9333vw;
  font-weight: 600;
  margin-left: 4.2667vw;
}
.now_num {
  position: absolute;
  left: 9.333vw;
  top: 13.0667vw; /*49 */
  font-size: 10.6667vw; /*40 */
  color: #fff;
  font-weight: bold;
  font-family: "OswaldBold";
  src: url("https://files.eyee.com/eyeeh5/font/Oswald.otf");
}
.today_get {
  position: absolute;
  top: 14.9333vw; /*56*/
  left: 49.3333vw; /* 185 */
  height: 12.8vw;
  width: 20.2667vw;
  text-align: right;
  color: #fff;
}
.today_get .text {
  line-height: 6.4vw;
  font-size: 3.7333vw;
  font-weight: 600;
}
.today_get .num {
  line-height: 6.4vw;
  font-size: 4.2667vw; /* 16*/
  font-weight: bold;
  /* font-family: OswaldBold; */
  /* src: url("https://files.eyee.com/eyeeh5/font/Oswald.otf"); */
}
.line {
  position: absolute;
  top: 13.6vw;
  left: 70.1333vw;
  width: 1px;
  height: 12.8vw;
  background: rgba(255, 255, 255, 0.5);
}
.all_get {
  position: absolute;
  top: 14.9333vw; /*56 */
  left: 70.4vw;
  width: 20.2667vw;
  height: 12.8vw;
  text-align: right;
  color: #fff;
}
.all_get .text {
  line-height: 6.4vw;
  font-size: 3.7333vw;
  font-weight: 600;
}
.all_get .num {
  line-height: 6.4vw;
  font-size: 4.2667vw; /*16 */
  font-weight: bold;
  /* font-family: OswaldBold;
  src: url("https://files.eyee.com/eyeeh5/font/Oswald.otf"); */
}
.navwrap {
  width: 100vw;
  height: 14.4vw;
  line-height: 14.4vw;
  font-size: 4.2667vw;
  font-weight: 600;
  color: #fff;
  position: relative;
  margin-top: -1px;
}
.navwrap_get {
  background: url("/static/imgs/ball/nav_bg_get.png?c=1") no-repeat;
  background-size: 100% 100%;
}
.navwrap_market {
  background: url("/static/imgs/ball/nav_bg_market.png?c=1") no-repeat;
  background-size: 100% 100%;
}
.navwrap_record {
  background: url("/static/imgs/ball/nav_bg_record.png?c=1") no-repeat;
  background-size: 100% 100%;
}
.navwrap .ball_to_cash {
  position: absolute;
  bottom: 8.933vw;
  left: 49.866vw;
  width: 21.0667vw;
  height: 8.5333vw;
  background: url("/static/imgs/ball_to_cash.png?c=1") no-repeat;
  background-size: 100% 100%;
}
.navwrap span {
  position: relative;
  width: 33.33%;
  float: left;
  text-align: center;
}
.navwrap span.active {
  color: #232323;
}

.rule {
  position: absolute;
  top: 4vw;
  right: 0px;
  font-size: 3.2vw;
  color: #ffffff;
  font-weight: 400;
  line-height: 6.6667vw;
  text-align: center;

  width: 19.4667vw;
  height: 6.6667vw;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 26.6667vw 0px 0px 26.6667vw;
  overflow: hidden;

  span {
    padding-left: 1.0667vw; /*4 */
    margin-top: 0.2667vw;
    display: inline-block;
  }
}
</style>
