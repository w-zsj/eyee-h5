<template>
  <div class="auction-mgr">
    <div class="flex-center acm-tabs" :class="{next:act.isOrders}">
      <router-link
        replace
        to="/auction/sales"
        tag="p"
        :class="{act:!act.isOrders}"
      >拍品管理 ({{tabs[0].count}})</router-link>
      <router-link
        replace
        to="/auction/orders"
        tag="p"
        :class="{act:act.isOrders}"
      >订单管理 ({{tabs[1].count}})</router-link>
    </div>
    <div class="acm-subtabs">
      <template v-for="(si, sIdx) in act.subs">
        <router-link
          :key="'subs'+sIdx"
          replace
          :to="{path:act.isOrders?'/auction/orders':'/auction/sales',query:{s:si.status}}"
          tag="div"
          :class="{act:act.status==si.status}"
        >{{si.txt}}</router-link>
      </template>
    </div>
    <router-view></router-view>
    <div class="drag" ref="drag" v-dragMove>
      <div
        class="post flex-center"
        @click="gotoAppProductPage"
        v-if="isshowsellbtn"
      >发布</div>
      <div class="post my-join flex-center flex-col" @click="myjoin">
        <span>我的</span>
        <span>参与</span>
      </div>
    </div>
    <!-- 底部tab -->
    <!-- <div class="footer-tab" :class="{'Inipx':getIsIphonex}">
      <AuctionFooter></AuctionFooter>
    </div>-->
  </div>
