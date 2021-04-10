<template>
  <div class="main">
    <div class="bg">
      <div class="pay_box" :style="screenH" :class="{isHeadHide:!$root.ISAPP}">
        <div class="pay_paylist">
          <i class="ico-X close" @click.stop="close"></i>
          <p class="pay_title">选择付款方式</p>
          <div class="pay-price">
            <p>支付保证金</p>
            <p class="font-price" style="font-size:20px;">¥ {{price}}</p>
          </div>
          <ul>
            <li v-for="p in paytypes" :key="p.id" @click.stop="selectPayType(p.id)">
              <p style="font-weight: 600;color:#333;" class="pt-title">
                {{p.name}}
                <span
                  :class="{'active':p.type==2}"
                  v-if="p.type==2&&p.tips"
                >{{p.tips||''}}</span>
              </p>
              <p>{{p.memo}}</p>
              <em class="pay_icons" :class="p.cname"></em>
              <i :class="{'yunnshanfu':p.type==2}" v-if="p.type==2"></i>
              <em
                class="icon_choosen"
                :class="{'icon_cartSel':selectId !=p.id,'icon_cartSeled':selectId ===p.id}"
              ></em>
              <div
                class="more-modal"
                v-if="insq&&p.id==0&&showMoreModal"
                @click.stop="showMoreModal=!showMoreModal"
              >更多支付方式</div>
            </li>
          </ul>
          <button class="pay_btn" @click="pay()">确认支付</button>
        </div>
        <div id="callpay"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { PayTypeList, H5Prepay } from "../../common/api/sneaker";
import { DateDiff } from "../../common/util";
import { weixinApp } from "../../common/api/oauthAPI";
import { WxPaySneaker } from "../../common/api/wxPay";
import { mapGetters } from "vuex";
import { Indicator } from "mint-ui";

const ls = window.localStorage;
const dom = window.document;
const domain = process.env.SITE_DOMIN; // 'https://m.eyee.com' // 'https://qzone.eyee.com'
const qzoneProxy = process.env.GS_DONMIN; // 'https://1105091322.urlshare.cn'

var tryone = false;
var wxInterval = null;
const openDataKey = "FC_QZONE_OPENDATA";

// var vConsole = new VConsole();

/* PayType:支付方式枚举 */
const PT = {
  alipay: 8,
  wechatpay: 7,
  unionpay: 9
};

