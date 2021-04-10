<template>
  <mt-loadmore
    top-pull-text="下拉刷新"
    top-drop-text="释放刷新"
    top-loading-text
    :top-distance="50"
    :top-method="toggleShowMore"
    ref="loadmore"
  >
    <div class="wait-list-dbl" v-if="hasdata==2"></div>

    <v-list
      class="auction-orders"
      :load-handle="reload"
      :more-handle="loadmore"
      :more-handling="loading"
      :isend="isend"
      v-else-if="hasdata&&list.length>0"
    >
      <template v-for="(item, idx) in list">
        <div :key="idx" class="aco-cell">
          <Auctitle :item="item" :isOrder="isOrder"></Auctitle>
          <div class="flex-between aco-prod" @click="handle('orderDetail',item)">
            <div class="aco-img" :style="`background-image:url(${item.imageurl})`"></div>
            <div class="aco-info">
              <p class="ellipsis-2">{{item.name}}</p>
              <div v-if="isOrder">
                <p>成交价：￥{{item.dealprice}}</p>
                <p>成交时间：{{item.dealtime}}</p>
              </div>
              <div v-else>
                <p>起拍价：￥{{item.initbid}} &nbsp;&nbsp;加价幅度：￥{{item.priceincrease}}</p>
                <p>拍卖时间：{{item.auctiontime}}</p>
              </div>
            </div>
          </div>
          <div
            class="flex-end aco-opt"
            :class="{'hasInfo': ((isOrder) || (!isOrder && (item.status == 0 || item.status == 6 || item.status == 7)))}"
            v-if="!iscooperativeseller"
          >
            <template v-if="isOrder">
              <button
                @click="handle('updOrderno',item)"
                class="flex-center"
                v-if="item.status==2"
              >上传物流单号</button>
              <button
                @click="handle('goDetail',item)"
                class="flex-center"
                v-else-if="item.status!=1"
              >查看详情</button>
            </template>
            <template v-else>
              <!-- <button
                @click="handle('sale',item)"
                class="flex-center"
                v-if="item.status==6|| item.status==7 &&item.childstatus==10"
              >一键上架</button>-->
              <!-- || item.status==6 || item.status==7 && item.childstatus==11 -->
              <button
                class="btn-light flex-center"
                @click="handle('notSale',item)"
                v-if="item.status==0 || item.status==6||item.status==7&&item.childstatus==11"
              >不卖了</button>
              <button
                @click="handle('edit',item)"
                class="flex-center"
                v-if="item.status==0|| item.status==6 || item.status==7 && item.childstatus==11"
              >{{item.status==0?'':'重新'}}编辑</button>
            </template>
          </div>
        </div>
      </template>
    </v-list>

    <div class="none-data" v-else></div>
  </mt-loadmore>
</template>

<script>
import {
  AuctionGoodsList,
  AuctionOrderList,
  Cancelsell,
  OneKeyShelf,
  Reeditinfo,
  Cooperativeseller
} from "@/utils/api/auction";
import Auctitle from "@/views/auction/Status";
let page = 1,
  $cd;
