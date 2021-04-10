<template>
  <div class="app midyear-lottery">
    <!-- banner  @click="stop" -->
    <img v-lazy="'https://files.eyee.com/activity/2019618/lottery-banner.jpg'" alt>
    <!-- lottery -->
    <div class="draw flex-wrap" v-if="prizes.length">
      <template v-for="(pi, pIdx) in prizes">
        <div
          v-if="pIdx == 4"
          :key="pIdx+'drawbtn'"
          class="flex-col flex-center prize draw"
          @click="draw"
        >
          <img src="https://files.eyee.com/activity/2019618/draw.png" alt>
          <span>剩余{{times}}次</span>
        </div>
        <div :key="pIdx" class="prize" :class="{act:actIdx==pi.rollIdx}">
          <img :src="pi.prizepic" alt>
        </div>
      </template>
    </div>
    <!-- share -->
    <div class="share">
      <div class="flex-center" @click="share">
        <img v-lazy="'https://files.eyee.com/activity/2019618/share.png'" alt>
      </div>

      <p>分享之后可额外再获得1次机会~(剩余{{+judgefirst}}次)</p>
    </div>
    <!-- record -->
    <div class="record">
      <img v-lazy="'https://files.eyee.com/activity/2019618/record.png'" alt>
      <div>
        <template v-if="records&&records.length>0">
          <div v-for="(ri, rIdx) in records" :key="'record'+rIdx" class="flex-between record-cell">
            <span>{{ri.prizename+(ri.prizetype==1?'':' 优惠券')}} ×{{ri.prizenum}}</span>
            <span
              class="btn"
              :class="{get:ri.prizetype==1&&!ri.isget,geted:ri.prizetype==1&&ri.isget}"
              @click="checkPrize(ri)"
            >{{ri.prizetype==1?(ri.isget?'已领取':'立即领取'):'查看'}}</span>
          </div>
        </template>
        <p v-else>空空如也~还未中过奖哦</p>
      </div>
    </div>
    <!-- rule -->
    <div class="rule">
      <p>1、活动时间：6.18-6.23</p>
      <p>2、每个账户每日有一次免费抽奖机会，转发分享成功即可额外获得1次机会</p>
      <p>3、优惠券奖品实时发放至个人账户</p>
      <p>4、实物奖品根据页面提示填写相关信息后会有工作人员联系您并发出。</p>
      <p>5、活动最终解释权归斗牛所有。</p>
      <p>6、本次活动由斗牛发起，与Apple.Inc无关。</p>
      <p>7、苹果公司不是本活动的赞助商且没有以任何形式参与活动。</p>
      <p>8、本活动仅限17岁以上用户参与。</p>
    </div>
    <!-- foot -->
    <v-delay :delay="300" class="foot flex-center">
      <img v-lazy="'https://files.eyee.com/activity/2019618/foot.png'" alt>
    </v-delay>

    <div class="fix-modal" :class="{act:modalType>0}">
      <div class="box">
        <img class="modal-ico" src="https://files.eyee.com/activity/2019618/modal-ico.png" alt>
        <div class="main">
          <template v-if="modalType==1||modalType==2">
            <p class="subtitle">:-{{modalType==1?')':'('}}...</p>
            <p class="title">{{modalType==1?'今日抽奖次数已用完！':'没转到奖品啊…'}}</p>
            <p class="hint">明天换个姿势再来吧~</p>
          </template>
          <template v-else-if="modalType==3">
            <p class="subtitle">{{lucky.subtitle}}</p>
            <p class="title" v-html="lucky.title"></p>
            <p class="hint">{{lucky.hint}}</p>
            <div class="flex-center btn ylo" v-if="lucky.btn" @click="modalHandle">
              <img :src="`https://files.eyee.com/activity/2019618/${lucky.btn}.png`" alt>
            </div>
          </template>
          <template v-else-if="modalType==4">
            <p class="subtitle" v-html="lucky.subtitle+lucky.title"></p>
            <p class="hint">请先完善您的领取信息</p>
            <div class="form">
              <div class="row">
                <label for="name" class="flex-between">
                  姓名
                  <input id="name" name="name" type="text" maxlength="26" v-model="form.name">
                </label>
              </div>
              <div class="row">
                <label for="mobile" class="flex-between">
                  手机号
                  <input
                    id="mobile"
                    name="mobile"
                    type="number"
                    maxlength="11"
                    v-model="form.phone"
                  >
                </label>
              </div>
              <div class="row">
                <label for="addr" class="flex-between">
                  收货地址
                  <input id="addr" name="addr" type="text" v-model="form.address">
                </label>
              </div>
              <div class="flex-center btn ylo" @click="modalHandle">
                <img :src="`https://files.eyee.com/activity/2019618/go2.png`" alt>
              </div>
            </div>
          </template>
        </div>
        <i class="ico-X" @click="closeModal"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  LotteryInfo,
  LotteryInfoOpen,
  LotteryDraw,
  LotteryDrawInfo,
  LotteryShare,
  LotteryAddr
} from "@/utils/api/activities";

