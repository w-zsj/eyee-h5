<template>
  <div class="main-venue">
    <!-- <img src="https://files.eyee.com/activity/year-shopping/mainvenuesharing.png" width="0" height="0" alt=""> -->
    <div class="load-app" v-if="!$root.ISAPP">
      <a href="https://gio.ren/dWVL4LV">
        <img src="https://files.eyee.com/activity/year-shopping/loadApp.jpg?r=1" alt>
      </a>
    </div>
    <!-- <div class="suspension" @click="goDown">
      <div class="imgbg flex-center">
        <img src="https://files.eyee.com/activity/year-shopping/float-btn.gif" alt>
      </div>
      <div class="counttime flex-around">
        <p class="txt">{{setdata.H}}</p>
        <p class="txt">{{setdata.m}}</p>
        <p class="txt">{{setdata.s}}</p>
      </div>
    </div>-->
    <div class="top">
      <img :src="banner">
    </div>
    <!-- 优惠券 -->
    <div class="coupon flex-center">
      <!-- <img src="https://files.eyee.com/activity/year-shopping/coupon-bg.png" alt="" /> -->
      <div class="couponlist flex">
        <div
          class="item"
          v-for="(item,index) in couponList"
          :key="index"
          @click="getcoupon(item,index)"
        >
          <div class="flex-col flex-center">
            <!-- <img src="https://files.eyee.com/activity/year-shopping/coupon.png" class="" alt="" /> -->
            <p class="text">满{{item.usecondition}}元可使用</p>
            <div class="cut flex-center">
              <p>￥</p>
              <span>{{item.facevalue}}</span>
            </div>

            <div class="getcoupon flex-center" :class="{'geted':item.isgain==2}">
              <span v-if="item.isgain==1">立即领取＞</span>
              <span v-else>已领取></span>
              <!-- <img src="//files.eyee.com/activity/year-shopping/receive.png" class="" alt="" /> -->
            </div>
          </div>
        </div>
      </div>
      <div class="authenticate flex-center" @click="gglGo">
        <img src="https://files.eyee.com/activity/year-activity/guaguale.png">
      </div>
    </div>

    <!-- tab  tab点击定位相应分会场区域-->
    <div class="mh-tab-box">
      <div
        v-for="(item, tabIdx) in categoryList"
        :key="tabIdx"
        class="mh-tab"
        :class="{act:actId==item.themetype}"
        @click="goSubDiv(item.themetype)"
      >
        <span>{{item.activityname}}</span>
      </div>
    </div>

    <!-- 固定榜单  -->
    <div class="fixedlist">
      <div class="container">
        <div class="short-container flex flex-wrap flex-between">
          <div
            class="item-short flex-center"
            v-for="(item, b) in fixedList "
            :key="b"
            @click="goBillboard(item)"
          >
            <img :src="item.activityimg" alt>
          </div>
        </div>
      </div>
    </div>

    <!-- 店铺推荐 -->
    <div class="shop-recommend flex-col flex-center">
      <img src="https://files.eyee.com/activity/year-activity/dainpurukoubiaoqian.png" alt>
      <div class="shoplist">
        <div class="shop-duoble flex-aic flex-wrap">
          <div
            class="d-item"
            v-for="(item,ind) in shopRecommendList "
            :key="ind"
            @click="gostore(item)"
          >
            <img :src="item.activityimg" alt>
          </div>
        </div>

        <!-- <div class="shop-three flex-wrap flex-between">
          <div
            class="t-item"
            v-show="ind >= 2"
            v-for="(item,ind) in shopRecommendList "
            :key="ind"
            @click="gostore(item)"
          >
            <img :src="item.coverurl" alt>
          </div>
        </div>-->
      </div>
    </div>

    <!-- 分会场列表 -->
    <div class="subVenue flex-col flex-center">
      <div
        class="subitem flex-col flex-center"
        :class="'subitem'+index"
        v-for="(item,index) in newsubinfo"
        :key="index"
        :id="item.themetype"
      >
        <img :src="item.indexpic" alt @click="goSub(item)">
        <div class="prolist flex-wrap flex-between">
          <div class="proitem" v-for="(item,index) in item.productlist" :key="index">
            <product-cell
              col="triple"
              txt-color="#fff"
              :cellData="item"
              bgcolor="#fff"
              class="procell"
            >
              <template slot="price" slot-scope="{ price}">
                <div class="manjian">满399减100</div>
                <div class="font-price flex-btwn">
                  <span>抢购价: ¥{{price}}</span>
                  <i class="flex-center">抢</i>
                </div>
              </template>
            </product-cell>
          </div>
        </div>
        <!-- <div class="gosub" >
          <img src="//files.eyee.com/activity/year-shopping/go-session.png" class alt>
        </div>-->
      </div>
    </div>

    <!-- 猜你喜欢 -->
    <div class="guessLikeList flex-col flex-center">
      <p class="title">
        <img src="https://files.eyee.com/activity/year-activity/zhuanxiangbaokuan.png" alt>
      </p>
      <v-list
        class="prolist"
        :load-handle="reload"
        :more-handle="loadmore"
        :more-handling="loading"
        :isend="isend"
      >
        <div class="prolist flex-wrap flex-between">
          <div class="item" v-for="(item, index) in newlikeList" :key="index">
            <product-cell
              col="triple"
              txt-color="#fff"
              bg-color="#fff"
              :cellData="item"
              class="procell"
            >
              <template slot="price" slot-scope="{ price}">
                <div class="font-price flex-aic">
                  <p class="cuticon">抢购价:</p>
                  <p class="pricenow">￥{{price}}</p>
                  <span class="qiang flex-center">抢</span>
                  <!-- <p class="pricedel del">¥{{delprice}}</p> -->
                </div>
              </template>
            </product-cell>
          </div>
        </div>
      </v-list>
    </div>

    <!-- 尾部 -->
    <div class="footer">
      <img src="//files.eyee.com/activity/year-shopping/footer.png" class alt>
    </div>
    <RainModel
      :modelType="modelType"
      :shareInfo="shareInfo"
      :IsmainOrsub="false"
      @close="closeModel"
      v-if="modelType!=0"
    ></RainModel>
  </div>
