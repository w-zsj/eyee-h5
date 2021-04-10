<template>
    <div>
        <div class="banner">
            <img :src="banner" alt="">
        </div>
        <!-- //类目 -->
        <div id="coupon-wrap">
            <swiper :options="tabOpt" class="tab-top" ref="tabsSwiper">
                <swiper-slide v-for="(item,index) in tabList" :key="'tabs'+index" class="tabs">
                    <div class="tab-item" :class="{'active':tabCurIndx===index}" @click.stop="tabSwitch(index)">{{item.name}}</div>
                </swiper-slide>
            </swiper>
            <div class="coupon-list">
                <v-cutlist :more-handle='loadmore' :more-handling='pageParams.isLoading' :isend='pageParams.isend' >
                    <swiper :options="shopOpt" ref="couListSwiper">
                        <swiper-slide v-for="(item,indx) in tabList.length" :key="'cou'+indx">
                          <div v-if="!hasData" class="flex-col flex-center nodata">
                              <img src="https://files.eyee.com/mcdn/static/coupon/default_img.png" alt="">
                              暂无可用优惠券
                            </div>
                            <div v-else v-for="(couItem,ind) in updataCouponInfo" :key="'co'+ind" class="cal-cou">
                                <!-- <couponItem :couponInfo='couItem' v-if="tabCurIndx==0"></couponItem> -->
                                <CouponUnit :cous="couItem" :divHeigh="40" :couType="3"  v-if="tabCurIndx==0" ></CouponUnit>
                                <div class="content" v-else>
                                    <img src="https://files.eyee.com/mcdn/static/coupon/plat_bg.png" alt="">
                                    <div class="cal-item flex-center">
                                        <div class="cal-face-val flex-aic" @click.stop="goshop(couItem.businessid)">
                                            <div class="pro-img">
                                                <img :src="couItem.businesslogo?couItem.businesslogo:'/static/logo.png'" alt="">
                                            </div>
                                            <div class="cop-info flex-col">
                                                <div class="title">
                                                    <div class="titlecn ellipsis">{{couItem.businessname?couItem.businessname:'店铺券'}}</div>
                                                    <div class="reminder">点击领取该店更多券</div>
                                                </div>
                                                <div class="face-valve-info flex-aic">
                                                    <div class="money" :style="{color:couItem.platcolor}">￥<span>{{couItem.facevalue}}</span></div>
                                                    <div class="doorsill flex-col">
                                                        <div class="cou-name">{{couItem.platformtype==1?'店铺券':couItem.platformtype==2?'商品券':couItem.titlecn}}</div>
                                                        <div class="men-kan" :style="{color:couItem.platcolor}">{{couItem.usedesc}}</div>
                                                    </div>
                                                    <div class="shop-icon flex-col">
                                                        <i class="ico-sp-glb" v-if="couItem.businessIsglobalpurchase"></i>
                                                        <i :class="couItem.classIcon" v-if="couItem.businesstype"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="cal-date flex-col flex-center" @click.stop="getCoupon(couItem,ind)">
                                            <div class="past-due flex-center">{{couItem.useendtime|setdata}} 过期</div>
                                            <div class="get-btn flex-center" :class="couItem.platclass">{{couItem.plattxt}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </swiper-slide>
                    </swiper>
                </v-cutlist>
            </div>
            
        </div>
    </div>
</template>
<script>
// import couponItem from "../templates/couponItem";
import CouponUnit from "../templates/CouponUnit";
import { DateFormat } from "../../common/util"; // , _getDate
import {
  GetCouponInProduct,
  GouponCenterFirst,
  GetAllCouponList,
  GetCategoryCouponList,
  GetCoupon
} from "../../common/api/marketing";
import { mapGetters } from "vuex";
import { setTimeout } from "timers";
export default {
  components: { CouponUnit },
  data() {
    return {
      tabList: [], // 类目数据
      banner: "",
      ActTabcategoryid: "", // 当前分类id
      tabCurIndx: 0, // 当前索引

      tabOpt: {
        //tab swiper 配置
        // spaceBetween:6,
        slidesPerView:6.5,
        onSlideChangeEnd: this.carouselChange
      },

      shopOpt: {
        //优惠券 列表 swiper 配置
        spaceBetween: 10,
        slidesPerView: 1,

        onSlideChangeEnd: this.copChange
      },

      couponInfo: [], // 优惠券数据
      co: [],
      hasData: true,
      scrollBtom: false, // 防止 swiper 切换时 触发上拉加载事件
      pageParams: {
        // 上拉加载 基本配置
        pageindex: 1,
        isend: false,
        loading: false
      }
    };
  },
  computed: {
    ...mapGetters({ userInfo: "userInfo" }),
    tabsSwiper() {
      return this.$refs.tabsSwiper.swiper;
    },
    couListSwiper() {
      return this.$refs.couListSwiper.swiper;
    },
    updataCouponInfo() {
      let _ = this;
      _.co = _.couponInfo;
      _.co = _.co.map(i => {
        i.platcolor = "#3898C2";
        if (i.platformtype == 1) i.platcolor = "#FD685D";
        else if (i.platformtype == 2) i.platcolor = "#3898C2";

        if (
          !i.isgeted &&
          !i.isovercount &&
          i.usestatus != 0 &&
          i.usestatus != 1 &&
          i.usestatus != 2
        ) {
          if (i.platformtype == 1) i.platclass = "nowget-blur";
          else if (i.platformtype == 2) i.platclass = "nowget-red";
          i.plattxt = "立即领取";
        } else if (i.isgeted) {
          i.platclass = "hasget";
          i.plattxt = "已领取";
        } else if (i.isovercount) {
          i.platclass = "getover";
          i.plattxt = "已领完";
        }

        if (i.businesstype) {
          switch (i.businesstype) {
            case 1:
              i.classIcon = "ico-sp-official";
              break;
            case 2:
              i.classIcon = "ico-sp-buy";
              break;
            case 3:
              i.classIcon = "ico-sp-store";
              break;
          }
        }
        return i;
      });

      return _.co;
    }
  },
  filters: {
    setdata(time) {
      if (time) {
        let shouwtime = DateFormat(time, "MM月dd日 HH:mm");
        return shouwtime
      }
    }
  },
  mounted() {
    let _ = this;
    _.GouponFirst();
  },
  methods: {
    //领券中心轮播和一级类目Tab
    GouponFirst() {
      let _ = this;
      GouponCenterFirst()
        .then(res => {
          console.log("一级类目Tab 数据", res);
          _.banner = res.banner;
          if (res && res.list && res.list.length > 0) {
            _.tabList = res.list;
            _.ActTabcategoryid = _.tabList[0].id;
            _.GetCouponList();
          }
        })
        .catch(e => {
          if (e) _.toast(e.msg);
        });
    },
    // 主接口
    GetCouponList() {
      let _ = this,
        pageindex = _.pageParams.pageindex || 1,
        param = { pagesize: 10 },
        api = GetAllCouponList,
        type = _.tabList[_.tabCurIndx].type || 0;
      if (type != 0) {
        param.categoryid = _.ActTabcategoryid;
        param.pageindex = pageindex;
        api = GetCategoryCouponList;
      } else {
        param.pageindex = pageindex;
        delete param.categoryid;
        api = GetAllCouponList;
      }
      //   if(!params.pageindex) return

      api(param)
        .then(res => {
          //  console.log("入参", params);
          if (res && res.list && res.list.length > 0) {
            if (pageindex === 1) _.couponInfo = res.list;
            else _.couponInfo = _.couponInfo.concat(res.list);

            _.$nextTick(() => {
              _.getStickyTop();
            });
            // "platformtype":平台类型 0平台 1店铺  2商品 3定向,
            // "isgeted":是否领取过（0可领，1不可领）,
            // "isovercount":是否超过总发送量(0  未超过 可领，1  已超过 不可领)}
            setTimeout(() => {
              _.scrollBtom = true;
            }, 1000);
            _.hasData = true;
            _.pageParams.isend =
              res.pageindex * res.pagesize >= res.sumcount &&
              _.couponInfo.length > 0;
          } else {
            _.pageParams.isend = false;
            _.hasData = false;
            _.scrollBtom = false;
          }
          _.pageParams.loading = false;
        })
        .catch(e => {
          _.pageParams.loading = false;
          _.hasData = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    // 领取优惠券
    getCoupon(item, index) {
      let _ = this;
      if (_.userInfo && _.userInfo.token) {
        if (item.isgeted) {
          _.toast("已领取");
        } else if (item.isovercount) {
          _.toast("已领完");
        } else {
          GetCoupon({ id: item.id })
            .then(res => {
              _.co = [];
              _.couponInfo[index] = res;
              _.toast("您已领取成功！优惠券已放置于您的个人中心-卡券中！");
              // _.GetCouponList();
            })
            .catch(e => {
              if (e) _.toast(e.msg);
            });
        }
      }else{
          _.$router.push('/login')
      }
    },
    // tab 切换
    tabSwitch(i) {
      let _ = this;
      _.ActTabcategoryid = _.tabList[i].id;
        _.reset()
      _.togglePanel(i);
    },
    // tab 滑动
    carouselChange(swiper) {
      //   console.log("swiper参数", swiper.activeIndex);
      let _ = this,
        i = swiper.activeIndex;
    //   _.ActTabcategoryid = _.tabList[i].id;
    //   _.togglePanel(i);
      //   _.couListSwiper.slideTo(_.tabCurIndx);
    },
    // 优惠券 左右滑动
    copChange(swiper) {
      let _ = this,
        i = swiper.activeIndex;
      _.ActTabcategoryid = _.tabList[i].id;
      if(_.tabCurIndx != i)_.togglePanel(i);
      
    },
    togglePanel(index, scroll = true) {
      index = isNaN(index) ? 0 : index;
      let _ = this;
      // console.log("tabCurIndx======>", _.tabCurIndx, index, "type");
      if (_.tabCurIndx === index) {
        if (scroll)
          _.$nextTick(() => {
            scrollTo(0, _.tabTop);
          });
        return;
      }
      _.hasData = true
      _.scrollBtom = false;
      _.reset();
      _.tabCurIndx = index;

      _.GetCouponList();
      _.couListSwiper.slideTo(index, 100, false);
      _.tabsSwiper.slideTo(index, 100, false);

      if (scroll)
        _.$nextTick(() => {
          scrollTo(0, _.tabTop);
        });
    },
    // 店铺首页
    goshop(businessid) {
      this.$router.push("/shop/shopdetail/" + businessid + "?couponCenter=1");
    },
    // 重置
    reset() {
      let _ = this;
      _.pageParams.pageindex = 1;
      _.pageParams.isend = false;
      _.pageParams.loading = false;
      _.couponInfo = [];
    },
    loadmore() {
      if (this.pageParams.isend === true) {
        this.toast("已无更多");
      } else if (this.scrollBtom) {
        this.pageParams.pageindex += 1;
        this.GetCouponList();
      }
    },

    getStickyTop() {
      let _ = this;
      let $tab = document.querySelector(".tab-top");
      let top = $tab.getBoundingClientRect().y;
      if (top < 280) {
        window.scrollTo(0, 0);
        top = $tab.getBoundingClientRect().y;
        window.scrollTo(0, top);
      }
      _.tabTop = top;
    }
  }
};
</script>
<style scoped lang="scss">
/deep/ .cou_unit .cou_left{
    color: #fff;
}
/deep/ .cou_unit .cou_left.isgeted .desc{
    color: #999;
}
.img {
  display: block;
}
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.banner img {
  display: block;
}
#app .swiper-container.tab-top {
  text-align: center;
  box-shadow: 0 1px 10px rgb(230, 222, 222);
  position: sticky;
  top: 0;
  z-index: 2;
  background: #fff;
}
#coupon-wrap .swiper-container {
  margin-bottom: 8px;
  text-align: left;
}
.tab-item {
  color: #ccc;
  font-size: 14px;
  position: relative;
  padding: 15px 0;
  text-align: center;
}
.tab-item.active {
  color: #333;
}
.tab-item.active::after {
  content: "";
  width: 20px;
  height: 4px;
  border-radius: 2px;
  position: absolute;
  left: 50%;
  bottom: 5px;
  transform: translateX(-50%);
  background: #707afc;
}
.coupon-list {
  padding: 0 8px;
}
.cal-cou .content {
  position: relative;
  /* margin-bottom: 8px; */
  min-height: 100px;
}
.cal-item {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.cal-item .cal-face-val {
  width: 79%;
  padding: 8px 15px;
}
.cal-item .cal-face-val .pro-img {
  width: 30%;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}
.cal-item .cal-face-val .pro-img img {
  display: block;
}
.cop-info {
  width: 70%;
  margin-left: 8px;
  font-size: 10px;
}
.cop-info .title {
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}
.cop-info .title .titlecn {
  font-size: 16px;
  color: #333;
  font-weight: bold;
}
.face-valve-info {
  color: #666;
}
.face-valve-info .money {
  /* color: #3898c2; */
  margin-right: 5px;
  min-width: 27.5%;
}
.men-kan {
  line-height: 20px;
  /* color: #3898c2; */
}
.face-valve-info .money span {
  font-size: 30px;
  font-weight: bold;
  font-family: "BASE_PRICE";
}
.face-valve-info .doorsill {
  width: 50%;
}
.shop-icon i {
  width: 30px;
  height: 14px;
}
.cal-item .cal-date {
  width: 21%;
  font-size: 12px;
  color: #333;
}
.cal-item .cal-date .past-due {
  text-align: center;
  margin-bottom: 4vw;
  width: 80%;
}
.cal-item .cal-date .get-btn {
  color: #fff;
  padding: 2px 5px;
  /* background: #3898c2; */
  border-radius: 10px;
  font-size: 10px;
}
.cal-item .cal-date .get-btn.getover {
  background: #cccccc;
}
.cal-item .cal-date .get-btn.nowget-blur {
  background: #fd685d;
}
.cal-item .cal-date .get-btn.nowget-red {
  background: #419cc4;
}
.cal-item .cal-date .get-btn.hasget {
  background: none;
  border: 1px solid #ccc;
  color: #666;
}
.nodata {
  font-size: 15px;
  color: #333;
  margin: 80px auto;
  width: 105px;
}
.nodata img {
  margin-bottom: 35px;
}
</style>

