<template>
  <div v-if="hasdata>0">
    <div class="load-app" v-if="!$root.ISAPP">
      <a href="https://gio.ren/dWVL4LV">
        <img src="https://files.eyee.com/activity/year-shopping/loadApp.jpg?r=1" alt>
      </a>
    </div>
    <v-list
      class="sub-venue "
      :load-handle="reload"
      :more-handle="loadmore"
      :more-handling="loading"
      :isend="isend"
      :class="wrapBg"
    >
      <div class="banner">
        <img v-if="banner" :src="banner" alt>
        <div class="shop-logo">

        </div>
      </div>
      <!-- 优惠券 -->
      <div class="coupon flex-center">
        <!-- <img src="https://files.eyee.com/activity/year-shopping/coupon-bg.png" alt="" /> -->
        <div class="couponlist flex-center flex-wrap">
          <div class="item"  v-for="(item,index) in couponList" :key="'coup'+index" @click="getcoupon(item,index)">
            <div class="flex-col flex-center">
              <p class="text">满{{item.usecondition}}元可使用</p>
              <div class="cut flex-center">
                <p>￥</p>
                <span>{{item.facevalue}}</span>
              </div>
              <div class="getcoupon flex-center" :class="{'geted':item.isgain==2}">
                <span v-if="item.isgain==1">立即领取＞</span>
                <span v-else>已领取></span>
              </div>
            </div>

          </div>


        </div>
      </div>
      <!-- 榜单商品  v-else-if="isBulletin"-->
      <template>
        <div class="bulletin-rcd">
          <product-cell v-for="(ri, rIdx) in rcd" :key="'br'+rIdx" bg-color="#dc5342" txt-color="#fff" bgColor="#fff" :isShowBtn="true" :horizontal="true" :name-line="2" :cell-data="ri">
            <template slot="ico">
              <div class="venue-ico">
                <p>Top {{rIdx+1}}</p>
              </div>
            </template>
            <template slot="price" slot-scope="{price}">
              <div class="font-price bulletin-price flex">
                <p>{{ri.brandname}}</p>
                <p>
                  <span>抢购价:</span>
                  <span>¥{{price}}</span>
                </p>
              </div>
            </template>
            <template slot="btn">
              <img src="https://files.eyee.com/activity/year-activity/lijiqianggou-1.png" alt="">
            </template>
          </product-cell>
        </div>
      </template>

      <!-- 更多 会场/榜单 -->
      <div class="more-sub" v-if="venues.length>0">
        <!-- isBulletin -->
        <img src="https://files.eyee.com/activity/year-activity/gengduobangdan.png" alt >
        <div class="sub-list">
          <div class="sub-item" v-for="(subItem, subIdx) in venues" :key="subIdx+subItem.themetype">
            <div class="sub-title">
              <img src="https://files.eyee.com/activity/year-shopping/biaoqianbeijing.png" alt>
              <p class="ellipsis">{{subItem.recommendtitle}}</p>
            </div>
            <div class="sub-product flex">
              <product-cell
                v-for="(pItem, pIdx) in subItem.list"
                :key="subIdx+'product'+pIdx"
                col="triple"
                txt-color="#fff"
                :cell-data="pItem"
                bgColor="#fff"
              >
               <template slot="num"><span class="sub-pidx flex-center">{{pIdx+1}}</span></template>
                <template slot="price" slot-scope="{price}">
                  <div class="font-price sub-price flex-center">
                    <!-- <img src="https://files.eyee.com/activity/year-shopping/price-icon.png" alt> -->
                    <span>¥{{price}}</span>
                  </div>
                </template>
              </product-cell>
            </div>
            <div class="sub-modal" @click="goSub(subItem)"></div>
          </div>
        </div>
      </div>

      <!-- 猜你喜欢 -->
      <div class="more-rcd" v-if="list.length>0">
        <img src="https://files.eyee.com/activity/year-activity/zhuanxiangbaokuan.png" alt="">
        <div class="category-tab">
          <span v-for="(item,inx) in categorylist" :key="'rcd'+inx" :class="{'active':inx===categoryCurIndex}" @click.stop="categoryTab(item,inx)">{{item.name}}</span>
        </div>

        <div class="flex-wrap you-like flex-aic">
          <product-cell
            v-for="(item, idx) in list"
            col='triple'
            :key="'list'+idx"
            :cell-data="item"
            txt-color="#333"
            bg-color="#fff"
            class="itemlist"
          >
            <template slot="ico">
              <div></div>
            </template>

            <template slot="price" slot-scope="{price,delprice}">
              <div class="font-price item-price flex-aic">
                <span>抢购价:</span>
                <span>￥{{price}}</span>
                <!-- <span class="del" v-if="delprice>0">¥{{delprice}}</span> -->
                <span class="qiang flex-center">抢</span>
              </div>
            </template>
          </product-cell>
        </div>
      </div>
    </v-list>
    <img src="https://files.eyee.com/activity/year-shopping/footer.png">
    <div class="entns" @click.stop="main">
      <img src="https://files.eyee.com/activity/year-activity/fanhuizhuhuichang-2.png" alt="">
    </div>
    <product-items
      v-if="isBulletin"
      :show="showItems"
      :product-info="currProduct"
      @close="itemsClose"
    ></product-items>

    <rain-model :model-type="loginModel" :IsmainOrsub="false" @close="loginModel=0"></rain-model>
  </div>
  <!-- <v-error v-else-if="!hasdata"></v-error> -->
