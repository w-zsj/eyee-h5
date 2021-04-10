<template>
  <div
    class="pay_box"
    :class="{isHeadHide:!$root.ISAPP,model:model}"
    @click.stop="hideModel"
    @touchmove.stop
  >
    <template v-if="!model">
      <v-header v-if="!$root.ISAPP">
        <div class="nav-tab2">
          <h3>在线支付</h3>
        </div>
      </v-header>
      <div class="pay_infos">
        <label class="pay_money gaps">
          订单总价
          <span>¥{{payInfo.paymoney}}</span>
        </label>
        <label class="gaps">
          订单编号
          <span>{{payInfo.orderno}}</span>
        </label>
      </div>
    </template>

    <div class="pay_paylist" @click.stop>
      <p class="pay_title" v-if="!model">请选择支付方式</p>
      <div v-else class="pay-model-title">
        <div>
          <span>选择支付方式</span>
          <i class="ico-X" @click.stop="hideModel"></i>
        </div>
        <p v-if="payInfo.paymoney">¥{{payInfo.paymoney}}</p>
      </div>
      <ul>
        <li v-for="p in paytypes" :key="p.paytype" @click="selectPayType(p.paytype)">
          <div class="flex-between pt-info">
            <em class="pay_icons" :class="p.cname"></em>
            <div>
              <p class="pt-title" :class="{'fq-profit':p.profit}" :profit="p.profit">
                {{p.title}}
                <span
                  :class="{'active':p.paytype==2}"
                  v-if="p.paytype==2&&p.tips"
                >{{p.tips||''}}</span>
              </p>
              <p>{{p.memo}}</p>
            </div>
            <i :class="{'yunnshanfu':p.paytype==2}" v-if="p.paytype==2"></i>
            <em
              class="icon_choosen"
              :class="{'icon_cartSel':selectType !=p.paytype,'icon_cartSeled':selectType ===p.paytype}"
            ></em>
          </div>
          <template v-if="p.calcList.length>0">
            <div class="fq-scroll" v-show="selectType===p.paytype">
              <div class="fq-cells">
                <div
                  v-for="(fq,fqIdx) in p.calcList"
                  :key="p.paytype+'stage'+fqIdx"
                  :class="{'act':selectType===p.paytype&&fq_ck===fqIdx}"
                  @click="fq_ck = fqIdx"
                >
                  <p>{{fq.numtext||fq.numtxt}}</p>
                  <p>{{fq.paytext}}</p>
                  <i v-if="fq.isfee">免息</i>
                </div>
              </div>
            </div>
          </template>
        </li>
      </ul>
      <div class="fix-btm opt-btm">
        <button class="pay_btn" :class="{'unClick':!countDown}" @click="pay()">确认支付{{countDown}}</button>
      </div>
    </div>
    <div id="callpay"></div>
  </div>
</template>
<script>
import {
  OrderDetail,
  PayTypeList,
  NewPayTypeList,
  H5PrePay,
  WxOutOrder
} from "../../common/api/order";
import {
  FenQiLePayCalc,
  AntPayCalc,
  AntPrepay,
  BuyPrePay
} from "../../common/api/sneaker";
import { DateDiff } from "../../common/util";
import { weixinApp } from "../../common/api/oauthAPI";
import { WxPay } from "../../common/api/wxPay";
import { mapGetters } from "vuex";
import { Indicator } from "mint-ui";
import { setTimeout } from "timers";

const ls = window.localStorage;
const dom = window.document;

const Safari =
  /Safari/.test(window.navigator.userAgent) &&
  !/Chrome/.test(window.navigator.userAgent);
var wxInterval = null;

// var vConsole = new VConsole();

/* PayType:支付方式枚举 */
const PT = {
  alipay: 0,
  wechatpay: 1,
  unionpay: 2,
  tenpay: 10,
  jdpay: 11,
  fenqilepay: 12,
  antpay: 14
};

