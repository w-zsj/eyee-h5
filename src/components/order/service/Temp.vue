<template>
  <div>
    <v-header>
      <div class="nav-tab2">
        <h3>售后服务</h3>
      </div>
      <v-server :click="QiyuProd"></v-server>
    </v-header>
    <!-- <div v-if="info.serviceusage==1&&info.issupportaftersale"> -->
    <div v-if="!idSupportReturn.afterSale">
      <ul class="ost-opts">
        <li v-for='i in optlist' :key='i.type' class="flex-between" @click.stop.prevent='goAdd(i.type)'>
          <div class="flex-col">
            <p><img :src='i.img|https' alt="">
              <span>{{i.title}}</span>
            </p>
          </div>
          <i class="ico-lg"></i>
        </li>
      </ul>
    </div>
    <div v-else class="ost-hint">
      <img src="//files.eyee.com/mcdn/static/img/order-service.png" alt="">
      <!-- <p>{{info.serviceusage==2?'国外发货的商品，不支持售后服务,' :'您已经错过了申请售后的时间段(交易完成15天内),'}} -->
      <p>{{idSupportReturn.afterSaleText}} 如果需帮助，您可以咨询
        <a href="javascript:;" class="pay_color" @click="QiyuProd">斗牛在线客服</a>
      </p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { QiyuProd } from '../../../common/api/WyQiyu'
export default {
  data() {
    return {}
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.url = from.path
      if (from.path === '/order/service/info') {
        window.history.go(-1)
      }
    })
  },
  computed: {
    ...mapGetters({ info: 'orderServiceInfo' }),
    optlist() {
      return [
        {
          type: 1,
          img: '//files.eyee.com/mcdn/static/img/order-service-exchange.png', // require('../../../assets/img/order-service-exchange.png'),
          title: '我要换货'
        },
        {
          type: 2,
          img: '//files.eyee.com/mcdn/static/img/order-service-refund.png', // require('../../../assets/img/order-service-refund.png'),
          title: '仅退款不退货'
        },
        {
          type: 3,
          img: '//files.eyee.com/mcdn/static/img/order-service-return.png', // require('../../../assets/img/order-service-return.png'),
          title: '退货并退款'
        }
      ]
    },
    idSupportReturn() {
      let afterSaleData = { afterSale: 1 }
      if (this.info.issupportaftersale) {
        if (this.info.serviceusage == 1) {
          afterSaleData.afterSale = 0
        } else if (this.info.serviceusage == 2) {
          afterSaleData.afterSaleText = '国外发货的商品，不支持售后服务,'
        } else {
          afterSaleData.afterSaleText = '您已经错过了申请售后的时间段(交易完成7天内),'
        }
      } else {
        afterSaleData.afterSale = 1
        afterSaleData.afterSaleText = '该商品不支持售后服务,'
      }
      return afterSaleData
    }
  },
  methods: {
    fetchData() {
      console.log(12345)
    },
    QiyuProd() {

      QiyuProd.call(this)
      console.log('打开客服')
    },
    goAdd(type) {
      console.log('goAdd', type)
      this.$router.push({
        path: '/order/service/add',
        query: { type: type }
      })
      // this.$store.dispatch('setOrderAdd', type)
    }
  }
}
</script>
<style scoped>
.ost-opts {
  padding: 20px 20px 0 0;
}
.ost-opts li {
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
.ost-opts div > p {
  font-size: 15px;
  display: flex;
  align-items: center;
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

