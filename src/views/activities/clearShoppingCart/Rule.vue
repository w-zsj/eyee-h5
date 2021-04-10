<template>
  <div class="cspc">
    <img src="/static/imgs/cspc/main-banner.png" alt>
    <v-delay :delay="200" class="cspc-main">
      <img src="/static/imgs/cspc/main-bg.png" alt>
      <!-- 活动时间 -->
      <div class="cspc-date">
        <img src="/static/imgs/cspc/arrow-bgx.png" alt>
        <p>活动时间: 1月{{date.begin}}日0点-1月{{date.end}}日{{date.hour}}点</p>
      </div>

      <!-- 参与方式 -->
      <div class="cspc-join">
        <p class="flex-col cspc-step1">
          <span>选择商品-加入购物车</span>
        </p>
        <p class="flex-col cspc-step2">
          <span>回到当前页-创建我的购物车-帮我清空-生成海报-分享至朋友圈</span>
        </p>
        <p class="flex-col cspc-step3">
          <span>1月{{date.end}}日 20:00直播开奖</span>
          <span>微博:斗牛APP&emsp;抖音号:DoNew_app</span>
        </p>
      </div>

      <!-- 年货节 -->
      <div class="cspc-list flex-center" @click="goto('/20190110/main')">
        <div class="cspc-item" v-for="(li, lIdx) in list" :key="'list'+lIdx">
          <img src="/static/imgs/cspc/border-rect.png" alt>
          <img :src="li.img" alt>
        </div>
        <div class="cspc-enter">
          <img src="/static/imgs/cspc/arrow-bgx.png" alt>
          <span>24个潮货榜单疯狂来袭, 速去围观></span>
        </div>
      </div>
      <!-- 会场 -->
      <div class="cspc-venue">
        <div
          v-for="(vi, vIdx) in venue"
          :key="'venue'+vIdx"
          class="flex-center"
          :class="{'flex-reverse':vIdx%2==1}"
          @click="goto(vi.url)"
        >
          <div class="venue-avatar">
            <img src="/static/imgs/cspc/border-circle.png" alt>
            <img :src="vi.avatar" alt>
          </div>
          <div class="venue-title">
            <img src="/static/imgs/cspc/arrow-bg.png" alt>
            <p v-html="vi.title"></p>
          </div>
          <img class="venue-flag" :src="`/static/imgs/cspc/flag-${vi.flag}.png`" alt>
        </div>
      </div>

      <!-- 注意事项 -->
      <div class="cspc-rule">
        <p class="flex" v-for="(ri, rIdx) in rule" :key="'rule'+rIdx">
          <span class="font-price">{{rIdx+1}}</span>
          <span v-html="ri"></span>
        </p>
      </div>
    </v-delay>
    <v-delay :delay="500">
      <img src="/static/imgs/cspc/footer.png" alt>
    </v-delay>
    <v-delay :delay="500" class="fix-footer">
      <div class="cspc-btn">
        <img src="/static/imgs/cspc/btn-full.png" alt>
        <button @click="goInfo">{{joined?'查看我的清空购物车清单':(act?'创建我的购物车':'去年货节扫货～')}}</button>
      </div>
    </v-delay>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import { GetPosterStatus } from "@/utils/api/activities";


