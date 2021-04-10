<template>
  <div class="trendGoods">
    <v-header class="nav" v-if="!$root.ISAPP">
      <div class="nav-tab2 ellipsis">潮流好物</div>
    </v-header>
    <div class="bannerBox" v-if="bannerlist && bannerlist.length > 0">
      <div class="bannerContent">
        <carousel
          center-mode
          :per-page="1"
          :loop="true"
          :autoplay="true"
          :autoplayTimeout="3500"
          :autoplayHoverPause="false"
          :navigate-to="someLocalProperty"
          @page-change="_pageChange"
          :pagination-size="6"
          :pagination-padding="4"
          pagination-color="rgba(255,255,255,0.5)"
          pagination-active-color="#fff"
          pagination-position="bottom-overlay"
        >
          <slide v-for="(item,index) in bannerlist" :key="index">
            <img v-lazy="https(item.url)" :alt="item.title" @click="carouselLink(item)" />
          </slide>
        </carousel>
      </div>
    </div>
    <div class="nav_tabs" v-if="tabs && tabs.length > 0">
      <div
        class="tab has_word"
        v-for="(tabItem, tabIndex) in tabs"
        :key="tabIndex"
        :class="{'has_img':!!tabItem.channelimg, 'act': tabAct == tabIndex}"
        @click="changeTab(tabItem, tabIndex)"
      >
        <img v-if="tabItem.channelimg" v-lazy="https(tabItem.channelimg)" alt />
        <span v-else>{{tabItem.channelname}}</span>
      </div>
    </div>
    <div class="trendGoods_list">
      <div class="trendGoods_list_box" v-if="tabs && tabs.length > 0">
        <div class="trendGoods_list_content">
          <!-- :adjustableHeight="true" -->
          <carousel
            center-mode
            :per-page="1"
            :pagination-size="6"
            :pagination-padding="4"
            :paginationEnabled="false"
            @pageChange="pageChange"
            :value="currentPage"
          >
            <slide v-for="(tab,tabIndex) in tabs" :key="tabIndex">
              <template v-if="tabAct == tabIndex">
                <!-- type 4 5 商品 -->
                <div class="goods_list" v-if="tab.type==4||tab.type==5">
                  <v-cutlist
                    :more-handle="searchloadmore"
                    :more-handling="sc.loading"
                    :isend="sc.isend"
                    v-if="sc.list.length>0"
                  >
                    <div class="plist-dbl flex-wrap rcd-list">
                      <template v-for="(pi,pIdx) in sc.list">
                        <product-unit
                          :key="'sc'+pIdx"
                          v-if="!pi.showtype"
                          :product-item="pi"
                          :is-find-sim="1"
                          :homeLocation="pIdx"
                          :trendGoods="1"
                          :trafficport="tab.channelname"
                          :position="2"
                        ></product-unit>
                      </template>
                    </div>
                  </v-cutlist>
                  <div v-else-if="!sc.loading" class="empty-rcd">
                    <p>未能筛选到相关数据</p>
                  </div>
                </div>
                <!-- type 8 潮店 -->
                <div class="tid_shop_list" v-else-if="tab.type == 8">
                  <v-cutlist
                    :more-handle="shopListloadmore"
                    :more-handling="sp.loading"
                    :isend="sp.isend"
                    v-if="shopList.length>0"
                  >
                    <div
                      class="tid_shop_item"
                      v-for="(shopItem, shopIndex) in shopList"
                      :key="shopIndex"
                    >
                      <div class="shopBox">
                        <div class="shop_left" @click="goShop(shopItem.businessid)">
                          <img :src="shopItem.headportraiturl" alt />
                        </div>
                        <div class="shop_center">
                          <div class="ellipsis name">{{shopItem.businessname}}</div>
                          <div
                            class="favorcount"
                            @click="favorClick(shopItem, shopIndex)"
                            :class="{'act': shopItem.favor}"
                          >
                            <img
                              :src="shopItem.favor?'/static/img/trendGoods/show_col_light.png':'/static/img/trendGoods/show_coll.png'"
                              alt
                            />
                            <span>{{shopItem.favorcount}}人收藏</span>
                          </div>
                        </div>
                        <div class="shop_right" @click="goShop(shopItem.businessid)">
                          <div class="but">进店逛逛</div>
                        </div>
                      </div>
                      <div
                        class="goodsBox"
                        v-if="shopItem.productlist && shopItem.productlist.length > 0"
                      >
                        <div
                          class="goodsItem"
                          v-for="(goodsItem, goodsIndex) in shopItem.productlist"
                          @click="goDetail(goodsItem.id, tab.channelname)"
                          :key="goodsIndex"
                        >
                          <img :src="goodsItem.mainpic" alt />
                          <p class="name" style="-webkit-box-orient: vertical;">{{goodsItem.name}}</p>
                          <p class="saleprice">￥{{goodsItem.saleprice}}</p>
                        </div>
                      </div>
                    </div>
                  </v-cutlist>
                </div>
              </template>
            </slide>
          </carousel>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Carousel, Slide } from "vue-carousel";
