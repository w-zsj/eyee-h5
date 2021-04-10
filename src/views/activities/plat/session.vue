<template>
  <div class="session">
    <div class="banner" @click="bycakey">
      <img src="https://files.eyee.com/mcdn/img/plat/ses_banner.png" alt />
    </div>
    <div class="conten">
      <div class="bus flex-between" v-for="(item,index) in business" :key="index">
        <div class="shop" @click="tobusiness(item.businessid)">
          <img v-lazy="item.logo" alt />
        </div>
        <div class="prod flex-col flex-between">
          <img
            v-lazy="sub.pic"
            alt
            v-for="(sub,indx) in item.list"
            :key="indx"
            @click="toproddetail(sub.id)"
          />
        </div>
      </div>
    </div>
    <div class="footer">
      <img src="https://files.eyee.com/mcdn/img/plat/ses_footer.png" alt />
    </div>
    <!-- <div>领券中心</div> -->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { GetCouponByCdKey } from "@/common/api/marketing";
let _loader;
export default {
  data() {
    return {
      business: [
        {
          businessid: "c5fbd732c0de4fbf87f0b7c79b91c168",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus0.png",
          list: [
            {
              id: "6346a21ed5e6449e8fe2e05bc7eae85c",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus0_0.png"
            },
            {
              id: "0a3deee4fa1a4833b8cc6bbefa67afd1",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus0_1.png"
            }
          ]
        },
        {
          businessid: "1d065fe85fee4cf3ac3e60081741351e",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus1.png",
          list: [
            {
              id: "1d67ac926fba470d90c61f9da14f924b",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus1_0.png"
            },
            {
              id: "9fda208ed4614487b8ecab2a040bbd85",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus1_1.png"
            }
          ]
        },
        {
          businessid: "629c036bcd934e64ad53f8d6bb789db9",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus2.png",
          list: [
            {
              id: "fbcb22f19604416baad6e55414bf4a63",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus2_0.png"
            },
            {
              id: "b439d5531b01493a84e1d4af531bac3a",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus2_1.png?c=1"
            }
          ]
        },
        {
          businessid: "96de728e097a45828cb715ee132a4b4a",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus3.png",
          list: [
            {
              id: "fb25fafe476745f191ce672484ae8d9d",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus3_0.png"
            },
            {
              id: "5f98805cc9a74c3ea79f38729ab6b2d0",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus3_1.png?c=1"
            }
          ]
        },
        {
          businessid: "7a749b8ea86b4fe9b05913d3147bace0",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus4.png",
          list: [
            {
              id: "d22b96d2257144bd966585a84c36a70b",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus4_0.png"
            },
            {
              id: "ca287217a30c4b2ebe87e9994dc6fe8e",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus4_1.png"
            }
          ]
        },
        {
          businessid: "7a63a0aa9eca441f964e6f21890a919f",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus5.png",
          list: [
            {
              id: "9081b17f37734c6282d8b43019022695",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus5_0.png?c=1"
            },
            {
              id: "67c0483d09df44d1a068a9d61d60d705",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus5_1.png"
            }
          ]
        },
        {
          businessid: "e21ed0b35bc14e1ebab35b5a7cfb6578",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus6.png",
          list: [
            {
              id: "2751c3ce403a4aca80e3cf2a28dd6f31",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus6_0.png"
            },
            {
              id: "607de61d93024498b2dd99263b0b146c",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus6_1.png"
            }
          ]
        },
        {
          businessid: "205a37deaee146fa8fd2eefe94ef37b4",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus7.png",
          list: [
            {
              id: "3d8db48e34514c80afc4f172cf4af5cc",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus7_0.png"
            },
            {
              id: "b4e3667a62054b8ba82b8f7674af1c00",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus7_1.png"
            }
          ]
        },
        {
          businessid: "fbca90df0f5c41b0b33c4c75a929cf0f",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus8.png",
          list: [
            {
              id: "b695d126905548398d30b3b68a5d3c2c",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus8_0.png"
            },
            {
              id: "71d0b6b361284e0da79a7da77302f1e0",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus8_1.png"
            }
          ]
        },
        {
          businessid: "13033969306445719fdde1df65922dc6",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus9.png",
          list: [
            {
              id: "fe4d581a89e0468ea37429450ca32063",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus9_0.png"
            },
            {
              id: "b2f512ad051848599a8781f7974a0797",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus9_1.png"
            }
          ]
        },
        {
          businessid: "a707ce2e0c6547df8baa546e9f3d9e51",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus10.png",
          list: [
            {
              id: "e2817a36dcf6497e9774495ec44c0374",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus10_0.png"
            },
            {
              id: "6360adc22d554fbe8dd9f94d916e4ea2",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus10_1.png"
            }
          ]
        },
        {
          businessid: "9c1a4b65105c47e8947b097c13e3716b",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus11.png",
          list: [
            {
              id: "c21b3366f80148ff974461a3315d490b",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus11_0.png"
            },
            {
              id: "1194045bd9984346a9c45bfb0ddf449c",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus11_1.png"
            }
          ]
        },
        {
          businessid: "6c71ce7750294d1e96637f546b1b56e5",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus12.png",
          list: [
            {
              id: "29dc6cf88dc24b4d81eb9cef285eadc7",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus12_0.png"
            },
            {
              id: "0153cc5c40af4a83962bef83bf2b2ff9",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus12_1.png"
            }
          ]
        },
        {
          businessid: "f4f2369a683e4c318c081d677fdc0cce",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus13.png",
          list: [
            {
              id: "018ff46c5b2745ca9fdadf20d7064599",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus13_0.png"
            },
            {
              id: "6747d8a690024edf8e164d3626b936ac",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus13_1.png"
            }
          ]
        },
        {
          businessid: "aa70965da7764b4b9d8a6893fa849663",
          logo: "https://files.eyee.com/mcdn/img/plat/ses_bus14.png",
          list: [
            {
              id: "94d43072ca244a76bdc7f28ca038e914",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus14_0.png"
            },
            {
              id: "0e926984b78b48bd8835b0303c2fbf29",
              pic: "https://files.eyee.com/mcdn/img/plat/ses_bus14_1.png"
            }
          ]
        }
      ]
    };
  },
  beforeCreate: function() {
    document.body.classList.add("add_bg");
  },
  beforeDestroy: function() {
    document.body.classList.remove("add_bg");
  },
  computed: {
    ...mapGetters({ user: "userInfo", selectCountryCode: "selectCountryCode" }),
    uid() {
      return !!(this.user && this.user.uid);
    }
  },
  watch: {
    "window.congJSON": function(n, o) {
      console.log(n);
    }
  },
  mounted() {
    let _ = this;
    _loader = _.$loader("加载中...");
    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json).then(res => {
          _.getrecord();
        });
      } else _.toast("登录失败~");
    };
    setTimeout(() => {
      _loader.close();
    }, 1000);
    if (!_.$root.ISWX && !_.$root.ISAPP) {
      _.confirm({
        msg: "请在【斗牛DoNew】APP内操作?",
        okText: "立即前往",
        cancelBtn: 1,
        ok: () => {
          _.openAppClient();
          setTimeout(() => {
            _.$router.replace("/loadapp");
          }, 800);
        }
      });
    }
    let domain = _.$root.isdebug
      ? "http://qzone.eyee.com/"
      : "http://m.eyee.com/";
    if (_.$root.ISAPP) {
      _.javascriptBridge({
        name: "getAppActivityShareContent",
        params: {
          sharecontent:
            "1211斗牛周年庆，抢满2000-1211元周年庆神券，原价抽TS x AJ6，专享潮品6折封顶！",
          sharepicurl: "https://files.eyee.com/mcdn/img/plat/main_share.png",
          shareurl: domain + `plat/main`,
          sharetitle: "斗牛周年庆，专享潮品6折封顶！",
          callbackname: "",
          hideshareicon: false
        }
      });
    } else
      _.initShare({
        info: {
          title: "斗牛周年庆，专享潮品6折封顶！",
          desc:
            "1211斗牛周年庆，抢满2000-1211元周年庆神券，原价抽TS x AJ6，专享潮品6折封顶！",
          img: "https://files.eyee.com/mcdn/img/plat/main_share.png",
          url: domain + `plat/main`
        }
      });
  },
  methods: {
    tobusiness(businessid) {
      let _ = this;
      if (_.$root.ISAPP)
        _.javascriptBridge({
          name: "gotoAppOnlineShopHomePage",
          params: { businessid }
        });
      else {
        _.$router.push(`/shop/shopdetail/${businessid}`);
      }
    },
    toproddetail(productid) {
      let _ = this;
      if (_.$root.ISAPP)
        _.javascriptBridge({
          name: "gotoAppProductDetailPage",
          params: { productid }
        });
      else {
        _.$router.push(`/productDetail/${productid}`);
      }
    },
    bycakey() {
      let _ = this;
      _.checkLogin(() => {
        GetCouponByCdKey({ cdkey: "A6mzrn" })
          .then(res => _.toast("领取成功"))
          .catch(e => {
            _.toast((e && e.msg) || "");
          });
      });
    },
    checkLogin(call) {
      let _ = this;
      if (_.uid) {
        call();
      } else {
        _.confirm({
          title: "登录提示",
          msg: "请登录后重试~",
          okText: "前往登录",
          cancelText: "容我想想",
          ok: () => {
            if (ENV.ua.eyee) {
              _.javascriptBridge({
                name: "callAppLoginPage",
                params: { callbackname: "_appLoginCallback" }
              });
            } else if (ENV.ua.mini) {
              wx.miniProgram.navigateTo({
                url: "/pages/other/bind"
              });
            } else _.$router.push("/login");
          }
        });
      }
    },
    doShare() {
      let _ = this;
      /**
       * callAppDirectlyShare
        {
          "sharecontent":"分享内容",
          "sharepicurl":"分享图片地址",
          "shareurl":"分享链接",
          "sharetitle":"分享标题",
          "callbackname":"分享结果回调方法名",
          "xcxurl":"小程序的分享地址",
          "xcxicon":"小程序的封面图",
          "xcxid":"小程序的原始id",
          "type":"分享内容内型，1：是分享图片，2：是分享H5链接",
          "platform":"分享平台，1：是分享到朋友圈，2：是分享给微信好友"
        }
       */
      _loader = _.$loader("正在调起分享···");
      _.javascriptBridge({
        name: "callAppDirectlyShare",
        params: {
          sharecontent: "",
          sharepicurl: "",
          shareurl: "",
          type: 2,
          platform: 2,
          callbackname: "_APPShareBack"
        }
      });
      setTimeout(() => {
        _loader && _loader.close();
      }, 3000);
    }
  }
};
</script>
<style>
.add_bg {
  background: #85c6c0;
}
</style>
<style scoped lang="scss">
.session {
  background: #85c6c0;
  min-height: 100vh;
  img {
    display: block;
  }
  .conten {
    padding: 0 6.266vw 0 5.7333vw;
    background: url("https://files.eyee.com/mcdn/img/plat/ses_ling.png") 0 0;
    background-size: 100% auto;
    padding-bottom: 5.2vw;
    position: relative;
    min-height: 50vh;
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 5.2vw;
      background: url("https://files.eyee.com/mcdn/img/plat/ses_bor.png") left
        bottom no-repeat;
      background-size: 100% auto;
      left: 0;
      bottom: -1px;
    }
    .bus {
      margin: 0 1.6vw 3.2vw 1.6vw;
      padding: 2.4vw;
      background: url("https://files.eyee.com/mcdn/img/plat/shop_bg.png") 0 0
        no-repeat;
      background-size: 100% auto;
      min-height: 36vw;
      .shop {
        width: 39.066vw;
        margin-right: 2.4vw;
      }
      .prod {
        width: 39.066vw;
        img {
          &:first-child {
            margin-bottom: 2.4vw;
          }
        }
      }
    }
  }
}
</style>