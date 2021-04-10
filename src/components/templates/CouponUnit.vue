<template>
  <div
    v-if="realCou&&realCou.facevalue"
    class="cou_unit flex-aic"
    :class="{setColot:realCou.usestatus&&realCou.usestatus!=0,order_coupons:couType==2}"
    @click="getCoupons(realCou)"
  >
    <img :src="realCou.src|https" alt />
    <!-- <div v-if="realCou.useendtime&&isOverdue" class="cpn-soonover" :class="[realCou.cpnColor]">
      <p>快过期</p>
    </div> -->
    <section class="cou_left" :class="{isgeted:realCou.isgeted||realCou.isovercount,canUse:realCou.usestatus==0,'detail':couType==3}">
      <p class="font-price fac" v-if="couType!=2" :class="{'coulistCol':couType == 0,isgeted:realCou.isgeted||realCou.isovercount}">
        <!--,'getColor':(realCou.isgeted==1&&realCou.isovercount==0&&couType!=2)||(realCou.isgeted==0&&realCou.isovercount==1&&couType!=2)-->
        <span>¥</span>
        {{realCou.facevalue}}
        <!-- <span>.00</span> -->
      </p>
      <p class="fac" v-if="couType==2">
        <span>¥{{realCou.facevalue}}</span>
      </p>
      <!-- <p class="desc" v-if="couType !=0">{{realCou.usedesc}}</p> -->
    </section>
    <section
      v-if="couType !=0"
      class="cou_right"
      :class="{'detail':couType==3}"
      :style="[couType==2?realCou.titleStyle:'']"
    >
      <!-- <p :style="[realCou.titleStyle]" v-if="couType!=2" class="name_coupon ellipsis">{{realCou.businessname?realCou.businessname:'斗牛全平台'}}</p> -->
      <!-- <p
        v-if="couType!=2"
        class="name_coupon ellipsis"
      >{{realCou.platformtype==1||realCou.platformtype==2?realCou.businessname:realCou.titlecn}}</p> -->
      <!-- <div
        :style="[realCou.bgColor]"
        v-if="realCou.usestatus==0"
        class="over-due"
        :class="{'over-due-top':realCou.useendtime&&isOverdue,'new-btn':couType==3}"
      > -->
        <!-- <p class="overdue-text" :class="{'new-btn':couType==3}">立即使用</p> -->
      <!-- </div> -->
      <!-- <div v-if="realCou.usestatus==2" class="over-time">
        <p class="overdue-text">已过期</p>
      </div>-->
      <div
        :style="[realCou.titleStyle]"
        style="right:5vw"
        v-if="!realCou.isgeted && !realCou.isovercount && couType!=2&&realCou.usestatus!=0&&realCou.usestatus!=1&&realCou.usestatus!=2"
        class="over-due get"
        :class="{'new-btn':couType==3}"
      >
        <p class="overdue-text">立即领取</p>
      </div>
      <div v-if="realCou.isgeted&&couType!=2" class="over-time" :class="{'new-btn':couType==3}">
        <p class="overdue-text">已领取</p>
      </div>
      <div
        style="background:#ccc;color:#fff;border: 1px solid #ccc"
        v-else-if="realCou.isovercount&&couType!=2"
        class="over-time"
        :class="{'new-btn':couType==3}"
      >
        <p class="overdue-text">已领完</p>
      </div>
      <p :class="{seleicon:seleIcon}" v-if="realCou.platformtype == 1||realCou.platformtype == 2">
        {{realCou.titlecn}}
        <span
          :style="[realCou.bgColor]"
          class="icon_sev icon_coupon_seled"
          v-if="seleIcon"
        ></span>
      </p>
      <p :class="{seleicon:seleIcon}" v-else>
        <!-- 适用品类: -->
        {{realCou.desc}}
        <span
          :style="[realCou.bgColor]"
          class="icon_sev icon_coupon_seled"
          v-if="seleIcon"
        ></span>
      </p>
      <p class="desc des_time">{{realCou.usebegintime|setdata}}至{{realCou.useendtime|setdata}}</p>
      <!-- <p class="desc ellipsis" v-if="couType!=2&&!showPeriod">{{realCou.limitdesc}}</p> -->
      <!-- <p class="desc des_time" v-if="couType==1||showPeriod">有效期：{{realCou.usebegintime|setdata}}-{{realCou.useendtime|setdata}}</p> -->
      <!-- <p class="desc check_order_time" v-if="couType==2">{{realCou.useendtime|setdata}}到期</p> -->
    </section>
    <section v-else class="cou_right coup_lis">
      <p :style="[realCou.titleStyle]" class="name_coupon ellipsis">
        <span v-if="realCou.platformtype == 0">斗牛全平台</span>
        <span v-if="realCou.platformtype == 1">店铺券</span>
        <span v-if="realCou.platformtype == 2">商品券</span>
      </p>
      <p class="desc ellipsis">{{realCou.usedesc}}</p>
    </section>
    <!-- <span class="getedLogo" v-if="realCou.isgeted&&!realCou.isovercount&&couType!=2">
      <i class="font_small">已领取</i>
    </span>
    <span class="getedLogo" v-if="!realCou.isgeted&&realCou.isovercount&&couType!=2">
      <i class="font_small">已领完</i>
    </span>-->
  </div>
  <div v-else></div>
