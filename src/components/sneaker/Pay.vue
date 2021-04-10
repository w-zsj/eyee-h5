<template>
  <div
    class="pay_box"
    :class="{ isHeadHide: !$root.ISAPP, model: model }"
    @click.stop="hideModel"
    @touchmove.stop
  >
    <template v-if="!model">
      <v-header v-if="!$root.ISAPP">
        <div class="nav-tab2">
          <h3>在线支付</h3>
        </div>
      </v-header>
      <div class="pay_infos" v-if="isPayBail">
        <label class="gaps">
          支付保证金
          <span class="font-price">¥{{ paramPledge | tofixed }}</span>
        </label>
      </div>
      <div class="pay_infos" v-else>
        <label class="pay_money gaps">
          订单总价
          <span>¥{{ orderInfo.paymoney | tofixed }}</span>
        </label>
        <label class="gaps">
          订单编号
          <span>{{ orderInfo.orderno }}</span>
        </label>
      </div>
    </template>

    <div class="pay_paylist" @click.stop v-if="type === 1">
      <p class="pay_title" v-if="!model">请选择支付方式</p>
      <div v-else class="pay-model-title">
        <div>
          <span>选择支付方式</span>
          <i class="ico-X" @click.stop="hideModel"></i>
        </div>
        <p v-if="payInfo.paymoney">¥{{ payInfo.paymoney }}</p>
      </div>
      <ul>
        <li v-for="p in paytypes" :key="p.type" @click="selectPayType(p.type)">
          <div class="flex-between pt-info">
            <em class="pay_icons" :class="p.cname"></em>
            <div>
              <p
                class="pt-title"
                :class="{ 'fq-profit': p.profit }"
                :profit="p.profit"
              >
                {{ p.name }}
                <span
                  :class="{ active: p.type == 2 }"
                  v-if="p.type == 2 && p.tips"
                  >{{ p.tips || "" }}</span
                >
              </p>
              <p>{{ p.memo }}</p>
            </div>
            <i :class="{ yunnshanfu: p.type == 2 }" v-if="p.type == 2"></i>
            <em
              class="icon_choosen"
              :class="{
                icon_cartSel: selectType != p.type,
                icon_cartSeled: selectType === p.type,
              }"
            ></em>
          </div>
          <template v-if="p.calcList.length > 0">
            <div class="fq-scroll" v-show="selectType === p.type">
              <div class="fq-cells">
                <div
                  v-for="(fq, fqIdx) in p.calcList"
                  :key="p.type + 'stage' + fqIdx"
                  :class="{ act: selectType === p.type && fq_ck === fqIdx }"
                  @click="fq_ck = fqIdx"
                >
                  <p>{{ fq.numtext || fq.numtxt }}</p>
                  <p>{{ fq.paytext }}</p>
                  <i v-if="fq.isfee">免息</i>
                </div>
              </div>
            </div>
          </template>
        </li>
      </ul>
      <div class="fix-btm opt-btm">
        <button
          class="pay_btn"
          :class="{ unClick: !countDown && !isPayBail }"
          @click="pay()"
        >
          确认支付{{ isPayBail ? "" : countDown }}
        </button>
      </div>
    </div>
    <div v-if="type === 2" class="payWrapper" :class="{ ipx: getIsIphonex }">
      <div class="payWrapper-title">
        支付金额 ¥{{orderInfo.paymoney || dataid }}
        <i class="close"
           @click.stop="hideModel"></i>
      </div>
      <div
        class="paytypes-wrapper flex"
        v-for="(ele, index) in paytypes"
        :key="'paytypes' + index"
        @click.stop="selectPayType(ele.type)"
      >
        <div class="paytype-left">
          <i class="paytype-left-img" :class="ele.cname"></i>
        </div>
        <div class="paytype-middle">
          <p class="middle-name">{{ ele.name }}</p>
          <p class="middle-memo">{{ ele.memo }}</p>
        </div>
        <div class="paytype-right">
          <i
            class="default-circle"
            :class="{ 'act-circle': selectType === ele.type }"
          ></i>
        </div>
      </div>
      <!-- 支付按钮 -->
      <div class="btn-wrapper fix-btm opt-btm">
        <div class="pay-btn"
             @click.stop="pay()">确认支付 ¥{{orderInfo.paymoney || dataid}} <span class="btn-countDown" v-if="countDown && orderno!=='rechargeNB'">{{countDown}}</span></div>
      </div>
    </div>
    <div id="callpay"></div>
  </div>
