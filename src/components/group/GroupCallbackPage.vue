<template>
  <div>
        <!-- 团购 -->
      <div class="payPro" v-if="payType==1">
          <p> {{statusInfo}} </p>
          <span>{{orderPayInfo}}</span>
      </div>
      <div class="group " :class="{'mt':payType==2 && !insq}">
        <div class="statusInfo">{{statusInfo}} </div>
        <div class="padTopBot" v-if="infoByOrderData&&infoByOrderData.joins">
          <CommentGroup :teamlimitcount='infoByOrderData.teamlimitcount' :head-img-url="infoByOrderData.headimgurl" :joins="infoByOrderData.joins" :remaining-count="infoByOrderData.remainingcount" :order-status="infoByOrderData.order.orderstatus"></CommentGroup>
        </div>
        <div class="hint">
           <span class="hint-text">
             <span v-if="btnNum==2">请在
                <i class="pay-time" v-if="payTime&&payTime.m>=0">
                  {{payTime.m>=10?payTime.m:'0'+payTime.m}}:{{payTime.s>=10?payTime.s:'0'+payTime.s}}
                </i>
                &nbsp;分内完成支付
            </span>
            <span v-if="btnNum==4"  class="icon">剩余时间 :
              <i class="pay-time" v-if="payTime&&payTime.m>=0&&payTime.H>=0">
                 {{payTime.H>=10?payTime.H:'0'+payTime.H}}:{{payTime.m>=10?payTime.m:'0'+payTime.m}}:{{payTime.s>=10?payTime.s:'0'+payTime.s}}
              </i>
            </span>
            <!-- :class="{'icon':btnNum==1}" -->
             <span v-if="btnNum!=2&&btnNum!=4" >{{orderPayInfo}}</span>
            </span>
             <!-- 拼团成功（拼团详情）  拼团失败（去参团） 拼团中（邀请参团）  待支付（继续支付） 支付失败（去参团） -->
            <span v-if="payType==1" class="hint-go" :class="bgClass" @click="goToProductDetail(btnNum)">{{groupBtn}}</span>
            <span v-if="payType==2&&btnNum!=1" class="hint-go" :class="bgClass" @click="goToProductDetail(btnNum)">{{groupBtn}}</span>
            <span v-if="payType==2" class="hint-go"  @click="gotDetail()">拼团详情</span>
        </div>
    </div>
    <!-- 回调页面 Jsen-->
  </div>
