<template>
  <div class="cspc">
    <template v-if="carts.length>0">
      <!-- 购物车 -->
      <ul class="cspc-carts">
        <li class="flex-btwn cspc-cart" v-for="(ci, cIdx) in carts" :key="'cart'+cIdx">
          <div class="ci-img">
            <img :src="(!!ci.colorimg?ci.colorimg:ci.mainpic)|https" alt>
          </div>
          <div class="flex-col flex-btwn ci-info">
            <p class="ellipsis-2 ci-name">{{ci.productname}}</p>
            <p class="ci-attr">{{ci.color}}，{{ci.size}}，×{{ci.count}}</p>
            <p class="flex-btwn ci-price">
              <span class="font-price">¥{{dealPrice(ci.saleprice,ci.specialprice)}}</span>
              <button v-if="!joined" @click="delCart(cIdx)">删除</button>
            </p>
          </div>
        </li>
      </ul>

      <!-- 底部悬浮 -->
      <v-delay :delay="600" class="fix-footer">
        <p class="cspc-total">
          <span>共{{calc.count}}件，总计：</span>
          <span>¥{{calc.total}}</span>
        </p>
        <div v-if="joined" class="cspc-btn" @click="showShareModal">
          <img src="/static/imgs/cspc/btn-full.png" alt>
          <button>分享我的购物车海报</button>
        </div>
        <div class="flex-around cspc-btns" v-else>
          <button @click="goMall">再逛逛</button>
          <div class="flex-aic" @click="doClear">
            <img src="/static/imgs/cspc/btn.png" alt>
            <button>帮我清空</button>
          </div>
        </div>
      </v-delay>

      <!-- 分享海报弹框 -->
      <div class="poster-share" v-show="showShare" @click="closeShare">
        <div>
          <img v-if="posterUrl" :src="posterUrl" alt>
        </div>
        <div class="poster-sharebtn" @click.stop="doShare">
          <img src="/static/imgs/share-wx-pyq.png" alt>
          <p>分享到微信朋友圈</p>
        </div>
      </div>

      <!-- 生成海报承载元素 -->
      <div class="draw-layer" id="poster">
        <div class="poster-main">
          <img src="/static/imgs/cspc/poster-bg.png" alt>
          <div>
            <div class="flex-btwn">
              <div class="poster-user">
                <div class="poster-avatar">
                  <img src="/static/imgs/cspc/border-circle.png" alt>
                  <img :src="user.imageurl|https" alt>
                </div>
                <div class="poster-name">
                  <img src="/static/imgs/cspc/poster-flag.png" alt>
                  <span>{{posterTitle}}</span>
                </div>
              </div>
              <div class="poster-total">
                <img src="/static/imgs/cspc/poster-arrow.png" alt>
                <span>我的购物车已满</span>
                <span class="font-price">¥{{totalprice|currency}}</span>
              </div>
            </div>
            <div class="poster-carts">
              <img src="/static/imgs/cspc/poster-border.png" alt>
              <div
                class="flex-wrap flex-center"
                :class="{four:posterCart.length==4,double:posterCart.length==2,single:posterCart.length==1}"
              >
                <div
                  class="poster-cart"
                  v-for="(pci, pcIdx) in posterCart"
                  :key="'posterCart'+pcIdx"
                >
                  <img src="/static/imgs/cspc/poster-rect.png" alt>
                  <img :src="(!!pci.colorimg?pci.colorimg:pci.mainpic)|https" alt>
                  <span class="font-price">¥{{dealPrice(pci.saleprice,pci.specialprice)}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img src="/static/imgs/cspc/poster-footer.png?r=1" alt>
        <!-- <canvas id="createBanner"></canvas> -->
      </div>
      <div class="draw-block"></div>
    </template>
    <template v-else>
      <div class="cspc-empty">
        <img src="/static/imgs/cspc/empty.png" alt>
        <p>清空十万购物车触手可及，岂容错过？</p>
        <div class="cspc-btn" @click="goMall">
          <img src="/static/imgs/cspc/btn.png" alt>
          <button>去扫货</button>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { Indicator } from "mint-ui";

import { mapGetters } from "vuex";

import { GroupList as CartList, Delete as CartDel } from "@/common/api/cart";
import { Upload } from "@/common/api/user";
import {
  GetPosterStatus,
  GetPosterUrl,
  SetPosterUrl,
  SetShareStatus,
  CreateSnapshot,
  GetSnapshot
} from "@/utils/api/activities";

import { html2canvas } from "@/utils/html2canvas.js";

/*
  0＜总价≤50000品味描述：
  Skr星人
  街头新秀

  50000＜总价≤70000品味描述：
  精致青年
  街头社会人
  时尚点缀者

  70000＜总价≤80000品味描述：
  穿搭小能手
  流啤货王
  明日之星

  80000＜总价≤90000品味描述
  潮流新秀
  扫货鬼才
  价值缔造者
  街头狠人

  90000＜总价≤100000品味描述：
  潮流老炮
  斗牛矿主
  奢华体验家
  潮流巨星
  至臻品位家

  100000以上品味描述：
  街头王者
*/
const titles = [
  { min: 0, max: 50000, txt: ["Skr星人", "街头新秀"] },
  { min: 50000, max: 70000, txt: ["精致青年", "街头社会人", "时尚点缀者"] },
  {
    min: 70000,
    max: 80000,
    txt: ["穿搭小能手", "流啤货王", "明日之星"]
  },
  {
    min: 80000,
    max: 90000,
    txt: ["潮流新秀", "扫货鬼才", "价值缔造者", "街头狠人"]
  },
  {
    min: 90000,
    max: 100000,
    txt: ["潮流老炮", "斗牛矿主", "奢华体验家", "潮流巨星", "至臻品位家"]
  },
  {
    min: 100000,
    max: Infinity,
    txt: [
      "街头王者",
      "天选之人",
      "挥金如土",
      "绅士名流",
      "时尚大咖",
      "头号玩家"
    ]
  }
];

export default {
  name: "ClearShoppingCartInfo",
  data() {
    return {
      joined: false,
      carts: [],
      posterUrl: "",

      totalprice: 0,
      posterTitle: "",

      showShare: false,
      doDraw: false
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    calc() {
      let _ = this,
        { carts } = _,
        count = 0,
        total = 0;
      carts.map(i => {
        count += i.count;
        total += _.dealPrice(i.saleprice, i.specialprice) * i.count;
      });
      total = (total * 100).toFixed() / 100;
      return { count, total };
    },
    posterCart() {
      let _ = this,
        { carts } = _;
      let list = carts
        .sort(
          (a, b) =>
            _.dealPrice(b.saleprice, b.specialprice) -
            _.dealPrice(a.saleprice, a.specialprice)
        )
        .slice(0, 6);
      return list;
    }
  },
  beforeRouteLeave(to, from, next) {
    let _ = this,
      { showShare } = _;
    if (showShare) {
      _.closeShare();
      next(false);
    } else next();
  },
  beforeMount() {
    let _ = this;

    // 非APP内重定向到 活动规则页
    if (!_.$root.ISAPP) _.$router.replace("/cspc/rule");

    // set app share
    _.setToolBar({
      title: "清空购物车",
      showshoppingcarticon: false
    });
    _.setShare();

    // _.getStatus();
    _.getProducts();

    document.addEventListener("visibilitychange", function() {
      if (document.visibilityState === "hidden") Indicator.close();
    });
  },
  mounted() {
    let _ = this;
    // hide app share
    window._shareCallBack = function(res, via) {
      // _.toast("回调的参数值" + JSON.stringify(res));
      Indicator.close();
      if (res == 1) _.setShareStatus();
    };
  },
  methods: {
    setShare() {
      let _ = this;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "getAppActivityShareContent",
          params: {
            // sharetitle: "「斗牛」免费帮你清空十万购物车",
            // sharecontent:
            //   "十万任你挑，还有Supreme等潮流大牌低至5折，满399再减100等福利活动！助你引爆新年满满欧气！",
            // sharepicurl: window.location.origin + "/static/imgs/cspc/share.png",
            // shareurl: window.location.origin + "/cspc/rule",
            // hideshareicon: false
            hideshareicon: true
          }
        });
      }
    },
    dealPrice(sale, special) {
      return special > 0 && special != sale ? special : sale;
    },
    // getStatus() {
    //   let _ = this;
    //   GetPosterStatus()
    //     .then(res => {
    //       console.log("GetPosterStatus res: ", res);
    //       if (res && res.isgenerated == 1) {
    //         _.joined = true;
    //         _.getPosterUrl();
    //       }
    //       _.getProducts();
    //     })
    //     .catch(e => {
    //       console.error("GetPosterStatus error: ", e);
    //     });
    // },
    getProducts() {
      let _ = this,
        { joined } = _;
      // if (joined) {
      //   GetSnapshot()
      //     .then(res => {
      //       console.log("GetSnapshot res: ", res);
      //       _.carts = res.items || [];
      //     })
      //     .catch(e => {
      //       console.error("GetSnapshot error: ", e);
      //     });
      // } else {
      CartList()
        .then(res => {
          console.log("CartList res: ", res);
          _.carts = _.cartInfo(res);
        })
        .catch(e => {
          console.error("CartList error: ", e);
        });
      // }
    },
    cartInfo(list) {
      let carts = [];
      if (list && list.length > 0) {
        list.forEach(l => {
          l.items.forEach(i => {
            if (i.isok) carts.push(i);
          });
        });
      }
      return carts.slice(0, 99);
    },
    getPosterUrl() {
      let _ = this;
      GetPosterUrl()
        .then(res => {
          console.log("GetPosterUrl res: ", res);
          if (res && res.posterurl) _.posterUrl = res.posterurl;
          if (res && res.totalprice > 0) _.totalprice = res.totalprice;
        })
        .catch(e => {
          console.error("GetPosterUrl error: ", e);
        });
    },
    delCart(idx) {
      let _ = this,
        unit = _.carts[idx];
      CartDel({ id: unit.id, productitemid: unit.productitemid })
        .then(res => {
          console.log("CartDel res: ", res);
          _.toast("删除成功");
          _.carts.splice(idx, 1);
        })
        .catch(e => {
          console.error("CartDel error: ", e);
          _.toast("删除失败");
        });
    },
    goMall() {
      let _ = this;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppMallCenterPage"
        });
      } else _.toast("请在斗牛APP中参与活动~");
    },
    dealTitle(price, cb = () => {}) {
      let _ = this,
        title = titles.find(i => i.min < price && i.max >= price);
      console.log("dealTitle: ", price, title);
      if (title && title.txt) {
        _.posterTitle =
          title.txt[Math.round(Math.random() * (title.txt.length - 1))];

        setTimeout(() => {
          cb();
        }, 30);
      }
    },
    doClear() {
      let _ = this;
      CreateSnapshot()
        .then(res => {
          console.log("CreateSnapshot res: ", res);
          if (res && res.totalprice > 0) {
            _.totalprice = res.totalprice;

            _.doDraw = true;
            _.dealTitle(res.totalprice, _.draw);

            // _.joined = true;
          }
        })
        .catch(e => {
          _.toast("操作失败");
          console.error("CreateSnapshot error: ", e);
        });
    },
    draw() {
      let _ = this;
      _.loading("生成海报中···");

      let $layer = document.getElementById("poster");
      html2canvas($layer, { useCORS: true }).then(canvas => {
        // $layer.appendChild(canvas);
        let dataUrl = canvas.toDataURL("image/jpeg");
        // console.log("canvas to data url: ", dataUrl);

        _.loading();

        _.uploadImg(dataUrl);
      });
    },
    uploadImg(data) {
      let _ = this;
      _.loading("海报上传中···");
      Upload({ stream: data.split(",")[1] })
        .then(res => {
          console.log("Upload res: ", res);
          if (res && res.url) {
            _.setPosterUrl(res.url);
          } else _.toast("海报上传失败~");
          _.loading();
        })
        .catch(e => {
          console.error("Upload error: ", e);
          _.toast("海报上传失败~");
          _.loading();
        });
    },
    setPosterUrl(url) {
      let _ = this;
      url = url.replace("http://", "https://");
      _.posterUrl = url;
      SetPosterUrl(url)
        .then(res => {
          console.log("SetPosterUrl res: ", res);
          _.showShareModal();
        })
        .catch(e => {
          console.error("SetPosterUrl error: ", e);
        });
    },
    showShareModal() {
      let _ = this;

      console.log("showShareModal:", _.posterUrl);

      if (!!_.posterUrl) {
        _.showShare = true;

        // IOS下双重保险关闭提示蒙层, 18s
        if (_.$root.ISIOS) {
          _.setShareStatus();

          setTimeout(_.loading, 18000);
        }
      } else {
        _.doDraw = true;
        _.dealTitle(_.totalprice, _.draw);
      }
    },
    setShareStatus() {
      SetShareStatus()
        .then(res => {
          console.log("SetShareStatus res: ", res);
        })
        .catch(e => {
          console.error("SetShareStatus error: ", e);
        });
    },
    loading(title) {
      if (title) {
        Indicator.open({
          text: title,
          spinnerType: "triple-bounce" // 'snake''fading-circle''double-bounce''triple-bounce'
        });
      } else Indicator.close();
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
      if (_.$root.ISAPP) {
        _.loading("正在调起微信分享···");
        _.javascriptBridge({
          name: "callAppDirectlyShare",
          params: {
            sharepicurl: _.posterUrl,
            type: 1,
            platform: 1,
            callbackname: "_shareCallBack"
          }
        });
      } else _.toast("请在斗牛APP中参与活动~");
    },
    closeShare() {
      let _ = this,
        $shareImgBox = document.querySelector(".poster-share div");

      _.loading();

      // _.confirm({
      //   msg: "确定要放弃成为锦鲤的机会吗？",
      //   okText: "分享成为锦鲤",
      //   cancelText: "我是壕不需要",
      //   ok: _.doShare,
      //   cancel: () => {
      //     $shareImgBox.scrollTo(0, 0);
      //     $shareImgBox.scrollTop = 0;

      _.showShare = false;
      // }
      // });
    }
  },
  filters: {
    currency(val) {
      if (val && val != null) {
        let suffix = "";
        if (val > 100000) {
          suffix = "w";
          val = Number((val / 10000).toFixed(2));
        }

        val = String(val);
        var left = val.split(".")[0],
          right = val.split(".")[1];
        right = right ? "." + right.substr(0, 2) : "";
        var temp = left
          .split("")
          .reverse()
          .join("")
          .match(/(\d{1,3})/g);
        return (
          (Number(val) < 0 ? "-" : "") +
          temp
            .join(",")
            .split("")
            .reverse()
            .join("") +
          right +
          suffix
        );
      } else if (val === 0) return "0";
      else return "";
    }
  }
};
</script>
<style scoped>
.cspc {
  background-color: #f5f5f5;
  background-image: url("/static/imgs/cspc/top-bg.png");
  background-repeat: no-repeat;
  background-size: 100% auto;
  padding-top: 36px;
  min-height: 95vh;
}
.cspc img {
  display: block;
}

