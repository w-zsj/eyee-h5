<template>
  <div>
    <v-header :returnBack="payresult">
      <div class="nav-tab2">
        <h3>订单详情</h3>
      </div>
    </v-header>
    <div v-if="hasData">
      <div class="statustext flex-between">
        <span>{{curstatus.currentOrderText}}</span>
        <span class="icon_server service_black" @click.stop="QiyuProd"></span>
      </div>
      <div class="address">
        <div class="zhuizong">
          <em class="icon" v-if="orderInfo.status!=1"></em>
          <div class="flex-between ordersta">
            <span
              class="ellipsis"
              :class="{'goods-time':orderInfo.status==1} "
            >{{curstatus.failedmessage}}</span>
            <span @click.stop="gologistics()" class="go-track">订单跟踪 ></span>
          </div>
          <p v-if="createTime">{{createTime}}</p>
        </div>
        <div class="zhuizong buyer">
          <em class="iconmap icon"></em>
          <div class="flex-between ordersta flex-aic">
            <span class="addressName">收货人：{{orderInfo.receiver}}</span>
            <span>{{orderInfo.mobile}}</span>
          </div>
          <p>{{orderInfo.address}}</p>
        </div>
      </div>
      <!--  鞋券-->
      <div v-if="ShoesCou">
         <div class="productorder" :class="{'no-pad':ShoesCou}"  
            v-for="(item,index) in orderInfo.items" :key="index">
          <shoes-coupon  :isDetail="1" :realinfo="item">
            <template>
              <div class="flex-btwn">
                <div class="flex-center cash-title">
                    <span class="cash-coupon">现货券 <i >!</i></span>
                    <span class="quickness flex-center" v-if="item.isconsign"><i></i> 极速发货</span>
                </div>
              </div>
            </template>
          </shoes-coupon>
        </div>
      </div>
      <!--  -->
      <div class="productorder-wrap" v-else>
        <div
          class="flex-between productorder"
          v-for="(item,index) in orderInfo.items"
          :key="index"
          @click.stop="productDetail(item.productid)"
        >
          <div class="productimg">
            <img :src="item.mainpic" alt>
          </div>
          <div class="productinfo">
            <div class="productname">{{item.name}}</div>
            <div class="price">单价:&nbsp;￥{{item.price}}</div>
            <div>{{item.color}} {{item.size}} {{item.producttype==21?"码":""}},数量 X{{item.num}}</div>
          </div>
        </div>
      </div>
      <!-- 商品价格信息 -->
      <div class="productmoney">
        <div class="flex-end">
          <em>共1件商品</em>
          <div class="flex-end productNum">
            <span>商品总额:</span>
            <span>¥{{orderInfo.salemoney}}</span>
          </div>
        </div>
        <div class="flex-end">
          <span>顺丰配送:</span>
          <span>¥{{orderInfo.expressfee}}</span>
        </div>
        <div class="flex-end" v-if="orderInfo.discountmoney">
          <span>优惠券:</span>
          <span>-¥{{orderInfo.discountmoney}}</span>
        </div>
        <div class="flex-end" v-if="orderInfo.redpacketmoney>0">
          <span>红包:</span>
          <span>-¥{{orderInfo.redpacketmoney}}</span>
        </div>
        <div class="flex-end">
          <span>总计:</span>
          <span class="price">¥{{orderInfo.paymoney}}</span>
        </div>
      </div>
      <!--拼手气红包-->
      <redPacket v-if="orderInfo&&orderInfo.share&&orderInfo.share.isshowredpacket==1" :url="url"></redPacket>
      <!-- 保证金信息 -->
      <div class="cash-deposit">
        <div class="orderno">
          <div class="bordderBotTop">
            <div class="flex-between">
              <div>订单编号：</div>
              <div><span class="copy-btn" @click="copyText('copy',orderInfo.orderno)">复制</span> {{orderInfo.orderno}}</div>
              <input id="copy" class="hide" type="text">
              <!-- <div>{{orderInfo.orderno}}</div> -->
            </div>
            <div class="flex-between" v-if="orderInfo.dealnum">
              <div>交易编号：</div>
              <div>{{orderInfo.dealnum}}</div>
            </div>
            <div class="flex-between">
              <div>创建时间:</div>
              <div>{{orderInfo.createtime}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 返还牛丸 -->
      <div class="ox_box" v-if="curstatus.currentOrderText == '待付款' || curstatus.currentOrderText == '待发货' || curstatus.currentOrderText == '待收货' || curstatus.currentOrderText == '已完成'">
        <div class="ox-ball flex flex-btwn flex-aic" v-if="orderInfo.newballs && (curstatus.currentOrderText == '待付款' || curstatus.currentOrderText == '待发货' ||  curstatus.currentOrderText == '待收货')">
          <div class="info">确认收货返:</div>
          <div class="num flex flex-aic flex-star">
            <img src="//files.eyee.com/mcdn/img/ball/icon_ox.png" alt="">
            {{orderInfo.newballs}}牛丸
          </div>
        </div>  
        <div class="ox-ball flex flex-btwn flex-aic" v-if="orderInfo.newballs && curstatus.currentOrderText == '已完成'">
          <div class="info">已返:</div>
          <div class="num flex flex-aic flex-star">
            <img src="//files.eyee.com/mcdn/img/ball/icon_ox.png" alt="">
            {{orderInfo.newballs}}牛丸
          </div>
        </div>  
      </div>
      <div class="flex-end operation-btn">
        <!-- <span class="cancel" v-if="orderInfo.status===6||orderInfo.status===7" @click.stop="orderOperation(1)">取消订单</span> -->
        <span
          class="cancel"
          v-if="orderInfo.status==11||orderInfo.status==12||orderInfo.status==13||orderInfo.status==16||orderInfo.status==17"
          @click.stop="orderOperation(4)"
        >删除订单</span>
        <span @click.stop="gologistics()" v-if="orderInfo.status===7&&this.action===3">去确认</span>
        <span v-if="orderInfo.status===10" @click.stop="orderOperation(2)">确认收货</span>
        <span v-if="orderInfo.status===1" @click.stop="orderOperation(3)">立即付款</span>
        <span
          @click.stop="goAftersale(orderInfo.orderno)"
          v-show="isShowAfterSale == 2||isShowAfterSale == 3"
        >{{orderInfo.refundstatustext}}</span>
      </div>
    </div>
    <!-- 缺省状态 -->
    <div v-else class="default">
      <img :src="defaultMessageImgUrl" alt>
      您暂无出售中商品哦~
      <div class="gosell" @click.stop="gosell">去出售</div>
    </div>

    <Pay v-if="payOrderno" :payorderno="payOrderno" :model="true" :close='true' @close="payModelClose"></Pay>
  </div>
</template>
<script>
import {
  buyerDetail,
  getTrace,
  deleteOrder,
  receiptOrder,
  cCancleOrder
} from "../../../common/api/snekc2c.js";
import { mapGetters } from "vuex";
import { DateDiff, _getDate } from "../../../common/util";
import { QiyuProd } from "../../../common/api/WyQiyu";
import redPacket from "@/comps/RedPacket";

import Pay from "../../sneaker/Pay";
import ShoesCoupon from "../../../comps/ShoesCoupon";
export default {
  data() {
    return {
      orderInfo: [],
      timeData: { H: "00", m: "00", s: "00" },
      redClass: "",
      failedmessage: "",
      action: null,
      defaultMessageImgUrl: "/static/img/salepage_image_empty.png", //  /static/img/page_image_empty.png
      hasData: true,
      createTime: "",
      payresult: 0,
      isShowAfterSale: "",
      url: "",

      payOrderno: ""
    };
  },
  components: {
    redPacket,
    Pay,
    ShoesCoupon
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo"
    }),
    orderno() {
      return this.$route.params.id;
    },
    ShoesCou(){
      return this.orderInfo.ordertype == 4
    },
    curstatus() {
      let s = this.orderInfo;
      let currentOrder = {};
      currentOrder.failedmessage = this.failedmessage;
      switch (s.status) {
        case 1:
          currentOrder.currentOrderText = "待付款";
          let currentTime = new Date();
          if (currentTime.getTime() > new Date(s.stoptime).getTime()) {
            currentOrder.failedmessage = "支付超时";
            this.redClass = "redClass";
          } else {
            this.setentime(s.expiredtime, "H");
            currentOrder.failedmessage =
              "支付剩余时间: " +
              (this.timeData.H > 0 ? this.timeData.H : "00") +
              ":" +
              (this.timeData.m > 0 ? this.timeData.m : "00") +
              ":" +
              (this.timeData.s > 0 ? this.timeData.s : "00");
          }
          break;
        case 2:
        case 14:
          // "若卖家超时未发货 您将获得" + s.earnestmoney + "元赔付款";
          currentOrder.currentOrderText = "待发货";
          currentOrder.failedmessage = "等待卖家发货";
          break;
        case 4:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 15:
          currentOrder.currentOrderText = "待收货";
          this.getTraceOrder();
          break;
        case 11:
          currentOrder.currentOrderText = "已完成";
          this.getTraceOrder();
          break;
        case 6:
        case 9:
        case 12:
        case 16:
        case 17:
          currentOrder.currentOrderText = "已关闭";
          this.getTraceOrder();
          if (!this.failedmessage) {
            currentOrder.failedmessage = "订单已关闭";
          }
          break;
        case 13:
          currentOrder.currentOrderText = "已关闭";
          currentOrder.failedmessage = "您已取消订单";
          break;
      }
      return currentOrder;
    }
  },
  mounted() {
    let _ = this;
    this.buyerDetail(); // 订单详情
    this.payresult = Number(this.$route.query.payresult);
  },
  methods: {
    payModelClose() {
      let _ = this;
      if (_.payOrderno) {
        cCancleOrder({ orderno: _.payOrderno }).then(res => {
          _.buyerDetail();
        });
      }
      _.payOrderno = "";
    },
    goAftersale(id) {
      // this.$router.push(`/order/AfterSale/Temp/${id}`)
      if (this.orderInfo.refundstep == 1) {
        this.$router.push(`/order/AfterSale/Temp/${id}`);
      } else if (this.orderInfo.refundstep == 2) {
        this.$router.push({
          path: "/order/AfterSale/add",
          query: { orderno: id, refundtype: 1 }
        });
      } else if (this.orderInfo.refundstep == 3) {
        this.$router.push(`/order/AfterSale/info/${this.orderInfo.refundid}`);
      }
    },
    countdownTime(time, type) {
      this.timeData = DateDiff({ destination: time, type: type });
      let t = this.timeData;
      if (
        this.timeData.H === 0 &&
        this.timeData.m === 0 &&
        this.timeData.s === 0
      ) {
        clearInterval(this.clearTime);
        return;
      }
      t.H = t.H < 10 ? "0" + t.H : t.H;
      t.m = t.m < 10 ? "0" + t.m : t.m;
      t.s = t.s < 10 ? "0" + t.s : t.s;
    },
    setentime(time, type) {
      let _ = this;
      _.clearTime = setInterval(function() {
        _.countdownTime(time, type);
      }, 1000);
    },
    gosell() {
      this.$router.push("/");
    },
    buyerDetail() {
      let _ = this;
      let op = {
        orderno: _.orderno
      };
      buyerDetail(op)
        .then(res => {
          if (res) {
            _.orderInfo = res;
            _.url = (res && (res.share || {}).url) || "";
            _.isShowAfterSale = res.items[0].aftersale;
            console.log("isShowAfterSale", _.isShowAfterSale);
            _.hasData = true;

            if (_.$route.query.p && res.status == 1)
              _.$nextTick(() => {
                _.payOrderno = _.orderno;
              });
          } else _.hasData = false;
          console.log("买家订单详情", res);
        })
        .catch(err => {
          _.hasData = false;
          console.error(err);
        });
    },
    orderOperation(type) {
      // 4 删除订单 2 确认收货 3 立即付款
      let option = {
        title: "",
        okText: "我再想想",
        cancelText: "确定",
        confirmButtonClass: "confirm",
        cancelButtonClass: "cancel",
        msg: "",
        cancel: () => {}
      };
      if (type === 4) {
        option.title = "删除订单";
        option.cancelText = "确认删除";
        option.msg = "将再也看不到相关记录了哦~";
        option.cancel = () => {
          this.delete({ orderno: this.orderno });
        };
        this.confirm(option);
      } else if (type === 2) {
        option.title = "";
        option.cancelText = "未收到";
        option.okText = "已收到";
        option.msg = "请您确认是否已经收到商品?";
        option.ok = () => {
          this.receipt();
        };
        this.confirm(option);
      } else if (type === 3) {
        this.payOrderno = this.orderno;
        // let url = "/sneaker/pay/" + this.orderno;
        // this.$router.push(url);
      }
    },
    delete(op) {
      deleteOrder(op)
        .then(res => {
          this.toast("删除成功");
          this.$router.go(-1);
        })
        .catch(err => {
          console.error(err);
        });
    },
    receipt() {
      // orderno
      receiptOrder({ orderno: this.orderno })
        .then(res => {
          this.toast("您已确认收货");
          this.buyerDetail();
        })
        .catch(err => {
          if (err.code == 1511508) {
            this.toast("当前正在售后,无法确认收货");
          } else {
            console.error(err);
          }
        });
    },
    gologistics() {
      this.$router.push("/logistics/" + this.orderInfo.orderno + "/2"); // 1 卖家 2 买家
    },
    productDetail(id) {
      this.$router.push("/sneaker/detail/" + id);
    },
    getTraceOrder() {
      // 参数 订单编号 orderno 和 角色role
      let option = {
        orderno: this.orderno,
        role: 2
      };
      getTrace(option)
        .then(res => {
          if (res.traces) {
            let firsttracs = res.traces[0][0];
            if (firsttracs && firsttracs.logistics) {
              this.failedmessage = firsttracs.logistics[0].title;
              this.action = firsttracs.action;
            } else {
              this.failedmessage = firsttracs.title;
            }
            this.createTime = firsttracs.createdat;
          }

          // console.log("订单追踪", res.tracs[0][0]);
        })
        .catch(e => {
          console.error(e);
        });
    },
    QiyuProd() {
      QiyuProd.call(this);
    },
    copyText(id, info) {
      // document.execCommand("Copy");
      var orUrl = document.getElementById(id);
      orUrl.value = info;
      orUrl.select();
      if (document.execCommand("copy")) {
        document.execCommand("copy");
        this.toast("已复制");
      }
    }
  }
};
</script>
<style scoped>
body {
  background: #f5f5f9;
}
.copy-btn {
  float: left;
  text-align: center;
  margin: 4px 8px;
  width: 30px;
  height: 16px;
  border-radius: 2px;
  font-size: 10px;
  color: #666;
  line-height: 18px;
  background-color: #ffc700;
}
.hide {
  position: absolute;
  bottom: 0;
  z-index: -10;
  opacity: 0;
}
.go-track {
  width: 58%;
  text-align: right;
}
.default {
  text-align: center;
  font-size: 16px;
  color: #333;
}
.default img {
  width: 60%;
  margin: 0 auto;
  display: block;
  margin-top: 21vw;
  margin-bottom: 15px;
}
.icon_server.service_black {
  background: url("/static/img/service_white.png") 0 0 no-repeat;
  background-size: cover;
}
.operation-btn {
  padding: 10px 0;
}
.operation-btn span {
  width: 21vw;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  color: #ffc700;
  text-align: center;
  border: 1px solid #ffc700;
  border-radius: 3px;
  margin: 0 15px;
}
.operation-btn span.cancel {
  color: #999;
  border: 1px solid #999;
}
.statustext {
  background: url("/static/img/order_details_page_bg_state_default.png") 0 0
    no-repeat;
  background-size: cover;
  color: #fff;
  font-size: 20px;
  padding-left: 15px;
  line-height: 80px;
  font-weight: bold;
}
.address {
  padding: 15px;
  padding-bottom: 0;
  background: #fff;
}
.zhuizong {
  padding-left: 28px;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
  background: #fff;
  padding-bottom: 15px;
}
.ordersta {
  font-size: 12px;
  color: #333;
  font-weight: bold;
}
.logics {
  color: #ed4949;
}
.ordersta .goods-time {
  /* color: #ed4949; */
  position: relative;
}
.ordersta .goods-time::before {
  content: "";
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1px solid #333;
  left: -26px;
  top: 2px;
}
.ordersta .goods-time::after {
  content: "";
  position: absolute;
  height: 5px;
  width: 5px;
  left: -21px;
  top: 6px;
  border-left: 1px solid #333;
  border-bottom: 1px solid #333;
}
.ordersta .addressName {
  width: 60%;
  display: inline-block;
}
.zhuizong p {
  font-size: 12px;
  color: #666;
  padding: 10px 0;
  padding-bottom: 0;
}
.zhuizong .icon {
  position: absolute;
  width: 20px;
  height: 20px;
  background: url("/static/img/order3.png") 0 0 no-repeat;
  background-size: 100% auto;
  left: 0;
  top: 0;
}
.zhuizong .icon.iconmap {
  background: url("/static/img/details_page_icon_local.png") 0 0 no-repeat;
  background-size: 100% auto;
}
.buyer {
  padding-top: 13px;
  border: 0;
}
.buyer .icon {
  top: 14px;
}
.buyer span.toas {
  color: #ed4949;
  font-size: 12px;
}

