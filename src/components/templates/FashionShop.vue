<template>
  <div v-if="fashionShops&&fashionShops.length>0">
    <div class="sec-title">
      <p class="ico-btline">潮流店铺<br>
        <span>FASHION SHOPS</span>
      </p>
      <!-- <router-link class="sec-subtitle" to="/mall/shop">更多店铺</router-link> -->
      <div class="sec-subtitle" @click='goMore'>更多店铺</div>
    </div>
    <swiper :options="hbOption" style="padding:15px 0;" ref="hbSwiper" class='hb-shop'>
      <swiper-slide v-for="(item,idx) in fashionShops" :key="idx" :style="cssType1" :id="item.id">
        <div class="hb-wrap"  >
          <div class="hb-info">
            <img :src="item.logourl|https" alt="" @click.stop="gotoShop(item,idx)">
          </div>
          <!--2-->
          <div class="hb-desc flex-center">
            <div class="shopName flex-center" @click.stop="gotoShop(item,idx)">
              <!-- <span class="mall_brandShop" :class="{'mall_buyers':item.type ==2}">{{item.type ==2?'买手店':'品牌店'}}</span> -->
              <i class="tilt" :class="item.type===3?'ico-sp-store':(item.type===2?'ico-sp-buy':'ico-sp-official')"></i>
              <p class="ellipsis">{{item.businessname}}</p>
            </div>
          </div>
          <!--3-->
          <div class="hb-items flex-center" @click="goProduct(item,idx)">
            <product-unit v-for="(pi,i) in item.products" :key="i" :product-item="pi" :product-type="3"></product-unit>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script>
import ProductUnit from "./ProductUnit";
export default {
  components: { ProductUnit },
  name: "FashionShop",
  props: {
    fashionShops: { default: [] }
  },
  data() {
    return {
      hbOption: {
        slidesPerView: 1.18,
        centeredSlides: true,
        loop: true,
        roundLengths: true,
        effect: "coverflow",
        coverflow: {
          rotate: 30,
          stretch: 10,
          depth: 60,
          modifier: 2,
          slideShadows: false
        },
        onInit: swiper => {
          this.initSwiper(swiper);
        },
        onClick: swiper => {
          var mys = swiper.clickedSlide.getAttribute("id");
          if (swiper.activeIndex == 0 || swiper.isEnd) {
            this.$router.push("/shop/shopdetail/" + mys);
          }
        }
      },
      cssType1: {
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "0 4px 7px 0 #ccc",
        height: "340px",
        background: "#ffffff",
        position: "relative"
      }
    };
  },
  computed: {
    list() {
      let list = this.fashionShops;
      if (list && list.length > 0) {
        if (list.length > 6) list = list.slice(0, 6);
        else if (list.length > 3) list = list.slice(0, 3);
        list = list.map((i, idx) => {
          return i;
        });
      }
      return list;
    }
  },
  methods: {
    initSwiper(swiper) {
      let w = swiper.width,
        ml = 0,
        items = window.document.getElementsByClassName("hb-items");
      ml = -1 * Math.ceil((w - w / this.hbOption.slidesPerView) / 2);
      this.itemStyle = "width:" + w + "px;margin-left:" + ml + "px";
    },
    gotoShop(shop, idx) {
      let rect = window.document
        .querySelector(".hb-shop .swiper-slide-active")
        .getBoundingClientRect();
      this.$router.push("/shop/shopdetail/" + shop.id);
    },
    goMore(e) {
      let rect = e.target.getBoundingClientRect();
      this.$router.push("/mall/shop");
    },
    goProduct(shop, idx) {
    }
  }
};
</script>
<style scoped>
.hb-wrap .hb-info {
  position: relative;
}
.hb-wrap .hb-desc {
  width: 100%;
  background: #ffffff;
  position: relative;
  color: #333333;
}
.hb-wrap .hb-items {
  position: relative;
}
.hb-info {
  position: relative;
  height: 150px;
  overflow: hidden;
  border-radius: 2px;
}

.hb-info > img {
  position: absolute;
  width: 100%;
  min-height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.hb-desc {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
  flex-direction: column;
}

.hb-desc > img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.hb-desc .shopName {
  font-size: 16px;
  font-weight: 500;
  line-height: 32px;
  margin-top: 10px;
  width: 100%;
}
.shopName .ellipsis {
  max-width: 60%;
}

.hb-desc span {
  font-size: 12px;
}
/* .swiper-slide-active .hb-items {
  opacity: 1;
} */

.hb-items {
  width: 100%;
  padding: 2% 0;
  margin-top: 10px;
  /* opacity: 0;
  transition: opacity 0.3s ease; */
}

.hb-items > div {
  width: 28%;
  margin: 0 2%;
}
</style>
