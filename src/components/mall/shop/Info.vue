<template>
  <div class="bgc">
    <v-headerscopy :showback='true' :bg='dark'>
      <div class="nav-tab2" style="color: #fff">店铺简介</div>
      <v-cart :isshow="true" class="car"></v-cart>
    </v-headerscopy>
    <div class="header">
      <img :src="info.headportraiturl|https" alt="">
      <div class="right">
        <span class="s-name">{{info.businessname}}</span>
        <div class="s-fans">
          <p class="s-shop">{{info.type === 1 ? '官方店':info.type === 2? '买手店': '专营店'}}</p>
          <p class="s-price">{{info.favorcount>999?'999+':info.favorcount}}
            <span>粉丝</span>
          </p>
        </div>
      </div>
    </div>
    <!-- <div class="s-info flex-between ">
      <div class="s-info-l flex">
        <img :src="info.headportraiturl|https" alt="">
        <div>
          <p class="ellipsis">{{info.businessname}}</p>
          <p>
            <i class="ico-sp-glb tilt" v-if="info.isglobalpurchase"></i>
            <i :class="info.icoClass" class="tilt"></i>
          </p>
        </div>
      </div>
      <div class="s-info-r">
        <p class="font-price">{{info.favorcount>999?'999+':info.favorcount}}
          <span>粉丝</span>
        </p>
      </div>
    </div> -->
    <section class="s-subinfo">
      <!-- <div class="flex-aic " v-if="info.companycertificate" @click="goLicense">
        <span>工商执照</span>
        <i class="ico-shop-cert"></i>
      </div>
      <div class="flex-aic " v-else>
        <span>已实名认证</span>
        <i class="ico-shop-named"></i>
      </div> -->
      <div class="flex-aic" v-if="info.companycertificate" @click="goLicense">
        <div class="icon">
          <img src="../../../assets/img/usergs.png" style="width: 30px">
          <span style="color: #fff">工商执照</span>
        </div>
        <div>></div>
      </div>
      <div class="flex-aic" v-else>
        <img src="../../../assets/img/usergs.png" style="width: 30px">
        <span style="color: #fff">已实名认证</span>
        <!-- <i class="ico-shop-named"></i> -->
      </div>
      <div v-if="info.desc">
        <p style="color: #fff;font-size: 22px">ABOUT US</p>
        <p style="font-size: 15px">{{info.desc}}</p>
      </div>
    </section>
    <swiper :options="swiperOption" class="swiper-container sp-swiper" style="background: #333" v-if="albums&&albums.length">
      <swiper-slide v-for="(item,idx) in albums" :key='idx'>
        <img :src="item|https" alt="">
      </swiper-slide>
      <div class="swiper-scrollbar" slot="scrollbar" v-if="albums&&albums.length>1"></div>
    </swiper>
  </div>
</template>
<script>
export default {
  data() {
    return {
      info: {},
      albums: [],
      dark: '#333',
      swiperOption: {
        // spaceBetween: 15,
        slidesPerView: 1.33,
        scrollbar: '.swiper-scrollbar',
        scrollbarHide: false
      }
    }
  },
  beforeMount() {
    let _ = this
    let id = _.$route.params.id
    let info = JSON.parse(window.localStorage.getItem('SHOP_INFO') || '{}')
    console.log('===shop info', info)
    if (info.id && id && info.id === id) {
      if (info.albums) _.albums = info.albums.split('|')
      _.info = info
    } else _.$router.replace('/shop/shopdetail/' + id || info.id || '')
  },
  methods: {
    goLicense() {
      let url = this.info.companycertificate
      this.$router.push('/shop/license/' + encodeURIComponent(url))
    }
  }
}
</script>
<style scoped>
.bgc {
  background: #333;
  height: 100vh;
}
.car {
  display: flex;
  align-items: center;
}
.header {
  width: 90%;
  /* border: 1px solid red; */
  margin: 0 auto;
  margin-top: 1px;
  padding: 1rem;
  display: flex;
  /* background: #333; */
}
.header img {
  width: 32vw;
  height: 32vw;
  border-radius: 50%;
}
.header .right {
  color: #fff;
  margin-top: 1.5rem;
  margin-left: 2rem;
}
.s-fans {
  display: flex;
  margin-top: 1rem;
  width: 100%;
  justify-content: flex-start;
}
.s-name {
  font-size: 21px;
}
.s-price {
  font-size: 13px;
}
.s-shop {
  /* border-radius: .2rem; */
  background: linear-gradient(#879bb9, #46557d);
  border-radius: 2px;
  font-size: 12px;
  padding: 1px 3px;
  margin-right: 1rem;
  /* background: inear-gradient(#879bb9, #46557d); */
}
.flex-aic{
  width: 94%;
  /* border: 1px solid red; */
  margin: 0 auto;
  border-radius: 8px;
  background: #282828;
  padding: 1.5rem 2rem;
  color: #fff;
}
.flex-aic span {
  color: #fff;
  margin-left: 2rem;
  font-size: 16px;
}
/* .flex-aic img:nth-child(2) {
  margin-left: 2rem;
} */
.flex-aic img {
  width: 30px;
}
.flex-aic .icon {
  width: 90%;
  display: flex;
  align-items: center;
}
.s-info {
  width: 100%;
  padding: 10px;
}
.s-info-l {
  max-width: 72%;
}
.s-info-l > img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 5px;
}
.s-info-l .ellipsis {
  max-width: 170px;
}
.s-info-r {
  width: 70px;
  text-align: right;
  font-size: 12px;
}
.s-info-r > p {
  line-height: 21px;
  font-size: 13px;
}
.s-info-r > p span {
  font-size: 10px;
}
.s-subinfo {
  font-size: 12px;
}
.s-subinfo > div {
  padding: 10px;
}
.s-subinfo i {
  margin-left: 10px;
}
.s-subinfo p:first-of-type {
  margin-bottom: 8px;
  font-weight: 600;
}
.s-subinfo p:last-of-type {
  color: #fff;
  line-height: 21px;
  font-family: PingFangSC, PingFangSC-Regular;
}
.sp-swiper {
  padding: 40px 15px;
  padding-right: 0;
}
.swiper-slide {
  padding-right: 15px;
}
.swiper-slide img {
  border-radius: 14px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
</style>
