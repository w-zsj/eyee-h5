<template>
  <div class="sign-in-container">
    <v-headerscopy v-if="!$root.ISAPP && !$root.ISMP" bg="luckDraw">
      <div class="nav-tab2">
        <h3 style="color: #000">签到双十一</h3>
      </div>
    </v-headerscopy>
    <div class="sign-header-container">
      <img
        class="header-bg"
        src="https://files.eyee.com/eyeeh5/img/sign_in/19.png"
        alt=""
        @load="imgLoad"
      />
      <img
        @click="goIntroduction"
        class="activity-info-entrance"
        src="https://files.eyee.com/eyeeh5/img/sign_in/1.png"
        alt=""
      />
      <img
        class="header-banner"
        src="https://files.eyee.com/eyeeh5/img/sign_in/2.png"
        alt=""
      />
      <img
        class="header-btn"
        @click="goViewLuckDraw"
        :src="`https://files.eyee.com/eyeeh5/img/sign_in/${
          isOverSixTimes || isActivityDay ? 4 : 3
        }.png`"
        alt=""
      />
    </div>
    <!--签到日历列表-->
    <div class="sign-calendar-container">
      <div class="sign-summary flex-between">
        <div>已有{{ joinCount }}人参与活动</div>
        <div>我的红包：{{ redPacketAmount }}元(可叠加使用)</div>
      </div>
      <div class="sign-calendar-list flex-btwn flex-wrap">
        <div
          class="sign-item"
          v-for="(item, index) in signCalendarList"
          :key="index"
          id="calendar"
          @click="imgClickShareToFriend(item)"
        >
          <img class="sign-item-img" :src="item.img" alt="" @load="imgLoad" />
          <img
            class="received-mark"
            v-if="item.isget"
            src="https://files.eyee.com/eyeeh5/img/sign_in/5.png"
            alt=""
          />
        </div>
      </div>
    </div>
    <div class="banner-container">
      <div class="sign-in-btn flex-center">
        <img v-if="!isLogin" :src="bannerImg.signBtn" alt="" @click="goLogin" />
      </div>
      <img
        class="sneaker"
        :src="bannerImg.sneaker"
        alt=""
        @click="goSneakerDetail"
        @load="imgLoad"
      />
      <div class="flex-between">
        <img
          class="luck-draw"
          :src="bannerImg.luckDraw"
          alt=""
          @click="goLuckDraw"
          @load="imgLoad"
        />
        <img
          class="lottery"
          :src="bannerImg.lottery"
          alt=""
          @click="goLottery"
          @load="imgLoad"
        />
      </div>
    </div>
    <div id="searchBar">
      <div
        :class="searchBarFixed ? 'isFixed' : ''"
        class="recommend-tab-container"
      >
        <div id="recommend-tab" class="recommend-tab flex">
          <div
            :id="'tab-' + index"
            class="tab-item"
            v-if="item.isShowTab"
            v-for="(item, index) in tabList"
            :key="index"
            @click="tabChange(item, '#anchor-' + index)"
          >
            <div
              class="tab-info"
              :class="{ selected: currTab === item.categoryid }"
            >
              {{ item.category }}
            </div>
          </div>
        </div>
      </div>
      <div :class="searchBarFixed ? 'recommend-top' : ''">
        <div
          :id="'anchor-' + index"
          v-for="(item, index) in tabList"
          :key="index"
          v-if="item.isShowTab"
        >
          <img
            class="tab-main-pic"
            v-lazy="https(item.image)"
            alt=""
            @load="imgLoad"
          />
          <div class="sku-list flex-btwn flex-wrap">
            <div
              class="sku-item"
              v-for="(pro, index) in item.list"
              :key="index"
              @click="goAppDetail(pro.productid)"
            >
              <img
                class="main-img"
                @load="imgLoad"
                v-lazy="https(pro.image)"
                alt=""
              />
              <div class="sku-info">
                <div style="-webkit-box-orient: vertical" class="name">
                  {{ pro.productname }}
                </div>
                <div class="flex-between">
                  <div class="price">
                    <span class="rmb">¥</span>{{ pro.price }}
                  </div>
                  <div class="member">{{ pro.num }}人付款</div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="item.list.length && item.ifMore"
            class="sku-more flex-center"
            @click="getSignProductListMore(item)"
          >
            查看更多<img
              class="icon-more"
              src="https://files.eyee.com/eyeeh5/img/sign_in/38.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <!--分享弹窗-->
    <div class="share-modal-container" v-if="isShowShareModal && !$root.ISMP">
      <div class="share-modal">
        <div class="today-share-price">{{ todaySharePrice }}</div>
        <div class="share-btn" id="bd-share-btn" @click="shareToFriend"></div>
        <img
          class="close-btn"
          @click="closeShareModal"
          src="https://files.eyee.com/eyeeh5/img/sign_in/36.png"
          alt=""
        />
      </div>
    </div>
    <!--满6天弹窗-->
    <div class="receive-tip-modal-container" v-if="isShowReceiveTipModal">
      <div class="receive-tip-modal">
        <div class="share-btn" @click="isShowReceiveTipModal = false"></div>
        <img
          class="close-btn"
          @click="isShowReceiveTipModal = false"
          src="https://files.eyee.com/eyeeh5/img/sign_in/36.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from "@/utils/util";
import {
  SignList,
  SignCategoryList,
  SignProductList,
  ShareSendRedPacket,
  ElevenActivityId,
  JoinNum,
} from "@/common/api/active";
import { DateFormat } from "@/common/util";
import { mapGetters } from "vuex";
let reqCount = 0;
export default {
  data() {
    return {
      currTab: "",
      tabList: [],
      bannerImg: {
        signBtn: `https://files.eyee.com/eyeeh5/img/sign_in/39.png?c=${new Date().getTime()}`,
        sneaker: `https://files.eyee.com/eyeeh5/img/sign_in/16.png?c=${new Date().getTime()}`,
        luckDraw: `https://files.eyee.com/eyeeh5/img/sign_in/17.png?c=${new Date().getTime()}`,
        lottery: `https://files.eyee.com/eyeeh5/img/sign_in/18.png?c=${new Date().getTime()}`,
      },
      signCalendarList: [
        {
          img: "https://files.eyee.com/eyeeh5/img/sign_in/6.png",
          couponPrice: 3,
        },
        {
          img: "https://files.eyee.com/eyeeh5/img/sign_in/7.png",
          couponPrice: 3,
        },
        {
          img: "https://files.eyee.com/eyeeh5/img/sign_in/8.png",
          couponPrice: 3,
        },
        {
          img: "https://files.eyee.com/eyeeh5/img/sign_in/9.png",
          couponPrice: 5,
        },
        {
          img: "https://files.eyee.com/eyeeh5/img/sign_in/10.png",
          couponPrice: 3,
        },
        {
          img: "https://files.eyee.com/eyeeh5/img/sign_in/11.png",
          couponPrice: 3,
        },
        {
          img: "https://files.eyee.com/eyeeh5/img/sign_in/12.png",
          couponPrice: 3,
        },
        {
          img: "https://files.eyee.com/eyeeh5/img/sign_in/13.png",
          couponPrice: 3,
        },
        {
          img: "https://files.eyee.com/eyeeh5/img/sign_in/14.png",
          couponPrice: 4,
        },
        {
          img: "https://files.eyee.com/eyeeh5/img/sign_in/15.png",
          couponPrice: 6,
        },
      ],
      searchBarFixed: false,
      joinCount: "--",
      redPacketAmount: "--",
      isOverSixTimes: false,
      isActivityDay: false,
      todaySharePrice: "",
      isShowShareModal: false,
      isShowReceiveTipModal: false,
      isSixTimes: false,
      isLogin: false,
      shareInfo: {},
      todayInfo: {},
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
    loged() {
      return !!(this.userInfo && this.userInfo.uid);
    },
  },
  mounted() {
    const _ = this;
    window.callbacklogin = (json) => {
      if (json) {
        _.getQueryParamUser(json).then(() => {
          _.apiGetSignList();
          _.isLogin = true;
        });
      } else _.toast("获取登录信息失败~");
    };
    window._SignInShareCallback = function () {
      console.log("进入分享回调---》");
      _.shareBack();
    };
    _.setToolBar({ title: "签到双十一" });
    _.$nextTick(() => {
      setTimeout(() => {
        _.init();
      }, 100);
    });
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  created() {},
  methods: {
    init() {
      let _ = this;
      // _.handleShareInfo()
      const domain = _.$root.isdebug
        ? "http://qzone.eyee.com/"
        : "http://m.eyee.com/";
      _.shareInfo = {
        title: "集美斗牛潮物免费拿！红包任意花！",
        desc: "我发现了一个超赞的东西给你看看！",
        img: "https://files.eyee.com/eyeeh5/img/sign_in/sign_share_h5.png",
        url:
          domain +
          `activity/signin?type=share&sharetemplateid=${
            (_.todayInfo && _.todayInfo.sharetemplateid) || ""
          }`,
      };
      if (_.$root.ISAPP || _.$root.ISMP) {
        console.log("进入app", _.shareInfo);
        if (_.$root.ISAPP) {
          _.javascriptBridge({
            name: "getAppActivityShareContent",
            params: {
              sharecontent: _.shareInfo.desc,
              sharetitle: _.shareInfo.title,
              shareurl: _.shareInfo.url,
              sharepicurl: _.shareInfo.img,
              callbackname: "_SignInShareCallback",
              hideshareicon: false,
            },
          });
        } else if (_.$root.ISMP) {
          let data = {
            sharetitle: _.shareInfo.title,
            sharecontent: _.shareInfo.desc,
            xcxurl: `/pages/home/web?url=${encodeURIComponent(
              _.shareInfo.url
            )}`,
            xcxicon: _.shareInfo.img,
          };
          wx.miniProgram.postMessage({ data: { share: data } });
        }
        console.log("使用app的登录信息");
        if (_.$root.loging) {
          console.log("app已登录");
          _.$root.loging
            .then(($) => {
              if (_.loged) {
                console.log("获取app登录");
                _.apiGetSignList();
                _.isLogin = true;
              } else {
                console.log("未获取app登录");
                _.isLogin = false;
              }
            })
            .catch((e) => {
              console.error("query prams auto login error:", e);
              _.isLogin = false;
            });
        } else if (_.userInfo && _.userInfo.token) {
          console.log("使用h5自身数据登录");
          _.apiGetSignList();
          _.isLogin = true;
        } else {
          console.log("app未登录");
          _.isLogin = false;
        }
      } else {
        _.initShare({
          info: {
            title: _.shareInfo.title,
            url: _.shareInfo.url,
            img: _.shareInfo.img,
            desc: _.shareInfo.desc,
          },
        });
        _.isLogin = !!(_.userInfo && _.userInfo.token);
        if (_.userInfo && _.userInfo.token) {
          _.apiGetSignList();
          _.isLogin = true;
        } else {
          _.isLogin = false;
        }
      }
      _.initApi();
    },
    initApi() {
      const _ = this;
      _.apiGetJoinNum();
      _.apiGetCategoryList();
      _.apiElevenActivityId();
    },
    goLogin() {
      const _ = this;
      if (_.$root.ISAPP) {
        _.GoAppLogin();
      } else if (_.$root.ISMP) {
        wx.miniProgram.navigateTo({
          url: "/pages/home/bind",
        });
      } else {
        _.$router.push("/login");
      }
    },
    shareBack() {
      let _ = this;
      ShareSendRedPacket({
        tempalteid: _.todayInfo && _.todayInfo.sharetemplateid,
      }).then(() => {
        console.log("发券成功----》");
        _.apiGetSignList();
      });
      console.log("_SignInShareCallback---->", _.isSixTimes);
      if (_.isSixTimes) {
        _.isShowReceiveTipModal = true;
      }
      console.log("_SignInShareCallback---->", _.isShowShareModal);
      _.isShowShareModal = false;
    },
    // app登录

    GoAppLogin() {
      let _ = this;
      let callAppLoginPageParams = {
        name: "callAppLoginPage",
        params: { callbackname: "callbacklogin" },
      };
      _.javascriptBridge(callAppLoginPageParams);
    },
    apiGetJoinNum() {
      JoinNum().then((res) => {
        this.joinCount = res || 0;
      });
    },
    apiGetSignList() {
      SignList().then((res) => {
        // this.joinCount = res.num || 0;
        let _ = this;
        reqCount++;
        this.redPacketAmount = res.redpacketamount || 0;
        const signTimes = res.list.filter((item) => item.isget).length;
        const today = DateFormat(new Date(), "yyyy-M-d");
        this.isOverSixTimes = signTimes >= 6;
        this.isSixTimes = signTimes === 6;
        this.signCalendarList.forEach((item, index) => {
          this.$set(item, "isget", res.list[index].isget);
          this.$set(item, "isgetshare", res.list[index].isgetshare);
          this.$set(item, "sharetemplateid", res.list[index].sharetemplateid);
          this.$set(item, "date", res.list[index].date);
          const dateTime = DateFormat(item.date, "yyyy-M-d");
          if (dateTime === today) {
            this.todayInfo = Object.assign({}, item);
            item.isget = true;
          }
          if (index === res.list.length - 1) {
            this.isActivityDay = today === dateTime;
          }
        });
        console.log("todayInfo", this.todayInfo);
        if (this.todayInfo && !this.todayInfo.isget) {
          if (!this.todayInfo.isgetshare) {
            this.isShowShareModal = true;
            this.todaySharePrice = this.todayInfo.couponPrice;
          }
          setTimeout(() => {
            if (reqCount < 3) this.apiGetSignList();
          }, 1000);
        }
      });
    },
    apiGetCategoryList() {
      SignCategoryList().then((res) => {
        this.tabList = res;
        this.currTab = res[0].categoryid;
        window.addEventListener("scroll", this.handleScroll);
        this.tabList.forEach((item) => {
          item.page = 1;
          item.size = 10;
          this.$set(item, "list", []);
          this.$set(item, "ifMore", false);
          this.$set(item, "isShowTab", true);
          this.apiGetSignProductList(item);
        });
        this.$nextTick(() => {
          this.tabList.forEach((item, index) => {
            const documentInfo = document.querySelector("#tab-" + index);
            if (documentInfo) {
              item.offsetLeft =
                documentInfo.offsetLeft + documentInfo.offsetWidth;
            }
          });
        });
      });
    },
    apiElevenActivityId() {
      ElevenActivityId().then((res) => {
        this.elevenActivityId = res;
      });
    },
    getSignProductListMore(item) {
      item.page++;
      this.apiGetSignProductList(item);
    },
    apiGetSignProductList(item) {
      const params = {
        page: item.page,
        size: item.size,
        categoryid: item.categoryid,
      };
      SignProductList(params).then((res) => {
        item.list = item.list.concat(res.list);
        item.ifMore = res.page * res.size < res.total;
        item.isShowTab = !!item.list.length;
      });
    },
    imgClickShareToFriend(item) {
      if (item.date) {
        const dateTime = DateFormat(item.date, "yyyy-M-d");
        const today = DateFormat(new Date(), "yyyy-M-d");
        if (dateTime === today) {
          this.shareToFriend();
        }
      }
    },
    // handleShareInfo() {
    //   const _ = this;
    //   const domain = _.$root.isdebug ? "http://qzone.eyee.com/" : "http://m.eyee.com/";
    //   _.shareInfo = {
    //     title: '集美斗牛潮物免费拿！红包任意花！',
    //     desc: '我发现了一个超赞的东西给你看看！',
    //     img: 'https://files.eyee.com/eyeeh5/img/sign_in/sign_share_h5.png',
    //     url: domain + `activity/signin?type=share`
    //   }
    // },
    shareToFriend() {
      const _ = this;
      if (!_.$root.ISAPP && !_.$root.ISMP) {
        _.openAppClient();
        return;
      }
      console.log("未发送---》");
      if (_.$root.ISMP) {
        console.log("暂不可直接分享");
      } else
        _.javascriptBridge({
          name: "callAppShareDialog",
          params: {
            sharecontent: _.shareInfo.desc,
            sharetitle: _.shareInfo.title,
            shareurl: _.shareInfo.url,
            sharepicurl: _.shareInfo.img,
            callbackname: "_SignInShareCallback",
          },
        });
    },
    tabChange(item, selector) {
      if (this.currTab === item.categoryid) {
        return;
      }
      let anchor = this.$el.querySelector(selector);
      const total = anchor.offsetTop - 44;
      document.body.scrollTop = total;
      document.documentElement.scrollTop = total;
      this.currTab = item.categoryid;
    },
    handleScroll() {
      this.$nextTick(() => {
        let scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        this.searchBarFixed = scrollTop > this.offsetTop;
        if (
          this.tabList.length &&
          this.tabList[0].offsetTop &&
          scrollTop > this.tabList[0].offsetTop
        ) {
          const minTopList = this.tabList.filter(
            (item) => item.offsetTop <= scrollTop + 44
          );
          const minTop = minTopList[minTopList.length - 1];
          this.currTab = minTop.categoryid;
          const clientWidth = document.body.clientWidth;
          if (minTop.offsetLeft > clientWidth) {
            document.getElementById("recommend-tab").scrollLeft =
              minTop.offsetLeft - clientWidth;
          } else {
            document.getElementById("recommend-tab").scrollLeft = 0;
          }
        }
      });
    },
    imgLoad: debounce(function () {
      this.$nextTick(() => {
        if (document.querySelector("#searchBar")) {
          this.offsetTop = document.querySelector("#searchBar").offsetTop;
        }
        this.tabList.forEach((item, index) => {
          if (document.querySelector("#anchor-" + index)) {
            item.offsetTop = document.querySelector(
              "#anchor-" + index
            ).offsetTop;
          }
        });
      });
    }, 50),
    goIntroduction() {
      this.$router.push("/activity/signinintroduction");
    },
    goAppDetail(id) {
      let _ = this;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppSneakerDetailPage",
          params: { productid: id },
        });
      } else if (_.$root.ISMP) {
        wx.miniProgram.navigateTo({
          url: "/pages/sneaker/detail?id=" + id,
        });
      } else {
        this.$router.push("/sneaker/detail/" + id);
      }
    },
    goSneakerDetail() {
      const _ = this;
      _.$router.push("/activity/crazy");
      // if (_.$root.ISMP) {
      //   wx.miniProgram.navigateTo({
      //     url:
      //       "/pages/bull/sneakerTicket?activityid=" +
      //       _.elevenActivityId.eleventicketid,
      //   });
      // } else
      //   _.$router.push({
      //     path: "/sneakerticket/detail",
      //     query: { activityid: _.elevenActivityId.eleventicketid },
      //   });
    },
    goLuckDraw() {
      const _ = this;
      if (_.$root.ISMP) {
        wx.miniProgram.navigateTo({
          url: "/pages/subPage/lottery/index",
        });
      } else _.$router.push({ path: "/activity/luckDraw" });
    },
    goViewLuckDraw() {
      let _ = this;
      if (_.isActivityDay) {
        if (_.$root.ISMP && _.elevenActivityId) {
          wx.miniProgram.navigateTo({
            url: `/pages/subPage/lottery/index?teamid=${_.elevenActivityId.elevenluckdraw}`,
          });
        } else
          _.$router.push({
            path: "/activity/luckDraw",
            query: {
              id: _.elevenActivityId && _.elevenActivityId.elevenluckdraw,
            },
          });
      } else {
        _.$router.push("/activity/luckdrawpromote");
      }
    },
    goLottery() {
      let _ = this;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "CallAppLotteryPage",
        });
      } else if (_.$root.ISMP) {
        wx.miniProgram.navigateTo({
          url: "/pages/drawLottery/lottery",
        });
      } else {
        _.openAppClient();
      }
    },
    closeShareModal() {
      this.isShowShareModal = false;
      console.log("closeShareModal---->", this.isSixTimes);
      if (this.isSixTimes) {
        this.isShowReceiveTipModal = true;
      }
    },
  },
};
</script>

