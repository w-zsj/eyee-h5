<template>
  <swiper :options="swiperOption" ref="mySwiperA" :class='{brandSw:brandSw}' class="swiper-container swiper2">
    <swiper-slide v-for="(item,index) in swList" :key='index'>
      <section @click.stop="goDetail(item.id)">
        <div class="info_img">
          <img :src="item.coverurl|https" alt="">
        </div>
        <div class="info_titel ellipsis">
          {{item.title}}
        </div>
      </section>
    </swiper-slide>
  </swiper>
</template>
<script>
  export default {
    props: {
      keyword: String,
      brandId: String,
      fixBar: Boolean,
      swList: Array,
      brandSw: Boolean
    },
    data() {
      return {
        swiperOption: {
          autoplay: 0,
          slidesPerView: 'auto',
          spaceBetween: 10,
          centeredSlides: true
        }
      }
    },
    methods: {
      goDetail(id) {
        if (id) {
          this.$router.push('/brandDetail/' + id)
        }
      }
    },
    mounted() {
    }
  }

</script>
<style scoped>
  .brandSw .swiper-slide {
    width: 76%;
  }

  .info_titel {
    width: 70%;
    height: 20px;
    margin: 15px auto 0;
  }

  .info_img {
    width: 100%;
    height: 38vw;
    overflow: hidden;
  }
</style>
