<template>
  <div v-if="hasdata===0"></div>
  <div class="sale" v-else-if="supremeSeries.length&&hasdata===1">
    <div class="swiperOption">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(item,idx) in supremeSeries" :key="item.id" @click.native="chooseSeries(item,idx)">
          <div class="series_img" :class="{'choosenInd':idx == currInd}">
            <img v-lazy="https(item.coverurl)" alt="">
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="clearfix" v-if="supremeProducts&&supremeProducts.length>0" style="padding:5px;">
      <SupremeUnit v-for="item in supremeProducts" :key="item.id" :supProduct="item"></SupremeUnit>
    </div>
    <p class='no-more' v-if="supremeProducts&&supremeProducts.length>0">已经到底啦~~</p>
  </div>
  <div v-else-if='hasdata ===2'>
    <div class="no-data">
      <img src="//files.eyee.com/mcdn/static/img/no_product.png" alt="">
      <p>暂无相关数据</p>
    </div>
  </div>
</template>
<script>
import { BrandSpecialSeries, BrandSpecialSale } from "../../common/api/supreme";
import SupremeUnit from "../templates/SupremeUnit";
export default {
  data() {
    return {
      supremeProducts: [],
      supremeSeries: [],
      currInd: 0,
      currSeriesId: "",
      hasdata: 0,
      swiperOption: {
        slidesPerView: 3.3,
        spaceBetween: 10
        // slideToClickedSlide: true
      }
    };
  },
  mounted() {
    this.currSeriesId = this.$route.params.id;
    console.log(this.currSeriesId);
    this.getSeries();
  },
  methods: {
    getSeries() {
      BrandSpecialSeries({ brandid: this.currSeriesId })
        .then(res => {
          console.log("supremeSeries Lists", res);
          if (res) {
            this.supremeSeries = res;
            this.hasdata = 1;
          }
          this.getSupremePods(this.supremeSeries[0].id);
        })
        .catch(err => {
          this.hasdata = 2;
          this.toast(err);
        });
    },
    chooseSeries(item, index) {
      if (this.currInd === index) return;
      this.currInd = index;
      this.getSupremePods(item.id);
    },
    getSupremePods(id) {
      BrandSpecialSale({ seriesId: id })
        .then(res => {
          console.log("supremeProducts Lists", res);
          this.supremeProducts = res;
          this.hasdata = 1;
        })
        .catch(err => {
          this.toast(err);
          this.hasdata = 2;
        });
    }
  },
  components: { SupremeUnit }
};
</script>
<style scoped>
.sale {
  padding-top: 10px;
}
.swiperOption {
  padding: 0 10px;
}
.series_img {
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid transparent;
}
.series_img.choosenInd {
  border-color: #ffc700;
}
.series_img img {
  display: block;
}
.sup_list {
  float: left;
  width: 33%;
}
</style>
