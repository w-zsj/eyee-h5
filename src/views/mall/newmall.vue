<template>
  <keep-alive>
    <div class="new-mall glo-color">
      <div v-if="hasdata">
        <!-- 顶部 -->
        <div class="header">
          <div class="_fix" :class="{ sticky: sticky }" ref="sticky">
            <!-- 搜索 -->
            <div class="search flex-aic-btwn">
              <router-link to="/nesearch" class="flex-aic" style="display: block; width: 100%">
                <div class="sch flex-aic">
                  <img src="https://files.eyee.com/c2cxcx/img/icon_search.png" alt />
                  <span>{{ hotword }}</span>
                </div>
              </router-link>
              <router-link to="/classify">
                <div class="classify flex-col flex-center">
                  <div class="icon"></div>
                  <span>分类</span>
                </div>
              </router-link>
              <!-- 抽奖图 -->
              <!-- <div
              class="lotter flex-aic"
              @click="gotoLotter(activitypic.activityid)"
              v-if="activitypic.activityid"
            >
              <div class="tit flex-col">
                <span>今日抽奖</span>
                <span class="title ellipsis" style="max-width:100px;">{{activitypic.productname}}</span>
              </div>
              <img :src="activitypic.image" alt />
              </div>-->
            </div>
            <!-- 频道推荐 -->
            <div class="tabs" v-if="tabs.length">
              <swiper :options="tabopt" class="mh-carousel" ref="tabswiper">
                <swiper-slide v-for="(item, index) in tabs" :key="'tabs' + index" class="flex-center">
                  <div @click="tabCategory(index, item)" :style="{ marginLeft: index == 0 ? '-4.8vw' : '' }">
                    <span :class="{ act: curtabs == index }">{{
                      item.channelname
                    }}</span>
                  </div>
                </swiper-slide>
              </swiper>
            </div>
          </div>
          <!-- 轮播 -->
          <div class="banner" v-if="banner.length" :style="bg">
            <div class="stack-wrapper" v-if="clicktype == 3 && someList.length > 1">
              <stack :pages="someList" :stackinit="stackinit" @currentPage="currentPage"></stack>
            </div>
            <swiper :options="banneropt" v-else>
              <swiper-slide v-for="(item, idx) in banner" :key="idx">
                <div class="flex-col activity-status" @click="adGg(item)">
                  <img :src="item.url" alt />
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
        <div class="point flex-center" v-if="banner.length">
          <mt-progress :value="banprogress" :bar-height="4"></mt-progress>
        </div>
        <!-- 宫格 -->
        <div class="gg-list">
          <div v-for="(item, index) in grids" :key="'enters' + index" class="list">
            <!-- 特殊类型宫格 -->
            <div class="gg-flash" v-if="item.type == 1">
              <swiper :options="ggOpt">
                <swiper-slide v-for="(sitem, index) in item.gridlist" :key="'special' + index">
                  <img :src="sitem.bottompic" :alt="item.title" @click="adGg(sitem)" />
                </swiper-slide>
              </swiper>
            </div>
            <div class="flex" v-else>
              <img :src="items.bottompic" v-for="(items, indx) in item.gridlist" :key="'enters' + indx" :style="{ width: items.w + 'px', height: items.h + 'px' }" @click="adGg(items)" />
            </div>
          </div>
        </div>

        <!-- 榜单 -->
        <div class="ranking" v-if="rank.refreshtime" @click="goapp">
          <div class="tit flex-center">最新动向 {{ rank.refreshtime }}</div>
          <div class="flex-aic-btwn">
            <div class="list" v-for="(item, index) in rank.list" :key="'b' + index">
              <div v-for="(subitem, subindex) in item.subitem" :key="subindex">
                <div class="item first" v-if="subindex == 0">
                  <div class="pic">
                    <img :src="subitem.imgurl" />
                  </div>
                  <div class="price flex-aic-btwn">
                    <span class="num">NO.{{ subindex + 1 }}</span>
                    <div class="money">
                      <span class="txt">成交价</span>
                      ¥ {{ subitem.averageprice }}
                    </div>
                  </div>
                </div>
                <div class="item flex-aic-btwn" v-else>
                  <div class="price flex-col">
                    <span class="num">NO.{{ subindex + 1 }}</span>
                    <span class="money">¥ {{ subitem.averageprice }}</span>
                  </div>
                  <div class="pic">
                    <img :src="subitem.imgurl" />
                  </div>
                </div>
              </div>
              <div class="_btn flex-center" :class="index == 1 ? 'salelist' : index == 2 ? 'falllist' : ''">
                {{ item.txt }}
              </div>
            </div>
          </div>
        </div>
        <!-- 商品列表 -->
        <div class="box">
          <v-list :load-handle="() => {}" :more-handle="rcdloadmore" :more-handling="loading" :isend="isend">
            <div class="flex-btwn flex-wrap">
              <template v-for="(iRcd, rcdIdx) in list">
                <div v-if="!iRcd.showtype" :key="'rcd' + rcdIdx" class="items">
                  <product-unit :product-item="iRcd" :home="true" :homeLocation="rcdIdx" :product-type="20"></product-unit>
                </div>
                <div :key="rcdIdx" v-else-if="iRcd.showtype > 0" class="cate-enters flex-col flex-btwn" :class="{ one: !iRcd.list }" @click="goCate(tab, iRcd)">
                  <div class="flex-wrap small-list" v-if="iRcd.list">
                    <div v-for="(ci, cIdx) in iRcd.list.slice(0, 4)" :key="cIdx" class="cate-enter" @click.stop="goCateSearch(ci, iRcd)">
                      <img v-lazy="
                          https(
                            ci.imgurl && ci.imgurl != 'null'
                              ? ci.imgurl
                              : '/static/logo.png'
                          )
                        " alt />
                      <p class="ellipsis">{{ ci.name }}</p>
                    </div>
                  </div>
                  <div class="flex-wrap imgBox">
                    <div @click.stop="goCateSearch('', iRcd)" v-if="!iRcd.list">
                      <img v-lazy="
                          https(
                            iRcd.img && iRcd.img != 'null'
                              ? iRcd.img
                              : '/static/logo.png'
                          )
                        " alt />
                    </div>
                    <div class="ca-btn flex-center ellipsis">
                      <span>{{ iRcd.title }}</span>
                    </div>
                  </div>
                  <div class="cate-go">
                    <p class="vicetitle flex-center">{{ iRcd.vicetitle0 }}</p>
                    <p class="vicetitle mb flex-center" v-if="iRcd.vicetitle1">
                      {{ iRcd.vicetitle1 }}
                    </p>
                  </div>
                </div>
              </template>
            </div>
          </v-list>
          <p v-if="list.length == 0" class="flex-center" style="margin: 20px 0">
            未能筛选到相关数据
          </p>
        </div>

        <!-- 新人大礼包弹框 -->
        <div class="new-peosole" v-if="!isreceive">
          <div class="cont">
            <div class="close" @click="closeModal"></div>
            <div class="img">
              <!-- {{newergiftpacks.imageurl}} -->
              <img src="https://files.eyee.com/c2cxcx/img/new-money.png" />
            </div>
            <div class="new_btn flex-center" @click="closeModal('get')">
              立即领取
            </div>
          </div>
        </div>
      </div>
    </div>
  </keep-alive>
