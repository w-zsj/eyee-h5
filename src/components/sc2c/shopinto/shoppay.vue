<template>
    <div>
      <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>{{payinback?'补缴保证金':'支付保证金'}}</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
         <!-- <div class="baozhengjin">
           <span>实名认证—</span>支付保证金
        </div> -->
        <div class="pay_money_bg">
          <div class="pay flex-col">
            <p>{{payinback?'补缴保证金':'保证金'}}</p>
            <span>￥{{paymoney|tofixed}}</span>
          </div>
          <div class="introduce">
            <!-- <p>1. 可以同时出售多双球鞋</p> -->
            <p>1. 可以同时出售多个商品</p>
            <p>2. 球鞋商品可享受0佣金优惠</p>
            <p>3. 不必每次缴纳保证金</p>
          </div>
        </div>
       <div class="next"  @click.stop="pay">
          去支付
        </div>
        <!-- <div v-show="showpayModal" class="paylist" @click.stop="cancel"></div> -->
        <!-- <transition name="paylist" > -->
          <PayItem @close='closePay' v-if="showpayModal" :source='2' :successUrl="returnUrl" :price="paymoney" failUrl='/shoppay'></PayItem>
        <!-- </transition> -->
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { becomeBusinessDetail } from "../../../common/api/snekc2c.js";
import { consciencePledge } from "../../../common/api/snekc2c.js";
import PayItem from "../../sneaker/PayItem";
// import inpay from "./inpay";
export default {
  data() {
    return {
      payinback: 0,
      showpayModal: false,
      paymoney: 0,
      ispresell: false
    };
  },

  components: { PayItem },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo",
      detailtype: "detailtype" // 1 商品详情进来的 支付成功后回调到商品详情  0  我的出售页进来的 回调到我的出售页
    }),
    returnUrl() {
      let _ = this;
      let t = _.detailtype;
      let url = "";
      if (t.detailtype) {
        url = "/sneaker/detail/" + t.id;
      } else url = "/shopcenter";
      return url;
    }
  },
  mounted() {
    this.payinback = Number(this.$route.query.payinback);
    this.selltype = Number(this.$route.query.selltype);
    if(this.selltype == 1) {
      this.ispresell = true
    } else if(this.selltype == 0) {
      this.ispresell = false
    }
    if(this.payinback) {
      consciencePledge({ ispresell: this.ispresell })
      .then(res => {
        console.log("补缴保证金", res);
        if (res.pledge) {
          this.paymoney = res.pledge;
        }
      })
      .catch(e => {
        console.error(e);
      });
    } else {
      becomeBusinessDetail()
      .then(res => {
        console.log("保证金", res);
        if (res.pledge) {
          this.paymoney = res.pledge;
        }
      })
      .catch(e => {
        console.error(e);
      });
    }
  },
  methods: {
    pay() {
      this.showpayModal = true;
    },
    closePay() {
      this.showpayModal = false;
    }
  }
};
</script>
<style scoped>
.nav-top{
  border-bottom: 1px solid #f5f5f5;
}
.paylist-enter-active,
.paylist-leave-active {
  transition: all 0.5s;
  /* bottom:0; */
}
.paylist-enter,
.paylist-leave-to {
  transform: translateY(300px);
  opacity: 0;
}
.paylist {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 99;
  font-size: 14px;
}
.paycontent {
  position: fixed;
  height: 350px;
  background: #fff;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 100;
}
.baozhengjin {
  height: 50px;
  line-height: 50px;
  background: #f5f5f5;
  padding-left: 15px;
  color: #ccc;
}
.baozhengjin span {
  color: #333;
  padding-right: 10px;
}
.pay_money_bg {
  background: url("/static/img/pay_money_bg.png") 0 0 no-repeat;
  background-size: 100% 100%;
  margin: 30vw 11vw 11vw 11vw;
  padding-top: 25px;
  padding-bottom: 0;
  height: 60vw;
}

.pay {
  /* height: 39vw; */
  text-align: center;
  justify-content: center;
  align-items: center;
}
.pay p {
  font-size: 14px;
  color: #333;
}
.pay span {
  color: #333;
  font-weight: bold;
  font-size: 24px;
}
.next {
  background: #333;
  font-size: 16px;
  color: #fff;
  line-height: 44px;
  text-align: center;
  margin: 30px;
  border-radius: 5px;
}
.introduce {
  font-size: 12px;
  color: #666666;
  margin: 10vw 18vw;
  margin-bottom: 10vw;
  /* text-align: center; */
}
.introduce p {
    height: 20px;
  }
</style>



