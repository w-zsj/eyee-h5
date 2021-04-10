<template>
  <div class="find_home">
    <div class="brandIcon" :class="{'brandIconShow':!slideAll,'brandIconHide': slideAll}" @click.stop="gotoCate()" ref="brandIcon">
      <img :src="brandIcon" alt="" >
    </div>
    <div class="fixed_conds">
      <ClassifyFilter :largHeight="swiperLh" :smlHeight="swiperSh"></ClassifyFilter>
    </div>
    <!-- <FilterBar></FilterBar> -->
    <div class="findList clearfix" :style="{paddingTop:swiperLh+swiperSh+20+'px'}" @touchmove.stop="slidehide" @touchend.stop="slideshow">
      <v-list :load-handle='loadNews' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd' class="prodAlls" v-if='productLists&&productLists.length>0'>
       <!--  <div class="bg_ff" v-show="bannerList&&bannerList.length>0&&listType">
          <swiper :options="hfOption" :style="'height:'+(screenWidth/2)+'px'" class="mallSw">
            <swiper-slide v-for="item in bannerList" :key="item.id">
              <a :href="item.link" :target="item.target">
                <img :src="item.picurl" :alt="item.name">
              </a>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div> -->
        <ProductUnit v-for="(item,index) in productLists" :key='index' :productItem='item' class="productList" :isFindSim="1"></ProductUnit>
      </v-list>
      <div v-else class="wait-list-tpl"></div>
    </div>
    <div class="no_product" v-if='hasdata==0'>
    </div>
  </div>
</template>
<script>
import { ProdCategorySearch } from '../../common/api/product'
import ProductUnit from '../templates/ProductUnit'
import { mapGetters } from 'vuex'
import { ENUM } from '../../common/util'
// import HomeFlash from '../templates/HomeFlash'
// import FilterBar from '../templates/FilterBar'
import ClassifyFilter from '../templates/ClassifyFilter'
export default {
  data() {
    return {
      categoryid: '',
      //        scrollWatch: true,
      brandIcon: '//files.eyee.com/mcdn/static/img/allCates.png', // require('../../assets/img/allCates.png'),
      isEnd: false,
      isLoading: false,
      productList: [],
      info: {},
      pagedata: { sumcount: 0, pagesize: 18, pageindex: 1 },
      postData: { issearchall: 1, pageindex: 1 }, // issearchall:0有条件1是无条件
      hasdata: 1,
      hfOption: {
        autoplay: 1800,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        roundLengths: true
      },
      swiperLh: 60,
      swiperSh: 35,
      slideAll: true
    }
  },
  components: { ProductUnit, ClassifyFilter },
  mounted() {
    this.initShare({ type: 1 })
    this.swiperLh = document.documentElement.clientWidth * 180 / 1125
    // console.log(this.swiperLh,'tt')
    // if (!(this.productLists && this.productLists.length >= 20)) {
    //   this.hasdata = 1;
    //   this.req()
    // }
  },
  methods: {
    loadNews() {
      this.$store.state.product.productList = []
      this.pagedata.pageindex = 1
      this.isEnd = false
      this.req()
      // this.GetBtcBannerList()
    },
    loadmore($el) {
      if (this.isEnd === true) {
        this.toast('已无更多')
      } else {
        this.pagedata.pageindex += 1
        this.req()
      }
    },
    req() {
      if (this.isLoading) return
      var page = this.pagedata
      this.isLoading = true
      this.postData.pageindex = this.pagedata.pageindex
      this.postData.pagesize = this.pagedata.pagesize
      this.postData.categoryid = this.categoryid
      if (!this.categoryid) {
        return
      }
      if (this.postData.pageindex === 1) {
        this.isEnd = false
        window.scrollTo(0, 0)
      }
      ProdCategorySearch(this.postData)
        .then(res => {
          if (res) {
            console.log('mall home CategorySearch', res)

            this.info = res
            if (res.sumcount == 0) {
              this.isEnd = false
              this.hasdata = 0
            } else {
              this.hasdata = 1
              if (res.pageindex > 0) page.pageindex = res.pageindex
              if (res.sumcount > -1) page.sumcount = res.sumcount
              if (res.pagesize > -1) page.pagesize = res.pagesize
              if (page.pageindex * page.pagesize >= page.sumcount) this.isEnd = true
            }
            this.$store.dispatch('getProductList', res)
          } // else this.toast('加载完成')
          this.isLoading = false
        })
        .catch(e => {
          console.error(e)
          this.hasdata = 2
          this.isLoading = false
          // this.toast(e && e.msg ? e.msg : ('error:' + e));
        })
    },
    // changType() {
    //   this.listType = !this.listType
    // },
    goFilter() {
      this.$router.push('/shopFilter/' + ENUM.FilterType.mallHome.val)
    },
    // GetBtcBannerList() {
    //   ProdCategorySearch().then((res) => {
    //     if (res&&res.length>0) {
    //       for(var i=0;i<res.length;i++){
    //         if(res[i].link.indexOf('eyee.com')> 0){
    //           res[i].target='_self'
    //         }else{
    //           res[i].target='__blank'
    //         }
    //       }
    //       this.$store.dispatch('getBannerList', res)
    //     } else {
    //       // console.log('没有轮播数据')
    //     }
    //   }).catch((res) => {
    //     console.log(res)
    //   })
    // },
    gotoCate() {
      this.$router.push('/category')
    },
    slidehide() {
      this.slideAll = false
    },
    slideshow() {
      this.slideAll = true
    }
  },
  computed: {
    ...mapGetters({ productLists: 'productLists', homeOption: 'homeOption', bannerList: 'bannerList' })
    // listType() {
    //   return this.$store.state.product.listType
    // }
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
.findList {
  padding: 0px 10px;
}
.findList .prodAlls {
  background: #fff;
}
.fixed_conds {
  position: fixed;
  width: 100%;
  z-index: 9;
  background: #fff;
}

.productList {
  width: 33%;
  box-sizing: border-box;
  display: inline-block;
  /*margin: 2%;*/
  text-align: center;
}

.prodAlls .productList.productItem:nth-child(3n + 1) {
  padding: 0 4px 0 0;
}
.prodAlls .productList.productItem:nth-child(3n + 2) {
  padding: 0 2px;
}
.prodAlls .productList.productItem:nth-child(3n) {
  padding: 0 0 0 4px;
}
.mallSw {
  margin: 0 10px;
}

.mallSw a {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.mallSw a img {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
</style>