.productorder-wrap {
  background: #fff;
}
.productorder {
  margin: 15px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px #ccc;
}
.productorder.no-pad{
  padding: 0;
}
.productimg {
  width: 30%;
}
.productinfo {
  width: 70%;
  margin-left: 3%;
  font-size: 14px;
  line-height: 28px;
}

.productinfo .saleprice {
  font-size: 12px;
  text-decoration: line-through;
  color: #999;
}
/* .productinfo .productprice {
  font-size: 14px;
  padding-top: 10px;
}
.productinfo .productprice .price {
  font-weight: bold;
  font-size: 16px;
} */

.cash-deposit {
  font-size: 12px;
  background: #fff;
}
.bordderBotTop,
.productmoney {
  padding: 10px;
  margin: 15px;
  border-radius: 5px;
  box-shadow: 0 0 5px #ccc;
}
.productmoney {
  font-size: 12px;
  line-height: 25px;
}
.productmoney > div em {
  /* margin-right: 40vw; */
}
.productmoney > div span {
  width: 25%;
  text-align: right;
}
.productmoney .productNum {
  width: 80%;
}
.productmoney .productNum span:nth-child(1) {
  margin-right: 4vw;
}
.productmoney > div span:nth-child(1) {
  /* margin-right: 20px; */
  width: 25%;
  text-align: right;
}
.productmoney .price {
  font-family: "PingFangSC";
  color: #ffc700;
}
.orderno {
  /* padding: 15px; */
  line-height: 24px;
}
.orderno p {
  font-size: 10px;
  color: #666;
}
.cash-deposit .title {
  background: #f5f5f9;
  text-align: center;
  line-height: 40px;
  position: relative;
}
.cash-deposit .title::before,
.cash-deposit .title::after {
  content: "";
  position: absolute;
  width: 40px;
  height: 1px;
  top: 50%;
  left: 35%;
  transform: translate(-50%, -50%);
  background: #979797;
}
.cash-deposit .title::after {
  left: 65%;
}

.icon_server {
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-left: 5px;
  vertical-align: middle;
  color: #fff;
  margin-right: 15px;
}
.gosell {
  position: fixed;
  width: 80%;
  left: 10%;
  bottom: 21vw;
  text-align: center;
  background: #333;
  color: #fff;
  line-height: 44px;
  height: 44px;
  border-radius: 5px;
}
.ox_box{
  padding: 0 15px;
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


