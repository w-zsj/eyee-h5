<template>
  <div class="promotion-goods" :class="{'ipx':getIsIphonex}">
    <!-- 推广商城 -->
    <div class="tabs">
      <!-- <span v-for="(item,index) in tabs" :key="index" :class="{'act':curindex==index}" @click="handleTabs(item,index)">{{item.categoryname}}</span> -->
      <swiper :options="swiperFullScreen" ref="tabSwiper">
        <swiper-slide v-for="(item,idx) in tabs" :key="idx" :class="{'act':curindex==idx}">
          <span @click.stop="handleTabs(item,idx)">{{item.categoryname}}</span>
        </swiper-slide>
      </swiper>
    </div>
    <v-list
      :load-handle="()=>{}"
      :more-handle="rcdloadmore"
      :more-handling="rcd.loading"
      :isend="rcd.isend"
    >
      <!-- 商品列表 -->
      <div class="prod flex-btwn flex-wrap">
        <div class="list" v-for="(item,indx) in list" :key="indx" @click="todetail(item.id)">
          <div class="img">
            <img :src="item.mainpic" alt srcset />
          </div>
          <div class="info">
            <div class="name ellipsis-2">{{item.name}}</div>
            <div
              class="del-price"
              :class="{'act':item.specialprice}"
            >{{item.specialprice>0?item.saleprice:''}}</div>
            <div class="mark-price flex-aic">
              <i>¥</i>
              {{item.specialprice>0?item.specialprice:item.saleprice}}
              <span
                class="flex-center"
              >返利{{item.promotionrate}}%</span>
            </div>
            <div class="share flex-center" @click.stop="goShare(item)">立即分享 赚¥{{item.rebateamount}}</div>
          </div>
        </div>
      </div>
    </v-list>
    <!-- 底部tab -->
    <div class="flex-btwn footer-tab" :class="{'ipx':getIsIphonex}">
      <div class="flex-col-ctr sub" @click="goback">
        <img src="https://files.eyee.com/activity/vip/icon_tab_act.png" />
        <span>会员中心</span>
      </div>
      <div class="flex-col-ctr sub act">
        <img src="https://files.eyee.com/activity/vip/icon_tab_money.png" />
        <span>推广赚</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { PromotionTab, PromotionList } from "@/utils/api/vip";

