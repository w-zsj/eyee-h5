<template>
  <v-list v-if='list&&list.length>0' :load-handle='reload' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
    <div class="plist-dbl flex-wrap content">
      <ProductUnit :showimgTop = '1' v-for="item in list" :key='item.id' :productItem='item'></ProductUnit>
    </div>
  </v-list>
  <div v-else>
    <div class="no-data" v-if="!isLoading">
      <img src="//files.eyee.com/mcdn/static/img/no_product.png" alt="">
      <p>暂无相关商品</p>
    </div>
  </div>
</template>
<script>
import { DiscountProduct } from '../../../common/api/business'
import ProductUnit from '../../templates/ProductUnit'
export default {
  name: 'shop-discount',
  components: { ProductUnit },
  data() {
    return {
      isLoading: false,
      isEnd: false,
      list: [],
      pagedata: { sumcount: 0, pagesize: 10, pageindex: 1 }
    }
  },
  beforeMount() {
    this.req()
  },
  methods: {
    reload() {
      return false
    },
    loadmore() {
      let _ = this
      if (_.isEnd) _.toast('已无更多')
      else {
        _.pagedata.pageindex++
        _.req()
      }
    },
    req() {
      let _ = this
      _.isLoading = true
      let page = _.pagedata
      page.businessid = _.$route.params.id
      DiscountProduct(page)
        .then(res => {
          console.log('DiscountProduct res', res)

          if (res.pageindex === 1) _.list = res.list
          else _.list.push(...res.list)

          page.pageindex = res.pageindex
          page.sumcount = res.sumcount
          page.pagesize = res.pagesize
          if (page.pageindex * page.pagesize >= page.sumcount) _.isEnd = true
          _.isLoading = false
        })
        .catch(e => {
          console.error('shop DiscountProduct error', e)
          _.toast('数据加载失败：' + e.msg)
          _.isLoading = false
        })
    }
  }
}
</script>
<style scoped>
.content {
  width: 94%;
  margin: 1rem auto;
  background: #fff;
}
.productItem, .content{
  /* border-radius: 1rem */
}
</style>

