<template>
    <div>
      <div>
        <section class="cart_head" >
          <div class="ellipsis flex-aic">
            <i class='tilt' :class="item.businesstype==3?'ico-sp-store':(item.businesstype==2?'ico-sp-buy':'ico-sp-official')"></i>
            <span class="busName ellipsis " @click.stop="goShopDetail(item.businessid)">{{item.businessname}}</span>
           <span class="rights_icon"></span>
            <span class="icon_server service_black" @click.stop="QiyuProd"></span>
          </div>
          <div class="status_order" :class="{ 'gray': gray }">
            <span>{{orderStatus.currentStatus}}</span>
          </div>
        </section>
      </div>
      <div class="cart_content flex-aic" @click.stop='productDetail(item.id)'>
        <div class="img_box">
          <img v-lazy="https(item.imageurl)" alt="">
        </div>
        <div class="cart_info">
          <p class="ellipsis">{{item.productname}}</p>
          <p>
            原价：¥{{item.salemoney | tofixed}}
            &nbsp;&nbsp;&nbsp;可砍至 <em class="spec_sale">¥{{item.minprice}}</em>
          </p>
          <p >{{item.color}} , {{item.size}} , x1</p>
        </div>
      </div>
      <section class="flex check_footer">
        <p>共1件商品</p>
        <div >
          <p class="flex-between" >
            <span>商品总额:</span>
            <em class="">¥{{parseFloat(item.salemoney) | tofixed}}</em>
          </p>
          <p class="flex-between">
            <span>运费:</span>
            <span>¥{{parseFloat(item.expressfee) | tofixed}}</span>
          </p>
           <p class="flex-between" v-if="item.discountmoney>0">
            <span>优惠券:</span>
            <span>-¥{{item.discountmoney| tofixed}}</span>
          </p>
          <p class="flex-between">
            <span>助力砍价:</span>
            <span>-¥{{parseFloat(item.cutcountmoney) | tofixed}}</span>
          </p>
          <p class="flex-between">
            <span>总计:</span>
            <span class="pcolor">¥{{parseFloat(item.salemoney - item.cutcountmoney - item.discountmoney) | tofixed}}</span>
          </p>
        </div>
      </section>
      <p class="order_tip" v-if="daojishi">
        <!-- (开团倒计时) -->
        <i>剩余时间</i>:{{timeData.H<10&&timeData.H>=0?'0'+timeData.H:timeData.H}}:{{timeData.m<10&&timeData.m>=0?'0'+timeData.m:timeData.m}}:{{timeData.s<10&&timeData.s>=0?'0'+timeData.s:timeData.s}}
      </p>
      
      <section class=" footer_orderBtn" >
        <div class="special_tips">
           <span >{{orderStatus.cutGetText}}</span>
        </div>
        <div class="order_btn_box">
          <div class="btn_div" @click.stop='buyNow(butText, item)' v-if="orderStatus.orderText">{{orderStatus.orderText}}</div>
          <div class="btn_div btn_detail" v-if="orderStatus.groupBtn" 
           @click.stop='groupDetail(btnNum, item)' :class="bgClass">{{orderStatus.groupBtn}}</div>
        </div>
      </section>
      <!-- <button @click.stop="getProductOptions('4367795fe0ab4a2cabb5324e5b8d65b3')">测试</button> -->
       <!-- 弹框 -->
      <model v-if="cutGoingFail" :showBtn='showBtn' :cutText='cutText' :modelBgClassBG='modelBgClassBG' @close='close'></model>
      <product-items :show="css.showItems" :helpType="true" :product-info="realInfo" @close='itemsClose'></product-items>
    </div>