</template>
<script>
import {
  GetOrderDetail,
  PayTypeList,
  H5Prepay,
  BuyPrePay,
  AntPrepay,
  AntPayCalc,
  FenQiLePayCalc
} from "../../common/api/sneaker";
import { cCancleOrder } from "../../common/api/snekc2c";
import { DateDiff } from "../../common/util";
import { weixinApp } from "../../common/api/oauthAPI";
import { WxPay } from "../../common/api/wxPay";
import { mapGetters } from "vuex";
import { Indicator } from "mint-ui";
// import order from '../../../../../../../../../Users/hn/Documents/work/labs/h5/src/store/modules/order';

import { ActionReport } from "@/utils/api/base";

const ls = window.localStorage
const dom = window.document
const ISDEV = process.env.NODE_ENV !== "production";

const Safari =
  /Safari/.test(window.navigator.userAgent) &&
  !/Chrome/.test(window.navigator.userAgent);

var wxInterval = null;

/* PayType:支付方式枚举 */
const PT = {
  // alipay: 8,
  // wechatpay: 7,
  // unionpay: 9,
  // fenqilepay: 16
  alipay: 0,
  wechatpay: 1,
  unionpay: 2,
  tenpay: 10,
  jdpay: 11,
  fenqilepay: 12,
  antpay: 14
};

// 支付来源
const PaySource = {
  // 保证金
  bail: 1,
  // C2C购买
  buySneaker: 3,
  // 牛币充值
  rechargeNB: 27
};

// 支付来源项
const PaySourceItem = {
  // 个人保证金
  buyer: 1,
  // 商家保证金
  seller: 2
};

