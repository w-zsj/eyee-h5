<template>
  <div>
    <v-header v-if="!insq">
      <div class="nav-tab2">
        <h3>{{shopType?'订单详情':'出售详情'}}</h3>
      </div>
      <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
    </v-header>
    <div v-if="hasData">
      <div v-if="orderInfo.status == 2" class="statustext">
        <div class="row-status flex-between">
          <span>{{currentOrderText}}</span>
          <span class="icon_server service_black" @click.stop="QiyuProd"></span>
        </div>
        <div class="delivery-time">
          <span id="textTime">剩余发货时间:
            <span :class="{'goods-time':shopType==1}">{{infoMessage}}</span>
          </span>
        </div>
    </div>
    <div v-if="orderInfo.status != 2" class="statustext flex-between">
      <span>{{currentOrderText}}</span>
      <span class="icon_server service_black" @click.stop="QiyuProd"></span>
    </div>
      <div class="address" v-if="shopType!=0">
        <div class="zhuizong">
          <em class="icon" v-if="shopType!=1"></em>
          <div class="flex-between ordersta">
            <!-- <span :class="{'goods-time':shopType==1}">等待卖家发货</span> -->
            <span :class="{'goods-time':shopType==1}" v-if="orderInfo.status == 2" >等待卖家发货</span>
             <span class=" ellipsis" :class="{'goods-time':shopType==1}" v-if="orderInfo.status != 2" >{{infoMessage}}</span>
            <span v-if="shopType==1" @click.stop="gologistics()" class="logics">填写物流单号 ></span>
            <span
              @click.stop="gologistics()"
              v-if="shopType!=0&&shopType!=1"
              class="go-track"
            >订单跟踪 &nbsp;></span>
          </div>
          <p v-if="createTime">{{createTime}}</p>
        </div>
        <div
          class="zhuizong buyer"
          @touchstart="longtap()"
          @touchend="clearLong(hideid.address,orderInfo.addinfo)"
        >
          <em class="iconmap icon"></em>
          <div class="flex-between ordersta">
            <span class="addressName">收货人：{{orderInfo.receiver}}</span>
            <span v-if="shopType==4">{{orderInfo.mobile|phoneFilter}}</span>
            <span v-else>{{orderInfo.mobile}}</span>
          </div>
          <p>{{orderInfo.address}}</p>
          <span class="toas">* 务必发顺丰寄付，到付或其他快递拒绝签收</span>
          <input id="address" type="text" class="hide">
        </div>
      </div>
      <!-- 回寄地址 -->
      <div class="flex-between address-return" @click.stop="returnaddress(orderInfo.backaddress)">
        <span>商品回寄地址</span>
        <span>></span>
      </div>
      <!--  -->
      <div class="productorder-wrap">
        <div
          class="flex-between productorder"
          v-for="(item,index) in orderInfo.items"
          :key="index"
          @click.stop="productDetail(item.productid)"
        >
          <div class="productimg">
            <img :src="item.mainpic" alt>
          </div>
          <div class="productinfo flex-col">
            <div class="productname">{{item.name}}</div>
            <div class="productprice flex-between">
              <div>{{item.producttype==22?(item.color+item.size):(item.size+'码')}}, X{{item.num}}</div>
              <!-- <div>{{item.size}}码,数量 X{{item.num}}</div> -->
               
              <div class="price">￥{{item.price | tofixed}}</div>
            </div>
          </div>
        </div>
        <div class="productprice productprice-money flex-between">
          <div>手续费({{orderInfo.procedurerate|tofixed}})</div>
          <div>-￥{{orderInfo.procedurecost|tofixed}}</div>
        </div>
        <div class="productprice productprice-money flex-between">
          <div>预计收入</div>
          <div>￥{{orderInfo.predictincome|tofixed}}</div>
        </div>
      </div>
      <!-- 保证金信息 -->
      <div class="cash-deposit">
        <div class="orderno">
          <div class="bordderBotTop" v-if="shopType!=0">
            <div class="flex-between">
              <div>订单编号：</div>
              <div>
                <div class="copy-btn" @click="copyText(hideid.ordernum,orderInfo.orderno)">复制</div>
                {{orderInfo.orderno}}
                <input id="ordernum" class="hide" type="text">
              </div>
            </div>
            <div class="flex-between" v-if="orderInfo.dealnum">
              <div>交易编号：</div>
              <div>{{orderInfo.dealnum}}</div>
            </div>
            <div class="flex-between">
              <div>创建时间:</div>
              <div>{{orderInfo.createdat}}</div>
            </div>
          </div>
          <div class="fontwi">
            <div class="flex-between">
              <div>{{orderInfo.businesstype===2?('您已缴纳￥'+orderInfo.cashdeposittotal+'保证金'):'支付保证金'}}</div>
              <div v-if="orderInfo.businesstype!=2">￥{{orderInfo.cashdeposit}}</div>
            </div>
            <p>{{orderInfo.businesstype===2?'若违反平台交易规则将从您的账户中扣除￥'+orderInfo.cashdeposit+'保证金':'交易成功后保证金自动退还'}}</p>
          </div>
          <div class="bordderBotTop" v-if="shopType===0">
            <div class="flex-between">
              <div>创建时间:</div>
              <div>{{orderInfo.createdat}}</div>
            </div>
          </div>
          <div class="remark">备注：1.地址信息可复制（长按）2.物流信息可复制</div>
          <!-- <div class="flex-end operation-btn" v-if="shopType===0">
                  <span>我不卖了</span>
                  <span>喊人来买</span>
          </div>-->
        </div>
      </div>
    </div>

    <!-- 缺省状态 -->
    <div v-else class="default">
      <img :src="defaultMessageImgUrl" alt>
      暂无数据~
      <div class="gosell" @click.stop="gosell">去出售</div>
    </div>
  </div>