<style lang="scss">
.sign-in-container {
  background: #000;
  color: #fff;
  padding-bottom: 21.3333vw;
}
.isFixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
.recommend-top {
  margin-top: 11.7333vw;
}
.sign-header-container {
  position: relative;
  font-size: 0;
  .activity-info-entrance {
    width: 14.9333vw;
    position: absolute;
    top: 5.86666vw;
    right: 5.86666vw;
  }
  .header-bg {
    width: 100%;
  }
  .header-banner {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .header-btn {
    width: 13.8666vw;
    height: 13.8666vw;
    position: absolute;
    bottom: 8vw;
    right: 10.9333vw;
    animation: shrink 700ms infinite;
  }
  @keyframes shrink {
    0% {
      transform: scale(0.9);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(0.9);
    }
  }
}
.sign-calendar-container {
  padding: 0 3.2vw;
  background: url("https://files.eyee.com/eyeeh5/img/sign_in/20.png") no-repeat;
  background-size: 100%;
  .sign-summary {
    font-size: 3.2vw;
    font-weight: 600;
    padding: 2.9333vw 0 2.1333vw;
  }
}
.sign-calendar-list {
  .sign-item {
    position: relative;
    font-size: 0;
    .sign-item-img {
      width: 18.6666vw;
    }
    .received-mark {
      width: 9.6vw;
      height: 9.6vw;
      position: absolute;
      top: -2.6666vw;
      left: -1.3333vw;
    }
    &:nth-child(0),
    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4) {
      margin-bottom: 2.6666vw;
    }
  }
}
.banner-container {
  background: url("https://files.eyee.com/eyeeh5/img/sign_in/21.png") no-repeat;
  background-size: 100% 100%;
  padding: 13px 4vw 7.466vw;
  font-size: 0;
  .sign-in-btn {
    height: 12.8vw;
    img {
      width: 31.4666vw;
      height: 9.6vw;
      margin-bottom: 3.2vw;
    }
  }
  .sneaker {
    width: 92vw;
    margin-bottom: 2.1333vw;
  }
  .luck-draw {
    width: 44.8vw;
  }
  .lottery {
    width: 45.0666vw;
  }
}
.recommend-tab-container {
  overflow: hidden;
  height: 11.7333vw;
  padding-left: 2.1333vw;
  background: #000;
}
.recommend-tab {
  height: 14.4vw;
  overflow-x: scroll;
  .tab-item {
    flex-shrink: 0;
    color: #fff;
    font-size: 4.2666vw;
  }
  .tab-info {
    padding: 2.9333vw 5.3333vw 2.9333vw 0;
    opacity: 0.5;
  }
  .selected {
    font-weight: 600;
    opacity: 1;
  }
}
.tab-main-pic {
  width: 100%;
  display: block;
}
.sku-list {
  padding: 3.7333vw 2.6666vw 1.6vw;
}
.sku-more {
  font-size: 4.2666vw;
  font-weight: 600;
  color: #c8c8c8;
  padding-bottom: 3.7333vw;
  .icon-more {
    width: 4.8vw;
    height: 4.8vw;
  }
}
.sku-item {
  width: 46.4vw;
  position: relative;
  background: #fff;
  margin-bottom: 2.1333vw;
  .main-img {
    width: 46.4vw;
    height: 46.4vw;
    display: block;
  }
  .sku-info {
    padding: 1.6vw 2.6666vw 2.6666vw;
    .name {
      color: #232323;
      font-size: 3.4666vw;
      height: 9.6vw;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 1.6vw;
    }
    .rmb {
      font-size: 3.2vw;
      margin-right: 1px;
    }
    .price {
      font-size: 4vw;
      font-weight: bold;
      color: #000;
      font-family: "OswaldBold";
    }
    .member {
      font-size: 3.4666vw;
      color: #969696;
    }
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 46.4vw;
    height: 46.4vw;
    background: rgba(0, 0, 0, 0.05);
    z-index: 1;
  }
}
.share-modal {
  width: 76vw;
  height: 68.26666vw;
  background: #fff;
  color: #000;
  background: url("https://files.eyee.com/eyeeh5/img/sign_in/34.png");
  background-size: 76vw 68.26666vw;
  position: relative;
  .today-share-price {
    position: absolute;
    top: 9.6vw;
    right: 26.9333vw;
    font-size: 19.2vw;
    font-family: OswaldBold;
    font-weight: 600;
  }
  .share-btn {
    position: absolute;
    bottom: 5.3333vw;
    left: 5.3333vw;
    width: 65.3333vw;
    height: 11.73333vw;
  }
}
.receive-tip-modal {
  width: 76vw;
  height: 82.6666vw;
  background: #fff;
  background: url("https://files.eyee.com/eyeeh5/img/sign_in/35.png");
  background-size: 76vw 82.6666vw;
  position: relative;
  .share-btn {
    position: absolute;
    bottom: 9.3333vw;
    left: 5.8666vw;
    width: 64vw;
    height: 11.73333vw;
  }
}
.receive-tip-modal,
.share-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  .close-btn {
    position: absolute;
    bottom: -13.8666vw;
    left: 50%;
    transform: translateX(-50%);
    width: 8.53333vw;
    height: 8.53333vw;
  }
}
.share-modal-container,
.receive-tip-modal-container {
  &:before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