export default {
  props: {
    source: {
      default: 1, // 1为个人，2为商家
      type: Number
    },
    dataid: {
      default: "",
      type: String
    },
    successUrl: {
      default: "",
      type: String
    },
    failUrl: {
      default: "",
      type: String
    },
    price: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      payInfo: {},
      payWord: "",
      selectId: null,
      countDown: "0",
      showMoreModal: true,
      orderInfo: {}
    };
  },
  beforeMount() {
    let _ = this;
    if (!_.$root.ISWX) {
      let qpayJs = dom.createElement("script");
      qpayJs.src = "//open.mobile.qq.com/sdk/qqapi.js?_bid=152";
      dom.body.appendChild(qpayJs);
      if (window.mqq) {
        // 配置webview顶部按钮的标题、点击回调等
        window.mqq.ui.setTitleButtons({
          left: {
            title: "关闭",
            callback: function() {
              window.mqq.ui.popBack();
            }
          }
        });
      }
    }

    let origin = window.location.origin;
    if (origin === qzoneProxy) {
      let query = _.$route.query;
      let url = window.location.href.replace(origin, "");
      let openData = JSON.parse(
        window.localStorage.getItem("FC_QZONE_OPENDATA") || "{}"
      );
      window.location.href = `${domain}${url}${
        url.indexOf("?") > -1 ? "&" : "?"
      }openid=${openData.openid || query.openid || ""}`;
    }
    tryone = false;

    if (_.insq) {
      _.$store.dispatch("setUserInfo", {});
      _.doLogin();
    }
  },
  mounted() {
    let _ = this;



    if (_.user.token) {
      console.log("mounted: ", _.user);
      _.getPayList();
    } else {
      console.log("mounted not login: ", _.user);
      _.doLogin();
      setTimeout(() => {
        _.getPayList();
      }, 800);
    }
    Indicator.close();
    // this.orderdetl();
  },
  beforeDestroy() {
    if (wxInterval) clearTimeout(wxInterval);
    if (this.timeRun) clearTimeout(this.timeRun);
  },
  computed: {
    ...mapGetters({ insq: "insq", user: "userInfo" }),
    screenH() {
      return this.insq ? `height:${window.innerHeight}px;` : "";
    },
    paytypes() {
      let list = this.payInfo;
      let ret = [];
      if (list && list.length > 0) {
        list.map(i => {
          // v-if="(!$root.ISWX && index!=2) || ($root.ISWX && index ==1) "
          // {pay_ali:p.paytype == 0,pay_weixin:p.paytype == 1,pay_unipay:p.paytype==2}
          switch (i.id) {
            case PT.alipay:
              // 微信内隐藏支付宝支付
              if(this.$root.ISWX) return
              i.cname = "pay_ali";
              break;
            case PT.wechatpay:
              i.cname = "pay_weixin";
              break;
            case PT.unionpay:
              i.cname = "pay_unipay";
              break;
            // 非以上支付方式 不显示
            default: return
          }

          ret.push(i);

          // 20180428 空间潮物放开支付宝
          // if (this.insq || this.$root.ISWX) {
          // if (this.$root.ISWX) {
          //   if (i.id !== PT.alipay && i.type != 12) ret.push(i);
          // } else if (i.type != 12) ret.push(i); // 不添加分期乐支付类型

          // 手Q潮物仅返回微信支付
          // if (this.insq) {
          //   if (i.paytype === 1) ret.push(i)
          // } else if ((!this.$root.ISWX && i.paytype !== 2) || (this.$root.ISWX && i.paytype === 1)) ret.push(i)
        });
        this.selectId = list[0].id;
      }
      console.log(ret);
      return ret;
    }
  },
  methods: {
    doLogin() {
      let _ = this;
      if (_.insq && !_.user.token) {
        let query = _.$route.query;
        if (!!query.openid || !!window.mqq || window.INSQ) {
          let openData = window.OPEN_DATA
            ? { openid: window.OPEN_DATA.openid }
            : query;
          let old = JSON.parse(ls.getItem(openDataKey) || "{}");
          if (openData && openData.openid)
            ls.setItem(openDataKey, JSON.stringify(openData || ""));

          _.$store.dispatch("qqCheckAndLogin", {
            setJs: !window.mqq,
            old: old
          });
        }
      }
    },
    close() {
      this.$emit("close");
    },
    getPayList() {
      let _ = this;
      let opt = {
        source: "h5",
        version: "",
        paytype: 1
      };
      PayTypeList(opt)
        .then(res => {
          console.log("PayTypeList", res);
          _.payInfo = res;
        })
        .catch(e => {
          if (tryone) {
            let queryhas = !!_.$route.query.openid;
            let localhas = !!JSON.parse(
              window.localStorage.getItem("FC_QZONE_OPENDATA") || "{}"
            ).openid;

            _.toast(
              "支付方式加载失败：0x" +
                (queryhas ? "1" : "0") +
                (localhas ? "1" : "0") +
                e.code
            );
            console.error("PayTypeList error", e);
            // _.insq ? _.checkOrder() : _.$router.back()
            // if (e && e.code == 1511545) _.$router.replace('/')
          } else {
            tryone = true;

            // 检查登录态
            _.doLogin();

            setTimeout(() => {
              _.getPayList();
            }, 600);
          }
        });
    },
    selectPayType(id) {
      let _ = this;
      _.selectId = id;
      if (id === PT.tenpay) {
        // qpay
        if (!(window.mqq && window.mqq.QQVersion !== "0")) {
          _.selectId = null;
          _.toast("当前不在手机QQ内，请使用其他支付方式！");
        }
      }
    },
    // 支付
    pay() {
      let _ = this;
      let id = parseInt(_.selectId);
      if (!_.countDown) _.toast("订单已过期");
      else {
        if (id !== PT.alipay && id !== PT.wechatpay && id !== PT.unionpay) {
          _.toast("请选择支付方式");
          return;
        }

        let currType = _.paytypes.filter(i => i.id === id);

        let openData = JSON.parse(ls.getItem("FC_QZONE_OPENDATA") || "{}");
        let origin = window.location.origin;
        let parameter = _.insq ? `?openid=${openData.openid || ""}` : "";
        if (this.source === 1) {
          parameter += `${_.insq ? "&" : "?"}pt=${id}&price=${this.price}`;
        }
        if (this.dataid) {
          parameter += `&dataid=${this.dataid}`;
        }
        let path = this.successUrl + parameter;
        let option = {
          orderno: 0,
          paymenttypeid: id,
          paysource: 1,
          paysourceitem: this.source
        };
        if (this.dataid) {
          option.dataid = this.dataid;
        }
        switch (id) {
          case PT.alipay:
            // 支付宝支付
            if (_.$root.ISWX) {
              _.toast("支付宝支付请在浏览器中进行");
              return false;
            }
            option.returnurl = origin + path;
            option.quiturl = origin + this.failUrl;
            break;
          case PT.wechatpay:
            // 微信支付
            if (_.$root.ISWX) {
              // 保存支付信息
              ls.removeItem("c2cMarginInfo");
              let marginInfo = {
                successUrl: path,
                failUrl: this.failUrl,
                source: this.source,
                dataid: this.dataid
              };
              ls.setItem("c2cMarginInfo", JSON.stringify(marginInfo));

              // 在微信浏览器打开
              var doPath = window.location.origin + "/sneaker/wxpay";
              var link = weixinApp.get_authorize_base_link(doPath, "weixinJ");
              window.location = link;
              option.inout = 1;
              return;
            } else {
              // 在非微信浏览器打开
              option.paymenttypeid = 7;
              option.returnurl = origin + path;
              option.quiturl = origin + this.failUrl;
              option.inout = 2;
            }
            break;
          case PT.unionpay:
            // 银联支付
            option.paymenttypeid = 9;
            option.returnurl = origin + path;
            option.quiturl = origin + this.failUrl;
            break;
        }
        H5Prepay(option)
          .then(res => {
            // _.orderdetl();
            if (res.payparam) {
              switch (id) {
                case PT.alipay:
                case PT.unionpay:
                  let formId =
                    id === PT.alipay
                      ? "alipaysubmit"
                      : id === PT.unionpay
                      ? "unionsubmit"
                      : "";
                  if (PT.alipay === id) {
                    res.payparam = res.payparam.replace(
                      "<form ",
                      '<form id="alipaysubmit" '
                    );
                  }
                  dom.getElementById("callpay").innerHTML = res.payparam;
                  dom.forms[formId].submit();
                  break;
                case PT.wechatpay:
                  Indicator.open({
                    text: "  支付中  ",
                    spinnerType: "triple-bounce" // 'snake''fading-circle''double-bounce''triple-bounce'
                  });
                  let wxframe = dom.getElementById("wxpay");
                  if (wxframe) dom.querySelector("body").removeChild(wxframe);
                  wxframe = dom.createElement("iframe");
                  wxframe.id = "wxpay";
                  wxframe.style.display = "none";
                  wxframe.setAttribute("src", res.payparam);
                  dom.querySelector("body").appendChild(wxframe);
                  wxInterval = setTimeout(() => {
                    if (wxframe) dom.querySelector("body").removeChild(wxframe);
                    Indicator.close();
                    _.$router.replace(path);
                  }, 8000);
                  break;
              }
            } else _.$router.replace("/");
          })
          .catch(e => {
            console.error(e);
            _.toast("支付调起失败：" + JSON.stringify(e));
          });
      }
    }
  }
};
</script>
<style scoped>
.main {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99;
}

