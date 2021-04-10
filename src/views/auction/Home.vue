<template>
  <div class="waiting-home" v-if="hasdata == 2"></div>
  <div class="auction-home" v-else-if="hasdata">
    <mt-loadmore
      top-pull-span="下拉刷新"
      top-drop-span="释放加载"
      top-loading-span
      :top-distance="50"
      :top-method="pageload"
      ref="loadmore"
    >
      <div class="home-head">
        <carousel
          class="imgs"
          center-mode
          :per-page="1"
          :paginationEnabled="false"
          :autoplayTimeout="3500"
          :autoplayHoverPause="false"
          :navigate-to="someLocalProperty"
          @page-change="_pageChange"
          v-if="mallbanner&&mallbanner.length"
        >
          <slide
            v-for="(img,iIdx) in mallbanner"
            :key="'img'+iIdx"
            @slideclick="bannerGoTo(img.url)"
          >
            <img v-lazy="img.imageurl" alt />
          </slide>
        </carousel>
        <p class="acn acn-apply" @click.stop="acnApply">合作卖家申请</p>
      </div>
      <!-- 轮播图spot点 -->
      <div class="carousel_spotWrapper">
        <div class="carousel_spot">
          <div :style="{ width: currentwidth + 'vw' }" class="item act"></div>
        </div>
        <div class="carousel_spot position">
          <div
            class="itempos"
            @click="_pageChange(index - 1)"
            v-for="index in mallbanner.length"
            :key="'spot' + index"
          ></div>
        </div>
      </div>
      <!-- 推荐列表 -->
      <div class="acn-rcd" v-if="rcd.length > 0">
        <div class="acn-rcd-title">
          今日推荐
        </div>
        <div class="card-container">
          <carousel
            class="ad-imgs"
            center-mode
            :per-page="rcd.length>1?1.137:1"
            @page-change="pageChange"
          >
            <slide v-for="(ri, ridx) in rcd" :key="ridx+'ad'">
              <auc-save-cell
                :info="ri"
                :loged="loged"
                @click="handleLog(ri.auctiongoodid, 1)"
                @sencedeal="sencedeal"
                @recdsave="recdsave"
              ></auc-save-cell>
            </slide>
          </carousel>
        </div>
      </div>
      <ul class="acn-tabs" :class="[{'acn-tabs-around':scenes.length <= 4}]" ref="sticky">
        <li
          v-for="si in scenes"
          :key="si.sceneid"
          @click="toggleTab(si)"
          :class="{ act: si.sceneid==actScence }"
        >{{ si.title }}</li>
      </ul>
      <v-loadlist
        :more-handle="loadmore"
        :more-handling="loading"
        :isend="isend"
        hidebtm
        v-if="list.length > 0"
      >
        <div class="acn-list">
          <template v-for="(item, idx) in list">
            <auction-cell
              :key="'sg' + idx + item.auctiongoodid"
              :info="item"
              dbline
              :loged="loged"
              data-type="0"
              @click="handleLog(item.auctiongoodid, 0)"
              @recdsave="recdsave"
              @updatecounttime="updatecounttime"
            ></auction-cell>
          </template>
        </div>
      </v-loadlist>
      <p v-else class="none-data"></p>
    </mt-loadmore>
    <!-- 分享图 -->
    <div class="share-img" @click="handle('callShare')">
      <!-- <img v-if="info.shareurl" class="home-head-envelope" v-lazy="info.shareurl" alt />
        <div class="go" v-if="info.shareurl">
          <img src="https://files.eyee.com/mcdn/img/auc/u/go.png?c=1" />
      </div>-->
      <img v-lazy="'https://files.eyee.com/mcdn/img/auction/red_envelope.png'" />
    </div>
    <ul
      class="acn-tabs"
      :class="[{'acn-tabs-around':scenes.length <= 4},{'sticky':sticky}]"
      v-if="sticky"
    >
      <li
        v-for="si in scenes"
        :key="si.sceneid"
        @click="toggleTab(si)"
        :class="{ act: si.sceneid==actScence }"
      >{{ si.title }}</li>
    </ul>
    <!-- <div class="acn-enter flex-col flex-center" @click="tojoined">
      <span>我参</span>
      <span>与的</span>
    </div>-->

    <!-- 底部tab -->

    <div class="footer-tab" :class="{'Inipx':getIsIphonex}">
      <AuctionFooter></AuctionFooter>
      <!-- <div class="flex flex-center _tabs">
        <div
          class="send flex flex-center"
          @click="gotoAppProductPage"
          :class="isshowsellbtn&&!iscooperativeseller?'':'gray'"
        >立即发布</div>
        <div class="myjoin flex flex-center" @click="tojoined">我参与的</div>
      </div>-->
    </div>
    <!-- <div class="foot-logo">
      <img v-lazy="$zip('https://files.eyee.com/mcdn/img/auc/logo.png',1)" alt />
    </div>-->
    <!-- 回到顶部 -->
    <scroll-top>
      <template #url></template>
    </scroll-top>
    <auction-modal :type="modalType" :info="modalTemp" @close="modalClose"></auction-modal>
  </div>
  <div class="none-data" v-else></div>