</template>
<script>
import { GetGroupBuyInfoByOrderId } from "../../common/api/group";
import CommentGroup from "./CommentGroup";
import { DateDiff } from "../../common/util";
import { groupUI } from "./Ui";
import { mapGetters } from "vuex";
export default {
  components: { CommentGroup },
  props: {
    orderno: String,
    payType: { type: Number, default: 0 },
    insq: {
      defaul: false,
      type: Boolean
    }
  },
  data() {
    return {
      statusInfo: "拼团中",
      bgClass: "going",
      groupBtn: "",
      orderPayInfo: "",
      infoByOrderData: {},
      residue: "", // 已参团人数
      payTime: {},
      btnNum: 1,
      currentUser: {}
    };
  },
  computed: {
    ...mapGetters({
      CancelOrderStatus: "CancelOrderStatus"
    })
  },
  mounted() {
    this.infoByOrder();

    // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // console.log('用户信息', this.CancelOrderStatus);
  },
  methods: {
    infoByOrder() {
      // this.orderno
      GetGroupBuyInfoByOrderId({ orderNo: this.orderno }).then(res => {
        if (res) {
          this.infoByOrderData = res;
          this.emit(); // 要不要显示团购信息 在支付回调页 和订单详情页 头部
          console.log("支付回调 数据", this.infoByOrderData);
          this.residue =
            parseInt(res.teamlimitcount) - parseInt(res.remainingcount); // 团购人数 - 剩余人数 = 一参加人数
          // let currentUser = JSON.parse(window.localStorage.getItem('currentUser')).uid
          let orderpayexpiretime = null;
          if (this.orderno) {
            if (res.order.orderno == this.orderno) {
              orderpayexpiretime = res.orderpayexpiretime;
            } else {
              for (let i = 0; i < res.joins.length; i++) {
                if (res.joins[i].order.orderno == this.orderno) {
                  orderpayexpiretime = res.joins[i].orderpayexpiretime;
                }
              }
            }
          }
          // btnNum 1 拼团详情 2 继续支付 3 重新开图 4 邀请参团
          // if (this.infoByOrderData.joins.length < 1) return false
          let _ = this;
          var t = groupUI(res, _.orderno);
          console.log("返回类型", t);
          switch (t) {
            case 1:
              _.statusInfo = "拼团中";
              _.groupBtn = "继续支付";
              _.orderPayInfo = "已下单成功,待支付";
              _.setentime(orderpayexpiretime.replace(/-/g, "/"), "m");
              _.btnNum = 2;
              _.bgClass = "bgPay";
              break;
            case 2:
              _.orderPayInfo = "未在有效的时间内完成付款";
              _.statusInfo = "拼团失败";
              _.groupBtn = "重新参团";
              _.btnNum = 3;
              _.bgClass = "bgPay";
              break;
            case 3:
              _.statusInfo = "拼团中";
              _.orderPayInfo =
                "还差 " + res.remainingcount + " 人 , 邀请好友参团";
              _.setentime(_.infoByOrderData.endtime.replace(/-/g, "/"), "H");
              _.groupBtn = "邀请参团";
              _.bgClass = "going";
              _.btnNum = 4;
              break;
            case 4:
              _.statusInfo = "拼团中";
              _.groupBtn = "继续支付";
              _.orderPayInfo = "已下单成功,待支付";
              _.setentime(orderpayexpiretime.replace(/-/g, "/"), "m");
              _.btnNum = 2;
              _.bgClass = "bgPay";
              break;
            case 5:
              _.orderPayInfo = "未在有效的时间内完成付款";
              _.statusInfo = "拼团失败";
              _.groupBtn = "重新参团";
              _.btnNum = 3;
              _.bgClass = "bgPay";
              break;
            case 6:
              _.statusInfo = "拼团成功";
              // _.orderPayInfo = "已有" + _.residue + "人参加,拼团成功"; 已拼团成功,待发货
              _.orderPayInfo = "";
              _.groupBtn = "拼团详情";
              _.bgClass = "";
              _.btnNum = 1;
              break;
            case 7:
              _.orderPayInfo = "未在有效的时间内完成付款";
              _.statusInfo = "拼团失败";
              _.groupBtn = "重新开团";
              _.btnNum = 3;
              _.bgClass = "bgPay";
              break;
            case 8:
              _.orderPayInfo = "超过有效时间,拼团失败";
              _.statusInfo = "拼团失败";
              _.groupBtn = "重新开团";
              _.btnNum = 3;
              _.bgClass = "bgPay";
              break;
            case 9:
              _.orderPayInfo = "超过有效时间,拼团失败";
              _.statusInfo = "拼团失败";
              _.groupBtn = "重新参团";
              _.btnNum = 3;
              _.bgClass = "bgPay";
              break;
          }
        }
      }).catch(e=>{
        console.error('GetGroupBuyInfoByOrderId error: ',e)
      });
    },
    gotDetail() {
      this.$router.push({
        path: "/groupbuy/detail/" + this.infoByOrderData.teamid,
        query: { orderno: this.orderno }
      });
    },
    goToProductDetail(num) {
      // btnNum 1 拼团详情 2 继续支付 3 重新开图 4 邀请参团
      switch (num) {
        case 1:
          this.$router.push(
            "/groupbuy/detail/" +
              this.infoByOrderData.teamid +
              "?orderno=" +
              this.orderno
          );
          break
        case 2:
          let url = "/pay/" + this.orderno;
          if (this.insq) url = `/frame/${encodeURIComponent(url)}`
          this.$router.push(url)
          break
        case 3:
          this.$router.push("/productDetail/" + this.infoByOrderData.pid)
          break
        case 4:
          this.loadApp()
          break
      }
    },
    entime(time, type) {
      this.payTime = DateDiff({ destination: time, type: type });
    },
    setentime(time, type) {
      let _ = this;
      setInterval(function() {
        _.entime(time, type);
      }, 1000);
    },
    emit() {
      // this.infoByOrderData.teamid  // 是不是拼团
      this.$emit("passBack", this.infoByOrderData.teamid);
    }
  },
  watch: {
    CancelOrderStatus: function(oldval, newval) {
      let _ = this;
      if (oldval) {
        setTimeout(function() {
          _.infoByOrder();
        }, 500);
      }
    },
    payTime: function(oldval, newval) {
      let _ = this;
      if (newval.H === 0 && newval.m === 0 && newval.s === 0) {
        setTimeout(function() {
          _.infoByOrder();
        }, 500);
      }
      // console.log(newval.m,newval.s)
    }
  }
};
</script>
<style scoped>
/* //拼团 */
.payPro {
  font-size: 17px;
  color: #fff;
  background: url("/static/img/payBg.png") 0 0 no-repeat;
  background-size: cover;
  padding-left: 26px;
  height: 73px;
  padding-top: 16px;
}
.payPro p {
  position: relative;
  padding-left: 20px;
  font-size: 16px;
}
.payPro p:before,
.payPro p:after {
  content: "";
  position: absolute;
  left: 0;
  top: 4px;
  background: #fff;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}
.payPro p:before {
  width: 10px;
  height: 6px;
  border-left: 2px solid #ffc700;
  /* background: #ffc700; */
  border-bottom: 2px solid #ffc700;
  border-radius: 0;
  transform: rotate(-55deg);
  top: 8px;
  left: 3px;
  z-index: 2;
  font-style: normal;
}
.payPro span {
  font-size: 12px;
}
.group {
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  margin: 10px;
  /* margin-top: 55px; */
  font-size: 12px;
  color: #333;
  padding: 10px;
}
.mt {
  margin-top: 50px;
}
.address_unit {
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  margin: 15px 10px;
  width: auto;
}
.statusInfo {
  padding-left: 35px;
  position: relative;
  /* margin-bottom: 20px; */
  padding-bottom: 10px;
  border-bottom: 1px solid #f2f2f2;
}
.statusInfo:before {
  position: absolute;
  content: "";
  width: 21px;
  height: 17px;
  left: 0;
  top: 0;
  background: url("/static/img/group.png") 0 0 no-repeat #ffc700;
  background-size: 100% 100%;
}
.padTopBot {
  padding: 15px 0;
}
.hint {
  padding-top: 10px;
  border-top: 1px solid #f2f2f2;
  overflow: hidden;
}
.hint span {
  /* float: left; */
  line-height: 24px;
}
.hint span.hint-go {
  float: right;
  width: 67px;
  height: 21px;
  border: 1px solid #333;
  border-radius: 3px;
  text-align: center;
  line-height: 21px;
}
.hint span.hint-go.going {
  color: #000;
  background: #ffc700;
  border-color: #ffc700;
  margin-left: 3px;
}
.hint span.hint-go.bgPay {
  background: #000;
  color: #fff;
  margin-left: 3px;
}
.hint-text {
  text-align: right;
  margin-bottom: 10px;
}
.hint-text .pay-time {
  font-style: normal;
  display: inline-block;
  width: 25px;
  /* margin: 0 6px; */
  /* margin-right: 10px; */
  font-family: BASE_PRICE;
  color: #000;
  font-size: 14px;
  font-style: normal;
  font-weight: bold;
}
.hint-text .icon {
  position: relative;
  padding-left: 20px;
}
.hint-text .icon::before {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  border: 1px solid #333;
  left: 0;
  top: 0;
  border-radius: 50%;
}
.hint-text .icon::after {
  content: "";
  width: 5px;
  height: 5px;
  border-left: 1px solid #333;
  border-bottom: 1px solid #333;
  position: absolute;
  left: 5px;
  top: 4px;
}
.hint-text .icon i {
  display: inline-block;
  width: 60px;
  text-align: left;
  color: #000;
  font-size: 12px;
  font-style: normal;
  font-weight: bold;
}
</style>


