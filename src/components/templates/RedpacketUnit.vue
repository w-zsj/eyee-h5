<template>
  <!-- <div v-if="redPac&&redPac.price" class="cou_unit flex-aic" :class="{setColot:status&&status!=0,order_coupons:couType==2}" @click="getCoupons(redPac)"> -->
     <div v-if="redPac&&redPac.price" class="cou_unit flex-aic" :class="{setColot:status&&status!=0,order_coupons:couType==2}" @click="redpacketGohome">
    <img :src="redPac.src|https" alt="">
    <div v-if="redPac.nearlyexpire&&redPac.nearlyexpire==1" class="cpn-soonover">
      <p class="overdue-text">快到期</p>
    </div>
    <section class="cou_left" :class='{isgeted:redPac.isgeted||redPac.isovercount,canUse:status==0}'>
      <p class="font-price fac" v-if="couType!=2" :class="{'coulistCol':couType == 0,isgeted:redPac.isgeted||redPac.isovercount}">
        <!--,'getColor':(redPac.isgeted==1&&redPac.isovercount==0&&couType!=2)||(redPac.isgeted==0&&redPac.isovercount==1&&couType!=2)-->
        <span>¥</span> {{redPac.price}}
        <!-- {{redPac.price|tofixed}} -->
        <!-- <span>.00</span> -->
      </p>
      <p class="fac" v-if="couType==2">
        <span>¥{{redPac.price}} </span>
      </p>
      <!-- <p class="desc" v-if="couType !=0">
        {{redPac.usedesc}}
      </p> -->
    </section>
    <section v-if="couType !=0" class="cou_right" :style="[couType==2?redPac.titleStyle:'']">
      <p :style="[redPac.titleStyle]" v-if="couType!=2" class="name_coupon ellipsis">{{redPac.name?redPac.name:'斗牛全平台'}}</p>
      <div :style="[redPac.bgColor]" class="over-due" :class="(redPac.nearlyexpire&&redPac.nearlyexpire==1)?'over-due-top':''" >
        <p class="overdue-text">立即使用</p>
      </div>
      <!-- <div v-if="status != 0" class="over-time">
        <p class="overdue-text">已过期</p>
      </div>
      <div :style="[redPac.bgColor]" v-if="!redPac.isgeted && !redPac.isovercount && couType!=2&&redPac.platformtype!=0&&redPac.platformtype!=1" class="over-due">
        <p class="overdue-text">立即领取</p>
      </div>
      <div  v-if="redPac.isgeted&&couType!=2" class="over-time">
        <p class="overdue-text">已领取</p>
      </div>
      <div style="background:#ccc;color:#fff;border: 1px solid #ccc" v-if="redPac.isovercount&&couType!=2" class="over-time">
        <p class="overdue-text">已领完</p>
      </div> -->
      <p :class="{seleicon:seleIcon}">{{redPac.desc}}
        <span class="icon_sev icon_coupon_seled" v-if="seleIcon"></span>
      </p>
      <p class="desc ellipsis" v-if="couType!=2&&!showPeriod">{{redPac.limitdesc}}</p>
      <p class="desc des_time" v-if="couType==1||showPeriod">有效期：{{redPac.starttime|setdata}}-{{redPac.endtime|setdata}}</p>
      <p class="desc check_order_time" v-if="couType==2">{{redPac.endtime|setdata}}到期</p>
    </section>
    <section v-else class="cou_right coup_lis">
      <p :style="[redPac.titleStyle]" class="name_coupon ellipsis">
        <span v-if="redPac.platformtype == 0">斗牛全平台</span>
        <span v-if="redPac.platformtype == 1">店铺券</span>
        <span v-if="redPac.platformtype == 2">商品券</span>
      </p>
      <p class="desc ellipsis">
        {{redPac.usedesc}}
      </p>
    </section>
    <span class="getedLogo" v-if="redPac.isgeted&&!redPac.isovercount&&couType!=2">
      <i class="font_small">已领取</i>
    </span>
    <span class="getedLogo" v-if="!redPac.isgeted&&redPac.isovercount&&couType!=2">
      <i class="font_small">已领完</i>
    </span>
  </div>
  <div v-else></div>
