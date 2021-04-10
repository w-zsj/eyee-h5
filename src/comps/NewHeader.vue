<template>
  <keep-alive>
    <div class="flex-around new-header" :style="{top:top}">
      <div class="flex-center nh-cell nh-back" @click="back" :style="backCss">
        <img src="/static/imgs/mall/ico-back.png" alt>
      </div>
      <router-link to="/cart" tag="div" class="flex-col flex-center nh-cell" :style="cartCss">
        <img
          :src="cartSect?'/static/imgs/mall/ico-cart-act.png':'//files.eyee.com/mcdn/img/prddetail/icon_cart.png'"
          alt
        >
        <span>购物车</span>
      </router-link>
      <router-link :to="path" tag="div" class="flex-aic nh-search" :class="{'snea-search':sneakerType==1}" :style="searchCss">
        <img src="/static/imgs/mall/ico-search.png" alt>
        <span>{{firstKey}}</span>
      </router-link>
      <router-link to="/category" tag="div" class="flex-col flex-center nh-cell" :style="cateCss">
        <img src="/static/imgs/mall/ico-category.png" alt>
        <span>分类</span>
      </router-link>
    </div>
  </keep-alive>
</template>
<script>
import { Gettoplist } from "../utils/api/search.js";
const headerType = ["search", "search-cart", "cart-cate", "back-cart","back"];
export default {
  name: "NewHeader",
  data(){
    return {
      firstKey:''
    }
  },
  props: {
    top: { type: Number, default: 0 },
    sneakerType:{ type: Number, default: 0 },
    cartSect: { type: Number, default: 0 },
    type: {
      type: String
      // ,
      // validator: val => headerType.indexOf(val) > -1
    }
  },
  computed: {
    searchCss() {
      let _ = this,
        css = {};
      if (_.type === "search") css.width = "90vw";
      else if (_.type === "search-cart") {
        css.width = "80vw";
        css.marginLeft = "2vw";
      }
      return css;
    },
    backCss() {
      let _ = this,
        css = { order: 0 };
      if (_.type.indexOf("back") === -1) css.display = "none";
     
      return css;
    },
    cartCss() {
      let _ = this,
        css = { order: 0 };
      if (_.type.indexOf("cart") === -1) css.display = "none";
      else if (_.type === "back-cart" || _.type === "search-cart")
        css.order = 2;
      return css;
    },
    cateCss() {
      let _ = this,
        css = { order: 2 };
      if (_.type.indexOf("cate") === -1) css.display = "none";
      return css;
    },
    path(){
      let url = '/nesearch'
      url = this.sneakerType==0?"/nesearch":"/nesearch?isc2c=1"
      return url
    }
  },
  mounted(){
    let _ = this
    let type = _.sneakerType==1?1:2
    Gettoplist(type)
      .then(res => {
        if(res)_.firstKey = res[0].keyword;
        else _.firstKey = 'search'
      })
      .catch(e => {
        _.firstKey = 'search'
        console.log(e);
      });
  },
  methods: {
    back() {
      this.$router.back();
    }
  }
};
</script>
<style scoped>
.new-header {
  position: sticky;
  top: 0;
  height: 13.33vw;
  background-color: #fff;
  z-index: 9;
}
.new-header .ico-back {
  color: #333;
}
.nh-cell {
  height: 100%;
  width: 12.66vw;
  font-size: 8px;
}
.nh-cell img {
  height: 22px;
}
.nh-back {
  width: 9vw;
}
.nh-search {
  order: 1;

  width: 74.68vw;
  height: 8vw;
  background: #f2f2f2;
  /* border-radius: 8vw; */

  font-size: 12px;
  font-weight: 400;
  color: #999;
}
.snea-search{
  width: 85vw;
}
.nh-search img {
  width: 16px;
  margin-left: 12px;
  margin-right: 8px;
}
</style>