</template>
<script>
import { Gettoplist } from "@/utils/api/search.js";
import {
  homeTabList,
  homeBannerGg,
  activity,
  productList,
  bigdataRank,
} from "@/utils/api/mall.js";
import { IsReceive } from "@/common/api/base.js";
import { guessWhatYouLike } from "@/common/api/product.js";
import { IndexRecommend } from "@/common/api/sneaker.js";
import { Progress } from "mint-ui";
import { GridLinkType, CarouselLinkType } from "@/utils/enum";
import ProductUnit from "@/components/templates/ProductUnit";
import stack from "@/components/stack";
import { mapGetters } from "vuex";
export default {
  components: { Progress, ProductUnit, stack },
  data() {
    return {
      hasdata: 0,
      someList: [],
      stackinit: {
        visible: 3,
      },
      hotword: "search",
      activitypic: {},
      tabs: [], // 频道列表
      tabopt: {
        spaceBetween: 0,
        slidesPerView: 4.5,
      },
      curtabs: 0,
      clicktype: 1,
      sticky: false,
      hometabid: "",
      banner: [],
      bannerindex: 0,
      backBg: "#191919",
      bg: {
        background: "",
      },
      banprogress: 0,
      banneropt: {
        // autoplay: 3000,
        loop: true,
        spaceBetween: 10,
        slidesPerView: 1.1,
        onTouchMove: (swiper) => {
          let i = swiper.activeIndex;
          if (i == this.banner.length) i = 0;
          this.bg[
            "background"
          ] = `linear-gradient(180deg,${this.banner[i]["color"]},${this.backBg} )`;
          //   console.log("swiper", this.bg);s
        },
        onSlideChangeStart: (s) => {
          this.bannerChange(s.realIndex);
        },
      },
      grids: [],
      ggOpt: {
        spaceBetween: 10,
        slidesPerView: 1.6,
      },
      rank: [],
      list: [],
      loading: false,
      isend: false,
      page: 1,

      isreceive: false, //#int 0.未领取 1. 已领取
      newergiftpacks: "",
      newpath: "",
    };
  },
  computed: {
    tabswiper() {
      return this.$refs.tabswiper.swiper;
    },
    prodSwiper() {
      return this.$refs.hbSwiper.swiper;
    },
    ...mapGetters({
      baseValue: "baseValue",
    }),
  },
  mounted() {
    this.gethotword();
    this.getTabs();
    this.getActivityPic();
    // 开启滚动监听
    window.addEventListener("scroll", this.hscroll);

    // 判断用户是否领取新人大礼包
    try {
      let isget = window.sessionStorage.getItem("isGetGift");
      if (isget) {
        this.isreceive = true;
        return;
      }
      IsReceive()
        .then((res) => {
          console.log("判断用户是否领取新人大礼包", res);
          this.isreceive = res.isreceive;
          this.newpath = res.url;
          window.sessionStorage.setItem("isGetGift", 1);
          setTimeout(() => {
            this.newergiftpacks = JSON.parse(
              this.baseValue.configs.newergiftpacks
            );
          }, 50);

          console.log("获取基本配置信息", this.newergiftpacks);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (e) {}
  },
  methods: {
    closeModal(type) {
      this.isreceive = true;
      window.sessionStorage.setItem("isGetGift", 1);
      if (type == "get") this.$router.push("/activity/newrecommend");
    },
    getBigdataRank() {
      let _ = this;
      bigdataRank()
        .then((res) => {
          console.log("斗牛榜单--->", res);
          if (res && res.refreshtime) {
            let rank = {
              refreshtime: res.refreshtime,
              list: [
                { subitem: res.riselist, txt: "涨价榜" },
                { subitem: res.salelist, txt: "销量榜" },
                { subitem: res.falllist, txt: "降价榜" },
              ],
            };
            _.rank = rank;
          }
        })
        .catch((e) => {
          console.error(e);
        });
    },
    async gethotword() {
      let word = await Gettoplist();
      if (word && word.length) this.hotword = word[0]["keyword"];
      //   console.log("word", word);
    },
    async getActivityPic() {
      this.activitypic = await activity();
      console.log("抽奖图片", this.activitypic);
    },
    //
    gotoLotter(id) {
      this.$router.push("drawLottery/lottery");
    },
    getTabs() {
      let _ = this;
      homeTabList().then((res) => {
        console.log("tabs--", res);
        _.tabs = res;
        if (_.tabs && _.tabs[0]) {
          _.hometabid = _.tabs[0]["hometabid"];
          _.getBanner();
          // _.getBigdataRank();
          _.getRecommend();
        }
      });
    },
    tabCategory(index, item) {
      let _ = this;
      // if (_.clicktype == item.type) return;
      _.clicktype = item.type;

      _.curtabs = index;
      _.hometabid = item.hometabid;
      _.loading = false;
      _.isend = false;
      _.page = 1;
      _.getRecommend();
      _.getBanner();
      // if (_.clicktype == 1) _.getBigdataRank();
      // else _.rank = {};
    },
    getBanner() {
      let _ = this;
      homeBannerGg(_.hometabid)
        .then((res) => {
          _.hasdata = 1;
          if (res.grids && res.grids.length) {
            let sW = window.screen.width;
            _.grids = res.grids;
            _.grids = (res.grids || []).map((item) => {
              item.gridlist = item.gridlist.map((i) => {
                i.w = (sW * i.percent) / 100;
                i.h = Math.round((i.w / i.width) * i.hight);
                delete i.percent;
                delete i.width;
                delete i.hight;
                return i;
              });
              return item;
            });
            console.log("gg-list", _.grids);
          } else _.grids = [];
          if (res.banners && res.banners.length) {
            if (res.banners[0]["color"]) {
              _.backBg = res.banners[0]["color"];
              _.bg["background"] = res.banners[0]["color"];
            }

            _.banner = res.banners;
            _.banprogress = (1 / res.banners.length) * 100;
            if (_.clicktype == 3) {
              _.banner.forEach((item, index) => {
                _.someList[index] = {
                  html: `<img src="${item.url}" alt="0${index + 1}">`,
                };
              });
            }
          } else _.banner = [];
          console.log("banner-->>", _.banner, _.someList);
        })
        .catch((e) => {
          _.hasdata = 0;
        });
    },
    currentPage(page) {
      // console.log("page--", page);
      this.bannerChange(page);
    },
    bannerChange(index) {
      this.bannerindex = index;
      //   console.log("index--", index);
      if (this.banner[index]["color"])
        this.backBg = this.banner[index]["color"];
      this.banprogress = ((index + 1) / this.banner.length) * 100;
      this.bg["background"] = this.banner[index]["color"];
    },
    rcdloadmore() {
      let _ = this;
      if (_.loading) return;
      if (_.isend) _.toast("已无更多");
      else if (_.list.length) {
        _.page++;
        setTimeout(() => {
          _.getRecommend();
        }, 50);
      }
    },
    getRecommend() {
      let _ = this,
        pageindex = _.page;
      _.loading = true;
      let type = _.clicktype;
      let api =
        type == 1 ? guessWhatYouLike : type == 2 ? IndexRecommend : productList;
      let page = { page: pageindex };
      if (type == 1) page = { pageindex };

      api({ ...page, hometabid: _.hometabid })
        .then((res) => {
          if (pageindex === 1) _.list = res.list;
          else _.list = _.list.concat(res.list);
          if (_.list && _.list.length) {
            res.list = res.list.map((i) => {
              i.paynumber = i.paynumber || i.sumcount;
              i.name = i.name || i.productname;
              i.mainpic = (i.mainpic || i.imageurl || i.img) + "|";
              i.saleprice = i.saleprice || i.price;
              i.id = i.id || i.productid;
              if (type == 2) i.isc2c = 1;
              // 处理 showtype>0 时 vicetitle
              if (i.showtype > 0 && i.vicetitle) {
                i.vicetitle0 = i.vicetitle.split(",")[0];
                i.vicetitle1 = i.vicetitle.split(",")[1];
              }
              return i;
            });

            _.isend =
              res.pageindex * res.pagesize >= res.sumcount && _.list.length > 0;
          } else _.isend = true;
          _.loading = false;
          console.log("list", _.list);
        })
        .catch((e) => {
          _.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
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
          link = link || item.url;
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

        case GridLinkType.trendGoods: //潮流店铺 潮流好物
          path = `/trendGoods`;
          break;
        case GridLinkType.cutgetcoupon: //抽抽乐
          if (item.link == "gh_038ca9308eac") path = `/activity/luckDraw`;
          break;
        case GridLinkType.classification: //分类
          path = `/classify`;
          break;
        default:
          loadapp = true;
          break;
      }
      console.log("loadapp--", loadapp);
      if (loadapp) {
        _.openAppClient();
      } else {
        // console.log("path--",path);
        if (path) _.$router.push(path);
        else window.location.href = link;
      }
    },
    goapp() {
      this.openAppClient();
    },
    goCateSearch(ci, item) {
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
        obj.link = item.contentid || item.productid;
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
        obj.link = item.contentid || item.productid;

      this.adGg(obj);
    },
    hscroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      var winHeight = window.screen.height;

      if (scrollTop > 5) {
        this.sticky = true;
      } else this.sticky = false;
      // console.log("scrollTop", scrollTop, this.sticky);
    },
  },
  destroyed() {
    window.removeEventListener("scroll", this.hscroll);
  },
};
</script>
<style>
.mt-progress-runway {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}
.mt-progress-progress {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}
.mt-progress {
  width: 26.666vw;
  margin: 3.2vw 0 4vw 0;
  height: auto;
}
.stack-wrapper {
  margin: 0 auto;
  position: relative;
  z-index: 1;
  width: 92vw;
  height: 122.66vw;
  padding: 0;
  list-style: none;
  pointer-events: none;
}
</style>
<style scoped lang='scss'>
.new-mall {
  //   background: #191919;
  padding-bottom: 32vw;
  font-size: 12px;
  min-height: 100vh;
  overflow: hidden;
  .header {
    overflow: hidden;
    ._fix {
      // padding: 0 0.4vw;
      background: #fff;
      overflow: hidden;
    }
    .sticky {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 3;
    }
    .search {
      margin: 4px 4vw;
      font-size: 3.733vw;
      color: #969696;
      .classify {
        margin-left: 4vw;
        .icon {
          width: 5.866vw;
          height: 5.866vw;
          margin: 0;
          padding: 0;
          background: url("https://files.eyee.com/c2cxcx/img/icon_classify.png")
            0 0 no-repeat;
          background-size: 100% 100%;
        }

        span {
          font-size: 12px;
          transform: scale(0.8333);
          white-space: nowrap;
        }
      }
      img {
        width: 5.33vw;
        height: 5.33vw;
        margin: 0 2.133vw 0 3.2vw;
      }
      .sch {
        background: #f5f5f5;
        border: 1px solid #e6e6e6;
        border-radius: 4.8vw;
        flex: 1;
        height: 9.6vw;
      }

      .lotter {
        // flex: 1;
        font-size: 3.2vw;
        font-weight: 600;
        color: #232323;
        span {
          text-align: right;
          &.title {
            transform: scale(0.83333);
            color: #646464;
          }
        }

        img {
          width: 7.466vw;
          height: 7.466vw;
          margin-left: 1.33vw;
          border-radius: 50%;
          border: 1px solid #e6e6e6;
        }
      }
    }

    .tabs {
      height: 11.733vw;
      .mh-carousel {
        height: 11.733vw;
        font-size: 4.266vw;
        color: #646464;
        font-weight: 400;
        line-height: 5.866vw;
        .act {
          font-weight: 600;
          color: #232323;
          position: relative;
          &::before {
            content: "";
            width: 3.2vw;
            height: 1.066vw;
            border-radius: 2px;
            background: #232323;
            position: absolute;
            left: 50%;
            bottom: -2.4vw;
            transform: translateX(-50%);
          }
        }
      }
    }
  }
  .point {
    // height: 10.066vw;
    overflow: hidden;
    margin-bottom: 2px;
  }
  .gg-list {
    img {
      display: block;
    }
  }

  .ranking {
    padding: 0 4vw;
    overflow: hidden;
    .tit {
      font-size: 14px;
      font-weight: 400;
      color: #969696;
      margin: 4.266vw 0 2.66vw 0;
    }
    .list {
      background: #fff;
      border-radius: 4.8vw;
      padding: 2.1333vw;
      overflow: hidden;
      .item {
        width: 24.8vw;
        margin-bottom: 5.333vw;
        .price {
          .num {
            font-family: IMPACT;
            font-weight: 700;
            color: #646464;
            font-size: 12px;
          }
          .money {
            font-size: 2.66vw;
            font-family: IMPACT;
            font-weight: 700;
            text-align: justify;
            color: #232323;
            white-space: nowrap;
            .txt {
              color: #646464;
              font-size: 2.66vw;
            }
          }
        }
        .pic {
          position: relative;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          overflow: hidden;
          width: 14.66vw;
          height: 11.2vw;
          &::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index: 2;
            background: rgba(0, 0, 0, 0.05);
          }
          img {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index: 1;
          }
        }
        &.first {
          .pic {
            height: 0;
            padding-top: 100%;
            width: 100%;
            margin-bottom: 4.8vw;
          }
        }
      }
      ._btn {
        width: 100%;
        height: 8vw;
        background: linear-gradient(0deg, #9e414e, #e08c8c);
        border-radius: 4vw;
        color: #fff;
        font-size: 4.266vw;
        font-weight: bold;
        &.salelist {
          background: linear-gradient(180deg, #879bb9, #46557d);
        }
        &.falllist {
          background: linear-gradient(0deg, #22515b 1%, #739fa4 99%);
        }
      }
    }
  }

  .box {
    margin: 5.333vw 4vw 0;
    background: #fff;
    border-radius: 4.8vw 4.8vw 0px 0px;
    padding: 4.266vw 2.66vw;
    .items {
      width: 41.866vw;
      font-size: 12px;

      margin-bottom: 5.33vw;
      /deep/ .product_img {
        border-radius: 1.6vw;
        overflow: hidden;
      }
      /deep/ .productItem {
        .info_box {
          .sale-count {
            margin-bottom: 0;
          }
        }
      }
    }
    .cate-go img {
      /* height: 34px; */
      margin: 18px 0;
    }
    .cate-go p {
      font-size: 16px;
      font-weight: 600;
      color: #232323;
    }
    .cate-go p.vicetitle {
      color: #969696;
      font-weight: 600;
      font-size: 14px;
    }

    .cate-enters {
      width: 41.866vw;
      // margin: 5px;
      padding: 0;
      border-radius: 3.2vw;
      overflow: hidden;
      margin-bottom: 6.5vw;
    }
    .cate-enter {
      width: 50%;
      min-height: 80px;
      padding: 5px;
      img {
        border-radius: 4px;
      }
    }
    .imgBox {
      position: relative;
      margin-bottom: 8vw;
      // height: 0;
      // padding-bottom: 100%;
      &::after {
        content: "";
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 1.6vw 1.6vw 0px 0px;
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 8px;
        z-index: 1;
      }
    }
    .imgBox .ca-btn {
      position: absolute;
      width: 32vw;
      white-space: nowrap;
      display: inline-block;
      line-height: 9.6vw;
      height: 9.6vw;
      font-size: 4.533vw;
      font-weight: 500;
      border-radius: 4.8vw;
      text-align: center;
      background: #fff;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      bottom: -4.8vw;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
    }
    .small-list {
      position: relative;
      // padding-bottom: 8vw;
      height: 41.866vw;
      overflow: hidden;
      border-radius: 2.133vw;
      &::after {
        content: "";
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 1.6vw 1.6vw 0px 0px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    .imgBox .ca-btn span {
      color: #232323;
      font-size: 17px;
    }
  }
}

.new-peosole {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
  .cont {
    position: absolute;
    left: 8vw;
    right: 8vw;
    top: 50vw;
    .close {
      width: 8.533vw;
      height: 8.533vw;
      background: url("https://files.eyee.com/c2cxcx/img/new_icon_close.png") 0
        0 no-repeat;
      background-size: 100% 100%;
      margin-bottom: 2.66vw;
      float: right;
    }
    .new_btn {
      width: 42.66vw;
      height: 12.266vw;
      background: url("https://files.eyee.com/c2cxcx/img/new_btn_bg.png") 0 0
        no-repeat;
      background-size: 100% 100%;
      margin: 10.66vw auto 0;
      font-size: 4.8vw;
      color: #000;
      font-weight: bold;
    }
  }
}
</style>