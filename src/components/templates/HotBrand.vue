<template>
  <div class="home-brand" v-if="brands&&brands.length>0">
    <div class="sec-title">
      <p class="ico-btline">热门品牌<br>
        <span>HOT BRANDS</span>
      </p>
      <div class="sec-subtitle" @click="goMore">更多品牌</div>
      <!-- <div v-if="qzone" class="sec-subtitle" @click="qzoneGo('/mall/brand')">更多品牌</div>
      <router-link v-else class="sec-subtitle" to="/mall/brand">更多品牌</router-link> -->
    </div>
    <swiper :options="hbOption_slideType1" class="SType-1-oUl">
      <swiper-slide v-for="(item,index) in BrandsData" :key="index" class="SType-1-oLl">
        <div v-for="(it,idx) in item" :key="idx" class="SType-1-item hb-item" @click.stop="goSearch(it,idx)">
          <img :src="it.coverurl|https">
        </div>
      </swiper-slide>
      <div class="swiper-scrollbar SType-1-bar" slot="scrollbar"></div>
    </swiper>
  </div>
</template>
<script>
import ProductUnit from './ProductUnit'
import { sliceArray } from '../../assets/js/slider'
export default {
  components: { ProductUnit },
  name: 'hot-brand',
  props: {
    brands: { default: [] },
    qzone: { type: Boolean, default: false }
  },
  data() {
    return {
      actIdx: 0,
      hbOption: {
        // slidesPerView: 1,
        // centeredSlides: true,
        // roundLengths: true,
        // effect: 'coverflow',
        // coverflow: {
        //   rotate: 30,
        //   stretch: 10,
        //   depth: 60,
        //   modifier: 2,
        //   slideShadows: false,
        // },
        onInit: swiper => {
          this.initSwiper(swiper)
        }
      },
      hbOption_slideType1: {
        scrollbar: '.swiper-scrollbar',
        scrollbarHide: false,
        onSlideChangeEnd: this.slideChange
        // scrollbarDraggable: true,
        // scrollbarSnapOnRelease: true
      }
    }
  },
  computed: {
    list() {
      let list = this.brands
      if (list && list.length > 0) {
        if (list.length > 6) list = list.slice(0, 6)
        else if (list.length > 3) list = list.slice(0, 3)
        list = list.map((i, idx) => {
          return i
        })
      }
      return list
    },
    BrandsData() {
      return sliceArray(this.brands, 9)
    }
  },
  methods: {
    initSwiper(swiper) {
      let w = swiper.width,
        ml = 0,
        items = window.document.getElementsByClassName('hb-items')
      ml = -1 * Math.ceil((w - w / this.hbOption.slidesPerView) / 2)
      // console.log('item margin-left', ml);
      this.itemStyle = 'width:' + w + 'px;margin-left:' + ml + 'px'
    },
    slideChange(swiper) {
      this.actIdx = swiper.activeIndex
    },
    goMore(e) {
      let rect = e.target.getBoundingClientRect()

      // console.log('goMore', rect)
      let path = '/mall/brand'
      this.qzone ? this.qzoneGo(path) : this.$router.push(path)
    },
    goSearch(item, idx) {
      let rect = window.document.getElementsByClassName('hb-item')[idx].getBoundingClientRect()


      // this.$router.push('/mall/search/' + item.brandname)
      let url = '/mall/search/' + encodeURIComponent(item.brandname) + '?brandid=' + item.brandid
      this.qzone ? this.qzoneGo(url) : this.$router.push(url)
      var set = {},
        brandkeyword = {}
      set.keyword = item.brandname
      brandkeyword.isBrand = true
      brandkeyword.brandName = item.brandname
      brandkeyword.brandId = item.brandid
      this.$store.dispatch('setKeywordBrand', brandkeyword)
      console.log(set)
      this.$store.dispatch('confirOption', { data: set })
    }
  },
  mounted() {}
}
</script>
<style scoped>
.home-brand {
  background-color: #fff;
}
.SType-1-oUl {
  width: 100%;
  padding-bottom: 10px;
}
.SType-1-oLl {
  width: 100%;
  padding: 0 1%;
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
  align-content: flex-start;
}
.SType-1-item {
  width: 33.33%;
  padding: 0 1.5%;
  margin-bottom: 3%;
  overflow: hidden;
}
.SType-1-item > img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.SType-1-oUl .SType-1-bar {
  bottom: 0px !important;
}
/**/
.hb-info {
  position: relative;
  height: 150px;
  overflow: hidden;
  border-radius: 2px;
}

.hb-info > img {
  position: absolute;
  width: 100%;
  min-height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: blur(2px);
}

.hb-desc {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
  flex-direction: column;
}

.hb-desc > img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.hb-desc p {
  font-size: 16px;
  font-weight: 600;
  line-height: 32px;
  margin-top: 10px;
}

.hb-desc span {
  font-size: 12px;
}

.swiper-slide-active .hb-items {
  opacity: 1;
}

.hb-items {
  width: 100%;
  padding: 2%;
  margin-top: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hb-items > div {
  width: 28%;
  margin: 0 2%;
}
</style>
