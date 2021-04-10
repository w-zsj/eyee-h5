<template>
  <div>
    <div v-if="hasdata">
      <mt-loadmore top-pull-span="下拉刷新" top-drop-span="释放加载" top-loading-span :top-distance="50" :top-method="pageload" ref="loadmore">
        <div class="poosition">
          <div class="content">
            <!-- 充电状态 -->
            <div class="charge bg">
              <div class="icon"></div>
              <div class="pull-bg"></div>
              <div class="prd flex-aic-btwn" :class="{'act':info.chargestatus==3 || info.status==3 || info.status==6}">
                <div class="pic" @click.stop="goToAppDetail(info.reward)">
                  <img :src="info.reward.mainpic" alt="" v-if="info.reward&&info.reward.mainpic">
                </div>
                <div class="price flex-col flex-end">
                  <div class="txt">{{info.reward&&info.reward.type==1?'尖货竞拍':'闪电发货'}}&nbsp;&nbsp;|&nbsp;&nbsp;奖励券</div>
                  <div class="cur-price flex-end">
                    当前价值:&nbsp;&nbsp;&nbsp;&nbsp;<i>¥&nbsp;&nbsp;</i><span>{{info.reward && info.reward.currentprice?info.reward.currentprice:'???'}}</span>
                  </div>
                </div>
                <div class="name ellipsis" v-if="info.reward&&info.reward.productname">{{info.reward.productname}}</div>
              </div>
              <div class="battery flex-center">
                <span> <i v-if="info.musttime - info.holdtime>0 && info.status==2 && info.chargestatus!=3">还需{{chargetimer}}</i> {{batterytxt}}</span>
                <div class="progress-bar" :style="{width:percentage+'%'}"></div>
              </div>
              <div class="introduce flex-center">
                <span>激活后可兑换个人奖励金</span>
              </div>
            </div>
            <!-- 充电条件 -->
            <div class="charge-condition bg">
              <div class="pull-bg"></div>
              <div class="title flex-center">充电启动要求：持有以下库存</div>
              <div class="list flex-aic-btwn flex-wrap" v-if="info.condition&&info.condition.length">
                <div class="item flex-col-ctr" v-for="(item,index) in info.condition" :key="index" @click.stop="goToAppDetail(item)">
                  <div class="name flex-center">{{item.type==1?'尖货竞拍':'闪电发货'}}</div>
                  <img :src="item.mainpic" alt="">
                  <div class="num flex-center">{{item.hold || 0}}/{{item.num}}</div>
                </div>
              </div>
            </div>
            <!-- 活动规则 -->
            <div class="act-rule bg">
              <div class="pull-bg"></div>
              <div class="title flex-center">活动说明</div>
              <p> ·活动期间，用户个人库存中持有发电站启动所要求的商品，即可为奖励券进行充电，库存中要求商品不足时，充电将暂停。</p>
              <p> ·在活动时间内，累计充电时间满{{info.chargetime}}小时，即可激活奖励券。</p>
              <p> ·激活的奖励券在活动结束后，可兑换成个人奖励金，奖励金可提现至余额。</p>
              <p> ·奖励券价值等同于对应商品在活动结束前的最终成拍价。</p>
              <p> ·奖励券无法进行交易。</p>
              <p> ·活动时间：{{info.starttime}}~ {{info.endtime}}</p>
              <p> ·奖励兑换截止日期：{{info.exchangedate}}</p>
              <p class="zhu">注：活动一切解释权归斗牛DoNew平台所有，若发现用户存在违规行为，斗牛有权收回活动奖励。</p>
            </div>
          </div>
        </div>
      </mt-loadmore>
      <div class="_but" @click="getPrice">
        <div class="cot flex-center" :class="{'act':info.status==3||info.status==6}">
          <span v-if="info.status==2">{{cd}}</span>{{btntxt}}
        </div>
      </div>
      <!-- 弹框 -->
      <div class="modal" :class="{'act':showModal}" @click.stop="check(0)">
        <div class="cont" @click.stop="check(1)">
          <div class="tit flex-center">{{ModalType==1?'兑换成功！':'奖励发放中！'}}</div>
          <p>{{ModalType==1?'奖励将在一个工作日内发放至个人奖励金账户,请注意查收':'奖励发放正在审核中，请时刻关注个人奖励金动态'}}</p>
          <div class="btn flex-center" @click.stop="check(2)">查看我的奖励金</div>
        </div>

      </div>
    </div>
    <div class="no-data" v-else>
      <img src="https://files.eyee.com/eyeeh5/img/image_empty.png" alt />
      <p>活动不存在或已结束~</p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  ChargingStation,
  ExChange,
  GetProxyTable
} from "../../utils/api/activities";
import { getUrlParam } from "../../common/util";
import axios from "axios";
const pad = num =>
  Math.floor(num)
    .toString()
    .padLeft(2, "0");
