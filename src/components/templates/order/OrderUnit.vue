<template>
  <div class="order_unit padding" :class="[{order_unitbox:orderType==2},{'shoes':ShoesCou}]" v-if="realInfo">
    <div :class="{order_h:orderType==2}">
      <section class="cart_head" :class="{order_head:orderType==1||orderType==2}" v-if="!ShoesCou">
        <div class="ellipsis flex-aic flex" v-if="!realInfo.isc2c">
          <!-- <span class="mall_brandShop" :class="{'mall_buyers':realInfo.businesstype == 2}">{{realInfo.businesstype == 1? '品牌店':'买手店'}}</span> -->
          <i
            class="ico-sp-glb tilt"
            v-if="realInfo.businessisglobalpurchase||realInfo.isglobalpurchase"
          ></i>
          <i
            class="tilt"
            :class="realInfo.businesstype==3?'ico-sp-store':(realInfo.businesstype==2?'ico-sp-buy':'ico-sp-official')"
          ></i>
          <span class="busName" @click.stop="goShopDetail">{{realInfo.businessname}}</span>
          <p class="padding flex-center inline-block">
            <span class="rights_icon"></span>
          </p>

          <span
            class="icon_server service_black"
            v-if="orderType==1||orderType==2"
            @click.stop="QiyuProd"
          ></span>
        </div>
        <div style="height: 20px;" v-if="realInfo.isc2c"></div>
        <div
          v-if="orderType==0"
          class="status_order"
          v-show="!!realInfo.sendplace"
        >{{realInfo.sendplace}}发货</div>
        <div 
          v-if="orderType==1||orderType==2" 
          class="status_order uncloseOrder" :class="{closeOrder:realInfo.status==(realInfo.isc2c?12:4),'CancelOrderClass':CancelOrderClass}" >
          {{statuname}}
        </div>
      </section>
      <div
        class="flex-aic"
        v-for="(unit,index) in realInfo.item"
        :key="index"
        v-if="cutchecktype===1"
      >
        <CartInfoUnit
          :cango="orderType==2"
          :info="unit"
          :cartEdit="true"
          :orderitemid="realInfo.items"
          :showIcon="false"
          :status="realInfo.status"
          :orderType="orderType"
          v-if="unit.checked||orderType==1||orderType==2"
        ></CartInfoUnit>
      </div>
      <div
        class="flex-aic"
        v-if="realInfo.producttype===10&&cutchecktype!=1"
        v-for="(unit,ind) in realInfo.item"
        :key="ind"
      >
        <CartInfoUnit
          :cango="orderType==2"
          :info="unit"
          :cartEdit="true"
          :orderitemid="realInfo.items"
          :showIcon="false"
          :producttype="realInfo.producttype"
          :originalprice="realInfo.cutproduct.originalprice"
          :ishelpcutorder="realInfo.cutproduct.ishelpcutorder"
          :cutminprice="realInfo.cutminprice"
          :status="realInfo.status"
          :orderType="orderType"
          v-if="unit.checked||orderType==1||orderType==2"
        ></CartInfoUnit>
      </div>
      <div
        class="flex-aic"
        v-if="realInfo.producttype!=10&&cutchecktype!=1"
        v-for="(unit,inx) in realInfo.item"
        :key="inx"
      >
        <shoes-coupon v-if="ShoesCou" :realinfo="unit">
          <template>
            <div class="flex-btwn">
              <div class="flex-center cash-title">
                  <span class="cash-coupon">现货券 <i >!</i></span>
                  <span class="quickness flex-center" v-if="unit.isconsign"><i></i> 极速发货</span>
                </div>

              <div v-if="orderType==1||orderType==2" class="status_order uncloseOrder  shoes-sta" :class="{closeOrder:realInfo.status==(realInfo.isc2c?12:4),'CancelOrderClass':CancelOrderClass}" >
                <div class="flex-center">
                  {{statuname}}
                </div>
              </div>
            </div>
          </template>
        </shoes-coupon>
        <CartInfoUnit
          :cango="orderType==2"
          :info="unit"
          :cartEdit="true"
          :orderitemid="realInfo.items"
          :showIcon="false"
          :status="realInfo.status"
          :orderType="orderType"
          :usenewballs="realInfo.usenewballs"
          :isC2C="orderInfo.isc2c"
          v-if="(unit.checked||orderType==1||orderType==2)&&!ShoesCou"
        ></CartInfoUnit>
      </div>
    </div>
    <section class="flex check_footer" style="border-bottom: 1px solid #fafafa;">
      <p v-if="orderType!=2">共{{realInfo.count}}件商品</p>
      <div :class="{order_cost:orderType==2}">
        <p
          class="flex-between"
          v-if="truePay!=realInfo.allPay &&truePay>0&&!realInfo.cutcountmoney"
        >
          <span>商品总额:</span>
          <span>¥{{realInfo._allPay}}<span v-if="realInfo.usenewballs">+{{realInfo.usenewballs}}牛丸</span></span>
          <em class="spec_sale">¥{{realInfo.allPay}}</em>
        </p>
        <!-- cutchecktype -->
        <p class="flex-between" v-else-if="cutchecktype==1">
          <span>商品总额:</span>
          <span>¥{{realInfo.salemoney ||realInfo.allPay}}<span v-if="realInfo.usenewballs">+{{realInfo.usenewballs}}牛丸</span></span>
        </p>
        <p class="flex-between" v-else-if="cutchecktype!=1">
          <span>商品总额:</span>
          <span
            v-if="realInfo.cutproduct.ishelpcutorder"
          >¥{{(realInfo.cutproduct.originalprice*realInfo.count)}}</span>
          <span v-else>¥{{realInfo.salemoney||realInfo.productmoney}}<span v-if="realInfo.usenewballs">+{{realInfo.usenewballs}}牛丸</span></span>
        </p>
        <p class="flex-between">
          <span>{{realInfo.isc2c?"顺丰配送:":"运费:"}}</span>
          <span
            v-if="defaultExpress.expressfee>=0&&orderType==0"
          >¥{{defaultExpress.expressfee}}</span>
          <span
            v-if="(realInfo.expressfee>=0&&orderType==1)||realInfo.expressfee>=0&&orderType==2"
          >¥{{realInfo.expressfee}}</span>
        </p>
        <p class="flex-between" v-if="realInfo.discountmoney">
          <span>优惠券:</span>
          <span>-¥{{(realInfo.discountmoney||0)}}</span>
        </p>
        <p class="flex-between" v-if="realInfo.redpacketmoney>0">
          <span>红包:</span>
          <span>-¥{{realInfo.redpacketmoney}}</span>
        </p>
        <!-- &&cutchecktype!=1 -->
        <p
          class="flex-between"
          v-if="realInfo.producttype==10&&(realInfo.cutcountmoney>0||realInfo.cutmoney>0)"
        >
          <span>助力砍价:</span>
          <span>-¥{{realInfo.cutcountmoney||realInfo.cutmoney||0}}</span>
        </p>
        <p class="flex-between" v-if="orderType==1||orderType==2 ||realInfo.producttype==10">
          <span>总计:</span>
          <span
            class="pcolor"
          >¥{{realInfo.paymoney>=0?realInfo.paymoney:realInfo._allPay}}<span v-if="realInfo.usenewballs">+{{realInfo.usenewballs}}牛丸</span></span>
        </p>
      </div>
    </section>
    
    <p
      class="order_tip"
      v-if="realInfo.status==(realInfo.isc2c?1:0)&&orderType==1&&ti"
    >还剩{{ti}}分钟系统将自动关闭订单</p>
    <section class="or_status" v-if="orderType==2">
      <div class="flex-between">
        <div class="or_no flex-aic">
          订单编号：
          <input type="text" v-model="realInfo.orderno" id="orderno" readonly>
        </div>
        <p class="copyBtn" @click.stop="copyText">复制</p>
      </div>
      <div class="pay_style flex-between">
        <div class="or_no flex-aic">支付方式：&ensp;{{realInfo.payword}}</div>
      </div>
      <ExpressState :ordetail="realInfo"></ExpressState>
    </section>
    <!-- 返还牛丸 订单列表-->
    <div class="ox_box" :class="{'padding': orderType == 2}" v-if="statuname == '待付款' || statuname == '待发货' || statuname == '待收货' || statuname == '已完成'">
      <div class="ox-ball flex flex-btwn flex-aic" v-if="realInfo.newballs && (statuname == '待付款' || statuname == '待发货' || statuname == '待收货')">
        <div class="info">确认收货返:</div>
        <div class="num flex flex-aic flex-star">
          <img src="//files.eyee.com/mcdn/img/ball/icon_ox.png" alt="">
          {{realInfo.newballs}}牛丸
        </div>
      </div>  
      <div class="ox-ball flex flex-btwn flex-aic" v-if="realInfo.newballs && statuname == '已完成'">
        <div class="info">已返:</div>
        <div class="num flex flex-aic flex-star">
          <img src="//files.eyee.com/mcdn/img/ball/icon_ox.png" alt="">
          {{realInfo.newballs}}牛丸
        </div>
      </div>  
    </div>
    <p class="order_tip" v-if="realInfo.isc2c&&c2cPromptText">{{c2cPromptText}}</p>
    <p
      v-if="realInfo.status==(realInfo.isc2c?10:2)&&orderType!=2&&planfinishtime!=0"
      class="order_tip"
    >还剩{{plantime || 1}}系统将自动确认收货</p>
    <p
      class="order_tip"
      v-if="realInfo.status==0&&orderType==2&&realInfo.endTime>0"
    >还剩{{ti}}分钟系统将自动关闭订单</p>
    <!-- footer_orderBtn -->
    <section
      class="flex-between"
      style="padding: 10px 0;"
      :class="{order_dbtn:orderType==2}"
      v-if="(orderType==1||orderType==2)&&realInfo.status!=13&&orderState!=5"
    >
      <div class="special_tips" v-if="orderType!=2">{{specialWords}}</div>

      <div class="order_btn_box" v-if="ShoesCou&&realInfo.status==11&&realInfo[0].isconsign">
        <div class="btn_div" @click.stop="loadModal">已寄存平台，查看我的票据</div>
      </div>
      <div class="order_btn_box" v-else>
        <!-- c2c 商品有瑕疵 待买家确认 -->
        <div
          class="btn_div"
          v-if="realInfo.status==7&&realInfo.isc2c"
          @click.stop="gologistics()"
        >去确认</div>
        <!-- c2c 买家查看物流 -->
        <div
          class="btn_div"
          v-if="realInfo.status==1 && realInfo.expresstype!=1&&!realInfo.isc2c && realInfo.producttype!=99"
          @click.stop="orderAdd"
        >{{aplMoneyText}}</div>
        <div
          class="btn_div"
          v-if="realInfo.status==(realInfo.isc2c?1:0) "
          @click.stop="confirmOrder(0)"
        >取消订单</div>
        <div
          class="btn_div"
          v-if="realInfo.status==(realInfo.isc2c?11:4)||realInfo.status==(realInfo.isc2c?12:3)"
          @click.stop="confirmOrder(1)"
        >删除订单</div>
        <div
          class="btn_div"
          :class="{or_now: realInfo.status==(realInfo.isc2c?1:0)}"
          v-if="realInfo.status==(realInfo.isc2c?1:0) "
          @click.stop="payorder"
        >立即付款</div>
        <div
          class="btn_div"
          v-if="realInfo.isdelayreceive==1&&orderType!=2 "
          @click.stop="ExtendReceiving"
        >延长收货时间</div>
        <div
          class="btn_div"
          v-if="(realInfo.status==2||realInfo.status==3)&&!realInfo.isc2c"
          @click.stop="checkExpress"
        >查看物流</div>
        <div
          class="btn_div"
          :class="{'duo_btn_div':!realInfo.isc2c}"
          v-if="realInfo.status==(realInfo.isc2c?10:2)"
          @click.stop="confirmOrder(2)"
        >确认收货</div>
        <div
          class="btn_div"
          v-if="(realInfo.status==3||realInfo.status==4||realInfo.status==5||realInfo.status==6||realInfo.status==8||realInfo.status==9||realInfo.status==10||realInfo.status==15)&&realInfo.isc2c&&CancelOrderStatus"
          @click.stop="gologistics()"
        >订单追踪</div>
      </div>
    </section>

    <template v-if="payOrderno">
      <C2CPayModel
        v-if="orderInfo.isc2c"
        :payorderno="payOrderno"
        :model="true"
        :close="true"
        @close="payModelClose"
      ></C2CPayModel>
      <Pay v-else :payorderno="payOrderno" :model="true" :close="true" @close="payModelClose"></Pay>
    </template>
  </div>
