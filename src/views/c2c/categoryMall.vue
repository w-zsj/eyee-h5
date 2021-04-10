<template>
  <div class="superme-home">
    <!-- 搜索 -->
    <new-header type="back" :sneakerType="1"></new-header>
    <!-- 轮播图 -->
    <div v-if="banners.length>0">
      <swiper class="homeflash">
        <swiper-slide v-for="(banner,index) in banners" :key="index">
          <div @click="goNewPage(banner)" class="flash flex-center">
            <img v-lazy="https(banner.url)" class="slideImg">
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <!-- 系列 -->
    <div class="navBar-top" v-if="category.length>0">
      <div class="nav-item flex-center" v-for="(item,sid) in category" :key="sid">
        <div @click="goSeries(item)">
          <div class="img-height">
            <img v-lazy="https(item.mainpic)" alt>
          </div>

          <p>{{item.name}}</p>
        </div>
      </div>
      <div class="nav-item flex-center" v-if="category.length>0" @click="goMoreSeries()">
        <div class="img-height">
          <img style="width:12vw;margin-top:1vw;padding: 4vw 1vw" src="/static/img/more.png" alt>
        </div>
        <p>more</p>
      </div>
    </div>
    <!-- <div class="navBar"> -->
    <!-- 预定鉴定 -->
    <div class="other-modules flex-center" v-if="lookBook||certifiedImg">
      <div class="other-modules-img" @click="goLookBook()">
        <img style="width:34vw" v-lazy="https(lookBook.imageurl)">
      </div>
      <div @click="goDownloadApp()">
        <img style="width:60vw" v-lazy="https(certifiedImg)">
      </div>
    </div>
    <!-- 季度发售 -->
    <div class="navBar quarterly-sales" :class="{navBarWrap:navBarFixed}" v-if="series.length>0">
      <div
        class="quarterly-sales-item flex-center"
        v-for="(item,ind) in series"
        :key="ind"
        @click="toggle(ind)"
        :class="{imgSize:tabAct==ind}"
      >
        <img v-lazy="https(item.icos)" alt>
      </div>
    </div>
    <!-- 推荐商品 -->
    <swiper :options="tabOpt" ref="panelSwiper" class="mh-panels">
      <swiper-slide class="mh-panel" v-for="(tab,pnIdx) in series" :key="'panel'+pnIdx">
        <div class="recommended-goods navBar">
          <v-list
            :load-handle="()=>{}"
            :more-handle="searchloadmore"
            :more-handling="loading"
            :isend="isend"
          >
            <div class="plist-dbl flex-wrap rcd-list flex-between">
              <template v-for="(pi,a) in RecommendProductList">
                <product-unit :key="a" :product-item="pi" :product-type="20" :is-find-sim="1"></product-unit>
              </template>
            </div>
          </v-list>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import NewHeader from "@/comps/NewHeader";
