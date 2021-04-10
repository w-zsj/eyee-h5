<template>
  <div v-if="!loading">
    <v-header>
      <div class="nav-tab2">
        <h3>{{payStatus==0?'支付失败':'支付成功'}}</h3>
      </div>
    </v-header>
    <!-- 团购 -->
    <GroupCallbackPage :orderno="orderNo" :pay-type="1" v-show="isShow" @passBack="callback"></GroupCallbackPage>
    <!-- 回调页面 -->
    <div class="pay_fail gaps" v-show="!isShow">
      <img :src="showImg" alt>
      <p
        class="pay_status flex-center"
        :class="{fail_icon:payStatus ==0,success_icon:payStatus==1}"
      >
        <em></em>
        <span>{{payStatus==0?'支付失败':'支付成功'}}</span>
      </p>
      <p v-if="orderNo">支付金额：¥{{payOrderInfos.paymoney | tofixed}}</p>
    </div>
    <div class="order_pay" v-if="orderNo">
      <label>
        订单编号:&nbsp;&nbsp;
        <input type="text" v-model="orderNo" id="orderno" readonly>
        <span @click.stop="copyText">复制</span>
      </label>
      <label>
        收货人:&nbsp;&nbsp;{{payOrderInfos.receiver}}
        <span class="mobile">{{payOrderInfos.mobile}}</span>
      </label>
      <label class="address_pay ellipsis">{{payOrderInfos.address}}</label>
    </div>
    <div class="order_detls" v-if="orderNo">
      <section class="ellipsis flex-aic">
        <!-- <span class="mall_brandShop" :class="{'mall_buyers':orderItem.businesstype == 2}">{{orderItem.businesstype == 1? '品牌店':'买手店'}}</span> -->
        <i
          :class="orderItem.businesstype===3?'ico-sp-store':(orderItem.businesstype===2?'ico-sp-buy':'ico-sp-official')"
        ></i>
        <span class="busName">{{payOrderInfos.businessname}}</span>
      </section>
      <div class="flex-aic detls_cons">
        <div class="img_box" @click.stop="goDetail">
          <img v-lazy="https(orderItem.mainpic)" alt>
        </div>
        <div class="detls_info">
          <p>{{orderItem.productname}}</p>
          <p>
            单价： ¥{{orderItem.paymoney | tofixed}}
            <span
              v-if="orderItem.salemoney!=orderItem.paymoney"
            >
              <em class="spec_sale">¥{{orderItem.salemoney | tofixed}}</em>
            </span>
          </p>
          <p
            :class="{overcount:orderItem.overCount}"
          >{{orderItem.color}} , {{orderItem.size}} , x{{orderItem.count}}</p>
        </div>
      </div>
      <p class="detls_count">共{{payOrderInfos.quantity}}件商品</p>
    </div>
    <div class="footer_btns" v-if="!insq&&isShow">
      <span @click="goOrderDetls()">订单详情</span>
      <span @click="checkAll()">去逛逛</span>
    </div>
    <!--拼手气红包-->
    <redPacket v-if="payStatus ==1" :url="url" :isShow="1"></redPacket>
    <div class="footer_btns" v-if="!insq&&!isShow">
      <span v-if="payStatus ==1" @click="goOrderDetls()">查看详情</span>
      <span @click="goHome()">{{payStatus == 0?'去逛逛':'继续逛逛'}}</span>
      <span @click="goPay()" v-if="payStatus ==0&&orderNo">继续支付</span>
    </div>

    <Pay v-if="payOrderno" :payorderno="payOrderno" :model="true"></Pay>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import { OrderDetail } from "../../common/api/order";
import GroupCallbackPage from "../group/GroupCallbackPage";
import redPacket from "@/comps/RedPacket";
import Pay from "../pay/Pay";

const ls = window.localStorage;

/* PayType:支付方式枚举 */
const PT = {
  alipay: 0,
  wechatpay: 1,
  unionpay: 2,
  webwxpay: 3,
  tenpay: 10,
  jdpay: 11,
  fenqilepay: 12
};