</template>
<script>
import { mapGetters } from "vuex";

import {
  VenueInfoAndMore,
  RecommendProduct,
  MainCouponList,
  MainCouponListLogin,
  GetCoupon,
  SallGetCoupon
} from "@/utils/api/activities";

import { Add as CartAdd } from "@/common/api/cart";

import ProductCell from "@/comps/ProductCell";
import RainModel from "@/comps/RainModel";
import ProductItems from "@/comps/ProductItems";

const ActivityType = {
  venue: 3,
  bulletin: 4
};

export default {
  name: "SubVenue",
  components: { ProductCell, ProductItems, RainModel },
  data() {
    return {
      hasdata: -1,
      activitytype: -1,
      themetype: -1,
      banner: "",
      venues: [],
      rcd: [],
      list: [],
      page: 0,
      loading: false,
      isend: false,
      couponList: [],

      showItems: false,
      currProduct: {},
      wrapBg:'',
      loginModel: 0,
      categorylist:[],
      categoryCurIndex:0
    };
  },
  beforeMount() {
    // /sub?at=activitytype&tt=themetype
    let _ = this,
      { at, tt,businessid } = _.$route.query;
    _.activitytype = at;
    _.themetype = tt||'';
    _.businessid =businessid||''
      if(_.themetype==2||_.themetype==4||_.themetype==7){
        _.wrapBg = 'yellow'
      }else if(_.themetype==3||_.themetype==4){
        _.wrapBg = 'bluer'
      }

    _.reload();

    if (_.$root.ISAPP) {
      _.javascriptBridge({
        name: "callAppShowShoppingCartIcon",
        params: { isshow: true }
      });
    }
  },
  beforeDestroy() {
    let _ = this;
    if (_.$root.ISAPP) {
      _.javascriptBridge({
        name: "callAppShowShoppingCartIcon",
        params: { isshow: false }
      });
    }
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    isVenue() {
      return this.activitytype == ActivityType.venue;
    },
    isBulletin() {
      return this.activitytype == ActivityType.bulletin;
    }
  },
  watch: {
    $route(val, old) {
      window.scrollTo(0,0)
      let _ = this,
        { at, tt } = val.query;
      _.activitytype = at;
      _.themetype = tt;

      _.reload();
    }
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
  },
  methods: {
    //主会场--优惠券
    mainCouponList() {
      //未登录状态
        let _ = this;
      let {activitytype,themetype,businessid}= _
      MainCouponList({activitytype,themetype,businessid})
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
       let _ = this;
      let {activitytype,themetype,businessid}= _
      MainCouponListLogin({activitytype,themetype,businessid})
        .then(res => {
          let data = res;

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
      if (_.user && _.user.token) {
        let id = couponinfo.id;
        // let activitytype = 4;
        let activitytype = _.activitytype;
        let api = _.activitytype==7?SallGetCoupon:GetCoupon

        api({ id, activitytype })
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
    reload() {
      let _ = this;
      _.loading = true;
      _.isend = false;
      _.rcd = [];
      _.list = [];
      _.page = 0;
      _.getInfo();
    },
    getInfo() {
      let _ = this,
        { activitytype, themetype ,businessid} = _;
      VenueInfoAndMore({ activitytype, themetype,businessid })
        .then(res => {
          console.log("VenueInfoAndMore res:", res);
          if (res && res.recommend) {
            _.banner = res.banner;
            _.venues = (res.recommend || []).map(i => {
              if (i.list && i.list.length > 0)
                i.list = i.list.map(p => {
                  return {
                    id: p.productid,
                    img: p.pic,
                    saleprice: p.originprice > 0 ? p.originprice : p.nowprice,
                    specialprice: p.originprice > 0 ? p.nowprice : 0
                  };
                });
              return i;
            });
            if(res.productlist){
              _.rcd = res.productlist
               _.rcd = _.rcd.map(p => {
                let ret = {
                  id: p.productid,
                  name: p.name,
                  img: p.pic,
                  saleprice: p.originprice > 0 ? p.originprice : p.nowprice,
                  specialprice: p.originprice > 0 ? p.nowprice : 0,
                  isc2c: p.isc2c
                };
                return ret;
              });
            }
            if(res.categorylist){
              _.categorylist = res.categorylist
            }
            _.setShare(res.share);

            // _.recommend();

            _.hasdata = 1;
          } else _.hasdata = 0;

          _.loading = false;
        })
        .catch(e => {
          _.hasdata = 0;
          _.loading = false;
          console.error("VenueInfoAndMore error:", e);
        });
    },
    loadmore() {
      let _ = this;
      if (_.loading||_.isend) return;
      // console.log(_.isend)
      if (_.isend) _.toast("已无更多");
      else {
        _.page++;
        _.recommend();
      }
    },
    recommend() {
      let _ = this,
      { page, activitytype, themetype,category,businessid } = _;
      _.loading = true;
      RecommendProduct({ page, activitytype, themetype,category:Number(category),businessid })
        .then(res => {
          console.log("RecommendProduct res:", res);

          if (res && res.list && res.list.length) {
            res.list = res.list.map(p => {
              let ret = {
                id: p.productid,
                name: p.name,
                img: p.pic,
                saleprice: p.originprice > 0 ? p.originprice : p.nowprice,
                specialprice: p.originprice > 0 ? p.nowprice : 0,
                isc2c: p.isc2c
              };
              // if (_.isVenue) ret.brandname = p.brandname;
              return ret;
            });
            _.list = _.list.concat(res.list);
            //
            if(res.page * res.size >= res.total) _.isend = true

          } else if (page === 1) _.list = [];

          _.loading = false;
        })
        .catch(e => {
          _.loading = false;
          console.error("RecommendProduct error:", e);
        });
    },
    goSub(info) {
      let _ = this;
      // _.activitytype = info.activitytype
      // _.themetype = info.themetype
      // _.venues=[]
      // _.rcd=[]
      // _.page =1
      // _.reload()
      _.$router.push(`/20190128/sub?at=${info.activitytype}&tt=${info.themetype}`);
    },
    openItems(pi) {
      // console.log("openItems--->", pi);
      let _ = this;
      if (_.user.token) {
        _.currProduct = {
          id: pi.id,
          productid: pi.id,
          mainpic: pi.img,
          name: pi.name,
          salprice: pi.saleprice,
          specialprice: pi.specialprice
        };
        _.showItems = true;
      } else _.loginModel = 5;
    },
    itemsClose(item) {
      let _ = this;
      // console.log("itemsClose: ", item);
      if (item)
        CartAdd(item)
          .then(res => {
            console.log("✔购物车添加成功", res);
            _.toast("已成功添加到您的购物车!");
          })
          .catch(e => {
            console.error("✖购物车添加失败", e);
            _.toast("购物车添加失败");
          });

      _.showItems = false;
    },
    main(){
      let _=this,url=''
      if(_.$root.isdebug) url = 'http://qzone.eyee.com/20190128/main'
      else  url = 'https://m.eyee.com/20190128/main'
      window.location.href = url
      // this.$router.replace('/20190128/main')
    },
    categoryTab(item,index){
      let _=this
      _.categoryCurIndex = index
      _.loading = false
      _.page = 1
      _.category = Number(item.id)
       _.list=[]
       _.recommend();

    }
  }
};
</script>
<style lang="scss">
.itemlist {
  margin-top:-7px;
}
.sub-venue {
  background: #ff7b7d;
  min-height: 100vh;
}
.sub-venue.yellow{
  background: #FFE5C0;
}
.sub-venue.yellow{
  background: #B5F6EB;
}
.venue-rcd {
  background: #c44025;
  padding: 16px 8px 0;
}
.bulletin-rcd {
  // background: #fff;
  padding: 15px;
}

.venue-ico {
  position: absolute;
  top: 2vw;
    left: -10vw;
  width: 30%;
  transform: rotate(-45deg);
}
.venue-rcd .venue-ico {
  // left: 8px;
  // width: 17.7%;
}
.bulletin-rcd .venue-ico {
  // left: 15px;
  // width: 8.5%;
}

.venue-ico img {
  display: block;
}
.venue-ico p {
  line-height: 13px;
  text-align: center;
  font-size: 10px;
  font-weight: bold;
  color: #fff;
  padding: 2px 0;
  // border-radius: 50%;
  background: #04477F;
}

.bulletin-rcd .product-cell {
  position: relative;
  padding: 12px 15px;
  // padding-left: 15.2%;
}
.bulletin-rcd .product-cell:not(:last-of-type) {
  margin-bottom: 15px;
}
.bulletin-rcd .pc-show {
  position: unset !important;
  margin-top: 3px;
}

// .more-sub {
// }

/deep/ .you-like .product-cell.double{
  width: 32%;
}
.more-sub > img {
  display: block;
  width: 70%;
  margin: 0 auto 12px;
}
.sub-list {
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  padding-right: 12px;
}
.sub-item {
  position: relative;
  display: inline-block;
  width: 85%;
  margin-left: 12px;
  background: #c44025;
  box-shadow: inset -1px 3px 11px 0 rgba(0, 0, 0, 0.2);
}
.sub-item img {
  display: block;
}
.sub-title {
  width: 82%;
  position: relative;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 16px auto 35px  auto;;
}
.sub-title p {
  position: absolute;
  top: 0;
  left: 10%;
  width: 80%;
  line-height: 30px;
  text-align: center;
}
.sub-modal {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.sub-product {
  padding: 0 1.4%;
}
.sub-price,
.rcd-price {
  position: relative;
  height: 20px;
}
.sub-price > span,
.rcd-price > p {
  position: absolute;
  top: 0;
  color: #ea3c3e;
}
.sub-price > span {
  font-size: 13px;
  line-height: 20px;

  // left: 47%;
  width: 100%;
  text-align: center;
}
.rcd-price > p,
.item-price {
  font-size: 14px;
  line-height: 17px;
  left: 41%;
  color: #ea3c3e;
}
.qiang{
  width: 20px;
  height: 20px;
  background: #ea3c3e;
  border-radius: 50%;
  font-size: 10px;
  color: #fff;
  margin-left: 4px;
}
.rcd-price .del,
.item-price .del {
  color: #fff;
  font-size: 10px;
}
.rcd-price img {
  width: 80%;
  display: block;
}

.item-price span {
  margin-right: 2px;
}
.item-price span:first-of-type {
  line-height: 13px;
  padding: 0 4px;
  color: #ea3c3e;
  // background: #fbe94e;
  font-size: 10px;
  font-weight: 400;
  // color: #000;
}

// .bulletin-price {
// }
.bulletin-price p {
  // background: #534fb9;
  padding: 0 9px;
  line-height: 19px;
  color: #ea3c3e;
}
.bulletin-price span:first-of-type {
  font-size: 13px;
  font-weight: 600;
}
.bulletin-price span:last-of-type {
  font-size: 15px;
  font-weight: 900;
}
.bulletin-price img {
  height: 20px;
  margin-left: 15px;
}

.sub-pidx {
  display: block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  background: #003E72;
  border-radius: 50%;
  // margin: 10px auto 0;
  font-size: 11px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -25px;
}

.more-rcd {
  padding: 0 1.4%;
}

.more-rcd > img {
  display: block;
  width: 70%;
  margin: 20px auto;
}
.coupon {
  border-bottom: 2px solid #ffe5c0;
  position: relative;
  padding: 10px 0;
  background: url('https://files.eyee.com/activity/year-activity/bei-jing.png')0 0;
  img {
    width: 100%;
    height: 100%;
  }

  .couponlist {
    width: 100%;
    // overflow-x: scroll;
    // white-space: nowrap;
    // position: absolute;
    // bottom: 8.66vw;
    // left: 0;

    .item {
      // width:28.8vw;
      // padding: 0 3%;
      position: relative;
      margin: 0px 5px;
      width: 30%;
      // height: 30vw;
      padding-bottom: 24%;
      background-image: url("https://files.eyee.com/activity/year-activity/youhuiquan.png");
      background-size: 100% auto;
      background-repeat: no-repeat;
      white-space: nowrap;

      & > div {
        // position: absolute;
        // top: 60%;
        // left: 50%;
        // transform: translate(-50%, -50%);
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        padding-bottom: 3%;
      }
      .text {
        color: #eee;
        font-size: 10px;
        // margin-top: -5vw;
        margin-top: 2%;
      }

      .cut {
        line-height: 15px;
        width: 100%;
        // margin-top: 2vw;
        margin: 9% 0 11%;

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
        // padding: 0 10% 2px;
        // margin-top: 3vw;
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
.entns{
  position: fixed;
  width: 17.3vw;
  right: 0;
  bottom: 35vw;
  z-index: 10;;
}
.category-tab{
  width: 100%;
  overflow-x: scroll;
  white-space: nowrap;
  background: #014779;
  margin: 10px 0;
}
.category-tab span{

  width: 20%;
  color: #fff;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
  height: 40px;
  display: inline-block;
}
.category-tab span.active{
  background: #c44025;
}
</style>
