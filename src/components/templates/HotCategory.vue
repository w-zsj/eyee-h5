<template>
  <div v-if="categorys&&categorys.length>0">
    <div class="sec-title">
      <p class="ico-btline">热门分类<br>
        <span>HOT CATEGORIES</span>
      </p>
      <div class="sec-subtitle" @click="goMore">更多分类</div>
      <!-- <div v-if="qzone" class="sec-subtitle" @click="qzoneGo('/category')">更多分类</div>
      <router-link v-else class="sec-subtitle" to="/category">更多分类</router-link> -->
    </div>
    <ul class="hc-sudoku">
      <li class="hc-item" v-for="(item,idx) in categoryData" :key="item.id" @click.stop="goSearch(item,idx)">
        <!-- <a> -->
        <img :src="item.logourl|https" alt="">
        <!-- </a> -->
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'hot-category',
  props: { categorys: { default: [] }, qzone: { type: Boolean, default: false }},
  methods: {
    goMore(e) {
      let rect = e.target.getBoundingClientRect()

      // console.log('goMore', rect)
      let path = '/category'
      this.qzone ? this.qzoneGo(path) : this.$router.push(path)
    },
    goSearch(item, idx) {
      let rect = window.document.getElementsByClassName('hc-item')[idx].getBoundingClientRect()

      let url = `/mall/search/${item.name}?categoryid=${item.id}`
      this.qzone ? this.qzoneGo(url) : this.$router.push(url)
      var set = {}
      set.categoryid = item.id
      set.keyword = item.name
      this.$store.dispatch('confirOption', { data: set })
    }
  },
  computed: {
    categoryData() {
      return this.categorys.slice(0, 6)
    }
  }
}
</script>
<style scoped>
.hc-sudoku {
  display: flex;
  flex-wrap: wrap;
  padding: 0 2.5%;
  justify-content: space-between;
  width: 100%;
}

.hc-sudoku li {
  width: 31.33%;
  /*min-width: 95px;
  min-height: 95px;
  max-width: 135px;
  max-height: 135px;*/
  /* padding:0 1.5%; */
  margin-bottom: 3%;
  position: relative;
  padding-top: 31.33%;
  height: 0;
}
.hc-sudoku img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
