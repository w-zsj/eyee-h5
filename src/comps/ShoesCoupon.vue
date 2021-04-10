<template>
    <div class="shoes">
       
        <div class="sc" @click.stop="confirmOrder">
             <slot></slot>
            <!-- <i class="soon-send">急速发货</i> -->
            <div class="flex-aic pro-info">
                <div class="pro-img"><img :src="realinfo.mainpic" alt=""></div>
                <div class="flex-col flex-btwn">
                     <div class="pro-name flex-aic ellipsis">{{realinfo.productname||realinfo.name}}</div>
                    <div class="pro-price">
                        买入价
                        <span>¥{{realinfo.dealprice|tofixed}}</span>
                    </div>
                     <div class="pro-sico">
                        <span>发售价: ¥{{realinfo.price|tofixed}}</span>
                        <!-- <span>入手价: ¥{{realinfo.dealprice|tofixed}}</span> -->
                        <span>尺码：{{realinfo.size}}</span>
                    </div>
                </div>
            </div>

            <div class="cou-code flex-between">
                <div class="flex-col shoes-info">
                   <span>鞋券码：{{realinfo.couponno}}</span>
                   <span>寄存柜号：{{realinfo.lockerno}}</span>
                </div>
                <div class="code">
                    <img :src="realinfo.url" alt="">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  props: {
    isDetail: { type: Number, default: 0 }, // 1 订单详情标识
    realinfo:{type:Object,default:{}}
  },
  computed: {
    ...mapGetters({ userInfo: "userInfo" })
  },
  mounted() {
    console.log('realinfo====>>>',this.realinfo)
  },
  methods: {
    confirmOrder() {
      let _=this
      if (!_.isDetail) _.$router.push("/buyerdetail/" + _.realinfo.orderno);
      else{
        _.$router.push("/sneaker/detail/" + _.realinfo.productid);
      }
      // else if((_.realinfo.status==7||_.realinfo.status==14)&&!_.realinfo.isconsign){
      //   // 是否是代发货  是否寄存过
      //   let option = {
      //     title: "确定要寄存平台？",
      //     msg:
      //       "寄存平台可进行快速转卖，货物由平台进行统一管理，方便进行快速转卖；寄存之后也可申请发货，平台将在24小时内发出。",
      //     okRext: "确定寄存",
      //     cancelText: "我再想想",
      //     confirmButtonClass: "confirm",
      //     cancelButtonClass: "cancel",
      //     ok: () => {
      //       _.consign();
      //     },
      //     cancel: () => {}
      //   };

      //   _.confirm(option);
      // }
      
    }
  }
};
</script>
<style scoped>
.shoes {
  width: 100%;
  padding: 10px;
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  border-radius: 5px;
}
.shoes-sta {
  height: 20px;
  box-shadow: none;
  margin-bottom: 10px;
}
.cash-title {
  font-size: 12px;
  margin-left: -10px;
  margin-bottom: 10px;
}
.cash-title .cash-coupon {
  background: #232323;
  padding: 3px 7px;
  color: #fff;
  margin-right: 10px;
  border-radius: 0 3px 3px 0;
}
.cash-title .cash-coupon i {
  font-style: normal;
  background: #fff;
  color: #232323;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  display: inline-block;
  text-align: center;
  line-height: 15px;
  font-size: 13px;
  font-weight: bold;
}
.cash-title .quickness {
  background: #f0f0f0;
  font-size: 12px;
  color: #232323;
  padding: 3px 7px;
}
.cash-title .quickness i {
  width: 15px;
  height: 15px;
  display: inline-block;
  background: url("/static/imgs/ic_lightning.png") 0 0 no-repeat;
  background-size: 100% 100%;
  margin-right: 2px;
}
.sc {
  color: #333;
  min-height: 100px;
  font-size: 12px;
  position: relative;
}
.sc .pro-info {
  padding-bottom: 10px;
  border-bottom: 2px dashed #dcdcdc;
}
.sc .pro-img {
  width: 18.66vw;
  height: 18.66vw;
  margin-right: 10px;
}
.sc .pro-name {
  color: #000;
  font-size: 13px;
  font-family: PINGFANG;
  font-weight: bold;
}
.sc .pro-price {
  color: #000;
  font-size: 10px;
  font-weight: bold;
  font-family: PINGFANG;
}
.sc .pro-price span {
  font-size: 18px;
  line-height: 35px;
  font-family: PingFangSC-Semibold;
}
.sc .pro-sico {
  color: #646464;
  font-size: 10px;
}
.sc .pro-sico span {
  margin-right: 2vw;
}
.sc .pro-sico span:last-child {
  margin: 0;
}
.cou-code {
  padding-top: 10px;
}
.cou-code .code {
  width: 60px;
  height: 24px;
}
.shoes-info {
  color: #646464;
  font-size: 10px;
  font-family: PingFangSC-Regular;
  line-height: 26px;
}
.sc .soon-send {
  position: absolute;
  left: 0;
  top: -15px;
  color: #fff;
  font-style: normal;
  background: #000;
  padding: 2px 10px;
}
</style>

