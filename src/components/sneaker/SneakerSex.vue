<template>
  <div v-if="hasdata==0"></div>
  <div v-else-if="hasdata==1">
    <v-header :showback="false" :hasgap="false" class="flex-center sneak_h">
      <div class="nav-tab">
        <div class="flex-center">
          <div @click="goSex(0)" :class="{'nav-tab-act':ManFemale ==0}" tag="div">男鞋</div>
          <div @click="goSex(1)" :class="{'nav-tab-act':ManFemale == 1}" tag="div">女鞋</div>
        </div>
      </div>
      <router-link tag="div" class="seackBtn" :to="searchUrl">
        <img :src="sImg" alt="">
      </router-link>
    </v-header>

    <div class="sneak_slidemenu">
      <div class="top_sneak">
        <swiper :options="swiperSneakLogo" class="swiper-container sneak_logo">
          <swiper-slide v-for="(c,index) in cateList" :key='index'>
            <div class="free_label" :class="{'selected':c.brandid == currendId}">
              <img :src="c.logourl|https" @click="tabSneakBrand(c.brandid)">
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="sneak_cont">
      <swiper :options="sneakSlide" v-if="sneakCarousel&&sneakCarousel.length>0" class="swiper-container swiper-container-horizontal">
        <swiper-slide v-for="item in sneakCarousel" :key="item.shoeid">
          <div class="free_label" @click="gotoDetl(item.shoeid)">
            <img :src="item.imageurl|https" class="slideImg" ref="imgs">
          </div>
        </swiper-slide>
        <div class="swiper-scrollbar" slot="scrollbar"></div>
        <!-- <div class="swiper-pagination swiper-pagination-bullets" slot="pagination"></div> -->
      </swiper>
      <p class="sneak_title" v-if="sneakSets&&sneakSets.length>0">鞋款系列</p>
      <div class="sneak_series">
        <ul class="clearfix">
          <li v-for="(s,index) in sneakSets" :key="index">
            <img :src="s.coverurl|https" alt="" @click="gotoSeriesPage(s.seriesid)">
          </li>
        </ul>
      </div>
      <p class="sneak_title" v-if="list&&list.length>0">热卖推荐</p>
      <v-list :load-handle='reload' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
        <ul class="hots_list clearfix">
          <li v-for="(item,index) in list" :key="index">
            <ShoeUnit :sneakItem="item"></ShoeUnit>
          </li>
        </ul>
      </v-list>
    </div>
    <div class="hotSale" @click="goHotSale"><img width="40" height="52" :src="hotSolding" alt=""></div>
  </div>
  <v-error v-else></v-error>
