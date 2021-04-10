<template>
  <div v-if="!ill" :class="{isHeadHide:!$root.ISAPP}">
    <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3>订单结算</h3>
      </div>
    </v-header>
    <div class="main_info boxContent">
      <!--收货地址  -->
      <UserAddressUint :addressUnit="userDefaultAddress" :addressType="1"></UserAddressUint>
      <!--订单单元  -->
      <div v-if="getOrder.productitem">
        <div class="commodity">
          <img :src="getOrder.productitem.productimgurl">
          <div>
            <div class="ellipsis-2 productname">{{getOrder.productitem.productname}}</div>
          <div class="info">{{getOrder.productitem.color}},{{getOrder.productitem.size}},×{{getOrder.productitem.count}}</div>
          </div>
          <!-- 商品单价额 -->
          <div class="allMoney">¥{{(getOrder.productmoney)}}</div>
        </div>
      </div>
      <!--选择优惠券  -->
      <div class="check_coupons" @click.stop="goCoupon">
        <div class="flex-between">
          <p>
            选择优惠券:
            <span v-if="hasCoupon&&discounts.isusecoup&&(getOrder.paymoney-hasCoupon>0)">本券共为您节省</span>
          </p>
          <p>
            <span v-if="!discounts.isusecoup" style="color:#999">不使用优惠</span>
            <span v-else-if="(getOrder.productmoney-hasCoupon>0)&&hasCoupon>0">-¥{{hasCoupon}}</span>
            <span style="color: #969696;" v-else-if="!hasCoupon">您当前没有可用优惠券</span>
            <span v-else-if=" getOrder.productmoney-hasCoupon<=0" style="color:#999">优惠券不可用</span>
            <span class="right_icon"></span>
          </p>
        </div>
      </div>
      <!-- 配送费 -->
      <div class="logistics" v-if="defaultExpressList">
        <span>配送费用：{{defaultExpressList.name}}</span>
        <span
          style="font-size:14px;"
        >¥{{defaultExpressList.expressfee}}</span>
      </div>
      <div class="logistics">
        <label>合计费用</label>
        <span style="font-size: 18px;font-weight: bold;">¥{{getOrder.paymoney}}</span>
      </div>
    </div>
    
    <div class="other_info boxContent">
      <!--同意协议  -->
      <div class="protocol" v-if="rulesList&&rulesList.length>0">
        <div style="margin-bottom: 15px;">
          <img src="https://files.eyee.com/weapp/c2c/authenticate.png?i=123" alt>
        </div>
        <div class="rulesList" v-for="(item,index) in rulesList" :key="index" v-html="item"></div>
        <div class="ox-ball flex flex-btwn flex-aic" v-if="getOrder.newballs">
          <div class="info">确认收货后返</div>
          <div class="num flex flex-aic flex-star">
            <img src="//files.eyee.com/mcdn/img/ball/icon_ox.png" alt="">
            {{getOrder.newballs}}牛丸
          </div>
        </div>      
      </div>
    </div>
    <div class="boxContent">
      <div class="flex-aic" style="font-size: 13px; color: #646464;">
        <span class="checkbox flex-aic" @click="switchAgree">
          <img src="//files.eyee.com/mcdn/img/ball/icon_unchoose.png" v-show="!isAgree">
          <img src="//files.eyee.com/mcdn/img/ball/icon_choose.png" v-show="isAgree">
        </span>
        我已阅读并同意
        <span style="padding-left: 2.3333vw; color: #FA4B4B;" @click="goAgreement">交易须知</span>
      </div>
    </div>

    <!--底部  -->
    <div class="flex-between flex-center o_footer">
      <p class="flex flex-aic">
        <span class="info">合计支付：</span>
        <span class="pay_color font-price" v-if="getOrder.paymoney>=0" >
          <span class="ren">¥ </span>{{(getOrder.paymoney||0)}}
        </span>
      </p>
      <mt-button class="btn_total" :class="{unselected:!isAgree}" @click="payment">提交订单</mt-button>
    </div>

    <model confirmText="确认" @confirm="goBack" v-show="css.showNoStock">
      <div class="model-content">手速太慢，该价格已被他人收入囊中，请重新挑选商品</div>
    </model>

    <model
      confirmText="我再想想"
      cancelText="去意已决"
      @cancel="goBack"
      @confirm="showBackModel"
      v-show="css.showBack"
    >
      <div class="model-content">我这么抢手，你真的不再想想～</div>
    </model>

    <Pay
      v-if="payOrderno"
      :payorderno="payOrderno"
      :dataid="queryOrder.saleid"
      :model="true"
      :close="true"
      @close="payModelClose"
    ></Pay>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import UserAddressUint from "../templates/user/UserAddressUnit";
