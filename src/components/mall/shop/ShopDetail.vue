<template>
    <div class="shopDetail"  :class="{marginTops:isFixedMenu&&!insq}">
        <v-header v-show="navshow&&!$root.ISAPP" :style="{'backgroundColor':'rgba(255,255,255,'+pregress+')'}">
            <div class="nav-tab2">
                <h3 v-show="showImage"><img :src="shopInfos.countryflag|https">{{shopInfos.businessname}}</h3>
            </div>
            <v-cart :isshow="true" ></v-cart>
        </v-header>
        <div class="shop_product">
            <div class="shop_content">
                <div v-show="!navshow" class="flex-center top_btns fixnav" :style="{'backgroundColor':'rgba(255,255,255,'+pregress+')'}">
                    <v-back></v-back>
                    <div class="nav-tab2"></div>
                    <v-cart :isshow="true" :isdark="false"></v-cart>
                </div>
                <div class="shop_logo">
                    <img :src="shopInfos.logourl|https">
                    <span class="img_bg"></span>
                    <span class="abut_us" @click="gotoSummary()">ABOUT US</span>
                </div>
                <div class="shop_from">
                    <p>
                        {{shopInfos.businessname}}
                        <em @click="favShop()" v-if="!insq" :class="{'ico-heart-col':!shopInfos.isfavor,'ico-heart-favor':shopInfos.isfavor,bs_animate:favShow}"></em>
                    </p>
                    <p class="flex-aic">
                        <img :src="shopInfos.countryflag|https">{{shopInfos.country}} <span class="mall_brandShop" :class="{'mall_buyers':shopInfos.type!=1}"  @click="showMadol()">{{shopInfos.type==1?"品牌商城店":"买手集合店"}}</span>
                    </p>
                </div>
                <div class="shop_conpons clearfix" v-if="shopCoupons">
                    <swiper :options="swiperConpons" class="swiper-container">
                        <swiper-slide v-for="(item,index) in shopCoupons" :key='index'>
                            <CouponUnit :cous="item" :divHeigh="40" ></CouponUnit>
                        </swiper-slide>
                    </swiper>
                </div>
                <div class="shop_recomd" v-if="newProductLists&&newProductLists.length>0">
                    <p>新品上架</p>
                    <Recomd-prods :recodsList='newProductLists' :showNum="3.5"></Recomd-prods>
                </div>
            </div>
            <div class="product_list">
              <ProductSearchList :styleType='1'> </ProductSearchList>
            </div>
        </div>
        <div @click.stop="fadeBack()" v-if="show" class="modalview">
            <transition name="fade">
                <span class="modalContent" v-if="recomend">{{shopInfos.type==1?"品牌商城店： 该店铺销售的商品均获得品牌方授权。":"买手集合店： 该店铺为买手式经营，精心为你挑选正品商品。"}}</span>
            </transition>
        </div>
    </div>