</template>
<script>
import { DateDiff } from "../../common/util";
import {
  ExtendOrder,
  DeleteOrder,
  CancelOrder,
  Receipt
} from "../../common/api/order"; // , PayTypeList
import { mapGetters } from "vuex";
import { QiyuProd } from "../../common/api/WyQiyu";
import model from "./helppopmodel.vue";
import { StartCut } from "../../common/api/bargain";
import ProductItems from "@/comps/ProductItems";
import { NewDetail } from "../../common/api/product";
export default {
  components: { model, ProductItems },
  data() {
    return {
      css: {
        showItems: false
      },
      payTimeDate: {},
      btnNum: 1,
      butText: 1,
      bgClass: "bgClassBor", //bgClassYello
      cutGoingFail: false,
      confirmAdress: false,
      showBtn: 1,
      cutText: "测试",
      goto: 0,
      modelBgClassBG: "cutOver", // cutgoing进行中  cutOver活动结束 cutFail助理失败 cutorderPass订单超过有效时间 cutSuccess好人缘报账 cutNewpeople新人
      gray: false,
      countDown: "0",
      daojishi: true,
      timeData: {},
      itemsCloseItem: {}, // 颜色规格我
      productInfoGroupItems: {} // 颜色规格参数
    };
  },
  props: {
    item: Object
  },
  computed: {
    ...mapGetters({
      insq: "insq"
    }),
    realInfo() {
      let info =
        (this.productInfoGroupItems && this.productInfoGroupItems.info) || {};
      info.productid = info.id;
      return info;
    },
    cutid() {
      return this.$store.state.user.cutid;
    },
    orderStatus() {
      let i = this.item;
      let cutInfo = {};
      if (i.status == 0) {
        cutInfo.currentStatus = "助力失败";
        cutInfo.orderText = "";
        cutInfo.cutGetText = "该商品助力失败";
        cutInfo.groupBtn = "重新助力";
        this.btnNum = 0;
        this.daojishi = false;
        // this.setentime(i.orderpayexpiretime, "m");
      } else if (i.status == 1) {
        // alert(222)
        cutInfo.currentStatus = "助力中";
        cutInfo.orderText = "立即购买";
        cutInfo.groupBtn = "继续助力";
        cutInfo.cutGetText = "该商品正在助力砍价";
        this.btnNum = 1;
        this.butText = 1;

        // this.setentime(i.orderpayexpiretime, "m");
      } else if (i.status == 2) {
        cutInfo.currentStatus = "待付款";
        cutInfo.orderText = "取消订单";
        cutInfo.groupBtn = "立即付款";
        cutInfo.cutGetText = "该商品正在助力砍价";
        this.btnNum = 2;
        this.butText = 2;
      } else if (i.status == 3) {
        cutInfo.currentStatus = "助力成功";
        cutInfo.orderText = "";
        cutInfo.groupBtn = "再次助力";
        cutInfo.cutGetText = "该商品通过助力砍价获得";
        this.btnNum = 3;
        this.daojishi = false;
      }

      return cutInfo;
    }
  },
  mounted() {
    // this.countdownTime("H");
    // console.log('this',this.$root)
    //  document.body.classList.add('lock')
    if (
      (this.item.status === 1 && this.item.endtime) ||
      (this.item.payexpiretime && this.item.status === 2)
    ) {
      let time =
        this.item.status == 2 ? this.item.payexpiretime : this.item.endtime;
      // time = time.replace("-", "/");
      this.setentime(time, "H"); //倒计时
    }
  },
  methods: {
    // countdownTime(type) {
    //   var _ = this;
    //   var ts = DateDiff({ destination: this.item.endtime, type: type });
    //   if (ts.H <= 0 && ts.m <= 0 && ts.s <= 0) {
    //     _.countDown = "00:00:00";
    //     return;
    //   }
    //   let H = ts.H < 9 ? "0" + ts.H : ts.H;
    //   let M = ts.m < 9 ? "0" + ts.m : ts.m;
    //   let S = ts.s < 9 ? "0" + ts.s : ts.s;
    //   _.countDown = H + ":" + M + ":" + S;
    //   // console.log(ts)
    //   if (ts.H === 0 && ts.m === 0 && ts.s === 1) {
    //     _.countDown = null;
    //     clearTimeout(_.timeRun);
    //   } else {
    //     _.timeRun = setTimeout(() => {
    //       _.countdownTime();
    //     }, 1000);
    //   }
    // },
    countdownTime(time, type) {
      this.timeData = DateDiff({ destination: time, type: type });
      // console.log(this.timeData)
      if (
        this.timeData.H === 0 &&
        this.timeData.m === 0 &&
        this.timeData.s === 0
      ) {
        window.location.reload();
        clearInterval(this.clearTime);
      }
      if (this.timeData.m < 0) {
        this.timeData.H = 0;
        this.timeData.m = 0;
        this.timeData.s = 0;
        return;
      }
    },
    setentime(time, type) {
      let _ = this;
      _.clearTime = setInterval(function() {
        _.countdownTime(time, type);
      }, 1000);
    },
    productDetail(id) {
      this.$router.push("/helpbargain/helpdetail/" + id);
    },
    goShopDetail(businessid) {
      this.$router.push("/shop/shopdetail/" + businessid);
    },
    groupDetail(num, team) {
      this.$store.state.user.cutid = team.cutingid;
      this.$store.state.user.businesscutid = team.businesscutid;

      if (team.isjoin || team.usercutstatus == 0 || team.usercutstatus == 4) {
        // 可以继续助力
        // 两种情况 1. 助力失败了 2. 助力成功后 再次助力 num =0 3
        // cutgoing进行中  cutOver活动结束 cutFail助理失败 cutorderPass订单超过有效时间 cutSuccess好人缘报账 cutNewpeople新人
        sessionStorage.setItem("cuttype", 1);
        this.getProductOptions(team.productid);
      } else {
        if (team.status === 2) {
          this.cutText = "当前商品您有待付款订单,<br>请先完成支付!";
          this.modelBgClassBG = "gotopay";
          this.showBtn = 6;
          this.cutGoingFail = true;
          return;
        }
        if (team.status === 1) {
          this.$router.push("/helpbargain/helpdetail/" + team.cutingid);
        }
        if (team.usercutstatus == 1) {
          // this.cutText = "当前商品正在助力中,<br>快去邀请好友来助力吧!";
          // this.modelBgClassBG = "cutgoing";
          // this.showBtn = 2;
          // this.cutGoingFail = true;
          // alert(team.cutid)

          this.$router.push("/helpbargain/helpdetail/" + team.cutingid);
        } else if (team.usercutstatus == 2) {
          // 立即购买 后台自动生成订单
          if (team.quantity < 1) {
            this.toast("来晚了，商品已售罄~");
            return;
          }
          if (!team.orderno) {
            this.toast("订单编号不存在");
            return;
          }
          this.cutText = "当前商品您有待付款订单,<br>请先完成支付!";
          this.modelBgClassBG = "gotopay";
          this.showBtn = 6;
          this.cutGoingFail = true;
          // if (this.$root.ISAPP) {
          //   this.javascriptBridge({
          //     name: "callAppPaymentPage",
          //     params: { orderid: team.orderno }
          //   });
          // }

          // let url = "/pay/" + team.orderno;
          // if (this.insq) url = `/frame/${encodeURIComponent(url)}`;
          // this.$router.push(url);
        } else if (team.usercutstatus == 3) {
          this.cutText =
            "好人缘爆棚!<br>您已经达到该商品助力的巅峰值,<br>快去看看其他商品吧!";
          this.modelBgClassBG = "cutSuccess";
          this.showBtn = 1;
          this.cutGoingFail = true;
          return;
        } else if (team.usercutstatus == 5) {
          this.cutText = "来晚啦,助力活动已结束,<br>快去看看其他商品吧!";
          this.modelBgClassBG = "cutOver";
          this.showBtn = 1;
          this.cutGoingFail = true;
        }
      }
    },
    buyNow(butText, item) {
      //立即购买
      // butText 1 立即购买 2 取消订单
      if (butText === 2) {
        //取消订单
        this.confirmOrder(item.orderno);
        return;
      }
      if (item.quantity < 1) {
        this.cutText = "商品已售罄,下次要赶早哦~";
        this.modelBgClassBG = "cutFail";
        this.showBtn = 1;
        this.cutGoingFail = true;
        this.goto = 1; // 去助力列表
        return;
      }
      // 收货地址
      let address = {
        address: item.address,
        addressid: item.useraddressid,
        country: item.country,
        idcard: "",
        isdefault: true,
        mobile: item.mobile,
        receiver: item.receiver
      };
      this.$store.dispatch("setDefaultAddress", address);
      console.log("ietm", item);
      if (this.insq) {
        item.salemoney = item.salemoney - item.cutcountmoney;

        item.saleprice = parseFloat(
          (item.salemoney - item.cutcountmoney).toFixed(2)
        );
        item.specialprice = parseFloat(
          (item.salemoney - item.cutcountmoney).toFixed(2)
        ); // 原價 - 已砍甲哥
        item.isok = true;
        item.checked = true;
        item.cutparamsType = true;
        item.cuttingid = item.id;
        item.count = 1;
        item.colorimg = item.imageurl;
        item.contentid = "";
        item.productitemid = item.productitemid;
        item.isexpressfree = false;
        item.tariffmoney = 0;
        // item.producttype = 10
        let tempTotalPrice = item.specialprice;

        let pay = {
          ...item,
          id: item.productid,
          allPay: tempTotalPrice,
          item: [item]
        };

        let _ = this;
        _.$store.dispatch("setOrderCoupon", {
          canUseCoupon: [],
          unCanUseCoupon: []
        });
        console.log("dd", pay);
        // return;
        _.$store.state.order.selectedCoupon = {};
        _.$store.dispatch("setOrderOut", { ...pay });
        _.$store.dispatch("setFromeType", 1);
        _.$router.push("/order/checkout");
      } else {
        this.buyparams(item);
      }
    },
    buyparams(item) {
      let _ = this;
      let extendid = null;
      extendid = item.cutingid;
      let productitems = [
        {
          productitemid: item.productitemid, // "商品子项id",
          count: item.count || 1, // "int 数量",
          producttype: item.producttype // "int 商品类型"
          // distributionid: "",
          // parentid: "",
          // prostatus: ''
        }
      ];
      _.$router.push({
        path: "/order/NewCheckout",
        query: {
          productitems: encodeURIComponent(JSON.stringify(productitems)),
          ordertype: 3, //  "int 订单操作类型 0 - 普通，1 - 开团，2 - 参团，3 - 砍价",
          extendid: extendid //      "扩展id （根据ordertype和producttype决定具体类型的id：例：productid、activityid、teamid、cuttingid)"
        }
      });
    },
    close(type) {
      // if(this.goto ===1){
      //   this.$router.push('/helpbargain')
      // }
      this.$store.state.user.cutToastShare = true; // 进助力详情弹出分享
      if (type === 2) {
        this.$router.push("/helpbargain/helpdetail/" + this.cutid);
      } else if (type === 3) {
        this.$router.replace("/helpbargain");
      } else if (type == 6) {
        this.$router.push("/helpbargain/helpdetail/" + this.cutid);
        this.$store.state.user.cutToastShare = false; // 进助力详情弹出分享
      }

      this.cutGoingFail = false;
      this.confirmAdress = false;
    },
    // 颜色规格回传
    itemsClose(item) {
      console.log("item", item);
      this.css.showItems = false;
      let that = this;
      document.body.style.overflow = "auto";
      window.removeEventListener("touchmove", that._preventDefault);
      sessionStorage.removeItem("cuttype");
      if (item) {
        localStorage.setItem("helphand", JSON.stringify(item));
        this.$router.push({
          path: "/user/address",
          query: { cutType: 1 }
        });
      }
    },
    getProductOptions(id) {
      NewDetail(id)
        .then(res => {
          // console.log("颜色规格：zs", res);
          this.css.showItems = true;
          let that = this;
          document.body.style.overflow = "hidden";
          window.addEventListener("touchmove", that._preventDefault);

          this.productInfoGroupItems = res;
        })
        .catch(e => {
          console.error(e);
        });
    },
    confirmOrder(orderno) {
      //取消订单
      let option = {
        msg: "您确定要取消订单吗？",
        okRext: "确定",
        ok: () => {
          CancelOrder({ orderno: orderno })
            .then(res => {
              console.log("取消成功", res);
              this.daojishi = false;
              this.orderStatus.currentStatus = "已关闭";
              this.orderStatus.orderText = "";
              this.orderStatus.groupBtn = "";
              this.toast("取消成功");
              if (this.teamGroup) {
                this.$store.dispatch("CancelOrderStatus", true);
                // window.location.reload()
              }
            })
            .catch(e => {
              console.error(e);
              this.toast("操作失败");
            });
        }
      };

      this.confirm(option);
    },
    QiyuProd() {
      QiyuProd.call(this)
    }
  }
};
</script>
<style scoped>
.busName {
  font-size: 14px;
  max-width: 35%;
  display: inline-block;
}
.pcolor {
  color: #ffc700;
}

