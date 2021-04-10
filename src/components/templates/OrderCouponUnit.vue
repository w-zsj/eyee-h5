<template>
  <div v-if="realCou&&realCou.facevalue" class="cou_unit flex-aic setColot">
    <img :src="realCou.src|https" alt="">
    <!-- <div v-if="realCou.useendtime&&isOverdue" class="cpn-soonover" :class="[realCou.cpnColor]"><p>快过期</p></div> -->
    <div class="cpn-soonover" :class="[realCou.cpnColor]" v-show="realCou.type == 2 "><p>{{realCou.isoverlay == 0?'不可叠加':'可叠加'}}</p></div>
    <section class="cou_left isgeted canUse" :style="(realCou.operationstatus == 1&&usable)?[realCou.titleStyle]:''">
      <p class="font-price fac" :class="{isgeted:realCou.isgeted||realCou.isovercount}">
        <span>¥</span> {{realCou.facevalue|tofixed}}
      </p>
      <p v-if="cous.type != 2" class="desc">
        {{realCou.usedesc}}
      </p>
    </section>
    <section class="cou_right">
      <p :style="[realCou.titleStyle]" class="name_coupon ellipsis">{{realCou.newname}}</p>
      <!-- <p :class="{seleicon:seleIcon}">{{realCou.titlecn}}<span v-show=" realCou.type == 2 ">(<span v-show="realCou.isoverlay == 0">不</span>可叠加)</span>
        <span style="transform: translateY(-10px);" class="icon_sev icon_coupon_seled" v-show="realCou.operationstatus == 0"></span>
      </p> -->
       <div :class="{seleicon:seleIcon}" >

         <span v-if="realCou.platformtype == 1||realCou.platformtype == 2">{{realCou.titlecn}}</span>
          <!-- 适用品类: -->
         <span v-else> {{realCou.desc}}</span>
        <div  class="check-style-bg" v-show="realCou.operationstatus == 0">
          <div class="check-style-unequal-width"></div>
        </div>
      </div>
      <p class="desc ellipsis" v-if="!showPeriod">{{realCou.limitdesc}}</p>
      <p class="desc des_time">有效期：{{realCou.usebegintime|setdata}}-{{realCou.useendtime|setdata}}</p>
    </section>
  </div>
  <div v-else></div>