export default {
  name: "AuctionOrder",
  data() {
    return {
      hasdata: 2,

      loading: true,
      isend: false,
      list: [],
      hasInfo: false, // 判断 aco-opt 下是否有button
      iscooperativeseller: false
    };
  },
  components: { Auctitle },
  computed: {
    status() {
      return this.$route.query.s || (this.isOrder ? 1 : 0);
    },
    isOrder() {
      return this.$route.name == "AuctionOrders";
    }
  },
  watch: {
    status: function(newval, oldval) {
      // if (newval != oldval)
      this.reload();
    },
    isOrder: function(newval, oldval) {
      this.reload();
    }
  },
  mounted() {
    let _ = this;
    setTimeout(() => {
      _.reload();
      _.iscopsell();
    }, 500);
  },
  methods: {
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
    toggleShowMore(e) {
      this.$refs.loadmore.onTopLoaded();
      this.reload();
    },
    reload() {
      page = 1;
      this.list = [];
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
      let _ = this;
      _.loading = true;
      let api = _.isOrder ? AuctionOrderList : AuctionGoodsList,
        status = _.status;
      console.log("请求参数", "status", status);
      api({ status, page })
        .then(res => {
          if (res.list && res.list.length > 0) {
            if (page === 1) _.list = res.list;
            else _.list = _.list.concat(res.list);
            _.hasdata = 1;
            _.isend = res.page * res.size >= res.total && _.list.length > 0;
          } else if (page === 1) {
            _.list = [];
            _.hasdata = 0;
          }
          _.loading = false;
        })
        .catch(e => {
          console.error("SceneGoods error: ", e);
          _.loading = false;
          // _.toast("加载失败~");
          _.hasdata = 0;
          if (page === 1) _.list = [];
        });
    },
    handle(type, item) {
      console.log("handle: ", type, item);
      let _ = this,
        { isOrder, list } = _;
      switch (type) {
        case "sale": // 一键上架
          OneKeyShelf({ auctiongoodid: item.auctiongoodid })
            .then(res => {
              let indx = list.findIndex(
                i => item.auctiongoodid == i.auctiongoodid
              );
              _.list.splice(indx, 1);
              _.toast("上架成功");
            })
            .catch(e => {
              console.error("Shelf Error", e);
              _.toast((e && e.msg) || "");
            });
          break;
        case "notSale":
          _.confirm({
            title: "确定不卖了？",
            msg: "下架之后商品信息将不再保留",
            cancelText: "我再想想",
            ok: () => {
              console.log("真的确定不卖了！");
              _.Celsell(item.productid);
            }
          });
          break;
        case "edit":
          // $log({
          //   e: "click_ag_pub_edit",
          //   p: { pid: item.productid }
          // });
          if (ENV.ua.mini) {
            // Reeditinfo({ productid: item.productid })
            //   .then(res => {
            console.log("auctiongoodid--", item.productid);
            // wx.miniProgram.postMessage({ data: { data: res } });
            wx.miniProgram.navigateTo({
              url: `/pages/auction/publish/situation?restedit=restedit&productid=${item.productid}`
            });
            // })
            // .catch(e => console.error("编辑--", e));
          } else {
            _.javascriptBridge({
              name: "gotoAppAuctionProductStatePage",
              params: { id: item.productid, type: item.type }
            });
          }

          break;
        case "orderDetail":
          if (!_.isOrder) {
            if ((item.status == 4 || item.status == 3) && item.auctiongoodid) {
              // 竞拍中
              if (ENV.ua.mini) {
                wx.miniProgram.navigateTo({
                  url: `/pages/auction/detail?auctiongoodid=${item.auctiongoodid}`
                });
              } else {
                // _.$emit("click", item.auctiongoodid);
                _.$router.push(
                  "/auction/detail/" + item.auctiongoodid + "?channel=1"
                );
              }
            }
          } else {
            if (ENV.ua.mini) {
              wx.miniProgram.navigateTo({
                url: `/pages/order/detail?sourceType=2&orderno=${item.orderno}`
              });
            } else {
              _.javascriptBridge({
                name: "callAppOrderDetail",
                params: { orderno: item.orderno, type: 2 }
              });
            }
          }
          break;
        case "goDetail":
          if (ENV.ua.mini) {
            // 买家还是卖家身份不能确定
            wx.miniProgram.navigateTo({
              url: `/pages/order/detail?orderno=${item.orderno}&sourceType=2`
            });
          } else {
            _.javascriptBridge({
              name: "callAppOrderDetail",
              params: { orderno: item.orderno, type: 2 }
            });
          }
          break;
        case "updOrderno":
          if (ENV.ua.mini) {
            wx.miniProgram.navigateTo({
              url:
                "/pages/auction/publish/uplogisticsnum?orderno=" + item.orderno
            });
          } else {
            _.javascriptBridge({
              name: "gotoAppAuctionOrderLogisticsNoPage",
              params: { orderno: item.orderno }
            });
          }

          break;
      }
    },
    // 我不卖了
    Celsell(productid) {
      let _ = this,
        list = _.list;
      Cancelsell({ productid })
        .then(res => {
          let index = list.findIndex(i => productid == i.productid);
          list.splice(index, 1);
          _.list = list;
          // $log({
          //   e: "click_ag_pub_notsell",
          //   p: { pid: item.productid }
          // });
        })
        .catch(e => {
          console.error(e);
        });
    }
  }
};
</script>
<style lang="scss">
.none-data {
  margin: 8vw auto 5.333vw;
  width: 48vw;
  height: 48vw;
  background: url("//files.eyee.com/mcdn/img/auction/image_empty.png") no-repeat 0 0;
  background-size: contain;
}
.auction-orders {
  $bg: #f5f5f5;
  $bC: #f5f5f5;
  padding: 0 4vw;
  background: $bg;

  .aco-cell {
    padding: 3.2vw 3.2vw 1.0666667vw;
    margin-bottom: 2.667vw;
    background: #fff;
    border-radius: 1.067vw;
  }

  .aco-status {
    padding: 0 0.8vw 2.667vw;
    border-bottom: 1px solid $bC;
    span {
      font-size: 13px;
      color: #646464;
      overflow: hidden;
      .gh {
        top: 0;
        margin-right: 2px;
        transform: scale(0.8);
      }
      .ico-lg {
        width: 2.167vw;
        height: 2.167vw;
        top: 0.5vw;
        color: #969696;
      }
      &.bold {
        font-weight: bold;
        color: #232323;
      }
      &.red {
        color: #fa2337;
      }
      .open {
        margin-left: 2.66vw;
      }
    }
    // :last-of-type {
    //   font-size: 3.2vw;
    //   font-weight: 400;
    //   color: #646464;
    // }
    // :first-of-type {
    //   font-size: 3.467vw;
    //   font-weight: 600;
    //   color: #232323;
    // }

    .warn {
      color: #fa2337;
      position: relative;
      padding-right: 4.266vw;
    }
  }
  .aco-prod {
    padding: 2.133vw 0.8vw 2.133vw 0;
  }
  .aco-img {
    width: 24vw;
    height: 24vw;
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
    overflow: hidden;
    border-radius: 2px;
  }
  .aco-info {
    width: 68%;

    p {
      font-size: 3.2vw;
      font-weight: 400;
      color: #646464;
      line-height: 4.533vw;
      &:first-child {
        margin-bottom: 3px;
      }
    }

    .ellipsis-2 {
      font-size: 3.733vw;
      font-weight: 600;
      color: #232323;
      line-height: 4.8vw;
      height: 9.6vw;
      margin-bottom: 2.667vw;
    }
  }
  .aco-opt {
    &.hasInfo {
      border-top: 1px solid $bC;
      padding: 1.867vw 0.8vw;
    }
    button {
      margin-left: 4vw;
      padding: 0 3.467vw;
      line-height: 6.666vw;
      height: 6.666vw;
      color: #646464;
      font-size: 3.2vw;
      font-weight: 600;
      border-radius: 0.533vw;
      border: 0.267vw solid;
      background: none;
    }

    .btn-light {
      color: #969696;
      border-color: #b4b4b4;
    }
  }
}
</style>
<style>
.mint-msgbox-message {
  text-align: center;
}
</style>