.cart_head {
  position: relative;
  border-bottom: 1px solid #fafafa;
  padding: 15px 0px;
}
.cart_head .flex- {
  align-items: center;
}
.cart_head .status_order {
  position: absolute;
  right: 0;
  top: 15px;
  color: #ffc700;
}
.cart_head .status_order.gray {
  color: #999;
}
.order_head {
  padding: 15px 0px;
}

.check_footer {
  justify-content: space-between;
  padding: 15px 0;
}

.check_footer p > span:nth-of-type(1) {
  margin-right: 30px;
  display: inline-block;
  width: 71px;
  text-align: right;
}

.check_footer p {
  margin-bottom: 10px;
}
.check_footer .spec_sale {
  /* text-decoration: line-through; */
  color: #ffc700;
}

.footer_orderBtn,
.order_tip {
  border-top: 1px solid #fafafa;
  width: 100%;
  padding: 15px 0;
  overflow: hidden;
}

.order_tip {
  text-align: right;
}
.order_tip i {
  position: relative;
  font-style: normal;
  padding-left: 20px;
}
.order_tip i::before,
.order_tip i::after {
  content: "";
  position: absolute;
  width: 5px;
  height: 5px;
  border-left: 1px solid #333;
  border-bottom: 1px solid #333;
  left: 5px;
  top: 4px;
}
.order_tip i::after {
  width: 14px;
  height: 14px;
  border: 1px solid #333;
  border-radius: 50%;
  left: 0;
  top: 0;
}
.order_tip span {
  color: #000;
  font-size: 13px;
  display: inline-block;
  width: 16px;
  text-align: left;
  font-weight: bold;
  /* text-align: center; */
}
.order_pay {
  text-align: right;
  line-height: 24px;
}
.order_pay i {
  font-style: normal;
}
.order_pay span {
  color: #000;
  font-size: 13px;
  display: inline-block;
  width: 16px;
  font-weight: bold;
  /* text-align: left; */
}
.order_btn_box {
  /* width: 100%; */
  text-align: right;
  float: right;
}
.order_btn_box .btn_div {
  display: inline-block;
  border: 1px solid #ccc;
  padding: 5px 7px;
  font-size: 12px;
  border-radius: 2px;
  color: #999;
  /* margin-left: 10px; */
}
.order_unit .icon_server {
  width: 15px;
  height: 15px;
  display: inline-block;
  margin-left: 10px;
  vertical-align: middle;
}

