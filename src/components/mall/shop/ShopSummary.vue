<template>
  <div class="shop_summary" v-bind:style="{ height: deviceHeight + 'px'}">
    <v-header>
      <div class="nav-tab2">
        <h3>{{shopName}}</h3>
      </div>
    </v-header>
    <div class="shopbg blur" :style="{backgroundImage: 'url('+https( shopSumDesc[2]) +')'}"></div>
    <swiper :options="swiperOption" class="swiper-container swiper2">
      <swiper-slide v-if="shopSumDesc">
        <section>
          <div class="shop_desc">{{shopSumDesc[0]}}</div>
        </section>
      </swiper-slide>
      <swiper-slide v-for="(item,index) in shopSummary" :key="index">
        <section>
          <div class="picback" :style="{ backgroundImage: 'url('+https( item) +')'}"></div>
        </section>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination" v-if="shopSummary&&shopSummary.length>0"></div>
    </swiper>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      deviceHeight: 0,
      swiperOption: {
        autoplay: 0,
        // slidesPerView: 'auto',
        spaceBetween: 10,
        slidesPerView: 1.15,
        centeredSlides: true,
        pagination: ".swiper-pagination"
      }
    };
  },
  computed: {
    ...mapGetters({ shopSummary: "shopSummary", shopSumDesc: "shopSumDesc" }),
    shopName() {
      return this.shopSumDesc[1];
    }
  },
  mounted() {
    this.initShare({ type: 1, info: { ...this.$parent.shareData } });
    let deviceHei = document.documentElement
      ? document.documentElement.clientHeight
      : document.body.clientHeight;
    this.deviceHeight = deviceHei; // - 48
    if ((this.shopSummary && this.shopSummary.length > 0) || this.shopName) {
    } else {
      this.$router.go(-1);
    }
    console.log(this.shopSumDesc);
  }
};
</script>
<style scoped>
.shop_summary {
  position: relative;
}

.shopbg {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

.shop_summary .shop_desc {
  color: #fff;
  text-align: justify;
  display: block;
  position: absolute;
  bottom: 10%;
  width: 80%;
  left: 10%;
  line-height: 1.25rem;
  font-size: 0.75rem;
}

.shop_summary .swiper-container {
  position: fixed;
  top: 8%;
  left: 0;
  width: 100%;
  height: 92%;
  background: rgba(0, 0, 0, 0.2);
}

.shop_summary .swiper-container section {
  height: 100%;
}

.shop_summary .picback {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}
.blur {
  -webkit-filter: blur(10px);
  -moz-filter: blur(10px);
  -ms-filter: blur(10px);
  filter: blur(10px);
}
</style>
