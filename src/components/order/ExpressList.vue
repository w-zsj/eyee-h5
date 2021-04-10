<template>
  <div class="express_box">
    <v-header>
      <div class="nav-tab2">
        <h3>选择物流方式</h3>
      </div>
    </v-header>
    <div @click="seleExpress(item)" class="flex-between express_unit" v-for="(item,index) in defaultExpressList" :key="index">
      <p class="flex-center exp_name">
        <span class="icon_cartSel" :class="{icon_cartSeled:item.selected}"></span>
        <span>{{item.name}} </span>
      </p>
      <p>
        ¥{{item.expressfee | tofixed}}
      </p>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    data() {
      return {
        expressList:{}
      }
    },
    computed: {
      ...mapGetters({ expressT: 'expressT', defaultExpressList: 'defaultExpressList' })
    },
    mounted(){
      console.log(this.defaultExpressList)
    },
    methods: {
      seleExpress(item) {
        let expressList = [...this.defaultExpressList]
        expressList = expressList.map(data => {
           data.selected = false
          return data
        })


        // 选择快递方式
        // this.defaultExpressList = this.defaultExpressList.map((data) => {
        //   data.selected = false
        //   return data
        // })
        item.selected =true
        this.$store.dispatch('setdefaultExpress', item)
        this.$router.go(-1)
      }
    }
  }

</script>
<style scoped>
  .express_unit {
    padding: 15px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
  }

  .exp_name span:nth-of-type(1) {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
</style>