.cspc-empty {
  text-align: center;
  padding-top: 15vh;
}
.cspc-empty > img {
  width: 36.3%;
  margin: 0 auto 30px;
}
.cspc-empty p {
  padding: 0 2%;
  font-size: 17px;
  font-weight: 400;
  color: #999;
  line-height: 24px;
}
.cspc-empty div {
  width: 60%;
  left: 20%;
  margin-top: 50px;
}

.cspc-carts {
  padding: 12px 12px 90px;
}
.cspc-cart {
  background: #fff;
  border-radius: 7px;
  padding: 10px;
  margin-bottom: 12px;
}
.ci-img {
  position: relative;
  width: 26%;
  padding-bottom: 26%;
}
.ci-img img {
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
}
.ci-info {
  width: 71.5%;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
}
.ci-name {
  color: #333;
}
.ci-attr {
  color: #999;
}
.ci-price span {
  font-size: 14px;
  font-weight: 500;
  color: #ff6828;
}
.ci-price button {
  font-size: 10px;
  color: #999;
  letter-spacing: 1px;
}

.cspc-btn {
  position: relative;
  width: 100%;
  padding: 5px 15px;
}
.cspc-btn,
.cspc-btns {
  border-top: 1px solid #f2f2f2;
}
.cspc-empty .cspc-btn {
  border: none;
}
.cspc-btn button,
.cspc-btns div button {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}
.cspc-btns {
  padding: 5px;
}
.cspc-btns > button {
  width: 30.13%;
  line-height: 40px;
  font-size: 16px;
  font-weight: 500;
  color: #7a4b9a;
  border: 1px solid;
  border-radius: 20px;
  background: none;
  outline: none;
}
.cspc-btns > div {
  position: relative;
  width: 60%;
  line-height: 40px;
}
.cspc-total {
  line-height: 24px;
  background: #fff;
  text-align: right;
  padding: 5px 10px;
}
.cspc-total span:first-of-type {
  font-size: 12px;
  font-weight: 400;
  color: #333;
}
.cspc-total span:last-of-type {
  font-size: 17px;
  font-weight: 600;
  color: #ff6828;
}

