<template>
  <div class="big-wrap">
    <!-- <v-header :showback="true" :bg="dark" v-if="!$root.ISAPP">
          <div class="nav-tab2 ellipsis">{{title}}</div>
    </v-header>-->
    <!-- banner -->
    <div class="banner">
      <img :src="banner" alt>
    </div>
    <!-- 小版块 -->
    <!-- <div class="sub-recd" :class="styleClass">
          <div class="title" v-if="isShowTitle">
            <img src="https://files.eyee.com/eyeeh5/img/sum_title.png" alt="">
          </div>
          <div class="flex-aic flex-wrap">
            <div v-for="(item,index) in modulePic" :key="'fas'+index" class="bloc-dev" :class="{'first':index===0}" @click.stop="GoDiffPlat(item)">
              <img :src="item.coverurl||item.img" alt="">
            </div>
          </div>
    </div>-->
    <!-- 精选好物 -->
    <!-- <div class="choose_tit">
          <img :src="`https://files.eyee.com/eyeeh5/img/${themetype==2?`line`:`hot_sigle`}.jpg`" alt="">
    </div>-->
    <complate @banner="getbanner"></complate>
  </div>
</template>
<script>
// import { BigStorerecommend } from "@/utils/api/activities";
import { mapGetters } from "vuex";
import complate from "./complate";
const themety = {
  fashion: 1,
  summer: 2,
  features: 3
};
export default {
  components: { complate },
  data() {
    return {
      banner: "",
      title: "",
      themetype: themety.fashion,
      styleClass: "", // fashion-brand 潮牌精选页面 new-summer 夏季新品 trend-features 潮流特色
      modulePic: []
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    isShowTitle() {
      return this.themetype == themety.summer;
    },
    queryThemeType() {
      let { $route } = this;
      return +$route.query.themetype || $route.params.themetype || 1;
    }
  },
  mounted() {
    let _ = this;
    _.themetype = _.queryThemeType; // 自定义 1 潮牌精选页面 2 夏季新品 3 潮流特色
    switch (_.themetype) {
      case themety.fashion:
        _.styleClass = "fashion-brand";
        break;
      case themety.summer:
        _.styleClass = "new-summer";
        break;
      case themety.features:
        _.styleClass = "trend-features";
        break;
    }
    // _.MayDayrecommend();
  },
  methods: {
    GoDiffPlat(item) {
      let _ = this;
      // 先判断themetype 类型  再判断是不是在app
      switch (_.themetype) {
        case themety.fashion:
          // 品牌搜索
          if (_.$root.ISAPP) {
            _.javascriptBridge({
              name: "gotoAppProductListPage",
              params: {
                brandid: "",
                keyword: item.brandname
              }
            });
          } else _.$router.push(`/results/${item.brandname}`);
          break;

        case themety.summer:
          // 店铺详情
          if (_.$root.ISAPP) {
            _.javascriptBridge({
              name: "gotoAppOnlineShopHomePage",
              params: {
                businessid: item.businessid
              }
            });
          } else _.$router.push(`/shop/shopdetail/${item.businessid}`);
          break;

        case themety.features:
          _.$router.push(`/mayDay/detail?themetype=${item.themetype}`);
          break;
      }
    },
    // MayDayrecommend() {
    //   let _ = this;
    //   BigStorerecommend(_.themetype)
    //     .then(res => {
    //       console.log(res);
    //       if (res && res.list && res.list.length > 0) {
    //         _.modulePic = res.list;
    //       }
    //     })
    //     .catch(e => {
    //       _.toast((e && e.mag) || `Error${e}`);
    //     });
    // },
    getbanner(item) {
      console.log(item, "------>>>");
      this.banner = item.banner || "";
      this.title = item.title || "";
    }
  },
  destroyed() {
    // document.body.classList.remove("lock");
  }
};
</script>
<style lang="scss" scoped>
.big-wrap {
  max-width: 750px;
  margin: 0 auto;
  min-height: 100%;
}
.banner {
  min-height: 58.4vw;
  background: #f2f2f2;
}
img {
  display: block;
  width: 100%;
}
.sub-recd {
  background: url("https://files.eyee.com/eyeeh5/img/sub_bg.jpg") 0 0 no-repeat;
  background-size: cover;
  min-height: 61.6vw;
  padding: 2%;
  .title {
    margin-bottom: 2%;
  }
}
.sub-recd.fashion-brand {
  .bloc-dev {
    width: 33%;
    min-height: 41vw;
    margin-bottom: 1%;
  }
  .bloc-dev:nth-child(3n + 2) {
    margin: 0 0.5% 1% 0.5%;
  }
}
.sub-recd.new-summer {
  .bloc-dev {
    width: 49%;
    margin-bottom: 1%;
    min-height: 19.4vw;
  }
  .bloc-dev:nth-child(2n) {
    margin: 0 0 1% 2%;
  }
}
.sub-recd.trend-features {
  background: none;
  .bloc-dev {
    width: 49%;
    margin-bottom: 1%;
    min-height: 19.4vw;
  }
  .bloc-dev.first {
    width: 100%;
  }
  .bloc-dev:nth-child(2n + 3) {
    margin: 0 0 1% 2%;
  }
}
.choose_tit {
  width: 100%;
  height: 18px;
}
</style>


