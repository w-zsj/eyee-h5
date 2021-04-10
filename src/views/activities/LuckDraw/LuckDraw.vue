<template>
  <div class="wrapper flex flex-col" :class="[visible ? 'body-fixed' : '', theme == 'onebuy' ? theme : 'other']">
    <!-- 头部 -->
    <v-headerscopy v-if="!$root.ISAPP" bg="luckDraw">
      <div class="nav-tab2">
        <h3 style="color: #000">经典抽抽乐</h3>
      </div>
    </v-headerscopy>
    <!-- 生成分享图片 -->
    <div class="share-pic flex flex-center" id="sharepost">
      <img class="qr-bg" :src="qrbg" alt />
      <div class="qrImg-wrapper">
        <img class="qrImg" :src="qrcode" />
      </div>
    </div>
    <mt-loadmore top-pull-span="下拉刷新" top-drop-span="释放加载" top-loading-span :top-distance="50" :top-method="pageload" ref="loadmore">
      <div class="wrapper-content">
        <!-- 导航栏区域 -->
        <swiper v-if="pumpingimage && pumpingimage.length" :options="tabopt" class="flex" :class="`tabs-wrapper-${theme == 'onebuy' ? theme : 'other'}`" ref="tabswiper">
          <swiper-slide v-for="(item, index) in pumpingimage" :key="'tabList' + index" class="flex-center">
            <div class="tab-item flex flex-center" @click="changeTab(item)">
              <div class="tab-item-content" :class="
                  actTabid == item.id
                    ? `tab-item-content-${theme == 'onebuy' ? theme : 'other'}`
                    : ''
                ">
                <div class="tab-item-imgwrapper flex flex-center" :class="
                    item.backgroundtype == 'onebuy' ? 'tab-item-imgwrapperonebuy' : ''
                  ">
                  <img class="tab-item-img" :class="item.backgroundtype == 'onebuy' ? 'tab-item-imgonebuy' : ''" :src="item.image" />
                </div>
                <div class="tab-item-titleWrapper">
                  <span class="tab-item-title txt-over-2" style="-webkit-box-orient: vertical">{{ item.title }}</span>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper>
        <!-- 公告区域 -->
        <div class="notice-wrapper flex flex-btwn">
          <div v-if="theme !== 'onebuy'" class="flex flex-btwn flex-aic" style="width: 100%">
            <!-- 公告滚动区域 -->
            <div class="notice-bg flex flex-end">
              <div class="textBoxWrapper">
                <transition name="slide">
                  <p class="text" :key="text.id">{{ text.name }}</p>
                </transition>
              </div>
            </div>
            <!-- 按钮 -->
            <div class="notice-btn flex">
              <div v-for="(item, index) in noticeBtn" :key="'notice' + index" @click="changeShowType(item.id)">
                <div class="notice-btn" :class="[
                    item.normalClass,
                    btnState[item.normalClass] ? item.actClass : '',
                  ]" @touchstart.stop="btnState[item.normalClass] = true" @touchend.stop="btnState[item.normalClass] = false" v-if="info.goodstype && info.goodstype.includes(item.id)">
                  <span v-if="showtype === item.id" :class="item.tipClass"></span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-btwn reward-notice flex-aic">
            <!-- 一番赏特殊处理 -->
            <div class="reward-left flex flex-aic reward-left-content">
              <div class="flex flex-btwn flex-aic" v-if="onebuyinfo && onebuyinfo.remaintime && onebuyinfo.count == 0" style="width: 100%">
                <span>请开始抽取...</span>
                <div class="reward-left-btn">{{ cutdowntime }}</div>
              </div>
              <p v-else>
                {{ onebuyinfo && onebuyinfo.isinqueue ? "排队中" : "请排队" }}，前面还有
                <span style="font-family: OswaldBold">{{
                  (onebuyinfo && onebuyinfo.count) || 0
                }}</span>
                人在排队...
              </p>
            </div>
            <div class="reward-right">
              <div class="reward-joinline" v-if="onebuyinfo && !onebuyinfo.isinqueue" @touchstart.stop="btnState.joinline = true" @touchend.stop="btnState.joinline = false" @click="joinline()" :class="btnState.joinline ? 'reward-joinline-act' : ''"></div>
              <div class="reward-outline" v-else @touchstart.stop="btnState.outline = true" @touchend.stop="btnState.outline = false" @click="outline" :class="btnState.outline ? 'reward-outline-act' : ''"></div>
            </div>
          </div>
        </div>
        <!-- 转盘区域 -->
        <div class="turntable-wrapper" :class="theme == 'onebuy' ? 'nobottom' : ''" v-if="info">
          <div class="turntable-content" :class="`turntable-content-${theme == 'onebuy' ? theme : 'other'}`">
            <div class="turntable-content-bg" :class="`turntable-color-${theme == 'onebuy' ? theme : 'other'}`">
              <div class="turntable-item-wrapper">
                <div class="flex flex-center turntable-item-wrappercontent">
                  <div class="center-wrapper">
                    <div class="flex flex-btwn flex-aic">
                      <div class="center-left" v-if="theme != 'onebuy'">
                        <div class="flex center-left-txt">
                          <img class="center-wrapper-luckdesc" src="https://files.eyee.com/eyeeh5/img/lottery/10.png" alt="" /><span class="center-left-luckValue">{{
                            info.currentlucky
                          }}</span>
                        </div>
                        <p class="center-wrapper-desc">幸运值越高,获SR及以上概率更高</p>
                      </div>
                      <div v-else class="nowprogress flex flex-col">
                        <img class="nowprogress-img" src="https://files.eyee.com/eyeeh5/img/lottery/v23/6.png" />
                        <p class="nowprogress-number" v-if="onebuyinfo && onebuyinfo.process">
                          {{
                            (onebuyinfo.process && onebuyinfo.process.split("/")[0]) || 0
                          }}
                          /
                          {{
                            (onebuyinfo.process && onebuyinfo.process.split("/")[1]) || 0
                          }}
                        </p>
                      </div>
                      <div v-if="info.producttype == 4" class="reload-btn" :class="btnState.reload ? 'reload-btn-act' : ''" @click="reload" @touchstart.stop="btnState.reload = true" @touchend.stop="btnState.reload = false"></div>
                      <div class="center-right">
                        <span class="star"></span>
                        <div class="diamondsWrapper">
                          <div v-if="rangeValue < 100" class="diamonds-bg">
                            <div class="diamonds"></div>
                            <img class="base-img" id="base-img" src="https://files.eyee.com/eyeeh5/img/lottery/12-2.png" width="40px" height="auto" />
                            <canvas id="canvas" ref="canvas" class="diamondsCanvas"></canvas>
                          </div>
                          <div v-else class="fulldiamonds"></div>
                        </div>
                      </div>
                    </div>
                    <div class="flex flex-between buy-count-wrapper">
                      <div class="buy-count flex flex-center" :class="`buy-count-${theme == 'onebuy' ? theme : 'other'}`">
                        {{ info.buycount }}
                      </div>
                      <div v-if="theme != 'onebuy'" class="buy-btn" :class="btnState.buycount ? 'buy-btn-act' : ''" @touchstart.stop="btnState.buycount = true" @touchend.stop="btnState.buycount = false" @click="
                          toRoute('/activity/purchaseTimes?type=' + info.producttype)
                        "></div>
                      <div v-else class="onebuy-buy-btn" :class="btnState.buycount ? 'onebuy-buy-btnAct' : ''" @touchstart.stop="btnState.buycount = true" @touchend.stop="btnState.buycount = false" @click="
                          toRoute('/activity/purchaseTimes?type=' + info.producttype)
                        "></div>
                    </div>
                  </div>

                  <div v-for="(item, index) in info.detaillist" :style="
                      0 <= index && index <= 2
                        ? `top: 0;left: ${index * 23.3}vw`
                        : 3 <= index && index <= 4
                        ? `right: 0; top: ${(index - 3) * 34.4}vw`
                        : 4 < index && index <= info.detaillist.length - 2
                        ? `bottom: 0; left: ${
                            (info.detaillist.length - 2 - index) * 23.3
                          }vw`
                        : index == info.detaillist.length - 1
                        ? 'left: 0; bottom: 34.4vw'
                        : ''
                    " :key="'detaillist' + index" class="detaillist-item">
                    <div class="turntable-item" :class="`turntable-item-${theme == 'onebuy' ? theme : 'other'}`" @click.stop="toggleShow('showPicDetail', index)">
                      <div class="turntable-item-content">
                        <div class="content-bg" :class="[
                            ['SSR', 'LAST赏'].includes(item.goodslevel)
                              ? 'bigward'
                              : theme == 'onebuy'
                              ? 'normal-onebuy'
                              : 'normal',
                            rewardId === item.id ? 'content-bg-act' : '',
                          ]">
                          <!-- 售完 -->
                          <div class="content-bg-saleout flex flex-center" v-if="!item.goodsnum && info.producttype == 4">
                            <span class="saleout-bg">售完</span>
                          </div>
                          <!-- 销售进度 -->
                          <div class="onebuy-progress flex flex-center" v-if="theme == 'onebuy'">
                            <span class="onebuy-progress-number flex flex-center">{{ item.goodsnum || 0 }}/{{ item.stock || 0 }}</span>
                          </div>
                          <div class="img-content">
                            <img :src="item.image" class="content-img" />
                          </div>
                          <div class="content-level">{{ item.goodslevel }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 一番赏 -->
        <div v-if="info.producttype == 4" style="padding: 2.13vw">
          <img v-if="onebuyImg[actTabid]" :src="onebuyImg[actTabid]" width="100%" @click="detailFun(onebuyImg[actTabid])" height="auto" />
          <div style="height: 20vw"></div>
        </div>
        <div v-else>
          <!-- 其他活动区域 -->
          <div class="otherActivity" :class="`otherActivity-${theme == 'onebuy' ? theme : 'other'}`" v-if="SwitchAdv&&$root.ISAPP || bannerInfo.image">
            <div class="organizeTeam" @click="lookAdv(1)" v-if="SwitchAdv&&$root.ISAPP&&theme != 'onebuy'">
              <img src="https://files.eyee.com/eyeeh5/img/lottery/adv_banner.png" width="100%" height="auto" />
            </div>
            <div class="organizeTeam" @click="toggleShow('showTeamPopup')" v-if="bannerInfo.image">
              <img :src="bannerInfo.image" width="100%" height="auto" />
            </div>
          </div>
          <div v-else class="empty"></div>
        </div>
      </div>
    </mt-loadmore>
    <!-- 规则说明 -->
    <div class="ruleDesc" :class="$root.ISAPP ? 'top1' : ''" @click="toRoute('/active/a0d38506550a4fc58ecb08531f9e5417?show=0')" v-if="info.producttype == 4">
      规则说明
    </div>
    <!-- 玩家群 -->
    <div class="playerGroup" @click="toggleShow('showKefuPopup')">
      <img src="https://files.eyee.com/c2cxcx/img/lot/2.gif" class="kefu" />
      <img src="https://files.eyee.com/c2cxcx/img/lot/2.png" class="joinTeam" />
    </div>
    <!-- 下滑更多 -->
    <!-- <div class="loadmore"
         v-if="showloadmore && bannerInfo.image">
      <img class="finger"
           src="https://files.eyee.com/eyeeh5/img/lottery/16.png" />
      <div class="loadmore-word"></div>
    </div> -->
    <!-- footer -->
    <div class="footer-wrapper">
      <div class="footer-stage-btn flex">
        <div :class="[
            `footer-warehouse-${theme == 'onebuy' ? theme : 'other'}`,
            btnState.warehouse
              ? `footer-warehouse-${theme == 'onebuy' ? theme : 'other'}-act`
              : '',
          ]" @touchstart.stop="btnState.warehouse = true" @touchend.stop="btnState.warehouse = false" @click="toRoute('/activity/warehouse')">
          <div class="footer-warehousecount flex flex-center">
            {{ info.stockpilenum > 99 ? 99 : info.stockpilenum || 0 }}
          </div>
        </div>
        <div class="adv">
          <div :class="[
            `footer-drawone-${theme == 'onebuy' ? theme : 'other'}`,
            btnState.drawone
              ? `footer-drawone-${theme == 'onebuy' ? theme : 'other'}-act`
              : '',
          ]" @touchstart.stop="btnState.drawone = true" @touchend.stop="btnState.drawone = false" @click.stop="startDraw(1)">
          </div>
          <span v-if="advEnter" @click.stop="lookAdv"></span>
        </div>

        <div :class="[
            `footer-drawfive-${theme == 'onebuy' ? theme : 'other'}`,
            btnState.drawfive
              ? `footer-drawfive-${theme == 'onebuy' ? theme : 'other'}-act`
              : '',
          ]" @touchstart.stop="btnState.drawfive = true" @touchend.stop="btnState.drawfive = false" @click="startDraw(2)"></div>
      </div>
      <div class="footer-stage" :class="`footer-stage-${theme == 'onebuy' ? theme : 'other'}`"></div>
    </div>

    <!-- 抽奖结果弹窗 -->
    <DrawResults :visible="visible" :theme="theme" :type="type" :advEnter='advEnter' :rewardInfo="rewardInfo" @toggle="closeWindow"></DrawResults>

    <!-- 组队弹窗 -->
    <Popup :visible="showTeamPopup" @cancel="toggleShow('showTeamPopup')">
      <div class="teamPopup-wrapper flex flex-col">
        <p class="teamPopup-dec">
          邀请<span class="blodFont">{{ bannerInfo.member - 1 }}</span>名{{ bannerInfo.newuser ? "新用户" : "好友" }}加入即可获得免费抽取次数
        </p>
        <div class="teamPopup-btn" @click="invitation">立即邀请</div>
      </div>
    </Popup>

    <!-- 客服弹窗 -->
    <Popup :visible="showKefuPopup">
      <div class="kefupopup flex flex-col flex-aic">
        <div class="kefupopup-caption flex flex-col flex-aic">
          <p>加抽友群</p>
          获最新一番赏福利信息
        </div>
        <img :src="kefuinfo && kefuinfo.wximage" class="kefupopup-img" />
        <div class="kefupopup-kefuinfo flex flex-between flex-aic" @click="copyText(kefuinfo.wxid)">
          <div class="flex">
            <img :src="kefuinfo && kefuinfo.userhead" class="kefupopup-header" />
            <div class="kefuinfo-number">
              <p>微信：</p>
              {{ kefuinfo && kefuinfo.username }}
            </div>
          </div>
          <div class="kefuinfo-copyBtn flex flex-center">
            <span class="small">复制</span>
          </div>
        </div>
        <div class="share-group flex flex-col flex-aic">
          <p class="share-word">分享好友中奖几率更高哦</p>
          <div class="flex flex-center share-group-content">
            <div class="share-weixin flex flex-center">
              <img @click="appshareWeixin(2)" class="share-icon" src="https://files.eyee.com/c2cxcx/img/lot/4.png" />
            </div>
            <!-- <div class="share-pengyouquan flex flex-center">
              <img
                @click="appshareWeixin(1)"
                class="share-icon"
                src="https://files.eyee.com/c2cxcx/img/lot/5.png"
              />
            </div> -->
            <div class="share-pengyouquan group flex flex-center">
              <img @click="appshareWeixin(3)" class="share-icon" src="https://files.eyee.com/c2cxcx/img/lot/6.png" />
            </div>
          </div>
        </div>
        <img class="kefupopup-close" src="https://files.eyee.com/eyeeh5/img/lottery/icon_close.png" @click.stop="toggleShow('showKefuPopup')" />
      </div>
    </Popup>
    <!-- 图片细节显示弹窗 -->
    <Popup :visible="showPicDetail" @cancel="toggleShow('showPicDetail')">
      <div class="picWrapper flex flex-col flex-aic">
        <p class="picWrapper-number">{{ picactiveindex }}/{{ picDetailList.length }}</p>
        <swiper v-if="picDetailList && picDetailList.length" :options="picopt" class="flex pic-swiper" ref="picswiper">
          <swiper-slide v-for="(item, index) in picDetailList" :key="'pic' + index" class="pic-swiper-item">
            <div class="flex flex-aic pic-swiper-item-wrapper">
              <img :src="item" class="item-img" />
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </Popup>

    <!-- 确认所在系列弹窗 -->
    <Popup :visible="showSeriesConfirm" @cancel="toggleShow('showSeriesConfirm')">
      <div class="seriesConfirm">
        <img src="https://files.eyee.com/eyeeh5/img/lottery/v23/16.png" class="seriesConfirm-bg" />
        <div class="seriesConfirm-content flex flex-col flex-aic">
          <p class="seriesConfirm-tip">您当前所在系列</p>
          <div class="seriesConfirm-imgWrapper">
            <div class="seriesConfirm-imgbg">
              <img :src="actTabimg" class="seriesConfirm-img" />
            </div>
          </div>
          <p class="seriesConfirm-tipword flex">
            <span class="seriesConfirm-circle" :class="isRemandValue ? 'seriesConfirm-circle-act' : ''" @click.stop="isRemandValue = isRemandValue ? 0 : 1"></span>
            我需要每次提示我抽取的系列
          </p>
          <div class="confirm-btn" @click.stop="confirm">确认</div>
        </div>
      </div>
    </Popup>
    <input id="copy" class="hide" style="opacity: 0" readonly />
  </div>
