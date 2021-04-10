<template>
  <div class="mall-home">
    <loader class="load" from="6" ref="load" useConfirm v-if="!$root.ISAPP"></loader>
    <!-- 顶部 -->
    <new-header type="search-cart cart-cate " :cartSect="cartSect"></new-header>
    <!-- 轮播 -->
    <swiper :options="carouselOpt" v-if="carousel.length>0" class="mh-carousel">
      <swiper-slide v-for="(item,index) in carousel" :key="'carousel'+index">
        <img v-lazy="https(item.url)" :alt="item.title" @click="carouselLink(item)" />
      </swiper-slide>
      <div class="swiper-dots flex-center" slot="scrollbar">
        <span v-for="i in carousel.length" :key="i" :class="{act:carouselAct===i-1}"></span>
      </div>
    </swiper>

    <!-- 预置位+宫格 -->

    <div class="mh-ads">
      <div v-if="ads.above&&ads.above.imgurl" class="mh-ad" @click="adLink(ads.above)">
        <img v-lazy="https(ads.above.imgurl)" alt />
      </div>
      <!-- 改版 -->
      <div class="gg-list" v-for="(item, index) in enters" :key="'enters'+index">
        <!-- 特殊类型宫格 -->
        <div class="gg-flash" v-if="item.type==1">
          <swiper :options="ggOpt">
            <swiper-slide v-for="(sitem,index) in item.gridlist" :key="'special'+index">
              <img :src="sitem.bottompic" :alt="item.title" @click="adGg(sitem)" />
            </swiper-slide>
          </swiper>
        </div>
        <!-- 常规布局显示 -->
        <div class="flex" v-else>
          <img
            :src="items.bottompic"
            v-for="(items, indx) in item.gridlist"
            :key="'enters'+indx"
            :style="{width:items.w+'px',height:items.h+'px'}"
            @click="adGg(items)"
          />
        </div>
      </div>
      <div v-if="ads.below&&ads.below.imgurl" class="mh-ad" @click="adLink(ads.below)">
        <img v-lazy="https(ads.below.imgurl)" alt />
      </div>
    </div>
    <!-- 斗牛拍卖 -->
    <div class="auc-sec" v-if="isShowAuctionList">
      <div class="tit">
        <div class="trend_goods_head">
          <div class="tit">
            {{auctiondata.title}}
            <span class="exp">{{auctiondata.secondtitle}}</span>
          </div>
          <div class="more" @click="goApp(2, auctionurl)">
            {{auctiondata.operationdesc}}
            <img
              src="/static/img/mall_right.png"
              style="width:3.46667vw"
            />
          </div>
        </div>
      </div>
      <div>
        <swiper :options="swiperProdsPiece" class="swiper-container swiper2">
          <swiper-slide v-for="(item,index) in showAuctionList" :key="index">
            <section>
              <auction-cell
                :key="'sg' + index"
                :info="item"
                enter="mallpage"
                data-type="0"
                @updatecounttime="updatecounttime"
              ></auction-cell>
            </section>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </div>
    <!-- 潮流好物 -->
    <div class="trend_goods" v-if="isShowShopList">
      <div class="trend_goods_head">
        <div class="tit">
          潮流好物
          <span class="exp">精品店铺推荐</span>
        </div>
        <div class="more" @click="lookTrendGoods">
          查看更多
          <img src="/static/img/mall_right.png" style="width:3.46667vw" />
        </div>
      </div>
      <div class="trend_goods_content" v-if="showShopList && showShopList.length > 0">
        <carousel
          center-mode
          :per-page="1"
          :pagination-size="5"
          :pagination-padding="4"
          pagination-color="#D2D1D1"
          pagination-active-color="#cdcdcd"
          pagination-position="bottom-overlay"
        >
          <slide v-for="(item,index) in showShopList" :key="index" class="slideItem">
            <div class="item1" @click="goShop(item.businessid)">
              <img :src="item.headportraiturl" alt />
            </div>
            <div class="item2" @click="goShop(item.businessid)">
              <p class="button">进店逛逛</p>
              <p class="name" style="-webkit-box-orient: vertical;">{{item.businessname}}</p>
            </div>
            <div
              class="item3"
              v-for="(goodsItem,goodsIndex) in item.productlist"
              @click="goDetail(goodsItem.id)"
              :key="goodsIndex"
            >
              <img :src="goodsItem.mainpic" alt />
            </div>
          </slide>
        </carousel>
      </div>
    </div>
    <!-- 列表 -->
    <v-delay
      :delay="1100"
      class="mh-tabs"
      :class="{'tab_is_show_f': tab_is_show_f}"
      v-if="tabs && tabs.length > 0"
    >
      <div class="mh-tab-box">
        <div
          v-for="(item, tabIdx) in tabs"
          :key="'tabs'+tabIdx"
          class="mh-tab"
          :class="{act:tabAct==tabIdx,'has-img':!!item.channelimg}"
          @click="toggle(tabIdx)"
        >
          <img v-if="item.channelimg" v-lazy="https(item.channelimg)" alt />
          <span v-else>{{item.channelname}}</span>
        </div>
      </div>
      <div class="flex-around mh-filters" v-if="showFilter" @click="toggleSort">
        <!-- 0:筛选,1综合,2新品,3价格 -->
        <label :class="{act:sort.type==1}" data-type="1">综合</label>
        <label :class="{act:sort.type==4}" data-type="4">销量</label>
        <label :class="{act:sort.type==2}" data-type="2">新品</label>
        <label
          class="filter-price"
          :class="{act:sort.type==3,down:sort.order==0,up:sort.order==1}"
          data-type="3"
        >价格</label>
        <label data-type="0">
          筛选
          <img src="/static/imgs/mall/ico-filter.png" alt />
        </label>
      </div>
    </v-delay>
    <v-delay :delay="1300">
      <swiper :options="tabOpt" ref="panelSwiper" v-if="tabs.length>0" class="mh-panels">
        <swiper-slide class="mh-panel" v-for="(tab,pnIdx) in tabs" :key="'panel'+pnIdx">
          <!-- 1.推荐，2.特卖，3.球鞋，4.B2C类目，5.supreme ，6. C2C服饰 7. 自定义 商品-->
          <template v-if="tabAct==pnIdx">
            <template v-if="tab.type==1">
              <v-list
                :load-handle="()=>{}"
                :more-handle="rcdloadmore"
                :more-handling="rcd.loading"
                :isend="rcd.isend"
              >
                <div class="plist-dbl flex-wrap rcd-list">
                  <template v-for="(iRcd,rcdIdx) in rcd.list">
                    <!-- {{iRcd.showtype}} -->
                    <product-unit
                      v-if="!iRcd.showtype"
                      :key="'rcd'+rcdIdx"
                      :product-item="iRcd"
                      :product-type="20"
                      :is-find-sim="1"
                      :home="true"
                      :homeLocation="rcdIdx"
                      :position="1"
                    ></product-unit>
                    <div
                      :key="rcdIdx"
                      v-else-if="iRcd.showtype>0"
                      class="cate-enters flex-col flex-btwn"
                      :class="{'one':!iRcd.list}"
                      @click="goCate(tab,iRcd)"
                    >
                      <div class="flex-wrap" v-if="iRcd.list">
                        <div
                          v-for="(ci, cIdx) in iRcd.list.slice(0,4)"
                          :key="cIdx"
                          class="cate-enter"
                          @click.stop="goCateSearch(ci,iRcd)"
                        >
                          <img v-lazy="https(ci.imgurl)" alt />
                          <p class="ellipsis">{{ci.name}}</p>
                        </div>
                      </div>
                      <div class="flex-wrap imgBox" v-else>
                        <div @click.stop="goCateSearch('',iRcd)">
                          <img v-lazy="https(iRcd.img)" alt />
                        </div>
                        <div class="ca-btn flex-center">
                          <span>{{iRcd.title}}</span>
                        </div>
                      </div>
                      <div class="cate-go">
                        <p class="vicetitle">{{iRcd.vicetitle0}}</p>
                        <p class="vicetitle mb">{{iRcd.vicetitle1}}</p>
                      </div>
                    </div>
                  </template>
                </div>
              </v-list>
            </template>
            <template v-else-if="tab.type==2">
              <mall-ghost></mall-ghost>
            </template>
            <div v-else-if="tab.type==3||tab.type==4||tab.type==5||tab.type==6" class="list-panel">
              <v-list
                :load-handle="()=>{}"
                :more-handle="tab.type==3||tab.type==6?snkloadmore:searchloadmore"
                :more-handling="(tab.type==3||tab.type==6?snk:sc).loading"
                :isend="(tab.type==3||tab.type==6?snk:sc).isend"
                v-if="(tab.type==3||tab.type==6?snk:sc).list.length>0"
              >
                <div class="plist-dbl flex-wrap rcd-list">
                  <template v-for="(pi,pIdx) in (tab.type==3||tab.type==6?snk:sc).list">
                    <product-unit
                      :key="(tab.type==3||tab.type==6?'snk':'sc')+pIdx"
                      v-if="!pi.showtype"
                      :product-item="pi"
                      :product-type="20"
                      :is-find-sim="1"
                      :home="true"
                      :homeLocation="pIdx"
                      :position="1"
                    ></product-unit>
                    <div
                      :key="(tab.type==3||tab.type==6?snk:sc)+pIdx"
                      v-else-if="pi.showtype&&pi.showtype>0"
                      class="cate-enters flex-col flex-btwn"
                      :class="{'one':!pi.list}"
                      @click="goCate(tab,pi)"
                    >
                      <div class="flex-wrap" v-if="pi.list">
                        <div
                          v-for="(ci, cIdx) in pi.list.slice(0,4)"
                          :key="pIdx+'cate'+cIdx"
                          class="cate-enter"
                          @click.stop="goCateSearch(ci,pi)"
                        >
                          <img v-lazy="https(ci.imgurl)" alt />
                          <p class="ellipsis">{{ci.name}}</p>
                        </div>
                      </div>
                      <div class="flex-wrap imgBox" v-else>
                        <div @click.stop="goCateSearch('',pi)">
                          <img v-lazy="https(pi.img)" alt />
                        </div>
                        <div class="ca-btn flex-center">
                          <span>{{pi.title}} ></span>
                        </div>
                      </div>
                      <div class="cate-go">
                        <p class="vicetitle">{{pi.vicetitle0}}</p>
                        <p class="vicetitle mb">{{pi.vicetitle1}}</p>
                      </div>
                    </div>
                  </template>
                </div>
              </v-list>
              <div v-else-if="!(tab.type==3||tab.type==6?snk:sc).loading" class="empty-rcd">
                <p>未能筛选到相关数据</p>
                <p>为你推荐</p>
                <v-list
                  :load-handle="()=>{}"
                  :more-handle="rcdloadmore"
                  :more-handling="rcd.loading"
                  :isend="rcd.isend"
                >
                  <div class="plist-dbl flex-wrap rcd-list">
                    <product-unit
                      v-for="(iRcd,rcdIdx) in rcd.list"
                      :key="'rcd'+rcdIdx"
                      :product-item="iRcd"
                      :product-type="20"
                      :is-find-sim="1"
                      :home="true"
                      :homeLocation="rcdIdx"
                      :position="1"
                    ></product-unit>
                  </div>
                </v-list>
              </div>
            </div>
            <div class="list-panel" v-else-if="tab.type==7">
              <v-list
                :load-handle="()=>{}"
                :more-handle="c2cloadmore"
                :more-handling="c2c.loading"
                :isend="c2c.isend"
              >
                <div class="plist-dbl flex-wrap rcd-list">
                  <template v-for="(iC2c,c2cIdx) in c2c.list">
                    <product-unit
                      :key="'c2c'+c2cIdx"
                      :product-item="iC2c"
                      :product-type="20"
                      :is-find-sim="1"
                      :home="true"
                      :homeLocation="c2cIdx"
                      :position="1"
                    ></product-unit>
                  </template>
                </div>
              </v-list>
            </div>
          </template>
        </swiper-slide>
      </swiper>
    </v-delay>
    <div class="layer-enter" v-if="layerEnter.isshow" @click="layerEnterGo">
      <img :src="layerEnter.icon" alt />
    </div>
    <!-- <RainModel
      :modelType="modelType"
      :shareInfo="shareInfo"
      @close="closeModel"
      v-if="modelType!=0"
    ></RainModel>-->
    <mall-filter
      v-bind="currTab"
      :show="filterShow"
      @search="filterSearch"
      @close="filterShow=false"
    ></mall-filter>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  HomeFirst,
  RecommendProduct,
  ProductSearch,
  ShowShopList,
  Showauctionlist,
  Searchpproduct,
} from "@/utils/api/mall";
import { HomeSneakerSearch, CostumeSearch } from "@/utils/api/sneaker";
import { CarouselLinkType, GridLinkType, HomeTabType } from "@/utils/enum";
import { DateDiff } from "../../common/util";
import { Nextraintime, Remaincount } from "../../utils/api/activities";
// import RainModel from "../../comps/RainModel";
import { GroupList } from "@/common/api/cart";
import NewHeader from "@/comps/NewHeader";
import MallGhost from "@/components/mall/Ghost";
import ProductUnit from "@/components/templates/ProductUnit";
import MallFilter from "@/comps/FilterProduct";
import Loader from "@/comps/Loader";
import { Carousel, Slide } from "vue-carousel";
import auctionImg from "@/components/templates/auctionImg";
import AuctionCell from "@/comps/AuctionCell";
const MemberTabKey = "HOME_CURR_TAB";
const defaultSearch = {
  pageindex: 1,
  keyword: "",
  hometabid: "",
  brandid: "",
  categoryid: "",
  beginprice: "",
  endprice: "",
  size: "",
};