export default {
  name: "PayModel",
  props: {
    payorderno: String,
    model: Boolean,
    close: Boolean
  },
  data() {
    return {
      payInfo: {},
      selectType: null,
      countDown: "0",

      fq_ck: -1
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    orderno() {
      return this.model ? this.payorderno : this.$route.params.orderId;
    },
    paytypes() {
      let list = this.payInfo.paytypelist;
      let ret = [];
      if (list && list.length > 0) {
        list.map(i => {
          switch (i.paytype) {
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

          // if (this.$root.ISWX) {
          //   if (i.paytype !== PT.alipay) ret.push(i);
          // } else ret.push(i);
          ret.push(i);
        });
        this.selectType = list[0].paytype;
      }
      console.log("paytypes", ret);
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
      _.getPayList();
      _.wx_code();
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
        { orderno } = _;
      _.confirm({
        title: "",
        msg: "离开宝贝会被别人抢走哦~",
        okText: "我再想想",
        cancelText: "去意已决",
        cancel: () => {
          if (_.close) _.$emit("close");
          else _.$router.replace("/order/detail/" + orderno);
        }
      });
    },
    orderdetl() {
      let _ = this;
      OrderDetail({
        orderno: _.orderno,
        token: _.user.token
      })
        .then(res => {
          if (res) {
            // 倒计时移到这里，订单信息存在的时候开始
            _.countdownTime();

            // 判断有 分期乐支付方式时 计算分期乐 利率
            if (
              _.paytypes &&
              _.paytypes.findIndex(i => i.paytype == PT.fenqilepay) > -1
            )
              _.calcFenQiLePay(res.paymoney);

            // 判断有 花呗分期支付方式时 计算花呗分期 利率
            if (
              !_.$root.ISWX &&
              _.paytypes &&
              _.paytypes.findIndex(i => i.paytype == PT.antpay) > -1
            )
              _.calcAntPay(res.paymoney);
          }
        })
        .catch(e => {
          _.toast(e.msg);
          console.error("orderdetl error", e);
          // setTimeout(() => {
          //   _.orderdetl();
          // }, 800);
        });
    },
    getPayList() {
      let _ = this;
      NewPayTypeList(_.orderno)
        .then(res => {
          console.log("PayTypeList", res);
          _.payInfo = res;
          _.orderdetl();

          // _.countdownTime();
        })
        .catch(e => {
          _.toast("支付方式加载失败: " + e.msg);
          _.$emit("close");
        });
    },
    countdownTime() {
      // new Date().getTime('2018/07/18 15:00:00')
      var ts = DateDiff({ destination: this.payInfo.expiredtime, type: "H" });
      if (ts.H <= 0 && ts.m <= 0 && ts.s <= 0) this.countDown = "";
      else
        this.countDown =
          "(剩余" + (ts.H > 0 ? ts.H + "时" : "") + ts.m + "分" + ts.s + "秒)";
      if (ts.m == 0 && ts.s == 1) {
        this.countDown = null;
        clearTimeout(this.timeRun);
      } else {
        this.timeRun = setTimeout(() => {
          this.countdownTime();
        }, 1000);
      }
    },
    selectPayType(paytype) {
      let _ = this;
      _.selectType = paytype;
      if (paytype === PT.tenpay) {
        // qpay
        if (!(window.mqq && window.mqq.QQVersion !== "0")) {
          _.selectType = null;
          _.toast("当前不在手机QQ内，请使用其他支付方式！");
        }
      }
      // 分期乐支付 分期选择处理
      if (paytype == PT.fenqilepay || paytype == PT.antpay) {
        if (_.fq_ck == -1) _.fq_ck = 0;
      } else _.fq_ck = -1;
    },
    calcFenQiLePay(paymoney) {
      let _ = this,
        idx = _.payInfo.paytypelist.findIndex(i => i.paytype == PT.fenqilepay);
      FenQiLePayCalc(paymoney)
        .then(res => {
          console.log("FenQiLePayCalc res", res);
          /**
            isfee: 1
            numtext: "2618.00元 x 1期"
            paytext: "0手续费"
            skuid: "MES201809122285958"
           */
          if (res && res.cal_list && res.cal_list.length > 0) {
            _.payInfo.paytypelist[idx].profit = res.profit;
            _.payInfo.paytypelist[idx].calcList = res.cal_list;
          }
        })
        .catch(e => {
          console.error("FenQiLePayCalc error", e);
        });
    },
    calcAntPay(paymoney) {
      let _ = this,
        idx = _.payInfo.paytypelist.findIndex(i => i.paytype == PT.antpay);
      AntPayCalc(paymoney)
        .then(res => {
          console.log("AntPayCalc res", res);
          /**
            hbfqnum: "3"
            numtxt: "892.74元 x 3期"
            paytext: "含手续费20.07元/期"
           */
          if (res && res.cal_list && res.cal_list.length > 0) {
            _.payInfo.paytypelist[idx].profit = res.profit;
            _.payInfo.paytypelist[idx].calcList = res.cal_list;
          }
        })
        .catch(e => {
          console.error("AntPayCalc error", e);
        });
    },
    // 支付
    pay() {
      let _ = this;
      let orderno = _.payInfo.orderno;
      let payType = parseInt(_.selectType);
      let $frameBox = dom.getElementById("callpay");
      // 未开启倒计时的 支付逻辑 countdown 默认是 '0'
      if (!_.countDown) _.toast("订单已过期");
      else {
        if (
          payType !== PT.alipay &&
          payType !== PT.wechatpay &&
          payType !== PT.unionpay &&
          payType !== PT.tenpay &&
          payType !== PT.jdpay &&
          payType !== PT.fenqilepay &&
          payType !== PT.antpay
        ) {
          _.toast("请选择支付方式");
          return;
        }

        Indicator.open({
          text: "  支付调起中  ",
          spinnerType: "triple-bounce" // 'snake''fading-circle''double-bounce''triple-bounce'
        });

        let currType = _.paytypes.find(i => i.paytype === payType);

        let origin = window.location.origin;

        let path = orderno;
        let option = {
          orderno,
          payType,
          paymenttypeid: currType.paymenttypeid,
          paysource: currType.paysource
        };
        let currFq;
        switch (payType) {
          case PT.alipay:
            // 支付宝支付
            if (_.$root.ISWX) {
              Indicator.close();
              _.toast("支付宝支付请在浏览器中进行");
              return false;
            }
            option.Ali_Return_url = origin + "/paysuccess/" + path;
            option.Ali_Quit_url = origin + "/payfail/" + path;
            break;
          case PT.wechatpay:
            // 微信支付
            if (_.$root.ISWX) {
              // _.orderdetl();

              // 保存支付信息
              ls.removeItem("c2cMarginInfo");
              let marginInfo = {
                orderno,
                paysource: 4
              };
              ls.setItem("c2cMarginInfo", JSON.stringify(marginInfo));

              // 在微信浏览器打开
              var doPath = window.location.origin + "/sneaker/wxpay"; // window.location.pathname;
              var link = weixinApp.get_authorize_base_link(doPath, "weixinJ");
              window.location = link;

              // var delayGoto = setTimeout(() => {
              //   _.toast("支付调起失败~");
              //   _.$router[_.close ? "push" : "replace"]("/payfail/" + path);
              //   Indicator.close();
              //   _.$emit("close");
              // }, 8000);

              // window.top._wxpay_get_code = function(code) {
              //   console.log("_wxpay_get_code", code);
              //   if (code) _.wx_code(code);
              //   else {
              //     _.toast("支付调起失败~");
              //     _.$router[_.close ? "push" : "replace"]("/payfail/" + path);
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
              option.payType = 2;
              option.Wxout_FinishedUrl = origin + "/payjump/" + path;
            }
            break;
          case PT.unionpay:
            // 银联支付
            option.payType = 3;
            option.union_fronturl = origin + "/paysuccess/" + path;
            option.union_tradefaildurl = origin + "/payfail/" + path;
            break;
          case PT.tenpay:
            // qq钱包支付
            option.payType = 4;
            break;
          case PT.jdpay:
            // 京东支付
            option.payType = 5;
            option.Jd_ReturnUrl = origin + "/paysuccess/" + path;
            break;
          case PT.fenqilepay:
            currFq = currType.calcList[_.fq_ck] || {};
            option.skuid = currFq.skuid || "";
            break;
          case PT.antpay:
            currFq = currType.calcList[_.fq_ck] || {};
            option.hbfqnum = currFq.hbfqnum;
            option.ordersystemtype = 1;
            option.returnurl = origin + "/paysuccess/" + path;
            option.quiturl = origin + "/payfail/" + path;
            break;
        }

        /**
         * dataid: "JpvpMJCj"
         * orderno: "503281415991853056"
         * paymenttypeid: 16
         * paysource: 3
         * skuid: "MES201809122285958" */
        let req =
          payType == PT.antpay
            ? AntPrepay
            : payType == PT.fenqilepay
            ? BuyPrePay
            : H5PrePay;
        req(option)
          .then(res => {
            if (!ISDEV) {
              window.gdt('track', 'PURCHASE', {'click': 'pay'})
              window.meteor.track("shopping", {convert_id: "1679400539140103"})
            }
            _.orderdetl();
            if (res.payparam) {
              _.$store.dispatch("updPayingOrder", orderno);

              switch (payType) {
                case PT.alipay:
                case PT.unionpay:
                case PT.jdpay:
                case PT.antpay:
                  let formId =
                    payType === PT.alipay
                      ? "alipaysubmit"
                      : payType === PT.antpay
                      ? "punchout_form"
                      : payType === PT.unionpay
                      ? "unionsubmit"
                      : "jdpaysubmit";
                  if (PT.alipay === payType) {
                    res.payparam = res.payparam.replace(
                      "<form ",
                      '<form id="alipaysubmit" '
                    );
                  }
                  $frameBox.innerHTML = res.payparam;
                  dom.forms[formId].submit();
                  break;
                case PT.wechatpay:
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
                    _.$router[_.close ? "push" : "replace"]("/payjump/" + path);
                  }, 8000);
                  break;
                case PT.tenpay:
                  if (window.mqq && window.mqq.tenpay.pay) {
                    window.mqq.tenpay.pay(
                      {
                        tokenId: res.payparam
                        // pubAcc: "xxxx", // 公众账号uin，用于在支付成功后关注该公众号
                        // pubAccHint: "xxxx", // 公众账好关注提示语，用于显示在支付成功页
                        // appInfo: "appid#XXXX|bargainor_id#XXXX|channel#wallet"
                      },
                      function(result, resultCode, retmsg) {
                        // _.toast(result + '----' + resultCode + '-----' + retmsg)
                        let goUrl = "/payfail/" + path;
                        if (typeof result === "string")
                          _.toast(`支付失败：${result}`);
                        else if (result.resultCode === 0)
                          goUrl = "/paysuccess/" + path;
                        else
                          _.toast(
                            `支付失败：${retmsg ||
                              result.retmsg}，${resultCode ||
                              result.resultCode}`
                          );

                        _.$router[_.close ? "push" : "replace"](goUrl);
                      }
                    );
                  } else {
                    _.selectType = null;
                    _.toast("当前不在手机QQ内，请使用其他支付方式！");
                  }
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
          .catch(e => {
            if (!ISDEV) {
              window.gdt('track', 'PURCHASE', {'click': 'pay'})
              window.meteor.track("shopping", {convert_id: "1679400539140103"})
            }
            Indicator.close();
            console.error(e);
            _.toast("支付调起失败：" + JSON.stringify(e));
          });
      }
    },
    // 微信静默登录返回code进行支付
    wx_code(code) {
      let _ = this;
      var urlLink = window.location.href;

      if (code || urlLink.indexOf("code") > 0) {
        var weixincode = code || urlLink.split("code=")[1].split("&state")[0],
          // weixinjs = window.location.href.split("state=")[1],
          ordernum = _.orderno || urlLink.split("pay/")[1].split("?code")[0],
          // uToken =  urlLink.split("?ut=")[1].split("&code=")[0];
          uToken = JSON.parse(ls.getItem("currentUser")).token;
        H5PrePay({
          OrderNo: ordernum,
          payType: 1,
          Wxin_Code: weixincode,
          Authorization: uToken,
          iswx: true
        })
          .then(res => {
            var wx_param = res.wx_payparam;

            if (_.$root.ISIOS) {
              if (typeof WeixinJSBridge === "undefined") {
                if (dom.addEventListener) {
                  dom.addEventListener(
                    "WeixinJSBridgeReady",
                    _.onBridgeReady(wx_param, ordernum, uToken),
                    false
                  );
                } else if (dom.attachEvent) {
                  dom.attachEvent(
                    "WeixinJSBridgeReady",
                    _.onBridgeReady(wx_param, ordernum, uToken)
                  );
                  dom.attachEvent(
                    "onWeixinJSBridgeReady",
                    _.onBridgeReady(wx_param, ordernum, uToken)
                  );
                }
              } else {
                _.onBridgeReady(wx_param, ordernum, uToken);
              }
            } else {
              WxPay(wx_param, ordernum, uToken);
            }

            Indicator.close();
          })
          .catch(err => {
            Indicator.close();
            console.error(err);
          });
      }
    },
    // 微信支付API
    onBridgeReady(wxparam, ordernum, uToken) {
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
        function(res) {
          // 微信支付成功
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            window.location =
              window.location.origin + "/payjump/" + ordernum + "?ut=" + uToken;
          }
          // 微信支付失败或者取消支付
          if (
            res.err_msg == "get_brand_wcpay_request:cancel" ||
            res.err_msg == "get_brand_wcpay_request:fail"
          ) {
            window.location =
              window.location.origin + "/payjump/" + ordernum + "?ut=" + uToken;
          }
        }
      );
    }
  }
};
</script>
<style scoped>
.opt-btm {
  background: #fff;
}
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
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding-bottom: 10px;
  border-radius: 16px 16px 0px 0px;
  overflow: hidden;
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

.pay_icons.pay_ali {
  background-image: url("//files.eyee.com/mcdn/static/img/pay/pay_ali.png");
}
.pay_icons.pay_ant {
  background-image: url("/static/img/pay/pay_ant.png");
}
.pay_icons.pay_weixin {
  background-image: url("//files.eyee.com/mcdn/static/img/pay/pay_weixin.png");
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
.pay_icons.pay_unipay {
  background-image: url("/static/img/yunshanfu.png");
}
.pay_icons.pay_qq {
  background-image: url("//files.eyee.com/mcdn/static/img/pay/pay_qq.png");
}
.pay_icons.pay_jd {
  background-image: url("//files.eyee.com/mcdn/static/img/pay/pay_jd.jpg");
}
.pay_icons.pay_fql {
  background-image: url("//files.eyee.com/mcdn/static/img/pay/pay_fql.png");
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
</style>
