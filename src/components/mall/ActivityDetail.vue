<template>
  <div class="activity_page">
    <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3>{{activityInfo.name||'活动'}}</h3>
      </div>
      <!-- <v-cart></v-cart> -->
    </v-header>
    <div class="slide_all" v-if="platInfos.length>0">
      <!--侧滑动-->
      <SlideAll :activities="platInfos" ref="slideBtn" ></SlideAll>
    </div>
    <div class="firstPurchase main" id="main" :style="{backgroundColor:activityInfo&&activityInfo.bgcolor||'#fff'}" v-if="activityInfo.id">
      <div v-if="hasdata==0"></div>
      <div v-else-if="hasdata ==1 ">
        <!-- <v-list :load-handle='reload' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd' > -->
          <div class="prod_disc clearfix">
            <div class="logourl">
              <img width="100%" v-lazy="https(activityInfo.logourl)" alt="">
            </div>
            <div class="HotRankWrap">
              <swiper :options="HotRanking" ref=''>
                <swiper-slide v-for="(item,index) in hotProducts" :key="index">
                  <label class="label_topten">
                    <span class="font-price">Top {{index+1}}</span></label>
                  <ProductUnit class="HotRankingList" :key='index' :productType="4" :productItem='item' :activityImg = "activityIsBegin?activityInfo.processicon:activityInfo.forecasticon"></ProductUnit>
                </swiper-slide>
              </swiper>
            </div>
            <ul class="shop_lists clearfix">
              <li v-for="(sl,ind) in recomdShop" :key="ind">
                <ShopUnit :shopInfo="sl" :showType = '2' class="shop_box"></ShopUnit>
              <!--  <img :src="sl.img" alt="">
                <span class="cover_img"></span> -->
                <!-- <span>{{sl.name}}</span> -->
              </li>
            </ul>
            <div class="ProductWrap">
              <!--筛选列表-->
              <product-search-list :styleType='3'></product-search-list>
              <!-- <ProductUnit v-for="(item,index) in discountList" :key='index' :productItem='item' class="productList" :activityImg = "activityIsBegin?activityInfo.processicon:activityInfo.forecasticon" ></ProductUnit> -->
            </div>
          </div>
        <!-- </v-list> -->
      </div>
      <div v-else class="no-data">
        <img src="//files.eyee.com/mcdn/static/img/no_product.png" alt="">
        <p>活动已结束</p>
      </div>
    </div>
  </div>
