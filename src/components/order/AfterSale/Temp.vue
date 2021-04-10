<template>
  <div>
    <v-header>
      <div class="nav-tab2">
        <h3>售后服务</h3>
      </div>
      <v-server :click="QiyuProd"></v-server>
    </v-header>
    <div>
      <ul class="ost-opts">
        <li v-for='i in optlist' :key='i.type' class="flex-between" @click.stop.prevent='goAdd(i.refundtype)'>
          <div class="flex-col">
            <div class="temp-list">
              <img :src='i.img|https' alt="" class="flex-center">
              <div>
                <p>{{i.title}}</p>
                <p>{{i.info}}</p>
              </div>
              
            </div>
          </div>
          <i class="ico-lg"></i>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { QiyuProd } from '../../../common/api/WyQiyu'
export default {
  data() {
    return {
      orderno:''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.url = from.path
      if (from.path === '/order/AfterSale/info') {
        window.history.go(-1)
      }
    })
  },
  computed: {
    optlist() {
      return [
        {
          refundtype: 1,
          img: '//files.eyee.com/mcdn/static/img/order-service-refund.png', // require('../../../assets/img/order-service-refund.png'),
          title: '仅退款',
          info:'未收到货'
        },
        {
          refundtype: 2,
          img: '//files.eyee.com/mcdn/static/img/order-service-return.png', // require('../../../assets/img/order-service-return.png'),
          title: '退款并退货',
          info:'已收到货'
        }
      ]
    }
  },
  mounted() {
    var _ = this;
    _.orderno = this.$route.params.id
    console.log('temp收到订单号：',_.orderno)
  },
  methods: {
    QiyuProd() {

      QiyuProd.call(this)
      console.log('打开客服')
    },
    goAdd(refundtype) {
      this.$router.replace({path:'/order/AfterSale/add',query:{orderno:this.orderno,refundtype:refundtype}})
    }
  }
}
</script>
<style scoped>
.ost-opts {
  padding: 20px 20px 0 0;
}
.ost-opts li {
  height:60px;
  padding: 10px 20px;
  margin-bottom: 20px;
  border-radius: 0 40px 40px 0;
  box-shadow: 0 0 4px 0 rgba(209, 209, 209, 0.5);
}
.ost-opts img {
  width: 20px;
  margin-right: 10px;
}
.ost-opts li:last-of-type img {
  width: 24px;
}
.ost-opts div > div.temp-list {
  color:#333;
  font-size: 15px;
  display: flex;
  align-items: center; 
}
.ost-opts div > div.temp-list p:nth-child(2){
  font-size: 11px;
}
.ost-hint {
  text-align: center;
  padding: 20% 10%;
}
.ost-hint > img {
  width: 30%;
  margin: 20% auto 20px;
}
</style>