</template>
<script>
import {
  AuctionCount,
  GetIsauctions,
  Cooperativeseller
} from "@/utils/api/auction";
import { mapGetters } from "vuex";
import AuctionFooter from "./comps/AuctionFooter";
export default {
  name: "AuctionMgrLayout",
  data() {
    return {
      tabs: [
        {
          count: 0,
          items: [
            {
              status: 0,
              txt: "待审核"
            },
            {
              status: 1,
              txt: "待上架"
            },
            {
              status: 3,
              txt: "预展中"
            },
            {
              status: 4,
              txt: "竞拍中"
            },
            {
              status: 6,
              txt: "已流拍"
            },
            {
              status: 7,
              txt: "已关闭"
            }
          ]
        },
        {
          count: 0,
          items: [
            {
              status: 1,
              txt: "待付款"
            },
            {
              status: 2,
              txt: "待发货"
            },
            {
              status: 3,
              txt: "已发货"
            },
            {
              status: 11,
              txt: "已完成"
            },
            {
              status: 12,
              txt: "已关闭"
            }
          ]
        }
      ],
      counts: {},
      isshowsellbtn: false,
      iscooperativeseller: 0 // 是否合作卖家 0-否 1-是"
    };
  },
  components: { AuctionFooter },
  computed: {
    ...mapGetters({
      user: "userInfo"
    }),
    act() {
      let _ = this,
        { tabs, $route } = _,
        {
          name,
          query: { s }
        } = $route,
        isOrders = name == "AuctionOrders";
      return {
        isOrders,
        status: s || (isOrders ? 1 : 0),
        subs: tabs[isOrders ? 1 : 0].items
      };
    },
    // ISIOS 判断是否是iphonX手机
    getIsIphonex() {
      if (this.$root.ISIOS) {
        if (
          (screen.height == 812 && screen.width == 375) ||
          (screen.width === 414 && screen.height === 896)
        ) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  mounted() {
    let _ = this;
    // if (!_.$route.query.s) {
    // console.log("_.$route.query", _.$route.query);
    // 存在h5 内部返回的情况
    if (_.$root.loging) {
      _.$root.loging
        .then($ => {
          // 已登录
          _.auccount();
          // _.iscopsell();
        })
        .catch(e => {
          console.error("query prams auto login error:", e);
          _.auccount();
        });
    } else if (_.user && _.user.uid) {
      _.auccount();
      // _.iscopsell();
    }

    _.GetIsIcon();
  },
  methods: {
    getParams() {
      let _ = this;
      _.getQueryParamUser()
        .then(res => {
          _.auccount();
          // _.iscopsell();
        }) // 登录成功 处理事件s
        .catch(err => console.error("参数获取失败", err));
    },
    iscopsell() {
      let _ = this;
      Cooperativeseller()
        .then(res => {
          _.iscooperativeseller = res.iscooperativeseller || 0;
        })
        .catch(e => {
          console.error("判断是否是合作卖家 ERROR", e);
        });
    },
    GetIsIcon() {
      GetIsauctions()
        .then(res => {
          this.isshowsellbtn = res.isauction || 0;
          console.log("this.isshowsellbtn---", this.isshowsellbtn);
        })
        .catch(e => {
          console.error("IsSshowBtn Error", e);
          this.isshowsellbtn = false;
        });
    },
    auccount() {
      let _ = this;
      AuctionCount().then(res => {
        console.log("拍品数量----》》", res);
        if (res) {
          _.counts = res;
          _.tabs[0].count = _.counts.auctiongoodsnum || 0;
          _.tabs[1].count = _.counts.auctionordernum || 0;
          let s = 0;
          if (!_.act.isOrders && !_.act.status) {
            if (_.counts.bidingnum || _.counts.preshownum) {
              if (_.counts.bidingnum > 0) s = 4;
              else if (_.counts.preshownum > 0) s = 3;
              _.$router.replace({
                path: "/auction/sales",
                query: { s }
              });
            }
          }
        }
      });
    },
    myjoin() {
      this.$router.replace("/auction/joined");
    },
    gotoAppProductPage() {
      let _ = this;
      if (!_.isshowsellbtn) {
        _.toast("暂无拍卖活动");
        return;
      }
      if (_.isshowsellbtn && !_.iscooperativeseller) {
        if (ENV.ua.mini) {
          // $log({
          //   e: "click_ag_pub_btn"
          // });
          if (_.$route.query.param) {
            let pa = JSON.parse(decodeURIComponent(_.$route.query.param));
            if (pa.token)
              wx.miniProgram.navigateTo({
                url: "/pages/auction/publish/prodlist"
              });
            else
              wx.miniProgram.navigateTo({
                url: "/pages/home/bind"
              });
          } else {
            wx.miniProgram.navigateTo({
              url: "/pages/auction/publish/prodlist"
            });
          }
        } else {
          this.javascriptBridge({
            name: "gotoAppSearchAuctionProductPage",
            params: {}
          });
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.auction-mgr {
  $bg: #f5f5f5;
  $tabH: 11.733vw;
  min-height: 100vh;
  background: $bg;
  padding-bottom: 18.666vw;
  .acm-tabs {
    z-index: 3;
    position: sticky;
    top: 0;
    line-height: $tabH;
    background: #fff;
    p {
      width: 50%;
      text-align: center;
      color: #969696;
      font-size: 4vw;
      font-weight: 600;
    }

    .act {
      color: #232323;
      position: relative;
      &::after {
        content: "";
        display: block;
        position: absolute;
        bottom: 1.6vw;
        // left: 37.2%;
        left: 50%;
        transform: translateX(-50%);
        width: 6.9333vw;
        height: 0.8vw;
        background: #232323;
        // transition: left 0.2s cubic-bezier(1, 1, 0.4, 1.5);
      }
    }

    // &.next::after {
    //   left: 75%;
    // }
  }
  .acm-subtabs {
    z-index: 2;
    position: sticky;
    top: $tabH - 1;
    width: 100%;
    padding: 4vw;
    overflow-x: scroll;
    white-space: nowrap;
    background: $bg;
    > div {
      display: inline-block;
      margin-right: 2.667vw;
      padding: 0 3.466vw;
      line-height: 6.672vw;
      color: #232323;
      font-size: 3.466vw;
      font-weight: 600;
      border-radius: 3.336vw;
      background: #fff;
      border: 1px solid #fff;
      &:last-of-type {
        margin: 0;
      }
    }

    > .act {
      background: #e6e6e6;
      border: 1px solid #cdcdcd;
      color: #646464;
    }
  }
  .drag {
    position: fixed;
    bottom: 10vh;
    right: 4vw;
    width: 16vw;
    .post {
      // position: fixed;
      // bottom: 10vh;
      // right: 4vw;
      width: 11.733vw;
      height: 11.733vw;
      background: #232323;
      border-radius: 50%;
      box-shadow: 0 0 2.667vw 0 rgba(0, 0, 0, 0.1);
      font-size: 3.2vw;
      font-weight: 600;
      color: #fff;
      margin-bottom: 4vw;
      &.my-join {
        // bottom: 25vh;
        background: #fa2337;
      }
    }
  }
}
.footer-tab {
  padding: 0 4vw 1.33vw;
  background: #fff;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 2;
  box-shadow: 0 0rpx 8rpx rgba(238, 238, 238, 0.5);
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  &.Inipx {
    padding-bottom: 9.066vw;
  }
  ._tabs {
    div {
      flex: 1;
      height: 13.333vw;
      background: #333333;
      color: #fff;
      font-size: 4.266vw;
      font-weight: bold;
      border-radius: 2px;
      &.send {
        margin-right: 2.6666vw;
        background: #fb2e3d;
        &.gray {
          background: #cccccc;
        }
        .add_ {
          width: 4.266vw !important;
          height: 4.266vw;
          background: #fff;
          border-radius: 50%;
          position: relative;
          margin-right: 1.866vw;
          &:before,
          &:after {
            content: "";
            width: 2px;
            height: 2.5vw;
            background: #fa2337;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 1px;
          }
          &:after {
            height: 2px;
            width: 2.5vw;
          }
        }
      }
    }
  }
}
</style>