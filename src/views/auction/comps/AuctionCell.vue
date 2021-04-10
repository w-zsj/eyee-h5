<template>
  <div class="acn-cell" @click="handleClick">
    <div class="acnc-top">
      <div class="acnc-img">
        <img :src="info.imageurl" alt />
        <!-- 3 已截拍，5 成交， -->
        <div class="acnc-mask" :class="css.mask" v-if="css.mask"></div>
      </div>
      <!-- 直播中 -->
      <template v-if="info.livestatus==2&&info.status!=2">
        <span class="live-img"></span>
      </template>
      <!-- 1 设置提醒，2 竞拍中起拍价，4 待付款，6 超时未付款 -->
      <template v-if="joined">
        <div class="acnc-tip" :class="css.tip" v-if="cd&&(info.status==4||info.status==6)">
          <span>支付剩余时间</span>
          <span>{{cd}}</span>
        </div>
      </template>
      <template>
        <!-- 设置提醒 -->
        <div
          class="acnc-tip flex-center"
          :class="css.tip"
          v-if="info.status==1&&!noremind ||joined&&info.ispreshow"
          @click.stop="setRemind"
        >
          <!-- <i class="ico-ok white" v-if="loged&&info.remind"></i> -->
          <img
            v-lazy="'https://files.eyee.com/mcdn/img/auction/selected_small.png'"
            alt
            v-if="loged&&info.remind"
          />
          <img v-lazy="'https://files.eyee.com/mcdn/img/auction/alarm_small.png'" alt v-else />
          <span>{{css.tipTxt}}</span>
        </div>
        <!-- 其他文言 -->
        <div v-else-if="joined" :class="css.flag" class="acnc-flag">
          <span>{{css.flagTxt}}</span>
        </div>
        <template v-else-if="info.status==2">
          <template v-if="!info.remaintime || enter=='detailpage'">
            <div class="acnc-flag flag-price">
              <span>起拍价¥{{info.initbid}}</span>
            </div>
            <span v-if="info.livestatus==2" class="live-img live02"></span>
          </template>
          <template v-else>
            <div class="acnc-tip tip-grey">
              <span>即将截拍</span>
              <span>{{cd}}</span>
            </div>
            <span v-if="info.livestatus==2" class="live-img"></span>
          </template>
        </template>
      </template>
    </div>
    <div class="acnc-info">
      <p :class="{ellipsis:!dbline,'ellipsis-2':dbline}">
        <img
          class="good"
          v-lazy="'https://files.eyee.com/mcdn/img/auction/good_title.png'"
          v-if="info.iscooperativeseller"
        />
        {{info.name}}
      </p>
      <div class="info-bot">
        <p class="del sell font-price" v-if="info.marketprice && info.status!=3">
          <i>¥</i>
          {{info.marketprice}}
        </p>
        <p class="acnc-price">
          <span>¥</span>
          <span class="font-price">{{info.currentbid||info.initbid||0}}</span>
        </p>
        <p class="acnc-sub flex">
          <!-- "quality":"1",//鞋子成色 0-全新瑕疵 1-9成新 2-全新闲置（拍卖3.1新增） -->
          <span>
            <span>
              {{info.quality==0?'全新瑕疵':info.quality==1?'9成新':info.quality==2?'全新闲置':''}}
              <i
                v-if="info.quality>=0"
              >•</i>
            </span>
            {{info.size}}码
          </span>
          <!-- <span>{{info.size}}码·{{info.onlookers||0}}人围观</span> -->
          <!-- 收藏 -->
          <span class="save" @click.stop="collection" v-if="!enter">
            <img :src="info.iswant?'//files.eyee.com/mcdn/img/auction/icon_star_selected.png':'//files.eyee.com/mcdn/img/auction/icon_star_unselected.png'" />
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { SetRemind, IsWant } from "@/utils/api/auction";
let cleartimer = null;
export default {
  name: "AuctionCell",
  props: {
    info: Object,
    dbline: Boolean, // 两行名称
    joined: Boolean, // 我参与的列表
    loged: Boolean, // 是否登录
    noremind: Boolean, // 是否显示设置提醒
    type: Number, // 参与页面 当前处于tab类型
    enter: String
  },
  data() {
    return {
      css: {},
      cd: ""
      // isshowtime: false
    };
  },
  watch: {
    "info.auctiongoodid": {
      handler: function(val, oldval) {
        this.int();
      },
      deep: true
    }
  },
  beforeMount() {
    this.int();
  },
  methods: {
    int() {
      // console.log("AuctionCell", this.info);
      //  if (cleartimer) clearTimeout(cleartimer);
      let _ = this,
        { status, remind, payovertime } = _.info || {},
        css = {
          flag: "",
          flagTxt: "",
          tip: "",
          tipTxt: "",
          mask: ""
        },
        cd = "";
      // _.info.status = 2;
      switch (status) {
        case 1:
          // if (_.loged && remind) {
          //   css.flagTxt = "已设置提醒";
          //   css.flag = "flag-grey";
          // } else {
          //   css.flagTxt = "开始提醒我";
          //   css.flag = "flag-red";
          //   css.tip = "tip-red";
          // }
          if (_.loged && remind) {
            css.tip = "tip-grey";
            css.tipTxt = "已设置提醒";
          } else {
            css.tip = "tip-red";
            css.tipTxt = "开始提醒我";
          }
          break;
        case 2:
          css.flagTxt = "竞拍中";
          css.flag = "flag-price";

          // _.info.remaintime = 12111;

          if (_.info.remaintime && _.info.remaintime > 0) {
            if (cleartimer) clearTimeout(cleartimer);
            setTimeout(() => {
              _.countdown(_.info.remaintime, 1);
            }, 10);
          }

          break;
        case 3:
          css.mask = "over";
          break;
        case 4:
          css.flagTxt = "待支付";
          css.flag = "flag-price";
          css.tip = "tip-red";

          // 倒计时
          // cd = "18:46:31";
          // payovertime = 3456;
          if (cleartimer) clearTimeout(cleartimer);
          setTimeout(() => {
            _.countdown(payovertime);
          }, 10);

          break;
        case 5:
          css.mask = "dealed";
          break;
        case 6:
          css.flagTxt = "超时未付款";
          css.flag = "flag-price";
          css.tip = "tip-grey";

          _.cd = "00:00:00";
          break;
        default:
          if (_.info.ispreshow) {
            if (_.loged && remind) {
              css.tip = "tip-grey";
              css.tipTxt = "已设置提醒";
            } else {
              css.tip = "tip-red";
              css.tipTxt = "开始提醒我";
            }
          }
          break;
      }
      _.css = css;
    },
    countdown(next, type = 0) {
      let _ = this;
      if (next > 0) {
        const pad = num =>
          Math.floor(num)
            .toString()
            .padLeft(2, "0");
        if (type == 1) {
          _.cd = `${pad((next / 6e4) % 60) || "00"}:${pad((next / 1e3) % 60) ||
            "00"}:${Math.floor((next % 1e3) / 100) || "0"}`;
        } else {
          _.cd = `${pad(next / 36e5) || "00"}:${pad((next / 6e4) % 60) ||
            "00"}:${pad((next / 1e3) % 60) || "00"}`;
        }
        next -= type ? 100 : 1000;
        cleartimer = setTimeout(
          () => {
            _.countdown(next, type);
          },
          next > 0 ? (type ? 100 : 1000) : 0
        );
      } else {
        _.cd = `00:00:0${type ? `` : `0`}`;
        if (type) {
          setTimeout(() => {
            _.$emit("updatecounttime", "update");
          }, 10);
        } else {
          _.status = 6;
          _.css.flagTxt = "超时未付款";
          _.css.flag = "flag-price";
          _.css.tip = "tip-grey";
        }
      }
    },
    collection() {
      let _ = this,
        { auctiongoodid, iswant } = _.info || {};
      iswant = iswant ? 0 : 1 || 0;
      console.log(_.info);
      _.checkloge(() => {
        IsWant(auctiongoodid, iswant)
          .then(res => {
            if (_.joined && _.type == 1) {
              _.$emit("delclick", auctiongoodid);
            } else {
              _.$set(_.info, "iswant", iswant);
              _.$emit("recdsave", { auctiongoodid, iswant });
            }
          })
          .catch(e => {
            if (e && e.code === 1511404) _.toast(e.msg + "~暂无法收藏");
            console.error("收藏失败", e);
          });
      });
    },
    setRemind() {
      let _ = this,
        status = 0,
        { auctiongoodid, remind } = _.info || {};
      status = remind ? 0 : 1;
      _.checkloge(() => {
        SetRemind(auctiongoodid, status)
          .then(res => {
            if (status) {
              _.info.remind = true;
              _.css.tip = "tip-grey";
              _.css.tipTxt = "已设置提醒";
            } else {
              _.info.remind = false;
              _.css.tip = "tip-red";
              _.css.tipTxt = "开始提醒我";
            }

            // _.toast("操作成功~");
          })
          .catch(e => {
            console.error("SetRemind error: ", e);
            _.toast("操作失败~");
          });
      });
    },
    checkloge(callback) {
      let _ = this;
      if (_.loged) callback();
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
    handleClick() {
      let _ = this,
        { auctiongoodid } = _.info || {};
      if (_.enter == "mallpage") {
        this.loadApp("请前往【斗牛DoNew】APP参与活动~");
      } else if (auctiongoodid) {
        if (ENV.ua.mini) {
          wx.miniProgram.redirectTo({
            url: `/pages/auction/detail?auctiongoodid=${auctiongoodid}&channel=${
              _.joined ? `0` : `1`
            }`
          });
        } else {
          _.$emit("handleLog", auctiongoodid);
          _.$router.push(
            `/auction/detail/${auctiongoodid}?channel=${_.joined ? `0` : `1`}`
          );
        }
      } else {
        console.error("没有auctiongoodid");
      }
    }
  }
};
</script>
<style lang="scss">
$red: rgba(0, 0, 0, 0.5);
$grey: rgba(100, 100, 100, 0.7);
.acn-cell {
  min-height: 30vw;
  color: #232323;
  border-radius: 1.6vw;
  overflow: hidden;
  position: relative;

  .acnc-mask {
    position: absolute;
    top: 2.2vw;
    right: 2.2vw;
    width: 13.066vw;
    height: 13.066vw;
    pointer-events: none;

    &.over{
      background: url("//files.eyee.com/mcdn/img/auction/image_cutting.png")
        0 0 no-repeat;
      background-size: cover;
    }
    &.dealed {
      background: url("//files.eyee.com/mcdn/img/auction/image_deal.png")
        0 0 no-repeat;
      background-size: cover;
    }
  }

  .acnc-top {
    position: relative;
    border-radius: 3.2vw;
    overflow: hidden;
  }
  .acnc-img {
    position: relative;
    padding-bottom: 100%;
    overflow: hidden;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.05)
    }

    img {
      position: absolute;
      max-width: unset;
      width: 101%;
      height: 100%;
      top: 50%;
      left: -0.5%;
      transform: translateY(-50%);
    }
  }
  .live-img {
    position: absolute;
    width: 14.4vw;
    height: 4.8vw;
    top: 2.133vw;
    left: 2.133vw;
    background: url("//files.eyee.com/mcdn/img/auction/image_video.png") no-repeat 0 0;
    background-size: contain;
  }
  .live02 {
    top: 8.533vw;
  }
  .acnc-flag {
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
    font-size: 3.2vw;
    font-weight: 600;
  }
  .flag-price {
    background: rgba(0, 0, 0, 0.5);
    padding: 0 2.133vw;
    line-height: 6.4vw;
    text-align: center;
    border-radius: 3.2vw 0px 3.2vw 0px;
    transform: scale(0.95);
  }
  .flag-red {
    $bg: $red;
    padding-right: 4.267vw;
    background: linear-gradient(
      105deg,
      $bg 82%,
      $bg 86.5%,
      $bg 88%,
      transparent 90%
    );
  }
  .flag-black {
    $bg: $grey;
    // padding-right: 4.267vw;
    background: rgba(100, 100, 100, 0.5);
    // background: linear-gradient(
    //   105deg,
    //   $bg 82%,
    //   $bg 86.5%,
    //   $bg 88%,
    //   transparent 90%
    // );
  }
  .flag-grey {
    $bg: $grey;
    padding-right: 4.267vw;
    background: linear-gradient(
      105deg,
      $bg 86%,
      $bg 89.5%,
      $bg 90.5%,
      transparent 92%
    );
  }

  .acnc-tip {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    line-height: 8vw;
    color: #fff;
    font-size: 2.933vw;
    font-weight: 600;
    text-align: center;
    span {
      transform: scale(0.98);
    }
    img {
      width: 3.2vw;
      margin-right: 1.6vw;
    }

    .ico-ok {
      margin-right: 1.067vw;
      background: #fff;
      color: $grey;
    }
  }
  .tip-red {
    background-color: #505050;
  }
  .tip-grey {
    background-color: #505050;
  }

  .acnc-info {
    height: 26.267vw;
    margin: 2.667vw 1.334vw 3vw;
    font-size: 3.2vw;
    font-weight: 400;
    line-height: 4.533vw;
    position: relative;
    .good {
      width: 7vw;
      display: inline-block;
      position: relative;
      top: 0.6vw;
    }
    .ellipsis-2 {
      height: 9.6vw;
      margin-bottom: 0.533vw;
      line-height:  4.8vw;
      font-size: 3.466vw;
    }
  }
  .info-bot {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .del {
    transform: scale(0.9);
    margin-left: -2.1vw;
    font-size: 3.733vw;
    i {
      font-size: 2.667vw;
    }
  }
  .acnc-price {
    line-height: 5vw;
    position: relative;
    top: 2px;
    font-size: 3.7333vw;
    text-align: left;
    font-family: "OswaldBold";
    .font-price {
      font-size: 4.8vw;
      margin-right: 2.4vw;
    }
    span:first-of-type {
      font-size: 3.733vw;
      font-family: "OswaldBold";
    }
  }
  .acnc-sub {
    color: $grey;
    flex-direction: colunm;
    align-items: flex-end;
    justify-content: space-between;
    // i {
    //   transform: scale(0.5);
    //   display: inline-block;
    // }
    .save {
      width: 5.8666vw;
      img {
        display: block;
      }
    }
  }
}
</style>