</template>
<script>
import {
  sellOrderDetail,
  getTrace,
  sellOldOrderDetail
} from "../../../common/api/snekc2c.js";
import { mapGetters } from "vuex";
import { DateDiff, _getDate } from "../../../common/util";
import { QiyuProd } from "../../../common/api/WyQiyu";
export default {
  data() {
    return {
      currentOrderText: "买家已发货", // 当前状态
      currentOrderStatus: 0,
      orderInfo: [],
      hideid: {ordernum: "ordernum",address: "address",logistics: "logistics"},
      timeData: { H: "00", m: "00", s: "00" },
      failedmessage: "",
      redClass: "",
      defaultMessageImgUrl: "/static/img/salepage_image_empty.png", //  /static/img/page_image_empty.png
      hasData: true,
      createTime: ""
    };
  },
  computed: {
    ...mapGetters({insq: "insq",shopType: "shopType",userInfo: "userInfo"}),
    infoMessage() {
      let i = this.orderInfo;
      if (i.status === 2) {
        this.setentime(i.stoptime, "H");
        var day = this.timeData.d > 0 ? this.timeData.d + "天 " : "";
        this.failedmessage =
          day + this.timeData.H + ":" + this.timeData.m + ":" + this.timeData.s;
      } else if (i.status === 14) {
        this.failedmessage = "您已超时未发货,请尽快发货!";
      } else if (i.status === 12 || i.status === 13 || i.status === 16) {
        this.getTraceOrder();
        if (!this.failedmessage) {
          this.failedmessage = "订单已关闭";
        }
      } else {
        this.getTraceOrder();
      }

      return this.failedmessage;
    }
  },
  filters: {
    phoneFilter(val) {
      console.log(String(val).indexOf("+86"));
      if (val) {
        if (String(val).indexOf("+86") > -1) {
          var mobile = val.split("-")[1].substr(3, 5);
          return val.split("-")[1].replace(mobile, "*****");
        } else {
          var mobile = val.substr(3, 5);
          return val.replace(mobile, "*****");
        }
      }
    }
  },
  mounted() {
    switch (this.shopType) {
      case 0:
        this.currentOrderText = "出售中";
        break;
      case 1:
        this.currentOrderText = "待发货";
        break;
      case 2:
        this.currentOrderText = "已发货";
        break;
      case 3:
        this.currentOrderText = "交易成功";
        break;
      case 4:
        this.currentOrderText = "交易失败";
        break;
    }
    this.sellDetail(); // 订单详情
  },
  methods: {
    countdownTime(time, type) {
      this.timeData = DateDiff({ destination: time, type: "d" });
      let t = this.timeData;
      if (
        this.timeData.H === 0 &&
        this.timeData.m === 0 &&
        this.timeData.s === 0
      ) {
        clearInterval(this.clearTime);
        return;
      }
      if(this.timeData.H < 0 &&
        this.timeData.m < 0 &&
        this.timeData.s < 0){
          t.H = 0;
          t.m = 0;
          t.s = 0;
        }
      t.d = t.d
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
    sellDetail() {
      let _ = this;
      let op = {};
      console.log("sneakerssalesid", this.$route.params.id);
      let sellApi = this.shopType === 0 ? sellOrderDetail : sellOldOrderDetail;
      if (this.shopType == 0) {
        sellApi = sellOrderDetail;
        op.sneakerssalesid = this.$route.params.id;
      } else {
        sellApi = sellOldOrderDetail;
        op.orderno = this.$route.params.id;
      }
      sellApi(op)
        .then(res => {
          if (res) {
            _.hasData = true;
            _.orderInfo = res;
            _.orderInfo.createdat = res.items[0].createdat;
            _.orderInfo.addinfo =
              res.receiver + " " + res.mobile + " " + res.address;
          } else {
            _.hasData = false;
          }
          console.log("卖家订单详情", res);
        })
        .catch(err => {
          console.error(err);
          this.hasData = false;
        });
    },
    returnaddress(backaddress) {
      let ad = {
        address: backaddress.backaddress,
        receiver: backaddress.backname,
        mobile: backaddress.backmobile,
        saleid: backaddress.saleid
      };
      this.$store.dispatch("backaddress", ad);
      this.$router.push({
        path: "/returnaddress",
        query: {
          status: this.orderInfo.status || this.shopType
        }
      });
    },
    gologistics() {
      this.$router.push("/logistics/" + this.orderInfo.orderno + "/1");
    },
    productDetail(id) {
      this.$router.push("/sneaker/detail/" + id);
    },
    getTraceOrder() {
      // 参数 订单编号 orderno 和 角色role
      let option = {
        orderno: this.$route.params.id,
        role: 1
      };
      getTrace(option)
        .then(res => {
          if (res.traces && res.traces.length > 0) {
            let firsttracs = res.traces[0][0];
            if (firsttracs && firsttracs.logistics) {
              this.failedmessage = firsttracs.logistics[0].title;
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
      QiyuProd.call(this)
    },
    longtap() {
      let _ = this;
      _.startTime = new Date().getTime();
      console.log("开始", _.startTime);
    },
    clearLong(id, info) {
      let _ = this;
      _.endTime = new Date().getTime();
      console.log("执行时间：", _.endTime - _.startTime);
      if (_.endTime - _.startTime >= 1000) {
        var orUrl = document.getElementById(id);
        orUrl.value = info;
        console.log(orUrl.value);
        orUrl.select();
        if (document.execCommand("copy")) {
          document.execCommand("copy");
          _.toast("已复制");
        }
      }
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
  color: #999;
  text-align: center;
  border: 1px solid #999;
  border-radius: 3px;
}
.operation-btn span:nth-child(2) {
  color: #ffc700;
  border: 1px solid #ffc700;
  margin: 1vw 15px;
}
.statustext {
  height: 20vw;
  background: url("/static/img/order_details_page_bg_state_default.png") 0 0
    no-repeat;
  background-size: cover;
  color: #fff;
  font-size: 18px;
  padding-left: 15px;
  font-weight: bold;
  padding-top: 4vw;
  /* font-weight: 500;
  font-family:PingFangSC-Medium; */
}

.delivery-time {
  margin-top: 0;
  font-size: 12px;
}
#textTime {
  font-size: 12px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  letter-spacing: 1px;
  line-height: 9vw;
}
.delivery-time .goods-time {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  font-family:PingFangSC-Medium;

}

.address {
  padding: 15px;
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
.address-return {
  padding: 15px;
  background: #fff;
  font-size: 14px;
  color: #333;
  border-top: 2px solid #f2f2f6;
  border-bottom: 2px solid #f2f2f6;
}
.productorder-wrap {
  background: #fff;
}
.productorder {
  padding: 15px;
}
.productimg {
  width: 30%;
}
.productinfo {
  width: 70%;
  margin-left: 3%;
  font-size: 12px;
  margin-top: 0px;
}
.productinfo .productname {
  line-height: 20px;
  font-size: 14px;
}
.productinfo .productprice {
  font-size: 14px;
  padding-top: 10px;
}
.productinfo .productprice .price {
  font-weight: bold;
  font-size: 16px;
}
.productprice-money {
  font-size: 12px;
  color: #333;
  margin: 0 15px;
  padding: 15px 0;
  border-top: 1px solid #f5f5f5;
}
.cash-deposit {
  font-size: 12px;
  background: #fff;
}
.bordderBotTop {
  border-top: 5px solid #f5f5f9;
  border-bottom: 5px solid #f5f5f9;
  padding: 15px;
}
.orderno {
  /* padding: 15px; */
  line-height: 24px;
}
.orderno p {
  font-size: 10px;
  color: #666;
}
.ordersta .addressName {
  width: 60%;
  display: inline-block;
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
.fontwi {
  color: #333;
  font-weight: bold;
  padding: 15px;
  /* border-bottom: 10px solid #f5f5f9; */
  border-top: 1px solid #f5f5f9;
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
.remark {
  font-size: 10px;
  color: #999;
  padding: 15px 15px 30px 15px;
  background-color: #f5f5f9;
}
.hide {
  position: absolute;
  bottom: 0;
  z-index: -10;
}
</style>