</template>
<script>
import {
  receiptOrder,
  cCancleOrder,
  deleteOrder
} from "../../../common/api/snekc2c.js";
import CartInfoUnit from "../cart/CartInfoUnit";
import ExpressState from "../order/ExpressState";
import { mapGetters } from "vuex";
import {
  ExtendOrder,
  DeleteOrder,
  CancelOrder,
  Receipt
} from "../../../common/api/order"; // , PayTypeList
import { DateDiff } from "../../../common/util"; // , DateFormat
import { QiyuProd } from "../../../common/api/WyQiyu";
import Pay from "../../pay/Pay";
import C2CPayModel from "../../sneaker/Pay";
import ShoesCoupon from "../../../comps/ShoesCoupon"
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
  props: {
    orderInfo: Object,
    groupType: { type: Number, default: 0 },
    orderType: { type: Number, default: 0 },
    // 0是订单结算页面的模板
    // 1是订单列表的订单模板
    // 2是详情的订单模板
    index: Number,
    cutchecktype: Number,
    teamGroup: { type: Number, default: 0 },
    truePay: "",
    isdelayreceive: { type: Number, default: 0 },
    planfinishtime: { type: Number, default: 0 },
  },
  data() {
    return {
      statuname: "a",
      a: 0,
      specialWords: "",
      realInformas: {},
      plantime: { m: 0 },
      c2cPromptText: "",
      ti: "",
      CancelOrderStatus: true,
      CancelOrderClass: "",
      aplMoneyText: "", // 待发货售后状态
      goGroup: "邀请拼团", // 拼团字段

      payOrderno: ""
    };
  },
  components: {
    CartInfoUnit,
    ExpressState,
    Pay,
    C2CPayModel,
    ShoesCoupon
  },
  mounted() {
    let _ = this;
    if (_.planfinishtime > 0) {
      _.formatSeconds(_.planfinishtime);
    }
    if (_.orderType === 1 || _.orderType === 2) {
      var n = _.orderInfo.status;
      let s = _.orderInfo;
      if (_.realInfo.isc2c) {
        switch (n) {
          case 1:
            _.statuname = "待付款";

            // let currentTime = new Date();
            // if (currentTime.getTime() > new Date(s.expiredtime).getTime()) {
            //   _.statuname = "已关闭";
            //   _.c2cPromptText = "超时未支付";
            // }
            break;
          case 2:
          case 14:
            _.statuname = "待发货";
            // _.c2cPromptText =
            //   "若超时未发货 您将获得" + s.earnestmoney + "元赔付款";
            break;
          case 6:
            _.statuname = "已关闭";
            _.c2cPromptText = "商品未达到平台鉴定标准";
            break;
          case 7:
            _.statuname = "待发货";
            _.c2cPromptText = "平台查验有轻微瑕疵，需您确认";
            break;
          case 9:
            _.statuname = "已关闭";
            _.CancelOrderClass = "CancelOrderClass";
            _.c2cPromptText = "因商品瑕疵问题 您已拒绝发货";
            break;
          case 3:
          case 4:
          case 5:
          case 8:
          case 10:
          case 15:
            _.statuname = "待收货";
            // if (n == 15) {
            //   _.c2cPromptText = "卖家虚假发货";
            // }
            break;
          case 11:
            _.statuname = "已完成";
            break;
          case 12:
          case 13:
          case 16:
          case 17:
            if (n == 6) {
              _.c2cPromptText = "商品未达到平台鉴定标准";
            } else if (n == 9) {
              _.c2cPromptText = "因商品瑕疵问题 您已拒绝发货";
            } else if (n == 13) _.c2cPromptText = "您已取消订单";
            else _.c2cPromptText = s.remark;
            _.statuname = "已关闭";
            _.CancelOrderClass = "CancelOrderClass";

            break;
          default:
            break;
        }
      } else {
        switch (n) {
          case 0:
            _.statuname = "待付款";
            break;
          case 1:
            _.statuname = "待发货";
            break;
          case 2:
            _.statuname = "待收货";
            break;
          case 3:
            _.statuname = "已完成";
            break;
          case 4:
            _.statuname = "已关闭";
            break;
          default:
            break;
        }
      }
      if (_.orderInfo.refundstatus === 3 && _.orderInfo.status === 4) {
        _.statuname = "已退款";
      }
    }
    // _.realInfo()
    // console.log('_.realInfo zsj-----',_.realInfo)
    if (
      (_.realInfo.status === 0 ||
        (_.realInfo.status === 1 && _.realInfo.isc2c)) &&
      _.realInfo.expiredtime
    ) {
      _.downcount();
    }

    if (_.$route.query.p)
      _.$nextTick(() => {
        _.payOrderno = _.orderInfo.orderno;
      });
  },
  computed: {
    ...mapGetters({
      defaultExpress: "defaultExpress",
      userInfo: "userInfo",
      orderState: "orderState",
      orderItem: "orderItem",
      orderList: "orderList"
    }),
    ShoesCou(){  // 是否显示鞋券 样式
      return this.realInfo.ordertype ==4
    },
    // isC2C() {
    //   return this.realInfo.isc2c;
    // },
    realInfo() {
      let or = this.orderInfo;

      // console.log(JSON.parse(or.detailitem), "订单列表");
      if (or.producttype === 1) {
        this.specialWords = "该商品通过限量发售获得";
      } else if (or.producttype === 2) {
        this.specialWords = "该商品通过鬼市获得";
      } else if (or.producttype === 4) {
        this.specialWords = "该商品通过限时折扣获得";
      } else if (or.producttype === 5) {
        this.specialWords = "该商品通过积分兑换获得";
      } else if (or.producttype === 6) {
        this.specialWords = "该商品通过连续签到" + or.credits + "获得";
      }

      or.cutproduct = or.cutproduct || {};
      if (this.orderType === 1 || this.orderType === 2) {
        if (Array.isArray(or.item)) {
        } else {
          or.item = [];
          if (or.detailitem) {
            or.item =
              typeof or.detailitem === "string"
                ? JSON.parse(or.detailitem)
                : or.detailitem;
          }
          if (or.producttype === 10 && this.cutchecktype != 1) {
            or.cutproduct = {
              ...or.item[0]
            };
            or.cutproduct.ishelpcutorder =
              or.cutproduct.ishelpcutorder == "true" ? true : false;
            or.cutproduct.originalprice = Number(or.cutproduct.originalprice);
            // or.cutminprice = or.cutminprice;
            or.cutmoney = or.cutmoney;
            if (or.producttype === 10 && or.cutproduct.ishelpcutorder) {
              this.specialWords = "该商品通过助力砍价获得";
            }
          }
        }
        or.item = or.item.map(oi => {
          if ((or.status === 2 || or.status === 3) && or.items && !or.isc2c &&or.producttype!=99) {
            let i = or.items.find(ai => ai.productitemid === oi.productitemid);
            if (i && i.productitemid) {
              oi.serviceusage = or.serviceusage;
              oi.aftersalestatus = i.aftersalestatus;
              oi.issupportaftersale = i.issupportaftersale; // 判断该产品是否是支持售后
              switch (i.aftersalestatus) {
                case 0:
                  oi.assdesc = "申请售后";
                  break;
                case 1:
                  oi.assdesc = "售后中";
                  break;
                case 2:
                  oi.assdesc = "售后关闭";
                  break;
                case 3:
                  oi.assdesc = "售后完成";
                  break;
                case 4:
                  oi.assdesc = "平台介入";
                  break;
              }
              oi.orderitemid = i.orderitemid;
            }
          }
          if (or.refundstatus === 1) {
            this.aplMoneyText = "我要退款";
          } else if (or.refundstatus === 2) {
            this.aplMoneyText = "退款中";
          } else if (or.refundstatus === 3) {
            this.aplMoneyText = "退款完成";
          } else {
            this.aplMoneyText = "退款失败";
          }
          oi.orderno = or.orderno;
          oi.refundstatus = or.refundstatus;
          oi.expressfee = or.expressfee;

          oi.colorimg = oi.colorimg || oi.mainpic;
          oi.saleprice = oi.salemoney;
          oi.specialprice = oi.paymoney;
          oi.tariffmoney = oi.tariffmoney;

          // 返回一个状态值 判断是不是海外购产品
          // "expresstype": int 快递类型 0-跨境物流 1-国际快递 2-国内快递,
          oi.expresstype = oi.expresstype;
          return oi;
        });
        let toDate = or.expiredtime;
        let cda = DateDiff({ destination: toDate, type: "H" });
        or.endH = cda.H;
        or.endTime = (cda.H > 0 ? cda.H + "时" : "") + cda.m;
        or.allPay = or.productmoney;
        or.count = or.quantity;
      }

      switch (or.paytype) {
        case PT.alipay:
          or.payword = "支付宝";
          break;
        case PT.wechatpay:
          or.payword = "移动微信";
          break;
        case PT.unionpay:
          or.payword = "银联";
          break;
        case PT.webwxpay:
          or.payword = "网页微信";
          break;
        case PT.tenpay:
          or.payword = "QQ钱包";
          break;
        case PT.jdpay:
          or.payword = "京东";
          break;
        case PT.fenqilepay:
          or.payword = "分期乐";
          break;
      }
      or.payword = or.payword ? or.payword + "支付" : "";

      // this.realInformas = or
      // alert(or.producttype)
      // console.log(or,'or---------》》》》')
      if (or.isc2c) or.count = 1;
      return or;
    }
  },
  methods: {
    loadModal() {
      this.loadApp(-1);
    },
    downcount() {
      let _ = this;
      let datatime = "";
      let cd = DateDiff({ destination: _.realInfo.expiredtime, type: "H" });
      if (!(cd.H < 1 && cd.m < 1 && cd.s < 1)) {
        datatime = `${cd.H < 10 && cd.H > 0 ? "0" : ""}${
          cd.H > 0 ? cd.H + ":" : ""
        } ${cd.m < 10 ? "0" : ""}${cd.m} : ${cd.s < 10 ? "0" : ""}${cd.s}`;
      } 
      if (_.realInfo.status == 0) {
        // console.log('toDate--------',datatime)
      }
      //
      _.ti = datatime;
      setTimeout(() => {
        _.downcount();
      }, 1000);
    },
    formatSeconds(value) {
      var theTime = parseInt(value); // 秒
      var theTime1 = 0; // 分
      var theTime2 = 0; // 小时
      var theTime3 = 0; // 天
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
          if (theTime2 > 24) {
            theTime3 = parseInt(theTime2 / 24);
            theTime2 = parseInt(theTime2 % 24);
          }
        }
      }
      var result = "";
      if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分" + result;
      }
      if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "时" + result;
      }
      if (theTime3 > 0) {
        result = "" + parseInt(theTime3) + "天" + result;
      }
      this.plantime = result;
      return this.plantime;
    },
    ExtendReceiving() {
      // 延长收货时间
      var paramsOrder = { orderno: this.orderInfo.orderno };
      ExtendOrder(paramsOrder)
        .then(res => {
          if (res) {
            this.formatSeconds(res.totalseconds);
          }
        })
        .catch(res => {
          this.toast(res.msg);
        });
    },

    confirmOrder(type) {
      // type 0 收取消订单 1是删除订单 2是确认收货
      // console.log(type)
      let option = {
        msg: "您确定要删除订单吗？",
        okRext: "确定",
        confirmButtonClass: "confirm",
        cancelButtonClass: "cancel",
        ok: () => {
          this.deteOrder();
        },
        cancel: () => {}
      };
      if (type === 0) {
        if (this.realInfo.isc2c) {
          if (this.realInfo.status === 1) {
            // 待付款和待收货时 取消订单 弹框不一样
            option.title = "";
            option.msg = "取消订单 商品将被别人抢走哦！";
            option.okText = "我再想想";
            option.cancelText = "去意已决";
          } else {
            option.title = "退款说明";
            option.msg = "此时取消订单 需赔付卖家28元";
            option.okText = "我再想想";
            option.cancelText = "确定";
          }
          option.cancel = () => {
            this.CancelOrder();
          };
          option.ok = () => {};
        } else {
          option.title = "";
          option.msg = "取消订单 商品将被别人抢走哦！";
          option.okText = "我再想想";
          option.cancelText = "去意已决";
          option.ok = () => {};
          option.cancel = () => {
            this.CancelOrder();
          };
        }
      } else if (type === 2) {
        option = {
          msg: "您是否确认收货？",
          okRext: "确定",
          ok: () => {
            this.cofirmGood();
          },
          cancel: () => {}
        };
      }
      this.confirm(option);
    },
    orderAdd() {
      // console.log('this.realInfo', this.realInfo)
      let info = { ...this.realInfo.item[0] };
      info.status = this.realInfo.status;
      info.paymoney = this.realInfo.paymoney;
      info.allPay = this.realInfo.allPay;
      info.orderno = this.realInfo.orderno;
      info.count = this.realInfo.count;
      // info.orderitemid = this.realInfo.orderitemid
      // info.aftersaleid = this.realInfo.aftersaleid
      info.type = this.realInfo.type;
      info.isRefund = true;

      this.$store.dispatch("setOrderServiceInfo", info);
      if (this.realInfo.refundstatus === 1) {
        this.$router.push({
          path: "/order/service/add"
        });
      } else {
        this.$router.push("/order/service/info");
      }
    },
    deteOrder() {
      this.set();
      // console.log('删除订单', this.option)
      //     receiptOrder,
      // cancleOrder,
      // deleteOrder
      let isc2c = this.realInfo.isc2c;
      let c2cApi = isc2c ? deleteOrder : DeleteOrder;
      c2cApi(this.option)
        .then(res => {
          console.log("删除成功", res);
          this.orderList.splice(this.index, 1);
          if (this.orderType === 2) {
            this.$router.go(-1);
          }
          this.toast("删除成功！");
        })
        .catch(err => {
          this.toast(err.msg);
          console.log(err);
        });
    },
    CancelOrder() {
      this.set();
      let isc2c = this.realInfo.isc2c;
      let c2cApi = isc2c ? cCancleOrder : CancelOrder;
      c2cApi(this.option)
        .then(res => {
          console.log("取消成功", res);
          this.orderInfo.status = 4;
          this.CancelOrderStatus = false;
          this.statuname = "已关闭";
          // }
          this.toast("取消成功");
          if (this.teamGroup) {
            this.$store.dispatch("CancelOrderStatus", true);
          }
        })
        .catch(e => {
          console.error(e);
          this.toast("操作失败");
        });
    },
    set() {
      this.option = {
        orderno: this.orderInfo.orderno
      };
    },
    gologistics() {
      this.$router.push("/logistics/" + this.orderInfo.orderno + "/2"); // 1 卖家 2 买家
    },
    goShopDetail() {
      this.$router.push("/shop/shopdetail/" + this.realInfo.businessid);
    },
    copyText() {
      document.execCommand("Copy");
      var Url2 = document.getElementById("orderno");
      Url2.select();
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.toast("复制成功！");
    },
    payorder() {
      let _ = this,
        { orderInfo } = _;

      let param = `订单${_.orderType == 2 ? "详情" : "列表"}页`;



      if (_.orderType == 2) _.payOrderno = orderInfo.orderno;
      else
        _.$router.push(
          (orderInfo.isc2c ? "/buyerdetail/" : "/order/detail/") +
            orderInfo.orderno +
            "?p=1"
        );

      // let url =
      //   (this.orderInfo.isc2c ? "/sneaker" : "") +
      //   "/pay/" +
      //   this.orderInfo.orderno;

      // this.$router.push(url);
    },
    payModelClose() {
      let _ = this;
      if (_.orderInfo.isc2c) {
        _.CancelOrder();
      }
      _.payOrderno = "";
    },
    checkExpress() {
      console.log("查看物流");
      this.$router.push("/order/track/" + this.orderInfo.orderno);
      this.$store.dispatch("setTrackInfo", this.realInfo);
    },
    cofirmGood() {
      console.log("确认收货");
      this.set();
      let isc2c = this.realInfo.isc2c;
      let c2cApi = isc2c ? receiptOrder : Receipt;
      c2cApi(this.option)
        .then(res => {
          this.orderList.splice(this.index, 1);
        })
        .catch(err => {
          if (err.code == 1511508) {
            this.toast("当前正在售后,无法确认收货");
          } else {
            this.toast(err.msg);
          }
        });
    },
    QiyuProd() {
      QiyuProd.call(this);
    },
    goTemp(orderno) {
      console.log("订单编号orderno:", orderno);
      this.$router.push({ path: `/order/AfterSale/Temp/${orderno}` });
    }
  }
};
</script>
<style scoped>
.pcolor {
  color: #ffc700;
}