let memberTimer = null,
  drawing = false;

const dealLucky = res => {
  res.subtitle = res.isget ? "您已领取" : "恭喜您获得";
  res.title =
    res.prizename +
    "<span style='font-size:80%'>" +
    (res.prizetype == 1 ? " 1件！" : "<br>优惠券1张！") +
    "</span>";
  switch (res.prizetype) {
    case 2:
      res.hint = "请前往[个人中心]-[我的卡券]页面查看。";
      res.btn = "go4";
      break;
    case 1:
      if (res.isget) {
        res.hint = "实物奖品将在活动结束后的7个工作日内统一为您邮寄。";
      } else {
        res.hint = "请先完善您的领取信息。";
        res.btn = "upd";
      }
      break;
    default:
      break;
  }
  return res;
};

export default {
  name: "MidyearLottery",
  data() {
    return {
      prizes: [],
      actIdx: -1,

      times: 1,
      judgefirst: 1,

      records: [],

      shareInfo: {},

      lucky: {},
      modalType: 0, // 0 隐藏，1 没次数，2 没中奖，3 中奖结果，4 完善信息

      form: {
        name: "",
        phone: "",
        address: ""
      }
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    nologin() {
      return !(this.user && this.user.token);
    }
  },
  mounted() {
    let _ = this;
    _.getInfo();
    if (!_.nologin) {
      _.getDrawInfo();
    }

    window._shareCallBack = function(res, via) {
      // if (res == 1) _.shareCall();
    };

    window._loginCallBack = json => {
      var result;
      if (json) result = JSON.parse(decodeURIComponent(json));
      _.$store.dispatch("setUserInfo", result);
      window.location.reload();
    };
  },
  destroyed() {
    document.body.classList.remove("lock");
  },
  methods: {
    goApp() {
      this.confirm({
        title: "",
        msg: "请在「斗牛DoNew」APP中参与活动~",
        cancelText: "我再想想",
        okText: "立即前往",
        ok: () => {
          this.sceneLoad();
          // window.open('http://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee', '_blank');
        }
      });
    },
    getInfo() {
      let _ = this,
        prizes = [],
        req = _.nologin ? LotteryInfoOpen : LotteryInfo;

      req()
        .then(res => {
          console.log("getInfo res: ", res);
          if (res) {
            if (res.drawPrizes && res.drawPrizes.length) {
              res.drawPrizes.forEach((i, idx) => {
                i.rollIdx = idx;
                let posIdx;
                switch (idx) {
                  case 3:
                    posIdx = 4;
                    break;
                  case 4:
                    posIdx = 7;
                    break;
                  case 5:
                    posIdx = 6;
                    break;
                  case 6:
                    posIdx = 5;
                    break;
                  case 7:
                    posIdx = 3;
                    break;
                  default:
                    posIdx = idx;
                    break;
                }
                prizes[posIdx] = i;
              });
              _.prizes = prizes;
            }
            // _.prizes = res.drawPrizes.map((i, idx) => {
            //   switch (idx) {
            //     case 3:
            //       i.rollIdx = 7;
            //       break;
            //     case 4:
            //       i.rollIdx = 3;
            //       break;
            //     case 5:
            //       i.rollIdx = 6;
            //       break;
            //     case 6:
            //       i.rollIdx = 5;
            //       break;
            //     case 7:
            //       i.rollIdx = 4;
            //       break;
            //     default:
            //       i.rollIdx = idx;
            //       break;
            //   }
            //   return i;
            // });
            if (res.drawLogs && res.drawLogs.length) _.records = res.drawLogs;

            if (res.share) {
              _.shareInfo = res.share;
              let { title, content, icon, url } = res.share;
              _.setToolBar({
                title: title + content,
                bgcolor: "#d72743",
                textcolor: "#fcf7ea"
              });
              if (_.$root.ISAPP) {
                _.javascriptBridge({
                  name: "getAppActivityShareContent",
                  params: {
                    sharetitle: title,
                    sharecontent: content,
                    sharepicurl: icon,
                    shareurl: url,
                    hideshareicon: false
                  }
                });
              } else {
                _.initShare({
                  type: 2,
                  info: { title, url, img: icon, desc: content }
                });
              }
            }
          }
        })
        .catch(e => {
          console.error("getInfo error: ", e);
          _.toast("抽奖信息初始化失败~");
        });
    },
    getDrawInfo() {
      let _ = this;
      LotteryDrawInfo()
        .then(res => {
          console.log("getDrawInfo res: ", res);
          _.times = res.drawtimes || 0;
          _.judgefirst = res.judgefirst;
        })
        .catch(e => {
          console.error("getDrawInfo error: ", e);
        });
    },
    share() {
      let _ = this,
        { title, content, icon, url } = _.shareInfo;

      if (!_.$root.ISAPP) {
        _.goApp();
        return;
      }

      if (_.nologin) {
        if (_.$root.ISAPP)
          _.javascriptBridge({
            name: "callAppLoginPage",
            params: { callbackname: "_loginCallBack" }
          });
        else _.$router.push("/login");
        return;
      }

      _.javascriptBridge({
        name: "callAppShareDialog",
        params: {
          sharecontent: content,
          sharetitle: title,
          shareurl: url,
          sharepicurl: icon,
          callbackname: "_shareCallBack"
        }
      });
      // 首次分享
      if (_.judgefirst == 1) _.shareCall();

      // 模拟分享成功
      // window._shareCallBack(1);
    },
    shareCall() {
      let _ = this;
      LotteryShare()
        .then(res => {
          console.log("shareCall res: ", res);
          _.times = res.drawtimes || 0;
          _.judgefirst = 0;
        })
        .catch(e => {
          console.error("shareCall error: ", e);
        });
    },
    draw() {
      let _ = this,
        { prizes } = _;

      if (!_.$root.ISAPP) {
        _.goApp();
        return;
      }

      if (_.nologin) {
        if (_.$root.ISAPP)
          _.javascriptBridge({
            name: "callAppLoginPage",
            params: { callbackname: "_loginCallBack" }
          });
        else _.$router.push("/login");
        return;
      }

      if (_.times < 1) {
        _.showModal(1);
        return;
      }

      if (drawing) return;
      drawing = true;

      if (_.actIdx < 0) _.actIdx++;
      _.roll();

      // let res = {
      //   drawtimes: 9999,
      //   prizetype: 1,
      //   prizepic: "https://files.eyee.com/618/black T-shirt.png",
      //   price: 2999,
      //   index: 8,
      //   prizename: " DUSTY × DAVID BOWIE联名T恤"
      // };
      // {
      //   drawtimes: 9999,
      //   prizetype: 2,
      //   prizepic: "https://files.eyee.com/618/20coupon.png",
      //   price: 50,
      //   index: 2,
      //   prizename: " 优惠券 满299减50"
      // };
      LotteryDraw()
        .then(res => {
          console.log("draw res: ", res);
          res.isget = false;
          _.lucky = dealLucky(res);
          // "prizetype":int (0 未中奖;1 实物;2 优惠券),
          setTimeout(() => {
            // prizes[res.index - 1].rollIdx
            _.stopDraw(res.index - 1, 0, () => {
              let mt = 0;
              if (res.prizetype == 2 || res.prizetype == 1) mt = 3;
              else mt = 2;
              _.showModal(mt);

              _.times = res.drawtimes;

              // 刷新中奖记录
              _.getInfo();
            });
          }, 2000);
        })
        .catch(e => {
          console.error("draw error: ", e);
          setTimeout(() => {
            _.stopDraw(0, 1, () => {
              _.toast(e.msg);
              _.actIdx = -1;
            });
          }, 2000);
        });
    },
    roll(interval = 700) {
      let _ = this,
        { prizes, actIdx } = _;
      $timer(function(timer, count) {
        // console.log("interval", interval);
        memberTimer = timer;
        if (interval > 100) {
          if (memberTimer) clearTimeout(memberTimer), (memberTimer = null);
          _.roll(interval - 300);
        }

        actIdx++;
        if (actIdx >= prizes.length) actIdx = 0;
        _.actIdx = actIdx;

        // 暂停计时器, 在 callback 里 clearTimeout
        // clearTimeout(timer)
      }, interval);
    },
    // stop() {
    //   // this.stopDraw(0, () => {
    //   //   console.log("lucky");
    //   // });
    //   let res = {
    //     drawtimes: 9999,
    //     prizeid: 118,
    //     prizetype: 1,
    //     prizepic: "https://files.eyee.com/618/black T-shirt.png",
    //     price: 2999,
    //     index: 8,
    //     prizename: " DUSTY × DAVID BOWIE联名T恤"
    //   };
    //   res.isget = false;
    //   this.lucky = dealLucky(res);
    //   this.showModal(3);
    // },
    stopDraw(idx = 5, immediate = 0, callback = () => {}) {
      let _ = this,
        { prizes, actIdx } = _,
        stopStep = immediate ? 8 : 40, // 停止时 再转5圈(40=8*5) 加 相差索引数
        interval = 100;
      if (memberTimer) clearTimeout(memberTimer), (memberTimer = null);

      stopStep += idx - actIdx;

      const stopRoll = sr => {
        if (sr < 6) interval += 300;

        actIdx++;
        if (actIdx >= prizes.length) actIdx = 0;
        _.actIdx = actIdx;

        sr--;
        if (sr < 1) {
          if (memberTimer) clearTimeout(memberTimer), (memberTimer = null);
          console.log("lucky index", idx, actIdx);
          drawing = false;

          callback();
          return;
        }
        memberTimer = setTimeout(stopRoll, interval, sr);
      };
      stopRoll(stopStep);
    },
    showModal(type) {
      document.body.classList.add("lock");
      this.modalType = type;
    },
    closeModal() {
      document.body.classList.remove("lock");
      this.modalType = 0;
    },
    checkPrize(ri) {
      let _ = this;
      if (ri.prizetype == 2) ri.isget = true;
      _.lucky = dealLucky(ri);
      console.log("sssssssssss", _.lucky);
      _.showModal(3);
    },
    modalHandle() {
      let _ = this,
        { lucky, modalType, form, toast } = _;
      switch (modalType) {
        case 3: // 中奖结果
          if (lucky.btn == "go4") {
            if (_.$root.ISAPP)
              _.javascriptBridge({ name: "gotoAppRedPacketCouponPage" });
            else _.$router.push("/user/coupon");
          } else if (lucky.btn == "upd") {
            _.showModal(4);
          }
          break;
        case 4: // 完善信息
          let msg = "";
          if (!form.name) msg = "请输入姓名";
          else if (!form.phone) msg = "请输入手机号";
          else if (!/^1[3-9]\d{9}$/.test(form.phone))
            msg = "请输入正确格式的手机号";
          else if (!form.address) msg = "请输入收货地址";

          if (msg) {
            toast(msg);
            return;
          }

          LotteryAddr({ ...form, prizeid: lucky.prizeid })
            .then(res => {
              console.log("LotteryAddr res: ", res);
              toast("领取成功~");
              _.closeModal();
              // 刷新中奖记录
              _.getInfo();
            })
            .catch(e => {
              console.error("LotteryAddr error: ", e);
              toast("操作失败~");
            });

          break;
        default:
          return;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.bg {
  background: #fcfbe6;
  border: 0.4vw solid #100307;
  box-shadow: 0 1.733vw 0 0 rgba(16, 3, 7, 1);
  border-radius: 2.133vw;
}

.midyear-lottery {
  background: #d72743;
  min-height: 100vh;

  img {
    display: block;
  }
}
.draw {
  margin: 4vw;
  background: #fcfbe6;
  border: 0.4vw solid #100307;
  box-shadow: 0 1.733vw 0 0 #100307;
  border-radius: 2.133vw;
  padding: 2.933vw;
}
.prize {
  position: relative;
  width: 25.467vw;
  height: 25.467vw;
  box-shadow: 0 1.2vw 0 0 #171517;
  border-radius: 2.133vw;
  margin: 1.49vw;
  overflow: hidden;

  &.act::after {
    content: "";
    position: absolute;
    display: block;
    top: -2%;
    left: -2%;
    width: 104%;
    height: 104%;
    border: 1.6vw solid;
    border-image: linear-gradient(0deg, #ffa402, #fccb0c) 10 10;
    // background: linear-gradient(0deg, #ffa402 0%, #fccb0c 100%);
    border-radius: 2.133vw;
  }

  &:not(.draw) img {
    width: 100%;
  }

  &.draw {
    background: linear-gradient(0deg, #ffa302 0%, #fccc0c 100%);
    border: 0.4vw solid #171517;
    padding: 2.667vw;

    img {
      width: 83%;
    }

    span {
      font-size: 2.4vw;
      font-weight: 600;
      color: #232323;
      white-space: nowrap;
    }
  }
}

.share {
  margin: 4vw;

  div {
    height: 20vw;
    border: 0.4vw solid #100307;
    background: linear-gradient(0deg, #ffa403 0%, #fccb0c 100%);
    box-shadow: 0 2.267vw 0 0 #100307;
    border-radius: 2.133vw;
  }

  img {
    width: 25.333vw;
  }

  p {
    @extend .bg;
    line-height: 9.333vw;
    font-size: 3.2vw;
    font-weight: 500;
    color: #100307;
    text-align: center;
    margin-top: 4vw;
  }
}

.record {
  margin: 4vw;
  padding-top: 1.333vw;

  img {
    width: 52vw;
    display: block;
    margin: 0 auto 2.667vw;
  }

  & > div {
    @extend .bg;
    padding: 3.333vw 4vw 0;
  }

  p {
    padding-bottom: 3.333vw;
    text-align: center;
    color: #999;
    font-size: 3.467vw;
  }
}

.record-cell {
  margin-bottom: 3.333vw;

  span {
    font-size: 3.2vw;
    font-weight: 500;
    color: #100307;
    line-height: 4.8vw;
  }
  .btn {
    width: 24.533vw;
    line-height: 8vw;
    border: 0.4vw solid #100307;
    background: #fff;
    box-shadow: 0 0.667vw 0 0 #100307;
    border-radius: 2.133vw;
    text-align: center;

    &.get {
      background: linear-gradient(0deg, #ffa403 0%, #fccb0c 100%);
    }
    &.geted {
      background: #c9c9c9;
    }
  }
}

.rule {
  @extend .bg;
  margin: 4vw;
  padding: 6.667vw;

  font-size: 3.2vw;
  font-weight: 500;
  color: #100307;
  line-height: 4.8vw;
}

.foot {
  // background: #e52c41;
  width: 100%;
  height: 22.4vw;

  img {
    width: 33.867vw;
  }
}

.fix-modal {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  transition: background 0.3s ease-in;
  &.act {
    pointer-events: all;
    background: rgba(0, 0, 0, 0.6);

    .box {
      top: 50vh;
    }
  }

  .modal-ico {
    width: 25.6vw;
    margin: -6.133vw auto 0;
  }

  .ico-X {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(40%, -40%);
    background: #fbf9e8;
    border: 0.533vw solid #171517;
    border-radius: 50%;

    &::before,
    &::after {
      border-width: 2px;
    }
  }

  .box {
    position: absolute;
    top: -200vh;
    left: 15vw;
    width: 70vw;
    background: #c2333e;
    border: 1.067vw solid #fbf9e8;
    border-radius: 2vw;
    box-shadow: 3.067vw 3.6vw 0 0 #171517;
    transform: translateY(-65%);
    transition: top 0.3s ease-out;
  }
  .main {
    color: #fbf9e8;
    padding: 4vw 6.667vw;
    max-height: 60vh;
    overflow-y: scroll;
  }

  .subtitle {
    font-weight: 600;
    font-size: 3.733vw;
  }
  .title {
    font-weight: bold;
    font-size: 4.8vw;
    margin: 4vw 0 5.667vw;
  }
  .hint {
    margin-top: 4vw;
    font-size: 2.933vw;
  }

  .btn {
    width: 29.733vw;
    height: 11.6vw;
    margin: 5.333vw auto;
    background: #fff;
    border: 0.267vw solid #171517;
    box-shadow: 0 1.6vw 0 0 #171517;
    border-radius: 1.6vw;
    font-size: 3.2vw;
    font-weight: 600;
    color: #171517;

    &.ylo {
      background: linear-gradient(0deg, #ff9d1d, #ffc90d);
    }

    img {
      width: auto;
      height: 50%;
    }
  }

  .form {
    .row {
      width: 100%;
      line-height: 10.667vw;
      background: #fbf9e8;
      border: 0.267vw solid #171517;
      border-radius: 2.133vw;
      padding: 0.267vw 4vw;
      margin: 3.333vw 0;

      font-size: 3.733vw;
      font-weight: 400;
      color: #100307;
      overflow: hidden;
    }
    // label {
    //   white-space: nowrap;
    // }
    input {
      font-size: 3.733vw;
      height: 10.667vw;
      border: none;
      outline: none;
      background: none;
    }
    input[name="name"] {
      width: 80%;
    }
    input[name="mobile"] {
      width: 72%;
    }
    input[name="addr"] {
      width: 63.8%;
    }
  }
}
</style>
