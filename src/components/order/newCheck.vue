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
      <!-- 身份证号 -->
      <div v-show="curExp.isneedidcard" class="flex-aic li li-info">
        <p>身份证号：</p>
        <p class="exp-cardnum">
          <input type="text" placeholder="海外物流订单需填写收货人身份证号" @input="inputCardnum" />
        </p>
      </div>
      <!--订单 单元  -->
      <div class="order_unit">
        <section class="cart_head">
          <div class="ellipsis flex-aic flex">
            <i
              class="tilt"
              :class="getOrder.businesstype===3?'ico-sp-store':(getOrder.businesstype===2?'ico-sp-buy':'ico-sp-official')"
            ></i>
            <span class="busName">{{getOrder.businessname}}</span>
          </div>
          <div class="status_order ellipsis">{{getOrder.sendplace}}</div>
        </section>
        <section>
          <div
            class="flex-aic cart_content"
            v-for="(item,index) in getOrder.productitems"
            :key="index"
          >
            <div class="img_box_img">
              <img :src="item.productimgurl" alt />
            </div>
            <div class="cart_info">
              <p class="ellipsis-2 productname">{{item.productname}}</p>
              <p class="overcount">{{item.color}} ,{{item.size}} , x{{item.count}}</p>
            </div>
            <!-- 商品单价额 -->
            <p class="allMoney">
              ￥{{item.saleprice}}
              <span style="padding-left: 5px;" v-if="item.cutminprice">可砍至¥{{item.cutminprice}}</span>
            </p>
          </div>
        </section>
      </div>
      <!--选择优惠券  -->
      <div class="check_coupons" @click.stop="goCoupon">
        <div class="flex-between">
          <p>
            选择优惠:
            <span
              v-if="hasCoupon&&discounts.isusecoup&&(getOrder.productmoney-hasCoupon>0)"
            >本券共为您节省</span>
          </p>
          <p>
            <span v-if="!discounts.isusecoup" style="color: #969696;">不使用优惠</span>
            <span
              style="color: #969696;"
              v-else-if="!hasCoupon||hasCoupon<=0|| (getOrder.productmoney-hasCoupon<=0)"
            >您当前没有可用优惠券</span>
            <span v-else-if="hasCoupon>0&& (getOrder.productmoney-hasCoupon>0)">-¥{{hasCoupon}}</span>
            <span class="right_icon"></span>
          </p>
        </div>
      </div>
      <!-- 选择物流 -->
      <div class="li" v-show="userDefaultAddress && userDefaultAddress.addressid">
        <div class="exp">
          <label style="width: 28vw;">选择物流方式：</label>
          <div class="exp-list">
            <div
              class="exp-li"
              v-for="(item,c) in ExpressList"
              :key="item.expresstemplateitemid"
              @click="seleExpress(item,c)"
            >
              <div class="checkbox" :class="{'act':item.isselected,'disabled':!item.isselected}"></div>
              <span class="name">{{item.name}}</span>
              <span class="price">¥{{item.expressfee}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="logistics">
        <label>合计费用</label>
        <span style="font-size: 18px;font-weight: bold;">¥{{getOrder.paymoney}}</span>
      </div>
    </div>
    <div class="other_info boxContent" style="padding-top: 5.3333vw">
      <!-- 买家留言 -->
      <div class="usermemo">
        <label for>买家留言:</label>
        <div
          class="usermemoInfo"
          @click="inputClick"
          :class="{'unInfo':!usermemo}"
        >{{!usermemo?'对本次交易的说明（选填）':usermemo}}</div>
      </div>
      <div class="ox-ball flex flex-btwn flex-aic" v-if="getOrder.newballs">
        <div class="info">确认收货后返</div>
        <div class="num flex flex-aic flex-star">
          <img src="//files.eyee.com/mcdn/img/ball/icon_ox.png" alt />
          {{getOrder.newballs}}牛丸
        </div>
      </div>
    </div>
    <!-- 输入买家留言弹框 -->
    <div class="pop_box" :class="{'show': css.show}">
      <div class="pi-bg"></div>
      <div class="conten_box" v-if="css.current == 1">
        <div class="tit">买家留言</div>
        <textarea maxlength="80" placeholder="选填:对本次交易的说明" v-model="popUsermemo"></textarea>
        <div class="bottom_btn flex flex-between">
          <div class="close" @click="close">取消</div>
          <div class="affirm" @click="affirm">确认</div>
        </div>
      </div>
    </div>
    <!--底部  -->
    <div class="flex-between flex-center o_footer">
      <p class="flex flex-aic">
        <span class="info">合计支付：</span>
        <span class="pay_color font-price" v-if="getOrder.paymoney>=0">
          <span class="ren">¥</span>
          {{(getOrder.paymoney||0)}}
        </span>
      </p>
      <mt-button class="btn_total" @click="payment">提交订单</mt-button>
    </div>

    <Pay v-if="payOrderno" :payorderno="payOrderno" :model="true"></Pay>
  </div>
  <div v-else></div>
</template>
<script>
import { mapGetters } from "vuex";
import UserAddressUint from "../templates/user/UserAddressUnit";
import CouponUnit from "../templates/CouponUnit";
import Pay from "../pay/Pay";

import { NewOrderAdd, AddOrderZone } from "../../common/api/order";
import { AddressDefault } from "../../common/api/user";
import { saveOrderno } from "../../common/api/distribution";
import { NewOrderCheck } from "../../common/api/product";
var opt = {
  common: 0,
  group: 1,
  tuxedo: 2,
  cut: 3
}; // int 订单操作类型 0 - 普通，1 - 开团，2 - 参团，3 - 砍价",

export default {
  data() {
    return {
      expressTemplate: [],
      address: {},
      hasAddress: false,
      // userDefaultAddress: {},
      postdata: {},
      defaultCoupon: {},
      couvalue: 0,
      useCou: false,
      couponuseid: "",
      couponType: "",
      expressDate: [],
      getOrder: {},
      cardnum: "",
      usermemo: "",
      // ucp: true,
      queryOrder: {},
      ExpressList: {},
      curExp: {},

      payOrderno: "",
      css: {
        current: 0,
        show: false
      },
      popUsermemo: ""
    };
  },
  components: {
    // OrderUnit,
    UserAddressUint,
    CouponUnit,
    Pay
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      orderItem: "orderItem",
      user: "userInfo",
      userAddressList: "userAddressList",
      expressT: "expressT",
      fromType: "fromType", // 0订单来之购物车 1来之详情立即购买
      userDefaultAddress: "userDefaultAddress",
      discounts: "discounts", // 优惠 和红包id
      payingOrder: "payingOrder"
    }),
    ill() {
      return !(this.insq || this.user.token);
    },
    hasCoupon() {
      let _ = this;
      let totleCou = 0;
      let con = _.getOrder.coupon;
      if (_.getOrder && con) {
        totleCou = Number(con.discountmoney) ? Number(con.discountmoney) : 0;
      }
      return totleCou;
    }
  },
  beforeRouteEnter(to, from, next) {
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
    if (to.path !== "/user/address" && to.path != "/order/coupon" && !this.payOrderno)
      this.confirm({
        title: "",
        msg: "离开宝贝会被别人抢走哦~",
        okText: "我再想想",
        ok: () => {
          next(false);
        },
        cancelText: "去意已决",
        cancel: () => {
          next();
        }
      });
    else next();
  },
  beforeMount() {
    let _ = this,
      { payingOrder, ill } = _;

    if (payingOrder) {
      _.$store.dispatch("updPayingOrder", "");
      _.$router.replace("/paysuccess/" + payingOrder);
      return;
    }
    // this.GetExpress()
    if (ill) _.$router.go(-1);
    _.$route.query.productitems = JSON.parse(
      decodeURIComponent(_.$route.query.productitems)
    );
    _.queryOrder = { ..._.$route.query, ..._.queryOrder };
    // console.log("结算 地址栏参数", this.queryOrder);
    // console.log("discounts------>", _.discounts);
  },
  mounted() {
    let _ = this;
    _.newCheck();
    setTimeout(() => {
      if (!_.getOrder.paymoney) {
        _.newCheck();
      }
    }, 800);
    if (!(_.userDefaultAddress && _.userDefaultAddress.mobile)) {
      if (_.user.token) _.GetAddressDefault();
      else {
        setTimeout(() => {
          _.GetAddressDefault();
        }, 800);
      }
    }
    console.log("userDefaultAddress", this.userDefaultAddress);
  },
  methods: {
    newCheck() {
      let _ = this;
      let opt = {
        // 用户地址id
        addressid: _.userDefaultAddress.addressid || "",
        // "物流模板子项id",
        expresstemplateitemid: _.curExp.expresstemplateitemid || "",
        productitems: _.queryOrder.productitems,
        // 红包id
        redpacketids: _.discounts.redpacket || [],
        // 优惠券id
        couponuserid: _.discounts.couponuserid || "",
        // 订单类型
        ordertype: _.queryOrder.ordertype,
        // 扩展id
        extendid: _.queryOrder.extendid,
        usecoupon: _.discounts.isusecoup
      };

      // console.log("opt" , opt)
      NewOrderCheck(opt)
        .then(res => {
          if (res) {
            _.getOrder = res;
            // _.$store.dispatch("setExpressTemplate", res.expresslist);
            _.queryOrder.expresstemplateitemid = _.curExp.expresstemplateitemid;
            console.log("下单信息----=============", res);
            // if (res.coupondiscountmoney || res.redpacketdiscountmoney) {
            //   _.useCou = true;
            // }
            let co = _.discounts;
            if (res.coupon && res.coupon.discountmoney > 0) {
              co.redpacket = res.coupon.redpacket;
              co.couponuserid = res.coupon.couponuserid;
              _.$store.dispatch("Discounts", co);
            }
            // else {
            //   this.ucp = false;
            // }
            if (res.expresslist) {
              _.ExpressList = res.expresslist;
              _.ExpressList.map(i => {
                if (i.isselected) {
                  _.curExp = { ...i };
                }
                return _.curExp;
              });
            }
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    seleExpress(item, index) {
      if (item.isselected) return;

      for (let i = 0; i < this.ExpressList.length; i++) {
        if (i == index) {
          this.ExpressList[i].isselected = true;
          this.curExp = { ...this.ExpressList[i] };
        } else {
          this.ExpressList[i].isselected = false;
        }
      }

      this.newCheck();
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
    cancelCou() {
      this.useCou = false;
      this.queryOrder.redpacketids = [];
      this.queryOrder.couponuserid = "";
    },
    goCoupon() {
      let _ = this;
      let productitemids = [];
      for (let i = 0; i < _.queryOrder.productitems.length; i++) {
        productitemids.push(_.queryOrder.productitems[i].productitemid);
      }
      this.$router.push({
        path: "/order/coupon",
        query: {
          productmoney: this.getOrder.productmoney,
          productitemids: productitemids,
          type: 1,
          ordertype: this.queryOrder.ordertype
        }
      }); // B2C为1
    },
    payment() {
      // "idcard":"身份证号",
      // "addressid":"地址id",
      // "usermemo":"用户备注",
      // "expresstemplateitemid":"物流模板子项id",
      //  "productitems":[
      //     {
      //         "productitemid":"商品子项id",
      //         "count":"int 数量",
      //         "producttype":"int 商品类型",
      //         "distributionid":"分销商id",
      //         "parentid":"",
      //                "prostatus":"0 非准入门槛商品，1 准入门槛商品"
      //     }
      // ],
      // "redpacketids":[
      //     "redpacketid"
      // ],
      // "couponuserid":"String 优惠券id",
      // "ordertype":"int 订单操作类型 0 - 普通，1 - 开团，2 - 参团，3 - 砍价",
      // "extendid":"扩展id （根据ordertype和producttype决定具体类型的id：例：giftitemid、activityid、teamid、cuttingid)"
      let _ = this;
      //   var or = _.getOrder;

      var option = {
        // 收货人身份证号，物流模板isneedidcard为true时必须
        idcard: _.cardnum.replace(/\s/g, ""),
        // 用户地址id
        addressid: _.userDefaultAddress.addressid,
        // "用户备注",
        usermemo: _.usermemo,
        // "物流模板子项id",
        expresstemplateitemid: _.curExp.expresstemplateitemid,

        productitems: _.queryOrder.productitems,
        // 红包id
        redpacketids: _.discounts.redpacket || [],
        // 优惠券id
        couponuserid: _.discounts.couponuserid,
        // 订单类型
        ordertype: _.queryOrder.ordertype,
        // 扩展id
        extendid: _.queryOrder.extendid
      };

      if (option.addressid === "undefined" || !option.addressid) {
        _.toast("请添加收货地址");
        return;
      }
      if (
        option.expresstemplateitemid === "" ||
        !option.expresstemplateitemid
      ) {
        _.toast("没有运费模板暂时不能支付");
        return;
      }

      if (_.curExp.isneedidcard) {
        if (!/^(\d{14}|\d{17})[0-9xX]$/.test(option.idcard)) {
          _.toast("请输入正确的收货人身份证号");
          return;
        }
      }

      if (_.getOrder.cutparamsType) {
        option.cuttingid = _.getOrder.cuttingid;
      }
      option.usermemo = this.usermemo;
      NewOrderAdd(option)
        .then(res => {
          window.TDH5SDK &&
            window.TDH5SDK.iap.placeOrder(
              res.orderno,
              option.paymoney,
              "CNY",
              option.items
            );

          let itm = _.getOrder.productitems;
          let co = this.discounts;
          co.isusecoup = true;
          co.redpacket = [];
          // 优惠券id  test
          co.couponuserid = "";
          this.$store.dispatch("Discounts", co);
          // console.log('orAdd', res)
          if (res && res.mustpay) {
            _.discounts.redpacket = [];
            // 优惠券id
            _.discounts.couponuserid = "";
            if (_.$root.ISAPP) {
              let opt = {
                name: "callAppPaymentPage",
                params: {
                  orderid: res.orderno,
                  callbackSuccessUrl: "",
                  callbackFailUrl: ""
                }
              };
              _.javascriptBridge(opt);
            } else {
              // let url = "/pay/" + res.orderno;
              // _.$router.replace(url);
              _.payOrderno = res.orderno;
            }

            // 埋点
            try {
              $log({
                e: "placeOrder",
                p: { orderID: res.orderno, payAmount: _.getOrder.paymoney },
                t: 0,
                ext: 1
              });
            } catch (err) {
              console.error("request error report error: ", err);
            }
          }
        })
        .catch(e => {
          console.error("订单添加失败", e);
          _.toast("订单添加失败：" + e.msg);
        });
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
    inputClick() {
      let _ = this;
      _.css.show = true;
      _.css.current = 1;
      if (_.usermemo) {
        _.popUsermemo = _.usermemo;
      }
    },
    close() {
      let _ = this;
      _.css.show = false;
      _.css.current = 0;
    },
    affirm() {
      let _ = this;
      if (!_.popUsermemo) {
        _.toast("请输入买家留言~");
        return;
      } else {
        _.css.show = false;
        _.css.current = 0;
        _.usermemo = _.popUsermemo;
      }
    }
  }
};
</script>
<style scoped>
.isHeadHide {
  background: #fff;
  padding-bottom: 26vw;
}
.boxContent {
  padding: 0 4vw;
}
.main_info,
.other_info {
  background: #fff;
}
.other_info {
  margin-bottom: 20px;
  padding-bottom: 10px;
}
.main_info {
  /* margin-bottom: 10px; */
  border-bottom: 10px solid #f5f5f5;
  padding-bottom: 10px;
}
.order_unit {
  background: #f5f5f5;
  border-radius: 4px;
  overflow: hidden;
}
.cart_head {
  position: relative;
  padding: 0 4vw 0 1.0667vw;
  height: 9.3333vw;
  line-height: 9.3333vw;
  font-size: 14px;
}
.busName {
  font-size: 14px;
}
.cart_head .status_order {
  position: absolute;
  right: 4vw;
  top: 0;
  width: 50%;
  text-align: right;
  height: 9.3333vw;
  line-height: 9.3333vw;
}
.check_footer {
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 15px 0;
}
.check_footer p {
  margin-bottom: 10px;
}
.check_footer p > span:nth-of-type(1) {
  margin-right: 30px;
  display: inline-block;
  width: 71px;
  text-align: right;
}
.cart_content {
  padding: 1.0667vw 4vw 1.0667vw 1.0667vw;
  position: relative;
}
.cart_content .allMoney {
  color: #232323;
  font-size: 12px;
  font-weight: 400;
  position: absolute;
  right: 4vw;
  bottom: 3.4667vw;
}
.cart_content .img_box_img {
  position: relative;
  width: 24.5333vw;
  margin-right: 4vw;
  height: 24.5333vw;
}
.cart_content .img_box_img img {
  width: 24.5333vw;
  height: 24.5333vw;
}
.cart_content .cart_info {
  flex: 1;
}
.cart_info .productname {
  color: #232323;
  font-size: 16px;
  width: 58.6667vw;
  line-height: 5.8667vw;
  height: 11.7333vw;
  font-weight: 600;
  margin-bottom: 3.2vw;
}
.cart_info .overcount {
  color: #232323;
  font-size: 12px;
  font-weight: 400;
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

.usermemo {
  margin-bottom: 1.3333vw;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 2.6667vw 4vw 2.6667vw 24vw;
  position: relative;
  min-height: 70px;
}
.usermemo label {
  width: 18.6667vw;
  height: 20px;
  line-height: 20px;
  color: #232323;
  font-size: 14px;
  position: absolute;
  top: 2.6667vw;
  left: 4vw;
}
.usermemoInfo {
  color: #646464;
  font-size: 14px;
  line-height: 20px;
}
.usermemoInfo.unInfo {
  color: #b4b4b4;
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
.o_footer .info {
  font-size: 28rpx;
  color: #232323;
  font-weight: 600;
}
.o_footer .pay_color .ren {
  font-size: 14px;
}
.o_footer .pay_color {
  font-size: 22px;
  color: #232323;
  position: relative;
  top: -1px;
}
.btn_total {
  width: 32vw;
  font-size: 16px;
  background: #fa2337;
  height: 13.3333vw;
  line-height: 13.3333vw;
  font-weight: 600;
  color: #fff;
  box-shadow: none;
  border-radius: 2px;
  padding: 0;
}
.ox-ball {
  height: 9.0667vw;
  line-height: 9.0667vw;
}
.ox-ball .info {
  color: #232323;
  font-size: 14px;
  font-weight: 400;
  margin: 0;
}
.ox-ball .num {
  color: #232323;
  font-size: 14px;
  font-weight: 600;
}
.ox-ball .num img {
  width: 4.8vw;
}

.pop_box {
  position: fixed;
  transform: translateZ(0);
  z-index: 101;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  font-family: Arial, Helvetica, sans-serif;
}
.pop_box.show {
  pointer-events: auto;
}
.pop_box.show .pi-bg {
  background-color: #000;
  opacity: 0.5;
}
.pi-bg {
  width: 100%;
  height: 100%;
  background-color: transparent;
  opacity: 0;
  transition: all 0.2s ease;
}
.conten_box {
  width: 85.3333vw;
  background: #fff;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 6.6667vw 5.3333vw 5.3333vw;
  transform: translate(-50%, -50%);
  overflow: hidden;
}
.conten_box .tit {
  font-size: 17px;
  font-weight: 600;
  color: rgba(35, 35, 35, 1);
  line-height: 24px;
  text-align: center;
  margin-bottom: 15px;
}
.conten_box textarea {
  width: 100%;
  height: 140px;
  padding: 10px 15px;
  line-height: 20px;
  background: #f0f0f0;
  color: #232323;
  font-size: 14px;
  margin-bottom: 20px;
}
.bottom_btn {
  height: 11.7333vw;
}
.bottom_btn .close,
.bottom_btn .affirm {
  height: 11.7333vw;
  line-height: 11.7333vw;
  text-align: center;
  width: 36.2667vw;
  background: #fa2337;
  font-size: 16px;
  border-radius: 2px;
}
.bottom_btn .close {
  border: 1px solid #fa2337;
  color: #fa2337;
  background: transparent;
}
.bottom_btn .affirm {
  color: #fff;
}
.li {
  font-size: 14px;
  color: #232323;
  font-weight: 400;
}
.li .exp {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.li-info {
  height: 9.0667vw;
  line-height: 9.0667vw;
}
.check_coupons {
  line-height: 34px;
  color: #232323;
  font-weight: 400;
  font-size: 14px;
}
.check_coupons .right_icon {
  position: relative;
  top: 0.8vw;
}
.logistics {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 9.0667vw;
  color: #232323;
  font-weight: 400;
  font-size: 14px;
}
.exp label {
  height: 9.0667vw;
  line-height: 9.0667vw;
  width: 26.6667vw;
}
.exp-list {
  flex: 1;
}
.exp-li {
  line-height: 9.0667vw;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.exp-li .checkbox {
  width: 4.2667vw;
  height: 4.2667vw;
  border: solid 0.5333vw;
  border-radius: 50%;
  background: #fff;
}
.exp-li .checkbox.act {
  border-color: rgba(250, 75, 75, 1);
  position: relative;
}
.exp-li .checkbox.act::after {
  content: "";
  position: absolute;
  width: 2.1333vw;
  height: 2.1333vw;
  left: 50%;
  top: 50%;
  background-color: rgba(250, 75, 75, 1);
  transform: translate(-50%, -50%);
  border-radius: 50%;
}
.exp-li .checkbox.disabled {
  border-color: #d8d8d8;
}
.exp-li .name {
  padding-left: 1.3333vw;
  width: 26.6667vw;
}
.exp-li .price {
  flex: 1;
  text-align: right;
}
</style>
