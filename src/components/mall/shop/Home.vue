<template>
  <div class="mall-shop">
    <div class="shop_filterList">
      <swiper :options="swiperFilters" class="swiper-container swiperProds">
        <swiper-slide v-for="(item,index) in category" :key='index'>
          <div class="swiperImg" :style="{backgroundImage: 'url('+https( item.logourl) +')'}" @click="selectProds(item,index)" :class="{'choosen':choosenInd == index}">
            <p></p>
            <!-- <span>{{item.name}}</span> -->
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <v-list :load-handle='reload' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd' class="shopListAlls">
      <div class="shop_list" v-for="(item,index) in list" :key="index" v-if="index<=n" ref="shopBox">
        <ShopUnit :shopInfo="item" class="shop_box" @click="gotoShopDetl(item.id)"></ShopUnit>
        <section class="six_prods clearfix">
          <ProductUnit v-for="prodShop in item.products" :key='prodShop.id' :productItem='prodShop' class="shopRecoLists" :productType="3" :isFindSim="1"></ProductUnit>
        </section>
      </div>
      <!--</v-delay>-->
    </v-list>
  </div>
  <!-- <v-error v-else></v-error> -->
</template>
<script>
import { mapGetters } from 'vuex'
import * as api from '../../../common/api/business'
import { CategoryAll } from '../../../common/api/base'
import ProductUnit from '../../templates/ProductUnit'
import ShopUnit from '../../templates/shopUnit'
export default {
  data() {
    return {
      category: [],
      hasdata: 0,
      list: [],
      isEnd: false,
      isLoading: false,
      pagedata: { sumcount: 0, pagesize: 0, pageindex: 1 },
      categoryid: '',
      n: 2,
      swiperFilters: {
        slidesPerView: 2.9,
        freeMode: true,
        // slideToClickedSlide: true,
        lazyLoading: true,
        spaceBetween: 10
      },
      choosenInd: 0
    }
  },
  computed: {
    ...mapGetters({ shops: 'getMallShopList', categoryList: 'categorylist' })
  },
  created() {
    window.addEventListener('scroll', this.setN)
  },
  mounted() {
    // 用于刷新店铺商品搜索
    this.$store.dispatch('resetOption', 3)
    this.$store.dispatch('resetOption', 1)
    this.$store.dispatch('getShopFilterData', [])
    this.initShare({ type: 1 })
    if (!(this.categorys && this.categorys.length > 0)) {
      this.getCategoty()
    } else {
      this.hasdata = 1
      this.categoryid = this.categorys[0].id
    }
  },
  components: { ProductUnit, ShopUnit },
  methods: {
    setN() {
      let wY = window.scrollY,
        shopHeight,
        shopBox = this.$refs.shopBox
      if (shopBox && shopBox.length > 0) {
        shopHeight = shopBox[0].clientHeight
      }
      let sH = (this.n - 1) * shopHeight
      if (wY > sH && wY < this.n * shopHeight) {
        this.n += 1
      }
    },
    reload($el) {
      this.hasdata = 0
      this.list = []
      this.pagedata.pageindex = 1
      this.req()
    },
    loadmore($el) {
      if (this.isEnd === true) {
        this.toast('已无更多')
      } else {
        if (this.n > 3) {
          this.pagedata.pageindex += 1
          this.req()
        }
      }
    },
    req() {
      this.isLoading = true
      let page = this.pagedata
      api
        .GetListByCategory({ CategoryId: this.categoryid, pageindex: page.pageindex })
        .then(res => {
          if (res) {
            console.log('GetListByCategory', res)
            if (res.list && res.list.length > 0) {
              this.hasdata = 1
              if (res.pageindex == 1) {
                this.list = res.list
              } else this.list.push(...res.list)
            }
            if (res.pageindex > 0) page.pageindex = res.pageindex
            if (res.sumcount > -1) page.sumcount = res.sumcount
            if (res.pagesize > -1) page.pagesize = res.pagesize
            if (page.pageindex * page.pagesize >= page.sumcount) this.isEnd = true
          } else this.toast('加载失败')
          this.isLoading = false
        })
        .catch(e => {
          this.hasdata = 2
          this.isLoading = false
          this.toast(e && e.msg ? e.msg : 'error:' + e)
        })
    },
    gotoShopDetl: function (id) {
      this.$router.push('/shop/shopdetail/' + id)
    },
    getCategoty() {
      CategoryAll()
        .then(res => {
          // console.log('cateall',res)
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
            console.log(this.category)
            this.categoryid = this.category[0].id

            this.req()
            this.$store.dispatch('getCategory', this.category)
          } else {
            this.toast('加载失败')
          }
        })
        .catch(err => {
          this.toast('加载失败')
        })
    },
    selectProds(item, index) {
      this.categoryid = item.id
      this.choosenInd = index
      this.reload()
    }
  },
  beforeDestroy() {
    let list = this.list.slice(0, this.pagedata.pagesize)
    this.$store.dispatch('setShopLists', list)
    window.removeEventListener('scroll', this.setN)
  }
}
</script>
<style scoped>
.shopListAlls {
  padding-top: 8px;
  background: #fff;
}
.mall-shop .shop_list {
  margin: 4px 8px 8px;
  padding-bottom: 10px;
  box-shadow: 0px 0px 7px 0px #e3e3e3;
  border-radius: 4px;
}
.mall-shop .shop_list:first-child {
  margin-top: 45px;
}
.six_prods {
  padding: 0 6px;
}
.shopRecoLists {
  float: left;
  width: 33.33%;
}
.shopRecoLists:nth-child(3n) {
  padding: 0 0 0 4px;
}
.shopRecoLists:nth-child(3n + 1) {
  padding: 0 4px 0 0;
}
.shopRecoLists:nth-child(3n + 2) {
  padding: 0 2px 0 2px;
}
.shop_filterList {
  position: fixed;
  width: 100%;
  height: 51px;
  background: #fff;
  padding: 8px 8px 0;
  z-index: 2;
}
.swiperImg {
  position: relative;
  height: 35px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border-radius: 2px;
  border: 1px solid transparent;
  transition: border 0.3s;
}
.swiperImg.choosen {
  border-color: #ffc700;
}
.swiperImg p {
  position: absolute;
  width: 100%;
  height: 100%;
  /*background: rgba(0,0,0,.2);*/
  z-index: 1;
}
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