</template>
<script>
import { mapGetters } from "vuex";
import vLoadlist from "./comps/vLoadlist";
import AuctionCell from "./comps/AuctionCell";
import AuctionModal from "./comps/AuctionModal";
import ScrollTop from "./comps/ScrollTop";
import AucSaveCell from "./comps/AucSaveCell";
import AuctionFooter from "./comps/AuctionFooter";
import { Carousel, Slide } from "vue-carousel";
import {
  AuctionInfo,
  SceneGoods,
  Recommends,
  AuctionExtInfo,
  GetIsauctions,
  Cooperativeseller,
  MallBanners
} from "@/utils/api/auction";

const moveTab = () => {
  try {
    let $scene = document.querySelector(".acn-tabs"),
      $actScene = document.querySelector(".acn-tabs .act");
    let $sticky = document.querySelector(".sticky"),
      $actsticky = document.querySelector(".sticky .act");
    $scene.scrollLeft = $actScene.offsetLeft - 10;
    $sticky.scrollLeft = $actsticky.offsetLeft - 10;
    $scene.scrollTo({
      left: $actScene.offsetLeft - 10,
      behavior: "smooth"
    });
  } catch (e) {}
};

let auctionid,
  actSceneid,
  share,
  localPage = 1,
  _loader,
  shareInfo = {};