</template>
<script>
import { DateFormat,DateDiff } from "../../common/util"; // , _getDate
import { GetCoupon } from "../../common/api/marketing";
// import { UserOrderCoupon } from '../../common/api/order'
import { mapGetters } from "vuex";
export default {
  props: {
    cous: Object,
    usable: { type: Boolean, default: true },
    isOverdue: { type: Boolean, default: false },
    seleIcon: { type: Boolean, default: false }, // 选中优惠券的列表选中图标
    showPeriod: { type: Boolean, default: false }
  },
  data() {
    return {
      // couponRedpacket: 'https://files.eyee.com/EYEE/icons/wx-coupon-packet.png',
      // couponEyee: '//files.eyee.com/mcdn/static/img/coupon_eyee.png', // require('../../assets/img/coupon_eyee.png'),
      // couponProduct: '//files.eyee.com/mcdn/static/img/coupon_product.png', // require('../../assets/img/coupon_product.png'),
      // couponShop: '//files.eyee.com/mcdn/static/img/coupon_shop.png', // require('../../assets/img/coupon_shop.png'),
      // couponGet: '//files.eyee.com/mcdn/static/img/coupon_get.png', // require('../../assets/img/coupon_get.png'),
      // couponGeted: '//files.eyee.com/mcdn/static/img/geted.png', // require('../../assets/img/geted.png'),
      // couponOver: '//files.eyee.com/mcdn/static/img/coupon_over.png', // require('../../assets/img/coupon_over.png'),
      // isShowModal: false

      couponRedpacket: "//files.eyee.com/mcdn/static/coupon/plat_red.png",
      // couponEyee: '//files.eyee.com/mcdn/static/img/coupon_eyee.png', // require('../../assets/img/coupon_eyee.png'),
      couponEyee: "//files.eyee.com/mcdn/static/coupon/plat_platform.png", // require('../../assets/img/coupon_eyee.png'),
      couponProduct: "//files.eyee.com/mcdn/static/coupon/plat_product.png", // require('../../assets/img/coupon_product.png'),
      couponShop: "//files.eyee.com/mcdn/static/coupon/plat_shop.png", // require('../../assets/img/coupon_shop.png'),
      couponGet: "//files.eyee.com/mcdn/static/coupon/plat_default.png", // require('../../assets/img/coupon_get.png'),
      couponGeted: "//files.eyee.com/mcdn/static/img/geted.png", // require('../../assets/img/geted.png'),
      // couponOver: '//files.eyee.com/mcdn/static/img/coupon_over.png', // require('../../assets/img/coupon_over.png'),
      couponOver: "//files.eyee.com/mcdn/static/coupon/plat_default.png",
      isShowModal: false
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    // user() {
    //   return JSON.parse(localStorage.getItem('currentUser'))
    // },
    realCou() {
      let co = this.cous;
      // console.log("组件中的优惠列表",co)
      if (co.operationstatus == 1 && this.usable) {
        switch (co.platformtype) {
          case 0:
            co.newname = co.titlecn;
            break;
          case 1:
            co.newname = co.businessname;
            break;
          case 2:
            co.newname = co.businessname;
            break;
          case 3:
            co.newname = co.titlecn;
            break;
          default:
            co.newname = co.titlecn || co.title;
            break;
        }
        co.src = this.couponGet;
        co.titleStyle = { color: "#999" };
        co.cpnColor = "cpn-default";
      } else if (co.type == 2) {
        // 红包
        // switch (co.platformtype || 0) {
        //   case 0:
        co.newname = co.titlecn;
        // co.src = this.couponRedpacket
        co.titleStyle = { color: "#CA410D" };
        co.bgColor = { background: "#CA410D" };
        co.cpnColor = "cpn-red";
        //     break
        //   case 1:
        //     co.newname = co.businessname
        //     // co.src = this.couponRedpacket
        //     co.titleStyle = { color: '#f2bd00' }
        //     co.bgColor = {  background: '#f2bd00' }
        //     break
        //   case 2:
        //     co.newname =  '商品券'
        //     // co.src = this.couponRedpacket
        //     // co.titleStyle = { color: '#CA410D' }
        //     co.titleStyle = { color: '#3898c2' }
        //     co.bgColor = {  background: '#3898c2' }
        //     break
        //   case 3:
        //     co.newname = co.titlecn
        //     // co.src = this.couponRedpacket
        //     co.titleStyle = { color: '#CA410D' }
        //     co.bgColor = {  background: '#CA410D' }
        //     co.cpnColor="cpn-red"
        //     break
        //   default:
        //     co.newname = co.titlecn || co.title
        //     // co.titleStyle = { color: '#CA410D' }
        //     // co.bgColor = {  background: '#CA410D' }
        //     co.titleStyle = { color: '#707AFC' }
        //     co.bgColor = {  background: '#707AFC' }
        //     co.cpnColor="cpn-plat"
        //     break
        // }
        co.src = this.couponRedpacket;
        // co.titleStyle = { color: '#CA410D' }
      } else if (co.type == 1) {
        // 优惠券
        switch (co.platformtype) {
          case 0:
            co.newname = co.titlecn;
            co.src = this.couponEyee;
            // co.titleStyle = { color: '#e26868' }
            co.titleStyle = { color: "#707AFC" };
            co.bgColor = { background: "#707AFC" };
            break;
          case 1:
            co.newname = co.businessname;
            co.src = this.couponShop;
            // co.titleStyle = { color: '#f2bd00' }
            co.titleStyle = { color: "#FFC700" };
            co.bgColor = { background: "#FFC700" };
            break;
          case 2:
            co.newname = co.businessname;
            co.src = this.couponProduct;
            co.titleStyle = { color: "#3898c2" };
            co.bgColor = { background: "#3898c2" };
            break;
          case 3:
            co.newname = co.titlecn;
            co.src = this.couponEyee;
            // co.titleStyle = { color: '#e26868' }
            co.titleStyle = { color: "#707AFC" };
            co.bgColor = { background: "#707AFC" };
            break;
          default:
            co.newname = co.titlecn || co.title;
            break;
        }
      }
      return co;
    }
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
        if (c.isovercount) _.toast("已被领完咯!");
        else {
          if (c.isgeted) _.toast("您已经领取过了!");
          else {
            if (!_.user.token) {
              _.$router.push("/login");
              return;
            }
            GetCoupon({ id: c.id })
              .then(res => {
                // console.log(res)
                _.toast("您已领取成功！优惠券已放置于您的个人中心-卡券中！");
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
      // if (timediffer <= 0) {
      //   // 已过期
      //   return false;
      // } else if (timediffer < 259200000) {
      //   // 快到期
      //   return true;
      // } else {
      //   // 非快到期
      //   return false;
      // }
    }
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
  margin-top: 10px;
  margin-bottom: 3%;
}
.cou_left {
  width: 40%;
  text-align: center;
  left: 0;
}

.cou_right {
  width: 65%;
  right: 0;
  color: #666;
  padding: 0 15px;
  font-size: 14px;
}

.cou_left .fac {
  font-size: 25px;
  line-height: 25px;
  height: 25px;
}

.cou_left .fac span {
  font-size: 18px;
}

.desc {
  margin: 10px auto 0;
  font-size: 12px;
  width: 80%;
  white-space: wrap;
}
.cou_left .fac.coulistCol {
  color: #fff;
  font-size: 14px;
}
.cou_left .fac.coulistCol.isgeted {
  color: #666;
}
.cou_left .fac.getColor {
  color: #666 !important;
}
.cou_left .fac.coulistCol span {
  font-size: 11px;
}
.cou_right .desc {
  margin: 0;
}

.cou_unit.isgeted {
  color: #666;
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
  color: #666;
}

.canUse {
  color: #fff;
}
.cpn-soonover {
  z-index: 20;
  position: absolute;
  top: 3px;
  right: 7.7vw;
  width: 54px;
  height: 20px;
  padding: 2px;
  font-size: 11px;
  background-color: currentColor;
  text-align: center;
}
.cpn-soonover p {
  color: #fff;
}
.cpn-soonover.cpn-default {
  color: #999;
}

.cpn-soonover.cpn-red {
  color: #ffa6a6;
}

.cpn-soonover::after {
  content: "";
  position: absolute;
  right: 0.1vw;
  width: 54px;
  height: 14px;
  top: 17px;
}

.cpn-soonover.cpn-red::after {
  background: linear-gradient(45deg, transparent 50%, #ffa6a6 50%),
    linear-gradient(135deg, #ffa6a6 50%, transparent 50%);
  background-size: 6px 7px;
  background-repeat: repeat-x;
}
.cpn-soonover.cpn-default::after {
  background: linear-gradient(45deg, transparent 50%, #999 50%),
    linear-gradient(135deg, #999 50%, transparent 50%);
  background-size: 6px 7px;
  background-repeat: repeat-x;
}

.over-due {
  z-index: 20;
  position: absolute;
  top: 3px;
  right: 6vw;
  width: 42px;
  height: 20px;
  background-image: url("../../../static/img/overdue.png");
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  text-align: center;
  color: #fff;
  font-size: 11px;
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
.check-style-bg {
  background: #707afc;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
}
.check-style-unequal-width {
  width: 5px;
  height: 10px;
  border-color: #ffff;
  border-style: solid;
  border-width: 0px 2px 2px 0;
  transform: rotate(45deg);
  margin-top: 3px;
}
</style>
