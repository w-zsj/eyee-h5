<template>
  <div class="pay_jump">
    <img :src="iconImg" alt>
    <!-- <template v-if="inios"> -->
    <p class="btn-success" @click="orderdetl()">已完成支付</p>
    <p class="btn-fail" @click="orderdetl()">支付遇到问题</p>
    <!-- </template>
    <p class="load-more" v-else>
      <span>正在查询支付结果</span>
    </p>-->
  </div>
</template>
<script>
import { WxOutOrder, OrderDetail } from "../../common/api/order";

const ls = window.localStorage;
export default {
  data() {
    return {
      iconImg: "//files.eyee.com/mcdn/static/img/pay/pay_weixin.png" // require('../../assets/img/pay/pay_weixin.png')
    };
  },
  // mounted() {
  //   if (!this.inios) {
  //     setTimeout(() => {
  //       this.orderdetl()
  //     }, 1800)
  //   }
  // },
  // computed: {
  //   inios() {
  //     return this.$root.ISIOS
  //   }
  // },
  methods: {
    checkOrder(orderNum, token, wxInOut) {
      // alert('hhahahh'+this.$route.params.orderId)
      // alert(token+'m'+wxInOut+'mm'+orderNum)
      WxOutOrder({
        OrderNo: orderNum,
        Authorization: token,
        WxPayInOrOut: wxInOut
      })
        .then(res => {
          // alert(JSON.stringify(res))
          if (res.payresult && res.payresult == 1) {
            this.$router.replace("/paysuccess/" + orderNum);
          } else if (res.payresult && res.payresult == 0) {
            this.$router.replace("/payfail/" + orderNum);
          }
        })
        .catch(e => {
          console.log(JSON.stringify(e));
        });
    },
    orderdetl() {
      var token, orderno, wxInOut;
      if (this.$root.ISWX) {
        wxInOut = 1;
      } else {
        wxInOut = 2;
      }
      if (window.location.href.indexOf("?ut=") > 0) {
        token = window.location.href.split("?ut=")[1];
        orderno = window.location.href.split("jump/")[1].split("?ut")[0];
      } else {
        token = JSON.parse(ls.getItem("currentUser")).token;
        orderno = this.$route.params.orderId;
      }
      if (!orderno) {
        this.toast("订单号不存在~");
        this.$router.replace("/payfail/" + (orderno || ""));
        return;
      }
      OrderDetail({ orderno, token: token })
        .then(res => {
          // alert(JSON.stringify(res));
          if (res) {
            this.checkOrder(orderno, token, wxInOut);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
.pay_jump {
  padding: 40% 0 10px;
  text-align: center;
}
.pay_jump > img {
  margin-bottom: 40px;
}
.pay_jump [class*="btn-"] {
  width: 80%;
  height: 40px;
  line-height: 40px;
  margin: 0 auto 20px;
  font-size: 16px;
  border-radius: 4px;
}
.pay_jump .btn-success {
  background: #41a539;
  color: #fff;
}
.pay_jump .btn-fail {
  color: #ccc;
  background: #fff;
  /* border: 1px solid #41a539; */
}
.pay_jump .load-more {
  visibility: visible;
}
</style>