export default {
  name: "C2CPayModel",
  props: {
    payorderno: String,
    dataid: String,
    pledge: String,
    model: Boolean,
    close: Boolean,
    type: {
      type: Number,
      default: 1 // 1: 默认支付 2: 抽抽乐支付
    }
  },
  data() {
    return {
      payInfo: {},
      payWord: "",
      selectType: null,
      countDown: "0",
      showMoreModal: true,
      orderInfo: {},

      fq_ck: -1,

      paysource: PaySource.buySneaker, // 默认为c2c购买
      paysourceitem: 0,
      paramDataid: "",
      paramPledge: 0
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    getIsIphonex() {
      if (this.$root.ISIOS) {
        if (screen.height == 812 && screen.width == 375) {
          return true;
        } else {
          return false;
        }
      }
    },
    orderno() {
      return this.model ? this.payorderno : this.$route.params.orderId;
    },
    isPayBail() {
      let queryParam = this.orderno;
      return queryParam == "sell_pay_bail" || queryParam == "join_pay_bail";
    },
    paytypes() {
      let _ = this,
        list = _.payInfo;
      let ret = [];
      if (list && list.length > 0) {
        list.map((i) => {
          switch (i.type) {
            case PT.alipay:
              // 微信内隐藏支付宝支付
              if (this.$root.ISWX) return;
              i.cname = "pay_ali";
              break;
            case PT.wechatpay:
              i.cname = "pay_weixin";
              break;
            // case PT.tenpay:
            //   i.cname = "pay_qq";
            //   break;
            // 20190320 移除京东支付
            // case PT.jdpay:
            //   i.cname = "pay_jd";
            //   break;

            // 20191029 隐藏其他支付
            // case PT.unionpay:
            //   i.cname = "pay_unipay";
            //   break;
            // case PT.fenqilepay:
            //   // 保证金支付 不处理分期乐支付方式
            //   if (_.isPayBail) return;

            //   i.cname = "pay_fql";
            //   break;
            // case PT.antpay:
            //   // 微信内隐藏花呗分期
            //   if (this.$root.ISWX) return;
            //   i.cname = "pay_ant";
            //   break;
            // 非以上支付方式 不显示
            default:
              return;
          }

          i.profit = i.profit || "";
          i.calcList = i.calcList || [];

          // if (_.$root.ISWX) {
          //   if (i.type !== PT.alipay) ret.push(i);
          // } else ret.push(i);
          ret.push(i);
        });
        _.selectType = list[0].type;
      }
      console.log("real paytype list:", ret);
      return ret;
    }
  },
  beforeMount() {
    if (this.model) document.body.classList.add("lock");
  },
  mounted() {
    let _ = this;

    _.$store.dispatch("updPayingOrder", "");

    if (_.user.token) {
      console.log("mounted: ", _.user);
      _.getPayList();
      _.wx_code();
    }

    let queryParam = _.orderno;
    // console.log("===>route query param:", queryParam);
    if (_.isPayBail) {
      _.paysource = PaySource.bail;
      _.paysourceitem =
        queryParam == "sell_pay_bail"
          ? PaySourceItem.buyer
          : PaySourceItem.seller;
      _.paramDataid = _.dataid || _.$route.query.dataid || "";
      _.paramPledge = _.pledge || _.$route.query.pledge;
    }

    if (this.orderno === "rechargeNB") {
      _.paysource = PaySource["rechargeNB"];
    }
    Indicator.close();
  },
  beforeDestroy() {
    if (wxInterval) clearTimeout(wxInterval);
    if (this.timeRun) clearTimeout(this.timeRun);
    document.body.classList.remove("lock");
  },
  methods: {
    hideModel() {
      let _ = this,
        { orderno, type } = _;
      if (type === 2) {
        _.$emit("close")
      } else {
        _.confirm({
          title: "",
          msg: "价格随时会有波动，确定不再想想吗？",
          okText: "我再想想",
          cancelText: "去意已决",
          cancel: () => {
          // if (_.close) _.$emit("close");
          // else _.$router.replace("/order/detail/" + orderno);
          // 取消订单
            if (_.close) _.$emit("close");
            else {
              cCancleOrder({ orderno })
                .then((res) => {
                  console.log("订单取消成功~");
                  _.$router.replace("/buyerdetail/" + orderno);
                })
                .catch((e) => {
                  _.$router.replace("/buyerdetail/" + orderno);
                  console.error("取消订单失败: ", e);
                });
            }
          }
        });
      }
    },
    orderdetl() {
      let _ = this;

      // 保证金支付不请求订单详情
      if (_.isPayBail) return;

      GetOrderDetail({ orderno: _.orderno })
        .then((res) => {
          if (res) {
            _.orderInfo = res;

            // 倒计时移到这里，订单信息存在的时候开始
            _.countdownTime();

            // 判断有 分期乐支付方式时 计算分期乐 利率
            if (
              _.paytypes &&
              _.paytypes.findIndex((i) => i.type == PT.fenqilepay) > -1
            ) {
              _.calcFenQiLePay(res.paymoney);
            }

            // 判断有 花呗分期支付方式时 计算花呗分期 利率
            if (
              !_.$root.ISWX &&
              _.paytypes &&
              _.paytypes.findIndex((i) => i.type == PT.antpay) > -1
            ) {
              _.calcAntPay(res.paymoney);
            }
          }
        })
        .catch((e) => {
          _.toast(e.msg);
          console.error("orderdetl error", e);
        });
    },
    getPayList() {
      let _ = this;
      let opt = {
        source: "h5",
        version: "",
        paytype: 2
      };
      PayTypeList(opt)
        .then((res) => {
          _.payInfo = res;
          if (_.orderno !== "rechargeNB") {
            _.orderdetl();
          }

          // _.orderdetl();
          // console.log("PayTypeList", res);
          // _.payInfo = res;
          // _.countdownTime();
        })
        .catch((e) => {
          _.toast("支付方式加载失败: " + e.msg);
          _.$emit("close");
        });
    },
    countdownTime() {
      // new Date().getTime('2018/07/18 15:00:00')
      var ts = DateDiff({ destination: this.orderInfo.expiredtime, type: "H" });
      if (ts.H <= 0 && ts.m <= 0 && ts.s <= 0) this.countDown = "";
      else {
        this.countDown =
          "(剩余" + (ts.H > 0 ? ts.H + "时" : "") + ts.m + "分" + ts.s + "秒)";
      }
      // console.log(ts)
      if (ts.m == 0 && ts.s == 1) {
        this.countDown = null;
        clearTimeout(this.timeRun);
      } else {
        this.timeRun = setTimeout(() => {
          this.countdownTime();
        }, 1000);
      }
    },
    selectPayType(type) {
      let _ = this;
      _.selectType = type;
      if (type === PT.tenpay) {
        // qpay
        if (!(window.mqq && window.mqq.QQVersion !== "0")) {
          _.selectType = null;
          _.toast("当前不在手机QQ内，请使用其他支付方式！");
        }
      }
      // 分期乐支付 分期选择处理
      if (type == PT.fenqilepay || type == PT.antpay) {
        if (_.fq_ck == -1) _.fq_ck = 0;
      } else _.fq_ck = -1;
    },
    calcFenQiLePay(paymoney) {
      let _ = this,
        idx = _.payInfo.findIndex((i) => i.type == PT.fenqilepay);
      FenQiLePayCalc(paymoney)
        .then((res) => {
          console.log("FenQiLePayCalc res", res);
          if (res && res.cal_list && res.cal_list.length > 0) {
            _.payInfo[idx].profit = res.profit;
            _.payInfo[idx].calcList = res.cal_list;
          }
        })
        .catch((e) => {
          console.error("FenQiLePayCalc error", e);
        });
    },
    calcAntPay(paymoney) {
      let _ = this,
        idx = _.payInfo.findIndex((i) => i.type == PT.antpay);
      AntPayCalc(paymoney)
        .then((res) => {
          console.log("AntPayCalc res", res);
          /**
            hbfqnum: "3"
            numtxt: "892.74元 x 3期"
            paytext: "含手续费20.07元/期"
           */
          if (res && res.cal_list && res.cal_list.length > 0) {
            _.payInfo[idx].profit = res.profit;
            _.payInfo[idx].calcList = res.cal_list;
          }
        })
        .catch((e) => {
          console.error("AntPayCalc error", e);
        });
    },
    // 支付
    pay() {
      let _ = this,
        orderno = _.orderno,
        type = parseInt(_.selectType);
      let $frameBox = dom.getElementById("callpay");
      // 未开启倒计时的 支付逻辑 countdown 默认是 '0'
      if (!_.countDown) _.toast("订单已过期");
      else {
        if (
          type !== PT.alipay &&
          type !== PT.wechatpay &&
          type !== PT.unionpay &&
          type !== PT.fenqilepay &&
          type !== PT.antpay
        ) {
          _.toast("请选择支付方式");
          return;
        }

        Indicator.open({
          text: "  支付调起中  ",
          spinnerType: "triple-bounce" // 'snake''fading-circle''double-bounce''triple-bounce'
        });

        let currType = _.paytypes.find((i) => i.type === type);

        let origin = window.location.origin;

        let path =
          orderno +
          `?pt=${type}&price=${
            _.isPayBail
              ? _.paramPledge
              : _.orderno === "rechargeNB"
                ? _.dataid
                : _.orderInfo.paymoney
          }`;
        let option = {
          // orderno: orderno,
          paymenttypeid: currType.id,
          paysource: _.paysource
        };

        if (_.isPayBail) option.paysourceitem = _.paysourceitem;
        else option.orderno = orderno;

        // option.dataid = _.dataid;

        let currFq;
        switch (type) {
          case PT.alipay:
            // 支付宝支付
            if (_.$root.ISWX) {
              _.toast("支付宝支付请在浏览器中进行");
              return false;
            }

            option.returnurl = origin + "/sneaker/payResult/" + path;
            option.quiturl = origin + "/sneaker/payResult/" + path;
            break;
          case PT.wechatpay:
            // 微信支付
            if (_.$root.ISWX) {
              // _.orderdetl();

              // 保存支付信息
              ls.removeItem("c2cMarginInfo");
              let marginInfo = {
                orderno: orderno,
                paysource: _.paysource,
                dataid: _.dataid || "",
                luckDraw: _.type === 2 ? 1 : 0
              };

              ls.setItem("c2cMarginInfo", JSON.stringify(marginInfo));

              // 在微信浏览器打开
              var doPath = window.location.origin + "/sneaker/wxpay"; // window.location.pathname;
              var link = weixinApp.get_authorize_base_link(doPath, "weixinJ");
              window.location = link;

              // var delayGoto = setTimeout(() => {
              //   _.toast("支付调起失败~");
              //   _.$router[_.close ? "push" : "replace"](
              //     "/sneaker/payResult/" + path
              //   );
              // }, 8000);

              // window.top._wxpay_get_code = function(code) {
              //   console.log("_wxpay_get_code", code);
              //   if (code) _.wx_code(code);
              //   else {
              //     _.toast("支付调起失败~");
              //     _.$router[_.close ? "push" : "replace"](
              //       "/sneaker/payResult/" + path
              //     );
              //   }
              // };

              // let frame = dom.createElement("iframe");
              // frame.hidden = true;
              // frame.frameBorder = 0;
              // frame.src = link;
              // $frameBox.appendChild(frame);

              return;
            } else {
              // 在非微信浏览器打开
              // 测试H5微信支付微信外的情况本地不能测试，需要放到测试环境测试
              // option.paymenttypeid = 7;
              if (_.orderno === "rechargeNB") { option.returnurl = window.location.href; } else {
                option.returnurl = origin + "/sneaker/payResult/" + path
                if (this.type === 2) {
                  // 抽抽乐提货
                  option.returnurl = option.returnurl + "&luckDraw=1"
                }
              };
              option.inout = 2;
            }
            break;
          case PT.unionpay:
            // 银联支付
            // option.paymenttypeid = 9;
            option.returnurl = origin + "/sneaker/payResult/" + path;
            option.quiturl = origin + "/sneaker/payResult/" + path;
            break;
          case PT.fenqilepay:
            currFq = currType.calcList[_.fq_ck] || {};
            option.skuid = currFq.skuid || "";
            break;
          case PT.antpay:
            currFq = currType.calcList[_.fq_ck] || {};
            option.hbfqnum = currFq.hbfqnum;
            option.ordersystemtype = 2;
            option.returnurl = origin + "/sneaker/payResult/" + path;
            option.quiturl = origin + "/sneaker/payResult/" + path;
            break;
        }

        if (_.orderno === 'rechargeNB') {
          // 抽抽乐支付
          option.dataid = _.dataid
          option.orderno = ''
          option.returnurl = origin + '/activity/luckDraw'
          option.quiturl = origin + '/activity/luckDraw'
        }

        if (!_.isPayBail) {
          try {
            ActionReport({
              netuserid: _.user.uid,
              itemid: _.orderInfo.items[0].productid,
              actiontype: "pay"
            });
          } catch (e) {}
        }

        let req =
          type == PT.antpay
            ? AntPrepay
            : type == PT.fenqilepay && !_.isPayBail
              ? BuyPrePay
              : H5Prepay; // _.isPayBail ? H5Prepay : BuyPrePay;
        req(option)
          .then((res) => {
            if (!ISDEV) {
              window.gdt('track', 'PURCHASE', { 'click': 'pay' })
              window.meteor.track("shopping", { convert_id: "1679400539140103" })
            }
            if (_.orderno !== 'rechargeNB') {
              _.orderdetl()
            }
            if (res.payparam) {
              _.$store.dispatch("updPayingOrder", orderno);

              switch (type) {
                case PT.alipay:
                case PT.unionpay:
                case PT.antpay:
                  let formId =
                    type === PT.alipay
                      ? "alipaysubmit"
                      : type === PT.antpay
                        ? "punchout_form"
                        : type === PT.unionpay
                          ? "unionsubmit"
                          : "";
                  if (PT.alipay === type) {
                    res.payparam = res.payparam.replace(
                      "<form ",
                      '<form id="alipaysubmit" '
                    );
                  }
                  $frameBox.innerHTML = res.payparam;
                  dom.forms[formId].submit();
                  break;
                case PT.wechatpay:
                  Indicator.open({
                    text: "  支付中  ",
                    spinnerType: "triple-bounce" // 'snake''fading-circle''double-bounce''triple-bounce'
                  });
                  let wxframe = dom.getElementById("wxpay");
                  // 在safari 无法调起 微信支付 问题
                  if (Safari) location.href = res.payparam;
                  else {
                    if (wxframe) dom.querySelector("body").removeChild(wxframe);
                    wxframe = dom.createElement("iframe");
                    wxframe.id = "wxpay";
                    wxframe.style.display = "none";
                    wxframe.setAttribute("src", res.payparam);

                    dom.querySelector("body").appendChild(wxframe);
                  }

                  wxInterval = setTimeout(() => {
                    if (wxframe) dom.querySelector("body").removeChild(wxframe);
                    Indicator.close();
                    _.$router.replace("/sneaker/payResult/" + path);
                  }, 8000);
                  break;
                case PT.fenqilepay:
                  try {
                    let resData = JSON.parse(res.payparam);
                    console.log("fql res data", resData);
                    window.location.href = resData.redirect_uri;
                  } catch (err) {
                    console.error("fql res data parse error", err);
                    _.toast("支付处理失败");
                  }
                  break;
              }
            } else _.$router.replace("/");
          })
          .catch((e) => {
            if (!ISDEV) {
              window.gdt('track', 'PURCHASE', { 'click': 'pay' })
              window.meteor.track("shopping", { convert_id: "1679400539140103" })
            }
            Indicator.close();
            console.error(e);
            _.toast("支付调起失败：" + JSON.stringify(e));
          });
      }
    },
    // 微信静默登录返回code进行支付，这种方式不用做 qzone 兼容
    wx_code(code) {
      let _ = this;
      var urlLink = window.location.href;

      if (code || urlLink.indexOf("code") > 0) {
        var weixincode = code || urlLink.split("code=")[1].split("&state")[0],
          // weixinjs = window.location.href.split("state=")[1],
          orderno = _.orderno || urlLink.split("pay/")[1].split("?code")[0],
          // uToken =  urlLink.split("?ut=")[1].split("&code=")[0];
          uToken = JSON.parse(ls.getItem("currentUser")).token;
        let origin = window.location.origin;
        let path = orderno;
        let payParam = {
          orderno: orderno,
          paymenttypeid: 7, // 微信支付的 id 为7
          paysource: _.paysource,
          inout: 1,
          authcode: weixincode,
          returnurl: origin + "/sneaker/payResult/" + path
        };
        console.log("opt", payParam);
        H5Prepay(payParam)
          .then((res) => {
            var wx_param = res;
            let isc2c = 1;
            if (_.$root.ISIOS) {
              if (typeof WeixinJSBridge === "undefined") {
                if (dom.addEventListener) {
                  dom.addEventListener(
                    "WeixinJSBridgeReady",
                    _.onBridgeReady(wx_param, orderno, uToken),
                    false
                  );
                } else if (dom.attachEvent) {
                  dom.attachEvent(
                    "WeixinJSBridgeReady",
                    _.onBridgeReady(wx_param, orderno, uToken)
                  );
                  dom.attachEvent(
                    "onWeixinJSBridgeReady",
                    _.onBridgeReady(wx_param, orderno, uToken)
                  );
                }
              } else {
                _.onBridgeReady(wx_param, orderno, uToken);
              }
            } else {
              WxPay(wx_param, orderno, uToken, isc2c);
            }

            Indicator.close();
          })
          .catch((err) => {
            Indicator.close();
            console.error(err);
          });
      }
    },
    // 微信支付API
    onBridgeReady(wxparam, orderno, uToken) {
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: wxparam.appid, // 公众号名称，由商户传入
          timeStamp: wxparam.timestamp, // 时间戳，自1970年以来的秒数
          nonceStr: wxparam.noncestr, // 随机串
          package: wxparam.package,
          signType: wxparam.signtype, // 微信签名方式：
          paySign: wxparam.paysign // 微信签名
        },
        function (res) {
          // // 微信支付成功
          // if (res.err_msg == "get_brand_wcpay_request:ok") {
          //   window.location =
          //     window.location.origin +
          //     "/sneaker/payResult/" +
          //     orderno +
          //     "?ut=" +
          //     uToken;
          // }
          // // 微信支付失败或者取消支付
          // if (
          //   res.err_msg == "get_brand_wcpay_request:cancel" ||
          //   res.err_msg == "get_brand_wcpay_request:fail"
          // ) {
          window.location =
            window.location.origin +
            "/sneaker/payResult/" +
            orderno +
            "?ut=" +
            uToken;
          // }
        }
      );
    }
  }
};
</script>
<style scoped>
.paytypes-wrapper {
  width: 100%;
  align-items: center;
  padding: 3.467vw 0;
}

