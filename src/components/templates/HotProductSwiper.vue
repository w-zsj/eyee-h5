<template>
  <div v-if="products&&products.length>0">
    <div class="sec-title">
      <p class="ico-btline">人气推荐<br>
        <span>RECOMMENDATIONS</span>
      </p>
      <span class="sec-subtitle" @click="goSearch()">{{qzone?'查看全部':'商城频道'}}</span>
    </div>
    <swiper :options="hpOption" style="padding:15px 10px;">
      <div class="swiper-slide hp-item" v-for="(item,idx) in products" :key='idx' @click="goProduct(item,idx)">
        <product-unit :product-item="item" :qzone='qzone'></product-unit>
      </div>
    </swiper>
  </div>
</template>
<script>
import ProductUnit from './ProductUnit'
export default {
  name: 'hot-product',
  components: { ProductUnit },
  props: {
    products: {
      default() {
        return []
      }
    },
    qzone: { type: Boolean, default: false }
  },
  data() {
    return {
      hpOption: {
        slidesPerView: 2.5,
        spaceBetween: 20,
        resistanceRatio: 0,
        freeMode: true
      }
    }
  },
  methods: {
    goSearch() {
      this.qzone ? this.qzoneGo('/mall/search') : this.$router.push('/mall/search/')
      var set = {}
      set.brandid = null
      //  set.brandName = brand.name
      this.$store.dispatch('confirOption', { data: set })
    },
    goProduct(item, idx) {
    }
  }
}
</script>
