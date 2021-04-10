<template>
   <div class="subcategory">
        <div class="categoryChild" v-for="(item,index) in category" :key="index" @click="toList(item)" >
            <img :src="item.logourl|https" alt="">
        </div>
   </div>
</template>
<script>
   import { SpecialCategory } from '../../common/api/supreme'
import SupremeUnit from '../templates/SupremeUnit.vue'
   export default{
     data() {
       return {
         category: []
       }
     },
     mounted() {
       this.req()
     },
     methods: {
       req() {
         let params = {
           brandid: this.$route.params.id
         }
         SpecialCategory(params).then((res) => {
           this.initShare()
           console.log(res, 'love')
           this.category = res
         }).catch(err => {
           this.toast(err)
         })
       },
       toList(item) {
         this.$router.push({ name: 'classifyList', params: { id: item.id, name: item.name }})
       }
     },
     components: { SupremeUnit }

   }
</script>
<style scoped>
    .subcategory{
        display: flex;
        flex-wrap:wrap;
    }
    .categoryChild{
        width: 50% !important;
        padding: 10px;
        position: relative;

    }
     .subcategory .categoryChild img{
        width: 100%;
    }
    .subcategory .categoryChild span{
        position: absolute;
        top: 35%;
        transform: translateY(-50%);
        left: 30px;
        z-index: 100;
        border-bottom: 1px solid #ff0000;
        font-size:18px;
        color:#333333;
        letter-spacing:0;
    }
</style>