export default {
  // props: {
  //   payStatus: { type: Number, default: 1 }
  // },
  components: {
    GroupCallbackPage,
    redPacket,
    Pay
  },
  data() {
    return {
      loading: 1,

      payStatus: 1,
      orderNo: this.$route.params.orderId,
      orderInfo: {},
      isShow: false,
      sharePacketShow: false,
      url: "",

      payOrderno: ""
    };
  },
  beforeMount() {
    this.getOrder();
  },
  mounted() {
    this.distributionId = this.$route.query.distributionId || '';
    
  },
  computed: {
    ...mapGetters({ insq: "insq", user: "userInfo" }),
    payOrderInfos() {
      return this.orderInfo;
    },
    orderItem() {
      return JSON.parse(this.payOrderInfos.detailitem || "[]")[0] || {};
    },
    showImg() {
      if (this.payStatus === 1) {
        return "https://files.eyee.com/eyeeh5/img/paysuccess.png";
      } else {
        return "https://files.eyee.com/eyeeh5/img/payfail.png";
      }
    }
  },
  methods: {
    getOrder() {
      let _ = this,
        orderno = _.$route.params.orderId || "";
      if (!orderno) {
        _.loading = 0;
        _.payStatus = 0;

        _.toast("订单号不存在~");
        return;
      }

      OrderDetail({
        orderno: orderno,
        token: _.user.token
      })
        .then(res => {
          // alert(JSON.stringify(res))
          console.log("payunit OrderDetail", res);
          if (res) {
            _.payStatus = res.status != 1 ? 0 : 1;

            _.url = res.share && res.share.url;

            _.orderInfo = res;

            if(_.payStatus==1){
              let itm = _.orderInfo.items
              if(!_.$root.isdebug&&itm&&itm[0])  
                window.gio("track", "PresalePaySucceed",{'PresaleId':itm[0].saleid,'PresaleName':itm[0].productname,'PresaleSource':'h5'});
              // 数据埋点
              try{
                $log({ e: 'b2cpaysuccessB2c', p:  {orderID:res.orderno,payAmount:res.paymoney},t:0,ext:1 })
              } catch(err) { console.error('request error report error: ', err)}
             
            }
            let paytype = "";
            switch (res.paytype) {
              case PT.alipay:
                paytype = "支付宝";
                break;
              case PT.wechatpay:
                paytype = "移动微信";
                break;
              case PT.unionpay:
                paytype = "银联";
                break;
              case PT.webwxpay:
                paytype = "网页微信";
                break;
              case PT.tenpay:
                paytype = "QQ钱包";
                break;
              case PT.jdpay:
                paytype = "京东";
                break;
              case PT.fenqilepay:
                paytype = "分期乐";
                break;
            }
            let items = JSON.parse(res.detailitem || "[]");
            window.TDH5SDK &&
              window.TDH5SDK.iap.currencyPurchase(
                res.orderno,
                res.paymoney,
                "CNY",
                paytype,
                items,
                items.length
              );

            // if (res.status < 1) _.$router.replace("/payfail/" + orderno);

            if (res.items && res.items.length > 0) {
              res.items.forEach(product => {
                if (product.prostatus === true && _.payStatus === 1) {
                  // 分销申请商品
                  if (_.$root.ISAPP) {
                    let opt = {
                      name: "gotoAppWebview",
                      params: {
                        distributionId: _.distributionId,
                        url: `${window.document.location.protocol}//${
                          window.document.location.host
                        }/distribution/success`
                      }
                    };
                    _.javascriptBridge(opt);
                  } else {
                    _.$router.push("/distribution/success");
                  }
                } else if (product.prostatus === true && _.payStatus === 0) {
                  // 分销申请商品
                  if (_.$root.ISAPP) {
                    let opt = {
                      name: "gotoAppWebview",
                      params: {
                        distributionId: _.distributionId,
                        url: `${window.document.location.protocol}//${
                          window.document.location.host
                        }/distribution/product`
                      }
                    };
                    _.javascriptBridge(opt);
                  } else {
                    _.$router.push("/distribution/product");
                  }
                }
              });
            }
          }

          _.loading = 0;
        })
        .catch(err => {
          _.payStatus = 0;
          _.loading = 0;
          console.error("getOrder error: ", err);
          // _.toast("订单信息加载失败");
        });
    },
    goHome() {
      this.$router.replace("/");
    },
    goPay() {



      // this.$router.replace("/pay/" + this.orderNo);
      this.payOrderno = this.orderNo;
    },
    goOrderDetls() {
      this.$router.replace("/order/detail/" + this.orderNo);
    },
    callback(v) {
      if (v) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
      console.log("callback", v);
    },
    copyText() {
      document.execCommand("Copy");
      var Url2 = document.getElementById("orderno");
      Url2.select();
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.toast("复制成功！");
    },
    checkAll() {
      // this.toast('查看全部')
      this.$router.push("/groupbuy/list");
    }
  }
};
</script>
<style scoped>
.pay_fail {
  padding: 28px 0 10px;
  font-size: 13px;
  color: #666;
  text-align: center;
}
.pay_fail > img {
  width: 80%;
}
.pay_status {
  color: #ce726d;
  font-size: 17px;
  margin: 10px 0;
}
.pay_status.success_icon {
  color: #4ca8d4;
}
.pay_status > em {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px;
}
.pay_status.fail_icon > em {
  background-image: url(//files.eyee.com/mcdn/static/img/pay/p_failicon.png);
}
.pay_status.success_icon > em {
  background-image: url(//files.eyee.com/mcdn/static/img/pay/p_succicon.png);
}
.order_pay {
  margin: 10px;
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
}
.order_pay > label {
  display: block;
  /* height: 25px; */
  line-height: 35px;
  font-size: 13px;
  color: #666;
  padding: 0 15px;
}
.order_pay > label input {
  width: 55%;
}
.order_pay > label span {
  display: inline-block;
  /* height: 100%; */
  line-height: 20px;
  padding: 0 4%;
  border: 1px solid #ccc;
}
.order_pay > label:first-child {
  border-bottom: 1px solid #f2f2f2;
}
.order_pay > label:last-child {
  /* padding-left: 63px; */
}
.order_pay > label span.mobile {
  float: right;
  border: 0;
  line-height: 38px;
}
.order_detls {
  margin: 10px;
  padding: 10px;
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  /* margin-bottom: 40px; */
}
.detls_cons {
  width: 100%;
  position: relative;
  height: 110px;
}
.detls_cons .img_box {
  position: relative;
  width: 23%;
  margin-right: 10px;
}
.detls_cons .detls_info {
  width: 72%;
  font-size: 13px;
}
.detls_cons .spec_sale {
  text-decoration: line-through;
}
.detls_count {
  text-align: right;
  font-size: 14px;
}
.footer_btns {
  position: fixed;
  width: 100%;
  text-align: center;
  bottom: 10px;
}
.footer_btns > span {
  display: inline-block;
  text-align: center;
  width: 46%;
  height: 35px;
  line-height: 35px;
  background: #333;
  color: #fff;
  font-size: 16px;
}
.fadeTuihuo-enter-active,
.fadeTuihuo-leave-active {
  transition: opacity 0.3s;
}
.fadeTuihuo-enter,
.fadeTuihuo-leave-to {
  opacity: 0;
}
</style>
