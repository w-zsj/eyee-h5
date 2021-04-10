<template>
  <div>
    <v-header :bg="'back'">
    </v-header>
    <div class="coupon_page">
      <img :src="couponBg|https" alt="">
      <div v-if="platformCoupons&&platformCoupons.length>0" class="plat_coupon">
        <p class="title_coupon clearfix">平台优惠券</p>
        <div class="coupon_lists clearfix">
          <CouponUnit v-for="(item,index) in platformCoupons" :key="index" :cous="item"></CouponUnit>
        </div>
      </div>
      <div v-if="businessCoupons&&businessCoupons.length>0">
        <p class="title_coupon businessC clearfix">商家优惠券</p>
        <div class="list_shops clearfix" v-for="(bus,indB) in businessCoupons" :key="indB">
          <div class="logo_buss" @click.stop="gotoShopDetl(bus.businessid,bus.businessname)">
            <img v-lazy="https(bus.businesslogo)" alt="">
            <span class="img_bg"></span>
            <p class="bus_name flex-center font-price">
              <!-- <span class="mall_brandShop" :class="{'mall_buyers':bus.businesstype == 2}">{{bus.businesstype == 2?'买手店':'品牌店'}}</span> -->
              <i class='tilt' :class="bus.businesstype===3?'ico-sp-store':(bus.businesstype===2?'ico-sp-buy':'ico-sp-official')"></i>
              <span class="name_businessname"> {{bus.businessname}}</span>
            </p>
          </div>
          <div class="coupon_lists clearfix">
            <div v-for="lis in bus.coupons" :key="lis.id" @click="getCoupon(lis)">
              <CouponUnit :cous="lis"></CouponUnit>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { GetCouponGroup } from '../../common/api/marketing'
import CouponUnit from '../templates/CouponUnit'
export default {
  components: { CouponUnit },
  data() {
    return {
      couponBg: '',
      platformCoupons: [],
      businessCoupons: []
    }
  },
  mounted() {
    this.getAllCounpons()
  },
  methods: {
    getAllCounpons() {
      GetCouponGroup()
        .then(res => {
          // console.log('allCounpon',res);
          // this.initShare({type:2, info: { title:res.share.title,img:res.share.icon,desc:res.share.content} });
          if (res && res.list.length > 0) {
            this.couponBg = res.banner
            this.businessCoupons = res.list
            for (var i = 0; i < res.list.length; i++) {
              if (res.list[i].isplatform) {
                this.platformCoupons = res.list[i].coupons
                this.businessCoupons.splice(i, 1)
              }
            }
          }
          console.log('平台券', this.platformCoupons)
          console.log('店铺券', this.businessCoupons)
        })
        .catch(e => {
          console.error('GetCouponGroup error', e)
          this.toast('网络繁忙！请稍后再试')
        })
    },
    gotoShopDetl: function (id, name) {
      console.log(id)


      this.$router.push('/shop/shopdetail/' + id)
    },
    getCoupon(item) {

    }
  },
  computed: {}
}
</script>
<style scoped>
.nav-top {
  background: transparent !important;
}
.coupon_page {
  background: #fff;
  margin-top: -48px;
}
.coupon_page > img {
  display: block;
  margin-bottom: 10px;
}
.coupon_page > div {
  margin: 0 10px;
}
.title_coupon {
  position: relative;
  color: #000;
  font-size: 15px;
  height: 25px;
  line-height: 25px;
  padding-left: 8px;
  margin-bottom: 10px;
}
.title_coupon:before {
  content: '';
  position: absolute;
  top: 5px;
  left: 0;
  display: inline-block;
  width: 1px;
  height: 14px;
  border-left: 2px solid #e0696b;
}
.title_coupon.businessC:before {
  border-color: #f1bc2b;
}
.list_shops {
  margin-bottom: 10px;
}
.logo_buss {
  position: relative;
  height: 80px;
  overflow: hidden;
  margin-bottom: 10px;
  border-radius: 4px;
  background: #444;
}
.logo_buss > img {
  position: absolute;
  min-height: 100%;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
}
.logo_buss .img_bg {
  display: inline-block;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(3, 3, 3, 0.3);
}
.logo_buss > .bus_name {
  position: absolute;
  /* text-align: center; */
  top: 50%;
  left: 20%;
  /* margin-left: -23px; */
  margin-top: -12px;
  width: 60%;
  /* height: 16px; */
  line-height: 24px;
  color: #fff;
  white-space: nowrap;
}
.logo_buss > .bus_name > span {
  font-size: 11px;
}
.logo_buss > .bus_name .name_businessname {
  font-size: 22px;
}
.coupon_lists .cou_unit {
  float: left;
  width: 50%;
}
</style>
