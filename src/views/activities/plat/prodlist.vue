<template>
  <div class="recd">
    <v-list
      :load-handle="reload"
      :more-handle="rcdloadmore"
      :more-handling="loading"
      :isend="isend"
    >
      <div class="plist-dbl flex-wrap rcd-list">
        <product-unit
          v-for="(iRcd,rcdIdx) in list"
          :key="'rcd'+rcdIdx"
          :product-item="iRcd"
          :product-type="20"
          :is-find-sim="1"
          :home="true"
          :homeLocation="rcdIdx"
          :position="3"
        ></product-unit>
      </div>
    </v-list>
  </div>
</template>
<script>
import ProductUnit from "@/components/templates/ProductUnit";
import { Stylepavilion } from "@/utils/api/activities";
let page = 1;
export default {
  data() {
    return {
      isend: false,
      loading: false,
      list: [],
      bannerlist: []
    };
  },
  components: { ProductUnit },
  beforeCreate: function() {
    document.body.classList.add("add_bg");
  },
  beforeDestroy: function() {
    document.body.classList.remove("add_bg");
  },
  mounted() {
    this.getRecommend();
  },
  methods: {
    getRecommend() {
      let _ = this;
      _.loading = true;
      Stylepavilion({ themetype: 0, activitytype: 8, page })
        .then(res => {
          if (page === 1) _.list = res.list;
          else if (res && res.list && res.list.length) {
            _.list = _.list.concat(res.list);
          }
          if (_.list && _.list.length) {
            _.list = _.list.map(i => {
              i.mainpic = i.mainpic + "|";
              i.isc2c = 0;
              return i;
            });
          }
          _.isend =
            res.pageindex * res.pagesize >= res.sumcount && _.list.length > 0;
          _.loading = false;
        })
        .catch(e => {
          _.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    reload() {
      page = 1;
      this.getRecommend();
    },
    rcdloadmore() {
      let _ = this;
      if (_.loading) return;
      if (_.isend) _.toast("已无更多");
      else {
        page++;
        _.getRecommend();
      }
    }
  }
};
</script>
<style lang='scss'>
.add_bg {
  background: #f5f5f5;
  .sale-count {
    margin-bottom: 2.3333vw !important;
  }
  .productItem {
    .product_name {
      padding: 0 10px;
    }
  }
}
</style>
<style scoped lang='scss'>
.recd {
  background: #f5f5f5;
  min-height: 100vh;
  .mint-loadmore {
    background: none;
  }
  .productItem {
    width: 49%;
    margin-bottom: 2%;
    &:nth-child(2n + 1) {
      margin-right: 2%;
    }
  }
}
</style>