.ipx:after {
  content: "";
  display: block;
  width: 100%;
  height: 9.067vw;
}

.btn-wrapper {
  height: 18.67vw;
  width: 100%;
  margin-top: 5.33vw;
  display: flex;
  align-items: center;
}

.btn-countDown {
  font-size: 3.2vw;
}

.pay-btn {
  width: 100%;
  height: 12.267vw;
  line-height: 12.267vw;
  text-align: center;
  background-color: #c8af6e;
  border-radius: 6.67vw;
  color: #fff;
  font-size: 4.6vw;
  font-weight: 600;
  color: #ffffff;
}

.default-circle {
  display: block;
  width: 4.267vw;
  height: 4.267vw;
  border: 2px solid #dcdcdc;
  border-radius: 50%;
}

.act-circle {
  display: block;
  width: 4.267vw;
  height: 4.267vw;
  background: url("//files.eyee.com/eyeeh5/img/draw/draw07.png") no-repeat;
  background-size: contain;
  border: none;
}

.paytype-middle {
  margin-left: 3.73vw;
  flex: 1;
}

.paytype-left-img {
  display: block;
  width: 9.6vw;
  height: 9.6vw;
  background-repeat: no-repeat;
  background-size: contain;
}
.middle-name {
  font-size: 3.73vw;
  font-weight: 600;
  color: #232323;
}

