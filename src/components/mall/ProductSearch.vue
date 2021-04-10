<template>
  <div>
    <v-header :showback='false'>
      <div class="sc-input flex-center" @click.stop.prevent="goSearch">
        <input type="text" placeholder="Search" :value="key" readonly>
        <img class="ico-search" :src="sImg" alt="">
      </div>
      <div class="sc-cancel" @click.stop.prevent="goBack">
        <span>取消</span>
      </div>
    </v-header>
    <div class="product_list">
      <ProductSearchList :keywordP='keywordValue' :brandIntroduction='brandIntroduction' :mallnewType='2'> </ProductSearchList>
    </div>
  </div>
</template>
<script>
import ProductSearchList from '../templates/ProductSearchList'
import { ENUM } from '../../common/util'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      key: '',
      keywordValue: '',
      brandIntroduction: true,
      sImg: '//files.eyee.com/mcdn/static/img/search_gray.png' // require('../../assets/img/search_gray.png')
    }
  },
  components: { ProductSearchList },
  beforeMount() {
    let param = this.$route.params
    let query = this.$route.query
    console.log('==========', this.searchOption)
    // if (window.mqq && (param.key || query.brandid || query.categoryid) && !this.searchOption.brandid && !this.searchOption.categoryid && !this.searchOption.keyword) {
    if ((param.key || query.brandid || query.categoryid) && !this.searchOption.brandid && !this.searchOption.categoryid && !this.searchOption.keyword) {
      this.$store.dispatch('confirOption', { data: { keyword: param.key, brandid: query.brandid, categoryid: query.categoryid }})
    }
  },
  mounted() {
    this.initShare({ type: 1 })
    this.initKey()
  },
  methods: {
    initKey() {
      var key = this.$route.params.key
      // console.log(this.$route.params.key)
      var set = this.searchOption
      // console.log('diao_______searchaaaaaaaaaaOption', this.searchOption)
      if (key) {
        this.key = key
        this.keywordValue = key
        // 重置的时候 key=''
        if (!set.keyword && set.brandName == '全部' && set.categoryName == '全部' && set.sizeName == '全部') {
          this.key = ''
          //  alert(23)
          this.brandIntroduction = false
        }
        if (set.brandName != '全部' || set.categoryName != '全部' || set.size || set.category) {
          this.key =
            ' ' +
            (set.brandName != '全部' && set.brandName ? set.brandName : '') +
            ' ' +
            (set.category != '全部' && set.category ? set.category : '') +
            ' ' +
            (set.categoryName != '全部' && set.categoryName ? set.categoryName : '') +
            ' ' +
            (set.size ? set.size : '')
          this.keywordValue =
            // ' ' +
            // (set.brandName != '全部' && set.brandName != key ? set.brandName : '') +
            // ' ' +
            // (set.categoryName != '全部' ? set.categoryName : set.category ? set.category : '') +
            // ' ' +
            set.value ? set.value : ''
        }
        console.log(this.keywordValue, '关键字--------------------------')
      }
    },
    goBack() {
      if (window.mqq) window.mqq.ui.popBack()
      else this.$router.back()
    },
    goSearch() {
      this.$router.replace('/search/' + ENUM.SearchType.product.val)
      sessionStorage.setItem('tt', '1')
      var type = 2
      this.$store.dispatch('resetOption', type)
    }
  },
  computed: {
    ...mapGetters({ searchOption: 'searchOption' })
    // searchOption() {
    //   return this.$store.state.product.searchOption
    // }
  },
  watch: {
    searchOption: function (newO, oldv) {
      console.log('searrrrrrrrrrrr', newO)
      // this.searchOption = newO
      this.initKey()
    }
  }
}
</script>
