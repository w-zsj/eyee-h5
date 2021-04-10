<template>
  <div class="lo-wrap">
    <v-header v-if="!insq">
      <div class="nav-tab2">
        <h3>0元抽奖</h3>
      </div>
      <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
    </v-header>
    <!--  -->
    <div class="Category-switching flex-between" v-if="isSelf||!userInfo.token">
      <div class="look-over flex-col flex-center" @click="lookRule">
        <span>查看</span>
        <span>往期</span>
      </div>
      <swiper :options="categoryDeploy" ref="codeSwiper">
        <swiper-slide v-for="(item,ind) in lotterList" :key="ind" class="flex-center">
          <div
            class="flex-col activity-status"
            :class="{'active':ind==currentIndex}"
            @click="tabCategory(ind)"
          >
            <span>{{item.statime}}</span>
            <span>{{item.startText}}</span>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <!-- 邀请者信息 -->
    <div class="inviter flex-between" v-if="CurStatus&&(!isSelf&&userInfo.token)">
      <div class="head-portrait">
        <img :src="CurStatus.userpic" alt />
      </div>
      <div class="friend-user">
        <p>邀请你参与抽奖</p>
        <span>您参与抽奖后 好友可获取抽奖码</span>
      </div>
    </div>
    <!-- 抽奖数据 -->
    <swiper :options="hb" style="padding:15px 0;" ref="hbSwiper" class="hb-shop">
      <swiper-slide v-for="(item,index) in lotterList" :key="index">
        <div class="hb-wrap" @click.stop="GoToDetail(item.prizeid)">
          <!-- 抽奖规则 悬浮 -->
          <div class="look-guize flex-col flex-center" @click.stop.prevent="examine(item.id)">
            <span>抽奖</span>
            <span>规则</span>
          </div>
          <div class="countdown flex-aic">
            <div class="describe flex-col" v-if="item.drawstatus==2||item.drawstatus==3">
              <span class="describe-text">开奖</span>
              <span>倒计时</span>
            </div>
            <div v-else-if="item.drawstatus==1||item.drawstatus==4" class="describe flex-col">
              <span class="describe-text">{{item.drawstatus==4?'开始':'开奖'}}</span>
              <span>时间</span>
            </div>
            <div class="countdown-time">
              <span
                v-if="item.drawstatus==2||item.drawstatus==3"
                class="fon-si"
              >{{timeData.H}}:{{timeData.m}}:{{timeData.s}}</span>
              <span v-else-if="item.drawstatus==4">{{item.starttime}}</span>
              <span v-else>{{item.drawtime}}</span>
            </div>
          </div>
          <div class="hb-info">
            <img :src="item.prizepic" />
          </div>
          <p class="product-name flex-aic">
            <span class="name" style="  -webkit-box-orient: vertical;">{{item.name}}{{item.sku}}</span>
            <!-- <span class="sku"></span> -->
          </p>
          <div class="price flex-between">
            <div class="discount-price flex-center">
              <span class="discount-money">¥{{item.drawprice}}</span>
              <span>抽奖价</span>
            </div>
            <div class="origin-price flex-center">
              <span class="del">原价¥{{item.saleprice}}</span>
              <!-- <span>{{item.size}}码</span> -->
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <!-- 中奖号码 -->
    <div class="winning-record" v-if="CurStatus&&CurStatus.drawstatus==1">
      <p
        class="winning-title"
      >{{CurStatus.iswinning==0?'本期您未参与':CurStatus.iswinning==1?'恭喜你抽中本期大奖':'本期您未中奖'}}</p>
      <div class="winning-number">
        <span>
          <img :src="CurStatus.targetcode.icon" alt />
        </span>
        <span>中奖号码 {{CurStatus.targetcode.drawcode}}</span>
      </div>
    </div>
    <div class="overall">
      <!-- 抽奖码 -->
      <div
        class="nowLotter"
        v-if="CurStatus&&!(CurStatus.drawstatus==1&&(CurStatus.iswinning==0||CurStatus.iswinning==1))"
      >我的抽奖码</div>
      <div
        class="wrap-lotter"
        v-if="CurStatus&&CurStatus.drawcode&&CurStatus.drawcode.length>0&&CurStatus.iswinning!=1"
      >
        <ul class="chou-jiang-ma" :style="{top:top+'px'}">
          <li class="flex-between oli" v-for="(items,i) in CurStatus.drawcode" :key="i">
            <div class="head-portrait">
              <span>
                <img :src="items.icon" alt />
              </span>
              <span>{{items.text}}</span>
            </div>
            <div class="lotter-num">{{items.drawcode}}</div>
          </li>
        </ul>
      </div>
      <!-- 开奖时间 -->
      <div class="lotter-time flex-col" v-if="CurStatus">
        <div v-if="CurStatus.drawstatus==4||CurStatus.drawstatus==2">
          <span class="wait" v-if="CurStatus.iswinning==0">本期您未参与</span>
          <span class="wait" v-else>{{CurStatus.drawstatus==2?"再等等哦，快要开奖啦~":"再等等哦，马上就要开始啦~"}}</span>
        </div>
        <div v-if="CurStatus.drawstatus==3" class="flex-col">
          <span class="time">开奖时间：{{CurStatus.drawtime}}</span>
          <span>抽奖码是参与抽奖的唯一凭证，中奖结果将在本页公示，请注意查看</span>
        </div>
      </div>
    </div>
    <!-- 立即抽奖  -->
    <div
      class="drawLottery"
      :class="{'nostar':CurStatus&&CurStatus.drawstatus==4}"
      @click="drawLottery"
      v-if="CurStatus&&CurStatus.isShowBtn"
    >{{CurStatus.showtext}}</div>
    <div
      class="get-share flex-center"
      :class="{'over-time':CurStatus.isget==3}"
      v-if="!userInfo.token&&CurStatus.drawstatus==1||CurStatus&&CurStatus.iswinning==1&&CurStatus.drawstatus==1"
    >
      <div class="flex-center" v-if="!userInfo.token" @click="getPrize">登录后查看中奖信息哦~</div>
      <div class="flex-center" v-else>
        <span @click="share" v-if="CurStatus.isget!=3">炫耀一下</span>
        <span @click="getPrize">{{CurStatus.isget==2?'立即领取':CurStatus.isget==1?'我的领取信息':'您已超时未领取'}}</span>
      </div>
    </div>

    <!-- //球鞋频道 v-if="query.userid"-->
    <div class="sneak" v-if="query.userid">
      <p class="title">| 球鞋频道</p>
      <div v-html="qiuxie"></div>
    </div>
    <!-- 潮人在 -->
    <trendLeader v-if="query.userid"></trendLeader>
    <!-- 分享提示框 -->
    <shareModel @closeShareModel="shareClose" v-if="closeShareModel" :shareContent="shareContent"></shareModel>
    <!-- 领取成功 提示弹框 -->
    <div class="share-model" v-if="getSuccess" @click.stop="close">
      <div class="content">
        <p>领取信息登记完成，请耐心等待奖品哦~</p>
        <p class="prize-info">奖品将于领取之后的7个工作日内为您邮寄，若有任何疑问可联系我们的客服小姐姐哦~</p>
        <div class="share-btn flex-center">
          <img class="kefu" src="/static/img/tel.png" alt />
          客服电话 {{CurStatus.telephone}}
        </div>
        <span class="close" @click.stop="close">X</span>
      </div>
    </div>

    <!-- 登录注册弹框 -->
    <!-- <div class="login-bg" v-if="showBaseModal" @click="close" ></div>
    <div class="login" v-if="showBaseModal">
      <login @register="register"></login>
    </div>-->
    <!-- <transition name="lotter">
        <div class="login" v-show="showBaseModal">
          <login></login>
        </div>
    </transition>-->
  </div>
