<template>
    <div class="brand-wrap">
        <div class="brand-list" v-for="(items,ix) in branList" :key="ix">
            <div class="brand" @click.stop="brandSearch(items.name,items.id)">
                <img v-lazy="https(items.coverurl)" alt="">
                <div class="logo">
                    <div class="logo-img"><img v-lazy="https(items.logourl)" alt=""></div>
                    <span class="">{{items.name}}</span>
                </div>
            </div>
            <div class="shop-pro-list flex-aic" >
              <div class="product" v-for="(subitem,i) in items.products" :key="i"  @click.stop="productDetail(subitem.id)">
                <div class="img">
                  <img v-lazy="https(subitem.mainpic)" alt>
                </div>
                <div class="product-name ellipsis-2" style="-webkit-box-orient: vertical;">{{subitem.businessname}}</div>
                <div class="price">￥{{subitem.specialprice>0?subitem.specialprice:subitem.saleprice}}</div>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
import { BrandHotSale } from "../../utils/api/shop";
export default {
  data() {
    return {
        branList:{}
    };
  },
  mounted(){
      this.brand()
  },
  methods: {
    brand() {
      let _ = this;
      BrandHotSale()
        .then(res => {
          if (res) {
            console.log("品牌数据", res);
            _.branList = res;
           
          }
        })
        .catch(e => {
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    productDetail(id){
        this.$router.push('/productDetail/'+id)
    },
    brandSearch(name,brandid){
        this.$router.push("/results/" + encodeURIComponent(name) + "?brandid=" + brandid);
    }
  }
};
</script>
<style scoped>
.brand-wrap {
  min-height: 100vh;
  background: #f2f2f2;
  padding: 2%;
}
.brand-list {
  margin-bottom: 4%;
}
.brand-list .brand{
  height: 80px;
  overflow: hidden;
  position: relative;
}

.brand-list .brand .logo{
  position: absolute;
  width: 40px;
  height:40px;
  left: 50%;
  top: 35%;
  color: #fff;
  font-size: 12px;
 
  transform: translate(-50%,-50%);
  /* background: rgba(0, 0, 0, 0.5); */
}
.brand-list .brand .logo .logo-img{
  width: 100%;
   border-radius: 50%;
  overflow: hidden;
}
.brand-list .brand img {
  display: block;
}

.shop-pro-list {
  background: #f5f5f5;
  padding-top: 2%;
}
.shop-pro-list .product {
  width: 32%;
  background: #fff;
  border-radius: 6px;
  padding: 0 1.333vw;
}
.shop-pro-list .product:nth-child(2) {
  margin: 0 2.5%;
}
.shop-pro-list .product .img {
  height: 0;
  width: 100%;
  padding-bottom: 100%;
}
.shop-pro-list .product .product-name {
  height: 8vw;
  font-size: 10px;
  color: #999;
  margin-top: 10px;
}
.shop-pro-list .product .price {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  line-height: 35px;
}
</style>


