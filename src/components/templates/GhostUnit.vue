<template>
    <div class="ghost_unit">
        <div class="ghost_title font-price">
            <p class="ghostShop_name flex-center">
                <!-- <span class="mall_brandShop" :class="{mall_buyers:ghostShopInfos.businesstype==2}">
                    {{ghostShopInfos.businesstype == 1? '品牌店':'买手店'}}
                </span> -->
                <i :class="ghostShopInfos.businesstype===3?'ico-sp-store':(ghostShopInfos.businesstype===2?'ico-sp-buy':'ico-sp-official')"></i>
                {{ghostShopInfos.businessname}}
            </p>
            <CountDown :countInfos="ghostShopInfos"></CountDown>
        </div>
        <div class="prod_lists clearfix">
            <ProductUnit v-for="(item,ind) in ghostShopInfos.products" :key='ind' :guishiIcon='guishiIcon' :productItem='item' :productType='ghostShopInfos.isactive ? 3:1'></ProductUnit>
        </div>
    </div>
</template>
<script>
    import ProductUnit from './ProductUnit'
    import CountDown from '../mall/CountDown'
    // import { CountDownTime, DateBetween } from '../../common/util.js'
    export default {
      name: 'GhostUnit',
      props: {
        ghostShopInfos: {},
        guishiIcon: { type: Number }
      },
      data() {
        return {

        }
      },
      components: { ProductUnit, CountDown },
      mounted() {
        // console.log(this.ghostShopInfos.begintime)
      },
      computed: {

      },
      methods: {

      }
    }

</script>
<style scoped>
    .ghost_title{
        background: #f2f2f2;
        margin: 0 6px 10px;
        border-radius: 4px;
        padding: 10px 0;
        text-align: center;
    }
    .ghostShop_name{
        font-size: 18px;
    }
    .ghostShop_name::before,.ghostShop_name::after{
        content:'';
        width: 32px;
        height: 1px;
        display: inline-block;
        background:#666666;
    }
    .ghostShop_name::before{
        margin-right: 10px;
    }
    .ghostShop_name::after{
        margin-left: 10px;
    }
    .prod_lists{
        padding: 0 6px;
    }
    .prod_lists .productItem{
        float: left;
        width: 33.33%;
    }
    .prod_lists .productItem:nth-child(3n+1){
        padding:0 4px 0 0;
    }
    .prod_lists .productItem:nth-child(3n+2){
        padding: 0 2px;
    }
    .prod_lists .productItem:nth-child(3n){
        padding:0 0 0 4px;
    }
</style>
