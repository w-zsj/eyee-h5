<template>
  <div class="SimilProduct">
    <v-header v-if="!$root.ISAPP" style="border-bottom: 1px solid #f2f2f2">
      <div class="nav-tab">{{same.name}}</div>
      <div style="width: 60px;height: 60px"></div>
    </v-header>
    <div class="Product" :class="cancelfixed" v-if="ProdInfo&&ProdInfo.id" ref="Product">
      <!--相似单品-->
      <product-unit :productItem="ProdInfo" :productType="9"></product-unit>
      <p class="title">我们为您找到以下相似宝贝</p>
    </div>
    <div class="SimilProductList">
      <v-list :load-handle='loadNews' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd' class="prodAlls">
        <div class="wait-list-dbl" v-if="listgetting==0"></div>
        <template v-if="listgetting==1">
          <product-unit :productItem="sm" :productType="12" v-for="sm in SameProduct" :key="sm.id" class="productList"></product-unit>
        </template>
        <div class="no_product" v-else></div>
      </v-list>
    </div>
  </div>
</template>
<script>
import ProductUnit from '../templates/ProductUnit.vue'
import { SearchSame } from '../../common/api/product'

export default {
  data() {
    return {
      same: { name: '相似潮品' },
      ProdInfo: null,
      cancelfixed: 'cancelfixed',
      SameProduct: [],
      isEnd: false, // 结束状态
      isLoading: false, // 加载状态
      pageData: { sumcount: 0, pagesize: 0, pageindex: 1 },
      // hasdata: 0, // 是否有数据
      listgetting: 0,
      postData: { pageindex: 1, ProductId: null } // 请求的参数对象
    }
  },
  components: { ProductUnit },
  mounted() {
    this.req()
    if (window.INSQ) {
      this.cancelfixed = 'cancelfixed'
    } else {
      this.cancelfixed = ''
    }
  },
  methods: {
    loadNews() {
      this.listgetting = 0
      console.log('loadNews')
      // this.hasdata = 0
      this.SameProduct = []
      this.pageData.pageindex = 1
      this.req()
    },
    loadmore($el) {
      console.log('loadmore')
      if (this.isEnd === true) {
        this.toast('已无更多')
      } else {
        this.pageData.pageindex += 1
        this.req()
      }
    },
    req() {
      let page = this.pageData
      this.isLoading = true
      this.postData.pageindex = this.pageData.pageindex
      this.postData.ProductId = this.$route.params.id
      SearchSame(this.postData)
        .then(res => {
          if (res && res.list && res.list.length > 0) this.listgetting = 1
          else if (page.pageindex === 1) this.listgetting = 2
          // 拿到数据以后
          if (res) {
            if (res.sumcount === 0) {
              this.isEnd = false
              // this.hasdata = 0
            } else {
              // this.hasdata = 1
              if (res.pageindex > 0) page.pageindex = res.pageindex
              if (res.sumcount > -1) page.sumcount = res.sumcount
              if (res.pagesize > -1) page.pagesize = res.pagesize
              if (page.pageindex * page.pagesize >= page.sumcount) {
                this.isEnd = true
              }
              if (res.pageindex === 1) {
                this.SameProduct = res.list
                // this.ProdDetail.push(res.info)
                this.ProdInfo = res.info
              } else {
                this.SameProduct.push(...res.list)
              }
            }
          } else this.isEnd = true

          this.isLoading = false
        })
        .catch(e => {
          if (page.pageindex === 1) this.listgetting = 2
          console.error('SearchSame error', e)
          // this.hasdata = 2
          this.isLoading = false
        })
    }
  }
}
</script>
<style scoped>
.nav-tab {
  width: 100%;
  text-align: center;
  line-height: 48px;
  position: relative;
}
.Product {
  width: 100%;
  /* position: fixed; */
  position: sticky;
  z-index: 9;
  top: 47px;
  background: #ffffff;
}
.Product.cancelfixed{
  top: 0;
}
.Product .title {
  position: relative;
  width: 100%;
  font-size: 10px;
  color: #999999;
  font-family: PingFangSC-Regular;
  text-align: center;
  padding: 10px 0;
  border-top: 1px solid #f2f2f2;
}
.SimilProductList {
  width: 100%;
  padding: 0 10px;
  position: relative;
  /* margin-top: 210px; */
}
.SimilProductList .productList {
  width: 48%;
  box-sizing: border-box;
  display: inline-block;
  text-align: center;
}
.SimilProductList .productList.productItem:nth-child(2n + 1) {
  /*border: 1px solid #fff557;*/
}
.SimilProductList .productList.productItem:nth-child(2n + 2) {
  /*border: 1px solid red;*/
  margin-left: 4%;
}
</style>
