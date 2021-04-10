<template>
  <div>
    <template  v-if='!insq'>
      <v-header :showback="false">
        <SearchBox></SearchBox>
        <v-cart></v-cart>
      </v-header>
      <div class="s-tab">
        <ul class="flex-center">
          <router-link v-for="(item,idx) in tab" :class="{curr:actTab==item.id}" :key="idx" :to="item.url" tag="li">
            <a class='font-pf'>{{item.name}}</a>
          </router-link>
        </ul>
        <div class="supremeLogo">
          <router-link  :to="{name:'sale',params:{id:getSupremeId}}" tag="div">
            <img :src='supremeNavImg'/>
          </router-link>
        </div>
      </div>
    </template>
    <router-view :style="insq?'':'margin-top:88px;'"></router-view>
  </div>
</template>
<script>
import SearchBox from '../templates/SearchBox'
import { ENUM } from '../../common/util'
import { mapGetters } from 'vuex'
export default {
  components: { SearchBox },
  data() {
    return {
      supremeNavImg: '//files.eyee.com/mcdn/static/img/sunremeNav.png', // require('../../assets/img/sunremeNav.png'),
      sImg: '//files.eyee.com/mcdn/static/img/search_gray.png', // require('../../assets/img/search_gray.png'),
      tab: [{ name: '分类', url: '/mall', id: 'B2C_HOME' },
      // { name: '分类', url: '/mall/category', id: 'B2C_CATEGORY' },
        { name: '品牌', url: '/mall/brand', id: 'B2C_BRAND' }, { name: '潮店', url: '/mall/shop', id: 'B2C_SHOP' },
        { name: '鬼市', url: '/mall/ghost', id: 'B2C_GMALL' }, { name: '限量', url: '/mall/limit', id: 'B2C_LIMIT' }, { name: '折扣', url: '/mall/discount', id: 'B2C_DISCOUNT' }]
    }
  },
  beforeMount() {
    if (!(this.specialBrand && this.specialBrand.length > 0)) {
      this.$store.dispatch('setHomeGather')
    }
  },
  computed: {
    actTab() {
      let meta = this.$route.meta, selectTab = 'B2C_HOME'
      if (meta && meta.b2cTab) selectTab = meta.b2cTab
      return selectTab
    },
    ...mapGetters({
      insq: 'insq',
      searchOption: 'searchOption',
      specialBrand: 'homeSpecialBrands'
    }),
    getSupremeId() {
      // if (this.specialBrand && this.specialBrand.length > 0) {
      //   return this.specialBrand[0].id
      // } else {
      //   return ' '
      // }
      return 'B368E8FE5D1D41C7B7779CF7D89A9C3A'
    }
  },
  methods: {
    goSearch() {
      this.$router.push('/search/' + ENUM.SearchType.product.val)
      this.$store.dispatch('confirOption', { data: {}})
    }
  }
}
</script>
<style scoped>
.s-tab {
  position: fixed;
  top: 48px;
  left: 0;
  width: 100%;
  background-color: #fff;
  z-index: 9;
  box-shadow: 0 0 8px rgba(238, 238, 238, .5);
}
.s-tab .supremeLogo{
    width: 46px;
    height: 15px;
    right: 3px;
    float: right;
    position: absolute;
    top: 12px;
}
.supremeLogo img{
   width: 100%;
   height: 100%
}
.s-tab ul {
  justify-content: flex-start;
}

.s-tab li {
  position: relative;
  width: 13%;
  color: #333;
  font-size: 12px;
  text-align: center;
}

.s-tab a {
  display: block;
  margin: auto;
  /*width: 24px;*/
  font-size: 14px;
  line-height: 38px;
  border-bottom: 2px solid transparent;
  transition: border .3s linear;
}

.s-tab .curr:after {
  content: '';
  position: absolute;
  width: 58%;
  height: 2px;
  background: #333;
  bottom: 0;
  left: 22%;
}
</style>
