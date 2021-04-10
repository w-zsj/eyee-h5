<template>
    <div class="brand_home" @touchmove.stop="slidehide" @touchend.stop="slideshow">
        <div>
            <template v-if="brandAlls&&brandAlls.length>0">
                <transition name='vb'>
                    <div v-if="!insq" class="brandIcon" @click.stop="Modal(1)" v-show="!showModal" :class="{'brandIconShow':!slideAll,'brandIconHide':slideAll}">
                        <img :src="brandIcon" alt="">
                    </div>
                </transition>
            </template>
            <v-delay class="brand_list" v-for="(brand,index) in brandAlls" :delay="index*10+30" :key="index">
                <div class="brand_img" @click="goSearch(brand)">
                    <img class="blur" :src="brand.coverurl|https" alt="">
                    <div class="flex-center">
                        <img v-lazy="https(brand.logourl)" alt="">
                        <span>{{brand.name}}</span>
                    </div>
                    <label class="top_ten" v-if='index<10'>
                        <span class="font-price">Top {{index+1}}</span>
                    </label>
                </div>
                <div class="brand_pro clearfix">
                    <ProductUnit v-for="item in brand.products" :key="item.id" :productItem='item' :productType="2" :isFindSim="1" class="productList"></ProductUnit>
                </div>
            </v-delay>
        </div>
        <transition name='fade' enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
            <div class="modalBox" v-show="showModal">
                <p @click.stop='Modal(0)'>×</p>
                <BrandAll :show="showModal"></BrandAll>
            </div>
        </transition>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { BrandHotSale } from '../../common/api/base'
import ProductUnit from './../templates/ProductUnit'
import BrandAll from './../templates/BrandAll'
// import { ENUM } from '../../common/util'

export default {
  data() {
    return {
      isover: false,
      brands: [],
      brandIcon: '//files.eyee.com/mcdn/static/img/allBrands.png', // require('../../assets/img/allBrands.png'),
      showModal: false,
      codes: [],
      slideAll: true
    }
  },
  components: { ProductUnit, BrandAll },
  mounted() {
    this.BrandList()
    // if (this.mallBrands.length === 0) {
    //   this.BrandAll()
    // }
    this.initShare({ type: 1 })
    // this.isover = false;
    // setTimeout(() => {
    //   if (!(this.brandAlls && this.brandAlls.length > 0)) {
    //     this.BrandList()
    //   }
    // }, 800)
  },
  methods: {
    BrandList() {
      BrandHotSale()
        .then(res => {
          if (res) {
            this.$store.dispatch('getBrandAll', res)
          } else {
            this.toast('网络繁忙')
          }
        })
        .catch(err => {
          console.log(err)
          this.toast('网络繁忙')
        })
    },
    goSearch(brand) {
      this.$router.push('/mall/search/' + brand.name.replace('%',' '))
      var set = {},
        brandkeyword = {}
      set.keyword = brand.name
      brandkeyword.isBrand = true
      brandkeyword.brandName = brand.name
      brandkeyword.brandId = brand.id
      this.$store.dispatch('setKeywordBrand', brandkeyword)
      // set.brandid = brand.id;
      // set.brandName = brand.name
      this.$store.dispatch('confirOption', { data: set })
    },
    Modal(type) {
      // type 1打开，0关闭
      this.showModal = !!type
    },
    slidehide() {
      this.slideAll = false
    },
    slideshow() {
      this.slideAll = true
    }
  },
  computed: {
    ...mapGetters({
      insq: 'insq',
      mallBrands: 'mallBrands',
      brandAlls: 'brandAlls'
    })
    // realBrands() {
    //     // let list = this.mallBrands;
    //     // if (list.length > 3 && !this.isover) {
    //     //     this.isover = true;
    //     //     this.brands = list.splice(0, 3);
    //     //     setTimeout(() => {
    //     //         this.brands.push(...list);
    //     //     }, 1000);
    //     // }
    //     return this.mallBrands;
    // },
  }
}
</script>
<style scoped>
.brandIconShow {
  transform: translate3d(14px, 0, 0);
  transition: all .2s;
}
.brandIconHide {
  transform: translate3d(0, 0, 0);
  transition: all .2s;
}
.vb-enter-active {
  transition: top 0.2s ease-in, right 0.3s linear;
  animation: dap-in-v 0.3s, dap-in-h 0.3s;
}

.vb-leave-active {
  transition: top 0.2s ease-out, right 0.3s linear;
  animation: dap-out-v 0.3s, dap-out-h 0.3s;
}

@keyframes dap-in-v {
  /*垂直*/
  0% {
    top: 50%;
    transform: translateY(-50%);
  }
  50% {
    top: 50px;
    transform: translateY(-50%);
  }
  100% {
    top: 75px;
  }
}

@keyframes dap-in-h {
  /*水平*/
  0% {
    right: 50%;
    transform: translateX(50%);
  }
  50% {
    transform: translateX(-50%);
  }
  100% {
    right: 10px;
  }
}

@keyframes dap-out-v {
  /*垂直*/
  0% {
    top: 75px;
  }
  50% {
    top: 50px;
    transform: translateY(-50%);
  }
  100% {
    top: 50%;
  }
}

@keyframes dap-out-h {
  /*水平*/
  0% {
    right: 10px;
  }
  50% {
    transform: translateX(50%);
  }
  100% {
    right: 50%;
    transform: translateX(50%);
  }
}

.zoomIn {
  animation-delay: 0.3s;
}
.brand_home{
  padding-top: 10px;
}
.brand_home .brand_img {
  position: relative;
  width: 100%;
  height: 130px;
  border-radius: 4px;
  overflow: hidden;
}

.brand_home .brand_img > img {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.brand_home .brand_img > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  flex-direction: column;
}

.brand_home .brand_img > div img {
  height: 60px;
  width: 60px;
  border-radius: 60px;
}
/*.brand_home .brand_img>img {
        display: block;
        position: absolute;
        left: 50%;
        margin-left: -30px;
        top: 50%;
        margin-top: -30px;
        height: 60px;
        width: 60px;
        border-radius: 100%;
    }*/

.brand_home .brand_img > div span {
  /*position: absolute;
        display: inline-block;
        width: 100%;
        text-align: center;
        bottom: 10px;*/
  font-size: 1.125rem;
  color: #ffffff;
  line-height: 2rem;
}

.brand_home .brand_pro {
  display: block;
  width: 100%;
  padding: 10px 5px;
}

.brand_home .brand_list {
  background: #ffffff;
  box-shadow: 0 2px 4px 2px rgba(202, 202, 202, 0.5);
  border-radius: 4px;
  margin: 0 10px 15px 10px;
  overflow: hidden;
}

.brand_home .brand_list .productList {
  padding: 5px;
  float: left;
  width: 33.33%;
}

.brand_home .top_ten {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: 70px;
  height: 60px;
  background-size: cover;
  z-index: 2;
  background: url(//files.eyee.com/mcdn/static/img/top_bg.png) no-repeat center;
  background-size: cover;
  color: #ffc700;
  font-size: 0.75rem;
}

.brand_home .top_ten > span {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 38px;
  text-align: center;
  transform: rotate(-42deg);
}

.blur {
  filter: blur(2px);
}

.modalBox {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  z-index: 200;
}

.modalBox p {
  color: #eee;
  position: absolute;
  right: 0;
  text-align: center;
  font-size: 2rem;
  width: 80px;
  height: 50px;
  line-height: 60px;
  z-index: 1;
}
</style>
