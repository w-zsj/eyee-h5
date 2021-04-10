<template>
  <div class="onsale_list" @click="goDetail(onsaleInfo.productid)">
    <div class="flex-center">
      <div class="shop_img" :class="{'soldout':onsaleInfo.stock==0}">
        <img :src="onsaleInfo.mainpic | firstImg|https" alt="">
        <span></span>
      </div>
      <div class="shop_infos">
        <p class="shop_name flex-aic">
          <!-- <span class="mall_brandShop" :class="{'mall_buyers':onsaleInfo.businesstype==2}">{{onsaleInfo.businesstype == 2?'买手店':'品牌店'}}</span> -->
          <i :class="onsaleInfo.businesstype===3?'ico-sp-store':(onsaleInfo.businesstype===2?'ico-sp-buy':'ico-sp-official')"></i>
          <span class="ellipsis">{{onsaleInfo.businessname}}</span></p>
        <p class="shop_sendplace">发货地：{{onsaleInfo.sendplace}}</p>
        <p class="shop_price font-price">¥{{onsaleInfo.price.toFixed(2)}}+</p>
      </div>
      <div class="cart_img" :class="{'soldout':onsaleInfo.stock==0}">
        <span></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'onsale-unit',
  props: {
    onsaleInfo: { type: Object }
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {},
  methods: {
    goDetail(id) {
      this.$router.push('/productDetail/' + id)
    }
  }
}
</script>
<style scoped>
.onsale_list {
  margin: 0 10px 10px;
  background-color: #fff;
  box-shadow: 0 0 4px 0 rgba(204, 204, 204, 0.5);
  border-radius: 4px;
  padding: 10px 5px;
}
.shop_infos {
  padding: 0 8px;
  width: 70%;
}

.shop_infos p {
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  /*white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;*/
}

.shop_infos p.shop_name {
  color: #333;
}
.shop_infos .shop_name .ellipsis {
  max-width: 80%;
}

.shop_infos p.shop_sendplace {
  color: #999;
  font-size: 12px;
}

.shop_infos p.shop_price {
  color: #333;
  font-weight: 600;
}
.shop_img {
  width: 25%;
}

.shop_img.soldout {
  position: relative;
}

.shop_img.soldout > span {
  position: absolute;
  display: inline-block;
  width: 100%;
  height: 40px;
  top: 50%;
  margin-top: -20px;
  background: url(//files.eyee.com/mcdn/static/img/sneaker/soldout.png) no-repeat center;
  background-size: contain;
}

.cart_img {
  background-color: #333;
  height: 40px;
  border-radius: 50%;
}

.cart_img.soldout {
  background-color: #999;
}

.cart_img span {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: url('//files.eyee.com/mcdn/static/img/cart_light.png') no-repeat center;
  background-size: 26px 21px;
}
</style>
