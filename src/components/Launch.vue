<template>
  <div class="launch" ref="launch" v-show="baseValue">
    <img class="l-logo" src="/static/loading.png" alt />
    <div class="l-ad" @click.stop="fcClick">
      <img :src="launchpath|https" alt />
    </div>
    <!-- <div class="l-ad">
      <img :src="baseLaunch|https" alt="">
    </div>
    <div class="l-logo flex-center">
      <img src="/static/loading.png" alt="">
    </div>-->
    <!-- <div class="l-close" @click.stop.prevent="close">
      <span>{{txt}}</span>
    </div>-->
  </div>
</template>
<script>
// import { BaseValue } from '../common/api/base'
const proportion = document.body.clientWidth / document.body.clientHeight;
import { GridLinkType } from "@/utils/enum";
import { FlashFrequency } from "../common/api/base";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // logo: '//files.eyee.com/mcdn/static/img/launch_logo.png', // require('../assets/img/launch_logo.png')
      txt: "跳过",
      timer: {},
      flashFrequencyList: [],
      launchpath: ""
    };
  },
  computed: {
    ...mapGetters({ baseValue: "baseValue" }),
    baseLaunch() {
      let bv = this.baseValue;
      return (bv.configs && bv.configs.launchurl) || "";
    }
  },
  mounted() {
    // this.initShare()
    // if (!this.baseValue.configs) this.$store.dispatch('setBaseValue')
    // if (!(this.baseValue && this.baseValue.launchurl)) {
    //   this.BaseValue()
    // }
    // 启动页预加载首页数据
    // this.$store.dispatch("setHomeGather");
    // this.timer = setTimeout(() => { this.countDown() }, 1000)
    this.flashScreen();
  },
  methods: {
    close() {
      clearTimeout(this.timer);
      this.$router.replace("/");
    },
    countDown(i = 2) {
      i--;
      this.txt = i + " 秒";
      if (i === 0) {
        this.close();
        return false;
      }
      this.timer = setTimeout(() => {
        this.countDown(i);
      }, 1200);
    },
    flashScreen() {
      // 闪屏数据处理
      let _ = this;
      FlashFrequency()
        .then(res => {
          if (res && res.flashfrequencymap) {
            console.log(res);
            // 当前日期大于开始时间 小于 结束时间  闪屏 才会显示
            if (
              new Date().getTime() >= new Date().getTime(res.starttime) &&
              new Date().getTime() <= new Date().getTime(res.endtime)
            ) {
              _.flashFrequencyList = res.flashfrequencymap;
              let urllist = _.flashFrequencyList.urllist,
                os = "ios";
              //  "os": int# 1 ios  2 android
              if (ENV.ua.mobile) {
                if (ENV.ua.android) os = 2;
                else os = 1;
              } else os = 1;
              urllist = urllist.filter(i => i.os == os);
              _.launchpath = _.limit(urllist);
              _.timer = setTimeout(() => {
                _.countDown();
              }, 1000);
            }
          } else _.close();
        })
        .catch(err => {
          _.close();
          console.error("[*actions]闪屏--请求异常", err);
        });
    },
    limit(arr) {
      var newArr = [];
      arr.map(i => {
        let wh = i.width / i.height;
        newArr.push(Math.abs(wh - proportion));
      });
      // 求最小值的索引
      var index = newArr.indexOf(Math.min.apply(null, newArr));
      return arr[index].url;
    },
    fcClick() {
      //  console.log('path---------',item)
      /**
       * 首页宫格跳转类型
      //
      // "showtype":#"0:常规商品卡片,1助力砍价、2拼团、3新品预售、 4 B2C 品牌， 5 C2C品牌、6 店铺、7 平台大促、8 自定义专题、9 天天抽奖、10 限量发售、
      // 11 球鞋入口、12 分类、 13系列、
      // 14在线鉴定，15拉新抢购，16  supreme类目，17 supreme，18 B2C产品详情 ,19 C2C 产品详情，20 鬼市，21 球鞋榜，22 球鞋搜索，23 领券中心 24c2c 服饰25.B2C搜索，26.全站搜索
       */
      // helpBargain: 1,
      // groupBuy: 2,
      // newSale: 3,
      // brandSearch: 4,
      // brandSearchC2c: 5,
      // shopDetail: 6,
      // platformActivity:7,
      // activity: 8,
      // sneakerLottery: 9,
      // limitSale: 10,
      // sneakerEnter:11,
      // classify:12,
      // seriesList:13,
      // onlineIdentification:14,
      // PullTheNew :15,
      // Supreme:16,
      // SupremeSearch:17,
      // DetailB2c:18,
      // DetailC2c:19,
      // SpecialSaleDetail:20,
      // SneakersHotSale:21,
      // sneakerSearch:22,
      // getCouponCenter:23
      // costume: 24,
      //   b2cSearch:25,
      // allSearch:26
      //  presellRush:30,
      // toeCap:32,
      // calendarDetail:33,
      // imgInvitationDetail:34,
      // flashInvitationDetail:35,
      // topicInvitationDetail:36,
      //  29 发售日历，30：预售抢购，31：寄存搜索,32邀请鞋头 33 日历详情页 34 图文帖子详情页 35 视频帖子详情 36 话题详情页",

      let _ = this,
        item = _.flashFrequencyList,
        path = "",
        link = item.link,
        contentname = item.contentname,
        loadapp = false;
      // 类型为4.品牌、5.店铺、6.平台大促 contentid不为null
      if (item.articletype == 3) path = "";
      else
        switch (item.type) {
          case GridLinkType.helpBargain:
            path = "/helpbargain";
            break;
          case GridLinkType.groupBuy:
            path = "/groupbuy/list";
            break;
          case GridLinkType.newSale:
            path = "/sneaker/presale";
            break;
          case GridLinkType.brandSearch:
            path = "/results/" + encodeURIComponent(contentname);
            break;
          case GridLinkType.brandSearchC2c:
            path = "/results/" + encodeURIComponent(contentname) + "?isc2c =1";
            break;
          case GridLinkType.shopDetail:
            path = "/shop/shopdetail/" + link;
            break;
          case GridLinkType.platformActivity:
            path = "/platformActivity/" + link;
            break;
          case GridLinkType.activity:
            if (/.*?m.eyee\.com\/active\//i.test(link))
              path = "/active/" + link.split("/active/")[1];
            else if (/.*?eyee\.com\//i.test(link))
              path = link.replace(/.*?eyee\.com/i, "");
            break;
          case GridLinkType.sneakerLottery:
            path = "/drawLottery/lottery";
            break;
          case GridLinkType.limitSale:
            path = "/limit";
            break;
          case GridLinkType.sneakerEnter:
            path = "/sneaker/mall";
            break;
          case GridLinkType.classify:
            path =
              "/results/" +
              encodeURIComponent(contentname) +
              "?categoryid=" +
              link;
            break;
          case GridLinkType.seriesList:
            path =
              "/results/" +
              encodeURIComponent(contentname) +
              "?seriesid=" +
              link;
            break;
          // case GridLinkType.onlineIdentification:
          //   loadapp = true;
          //   break;
          // case GridLinkType.PullTheNew:
          //   loadapp = true;
          //   break;
          case GridLinkType.Supreme:
            path = `/salesList/${encodeURIComponent(contentname)}/${link}`;
            break;
          case GridLinkType.SupremeSearch:
            path = "/sales/category/" + (link || "");
            break;
          case GridLinkType.DetailB2c:
            path = `/productDetail/${link}`;
            break;
          case GridLinkType.DetailC2c:
            path = `/sneaker/detail/${link}`;
            break;
          case GridLinkType.SpecialSaleDetail:
            path = `/GhostProList?id=${link}`;
            break;
          case GridLinkType.SneakersHotSale:
            path = `/sneakerHotSale/${link}`;
            break;
          case GridLinkType.sneakerSearch:
            path =
              "/results/" +
              encodeURIComponent(contentname || link) +
              "?isc2c =1";
            break;
          case GridLinkType.getCouponCenter:
            path = `/coupon`;
            break;
          case GridLinkType.costume:
            path = `/c2c/CategoryMall`;
            break;
          case GridLinkType.b2cSearch:
            path = "/results/" + encodeURIComponent(contentname) + "?isc2c=0";
            break;
          case GridLinkType.allSearch:
            path = "/results/" + encodeURIComponent(contentname);
            break;
          case GridLinkType.presellRush: // 预售抢购
            path =
              "/sneakerticket/detail?activityid=" + encodeURIComponent(link);
            break;
          case GridLinkType.imgInvitationDetail: // 图文帖子详情
          case GridLinkType.flashInvitationDetail: // 视屏帖子详情
            path = "/community/posting/detail/" + encodeURIComponent(link);
            break;
        }
      if (path) _.$router.push(path);
      else window.location.href = link;
    }
    // ,
    // BaseValue() {
    //   BaseValue().then((res) => {
    //     if (res) { this.$store.dispatch('setBaseValue', res) }
    //   }).catch(e => { console.error('基础数据加载失败', e) })
    // }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  }
};
</script>
