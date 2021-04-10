<template>
  <div class="myjoined">
    <div class="tabs">
      <span
        class="flex-center"
        v-for="(item,index) in tabs"
        :key="index"
        :class="{'cur':acttabs==index}"
        @click="toggle(item.type,index)"
      >
        <i
          :class="{'point':index==2&&item.count>0}"
        >{{item.txt}} {{'('+(item.count>999?'999+':item.count)+')'}}</i>
      </span>
    </div>
    <v-loadlist
      :load-handle="reload"
      :more-handle="loadmore"
      :more-handling="loading"
      :isend="isend"
      v-if="list.length>0"
    >
      <div class="acn-list">
        <template v-for="(item,idx) in list">
          <auction-cell
            :key="'sg'+idx"
            :info="item"
            dbline
            joined
            loged
            :type="type||1"
            :index="idx"
            style="width:47.2%;margin:0 1.4% 2.4vw;"
            @delclick="delclick"
            @recdsave="recdsave"
            @click="handleLog(item.auctiongoodid)"
          ></auction-cell>
        </template>
      </div>
    </v-loadlist>
    <div class="none-data" v-else></div>
    <div class="acm-post flex-col-ctr" @click="mysell" v-dragMove>
      <p>我发</p>
      <p>布的</p>
    </div>

    <div class="footer-tab" :class="{'Inipx':getIsIphonex}">
      <AuctionFooter :curselect="2"></AuctionFooter>
      <!-- <div class="flex flex-center _tabs">
        <div
          class="send flex flex-center"
          @click="gotoAppProductPage"
          :class="isshowsellbtn&&!iscooperativeseller?'':'gray'"
        >立即发布</div>
        <div class="myjoin flex flex-center" @click="mysell">我发布的</div>
      </div>-->
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import vLoadlist from "./comps/vLoadlist";
import AuctionCell from "./comps/AuctionCell";
import AuctionFooter from "./comps/AuctionFooter";
import {
  ParticipateList,
  GetIsauctions,
  Cooperativeseller,
  AuctionCount
} from "@/utils/api/auction";