</template>
<script>
import trendLeader from "./trendLeader";
// import * as api from "../../common/api/user";
import { getUrlParam } from "../../common/util";
import { mapGetters } from "vuex";
import { DateDiff } from "../../common/util";
import {
  PrizeShow,
  NoTokenPrizeShow,
  draw,
  QiuxiePin
} from "../../common/api/lotter.js";
import shareModel from "../templates/h5ShareModel";
import login from "./reglogin";
export default {
  components: {
    shareModel,
    trendLeader,
    login
  },
  data() {
    return {
      shareContent:
        "好友参与抽奖后 你可以额外获得一张抽奖码,传递好运获得更多抽奖码",
      currentCode: "", // 区域号
      showBaseModal: false,
      closeShareModel: false,
      getSuccess: false,
      query: {},
      qiuxie: "",
      examineType: 0, // 查看规则时 会触发 swiper 滚动
      hb: {
        spaceBetween: 10,
        slidesPerView: 1.2,
        centeredSlides: true,
        // initialSlide: this.currentIndex,
        // onSlideChangeStart: swiper => {
        // console.log("swiper------",swiper);
        // this.onSlideChange(swiper.activeIndex);
        // },
        onTouchEnd: swiper => {
          console.log("测试", swiper);
          // 你的事件
          setTimeout(() => {
            if (this.examineType == 0) {
              this.onSlideChange(swiper.activeIndex);
            }
          }, 300);
        }
      },
      categoryDeploy: {
        spaceBetween: 10,
        slidesPerView: 3,
        // freeMode : true,
        // preloadImages: false,
        onSlideChangeStart: s => {
          this.tabCategory(s.activeIndex);
        }
      },
      loginParms: {
        mobile: null,
        code: null
      },

      sentCode: "发送验证码",
      timeRun: 0,
      top: -520,
      lotterList: [],
      currentIndex: 0,
      timeData: { H: "00", m: "00", s: "00" },
      clearTime: null
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo",
      selectCountryCode: "selectCountryCode"
    }),
    codeSwiper() {
      return this.$refs.codeSwiper.swiper;
    },
    hbSwiper() {
      return this.$refs.hbSwiper.swiper;
    },
    CurStatus() {
      // "drawstatus":开奖状态#int 1、已开奖2、未开奖3、进行中4、即将开始，
      let _ = this;
      let cs = {};
      cs.drawcode = [];

      let c = _.lotterList[_.currentIndex] || {};
      cs = { ...c };
      if (c) {
        cs.iswinning = c.iswinning; // 是否中奖
        cs.isLotter = !!(c.drawcode && c.drawcode.length > 0); // 抽奖码  判断是否抽奖过
        cs.isShowBtn =
          !!(c.drawstatus && c.drawstatus != 1 && c.drawstatus != 2);
        if (c.drawstatus == 4) {
          cs.showtext = "即将开始";
        } else if (!cs.isLotter || !_.userInfo.token) {
          cs.showtext = "立即参与抽奖";
        } else {
          cs.showtext = "分享获得更多抽奖码，中奖机率翻倍";
        }

        if (c.share) {
          _.initShare({
            type: 2,
            info: {
              title: c.share.title,
              url: c.share.url,
              img: c.share.icon,
              desc: c.share.content
            }
          });
        }
        if (c.drawcode && c.drawcode.length > 0 && _.top < 0) {
          _.top = -52 * c.drawcode.length;
        }
        // console.log("currentIndex,,,", _.currentIndex);
        return cs;
      }
    }, // 当前状态 默认进行中
    isSelf() {
      // 是否是自己 打开页面 true ziji

      let _ = this;
      let lo = _.lotterList[0];

      let bo = true;
      if (lo) {
        if (lo.userid == 0) bo = true;
        else bo = false;
      }
      return bo;
    }
  },
  mounted() {
    let _ = this;
    _.examineType = 0;
    _.currentCode = _.selectCountryCode;
    // 地址栏参数
    _.query.userid = getUrlParam("userid") || 0;
    _.query.id = getUrlParam("id") || null;
    if (_.query.id) {
      _.Qiuxie(_.query.id);
    }
    _.lotterData(0);
  },
  methods: {
    lotterData(type) {
      let _ = this;
      let api = _.userInfo && _.userInfo.token ? PrizeShow : NoTokenPrizeShow;
      api(_.query)
        .then(res => {
          console.log("抽奖页面展示数据", res);
          if (res) {
            // 抽奖码显示
            setTimeout(() => {
              this.top = 0;
            }, 500);
            _.lotterList = res;
            _.lotterList = _.lotterList.map(i => {
              switch (i.drawstatus) {
                case 1:
                  i.startText = "已开奖";
                  break;
                case 2:
                  i.startText = "待开奖";
                  break;
                case 3:
                  i.startText = "进行中";
                  break;
                case 4:
                  i.startText = "即将开始";
                  break;
              }
              return i;
            });
            // category
            _.lotterList = _.lotterList.map((item, i) => {
              let t = item.starttime.split(" ")[0].split("-");
              item.statime = t[1] + "月" + t[2] + "日";
              return item;
            });
            if (!type) {
              for (let i = 0; i < _.lotterList.length; i++) {
                if (_.lotterList[i].drawstatus == 3) {
                  _.currentIndex = i;
                  _.codeSwiper.slideTo(i, 100, false);
                  _.hbSwiper.slideTo(i, 500, false);
                  return;
                } else {
                  _.currentIndex = 0;
                }
              }
            }
          }
        })
        .catch(e => {
          console.error(e);
          this.toast(e);
        });
    },
    register(val) {
      if (val) {
        document.body.classList.remove("lock");
        this.showBaseModal = false;
        this.top = -300;
        this.lotterData(1);
      }
    },
    close() {
      document.body.classList.remove("lock");
      this.showBaseModal = false;
      this.getSuccess = false;
    },
    shareClose(val) {
      if (val) this.closeShareModel = false;
    },
    tabCategory(index) {
      // 切换类目
      this.currentIndex = index;
      this.hbSwiper.slideTo(index, 500, false);
    },
    onSlideChange(i) {
      console.log("滚动索引---》", i);
      this.currentIndex = i;
      if (this.isSelf) {
        this.codeSwiper.slideTo(i, 100, false);
      }
    },
    goToCountry() {
      // 选择区域
      this.$router.push("/country");
    },
    drawLottery() {
      // 抽奖 开奖状态#int 1、已开奖 2、未开奖 3、进行中 4 即将开始;
      // "iswinning":是否中奖#0、未参与1、中奖2、参与未中奖
      // "isget"是否领取int#1、领取2、未领取3、超时未领取
      let _ = this;
      if (this.userInfo && this.userInfo.token) {
        if (_.CurStatus.drawstatus === 3) {
          if (!_.CurStatus.isLotter) {
            // _.toast("去抽奖");
            let op = {
              userid: _.isSelf ? 0 : _.query.userid,
              id: _.CurStatus.id
            };
            draw(op)
              .then(res => {
                console.log("抽奖返回数据", op);
                // _.toast("抽奖成功");
                this.top = -100;
                _.lotterData(1);
              })
              .catch(e => {
                _.toast(e.msg);
                console.error(e);
              });
          } else if (_.CurStatus.isLotter) {
            // _.toast("去分享");
            _.closeShareModel = true;
          }
        } else {
          _.toast("活动未开始");
        }
      } else {
        this.$router.push("/login");
        // document.body.classList.add('lock')

        // window.scrollTo(0,0)
        // this.showBaseModal = true;
      }
    },
    GoToDetail(id) {
      this.examineType = 1;
      this.$router.push("/sneaker/detail/" + id);
    },
    getPrize() {
      // 领取奖品
      if (this.userInfo && this.userInfo.token) {
        // this.toast("登录后查看中奖信息");
        if (this.CurStatus.isget == 1) {
          // this.toast("已经领取过了");
          this.getSuccess = true;
        } else if (this.CurStatus.isget == 3) {
          this.toast("您已超时未领取");
        } else this.$router.push("/drawLottery/getPrize/" + this.CurStatus.id);
      } else {
        this.$router.push("/login");
        // document.body.classList.add('lock')
        //  window.scrollTo(0,0)
        // this.showBaseModal = true;
      }
    },
    share() {
      this.closeShareModel = true;
    },
    lookRule() {
      // 查看明细
      if (this.userInfo && this.userInfo.token) {
        this.$router.push("/drawLottery/lookRule");
      } else {
        this.$router.push("/login");
        // document.body.classList.add('lock')
        //  window.scrollTo(0,0)
        // this.showBaseModal = true;
      }
    },
    examine(id) {
      // 查看规则 examine
      this.examineType = 1;
      this.$router.push("/drawLottery/examine?id=" + id);
    },
    Qiuxie(id) {
      QiuxiePin(id)
        .then(res => {
          if (res) {
            this.qiuxie = res.detail;
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    countdownTime(time, type) {
      this.timeData = DateDiff({ destination: time, type: type });
      let t = this.timeData;
      if (
        this.timeData.H === 0 &&
        this.timeData.m === 0 &&
        this.timeData.s === 0
      ) {
        clearInterval(this.clearTime);
        this.lotterData(1);
        t.H = t.m = t.s = "00";
        return;
      }

      t.H = t.H <= 0 ? "00" : t.H < 10 ? "0" + t.H : t.H;
      t.m = t.m <= 0 ? "00" : t.m < 10 ? "0" + t.m : t.m;
      t.s = t.s < 0 ? "00" : t.s < 10 ? "0" + t.s : t.s;
    },
    setentime(time, type) {
      let _ = this;
      _.clearTime = setInterval(() => {
        _.countdownTime(time, type);
      }, 1000);
    }
  },
  watch: {
    selectCountryCode: function (val, oldVal) {
      this.currentCode = val;
    },
    currentIndex: {
      handler: function (val, oldval) {
        this.hb.initialSlide = val;
        clearInterval(this.clearTime);
        this.setentime(this.lotterList[val].drawtime, "H");
      },
      deep: true
    }
  }
};
</script>
<style scoped>
/* 邀请者信息 */
.inviter {
  padding: 20px 30px;
  font-size: 14px;
  color: #333;
}
.inviter .head-portrait {
  width: 17.6vw;
  height: 17.6vw;
  border-radius: 50%;
  background: #ffc700;
  overflow: hidden;
}
.inviter .head-portrait img {
  width: 100%;
  height: 100%;
}
.friend-user {
  background: #f5f4f9;
  padding: 15px;
  position: relative;
  width: 70%;
}
.friend-user::before {
  content: "";
  position: absolute;
  border-right: 15px solid #f5f4f9;
  border-top: 15px solid transparent;
  border-bottom: 15px solid transparent;
  left: -15px;
  top: 10px;
}
.login {
  position: relative;
  z-index: 4;
}
.lotter-enter-active,
.lotter-leave-active {
  transition: all 0.5s;
  opacity: 1;
}
.lotter-enter,
.lotter-leave-to {
  transform: translateY(200px);
  opacity: 0;
}
.lo-wrap {
  padding-bottom: 60px;
}
.swiper-container {
  width: 92%;
}
.Category-switching {
  background: #000;
  color: #ccc;
  font-size: 12px;
  padding: 8px;
  height: 54px;
}
.activity-status {
  text-align: center;
  transition: all 0.15s linear;
  width: 100%;
  margin-top: 6px;
}
.activity-status span:nth-child(2) {
  font-size: 10px;
}
.activity-status.active {
  color: #ffc700;
  font-size: 17px;
  margin-top: 0;
}
.activity-status.active span:nth-child(2) {
  font-size: 12px;
}
.look-over {
  width: 16%;
  text-align: center;
}
.wrap-lotter {
  overflow: hidden;
  position: relative;
  top: -2.3vw;
  z-index: 2;
  /* background: #fff; */
}
.chou-jiang-ma {
  position: relative;
  transition: all 2s linear;
  width: 71%;
  margin: 0 auto;
  overflow: hidden;
  padding-bottom: 5px;
  /* background: rgb(0, 0, 0, 0.1);
  border-right: 1px solid #DEDEDE;
  border-left: 1px solid #DEDEDE; */
}
.chou-jiang-ma li {
  height: 52px;
  line-height: 52px;
  background: url("/static/img/lotcode.png") 0 0 no-repeat;
  background-size: 100% 100%;
  color: #333;
  font-size: 10px;
  margin: 0 auto;
  padding: 10px 25px;
  margin-bottom: -5px;
  /* box-shadow:0px 10px 26px #999; */
}
.chou-jiang-ma li .head-portrait span:nth-child(1) {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
  position: relative;
  top: 7px;
}
.chou-jiang-ma li .head-portrait span:nth-child(1) img {
  width: 100%;
  height: 100%;
  display: block;
}
.chou-jiang-ma li .lotter-num {
  font-size: 20px;
  font-weight: bold;
}
.hb-wrap {
  background: #fff;
  padding: 12px 15px;
  box-shadow: rgb(204, 204, 204) 0px 0px 7px 0px;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  width: 97%;
  margin: 0 auto;
}
.look-guize {
  position: absolute;
  right: -10px;
  top: 15px;
  background: #f8f8f8;
  font-size: 9px;
  color: #999;
  width: 60px;
  height: 60px;
  padding: 0;
  border-radius: 50%;
}
.hb-info {
  /* width: 50%; */
  margin: 0 auto;
}
.countdown {
  font-size: 10px;
  color: #000;
  margin-bottom: 15px;
}
.countdown .describe {
  width: 15%;
  text-align: left;
}
.countdown .describe-text {
  font-size: 13px;
  font-weight: bold;
}
.countdown .countdown-time {
  font-size: 20px;
  font-weight: bold;
  width: 70%;
  text-align: center;
}
.countdown .countdown-time .fon-si {
  font-size: 25px;
}
.product-name {
  color: #000;
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  margin: 24px auto 12px;
}
.price {
  text-align: left;
}
.discount-price {
  font-size: 12px;
}
.discount-price .discount-money {
  font-size: 26px;
  font-weight: bold;
}
.discount-price span:nth-child(2) {
  padding-top: 10px;
}
.origin-price {
  font-size: 11px;
  padding-top: 10px;
  color: #000;
}
.origin-price .del {
  text-decoration: line-through;
  color: #999;
  margin-right: 5px;
}
.overall {
  position: relative;
}
.share-model {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
}
.close {
  position: absolute;
  width: 15px;
  height: 15px;
  top: 10px;
  right: 10px;
}
.share-model .content {
  position: absolute;
  width: 90%;
  background: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;
  padding: 10% 8.5%;
  font-size: 14px;
  color: #333;
}
.prize-info {
  color: #979797;
  font-size: 11px;
  margin: 17px;
}
.share-btn {
  border-radius: 20px;
  line-height: 40px;
  text-align: center;
  color: #4a90e2;
  font-size: 16px;
  margin-top: 15px;
}
.share-btn .kefu {
  width: 20px;
  margin-right: 10px;
}
.nowLotter {
  background: url("/static/img/lotterBg.png") 0 0 no-repeat;
  background-size: 100% 100%;
  height: 35px;
  font-size: 12px;
  color: #fff;
  text-align: center;
  padding-top: 3px;
  width: 83%;
  margin: 0 auto;
  border-radius: 5px;
  margin-top: 10px;
  position: relative;
}
.lotter-time {
  font-size: 10px;
  color: #333;
  width: 83%;
  text-align: center;
  margin: 25px auto;
  /* position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 13vw; */
  /* z-index: 1; */
}
.lotter-time .time {
  font-size: 14px;
  font-weight: bold;
}
.lotter-time .wait {
  color: #999;
  /* line-height: 24px; */
}
.lotter-time span:nth-child(2) {
  color: #ccc;
  line-height: 24px;
}
.drawLottery {
  color: #333;
  font-size: 16px;
  background: #ffc700;
  height: 50px;
  line-height: 50px;
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 2;
}
.drawLottery.nostar {
  background: #ccc;
  color: #fff;
}
.login-bg {
  position: fixed;
  width: 100%;
  background: #000;
  opacity: 0.5;
  z-index: 3;
  left: 0;
  top: 0;
  bottom: 0;
}

.winning-record {
  margin-top: 25px;
}
.winning-record .winning-title {
  font-size: 14px;
  color: #000;
  font-weight: bold;
  text-align: center;
}
.winning-number {
  height: 52px;
  line-height: 52px;
  font-size: 18px;
  color: #333;
  font-weight: bold;
  text-align: center;
  box-shadow: rgb(204, 204, 204) 0px 0px 7px 0px;
  width: 90%;
  margin: 25px auto;
  border-radius: 5px;
  position: relative;
}
.winning-number span:nth-child(1) {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 12%;
  overflow: hidden;
}
.winning-number span:nth-child(1) img {
  display: block;
  width: 100%;
  height: 100%;
}
.get-share {
  height: 52px;
  line-height: 52px;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 3;
  font-size: 16px;
  color: #fff;
  background: #333;
}
.get-share > div {
  width: 100%;
  height: 100%;
}
.get-share span {
  text-align: center;
  min-width: 50%;
  font-weight: bold;
}
.over-time {
  background: #999;
  color: #fff;
}
.get-share span:nth-child(2) {
  background: #ffc700;
  color: #333;
}
/* //球鞋频道 */
.sneak {
  margin: 22px;
}
.sneak .title {
  font-size: 20px;
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>


