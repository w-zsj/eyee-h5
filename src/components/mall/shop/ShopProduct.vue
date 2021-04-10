<!-- 20180317 标记 弃用的 -->
<template>
    <div class="shop_product" :class="{marginBab:$parent.isShowNavi}">
        <div class="shop_content" v-show="!$parent.isShowNavi">
            <div class="flex-center top_btns">
                <v-back></v-back>
                <div class="nav-tab2"></div>
                <v-cart :isshow="true" :isdark="false"></v-cart>
            </div>
            <div class="shop_logo">
                <img :src="$parent.shopInfos.logourl|https">
                <span @click="gotoSummary()">ABOUT US</span>
            </div>
            <div class="shop_from">
                <p>
                    {{$parent.shopInfos.name}}
                    <em @click.stop.prevent="loadApp"></em>
                </p>
                <p>
                    <img :src="$parent.shopInfos.flag|https">{{$parent.shopInfos.country}}
                </p>
            </div>
            <div class="shop_recomd" v-if="$parent.recomdLength>0">
                <p>店长推荐</p>
                <swiper :options="swiperProds" class="swiper-container swiperProds">
                    <swiper-slide v-for="(item,index) in $parent.recomdProdsList" :key='index'>
                        <ProductUnit :productItem='item'></ProductUnit>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
        <div class="tab_sorttype clearfix" :class="{fixBab:$parent.isShowNavi}">
            <label v-for="(sort,index) in sorttypes" :key="index" :class="{'clicked':sort.selected}" @click="selectSort(sort,index)">
	            <span>{{sort.name}}</span>
	        </label>
            <label v-for="(item,indexP) in sortPrice" :key="indexP" :class="{'clicked':item.selected}" @click="selectPrice(item)">
                <span class="arrow_span" :class="{'e-down':!item.updown,'e-up':item.updown}">{{item.name}}</span>
            </label>
            <p class="item_nums">
                <span>{{sumAlls}}</span>&nbsp;&nbsp;ITEMS
                <span class="filter_btn">筛选</span>
            </p>
        </div>
        <div class="shop_prodlist">
            <v-list :load-handle='downLoad' v-if="prodlists&&prodlists.length>0" :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
                <ProductUnit v-for="item in prodlists" :key="item.id" :productItem='item'></ProductUnit>
            </v-list>
            <div v-if="!isLoading&&prodlists.length<1" class="no_product"></div>
        </div>
    </div>
</template>
<script>
    import * as api from '../../../common/api/business'
import ProductUnit from '../../templates/ProductUnit'
import { mapGetters } from 'vuex'
export default {
      data() {
        return {
          businessId: '',
          distanceToTop: null,
          prodlists: [],
          sumAlls: 0,
          swiperProds: {
            slidesPerView: 2.5,
            freeMode: true,
            // slideToClickedSlide: true,
            lazyLoading: true,
            spaceBetween: 10
          },
          shopSums: [],
          sorttypes: [
            { 'sorttype': 1, 'name': '人气', 'updown': false, 'selected': true },
            { 'sorttype': 2, 'name': '销量', 'updown': false, 'selected': false },
            { 'sorttype': 0, 'name': '新品', 'updown': false, 'selected': false }
          ],
          sortPrice: [
            { 'sorttype': 3, 'name': '价格', 'updown': false, 'selected': false }
          ],
          isEnd: false,
          isLoading: false,
          pagedata: { businessid: this.$route.params.id, pageindex: 1, sorttype: 0, ordertype: 0 },
          pagelist: { sumcount: 0, pagesize: 0 },
          activeIndex: 0
        }
      },
      computed: {
        ...mapGetters({ shopSummary: 'shopSummary', shopSumDesc: 'shopSumDesc' })
      },
      mounted() {
        this.initShare({ type: 1, info: { ...this.$parent.shareData }})
        this.businessId = this.$route.params.id
        this.req()
  },
      components: { ProductUnit },
      methods: {
        selectSort(sort, index) {
          if (this.$parent.isShowNavi) {
            window.scrollTo(0, 0)
          }
          // 排序
          this.pagedata.sorttype = sort.sorttype
          if (this.activeIndex != index) {
            this.reload()
          }
          this.activeIndex = index

          // 高亮所选排序type
          this.sortPrice = this.sortPrice.map((data) => {
            data.selected = false
            return data
          })
          this.sorttypes = this.sorttypes.map((data) => {
            data.selected = false
            return data
          })
          this.sorttypes[index].selected = true
        },
        selectPrice(sort) {
          this.pagedata.sorttype = sort.sorttype
          // 图标切换
          if (this.activeIndex == 3) {
            sort.updown = !sort.updown
          } else {
            sort.updown = false
          }
          this.activeIndex = 3
          // 排序规则切换
          this.pagedata.ordertype = sort.updown ? 1 : 0
          // 高亮所选排序type
          this.sorttypes = this.sorttypes.map((data) => {
            data.selected = false
            return data
          })
          this.sortPrice[0].selected = true
          this.reload()
        },
        reload($el) {
          this.$parent.$el.children[1].style.height = 'auto'
          this.pagedata.pageindex = 1
          this.hasdata = 2
          this.req()
        },
        downLoad() {
          this.$parent.$el.children[1].style.height = 'auto'
          this.$store.dispatch('setShopFixedMenu', false)
          this.$store.dispatch('setShopTopNavi', false)
          this.pagedata.pageindex = 1
          this.hasdata = 2
          this.req()
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
          this.isLoading = true
          let page = this.pagedata
          let resuPage = this.pagelist
          // console.log('提交的参数', page)
          api.SearchProduct(page).then(res => {
            console.log(res)
            if (res) {
              this.sumAlls = res.sumcount
              if (res.pageindex == 1) this.prodlists = res.list
              else this.prodlists.push(...res.list)
              if (res.pageindex > 0) page.pageindex = res.pageindex
              if (res.sumcount > -1) resuPage.sumcount = res.sumcount
              if (res.pagesize > -1) resuPage.pagesize = res.pagesize
              if (page.pageindex * resuPage.pagesize >= resuPage.sumcount) this.isEnd = true
              this.hasdata = 1
            } else this.toast('没有相关商品')
            this.isLoading = false
          }).catch(e => {
            this.hasdata = 2
            this.isLoading = false
            this.toast(e && e.msg ? e.msg : ('error:' + e))
          })
    },
        gotoSummary() {
          console.log('summary', this.$parent.shopInfos.name)
          this.shopSums[0] = this.$parent.shopDesc
          this.shopSums[1] = this.$parent.shopInfos.name
          this.shopSums[2] = this.$parent.shopInfos.logourl
          this.$store.dispatch('setShopSummary', this.$parent.slidePics)
          this.$store.dispatch('setShopSumDesc', this.shopSums)
          this.$router.push('/shop/shopsummary')
        }
      }
    }

