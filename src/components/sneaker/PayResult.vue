<template>
  <div v-if="!loading">
    <!-- 回调页面 -->
    <div class="pay_fail gaps" v-show="!isShow">
      <img :src="showImg" alt>
      <p
        class="pay_status flex-center"
        :class="{fail_icon:payStatus ==0,success_icon:payStatus==1}"
      >
        <em></em>
        {{payStatus==0?'支付失败':(orderNo ?'支付成功':'出售成功')}}
      </p>
      <p class="flex-center" v-if="payStatus==1&&type != 2">
        <em class="pay_icons" v-if="cname" :class="cname"></em>
        <span
          v-if="payOrderInfos&&payOrderInfos.receiver"
        >支付金额：¥{{(payOrderInfos.paymoney||price) | tofixed}}</span>
        <span v-if="!payOrderInfos.receiver">
          <span
            v-if="price||payOrderInfos.paymoney"
          >支付{{(payOrderInfos.paymoney||price) | tofixed}}元保证金</span>
          <br>
          <span>商品交易成功将返还</span>
        </span>
      </p>
    </div>
    <div class="order_pay" v-if="payOrderInfos&&payOrderInfos.receiver">
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
    <!-- // 红包 -->
    <redPacket v-if="payStatus==1&&orderNo&&!lcukDrawFlag" :url="url" :isShow="1"></redPacket>
    <div class="process">
      <p>交易流程</p>
      <img src="/static/img/sneaker/sale_succeed.png" v-if="!payOrderInfos.receiver">
      <img src="/static/img/sneaker/pay_icon.png" v-if="payOrderInfos&&payOrderInfos.receiver">
    </div>

    <div class="footer_btns" v-if="!insq">
      <span v-if="!payOrderInfos.receiver&&$root.ISWX" @click="showTip">喊人来买</span>
      <span v-if="payStatus == 1 && payOrderInfos.receiver" @click="goOrderDetls()">查看详情</span>
      <span @click="goHome()">去逛逛</span>
      <span
        @click="goPay()"
        v-if="payStatus ==0 && payOrderInfos.receiver && orderInfo.status !== 7"
      >继续支付</span>
    </div>

    <div class="shareTips" v-if="isTips">
      <img src="/static/img/d_tips.png" class="tips" alt>
      <img src="/static/img/d_ok.png" @click="hideTip" class="btn" alt>
    </div>

    <Pay v-if="payOrderno" :payorderno="payOrderno" :model="true"></Pay>
  </div>
</template>
<script>
import { GetOrderDetail, Sellsuccess } from "../../common/api/sneaker";
import { mapGetters } from "vuex";
import GroupCallbackPage from "../group/GroupCallbackPage";
import { getUrlParam } from "@/common/util";
import { HomeTabType } from "@/utils/enum";
import redPacket from "@/comps/RedPacket";

import Pay from "./Pay";

const ls = window.localStorage;

/* PayType:支付方式枚举 */
const PT = {
  alipay: 8,
  wechatpay: 7,
  unionpay: 9
};
const PW = {
  alipay: 0,
  wechatpay: 1,
  unionpay: 2
};