</template>

<script>
import DrawResults from "./comps/DrawResults";
import Popup from "./comps/Popup";
import {
  LuckDrawHome,
  DrawOne,
  DrawFive,
  LuckDrawOpen,
  DrawTab,
  DrawActBanner,
  Addlucky,
  Invitation,
  Getweixin,
  BaseConfig,
  Addqueue,
  Popqueue,
  isOpenAdv,
} from "@/common/api/active";
import { Indicator } from "mint-ui";
import { GetWeappQRCode } from "@/utils/api/base";
import { mapGetters, mapMutations } from "vuex";
import Wave from "@/utils/wave";
import { html2canvas } from "@/utils/html2canvas.js";

const ISDEV = process.env.NODE_ENV !== "production";
const body = document.getElementsByTagName("body")[0];
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

window.callbacklogin = (json) => {
  var result;
  if (json) {
    result = JSON.parse(decodeURIComponent(json));
  }
  localStorage.setItem("currentUser", JSON.stringify(result));
  window.location.reload();
};

export default {
  name: "LuckDraw",
  components: { DrawResults, Popup },
  data() {
    return {
      shareInfo: {
        sharecontent: "",
        sharepicurl: "https://files.eyee.com/eyeeh5/img/draw/share.jpg",
        shareurl: "",
        sharetitle: "",
        callbackname: "_shareCallBack",
        hideshareicon: false,
      },
      qrcode: "",
      qrbg: "",
      sharePicUrl: "",
      onebuyImg: {},
      cutdowntime: "",
      cuttimer: null,
      onebuyinfo: null,
      baseInfo: null,
      theme: "onebuy", // 先固定为lego主题
      showTeamPopup: false,
      showKefuPopup: false,
      showPicDetail: false,
      showSeriesConfirm: false,
      picDetailList: [],
      rewardId: "",
      txtIndex: 0,
      noticeBtn: [
        {
          id: 1,
          normalClass: "new",
          actClass: "newAct",
          tipClass: "newtip",
        },
        {
          id: 2,
          normalClass: "unpack",
          actClass: "unpackAct",
          tipClass: "unpacktip",
        },
      ],
      clickFlag: true, // 防止连续点击
      info: {},
      rewardInfo: [],
      type: 1, // 抽奖类型
      showtype: 0, // 商品类型 1:全新 2:拆袋 3:预售
      visible: false,
      tabopt: {
        autoplay: false,
        speed: 0,
        spaceBetween: 0,
        slidesPerView: 4.8,
      },
      picactiveindex: 1,
      picopt: {
        spaceBetween: 0,
        slidesPerView: 1,
        loop: true,
        initialSlide: this.picactiveindex,
        onSlideChangeEnd: (swiper) => {
          console.log("swiper----", swiper.activeIndex);
          if (swiper.activeIndex > this.picDetailList.length) {
            this.picactiveindex = 1;
          } else if (swiper.activeIndex <= 0) {
            this.picactiveindex = this.picDetailList.length;
          } else {
            this.picactiveindex = swiper.activeIndex;
          }
        },
      },
      timerModal: null,
      pumpingimage: [], // tab
      actTabid: "",
      actTabimg: "",
      // 旋转规则数组
      rotateDir: [
        { index: 0, next: 1 },
        { index: 1, next: 2 },
        { index: 2, next: 3 },
        { index: 3, next: 6 },
        { index: 6, next: 10 },
        { index: 10, next: 9 },
        { index: 9, next: 8 },
        { index: 8, next: 7 },
        { index: 7, next: 4 },
        { index: 4, next: 0 },
      ],
      showloadmore: false,
      rangeValue: 0,
      isDrawContainer: false,
      drawWave: "",
      turnBtn: {
        warehouse: 0,
        drawone: 0,
        drawfive: 0,
      },
      teamid: "",
      bannerInfo: {},
      btnState: {
        buycount: false, // 购买次数
        warehouse: false, // 积存仓
        drawone: false, // 抽五次
        drawfive: false, // 抽一次
        new: false, // 新
        unpack: false, // 拆,
        joinline: false, // 加入队列
        outline: false, // 退出队列
        bugpostcard: false, // 购买明信片
        onebuyWarehouse: false, // 一番赏积存仓
        onebuyDrawone: false, // 一番赏抽一次
        onebuyAllbug: false, // 一番赏全收
        reload: false,
      },
      kefuinfo: null,
      isRemandValue: 1,

      SwitchAdv: false, // 是否显示广告入口 总开关
      userShowAdv: false, // 当前用户是否 还可以播放广告
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
      activeid: "activeid",
      isRemand: "isRemand",
    }),
    text() {
      if ("scroll" in this.info) {
        return { name: this.info.scroll[this.txtIndex], id: this.txtIndex };
      } else {
        return "";
      }
    },
    loged() {
      return !!(this.userInfo && this.userInfo.uid);
    },
    mySwiper() {
      return this.$refs.mySwiper.swiper;
    },
    advEnter() {
      if (
        this.$root.ISAPP &&
        this.SwitchAdv &&
        this.userShowAdv &&
        !this.info.buycount &&
        this.theme != "onebuy"
      ) {
        return true;
      } else return false;
    },
  },
  created() {
    const { id } = this.$route.query;
    if (id) {
      this.actTabid = id;
    }
    this.isRemandValue = this.isRemand;
    this.getweixin();
    this.getbaseInfo();
  },
  mounted() {
    let _ = this;
    this.setToolBar({
      title: "经典抽抽乐",
      bgcolor: "#f5f5f5",
      textcolor: "#323232",
    });

    if (_.$root.ISAPP) {
      if (_.$root.loging) {
        _.$root.loging
          .then(($) => {
            _.getActivityTab();
          })
          .catch((e) => {
            console.error("query prams auto login error:", e);
            _.getActivityTab();
          });
      } else {
        _.getActivityTab();
      }

      _.getAdvStatus(); // 广告
    } else {
      _.getActivityTab();
    }
    window.addEventListener("scroll", this.scrollHandle);
    if (this.activeid) {
      this.actTabid = this.activeid;
    }
    window._shareCallBack = (res, via) => {
      const _ = this;
      // _.toast("回调的参数值" + JSON.stringify(res));
      if (res == 1) _.toast("分享成功~");
    };
    _.loading();
    window._GeneratePoster = (res, via) => {
      const _ = this;
      _.loading();
      if (res == 1) _.toast("图片已保存到相册~");
    };
    window.AdvResult = (res) => {
      console.log("广告回调-->>>", res);
      _.getActivityTab();
      _.getAdvStatus();
    };
  },
  beforeDestroy() {
    clearTimeout(this.timerModal);
    clearTimeout(this.timer);
    window.removeEventListener("scroll", this.scrollHandle);
    cancelAnimationFrame(this.drawWave);
    clearInterval(this.cuttimer);
  },
  methods: {
    ...mapMutations(["UPDATE_ISREMAND"]),
    // 判断是否显示广告 总开关
    getAdvStatus() {
      isOpenAdv().then((res) => {
        let _ = this;
        if (res && res.model && res.model.length) {
          res.model.forEach((el) => {
            if (el.id == 10 && el.isopen) _.SwitchAdv = true;
          });
        }
      });
    },
    lookAdv(type = 0) {
      let _ = this;
      if (!this.userInfo.token) {
        // app登录
        this.GoAppLogin();
        return;
      } else {
        if (this.onebuyinfo && this.onebuyinfo.process) {
          const arr = this.onebuyinfo.process.split("/");
          if (arr[0] == 0) {
            this.toast("活动已经结束");
            return;
          }
        }
        if (type == 1) {
          if (!_.userShowAdv) {
            _.toast("本日已达到上限,明天再继续吧~");
            return;
          }
        } else if (!_.advEnter) {
          _.toast("本日已达到上限,明天再继续吧~");
          return;
        }
        // 调起app 广告
        _.javascriptBridge({
          name: "callAppShowAD",
          params: {
            source: 1,
            id:_.actTabid,
            callbackname: "AdvResult",
          },
        });
        // if ((type == 1 && _.userShowAdv) || _.advEnter) {

        // }
      }
    },
    // 获取基本配置信息分享信息
    getbaseInfo() {
      let _ = this;
      BaseConfig().then((res) => {
        if (res) {
          this.shareInfo.sharetitle = res.sharetitle;
          this.shareInfo.sharecontent = res.sharecontent;
          let url;
          if (this.$root.isdebug) {
            url = "http://qzone.eyee.com";
          } else {
            url = "https://m.eyee.com";
          }
          this.shareInfo.shareurl =
            url + window.location.pathname + "?id=" + _.actTabid;
          if (_.$root.ISAPP) {
            // 调起app分享
            _.javascriptBridge({
              name: "getAppActivityShareContent",
              params: _.shareInfo,
            });
          }
        }
      });
    },
    // 直接分享微信好友,微信朋友圈
    appshareWeixin(type) {
      const _ = this;
      if (!this.userInfo.token) {
        if (this.$root.ISAPP) {
          // app登录
          this.GoAppLogin();
          return;
        } else {
          this.$router.push("/login");
          return;
        }
      }
      if (_.$root.ISAPP) {
        if (type == 3) {
          this.getShareQr(this.actTabid);
        } else {
          _.javascriptBridge({
            name: "callAppDirectlyShare",
            params: {
              sharecontent: _.shareInfo.sharecontent,
              sharepicurl: _.shareInfo.sharepicurl,
              sharetitle: _.shareInfo.sharetitle,
              shareurl: "",
              platform: 2,
              xcxurl: "/pages/subPage/lottery/index?id=" + _.actTabid,
              xcxicon: _.shareInfo.sharepicurl,
              xcxid: "gh_038ca9308eac",
              callbackname: "_shareCallBack",
              type: 2,
            },
          });
        }
      }
    },
    // 获取小程序二维码
    getShareQr(id) {
      const _ = this;
      // 生成小程序二维码
      GetWeappQRCode({
        path: "pages/subPage/lottery/index",
        productid: id,
        ishyaline: true,
      })
        .then((res) => {
          console.log("获取小程序二维码结果 ===>", res);
          if (res) {
            _.qrcode = res.picurl;
            _.loading("海报生成中....");
            this.$nextTick(() => {
              _.createPost();
            });
            _.createPost();
          }
        })
        .catch((err) => {
          console.error("获取小程序二维码报错 ===> ", err);
        });
    },
    // 生成分享海报
    createPost() {
      const _ = this;
      const $layer = document.getElementById("sharepost");
      html2canvas($layer, { useCORS: true }).then((canvas) => {
        let dataUrl = canvas.toDataURL("image/jpg");
        dataUrl = dataUrl.replace("data:image/png;base64,", "");
        console.log("dataUrl----", dataUrl);

        // _.shareInfo.sharepicurl = dataUrl;
        _.javascriptBridge({
          name: "callAppSaveImageToPhotoAlbum",
          params: {
            imagedata: dataUrl,
            callbackname: "_GeneratePoster",
          },
        });
        setTimeout(() => _.loading(), 5000);
      });
    },
    loading(title) {
      if (title) {
        Indicator.open({
          text: title,
          spinnerType: "triple-bounce", // 'snake''fading-circle''double-bounce''triple-bounce'
        });
      } else Indicator.close();
    },
    detailFun(imgUrl) {
      this.picDetailList = [imgUrl];
      this.toggleShow("showPicDetail", 0);
    },
    reload() {
      this.activeDetail();
    },
    // 加入队列
    joinline(needDraw = false) {
      const _ = this;
      if (!this.userInfo.token) {
        if (this.$root.ISAPP) {
          // app登录
          this.GoAppLogin();
          return;
        } else {
          this.$router.push("/login");
          return;
        }
      }
      if (this.info.producttype == 4) {
        // 商品是否已经抽完
        const arr = this.onebuyinfo.process.split("/");
        if (this.onebuyinfo.process) {
          if (arr[0] == 0) {
            this.toast("活动已经结束");
            return;
          }
        }
      }
      Addqueue({ tabid: this.actTabid })
        .then((res) => {
          console.log("加入队列结果 ===>", res);
          this.toast("成功加入队列");
          this.getOpenDetail().then((res) => {
            if (needDraw) {
              _.startDraw(_.type, 0);
            }
          });
        })
        .catch((err) => {
          this.toast(err.msg);
          console.error("加入队列报错 ===>", err);
        });
    },
    // 退出队列
    outline() {
      Popqueue({ tabid: this.actTabid })
        .then((res) => {
          console.log("退出队列结果 ===> ", res);
          this.toast("成功退出队列");
          this.getOpenDetail();
        })
        .catch((err) => {
          console.error("退出队列报错 ===>", err);
          this.toast(err.msg);
        });
    },
    // 下拉刷新
    pageload() {
      this.$refs.loadmore.onTopLoaded();
      this.getActivityTab();
    },
    confirm() {
      this.toggleShow("showSeriesConfirm");
      if (this.isRemand != this.isRemandValue) {
        this.UPDATE_ISREMAND(this.isRemandValue);
      }
      this.startDraw(this.type, false);
    },
    // 获取微信客服信息
    getweixin() {
      Getweixin()
        .then((res) => {
          console.log("获取微信客服信息结果 ===>", res);
          if (res) {
            this.kefuinfo = Object.assign({}, res);
          }
        })
        .catch((err) => {
          console.error(" 获取微信客服信息报错 ===>", err);
        });
    },
    copyText(value) {
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        // 区分iPhone设备
        // 获取隐藏的input，并写入text内容，在进行复制
        var input = document.getElementById("copy");
        input.value = value;
        input.select();
        input.setSelectionRange(0, input.value.length); // 兼容ios
        document.execCommand("Copy");
        input.blur();
        this.toast("已复制");
      } else {
        var orUrl = document.getElementById("copy");
        orUrl.value = value;
        orUrl.select();
        if (document.execCommand("copy")) {
          document.execCommand("copy");
          this.toast("已复制");
        }
      }
    },
    // 立即邀请
    invitation() {
      Invitation()
        .then((res) => {
          console.log("立即邀请成功 ===>", res);
          if (res) {
            this.toRoute("/activity/teamup/" + res.teamid);
          }
        })
        .catch((err) => {
          console.log("立即邀请报错 ===>", err);
        });
    },
    organizeTeam() {
      const _ = this;
      DrawActBanner()
        .then((res) => {
          console.log("立即邀请结果", res);
          if (res) {
            this.bannerInfo = Object.assign({}, res);
            this.teamid = res.teamid;
          }
        })
        .catch((err) => {
          _.toast(err.msg, "error");
          console.error("立即邀请报错", err);
        });
    },
    // 切换弹窗显示
    toggleShow(type, index = "") {
      if (type === "showTeamPopup" && this.bannerInfo.sponsor) {
        if (this.onebuyinfo.process) {
          const arr = this.onebuyinfo.process.split("/");
          if (arr[0] == 0) {
            this.toast("活动已经结束");
            return;
          }
        }
        this.$router.push("/activity/teamup/" + this.teamid);
        return;
      }
      this[type] = !this[type];
      if (this[type]) {
        body.classList.add("body-fixed");
      } else {
        body.classList.remove("body-fixed");
      }
      if (index !== "" && type == "showPicDetail") {
        this.$nextTick(() => {
          this.picactiveindex = index + 1;
          this.$refs.picswiper.swiper.slideTo(index + 1, 100, false);
        });
      }
    },
    scrollHandle(e) {
      let top = e.srcElement.scrollingElement.scrollTop;
      if (top > 0) {
        this.showloadmore = false;
      } else {
        this.showloadmore = true;
      }
    },
    // 初始化钻石画布
    initcanvas() {
      cancelAnimationFrame(this.drawWave);
      const canvas = document.getElementById("canvas");
      canvas.height = 40;
      canvas.width = 40;
      this.canvas = canvas;

      this.canvasWidth = canvas.width;
      this.canvasHeight = canvas.height;
      this.nowRange = 0;
      this.wave1 = new Wave({
        canvasWidth: this.canvasWidth, // 轴长
        canvasHeight: this.canvasHeight, // 轴高
        waveWidth: 0.2, // 波浪宽度,数越小越宽
        waveHeight: 2, // 波浪高度,数越大越高
        colors: ["#AA0AB9", "#AA0AB9"], // 波浪颜色
        xOffset: 38, // 初始偏移
        speed: 0.04, // 速度
        bgimage: "https://files.eyee.com/eyeeh5/img/lottery/12-2.png",
      });
      this.draw();
    },
    draw() {
      console.log("this.canvas", this.canvas);

      if (!this.canvas) return;
      const ctx = this.canvas.getContext("2d");
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      if (this.nowRange <= this.rangeValue) {
        this.nowRange += 1;
      }
      if (this.nowRange > this.rangeValue) {
        this.nowRange -= 1;
      }
      this.wave1.update({
        nowRange: this.nowRange,
      });
      this.wave1.draw(ctx);
      this.drawWave = window.requestAnimationFrame(this.draw);
    },
    drawbg(ctx) {
      ctx.lineWidth = 0;
      ctx.beginPath(20, 39);
      ctx.moveTo(0, 14.7);
      ctx.lineTo(8.41, 2.81);
      ctx.lineTo(20, 1);
      ctx.lineTo(31.65, 2.81);
      ctx.lineTo(40, 14.7);
      ctx.lineTo(20, 39);
      ctx.strokeStyle = "rgba(0, 0, 0, 0)";
      ctx.stroke();
      ctx.clip();
      this.isDrawContainer = true;
    },
    // 公告栏滚动
    startMove() {
      const _ = this;
      this.timer = setTimeout(() => {
        if (_.txtIndex === 50 || _.txtIndex >= _.info.scroll.length - 1) {
          _.txtIndex = 0;
        } else {
          _.txtIndex += 1;
        }
        _.startMove();
      }, 2000); // 滚动不需要停顿则将2000改成动画持续时间
    },
    changeTab(item) {
      this.actTabid = item.id;
      this.actTabimg = item.image;
      this.theme = item.backgroundtype;
      this.qrbg = item.shareimage;
      this.activeDetail();
      this.rewardId = "";
      // this.getShareQr(this.actTabid);
    },
    // 活动详情获取
    activeDetail() {
      const _ = this;
      if (!_.$root.ISAPP) {
        if (_.userInfo && _.userInfo.token) {
          _.getOpenDetail();
          _.organizeTeam();
        } else {
          _.getDetail();
        }
      } else if (_.$root.loging) {
        _.$root.loging
          .then(($) => {
            console.log("登录返回信息", $);
            if (_.loged) {
              console.log("app已经登录----");
              _.getOpenDetail();
              _.organizeTeam();
              // 补救包
              _.remedialPackage();
            } else {
              console.log("app未登录----");
              _.getDetail();
            }
          })
          .catch((e) => {
            console.error("query prams auto login error:", e);
            _.getDetail();
          });
      } else {
        _.getDetail();
      }
    },
    // 补救包
    remedialPackage() {
      const _ = this;
      Addlucky().then((res) => {
        if (res) {
          _.visible = true;
          _.getOpenDetail();
          _.rewardInfo = [
            {
              goodslevel: "N",
              image:
                "https://files.eyee.com/eyeeh5/img/lottery/luck-figure.png",
            },
          ];
        }
      });
    },
    // 获取活动tab
    getActivityTab() {
      const _ = this;
      let { onebuyImg } = _;
      DrawTab()
        .then((res) => {
          console.log("获取活动tab结果 ==>", res);
          if (res && res.length) {
            _.pumpingimage = res.map((ele) => {
              // if (ele.jumpflag && !_.actTabid) {
              //   _.actTabid = ele.id;
              //   _.actTabimg = ele.image;
              //   _.theme = ele.backgroundtype;
              //   _.qrbg = ele.shareimage;
              // }
              // 如果有默认选中的活动
              if (_.actTabid && ele.id == _.actTabid) {
                _.actTabid = ele.id;
                _.actTabimg = ele.image;
                _.theme = ele.backgroundtype;
                _.qrbg = ele.shareimage;
              }
              onebuyImg[ele.id] = ele.detailimage;
              return ele;
            });
            if (!_.actTabid) {
              _.actTabid = _.pumpingimage[0].id;
              _.actTabimg = _.pumpingimage[0].image;
              _.theme = _.pumpingimage[0].backgroundtype;
              _.qrbg = _.pumpingimage[0].shareimage;
            }
            _.activeDetail();
            // _.getShareQr(_.actTabid);
          } else {
            _.pumpingimage = [];
          }
        })
        .catch((err) => {
          _.pumpingimage = [
            {
              id: "we1",
              image:
                "https://api.eyee.com/Shop/java/59613bb6db6740149cb061c5d51a3915.png",
            },
            {
              id: "we2",
              image:
                "https://api.eyee.com/Shop/java/59613bb6db6740149cb061c5d51a3915.png",
            },
          ];
          _.actTabid = _.pumpingimage[0].id;
          console.error("获取活动tab报错 ==>", err);
        });
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
    closeWindow(type) {
      body.classList.remove("body-fixed");
      this.clickFlag = true;
      this.visible = !this.visible;
      if (type) {
        if (this.info.producttype == 4) {
          this.getOpenDetail().then((res) => {
            this.startDraw(type);
          });
        } else {
          if (this.advEnter) this.lookAdv();
          else this.startDraw(type);
        }
      }
    },
    dealData(res) {
      const _ = this;
      if (res.detaillist && res.detaillist.length) {
        if (!_.rewardId) {
          _.rewardId = res.detaillist[0].id;
        }
        let rotateDir = [];
        this.picDetailList = res.detaillist.map((ele, index) => {
          if (index >= res.detaillist.length - 1) {
            rotateDir.push({ index, next: 0 });
          } else {
            rotateDir.push({ index, next: index + 1 });
          }
          return ele.detail || ele.image;
        });
        this.rotateDir = rotateDir;
      }
      _.info = Object.assign({}, res);
      this.rangeValue = res.currentlucky;
      this.onebuyinfo = Object.assign({}, res.onebuyinfo);
      clearInterval(this.cuttimer);
      if (
        res.onebuyinfo &&
        res.onebuyinfo.remaintime &&
        res.onebuyinfo.remaintime > 0 &&
        res.producttype == 4
      ) {
        // 开始倒计时
        this.cutdownclock();
      } else {
        this.cutdowntime = "00:00";
      }
      clearTimeout(this.timer);
      // 公告
      if (this.info.scroll && this.info.scroll.length && res.producttype != 4) {
        this.startMove();
      }
      // if (_.info.detaillist.length > 5) {
      // _.info.detaillist.splice(5, 0, {})
      if (this.rangeValue > 0 && this.rangeValue < 100 ) {
        this.$nextTick(() => {
          // 水波纹
          this.isDrawContainer = false;
          this.initcanvas();
        });
      }
      // } else {
      //   cancelAnimationFrame(this.drawWave)
      // }
    },
    // 倒计时
    cutdownclock() {
      const _ = this;
      this.cuttimer = setInterval(function () {
        var ts = _.onebuyinfo.remaintime; // 计算剩余的毫秒数
        // console.log(ts)
        // var dd = parseInt(ts / 60 / 60 / 24, 10) // 计算剩余的天数
        // var hh = parseInt((ts / 60 / 60) % 24, 10) // 计算剩余的小时数
        var mm = parseInt((ts / 60) % 60, 10); // 计算剩余的分钟数
        var ss = parseInt(ts % 60, 10); // 计算剩余的秒数
        // dd = checkTime(dd)
        // hh = checkTime(hh)
        mm = checkTime(mm);
        ss = checkTime(ss);
        if (mm == "00" && ss == "00") {
          clearInterval(_.cuttimer);
          _.activeDetail();
        }
        _.onebuyinfo.remaintime = _.onebuyinfo.remaintime - 1;
        _.cutdowntime = mm + ":" + ss;
      }, 1000);
    },
    getOpenDetail() {
      const _ = this;
      return new Promise((reslove) => {
        LuckDrawOpen({ tabid: _.actTabid })
          .then((res) => {
            console.log("首页接口结果 ===> ", res);
            _.userShowAdv = !!res.showad;
            if (res && Object.keys(res).length) {
              _.dealData(res);
            }
            reslove(res);
          })
          .catch((err) => {
            console.error("首页接口报错 ===> ", err);
          });
      });
    },
    getDetail() {
      const _ = this;
      LuckDrawHome({ tabid: _.actTabid })
        .then((res) => {
          console.log("未登录首页接口结果 ===> ", res);
          if (res && Object.keys(res).length) {
            _.dealData(res);
          }
        })
        .catch((err) => {
          console.error("未登录首页接口报错 ===> ", err);
        });
    },
    toRoute(path) {
      if (!this.userInfo.token) {
        if (this.$root.ISAPP) {
          // app登录
          this.GoAppLogin();
          return;
        } else {
          this.$router.push("/login");
          return;
        }
      }

      if (path.includes("purchaseTimes")) {
        path = path + "&tabid=" + this.actTabid;
        if (!ISDEV) {
          // 腾讯埋点-下单
          window.gdt("track", "COMPLETE_ORDER", { click: "payment" });
          // 头条埋点-下单
          window.meteor.track("shopping", { convert_id: "1679400539140103" });
        }
        if (this.info.producttype == 4) {
          // 一番赏
          if (!this.onebuyinfo.isinqueue) {
            // 加入队列
            this.joinline();
          }

          // 商品是否已经抽完
          const arr = this.onebuyinfo.process.split("/");
          if (this.onebuyinfo.process) {
            if (arr[0] == 0) {
              this.toast("活动已经结束");
              return;
            }
          }
        }
      }
      this.$router.push(path);
    },
    changeShowType(value) {
      if (this.showtype === value) {
        this.showtype = "";
      } else {
        this.showtype = value;
      }
    },
    reward() {
      const _ = this;
      const { type } = _;
      if (type === 1) {
        DrawOne({ tabid: _.actTabid })
          .then((res) => {
            console.log("抽一次结果结果 ===> ", res);
            if (res) {
              _.rewardInfo = [res];
              this.run(
                _.rewardInfo[0].id,
                (params) => {
                  // 停留在当前格子的回调函数
                  // 拿到当前 active 状态的 id
                  this.rewardId = params.id;
                },
                (params) => {
                  // 最终停止的回调函数
                  // 最后转盘停止的地方，可以弹出奖励弹框或其他操作
                  this.rewardId = params.id;
                  _.timerModal = setTimeout(() => {
                    body.classList.add("body-fixed");
                    _.visible = !_.visible;
                    clearTimeout(_.timerModal);
                  }, 500);
                  this.getOpenDetail();
                }
              );
            }
          })
          .catch((err) => {
            _.clickFlag = true;
            console.error("抽一次结果报错 ===> ", err);
            // 1511450:次数不足  1511901:库存不足
            if (err.code == "1511450") {
              _.$router.push(
                "/activity/purchaseTimes?type=" +
                  this.info.producttype +
                  "&tabid=" +
                  this.actTabid
              );
            }
            // _.toast(err.msg)
            this.getOpenDetail();
          });
      } else {
        DrawFive({ tabid: _.actTabid })
          .then((res) => {
            console.log("抽五次结果结果 ===> ", res);
            if (res && res.length) {
              _.rewardInfo = res;
              this.run(
                _.rewardInfo[0].id,
                (params) => {
                  // 停留在当前格子的回调函数
                  // 拿到当前 active 状态的 id
                  this.rewardId = params.id;
                },
                (params) => {
                  // 最终停止的回调函数
                  // 最后转盘停止的地方，可以弹出奖励弹框或其他操作
                  this.rewardId = params.id;
                  _.timerModal = setTimeout(() => {
                    body.classList.add("body-fixed");
                    _.visible = !_.visible;
                    clearTimeout(_.timerModal);
                  }, 500);
                  this.getOpenDetail();
                }
              );
            }
          })
          .catch((err) => {
            _.clickFlag = true;
            if (err.code == "1511450") {
              _.$router.push(
                "/activity/purchaseTimes?type=" +
                  this.info.producttype +
                  "&tabid=" +
                  this.actTabid
              );
            }
            // _.toast(err.msg)
            this.getOpenDetail();
            console.error("抽五次报错 ===> ", err);
          });
      }
    },
    /**
     * 开始抽奖
     * type: 1:抽一次 5:抽五次
     */
    startDraw(type, needRemand = true) {
      this.type = type;
      if (!this.userInfo.token) {
        if (this.$root.ISAPP) {
          // app登录
          this.GoAppLogin();
          return;
        } else {
          this.$router.push("/login");
          return;
        }
      }
      if (this.info.producttype == 4) {
        // 一番赏
        if (!this.onebuyinfo.isinqueue) {
          // 是否已经加入队列
          this.joinline(true);
          return;
        }
        if (this.onebuyinfo.count == 0) {
          // 是否需要每次提醒弹窗确认
          if (this.isRemand == 1 && needRemand) {
            this.toggleShow("showSeriesConfirm");
            return;
          }

          // 判断商品是否已经抽完
          const arr = this.onebuyinfo.process.split("/");
          if (this.onebuyinfo.process) {
            if (arr[0] == 0) {
              this.toast("活动已经结束");
              return;
            }
          }
        } else if (this.onebuyinfo.count > 0) {
          // 判断是否在排队中
          this.toast("正在排队中...");
          return;
        }
      }

      if (!this.clickFlag) return;
      this.clickFlag = false;
      console.log("开始抽奖----");

      this.LuckDraw(this.info.detaillist, this.rotateDir, 5, 8);
      this.reward();
    },
    // 抽奖
    LuckDraw(DataArr, RotateDir, cycleNumber, minSpeed) {
      this.DataArr = JSON.parse(JSON.stringify(DataArr));
      // 最大速度
      this.maxSpeed = 4;
      // 全速
      this.cycleNumber = cycleNumber || 2;
      this.myReq;
      // 最小速度
      this.defaultSpeed = minSpeed || 15;
      for (var i = 0; i < RotateDir.length; i++) {
        let { index, next } = RotateDir[i];
        if (typeof this.DataArr[index].next !== "undefined") {
          console.error(`RotateDir is error`);
          return;
        }
        this.DataArr[index].next = this.DataArr[next];
      }
    },
    // 开始轮询
    run(id, running, runend) {
      var counter = 0; // 计数器
      var current = 0; // 当前数字值
      var n = 0;
      let item = null;
      if (this.rewardId) {
        const index = this.DataArr.findIndex((ele) => ele.id === this.rewardId);
        if (index > -1) {
          item = this.DataArr[index];
        } else {
          item = this.DataArr[0];
        }
      } else {
        item = this.DataArr[0];
      }
      var currentObj = item;
      var tem = item;
      while (true) {
        if (n > this.DataArr.length) {
          console.error(`${id}不存在`);
          return;
        }
        if (tem.id == id) {
          break;
        }
        tem = tem.next;
        n++;
      }
      var allCount = this.cycleNumber * this.DataArr.length + n;
      // 加速区间
      var addSpeed = this.defaultSpeed - this.maxSpeed;
      // 减速区间
      var reduceSpeed = allCount - (this.defaultSpeed - this.maxSpeed);
      this.running = running;
      this.runend = runend;
      var _this = this;
      this.running(currentObj);
      this.myReq = requestAnimationFrame(step);
      function step() {
        current++;
        // 加速环节
        if (counter < addSpeed) {
          if (current < Math.pow(_this.defaultSpeed - counter, 2)) {
            current = current + _this.defaultSpeed / 2;
          } else {
            current = 0;
            // 往前移动一个；
            counter++;
            currentObj = currentObj.next;
            _this.running(currentObj);
          }
        }
        // 匀速环节
        if (counter >= addSpeed && counter < reduceSpeed) {
          // if (counter < reduceSpeed) {
          if (current < _this.maxSpeed) {
            current++;
          } else {
            // 计数清零
            current = 0;
            // 往前移动一个；
            counter++;
            currentObj = currentObj.next;
            _this.running(currentObj);
          }
        }
        // 减速环节
        if (counter >= reduceSpeed && counter < allCount) {
          if (Math.sqrt(current) <= _this.defaultSpeed - (allCount - counter)) {
            current = current + 2;
          } else {
            // 计数清零
            current = 0;
            // 往前移动一个；
            counter++;
            currentObj = currentObj.next;
            _this.running(currentObj);
          }
        }
        // 停止
        if (counter >= allCount) {
          _this.runend(currentObj);
          cancelAnimationFrame(_this.myReq);
          return;
        }
        _this.myReq = requestAnimationFrame(step);
      }
    },
  },
};
</script>
<style scoped>
.swiper-wrapper {
  transition-timing-function: linear !important;
}
.body-fixed {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
.share-pic {
  position: fixed;
  top: -100%;
  width: 100vw;
  height: 100vw;
}

.qrImg-wrapper {
  background-color: #fff;
  position: absolute;
  bottom: 1.33vw;
  right: 2.67vw;
}

.qrImg {
  width: 18.67vw;
  height: 18.67vw;
}

.share-group-content {
  width: 100%;
}

.share-word {
  font-weight: 600;
  font-size: 3.73vw;
  color: #646464;
  margin-bottom: 1.33vw;
}

.share-group {
  width: 100%;
  height: 28vw;
  background: #f5f5f5;
  border-bottom-left-radius: 4.8vw;
  border-bottom-right-radius: 4.8vw;
  padding-top: 2.67vw;
}

.share-weixin {
  width: 13.33vw;
  height: 13.33vw;
  border-radius: 50%;
  margin-right: 10px;
  background-color: #0ab964;
}

.share-icon {
  width: 7.49vw;
  height: 7.49vw;
}

.share-pengyouquan {
  width: 13.33vw;
  height: 13.33vw;
  border-radius: 50%;
  background-color: #64b937;
}
.share-pengyouquan.group {
  background: #d2d2d2;
}
.ruleDesc {
  position: fixed;
  top: 13.33vw;
  right: 0;
  width: 17.07vw;
  height: 7.49vw;
  line-height: 7.49vw;
  text-align: center;
  font-weight: 500;
  font-size: 3.2vw;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4vw 0 0 4vw;
}

.ruleDesc.top1 {
  top: 1.6vw;
}

.txt-over-2 {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.empty {
  height: 40vw;
}
.lego,
.girl,
.other {
  background-color: #1e64cd;
}
.onebuy {
  background-color: #482b4e;
}
.teamPopup-wrapper {
  width: 76vw;
  height: 85.33vw;
  border-radius: 18px;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/team_bg.png")
    no-repeat;
  background-size: contain;
  padding: 6.67vw 5.33vw;
  justify-content: flex-end;
}
.teamPopup-dec {
  font-size: 4.27vw;
  color: #232323;
  margin-bottom: 5.33vw;
}
.blodFont {
  display: inline-block;
  margin: 0 1.33vw;
  font-family: OswaldBold;
  font-weight: 600;
  font-size: 8vw;
  color: #232323;
}
.teamPopup-btn {
  width: 100%;
  height: 11.73vw;
  line-height: 11.73vw;
  text-align: center;
  background: #fa2337;
  border-radius: 30px;
  color: #fff;
  font-size: 4.27vw;
}
.wrapper {
  overflow: hidden;
  min-height: 100vh;
  position: relative;
}

.wrapper-content {
  flex: 1;
}

.footer-warehouse-lego,
.footer-warehouse-girl,
.footer-warehouse-other {
  width: 19.73vw;
  height: 19.73vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/19-1.png")
    no-repeat;
  background-size: contain;
  position: relative;
}

.footer-warehouse-lego-act {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/19-2.png")
    no-repeat;
  background-size: contain;
}

.footer-warehouse-onebuy {
  width: 19.73vw;
  height: 19.73vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/9-1.png")
    no-repeat;
  background-size: contain;
  position: relative;
}

.footer-warehouse-onebuy-act {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/9-2.png")
    no-repeat;
  background-size: contain;
}

.footer-warehousecount {
  position: absolute;
  top: -4.8vw;
  right: -2.67vw;
  width: 9.6vw;
  height: 9.6vw;
  box-sizing: border-box;
  border-radius: 50%;
  background: #ff4646;
  border: 2px solid #000000;
  font-family: OswaldBold;
  font-size: 4.8vw;
  font-style: normal;
  font-weight: bold;
  color: #fff;
  text-shadow: 2px 0 0px #000, -2px 0 0px #000, 0 2px #000, 0 -2px #000,
    2px 2px #000, -2px -2px #000, 2px -2px #000, -2px 2px #000;
}
.adv {
  position: relative;
}
.footer-drawone-lego,
.footer-drawone-other,
.footer-drawone-girl {
  width: 25.6vw;
  height: 19.73vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/20-1.png")
    no-repeat;
  background-size: contain;
  position: relative;
}
.adv span {
  position: absolute;
  left: 50%;
  top: -4.26vw;
  transform: translateX(-50%);
  width: 19.466vw;
  height: 8.533vw;
  background: url("../../../assets/img/adv_btn.png") 0 0 no-repeat;
  background-size: 100% 100%;
  border-radius: 10px;
}

.footer-drawone-lego-act,
.footer-drawone-girl-act,
.footer-drawone-other-act {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/20-2.png")
    no-repeat;
  background-size: cover;
}

.footer-drawone-onebuy {
  width: 25.6vw;
  height: 19.73vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/10-1.png")
    no-repeat;
  background-size: contain;
}

.footer-drawone-onebuy-act {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/10-2.png")
    no-repeat;
  background-size: contain;
}

.footer-drawfive-lego,
.footer-drawfive-girl,
.footer-drawfive-other {
  width: 47.2vw;
  height: 19.73vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/21-1.png")
    no-repeat;
  background-size: contain;
}

.footer-drawfive-lego-act,
.footer-drawfive-girl-act,
.footer-drawfive-other-act {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/21-2.png")
    no-repeat;
  background-size: cover;
}

.footer-drawfive-onebuy {
  width: 47.2vw;
  height: 19.73vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/11-1.png")
    no-repeat;
  background-size: contain;
}

.footer-drawfive-onebuy-act {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/11-2.png")
    no-repeat;
  background-size: contain;
}

.footer-wrapper {
  height: 30.13vw;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.footer-stage-btn {
  width: 100%;
  justify-content: space-around;
  position: absolute;
  top: 0;
  left: 0;
}

.footer-stage {
  width: 100%;
  height: 19.73vw;
}

.footer-stage-lego,
.footer-stage-girl,
.footer-stage-other {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/22.png") no-repeat;
  background-size: contain;
}

.footer-stage-onebuy {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/12.png")
    no-repeat;
  background-size: contain;
}

.fade-enter {
  opacity: 0;
}

.fade-leave {
  opacity: 1;
}
.fade-enter-active {
  transition: opacity 0.2s;
}
.fade-leave-active {
  opacity: 0;
  transition: opacity 0.2s;
}

.tabs-wrapper-lego,
.tabs-wrapper-other,
.tabs-wrapper-girl {
  width: 100%;
  padding: 0 2.67vw;
  background: url("//files.eyee.com/eyeeh5/img/lottery/pic_cloud_up.png")
    no-repeat;
  background-size: contain;
}

.tabs-wrapper-onebuy {
  width: 100%;
  padding: 0 2.67vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/bg-1.png")
    no-repeat;
  background-size: contain;
}

.tab-item {
  width: 19.73vw;
  height: 37.87vw;
}

.tab-item-content {
  width: 100%;
  height: 100%;
  padding: 3.73vw 0 5.33vw 0;
}

.tab-item-content-lego,
.tab-item-content-other,
.tab-item-content-girl {
  width: 100%;
  height: 100%;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/6.png") no-repeat;
  background-size: contain;
}

.tab-item-content-onebuy {
  width: 100%;
  height: 100%;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/2.png")
    no-repeat;
  background-size: contain;
}

.tab-item-imgwrapper {
  width: 100%;
  min-height: 18.67vw;
}

.tab-item-imgwrapperonebuy {
  width: 21.6vw;
  position: relative;
}

.tab-item-img {
  width: 18.67vw;
  height: 18.67vw;
  vertical-align: middle;
}

.tab-item-imgonebuy {
  width: 25.6vw;
  height: auto;
  position: absolute;
  top: -2px;
  left: -2px;
}

.tab-item-titleWrapper {
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 2px;
}

.tab-item-title {
  color: #fff;
  font-size: 3.2vw;
  font-weight: bold;
  margin-top: 1.07vw;
  height: 9.06vw;
}
.swiper-wrapper {
  height: 100%;
  overflow-x: auto;
}

.notice-wrapper {
  padding: 0 3.2vw;
}

.notice-bg {
  height: 13.87vw;
  width: 70.93vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/7.png") no-repeat;
  background-size: contain;
}
.new {
  width: 9.6vw;
  height: 9.6vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/8-1.png") no-repeat;
  background-size: contain;
  position: relative;
  margin-left: 1.07vw;
}
.newAct {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/8-2.png") no-repeat;
  background-size: contain;
}
.newtip {
  display: inline-block;
  width: 59.67vw;
  height: 12.53vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/24.png") no-repeat;
  background-size: contain;
  position: absolute;
  top: -13vw;
  right: 0;
}
.unpack {
  width: 9.6vw;
  height: 9.6vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/9-1.png") no-repeat;
  background-size: contain;
  position: relative;
  margin-left: 1.07vw;
}

.unpackAct {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/9-2.png") no-repeat;
  background-size: contain;
}

.unpacktip {
  display: inline-block;
  width: 51.7vw;
  height: 12.53vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/23.png") no-repeat;
  background-size: contain;
  position: absolute;
  top: -13vw;
  right: 0;
}

.notice-bg {
  position: relative;
  padding-right: 3.2vw;
}
.textBoxWrapper {
  position: absolute;
  top: 3.5vw;
  width: 50.67vw;
  height: 4.8vw;
  overflow: hidden;
}
.text {
  width: 100%;
  height: 100%;
  font-size: 3.47vw;
  position: absolute;
  right: 0;
  bottom: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 600;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s linear;
}
.slide-enter {
  transform: translateY(20px);
  opacity: 1;
}
.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
.turntable-wrapper {
  padding: 0.8vw 2.13vw 2.13vw 2.13vw;
}
.nobottom {
  padding: 0.8vw 2.13vw 0 2.13vw;
}
.turntable-item-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 1.2vw;
}

.turntable-item-wrappercontent {
  width: 100%;
  height: 100%;
  position: relative;
}

.turntable-content {
  width: 100%;
  height: 109.07vw;
  border: 2px solid #000000;
  border-radius: 20px;
}
.turntable-content-lego,
.turntable-content-girl,
.turntable-content-other {
  background: #1e64cd;
}
.turntable-content-onebuy {
  background: #815c6b;
}
.turntable-content-bg {
  width: 100%;
  height: 105.33vw;
  border-radius: 20px;
  padding: 1.2vw;
  justify-content: space-between;
  position: relative;
}

.turntable-color-lego,
.turntable-color-girl,
.turntable-color-other {
  background: #8cbeff;
}

.turntable-color-onebuy {
  background: #e6b7a9;
  position: relative;
}

.turntable-color-onebuy::after {
  content: "";
  display: inline-block;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/bg-3.png")
    no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.detaillist-item {
  position: absolute;
}

.turntable-item {
  width: 22.4vw;
  height: 33.6vw;
  border: 2px solid #000000;
  box-sizing: border-box;
  border-radius: 16px;
}

.turntable-item-lego,
.turntable-item-girl,
.turntable-item-other {
  background: #2167cf;
}

.turntable-item-onebuy {
  background: #815c6b;
}

.turntable-item-content {
  width: 100%;
  height: 30.93vw;
  background: #ffffff;
  border-radius: 14px;
  padding: 1.33vw;
}
.img-content {
  width: 28.27vw;
  height: 28.27vw;
  position: absolute;
  top: 0;
  left: -25%;
}
.bigward {
  background-color: #ffeb32;
}

.normal {
  background-color: #7de6f5;
}

.normal-onebuy {
  background-color: #f6ddd2;
}
.content-bg {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.content-bg-saleout {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  border-radius: 12px;
  top: 0;
  left: 0;
  z-index: 2;
}

.saleout-bg {
  width: 13.33vw;
  height: 13.33vw;
  line-height: 13.33vw;
  text-align: center;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/13.png")
    no-repeat;
  background-size: contain;
  font-weight: bold;
  font-size: 3.73vw;
  color: #ffffff;
}

.content-bg-act:after {
  content: "";
  display: inline-block;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgba(255, 70, 70, 0) 0%,
    rgba(255, 70, 70, 0.7) 100%
  );
  border-radius: 12px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
}
.content-img {
  width: 28.27vw;
  height: 28.27vw;
  background-repeat: no-repeat;
  background-size: 28.27vw 28.27vw;
  display: inline-block;
}
.content-level {
  width: 100%;
  height: 5.33vw;
  background-color: #000000;
  border-radius: 0 0 12px 12px;
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: center;
  font-size: 3.73vw;
  font-weight: 600;
  color: #ffffff;
  z-index: 3;
}
.center-wrapper {
  width: 43.47vw;
  height: 33.6vw;
  padding: 1.33vw 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.center-wrapper-desc {
  width: 30.4vw;
  font-size: 3.2vw;
  font-weight: bold;
  color: #000000;
}
.center-left-txt {
  align-items: center;
}
.center-left-luckValue {
  font-family: OswaldBold;
  font-weight: bold;
  font-size: 5.33vw;
  margin-left: 1.33vw;
  color: #fff;
  text-shadow: 2px 0 0px #000, -2px 0 0px #000, 0 2px #000, 0 -2px #000,
    2px 2px #000, -2px -2px #000, 2px -2px #000, -2px 2px #000;
}
.center-wrapper-luckdesc {
  display: inline-block;
  width: 21.07vw;
  vertical-align: middle;
}
.buy-count-wrapper {
  width: 100%;
  font-family: OswaldBold;
  font-style: normal;
  font-size: 21px;
}
.buy-count {
  width: 11.73vw;
  height: 11.73vw;
  line-height: 11.73vw;
  text-align: center;
  background: #ff4646;
  border: 2px solid #000000;
  border-radius: 50%;
  box-sizing: border-box;
  color: #fff;
  text-shadow: 2px 0 0px #000, -2px 0 0px #000, 0 2px #000, 0 -2px #000,
    2px 2px #000, -2px -2px #000, 2px -2px #000, -2px 2px #000;
}

.buy-count-onebuy {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/7.png")
    no-repeat;
  background-size: contain;
  border: none;
}

.buy-btn {
  width: 30.4vw;
  height: 11.73vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/26-1.png")
    no-repeat;
  background-size: contain;
}

.buy-btn-act {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/26-2.png")
    no-repeat;
  background-size: contain;
}

.onebuy-buy-btn {
  width: 30.4vw;
  height: 11.73vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/8-1.png")
    no-repeat;
  background-size: contain;
}

.onebuy-buy-btnAct {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/8-2.png")
    no-repeat;
  background-size: contain;
}

.center-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.diamondsWrapper {
  width: 40px;
  height: 40px;
  position: relative;
}
.diamonds-bg {
  width: 100%;
  height: 100%;
}

.base-img {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}

.diamonds {
  display: inline-block;
  width: 100%;
  height: 100%;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/12-1.png")
    no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  left: 0;
}

.fulldiamonds {
  width: 100%;
  height: 100%;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/12-2.png")
    no-repeat;
  background-size: contain;
}
.star {
  display: inline-block;
  width: 12.27vw;
  height: 3.73vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/11.png") no-repeat;
  background-size: contain;
  position: relative;
  top: 1.33vw;
}
.otherActivity {
  width: 100%;
  // height: 69.33vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/15.png") no-repeat;
  background-size: 100%;
  padding-bottom: 31vw;
}

.otherActivity-lego,
.otherActivity-girl,
.otherActivity-other {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/15.png") no-repeat;
  background-size: 100%;
}

.otherActivity-onebuy {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/bg-2.png")
    no-repeat;
  background-size: contain;
}

.organizeTeam {
  width: 100%;
  // height: 40vw;
  padding-top: 5.33vw;
  // background: url('https://files.eyee.com/eyeeh5/img/lottery/14.png') no-repeat;
  // background-size: contain;
}
.finger {
  width: 100%;
  height: auto;
  position: absolute;
  top: -5.33vw;
  // animation: beat 1s infinite;
  transform-origin: right bottom;
  animation-name: beat;
  // /*动画名称*/
  animation-duration: 1s;
  // /*设置秒数*/
  animation-timing-function: linear;
  transform: rotate(-45deg);
  // /*速度曲线*/
  animation-iteration-count: infinite;
  // /*播放次数*/
  animation-direction: alternate;
  // /*逆向播放*/
  animation-play-state: running;
}

@keyframes beat {
  0% {
    transform: rotate(-45deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

.loadmore-word {
  width: 15.2vw;
  height: 10.13vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/31.png") no-repeat;
  background-size: contain;
}

.loadmore {
  width: 16vw;
  height: 26.67vw;
  position: fixed;
  right: 6.67vw;
  bottom: 65.33vw;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}

.playerGroup {
  width: 16vw;
  height: 28.8vw;
  position: fixed;
  bottom: 32vw;
  right: 6.67vw;
  .kefu {
    width: 100%;
    height: auto;
  }
  .joinTeam {
    width: 100%;
    height: auto;
  }
}

.kefupopup {
  width: 76vw;
  min-height: 83.73vw;
  border-radius: 4.8vw;
  background: #fff;
  position: relative;
  padding-top: 4.27vw;
  &-caption {
    color: #000000;
    font-style: normal;
    font-weight: 600;
    font-size: 4.27vw;
  }
  &-img {
    display: block;
    width: 37.33vw;
    height: 37.33vw;
    margin: 2.66vw 0;
    border: 2px solid #cdcdcd;
    border-radius: 2.13vw;
  }
  &-close {
    width: 8.53vw;
    height: auto;
    margin-top: 5.33vw;
    position: absolute;
    bottom: -13.87vw;
    left: 50%;
    transform: translate(-50%, 0);
  }
  &-header {
    width: 9.07vw;
    height: 9.07vw;
    border-radius: 50%;
    margin-right: 1.6vw;
    vertical-align: middle;
  }
  &-kefuinfo {
    width: 43.73vw;
    height: 11.73vw;
    background: #f0f0f0;
    border-radius: 5.87vw;
    padding: 0 1.33vw;
    margin-bottom: 2.67vw;
    .kefuinfo {
      &-number {
        font-weight: 500;
        font-size: 3.2vw;
        color: #000000;
      }
      &-copyBtn {
        width: 11.2vw;
        height: 8vw;
        line-height: 8vw;
        background-color: #cdcdcd;
        box-sizing: border-box;
        border-radius: 5.87vw;
        font-size: 2.13vw;
        color: #000000;
        font-weight: bold;
        .small {
          display: inline-block;
          font-weight: bold;
          font-size: 3.2vw;
        }
      }
    }
  }
}

.imgwrapper {
  position: relative;
}

.copy {
  width: 54.4vw;
  height: 18.4vw;
  position: absolute;
  bottom: 7.67vw;
  left: 10.67vw;
  padding: 2.67vw;
}

.copyItem {
  width: 100%;
  height: 5.87vw;
}

.hide {
  position: absolute;
  bottom: 0;
  z-index: -10;
  opacity: 0;
}

.reward-left {
  width: 70.93vw;
  height: 13.87vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/3.png")
    no-repeat;
  background-size: contain;
  &-btn {
    width: 14.67vw;
    height: 5.87vw;
    line-height: 5.87vw;
    text-align: center;
    border-radius: 3.73vw;
    background: #000000;
    color: #fff;
    font-weight: bold;
    font-size: 3.2vw;
    font-family: OswaldBold;
  }
  &-content {
    width: 100%;
    padding: 0 2.67vw 0 16.53vw;
    font-weight: 600;
    font-size: 3.47vw;
    color: #000000;
  }
  p {
    white-space: nowrap;
  }
}

.reward-notice {
  width: 100%;
}

.reward-right {
  margin-left: 2.67vw;
}

.reward-joinline {
  width: 21.07vw;
  height: 9.6vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/4-1.png")
    no-repeat;
  background-size: contain;
}

.reward-joinline-act {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/4-2.png")
    no-repeat;
  background-size: contain;
}

.reward-outline {
  width: 21.07vw;
  height: 9.6vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/5-1.png")
    no-repeat;
  background-size: contain;
}

.reward-outline-act {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/5-2.png")
    no-repeat;
  background-size: contain;
}

.onebuy-progress {
  background: rgba(0, 0, 0, 0.5);
  min-width: 7.73vw;
  height: 4.27vw;
  border-radius: 9px;
  color: #fff;
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
  padding: 0 1.6vw;
  &-number {
    display: inline-block;
    font-weight: 600;
    font-size: 10px;
  }
}

.nowprogress {
  justify-content: flex-start;
  &-img {
    width: 17.6vw;
    height: auto;
    margin-top: 5px;
  }
  &-number {
    color: #fff;
    text-shadow: 2px 0 0px #000, -2px 0 0px #000, 0 2px #000, 0 -2px #000,
      2px 2px #000, -2px -2px #000, 2px -2px #000, -2px 2px #000;
    font-family: OswaldBold;
    font-weight: bold;
    font-size: 5.33vw;
    margin-left: 3px;
  }
}

.picWrapper {
  width: 100%;
  height: 100%;
  background-color: #000;
  // padding-top: 2.67vw;
  position: relative;
  &-number {
    width: 100%;
    text-align: center;
    color: #fff;
    font-weight: 600;
    font-size: 4.53vw;
    position: fixed;
    top: 2.67vw;
    left: 0;
    z-index: 1;
  }
}

.item-img {
  width: 100%;
  height: auto;
}

.pic-swiper {
  width: 100%;
  &-item {
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    &-wrapper {
      min-height: 100vh;
    }
  }
}

.seriesConfirm {
  width: 76vw;
  height: 94.13vw;
  background: #fff;
  border-radius: 4.8vw;
  position: relative;
}

.seriesConfirm-bg {
  width: 100%;
  height: auto;
  position: absolute;
  top: 0;
  left: 0;
}

.seriesConfirm-content {
  width: 100%;
  height: 100%;
  padding: 5.33vw 0 6.67vw 0;
  position: absolute;
  top: 0;
  left: 0;
}

.seriesConfirm-tip {
  font-weight: 800;
  font-size: 5.87vw;
  color: #fff;
}

.seriesConfirm-imgWrapper {
  width: 43.73vw;
  height: 43.73vw;
  background: #fff;
  border-radius: 3.73vw;
  padding: 1.6vw;
  margin-top: 3.2vw;
}

.seriesConfirm-imgbg {
  background: #abf5ff;
  border-radius: 3.73vw;
  width: 100%;
  height: 100%;
  position: relative;
}

.seriesConfirm-imgbg:after {
  content: "";
  display: inline-block;
  width: 100%;
  height: 100%;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/26.png") no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  left: 0;
}

.seriesConfirm-img {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.seriesConfirm-tipword {
  font-weight: normal;
  font-size: 4.27vw;
  color: #232323;
  align-items: center;
  margin-top: 4vw;
}

.seriesConfirm-circle {
  display: inline-block;
  width: 4.27vw;
  height: 4.27vw;
  border-radius: 50%;
  border: 2px solid #b4b4b4;
  margin-right: 5px;
}

.seriesConfirm-circle-act {
  border: none;
  background: url(//files.eyee.com/eyeeh5/img/draw/draw07.png) no-repeat;
  background-size: contain;
}
.confirm-btn {
  width: 65.33vw;
  height: 11.73vw;
  line-height: 11.73vw;
  text-align: center;
  background: #fa2337;
  border-radius: 8vw;
  color: #fff;
  font-weight: 600;
  font-size: 4.27vw;
  margin-top: 4vw;
}
.reload-btn {
  width: 11.73vw;
  height: 11.73vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/update_up.png")
    no-repeat;
  background-size: contain;
  margin-top: 7px;
}

.reload-btn-act {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/update_down.png")
    no-repeat;
  background-size: contain;
}
</style>