</template>
<script>
import { ENUM } from '../../common/util' // , APP
import { ShoeGetTabs, ShoeSearch, ShoeTabPage } from '../../common/api/sneaker'
import ShoeUnit from '../templates/ShoeUnit'
// import { endWithGif } from '../../common/util'
import { mapGetters } from 'vuex'
export default {
  components: { ShoeUnit },
  data() {
    return {
      sImg: '//files.eyee.com/mcdn/static/img/search_h.png', // require('../../assets/img/search_h.png'),
      hotSolding: '//files.eyee.com/mcdn/static/img/sneaker/hotSolding.png', // require('../../assets/img/sneaker/hotSolding.png'),
      swiperSneakLogo: {
        slidesPerView: 'auto',
        freeMode: true,
        // slideToClickedSlide: true,
        spaceBetween: 20
      },
      sneakSlide: {
        autoplay: 1800,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        roundLengths: true,
        updateOnImagesReady: true,
        scrollbar: '.swiper-scrollbar',
        scrollbarHide: false
        // scrollbarDraggable: true,
        // scrollbarSnapOnRelease: true
      },
      currendId: '',
      categoryname: '男鞋',
      sneakCarousel: [],
      sneakSets: [],
      cateList: [],
      list: [],
      isEnd: false,
      isLoading: false,
      pagedata: { sumcount: 0, pagesize: 0, pageindex: 1, categoryname: '', brandid: '' },
      hasdata: 0,
      num: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 手Q潮物首页打开后从sneakHome转入兼容
      if (window.mqq && window.history.state) window.firstState = window.history.state
    })
    if (!this.sneakBrandCate.tabs) {
      this.sneakInfo()
    } else {
      let s = this.sneakBrandCate.share
      this.initShare({ type: s.type, info: { title: s.title, img: s.icon, desc: s.content }})
      this.cateList = this.sneakBrandCate.tabs[this.ManFemale].brands
    }
    this.currendId = this.$route.params.brandid
    this.sneakBrandInfos()
    this.setImg()
    this.reload()
    this.pointShoeNum()
  },
  computed: {
    ...mapGetters({ sneakBrandCate: 'sneakBrandCate' }),
    searchUrl() {
      return '/search/' + ENUM.SearchType.oldsneaker.val
    },
    ManFemale() {
      return this.$route.params.sexid
    },
    CateName() {
      return this.$route.params.sexid == 0 ? '男鞋' : '女鞋'
    },
    BrandId() {
      return this.$route.params.brandid
    }
  },
  methods: {
    sneakInfo() {
      ShoeGetTabs()
        .then(res => {
          if (res) {
            // console.log( res,'ShoeGetTabs--------------zsj')
            this.cateList = res.tabs[this.ManFemale].brands
            let s = res.share
            this.initShare({ type: s.type, info: { title: s.title, img: s.icon, desc: s.content }})
            this.$store.dispatch('setSneakBrandCate', res)
          }
        })
        .catch(e => {
          console.error('数据加载失败', e)
        })
    },
    sneakBrandInfos() {
      let that = this
      ShoeTabPage({ brandid: that.BrandId, categoryname: that.CateName })
        .then(res => {
          if (res) {
            that.hasdata = 1
            console.log('ShoeTabPage', res)
            that.sneakCarousel = res.carousel
            that.sneakSets = res.series
          } else {
            that.hasdata = 2
          }
        })
        .catch(e => {
          that.hasdata = 2
          console.error('数据加载失败', e)
        })
    },
    goSex(n) {
      console.log(n)
      if (n === 0) {
        this.categoryname = '男鞋'
      } else {
        this.categoryname = '女鞋'
      }
      this.cateList = this.sneakBrandCate.tabs[n].brands
      this.currendId = this.sneakBrandCate.tabs[n].brands[0].brandid
      this.$router.replace('/sneakerSex/' + n + '/' + this.sneakBrandCate.tabs[n].brands[0].brandid)
      this.sneakBrandInfos()
      this.reload()
    },
    tabSneakBrand(id) {
      console.log(id)
      this.currendId = id
      this.$router.push('/sneakerSex/' + this.ManFemale + '/' + id)
      this.sneakBrandInfos()
      this.reload()
    },
    gotoSeriesPage(id) {
      this.$router.push('/sneakerSeries/' + this.ManFemale + '/' + id)
    },
    goHotSale() {
      this.$router.push('/sneakerHotSale/' + this.ManFemale)
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
    },
    reload($el) {
      this.list = []
      this.pagedata.pageindex = 1
      this.isEnd = false
      this.req()
    },
    loadmore($el) {
      if (this.isEnd === true) {
        this.toast('已无更多')
      } else {
        this.pagedata.pageindex++
        this.req()
      }
    },
    req() {
      this.isLoading = true
      let page = this.pagedata
      page.categoryname = this.CateName
      page.brandid = this.BrandId
      //        console.log(page)
      ShoeSearch(page)
        .then(res => {
          console.log('SneakerSearch res', page, res)
          if (res && res.list && res.list.length > 0) {
            if (res.pageindex == 1) {
              this.list = res.list
            } else this.list.push(...res.list)
            if (res.pageindex > 0) {
              page.pageindex = res.pageindex
            }
            if (res.sumcount > -1) {
              page.sumcount = res.sumcount
            }
            if (res.pagesize > -1) {
              page.pagesize = res.pagesize
            }
            if (page.pageindex * page.pagesize >= page.sumcount) {
              this.isEnd = true
            }
          } else {
            this.toast('加载失败')
          }
          this.isLoading = false
        })
        .catch(e => {
          this.isLoading = false
          this.toast(e && e.msg ? e.msg : 'error:' + e)
        })
    },
    gotoDetl(id) {
      console.log(id)
      this.$router.push('/sneakerDetail/' + this.ManFemale + '&' + id)
      // this.$router.push('/sneakerDetail/' + id);
    },
    pointShoeNum() {
      return (this.num = this.$route.params.sexid)
    }
  }
}
</script>
<style scoped>
.hotSale {
  position: fixed;
  top: 45%;
  transform: translateY(-50%);
  right: 10px;
  z-index: 999;
}
.nav-tab {
  width: 60%;
  text-align: center;
  font-size: 14px;
  display: flex;
}

.nav-tab > div {
  width: 80%;
  margin: auto;
  color: #fff;
  border: 1px solid #fff;
  overflow: hidden;
  border-radius: 5px;
}

.nav-tab > div div {
  width: 50%;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  transition: all 0.2s cubic-bezier(0.6, -0.28, 0.735, 0.045);
}

.nav-tab-act {
  color: #333;
  background-color: #fff;
}

.nav-top-light .nav-tab > div {
  color: #333;
  border: 1px solid #333;
}

.nav-top-light .nav-tab-act {
  color: #fff;
  font-weight: 600;
  background-color: #333;
}
.sneak_cont {
  margin-top: 94px;
}
.sneak_h {
  line-height: 48px;
  height: 48px;
}

.sneak_h p {
  font-weight: 600;
}

.seackBtn {
  position: absolute;
  right: 0;
  text-align: center;
  width: 60px;
}

.seackBtn img {
  vertical-align: middle;
  width: 20px;
}

.sneak_slidemenu {
  position: relative;
  margin-top: 48px;
}

.sneak_slidemenu .top_sneak {
  position: fixed;
  background-color: #fff;
  width: 100%;
  top: 48px;
  z-index: 1;
}

.free_label.selected {
  border-bottom: 2px solid #333;
}

.sneak_title {
  position: relative;
  height: 20px;
  line-height: 20px;
  margin: 10px 0 20px;
  font-size: 0.875rem;
  color: #333;
  text-align: center;
  letter-spacing: 2px;
}

.sneak_title:after {
  content: '';
  position: absolute;
  height: 2px;
  background: #333;
  width: 24px;
  left: 50%;
  margin-left: -12px;
  bottom: -5px;
}

.sneak_series ul li {
  float: left;
  width: 50%;
  margin-bottom: 2px;
}

.sneak_series ul li img {
  display: block;
}

.sneak_series ul li:nth-child(2n + 1) {
  padding-right: 1px;
}

.sneak_series ul li:nth-child(2n) {
  padding-left: 1px;
}

.hots_list {
  padding: 0 4px;
}

.hots_list li {
  float: left;
  width: 33.33%;
  padding: 0 4px;
}
.sneak_logo .swiper-slide {
  width: 40px;
}
.sneakItem {
  margin-bottom: 15px;
}
</style>
