<template>
  <div>
    <div v-if="isshow && ballToCashList.length">
      <div class="cash_text">
        <img src="/static/imgs/ball/cash_text.png?c=1" @click="showRule()" />
        <div class="cash_countdown">{{ countDown }}后兑现任务将失效</div>
      </div>
      <div class="list">
        <ul>
          <li v-for="(item, index) in ballToCashList" :key="index">
            <div class="cash">
              ¥
              <span>{{ item.cashamount }}</span>
            </div>
            <div class="intro">
              <div>兑换现金</div>
              <i></i>
              <div>
                -
                <img src="/static/imgs/ball/oxball_b.png?c=1" />
                <span>{{ item.newballnum }}</span>
              </div>
            </div>
            <div
              class="btn"
              @click="changeCash(item.code, item.newballnum, item.cashamount)"
            >
              兑换
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="couponList.length > 0">
      <Title>兑换优惠券</Title>
      <div class="coupon-item" v-for="(item, index) in couponList" :key="index">
        <div class="coupon-item-left">
          <div class="coupon-item-left-count">
            <span>¥</span>{{ item.facevalue }}
          </div>
          <div class="coupon-item-left-tip">
            {{ item.usecondition }}
          </div>
        </div>
        <div class="coupon-item-right">
          <div class="coupon-item-info">
            <div class="coupon-item-info-title">{{ item.title }}</div>
            <div class="coupon-item-info-title" style="margin-top:1px">
              - <img src="/static/imgs/ball/oxball_b.png?c=1" alt="" srcset="" />
              {{ item.usenewball }}
            </div>
            <div style="margin-top:7px;" class="coupon-item-info-subTitle">
              适用品类：{{ item.typetext }}
            </div>
            <div class="coupon-item-info-subTitle">
              有效时间：{{ item.outday }}
            </div>
          </div>
          <div
            class="btn"
            @click="handleConvertCoupon(item.id, item.usenewball)"
          >
            兑换
          </div>
        </div>
      </div>
    </div>

    <!-- 商品兑换 -->
    <div v-if="ballMarketList">
      <div class="exchange_text">
        <img src="/static/imgs/ball/exchange_text.png?c=1" />
      </div>
      <div class="exchange_box">
        <v-delay :delay="500" class="mh-tabs">
          <div class="mh-tab-box">
            <div
              v-for="(item, index) in category"
              :key="index"
              class="mh-tab"
              :class="{ act: index === currIndex }"
              @click="toggle(index)"
            >
              <span>
                {{ item.name }}
                <i></i>
              </span>
            </div>
          </div>
        </v-delay>
        <!-- <v-delay :delay="800"> -->
        <v-list
          :load-handle="() => {}"
          :more-handle="loadMore"
          :more-handling="isLoading"
          :isend="isEnd"
        >
          <carousel
            ref="car"
            class="ad-imgs"
            center-mode
            :per-page="1"
            :mouseDrag="false"
            :touchDrag="true"
            :minSwipeDistance="50"
            :navigateTo="navigate"
            @page-change="pageChange"
          >
            <slide v-for="(item, index) in category" :key="index + 'ad'">
              <div
                class="exchange_list"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd"
              >
                <div >
                  <ball-product :ballMarketList="ballMarketList"></ball-product>
                </div>
              </div>
            </slide>
          </carousel>
        </v-list>
        <!-- </v-delay> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  BallToCashListApi,
  BallToCashActionApi,
  GetUserBallNumApi,
  BallMarketCategoryApi,
  BallMarketListApi,
  GetCouponList,
  GetCoupon
} from "@/utils/api/oxball";
import { DateDiff, getIosVersion } from "@/common/util";
import BallProduct from "@/components/templates/BallProduct";
import { Carousel, Slide } from "vue-carousel";

import Title from "../components/Title";

let navCurrIndex = undefined

const moveTab = () => {
  try {
    let $scene = document.querySelector(".mh-tab-box"),
      $actScene = document.querySelector(".mh-tab-box .act");
    if(navCurrIndex > 4){
      $scene.scrollLeft += 100
    }else if(navCurrIndex < 3){
      $scene.scrollLeft -= 100
    }
    event.preventDefault();
  } catch (e) {}
};

