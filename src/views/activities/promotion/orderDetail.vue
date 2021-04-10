<template>
  <div class="detail">
    <v-cutlist
      :load-handle="() => {}"
      :more-handle="loadmore"
      :more-handling="isLoading"
      :isend="isEnd"
      v-if="hasData"
    >
      <div class="flex-aic-btwn tabs">
        <div
          class="list flex-center"
          :class="{ act: curTabs == idx }"
          v-for="(item, idx) in tabs"
          :key="idx"
          @click="tabChange(item.id, idx)"
        >
          {{ item.title }}
        </div>
      </div>

      <div class="box">
        <div class="list" v-for="(item, index) in list" :key="'list' + index">
          <div class="name">
            {{ item.productname }}
          </div>
          <div class="status flex-aic-btwn">
            <div class="st flex-col-ctr">
              <div class="txt">状态</div>
              <div class="num">
                {{
                  item.status == 1
                    ? "待结算"
                    : item.status == 2
                    ? "已结算"
                    : "已失效"
                }}
              </div>
            </div>
            <div class="st flex-col-ctr">
              <div class="txt">付款金额</div>
              <div class="num">￥{{ item.payamount }}</div>
            </div>
            <div class="st flex-col-ctr">
              <div class="txt">返佣比例</div>
              <div class="num">{{ item.rebaterate }}%</div>
            </div>
            <div class="st flex-col-ctr">
              <div class="txt">预计收入</div>
              <div class="num">￥{{ item.rebateamount }}</div>
            </div>
          </div>
          <div class="paytime">
            付款时间: {{ item.paytime }}
            <span>购买用户：{{ item.username }}</span>
          </div>
        </div>
      </div>
    </v-cutlist>
    <div v-else class="flex-col flex-center nodata">
      <img
        src="https://files.eyee.com/mcdn/static/coupon/default_img.png"
        alt=""
      />
      暂无数据~
    </div>
  </div>
</template>
<script>
import { rebateorders } from "../../../utils/api/activities";
export default {
  data() {
    return {
      hasData: true,
      tabs: [
        { id: 0, title: "全部" },
        { id: 1, title: "待结算" },
        { id: 2, title: "已结算" },
        { id: 3, title: "已失效" },
      ],
      curTabs: 0,

      isEnd: false,
      isLoading: false,
      page: 1,
      list: [],
    };
  },
  mounted() {
    let _ = this;
    // if (_.$root.loging) {
    //   _.$root.loging
    //     .then(($) => {})
    //     .catch((e) => {
    //       console.error("query prams auto login error:", e);
    //     });
    // }
    _.req();
  },
  methods: {
    tabChange(id, idx) {
      let _ = this;
      if (_.curTabs == idx) return;
      else _.curTabs = idx;
      _.page = 1;
      _.isEnd = false;
      _.isLoading = false;
      _.req();
      // console.log("id--", id, idx);
    },
    loadmore() {
      if (this.isEnd === true) {
        this.toast("已无更多");
      } else {
        if (this.list && this.list.length) {
          this.page += 1;
          this.req();
        }
      }
    },
    req() {
      let _ = this;
      if (_.isLoading) return;
      _.isLoading = true;
      let postParams = {
        page: _.page,
        size: 10,
        status: _.tabs[_.curTabs].id,
      };

      rebateorders(postParams)
        .then((res) => {
          if (res) {
            _.hasData = true;
            console.log("mall home CategorySearch", res);
            if (_.page === 1) _.list = res.list;
            else if (res.list && res.list.length)
              _.list = _.list.concat(res.list);
            if (res.page * res.size >= res.total) _.isEnd = true;
            _.isLoading = false;
          } else _.hasData = false;
        })
        .catch((e) => {
          console.error(e);
          _.isEnd = false;
          _.isLoading = false;
          _.hasData = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
  },
};
</script>
<style scoped lang='scss'>
.detail {
  .nodata {
    font-size: 15px;
    color: #333;
    margin: 80px auto;
    width: 105px;
    img {
      margin-bottom: 35px;
    }
  }

  .tabs {
    padding: 8.266vw 6.2666vw 7.73333vw;
    .list {
      width: 16.666vw;
      height: 5.8666vw;
      font-size: 3.783vw;
      color: #9b9b9b;
      position: relative;
      font-weight: bold;
      border-radius: 2.9333vw;
      &.act {
        color: #333;
        border: 1px solid #333;
      }
    }
  }
  .box {
    .list {
      border-bottom: 1px solid rgba(0, 0, 0, 0.2144);
      font-size: 12px;
      color: #333;
      padding: 0 6.4vw;
      margin-bottom: 4vw;
      .name {
        margin-bottom: 4.266vw;
      }
      .status {
        color: #666;
        margin-bottom: 3.333vw;
        .num {
          color: #333;
          font-weight: bold;
          padding-top: 1.333vw;
        }
      }
      .paytime {
        margin: 1.3333vw auto 4.266vw;
        color: #9b9b9b;
        span {
          padding-left: 2.66vw;
        }
      }
    }
  }
}
</style>