.padding {
  padding-right: 2px;
  /* display: inline-block; */
}
.inline-block {
  display: inline-block;
}
.cart_shop {
  width: 15px;
  height: 15px;
  margin-right: 5px;
}

.order_unit {
  padding: 0 10px;
  font-size: 12px;
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  border-radius: 4px;
  margin: 15px 10px;
}
.order_unit.shoes{
  box-shadow:none;
  padding: 0;
}
.busName {
  font-size: 14px;
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
  text-decoration: line-through;
  color: #666;
}

.footer_orderBtn,
.order_tip {
  width: 100%;
  padding: 15px 0;
}

.order_tip {
  color: red;
  text-align: right;
}
.order_btn_box {
  /* width: 100%; */
  text-align: right;
}
.order_btn_box .btn_div {
  display: inline-block;
  border: 1px solid #ccc;
  padding: 5px 7px;
  font-size: 12px;
  border-radius: 2px;
  /* margin-left: 10px; */
}
.order_btn_box .duo_btn_div {
  color: #ffc700;
  border: 1px solid #ffc700;
}
.order_btn_box .or_now {
  border: 1px solid #ffc700;
  color: #ffc700;
}

.order_unit .icon_server {
  width: 15px;
  height: 15px;
  display: inline-block;
  margin-left: 5px;
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

.closeOrder,
.CancelOrderClass {
  color: #999;
}
.ox_box.padding{
  padding:0 10px;
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
