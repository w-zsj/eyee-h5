<template>
    <div class="shop-rec">
        <v-header v-if="!$root.ISAPP">
            <div class="nav-tab2">
                <h3>推荐店铺</h3>
            </div>
        </v-header>
        <div class="shop-wrap" v-for="(item,index) in shopList" :key="index">
            <div class="banner" @click.stop="moreShop(item.id,item.catcategoryname)"><img :src="item.url" alt=""></div>
            <div class="shop-list flex-aic">
                <div class="product-info" v-for="(subitem,indx) in item.business" :key="indx" @click.stop="ShopDetail(subitem.id)">
                    <div class="img"><img :src="subitem.logourl" alt=""></div>
                    <div class="brand-info flex-between flex-col">
                        <div class="logo"><img :src="subitem.headurl" alt=""></div>
                        <div class="logo-name color">{{subitem.businessname}}</div>
                        <div class="fans">{{subitem.businessfans}}</div>
                    </div>
                </div>
            </div>
        </div>
       
    </div> 
</template>
<script>
import {RecommendBuiness} from "../../utils/api/shop" 
export default {
  data() {
    return {
      shopList:[]
    };
  },
  mounted(){
      this.loadShops()
  },
  methods: {
    loadShops() {
      let _ = this;
    
      console.log("潮店参数222");
      RecommendBuiness()
        .then(res => {
          if (res) {
            console.log('店铺数据',res);
            _.shopList = res
          } 
        })
        .catch(e => {
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    ShopDetail(id){
      this.$router.push(`/shop/shopdetail/${id}`)
    },
    moreShop(id,shopname){
         this.$router.push(`/mall/ShopColl/${id}?shopname=${shopname}`)
    }
   
  }
};
</script>
<style scoped>
.color {
  color: #333;
  font-weight: bold;
}
.shop-wrap {
  padding: 8px;
  background: #f2f2f2;
}
.shop-list {
  background: #fff;
  border-radius: 5px;
  padding: 0 1%;
}
.shop-list .product-info {
  width: 33%;
  font-size: 12px;
  color: #333;
  /* padding-bottom: 24px; */
}
.shop-list .product-info:nth-child(2) {
  margin: 0 1%;
}
.shop-list .product-info .logo {
  width: 14vw;
  height: 14vw;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 10px #ccc;
}
.shop-list .product-info .logo-name {
  line-height: 24px;
}
.brand-info {
  position: relative;
  top: -7vw;
}
</style>

