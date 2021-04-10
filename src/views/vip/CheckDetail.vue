<template>
  <div>
    <!-- 奖励明细 -->
    <div v-if="list && list.length">
      <v-list :load-handle="()=>{}" :more-handle="rcdloadmore" :more-handling="rcd.loading" :isend="rcd.isend">
        <th class="th flex-btwn">
        <td class="flex-aic">说明</td>
        <td class="flex-center">金额</td>
        <td class="flex-end">可提奖励</td>
        </th>
        <div>
          <tr class="tr flex-btwn" v-for="(item,index) in list" :key="index">
            <td class="flex-aic">{{item.typetext}}</td>
            <td class="flex-center">{{item.amount}}</td>
            <td class="flex-col-ctr">
              <span class="flex-end">{{item.withdrawamount}}</span>
              <span class="creattimer flex-end">{{item.time}}</span>
            </td>
          </tr>
        </div>
      </v-list>
    </div>
    <div class="no-data" v-else>
      <img src="https://files.eyee.com/eyeeh5/img/image_empty.png" alt />
      <p>暂无任何记录~</p>
    </div>
  </div>
</template>
<script>
import { Bonus } from "@/utils/api/vip";
export default {
  data() {
    return {
      rcd: {
        pageindex: 1,
        loading: false,
        isend: true
      },
      list: []
    };
  },
  mounted() {
    let _ = this;
    if (ENV.ua.mini) {
      if (_.$root.loging) {
        _.$root.loging
          .then(res => {
            _.getRecommend();
          })
          .catch(e => {
            console.error("query prams auto login error:", e);
          });
      }
    } else _.getRecommend();

    // 隐藏分享按钮
    _.javascriptBridge({
      name: "getAppActivityShareContent",
      params: {
        hideshareicon: true
      }
    });
  },
  methods: {
    rcdloadmore() {
      let _ = this;
      if (_.rcd.loading) return;
      if (_.rcd.isend) _.toast("已无更多");
      else {
        _.rcd.pageindex++;
        _.getRecommend();
      }
    },
    getRecommend() {
      let _ = this,
        page = _.rcd.pageindex;
      _.rcd.loading = true;
      Bonus({ page })
        .then(res => {
          if (res && res.list && res.list.length) {
            if (page === 1) _.list = res.list;
            else _.list = _.list.concat(res.list);
            _.rcd.isend = res.page * res.size >= res.total && _.list.length > 0;
          } else _.rcd.isend = true;
          _.rcd.loading = false;
        })
        .catch(e => {
          _.rcd.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.th {
  color: #232323;
  font-size: 12px;
  padding: 0 4vw;
  height: 8.533vw;
  td {
    flex: 1;
    // &:last-child {
    //   flex: 1.5;
    // }
  }
}
.tr {
  color: #232323;
  font-size: 13px;
  padding: 0 4vw;
  height: 16vw;
  td {
    flex: 1;
    span {
      width: 100%;
      font-size: 14px;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
      &.creattimer {
        font-weight: normal;
        font-size: 12px;
        color: #646464;
        margin-top: 3px;
      }
    }
    // &:last-child {
    //   flex: 1.5;
    // }
  }
  &:nth-child(2n + 1) {
    background: #fafafa;
  }
}
</style>