</template>
<script>
import {
  MainPrecticeList,
  MainSubList,
  MainStoreRecommend,
  RecommendProduct,
  MainCouponList,
  MainCouponListLogin,
  GetCoupon
} from "../../utils/api/activities";
import { DateDiff } from "../../common/util";
import { mapGetters } from "vuex";
import RainModel from "../../comps/RainModel";
import ProductCell from "../../comps/ProductCell";
import { getUrlParam } from "@/common/util";

export default {
  name: "MainVenue",
  components: { ProductCell, RainModel }, //
  data() {
    return {
      modelType: 0,
      setdata: { H: 0, m: 0, s: 0 },
      shareInfo: {},
      banner: "",
      rollList: [],
      categoryList: [],
      fixedList: [],
      couponList: [],
      subinfo: [],
      shopRecommendList: [],

      activitytype: 5,
      themetype: 0,
      likeList: [],
      page: 1,
      size: 10,
      total: 0,
      loading: false,
      isend: false,
      animate: false,
      actId: -1
    };
  },
  mounted() {
    let _ = this;
    if (_.$root.ISAPP) {
      _.getQueryParamUser()
        .then(res => {
          _.mainCouponListLogin();
        })
        .catch(e => {
          if (_.userInfo && _.userInfo.token) {
            _.mainCouponListLogin();
          } else {
            _.mainCouponList();
          }
        });
    } else {
      if (_.userInfo && _.userInfo.token) {
        _.mainCouponListLogin();
      } else {
        _.mainCouponList();
      }
    }
    // document.body.classList.remove('lock')
    _.mainPrecticeList();
    _.mainSubList();
    // _.mainStoreRecommend();
    _.recommend();

    // _.mainCouponList();

    // _.infoScroll();
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    }),
    newsubinfo() {
      let _ = this;
      _.subinfo.map(i => {
        if (i.productlist && i.productlist.length > 0) {
          i.productlist.map(j => {
            j.id = j.productid;
            j.img = j.pic;
            j.saleprice = j.originprice;
            j.specialprice = j.nowprice;
            j.brandname = j.brandname;
            j.name = "";

            return j;
          });
        }
        return i;
      });

      console.log("subinfolist", _.subinfo);
      return _.subinfo;
    },

    newlikeList() {
      let _ = this;
      _.likeList.map(i => {
        i.id = i.productid;
        i.img = i.pic;
        i.saleprice = i.originprice;
        i.specialprice = i.nowprice;
        i.brandname = i.brandname;
        return i;
      });

      return _.likeList;
    }
  },
  methods: {
    gglGo() {
      let pad = "?entrance=1",
        query = window.location.search;
      if (query && query.indexOf("?") > -1) query = query.replace("?", "");
      if (query) pad = `${pad}&${query}`;
      this.$router.push("/rasp/rasphappy" + pad);
    },
    closeModel() {
      this.modelType = 0;
    },
    //主会场榜单分会场列表
    mainPrecticeList() {
      MainPrecticeList()
        .then(res => {
          let _ = this;
          if (res) {
            // console.log('MainPrecticeList',res)
            // _.banner = "";
            // _.categoryList = [];
            // _.fixedList = [];
            // _.rollList = [];

            _.banner = res.banner;
            _.categoryList = res.categorylist;
            _.fixedList = res.fixedlist;
            _.shopRecommendList = res.businesslist;
            // _.rollList = res.rollList;
            _.setShare(res.share);
          }
        })
        .catch(e => {
          console.error("MainPrecticeList error:", e);
        });
    },
    setShare(info) {
      let _ = this;
      if (!(info && info.title)) return;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "getAppActivityShareContent",
          params: {
            sharecontent: info.content,
            sharepicurl: info.icon,
            shareurl: info.url,
            sharetitle: info.title,
            showshareicon: true
          }
        });
      } else if (_.$root.ISWX) {
        _.initShare({
          info: {
            title: info.title,
            desc: info.content,
            url: info.url,
            img: info.icon
          }
        });
      }
    },
    //主会场分会场信息列表
    mainSubList() {
      MainSubList()
        .then(res => {
          let data = res;
          let _ = this;
          if (data) {
            console.log("mainSubList", data);
            _.subinfo = [];
            _.subinfo = data;
            _.newsubinfo;
          }
        })
        .catch(e => {
          console.error("MainSubList error:", e);
        });
    },
    //主会场--店铺推荐
    // mainStoreRecommend() {
    //   MainStoreRecommend()
    //     .then(res => {
    //       let data = res;
    //       let _ = this;
    //       if (data.list && data.list.length) {
    //         console.log("MainStoreRecommend", data);
    //         _.shopRecommendList = [];
    //         _.shopRecommendList = data.list;
    //       }
    //     })
    //     .catch(e => {
    //       console.error("MainStoreRecommend error:", e);
    //     });
    // },

    //主会场--猜你喜欢
    recommend() {
      let _ = this,
        { page, activitytype, themetype } = _;
      _.loading = true;
      RecommendProduct({ page, activitytype, themetype })
        .then(res => {
          console.log("RecommendProduct res:", res);

          if (res && res.list && res.list.length) {
            res.list = res.list.map(i => {
              i.id = i.productid;
              i.img = i.pic;
              i.saleprice = i.originprice;
              i.specialprice = i.nowprice;
              i.brandname = i.brandname;
              return i;
            });

            if (page === 1) {
              _.likeList = res.list;
            } else {
              _.likeList = _.likeList.concat(res.list);
            }
            _.isend = res.page * res.size >= res.total && _.likeList.length > 0;
          }

          _.loading = false;
        })
        .catch(e => {
          _.loading = false;
          console.error("RecommendProduct error:", e);
        });
    },
    loadmore() {
      let _ = this;
      if (_.loading) return;
      if (_.isend) _.toast("已无更多");
      else {
        _.page++;
        _.recommend();
      }
    },
    reload() {
      let _ = this;
      _.loading = true;
      _.isend = false;
      _.likeList = [];
      _.page = 1;
      _.recommend();
    },

    //主会场--优惠券
    mainCouponList() {
      //未登录状态
      MainCouponList({})
        .then(res => {
          let data = res;
          let _ = this;
          if (data) {
            console.log("Maincouponinfo", data);
            _.couponList = [];
            _.couponList = data;
          }
        })
        .catch(e => {
          console.error("Maincouponinfo error:", e);
        });
    },
    mainCouponListLogin() {
      //登录状态
      MainCouponListLogin({})
        .then(res => {
          let data = res;
          let _ = this;
          if (data) {
            console.log("MaincouponinfoLogin", data);
            _.couponList = [];
            _.couponList = data;
          }
        })
        .catch(e => {
          console.error("MaincouponinfoLogin error:", e);
        });
    },

    getcoupon(couponinfo, idx) {
      let _ = this;
      if (couponinfo.isgain !== 1) {
        _.toast("已领取");
        return;
      }
      if (_.userInfo && _.userInfo.token) {
        let id = couponinfo.id;
        let activitytype = 5;

        GetCoupon({ id, activitytype })
          .then(res => {
            _.toast("您已领取成功！优惠券已放置于您的个人中心-卡券中！");
            _.couponList[idx].isgain = 2;
          })
          .catch(e => {
            // 1511200：成功，10710：已抢完，1511447：领取过红包，1511501、1511401领取失败，
            console.error("GetCoupon error:", e);
            if (e.code == 10710) {
              _.toast("该优惠券已被抢完");
            } else if (e.code == 1511447) {
              _.toast("已领取");
              _.couponList[idx].isgain = 2;
            } else if (e.code == 1511501 || e.code == 1511401) {
              _.toast("领取失败");
            } else {
              _.toast(e.msg);
            }
          });
      } else {
        return (_.modelType = 5);
      }
    },

    //固定榜单跳转
    goBillboard(info) {
      let _ = this;
      _.$router.push(
        `/20190128/sub?at=${info.activitytype}&tt=${info.themetype}`
      );
    },
    //进入分会场
    goSub(info) {
      let _ = this;
      console.log("sub info", info);
      _.$router.push(
        `/20190128/sub?at=${info.activitytype}&tt=${info.themetype}`
      );
    },
    //跳转店铺
    gostore(info) {
      let _ = this;
      _.$router.push(
        `/20190128/sub?at=${info.activitytype}&tt=${info.themetype}`
      );
    },
    //tab点击切换对应div
    goSubDiv(subdivid) {
      let _ = this;
      _.actId = subdivid;
      document.getElementById(subdivid).scrollIntoView();
      window.scrollTo(0, window.scrollY - window.innerWidth * 0.13);
    }
  }
};
</script>
<style lang="scss" scoped>
.main-venue {
  width: 100%;
  // background-color: #ff7b7d;
  .load-app {
    width: 100%;
  }
  .top {
    width: 100%;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
    }
    .rollList {
      position: absolute;
      top: 0;
      left: 0;
      width: 40%;
      height: 47vw;
      overflow: hidden;
      margin-top: 23px;
      padding-left: 11px;
      .container {
        transition: all 0.5s;
        margin-top: -62px;
      }
      .item {
        margin-bottom: 17px;
        padding: 2% 3%;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 20px;
        color: #fff;
        text-align: center;
        font-size: 10px;
        line-height: 20px;
      }
    }
  }

  .mh-tab-box {
    width: 100%;
    // height: 13vw;
    line-height: 13vw;
    overflow-x: scroll;
    //
    background: #014779;
    position: sticky;
    top: 0px;
    z-index: 4;
    padding-left: 21px;
    white-space: nowrap;
    .mh-tab {
      color: #eee;
      font-size: 15px;
      width: 20vw;
      // font-weight: 600;
      // padding-right: 21px;
      display: inline-block;
      position: relative;
      white-space: nowrap;
      text-align: center;
    }
    .mh-tab.act {
      font-size: 16px;
      background: wheat;
      color: #014779;
    }
    span {
      text-align: center;
    }
  }

  .fixedlist {
    width: 100%;
    background-color: #ff7b7d;
    padding: 13px 12px;

    .container {
      // background-color: #ff7b7d;
      padding-top: 14px;

      .item-long {
        width: 100%;
        padding-bottom: 13px;
        img {
          width: 100%;
          border-radius: 5px;
        }
      }

      .short-container {
        width: 100%;
        .item-short {
          width: 49%;
          // padding: 6px;
          margin-bottom: 9px;
          background-color: #ff7b7d;
          border-radius: 5px;
          img {
            width: 100%;
            border-radius: 5px;
          }
        }
        .item-short:nth-child(1),
        .item-short:last-child {
          width: 100%;
        }

        .item-short:nth-child(4n + 2) {
          width: 57%;
        }
        .item-short:nth-child(4n + 3) {
          width: 40.5%;
        }
      }
    }
  }

  .coupon {
    // width:100%;
    // margin: 25px 0;
    // overflow-x: scroll;
    margin-top: -20vw;
    overflow: hidden;
    background-image: url("https://files.eyee.com/activity/year-activity/youhuiquanbeijing.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    position: relative;
    height: 58.6667vw;

    padding-bottom: 45%;
    img {
      width: 100%;
      height: 100%;
    }

    .couponlist {
      width: 100%;
      overflow-x: scroll;
      white-space: nowrap;
      position: absolute;
      bottom: 8.66vw;
      left: 0;

      .item {
        // width:28.8vw;
        // padding: 0 3%;
        position: relative;
        margin: 0px 5px;
        width: 31%;
        height: 30vw;
        padding-bottom: 20%;
        background-image: url("https://files.eyee.com/activity/year-activity/youhuiquan.png");
        background-size: 100% auto;
        background-repeat: no-repeat;
        white-space: nowrap;

        & > div {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .text {
          color: #eee;
          font-size: 10px;
          margin-top: -5vw;
        }

        .cut {
          line-height: 15px;
          width: 100%;
          margin-top: 2vw;

          p {
            margin-top: 1.5vw;
            font-size: 20px;
            color: #eee;
            width: 16px;
          }
          span {
            color: #eee;
            font-size: 30px;
            font-weight: 900;
          }
        }

        .getcoupon {
          background-size: 100% 100%;
          text-align: center;
          padding: 0 10% 2px;
          margin-top: 4vw;
          span {
            color: #014779;
            font-size: 12px;
            font-weight: 500;
          }
        }
        // .getcoupon:not(.geted) {
        //   background-image: url("//files.eyee.com/activity/year-shopping/receive.png");
        // }
        .getcoupon.geted {
          // background-image: url("/static/imgs/acts/received.png");

          span {
            color: burlywood;
          }
        }
      }
    }
  }

  .authenticate {
    width: 100%;
    position: absolute;
    left: 50%;
    bottom: 5px;
    transform: translateX(-50%);
    img {
      width: 70%;
      // margin: 0 2vw 20px 0;
    }
    p {
      font-size: 22px;
      color: #eee;

      font-weight: 1000;
    }
  }
  .subVenue {
    width: 100%;
    .subitem {
      // width:100%;
      overflow: hidden;
      background-color: #ff7b7d;
      padding: 3.3333vw 3.2vw;
      img {
        width: 100%;
      }

      .prolist {
        width: 100%;
        padding: 0 2.4vw;
        .proitem {
          width: 32%;

          /deep/ .product-cell.triple {
            width: 100%;
            margin: 2.6667vw 0;
            text-align: center;
            background: #fff;
            //  padding-bottom: 5px;
            overflow: hidden;
          }
          /deep/ .product-cell p.pc-brand {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: #333;
          }
          .manjian {
            background: #000;
            font-size: 10px;
            color: #f2f2f2;
          }
          .font-price {
            // padding-right: 4.8vw;
            margin: 5px 0;
            font-size: 12px;
            color: #ea3c3e;
            padding: 0 4px;
            i {
              width: 20px;
              height: 20px;
              background: #ea3c3e;
              border-radius: 50%;
              float: right;
              color: #fff;
              font-style: normal;
            }
          }
        }
      }
      .gosub {
        width: 33%;
        margin: 2vw 0;
        img {
          width: 100%;
        }
      }
    }
    subitem0 {
      background-color: #ff7b7d;
    }
    .subitem1 {
      background-color: #fdd296;
    }
    .subitem2 {
      background-color: #b5f6eb;
    }
    .subitem3 {
      background-color: #ffe5c0;
    }
    .subitem4 {
      background-color: #ff7b7d;
    }
    .subitem5 {
      background-color: #ffe5c0;
    }
    .subitem6 {
      background-color: #b5f6eb;
    }
  }

  .shop-recommend {
    // width:100%;
    overflow: hidden;
    background: #b5f6eb;
    padding: 3.3333vw 3.2vw;
    // padding: 0 2.1333vw;
    img {
      width: 70%;
    }

    .shoplist {
      .shop-duoble {
        width: 100%;
        padding-top: 2.6667vw;
        .d-item {
          width: 32%;

          img {
            width: 100%;
          }
        }
        .d-item:nth-child(3n + 2) {
          margin: 0 2%;
        }
      }
      .shop-three {
        width: 100%;
        padding-bottom: 2.6667vw;
        .t-item {
          width: 32%;
          margin: 1vw 0;
          img {
            width: 100%;
          }
        }
      }
    }
  }

  .guessLikeList {
    width: 100%;
    padding: 7.4667vw 3.2vw;
    background-color: #ffe5c0;
    /deep/ .mint-loadmore {
      background-color: #ffe5c0;
    }

    .title {
      color: #fff;
      font-weight: 600;
      font-size: 19px;
    }
    .prolist {
      width: 100%;
      // background-color: #D53010;
      /deep/ .pc-info {
        padding: 0 2%;
        color: #333;
      }

      /deep/ .product-cell p.pc-brand {
        padding: 0.2667vw;
      }
      .item {
        width: 32%;
        /deep/ .product-cell.triple {
          width: 100%;
          margin: 2.6667vw 0;
          padding-bottom: 5px;
          // text-align: center;
        }
        .font-price {
          // margin: 1.7333vw 0;
          color: #ea3c3e;
          .cuticon {
            // background-color: #fee900;
            font-size: 10px;
            // color: #333;
            font-weight: 600;
            padding: 0.2667vw 1vw;
            width: 45%;
          }
          .qiang {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #ea3c3e;
            font-size: 12px;
            color: #fff;
          }
          .pricenow {
            font-size: 12px;
            line-height: 15px;
            margin: 0 0.5333vw;
            font-weight: 600;
          }
          .pricedel {
            font-size: 11px;
            color: #fff;
            align-self: flex-end;
            margin: 0 0.5333vw;
          }
        }
      }
    }
  }

  .footer {
    width: 100%;
    height: 11.7333vw;
    img {
      width: 100%;
    }
  }
}
.suspension {
  position: fixed;
  width: 110px;
  top: 250px;
  right: 0;
  z-index: 5;

  .imgbg {
    position: relative;
  }
  .counttime {
    position: absolute;
    bottom: 36%;
    left: 21%;
    width: 59%;

    color: #fff;
    font-size: 2vw;
    // font-weight: 600;
  }
}
</style>
