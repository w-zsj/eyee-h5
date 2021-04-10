<template>
  <!-- :load-handle="reload" -->
  <!-- <v-list
    :load-handle="reload"
    :more-handle="loadmore"
    :more-handling="loading"
    :isend="isend"
    v-if="list.length>0"
    class="auction-record"
  >-->
  <div v-loadmore="loadmore" class="auction-record" v-if="list.length>0">
    <div class="flex-between ar-th">
      <div>昵称</div>
      <div>出价时间</div>
      <div>出价(¥)</div>
      <div>状态</div>
    </div>
    <template v-for="(item,idx) in list">
      <div class="flex-between ar-tr" :key="'arc'+idx" :class="{dis:(item.status==1||item.status==3)}">
        <div>{{item.nickname}}</div>
        <div>{{item.bidtime}}</div>
        <div>¥&nbsp;{{item.bid}}</div>
        <div class="tr-ar">
          <span class="ar-desc" :class="{desc:(item.status==1||item.status==3)}">{{item.status==3?'成交':item.status==1?'领先':'出局'}}</span>
        </div>
      </div>
    </template>
    <div v-if="isend" class="end">-- THE END --</div>
  </div>
  <!-- </v-list> -->
  <div class="none-data" v-else></div>
</template>
<script>
import { BidRecords } from "@/utils/api/auction";

let page = 1;
export default {
  name: "AuctionRecord",
  props: {
    auctiongoodid: Number || String
  },
  data() {
    return {
      loading: true,
      isend: false,
      list: []
    };
  },
  beforeMount() {
    this.reload();
  },
  methods: {
    reload() {
      page = 1;
      // this.list = [];
      this.load();
    },
    loadmore() {
      let _ = this,
        { isend, load } = _;
      setTimeout(() => {
        if (isend || page * 12 > _.list.length) return;
        page++;
        load();
      }, 300);
    },
    load() {
      let _ = this;
      _.loading = true;
      BidRecords({ auctiongoodid: _.auctiongoodid, page, size: 12 })
        .then(res => {
          console.log("Auction BidRecords res: ", res);
          if (res.list && res.list.length > 0) {
            if (page === 1) _.list = res.list;
            else _.list = _.list.concat(res.list);
            _.isend = res.page * res.size >= res.total;
          } else if (page === 1) _.list = [];

          _.loading = false;
        })
        .catch(e => {
          console.error("Auction BidRecords error: ", e);
          _.loading = false;
          _.toast("加载失败~");
        });
    }
  }
};
</script>
<style lang="scss">
.mint-loadmore {
  background: none;
}
.auction-record {
  -webkit-overflow-scrolling: auto;
  color: #969696;
  overflow-y: auto;
  overflow-x: hidden;
  height: 50vh;
  .ar-tr,
  .ar-th {
    line-height: 10.667vw;

    & > div {
      width: 26%;
      text-align: center;
      &:first-of-type {
        text-align: left;
      }
      &:last-of-type {
        text-align: right;
        width: 22%;
      }
    }
  }
  .ar-th {
    font-size: 3.2vw;
    font-weight: 600;
    color: #fff;
  }
  .ar-tr {
    font-size: 3.467vw;
    font-weight: 400;
    position: relative;
    z-index: 999;
    .tr-ar {
      transform: scale(0.95);
      margin-right: -0.4vw;
    }
    &.dis {
      color: #fff;

      .ar-desc {
        background: #505050;

        &::after {
          border-right-color: #505050;
        }
      }
      .desc {
        background: #000;

        &::after {
          border-right-color: #000;
        }
      }
    }
  }

  // .ar-th,
  // .ar-tr:nth-of-type(odd) {
  //   background: #fafafa;
  // }

  .ar-desc {
    position: relative;
    background: #505050;
    border-radius: 1.067vw;
    // border: 0.267vw solid #f5f5f5;
    padding: 0.4vw 2.4vw;
    font-size: 2.933vw;

    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      transform: translate(-1.067vw);
      border-right: 2vw solid #505050;
      border-bottom: 2vw solid transparent;
    }
  }
  .end {
    line-height: 16vw;
    font-size: 3.467vw;
    color: #505050;
  }
}
.none-data {
  margin: 8vw auto 5.333vw;
  width: 48vw;
  height: 48vw;
  background: url("//files.eyee.com/mcdn/img/auction/image_empty.png") no-repeat 0 0;
  background-size: contain;
}
</style>