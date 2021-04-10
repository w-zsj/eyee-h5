<template>
  <p>
    {{Number(!!$route.params.orderno)}}
    {{Number(!!$route.query.code)}}
    {{Number(!!$route.query.state)}}
  </p>
</template>
<script>
import { H5PrePay as oldPrepay } from "@/common/api/order";
import { H5Prepay } from "@/common/api/sneaker";
import { WxPay } from "@/common/api/wxPay";

let dom = document,
  wl = window.location,
  ls = window.localStorage;
export default {
  name: "WxCode",
  mounted() {
    // console.log(
    //   "wxcode window.location.href ",
    //   window.location.href,
    //   this.$route
    // );
    let _ = this,
      { params, query } = _.$route;
    _.doWxPay(params.orderno, query.code, query.state);
    // let code = "";
    // if (window.location.href.indexOf("code") > 0)
    //   code = window.location.href.split("code=")[1].split("&state")[0];
    // window.top._wxpay_get_code(code);
  },
  methods: {
    doWxPay(orderno, code, state) {
      let _ = this,
        isMall = state == 4,
        uToken = JSON.parse(ls.getItem("currentUser") || "{}").token;

      if (orderno && code && state) {
        /**
          B2C
          {
            OrderNo: orderno,
            payType: 1,
            Wxin_Code: weixincode,
            Authorization: uToken,
            iswx: true
          }
          {
            orderno: orderno,
            authcode: weixincode,
            
            paymenttypeid: 7, // 微信支付的 id 为7
            paysource: 4,
            inout: 1,
            returnurl: origin + "/payfail/" + orderno
          }

          C2C
          {
            orderno: orderno,
            authcode: weixincode,

            paymenttypeid: 7, // 微信支付的 id 为7
            paysource: _.paysource,
            inout: 1,
            returnurl: origin + "/sneaker/payResult/" + orderno
          }
         */
        let returnurl =
          wl.origin +
          (isMall ? "/payjump/" : "/sneaker/payResult/") +
          orderno +
          "?ut=" +
          uToken;
        let payParam = {},
          api;

        if (isMall) {
          api = oldPrepay;

          payParam = {
            orderno,
            paytype: 1,
            wxin_code: code,
            authorization: uToken,
            iswx: true
          };
        } else {
          api = H5Prepay;

          payParam = {
            orderno,
            authcode: code,
            paymenttypeid: 7, // 微信支付的 id 为7
            paysource: state,
            inout: 1,
            returnurl
          };
        }

        api(payParam)
          .then(res => {
            var wx_param;
            if (res && res.wx_payparam) {
              // "{"timeStamp":"1552117842355","_package":"prepay_id=wx091550426220298e6a1db25e3756083194","paySign":"CA7A5E884F8136D272CE853BDBC4B7F7","appId":"wxef296596d9e16189","signType":"MD5","nonceStr":"5ac3c3910c0a4f1ba14a199f9224dee8"}"

              wx_param = JSON.parse(res.wx_payparam);
              wx_param = {
                appid: wx_param.appId,
                timestamp: wx_param.timeStamp,
                noncestr: wx_param.nonceStr,
                package: wx_param._package,
                signtype: wx_param.signType,
                paysign: wx_param.paySign
              };
            } else wx_param = res;
            // var wx_param = res.wx_payparam || res;
            // alert("wx pay param: " + JSON.stringify(wx_param));

            // if (_.$root.ISIOS) {
            if (typeof WeixinJSBridge === "undefined") {
              if (dom.addEventListener) {
                dom.addEventListener(
                  "WeixinJSBridgeReady",
                  _.onBridgeReady(wx_param, orderno, uToken, isMall),
                  false
                );
              } else if (dom.attachEvent) {
                dom.attachEvent(
                  "WeixinJSBridgeReady",
                  _.onBridgeReady(wx_param, orderno, uToken, isMall)
                );
                dom.attachEvent(
                  "onWeixinJSBridgeReady",
                  _.onBridgeReady(wx_param, orderno, uToken, isMall)
                );
              }
            } else {
              _.onBridgeReady(wx_param, orderno, uToken, isMall);
            }
            // } else {
            //   WxPay(wx_param, orderno, uToken, !isMall);
            // }
          })
          .catch(err => {
            alert("微信支付调起失败: " + JSON.stringify(err));

            console.error("PrePay error: ", err);
            // _.toast("微信支付调起失败~");

            // _.$router.replace(
            //   (isMall ? "/payfail/" : "/sneaker/payResult/") +
            //     orderno +
            //     "?ut=" +
            //     uToken
            // );
          });
      } else {
        _.toast("调起微信支付异常~");
        _.$router.go(-2);
      }
    },
    // 微信支付API
    onBridgeReady(wxparam, orderno, uToken, isMall) {
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
          // // 微信支付成功
          // if (res.err_msg == "get_brand_wcpay_request:ok")
          // // 微信支付失败或者取消支付
          // if (
          //   res.err_msg == "get_brand_wcpay_request:cancel" ||
          //   res.err_msg == "get_brand_wcpay_request:fail"
          // )

          // alert("getBrandWCPayRequest res: " + JSON.stringify(res));
          if (isMall) {
            // B2C
            window.location =
              window.location.origin + "/payjump/" + orderno + "?ut=" + uToken;
          } else {
            // C2C
            window.location =
              window.location.origin +
              "/sneaker/payResult/" +
              orderno +
              "?ut=" +
              uToken;
          }
        }
      );
    }
  }
};
</script>
