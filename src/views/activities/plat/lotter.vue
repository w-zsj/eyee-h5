<template>
  <div>
    <div class="lotter" v-if="hasdata">
      <!-- banner -->
      <div class="banner">
        <img src="https://files.eyee.com/mcdn/img/plat/banner.png" alt />
      </div>
      <template>
        <div class="gift">
          <!-- 中奖纪录 -->
          <div class="roll-msg">
            <ul class="lb flex-center flex-wrap" :class="{marquee_top:animate}">
              <li v-for="(item, index) in lotterlist" :key="index" class="ellipsis">{{item.text}}</li>
            </ul>
          </div>
          <div class="cj_box">
            <div v-if="prizelist&&prizelist.length">
              <div class="line_item" :class="{'active':index == 0}">
                <!-- <div class="flex-center">洗碗0</div> -->
                <img :src="prizelist[0].filepath||''" alt />
              </div>
              <div class="line_item" :class="{'active':index == 1}">
                <!-- <div class="flex-center">买菜1</div> -->
                <img :src="prizelist[1].filepath||''" alt />
              </div>
              <div class="line_item" :class="{'active':index == 2}">
                <!-- <div class="flex-center">带孩子2</div> -->
                <img :src="prizelist[2].filepath||''" alt />
              </div>
              <div class="line_item" :class="{'active':index == 7}">
                <!-- <div class="flex-center">做饭7</div> -->
                <img :src="prizelist[7].filepath||''" alt />
              </div>
              <div class="line_item clickbtn flex-center" @click="goLottery()">
                <img
                  src="https://files.eyee.com/mcdn/img/plat/gift_go.png"
                  alt
                  :class="{'big':isscale}"
                />
              </div>
              <div class="line_item" :class="{'active':index == 3}">
                <!-- <div class="flex-center">拖地3</div> -->
                <img :src="prizelist[3].filepath||''" alt />
              </div>
              <div class="line_item" :class="{'active':index == 6}">
                <!-- <div class="flex-center">带孩子6</div> -->
                <img :src="prizelist[6].filepath||''" alt />
              </div>
              <div class="line_item" :class="{'active':index == 5}">
                <!-- <div class="flex-center">待着5</div> -->
                <img :src="prizelist[5].filepath||''" alt />
              </div>
              <div class="line_item" :class="{'active':index == 4}">
                <!-- <div class="flex-center">洗衣服4</div> -->
                <img :src="prizelist[4].filepath||''" alt />
              </div>
            </div>
          </div>
        </div>
        <div class="toshare" @click="gotoshare">
          <img src="https://files.eyee.com/mcdn/img/plat/gift04.png" alt />
        </div>
        <div class="jsh">
          <div class="prompt-share flex-center" @click="gotoshare">分享之后可额外再获得一次机会</div>
          <!-- 记录 -->
          <div class="recording">
            <div v-if="recordlist&&recordlist.length">
              <div class="flex-between list" v-for="(item,indx) in recordlist" :key="indx">
                <div class="ellipsis span">{{item.prizename}}</div>
                <div v-if="(item.isdraw==1&&item.prizetype==3)" class="flex-center hasget">已领取</div>
                <div
                  @click="nowget(item)"
                  class="span"
                  :class="{'now-get':!item.isdraw&&item.prizetype==3}"
                  v-else
                ></div>
              </div>
            </div>
            <div class="flex-center" v-else>空空如也~还未中过奖哦</div>
          </div>
          <!-- 规则 -->
          <div class="rule">
            <p>1. 每人每天赠送一次抽奖机会，转发成功的次数越多，抽到大奖机会越大哦；</p>
            <p>2. 转发分享页面至个人社交平台，成功转发即可额外获得一次抽奖机会，每人每天最多三次抽奖机会；</p>
            <p>3. 虚拟礼品请在个人卡券里查看并使用；</p>
            <p>4. 实物奖品中奖后在12月19日前陆续发出,并短信通知；</p>
            <p>5. 活动时间:2019.12.10 - 2019.12.12。</p>
          </div>

          <!-- 页尾 -->
          <div class="footer">
            <img src="https://files.eyee.com/mcdn/img/plat/gift05.png" alt />
          </div>
        </div>
      </template>
    </div>

    <!--缺省页面 -->
    <div class="no-data" v-else>
      <img src="https://files.eyee.com/eyeeh5/img/image_empty.png" alt />
      <p>活动不存在或已结束~</p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  UserWinRecord,
  UserGetRecord,
  PrizeProdList,
  AddLotterCount,
  NowGo
} from "../../../utils/api/activities";
const rgxMobile = /^1[3-9]\d{9}$/;
const regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
const regpoint = /[^\a-zA-Z\u4E00-\u9FA5]/g;
const timernum = 200;
let cleartimer = null,
  _loader,
  shareinfo = {};
