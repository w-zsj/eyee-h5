<template>
  <div class="salesList">
    <v-header class="v-header">
      <div class="categoryName">{{$route.params.name}}</div>
      <v-cart></v-cart>
    </v-header>
    <div class="clearfix">
      <SupremeUnit v-if="classifyLists.length" v-for="(item,index) in classifyLists" :key="index" :supProduct="item"></SupremeUnit>
    </div>
    <v-delay :delay="800" class='no-more'>已经到底啦~~</v-delay>
  </div>
</template>
<script>
import SupremeUnit from '../templates/SupremeUnit'
import { BrandSpecialSale } from '../../common/api/supreme'
export default {
  data() {
    return {
      classifyLists: []
    }
  },
  mounted() {
    this.req()
  },
  methods: {
    req() {
      let params = { categoryid: this.$route.params.id }
      BrandSpecialSale(params)
        .then(res => {
          //                    console.log('classifyLists',res);
          if (res) {
            this.classifyLists = res
          }
        })
        .catch(err => {
          this.toast(err)
        })
    },
    toSaleDetail(data) {
      this.$router.push({ name: 'salesDetail', params: { id: data.id }})
    }
  },
  components: { SupremeUnit }
}
</script>
<style scoped>
.categoryName {
  display: flex;
  flex: 1;
  line-height: 48px;
  justify-content: center;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
}
.sup_list {
  float: left;
  width: 33.33%;
}
</style>
