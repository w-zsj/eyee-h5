<template>
  <div>
    <div class="sec-title" style="margin-top:5px;">
      <p v-if="type==0" class="ico-btline">人气鞋款趋势</p>
      <div class="sec-head" v-else><img :src="trendImg" alt=""><span>人气鞋款每日市场趋势</span></div>
      <a href="javascript:;" class="sec-subtitle" v-if="qzone" @click="qzoneGo('/shoe')">{{type==0?'所有鞋款':'VIEW MORE'}}</a>
      <router-link class="sec-subtitle" v-else to="/shoe">{{type==0?'所有鞋款':'VIEW MORE'}}</router-link>
    </div>
    <swiper :options="options">
      <shoe-unit class="swiper-slide flex-col" v-for="item in list" :key="item.id" :unit="item" :type="2" :qzone='qzone'></shoe-unit>
    </swiper>
  </div>
</template>
<script>
import ShoeUnit from './ShoeListUnit'
export default {
  name: 'shoe-swiper',
  props: { shoes: { default: [] }, type: { type: Number, default: 0 }, qzone: { type: Boolean, default: false }},
  components: { ShoeUnit },
  data() {
    return {
      trendImg: '//files.eyee.com/mcdn/static/img/trend.png', // require('../../assets/img/trend.png'),
      options: {
        slidesPerView: 2.2,
        resistanceRatio: 0,
        freeMode: true
      }
    }
  },
  computed: {
    list() {
      return this.shoes
    }
  }
}
</script>
