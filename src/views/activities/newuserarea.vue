<template>
  <div class="new-area" v-if="hasdata==1">
    <loader-app class="load" ref="load" from="10" v-if="!$root.ISAPP">
      <img src="/static/img/bull/download_app.png?c=1" alt />
    </loader-app>
    <!-- 倒计时 -->
    <div class="coun flex-between" v-if="cardInfo&&cardInfo.validsecond>0">
      <div class="txt flex-center">
        <i class="icon"></i> 专享倒计时:
      </div>
      <div class="time flex-end">
        <span>{{counttimer.d}}</span>&nbsp;
        <i>天</i>&nbsp;&nbsp;&nbsp;
        <span>{{counttimer.h}}</span>&nbsp;
        <i>时</i>&nbsp;&nbsp;&nbsp;
        <span>{{counttimer.m}}</span>&nbsp;
        <i>分</i>
      </div>
    </div>
    <!-- banner -->
    <div class="banner">
      <img :src="banner" alt />
      <div class="rule" @click.stop="rule">活动规则</div>
    </div>
    <div class="content">
      <!-- 福利1 -->
      <div
        class="welfare"
        @click.stop="gotodetail(expirecoupon,1)"
        v-if="expirecoupon.newpeoplebanner"
      >
        <i class="icon"></i>
        <div class="title flex-center">免费体验卖尖货，卖出即可得奖励</div>
        <img :src="expirecoupon.newpeoplebanner" alt />
        <div
          class="validity-data flex-center"
          :class="{'over':expirecoupon.couponstatus!=1}"
          v-html="validityTxt"
        ></div>
      </div>
      <!-- 福利2 -->
      <div class="welfare fu" v-if="welfareinfo&&welfareinfo.length">
        <i class="icon"></i>
        <div class="title flex-center">新人专享折扣价，优先抢购潮流货</div>
        <div>
          <div class="go-pro flex-center" v-for="(item,index) in welfareinfo" :key="index+'fu'">
            <div class="p-img">
              <img
                :src="item.image||'https://files.eyee.com/Shop/system/main/ab34f6dcdb124d4c866c64572ed2b163.jpg'"
              />
            </div>
            <div class="flex-btwn">
              <div class="pnp flex-col flex-btwn">
                <div
                  class="p-name ellipsis-2"
                  style="-webkit-box-orient: vertical;"
                >{{item.productname}}</div>
                <div class="price">
                  <div class="mar-price">
                    市场价:
                    <i>￥{{item.marketprice}}</i>
                  </div>
                  <div class="new-price">新人价: ￥{{item.newuserprice}}</div>
                </div>
              </div>
              <div class="buy flex-end flex-col">
                <div
                  class="btn flex-center"
                  :class="item.calssbtn"
                  @click.stop="pay(item,index)"
                >{{item.welfareTwoTxt}}</div>
                <div class="buy-num">{{item.paynum}}人已抢购</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 视频 -->
      <div class="video" @click.stop="stop" v-if="newpeoplecouponvideourl.videourl">
        <div class="introduction flex-aic">
          <i class="icon"></i>
          <div class="txt">如何玩转尖货买卖？</div>
        </div>
        <section class="tmp">
          <div class="play-btn" @click.stop="play" v-if="videobtn">
            <span></span>
          </div>
          <!-- controls autobuffer    loop="false"-->
          <video
            preload="true"
            webkit-playsinline="webkit-playsinline"
            playsinline="playsinline"
            :controls="!videobtn"
            :poster="newpeoplecouponvideourl.coverurl"
            autobuffer
            :style="{width:'100%'}"
            :src="newpeoplecouponvideourl.videourl"
            ref="video"
          >
            <source
              :src="newpeoplecouponvideourl.videourl"
              type="video/mp4; codecs='avc1.42E01E, mp4a.40.2'"
            />
          </video>
        </section>
      </div>
      <!-- 尖货推荐 -->
      <div class="rec" v-if="recdata&&recdata.length">
        <div class="introduction flex-aic">
          <i class="icon"></i>
          <div class="txt">尖货推荐</div>
        </div>
        <div>
          <div
            class="go-pro flex-between"
            v-for="(item,index) in recdata"
            :key="index+'rec'"
            @click.stop="gotodetail(item,2)"
          >
            <div class="pop-val flex-center">人气王</div>
            <div class="p-img">
              <img :src="item.image" />
            </div>
            <div class="pnp">
              <div class="p-name ellipsis-2" style="-webkit-box-orient: vertical;">{{item.name}}</div>
              <div class="comment">评论数:{{item.commentcount}} 付款:{{item.volume}}笔</div>
            </div>
            <div class="buy flex-ctr-end flex-col">
              <div class="mar-pri flex-end">
                <i>￥</i>
                <div>{{item.lastprice}}</div>
              </div>
              <div
                class="gain"
                :class="[{'red':item.pricerate>0},{'gray':item.pricerate==0}]"
              >{{(item.pricerate>0?'+':'') + item.pricerate}}% [{{item.pricechange}}]</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 结束 -->
      <div class="end flex-center">— THE END —</div>
    </div>
  </div>
  <div v-else class="empty flex-col flex-center">
    <img src="https://files.eyee.com/eyeeh5/img/image_empty.png" alt />
    暂无数据，稍后再试~~
  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import { mapGetters } from "vuex";
