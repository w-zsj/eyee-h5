<template>
  <div class="classify_filter">
    <swiper :options="swiperBigs" ref="classisySwiper" class="swiperbig" >
      <swiper-slide v-for="item in categorys" :key='item.id' >
        <div class="bigSwiperImg" :style="{backgroundImage: 'url('+https( item.logourl) +')',height:largHeight+'px'}">
        </div>
      </swiper-slide>
      <!-- <div class="swiper-pagination" slot="pagination"></div> -->
      <div class="swiper-button-prev swiper-button-black" slot="button-prev"></div>
      <div class="swiper-button-next swiper-button-black" slot="button-next"></div>
    </swiper>
    <swiper :options="swiperSmall" ref='smallSwiper' class="swiperSmall">
      <swiper-slide v-for="(itemC,indexC) in childLists" :key='itemC.id'>
        <div class="swiperImg" :style="{backgroundImage: 'url('+https( itemC.logourl) +')',height:smlHeight+'px'}" @click="selectProds(itemC,indexC)" :class="{'choosen':choosenInd == indexC}">
          <!-- <p></p> -->
          <!-- <span>{{itemC.name}}</span> -->
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import * as api from '../../common/api/base'
export default {
  data() {
    return {
      category: [],
      childLists: [],
      choosenInd: -1,
      swiperBigs: {
        touchRatio: 0.8,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        // pagination: '.swiper-pagination',
        onSlideChangeStart: swiper => {
          this.onSlideChangeStart(swiper)
        }
      },
      swiperSmall: {
        freeMode: true,
        // loopedSlides: 1, // looped slides should be the same
        spaceBetween: 10,
        slidesPerView: 3.2,
        // touchRatio: 0.6,
        preloadImages: false // ,
        // slideToClickedSlide: true,
        // preventClicks: false
      }
    }
  },
  props: {
    largHeight: { type: Number, default: 160 },
    smlHeight: { type: Number, default: 60 }
  },
  computed: {
    ...mapGetters({ categorys: 'categorylist' }),
    bigSwiper() {
      return this.$refs.classisySwiper.swiper
    },
    smallSwiper() {
      return this.$refs.smallSwiper.swiper
    }
  },
  mounted() {
    let _ = this
    if (!(_.categorys && _.categorys.length > 0)) {
      _.getCategoty()
    } else {
      _.childLists = _.categorys[0].child
      _.$parent.categoryid = _.categorys[0].id
      _.$store.state.product.productList = []
      _.$parent.req()
    }
  },
  methods: {
    onSlideChangeStart(swiper) {
      this.choosenInd = -1
      // console.log(swiper.activeIndex);
      this.childLists = this.categorys[swiper.activeIndex].child
      this.$parent.categoryid = this.categorys[swiper.activeIndex].id
      this.$store.state.product.productList = []
      this.$parent.pagedata.pageindex = 1
      this.$parent.req()
    },
    selectProds(itemC, ind) {
      this.$parent.categoryid = itemC.id
      // console.log(itemC.id)
      this.$store.state.product.productList = []
      this.$parent.pagedata.pageindex = 1
      this.$parent.req()
      this.choosenInd = ind
    },
    getCategoty() {
      api
        .CategoryAll()
        .then(res => {
          // console.log('cateall', res)
          if (res) {
            for (var i = 0; i < res.length; i++) {
              if (res[i].haschildren == true) {
                this.category.push(res[i])
              }
            }
            for (var i = 0; i < this.category.length; i++) {
              if (this.category[i].id != null) {
                var id = this.category[i].id
                this.category[i].child = []
                for (var j = 0; j < res.length; j++) {
                  if (res.parentid == 0) {
                    continue
                  }
                  if (id == res[j].parentid) {
                    this.category[i].child.push(res[j])
                  }
                }
              }
            }
            // console.log(this.category)
            this.childLists = this.category[0].child
            // console.log(this.childLists[0].id, 'olllll')
            // console.log(this.$parent.categoryid, 'ppppppp')
            this.$parent.categoryid = this.category[0].id
            this.$parent.req()
            this.$store.dispatch('getCategory', this.category)
          } else {
            this.toast('加载失败')
          }
        })
        .catch(e => {
          console.error('加载失败', e)
          this.toast('加载失败')
        })
    }
  }
}
</script>
<style scoped>
.classify_filter {
  margin-bottom: 10px;
}
.swiperSmall {
  padding-left: 10px;
  margin-top: 10px;
}
.bigSwiperImg {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  /* transition: all .5s ; */
  background-color: #f4f4f6;
}
.swiperImg {
  position: relative;
  /*height: 60px;*/
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border-radius: 2px;
  border: 1px solid transparent;
  /* transition: border 0.3s; */
}
.swiper-button-prev,
.swiper-button-next {
  width: 13px;
  height: 22px;
  background-size: 13px 22px;
  margin-top: -11px;
}
.swiperImg.choosen {
  border-color: #ffc700;
}
/* .swiperImg p {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
} */
.swiperImg span {
  display: inline-block;
  position: absolute;
  width: 100%;
  text-align: center;
  left: 0;
  font-size: 11px;
  color: #fff;
  height: 20px;
  margin-top: -10px;
  top: 50%;
  z-index: 2;
}
</style>