</script>
<style scoped>
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
        z-index: 1;
        width: 100%;
        height: 40px;
        top: 0;
        left: 0;
    }
    .shopDetail .shop_logo{
        position: relative;
    }
    .shopDetail .shop_logo img {
        display: block;
    }
    .shopDetail .shop_logo>span{
        position: absolute;
        right: 10px;
        bottom: 10px;
        font-size: 11px;
        display: inline-block;
        padding: 5px 8px;
        background: rgba(0,0,0,.5);
        border-radius:56px;
        color: #fff;
        height:22px;
    }
    .shopDetail .shop_from>p:first-child {
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

    .shopDetail .shop_from>p:first-child em {
        display: inline-block;
        position: absolute;
        right: 0;
        top: 0;
        width: 28px;
        height: 24px;
        margin-top: 12px;
        margin-right: 10px;
        background: url('//files.eyee.com/mcdn/static/img/fav.png') no-repeat;
        background-size: 100%;
    }

    .shopDetail .shop_from>p:last-child {
        padding: 0 10px 0;
        margin-bottom: 20px;
        height: 20px;
        line-height: 20px;
    }

    .shopDetail .shop_from img {
        display: inline-block;
        width: 25px;
        vertical-align: middle;
        margin-right: 5px;
    }

    .shopDetail .shop_recomd {
        border-top: 1px solid #f2f2f2;
        padding: 10px;
    }

    .shopDetail .shop_recomd>p {
        color: #333;
        font-size: .875rem;
        padding: 10px 0px;
        font-weight: 600;
    }

    .shop_product .tab_sorttype {
        padding: 0 10px;
        border-top: 1px solid #f2f2f2;
        height: 40px;
        line-height: 40px;
        font-size: .75rem;
        color: #999;
    }

    .shop_product.fixedMenu .tab_sorttype {
        position: fixed;
        width: 100%;
        top: 48px;
        background: #fff;
        z-index: 9;
    }

    .shop_product .tab_sorttype>label {
        position: relative;
        display: block;
        float: left;
        padding: 0 5px;
    }
    .shop_product .item_nums{
        float: right;
    }
    .filter_btn {
        display: inline-block;
    }
    /*.shop_product .tab_sorttype span:before {
        content: '';
        position: absolute;
        display: inline-block;
        color: transparent;
        z-index: 1;
        bottom: 3px;
        left: 28px;
        width: 0;
        height: 0;
        border-left: 2px solid transparent;
        border-right: 2px solid transparent;
        border-top: 6px solid #999;
    }*/
    .shop_product .tab_sorttype label .arrow_span:before {
        content: '';
        position: absolute;
        content: '';
        display: inline-block;
        width: 5px;
        height: 5px;
        border-bottom: 1px solid #999;
        border-left: 1px solid #999;
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
        left: 105%;
        top: 47%;
      }
      .shop_product .tab_sorttype label .arrow_span:after {
        content: '';
        position: absolute;
         content: '';
        display: inline-block;
        width: 5px;
        height: 5px;
        border-top: 1px solid #999;
        border-right: 1px solid #999;
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
        left: 105%;
        top: 37%;
      }
    .shop_product .tab_sorttype>label.clicked {
        color: #000;
    }

    .shop_product .tab_sorttype>label.clicked span.e-down:before {
        border-color: #000;
    }
    .shop_product .tab_sorttype>label.clicked span.e-up:after {
        /*border-top: none;
        border-bottom: 6px solid #000;
        bottom: 4.5px;*/
        border-color: #000;
    }

    .shop_product .shop_prodlist {
        padding: 0 5px;
    }

    .shop_product .shop_prodlist .productItem {
        float: left;
        width: 50%;
        padding: 5px;
    }

    .shop_product.fixedMenu .shop_prodlist {
        padding-top: 48px;
    }
    .fixBab{
        position: fixed;
        top: 48px;
        z-index: 9;
        background: #fff;
        width: 100%;
    }
    .marginBab{
        margin-top: 90px;
    }
</style>