import { CarouselLinkType } from "@/utils/enum";
import { ProductSearch, Hometab, Searchshop } from "@/utils/api/mall";
import { FavorBusiness } from "../../../common/api/userFavor";
import MallGhost from "@/components/mall/Ghost";
import ProductUnit from "@/components/templates/ProductUnit";
const defaultSearch = {
  pageindex: 1,
  keyword: "",
  hometabid: "",
  brandid: "",
  categoryid: "",
  beginprice: "",
  endprice: "",
  size: ""
};
export default {
  name: "TrendGoods",
  components: { Carousel, Slide, MallGhost, ProductUnit },
  data() {
    return {
      bannerlist: [],
      tabAct: 0,
      tabType: -1,
      tabs: [],
      shopList: [],
      sp: {
        pageindex: 1,
        loading: false,
        isend: false
      },
      spParam: {
        page: 1
      },
      currentPage: 0,
      snk: {
        list: [],
        loading: false,
        isend: false
      },
      snkParam: {
        page: 1
      },

      sc: {
        list: [],
        loading: false,
        isend: false
      },
      scParam: { ...defaultSearch, isc2c: false },
      someLocalProperty: 0
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo"
    })
  },
  mounted() {
    let _ = this;
    _.hometabFun();
  },
  methods: {
    _pageChange(index) {
      this.someLocalProperty = index;
    },
    //  潮流好物 频道，轮播
    hometabFun() {
      let _ = this;
      Hometab({})
        .then(res => {
          _.bannerlist = res.bannerlist;
          _.tabs = res.tabs;
          if (_.tabs && _.tabs.length > 0) {
            if (_.tabs[0].type == 8) {
              // 潮店
              _.searchshopFun();
            } else {
              // b2c商品
              let hometabid = _.tabs[0].hometabid;
              let categoryid = _.tabs[0].categoryid;
              _.productSearchFun(hometabid, categoryid);
            }
          }
        })
        .catch(e => {});
    },
    goto({
      type,
      articletype,
      link: data,
      channel,
      contentname,
      title = "banner"
    }) {
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
        */
      try {
        $log({
          e: "mall_fashiongood_banner_click",
          p: { title: title },
          t: 2,
          ext: 1
        });
      } catch (err) {
        console.error("request error report error: ", err);
      }
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
          url = "/results/" + encodeURIComponent(data) + "?isc2c =1";
          break;
        case CarouselLinkType.sneakerMall:
          url = "/sneaker/mall";
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
        case CarouselLinkType.bullPreDetail:
          url = "/bull/proDetialShare/" + data;
          break;
      }
      if (url) _.$router.push(url);
      else window.location.href = data;
    },
    //   banner 跳转
    carouselLink(item) {
      this.goto(item);
    },
    changeTab(tabItem, tabIndex) {
      console.log(tabItem, tabIndex);
      let _ = this;
      _.tabAct = tabIndex;
      _.currentPage = tabIndex;
      _.sc.list = _.sc && _.sc.list ? [] : [];
      _.shopList = _.shopList ? [] : [];
      _.reset();
      _.toggleCarousel(tabIndex);

      if (tabItem.type == 8) {
        // 潮店
        _.searchshopFun();
      } else {
        // b2c商品
        let hometabid = tabItem.hometabid;
        let categoryid = tabItem.categoryid;
        _.productSearchFun(hometabid, categoryid);
      }
      $log({
        e: "mall_fashiongood_tab_click",
        p: { trafficport: tabItem.channelname }
      });
    },
    toggleCarousel(index, scroll = true) {
      index = isNaN(index) ? 0 : index;
      let _ = this,
        tab = _.tabs[index];
      _.tabType = tab.type;
      console.log("_.tabs", _.tabs, _.tabType);
      if (_.tabAct === index) {
        if (scroll)
          _.$nextTick(() => {
            scrollTo(0, _.tabTop);
          });
        return;
      }
    },
    //   潮店

    searchshopFun() {
      let _ = this,
        pageindex = _.sp.pageindex;
      _.sp.loading = true;
      Searchshop({ pageindex, userid: _.userInfo.uid })
        .then(res => {
          if (res && res.list && res.list.length) {
            if (pageindex === 1) _.shopList = res.list;
            else _.shopList = _.shopList.concat(res.list);
            // 处理收藏人数 超过一万 单位变成万
            if (_.shopList && _.shopList.length > 0) {
              _.shopList.forEach(val => {
                val.favorcount = parseInt(val.favorcount);
                if (val.favorcount && val.favorcount > 10000) {
                  val.favorcount = val.favorcount / 10000 + "万";
                }
              });
            }
            _.sp.isend =
              res.page * res.size >= res.total && _.shopList.length > 0;
          } else _.sp.isend = true;
          _.sp.loading = false;
        })
        .catch(e => {
          _.sp.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    shopListloadmore() {
      let _ = this;
      console.log("_.sp.loading", _.sp.loading, "_.sp.isend", _.sp.isend);
      if (_.sp.loading) return;
      if (_.sp.isend) _.toast("已无更多");
      else {
        console.log(222222);
        _.sp.pageindex++;
        _.searchshopFun();
      }
    },
    //  b2c商品
    productSearchFun(hometabid, categoryid) {
      let _ = this,
        { sc, scParam } = _;
      scParam.hometabid = hometabid;
      scParam.categoryid = categoryid;
      scParam.isc2c = false;
      scParam.sorttype = 1;
      ProductSearch({ ...scParam })
        .then(res => {
          if (res && res.list && res.list.length) {
            res.list = res.list.map(i => {
              if (i.showtype == 0 || !i.showtype)
                return {
                  /**
                   * "{"id":"","name":"","sumcount":186,"isc2c":0,"businessname":"","businesstype":2,"brandname":"","mainpic":"","saleprice":188,"specialprice":0,"soldout":false,"producttype":0,"discountoff":0,"salestatus":1,"requestid":""}"
                   */
                  id: i.productid,
                  name: i.productname,
                  mainpic: i.productimg,
                  saleprice: i.saleprice,
                  specialprice: i.specialprice,
                  isc2c: i.isc2c,
                  paynumber: i.paynum,
                  producttype: i.producttype,
                  discountoff: i.discountoff,
                  platformactivityicon: i.platformactivityicon
                };
              else {
                // 处理 showtype>0 时 vicetitle
                if (i.showtype > 0 && i.vicetitle) {
                  i.vicetitle0 = i.vicetitle.split(",")[0];
                  i.vicetitle1 = i.vicetitle.split(",")[1];
                }
                return i;
              }
            });

            if (scParam.pageindex === 1) _.sc.list = res.list;
            else _.sc.list = _.sc.list.concat(res.list);
            _.sc.isend =
              res.page * res.size >= res.total && _.sc.list.length > 0;
          } else if (scParam.pageindex === 1) _.sc.list = [];

          _.sc.loading = false;
        })
        .catch(e => {
          _.sc.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    searchloadmore() {
      let _ = this;
      if (_.sc.loading) return;
      if (_.sc.isend) _.toast("已无更多");
      else {
        _.scParam.pageindex++;
        _.productSearchFun(_.scParam.hometabid, _.scParam.categoryid);
      }
    },
    reset() {
      let _ = this;
      _.scParam.pageindex = 1;
      _.sp.pageindex = 1;
      _.sc.isend = false;
      _.sp.isend = false;
    },
    pageChange(index) {
      let _ = this;
      console.log(index, "index------->>>>");
      _.tabAct = index;
      _.sc.list = _.sc && _.sc.list ? [] : [];
      _.shopList = _.shopList ? [] : [];
      _.reset();
      window.scrollTo(0, 0);
      if (index < 1) index = 0;
      let hometabid = _.tabs[index].hometabid;
      let categoryid = _.tabs[index].categoryid;
      let type = _.tabs[index].type;
      if (type == 8) {
        // 潮店
        _.searchshopFun();
      } else if (type == 4 || type == 5) {
        // b2c商品
        _.productSearchFun(hometabid, categoryid);
      }
      $log({
        e: "mall_fashiongood_tab_click",
        p: { trafficport: _.tabs[index].channelname }
      });
    },
    goShop(businessid) {
      // 进去店铺详情
      this.$router.push("/shop/shopdetail/" + businessid);
      $log({ e: "mall_fashiongood_shop_click", p: { businessid } });
    },
    // 去B2C商品详情
    goDetail(id, channelname) {
      this.$router.push("/productDetail/" + id);
      $log({
        e: "mall_fashiongood_product_click",
        p: { productid: id, trafficport: channelname }
      });
    },
    favorClick(shopItem, shopIndex) {
      let _ = this;
      if (!_.userInfo || !_.userInfo.token) {
        //未登录
        _.$router.push("/login");
        return;
      } else {
        if (shopItem.favor) {
          // 已经是收藏状态 点击是取消
          FavorBusiness({
            businessid: shopItem.businessid,
            iscancel: true
          }).then(res => {
            _.shopList[shopIndex].favor = 0;
            _.shopList[shopIndex].favorcount = shopItem.favorcount - 1;
          });
        } else {
          // 是未收藏状态 点击是收藏的
          FavorBusiness({
            businessid: shopItem.businessid,
            iscancel: false
          }).then(res => {
            _.shopList[shopIndex].favor = 1;
            _.shopList[shopIndex].favorcount = shopItem.favorcount + 1;
          });
        }
      }
    }
  }
};
</script>
<style lang="scss">
.VueCarousel-wrapper {
  height: auto;
  visibility: visible !important;
}
.bannerBox {
  padding: 1.333333vw 4vw;
  overflow: hidden;
  background: #4b4b4b;
  height: 33.3333vw;
  .bannerContent {
    height: 100%;
    border-radius: 6px;
    overflow: hidden;
    .VueCarousel {
      height: 100% !important;
      .VueCarousel-slide {
        height: 100% !important;
      }
      .VueCarousel-pagination {
        text-align: right !important;
        .VueCarousel-dot-container {
          margin-right: 4vw !important;
        }
        .VueCarousel-dot--active {
          width: 12px !important;
          border-radius: 12px !important;
        }
      }
    }
    img {
      display: block;
      width: 100%;
    }
  }
}
.nav_tabs {
  width: 100%;
  height: 11.733333vw;
  line-height: 11.733333vw;
  overflow-x: scroll;
  background: #4b4b4b;
  white-space: nowrap;
  position: sticky;
  top: 48px;
  z-index: 11;
  .tab {
    display: inline-block;
    position: relative;
    white-space: nowrap;
    height: 100%;
    height: 11.733333vw;
    line-height: 11.733333vw;
    &.has_word {
      padding: 0 12px;
      span {
        font-size: 15px;
        font-weight: 400;
        color: #969696;
        transition: font 0.2s ease;
      }
    }
    &.has_img {
      padding: 0;
      width: 40px;
      height: 100%;
      vertical-align: middle;
      img {
        width: 40px;
        position: absolute;
        top: 50%;
        -webkit-transform: translate(0, -50%);
        -ms-transform: translate(0, -50%);
        transform: translate(0, -50%);
      }
    }
    &.act {
      &::after {
        width: 26px;
      }
      span {
        color: #ffffff;
      }
    }
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 3px;
      background: #ffffff;
      -webkit-transform: translate(-50%, -6px);
      -ms-transform: translate(-50%, -6px);
      transform: translate(-50%, -6px);
      transition: width 0.2s ease-in;
    }
  }
}
.mint-loadmore {
  background: transparent;
}
.trendGoods_list {
  background-color: #f5f5f5;
}
.trendGoods_list_box {
  background: url("/static/img/trendGoods/trendGoodsBg.png") 0 0 no-repeat;
  background-size: 100% auto;
  padding: 2.66667vw 4vw;
  .trendGoods_list_content {
    .plist-dbl {
      padding: 0;
      background: transparent;
      .productItem {
        background: #fafafa;
        border-radius: 6px;
        overflow: hidden;
        padding: 0;
        width: 48%;
        margin-right: 4%;
        &:nth-child(2n) {
          margin-right: 0;
        }
        .product_name {
          padding: 0 10px;
          margin-bottom: 1.6vw;
        }
      }
    }
  }
}
.one .cate-enter {
  width: 100%;
}
.cate-enters {
  width: 48%;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;

  background: #fafafa;
  .cate-enter {
    width: 50%;
    min-height: 80px;
    padding: 5px;
    img {
      display: block;
      width: 100%;
    }
    p {
      font-size: 10px;
      font-weight: 600;
      color: #333;
      line-height: 14px;
    }
  }
}
.cate-go .vicetitle {
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #969696;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}
.cate-go .vicetitle.mb {
  margin-bottom: 20px;
}
.tid_shop_item {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
  .shopBox {
    height: 17.0666667vw;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 3.2vw 4vw;
    .shop_left {
      width: 10.6666667vw;
      height: 10.6666667vw;
      border-radius: 2px;
      border: 1px solid rgba(230, 230, 230, 1);
      margin-right: 2.13333vw;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        display: block;
        width: 9.6vw;
        height: 9.6vw;
      }
    }
    .shop_center {
      width: 53vw;
      margin-right: 2.13333vw;
      .name {
        color: #232323;
        font-size: 14px;
        font-weight: 600;
        height: 5.33334vw;
        line-height: 5.33334vw;
        top: 0.26667vw;
      }
      .favorcount {
        height: 4.26667vw;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &.act {
          span {
            color: #fa2337;
          }
        }
        img {
          display: block;
          width: 4.26667vw;
          height: 4.26667vw;
          margin-right: 0.5vw;
        }
        span {
          height: 4.26667vw;
          line-height: 4.26667vw;
          color: #646464;
          font-size: 13px;
          font-weight: 600;
        }
      }
    }
    .shop_right {
      width: 16vw;
      .but {
        width: 16vw;
        height: 6.4vw;
        line-height: 6.4vw;
        text-align: center;
        font-size: 12px;
        color: #fa2337;
        font-weight: 600;
        border: 1px solid rgba(250, 35, 55, 1);
        margin-bottom: 1.33333vw;
        border-radius: 2px;
      }
    }
  }
  .goodsBox {
    padding: 3.2vw 5.3333vw;
    display: flex;
    .goodsItem {
      width: 25.3333vw;
      margin-right: 2.6666667vw;
      &:last-child {
        margin-right: 0;
      }
      img {
        display: block;
        width: 100%;
        margin-bottom: 1.6vw;
      }
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        height: 9.6vw;
        line-height: 4.8vw;
        color: #232323;
        font-size: 13px;
        font-weight: 400;
        margin-bottom: 1.07vw;
      }
      .saleprice {
        color: #232323;
        font-size: 14px;
        font-weight: bold;
        line-height: 5.6vw;
        height: 5.6vw;
      }
    }
  }
}
.trendGoods .productItem {
  background: #fafafa;
}
</style>