.order_cost {
  width: 100%;
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
}

.order_cost p {
  border-bottom: 1px solid #fafafa;
  padding: 10px 0;
  margin-bottom: 0;
}

.order_cost p:nth-last-of-type(1) {
  border: none;
}

.order_unitbox {
  box-shadow: none;
  padding: 0;
}

.order_h,
.order_cost,
.or_status {
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  padding: 0 10px;
  border-radius: 4px;
}

.or_status .pay_style {
  margin-bottom: 20px;
}

.or_status {
  padding: 20px 10px;
}

.order_dbtn {
  border: none;
}

.copyBtn {
  border: 1px solid #ccc;
  border-radius: 2px;
  padding: 3px 12px;
  font-size: 12px;
}

.or_no input {
  display: inline-block;
  width: 65%;
  color: #666;
}

.or_no {
  width: 80%;
}

.uncloseOrder {
  color: #ffc700;
}

.closeOrder {
  color: #999;
}
.special_tips {
  /* white-space: nowrap; */
  /* width: 20%; */
  float: left;
  margin-top: 8px;
  color: #999;
}
.special_tips.coloryellow {
  color: #ffc700;
}
.pay-end-time {
  text-align: right;
  /* margin-bottom: 10px; */
}
.end-content {
  /* display: flex; */
  /* width: 25%; */
  /* justify-content: flex-end; */
  float: left;
}
.end-content span {
  min-width: 20px;
  line-height: 24px;
}
.order_btn_box .btn_div.btn_detail.bgPay {
  color: #fff;
  border: 1px solid #000;
  background: #000;
  margin-left: 3px;
}
.order_btn_box .btn_div.coloryellow {
  border-color: #ffc700;
  background: #ffc700;
  color: #000;
  margin-left: 3px;
}
.cart_content {
  width: 100%;
  position: relative;
  height: 110px;
  border-bottom: 1px solid #fafafa;
  padding: 0 10px;
}

.cart_content .cart_info {
  width: 60%;
  font-size: 12px;
}

.cart_content .img_box {
  position: relative;
  width: 23%;
  margin-right: 6px;
}
.cart_content .img_box .unUser_pro {
  position: absolute;
  display: inline-block;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  padding: 0 5px;
  color: #fff;
  text-align: center;
}
.cart_info p {
  margin: 5px 0;
}
.cart_info .spec_sale {
  /* text-decoration: line-through; */
  color: #ffc700;
}
.edit_box {
  width: 70%;
}
.order_btn_box .bgClassYello {
  background: #ffc700;
  color: #333;
  border: 1px solid #ffc700;
}
.order_btn_box .bgClassBor {
  color: #ffc700;
  border: 1px solid #ffc700;
}
</style>


