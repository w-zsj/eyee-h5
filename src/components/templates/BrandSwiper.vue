<template>
  <div>
    <div class="title_brand">
      <div><img :src="brandImg" alt="">
        <span>潮流品牌百科</span>
      </div>
      <a href="javascript:;" v-if="qzone" @click="qzoneGo('/brand')">VIEW MORE &gt;</a>
      <router-link v-else to="/brand">VIEW MORE &gt;</router-link>
    </div>
    <swiper :options="options" class="swBox">
      <swiper-slide v-for="(item,index) in list" :key='index'>
        <div @click.stop="getBrandInfo(item.id)">
          <div class="smailImg">
            <img :src="item.coverurl|https" alt="">
          </div>
          <div class="titelBg ">
            <p class="ellipsis">{{item.name}}</p>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
export default {
  props: { brandList: { default: [] }, type: { type: Number, default: 0 }, qzone: { type: Boolean, default: false }},
  data() {
    return {
      brandImg: '//files.eyee.com/mcdn/static/img/brand_icon.png', // require('../../assets/img/brand_icon.png'),
      options: {
        slidesPerView: 2.5,
        resistanceRatio: 0,
        freeMode: true,
        spaceBetween: 10
      },
      imgStyle: {}
    }
  },
  computed: {
    list() {
      return this.brandList
    }
  },
  methods: {
    getBrandInfo: function (id) {
      // console.log(11)
      // this.$router.push('/brandInfo/' + id)
      let url = '/brandInfo/' + id
      this.qzone ? this.qzoneGo(url) : this.$router.push(url)
    }
  }
}
</script>
<style scoped>
.title_brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 40px;
  height: 40px;

  font-size: 14px;
  padding: 0 10px;
}

.title_brand img {
  width: 16px;
  vertical-align: middle;
  margin-right: 10px;
}

.title_brand a {
  height: 100%;
  font-size: 0.75rem;
  color: #666;
}

.swBox {
  padding: 20px 10px;
  border-top: 1px solid #f2f2f2;
}

.smailImg {
  width: 100%;
  overflow: hidden;
  height: 0px;
  padding-bottom: 120%;
  margin: 0;
  position: relative;
}

.smailImg img {
  width: 100%;
  position: absolute;
  left: 0;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
.titelBg,
.titelBg p {
  height: 30px;
  line-height: 30px;
}
</style>