import ProductUnit from "@/components/templates/ProductUnit";
import { ClothesBanner, RecommendList } from "../../utils/api/c2ccategory";
import { CarouselLinkType } from "@/utils/enum";
export default {
  components: { NewHeader, ProductUnit },
  data() {
    return {
      RecommendProductList: [],
      pageindex: 1,
      loading: false,
      isend: false,
      navBarFixed: false,
      tabAct: 0,
      seriesid: "",
      brandid: "",
      lookBook: {},
      certifiedImg: "",
      banners: [],
      series: [],
      category: [],
      tabOpt: {
        roundLengths: true,
        scrollbarHide: true,
        // onInit: this.slideChange,
        onSlideChangeEnd: this.tabChange
      }
    };
  },
  computed: {
    panelSwiper() {
      return this.$refs.panelSwiper.swiper;
    },
    currTab() {
      let { category, tabAct } = this;
      return category[tabAct] || {};
    }
  },
  mounted() {
    let _ = this;
    _.getIndexBanner();
    window.addEventListener("scroll", _.watchScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.watchScroll); // 离开页面 关闭监听 不然会报错
  },
  methods: {
    // 获取首页轮播
    getIndexBanner() {
      let _ = this;
      ClothesBanner()
        .then(res => {
          if (res && res.banners && res.banners.length > 0) {
            _.banners = res.banners;
          }
          if (res && res.categorys && res.categorys.length > 0) {
            _.category = res.categorys;
          }
          if (res && res.series && res.series.length > 0) {
            _.series = res.series;
          }
          if (res && res.lookbook) {
            _.lookBook = res.lookbook;
          }
          if (res && res.imageurl) {
            _.certifiedImg = res.imageurl;
          }
          console.log("category", _.category);

          if (_.RecommendProductList.length <= 0) {
            _.seriesid = _.series[0].id;
            _.brandid = _.series[0].brandid;
            _.getRecommend();
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    // LookBook
    goLookBook() {
      this.$router.push({ path: `/lookbook/${this.lookBook.brandid}` });
    },
    // 在线鉴定
    goDownloadApp() {
      this.openAppClient();
    },
    // 轮播跳转
    goNewPage(item) {
      this.goto(item);
    },
    goto({ type, articletype, link: data, channel, contentname }) {
      // console.log("goto", type, articletype, data, channel);
      /**
        0.店铺 1.品牌 2.分类 3.产品详情 4.资讯详情 5.资讯搜索 6.自定义专题 7.鬼市 9.限量 10.品牌库 11.球鞋榜 12.平台大促 13.球鞋搜索, 14.C2C球鞋 15.C2C服饰
        shopDetail: 0,
        brandSearch: 1,
        categorySearch: 2,
        productDetail: 3,
        newsDetail: 4,
        newsSearch: 5,
        activity: 6,
        specialSaleDetail: 7,
        // shopList: 8,
        limitSale: 9,
        brandLib: 10,
        newsShoes: 11,
        platformActivity: 12,
        sneakerSearch: 13,
        coupon: 14，
        sneakerMall:16
        bullPreDetail:18
       */

      let _ = this,
        url = "";
      switch (type) {
        case CarouselLinkType.shopDetail:
          url = "/shop/shopdetail/" + data;
          break;
        case CarouselLinkType.brandSearch:
          if (channel == 2) {
            url = "/sneaker/search?brandid=" + data;
          } else {
            let set = {};
            set.categoryid = "";
            set.brandName = "";
            set.brandid = data;
            set.categoryName = "";
            set.category = "";
            _.$store.dispatch("confirOption", { data: set, type: 0 });
            url = "/mall/search/";
          }
          break;
        case CarouselLinkType.categorySearch:
          let set = {};
          set.categoryid = data;
          set.brandName = "";
          set.categoryName = "";
          set.category = "";
          _.$store.dispatch("confirOption", { data: set, type: 2 });
          url = "/mall/search/";
          break;
        case CarouselLinkType.productDetail:
          url = (channel == 2 ? "/sneaker/detail/" : "/productDetail/") + data;
          break;
        case CarouselLinkType.newsDetail:
          url = "/news/detail/" + data;
          break;
        case CarouselLinkType.newsSearch:
          url = "/news/search/" + data;
          break;
        case CarouselLinkType.activity:
          if (/.*?m.eyee\.com\/active\//i.test(data))
            url = "/active/" + data.split("/active/")[1];
          else if (/.*?m.eyee\.com\//i.test(data))
            url = data.replace(/.*?m.eyee\.com/i, "");
          break;
        case CarouselLinkType.specialSaleDetail:
          url = "/GhostProList?id=" + data;
          break;
        case CarouselLinkType.limitSale:
          url = "/limit";
          break;
        case CarouselLinkType.brandLib:
          url = "/brand";
          break;
        case CarouselLinkType.newsShoes:
          url = "/shoe";
          break;
        case CarouselLinkType.platformActivity:
          url = "/platformActivity/" + data;
          break;
        case CarouselLinkType.sneakerSearch:
          url = "/results/" + encodeURIComponent(data) + "?isc2c=1";
          break;
        case CarouselLinkType.sneakerMall:
          url = "/sneaker/mall";
          break;
        case CarouselLinkType.costume:
          url = "";
          break;
        case CarouselLinkType.b2cSearch:
          url = "/results/" + encodeURIComponent(data) + "?isc2c=0";
          break;
        case CarouselLinkType.allSearch:
          url = "/results/" + encodeURIComponent(data);
          break;
        case CarouselLinkType.bullPreDetail:
          url = "/bull/proDetialShare/" + data;
          break;
      }
      if (url) _.$router.push(url);
      else window.location.href = data;
    },
    // 分类转跳
    goSeries(item) {
      let url = `/results/${encodeURIComponent(item.name)}?categoryid=${
        item.id
      }&isc2c=1&brandid=${item.brandid}`;
      this.$router.push(url);
    },
    goMoreSeries() {
      this.$router.push({ path: `/c2c/CategoryMore` });
    },
    //系列跳转
    toggle(index) {
      let _ = this;
      if (_.tabAct !== index) {
        _.seriesid = _.series[index].id;
        _.brandid = _.series[index].brandid;
      }
      // if (this.RecommendProductList.length > 0)
      this.togglePanel(index);
    },
    // 切换推荐列表
    tabChange(swiper) {
      this.togglePanel(swiper.activeIndex);
    },
    togglePanel(index) {
      index = isNaN(index) ? 0 : index;
      let _ = this,
        tab = _.series[index];
      if (_.tabAct !== index) {
        _.seriesid = _.series[index].id;
        _.brandid = _.series[index].brandid;
        _.RecommendProductList = [];
        this.getRecommend(index);
      }
      _.tabAct = index;
      _.panelSwiper.slideTo(index);
      this.navBarFixed = true;
    },

    // 监听滚动固定
    watchScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      //  当滚动超过 350 时，实现吸顶效果
      if (scrollTop > 350) {
        this.navBarFixed = true;
      } else {
        this.navBarFixed = false;
      }
    },

    // 下拉加载
    searchloadmore() {
      let _ = this;
      if (_.loading) return;
      if (_.isend) _.toast("已无更多");
      else {
        _.pageindex++;
        _.getRecommend();
      }
    },
    // 获取商品列表
    getRecommend() {
      let _ = this,
        pageindex = _.pageindex;
      _.loading = true;
      RecommendList({
        pageindex,
        pagesize: 10,
        seriesid: _.seriesid,
        brandid: _.brandid
      })
        .then(res => {
          if (res && res.list && res.list.length) {
            if (pageindex === 1) _.RecommendProductList = res.list;
            else
              _.RecommendProductList = _.RecommendProductList.concat(res.list);
            if (_.RecommendProductList.length > 0) {
              _.RecommendProductList = _.RecommendProductList.map(i => {
                // i.brandname = ''
                i.id = i.productid;
                i.isc2c = 1;
                i.name = i.productname;
                i.mainpic = i.imageurl + "|";
                i.producttype = 0;
                i.saleprice = i.price;
                i.specialprice = 0;
                i.soldout = false;
                i.sumcount = 0;
                i.discountoff = 0;
                i.paynumber = i.buyersnum;
                return i;
              });
            }
            _.isend =
              res.page * res.size >= res.total &&
              _.RecommendProductList.length > 0;
          } else _.isend = true;
          _.loading = false;
        })
        .catch(e => {
          _.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    }
  }
};
</script>
<style scoped>
.img-height {
  height: 19.2vw;
}
.homeflash {
  height: 117px;
}
.mh-panel {
  min-height: 100vh;
}
.navBarWrap {
  position: -webkit-sticky;
  position: sticky;
  top: 50px;
  z-index: 10;
}

.superme-home {
  background: #f2f2f2;
  min-height: 100vh;
}
.superme-home >>> .nh-search {
  margin-right: 2vw;
  width: 83vw;
  border-radius: 5px;
  height: 35px;
}
.navBar-top {
  background: #fff;
  margin: 2vw auto;
  width: 96vw;
  display: -webkit-box;
  border-radius: 5px;
}
.navBar {
  background: #fff;
  /* margin: 2vw auto; */
  width: 96vw;
  display: -webkit-box;
  overflow-x: scroll;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  border-radius: 5px;
}
/* 隐藏滚动条 */
.navBar::-webkit-scrollbar {
  background-color: transparent;
}

.nav-item {
  width: 19.2vw;
  text-align: center;
  flex-wrap: wrap;
  margin-top: 1.2vw;
}
.nav-item img {
  width: 18.5vw;
  min-height: 51px;
}
.nav-item p {
  width: 18vw;
  height: 22px;
  margin-top: 2vw;
  font-size: 12px;
  font-family: DINOT-CondBlack;
  line-height: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.other-modules {
  margin: 1vw auto 0 auto;
  width: 98vw;
}
.other-modules img {
  margin: 0 1vw;
  height: 90px;
}
.quarterly-sales::-webkit-scrollbar {
  height: 10px;
  background: #f2f2f2;
}
.quarterly-sales {
  width: 99vw;
  background: #f2f2f2;
  margin-left: 1vw;
  margin-top: -1vw;
}

.quarterly-sales-item {
  width: 28vw;
  text-align: center;
  flex-wrap: wrap;
  margin-top: 2vw;
  margin-bottom: 1px;
}
.quarterly-sales-item img {
  width: 26vw;
}
.imgSize img {
  /* width: 26vw; */
  border: 2px solid #7461ff;
  border-radius: 5px;
}
.recommended-goods {
  width: 98vw;
  margin: -3vw auto 0 auto;
  background: #f2f2f2;
}
.plist-dbl {
  background: #f2f2f2;
  width: 98%;
}
.plist-dbl >>> .productItem {
  width: 46.5vw;
}
.plist-dbl >>> .productItem p.pc2c {
  margin: 3vw 0 1vw 0;
}
.plist-dbl >>> .productItem p.pc2c span {
  /* width: 52px; */
  height: 25px;
  font-size: 24px;
  font-weight: normal;
  color: rgba(51, 51, 51, 1);
  line-height: 25px;
}
.plist-dbl >>> .sale-count .point i {
  width: 1vw;
}
.plist-dbl >>> .sale-count .point {
  transform: rotate(90deg);
  margin-top: -4vw;
}
.plist-dbl >>> .product_name {
  font-family: PingFangSC-Semibold;
  font-weight: 500;
  font-size: 12px;
  color: #333;
}
.plist-dbl >>> .productItem p.pc2c span {
  font-size: 14px;
}
.recommended-goods >>> .no-more {
  background: #f2f2f2;
  width: 100vw;
}
.mh-panels >>> .mh-panel {
  min-height: 35vh;
}
</style>
