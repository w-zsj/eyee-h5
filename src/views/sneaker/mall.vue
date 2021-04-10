<template>
  <div class="sneaker-mall">
    <!-- 顶部 -->
    <new-header type="search" :sneakerType="1"></new-header>
    <!-- 轮播图片太大盖住了按钮 -->
    <!-- <div :style='{height:flashHeight}'> -->
    <div>
      <swiper :options="hfOption" v-if="list&&list.length>0" class="homeflash">
        <swiper-slide v-for="(item,index) in list" :key="index">
          <div @click="adGg(item,1)" class="flash flex-center">
            <img v-lazy="https(item.url)" :alt="item.title" ref="imgs" class="slideImg" />
          </div>
        </swiper-slide>
        <div class="swiper-scrollbar bar" slot="scrollbar"></div>
      </swiper>
    </div>
    <!-- 宫格 -->
    <v-delay :delay="300" class="flex-aic flex-wrap tofu-plate">
      <div class="gg-list" v-for="(item, index) in enters" :key="'enters'+index">
        <div class="flex-aic flex-wrap">
          <img
            v-lazy="https(items.bottompic)"
            v-for="(items, indx) in item.gridlist"
            :key="'enters'+indx"
            :style="{width:items.percent+'%'}"
            @click.stop="adGg(items)"
          />
        </div>
      </div>
    </v-delay>
    <!-- 品牌logo -->
    <v-delay :delay="500">
      <swiper :options="BrandOpt" ref="BrandSwiper" class="brandlogo">
        <swiper-slide v-for="(item,inx) in logoData" :key="inx" class="flex-center">
          <div
            class="flash logo flex-center"
            :class="{'active':currentLogoIndex==inx}"
            @click.stop="clickLogo(inx)"
          >
            <img v-lazy="https(currentLogoIndex==inx?item.checkedbrandimgurl:item.brandimgurl)" alt />
            <!-- <img src="http://files.eyee.com/Shop/system/main/4ef846d28a564b2e8f0a0a49eb2211e2.png" alt=""> -->
            <!-- v-if="currentLogoIndex==inx" -->
            <i></i>
          </div>
        </swiper-slide>
      </swiper>
      <!-- 品牌展示 -->
      <!-- <div> -->
      <swiper :options="BrandList" ref="BrandListSwiper">
        <swiper-slide v-for="(item,ix) in logoData" :key="ix">
          <div class="flash flex-aic BrandList-img flex-wrap">
            <div class="img" v-for="(items,indx) in hotseries" :key="indx" v-show="indx<7">
              <img v-lazy="https(items.imgurl)" alt @click.stop="search(items)" />
            </div>
            <div
              class="img"
              @click.stop="moreCategory"
              v-if="item.morepicture&&currentLogoIndex==ix"
            >
              <img v-lazy="https(item.morepicture)" alt />
            </div>
          </div>
        </swiper-slide>
      </swiper>
      <!-- </div> -->
    </v-delay>
    <!-- 预制位 -->
    <v-delay :delay="800" class="Prefabricated">
      <loader class="load" form="7" ref="load">
        <img src="/static/imgs/search/loadApp.png" alt />
      </loader>
    </v-delay>
    <!-- 推荐商品 -->
    <v-delay :delay="1000">
      <v-list
        :load-handle="()=>{}"
        :more-handle="searchloadmore"
        :more-handling="loading"
        :isend="isend"
        v-if="RecommendProductList.length>0"
      >
        <div class="plist-dbl flex-wrap rcd-list">
          <template v-for="(pi,a) in RecommendProductList">
            <product-unit
              :key="a"
              :showimgTop="0"
              :product-item="pi"
              :product-type="20"
              :is-find-sim="1"
              :sneakerHome="true"
              :senakeLocation="a"
            ></product-unit>
          </template>
        </div>
      </v-list>
    </v-delay>
    <guide-modal :show="showGuide" :bg="guideConfig.imageurl" v-if="!$root.ISAPP"></guide-modal>
  </div>