import { FormatSeconds } from "@/common/util";
import LoaderApp from "@/comps/Loader";
import {
  Newuserpageinfo,
  Hottideproductlist,
  StartPurchase
} from "@/common/api/monitor";
let lavetimer = null;
// let loader = null;
// class Foo {
//   static classMethod() {
//     return 'hello';
//   }
// }
export default {
  components: { LoaderApp },
  data() {
    return {
      hasdata: 1,
      banner: "https://files.eyee.com/eyeeh5/img/pullnew/new_a_banner.png",
      videobtn: true,
      datatime: "",
      expirecoupon: {}, //体验券信息
      cardInfo: {}, // 数据
      validityTxt: "", // 有效期文言
      welfareinfo: [], // 福利2 列表数据
      recdata: [], // 推荐数据
      newpeoplecouponvideourl: {}, // 视屏
      snkInfo: {} // 支付成功需要的数据
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    uid() {
      return !!(this.user && this.user.uid);
    },
    counttimer() {
      let _ = this,
        t = _.datatime || "",
        obj = {};
      if (t.indexOf("天") > -1) t = t.replace("天", ":");
      t = t.split(":");
      t.pop();
      if (t.length == 2) {
        obj.d = 0;
        obj.h = t[0];
        obj.m = t[1];
      } else {
        obj.d = t[0];
        obj.h = t[1];
        obj.m = t[2];
      }
      if (obj.d <= 9) obj.d = "0" + obj.d;
      return obj;
    }
  },
  beforeCreate() {
    (function(win, doc) {
      if (!win.addEventListener) return;
      var html = doc.documentElement;

      function setFont() {
        var cW = html.clientWidth;
        cW = cW > 750 ? 750 : cW < 320 ? 320 : cW;
        html.style.fontSize = 100 * (cW / 750) + "px";
      }
      win.addEventListener("resize", setFont, false);
      setFont();
    })(window, document);
  },
  mounted() {
    let _ = this;
    if (lavetimer) clearInterval(lavetimer);
    // 支付回调
    window.callbackPay = (result, via) => {
      console.log("callbackPay res", result, via);
      // loader && loader.close();
      _.loading();
      if (result == 1) {
        _.toast("支付成功~");
        _.paysuc();
      } else _.toast("支付失败~");
    };
    // 登录回调
    window.callbacklogin = json => {
      if (json) {
        _.getQueryParamUser(json)
          .then(res => _.mainreq()) // console.log("app登录成功");
          .catch(err => console.error("登录失败", err));
      } else _.toast("获取登录信息失败~");
    };
    // 获取app 地址栏传参
    if (_.$root.ISAPP) {
      _.javascriptBridge({
        name: "getAppActivityShareContent",
        params: { hideshareicon: true }
      });
      _.getQueryParamUser()
        .then(res => _.mainreq()) // 登录成功 处理事件
        .catch(err => console.error("参数获取失败", err));
    } else if (_.uid) _.mainreq(); // h5 登录态时 需处理的事件
    _.rec();
    // _.log("zsl", "2123");
  },
  methods: {
    log() {
      var args = Array.prototype.slice.call(arguments),
        fr = args[0];
      args.shift();
      args.unshift(fr + "---->>>");
      console.log.apply(console, args);
    },
    mainreq() {
      let _ = this;
      Newuserpageinfo()
        .then(res => {
          _.hasdata = 1;
          if (res) _.cardInfo = res;
          if (res.expirecoupon) {
            _.expirecoupon = res.expirecoupon;
            // validityTxt
            switch (_.expirecoupon.couponstatus) {
              case 1:
                _.validityTxt = `有效期:&nbsp;&nbsp;&nbsp;${_.expirecoupon
                  .expireday + "&nbsp;天" || ""}`;
                break;
              case 2:
                _.validityTxt = "已获得奖励";
                break;
              case 3:
                _.validityTxt = "已过期";
                break;
            }
          }
          if (res.newpeoplecouponvideourl)
            _.newpeoplecouponvideourl = res.newpeoplecouponvideourl;
          if (lavetimer) clearInterval(lavetimer);
          if (res.validsecond > 0) _.countdown(res.validsecond);

          //  welfareinfo:[],// 福利2 列表数据
          //   welfareTwoTxt:''// 福利2 按钮文言

          if (res.list && res.list.length) {
            _.welfareinfo = res.list;
            _.welfareinfo.map(i => {
              // "status":int #1.可购买，2.已购买，3.已售罄，4，已到期
              switch (i.status) {
                case 1:
                  i.welfareTwoTxt = "立即抢";
                  i.calssbtn = "";
                  break;
                case 2:
                  i.welfareTwoTxt = "已购买";
                  i.calssbtn = "has-buy";
                  break;
                case 3:
                  i.welfareTwoTxt = "已售罄";
                  i.calssbtn = "invalid";
                  break;
                case 4:
                  i.welfareTwoTxt = "已失效";
                  i.calssbtn = "invalid";
                  break;
              }
              return i;
            });
            // _.log('welfareinfo',_.welfareinfo)
          }
          _.rec();
        })
        .catch(e => {
          _.hasdata = 0;
          console.error(e);
        });
    },
    loadcallback(callback = () => {}) {
      // 是否在app 以及是否登录判断
      let _ = this;
      if (_.$root.ISAPP) {
        if (!_.uid) {
          _.callAppLogin();
        } else callback();
      } else _.$refs.load.$el.click();
    },

    pay(item, index) {
      let _ = this;
      _.loadcallback(() => {
        if (item.status == 1) {
          _.log("调APP支付");
          _.loading("支付中...");
          setTimeout(_.loading, 5000);
          $log({
            e: "buyPeoClick",
            p: { pid: "购买点击" }
          });
          StartPurchase({ activityid: item.activityid, size: item.size })
            .then(res => {
              _.fuindex = index;
              _.snkInfo = res;
              if (res.shoecouponid) {
                _.javascriptBridge({
                  name: "callAppPayFromShoesCoupon",
                  params: {
                    paymoney: res.price,
                    dataid: res.shoecouponid,
                    callbackname: "callbackPay"
                  }
                });
              } else _.loading("支付失败");
            })
            .catch(e => {
              // loader && loader.close();
              _.loading();
              console.error(e);
            });

          // $log({
          //   e: "ipoclick",
          //   p: { name: "pay", shoecouponid, activityid }
          // });

          // 自测可用下面代码
          // window.callbackPay(1, "ios");
          // return;
          //   "paymoney":double #支付金额;
          // "dataid":String #鞋券id;
        }
      });
    },
    rec() {
      // 尖货推荐
      let _ = this;
      Hottideproductlist().then(res => {
        if (res && res.list && res.list.length) _.recdata = res.list;
      });
    },
    paysuc() {
      let _ = this,
        i = _.fuindex || 0,
        wl = _.welfareinfo[i],
        { productid, size } = wl,
        info = { productid, size, ..._.snkInfo };
      _.$store.dispatch("snkInfo", info);
      _.$router.push("/sneakerticket/result?status=2");
    },
    gotodetail(item, type) {
      // 跳交易详情页
      let _ = this;
      //   "productid":"商品id",
      // "size":"尺码，可空",
      // "type":"1：预售券，2：现货券"
      // transaction
      if (type == 1)
        $log({
          e: "welfClick",
          p: { describe: "福利1点击人数", pid: item.productid }
        });
      else
        $log({
          e: "recClick",
          p: { describe: "推荐商品", pid: item.productid }
        });
      _.log("跳交易详情页");
      _.loadcallback(() => {
        _.javascriptBridge({
          name: "gotoAppCouponTradePage",
          params: {
            productid: item.productid,
            size: item.size || "",
            type: item.type || 1,
            action: 1
          }
        });
      });
    },
    countdown(time) {
      // 倒计时
      let _ = this;
      $timer(
        (timer, count) => {
          lavetimer = timer;
          time--;
          _.datatime = FormatSeconds(time, 1);
          //   _.log("倒计时", _.datatime);
          if (_.datatime === "end") {
            clearTimeout(lavetimer);
            _.datatime = "00 : 00 : 00";
            _.mainreq();
          }
        },
        1000,
        1
      );
    },
    play() {
      let _ = this;
      _.log("video");
      _.$refs.video.play();
      _.videobtn = false;
      $log({
        e: "videoClick",
        p: { describe: "视频点击人数" }
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
    stop() {
      let _ = this;
      //   _.$refs.video.pause();
    },
    rule() {
      let _ = this,
        content = encodeURIComponent(JSON.stringify(_.cardInfo.newpeoplerule));
      if (_.cardInfo.newpeoplerule)
        _.$router.push({
          path: "/buyerSellKnow",
          query: {
            type: 6,
            content
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
// 尺寸
$px: 0.02rem;
img {
  display: block;
  width: 100%;
}
.new-area {
  background: #c62525;
  min-height: 100vh;
  overflow: hidden;
  .coun {
    height: 50 * $px;
    background: #881212;
    font-size: 16 * $px;
    color: #fff;
    font-weight: bold;
    padding: 0 25 * $px 0 15 * $px;
    .icon {
      display: inline-block;
      width: 22 * $px;
      height: 22 * $px;
      background: url("https://files.eyee.com/eyeeh5/img/pullnew/icon3.png") 0 0
        no-repeat;
      background-size: cover;
      margin-right: 10 * $px;
    }
    .time {
      font-size: 14 * $px;
      span {
        font-size: 26 * $px;
        // margin-top: -6 * $px;
        font-family: "OswaldBold";
      }
      i {
        font-style: normal;
        margin-top: 9 * $px;
      }
    }
  }
  .banner {
    position: relative;
    margin-bottom: 18 * $px;
    .rule {
      font-size: 12 * $px;
      color: #fff;
      text-decoration: underline;
      position: absolute;
      right: 15 * $px;
      top: 10 * $px;
      cursor: pointer;
    }
  }
  .content {
    margin: 0 15 * $px;

    .welfare {
      background: #ffe5db;
      border-radius: 10 * $px;
      padding: 30 * $px 15 * $px 20 * $px;
      position: relative;
      margin-bottom: 20 * $px;
      font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
        sans-serif;
      font-weight: bold;
      .icon {
        position: absolute;
        width: 56 * $px;
        height: 56 * $px;
        background: url("https://files.eyee.com/eyeeh5/img/pullnew/fu1.png") 0 0
          no-repeat;
        background-size: cover;
        left: -2 * $px;
        top: -2 * $px;
      }
      .title {
        color: #c72525;
        font-size: 18 * $px;
        font-weight: bold;
        margin-bottom: 10 * $px;
      }
      .validity-data {
        position: absolute;
        right: 25 * $px;
        bottom: 28 * $px;
        background: #ffbe00;
        font-size: 12 * $px;
        color: #fff;
        padding: 3 * $px 6 * $px;
        border-radius: 2 * $px;
        font-weight: bold;
        &.over {
          background: #dcdcdc;
        }
      }
      &.fu {
        .icon {
          background: url("https://files.eyee.com/eyeeh5/img/pullnew/fu2.png") 0
            0 no-repeat;
          background-size: cover;
        }
      }
    }
    .video {
      margin-bottom: 10 * $px;

      .tmp {
        position: relative;
        video {
          margin: 0 auto;
          width: 100%;
          border-radius: 4 * $px;
          overflow: hidden;
          background: #881212;
          // max-width: 250 * $px;
        }
      }
      .play-btn {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 100;
        span {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: url("https://files.eyee.com/eyeeh5/img/pullnew/vbtn.png")
            0 0 no-repeat;
          background-size: cover;
          width: 30 * $px;
          height: 30 * $px;
        }
        &.stop {
          background: rgba(0, 0, 0, 0.5);
          span {
            background: url("https://files.eyee.com/eyeeh5/img/pullnew/stop.png")
              0 0 no-repeat;
            background-size: cover;
          }
        }
      }
    }
    .go-pro {
      padding: 5 * $px 15 * $px 5 * $px 5 * $px;
      background: #fff;
      border-radius: 4 * $px;
      font-size: 12px;
      margin-bottom: 10 * $px;
      &:last-child {
        margin-bottom: 0;
      }
      .pnp {
        margin-right: 9 * $px;
      }
      //   align-items: end;
      //   justify-content: flex-end !important;
      .p-img {
        width: 100 * $px;
        height: 100 * $px;
        margin-right: 15 * $px;
      }
      .p-name {
        color: #232323;
        // min-height: 30 * $px;
        font-size: 14 * $px;
        font-weight: bold;
        width: 115 * $px;
        margin-bottom: 12 * $px;
      }
      .price {
        font-weight: bold;
        line-height: 17 * $px;
        .mar-price {
          color: #646464;
          white-space: nowrap;
          i {
            font-style: normal;
            text-decoration: line-through;
          }
        }
        .new-price {
          color: #232323;
          white-space: nowrap;
        }
      }
      .buy {
        // margin-top: 15 * $px;
        .btn {
          width: 56 * $px;
          height: 30 * $px;
          background: #ff5a50;
          color: #fff;
          font-size: 12 * $px;
          font-weight: bold;
          border-radius: 2px;
          margin-bottom: 11 * $px;
          &.has-buy {
            border: 1px solid #ff5a50;
            color: #ff5a50;
            background: none;
          }
          &.invalid {
            background: #dcdcdc;
          }
        }
        .buy-num {
          color: #969696;
          font-size: 12 * $px;
          white-space: nowrap;
        }
      }
    }
    .introduction {
      background: #ffe5db;
      font-size: 16 * $px;
      color: #c72525;
      width: 206 * $px;
      height: 40 * $px;
      font-weight: bold;
      padding-left: 10 * $px;
      margin-bottom: 10 * $px;
      border-radius: 10 * $px 20 * $px 20 * $px 0;
      font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS",
        sans-serif;
      font-weight: bold;
      i {
        background: url("https://files.eyee.com/eyeeh5/img/pullnew/icon1.png") 0
          0 no-repeat;
        background-size: cover;
        width: 22 * $px;
        height: 22 * $px;
        display: inline-block;
        margin-right: 5 * $px;
      }
    }
    .rec {
      .introduction {
        width: 126 * $px;
        i {
          background: url("https://files.eyee.com/eyeeh5/img/pullnew/icon2.png")
            0 0 no-repeat;
          background-size: cover;
        }
      }
      .go-pro {
        padding: 5 * $px 15 * $px 5 * $px 10 * $px;
        margin-bottom: 15 * $px;
        position: relative;
        &:last-child {
          margin-bottom: 0;
        }
        .pnp {
          margin: 0;
        }
        .pop-val {
          position: absolute;
          left: 7 * $px;
          top: 7 * $px;
          background: #ffbe00;
          border-radius: 2px;
          padding: 3 * $px 6 * $px;
          color: #fff;
          font-size: 10 * $px;
          transform: scale(0.8);
          font-weight: bold;
          font-family: "Courier New", Courier, monospace;
        }
        .p-img {
          width: 80 * $px;
          height: 80 * $px;
          margin-right: 10 * $px;
        }
        .pnp {
          width: 145 * $px;
          .p-name {
            font-size: 13 * $px;
            margin-bottom: 6 * $px;
            width: 100%;
          }
          .comment {
            font-size: 11 * $px;
            color: #646464;
            white-space: nowrap;
          }
        }
        .buy {
          margin: 0;
          min-width: 64 * $px;
          .mar-pri {
            color: #232323;
            font-size: 22 * $px;
            font-weight: bold;
            white-space: nowrap;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            i {
              font-style: normal;
              font-size: 14 * $px;
              margin-right: 3 * $px;
              margin-top: 5 * $px;
            }
          }
          .gain {
            font-size: 12 * $px;
            color: #0ab978;
            white-space: nowrap;
            font-weight: bold;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            &.red {
              color: #fa2337;
            }
            &.gray {
              color: #969696;
            }
          }
        }
      }
    }
    .end {
      color: #ffffff;
      font-size: 12 * $px;
      font-weight: bold;
      margin: 20 * $px 0;
    }
  }
}
.empty {
  font-size: 13px;
  color: #969696;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>