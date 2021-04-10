<template>
  <div class="more-series">
    <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3>更多</h3>
      </div>
    </v-header>
    <v-list
      :load-handle="()=>{}"
      :more-handle="searchloadmore"
      :more-handling="loading"
      :isend="isend"
    >
      <div class="product-list flex-between">
        <div
          class="one-product flex-center"
          v-for="(item,index) in seriesList "
          :key="index"
          @click="goCategoryPro(item)"
        >
          <img :src="item.mainpic">
          <p>{{item.name}}</p>
        </div>
      </div>
    </v-list>
  </div>
</template>
<script>
import { SeriesList } from "../../utils/api/c2ccategory";
export default {
  data() {
    return {
      seriesList: [],
      loading: false,
      isend: false,
      pageindex: 1
    };
  },
  mounted() {
    this.getSeries();
  },
  methods: {
    goCategoryPro(item) {
      // this.$router.push({ path: `/c2c/CategoryProducts/${item.id}` });
      this.$router.push("/results/" + encodeURIComponent(item.name) + "?categoryid=" + item.id + "&isc2c=1"+"&brandid="+item.brandid);
    },
    // 下拉加载
    searchloadmore() {
      let _ = this;
      if (_.loading) return;
      if (_.isend) _.toast("已无更多");
      else {
        _.pageindex++;
        _.getSeries();
      }
    },
    // 获取商品列表
    getSeries() {
      let _ = this,
        pageindex = _.pageindex;
      _.loading = true;
      SeriesList({ pageindex, pagesize: 10 })
        .then(res => {
          if (res && res.list && res.list.length) {
            if (pageindex === 1) _.seriesList = res.list;
            else _.seriesList = _.seriesList.concat(res.list);
            _.isend =
              res.page * res.size >= res.total && _.seriesList.length > 0;
          } else _.isend = true;
          _.loading = false;
        })
        .catch(e => {
          _.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    }
  }
};
</script>
<style scoped>
.product-list {
  width: 100vw;
  padding: 2vw;
  flex-wrap: wrap;
  background: #f6f6f6;
}
.one-product {
  width: 47vw;
  background: #fff;
  flex-wrap: wrap;
  margin-bottom: 2vw;
}
.one-product img {
  width: 66%;
  margin: 2vw;
  min-height: 88px;
}
.one-product p {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-family: DINOT-CondBlack;
  font-weight: normal;
  height: 7vw;
  line-height: 6vw;
}
.more-series >>>.no-more{
   background: #f6f6f6;
}
</style>


