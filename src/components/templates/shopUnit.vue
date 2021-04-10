<template>
  <div>
    <section class="shop_img" @click="gotoShopDetl(shopInfo)" :style="showType == 2?'padding-top:55%':''">
      <img v-if="showType !=2" :src="https(shopInfo.logourl)" alt="">
      <img v-if="showType ==2" :src="https(shopInfo.img)" alt="">
      <div class="flex-center">
        <p class="shop_name flex-center" :class="{nameBreak:showType ==2}">
          <!-- <span class="mall_brandShop" :class="{'mall_buyers':shopInfo.type == 2}">{{shopInfo.type == 1? '品牌店':'买手店'}}</span> -->
          <i class='ico-sp-glb tilt' v-if="shopInfo.isglobalpurchase"></i>
          <i class='tilt' :class="shopInfo.type===3?'ico-sp-store':(shopInfo.type===2?'ico-sp-buy':'ico-sp-official')"></i>
          <span :class="{ellipsis:showType ==2}"> {{showType == 0?shopInfo.businessname :(showType == 3?shopInfo.fullname:shopInfo.name)}}</span>
        </p>
        <!-- <p v-if="showType ==1" class="shop_desc">{{shopInfo.desc}}</p> -->
        <p class="shop_counpon" v-if="shopInfo.hascoupon && showType !=2">
          <span>领券</span>
        </p>
      </div>
      <label v-if="shopInfo.isnew" class="new_label"></label>
    </section>
  </div>
</template>
<script>
export default {
  props: {
    shopInfo: Object,
    showType: { type: Number, default: 0 } // 0在潮店首页显示 1在我的收藏-潮店里显示 2在平台大促显示
  },
  // data() {
  //   return {

  //   }
  // },
  // mounted() {
  //   console.log(this.shopInfo)
  // },
  methods: {
    gotoShopDetl: function (shop) {
      if (this.showType == 2) {
        this.$router.push('/shop/shopdetail/' + shop.shopid)
      } else {
        this.$router.push('/shop/shopdetail/' + shop.id)
      }
    }
  }
}
</script>
<style scoped>
.shop_img {
  position: relative;
  overflow: hidden;
  padding-top: 35%;
  margin-bottom: 10px;
  border-radius: 4px;
}

.shop_img img {
  display: block;
  position: absolute;
  min-height: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.shop_img > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  flex-direction: column;
}

.shop_img > div p {
  color: #fff;
  padding: 0 1.25rem;
  overflow: hidden;
}

.shop_img > div p.shop_name {
  font-size: 12px;
  /*margin-bottom: 20px;*/
  line-height: 28px;
  white-space: nowrap;
  border-width: 1px 0;
  border-color: rgba(255, 255, 255, 0.5);
  border-style: solid;
}
.shop_img > div p.shop_name i {
  margin-right: 5px;
}

.shop_img > div p.shop_desc {
  display: -webkit-box;
  max-height: 64px;
  font-size: 0.75rem;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.shop_img > div p.shop_counpon span {
  display: inline-block;
  background: #ffc700;
  border-radius: 2px;
  padding: 0 3px;
  height: 18px;
  line-height: 18px;
  margin-top: 5px;
  font-size: 11px;
  color: #fff;
}
.new_label {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: 75px;
  height: 65px;
  /* z-index: 2; */
  background: url(//files.eyee.com/mcdn/static/img/new_top.png) no-repeat center;
  background-size: cover;
}
.shop_img > div p.shop_name.nameBreak {
  width: 100%;
  border-color: transparent;
  flex-wrap: wrap;
  text-align: center;
}
.shop_img > div p.shop_name.nameBreak > span {
  display: block;
}
.shop_img > div p.shop_name.nameBreak > span.ellipsis {
  width: 100%;
}
</style>