</template>
<script>
import NewHeader from "@/comps/NewHeader";
import { RecommendProduct } from "@/utils/api/mall";
import { IndexRecommend } from "../../common/api/sneaker";
import { NewSneakerBrandList, BannerPicList } from "@/utils/api/sneaker";
import { CarouselLinkType, GridLinkType } from "@/utils/enum";
import ProductUnit from "@/components/templates/ProductUnit";
import { mapGetters } from "vuex";
import Loader from "@/comps/Loader";
import GuideModal from "@/comps/GuideModal";
export default {
  components: { NewHeader, ProductUnit, Loader, GuideModal },
  data() {
    return {
      currentLogoIndex: 0,
      RecommendProductList: [],
      isend: false,
      pageindex: 1,
      loading: false,
      hfOption: {
        autoplay: 2200,
        autoplayDisableOnInteraction: false,
        roundLengths: true,
        updateOnImagesReady: true,
        scrollbar: ".swiper-scrollbar",
        scrollbarHide: false
      },
      BrandOpt: {
        roundLengths: true,
        scrollbarHide: true,
        spaceBetween: 15,
        slidesPerView: 6.5,
        // onInit: this.slideChange,
        onSlideChangeEnd: this.tabChange
      },
      BrandList: {
        roundLengths: true,
        scrollbarHide: true,
        spaceBetween: 10,
        slidesPerView: 1,
        // onInit: this.slideChange,
        onSlideChangeEnd: this.brChange
      },
      logoData: [],
      list: [],
      enters: [],

      showGuide: false,
      guideConfig: {}
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo",
      baseReq: "baseReq"
    }),
    hotseries() {
      //   console.log('this.logoData',this.logoData)
      return this.logoData[this.currentLogoIndex].hotseries;
    }
  },

  mounted() {
    let _ = this;
    _.goFlash();
    _.brandLogo();
    _.getRecommend();

    _.baseReq
      .then(val => {
        let user = _.user;
        if (val && val.configs) {
          let { newergiftpacks } = val.configs || {};

          let regBg = {};
          if (newergiftpacks) regBg = JSON.parse(newergiftpacks);
          regBg.imageurl =
            regBg.imageurl ||
            "https://files.eyee.com/eyeeh5/img/new_user_package.png";
          _.guideConfig = regBg;

          if (ENV.ua.mobile && !(user && user.token) && !_.$root.loging) {
            // 弹框引导
            _.showGuide = true;
          }
        }
      })
      .catch(e => {
        console.error("getting base error: ", e);
      });
  },
  beforeDestroy() {
    document.body.classList.remove("lock");
  },
  methods: {
    getLocation() {
      let _this = this;
      AMap.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 5000
        });
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete);
        AMap.event.addListener(geolocation, "error", onError);
        // data是具体的定位信息
        function onComplete(data) {
          console.log("具体的定位信息", data);
        }
        function onError(data) {
          // 失败 启用 ip定位
          AMap.plugin("AMap.CitySearch", function() {
            var citySearch = new AMap.CitySearch();
            citySearch.getLocalCity(function(status, result) {
              if (status === "complete" && result.info === "OK") {
                // 查询成功，result即为当前所在城市信息
                console.log("通过ip获取当前城市：", result);
              }
            });
          });
        }
      });
    },
    onComplete(data) {
      console.log("success", data);
      // 这里面是 允许获取位置服务后 发生的事情,这里我直接获取想要的信息
    },
    onError(data) {
      console.log("error", data);
    },
    goFlash() {
      let _ = this;
      BannerPicList()
        .then(res => {
          if (res && res.banners) {
            _.list = res.banners;
            if (res.share)
              _.initShare({
                info: {
                  title: res.share.title,
                  desc: res.share.content,
                  img: res.share.icon,
                  url: res.share.url
                }
              });
          }
          _.enters = res.grids || [];
        })
        .catch(e => {
          console.error(e);
        });
    },
    brandLogo() {
      let _ = this;
      NewSneakerBrandList()
        .then(res => {
          console.log("品牌接口数据", res);
          if (res && res.brands && res.brands.length > 0) {
            _.logoData = res.brands;
            //  _.hotseries = _.logoData[0].hotseries
            console.log("hotseries", _.hotseries);
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    search(item) {
      // console.log('hotseries',item)
      let path =
        `/results/${item.seriesname}?isc2c=1` +
        (item.seriesid ? `&seriesid=${item.seriesid}` : ``);
      this.$router.push(path);
    },
    brChange(swiper) {
      this.currentLogoIndex = swiper.activeIndex;
      this.$refs.BrandSwiper.swiper.slideTo(swiper.activeIndex);
      // this.hotseries = this.logoData[this.currentLogoIndex].hotseries
    },
    tabChange(swiper) {
      this.currentLogoIndex = swiper.activeIndex;
      this.slidTo(swiper.activeIndex);
    },
    slidTo(index) {
      this.$refs.BrandListSwiper.swiper.slideTo(index);
    },
    clickLogo(index) {
      // console.log('index',index)
      this.currentLogoIndex = index;
      // this.hotseries = this.logoData[index].hotseries
      this.$refs.BrandListSwiper.swiper.slideTo(index);
    },
    searchloadmore() {
      let _ = this;
      if (_.loading) return;
      if (_.isend) _.toast("已无更多");
      else {
        _.pageindex++;
        _.getRecommend();
      }
    },
    adGg(item, t = 2) {
      //  console.log('path---------',item)
      /**
       * 首页宫格跳转类型
      //
      // "showtype":#"0:常规商品卡片,1助力砍价、2拼团、3新品预售、 4 B2C 品牌， 5 C2C品牌、6 店铺、7 平台大促、8 自定义专题、9 天天抽奖、10 限量发售、
      // 11 球鞋入口、12 分类、 13系列、
      // 14在线鉴定，15拉新抢购，16  supreme类目，17 supreme，18 B2C产品详情 ,19 C2C 产品详情，20 鬼市，21 球鞋榜，22 球鞋搜索，23 领券中心 24c2c 服饰25.B2C搜索，26.全站搜索
       */
      // helpBargain: 1,
      // groupBuy: 2,
      // newSale: 3,
      // brandSearch: 4,
      // brandSearchC2c: 5,
      // shopDetail: 6,
      // platformActivity:7,
      // activity: 8,
      // sneakerLottery: 9,
      // limitSale: 10,
      // sneakerEnter:11,
      // classify:12,
      // seriesList:13,
      // onlineIdentification:14,
      // PullTheNew :15,
      // Supreme:16,
      // SupremeSearch:17,
      // DetailB2c:18,
      // DetailC2c:19,
      // SpecialSaleDetail:20,
      // SneakersHotSale:21,
      // sneakerSearch:22,
      // getCouponCenter:23
      // costume: 24,
      //   b2cSearch:25,
      // allSearch:26
      if (t == 1)
        $log({
          e: "sneakerBannerClick",
          p: { sneakerBannerTitle: "轮播位点击" },
          t: 2,
          ext: 1
        });
      else
        $log({
          e: "hometrafficportClick",
          p: { hometrafficportDesc: "宫格预制位点击" },
          t: 2,
          ext: 1
        });

      let _ = this,
        path = "",
        link = item.link,
        contentname = item.contentname,
        loadapp = false;
      // 类型为4.品牌、5.店铺、6.平台大促 contentid不为null
      if (item.articletype == 3) path = "";
      else
        switch (item.type) {
          case GridLinkType.helpBargain:
            path = "/helpbargain";
            break;
          case GridLinkType.groupBuy:
            path = "/groupbuy/list";
            break;
          case GridLinkType.newSale:
            path = "/sneaker/presale";
            break;
          case GridLinkType.brandSearch:
            path = "/results/" + encodeURIComponent(contentname);
            break;
          case GridLinkType.brandSearchC2c:
            path = "/results/" + encodeURIComponent(contentname) + "?isc2c =1";
            break;
          case GridLinkType.shopDetail:
            path = "/shop/shopdetail/" + link;
            break;
          case GridLinkType.platformActivity:
            path = "/platformActivity/" + link;
            break;
          case GridLinkType.activity:
            if (/.*?m.eyee\.com\/active\//i.test(link))
              path = "/active/" + link.split("/active/")[1];
            else if (/.*?eyee\.com\//i.test(link))
              path = link.replace(/.*?eyee\.com/i, "");
            break;
          case GridLinkType.sneakerLottery:
            path = "/drawLottery/lottery";
            break;
          case GridLinkType.limitSale:
            path = "/limit";
            break;
          case GridLinkType.sneakerEnter:
            path = "/sneaker/mall";
            break;
          case GridLinkType.classify:
            path =
              "/results/" +
              encodeURIComponent(contentname) +
              "?categoryid=" +
              link;
            break;
          case GridLinkType.seriesList:
            path =
              "/results/" +
              encodeURIComponent(contentname) +
              "?seriesid=" +
              link;
            break;
          case GridLinkType.onlineIdentification:
            loadapp = true;
            break;
          case GridLinkType.PullTheNew:
            loadapp = true;
            break;
          case GridLinkType.Supreme:
            path = `/salesList/${encodeURIComponent(contentname)}/${link}`;
            break;
          case GridLinkType.SupremeSearch:
            path = "/sales/category/" + (link || "");
            break;
          case GridLinkType.DetailB2c:
            path = `/productDetail/${link}`;
            break;
          case GridLinkType.DetailC2c:
            path = `/sneaker/detail/${link}`;
            break;
          case GridLinkType.SpecialSaleDetail:
            path = `/GhostProList?id=${link}`;
            break;
          case GridLinkType.SneakersHotSale:
            path = `/sneakerHotSale/${link}`;
            break;
          case GridLinkType.sneakerSearch:
            path =
              "/results/" +
              encodeURIComponent(contentname || link) +
              "?isc2c =1";
            break;
          case GridLinkType.getCouponCenter:
            path = `/coupon`;
            break;
          case GridLinkType.costume:
            path = `/c2c/CategoryMall`;
            break;
          case GridLinkType.b2cSearch:
            path =
              "/results/" +
              encodeURIComponent(contentname || link) +
              "?isc2c=0";
            break;
          case GridLinkType.allSearch:
            path = "/results/" + encodeURIComponent(contentname || link);
            break;
          case 199: //app发售日历
            loadapp = true;
            break;
          case GridLinkType.imgInvitationDetail: // 图文帖子详情
          case GridLinkType.flashInvitationDetail: // 视屏帖子详情
            path = "/community/posting/detail/" + encodeURIComponent(link);
            break;
        }
      if (loadapp) {
        // _.openAppClient();
        _.$refs.load.$el.click();
      } else {
        if (path) _.$router.push(path);
        else window.location.href = link;
      }
    },
    goto({
      type,
      articletype,
      link: data,
      channel,
      contentname,
      title = "banner"
    }) {
      console.log("goto", type, articletype, data, channel);

      /**
        0.店铺 1.品牌 2.分类 3.产品详情 4.资讯详情 5.资讯搜索 6.自定义专题 7.鬼市 9.限量 10.品牌库 11.球鞋榜 12.平台大促 13.球鞋搜索, 14.C2C球鞋 15.C2C服饰,16.B2C搜索，17.全站搜索
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
        sneakerMall: 14,
        costume: 15,
        b2cSearch:16,
        allSearch:17
       */
      try {
        $log({
          e: "sneakerBannerClick",
          p: { sneakerBannerTitle: title },
          t: 2,
          ext: 1
        });
      } catch (err) {
        console.error("request error report error: ", err);
      }
      let _ = this,
        url = "";
      contentname = contentname || "''";
      switch (type) {
        case CarouselLinkType.shopDetail:
          url = "/shop/shopdetail/" + data;
          break;
        case CarouselLinkType.brandSearch:
          url =
            "/results/" +
            encodeURIComponent(contentname) +
            "?brandid=" +
            data +
            (channel == 2 ? "&isc2c =1" : "");
          break;
        case CarouselLinkType.categorySearch:
          url =
            "/results/" +
            encodeURIComponent(contentname) +
            "?categoryid=" +
            data;
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
          url = "";
          break;
        case CarouselLinkType.costume:
          url = "/c2c/CategoryMall";
          break;
        case CarouselLinkType.b2cSearch:
          url = "/results/" + encodeURIComponent(data) + "?isc2c=0";
          break;
        case CarouselLinkType.allSearch:
          url = "/results/" + encodeURIComponent(data);
          break;
      }
      if (url) _.$router.push(url);
      else window.location.href = data;
    },
    moreCategory() {
      this.$router.push("/category");
    },
    loadApp() {
      this.openAppClient();
    },
    getRecommend() {
      let _ = this,
        page = _.pageindex;
      _.loading = true;
      IndexRecommend({ page, size: 20 })
        .then(res => {
          if (res && res.list && res.list.length) {
            if (page === 1) _.RecommendProductList = res.list;
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
                // i.paynumber = i.paynumber
                return i;
              });
            }

            // console.log('===========================>RecommendProductList',_.RecommendProductList)
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
.plist-dbl {
  padding: 1.5%;
  background: #f2f2f2;
}
.plist-dbl .productItem {
  width: 49%;
  margin-bottom: 2%;
}
.plist-dbl .productItem:nth-child(even) {
  margin-left: 2%;
}
.sneaker-mall {
  background: #f2f2f2;
}
.BrandList-img {
  padding: 1.5%;
  padding-bottom: 0;
}
.BrandList-img .img {
  width: 49%;
  background: #fff;
  margin-bottom: 1.8%;
}

.BrandList-img .img:nth-child(even) {
  margin-left: 1.8%;
}
.brandlogo {
  background: #fff;
  padding-bottom: 4px;
}
.brandlogo .swiper-slide {
  /* overflow: hidden; */
  height: 45px;
}
.swiper-slide .logo {
  position: relative;
  width: 45px;
  height: 45px;
}
/* .swiper-slide:nth-child(1) .logo img {
  margin-top: 1.725vw;
}
.swiper-slide:nth-child(1) .logo.active i {
  bottom: -2px;
} */
.swiper-slide .logo i {
  width: 23px;
  height: 3px;
  background: #fff;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  border-radius: 1.5px;
}
.swiper-slide .logo.active i {
  background: #8050ff;
}
.swiper-slide .logo img {
  display: block;
  /* transition: all 0.3s linear; */
  width: 100%;
}
.swiper-slide .logo.active img {
  width: 100%;
}
.Prefabricated {
  padding: 0 1.5%;
}
</style>