.bg {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
}

.close {
  position: absolute;
  top: 4.1333vw;
  right: 4.1333vw;
}
.pay_box {
  background: #fff;
}
.more-modal {
  position: absolute;
  width: 100%;
  height: 130%;
  top: -5px;
  left: 0;
  background: #f2f2f2;
  text-align: center;
  font-size: 14px;
  line-height: 60px;
}
.more-modal::after {
  content: "";
  position: absolute;
  bottom: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  margin-bottom: -15px;
  border-right: 1px solid;
  border-bottom: 1px solid;
  transform: rotate(45deg);
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
.pay_paylist .pay_title {
  height: 16vw;
  line-height: 16vw;
  text-align: center;
  font-weight: 600;
  font-size: 17px;
  border-bottom: 1px solid #eee;
}
.pay_paylist ul li {
  position: relative;
  height: 60px;
  line-height: 40px;
  padding: 10px 0 10px 60px;
  /* margin: 5px 0; */
  font-size: 11px;
  color: #666;
  border-bottom: 1px solid #eee;
}
.pay_paylist ul li > p {
  height: 20px;
  margin: 0;
  line-height: 20px;
}
.pay_paylist ul li > p:first-child {
  font-size: 16px;
}
.pay_icons {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 40px;
  height: 40px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.pay_icons.pay_ali {
  background-image: url(//files.eyee.com/mcdn/static/img/pay/pay_ali.png);
}
.pay_icons.pay_weixin {
  background-image: url(//files.eyee.com/mcdn/static/img/pay/pay_weixin.png);
}
.pay_icons.pay_unipay {
  background-image: url("/static/img/yunshanfu.png");
}
.pt-title .active {
  font-size: 10px;
  background: #ffc700;
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
  background: url(//files.eyee.com/mcdn/static/img/pay/pay_unipay.png) 0 0
    no-repeat;
  background-size: 100% 100%;
}
/* .pay_icons.pay_unipay {
  background-image: url(//files.eyee.com/mcdn/static/img/pay/pay_unipay.png);
} */
.pay_icons.pay_qq {
  background-image: url(//files.eyee.com/mcdn/static/img/pay/pay_qq.png);
}
.pay_icons.pay_jd {
  background-image: url(//files.eyee.com/mcdn/static/img/pay/pay_jd.jpg);
}
.icon_choosen {
  display: inline-block;
  position: absolute;
  width: 20px;
  line-height: 20px;
  right: 10px;
  top: 20px;
}
.pay_btn {
  display: block;
  width: 100%;
  height: 44px;
  line-height: 44px;
  background: #333;
  color: #fff;
  font-size: 16px;
  border: none;
  margin-top: 10px;
}
.pay_btn.unClick {
  background: #999;
}

.pay-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 16.2667vw;
  padding: 0 4vw;
  font-size: 14px;
}
</style>