export default {
  data() {
    return {
      swiperFullScreen: {
        freeMode: true,
        slidesPerView: 4
      },
      tabs: [],
      curindex: 0,
      rcd: {
        pageindex: 1,
        loading: false,
        isend: false
      },
      list: [],
      categoryid: "",
      isvip: false
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo"
    }),
    getIsIphonex() {
      if (this.$root.ISIOS) {
        return !!(
          (screen.width == 375 && screen.height == 812) ||
          (screen.width === 414 && screen.height === 896)
        );
      }
    },
    loged() {
      return !!(this.user && this.user.uid);
    },
    tabSwiper() {
      return this.$refs.tabSwiper.swiper;
    }
  },
  mounted() {
    let _ = this;
    if (_.$root.loging) {
      _.$root.loging.catch(e => {
        console.error("query prams auto login error:", e);
      });
    }
    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json);
      } else _.toast("登录失败~");
    };
    // 隐藏分享按钮
    _.javascriptBridge({
      name: "getAppActivityShareContent",
      params: {
        hideshareicon: true
      }
    });
    _.getTabs();
  },
  methods: {
    getTabs() {
      let _ = this;
      PromotionTab()
        .then(res => {
          console.log("tab--->>", res);
          if (res && res.length) {
            _.tabs = res;
            _.categoryid = res[0].categoryid;
            if (_.categoryid) _.getRecommend();
            else
              setTimeout(() => {
                _.getRecommend();
              }, 100);
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    handleTabs(item, index) {
      let _ = this;
      // console.log(item, index);
      if (_.curindex == index) return;
      _.curindex = index;
      _.tabSwiper.slideTo(index, 100, false);
      _.categoryid = item.categoryid;
      _.rcd.pageindex = 1;
      _.rcd.isend = false;
      window.scrollTo(0, 0);
      if (_.categoryid) _.getRecommend();
      else
        setTimeout(() => {
          _.getRecommend();
        }, 200);
      // _.getRecommend();
    },
    rcdloadmore() {
      let _ = this;
      if (_.rcd.loading) return;
      if (_.rcd.isend) _.toast("已无更多");
      else if (_.list && _.list.length) {
        _.rcd.pageindex++;
        _.getRecommend();
      }
    },
    getRecommend() {
      let _ = this,
        pageindex = _.rcd.pageindex;
      // errmsg = "";
      _.rcd.loading = true;
      PromotionList({ pageindex, categoryid: _.categoryid })
        .then(res => {
          if (res && res.list && res.list.length) {
            if (pageindex == 1) _.list = res.list;
            else _.list = _.list.concat(res.list);
            _.rcd.isend =
              res.pageindex * res.pagesize >= res.sumcount && _.list.length > 0;
          } else _.rcd.isend = true;
          _.rcd.loading = false;
          _.isvip = !!res.isvip;
        })
        .catch(e => {
          _.rcd.loading = false;
          console.error(e);
          // errmsg = `error msg >>>${e}, id>>> ${_.categoryid}`;
          // _.toast(errmsg);
        });
    },
    todetail(id) {
      let _ = this;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppProductDetailPage",
          params: { productid: id }
        });
      }
    },
    goShare(item) {
      let _ = this,
        version = "";
      _.checkLogin(() => {
        if (!_.isvip) {
          _.toast("只有潮牌合伙人才可分享推广链接");
        } else {
          version = localStorage.getItem("APP_Version") || "";
          if (!version || (version && version < "3.7.8"))
            _.toast("请下载最新版本斗牛APP，获取会员专享推广链接");
          else {
            // app分享交互
            _.javascriptBridge({
              name: "CallAppTunedUpPromotionSharePage",
              params: {
                sharemodel: item.share,
                isvip: _.isvip,
                productinfo: {
                  name: item.name,
                  pic: item.mainpic,
                  specialprice: item.specialprice,
                  saleprice: item.saleprice,
                  rebateamount: item.rebateamount
                }
              }
            });
          }
        }
      });
    },
    goback() {
      this.$router.replace("/vip");
    },
    checkLogin(call = () => {}) {
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
    }
  }
};
</script>
<style lang="scss" scoped>
.promotion-goods {
  // padding: 0 4vw;
  padding-bottom: 13.0666vw;
  &.ipx {
    padding-bottom: 22.4vw;
  }
  .tabs {
    font-size: 4vw;
    color: #969696;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    line-height: 11.7333vw;
    margin-bottom: 2.666vw;
    position: sticky;
    top: 0;
    z-index: 10;
    background: #fff;
    .swiper-slide.act {
      color: #323232;
      span {
        position: relative;
        &::before {
          content: "";
          position: absolute;
          left: 0;
          bottom: -5px;
          height: 3px;
          width: 100%;
          background: #323232;
        }
      }
    }
  }
  .prod {
    padding: 0 4vw;
    .list {
      width: 48.405%;
      background: #fafafa;
      border-radius: 1.6vw;
      overflow: hidden;
      margin-bottom: 2.666vw;
      .img {
        width: 100%;
        height: 0;
        padding-top: 100%;
        position: relative;
        img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        &:before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.04);
          z-index: 2;
        }
      }
      .info {
        padding: 3.2vw 2.666vw 4vw 2.666vw;
        color: #323232;
        font-size: 3.466vw;
        .name {
          // line-height: 17px;
          margin-bottom: 1.33vw;
          height: 9.0666vw;
          font-size: 12px;
        }
        .del-price {
          font-family: OswaldBold;
          font-size: 12px;
          transform: scale(0.833);
          margin-left: -3.733vw;
          height: 4.8vw;
          position: relative;
          padding-left: 2.666vw;
          color: #ccc;
          &.act::after {
            content: "¥";
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%) scale(0.833);
            font-size: 12px;
            text-decoration: line-through;
          }
          &.act:before {
            content: "";
            position: absolute;
            left: 0;
            top: 50%;
            width: 20%;
            height: 1px;
            transform: translateY(-50%);
            background: #ccc;
          }
        }
        .mark-price {
          font-family: OswaldBold;
          font-size: 4.8vw;
          margin-bottom: 1.3vw;
          i {
            font-size: 3.466vw;
            margin-top: 0.8vw;
            margin-right: 2px;
          }
          span {
            display: inline-block;
            font-family: Arial, Helvetica, sans-serif;
            height: 4.85333vw;
            border-radius: 2.42665vw;
            background: #ffd5d9;
            color: #fa2337;
            font-size: 12px;
            margin-left: 1.33vw;
            position: relative;
            min-width: 16.4vw;
            transform: scale(0.833);
            text-align: center;
            white-space: nowrap;
          }
        }
        .share {
          height: 8.533vw;
          background: #323232;
          border-radius: 2px;
          color: #fff;
          font-size: 3.7333vw;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: bold;
        }
      }
    }
  }
  .footer-tab {
    position: fixed;
    transform: translateZ(0);
    width: 100vw;
    left: 0;
    bottom: 0;
    background: #fff;
    box-shadow: 0 0 2.667vw 0 rgba(0, 0, 0, 0.1);
    padding-bottom: 1.33vw;
    z-index: 3;
    &.ipx {
      padding-bottom: 9.0666vw;
    }
    .sub {
      flex: 1;
      color: #b4b4b4;
      font-size: 12px;
      font-weight: bold;
      &.act {
        color: #232323;
      }
      img {
        width: 9.0666vw;
        height: 9.0666vw;
      }
      span {
        display: inline-block;
        transform: scale(0.833);
      }
    }
  }
}
</style>