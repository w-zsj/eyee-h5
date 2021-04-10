<template>
  <div>
    <v-header :showback="false" class="flex-center sneak_h">
      <!-- <p>SNEAKER</p> -->
     <!--  <router-link tag="div" class="seackBtn" :to="searchUrl">
        <img :src="sImg" alt="">
      </router-link> -->
    </v-header>
    <div class="sContent" :style="{ height: deviceHeight + 'px'}">
      <!-- <div class="bgImg" :style="{backgroundImage: 'url(' + bgImg +')'}"></div>
      <div class="cover_logo">
        <div class="manLogo" @click="goSex(0)">
          <img :src="manLogo" alt="">
        </div>
        <div class="womenLogo" @click="goSex(1)">
          <img :src="womenLogo" alt="">
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
  // import { ENUM } from '../../common/util'
// import { BaseValue } from '../../common/api/base'
import * as api from '../../common/api/sneaker'
// import { mapGetters } from 'vuex'
export default {
    data() {
      return {
        sImg: '//files.eyee.com/mcdn/static/img/search_h.png', // require('../../assets/img/search_h.png'),
        deviceHeight: 0,
        manLogo: 'http://files.eyee.com/eyeeh5/img/man_sneak.png',
        womenLogo: 'http://files.eyee.com/eyeeh5/img/women_sneak.png',
        bgImg: '',
        sneakBrand: {}
      }
    },
    mounted() {
      // if (this.sneakBrand && this.sneakBrand.share) {
      //   let s = this.sneakBrand.share
      //   this.initShare({ type: s.type, info: { title: s.title, img: s.icon, desc: s.content } });
      // } else {
      //   this.sneakInfo();
      // }
      let deviceHei = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight
      this.deviceHeight = deviceHei - 98
      let body = document.body
      body.style.overflow = 'hidden'
      // if (!(this.baseValue && this.baseValue.configs)) {
      //   this.BaseValue();
      // } else {
      //   this.bgImg = this.baseValue.configs.gymshoesimg
      // }
      this.sneakInfo()
    // this.goSex(0);
  },
    // computed: {
    //   ...mapGetters({ baseValue: 'baseValue'}),
    //   searchUrl() {
    //     return ('/search/' + ENUM.SearchType.sneaker.val);
    //   }
    // },
    beforeDestroy() {
      let body = document.body
      body.style.overflow = 'scroll'
  },
    methods: {
      goSex(n) {
        this.$router.replace('/sneakerSex/' + n + '/' + this.sneakBrand.tabs[n].brands[0].brandid)
      },
      sneakInfo() {
        let type = this.$route.query.type || 0
        api.ShoeGetTabs().then((res) => {
          if (res) {
            console.log('sneakBrands', res)
            this.sneakBrand = res
            this.$router.replace('/sneakerSex/' + type + '/' + this.sneakBrand.tabs[type].brands[0].brandid)
            let s = res.share
            this.initShare({ type: s.type, info: { title: s.title, img: s.icon, desc: s.content }})
            this.$store.dispatch('setSneakBrandCate', res)
          }
        }).catch(e => { console.error('数据加载失败', e) })
      }
      // ,
      // BaseValue() {
      //   BaseValue().then((res) => {
      //     if (res) {
      //       this.bgImg = res.configs.gymshoesimg
      //       this.$store.dispatch('setBaseValue', res)
      //     }
      //   }).catch(e => { console.error('基础数据加载失败', e) })
      // }
    }
  }

</script>
<style scoped>
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

  .sContent {
    position: relative
  }

  .sContent .bgImg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .cover_logo {
    position: absolute;
    top: 20%;
  }

  .cover_logo .manLogo {
    width: 58%;
    float: right;
    margin-bottom: 15px;
  }

  .cover_logo .womenLogo {
    width: 70%;
    float: right;
  }
</style>