</template>
<script>
import { DateFormat, DateDiff } from "../../common/util"; // , _getDate
import { GetCoupon } from "../../common/api/marketing";
// import { UserOrderCoupon } from '../../common/api/order'
import { mapGetters } from "vuex";
export default {
  props: {
    cous: Object,
    isOverdue: { type: Boolean, default: false },
    couType: { type: Number, default: 0 }, // 0是普通优惠选模板 1用户优惠券模板2下单结算优惠券模板 3商品详情优惠券模板
    seleIcon: { type: Boolean, default: false }, // 选中优惠券的列表选中图标
    showPeriod: { type: Boolean, default: false }
  },
  data() {
    return {
      couponRedpacket: "//files.eyee.com/mcdn/static/coupon/plat_red.png",
      // couponEyee: '//files.eyee.com/mcdn/static/img/coupon_eyee.png', // require('../../assets/img/coupon_eyee.png'),
      couponEyee: "//files.eyee.com/mcdn/static/coupon/plat_platform.png", // require('../../assets/img/coupon_eyee.png'),
      couponProduct: require('../../assets/img/bigcoupon.png'),
      // this.couType === 3
      //   ? "https://files.eyee.com/mcdn/img/prddetail/image_coupon.png"
      //   : "//files.eyee.com/mcdn/static/coupon/plat_product.png", // require('../../assets/img/coupon_product.png'),
      couponShop: require('../../assets/img/bigcoupon.png'),
      // this.couType === 3
      //   ? "https://files.eyee.com/mcdn/img/prddetail/image_coupon.png"
      //   : "//files.eyee.com/mcdn/static/coupon/plat_shop.png", // require('../../assets/img/coupon_shop.png'),
      couponGet: require('../../assets/img/bigcoupon.png'),
      // this.couType === 3
      //   ? "https://files.eyee.com/mcdn/img/prddetail/image_coupon.png"
      //   : "//files.eyee.com/mcdn/static/coupon/plat_default.png", // require('../../assets/img/coupon_get.png'),
      couponGeted: "//files.eyee.com/mcdn/static/img/geted.png", // require('../../assets/img/geted.png'),
      // couponOver: '//files.eyee.com/mcdn/static/img/coupon_over.png', // require('../../assets/img/coupon_over.png'),
      couponOver: require('../../assets/img/bigcoupon.png'),
      // this.couType === 3
      //   ? "https://files.eyee.com/mcdn/img/prddetail/image_coupon.png"
      //   : "//files.eyee.com/mcdn/static/coupon/plat_default.png",
      isShowModal: false,
      couData: {}
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    // user() {
    //   return JSON.parse(localStorage.getItem('currentUser'))
    // },
    realCou() {
      let co = this.couData;
      if (co) {
        if (
          co.isgeted == 1 ||
          co.isovercount == 1 ||
          (co.usestatus && co.usestatus != 0)
        ) {
          co.src = this.couponGet;
          co.titleStyle = { color: "#999" };
        } else if (0) {
          // 红包
          co.src = this.couponRedpacket;
          co.titleStyle = { color: "#CA410D" };
          co.cpnColor = "cpn-red";
        } else {
          // 优惠券
          switch (co.platformtype) {
            case 0:
              co.src = this.couponEyee;
              co.titleStyle = { color: "#707AFC" };
              co.bgColor = { background: "#707AFC" };
              co.cpnColor = "cpn-plat";

              break;
            case 1:
              co.src = this.couponShop;
              co.titleStyle = { color: "#C8AF6E" };
              co.bgColor = { background: "#C8AF6E" };
              co.cpnColor = "cpn-shop";
              break;
            case 2:
              co.src = this.couponProduct;
              co.titleStyle = { color: "#3898c2" };
              co.bgColor = { background: "#3898c2" };
              co.cpnColor = "cpn-product";
              break;
            case 3:
              co.src = this.couponEyee;
              // co.titleStyle = { color: '#e26868' }
              // co.bgColor = {  background: '#e26868' }
              co.titleStyle = { color: "#707AFC" };
              co.bgColor = { background: "#707AFC" };
              co.cpnColor = "cpn-plat";
              break;
            default:
              break;
          }
        }
        return co;
      }
    }
  },
  mounted() {
    this.couData = this.cous;
  },
  // mounted() {
  // "evtcoupon"礼券列表(null时表示没有):
  // [{"couponid":礼券标识,
  // "title":礼券外文标题,
  // "titlecn":礼券中文标题,
  // "platformtype":平台类型 0平台 1店铺  2商品 3定向,
  // "facevalue":礼券面值,
  // "usecondition":礼券使用限额,
  // "usedesc":礼券使用限制描述,
  // "limitdesc":"限制描述(小字部分)",
  // "businessid":发放礼券商家标识(platformtype=1时肯定有值),
  // "businessname":商家名(platformtype=1时肯定有值),
  // "usebegintime":礼券有效起始时间,
  // "useendtime":礼券有效结束时间,
  // "isgeted":是否领取过（0可领，1不可领）,
  // "isovercount":是否超过总发送量(0  未超过 可领，1  已超过 不可领)}
  // "noactivity":"不参与的活动，空或null时 无，有0不使用优惠券，有1不包邮，竖线隔开"
  // },
  filters: {
    setdata(time) {
      if (time) {
        return DateFormat(time, "yyyy.M.d");
      }
    }
  },
  methods: {
    getCoupons(c) {
      let _ = this;
      // console.log(_.couType)
      if (_.couType == 0 || _.couType == 3) {
        // console.log(c.isovercount)
        if (c.isgeted) _.toast("达到限制");
        else {
          if (c.isovercount) _.toast("已被领完咯!");
          else {
            if (!_.user.token) {
              _.$router.push("/login");
              return;
            }
            GetCoupon({ id: c.id })
              .then(res => {
                // console.log(res)
                _.couData = {};
                _.couData = res;
                _.toast("领取成功");
              })
              .catch(e => {
                console.error(e);
                _.toast(e.msg);
                if (e.code === 1511811) c.isgeted = true;
                else if (e.code === 1511810) c.isovercount = true;
              });
          }
        }
      }
    },
    overDue(t) {
      let soonover = DateDiff({ type: "d", destination: t });
      if (soonover && soonover.d > 3) return false;
      else return true;
      // let endtime = t;
      // var str = Date.parse(new Date(endtime));
      // var timenow = Date.parse(new Date());
      // var timediffer = str - timenow;
      // if(timediffer <= 0) { // 已过期
      //   return false;
      // } else if(timediffer < 259200000) { // 快到期
      //   return true;
      // } else {  // 非快到期
      //   return false;
      // }
    }

    // ,
    // couponList() {
    // UserOrderCoupon({ token: this.user.token }).then((res) => {
    //     let [canUseCoupon, unCanUseCoupon] = [[], []]
    //     console.log('礼券列表', res)
    //     if (res && res.length > 0) {
    //       for (var i = 0; i < res.length; i++) {
    //         // 判断是否在使用时间内
    //         var today = _getDate(new Date()).getTime()
    //         var start = _getDate(res[i].usebegintime).getTime()
    //         var end = _getDate(res[i].useendtime).getTime()
    //         res[i].isUse = (today >= start && today <= end) ? true : false;
    //         var t = res[i]

    //         if (t.platformtype != 2) {
    //           if (t.isUse && t.usestatus == 0 && (t.businessid == this.orderItem.businessid || t.platformtype == 0 || t.platformtype == 3)) {
    //             if (t.usecondition <= this.orderItem.allPay && this.orderItem.allPay >= t.facevalue) {
    //               canUseCoupon.push(t)
    //             }
    //           }
    //         } else {
    //           var productid = JSON.parse(t.goods.toString())[0].productid;
    //           var tid = ''
    //           if (this.fromType == 0) {
    //             tid = JSON.stringify(this.orderItem.item)
    //           } else {
    //             tid = this.orderItem.productid
    //           }
    //           console.log(this.orderItem)
    //           if (tid.indexOf(productid) >= 0 && t.isUse && t.usestatus == 0) {
    //             canUseCoupon.push(t)
    //           } else {
    //             unCanUseCoupon.push(t)
    //           }
    //         }
    //       }
    //       console.log('可以使用的券', canUseCoupon,canUseCoupon.length)
    //       console.log('不可以使用的券', unCanUseCoupon)
    //       // if (canUseCoupon.length > 1) {
    //       //   console.log('youyouoyouo')
    //       //   canUseCoupon.sort((a, b) => {
    //       //     return b.facevalue - a.facevalue
    //       //   })
    //       // }
    //       // this.$store.dispatch('setOrderCoupon', { 'canUseCoupon': canUseCoupon, 'unCanUseCoupon': unCanUseCoupon })
    //       // this.$store.state.order.selectedCoupon = canUseCoupon[0]
    //     }

    // }).catch((err) => {
    //   console.log(err)
    //   console.log('获取优惠券失败')
    // })
    // }
  }
};
</script>
<style scoped>
.cou_unit {
  width: 100%;
  /* height: 90px;  */
  margin-bottom: 5px;
  position: relative;
  /* z-index: 9; */
  overflow: hidden;
}

.cou_unit img {
  width: 100%;
  /* min-height: 100%; */
}

.cou_right,
.cou_left {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.cou_right p:nth-of-type(2) {
  /*margin: 2px 0;*/
}
.cou_right p.name_coupon {
  font-weight: 600;
  font-size: 16px;
  /* margin-top: 10px; */
  margin-bottom: 4%;
  width: 32vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.cou_right.detail p.name_coupon {
  color: #232323;
  font-weight: bold;
  font-size: 3.7333vw;
  margin-bottom: 11%;
}
.cou_right.detail p {
  color: #969696;
  font-size: 12px;
}
.cou_left {
  width: 35%;
  text-align: center;
  left: 0;
}
.cou_left.detail {
  width: 36%;
  padding-top: 5.066vw;
}
.cou_right.detail {
  width: 64%;
}
.cou_right {
  width: 67%;
  right: 0;
  color: #666;
  /* padding: 0 15px; */
  font-size: 14px;
}
.cou_left.detail .fac {
  color: #C8AF6E;
  font-size: 13.333vw;
  font-family: OswaldBold;
  white-space: nowrap;
  /* margin-bottom: 3vw; */
}
.cou_left.detail .desc {
  color: #b4b4b4;
  font-size: 3.2333vw;
}
.cou_left .fac {
  font-size: 30px;
  line-height: 25px;
  height: 25px;
  margin-bottom: 6vw;
}

.cou_left .fac span {
  font-size: 18px;
}

.desc {
  margin: 0 auto 0;
  font-size: 12px;
  width: 80%;
  white-space: wrap;
}
.cou_left .fac.coulistCol {
  color: #fff;
  font-size: 14px;
}
.cou_left .fac.coulistCol.isgeted {
  color: #999;
}
.cou_left .fac.getColor {
  color: #999 !important;
}
.cou_left .fac.coulistCol span {
  font-size: 11px;
}
.cou_right .desc {
  margin: 0;
}

.cou_unit.isgeted {
  color: #999;
}
.cou_right.coup_lis p.name_coupon,
.cou_right.coup_lis p.desc {
  font-size: 12px;
  margin: 0;
  text-align: left;
}
.cou_right.coup_lis p.name_coupon span {
  font-size: 12px;
}
.getedLogo {
  position: absolute;
  display: inline-block;
  width: 40px;
  height: 22px;
  background: url(//files.eyee.com/mcdn/static/img/geted.png) no-repeat;
  background-size: contain;
  right: 8%;
  top: 3px;
  font-size: 10px;
  text-align: center;
  line-height: 22px;
  color: #fff;
}

.getedLogo i {
  font-style: normal;
}

.isgeted {
  color: #999;
}

.canUse {
  color: #fff;
}
.cpn-soonover {
  z-index: 20;
  position: absolute;
  top: 3px;
  right: 10.3vw;
  width: 49px;
  height: 20px;
  padding: 1px;
  font-size: 11px;
  /* color: #fff; */
  color: #333;
  background-color: currentColor;
  text-align: center;
}
.cpn-soonover p {
  color: #fff;
}

.cpn-soonover.cpn-red {
  color: #ffa6a6;
}

.cpn-soonover.cpn-plat {
  color: #cdd1ff;
}

.cpn-soonover.cpn-shop {
  color: #fce0c1;
}

.cpn-soonover.cpn-product {
  color: #c4e2ef;
}

.cpn-soonover::after {
  content: "";
  position: absolute;
  right: 0.1vw;
  width: 49px;
  height: 14px;
  top: 17px;
  background: linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-size: 6px 7px;
  background-repeat: repeat-x;
}
.over-due {
  /* z-index: 20;
  position: absolute;
  top: 3px;
  right: 6vw;
  width: 42px;
  height: 20px;
  background-image: url("../../../static/img/overdue.png");
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  color: #fff;
  text-align: center;
  font-size: 11px;*/
  z-index: 20;
  position: absolute;
  top: 0vw;
  right: 8vw;
  width: 67px;
  height: 20px;
  text-align: center;
  font-size: 10px;
  color: #fff;
  border-radius: 12px;
  line-height: 20px;
}
.over-due-top {
  top: 3vw;
}
.over-time {
  z-index: 20;
  position: absolute;
  top: 1px;
  right: 8vw;
  width: 67px;
  height: 20px;
  text-align: center;
  font-size: 10px;
  color: #999;
  border-radius: 12px;
  border: 1px solid #999;
  line-height: 20px;
}

@media (max-width: 321px) {
  .cou_right p {
    font-size: 10px;
  }
  .cou_left .fac {
    font-size: 20px;
    line-height: 20px;
    height: 20px;
  }
}

.setColot {
  color: #999;
  height: auto;
}

.des_time {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
}

#app .order_coupons {
  font-size: 12px;
  position: relative;
  float: right;
}

#app .order_coupons .cou_left,
#app .order_coupons .cou_right {
  position: absolute;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#app .order_coupons .cou_right {
  right: 0;
}

#app .order_coupons .cou_left p,
#app .order_coupons .cou_left span {
  display: inline-block;
  height: 12px;
  font-size: 12px;
  -webkit-transform: scale(0.84, 0.84);
  *font-size: 10px;
}
#app .order_coupons .cou_left span {
  font-size: 16px;
}

#app .order_coupons .cou_left > p,
#app .order_coupons .cou_right > p {
  display: inline-block;
  height: 12px;
  line-height: 14px;
  text-align: center;
  width: 100%;
}

.seleicon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
}

.new-btn {
  position: absolute;
  border: 0;
  width: 17.6vw;
  height: 8.8vw;
  /* background: #cdcdcd; */
  /* border-radius: 2px; */
  line-height: 8.8vw;
  top: 50%;
  transform: translateY(-50%);
}
.over-due.new-btn {
  /* background: #fa2337 !important; */
  top: 50% !important;
  transform: translateY(-50%) !important;
}
.cou_right.detail .new-btn p {
  /* color: #fff !important; */
  color: #C8AF6E;
  font-size: 3.733vw;
  font-weight: bold;
}
</style>
