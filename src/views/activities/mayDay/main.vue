<template>
  <div class="big-wrap" v-if="loading==1">
    <!-- <v-header :showback="true" :bg="dark" v-if="!$root.ISAPP">
        <div class="nav-tab2 ellipsis">{{title}}</div>
    </v-header>-->
    <div class="banner" v-if="banner">
      <img :src="banner" alt>
    </div>
    <div class="big-content">
      <!-- 专区 -->
      <div class="activity-area flex-btwn flex-wrap" v-if="venues.length>0">
        <div
          class="plate"
          :class="{'last':index==2}"
          v-for="(item,index) in venues"
          :key="'main'+index"
          @click.stop="goPromotion(item)"
        >
          <img :src="item.img" alt>
        </div>
      </div>
      <!-- 精选好物 -->
      <!-- <div class="choose_tit"></div> -->

      <!-- 推荐店铺 -->
      <div v-if="shops.length>0">
        <img src="https://files.eyee.com/activity/2019618/hot-s.jpg" alt>

        <div class="flex-wrap shops">
          <div v-for="(si, sIdx) in shops" :key="'shop'+sIdx" @click.stop="goShop(si)">
            <img v-lazy="si.img" alt>
          </div>
        </div>
      </div>

      <img src="https://files.eyee.com/activity/2019618/hot-p.jpg" alt>
      <complate @banner="getbanner"></complate>
    </div>

    <router-link class="fix-lottery" to="/618/lottery" tag="div">
      <img v-lazy="'https://files.eyee.com/activity/2019618/lottery-enter.png'" alt>
    </router-link>
  </div>
  <p v-else-if="loading==2">未加载到活动信息</p>
</template>
<script>
import { BigStorerecommend } from "@/utils/api/activities";
import complate from "./complate";
export default {
  components: { complate },
  data() {
    return {
      loading: 0,
      title: "「斗牛」6·18年中狂欢 潮货1折疯抢",
      banner: "",
      venues: [],
      shops: []
      // prefecture: [
      //   {
      //     pic: "https://files.eyee.com/eyeeh5/img/fashion_choice.png",
      //     themetype: 1,
      //     name: "潮牌精选"
      //   },
      //   {
      //     pic: "https://files.eyee.com/eyeeh5/img/sum_new_pro.png",
      //     themetype: 2,
      //     name: "夏季新品"
      //   },
      //   {
      //     pic: "https://files.eyee.com/eyeeh5/img/fashion_feature.png",
      //     themetype: 3,
      //     name: "潮流特色精选"
      //   }
      // ]
    };
  },
  mounted() {
    let _ = this;
    if (_.$root.ISAPP) _.getAppParams();

    _.getVenueAndShop();
  },
  methods: {
    // 获取app参数
    getAppParams(pa) {
      let _ = this;
      _.getQueryParamUser(pa)
        .then(res => {})
        .catch(e => {
          console.error("链接参数处理异常: ", e);
        });
    },
    getVenueAndShop() {
      let _ = this;
      BigStorerecommend()
        .then(res => {
          console.log("getVenueAndShop res: ", res);
          _.loading = 1;
          if (res) {
            if (res.themetypes && res.themetypes.length)
              _.venues = res.themetypes;
            if (res.stores && res.stores.length) _.shops = res.stores;
          }
        })
        .catch(e => {
          _.loading = 2;
          console.error("getVenueAndShop error: ", e);
        });
    },
    goPromotion(item) {
      let _this = this;

      if (!_this.$root.isdebug)
        window.gio("track", "H5PlatBaner", { platBanner: item.themetype });

      _this.$router.push(`/618/${item.themetype}`);
    },
    getbanner(item) {
      // console.log("banner", item);
      this.banner = item.banner || "";
      this.title = item.title || "潮人出游 换装必选";
    },
    goShop(item) {
      let _ = this;
      // 店铺详情
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppOnlineShopHomePage",
          params: {
            businessid: item.businessid
          }
        });
      } else _.$router.push(`/shop/shopdetail/${item.businessid}`);
    }
  },
  destroyed() {
    document.body.classList.remove("lock");
  }
};
</script>
<style lang="scss" scoped>
.fix-lottery {
  position: fixed;
  top: 42vh;
  right: 2vw;
  width: 18vw;

  img {
    display: block;
  }
}

.big-wrap {
  max-width: 750px;
  margin: 0 auto;
  min-height: 100%;
  .banner {
    min-height: 58.4vw;
  }
}
img {
  display: block;
  width: 100%;
}
.activity-area {
  // margin-bottom: 10px;
  height: 47.2vw;
  background: linear-gradient(0deg, #fff, #fc0039);
  // background: url("https://files.eyee.com/eyeeh5/img/quick_bg.jpg") center
  //   center no-repeat;
  // background-size: cover;
  padding: 10px 10px 0 10px;
  .plate {
    width: 48.2%;
    height: 73px;
    &.last {
      width: 100%;
      height: 83px;
    }
  }
}
.choose_tit {
  height: 18px;
  background: url("https://files.eyee.com/eyeeh5/img/line.jpg") center center
    no-repeat;
  background-size: cover;
  text-align: center;
  line-height: 18px;
  color: #333;
  font-size: 20px;
  font-weight: bold;
}

.shops {
  padding: 1.6vw;

  & > div {
    width: 30.66vw;
    margin: 0.8vw;
  }
}
</style>