</template>
<script>
import { DateFormat } from '../../common/util' // , _getDate
import { GetCoupon } from '../../common/api/marketing'
// import { UserOrderCoupon } from '../../common/api/order'
import { mapGetters } from 'vuex'
export default {
  props: {
    redpec: Object,
    couType: { type: Number, default: 0 }, // 0是普通优惠选模板 1用户优惠券模板2下单结算优惠券模板 3商品详情优惠券模板
    status: { type: Number, default: 0 },
    seleIcon: { type: Boolean, default: false }, // 选中优惠券的列表选中图标
    showPeriod: { type: Boolean, default: false }
  },
  data() {
    return {
      couponRedpacket: '//files.eyee.com/mcdn/static/coupon/plat_red.png',
      couponGet: 'https://files.eyee.com/mcdn/static/coupon/plat_default.png', // require('../../assets/img/coupon_get.png'),
      isShowModal: false

    }
  },
  computed: {
    ...mapGetters({ user: 'userInfo' }),
    // user() {
    //   return JSON.parse(localStorage.getItem('currentUser'))
    // },
    redPac() {
      let co = this.redpec
      if (co) {
        if (co.isgeted == 1 || co.isovercount == 1 || (this.status && this.status != 0)) {
          co.src = this.couponGet
          co.titleStyle = { color: '#999' }
        } else {
          co.src = this.couponRedpacket
          co.titleStyle = { color: '#E34104' }
          co.bgColor = { background: '#E34104'}
        }
        let isInt =/(^[0-9]*[1-9][0-9]*$)/.test(co.price)
        co.price = isInt?co.price:co.price.toFixed(1)
        return co
      }
    }
  },
  // mounted() {
  // "evtcoupon"礼券列表(null时表示没有):
  // [{"couponid":礼券标识,
  // "title":礼券外文标题,
  // "name":礼券中文标题,
  // "platformtype":平台类型 0平台 1店铺  2商品 3定向 4红包,
  // "price":礼券面值,
  // "usecondition":礼券使用限额,
  // "usedesc":礼券使用限制描述,
  // "limitdesc":"限制描述(小字部分)",
  // "businessid":发放礼券商家标识(platformtype=1时肯定有值),
  // "businessname":商家名(platformtype=1时肯定有值),
  // "starttime":礼券有效起始时间,
  // "endtime":礼券有效结束时间,
  // "isgeted":是否领取过（0可领，1不可领）,
  // "isovercount":是否超过总发送量(0  未超过 可领，1  已超过 不可领)}
  // "noactivity":"不参与的活动，空或null时 无，有0不使用优惠券，有1不包邮，竖线隔开"
  // },
  filters: {
    setdata(time) {
      if (time) {
        return DateFormat(time, 'yyyy.M.d')
      }
    }
  },
  methods: {
    getCoupons(c) {
      let _ = this
      // console.log(_.couType)
      if (_.couType == 0 || _.couType == 3) {
        // console.log(c.isovercount)
        if (c.isgeted) _.toast('您已经领取过了!')
        else {
          if (c.isovercount) _.toast('已被领完咯!')
          else {
            if (!_.user.token) {
              _.$router.push('/login')
              return
            }
            GetCoupon({ id: c.id })
              .then(res => {
                // console.log(res)
                _.toast('您已领取成功！优惠券已放置于您的个人中心-卡券中！')
              })
              .catch(e => {
                console.error(e)
                _.toast(e.msg)
                if (e.code === 1511811) c.isgeted = true
                else if (e.code === 1511810) c.isovercount = true
              })
          }
        }
      }
    } ,
    redpacketGohome(){
      this.$router.push('/')
    }
    // couponList() {
    // UserOrderCoupon({ token: this.user.token }).then((res) => {
    //     let [canUseCoupon, unCanUseCoupon] = [[], []]
    //     console.log('礼券列表', res)
    //     if (res && res.length > 0) {
    //       for (var i = 0; i < res.length; i++) {
    //         // 判断是否在使用时间内
    //         var today = _getDate(new Date()).getTime()
    //         var start = _getDate(res[i].starttime).getTime()
    //         var end = _getDate(res[i].endtime).getTime()
    //         res[i].isUse = (today >= start && today <= end) ? true : false;
    //         var t = res[i]

    //         if (t.platformtype != 2) {
    //           if (t.isUse && t.usestatus == 0 && (t.businessid == this.orderItem.businessid || t.platformtype == 0 || t.platformtype == 3)) {
    //             if (t.usecondition <= this.orderItem.allPay && this.orderItem.allPay >= t.price) {
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
    //       //     return b.price - a.price
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
}
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
.cpn-soonover {
  z-index: 20;
  position: absolute;
  top: 1vw;
  right: 8.6vw;
  width: 49px;
  height: 20px;
  padding: 2px;
  font-size: 11px;
  color: #fff;
  background-color: #FFA6A6;
  text-align: center;
}
.cpn-soonover::after {
  content: '';
  position: absolute;
  right: 0.01vw;
  width: 49px;
  height: 14px;
  top: 16px;
  background: linear-gradient(45deg, transparent 50%, #FFA6A6 50%),
  linear-gradient(135deg, #FFA6A6 50%, transparent 50%);
  background-size: 6px 7px;
  background-repeat: repeat-x;
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
  margin-top: 0vw;
  margin-bottom: 3vw;
  width: 32vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.cou_left {
  /* width: 40%; */
  width: 36%;
  text-align: center;
  left: 0;
}

.cou_right {
  width: 65%;
  right: 0;
  /* color: #333; */
  color: #666;
  padding: 0 15px;
  font-size: 14px;
}

.cou_left .fac {
  font-size: 30px;
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
  /* color: #666; */
   color: #999;
}
.cou_left .fac.getColor {
  /* color: #666; */
   color: #999 !important;
}
.cou_left .fac.coulistCol span {
  font-size: 11px;
}
.cou_right .desc {
  margin: 0;
}

.cou_unit.isgeted {
  /* color: #666; */
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
 /* color: #666; */
   color: #999;
}

.canUse {
  color: #fff;
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
  text-align: center;
  color: #fff;
  font-size: 11px; */
   z-index: 20;
  position: absolute;
  top: 0vw;
  right: 6.5vw;
  width: 67px;
  height: 20px;
  text-align: center;
  font-size: 10px;
  color: #fff;
  border-radius: 12px;
  line-height: 20px;
}
.over-due-top{
  top: 3vw;
}
/* .over-time{
  z-index: 20;
  position: absolute;
  top: 9px;
  right: 6.5vw;
  width: 67px;
  height: 20px;
  text-align: center;
  font-size: 10px;
  color: #999;
  border-radius: 12px;
  border: 1px solid #999;
  line-height: 20px;
} */

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
  /* color: #666; */
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
</style>