.draw-layer {
  position: fixed;
  width: 100vw;
  /* height: 100vh;
  pointer-events: none; */
  top: 0;
  z-index: -99;
}
.draw-block {
  position: fixed;
  width: 100vw;
  height: 300vh;
  top: -100vh;
  left: 0;
  z-index: -9;
  background: #f5f5f5;
}

.poster-main {
  position: relative;
  margin-bottom: -2px;
  z-index: 2;
}
.poster-main > div {
  position: absolute;
  top: 34%;
}
.poster-user {
  width: 30%;
  padding: 0 3.6%;
  margin-top: -15px;
}
.poster-avatar {
  position: relative;
  z-index: 1;
}
.poster-avatar img:last-of-type {
  position: absolute;
  top: 50%;
  left: 6%;
  width: 88%;
  transform: translate(0, -50%);
  border-radius: 50%;
}
.poster-name {
  position: relative;
  color: #fff;
  font-size: 17px;
  font-weight: bolder;
  font-style: italic;
  width: 85%;
  margin: -95% auto 0;
  z-index: 1;
}

.poster-name span {
  position: absolute;
  top: 85px;
  left: 50%;
  transform: translate(-50%, 0);
  white-space: nowrap;
}
.poster-total {
  position: relative;
  width: 70%;
}
.poster-total span {
  position: absolute;
  left: 20%;
  color: #fff;
}
.poster-total span:first-of-type {
  top: 15px;
  font-size: 18px;
  font-weight: 600;
}
.poster-total span:last-of-type {
  top: 32px;
  font-size: 48px;
  font-weight: 900;
  letter-spacing: 1px;
}
.poster-carts {
  position: relative;
  padding: 0 5px;
}
.poster-carts > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 5% 0;
}