let cleartimer = null,
  clearcd = null;
export default {
  data() {
    return {
      hasdata: 1,
      info: {},
      percentage: 0, //进度条百分比
      code: this.$route.query.code,

      cd: "",
      chargetimer: "",

      btntxt: "活动未开始", // 按钮文言
      batterytxt: "未通电", //充电按钮文言

      showModal: false,
      ModalType: 1, //1 领取弹框 2 已兑现弹框
      onoff: true
    };
  },
  watch: {
    showModal: function(newval, oldval) {
      if (newval) document.body.classList.add("lock");
      else document.body.classList.remove("lock");
    }
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    loged() {
      return !!(this.user && this.user.uid);
    },
    getIsIphonex() {
      if (this.$root.ISIOS) {
        return !!(
          (screen.height == 812 && screen.width == 375) ||
          (screen.width === 414 && screen.height === 896)
        );
      }
    }
  },
  mounted() {
    let _ = this;
    window.scrollTo(0, 0);
    if (!_.$root.ISAPP) {
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
      _.mainreq();
      document.body.classList.add("lock");
    } else if (_.$root.loging) {
      _.$root.loging
        .then($ => {
          // console.log("登录返回信息", $);
          _.mainreq();
        })
        .catch(e => {
          console.error("query prams auto login error:", e);
          _.mainreq();
          _.checkLogin();
        });
    } else {
      _.mainreq();
      _.checkLogin(); // 未登录
    }

    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json).then(res => {
          _.mainreq();
        });
      } else _.toast("登录失败~");
    };

    // 隐藏分享按钮
    _.javascriptBridge({
      name: "getAppActivityShareContent",
      params: {
        hideshareicon: true
      }
    });
    document.body.classList.add("bg-color");
    // try {
    //   axios.get("https://files.eyee.com/conf.json").then(res => {
    //     console.log("获取配置信息", res);
    //   });
    // } catch (err) {
    //   console.error("跨域问题test", err);
    // }
  },
  methods: {
    mainreq() {
      // 接口区分登录和未登录
      let _ = this;
      console.log("活动id---", _.code);
      ChargingStation({ code: _.code, loged: _.loged })
        .then(res => {
          console.log("主接口", res);
          if (res) {
            _.info = res.data;
            _.hasdata = 1;
            if (cleartimer) clearTimeout(cleartimer);
            if (clearcd) clearTimeout(clearcd);
            // "chargestatus":1-未通电 2-充电中 3-已充满
            // "status":1,#1-活动未开始 2-活动开始中 3-兑换中 4-活动结束未激活 5已结束 6-已兑换
            let n = 97,
              d = 3;
            _.percentage = (_.info.holdtime / _.info.musttime) * 100;
            _.percentage = _.percentage > n ? _.percentage - d : _.percentage;
            switch (_.info.status) {
              case 1:
                _.btntxt = "活动未开始";
                _.batterytxt = "未通电";
                _.percentage = 0;
                break;
              case 2:
                if (!_.loged) _.btntxt = "请先完成登录/注册";
                else {
                  _.countdown(_.info.reminedtime);
                  _.btntxt = "后可兑换成奖励金";
                }
                if (_.info.chargestatus == 1) {
                  _.batterytxt = "可激活(未通电)";
                  let residue = _.info.musttime - _.info.holdtime;
                  const pad = num =>
                    Math.floor(num)
                      .toString()
                      .padLeft(2, "0");
                  _.chargetimer = `${pad(residue / 36e5) || "00"}:${pad(
                    (residue / 6e4) % 60
                  ) || "00"}:${pad((residue / 1e3) % 60) || "00"}`;
                } else if (_.info.chargestatus == 2) {
                  _.batterytxt = "可激活 (充电中)";
                  if (_.info.musttime - _.info.holdtime > 0) {
                    _._count(_.info.musttime - _.info.holdtime);
                  }
                } else if (_.info.chargestatus == 3) {
                  _.batterytxt = "已激活 (已完成充电任务)";
                  _.percentage = n;
                }
                break;
              case 3:
                _.btntxt = "兑换奖励";
                _.batterytxt = "已激活 (活动已结束)";
                _.percentage = n;
                break;
              case 4:
                _.btntxt = "未激活奖励券 无法兑换";
                _.batterytxt = "未激活 (活动已结束)";
                break;
              case 5:
                _.btntxt = "兑换期已结束";
                _.batterytxt = `${
                  _.info.chargestatus == 3 ? `已` : `未`
                }激活 (活动已结束)`;
                break;
              case 6:
                _.btntxt = "已兑换";
                _.batterytxt = "已激活 (活动已结束)";
                _.percentage = n;
                break;
            }
          } else _.hasdata = 0;
        })
        .catch(e => {
          console.error(e);
          _.toast(e && e.msg);
          _.hasdata = 0;
        });
    },
    checkLogin(call = () => {}) {
      let _ = this;
      if (_.loged) call();
      else {
        _.confirm({
          title: "登录提示",
          msg: "请登录后重试~",
          okText: "前往登录",
          cancelText: "容我想想",
          ok: () => {
            _.javascriptBridge({
              name: "callAppLoginPage",
              params: { callbackname: "_appLoginCallback" }
            });
          }
        });
      }
    },
    getversion(call = () => {}) {
      let _ = this;
      //  判断APP 版本
      let UrlParam = JSON.parse(decodeURIComponent(getUrlParam("param")));
      console.log("地址栏参数", UrlParam);
      if (UrlParam && UrlParam.version) {
        if (UrlParam.version < "3.7.6") _.toast("请更新斗牛最新版本APP");
        else call();
      }
    },
    getPrice() {
      let _ = this;
      switch (_.info.status) {
        case 2:
        case 4:
          _.checkLogin();
          break;
        case 3:
          _.checkLogin(() => {
            ExChange({ code: _.code })
              .then(res => {
                _.showModal = true;
                _.ModalType = 1;
                _.info.status = 6;
                _.btntxt = "已兑换";
              })
              .catch(e => {
                console.error(e);
                _.toast((e && e.msg) || "兑换失败");
              });
          });
          break;
        case 6:
          _.checkLogin(() => {
            _.showModal = true;
            _.ModalType = 2;
          });
          break;
      }
    },
    check(type) {
      let _ = this;
      if (type == 0) _.showModal = false;
      else if (type == 2) {
        _.showModal = false;
        _.getversion(() => {
          _.javascriptBridge({
            name: "gotoAppUserRewardPage",
            params: {}
          });
        });
      }
    },
    pageload(event) {
      this.$nextTick(() => {
        this.$refs.loadmore.onTopLoaded();
        this.mainreq();
      });
    },
    goToAppDetail(item) {
      // "type":1,#1:尖货竞拍 2:闪电发货
      // 闪电发货 to c2c gotoAppSneakerDetailPage 详情 尖货团购 to gotoAppCouponTradePage
      console.log("item--", item);
      let _ = this;
      if (!item.productid) return;
      if (_.onoff) {
        _.onoff = false;
        setTimeout(() => {
          _.onoff = true;
        }, 1000);
        if (item.type == 2) {
          _.javascriptBridge({
            name: "gotoAppSneakerDetailPage",
            params: {
              productid: item.productid
            }
          });
        } else if (item.type == 1) {
          _.javascriptBridge({
            name: "gotoAppCouponTradePage",
            params: {
              productid: item.productid,
              size: item.size
            }
          });
        }
      }
    },
    _count(next) {
      let _ = this,
        cd = "";
      if (next > 0) {
        const pad = num =>
          Math.floor(num)
            .toString()
            .padLeft(2, "0");
        _.chargetimer = `${pad(next / 36e5) || "00"}:${pad((next / 6e4) % 60) ||
          "00"}:${pad((next / 1e3) % 60) || "00"}`;
        next -= 1000;
        _.percentage = ((_.info.musttime - next) / _.info.musttime) * 100;
        _.percentage = _.percentage > 97 ? 97 : _.percentage;
        clearcd = setTimeout(() => {
          _._count(next);
        }, next > 0 ? 1000 : 0);
      } else {
        _.chargetimer = "00:00:00";
        clearTimeout(clearcd);
        _.mainreq();
      }
    },
    countdown(next) {
      let _ = this,
        cd = "";
      if (next > 0) {
        const pad = num =>
          Math.floor(num)
            .toString()
            .padLeft(2, "0");
        _.cd = `${pad(next / 36e5) || "00"}:${pad((next / 6e4) % 60) ||
          "00"}:${pad((next / 1e3) % 60) || "00"}`;
        next -= 1000;
        cleartimer = setTimeout(() => {
          // console.log(_.cd);
          _.countdown(next);
        }, next > 0 ? 1000 : 0);
      } else {
        _.cd = "00:00:00";
        clearTimeout(cleartimer);
        _.mainreq();
      }
    }
  },
  destroyed() {
    document.body.classList.remove("lock");
    document.body.classList.remove("bg-color");
  }
};
</script>
<style>
body.bg-color {
  min-height: 100vh;
  background: #373948 !important;
}
body.bg-color .mint-loadmore-content {
  background: #fff;
}
</style>
<style scoped lang='scss'>
.mint-loadmore-content {
  transform: none !important;
  background: #fff;
}
.mint-loadmore-content {
  height: 100%;
}
// .mint-loadmore {
//   background: none;
// }
.ipx {
  padding-bottom: 9.066vw;
}
.poosition {
  height: 100%;
  background: #373948 url("https://files.eyee.com/eyeeh5/img/charge/banner.png")
    0 0 no-repeat;
  background-size: 100% auto;
  padding-top: 67.2vw;
  .content {
    //
    height: 100%;
    padding: 0 5.0666vw 20vw;

    .bg {
      position: relative;
      &::before,
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 52.8vw;
        background: url("https://files.eyee.com/eyeeh5/img/charge/border_bg01.jpg")
          0 0 no-repeat;
        background-size: 100% auto;
        z-index: 2;
      }
      &::after {
        left: 0;
        top: auto;
        width: 100%;
        height: 12vw;
        bottom: 0;
        background: url("https://files.eyee.com/eyeeh5/img/charge/border_bg03.jpg")
          0 0 no-repeat;
        background-size: 100% auto;
      }
      .pull-bg {
        position: absolute;
        width: 100%;
        left: 0;
        top: 51.8vw;
        bottom: 11.8vw;
        background: url("https://files.eyee.com/eyeeh5/img/charge/border_bg02.jpg")
          center center no-repeat;
        background-size: 100% 100%;
        z-index: 1;
      }
      .icon {
        position: absolute;
        width: 100%;
        height: 6.933vw;
        left: 0;
        top: 3.466vw;
        z-index: 5;
        color: #fff;
        top: -3.4666vw;
        &::before,
        &::after {
          content: "";
          position: absolute;
          left: -4vw;
          top: 0;
          width: 6.933vw;
          height: 6.933vw;
          background: url("https://files.eyee.com/eyeeh5/img/charge/icon_01.png")
            0 0 no-repeat;
          background-size: 100% auto;
        }
        &::after {
          content: "";
          left: auto;
          right: -4.3vw;
          background: url("https://files.eyee.com/eyeeh5/img/charge/icon.png") 0
            0 no-repeat;
          background-size: 100% auto;
        }
      }
    }
    .charge {
      margin-bottom: 5.333vw;
      padding: 8vw 4.333vw;
      .prd {
        width: 100%;
        padding: 5.6vw 4vw 4.8vw 5.6vw;
        background: url("https://files.eyee.com/eyeeh5/img/charge/card_bg.png")
          0 0 no-repeat;
        background-size: 100% 100%;
        position: relative;
        margin-bottom: 7.2vw;
        z-index: 3;
        &.act {
          background: url("https://files.eyee.com/eyeeh5/img/charge/card_red.png")
            0 0 no-repeat;
          background-size: 100% 100%;
        }
        .pic {
          width: 24vw;
          height: 24vw;
          box-shadow: 0 0 3px #e3d37d;
        }
        .price {
          height: 24vw;
          color: #232323;
          font-size: 3.2vw;
          font-family: "OswaldBold";
          position: relative;
          top: 2.1333vw;
          .txt {
            margin-bottom: 1.8666vw;
            font-family: "思源黑体 CN Bold Bold";
          }
          .cur-price {
            width: 100%;
            font-weight: bold;
            span {
              font-size: 5.33vw;
              position: relative;
              top: -2px;
            }
          }
        }
        .name {
          position: absolute;
          font-size: 3.733vw;
          color: #fff;
          font-family: Arial, Helvetica, sans-serif;
          font-weight: bold;
          right: 8vw;
          top: 1.5vw;
          width: 50%;
        }
      }
      .battery {
        height: 11.733vw;
        background: url("https://files.eyee.com/eyeeh5/img/charge/battery.png")
          0 0 no-repeat;
        background-size: 100% 100%;
        font-size: 3.733vw;
        color: #fff;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bold;
        position: relative;
        margin-bottom: 4vw;
        z-index: 3;
        span {
          position: relative;
          z-index: 2;
        }
        .progress-bar {
          position: absolute;
          height: 10.733vw;
          left: 2px;
          top: 2px;
          z-index: 1;
          background: linear-gradient(
            180deg,
            rgba(170, 223, 38, 1) 0%,
            rgba(49, 158, 24, 1) 100%
          );
        }
      }
      .introduce {
        color: #c6b2bd;
        font-size: 3.2vw;
        position: relative;
        z-index: 3;
        span {
          position: relative;
          &::before,
          &::after {
            content: "";
            position: absolute;
            width: 1.33vw;
            height: 1.33vw;
            background: #c6b2bd;
            left: -3vw;
            top: 50%;
            transform: translateY(-50%) rotate(-45deg);
          }
          &::after {
            left: auto;
            right: -3vw;
          }
        }
      }
    }
    .charge-condition {
      margin-bottom: 5.333vw;
      padding: 8vw 10.933vw 10.6vw;
      .title {
        color: #fff;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bold;
        font-size: 4.266vw;
        position: relative;
        z-index: 3;
        margin-bottom: 6.933vw;
      }
      .list {
        position: relative;
        z-index: 3;
        .item {
          width: 29.866vw;
          background: url("https://files.eyee.com/eyeeh5/img/charge/prd_bg.png")
            0 0 no-repeat;
          background-size: 100% 100%;
          position: relative;
          margin-bottom: 7vw;
          .name {
            width: 100%;
            height: 8vw;
            color: #fff;
            font-weight: bold;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 3.733vw;
            margin-bottom: 2.133vw;
          }
          img {
            display: block;
            width: 16vw;
            height: 16vw;
          }
          .num {
            color: #232323;
            font-weight: bold;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 3.733vw;
            margin: 2.66vw auto 3.733vw;
          }
        }
      }
    }
    .act-rule {
      margin-bottom: 9.866vw;
      overflow: hidden;
      color: #fafcff;
      //
      font-family: "思源黑体 CN Regular";
      font-size: 3.2vw;
      padding: 0 8vw 13.6vw;
      .title {
        position: relative;
        z-index: 3;
        color: #fff;
        font-size: 4.266vw;
        margin: 6.666vw auto 2.666vw;
        font-weight: bold;
      }
      p {
        position: relative;
        z-index: 3;
        line-height: 24px;
        letter-spacing: 1px;
        &.zhu {
          margin-top: 9.333vw;
        }
      }
    }
  }
}
._but {
  background: #373948;
  font-size: 4.8vw;
  font-weight: bold;
  position: fixed;
  padding: 4.533vw 9.33vw 5.33vw;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  .cot {
    width: 100%;
    height: 14.66vw;
    background: url("https://files.eyee.com/eyeeh5/img/charge/but_01.png") 0 0
      no-repeat;
    background-size: 100% 100%;
    color: #363a48;
    &.act {
      background: url("https://files.eyee.com/eyeeh5/img/charge/but_02.png") 0 0
        no-repeat;
      background-size: 100% 100%;
    }
  }
}
.modal {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: transparent;
  transition: background 0.2s ease-in;
  pointer-events: none;
  z-index: 10;
  &.act {
    pointer-events: unset;
    background: rgba(0, 0, 0, 0.8);
    .cont {
      transform: translate(-50%, -50%);
    }
  }
  .cont {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-100vh);
    height: 69.33vw;
    width: 86.666vw;
    background: url("https://files.eyee.com/eyeeh5/img/charge/modal_bg.png?c=1")
      0 0 no-repeat;
    background-size: 100% auto;
    padding: 10.66vw 10.66vw 12.266vw;
    transition: transform 0.2s ease-in;
    .tit {
      font-size: 5.33vw;
      color: #fff;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
      margin-bottom: 3.733vw;
    }
    p {
      margin-bottom: 11.733vw;
      color: #fff;
      font-size: 4.266vw;
      line-height: 24px;
    }
    .btn {
      width: 100%;
      height: 12.8vw;
      font-size: 4.8vw;
      color: #fff;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
      background: linear-gradient(
        180deg,
        rgba(255, 167, 2, 1) 0%,
        rgba(255, 110, 1, 1) 100%
      );
    }
  }
}
</style>

