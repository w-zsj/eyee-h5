<template>
  <div class="look_book" >
     <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3>LOOK BOOK</h3>
      </div>
    </v-header>
    <div v-for="(item,index) in list" :key="item.id">
      <LookBookSwiper :listWrapper ="item" :autoPlay="false" :autoTime="5000"></LookBookSwiper>
    </div>
  </div>
</template>
<script>
    import * as api from '../../common/api/supreme'
    import LookBookSwiper from './LookBookSwiper'
    export default{
      data() {
        return {
          list: []
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
          api.LookBook(params).then((res) => {
            if (res.length) {
              this.list = res

              console.log()
            } else {
              this.toast('lookBook请求失败！')
            }
          }).catch(e => {
            this.toast(e)
          })
        }
      },
      components: {
        LookBookSwiper
      }
    }
</script>
<style scoped>
  .nav-tab2 >>> .nav-tab2 h3 {
    font-size:16px;
    font-family:DINOT-CondBlack;
    font-weight:normal;
  }
  .look_book{
    padding-top: 10px;
  }
</style>
