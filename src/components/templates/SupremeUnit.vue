<template>
  <div class="sup_list" @click="toSaleDetail(supProduct)">
    <img width="100" height="100" :src="supProduct.coverpic|https" alt="">
    <p class="saleName font-price">{{supProduct.name}}</p>
    <p v-if="supProduct.stock>0" class="salePrice font-price">¥{{supProduct.price |tofixed}}+</p>
    <p v-if="supProduct.stock<0" class="coming">COMEING SOON</p>
    <p v-if="supProduct.stock==0" class="soldOut">SOLD OUT</p>
  </div>
</template>
<script>
export default {
  props: {
    supProduct: { type: Object }
  },
  methods: {
    toSaleDetail(data) {
      this.$router.push('/BrandSpecialDetail/' + data.id)
    }
  }
}
</script>
<style scoped>
.sup_list {
  margin: 0px;
}
.coming,
.soldOut {
  font-size: 12px;
  color: #ff0000;
  letter-spacing: 0;
}
.sup_list {
  width: 33.33%;
  padding: 5px;
}
.sup_list p {
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  line-height: 12px;
}
.sup_list > p {
  height: 18px;
  line-height: 18px;
}
.sup_list .saleName {
  color: #999999;
  text-align: center;
}
.sup_list .salePrice {
  color: #333333;
  /*margin-top: 5px;*/
}
</style>