import CouponUnit from "../templates/CouponUnit";
import { HintInfo, PresellAgreement } from "../../common/api/sneaker";
import { AddressDefault } from "../../common/api/user";
import { NewC2cOrderCheck } from "../../common/api/product";
import { NewC2cOrderAdd } from "../../common/api/order";
import { cCancleOrder } from "../../common/api/snekc2c";
import Model from "./Model";

import Pay from "./Pay";
// import { SetPoints } from "../../common/api/base";

var _from = null,
  payed = false;

const ISDEV = process.env.NODE_ENV !== "production";
export default {
  data() {
    return {
      expressTemplate: [],
      address: {},
      defaultCoupon: {},
      useCou: false,
      couponuserid: "",
      getOrder: {},
      cardnum: "",
      usermemo: "",
      rulesList: [],
      isAgree: true,
      css: {
        showNoStock: false,
        showBack: false,
        confirmExit: false
      },
      queryOrder: {
      },
      defaultExpressList: {},

      payOrderno: ""
    };
  },
  components: {
    UserAddressUint,
    CouponUnit,
    Model,
    Pay
  },
  computed: {
    ill() {
      return !(this.insq || this.user.token);
    },
    ...mapGetters({
      insq: "insq",
      orderItem: "orderItem",
      user: "userInfo",
      userAddressList: "userAddressList",
      fromType: "fromType", // 0订单来之购物车 1来之详情立即购买
      userDefaultAddress: "userDefaultAddress",
      discounts: "discounts", // 优惠 和红包id
      payingOrder: "payingOrder"
    }),
    hasCoupon() {
      let _ = this;
      let con = _.getOrder.coupon;
      let totleCou = 0;
      if (_.getOrder && con) {
        totleCou = Number(con.discountmoney) ? Number(con.discountmoney) : 0;
      }
      return totleCou;
    }
  },
  beforeRouteEnter(to, from, next) {
    _from = from;
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (
        from.path.indexOf("user/address") > -1 ||
        from.path.indexOf("user/editAddress") > -1 ||
        from.path.indexOf("productDetail") > -1
      ) {
        // vm.GetExpress();
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    // if (!this.css.confirmExit && to.path.includes("sneaker/detail")) {
    //   this.css.showBack = true;
    //   next(false);
    // } else {
    //   next();
    // }
    let _ = this;
    if (to.path !== "/user/address" && to.path!='/buyerSellKnow'&&to.path!='/order/coupon'&& !_.css.showNoStock && !payed)
      this.confirm({
        title: "",
        msg: "离开宝贝会被别人抢走哦~",
        okText: "我再想想",
        ok: () => {
          next(false);
        },
        cancelText: "去意已决",
        cancel: () => {
          if (_.payOrderno) {
            cCancleOrder({ orderno: _.payOrderno });
          }
          next();
        }
      });
    else next();
  },
  beforeMount() {
    let _ = this,
      { query } = _.$route,
      { payingOrder, ill } = _;

    if (payingOrder) {
      _.$store.dispatch("updPayingOrder", "");
      _.$router.replace("/sneaker/payResult/" + payingOrder);
      return;
    }
    if (ill) _.$router.go(-1);

    _.queryOrder = {
      addressid: query.adi,
      count: query.c,
      saleid: query.si, // "销售记录id",
      productid: query.pi, //  商品id",
      oldsaleid: query.osi,
      role: query.r, // 1：购买/买家；2：出售/卖家
      seller: query.st|| query.c// 商家类型
    };
  },
  mounted() {
    let _ = this;
    _.newCheck();
    if (!(_.userDefaultAddress && _.userDefaultAddress.mobile)) {
      if (_.user.token) _.GetAddressDefault();
      else {
        setTimeout(() => {
          _.GetAddressDefault();
        }, 800);
      }
    }

    if (_.queryOrder.saleid == _.queryOrder.oldsaleid) {
      _.hintInfo();
    } else {
      _.presellAgreement();
    }

    console.log("discounts", this.discounts);
  },
  methods: {
    newCheck() {
      let _ = this;
      let opt = {
        // 用户地址id
        addressid: _.userDefaultAddress.addressid || "",
        // "销售记录id",
        saleid: _.queryOrder.saleid,
        // "商品id",
        productid: _.queryOrder.productid,
        // 红包id
        redpacketids: _.discounts.redpacket,
        // 优惠券id
        couponuserid: _.discounts.couponuserid,
        count: 1,
        usecoupon: _.discounts.isusecoup
      };
      NewC2cOrderCheck(opt)
        .then(res => {
          if (res) {
            _.getOrder = res;
            _.defaultExpressList = res.expressinfo;
            let co = _.discounts;
            if (res.coupon) {
              _.useCou = true;
              co.redpacket = res.coupon.redpacket;
              co.couponuserid = res.coupon.couponuserid;
              _.$store.dispatch("Discounts", co);
            }
            // else _.ucp = false;
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    hintInfo() {
      HintInfo({
        saleid: this.queryOrder.oldsaleid
      }).then(res => {
        if (res && res.length > 0) {
          // this.rulesList = res;
          let rulesList = [];
          res.map(i => {
            rulesList.push(
              i.replace(
                "由卖家发往平台",
                '<h3 style="display:inline-block;color:#333;">由卖家发往平台</h3>'
              )
            );
            return rulesList;
          });
          this.rulesList = rulesList;
          // console.log("this.rulesList",rulesList )
        }
      });
    },

    //预售买家，卖家须知
    presellAgreement() {
      PresellAgreement({
        role: this.queryOrder.role,
        type: this.queryOrder.seller
      }).then(res => {
        if (res && res.length > 0) {
          // this.rulesList = res;
          let rulesList = [];
          this.rulesList = res;
          // console.log("this.rulesList",rulesList )
        }
      });
    },

    switchAgree() {
      this.isAgree = !this.isAgree;
    },

    goAgreement() {
      this.$router.push("/buyerSellKnow?type=2");
    },
    GetAddressDefault() {
      AddressDefault({ token: this.user.token })
        .then(res => {
          console.log("默认地址", res);
          if (res) {
            res.mobile = res.mobile.split("-")[1];
            // this.userDefaultAddress = res
            this.$store.dispatch("setDefaultAddress", res);
          }
        })
        .catch(e => {
          console.error("获取默认地址失败", e);
        });
    },
    payment() {
      
      if (!this.isAgree) {
        this.toast("请查看阅读协议");
        return;
      }
      let _ = this;
      //    "saleid":"string 出售id"
      //     "activityid":"string 活动id"
      //     "couponuserid":"string 优惠券id"
      //     "redpacketids":["redpacketid":"红包id"]
      //     "expresstemplateitemid":"物流模板id"
      //     "source":"订单来源 int"
      //     "addressid":"string 地址id"
      //     "comments":"string 备注"
      // var or = _.getOrder;
      var option = {
        // 规格id
        saleid: _.queryOrder.saleid,
        // 收货地址id
        addressid: _.userDefaultAddress.addressid,
        // 发货地模板标识
        expresstemplateitemid: _.defaultExpressList.expresstemplateitemid || "",
        // 订单来源
        source: 3,
        // 红包id
        redpacketids: _.discounts.redpacket,
        // 使用的用户礼劵标识
        couponuserid: _.discounts.couponuserid,
        // 活动id
        activityid: "",
        // 买家留言
        comments: _.usermemo
      };

      console.log("添加订单参数", option);
      if (option.addressid === "undefined" || !option.addressid) {
        _.toast("请添加收货地址");
        return;
      }
      if (option.expresstemplateitemid === "") {
        _.toast("没有运费模板暂时不能支付");
        return;
      }
           
      NewC2cOrderAdd(option)
        .then(res => {
          console.log(window.TDH5SDK);
          window.TDH5SDK &&
            window.TDH5SDK.iap.placeOrder(
              res.orderno,
              this.getOrder.paymoney,
              "CNY",
              option.items
            );



          if (!_.$root.isdebug) { window.gio("track", "PresaleClick", { 'PresaleId': option.saleid, 'PresaleName': _.getOrder.productitem.productname, 'PresaleSource': 'h5' }); }
          // console.log('orAdd', res)
          if (res && res.orderno) {
            let co = _.discounts;
            co.redpacket = [];
            co.couponuserid = "";
            _.$store.dispatch("Discounts", co); // 下单成功 清空红包状态

            // let url =
            //   "/sneaker/pay/" + res.orderno + "?dataid=" + option.saleid;
            // _.$router.replace(url);
            _.payOrderno = res.orderno;
            payed = true;
          }
          try{
            $log({ e: 'c2cPlaceOrder', p:  {orderID:res.orderno,payAmount:_.getOrder.paymoney},t:0,ext:1 })
          } catch(err) { console.error('request error report error: ', err)}
          
        })
        .catch(e => {


         
          console.error("订单添加失败", e);

          if (e && e.code == 1511901) _.css.showNoStock = true;
          else _.toast("订单添加失败：" + e.msg);
        });
    },
    goCoupon() {
      console.log("goCoupon", this.realCoupon, this.defaultCoupon);
      this.$router.push({
        path: "/order/coupon",
        query: {
          productmoney: this.getOrder.productmoney,
          type: 2
        }
      }); // C2C为2
    },
    cancelCou() {
      this.useCou = false;
      this.queryOrder.redpacketids = [];
      this.queryOrder.couponuserid = "";
      // console.log('不使用优惠券', this.realCoupon, this.useCou)
    },
    inputCardnum(e) {
      let val = e.target.value;
      val = val.replace(/\s|[^0-9xX]/g, "");
      let len = val.length;
      if (len > 18) val = val.slice(0, 18);
      if (len === 18)
        val = val.replace(/(\d{6})(\d{8})(\d{3}[0-9xX])/, "$1 $2 $3");
      else if (len === 15)
        val = val.replace(/(\d{6})(\d{6})(\d{2}[0-9xX])/, "$1 $2 $3");

      this.cardnum = val;
      e.target.value = val;
    },

    goBack() {
      this.css.confirmExit = true;
      this.$router.go(-1);

      let co = this.discounts;
      co.isusecoup = true;
      co.redpacket = [];
      // 优惠券id
      co.couponuserid = "";
      this.$store.dispatch("Discounts", co);
    },

    showBackModel() {
      this.css.showBack = false;
    },
    payModelClose() {
      let _ = this;
      if (_.payOrderno) {
        cCancleOrder({ orderno: _.payOrderno });
      }
      _.payOrderno = "";
    }
  }
};
</script>
<style scoped>
.isHeadHide{
  background: #F5F5F5;
  padding-bottom: 26vw;
}
.boxContent {
  padding: 0 4vw;
}
.main_info,.other_info{
  background: #FFF;
}
.other_info{
  margin-bottom: 20px;
  padding-bottom: 10px;
}
.main_info{
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.check_coupons {
  line-height: 34px;
  color: #232323;
  font-weight:400;
  font-size: 14px;
}
.check_coupons .right_icon{
  position: relative;
  top: 0.8vw;
}
.o_footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: #fff;
  padding: 2.6667vw 4vw;
  height: 18.6667vw;
}
.o_footer .info{
  font-size: 28rpx;
  color: #232323;
  font-weight: 600;
}
.o_footer .pay_color .ren{
  font-size: 14px;
}
.o_footer .pay_color{
  font-size: 22px;
  color: #232323;
  position: relative;
  top: -1px;
}
.btn_total{
  width: 32vw;
  font-size: 16px;
  background: #FA2337;
  height: 13.3333vw;
  line-height: 13.3333vw;
  font-weight:600;
  color: #fff;
  box-shadow:none;
  border-radius: 2px;
  padding: 0;
}
.order_coulist .order_cou_unit {
  width: 63%;
}

.order_coulist {
  text-align: right;
}
.buy_tip {
  text-align: left;
  color: #e26868;
  font-size: 12px;
  line-height: 16px;
  padding-bottom: 10px;
}

.exp-cardnum {
  width: 75%;
}
.exp-cardnum input {
  width: 100%;
  font-size: 16px;
}
.exp-cardnum input::-webkit-input-placeholder {
  color: #999;
  font-size: 12px;
}
.exp-cardnum input:-ms-input-placeholder {
  color: #999;
  font-size: 12px;
}
.exp-cardnum input:-moz-placeholder {
  color: #999;
  font-size: 12px;
}
.exp-cardnum input::-moz-placeholder {
  color: #999;
  font-size: 12px;
}

.exp-info {
  border-bottom: 1px solid #eee;
}
.exp-list {
  padding: 5px 0;
}
.express_unit {
  line-height: 40px;
}
.exp_name span:first-of-type {
  margin-right: 10px;
}
.usermemo {
  padding: 0 10px;
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  font-size: 14px;
  margin: 15px 10px;
  text-align: left;
}
.usermemo label {
  float: left;
  height: 100%;
  margin-top: 15px;
  width: 20%;

  /* line-height: 100%; */
}
.usermemo textarea {
  /* float: left; */
  margin-top: 15px;
  width: 80%;
  background: none;
  outline-style: none;
  list-style: none;
}
.commodity {
  display: flex;
  align-items: center;
  background: #F5F5F5;
  padding: 1.0667vw;
  border-radius:4px;
  margin-bottom:10px;
  position: relative;
}
.commodity img {
  width: 24.5333vw;
  height: 24.5333vw;
  margin-right: 4vw;
}

.commodity .productname {
  color: #232323;
  font-size: 16px;
  width: 58.6667vw;
  line-height: 5.8667vw;
  height: 11.7333vw;
  font-weight:600;
  margin-bottom: 3.2vw;
}
.commodity .info{
  color: #232323;
  font-size: 12px;
  font-weight:400;
}
.commodity .allMoney{
  color: #232323;
  font-size: 12px;
  font-weight:400;
  position: absolute;
  right: 4vw;
  bottom: 4vw;
}
.logistics {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 34px;
  color: #232323;
  font-weight:400;
  font-size: 14px;
}


.protocol {
  color: rgb(102, 102, 102);
  font-size: 12px;
  padding-top: 15px;
}


.protocol .rulesList {
  font-weight: 400;
  color: #969696;
  font-size: 13px;
  line-height: 18px;
  margin-bottom: 7px;
}

.checkbox img {
  width: 4.2667vw;
  height: 4.2667vw;
  margin-right: 2vw;
}

.unselected {
  background-color: #CDCDCD !important;
}

.model-content {
  margin: 6vw 0 7vw;
  font-size: 16px;
}
.ox-ball{
  height: 9.0667vw;
  line-height: 9.0667vw;
}
.ox-ball .info{
  color: #232323;
  font-size: 14px;
  font-weight: 400;
  margin: 0;
}
.ox-ball .num{
  color: #232323;
  font-size: 14px;
  font-weight: 600;
}
.ox-ball .num img{
  width: 4.8vw;

}
</style>
