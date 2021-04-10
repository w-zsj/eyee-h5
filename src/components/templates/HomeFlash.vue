<template>
  <swiper :options="hfOption" v-if="list&&list.length>0" class="homeflash">
    <!-- :style="'height:'+screenWidth+'px'" -->
    <swiper-slide v-for="(item,index) in list" :key="item.id" class="home_flash">
      <!-- :style="'height:'+screenWidth+'px'" -->
      <div @click="goFlash(item,index)">
        <img :src="item.picurl|https" :alt="item.name" ref="imgs" class="slideImg">
      </div>
      <!-- <template v-if="item.outside">
        <a :href="item.url">
          <img :src="item.picurl|https" :alt="item.name" class="slideImg" ref="imgs">
        </a>
      </template>
      <template v-else>
        <div @click="goFlash(item)">
          <img :src="item.picurl|https" :alt="item.name" ref="imgs" class="slideImg">
        </div>
      </template> -->
    </swiper-slide>
    <!--<div class="swiper-pagination" slot="pagination"></div>-->
    <div class="swiper-scrollbar bar" slot="scrollbar"></div>

  </swiper>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'home-flash',
  props: { flash: { default: [] }, qzone: { type: Boolean, default: false }},
  data() {
    return {
      hfOption: {
        autoplay: 2200,
        autoplayDisableOnInteraction: false,
        roundLengths: true,
        updateOnImagesReady: true,
        scrollbar: '.swiper-scrollbar',
        scrollbarHide: false,
        onInit: this.slideChange,
        onSlideChangeEnd: this.slideChange
        // scrollbarDraggable: true,
        // scrollbarSnapOnRelease: true
      } // ,
      // screenWidth: ''
    }
  },
  mounted() {
    // this.screenWidth = screen.width * 0.8
    this.setImg()
  },
  computed: {
    list() {
      // 轮播类型(店铺0 品牌1 分类2 产品详情3 资讯详情4 资讯搜索5 自定义专题6 鬼市7 潮店8 限量9 品牌库10 球鞋榜11 平台大促12 球鞋搜索13)
      // 资讯类型（0 综合、1图集、2视频）
      let list = this.flash
      if (list && list.length > 0) {
        list = list.map(i => {
          i.url = this.getUrl(i.type, i.articletype, i.contentid, i.channel)
          i.outside = false
          if (i.type == 6) i.outside = true
          return i
        })
        // if (this.qzone) list = list.filter(i => i.id !== '684e2b28993c4b22bdd455fc5145f4b7')
      }
      return list
    },
    ...mapGetters({
      searchOption: 'searchOption'
    })
  },
  methods: {
    slideChange(swiper) {
      let H = swiper.height
      let rect = swiper.container[0].getBoundingClientRect()
      if (rect.y <= 0 && H / 5 >= Math.abs(rect.y)) {
        let idx = swiper.activeIndex
        let item = this.list[idx]


      }
    },
    getUrl(type, articletype, data ,channel) {
      // channel: 1--B2C    2--C2C
      let url = ''
      switch (type) {
        case 0:
          url = '/shop/shopdetail/' + data
          break
        case 1:
          url = '/mall/search/'
          break
        case 2:
          url = '/mall/search/'
          break
        case 3:
          // url = '/productDetail/' + data
          if (channel == 1) {
            url = '/productDetail/' + data
          } else if (channel == 2) {
            url = "/sneaker/detail/" + data;
          }
          break
        case 4:
          url = '/news/detail/' + data
          break
        case 5:
          url = '/news/search/' + data
          break
        case 7:
          url = '/mall/ghost'
          break
        case 8:
          url = '/mall/shop'
          break
        case 9:
          url = '/mall/limit'
          break
        case 10:
          url = '/brand'
          break
        case 11:
          url = '/shoe'
          break
        case 12:
          url = '/platformActivity/' + data
          break
        case 13:
          url = "/sneaker/search/" + data;
          break;
        
      }
      if (url == '') url = data
      return url
    },
    goSearch(data) {
      let path = '/mall/search'
      var set = {}
      if (data.type == 1 && data.channel == 1) {
        path = path + '?brandid=' + data.contentid
        set.brandid = data.contentid
      }
      if (data.type == 2) {
        path = path + '?categoryid=' + data.contentid
        set.categoryid = data.contentid
      }
      if (data.type == 1 && data.channel == 2) {
        path = "/sneaker/search";
        path = path + "?brandid=" + data.contentid;
        set.brandid = data.contentid;
      }
      this.$store.dispatch('confirOption', { data: set })
      // this.$router.push('/mall/search')
      this.qzone ? this.qzoneGo(path) : this.$router.push(path)
    },
    goFlash(item, idx) {



      console.log('goFlash', item.url, item.outside)
      if (item.type == 1 || item.type == 2) this.goSearch(item)
      else {
        let match = item.url.match(/.*?eyee\.com\/active\/?/gi)
        if (match && match.length === 1) {
          item.outside = false
          item.url = '/active/' + item.url.replace(match[0], '')
        }
        item.url = item.url.replace(/http:\/\//, 'https://')
        // console.log(item.url, 'item.url===========--------------------------------')
        // this.$router.push(item.url)
        this.qzone ? this.qzoneGo(item.url) : item.outside ? window.open(item.url, '_self') : this.$router.push(item.url)
      }
    },
    setImg() {
      if (this.$refs.imgs) {
        var ig = this.$refs.imgs
        for (var i = 0; i < ig.length; i++) {
          var n = ig[i].naturalWidth / ig[i].naturalHeight
          if (n <= 1.7) {
            ig[i].style.width = '100%'
            ig[i].style.height = 'auto'
          } else {
            ig[i].style.width = 'auto'
            ig[i].style.height = '100%'
          }
        }
      }
    }
  }
}
</script>
<style scoped>
.homeflash {
  width: 100%;
  height: 80vw;
  background-color: #fff;
}
.homeflash .swiper-slide {
  overflow: hidden;
}
.slideImg {
  height: 100%;
  width: auto;
}
.home_flash > div {
  height: 100%;
  width: 100%;
}
</style>
