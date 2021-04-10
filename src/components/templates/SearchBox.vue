<template>
  <div class="sc-input flex-center" @click.stop.prevent="goSearch">
    <input type="text" placeholder="Search" :value="keyword">
    <img class="ico-search" :src="sImg" alt="">
  </div>
</template>
<script>
import { ENUM } from "../../common/util";
export default {
  name: "SearchBox",
  props: {
    type: {
      type: Number,
      default() {
        return 0;
      }
    }, // 0 商城搜索,1 资讯搜索, 2 球鞋c2c搜索
    qzone: { type: Boolean, default: false }
  },
  data() {
    return {
      keyword: "",
      sImg: "//files.eyee.com/mcdn/static/img/search_gray.png" // require('../../assets/img/search_gray.png')
    };
  },
  mounted() {
    this.keyword = this.$route.params.key||this.$route.query.brandname
    // console.log(this.$route.params,'kkkkkkkkk')
  },
  methods: {
    goSearch() {
      let val = ENUM.SearchType.product.val;
      if (this.type === 1) val = ENUM.SearchType.newsSearch.val;
      if (this.type === 2) val = ENUM.SearchType.sneaker.val;
      let url = "/search/" + val;
      this.qzone ? this.qzoneGo(url) : this.$router.push(url);
    }
  }
};
</script>
