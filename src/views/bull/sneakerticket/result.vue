<template>
  <div class="wrap-result">
    <!-- 顶部 -->
    <v-header :showback="true" v-if="!$root.ISAPP">
      <div class="nav-tab2 ellipsis">{{ title }}</div>
    </v-header>
    <!-- 认证成功 -->
    <div class="attestationSuccessBox" v-if="status == 1">
      <!-- v-if="idRes && idRes.shoecouponid" -->
      <div class="sneaker">
        <div class="headInfo">
          <div class="endTimeBox">
            <div class="time">{{ timeData1 }}</div>
            <div class="time">{{ timeData2 }}</div>
            <div class="colon">
              <p><span></span></p>
              <p><span></span></p>
            </div>
            <div class="time">{{ timeData3 }}</div>
            <div class="time">{{ timeData4 }}</div>
          </div>
          <p class="info1">{{ idRes.activityuv }}人 正在排队</p>
          <p class="info2" :class="{ act: pass_type != 1 }">
            {{
              pass_type != 1
                ? "专属通道开启中，请在倒计时结束前完成支付！"
                : "请在倒计时结束前完成支付！"
            }}
          </p>
        </div>
        <!-- 现货商品 -->
        <div class="good-prod">
          <!-- 收货地址 -->
          <UserAddressUint
            :addressUnit="userDefaultAddress"
            :addressType="1"
          ></UserAddressUint>
          <!--订单单元  -->
          <div>
            <div class="commodity">
              <img :src="prodinfo.image" />
              <div>
                <div class="ellipsis-2 productname">
                  {{ prodinfo.productname }}
                </div>
                <div class="info">
                  {{ prodinfo.color }},{{ prodinfo.size }},×1
                </div>
              </div>
              <!-- 商品单价额 -->
              <div class="allMoney">¥{{ prodinfo.price }}</div>
            </div>
            <div class="toal flex-aic-btwn">
              <div class="txt">配送运费</div>
              <div class="">
                {{ prodinfo.expressfee ? "¥" + prodinfo.expressfee : "--" }}
              </div>
            </div>
            <div class="toal flex-aic-btwn">
              <div class="txt">合计费用</div>
              <div class="money">
                {{ prodinfo.payamount ? "¥" + prodinfo.payamount : "--" }}
              </div>
            </div>
          </div>
        </div>
        <div class="buy_notice" v-if="idRes.list && idRes.list.length > 0">
          <ul :class="{ buyRecordList: animate == true }">
            <li
              class="buy_notice_item"
              v-for="(item, index) in idRes.list"
              :key="index"
            >
              {{ item.username }} 抢到【{{ item.size }}】码
            </li>
          </ul>
        </div>
        <!-- 预售券 -->
        <div v-if="false">
          <div class="ticket">
            <div class="ticket_box">
              <div class="ticket_left">
                <div>
                  <img v-lazy="idRes.image" />
                </div>
                <span class="tag"></span>
              </div>
              <div class="ticket_right">
                <p class="size">{{ idRes.size }}码</p>
                <p class="now_price_tit">购买价格</p>
                <p class="now_price">
                  <span>￥</span>
                  <em class="font-price">{{ idRes.price }}</em>
                </p>
                <p class="timeExp">到手即可转让 到期可提货</p>
              </div>
            </div>
          </div>
        </div>

        <div class="pay_btn_box fix-btm" :class="{ act: saleprice }">
          <div class="tip_box" v-if="saleprice">
            <p>
              购买<span>立省￥{{ saleprice - prodinfo.price }}</span>
              <em
                >(<del>市场价：{{ saleprice }}</del
                >)</em
              >
            </p>
          </div>
          <p
            class="pay_btn"
            @click="pay"
            :class="{ disable: !isPay, ipx: getIsIphonex }"
          >
            <span>支付</span>
            <!-- <span class="font-price">￥{{ idRes.price }}</span> -->
            <span class="font-price">￥{{ prodinfo.payamount || "--" }}</span>
          </p>
        </div>
      </div>
    </div>
    <!-- 支付成功页 -->
    <div class="attestationSuccessBox paySuccessBox" v-else-if="status == 2">
      <!-- v-if="idRes && idRes.shoecouponid" -->
      <div class="content">
        <div class="pic_box">
          <img src="/static/imgs/icon_pay.png" />
        </div>
        <h2 class="head">支付成功</h2>
      </div>
      <div class="ticket" v-if="false">
        <div class="ticket_box">
          <div class="ticket_left">
            <div>
              <img v-lazy="idRes.image" />
            </div>
            <span class="tag"></span>
          </div>
          <div class="ticket_right">
            <p class="size">{{ idRes.size }}码</p>
            <p class="now_price_tit">购买价格</p>
            <p class="now_price">
              <span>￥</span>
              <em class="font-price">{{ idRes.price }}</em>
            </p>
            <p class="timeExp">到手即可转让 到期可提货</p>
          </div>
        </div>
      </div>
      <div class="pay_btn_box fix-btm" :class="{ ipx: getIsIphonex }">
        <p class="go_btn go_btn_mr" @click="go(4)">查看订单</p>
        <p class="go_btn" @click="go(1)">去逛逛</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  Updateshoecouponv2i,
  Cancelpurchasev2i,
  VipUpdateShoeCoupon,
  GetProdInfo,
  AddOrder,
} from "../../../common/api/bull";
import UserAddressUint from "../../../components/templates/user/UserAddressUnit";
import { AddressDefault } from "../../../common/api/user";
import { FormatSeconds } from "@/common/util";
var loader;
export default {
  name: "TicketResult",
  data() {
    return {
      title: "获得购买资格",
      status: 0,
      activityType: 0,
      pass_type: 1,
      idRes: {},
      saleprice: "", // 市场价
      isPay: true, // 是否可以支付
      timeData: "",
      timeData1: "0",
      timeData2: "0",
      timeData3: "0",
      timeData4: "0",
      timeSettimeout: 0, //倒计时timer 支付剩余时间
      isShowBack: false,
      css: {
        show: false,
      },
      isGet: true,
      animate: false,

      prodinfo: {}, // 现货商品信息
      orderno: "",
    };
  },
  beforeMount() {
    document.body.classList.add("pay-reselut");
  },
  beforeDestroy() {
    document.body.classList.remove("pay-reselut");
  },
  beforeRouteLeave(to, from, next) {
    let _ = this;
    if (
      to.path == "/sneakerticket/detail" &&
      _.isShowBack &&
      (_.pass_type == 1 || _.pass_type == 4)
    ) {
      if (_.pass_type == 1) {
        // if (!_.isPay) {
        //   next();
        // } else {
        _.confirm({
          title: "温馨提示",
          msg: "返回将失去本次购买资格！ 您确认要放弃购买吗？",
          okText: "继续支付",
          ok: () => {
            next(false);
          },
          cancelText: "放弃购买",
          cancel: () => {
            let { code, activityid, isvip = 0 } = _.$route.query;
            // 普通通道放弃
            let api = isvip ? VipUpdateShoeCoupon : Updateshoecouponv2i;
            api({ code: code, activityid: activityid })
              .then((res) => {
                next();
              })
              .catch((e) => {
                next();
              });
          },
        });
        // }
      } else if (_.pass_type == 4) {
        // 全网最低价放弃
        let { code, activityid } = _.$route.query;
        Cancelpurchasev2i({ code: code, activityid: activityid })
          .then((res) => {
            next();
          })
          .catch((e) => {
            next();
          });
      }
    } else next();
  },
  computed: {
    ...mapGetters({
      snkInfo: "snkInfo",
      userDefaultAddress: "userDefaultAddress",
      user: "userInfo",
    }),
    getIsIphonex() {
      if (this.$root.ISIOS) {
        return !!(
          (screen.height == 812 && screen.width == 375) ||
          (screen.width === 414 && screen.height === 896)
        );
      }
    },
  },
  components: {
    UserAddressUint,
  },
  mounted() {
    // console.log(this.$route, this.$router);
    let _ = this,
      { status, activityType, pass_type, saleprice, isvip } = _.$route.query;
    _.status = status;
    _.activityType = activityType;
    if (pass_type) {
      _.pass_type = pass_type;
    } else {
      _.pass_type = 1;
    }
    if (saleprice) {
      _.saleprice = saleprice;
    }
    // console.log('抢购类型 1 普通 2 意向特殊通道 3 随机特殊通道', pass_type)
    _.setToolBar({ title: _.title });
    _.idRes = _.snkInfo;
    if (_.idRes.list && _.idRes.list.length > 0) {
      _.infoScroll();
    }
    _.isShowBack = true;
    _.isPay = _.idRes.paytimesecond > 0;
    if (_.isPay) {
      clearTimeout(_.timeSettimeout);
      _.endTime(_.idRes.paytimesecond);
    }
    // _.endTime(60);
    window.callbackPay = (result, via) => {
      console.log("callbackPay res", result, via);
      loader.close();
      if (result == 1) {
        _.setPay();
        _.toast("支付成功~");
        _.isShowBack = false;
      } else _.toast("支付失败~");
    };

    // window._appPayCallback = function (ret) {
    //   // 0：支付失败，1：支付成功，2：取消支付，3：弹框的确认操作
    //   loader.close();
    //   if (result == 1) {
    //     _.setPay();
    //     _.toast("支付成功~");
    //     _.isShowBack = false;
    //   } else _.toast("支付失败~");
    // };

    if (_.$root.ISAPP) {
      _.javascriptBridge({
        name: "getAppActivityShareContent",
        params: {
          hideshareicon: true,
        },
      });
    }

    if (!(_.userDefaultAddress && _.userDefaultAddress.mobile)) {
      if (_.user.token) _.GetAddressDefault();
      else {
        setTimeout(() => {
          _.GetAddressDefault();
        }, 800);
      }
    } else {
      this.getprodinfo(_.userDefaultAddress.addressid || "");
    }
    let time = 60 * 1000;
  },
  methods: {
    GetAddressDefault() {
      AddressDefault({ token: this.user.token })
        .then((res) => {
          if (res) {
            res.mobile = res.mobile.split("-")[1];
            // this.userDefaultAddress = res
            this.$store.dispatch("setDefaultAddress", res);
            // console.log("userDefaultAddress--", this.userDefaultAddress);
          }
          let id = (res && res.addressid) || "";
          console.log("默认地址", res, id);
          this.getprodinfo(id);
        })
        .catch((e) => {
          console.error("获取默认地址失败", e);
        });
    },
    getprodinfo(addressid = "") {
      // 获取现货商品信息
      let _ = this;
      // console.log("------prodinfo");
      let { code, activityid } = _.$route.query;
      GetProdInfo({ code, addressid, activityid })
        .then((res) => {
          _.prodinfo = res;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    setPay() {
      let _ = this;
      _.status = 2;
      _.title = "支付成功";
      _.setToolBar({ title: _.title });
      _.isShowBack = false;
      _.isPay = false;
      clearTimeout(_.timeSettimeout);
    },
    infoScroll() {
      clearTimeout(this.timer_scroll_1);
      clearTimeout(this.timer_scroll_2);
      this.scroll();
      this.timer_scroll_2 = setTimeout(() => {
        this.infoScroll();
      }, 3000);
    },
    scroll() {
      this.animate = true;
      this.timer_scroll_1 = setTimeout(() => {
        this.idRes.list.push(this.idRes.list[0]);
        this.idRes.list.shift();
        this.animate = false;
      }, 2000);
    },
    endTime(time) {
      let _this = this,
        hours = "",
        minutes = "",
        seconds = "";
      $timer(
        (timer, count) => {
          _this.timeSettimeout = timer;
          time--;
          let datatime = FormatSeconds(time, 1);
          if (datatime === "end") {
            console.log("倒计时结束");
            _this.isPay = false;
            _this.timeData1 = 0;
            _this.timeData2 = 0;
            _this.timeData3 = 0;
            _this.timeData4 = 0;
            clearTimeout(_this.timeSettimeout);
          } else {
            let t = datatime.split(":");
            t.splice(0, 1);
            let t1 = t[0].split("");
            let t2 = t[1].split("");
            _this.timeData1 = t1[0];
            _this.timeData2 = t1[1];
            _this.timeData3 = t2[0];
            _this.timeData4 = t2[1];
          }
        },
        1000,
        1
      );
    },
    pay() {
      let _ = this,
        { shoecouponid, price } = _.idRes,
        { activityid, code } = _.$route.query;
      if (!_.isPay) {
        _.toast("超时未支付，抢购资格已失效~");
        return;
      }
      if (!_.userDefaultAddress.addressid) {
        _.toast("请填写收货地址");
        return;
      }
      loader = _.$loader("支付中...");
      setTimeout(loader.close, 5000);

      // 自测可用下面代码
      // window.callbackPay(1, "ios");
      // return;
      AddOrder({
        activityid,
        code,
        addressid: _.userDefaultAddress.addressid,
        expresstemplateitemid: _.prodinfo.expresstemplateitemid,
      })
        .then((res) => {
          _.orderno = res.orderno;
          _.javascriptBridge({
            name: "callAppPayFromShoesCoupon",
            params: {
              paymoney: _.prodinfo.payamount,
              dataid: _.orderno || shoecouponid,
              callbackname: "callbackPay",
            },
          });
        })
        .catch((e) => {
          console.error(e);
          _.toast((e && e.msg) || "下单失败");
        });

      // _.javascriptBridge({
      //   name: "callAppPayment",
      //   params: {
      //     callbackname: "_appPayCallback",
      //     paymoney: _.prodinfo.payaccount,
      //     listreq: {
      //       paytype: 2, // C2C下单
      //     },
      //     prepayreq: {
      //       dataid: _.orderno,
      //       paysource: 3, // 球鞋
      //     },
      //   },
      // });
    },
    goUser() {
      // this.javascriptBridge({ name: "goMyAsset" });
    },
    go(index) {
      let _ = this;
      // _.javascriptBridge({
      //   name: "gotoAppCouponTradePage",
      //   params: {
      //     productid: _.idRes.productid,
      //     size: _.idRes.size,
      //   },
      // });

      // index 等待app 发版后去掉
      if (ENV.ua.android && index == 4) {
        index = 2;
      }
      _.javascriptBridge({
        name: "gotoAppMallCenterPage",
        params: {
          homepageindex: index,
        },
      });
    },
    close() {
      let _ = this;
      _.isShowBack = false;
      _.$router.go(-1);
    },
  },
};
</script>
<style>
.pay-reselut .mint-msgbox {
  border-radius: 12px !important;
}
.pay-reselut .mint-msgbox-btns {
  padding: 0;
  background: #f5f5f5;
  height: 60px;
  margin-bottom: 0;
}
.pay-reselut .mint-msgbox-cancel {
  font-size: 16px;
  line-height: 19px;
  text-align: center;

  color: #969696;
}
.pay-reselut .mint-msgbox-confirm,
.pay-reselut .mint-msgbox-confirm:active {
  background: none;
  color: #232323;
  font-weight: bold;
}
.pay-reselut .mint-msgbox-btn {
  margin: 0;
  border-radius: 0;
  border: 0;
  background: none;
  border-right: 1px solid #e6e6e6;
  font-weight: bold;
  height: auto;
}
</style>
<style lang="scss" scoped>
.wrap-result {
  background: #eee;
  min-height: 100vh;
}
.attestationSuccessBox {
  // background: #fefefe;
  // font-family: Arial, Helvetica, sans-serif;
  .ticket {
    padding: 0 15px;
  }
  .content {
    .pic_box {
      width: 74px;
      height: 74px;
      margin: 0 auto 16px;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .tit {
      height: 30px;
      font-size: 22px;
      font-weight: 600;
      color: #333;
      line-height: 25px;
      margin-bottom: 50px;
      display: flex;
      align-items: center;
      padding-left: 80px;
      img {
        display: inline-block;
        width: 30px;
        height: 30px;
      }
      span {
        width: 140px;
        text-align: center;
      }
    }
    .info {
      font-size: 22px;
      font-weight: 600;
      color: #333333;
      line-height: 30px;
      margin-bottom: 5px;
      word-wrap: break-word;
      font-weight: 500;
    }
  }

  .pay_btn_box {
    position: fixed;
    transform: translateZ(0);
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    box-shadow: 0px -10px 15px 0px rgba(235, 235, 235, 0.5);
    padding: 3.2vw 4vw;
    display: flex;
    &.act {
      padding: 38px 4vw 10px;
    }
    &.ipx {
      padding-bottom: 12.66vw;
    }
    .tip_box {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      p {
        height: 38px;
        font-size: 13px;
        font-weight: bold;
        color: #232323;
        line-height: 38px;
        text-align: center;
        span {
          margin-right: 20px;
          color: #fa2337;
        }
        em {
          color: #969696;
        }
      }
    }
    .pay_btn {
      text-align: center;
      width: 92vw;
      height: 50px;
      line-height: 50px;
      color: #fff;
      font-size: 16px;
      background: #fa2337;
      border-radius: 6px;
      font-weight: bold;
      &.disable {
        background: #cdcdcd;
      }
      &.ipx {
        margin-bottom: 34px;
      }
      .font-price {
        font-size: 18px;
      }
      .endTime {
        font-size: 14px;
        position: relative;
        top: -1px;
      }
    }
    .go_btn {
      flex: 1;
      text-align: center;
      height: 46px;
      line-height: 46px;
      color: #fff;
      font-size: 16px;
      background: #fa2337;
      border-radius: 25px;
      font-weight: bold;
      border: 0;
      &.go_btn_mr {
        margin-right: 13px;
        background: transparent;
        border: solid 1px #fa2337;
        color: #fa2337;
      }
    }
  }
}
.paySuccessBox {
  .content {
    padding-top: 35px;
    .head {
      height: 25px;
      font-size: 18px;
      font-weight: 600;
      color: rgba(35, 35, 35, 1);
      line-height: 25px;
      text-align: center;
      margin-bottom: 40px;
    }
  }
}
.ticket_box {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(200, 200, 200, 0.5);
  border-radius: 4px;
  padding: 10px;
  display: flex;
  .ticket_left {
    width: 111px;
    height: 110px;
    border-right: 1px dashed rgba(220, 220, 220, 1);
    position: relative;
    padding: 5px 10px 5px 0;
    div {
      position: relative;
      width: 100%;
      height: 100%;
    }
    img {
      display: block;
      width: 100%;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translate(0, -50%);
      z-index: 2;
    }
    .tag {
      width: 61px;
      height: 18px;
      background: url("//files.eyee.com/eyeeh5/img/crunchies/j_icon.png?r=2")
        center center no-repeat;
      background-size: cover;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;
    }
  }
  .ticket_right {
    flex: 1;
    height: 110px;
    padding-left: 20px;
    padding-top: 5px;
    position: relative;
    .size {
      position: absolute;
      right: 0;
      top: 5px;
      width: 100px;
      height: 30px;
      background: rgba(250, 250, 250, 1);
      border-radius: 2px;
      border: 1px solid rgba(230, 230, 230, 1);
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: #232323;
      line-height: 30px;
    }
    .now_price_tit {
      height: 20px;
      font-size: 14px;
      font-weight: 600;
      color: rgba(35, 35, 35, 1);
      line-height: 20px;
      position: relative;
      top: 5px;
    }
    .now_price {
      position: relative;
      margin-bottom: 10px;
      height: 46px;
      font-size: 28px;
      font-weight: 600;
      color: rgba(35, 35, 35, 1);
      line-height: 46px;
      position: relative;
      top: 2px;
      span {
        position: absolute;
        top: 3px;
        left: -4px;
        height: 24px;
        font-size: 28px;
        font-weight: 600;
        color: rgba(35, 35, 35, 1);
        line-height: 40px;
      }
      em {
        height: 40px;
        font-size: 28px;
        font-weight: bold;
        color: rgba(35, 35, 35, 1);
        line-height: 24px;
        padding-left: 20px;
      }
    }
    .timeExp {
      height: 16px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(100, 100, 100, 1);
      line-height: 16px;
      position: relative;
      top: 4px;
    }
  }
}
.headInfo {
  // margin-bottom: 30px;
  width: 100%;
  background: linear-gradient(
    185deg,
    rgba(73, 73, 73, 1) 0%,
    rgba(35, 35, 35, 1) 100%
  );
  padding: 32px 0 25px;
  .endTimeBox {
    height: 46px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    .time {
      height: 46px;
      line-height: 46px;
      width: 30px;
      background: url("http://files.eyee.com/eyeeh5/img/crunchies/endTimeBg.png")
        center center no-repeat;
      background-size: cover;
      margin-right: 4px;
      font-size: 30px;
      font-family: "OswaldBold";
      color: #363636;
      text-align: center;
      &:nth-child(2) {
        margin-right: 0;
      }
      &:nth-child(5) {
        margin-right: 0;
      }
    }
    .colon {
      height: 46px;
      width: 20px;
      p {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 23px;
        &:nth-child(1) {
          padding-top: 11px;
        }
        &:nth-child(2) {
          padding-bottom: 11px;
        }
        span {
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #fff;
        }
      }
    }
  }
  .info1 {
    height: 23px;
    font-size: 17px;
    font-weight: 600;
    color: #fff;
    line-height: 23px;
    margin-bottom: 10px;
    text-align: center;
  }
  .info2 {
    height: 21px;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    line-height: 21px;
    text-align: center;
    &.act {
      color: #fa4b4b;
    }
  }
}
.good-prod {
  padding: 0 15px 5px;
  font-size: 14px;
  color: #232323;
  background: #fff;
  /deep/ .address_unit {
    height: 16vw;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .commodity {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    padding: 2.66vw;
    border-radius: 12px;
    margin-bottom: 10px;
    position: relative;
    img {
      width: 24vw;
      height: 24vw;
      margin-right: 3.2vw;
      border-radius: 12px;
    }
    .productname {
      color: #232323;
      font-size: 16px;
      width: 58.6667vw;
      line-height: 5.8667vw;
      height: 11.7333vw;
      font-weight: 600;
      margin-bottom: 3.2vw;
    }
    .info {
      color: #232323;
      font-size: 12px;
      font-weight: 400;
    }
    .allMoney {
      color: #fa2337;
      font-size: 12px;
      font-weight: 600;
      position: absolute;
      right: 4vw;
      bottom: 4vw;
    }
  }
  .toal {
    font-size: 3.733vw;
    color: #232323;
    height: 34px;
    .money {
      font-size: 4.8vw;
      font-weight: bold;
    }
  }
}
.buy_notice {
  min-height: 34px;
  background: transparent;
  font-weight: 600;
  overflow: hidden;
  width: 40vw;
  text-align: center;
  font-size: 12px;
  z-index: 10;
  margin-bottom: 30px;
  margin-left: 15px;
  position: relative;
  .buyRecordList {
    position: absolute;
    left: 0;
    top: 34px;
    animation: move 2.3s linear;
    width: 40vw;
    .buy_notice_item {
      display: block;
    }
  }
  .buy_notice_item {
    display: none;
    height: 34px;
    line-height: 34px;
    font-size: 12px;
    color: #232323;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 17px;
    width: 40vw;
    margin-bottom: 34px;
  }
}
@keyframes move {
  0% {
    transform: translateY(0);
  }
  10% {
    transform: translateY(-34px);
  }
  80% {
    transform: translateY(-34px);
  }
  90% {
    transform: translateY(-68px);
  }
  100% {
    transform: translateY(-102px);
  }
}
</style>