.middle-memo {
  font-size: 3.2vw;
  font-weight: 400;
  color: #969696;
}

.payWrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 4.8vw 4.8vw 0px 0px;
  padding: 5.33vw 5.33vw 0 5.33vw;
}

.payWrapper-title {
  width: 100%;
  text-align: center;
  font-weight: 600;
  font-size: 4.267vw;
  color: #232323;
  height: 11.73vw;
  position: relative;
}

.opt-btm {
  background: #fff;
}
/* .pay_box {
  background: #f2f2f2;
} */
.pay_box.model {
  z-index: 109;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
}
.pay_infos {
  background: #fff;
  border-top: 1px solid #f2f2f2;
}
.pay_infos > label {
  display: block;
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
}
.pay_infos > label.pay_money {
  color: #d99485;
}
.pay_infos > label span {
  display: inline-block;
  float: right;
}
.pay_paylist {
  /* padding: 0 15px; */
  background: #fff;
}
.model .pay_paylist {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding-bottom: 10px;
  border-radius: 16px 16px 0px 0px;
  overflow: hidden;
  z-index: 2;
}
.pay_paylist .pay_title {
  height: 40px;
  line-height: 40px;
  /* border-bottom: 1px solid #f2f2f2; */
  padding: 0 10px;
}
.pay-model-title {
  text-align: center;
  font-weight: 700;
  border-bottom: 1px solid #eee;
}
.pay-model-title > div {
  position: relative;
  font-size: 15px;
  line-height: 50px;
  background: #f5f5f5;
}
.pay-model-title i {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translate(0, -50%);
}
.pay-model-title p {
  font-size: 26px;
  line-height: 50px;
}
.pay_paylist ul li {
  padding: 10px 0;
  font-size: 11px;
  color: #666;
  border-bottom: 1px solid #eee;
  position: relative;
}
.pt-info > div {
  width: calc(100% - 70px - 60px);
}
.pt-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 3px;
}
.pay_icons {
  /* position: absolute;
  left: 10px;
  top: 10px; */
  margin: 0 10px 0 20px;
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.pay_ali {
  background-image: url("//files.eyee.com/mcdn/static/img/pay/pay_ali.png");
}
.pay_ant {
  background-image: url("/static/img/pay/pay_ant.png");
}
.pay_weixin {
  background-image: url("//files.eyee.com/mcdn/static/img/pay/pay_weixin.png");
}
.pay_unipay {
  background-image: url("/static/img/yunshanfu.png");
}
.pt-title .active {
  font-size: 10px;
  background: #adb3ff;
  padding: 2px 4px;
  border-radius: 3px;
  margin-left: 4px;
}
.yunnshanfu {
  position: absolute;
  right: 16%;
  top: 50%;
  transform: translateY(-50%);
  width: 38px;
  height: 34px;
  background: url("//files.eyee.com/mcdn/static/img/pay/pay_unipay.png") 0 0
    no-repeat;
  background-size: 100% 100%;
}
/* .pay_icons.pay_unipay {
  background-image: url('//files.eyee.com/mcdn/static/img/pay/pay_unipay.png');
} */
.pay_icons.pay_qq {
  background-image: url("//files.eyee.com/mcdn/static/img/pay/pay_qq.png");
}
.pay_icons.pay_jd {
  background-image: url("//files.eyee.com/mcdn/static/img/pay/pay_jd.jpg");
}
.pay_icons.pay_fql {
  background-image: url("/static/img/pay/pay_fql.png");
}
.icon_choosen {
  /* display: inline-block;
  position: absolute;
  width: 20px;
  line-height: 20px;
  right: 10px;
  top: 20px; */
  margin: 0 20px;
}
.pay_btn {
  display: block;
  width: 90%;
  margin: 20px auto 0;
  height: 45px;
  line-height: 45px;
  background: #707afc;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 23px;
}
.pay_btn.unClick {
  background: #999;
}

.fq-profit::after {
  content: attr(profit);
  background: #adb3ff;
  border-radius: 2px;
  font-size: 10px;
  line-height: 14px;
  padding: 0 6px;
  margin-left: 5px;
  padding: 2px 4px;
}

.fq-scroll {
  width: 100%;
  overflow-x: scroll;
}
.fq-cells {
  padding: 0 3%;
  white-space: nowrap;
}
.fq-cells > div {
  position: relative;
  display: inline-block;
  overflow: hidden;
  width: 33.33%;
  text-align: center;
  padding: 6px 0;
  margin: 10px 2% 0;
  background: #f5f5f5;
  border-radius: 8px;
  border: 1px solid transparent;
}
.fq-cells > div.act {
  /* border-color: #ffc700;
  background: #fffefb; */
  border-color: #707afc;
}
.fq-cells > div > p:first-of-type {
  font-size: 12px;
  font-weight: 800;
  line-height: 18px;
}
.fq-cells > div > p:last-of-type {
  font-size: 10px;
  line-height: 14px;
}
.fq-cells i {
  position: absolute;
  top: 0;
  left: -2px;
  height: 10px;
  line-height: 9px;
  border-radius: 8px 0 5px 0;
  background: #707afc;
  font-weight: 500;
  color: #fff;
  font-size: 9px;
  padding: 0 3px 0 4px;
  font-style: normal;
}
.close {
  display: block;
  width: 4.267vw;
  height: 4.267vw;
  background: url("../../../static/imgs/mall/small_close.png") no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
