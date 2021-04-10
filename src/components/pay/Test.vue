<template>
  <div>
    <button @click="payOut">OUT——发起微信外支付</button>
    <button @click="payIn">IN——发起微信内支付</button>
    <button @click="payAli">ALI——发起支付宝支付</button>
    
    <button @click="getWxCode">微信内获取code</button>

    <div id="callpay"></div>
  </div>
</template>
<script>
import { TestPay, TestWxpayIn } from "../../common/api/order";
import { weixinApp } from "../../common/api/oauthAPI";
import { Indicator } from "mint-ui";

var directLink = function(url) {
  window.location.href = url;
};

const dom = window.document;
var wxInterval = null;

export default {
  mounted() {
    this.wx_code();
  },
  beforeDestroy() {
    if (wxInterval) clearTimeout(wxInterval);
  },
  methods: {
    getWxCode() {
      let _ = this
      let $frameBox = dom.getElementById("callpay");
      // 在微信浏览器打开
      var doPath = window.location.origin + "/wxcode"; // window.location.pathname;
      var link = weixinApp.get_authorize_base_link(doPath, "weixinJ");
      // window.location = link;

      window.top._wxpay_get_code = function(code) {
        alert('getWxCode: '+code)
      };

      let frame = dom.createElement("iframe");
      frame.hidden = false;
      frame.style = 'position:fixed;top:10%;left:0;width:100vw;height:100vh;background:rgba(0,0,0,.3);'
      frame.frameBorder = 0;
      frame.src = link;
      $frameBox.appendChild(frame);
    },
    payAli() {
      let _ = this;
      TestPay({
        paymenttypeid: 8,
        paysource: 1,
        paysourceitem: 2,
        orderno: 10000,
        inout: 1,
        returnurl: "https://qzone.eyee.com/paytest"
      })
        .then(res => {
          console.log("test ali pay res =>", res);
          // let formId = "alipaysubmit";
          // payType === PT.alipay
          //   ? "alipaysubmit"
          //   : payType === PT.unionpay ? "unionsubmit" : "jdpaysubmit";
          dom.getElementById("callpay").innerHTML = res.payparam;
          // dom.forms[payType === 2 ? 'unionsubmit' : 'alipaysubmit'].submit()
          dom.forms[0].submit();
        })
        .catch(e => {
          console.error("test ali pay error: ", e);
        });
    },
    payOut() {
      let _ = this;
      // switch (payType) {
      //   case PT.alipay:
      //     // 支付宝支付
      //     if (_.$root.ISWX) {
      //       _.toast("支付宝支付请在浏览器中进行");
      //       return false;
      //     }
      //     option.Ali_Return_url = origin + "/paysuccess/" + path;
      //     option.Ali_Quit_url = origin + "/payfail/" + path;
      //     break;
      //   case PT.wechatpay:
      //     // 微信支付
      //     if (_.$root.ISWX) {
      //       _.orderdetl();

      //       // 在微信浏览器打开
      //       var doPath = window.location.origin + window.location.pathname;
      //       var link = weixinApp.get_authorize_base_link(doPath, "weixinJ");
      //       window.location = link;
      //       return;
      //     } else {
      //       // 在非微信浏览器打开
      //       option.PayType = 2;
      //       option.Wxout_FinishedUrl = origin + "/payjump/" + path;
      //     }
      //     break;
      //   case PT.unionpay:
      //     // 银联支付
      //     option.PayType = 3;
      //     option.union_fronturl = origin + "/paysuccess/" + path;
      //     option.union_tradefaildurl = origin + "/payfail/" + path;
      //     break;
      //   case PT.tenpay:
      //     // qq钱包支付
      //     option.PayType = 4;
      //     break;
      //   case PT.jdpay:
      //     // 京东支付
      //     option.PayType = 5;
      //     option.Jd_ReturnUrl = origin + "/paysuccess/" + path;
      //     break;
      // }
      TestPay({
        paymenttypeid: 7,
        inout: 2,
        paysource: 1,
        paysourceitem: 1,
        orderno: 0,
        returnurl: "https://qzone.eyee.com/paytest",
        dataid: "asdasdasd"
      })
        .then(res => {
          console.log("TestWxpayOut res =>", res);
          if (res.payparam) {
            // switch (payType) {
            //   case PT.wechatpay:
            // Indicator.open({
            //   text: "  支付中  ",
            //   spinnerType: "triple-bounce" // 'snake''fading-circle''double-bounce''triple-bounce'
            // });
            let wxframe = dom.getElementById("wxpay");
            if (wxframe) dom.querySelector("body").removeChild(wxframe);
            wxframe = dom.createElement("iframe");
            wxframe.id = "wxpay";
            // wxframe.style.display = "none";
            wxframe.style =
              "display:block;border:none;width:90%;height:400px;margin:10px auto;";
            wxframe.setAttribute("src", res.payparam);
            dom.querySelector("body").appendChild(wxframe);
            // wxInterval = setTimeout(() => {
            //   if (wxframe) dom.querySelector("body").removeChild(wxframe);
            //   Indicator.close();
            //   _.$router.replace("/payjump/123");
            // }, 8000);
            //     break;
            // }
          } else _.$router.replace("/");
        })
        .catch(e => {
          console.error(e);
          _.toast("支付调起失败：" + JSON.stringify(e));
        });
    },
    payIn() {
      // 在微信浏览器打开
      var doPath = window.location.origin + window.location.pathname;
      var link = weixinApp.get_authorize_base_link(doPath, "weixinJ");
      if (window.confirm("跳转的链接：" + link)) window.location = link;
      return;
    },
    // 微信静默登录返回code进行支付
    wx_code() {
      let _ = this;
      var urlLink = window.location.href;
      console.log("===============>", urlLink);
      if (urlLink.indexOf("code") > 0) {
        var weixincode = urlLink.split("code=")[1].split("&state")[0],
          // weixinjs = window.location.href.split("state=")[1],
          ordernum = "", // urlLink.split("pay/")[1].split("?code")[0],
          // uToken =  urlLink.split("?ut=")[1].split("&code=")[0];
          uToken = ""; // JSON.parse(ls.getItem("currentUser")).token;
        TestWxpayIn(weixincode)
          .then(res => {
            var wx_param = res;
            console.log("===============>response", wx_param);
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
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    // 微信支付API
    onBridgeReady(wxparam, ordernum, uToken) {
      let data = {
        appId: wxparam.appid, // 公众号名称，由商户传入
        timeStamp: wxparam.timestamp, // 时间戳，自1970年以来的秒数
        nonceStr: wxparam.noncestr, // 随机串
        package: wxparam.package,
        signType: wxparam.signtype, // 微信签名方式：
        paySign: wxparam.paysign // 微信签名
      };
      console.log("====>getBrandWCPayRequest", data);
      if (window.confirm("onBridgeReady"))
        WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          data,
          // {
          //   appId: wxparam.appid, // 公众号名称，由商户传入
          //   timeStamp: wxparam.timestamp, // 时间戳，自1970年以来的秒数
          //   nonceStr: wxparam.noncestr, // 随机串
          //   package: wxparam.package,
          //   signType: wxparam.signtype, // 微信签名方式：
          //   paySign: wxparam.paysign // 微信签名
          // },
          function(res) {
            alert("getBrandWCPayRequest res：" + JSON.stringify(res));
            // // 微信支付成功
            // if (res.err_msg == "get_brand_wcpay_request:ok") {
            //   window.location =
            //     window.location.origin + "/payjump/" + ordernum + "?ut=" + uToken;
            // }
            // // 微信支付失败或者取消支付
            // if (
            //   res.err_msg == "get_brand_wcpay_request:cancel" ||
            //   res.err_msg == "get_brand_wcpay_request:fail"
            // ) {
            //   window.location =
            //     window.location.origin + "/payjump/" + ordernum + "?ut=" + uToken;
            // }
          }
        );
    }
  }
};

function WxPay(params, ordernum, uToken) {
  // wx.config({
  //   debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  //   appId: params.appid, // 必填，公众号的唯一标识
  //   timestamp: params.timestamp, // 必填，生成签名的时间戳
  //   nonceStr: params.noncestr, // 必填，生成签名的随机串
  //   signature: params.paysign, // 必填，签名，见附录1
  //   jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  // })
  // wx.ready(function () {
  //
  // })

  setTimeout(() => {
    let data = {
      timestamp: params.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: params.noncestr, // 支付签名随机串，不长于 32 位
      package: params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: params.signtype, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: params.paysign
    };
    console.log("====>wx.chooseWXPay", data);
    if (window.confirm("wx.chooseWXPay"))
      wx.chooseWXPay({
        // timestamp: params.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        // nonceStr: params.noncestr, // 支付签名随机串，不长于 32 位
        // package: params.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        // signType: params.signtype, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        // paySign: params.paysign, // 支付签名
        ...data,
        success: function(res) {
          alert("支付成功:" + JSON.stringify(res));
          // alert('支付成功' + window.location.origin + '/paysuccess/' + ordernum + '?timestamp=' + ((new Date()).getTime() + Math.random()))
          // directLink(window.location.origin + '/paysuccess/' + ordernum)
        },
        fail: function(res) {
          alert("支付失败: " + JSON.stringify(res));
          // directLink(window.location.origin + '/payfail/' + ordernum + '?timestamp=' + ((new Date()).getTime() + Math.random()))
        },
        cancel: function(res) {
          alert("支付取消: " + JSON.stringify(res));
          // directLink(window.location.origin + '/payfail/' + ordernum + '?timestamp=' + ((new Date()).getTime() + Math.random()))
        }
      });
  }, 1000);

  wx.error(function(res) {
    alert("e" + JSON.stringify(res));
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    /* alert("config信息验证失败");*/
  });
}
</script>

<style scoped>
button {
  display: block;
  margin: 60px auto 0;
  background: #ffc700;
  border: none;
  padding: 10px 40px;
}
</style>
