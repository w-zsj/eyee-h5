<template>
  <div v-if="hasData==0"> </div>
  <div v-else-if="hasData==1">
    <v-header>
      <div class="nav-tab2">
        <h3>{{seriesInfo.name}}</h3>
      </div>
      <router-link tag="div" class="seackBtn" :to="searchUrl">
        <img :src="sImg" alt="">
      </router-link>
    </v-header>
    <div class="sneak_se">
      <div class="logo_img">
        <img :src="seriesInfo.logourl|https" alt="">
      </div>
      <ul class="clearfix">
        <li v-for="item in shoesList" :key='item.id'>
          <ShoeUnit :sneakItem="item" :SneakType='1' :sneakerCaty='categoryNum'></ShoeUnit>
        </li>
      </ul>
      <v-delay :delay="800" class='no-more'>已经到底啦~~</v-delay>
    </div>
  </div>
  <v-error v-else></v-error>
</template>
<script>
import { ENUM, APP } from '../../common/util'
import { ShoeSeriesPage } from '../../common/api/sneaker'
import ShoeUnit from '../templates/ShoeUnit'
export default {
  components: { ShoeUnit },
  data() {
    return {
      seriesName: '',
      sImg: '//files.eyee.com/mcdn/static/img/search_h.png', // require('../../assets/img/search_h.png'),
      seriesInfo: {},
      shoesList: [],
      hasData: 0,
      categoryNum: 0
    }
  },
  mounted() {
    let data = APP.shareData.shoeList
    this.categoryNum = this.$route.params.catyname
    this.initShare({ type: 0, info: { ...data }})
    this.getInfos()
  },
  computed: {
    catename() {
      return this.$route.params.catyname == 0 ? '男鞋' : '女鞋'
    },
    seriesid() {
      return this.$route.params.seriesid
    },
    searchUrl() {
      return '/search/' + ENUM.SearchType.sneaker.val
    }
  },
  methods: {
    getInfos() {
      ShoeSeriesPage({ seriesid: this.seriesid, categoryname: this.catename })
        .then(res => {
          if (res) {
            console.log(res)
            this.hasData = 1
            this.seriesInfo = res.info
            let s = res.share
            this.initShare({ type: s.type, info: { title: s.title, img: s.icon, desc: s.content }})
            if (res.shoes) {
              this.shoesList = res.shoes
            }
          } else {
            this.hasData = 2
          }
        })
        .catch(e => {
          this.hasData = 2
          console.error('数据加载失败', e)
        })
    }
  }
}
</script>
<style scoped>
.seackBtn {
  position: absolute;
  right: 0;
  text-align: center;
  width: 60px;
}

.seackBtn img {
  width: 20px;
  margin-top: 12px;
}

.sneak_se .logo_img {
  /*max-height: 220px;*/
  overflow: hidden;
}

.sneak_se .logo_img img {
  display: block;
  width: 100%;
}
</style>