export default {
  name: "MallHome",
  components: {
    NewHeader,
    MallGhost,
    ProductUnit,
    MallFilter,
    Loader,
    Carousel,
    Slide,
    auctionImg,
    AuctionCell,
  },
  data() {
    return {
      cartSect: 0, // 购物车标识
      setdata: { H: 0, m: 0, s: 0 },
      PokingMe: false,
      modelType: 0,
      shareInfo: {},
      activitytitle: "",
      homeLayerEnter: {},
      stySet: { width: "70%" },
      carousel: [],
      carouselAct: 0,
      // tabTop:100,
      carouselOpt: {
        autoplay: 2200,
        autoplayDisableOnInteraction: false,
        roundLengths: true,
        updateOnImagesReady: true,
        scrollbar: ".swiper-dots",
        scrollbarHide: false,
        // onInit: this.slideChange,
        onSlideChangeEnd: this.carouselChange,
      },
      ggOpt: {
        spaceBetween: 10,
        slidesPerView: 1.6,
      },
      ads: {},
      enters: [],
      tabs: [],
      tabAct: -1,
      tabOpt: {
        roundLengths: true,
        scrollbarHide: true,
        // onInit: this.slideChange,
        onSlideChangeEnd: this.tabChange,
      },
      rcd: {
        list: [],
        pageindex: 1,
        loading: false,
        isend: false,
      },
      snk: {
        list: [],
        loading: false,
        isend: false,
      },
      snkParam: {
        page: 1,
      },
      c2c: {
        list: [],
        loading: false,
        isend: false,
        pageindex: 1,
      },
      c2cParam: {
        page: 1,
        hometabid: "",
      },
      sc: {
        list: [],
        loading: false,
        isend: false,
      },
      scParam: { ...defaultSearch },
      sort: {
        type: 1, //0:筛选,1综合,2新品,3价格
        order: 0,
      },
      filterShow: false,
      isactivityprocessing: false,
      isShowAuctionList: true, //是否展示斗牛拍卖模块 true展示 false不展示 若为false，余下数据不返回showShopList=[]
      showAuctionList: [],
      auctiondata: {}, //拍卖数据
      auctionurl: "", // 拍卖列表链接
      aucItem: {}, // 页面展示的当前数据 拍卖入口
      isShowShopList: false, //是否展示潮流好物模块 true展示 false不展示 若为false，余下数据不返回showShopList=[]
      showShopList: [],
      isAuto: true,
      timer: "",
      scrollY: 0, //向上滚动的高度
      tab_is_show_f: false, // tab tab_is_show_f = true tab显示白色
      swiperProdsPiece: {
        // centeredSlides: true,
        slidesPerView: 2.6,
        spaceBetween: 10,
        onTouchEnd: (swiper) => {
          // console.log("测试", swiper.activeIndex);
          // 你的事件
          setTimeout(() => {
            if (swiper.activeIndex == 5 && this.auctionurl)
              this.goApp(2, this.auctionurl);
            // this.$router.push("/auction/aVLUtPcZ");
          }, 300);
        },
      },
    };
  },
  watch: {
    baseValue(val, old) {
      this.getFromBase(val);
    },
  },
  computed: {
    ...mapGetters({ baseValue: "baseValue", userInfo: "userInfo" }),
    currTab() {
      let { tabs, tabAct } = this;
      return tabs[tabAct] || {};
    },
    showFilter() {
      let tabType = -1;
      if (this.currTab) tabType = this.currTab.type;
      // sneaker: 3,
      // mallCategory: 4,
      // supreme: 5
      return (
        tabType == HomeTabType.sneaker ||
        tabType == HomeTabType.mallCategory ||
        tabType == HomeTabType.supreme ||
        tabType == HomeTabType.costume
      );
    },
    layerEnter() {
      let { activityurl, icon, isshow } = this.homeLayerEnter || {};
      let isIn = false;
      isshow = isshow && !!activityurl;
      if (isshow) {
        isIn =
          activityurl.indexOf("m.eyee.com") > -1 &&
          activityurl.indexOf("m.eyee.com/a/") < 0;
        if (isIn)
          activityurl = activityurl.replace(/^https?:\/\/.*?\.com/i, "");
      }
      return { isshow, isIn, activityurl, icon };
    },
  },
  mounted() {
    let _ = this,
      { t } = _.$route.query;
    _.redirectType = t || -1;
    _.getInfo();
    if (_.baseValue) _.getFromBase(_.baseValue);
    // 请求潮流好物接口
    _.showShopListFun();
    // 请求斗牛拍卖接口
    _.showauctionlistFun();
    window.addEventListener("scroll", () => {
      _.scrollY = window.scrollY;
      if (_.scrollY >= _.tabTop) {
        _.tab_is_show_f = true;
      } else {
        _.tab_is_show_f = false;
      }
    });
  },
  methods: {
    getFromBase(val) {
      let _ = this;
      if (val && val.configs) {
        let { homefloatingactivityinfo } = val.configs;
        if (homefloatingactivityinfo)
          _.homeLayerEnter = JSON.parse(homefloatingactivityinfo);
      }
    },
    layerEnterGo() {
      let _ = this,
        { isIn, activityurl } = _.layerEnter;
      if (isIn) _.$router.push(activityurl);
      else window.location.href = activityurl;
    },
    carouselChange(swiper) {
      this.carouselAct = swiper.activeIndex;
    },
    recProduct(swiper) {
      console.log("推荐商品", swiper.activeIndex);
    },
    getInfo() {
      let _ = this,
        sW = window.screen.width;
      HomeFirst()
        .then((res) => {
          console.log("HomeFirst res", res);
          if (res) {
            let presets = res.presets || [];
            _.carousel = res.banners || [];
            _.ads = {
              above: presets.find((i) => i.location === 1),
              below: presets.find((i) => i.location === 2),
            };
            _.enters = (res.grids || []).map((item) => {
              console.log("gg-list", item);
              item.gridlist = item.gridlist.map((i) => {
                i.w = (sW * i.percent) / 100;
                i.h = (i.w / i.width) * i.hight;
                delete i.percent;
                delete i.width;
                delete i.hight;
                return i;
              });
              return item;
            });
            console.log("_.enters", _.enters);
            _.tabs = res.tabs || [];
            setTimeout(() => {
              _.$nextTick(() => {
                setTimeout(() => {
                  _.getStickyTop();
                }, 800);
              });

              let memberTab = sessionStorage.getItem(MemberTabKey) || 0;
              let doScroll = false;
              if (_.redirectType > -1) {
                memberTab = _.tabs.findIndex((t) => t.type == _.redirectType);
                doScroll = true;
              }

              setTimeout(() => {
                _.togglePanel(memberTab, doScroll);
              }, 1300);
            }, 30);
            GroupList()
              .then((res) => {
                if (res && res.length > 0) {
                  this.cartSect = 1;
                } else this.cartSect = 0;
              })
              .catch((e) => {
                console.error(e);
              });
          }
        })
        .catch((e) => {
          console.error("HomeFirst error", e);
        });
    },
    getStickyTop() {
      let _ = this;
      let $tab = document.querySelector(".mh-tabs");
      if ($tab) {
        let top = $tab.getBoundingClientRect().y;
        let headerH = document.querySelector(".new-header").clientHeight;
        if (top < 280) {
          window.scrollTo(0, 0);
          top = $tab.getBoundingClientRect().y;
          window.scrollTo(0, top - headerH);
        }
        _.tabTop = top - headerH;
      }
    },
    adGg(item) {
      /**
       * 首页宫格跳转类型
      //
      // "showtype":#"0:常规商品卡片,1助力砍价、2拼团、3新品预售、 4 B2C 品牌， 5 C2C品牌、6 店铺、7 平台大促、8 自定义专题、9 天天抽奖、10 限量发售、
      // 11 球鞋入口、12 分类、 13系列、
      // 14在线鉴定，15拉新抢购，16  supreme类目，17 supreme，18 B2C产品详情 ,19 C2C 产品详情，20 鬼市，21 球鞋榜，22 球鞋搜索，23 领券中心 24c2c 服饰
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
      //       24 costume 25.B2C搜索，26.全站搜索
      // bullPreDetail 28 预售券详情
      // trendGoods 39 潮流店铺

      let _ = this,
        path = "";
      let link = item.link;
      let contentname = item.contentname;
      let loadapp = false;
      // 类型为4.品牌、5.店铺、6.平台大促 contentid不为null
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
          if (item.goCate == 1) path = "/mall/BrandRec";
          else path = "/results/" + encodeURIComponent(contentname);
          break;
        case GridLinkType.brandSearchC2c:
          if (item.goCate == 1) path = "/mall/BrandRec";
          else
            path = "/results/" + encodeURIComponent(contentname) + "?isc2c =1";

          break;
        case GridLinkType.shopDetail:
          if (item.goCate == 1) path = "/mall/ShopRec";
          else path = "/shop/shopdetail/" + link;

          break;
        case GridLinkType.platformActivity:
          path = "/platformActivity/" + link;
          break;
        case GridLinkType.activity:
          if (item.url) link = item.url;
          if (/.*?m.eyee\.com\/active\//i.test(link))
            path = "/active/" + link.split("/active/")[1];
          else if (/.*?m.eyee\.com\//i.test(link))
            path = link.replace(/.*?m.eyee\.com/i, "");
          else if (
            /.*?eyee\.com\/rainhall/i.test(link) ||
            /.*?eyee\.com\/collectionCard/i.test(link)
          )
            loadapp = true;
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
          if (item.goCate == 1) path = "/category";
          else
            path =
              "/results/" +
              encodeURIComponent(contentname) +
              "?categoryid=" +
              link;
          break;
        case GridLinkType.seriesList:
          if (item.goCate == 1) path = "/category";
          else
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
          if (item.goCate == 1) path = "/sales/sale/" + (link || "");
          else path = `/salesList/${contentname}/${link}`;
          break;
        case GridLinkType.SupremeSearch:
          if (item.goCate == 1) path = "/sales/sale/" + (link || "");
          else path = "/sales/category/" + (link || "");
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
            "/results/" + encodeURIComponent(contentname || link) + "?isc2c =1";
          break;
        case GridLinkType.getCouponCenter:
          path = `/coupon`;
          break;
        case GridLinkType.costume:
          path = `/c2c/CategoryMall`;
          break;
        case GridLinkType.b2cSearch:
          path =
            "/results/" + encodeURIComponent(contentname || link) + "?isc2c=0";
          break;
        case GridLinkType.allSearch:
          path = "/results/" + encodeURIComponent(contentname || link);
          break;
        case GridLinkType.bullPreDetail:
          path = "/bull/proDetialShare/" + (item.contentid || link);
          break;
        case 199: //app发售日历
          loadapp = true;
          break;
        case GridLinkType.trendGoods: //潮流店铺 潮流好物
          path = `/trendGoods`;
          break;
        case CarouselLinkType.cutgetcoupon:
          loadapp = true;
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
      title = "banner",
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
          e: "mallBannerClick",
          p: { mallBannerTitle: title },
          t: 2,
          ext: 1,
        });
      } catch (err) {
        console.error("request error report error: ", err);
      }
      let _ = this,
        url = "",
        loadapp = false;
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
          if (
            /.*?eyee\.com\/rainhall/i.test(url || data) ||
            /.*?eyee\.com\/collectionCard/i.test(url || data)
          )
            loadapp = true;
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
        case CarouselLinkType.cutgetcoupon:
          loadapp = true;
          break;
      }
      if (loadapp) {
        _.$refs.load.$el.click();
      } else if (url) _.$router.push(url);
      else window.location.href = data;
    },
    carouselLink(item) {
      this.goto(item);
    },
    adLink(item) {
      this.adGg(item);
    },
    reset(setAll) {
      let _ = this;

      _.snk.loading = true;
      _.snk.list = [];

      _.sc.loading = true;
      _.sc.list = [];

      _.c2c.loading = true;
      _.c2c.list = [];

      if (setAll) {
        _.sort.type = 1;
        _.sort.order = 0;
        _.scParam = { ...defaultSearch };
        //  console.log('------------>_.scParam',defaultSearch)
      }

      _.rcd.pageindex = 1;
      _.snkParam.page = 1;
      _.c2cParam.page = 1;
    },
    tabChange(swiper) {
      this.togglePanel(swiper.activeIndex);
    },
    toggle(index) {
      this.togglePanel(index);
      $log({
        e: "malltrafficportClick",
        p: { trafficport: this.tabs[index].channelname || "" },
        t: 0,
        ext: 1,
      });
    },
    togglePanel(index, scroll = true) {
      index = isNaN(index) ? 0 : index;
      let _ = this,
        tab = _.tabs[index];
      _.tabType = tab && tab.type;
      if (_.tabAct == index) {
        if (scroll)
          _.$nextTick(() => {
            scrollTo(0, _.tabTop);
          });
        return;
      }
      _.reset(1);
      if (tab) {
        switch (Number(tab.type)) {
          case HomeTabType.recommend:
            _.snkParam.hometabid = tab.hometabid;
            _.getRecommend();
            break;

          case HomeTabType.costume:
          case HomeTabType.sneaker:
            if (Number(tab.type) == HomeTabType.costume) {
              _.scParam.brandid = "";
              _.scParam.categoryid = tab.categoryid;
              _.scParam.hometabid = tab.hometabid;
            } else {
              _.snkParam.hometabid = tab.hometabid;
            }
            _.sneakerSearch();
            break;

          case HomeTabType.supreme:
          case HomeTabType.mallCategory:
            _.scParam = defaultSearch;
            // _.scParam.keyword = tab.channelname;
            if (tab.type === HomeTabType.supreme) {
              _.scParam.categoryid = "";
              _.scParam.brandid = tab.categoryid;
            } else {
              _.scParam.brandid = "";
              _.scParam.categoryid = tab.categoryid;
            }
            _.scParam.hometabid = tab.hometabid;
            _.search();
            break;
          case HomeTabType.c2ccustom:
            _.c2cParam.hometabid = tab.hometabid;
            _.c2cSearch();
            break;

          default:
            break;
        }
        sessionStorage.setItem(MemberTabKey, index);
        _.tabAct = index;
        _.$refs.panelSwiper.swiper.slideTo(index);
      }

      if (scroll)
        _.$nextTick(() => {
          scrollTo(0, _.tabTop);
        });
    },
    toggleSort(e) {
      let _ = this,
        { type } = e.target.dataset,
        { sort, currTab } = _;
      if (isNaN(type) || (type != 3 && sort.type == type)) return;
      if (type > 0) {
        // 类型为价格时改变排序
        if (sort.type == 3 && type == 3) sort.order = Number(!sort.order);
        else sort.order = 0;

        sort.type = Number(type);

        // 无数据时切换排序方式不请求
        // if (
        //   (currTab.type == HomeTabType.sneaker ? _.snk : _.sc).list.length == 0
        // )
        //   return;

        _.reset();

        if (
          currTab.type === HomeTabType.sneaker ||
          currTab.type === HomeTabType.costume
        ) {
          _.sneakerSearch();
        } else {
          _.search();
        }

        _.$nextTick(() => {
          scrollTo(0, _.tabTop);
        });
      } else {
        _.filterShow = true;
      }
    },
    getRecommend() {
      let _ = this,
        pageindex = _.rcd.pageindex;
      _.rcd.loading = true;
      RecommendProduct(pageindex, _.snkParam.hometabid)
        .then((res) => {
          if (res && res.list && res.list.length) {
            res.list = res.list.map((i) => {
              i.paynumber = i.sumcount;
              i.mainpic = i.mainpic + "|";
              // 处理 showtype>0 时 vicetitle
              if (i.showtype > 0 && i.vicetitle) {
                i.vicetitle0 = i.vicetitle.split(",")[0];
                i.vicetitle1 = i.vicetitle.split(",")[1];
              }
              return i;
            });
            if (pageindex === 1) _.rcd.list = res.list;
            else _.rcd.list = _.rcd.list.concat(res.list);
            _.rcd.isend =
              res.pageindex * res.pagesize >= res.sumcount &&
              _.rcd.list.length > 0;
          } else _.rcd.isend = true;
          _.rcd.loading = false;
        })
        .catch((e) => {
          _.rcd.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    rcdloadmore() {
      let _ = this;
      if (_.rcd.loading) return;
      if (_.rcd.isend) _.toast("已无更多");
      else {
        _.rcd.pageindex++;
        _.getRecommend();
      }
    },
    sneakerSearch() {
      let _ = this,
        { snkParam, scParam, sort, currTab } = _,
        param = {},
        api = HomeSneakerSearch,
        sorttype = 0;

      _.snk.loading = true;

      if (_.tabType == HomeTabType.sneaker) {
        // 排序类型转换
        // 0:筛选,1综合,2新品,3价格,4销量 => 默认0:综合,1销量,2新品,3价格 ordertype 0 升序 1 降序
        if (sort.type > 1) {
          switch (sort.type) {
            case 1:
              sorttype = 0;
              break;
            case 2:
              sorttype = 2;
              break;
            case 3:
              sorttype = 3;
              break;
            case 4:
              sorttype = 1;
              break;
          }
        }
        param = { ...snkParam, sorttype, ordertype: Number(!sort.order) };
        api = HomeSneakerSearch;
      } else if (_.tabType == HomeTabType.costume) {
        // 0:筛选,1综合,2新品,3价格，4销量 => 1-综合;4-价格;2-销量;3-评论;3-新品;5-热度 ordertype 1 升序 2 降序
        switch (sort.type) {
          case 1:
            sorttype = 1;
            break;
          case 2:
            sorttype = 3;
            break;
          case 3:
            sorttype = 4;
            break;
          case 4:
            sorttype = 2;
            break;
        }
        let ordertype = 2;
        if (Number(sort.order) == 0) ordertype = 2;
        else if (Number(sort.order) == 1) ordertype = 1;
        scParam.keyword = "supreme";
        scParam.page = snkParam.page;
        param = { ...scParam, sorttype, ordertype };
        api = CostumeSearch;
      }

      console.log("服饰入参", param);
      api({ ...param })
        .then((res) => {
          if (res && res.list && res.list.length) {
            res.list = res.list.map((i) => {
              if (i.showtype == 0)
                return {
                  /**
                 * "{"id":"","name":"","sumcount":186,"isc2c":0,"businessname":"","businesstype":2,"brandname":"","mainpic":"","saleprice":188,"specialprice":0,"soldout":false,"producttype":0,"discountoff":0,"salestatus":1,"requestid":""}"

                  "productid":"String",#product id
                  "productname":"String 商品的名字",
                  "imageurl":" String 商品图片",
                  "price":"double 商品价格",
                  "paynumber"#付款人数,
                  "showtype":"0:常规商品卡片，1：多个的分类入口",
                 */
                  id: i.productid,
                  name: i.productname,
                  mainpic: i.imageurl || i.msg,
                  saleprice: i.price,
                  specialprice: 0,
                  isc2c: 1,
                  paynumber: i.paynumber,
                };
              else return i;
            });
            // console.log("HomeSneakerSearch res", res);
            if (snkParam.page === 1) _.snk.list = res.list;
            else _.snk.list = _.snk.list.concat(res.list);
            _.snk.isend =
              res.page * res.size >= res.total && _.snk.list.length > 0;
          } else if (snkParam.page === 1) _.snk.list = [];

          if (snkParam.page === 1 && _.snk.list.length === 0) _.getRecommend();

          _.snk.loading = false;
        })
        .catch((e) => {
          if (snkParam.page === 1 && _.snk.list.length === 0) _.getRecommend();

          _.snk.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    snkloadmore() {
      let _ = this;
      if (_.snk.loading) return;
      if (_.snk.isend) _.toast("已无更多");
      else {
        _.snkParam.page++;
        _.sneakerSearch();
      }
    },
    searchloadmore() {
      let _ = this;
      if (_.sc.loading) return;
      if (_.sc.isend) _.toast("已无更多");
      else {
        _.scParam.pageindex++;
        _.search();
      }
    },
    search() {
      let _ = this,
        { sc, scParam, sort } = _;
      // 排序类型转换
      // 0:筛选,1综合,2新品,3价格，4销量 => 1-综合;3-价格;2-销量;3-评论;0-新品;5-热度
      let sorttype = 0;
      switch (sort.type) {
        case 1:
          sorttype = 1;
          break;
        case 2:
          sorttype = 0;
          break;
        case 3:
          sorttype = 3;
          break;
        case 4:
          sorttype = 2;
          break;
      }

      console.log(
        "ProductSearch param",
        "sort.type",
        sort.type,
        "sorttype",
        sorttype,
        scParam
      );
      ProductSearch({ ...scParam, sorttype, ordertype: sort.order })
        .then((res) => {
          if (res && res.list && res.list.length) {
            res.list = res.list.map((i) => {
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
                  platformactivityicon: i.platformactivityicon,
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
          if (scParam.pageindex === 1 && _.sc.list.length === 0)
            _.getRecommend();

          _.sc.loading = false;
        })
        .catch((e) => {
          if (scParam.pageindex === 1 && _.sc.list.length === 0)
            _.getRecommend();

          _.sc.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    filterSearch(res) {
      console.log("filterSearch", this.currTab, res);
      let _ = this,
        { currTab, scParam, snkParam } = _;
      _.filterShow = false;
      if (currTab.type === HomeTabType.sneaker) {
        // 同条件不请求
        if (
          !(
            snkParam.brandid == res.brandid &&
            snkParam.keyword == res.size.value
          )
        ) {
          snkParam.brandid = res.brandid;
          snkParam.sneakersize = res.size.text;
          snkParam.keyword = res.size.text;
          _.sneakerSearch();
        }
      } else {
        // 同条件不请求
        if (
          !(
            scParam.brandid == res.brandid &&
            scParam.categoryid == res.categoryid &&
            scParam.endprice == res.price.endprice &&
            scParam.beginprice == res.price.beginprice &&
            scParam.keyword == res.size.value &&
            scParam.size == res.size.text
          )
        ) {
          scParam.brandid = res.brandid;
          scParam.categoryid = res.categoryid;
          scParam.endprice = res.price.endprice;
          scParam.beginprice = res.price.beginprice;
          if (currTab.type === HomeTabType.costume) {
            scParam.size = res.size.text;
            _.sneakerSearch();
          } else {
            scParam.keyword = res.size.text;
            _.search();
          }
        }
      }

      _.$nextTick(() => {
        scrollTo(0, _.tabTop);
      });
    },
    c2cSearch() {
      let _ = this,
        pageindex = _.c2c.pageindex;
      _.c2c.loading = true;
      Searchpproduct({ pageindex, hometabid: _.c2cParam.hometabid })
        .then((res) => {
          if (res && res.list && res.list.length) {
            res.list = res.list.map((i) => {
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
                  platformactivityicon: i.platformactivityicon,
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
            if (pageindex === 1) _.c2c.list = res.list;
            else _.c2c.list = _.c2c.list.concat(res.list);
            _.c2c.isend =
              res.page * res.size >= res.total && _.c2c.list.length > 0;
          } else _.c2c.isend = true;

          _.c2c.loading = false;
        })
        .catch((e) => {
          _.c2c.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    c2cloadmore() {
      let _ = this;
      if (_.c2c.loading) return;
      if (_.c2c.isend) _.toast("已无更多");
      else {
        _.c2c.pageindex++;
        _.c2cSearch();
      }
    },
    goCateSearch(ci, item) {
      try {
        $log({ e: "failarmy", p: { value: item.vicetitle }, t: 2, ext: 1 });
      } catch (err) {
        console.error("request error report error: ", err);
      }

      // "showtype":#"0:常规商品卡片,1 专题 ,2分类, 3品牌, 4 店铺, 5 系列,6 supreme类目
      let _ = this,
        obj = {};
      obj.type = item.showtype;
      obj.link = ci.id || "";
      obj.url = item.url || "";
      obj.search = 1;
      if (obj.type == 28) obj.contentid = item.contentid || "";
      obj.contentname = ci.name || item.contentname;
      if (
        item.showtype == 7 ||
        item.showtype == 15 ||
        item.showtype == 18 ||
        item.showtype == 19 ||
        item.showtype == 20
      )
        obj.link = item.contentid;
      else if ((item.showtype == 16 || item.showtype == 17) && !ci)
        obj.link = item.categoryid;
      this.adGg(obj);
    },
    goCate(tab, item) {
      // // "showtype":#"0:常规商品卡片,1助力砍价、2拼团、3新品预售、 4 B2C 品牌， 5 C2C品牌、6 店铺、7 平台大促、8 自定义专题、9 天天抽奖、10 限量发售、
      // 11 球鞋入口、12 分类、 13系列、
      // 14在线鉴定，15拉新抢购，16  supreme类目，17 supreme，18 B2C产品详情 ,19 C2C 产品详情，20 鬼市，21 球鞋榜，22 球鞋搜索，23 领券中心
      let _ = this,
        obj = {};
      obj.type = item.showtype;
      obj.link = item.categoryid;
      obj.url = item.url || "";
      if (obj.type == 28) obj.contentid = item.contentid || "";
      obj.contentname = item.contentname;
      obj.goCate = 1;
      if (
        item.showtype == 7 ||
        item.showtype == 15 ||
        item.showtype == 18 ||
        item.showtype == 19 ||
        item.showtype == 20
      )
        obj.link = item.contentid;

      this.adGg(obj);
    },
    showauctionlistFun() {
      let _ = this;
      Showauctionlist({})
        .then((res) => {
          _.isShowAuctionList = res.isshow;
          _.showAuctionList = res.list;
          _.auctiondata = {
            title: res.title || "拍卖会场",
            secondtitle: res.secondtitle || "闲置潮品最快2小时卖出",
            operationdesc: res.operationdesc || "点此捡漏",
          };
          if (_.showAuctionList && _.showAuctionList.length > 0) {
            _.auctionurl = res.auctionurl;
            _.aucItem = _.showAuctionList[0];
            let arri = [];
            arri = _.aucItem.auctionproducturl.split("/");
            if (arri && arri.length > 1) {
              _.aucItem.auctionId = arri[arri.length - 1];
            }
            setTimeout(() => {
              _.showauctionlistFun();
            }, 5 * 60 * 1000);
            // clearInterval(_.timer);
            // _.timer = setInterval(() => {
            //   this.$refs.slide.nextSlide();
            // }, 3000);
          }
        })
        .catch((e) => {
          // _.toast(e&&e.msg?e.msg:'')
        });
    },
    currentChange(aucItem) {
      this.aucItem = aucItem;
      let arri = [];
      arri = this.aucItem.auctionproducturl.split("/");
      if (arri && arri.length > 1) {
        this.aucItem.auctionId = arri[arri.length - 1];
      }
    },
    showShopListFun() {
      let _ = this;
      ShowShopList({})
        .then((res) => {
          _.showShopList = res.list;
          _.isShowShopList = res.isshow;
        })
        .catch((e) => {
          // _.toast(e&&e.msg?e.msg:'')
        });
    },
    updatecounttime(val) {
      if (val == "update") this.showauctionlistFun();
    },
    goShop(businessid) {
      // 进去店铺详情
      this.$router.push("/shop/shopdetail/" + businessid);
      $log({ e: "mall_home_entershop_click", p: { businessid } });
    },
    // 去B2C商品详情
    goDetail(id) {
      this.$router.push("/productDetail/" + id);
      $log({ e: "mall_home_product_click", p: { productid: id } });
    },
    // 去往潮流好物页面
    lookTrendGoods() {
      this.$router.push("/trendGoods");
      $log({ e: "mall_home_lookmore_click", p: { url: "/trendGoods" } });
    },
    goApp(type, item) {
      // type 1 从商城首页拍卖商品点击 item==auctionID 2 商城首页拍卖查看更多点击 item==productid
      console.log(999, type, item);
      this.loadApp("请前往【斗牛DoNew】APP参与活动~");
      if (type == 1) {
        $log({ e: "mall_auction_enterproduct_click", p: { auctionID: item } });
      } else if (type == 2) {
        $log({ e: "mall_auction_lookmore_click", p: { auctionurl: item } });
      }
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>
<style scoped>
/* .mall-home {
} */
.gg-flash {
  padding: 0 4vw;
  height: 32vw;
  overflow: hidden;
  margin: 4vw 0;
}
.layer-enter {
  width: 15%;
  position: fixed;
  z-index: 33;
  top: 55%;
  right: 0;
}
.mall-home >>> .nh-search {
  border-radius: 5px;
  height: 35px;
}
.gg-list img {
  display: block;
}
.year-ent {
  background: #f2f2f2;
  padding-top: 10px;
}
.shou-red-bg {
  padding: 0 3.4vw;
}
.shou-red-bg .left-img {
  width: 20%;
}
.shou-red-bg .check_look {
  width: 20%;
}
.shou-red-bg .count-down {
  width: 60%;
  text-align: right;
}
.shou-red-bg .count-down .txt {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}
.shou-red-bg .count-down span {
  color: #fff;
  display: inline-block;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background: url("https://files.eyee.com/activity/year-activity/time_Bg.png") 0
    0 no-repeat;
  background-size: 100% 100%;
}
.mh-carousel {
  height: 33.33vw;
  background: #fbfbfb;
}
.mh-carousel img {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(0, -50%);
}
.rec-pro-dots {
  position: relative;
}
.swiper-dots {
  position: absolute;
  bottom: 10px;
  width: 100%;
  line-height: 10px;
}
.swiper-dots span,
.rec-pro-dots span {
  width: 6px;
  height: 6px;
  margin: 2px;
  background: rgba(255, 255, 255, 0.59);
  border-radius: 3px;
  transition: width 0.2s ease-out 0.1s;
}

.swiper-dots .act {
  width: 12px;
  background: rgba(255, 255, 255, 1);
  transition-delay: 0;
}
.swiper-dots /deep/ .swiper-scrollbar-drag {
  width: 0 !important;
}

.mh-ads {
  /* padding: 16px 12px; */
  background: #fff;
}
/* .mh-ad {
  margin: 8px 0;
} */
.mh-ad img {
  width: 100%;
}

.mh-enters {
  margin: 16px 0;
  background: #f2f2f2;
  box-shadow: 0 2px 11px 0 rgba(211, 211, 211, 0.71);
  border-radius: 8px;
  overflow: hidden;
}
.mh-enter {
  /* padding: 12px 8px 0 12px; */
  width: 50%;
}
/* .mh-enter p {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 20px;
}
.mh-enter span {
  font-size: 11px;
  font-weight: 400;
  color: #666;
  line-height: 16px;
} */
.mh-enter img {
  display: block;
  width: 100%;
}

.mh-tabs {
  position: sticky;
  top: 13.33vw;
  white-space: nowrap;
  z-index: 8;
}
.mh-tabs.tab_is_show_f .mh-tab-box {
  background: #fff;
}
.mh-tab-box {
  width: 100%;
  height: 13vw;
  line-height: 13vw;
  overflow-x: scroll;
  background: #f5f5f5;
}
.mh-tab {
  display: inline-block;
  position: relative;
  white-space: nowrap;
}
.mh-tab:not(.has-img) {
  padding: 0 12px;
}
.mh-tab.has-img {
  width: 40px;
  height: 100%;
  vertical-align: middle;
}
.mh-tab img {
  width: 100%;
  /* height: 22px; */
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}
.mh-tab.act img {
  transform: translate(0, -50%) scale(1.1);
}
.mh-tab span {
  font-size: 15px;
  font-weight: 400;
  color: #666;
  transition: font 0.2s ease;
}
.mh-tab.act span {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
/* .mh-tab:not(.has-img)::after { */
.mh-tab::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: #232323;
  transform: translate(-50%, -6px);
  transition: width 0.2s ease-in;
}
.mh-tab.act::after {
  width: 26px;
}

.mh-panel {
  min-height: 100vh;
}
.mh-panels {
  background: #f2f2f2;
}
/* .mint-loadmore,
.list-panel {
  min-height: 100vh;
} */
.mint-loadmore,
.mh-filters,
.empty-rcd {
  background: #f2f2f2;
}
.empty-rcd p:first-of-type {
  font-size: 14px;
  font-weight: 400;
  color: #666;
  line-height: 20px;
  padding: 32px 0;
}
.empty-rcd p:last-of-type {
  position: relative;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 22px;
  margin-bottom: 24px;
}
.empty-rcd p:last-of-type::before,
.empty-rcd p:last-of-type::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 30px;
  border-top: 1px solid;
}
.empty-rcd p:last-of-type::before {
  left: 50%;
  transform: translate(-80px, 0);
}
.empty-rcd p:last-of-type::after {
  right: 50%;
  transform: translate(80px, 0);
}

.mh-filters {
  position: relative;
  top: -0.2667vw;
}
.mh-filters label {
  font-size: 13px;
  font-weight: 400;
  color: #666;
  line-height: 34px;
  width: 22%;
  text-align: center;
  transition: font 0.2s ease;
}
.mh-filters .act {
  font-weight: 500;
  color: #333;
}
.mh-filters img {
  width: 13px;
  vertical-align: middle;
}

/* filter-price act up */
.filter-price {
  position: relative;
  padding-right: 10px;
}
.filter-price::after {
  content: "";
  display: block;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(20px, -2px);
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  transition: border 0.2s ease;
}
.filter-price.down::after {
  border-top: 4px solid;
}
.filter-price.up::after {
  border-bottom: 5px solid;
}

/* .rcd-list {
  background: #f2f2f2;
} */
.rcd-list /deep/ .productItem,
.cate-enters {
  width: calc(50% - 10px);
  margin: 5px;
  padding: 0;
  border-radius: 8px;
  overflow: hidden;
}
.one .cate-enter {
  width: 100%;
}
.rcd-list /deep/ .product_name {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  /* line-height: 30px;
  height: 30px; */
  line-height: 1.5;
  height: 36px;
  margin-bottom: 1.6vw;
  padding: 0 10px;
}
.rcd-list /deep/ .product_price {
  font-size: 18px;
  height: auto;
  line-height: 25px;
  margin: 0;
}
.rcd-list /deep/ .productItem p.pc2c,
.rcd-list /deep/ .productItem p.product_price {
  margin-bottom: 4px;
}
.cate-enters {
  background: #fff;
  padding: 0;
}
.cate-go img {
  /* height: 34px; */
  margin: 18px 0;
}
.cate-go p {
  font-size: 12px;
  font-weight: 500;
  color: #333;
  line-height: 17px;
  margin-bottom: 20px;
}
.cate-enter {
  width: 50%;
  min-height: 80px;
  padding: 5px;
}

/* .cate-enter img {
  height: 54px;
} */
.cate-enter p {
  font-size: 10px;
  font-weight: 600;
  color: #333;
  line-height: 14px;
}
.pokingMe {
  position: relative;
}
.pokingMe span {
  font-size: 12px;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
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
.imgBox {
  position: relative;
  margin-bottom: 8vw;
}
.imgBox .ca-btn {
  position: absolute;
  width: 32vw;
  white-space: nowrap;
  display: inline-block;
  line-height: 9.6vw;
  height: 9.6vw;
  border-radius: 4.8vw;
  text-align: center;
  background: #fff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  bottom: -4.8vw;
  left: 50%;
  transform: translateX(-50%);
}
.imgBox .ca-btn span {
  color: #232323;
  font-size: 17px;
}
</style>
<style lang="scss" scoped>
.trend_goods {
  border-top: #f5f5f5 solid 1px;
}
.auc-sec {
  padding: 0 4vw 4.8vw;
  .trend_goods_head {
    padding: 0;
  }
}
.trend_goods_head {
  background: #ffffff;
  height: 16vw;
  padding: 5.33333vw 4vw 4vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .tit {
    font-size: 18px;
    color: #232323;
    font-weight: 600;
    .exp {
      font-size: 12px;
      color: #969696;
      font-weight: 600;
      padding-left: 9px;
    }
  }
  .more {
    color: #646464;
    font-size: 12px;
    font-weight: 400;
    img {
      position: relative;
      top: 0.4vw;
    }
  }
}
.trend_goods_content {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(245, 245, 245, 1) 100%
  );
  padding: 0 4vw 8vw;
  .slideItem {
    padding: 5.8667vw 4vw;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .item1 {
      height: 14.6667vw;
      width: 14.6667vw;
      border-radius: 2px;
      border: 1px solid rgba(230, 230, 230, 1);
      margin-right: 2.6667vw;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        display: block;
        width: 13.0667vw;
        height: 13.0667vw;
      }
    }
    .item2 {
      width: 16vw;
      margin-right: 4vw;
      .button {
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
      .name {
        width: 14.6667vw;
        height: 8.5333vw;
        font-size: 12px;
        color: #969696;
        font-weight: 600;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // -webkit-line-clamp: 2;
        // white-space:normal;
        // word-break:break-all;

        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
      }
    }
    .item3 {
      width: 14.6667vw;
      height: 14.6667vw;
      margin-right: 1.3333vw;
      &:last-child {
        margin: 0;
      }
      img {
        display: block;
        height: 14.6667vw;
        width: 14.6667vw;
        border-radius: 2px;
      }
    }
  }
}
.auction_module {
  padding: 2.6667vw 5.3333vw 2.6667vw 4vw;
  background: #ffffff;
  .auction_item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &.hidden {
      display: none;
    }
    .auction_info {
      padding: 2.6667vw 0 3.2vw;
      width: 61.3333vw;
      .tit {
        height: 6.6667vw;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 1.3333vw;
        .ti {
          height: 6.6667vw;
          line-height: 6.6667vw;
          margin-right: 1.0667vw;
          color: #232323;
          font-weight: 600;
          font-size: 18px;
          width: 22vw;
        }
        .initbid {
          height: 6.4vw;
          line-height: 6.4vw;
          width: 16.2667vw;
          background: url("https://files.eyee.com/mcdn/img/initbid_bg.png") 0 0
            no-repeat;
          background-size: cover;
          position: relative;
          .initbid_info {
            color: #fff;
            font-size: 12px;
            font-weight: 600;
            padding: 0 1.4vw 0 1.0667vw;
            position: absolute;
            border-radius: 2px;
            left: 2.4vw;
            top: 0;
            background: #fa3c7a;
            height: 6.4vw;
            line-height: 6.4vw;
            z-index: 2;
          }
        }
      }
      .name {
        height: 5.3333vw;
        line-height: 5.3333vw;
        color: #969696;
        font-size: 14px;
        font-weight: 600;
      }
      .other {
        height: 8.8vw;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .currentbid {
          height: 8.8vw;
          line-height: 8.8vw;
          font-size: 22px;
          color: #272727;
          margin-right: 2.6667vw;
          font-weight: bold;
          span {
            font-size: 14px;
            font-weight: bold;
          }
        }
        .onlookers {
          font-size: 12px;
          color: #646464;
          font-weight: 400;
          height: 4.5333vw;
          line-height: 4.5333vw;
          margin-right: 4vw;
          position: relative;
          top: 0.5vw;
        }
        .more {
          color: #646464;
          font-size: 12px;
          font-weight: 400;
          position: relative;
          top: 0.5vw;
          img {
            position: relative;
            top: 0.4vw;
          }
        }
      }
    }
    .auction_img {
      width: 29.3333vw;
      height: 29.3333vw;
    }
  }
}
</style>
<style>
.trend_goods_content .VueCarousel-pagination--bottom-overlay {
  bottom: -6vw;
}

.trend_goods_content .VueCarousel-dot--active {
  width: 16px !important;
  border-radius: 12px !important;
}
.trend_goods_content .VueCarousel {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 100%
  ) !important;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.05) !important;
  border-radius: 4px !important;
}
.mall-home .productItem {
  background: #fafafa !important;
}
</style>