export default {
  data() {
    return {
      hasdata: 1,
      isclick: true, // 防止连点
      index: -1, // 当前转动到哪个位置，起点位置
      count: 8, // 总共有多少个位置
      timer: 0, // 每次转动定时器
      speed: timernum, // 初始转动速度
      times: 0, // 转动次数
      cycle: 80, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
      prizes: -1, // 中奖位置

      prizelist: [
        // 奖品 列表位置
      ],

      prizename: "", //中奖名称
      prizetype: 1, // 中奖类型 1 谢谢参与  2 优惠券  3 商品

      animate: false,
      lotterlist: [], // 所有中奖纪录
      // "isdraw": 1,//是否领取 0 否  1 是
      recordlist: [], // 我的中奖纪录

      isscale: true // 抽奖按钮 缩放效果
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
    // "$root.showLoadModal": function(n, old) {
    //   if (!n && old) this.shareAddCount();
    // },
    "$route.query.addr": function(n, o) {
      if (n) this.getrecord();
    }
  },
  mounted() {
    let _ = this;
    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json).then(res => {
          _.getrecord();
        });
      } else _.toast("登录失败~");
    };
    // app分享回调;
    window._APPShareBack = function(res) {
      _.shareAddCount();
    };

    if (cleartimer) clearInterval(cleartimer);
    _.roll();

    // 中奖纪录
    if (_.$root.loging) {
      _.$root.loging
        .then($ => {
          // 已登录
          _.getrecord();
        })
        .catch(e => {
          console.error("query prams auto login error:", e);
        });
    } else if (_.uid) _.getrecord();

    _.baseinfo();
    // if (!_.$root.ISWX && !_.$root.ISAPP) {
    //   _.confirm({
    //     msg: "请在【斗牛DoNew】APP内操作?",
    //     okText: "立即前往",
    //     cancelBtn: 1,
    //     ok: () => {
    //       _.openAppClient();
    //       setTimeout(() => {
    //         _.$router.replace("/loadapp");
    //       }, 800);
    //     }
    //   });
    // }
  },
  methods: {
    baseinfo() {
      let _ = this;
      PrizeProdList()
        .then(res => {
          console.log("基础数据", res);
          if (res) {
            _.prizelist = res;
            _.prizelist = _.prizelist
              .map(i => {
                if (!i.filepath)
                  i.filepath =
                    "https://files.eyee.com/mcdn/img/plat/prod/7.png";
                return i;
              })
              .sort(() => Math.random() - 0.5);
            console.log(_.prizelist, "==-------");
          }
          UserWinRecord()
            .then(res => {
              _.lotterlist = res || [];
            })
            .catch(e => {
              console.error(e);
            });
        })
        .catch(e => {
          console.error(e);
        });
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
            callbackname: "_APPShareBack",
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
    getrecord() {
      // 中奖纪录
      UserGetRecord()
        .then(res => {
          console.log("中奖纪录---》》", res);
          this.recordlist = res || [];
        })
        .catch(e => {
          console.error(e);
        });
    },
    roll() {
      let _ = this;
      cleartimer = setInterval(() => {
        _.animate = true;
        setTimeout(() => {
          _.lotterlist.push(this.lotterlist[0]);
          _.lotterlist.shift();
          _.animate = false;
        }, 500);
      }, 3000);
      // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
      _.$once("hook:beforeDestroy", () => {
        clearInterval(cleartimer);
      });
    },
    gotoshare() {
      let _ = this;
      _.checkLogin(() => {
        if (_.$root.ISAPP) {
          _.doShare();
        } else {
          _.shareAddCount();
          _.$root.showLoadModal = true;
        }
      });
    },
    shareAddCount() {
      // 分享增加抽奖次数
      console.log("增加抽奖机会");
      AddLotterCount().then(res => (this.isclick = true));
    },
    nowget(item) {
      let _ = this;
      _.checkLogin(() => {
        if (item.isdraw && item.prizetype == 3) return;
        if (item.isdraw && item.prizetype == 2) {
          if (_.$root.ISAPP)
            // H5跳转到APP的领取优惠券列表页
            _.javascriptBridge({
              name: "gotoAppRedPacketCouponPage"
            });
          else _.$router.push("/user/coupon");
        } else {
          // 立即领取 填写收货地址
          _.$router.push(`/user/address?platid=${item.winrecordid}`);
        }
      });
    },
    goLottery() {
      let _ = this;
      // 1.先调 抽奖次数接口  抽奖次数由接口返回 剩余次数大于0 时 方可继续抽奖
      console.log("_.speed == timernum", _.speed == timernum, _.isclick);
      if (_.prizelist.length == 0) return;
      _.checkLogin(() => {
        if (_.speed == timernum && _.isclick) {
          _.isclick = false;
          NowGo()
            .then(res => {
              // 请求抽奖接口  中奖id由接口返回
              // 根据中奖id 判断_.prizes 的值
              // 接口返回 中奖id
              let prizecode = res.prizecode;
              _.prizename = res.prizename;
              _.prizetype = res.prizetype || 1;
              _.prizes = _.prizelist.findIndex(i => i.prizecode == prizecode);

              console.log("接口返回判断->>中奖索引--->>>", _.prizes);
              _.isscale = false;

              _.startRoll();
            })
            .catch(e => {
              console.error(e);
              //判断如果抽奖停止后才可以再次点击
              _.toast("抽奖次数已用完");
              _.isclick = true;
            });
        }
      });
    },
    // 开始转动
    startRoll() {
      let _ = this,
        index = _.index;
      _.times += 1; // 转动次数

      // 转动过程调用的每一次转动方法，这里是第一次调用初始化
      // 当前转动到哪个位置
      const count = 8; // 总共有多少个位置
      index += 1;
      if (index > count - 1) {
        index = 0;
      }
      _.index = index;

      this.usePrize();
    },
    usePrize() {
      let _ = this;
      // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
      // console.log(`中奖位置${_.prizes}----${_.index}`);
      if (_.times > _.cycle + 10 && _.prizes === _.index) {
        clearTimeout(_.timer); // 清除转动定时器，停止转动
        _.prize = -1;
        _.times = 0;
        _.isclick = true;
        _.speed = timernum;
        _.isscale = true;
        _.getrecord();
        if (_.prizetype == 3) _.toast(`恭喜您获得${_.prizename}!`);
        console.log(
          `你已经中奖了${_.prizes}---index${_.index},--isclick-${
            _.isclick
          },_.speed = timernum${_.speed == timernum}`
        );
      } else {
        _.isclick = false;
        if (_.times < _.cycle) {
          _.speed -= 10; // 加快转动速度
        } else if (_.times > _.cycle + 10) {
          _.speed += 50;
        } else {
          _.speed += 13;
        }

        if (_.speed < 40) {
          _.speed = 40;
        }
        // console.log(" _.speed", _.speed);
        _.timer = setTimeout(_.startRoll, _.speed);
      }
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
      let domain = _.$root.isdebug
        ? "http://qzone.eyee.com/"
        : "http://m.eyee.com/";
      _loader = _.$loader("正在调起分享···");

      _.javascriptBridge({
        name: "callAppDirectlyShare",
        params: {
          sharecontent:
            "1211斗牛周年庆，抢满2000-1211元周年庆神券，原价抽TS x AJ6，专享潮品6折封顶！",
          sharepicurl: "https://files.eyee.com/mcdn/img/plat/main_share.png",
          shareurl: domain + `plat/main`,
          sharetitle: "斗牛周年庆，专享潮品6折封顶！",
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
  /* padding-bottom: 0 !important; */
  background: #64b2b2;
}
.add_bg .mint-msgbox-message {
  text-align: center;
}
</style>
<style lang="scss" scoped>
.lotter {
  // background: #64b2b2;
  min-height: 100vh;
  padding-bottom: 7.333vw;
  background: #64b2b2 url("https://files.eyee.com/mcdn/img/plat/gift14.png") 0
    48.533vw no-repeat;
  background-size: 100% auto;
  img {
    display: block;
    width: 100%;
  }
  @keyframes big {
    0% {
      transform: scale(0.85);
    }
    50% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
  .banner {
    min-height: 40vw;
  }
  .gift {
    overflow: hidden;
    background: #eb845c;
    margin: -1px 5.7333vw 0 5.46667vw;
    padding: 0 6.8vw;

    background: url("https://files.eyee.com/mcdn/img/plat/gift12.png") 0 0
      no-repeat;
    background-size: 100% 100%;
    .roll-msg {
      height: 8.533vw;
      overflow: hidden;
      font-size: 4vw;
      color: #ffd7c8;
      margin: 4.1333vw 1.066vw 1.866vw 1.066vw;
      background: url("https://files.eyee.com/mcdn/img/plat/gift02.png") 0 0
        no-repeat;
      background-size: 100% 100%;

      .lb {
        &.marquee_top {
          transition: all 0.5s linear;
          margin-top: -8.533vw;
        }
        li {
          height: 8.533vw;
          line-height: 8.533vw;
          text-align: center;
          width: 90%;
        }
      }
    }

    .cj_box {
      padding: 3.06vw 2.8vw;
      padding-bottom: 0;
      overflow: hidden;
      min-height: 68vw;
    }

    .line_item {
      width: 22.66vw;
      height: 22.66vw;
      line-height: 22.66vw;
      border-radius: 1.333vw;
      overflow: hidden;
      background: url("https://files.eyee.com/mcdn/img/plat/gift07.png") 0 0
        no-repeat;
      background-size: 100% 100%;
      float: left;
      margin-bottom: 0.8vw;
      &:nth-child(3n + 2) {
        margin: 0 0.8vw 0.8vw 0.8vw;
      }
      &.clickbtn {
        background: url("https://files.eyee.com/mcdn/img/plat/gift08.png?c=2") 0
          0 no-repeat;
        background-size: 100% 100%;
        position: relative;
        img {
          position: absolute;
          width: 14.5333vw;
          height: 10.933vw;
          left: 50%;
          top: 50%;
          margin-left: -7.2665vw;
          margin-top: -5.4665vw;
          // transform: translate(-50%, -50%);
          &.big {
            animation: big 0.5s linear infinite alternate;
          }
        }
      }
    }

    .active {
      position: relative;
      &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: url("https://files.eyee.com/mcdn/img/plat/gift13.png?c=2") 0
          0 no-repeat;
        background-size: 100% 100%;
        z-index: 2;
      }
    }
  }
  .toshare {
    margin: -1px 3.46667vw 0 3.26667vw;
  }
  .jsh {
    margin: -1px 5.6333vw 0 5.6333vw;
    background: url("https://files.eyee.com/mcdn/img/plat/gift09.png") 0 0
      no-repeat;
    background-size: 100% 100%;
    padding: 4vw 6.4vw 8.533vw 6.4vw;
    .prompt-share {
      height: 10.666vw;
      color: #d16c44;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 3.2vw;
      background: url("https://files.eyee.com/mcdn/img/plat/gift10.png") 0 0
        no-repeat;
      background-size: 100% 100%;
      margin-bottom: 7.8666vw;
    }
    .recording {
      background: #fff url("https://files.eyee.com/mcdn/img/plat/gift15.png") 0
        0 no-repeat;
      background-size: 100% 100%;
      position: relative;
      padding: 7.333vw 5.333vw 5.7333vw 5.066vw;
      margin-bottom: 3.066vw;
      font-size: 2.9333vw;
      border: 2px solid #7e2600;
      color: #303030;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
      border-radius: 1.333vw;
      .list {
        margin-bottom: 1.6vw;
        .span {
          width: 60%;
        }
        .hasget {
          width: 17.333vw;
          color: #fff;
          background: #ccc;
          padding: 0.8vw 0;
          border-radius: 1.06vw;
        }
        .span:last-child {
          background: url("https://files.eyee.com/mcdn/img/plat/gift06.png") 0 0
            no-repeat;
          background-size: 100% auto;
          width: 17.333vw;
          height: 8vw;
          &.now-get {
            background: url("https://files.eyee.com/mcdn/img/plat/gift03.png") 0
              0 no-repeat;
            background-size: 100% auto;
          }
        }
      }

      &::before {
        content: "";
        position: absolute;
        width: 38.8vw;
        height: 9.333vw;
        background: url("https://files.eyee.com/mcdn/img/plat/gift01.png") 0 0
          no-repeat;
        background-size: 100% 100%;
        left: 50%;
        top: -4.665vw;
        transform: translateX(-50%);
      }
    }
    .rule {
      background: #fff url("https://files.eyee.com/mcdn/img/plat/gift15.png") 0
        0 no-repeat;
      background-size: 100% 100%;
      padding: 6.9333vw 6vw 9.466vw 5.06vw;
      color: #303030;
      font-size: 2.9333vw;
      line-height: 5.866vw;
      margin-bottom: 4.8vw;
      border-radius: 1.333vw;
      border: 2px solid #7e2600;
    }
  }
}
input,
textarea,
input:focus,
textarea:focus {
  list-style: none;
  outline-style: none;
  background: none;
  padding: 0;
  margin: 0;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  -webkit-appearance: none;
  caret-color: #646464;
}
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #cdcdcd;
  font-size: 3.7333vw;
}
.addr {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: transparent;
  transition: background 0.3s ease-in;
  pointer-events: none;
  z-index: 10;

  .title {
    font-size: 4.2vw;
    color: #232323;
    font-weight: bold;
    font-family: Arial, Helvetica, sans-serif;
    margin: 5.333vw 0;
  }
  &.act {
    pointer-events: unset;
    background: rgba(0, 0, 0, 0.6);
    .cont {
      bottom: 0;
    }
  }
  .cont {
    background: #fff;
    position: absolute;
    width: 100%;
    bottom: auto;
    left: auto;
    left: 50%;
    bottom: -100vh;
    border-radius: 4px;
    transform: translateX(-50%);
    transition: bottom 0.3s ease-in;
    padding: 0 4vw 9.06vw 4vw;
    .close {
      position: absolute;
      right: 15px;
      top: 15px;
      width: 16px;
      height: 16px;
      transform: rotate(45deg);
      &::before {
        content: "";
        width: 16px;
        height: 2px;
        background: #646464;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      &::after {
        content: "";
        width: 2px;
        height: 16px;
        background: #646464;
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
      }
    }
    .label {
      font-size: 3.6vw;
      min-height: 13.69vw;
      line-height: 13.69vw;
      &.bor {
        border-bottom: 1px solid #e6e6e6;
      }

      label {
        width: 20%;
        display: inline-block;
        position: relative;
        i {
          position: relative;
          &::before {
            position: absolute;
            content: "*";
            color: red;
            top: 0;
            right: -0.6vw;
            font-size: 12px;
          }
        }
      }
      input {
        height: 13.69vw;
        width: 70%;
        padding-left: 10px;
        font-size: 3.6vw;
        color: #232323;
      }
      textarea {
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        min-height: 18.33vw;
        width: 100%;
        // resize: none;
        padding: 10px 15px;
        color: #646464;
        font-size: 3.6vw;
      }
    }
    .button {
      height: 13.69vw;
      line-height: 13.69vw;
      background: #ccc;
      border-radius: 4px;
      font-size: 4vw;
      text-align: center;
      color: #fff;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
      &.act {
        background: #232323;
      }
    }
  }
}
</style>