let page = 1;
export default {
  name: "AuctionJoined",
  components: { AuctionCell, AuctionFooter, vLoadlist },
  data() {
    return {
      loading: true,
      isend: false,
      isshowsellbtn: false,
      list: [],
      iscooperativeseller: 0, // 是否合作卖家 0-否 1-是"
      tabs: [
        { txt: "参与的", type: 2, count: 0, typetxt: "myjoinednum" },
        { txt: "收藏", type: 1, count: 0, typetxt: "userwantnum" },
        { txt: "待支付", type: 3, count: 0, typetxt: "waitpaynum" }
      ],
      acttabs: 0,
      type: 2 //1-想要 2-参与的 3-待支付
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo"
    }),
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
    if (_.$root.loging) {
      _.$root.loging
        .then($ => {
          // 已登录
          console.log("自动登录返回信息", $);
          _.count()
            .then(type => _.reload())
            .catch(e => _.reload());
          // _.iscopsell();
        })
        .catch(e => {
          console.error("query prams auto login error:", e);
        });
    } else if (_.user && _.user.uid) {
      _.count()
        .then(type => _.reload())
        .catch(e => _.reload());
      // _.iscopsell();
    }
    // }
    // if (_.$root.ISMP) {
    //   wx.miniProgram.postMessage({ data: { title: "我参与的" } });
    // }

    // _.GetIsIcon();

    sessionStorage.setItem("test", "122333");
    if (ENV.ua.mini) {
    }
    _.setToolBar({ title: "斗牛拍卖", bgcolor: "#191919", textcolor: "#FFFFFF" });
  },
  methods: {
    getParams() {
      let _ = this;
      _.getQueryParamUser()
        .then(res => {
          _.reload();
          // _.iscopsell();
        }) // 登录成功 处理事件s
        .catch(err => console.error("参数获取失败", err));
    },
    // iscopsell() {
    //   let _ = this;
    //   Cooperativeseller()
    //     .then(res => {
    //       _.iscooperativeseller = res.iscooperativeseller || 0;
    //     })
    //     .catch(e => {
    //       console.error("判断是否是合作卖家 ERROR", e);
    //     });
    // },
    GetIsIcon() {
      GetIsauctions()
        .then(res => {
          this.isshowsellbtn = res.isauction || 0;
        })
        .catch(e => {
          console.error("IsSshowBtn Error", e);
          this.isshowsellbtn = 0;
        });
    },
    toggle(type, index) {
      let _ = this;
      if (_.acttabs === index) return;
      _.acttabs = index;
      _.type = type;
      _.reload();
      // _.count();
    },
    reload() {
      page = 1;
      // this.list = [];
      this.load();
    },
    loadmore() {
      let _ = this,
        { isend, load } = _;
      if (isend) return;
      page++;
      load();
    },
    load() {
      let _ = this,
        type = _.type || 1;
      // console.log("当前状态---->>>", type);
      _.loading = true;
      ParticipateList({ page, type })
        .then(res => {
          console.log("ParticipateList res: ", res);
          if (res.list && res.list.length > 0) {
            if (page === 1) _.list = res.list;
            else _.list = _.list.concat(res.list);

            _.isend = res.page * res.size >= res.total && _.list.length > 0;
          } else if (page === 1) _.list = [];

          _.loading = false;
        })
        .catch(e => {
          console.error("ParticipateList error: ", e);
          _.loading = false;
          _.toast("加载失败~");
        });
    },
    count() {
      let _ = this;
      return new Promise((resolve, reject) => {
        AuctionCount()
          .then(res => {
            console.log("订单管理数量", res);
            _.tabs = _.tabs.map((i, index) => {
              i.count = res[i.typetxt] || 0;
              return i;
            });
            // _.type = _.tabs[0].type;
            // if (res.tabtype) {
            // _.type = res.tabtype;
            // "tabtype":"int #我参与的tab配置 1-想要 2-参与的 3-待付款",
            // switch (res.tabtype) {
            //   case 1:
            //     _.acttabs = 1;
            //     break;
            //   case 2:
            //     _.acttabs = 0;
            //     break;
            //   case 3:
            //     _.acttabs = 2;
            //     break;
            // }
            // }
            // else {
            //   if (res.waitpaynum > 0) {
            //     _.acttabs = 2;
            //     _.type = 3;
            //   } else if (res.myjoinednum > 0) {
            //     _.acttabs = 0;
            //     _.type = 2;
            //   } else {
            //     _.acttabs = 1;
            //     _.type = 1;
            //   }
            // }

            resolve(_.type);
          })
          .catch(e => {
            console.error(e);
            reject(1);
          });
      });
    },
    delclick(auctiongoodid) {
      let _ = this,
        { list } = _;
      list.map((i, index) => {
        if (i.auctiongoodid == auctiongoodid) {
          list.splice(index, 1);
        }
        return i;
      });
      if (_.tabs[1].count > 0) _.tabs[1].count -= 1;
    },
    recdsave(obj) {
      let _ = this;
      if (obj.iswant) _.tabs[1].count += 1;
      else if (_.tabs[1].count > 0) _.tabs[1].count -= 1;
    },
    handleLog(agid) {
      // $log({
      //   e: "click_ag_list",
      //   p: {
      //     agid,
      //     type: 3 // 0 首页场次，1 首页推荐，2 详情推荐，3 参与列表
      //   }
      // });
    },
    // gotoAppProductPage() {
    //   if (!this.isshowsellbtn) {
    //     this.toast("暂无拍卖活动");
    //     return;
    //   }
    //   if (this.$root.ISMP) {
    //     wx.miniProgram.navigateTo({
    //       url: "/pages/auction/publish/prodlist"
    //     });
    //   } else {
    //     this.javascriptBridge({
    //       name: "gotoAppSearchAuctionProductPage",
    //       params: {}
    //     });
    //   }
    // },
    mysell() {
      this.$router.replace("/auction/sales");
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
<style lang="scss">
html,
body {
  background: #191919;
}
.myjoined {
  // min-height: 100vh;
  padding-bottom: 18.666vw;
}
.tabs {
  display: flex;
  padding: 0 4vw;
  position: sticky;
  top: 0;
  z-index: 12;
  background: #191919;
  color: #969696;
  font-size: 4.266vw;
  font-weight: 600;
  span {
    margin-right: 6.666vw;
    i {
      line-height: 11.734vw;
      position: relative;
      &.point::after {
        content: "";
        position: absolute;
        width: 2.666vw;
        height: 2.666vw;
        border-radius: 50%;
        background: #C8AF6E;
        top: 2vw;
        right: -1.666vw;
      }
    }
    &.cur {
      color: #fff;
      i {
        position: relative;
        &::before {
          content: "";
          width: 3.2vw;
          height: 1.066vw;
          position: absolute;
          left: 50%;
          bottom: 0.8vw;
          transform: translateX(-50%);
          background-color: #fff;
          border-radius: 0.533vw;
        }
      }
    }
  }
}
.acn-list {
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  margin: 3.2vw 4vw 0;
  padding: 4.266vw 1.5%;
  // min-height: 80vh;
  align-items: flex-start;
  align-content: flex-start;
  border-radius: 4.8vw;
  .acn-cell {
    width: 47.2%;
    margin: 0 1.4% 2.4vw;
  }
}
.none-data {
  margin: 50.4vw auto 5.333vw;
  width: 48vw;
  height: 48vw;
  background: url("//files.eyee.com/mcdn/img/auction/image_empty.png") no-repeat 0 0;
  background-size: contain;
}
.acm-post {
  position: fixed;
  bottom: 32vw;
  right: 4vw;
  width: 11.733vw;
  height: 11.733vw;
  line-height: 4.266vw;
  background: #000;
  border-radius: 50%;
  font-size: 3.2vw;
  font-weight: 600;
  color: #C8AF6E;
  p {
    transform: scale(0.9166);
  }
}

.footer-tab {
  padding: 1.067vw 0 1.33vw;
  border-top: 0.266vw solid #323232;
  background: #232323;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 2;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  &.Inipx {
    padding-bottom: 9.066vw;
  }
  // ._tabs {
  //   div {
  //     flex: 1;
  //     height: 13.333vw;
  //     background: #333333;
  //     color: #fff;
  //     font-size: 4.266vw;
  //     font-weight: bold;
  //     border-radius: 2px;
  //     &.send {
  //       margin-right: 2.6666vw;
  //       background: #fb2e3d;
  //       &.gray {
  //         background: #cccccc;
  //       }
  //       .add_ {
  //         width: 4.266vw !important;
  //         height: 4.266vw;
  //         background: #fff;
  //         border-radius: 50%;
  //         position: relative;
  //         margin-right: 1.866vw;
  //         &:before,
  //         &:after {
  //           content: "";
  //           width: 2px;
  //           height: 2.5vw;
  //           background: #fa2337;
  //           position: absolute;
  //           left: 50%;
  //           top: 50%;
  //           transform: translate(-50%, -50%);
  //           border-radius: 1px;
  //         }
  //         &:after {
  //           height: 2px;
  //           width: 2.5vw;
  //         }
  //       }
  //     }
  //   }
  // }
}
</style>