export default {
  name: "ClearShoppingCartRule",
  data() {
    return {
      date: {
        begin: 12,
        end: 19,
        hour: 18
      },
      act: true,
      joined: false,
      geted: false,
      list: [
        {
          img: "/static/imgs/cspc/act-enter-1.png",
          url: ""
        },
        {
          img: "/static/imgs/cspc/act-enter-2.png",
          url: ""
        },
        {
          img: "/static/imgs/cspc/act-enter-3.png",
          url: ""
        }
      ],
      venue: [
        {
          avatar: "/static/imgs/cspc/av-supreme.png",
          title: "Supreme等海量潮牌五折疯抢!另有满399再减100!",
          flag: "half",
          url: "/20190110/sub?at=4&tt=11"
        },
        {
          avatar:
            "https://files.eyee.com/Shop/system/main/e121f131baa04788a1203b6de752bcfb.jpg",
          title: "Champion热销榜单5折起购！<br>进店购买另享399减100！",
          flag: "half",
          url: "/20190110/sub?at=4&tt=10"
        }
      ],
      rule: [
        "只有在<strong>本页面点击【创建我的购物车】才有【清空购物车】的权限</strong>，所以加完购物车记得回到当前页面哦。",
        "若参加活动选购的商品总价值超出10万，则需要在中奖后的24小时内完成超出部分的支付，否则中奖无效。",
        "分享到朋友圈的活动海报不可设置分组，开奖前不可删除，否则开奖无效。",
        "球鞋不参加本次活动。"
      ]
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" })
  },
  watch: {
    user(val, old) {
      if (val && val.token) {
        this.getStatus();
      }
    }
  },
  beforeMount() {
    let _ = this;

    _.act = +new Date() < +new Date(`2019/01/${_.date.end} ${_.date.hour}:00`);

    _.setToolBar({
      title: "清空购物车",
      showshoppingcarticon: false
    });
    _.setShare();

    if (_.user.token) {
      _.getStatus();
    }
  },
  methods: {
    setShare() {
      let _ = this,
        info = {
          title: "「斗牛」免费帮你清空十万购物车",
          desc:
            "十万任你挑，还有Supreme等潮流大牌低至5折，满399再减100等福利活动！助你引爆新年满满欧气！",
          img: window.location.origin + "/static/imgs/cspc/share.png",
          url: window.location.origin + "/cspc/rule"
        };
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "getAppActivityShareContent",
          params: {
            sharetitle: info.title,
            sharecontent: info.desc,
            sharepicurl: info.img,
            shareurl: info.url,
            hideshareicon: false
          }
        });
      } else if (_.$root.ISWX) {
        _.initShare({ info });
      }
    },
    goInfo() {
      let _ = this;

      _.getQueryParamUser()
        .then(res => {
          console.log("getQueryParamUser res:", res);
          let version = parseInt(res.param.version.replace(/\./g, ""));

          if (version < 320) _.toast("请将斗牛APP更新到最新版V3.2.0参与活动~");
          else {
            if (_.act) {
              _.$router.push("/cspc/info");
            } else _.goto("/20190110/main");
          }
        })
        .catch(e => {
          console.error("goInfo error:", e);
          switch (e.code) {
            case 0: // 不在APP
              _.confirm({
                msg: "请在斗牛APP中参与活动~",
                okText: "立即前往",
                cancelText: "我再想想",
                ok: _.openAppClient
              });
              break;
            case 1: // 无参
            case 2: // 处理参数异常
              console.error("deal url query param error: ", e);
              _.toast("获取版本信息异常~ 请退出重进试试~");
              break;
            case 3: // 自动登录异常
              _.toast("获取登录信息异常~ 请退出重进试试~");
              break;
          }
        });

      // if (_.$root.ISAPP) {
      //   // 判断版本号 提示更新APP 3.2.0
      //   if (queryParam) {
      //     try {
      //       let param = JSON.parse(decodeURIComponent(queryParam)),
      //         version = parseInt(param.version.replace(/\./g, ""));
      //       // console.log("----------", version, param);

      //       if (version < 320) {
      //         _.toast("请将斗牛APP更新到最新版V3.2.0参与活动~");
      //         return;
      //       }
      //       // _.$store.dispatch("setUserInfo", param);
      //     } catch (e) {
      //       console.error("deal url query param error: ", e);
      //     }
      //   } else {
      //     _.toast("获取版本信息异常~ 退出重进试试~");
      //     return;
      //   }

      //   if (_.user.token) {
      //     if (_.act) {
      //       _.$router.push("/cspc/info");
      //     } else _.goto("/20190110/main");
      //   } else _.toast("没有登录~");
      // } else
      //   _.confirm({
      //     msg: "请在斗牛APP中参与活动~",
      //     okText: "立即前往",
      //     cancelText: "我再想想",
      //     ok: _.openAppClient
      //   });
    },
    getStatus() {
      let _ = this;
      if (_.geted) return;
      _.geted = true;

      GetPosterStatus()
        .then(res => {
          console.log("GetPosterStatus res: ", res);
          if (res && res.isgenerated == 1) _.joined = true;
        })
        .catch(e => {
          console.error("GetPosterStatus error: ", e);
        });
    },
    goto(url) {
      console.log("goto url: ", url);
      this.$router.push(url);
    }
  }
};
</script>
<style scoped>
.cspc {
  padding-bottom: 50px;
}
.cspc img {
  display: block;
}
.cspc-main {
  position: relative;
}
.cspc-main > div {
  position: absolute;
  left: 0;
  width: 100%;
}