export default {
  name: "AuctionHome",
  components: {
    AuctionCell,
    AuctionModal,
    AucSaveCell,
    ScrollTop,
    Carousel,
    Slide,
    AuctionFooter,
    vLoadlist
  },
  data() {
    return {
      hasdata: 2,

      info: {},
      scenes: {},

      rcd: [],
      isFixed: false,
      loading: true,
      // isend: false,
      // list: [],

      modalType: 0, // 0 不显示，1 出价成功，2 截拍倒计时，3 竞拍成功，4 红包，5 分享

      redpacket: 0,
      needinvations: 0,
      remaininvations: 0,
      order: {},
      poster: {},

      eq: 1,
      sticky: false,

      isshowsellbtn: false, // 活动是否存在
      iscooperativeseller: 0, // 是否合作卖家 0-否 1-是"

      mallbanner: [],
      someLocalProperty: 0,
      isover: false
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo",
      // rcd: "homeRcds",
      actScence: "actScenceId",
      list: "sceneList",
      page: "scenePage",
      isend: "sceneEnd"
    }),
    loged() {
      return !!(this.user && this.user.uid);
    },
    modalTemp() {
      let {
        redpacket,
        needinvations,
        remaininvations,
        order,
        poster,
        isused
      } = this;
      return {
        auctionid,
        redpacket,
        isused,
        needinvations,
        remaininvations,
        ...(order || {}),
        ...(poster || {})
      };
    },
    // ISIOS 判断是否是iphonX手机
    getIsIphonex() {
      if (this.$root.ISIOS) {
        if (
          (screen.height == 812 && screen.width == 375) ||
          (screen.width === 414 && screen.height === 896)
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    currentwidth() {
      const width = 26.7,
        count = this.mallbanner.length,
        currentWidth = width / count;
      let dotalWidth = currentWidth * (this.someLocalProperty + 1);
      return dotalWidth || 0;
    },
  },
  mounted() {
    let _ = this;
    auctionid = _.$route.params.id;
    if (_.$root.loging) {
      _.$root.loging
        .then($ => {
          // 已登录
          _.getInfo();
        })
        .catch(e => {
          console.error("query prams auto login error:", e);
          _.getInfo();
        });
    } else {
      // 未登录
      _.getInfo();
    }

    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json).then(res => {
          _.getInfo();
        });
      } else _.toast("登录失败~");
    };
    window._shareCallBack = function() {};

    // _.setShare();

    // 开启滚动监听
    window.addEventListener("scroll", this.hscroll);
    _.setToolBar({ title: "斗牛拍卖", bgcolor: "#191919", textcolor: "#FFFFFF" });
  },
  destroyed() {
    window.removeEventListener("scroll", this.hscroll);
  },
  methods: {
    _pageChange(index) {
      this.someLocalProperty = index;
    },
    pageload(event) {
      this.$refs.loadmore.onTopLoaded();
      this.getInfo();
    },
    // gotoAppProductPage() {
    //   console.log("是否是合作商家", this.iscooperativeseller);
    //   if (!this.isshowsellbtn) {
    //     this.toast("暂无拍卖活动");
    //     return;
    //   }
    //   this.checkLogin(() => {
    //     if (this.isshowsellbtn && !this.iscooperativeseller) {
    //       if (this.$root.ISAPP) {
    //         this.javascriptBridge({
    //           name: "gotoAppSearchAuctionProductPage",
    //           params: {}
    //         });
    //       }
    //     }
    //   });
    // },
    pageChange(num) {
      this.eq = num + 1;
      let sw = document.body.clientWidth,
        p = (15 / 375) * sw,
        b = (sw - p) / 1.13;
      this.$nextTick(() => {
        document.querySelector(
          ".card-container .VueCarousel-inner"
        ).style.transform = `translate(-${b * num}px, 0)`;
      });
    },
    // GetIsIcon() {
    //   GetIsauctions()
    //     .then(res => {
    //       this.isshowsellbtn = res.isauction || 0;
    //     })
    //     .catch(e => {
    //       console.error("IsSshowBtn Error", e);
    //       this.isshowsellbtn = 0;
    //     });
    // },
    // iscopsell() {
    //   let _ = this;
    //   Cooperativeseller()
    //     .then(res => {
    //       _.iscooperativeseller = res.iscooperativeseller || 0;
    //     })
    //     .catch(e => {
    //       console.error("判断是否是合作卖家 ERROR", e);
    //     });
    // },
    // 滚动监听 滚动触发的效果写在这里
    hscroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      var winHeight = window.screen.height;
      if (scrollTop > this.stop) {
        this.sticky = true;
        moveTab();
      } else this.sticky = false;
      // console.log("scrollTop", scrollTop, this.stop);
    },
    topBanner() {
      MallBanners().then(res => {
        if (res && res.length) this.mallbanner = res;
      });
    },
    bannerGoTo(url) {
      if (/.*?.eyee\.com\/active\//i.test(url)) {
        url = "/active/" + url.split("/active/")[1];
         console.log("url----", url);
        this.$router.push(url);
      }
    },
    getInfo() {
      let _ = this;
      AuctionInfo(auctionid)
        .then(res => {
          console.log("AuctionInfo res:", res);
          if (res) {
            share = res.share;
            _.info = {
              name: res.name,
              banner: res.banner,
              rule: res.rule,
              shareurl: res.shareurl
            };

            _.scenes = res.scenes;
            if (_.actScence) {
              _.loading = false;
              actSceneid = _.actSceneid;
              _.reload();
            } else {
              let act = res.scenes.find(i => i.active);
              actSceneid = act.sceneid;
              _.toggleTab(act);
            }

            _.$nextTick(() => {
              setTimeout(() => {
                moveTab();
                _.stop = _.$refs.sticky.offsetTop;
              }, 500);
            });

            // _.scenes = res.scenes.map(i => {
            //   if (i.active) actSceneid = i.sceneid;
            //   return i;
            // });

            // _.reload();

            _.hasdata = 1;
          } else _.hasdata = 0;

          if (_.loged) {
            _.getExtInfo();
            // _.iscopsell();
          }
          _.getRcd();
          _.topBanner();
          // _.GetIsIcon();
        })
        .catch(e => {
          console.error("AuctionInfo error: ", e);
          _.toast("加载失败~");
          _.hasdata = 0;
        });
    },
    getRcd() {
      let _ = this;
      let userid = _.user.uid || "";
      Recommends({ auctionid, userid })
        .then(res => {
          console.log("Recommends res:", res);
          _.rcd = res;
        })
        .catch(e => {
          console.error("Recommends error: ", e);
        });
      // if (!(rcd && rcd.length > 0)) _.$store.dispatch("setHomeRcds", auctionid);
    },
    reload(act) {
      // if (localPage > 1) window.scrollTo(0, 0);
      if (act) this.isover = true;
      localPage = 1;
      // this.list = [];
      actSceneid = this.actScence;
      this.load();
    },
    loadmore() {
      let _ = this,
        { isend, load, page } = _;
      if (isend) return;
      localPage = page + 1;
      actSceneid = this.actScence;
      load();
    },
    load() {
      let _ = this,
        { loged } = _,
        payload = { page: localPage, isend: false, list: [] };

      _.loading = true;
      SceneGoods({ loged, auctionid, sceneid: actSceneid, page: localPage })
        .then(res => {
          console.log("SceneGoods res: ", res);
          this.isover = false;
          if (res.list && res.list.length > 0) {
            if (localPage === 1) payload.list = res.list;
            else payload.list = _.list.concat(res.list);
            payload.isend = res.total == payload.list.length;
            // payload.isend =
            //   res.page * res.size >= res.total && payload.list.length > 0;
          } else if (localPage === 1) payload.list = [];
          _.$store.commit("scenePageLoad", payload);

          moveTab();

          _.loading = false;
        })
        .catch(e => {
          console.error("SceneGoods error: ", e);
          _.loading = false;
          _.toast("加载失败~");
          // if (page === 1) _.list = [];
          if (localPage === 1) payload.list = [];
          _.$store.commit("scenePageLoad", payload);
        });
    },
    getExtInfo() {
      let _ = this;
      AuctionExtInfo({ auctionid })
        .then(res => {
          console.log("getExtInfo res: ", res);
          let {
            order,
            needinvations,
            remaininvations,
            redpacket,
            isused,
            redamountmin,
            redamountmax,
            share,
            poster
          } = res || {};
          _.order = order;
          _.redpacket = redpacket;
          _.isused = isused;
          _.needinvations = needinvations;
          _.remaininvations = remaininvations;

          poster.min = redamountmin || 0;
          poster.max = redamountmax || 0;

          poster.nickname = _.user.username;
          poster.avatar = _.user.imageurl;
          poster.initbid = 0;
          _.poster = poster;

          if (order && order.auctiongoodid) _.modalType = 3;
          // 暂时不弹红包
          // else if (redpacket > 0) _.modalType = 4;
          // 设置分享信息
          shareInfo = {
            sharecontent: share.content,
            sharepicurl: share.icon,
            shareurl: share.url,
            sharetitle: share.title,
            xcxurl: share.xcxurl,
            xcxicon: share.xcxicon,
            xcxid: share.xcxid,
            callbackname: "_shareCallBack"
          };
          // _.setShare();
        })
        .catch(e => console.error("getExtInfo error: ", e));
    },

    handle(action) {
      if (!action) return;
      let _ = this;
      console.log("handle", action);
      switch (action) {
        case "callShare":
          // $log({
          //   e: "click_ag_callshare",
          //   p: {
          //     auctionid
          //   }
          // });

          _.checkLogin(() => {
            _.modalType = 5;
          });
          break;
        case "callCheck":
          // $log({
          //   e: "click_ag_check",
          //   p: {
          //     type: 1,
          //     agid: _.order.auctiongoodid
          //   }
          // });
          _.checkLogin(() => {
            _.callCheckout(_.order.auctiongoodid);
            // _.javascriptBridge({
            //   name: "callAppCheckout",
            //   params: {
            //     type: 1,
            //     auctiongoodid: _.order.auctiongoodid
            //   }
            // });
          });
          break;
        default:
          _[action] && _[action]();
          break;
      }
    },
    modalClose(action, type) {
      // 0 不显示，1 出价成功，2 截拍倒计时，3 竞拍成功，4 红包，5 分享
      let _ = this;
      if (action == "doShare") {
        // $log({
        //   e: "click_ag_doshare",
        //   p: {
        //     // 0 出价成功后，1 红包弹框，2 面板分享好友，3 面板海报
        //     type: type == 4 ? 1 : 2,
        //     auctionid
        //   }
        // });
      }
      console.log("modalClose", action);
      _.modalType = 0;
      if (action != "close") _.handle(action);
    },
    tojoined() {
      this.checkLogin(() => {
        this.$router.push("/auction/joined");
      });
    },
    checkLogin(call) {
      let _ = this;
      if (_.loged) call();
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
    },
    acnApply() {
      this.checkLogin(() => {
        this.$router.push("/coopseller");
      });
    },
    doShare() {
      let _ = this;
      /**
       * callAppDirectlyShare
        {
          "sharecontent":"分享内容",
          "sharepicurl":"分享图片地址",
          "shareurl":"分享链接",
          "sharetitle":"分享标题",
          "callbackname":"分享结果回调方法名",
          "xcxurl":"小程序的分享地址",
          "xcxicon":"小程序的封面图",
          "xcxid":"小程序的原始id",
          "type":"分享内容内型，1：是分享图片，2：是分享H5链接",
          "platform":"分享平台，1：是分享到朋友圈，2：是分享给微信好友"
        }
       */
      _loader = _.$loader("正在调起分享···");
      _.javascriptBridge({
        name: "callAppDirectlyShare",
        params: {
          ...shareInfo,
          type: 2,
          platform: 2
        }
      });
      setTimeout(() => {
        _loader && _loader.close();
      }, 3000);
    },
    callCheckout(auctiongoodid) {
      let _ = this,
        isLeave = false;
      auctiongoodid += "";
      _.javascriptBridge({
        name: "callAppCheckout",
        params: {
          type: 1,
          auctiongoodid
        }
      });

      document.onvisibilitychange = function() {
        if (document.visibilityState === "hidden") isLeave = true;
        else if (isLeave) location.reload();
      };
    },

    setShare() {
      if (shareInfo && shareInfo.xcxurl) {
        this.javascriptBridge({
          name: "getAppActivityShareContent",
          params: {
            ...shareInfo,
            hideshareicon: false
          }
        });
      }
    },

    toggleTab(item) {
      let _ = this,
        { scenes, reload, actScence } = _;
      if (actScence === item.sceneid) {
        _.loading = false;
        return;
      }
      actSceneid = item.sceneid;
      this.$store.commit("toggleScence", actSceneid);
      // if (item.active) return;
      // console.log("toggleTab", item);
      // scenes.forEach(i => {
      //   i.active = i.sceneid == item.sceneid;
      // });
      reload();
    },
    sencedeal(obj) {
      let _ = this,
        payload = { page: localPage, isend: _.isend, list: [] };
      payload.list = _.list;
      if (payload.list && payload.list.length) {
        payload.list = payload.list.map(i => {
          if (obj.auctiongoodid === i.auctiongoodid) i.iswant = obj.iswant;

          return i;
        });
        _.$store.commit("scenePageLoad", payload);
      }
    },
    recdsave(obj) {
      let _ = this,
        rcd = _.rcd;
      console.log("obj", obj);
      if (rcd && rcd.length) {
        rcd = rcd.map(i => {
          if (obj.auctiongoodid === i.auctiongoodid) {
            i.iswant = obj.iswant;
          }
          return i;
        });
        _.rcd = rcd;
      }
    },
    updatecounttime(val) {
      if (val == "update") {
        setTimeout(() => {
          if (this.isover) return;
          this.reload(1);
        }, 100);
      }
    },
    handleLog(agid, type) {
      // console.log("handleLog", agid, type);
      // $log({
      //   e: "click_ag_list",
      //   p: {
      //     agid,
      //     type, // 0 首页场次，1 首页推荐，2 详情推荐，3 参与列表
      //     auctionid,
      //     sceneid: actSceneid
      //   }
      // });
    }
  }
};
</script>
<style lang="scss">
body {
  background-color: #191919;
}
.home-head .VueCarousel {
  height: 100%;
}
.mint-loadmore-bottom,
.mint-loadmore-top {
  color: #232323;
}
.none-data {
  margin: 8vw auto 5.333vw;
  width: 48vw;
  height: 48vw;
  background: url("//files.eyee.com/mcdn/img/auction/image_empty.png") no-repeat 0 0;
  background-size: contain;
}
.carousel_spotWrapper {
  margin-top: 4.266vw;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
}
.carousel_spot {
  width: 26.667vw;
  height: 1.067vw;
  background: #505050;
  border-radius: 0.8vw;
  display: flex;
  &.position {
    position: absolute;
    bottom: 0;
    background: transparent;
  }
  .item {
    height: 1.067vw;
    transition: all 0.2s;
    border-radius: 0.8vw;
  }
  .item.act {
    background: #fff;
  }
}
.auction-home {
  position: relative;
  color: #fff;
  background: #191919;
  min-height: 100vh;
  -webkit-overflow-scrolling: auto;
  padding-bottom: 18.666vw;
  .home-head {
    overflow: hidden;
    position: relative;
    height: 49.87vw;
    &-banner {
      width: 100%;
    }
    .VueCarousel-dot--active {
      border-radius: 12px;
      width: 15px !important;
    }
    img {
      display: block;
      width: 100%;
    }
  }
  .share-img {
    position: fixed;
    width: 10.933vw;
    height: 12.8vw;
    bottom: 49.1333vw;
    right: 4vw;
    z-index: 15;
  }

  .acn {
    position: absolute;
    width: 25.0667vw;
    line-height: 7.2vw;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 26.74vw 0 0 26.74vw;
    font-size: 3.2vw;
    font-weight: 600;
    color: #232323;
    text-align: center;
  }

  .acn-apply {
    right: 0;
    top: 4vw;
  }

  .mint-loadmore {
    border-radius: 0;
    background: none;
    overflow: hidden;
  }

  .acn-rcd {
    padding-left: 4vw;
    &-title {
      line-height: 13.333vw;
      color: #fff;
      font-size: 4.675vw;
      font-weight: 600;

      .page {
        position: absolute;
        right: 4vw;
        bottom: 4vw;
        color: #646464;
        font-size: 12px;
      }
    }
  }

  .card-container {
    position: relative;
    height: 32vw;
   
    .ad-imgs {
      height: 32vw;
    }
    .VueCarousel-wrapper,
    .VueCarousel-inner,
    .VueCarousel-slide {
      height: 100% !important;
    }
    .VueCarousel-slide {
      position: relative;
      overflow: hidden;
      padding-right: 4vw;
      &:last-child {
        padding-right: 0;
      }
    }
    .VueCarousel-pagination {
      display: none;
    }
  }

  .acn-share {
    margin-top: 5.333vw;
  }

  .nav-top {
    background: #ffffff;
  }

  .acn-tabs {
    margin: 2.666vw 0 3.2vw;
    padding: 0 4vw;
    line-height: 11.734vw;
    color: #969696;
    font-size: 4.266vw;
    font-weight: 600;
    
    li {
      position: relative;
      margin-right: 6.666vw;
      
    }
    &.acn-tabs-around {
      display: flex;
    }
    .act {
      color: #fff;

      &:after {
        content: "";
        width: 3.2vw;
        height: 1.066vw;
        position: absolute;
        left: 50%;
        bottom: 0.8vw;
        transform: translateX(-50%);
        background-color: #fff;
        border-radius: 0.533vw;
      }
    }
  }
  .sticky {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    background: #191919;
    z-index: 999;
  }
  .acn-list {
    display: flex;
    flex-wrap: wrap;
    background-color: #fff;
    margin: 0 4vw;
    padding: 4.266vw 1.5%;
    // min-height: 80vh;
    align-items: flex-start;
    align-content: flex-start;
    border-radius: 4.8vw;
    .acn-cell {
      width: 47.2%;
      margin: 0 1.4% 2.4vw;
    }
  }
  .foot-logo {
    width: 34.533vw;
    margin: 0 auto;
    padding: 10.667vw 0;
  }

  .acn-enter {
    position: fixed;
    right: 4vw;
    bottom: 12vh;
    width: 14.933vw;
    height: 14.9333vw;
    background: linear-gradient(141deg, #fa4e79 20%, #4328eb 90%);
    border-radius: 100%;
    box-shadow: 0 0 2.133vw rgba(0, 0, 0, 0.3);
    font-size: 3.733vw;
    font-weight: 600;
    color: #fff;
    line-height: 4.267vw;
    overflow: hidden;
    z-index: 4;
  }
  .footer-tab {
    padding: 1.067vw 0 1.33vw;
    border-top: 0.266vw solid #323232;
    background: #232323;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 2;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    &.Inipx {
      padding-bottom: 9.066vw;
    }
    // ._tabs {
    //   div {
    //     flex: 1;
    //     height: 13.333vw;
    //     background: #333333;
    //     color: #fff;
    //     font-size: 4.266vw;
    //     font-weight: bold;
    //     border-radius: 2px;
    //     &.send {
    //       margin-right: 2.6666vw;
    //       background: #fb2e3d;
    //       &.gray {
    //         background: #cccccc;
    //       }
    //       .icon {
    //         width: 4.266vw;
    //         height: 4.266vw;
    //         background: #fff;
    //         border-radius: 50%;
    //         position: relative;
    //         margin-right: 1.866vw;
    //         &:before,
    //         &:after {
    //           content: "";
    //           width: 2px;
    //           height: 2.5vw;
    //           background: #fa2337;
    //           position: absolute;
    //           left: 50%;
    //           top: 50%;
    //           transform: translate(-50%, -50%);
    //           border-radius: 1px;
    //         }
    //         &:after {
    //           height: 2px;
    //           width: 2.5vw;
    //         }
    //       }
    //     }
    //   }
    // }
  }
}
</style>