export default {
  name: "oxballmarket",
  data() {
    return {
      couponList: [],
      ballToCashList: [],
      countDown: "0",
      remaintime: 0,
      timeRun: null,
      isshow: true,
      category: [],
      currIndex: 0,
      pagedata: { sumcount: 0, pagesize: 0, pageindex: 1 },
      isLoading: false,
      ballMarketList: [],
      isEnd: false,
      navigate: 0,
      nowTime: Date.now()
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo"
    })
  },
  watch: {
    "$refs.car.dragOffset": function(params) {
      console.log("TCL: params", params);
    },
    currIndex:function (params) {
      navCurrIndex = params
    }
  },
  components: {
    BallProduct,
    Carousel,
    Slide,
    Title
  },
  mounted() {
    let _ = this;
    _.getBallToCashList();
    _.getBallMarketCategory();
    this.handleGetCouponList();
    this.monitorMove()
  },
  // destroyed() {
  //   let _ = this;
  //   window.removeEventListener("popstate", _.physicalReturn, false); //false阻止默认事件
  // },
  methods: {
    pageChange(index) {
      let _ = this;
      _.toggle(Math.abs(index));
    },
    showRule() {
      let _ = this;
      _.confirm({
        title: "牛丸兑换现金说明",
        msg:
          "<div class='ball_rule'>现金兑换次数有限，先到先得，每位用户每种额度仅限兑换一次。</div>",
        okText: "知道了",
        cancelBtn: 1,
        confirmButtonClass: "fz16"
      });
    },
    handleConvertCoupon(id, ballnum) {
      this.confirm({
        msg:
          "<div class='confirm_cash'>确认消耗" +
          ballnum +
          "牛丸<br>兑换该优惠券？",
        cancelText: "取消",
        okText: "确认",
        confirmButtonClass: "fz16",
        cancelButtonClass: "fz16",
        ok: () => {
          GetCoupon({ id })
            .then(res => {
              this.getUserBall();
              this.confirmChangeSuccess('coupon');
              this.handleGetCouponList()
            })
            .catch(err => {
              this.handleGetCouponList()
              console.error(err);
              if(err.code === 1511600 || err.code === 1511431) this.toast(err.msg)
              if (err.code === 1511612) this.confirmChangeError();
            });
        }
      });
    },
    handleGetCouponList() {
      GetCouponList()
        .then(res => {
          this.couponList = res;
          console.log("TCL: handleGetCouponList -> res", res);
        })
        .catch(err => {
          console.error(err);
        });
    },
    getBallToCashList() {
      let _ = this;
      BallToCashListApi()
        .then(res => {
          if (res) {
            _.isshow = res.isshow;
            if (_.isshow) {
              _.ballToCashList = res.list;
              _.remaintime = res.remaintime;
              _.countdownTime(); //倒计时
            }
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    changeCash(code, ballnum, cash) {
      let _ = this;
      _.confirm({
        msg:
          "<div class='confirm_cash'>确认消耗" +
          ballnum +
          "牛丸<br>兑换" +
          cash +
          "元现金？</div><div class='confirm_cash_yue'>（发放到账户余额）</div>",
        cancelText: "取消",
        okText: "确认",
        confirmButtonClass: "fz16",
        cancelButtonClass: "fz16",
        ok: () => {
          _.getUserBall();
          _.confirmBallToCash(code, cash);
        }
      });
    },
    countdownTime() {
      let _ = this;
      var ts = DateDiff({
        destination: new Date(_.nowTime + _.remaintime),
        type: "d"
      });
      if (ts.d <= 0 && ts.H <= 0 && ts.m <= 0 && ts.s <= 0) {
        _.countDown = "00天00:00:00";
        return;
      }
      let D = ts.d < 9 ? "0" + ts.d : ts.d;
      let H = ts.H < 9 ? "0" + ts.H : ts.H;
      let M = ts.m < 9 ? "0" + ts.m : ts.m;
      let S = ts.s < 9 ? "0" + ts.s : ts.s;
      _.countDown = D + "天" + H + ":" + M + ":" + S;
      if (ts.d === 0 && ts.H === 0 && ts.m === 0 && ts.s === 1) {
        _.countDown = null;
        clearTimeout(_.timeRun);
      } else {
        _.timeRun = setTimeout(() => {
          _.countdownTime();
        }, 1000);
      }
    },
    confirmBallToCash(code, cash) {
      let _ = this;
      let { user } = _;
      BallToCashActionApi(code)
        .then(res => {
          $log({
            e: "click_ball_to_cash",
            p: { money: cash, userid: user.uid }
          });
          _.confirmChangeSuccess();
          _.getBallToCashList();
          _.getUserBall();
        })
        .catch(e => {
          if (e.code === 1511785) {
            _.confirmChangeError();
          } else {
            _.toast("兑换现金任务已失效");
            _.getBallToCashList();
          }
        });
    },
    confirmChangeSuccess(type) {
      let tipText =
        type === "coupon" ? "已发放至你的卡劵包" : "已发放至账户余额";
      let _ = this;
      _.confirm({
        title: `兑换成功，${tipText}`,
        msg:
          "<div class='confirm_cash_yue'>继续邀请好友，领取海量牛丸!(每邀1位最高送1088牛丸)</div>",
        okText: "立即邀请",
        cancelBtn: 1,
        confirmButtonClass: "fz16",
        closeOnClickModal: true,
        ok: () => {
          _.$router.push("/ball/summmon");
        }
      });
    },
    confirmChangeError() {
      let _ = this;
      _.confirm({
        title: "兑换失败，牛丸数量不足",
        msg:
          "<div class='confirm_cash_yue'>去邀请好友，领取海量牛丸!<br>(每邀1位最高送1088牛丸)</div>",
        okText: "立即邀请",
        confirmButtonClass: "fz16",
        closeOnClickModal: true,
        cancelBtn: 1,
        ok: () => {
          _.$router.push("/ball/summmon");
        }
      });
    },
    getUserBall() {
      let _ = this;
      let data = {};
      GetUserBallNumApi()
        .then(res => {
          data.totalnewballnum = res.totalnewballnum;
          data.todaynewballnum = res.todaynewballnum;
          data.nownewballnum = res.nownewballnum;
          data.showBallToCash = res.isshowimg;
          _.$store.dispatch("getOxBallData", data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    getBallMarketCategory() {
      let _ = this;
      BallMarketCategoryApi()
        .then(res => {
          if (res) {
            res.unshift({
              id: 0,
              name: "全部频道"
            });
            _.category = res;
            console.log("res", this.category);
            _.getBallMarketList(_.category[_.currIndex].id);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    toggle(index) {
      let _ = this;
      this.navigate = index;
      if (_.currIndex == index) return;
      _.currIndex = index;
      _.isEnd = false;
      _.pagedata.pageindex = 1;
      _.getBallMarketList(_.category[_.currIndex].id);
      _.$nextTick(() => {
        (_.aaaaa = true), moveTab();
      });
    },
    getBallMarketList(categoryId) {
      let _ = this;
      let page = _.pagedata;
      _.isLoading = true;
      // categoryid: categoryId,
      let paramObj = {
        pageindex: page.pageindex
      };
      if (categoryId != 0) paramObj.categoryid = categoryId;
      BallMarketListApi(paramObj)
        .then(res => {
          console.log("商品", res);
          if (res) {
            if (res.list) {
              console.log("TCL: getBallMarketList -> res.list", res.list)
              if (res.pageindex == 1) {
                _.ballMarketList = res.list;
              } else {
               _.ballMarketList = _.ballMarketList.concat(res.list)
               console.log("TCL: getBallMarketList -> _.ballMarketList", _.ballMarketList)
              }
            }
            if (res.pageindex > 0) page.pageindex = res.pageindex;
            if (res.sumcount > -1) page.sumcount = res.sumcount;
            if (res.pagesize > -1) page.pagesize = res.pagesize;
            if (page.pageindex * page.pagesize >= page.sumcount) _.isEnd = true;
          } else {
            _.toast("加载失败");
          }
          _.isLoading = false;
        })
        .catch(e => {
          _.isLoading = false;
          console.log(e);
        });
    },
    loadMore() {
      let _ = this;
      if (_.isEnd === true) {
        _.toast("已无更多");
      } else {
        if(_.category[_.currIndex]){
            _.pagedata.pageindex += 1;
          _.getBallMarketList(_.category[_.currIndex].id);
        }

        // setTimeout(()=>{
        //   _.pagedata.pageindex += 1;
        //   _.getBallMarketList(_.category[_.currIndex].id);
        // },300)
      }
    },
    handleTouchStart(e) {
      document.body.style.overflow = "";
    },
    handleTouchEnd(e) {
      this.moveStart = undefined;
      this.moveIng = undefined;
      document.body.style.overflow = "";
    },
    monitorMove() {
      //处理carousel左右滑动时，上下滚动影响的问题
      setTimeout(() => {
        let dom = document.getElementsByClassName("VueCarousel-inner")[0];
        //监听dom元素的方法
        const MutationObserver =
          window.MutationObserver ||
          window.WebKitMutationObserver ||
          window.MozMutationObserver;

        if (MutationObserver) {
          let config = {
            attributes: true,
            data: true
          };

          this.moveStart = undefined;
          this.moveIng = undefined;

          let ob = new MutationObserver((mutationsList, observer) => {
            let count = mutationsList[0].target.style.cssText;
            let offNum = /[0-9][0-9]*/.exec(count.split(";")[0])[0];
            let move = Math.abs(offNum);

            if (!this.moveStart) {
              this.moveStart = move;
              console.log("TCL: mounted -> this.moveStart", this.moveStart);
            } else if (this.moveStart || this.moveStart === 0) {
              this.moveIng = move;
              let moveDis = Math.abs(this.moveStart - this.moveIng);
              if (moveDis > 10) {
                document.body.style.overflow = "hidden";
              }
            }
          });

          ob.observe(dom, config);
        }
      }, 500);
    }
  }
};
</script>

<style lang="scss" scoped>
.coupon-item {
  width: 92vw;
  height: 29.3333vw;
  background-image: url("/static/imgs/ball/youhuiquan.png?c=1");
  background-size: cover;
  background-repeat: no-repeat;
  margin: 0 auto;
  margin-bottom: 2.666vw;

  display: flex;
  justify-content: space-between;

  &-left {
    width: 26.4vw;
    height: 29.3333vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 2px;

    &-count {
      font-size: 9.3333vw;
      font-family: "OswaldBold";
      color: #232323;
      font-weight: bold;
      span {
        font-size: 4.2667vw;
      }
    }
    &-tip {
      font-size: 3.2vw;
      font-weight: 400;
      color: #b4b4b4;
    }
  }

  &-right {
    width: 65.0667vw;
    height: 29.3333vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 5.6vw;/*21 */
  }

  &-info {
    &-title {
      font-size: 3.7333vw;
      color: #232323;
      font-weight: 600;
      // line-height:4.8vw;
      display: flex;
      align-items: center;
      img {
        width: 4.8vw;
        height: 4.8vw;
      }
    }
    &-subTitle {
      font-size: 2.9333vw;
      color: #969696;
      font-weight: 400;
    }
  }

  .btn {
    width: 66px;
    height: 33px;
    background: #fa2337;
    border-radius: 0.5333vw;
    font-size: 3.7333vw;
    color: #ffffff;
    font-weight: 600;
    line-height: 8.8vw;
    text-align: center;
    margin-right: 6.6667vw;
  }
}
</style>


<style>
.exchange_box .VueCarousel-pagination {
  display: none;
}
.mint-msgbox {
  border-radius: 4px;
}
.ball_rule {
  color: #232323;
  text-align: left;
}
.ball_rule .regir {
  color: #646464;
}
.confirm_cash {
  font-size: 17px;
  color: #232323;
  font-weight: 600;
  margin-bottom: 4vw;
}
.confirm_cash_yue {
  font-size: 16px;
  color: #646464;
  font-weight: 400;
}
.fz16 {
  font-size: 16px;
  font-weight: 600;
}
</style>
<style scoped>
.mint-loadmore {
  background: none;
}
.cash_text {
  margin-top: 5.333vw;
  width: 100%;
  height: auto;
  overflow: hidden;
  text-align: center;
  padding-bottom: 4vw;
}
.cash_text img {
  display: block;
  margin: 0 auto;
  height: 7.466vw;
}
.cash_countdown {
  text-emphasis: ce;
  font-size: 12px;
  color: #969696;
  font-weight: 400;
}
.list {
  margin: 0 auto;
  width: 92vw;
  height: auto;
}
.list li {
  width: 100%;
  height: 19.733vw;
  background: url("/static/imgs/ball/market_li_bg.png?c=1") no-repeat;
  background-size: 100% 100%;
  position: relative;
  margin-bottom: 2.666vw;
}
.list li .cash {
  float: left;
  margin-left: 6.666vw;
  height: 19.733vw;
  font-size: 16px;
  font-weight: bold;
  color: #232323;
  font-family: "OswaldBold";
  src: url("https://files.eyee.com/eyeeh5/font/Oswald.otf");
}
.list li .cash span {
  margin-left: -1.0667vw;
  font-size: 35px;
  line-height: 19.733vw;
}
.list li .intro {
  float: left;
  margin-left: 3.4667vw;
  margin-top: 4.533vw;
  height: 11.1993vw;
  font-size: 14px;
  font-weight: 600;
  color: #232323;
}
.list li .intro i {
  display: block;
  width: 100%;
  height: 0.5333vw;
}
.list li .intro div {
  height: 5.333vw;
  line-height: 5.333vw;
}
.list li .intro img {
  display: inline-block;
  vertical-align: top;
  margin-right: 0.2665vw;
  margin-left: -1.067vw;
  width: 4.8vw;
  height: 4.8vw;
}
.list li .intro span {
  margin-left: -1.3333vw;
}
.list li .btn {
  position: absolute;
  top: 5.333vw;
  right: 6.666vw;
  width: 17.6vw;
  height: 8.8vw;
  border-radius: 2px;
  background: #fa2337;
  font-size: 14px;
  text-align: center;
  line-height: 8.8vw;
  color: #fff;
  font-weight: 600;
}
.exchange_text {
  margin-top: 5.332vw;
  width: 100%;
  height: auto;
  overflow: hidden;
  text-align: center;
  padding-bottom: 0.8vw;
}
.exchange_text img {
  display: block;
  margin: 0 auto;
  height: 7.466vw;
}

.mh-tabs {
  white-space: nowrap;
  z-index: 8;
  color: #969696;
  font-size: 15px;
  font-weight: 600;
}
.mh-tab-box {
  width: 100%;
  height: 11.733vw;
  line-height: 11.733vw;
  overflow-x: scroll;
}
.mh-tab {
  display: inline-block;
  position: relative;
  white-space: nowrap;
  padding: 0 5.333vw;
}
.mh-tab span {
  font-size: 15px;
  font-weight: 400;
  color: #969696;
  /* transition: font 0.1s ease; */
}
.mh-tab.act span {
  color: #333;
  font-weight: 600;
}
.mh-tab i {
  position: absolute;
  bottom: 1.6vw;
  left: 50%;
  width: 0;
  height: 0.8vw;
  display: block;
  background: #232323;
  transform: translate(-50%);
  transition: width 0.2s ease-in;
}

.mh-tab.act i {
  width: 40%;
}

.exchange_nav {
  white-space: nowrap;
  width: 100%;
  height: 11.733vw;
  line-height: 11.733vw;
  color: #969696;
  font-size: 15px;
  font-weight: 600;
  overflow-x: scroll;
}
/* .exchange_nav li{
  width: 20%;
  height: 11.733vw;
  float: left;
  text-align: center;
  position: relative;
}
.exchange_nav li.active{
  color: #333;
}
.exchange_nav li.active i{
  position: absolute;
  left:50%;
  transform: translateX(-50%);
  bottom:1.6vw;
  display: block;
  width: 6.933vw;
  height:0.8vw;
  background: #232323;
} */
.exchange_list {
  width: 92vw;
  height: auto;
  margin: 4vw auto 0;
  overflow: hidden;
}
</style>