</template>
<script>
import { BusinessDetail } from '../../../common/api/business'
// import ShopSummary from './shopSummary'
import { mapGetters } from 'vuex'
import { APP } from '../../../common/util' // , ENUM
import RecomdProds from '../../templates/RecomdProds'
import CouponUnit from '../../templates/CouponUnit'
import ConditionList from '../../templates/ConditionList'
import { FavorBusiness } from '../../../common/api/userFavor'
import ProductSearchList from '../../templates/ProductSearchList'
export default {
  data() {
    return {
      scrollWatch: true,
      sumAlls: 0,
      prodlists: [],
      businessId: '',
      newProductLists: [],
      distanceToTop: '',
      tabDefault: 0,
      activeTab: 0,
      shopInfos: {},
      shopCoupons: [],
      slidePics: [],
      shopbgPic: '',
      shopSums: [],
      shopDesc: '',
      shareData: {},
      hasdata: 0,
      sorttypes: [
        { sorttype: 1, name: '人气', updown: false, selected: true },
        { sorttype: 2, name: '销量', updown: false, selected: false },
        { sorttype: 0, name: '新品', updown: false, selected: false }
      ],
      sortPrice: [{ sorttype: 3, name: '价格', updown: false, selected: false }],
      isEnd: false,
      isLoading: false,
      pagedata: { businessid: this.$route.params.id, pageindex: 1, sorttype: 1, ordertype: 0 },
      pagelist: { sumcount: 0, pagesize: 0 },
      activeIndex: 0,
      show: false,
      recomend: false,
      timer: '',
      swiperConpons: {
        slidesPerView: 2.5,
        freeMode: true,
        // slideToClickedSlide: true,
        lazyLoading: true,
        spaceBetween: 10
      },
      pregress: 0,
      showImage: false,
      navshow: false,
      favShow: false
    }
  },
  computed: {
    ...mapGetters({
      insq: 'insq',
      isShowNavi: 'shopTopNavi',
      isFixedMenu: 'shopFixed',
      isShopSearchPage: 'isShopSearchPage',
      shopSummary: 'shopSummary',
      shopSumDesc: 'shopSumDesc',
      shopOption: 'shopOption',
      filterType: 'filterType',
      localUserInfos: 'userInfo'
    })
    // localUserInfos() {
    //   return JSON.parse(localStorage.getItem('currentUser'))
    // }
  },
  components: { ProductSearchList, RecomdProds, ConditionList, CouponUnit },
  mounted() {
    this.$store.state.mall.isShopSearchPage = false
    // this.$store.dispatch('resetOption', 3)
    this.$store.dispatch('setFilteType', 3)
    this.$store.dispatch('setShopFixedMenu', false)
    this.$store.dispatch('setShopTopNavi', false)
    this.businessId = this.$route.params.id
    // 这个id是给shopfilter用的s
    this.$store.state.product.shopRouteId = this.$route.params.id
    this.getShopDetail()
    // window.addEventListener('scroll', () => {
    //   if (this.scrollWatch) {
    //     var scrollTop = window.scrollY
    //     // var fb = document.querySelector('.tab_sorttype').offsetTop;
    //     // if (document.documentElement && document.documentElement.scrollTop) {
    //     //   scrollTop = document.documentElement.scrollTop
    //     // } else if (document.body) {
    //     //   scrollTop = document.body.scrollTop
    //     // }
    //     var logo = document.querySelector('.shop_logo').clientHeight - 48
    //     var fx = document.querySelector('.shop_prodlist').offsetTop
    //     if (scrollTop < logo + 48) {
    //       if (scrollTop > logo / 2) {
    //         this.navshow = true
    //       } else if (scrollTop < logo / 2) {
    //         this.navshow = false
    //       }
    //       this.pregress = scrollTop / logo// 透明度
    //     }
    //     if (scrollTop > logo) {
    //       this.showImage = true
    //     } else {
    //       this.showImage = false
    //     };
    //     if (!this.isShowNavi) {
    //       if (scrollTop > (48)) {
    //         this.$store.dispatch('setShopTopNavi', true)
    //       }
    //     }
    //     if (this.isShowNavi) {
    //       if (scrollTop < (fx - 89)) {
    //         this.$store.dispatch('setShopTopNavi', false)
    //       }
    //     }
    //   }
    // })
  },
  destroyed() {
    this.scrollWatch = false
  },
  methods: {
    getShopDetail() {
      BusinessDetail({ businessid: this.businessId })
        .then(res => {
          console.log('detail', res)
          if (res) {
            this.hasdata = 1
            this.shopInfos = res.info
            if (res.coupons) {
              this.shopCoupons = res.coupons
            }
            if (res.newpublish) {
              this.newProductLists = res.newpublish
            }
            if (res.info.albums) {
              this.slidePics = res.info.albums.split('|')
            }
            this.shopSums[0] = res.info.desc
            this.shopSums[1] = res.info.businessname
            this.shopSums[2] = res.info.logourl
            this.shareData.title = res.info.businessname
            this.shareData.img = res.info.logourl
            this.shareData.desc = APP.shareData.shopDetail.desc
            this.initShare({ type: 1, info: { ...this.shareData }})
          } else {
            this.hasdata = 2
            this.toast('加载失败')
          }
        })
        .catch(err => {
          this.hasdata = 2
          this.toast('网络繁忙！')
          console.error('Get BusinessDetail error: ', err)
        })
    },
    gotoSummary() {
      console.log('summary', this.shopInfos, this.slidePics, this.shopSums)
      this.$store.dispatch('setShopSummary', this.slidePics)
      this.$store.dispatch('setShopSumDesc', this.shopSums)
      this.$router.push('/shop/shopsummary')
    },
    showMadol() {
      this.show = true
      setTimeout(() => {
        this.recomend = true
      }, 100)
      this.timer = setTimeout(() => {
        this.show = false
      }, 5000)
    },
    fadeBack() {
      clearTimeout(this.timer)
      this.recomend = false
      setTimeout(() => {
        this.show = !this.show
      }, 600)
    },
    favShop() {
      console.log(this.shopInfos)
      if (this.localUserInfos && this.localUserInfos.token) {
        var postData = {
          BusinessId: this.shopInfos.id,
          IsCancel: this.shopInfos.isfavor
        }
        var errormsg = ''
        FavorBusiness(postData)
          .then(res => {
            this.favShow = true
            setTimeout(() => {
              this.favShow = false
              this.shopInfos.isfavor = !this.shopInfos.isfavor
              if (this.shopInfos.isfavor) {
                errormsg = '收藏成功'
              }
              if (!this.shopInfos.isfavor) {
                errormsg = '取消收藏成功'
              }
              this.toast(errormsg)
            }, 500)
          })
          .catch(err => {
            console.log('err', err)
            this.toast(err.msg)
          })
      } else {
        // if (this.$root.ISWX) {
        //   this.$router.push('/wxlogin')
        // } else {
        //   this.$router.push('/login')
        // }
        this.$router.push('/login')
      }
    }
  },
  watch: {
    $router: 'getShopDetail'
  }
}
</script>
<style scoped>
.fixnav {
  position: fixed !important;
  background: rgba(255, 255, 255, 1);
}
.shopDetail {
  margin-top: 0 !important;
}
.shopDetail.marginTops {
  margin-top: 48px !important;
}
.shopDetail .shop_content {
  position: relative;
  height: 100%;
  -moz-transition: height 10s linear;
  -webkit-transition: height 10s linear;
  -o-transition: height 10s linear;
  transition: height 10s linear;
  overflow: hidden;
}
.shopDetail .shop_content .top_btns {
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 48px;
  top: 0;
  left: 0;
}
.shopDetail .shop_logo {
  position: relative;
}
.shopDetail .shop_logo img {
  display: block;
}
.shopDetail .shop_logo > span.img_bg {
  display: inline-block;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
  background: rgba(3, 3, 3, 0.4);
}
.shopDetail .shop_logo > span.abut_us {
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 11px;
  display: inline-block;
  padding: 5px 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 56px;
  color: #fff;
  height: 22px;
  z-index: 2;
}
.shopDetail .shop_from > p:first-child {
  position: relative;
  height: 45px;
  line-height: 45px;
  font-size: 1.5rem;
  color: #333;
  padding: 0 40px 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shopDetail .shop_from > p:first-child em {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0;
  margin-top: 12px;
  margin-right: 10px;
}

.shopDetail .shop_from > p:last-child {
  padding: 0 10px 0;
  margin-bottom: 20px;
  height: 20px;
  line-height: 20px;
}
.shopDetail .shop_from > p:nth-child(2) span,
.shopDetail .shop_from > p:nth-child(2) b {
  color: #fff;
}

.shopDetail .shop_from > p:nth-child(2) b {
  background: #666666;
  border-radius: 50%;
  padding: 2px;
  font-size: 11px;
  display: inline-block;
  width: 20px;
  height: 20px;
  text-align: center;
  vertical-align: middle;
  line-height: 19px;
  transform: scale(0.8);
}
.shopDetail .shop_from img {
  display: inline-block;
  width: 25px;
  vertical-align: middle;
  margin-right: 5px;
}

.shopDetail .shop_recomd {
  border-top: 1px solid #f2f2f2;
  padding: 10px 0;
}
.shopDetail .shop_recomd > p {
  color: #333;
  font-size: 0.875rem;
  padding: 10px;
  font-weight: 600;
}

.shop_product .item_nums {
  float: right;
}

.marginBab {
  margin-top: 90px;
}
.modalview {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modalContent {
  font-size: 11px;
  width: 240px;
  color: #fff;
  text-align: center;
  padding: 10px;
  z-index: 99;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter,
.fade-leave-to {
  transform: scale(0);
}
.ConditionList {
  float: left;
  width: 100%;
}
.shop_conpons {
  margin-bottom: 10px;
}
.shop_conpons .coupon_unit {
  float: none;
  width: 100%;
}
span.mall_brandShop {
  margin-left: 5px;
}
</style>
