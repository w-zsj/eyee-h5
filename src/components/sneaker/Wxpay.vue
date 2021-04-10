<template></template>
<script>
import { mapGetters } from "vuex";
import { H5PrePay as oldPrepay } from "@/common/api/order";
import { H5Prepay } from "@/common/api/sneaker";
import { WxPay, WxPaySneaker } from "@/common/api/wxPay";

const ls = window.localStorage;
const dom = window.document;
var tryone = false;
var wxInterval = null;

export default {
  data() {
    return {
      source: 1,
      dataid: 0,
      successUrl: "",
      failUrl: "",

      params: {},
    };
  },
  mounted() {
    let _ = this;
    if (_.user.token) {
      // let marginInfo = JSON.parse(ls.getItem('c2cMarginInfo'))
      // ls.removeItem('c2cMarginInfo')
      // this.source = marginInfo.source
      // this.dataid = marginInfo.dataid
      // this.successUrl = marginInfo.successUrl
      // this.failUrl = marginInfo.failUrl

      _.params = JSON.parse(ls.getItem("c2cMarginInfo")) || {};
      console.log("opt--", _.params);
      ls.removeItem("c2cMarginInfo");
      if (_.params.orderno) _.wx_code();
    }
  },

  computed: {
    ...mapGetters({ user: "userInfo" }),
  },
  methods: {
    // 微信静默登录返回code进行支付
    wx_code() {
      let _ = this,
        { params } = _,
        orderno = params.orderno,
        isBuy = !isNaN(params.paysource),
        isMall = params.paysource == 4,
        lotter = params.paysource == 27;
      var urlLink = window.location.href;
      // alert("lotter" + lotter);
      if (urlLink.indexOf("code") > 0) {
        var weixincode = urlLink.split("code=")[1].split("&state")[0],
          uToken = JSON.parse(ls.getItem("currentUser")).token;
        let origin = window.location.origin;

        let opt, api;
        if (!isBuy) {
          api = H5Prepay;

          opt = {
            orderno: 0,
            paymenttypeid: 7,
            paysource: 1,
            authcode: weixincode,
            paysourceitem: params.source,
            inout: 1,
            returnurl: origin + params.successUrl,
          };
          if (params.dataid) {
            opt.dataid = params.dataid;
          }
        } else if (isMall) {
          api = oldPrepay;

          opt = {
            orderno,
            paytype: 1,
            wxin_code: weixincode,
            authorization: uToken,
            iswx: true,
          };
        } else if (lotter) {
          api = H5Prepay;
          opt = {
            authcode: weixincode,
            paymenttypeid: 7, // 微信支付的 id 为7
            paysource: params.paysource,
            dataid: params.dataid || "",
            returnurl: origin + "/activity/luckDraw",
          };
        } else {
          api = H5Prepay;

          opt = {
            orderno,
            authcode: weixincode,
            paymenttypeid: 7, // 微信支付的 id 为7
            paysource: params.paysource,
            inout: 1,
            returnurl: origin + "/sneaker/payResult/" + orderno,
          };
          if (params.luckDraw) {
            // 抽抽乐标识提货结算标识
            opt.returnurl = `${opt.returnurl}&luckDraw=1`;
          }
        }

        // let opt = {
        //   orderno: 0,
        //   paymenttypeid: 7,
        //   paysource: 1,
        //   authcode: weixincode,
        //   paysourceitem: _.source,
        //   inout: 1,
        //   returnurl: origin + _.successUrl,
        // }
        // if(_.dataid){
        //   opt.dataid = _.dataid
        // }
        // alert("opt--" + JSON.stringify(opt));
        api(opt)
          .then((res) => {
            // alert("res--" + res);
            console.log("prepay param: ", res);
            // var wx_param = res;
            var wx_param;
            if (res && res.wx_payparam) {
              // "{"timeStamp":"1552117842355","_package":"prepay_id=wx091550426220298e6a1db25e3756083194","paySign":"CA7A5E884F8136D272CE853BDBC4B7F7","appId":"wxef296596d9e16189","signType":"MD5","nonceStr":"5ac3c3910c0a4f1ba14a199f9224dee8"}"
              // "{"appid":"wxef296596d9e16189","timestamp":"1552275860520","noncestr":"f634ffce3b494ee2b0ae0ff567878342","signtype":"MD5","paysign":"E2BA6A96CAF92839B5BBA688C750B421","package":"prepay_id=wx11114420760930e0abdff02e2609727654"}"

              wx_param = JSON.parse(res.wx_payparam);
              // wx_param = {
              //   appid: wx_param.appId,
              //   timestamp: wx_param.timeStamp,
              //   noncestr: wx_param.nonceStr,
              //   package: wx_param._package,
              //   signtype: wx_param.signType,
              //   paysign: wx_param.paySign
              // };
            } else wx_param = res;
            if (_.$root.ISIOS) {
              if (typeof WeixinJSBridge === "undefined") {
                if (dom.addEventListener) {
                  dom.addEventListener(
                    "WeixinJSBridgeReady",
                    _.onBridgeReady(
                      wx_param,
                      uToken,
                      orderno,
                      isBuy,
                      isMall,
                      lotter
                    ),
                    false
                  );
                } else if (dom.attachEvent) {
                  dom.attachEvent(
                    "WeixinJSBridgeReady",
                    _.onBridgeReady(
                      wx_param,
                      uToken,
                      orderno,
                      isBuy,
                      isMall,
                      lotter
                    )
                  );
                  dom.attachEvent(
                    "onWeixinJSBridgeReady",
                    _.onBridgeReady(
                      wx_param,
                      uToken,
                      orderno,
                      isBuy,
                      isMall,
                      lotter
                    )
                  );
                }
              } else {
                _.onBridgeReady(
                  wx_param,
                  uToken,
                  orderno,
                  isBuy,
                  isMall,
                  lotter
                );
              }
            } else {
              if (!isBuy) WxPaySneaker(wx_param, _.successUrl, _.failUrl);
              else WxPay(wx_param, orderno, uToken, !isMall);
            }
          })
          .catch((err) => {
            // alert("err--" + err);
            console.error(err);
            _.toast("支付调起失败: ", JSON.stringify(err));
            if (lotter) {
              window.location =
                window.location.origin + "/activity/purchaseTimes";
            } else if (!isBuy) {
              window.location = window.location.origin + _.failUrl;
            } else if (isMall) {
              // B2C
              window.location =
                window.location.origin +
                "/payfail/" +
                orderno +
                "?ut=" +
                uToken;
            } else {
              // C2C
              // window.location =
              //   window.location.origin +
              //   "/sneaker/payResult/" +
              //   orderno +
              //   "?ut=" +
              //   uToken;
            }
            // _.$router.go(-2);
          });
      }
    },
    // 微信支付API
    onBridgeReady(wxparam, uToken, orderno, isBuy, isMall) {
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: wxparam.appid, // 公众号名称，由商户传入
          timeStamp: wxparam.timestamp, // 时间戳，自1970年以来的秒数
          nonceStr: wxparam.noncestr, // 随机串
          package: wxparam.package,
          signType: wxparam.signtype, // 微信签名方式：
          paySign: wxparam.paysign, // 微信签名
        },
        (res) => {
          if (lotter) {
            window.location.origin + "/activity/luckDraw";
          } else if (!isBuy) {
            // 微信支付成功
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              window.location = window.location.origin + this.successUrl;
            } else if (
              res.err_msg == "get_brand_wcpay_request:cancel" ||
              res.err_msg == "get_brand_wcpay_request:fail"
            ) {
              // 微信支付失败或者取消支付
              window.location = window.location.origin + this.failUrl;
            }
          } else if (isMall) {
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
    },
  },
};
</script>
