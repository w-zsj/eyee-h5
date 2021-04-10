<template>
  <div data="250" v-if="limitsale&&limitsale.length" class="limit_slides">
    <div class="sec-title">
      <p class="ico-btline">限量发售<br><span>LIMITED SALE</span></p>
      <div v-if="qzone" class="sec-subtitle" @click="qzoneGo('/mall/limit')">查看更多</div>
      <router-link v-else class="sec-subtitle" to="/mall/limit">查看更多</router-link>
    </div>
    <swiper :options="luOptions" style="padding-top:10px;">
      <limit-unit ref="countimgSty" class="swiper-slide" v-for="(item,idx) in limitsale" :key="item.id" :swiper-index='idx' :is-slide="true" :flag="0" :limitInfo="item" @reload="reload" :qzone='qzone' ></limit-unit>
    </swiper>
    <div v-if="limitsale.length>1" class="swiper-page-lu" slot="pagination"></div>
  </div>
</template>
<script>
import LimitUnit from "./LimitUnit";
import { LimitSales } from "../../common/api/marketing";
import { mapGetters } from "vuex";
export default {
  name: "limit-swiper",
  props: { qzone: { type: Boolean, default: false } },
  components: { LimitUnit },
  data() {
    return {
      luOptions: {
        slidesPerView: 1.1,
        width: window.innerWidth * 0.96,
        centeredSlides: true,
        // loop: true,
        roundLengths: true,
        effect: "coverflow",
        coverflow: {
          rotate: 30,
          stretch: 10,
          depth: 60,
          modifier: 2,
          slideShadows: false
        },
        onClick: swiper => {
          var mys = swiper.clickedSlide.getAttribute("id");
          var isactiveEnd = swiper.clickedSlide.getAttribute("isactiveEnd");
          if (swiper.activeIndex == 0 || swiper.isEnd) {
            if (isactiveEnd == 3) this.toast("已结束");
            else {
              let url = "/productDetail/" + mys;
              this.qzone ? this.qzoneGo(url) : this.$router.push(url);
            }
          }
        }
      }
    };
  },
  mounted() {
    if (this.limitsale && this.limitsale.length > 0)
      this.luOptions.loop = this.limitsale.length > 1;
    else this.getLimit();
  },
  computed: {
    ...mapGetters({
      limitsale: "limitSaleList"
      // reLimit: 'reLimit'
    })

    // reGet(){
    //   return this.$store.
    // }
  },
  methods: {
    getLimit() {
      LimitSales()
        .then(res => {
          this.$store.dispatch("setLimitSaleList", res);
          this.luOptions.loop = res && res.length > 1;
          // this.$store.dispatch('changLimit', false);
        })
        .catch(e => {
          this.toast("请求异常", e);
          // this.$store.dispatch('changLimit', false);
        });
    },
    reload() {
      // if(this.reLimit){
      this.$store.dispatch("setLimitSaleList", []);
      this.getLimit();
      // }
    }
  }
  // watch: {
  //   "reLimit": 'reload'
  // }
};
</script>
<style scoped>
.limit_slides .swiper-container {
  padding-left: 15px !important;
}
</style>