.cspc-main .cspc-date {
  top: 6%;
  width: 70%;
  margin-left: 15%;
}
.cspc-date p {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  line-height: 28px;
  text-align: center;
}
.cspc-date p,
.cspc-join p {
  color: #fff;
  font-size: 3.5vw;
  font-weight: bold;
}

.cspc-join {
  top: 25%;
}
.cspc-join p {
  width: 64%;
  height: 16vw;
}
.cspc-join .cspc-step1 {
  line-height: 16vw;
  margin-top: 8vw;
  margin-left: 36%;
}
.cspc-join .cspc-step2 {
  margin-top: 11.6vw;
  margin-left: 10.8vw;
  width: 55%;
}
.cspc-join .cspc-step3 {
  margin-top: 12.6vw;
  margin-left: 34%;
}

.cspc-list {
  top: 50.74%;
}
.cspc-venue {
  top: 70%;
}
.cspc-rule {
  top: 86.3%;
}

.cspc-item {
  position: relative;
  width: 27%;
  overflow: hidden;
}
.cspc-item:nth-child(2) {
  width: 33%;
}
.cspc-item > img:last-of-type {
  position: absolute;
  top: 50%;
  left: 9%;
  width: 82%;
  transform: translate(0, -50%);
  border-radius: 5px;
}
.cspc-enter {
  position: absolute;
  width: 75%;
  bottom: -60px;
  line-height: 33px;
}
.cspc-enter img {
}
.cspc-enter span {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  color: #fff;
  font-size: 4.2vw;
  font-weight: 800;
  text-decoration: underline;
}

/* .cspc-venue {
  padding: 0 8%;
} */
.cspc-venue > div {
  position: relative;
  margin-bottom: 24px;
}
.venue-avatar {
  position: relative;
  width: 19.73%;
  margin: 0 1%;
}
.venue-avatar img:last-of-type {
  position: absolute;
  top: 50%;
  left: 7%;
  width: 87%;
  transform: translate(0, -50%);
  border-radius: 50%;
}
.venue-title {
  position: relative;
  width: 52.8%;
}
.flex-reverse .venue-title > img {
  transform: scaleX(-1);
}
.venue-title p {
  position: absolute;
  top: 50%;
  left: 12%;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  transform: translate(0, -50%);
}
.venue-flag {
  position: absolute;
  width: 18.53%;
  top: 0;
  right: 8%;
  transform: translate(0, -50%);
}
.flex-reverse .venue-flag {
  /* top: 15px; */
  left: 6%;
  right: unset;
  transform: rotate(-30deg);
  top: -8px;
}
.flex-reverse .venue-title p {
  left: 9%;
}
.cspc-rule {
  padding: 20px 30px;
}
.cspc-rule p {
  color: #fff;
  align-items: flex-start;
  margin-bottom: 2.67vw;
}
.cspc-rule p span:first-of-type {
  background: #c59560;
  margin-top: 3px;
  margin-right: 10px;
  width: 3.2vw;
  height: 3.2vw;
  line-height: 3.47vw;
  font-weight: 900;
  font-size: 4vw;
  text-align: center;
}
.cspc-rule p span:last-of-type {
  max-width: 90%;
  font-size: 3.2vw;
}
.cspc-btn {
  position: relative;
  width: 94%;
  left: 3%;
  padding: 5px;
}
.cspc-btn button {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}
</style>
