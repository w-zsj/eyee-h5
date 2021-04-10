<template>
  <div class="product_list">
    <ProductSearchList :styleType='2'> </ProductSearchList>
  </div>
</template>
<script>
import ProductSearchList from '../templates/ProductSearchList'
export default {
  components: { ProductSearchList },
  mounted() {

  }
}
</script>
<style scoped>
/**/
.prod_disc {
  padding: 0 10px;
}
.productList {
  width: 50%;
  box-sizing: border-box;
  display: inline-block;
  text-align: center;
}
.productList:nth-child(2n + 1) {
  padding-right: 5px;
}
.productList:nth-child(2n) {
  padding-left: 15px;
}
</style>