export default {
  components: { GroupCallbackPage, redPacket, Pay },
  data() {
    return {
      loading: 1,

      orderNo: this.$route.params.orderId,
      orderInfo: {},
      isShow: false,
      payStatus: 1,
      pt: "",
      price: 0,
      cname: "",
      dataid: "",
      isTips: false,
      type: 1,
      url: "",
      lcukDrawFlag: 0, // 抽抽了标识

      payOrderno: ""
    };
  },
  beforeMount() {
    console.log("payunit beforeMount", this.orderInfo);

    // if (!this.orderInfo.orderno) this.getOrder();

    let _ = this;
    // 订单长度为15时 为b2c订单的分期乐支付结果回跳
    if (_.orderNo && _.orderNo.length === 19) { _.$router.replace("/paysuccess/" + _.orderNo); } else if (!_.orderInfo.orderno) _.getOrder();
  },
  mounted() {
    let _ = this;
    _.pt = parseInt(getUrlParam("pt")) || "";
    _.price = parseInt(getUrlParam("price")) || 0;
    _.dataid = getUrlParam("dataid");
    _.type = getUrlParam("type");
    _.lcukDrawFlag = getUrlParam("luckDraw")
    
    _.getSellsuccess();
    if (this.price) {
      switch (this.pt) {
        case PT.alipay:
          this.cname = "pay_ali";
          break;
        case PT.wechatpay:
          this.cname = "pay_weixin";
          break;
        case PT.unionpay:
          this.cname = "pay_unipay";
          break;
      }
    }
    setTimeout(() => {
      if (_.payStatus == 0) {
        _.getOrder();
      }
    }, 800);
  },
  computed: {
    ...mapGetters({ insq: "insq", localUserInfos: "userInfo" }),
    payOrderInfos() {
      return this.orderInfo;
    },
    orderItem() {
      return JSON.parse(this.payOrderInfos.detailitem || "[]")[0] || {};
    },
    // localUserInfos() {
    //   return JSON.parse(ls.getItem('currentUser'))
    // },
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
      let _ = this;
      if (_.$route.params.orderId) {
        GetOrderDetail({
          orderno: _.$route.params.orderId
        })
          .then(res => {
            console.log("返回结果--》", res);
            if (res) {
              _.orderInfo = res;
              _.url = (res.share || {}).url;
              /** c2c 订单状态
               * 1: 待付款,
               * 2: 待卖家发货,
               * 3: 待平台收货,
               * 4: 待鉴定,
               * 5: 鉴定通过待发货,
               * 6: 鉴定未通过待发货,
               * 7: 待买家确认,
               * 8: 买家同意待发货,
               * 9: 买家拒绝发货,
               * 10: 待买家收货,
               * 11: 已完成,
               * 12: 已关闭,
               * 13: 取消订单,
               * 14: 超时未发货,
               * 15: 虚假发货,
               * 16: 待卖家收货,
               * 17: (一个售后的状态)
               */
              // 1 待付款, 12 已关闭, 13 取消订单
              // if (res.status === 1 || res.status === 7) {

              if (!(res.status > 1 && res.status !== 12 && res.status !== 13)) {
                _.payStatus = 0;
                console.log(res.status, "res.status");
              } else {
                _.payStatus = 1;
              }
            }
            _.loading = 0;
          })
          .catch(err => {
            _.payStatus = 0;
            _.loading = 0;
            console.error(err);
            _.toast("订单信息加载失败");
          });
      }
    },
    getSellsuccess() {
      let _ = this;
      if (_.dataid) {
        Sellsuccess({
          saleid: _.dataid,
          type: getUrlParam("type") ? 2 : 1
        })
          .then(res => {
            if (res) {
              _.price = parseInt(res.pledgemoney);
              if (_.price) {
                switch (res.payway) {
                  case PW.alipay:
                    _.cname = "pay_ali";
                    break;
                  case PW.wechatpay:
                    _.cname = "pay_weixin";
                    break;
                  case PW.unionpay:
                    _.cname = "pay_unipay";
                    break;
                }
              }
              if (!getUrlParam("type") && res.payway == -1) {
                _.payStatus = 0;
              }
              if (res.shareinfo) {
                setTimeout(() => {
                  _.initShare({
                    info: {
                      title: res.shareinfo.title,
                      desc: res.shareinfo.content,
                      img: res.shareinfo.icon,
                      url: res.shareinfo.url
                    }
                  });
                }, 1000);
              }
            }
            _.loading = 0;
          })
          .catch(e => {
            _.loading = 0;
            console.error("get Sellsuccess error: ", e);
          });
      } else _.loading = 0;
    },

    goHome() {
      this.$router.replace("/?t=" + HomeTabType.sneaker);
    },
    goPay() {
      // this.$router.replace("/sneaker/pay/" + this.orderNo);
      this.payOrderno = this.orderNo;
    },
    goOrderDetls() {
      this.$router.replace("/buyerdetail/" + this.orderNo + "?payresult=1");
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
    showTip() {
      this.isTips = true;
    },
    hideTip() {
      this.isTips = false;
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
  margin-bottom: 40px;
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

.pay_icons {
  display: block;
  width: 8vw;
  height: 8vw;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  margin-right: 10px;
}
.pay_icons.pay_ali {
  background-image: url(//files.eyee.com/mcdn/static/img/pay/pay_ali.png);
}
.pay_icons.pay_weixin {
  background-image: url(//files.eyee.com/mcdn/static/img/pay/pay_weixin.png);
}
.pay_icons.pay_unipay {
  background-image: url(//files.eyee.com/mcdn/static/img/pay/pay_unipay.png);
}

.process {
  padding-bottom: 50px;
}

.process p {
  font-size: 16px;
  margin: 6.4vw auto;
  text-align: center;
}

.process img {
  width: 86.4vw;
  margin: 0 auto;
  display: block;
}

.shareTips {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.tips {
  position: absolute;
  width: 54vw;
  height: 50vw;
  top: 12vw;
  right: 8vw;
}

.btn {
  width: 44.8vw;
  height: 16.53vw;
  position: absolute;
  top: 83vw;
  left: 27vw;
}
</style>