</template>
<script>
import { GetPlatformActivity, PlatformActivitySearch } from '../../common/api/marketing'// , GetPlatformActivityProduct
import ProductUnit from '../templates/ProductUnit'
import { IsBegining, DateBetween } from '../../common/util'
import SlideAll from '../templates/slideAll'
import ShopUnit from '../templates/shopUnit'
import productSearchList from '../templates/ProductSearchList.vue'
export default {
  data() {
    return {
      activityInfo: {},
      platInfos: [],
      hotProducts: [],
      recomdShop: [],
      activityIsBegin: false,
      discountList: [],
      hasdata: 0,
      isEnd: false, // 加载更多专用字段
      isLoading: false, // 加载更多专用
      pagedata: { sumcount: 0, pagesize: 0, pageindex: 1 }, // 加载更多专用
      HotRanking: {
        freeMode: true,
        // loopedSlides: 1, // looped slides should be the same
        direction: 'horizontal',
        spaceBetween: 10, // 间距
        slidesPerView: 2.5, // 显示
        touchRatio: 0.6, // 触摸滑动比例
        preloadImages: false, // 加载图片
        // slideToClickedSlide: true,
        preventClicks: false // 滑动不跳转
      }
    }
  },
  mounted() {
    // this.closeSlide()
    this.getPlatformActivity()
    // if (!(this.discountList && this.discountList.length >= 0)) {
    //   this.hasdata = 1
    // }
  },
  methods: {
    getPlatformActivity() {
      GetPlatformActivity({ ActivityId: this.$route.params.id })
        .then(res => {
          if (res && res.info) {
            this.hasdata = 1
            this.req()

            console.log('activity info', res)
            if (res.share) {
              this.initShare({
                type: 1,
                info: {
                  title: res.share.title,
                  img: res.share.icon,
                  desc: res.share.content
                }
              })
            }

            this.activityInfo = res.info
            if (res.info.endtime) {
              this.activityIsBegin = DateBetween({
                begin: res.info.begintime,
                end: res.info.endtime
              })
            } else {
              this.activityIsBegin = IsBegining({ begin: res.info.begintime })
            }
            console.log(this.activityIsBegin, res.info.begintime)
            this.platInfos = res.activitylist || []
            this.recomdShop = res.shops
            var topTens = res.hotproducts
            for (let i = 0; i < topTens.length; i++) {
              if (this.activityIsBegin) {
                topTens[i].salestatus = 1
              } else {
                topTens[i].salestatus = 2
                // topTens[i].platformactivityicon = res.info.forecasticon
              }
            }
            this.hotProducts = topTens
          } else this.hasdata = 2
        })
        .catch(e => {
          this.hasdata = 2
          console.error('GetPlatformActivity error', e)
        })
    },
    reload($el) {
      this.hasdata = 0
      this.discountList = []
      this.pagedata.pageindex = 1
      this.isEnd = false
      this.getPlatformActivity()
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
      var page = this.pagedata
      this.isLoading = true
      page.pageindex = this.pagedata.pageindex
      PlatformActivitySearch({
        pageindex: page.pageindex,
        activityid: this.$route.params.id
      })
        .then(res => {
          if (res) {
            console.log('activity list', res.list)
            console.log(this.activityIsBegin)
            // for(let i=0;i<res.list.length;i++){
            //   if(this.activityIsBegin){
            //     res.list[i].salestatus = 1
            //   }else{
            //     res.list[i].salestatus = 2
            //   }
            // }
            if (res.sumcount == 0) {
              this.isEnd = false
            } else {
              if (res.pageindex > 0) page.pageindex = res.pageindex
              if (res.sumcount > -1) page.sumcount = res.sumcount
              if (res.pagesize > -1) page.pagesize = res.pagesize
              if (page.pageindex * page.pagesize >= page.sumcount) {
                this.isEnd = true
              }
            }
            if (res.pageindex == 1) this.discountList = res.list
            else this.discountList.push(...res.list)
          } else this.isEnd = true
          this.isLoading = false
        })
        .catch(e => {
          this.toast(e && e.msg ? e.msg : 'error:' + e)
        })
    }
  },
  components: {
    ProductUnit,
    SlideAll,
    ShopUnit,
    productSearchList
  },
  watch: {
    '$route.params.id': function (val, old) {
      console.log('watch prodId', val, old)
      if (this.$route.name === 'platform-activity' && val && val !== old) {
        this.activityInfo = {}
        this.pagedata.pageindex = 1
        this.discountList = []
        this.getPlatformActivity()
      }
    }
    // $route: 'getPlatformActivity'
  }
}
</script>
<style scoped>
.activity_page .mint-loadmore{
  background-color: unset;
}

.ProductWrap {
  /* width: 95%; */
  margin: 0 auto;
  /* padding: 10px; */
  border-radius: 4px;
  background: white;
  overflow: hidden;
}
.productList {
  width: 50%;
  box-sizing: border-box;
  display: inline-block;
  text-align: center;
}
.productList:nth-child(2n + 1) {
  padding: 0 6px 0 0;
}
.productList:nth-child(2n) {
  padding: 0 0 0 6px;
}
.HotRankWrap {
  padding: 10px 0 10px 10px;
}
.swiper-slide .label_topten {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0;
  width: 70px;
  height: 60px;
  z-index: 2;
  background: url(//files.eyee.com/mcdn/static/img/top_bgright.png) no-repeat center;
  background-size: cover;
  color: #ffc700;
  font-size: 0.75rem;
}
.swiper-slide .label_topten span {
  display: inline-block;
  width: 100%;
  height: 66px;
  line-height: 19px;
  text-align: center;
  text-align: center;
  transform: rotate(42deg);
}
.HotRankingList {
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  padding: 0 0 5px 0;
  box-shadow: 2px 2px 4px rgba(198, 217, 237, 0.4);
}
.shop_lists {
  padding: 0 5px;
}
.shop_lists li {
  position: relative;
  float: left;
  width: 50%;
  padding: 0 5px;
}
.shop_lists li > img {
  display: block;
  width: 100%;
  height: 100%;
}
.shop_lists li .cover_img {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
</style>