.single .poster-cart {
  transform: scale(2);
}
.double .poster-cart {
  transform: scale(1.5);
  margin: 0 10%;
}
.four .poster-cart {
  margin: 0 6%;
}
.poster-cart {
  position: relative;
  width: 24%;
  margin: 0 3.2%;
  padding-bottom: 24%;
}
.poster-cart > img:first-of-type {
  position: absolute;
  z-index: 1;
}
.poster-cart > img:last-of-type {
  position: absolute;
  top: 4%;
  left: 5%;
  width: 91%;
}
.poster-cart span {
  z-index: 3;
  position: absolute;
  left: 5%;
  bottom: 0;
  width: 90%;
  line-height: 32px;
  font-size: 18px;
  font-weight: bolder;
  color: #fff;
  text-align: center;
}

.poster-share {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(241, 241, 241, 0.8);
}
.poster-share div:first-of-type {
  overflow-y: scroll;
  height: calc(100% - 85px);
}
.poster-share .poster-sharebtn {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  background: #fff;
  border-radius: 12px 12px 0 0;
  padding: 15px;
}
.poster-sharebtn img {
  width: 40px;
  margin: 0 auto 10px;
}
.poster-sharebtn p {
  font-size: 11px;
  font-weight: 400;
  color: #333;
  line-height: 16px;
}
</style>
