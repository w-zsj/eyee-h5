<template>
  <div>
    <v-header>
      <div class="nav-tab2">
        <h3>查看物流</h3>
      </div>
      <div class="server_box flex-center">
        <span class="icon_server" @click="QiyuProd"></span>
      </div>
    </v-header>
    <div class="track_item">
      <section class="flex-between head_name">
        <div class="flex-aic">
          <!-- <span class="mall_brandShop" :class="{'mall_buyers':trackInfo.businesstype == 2}">{{trackInfo.businesstype == 1? '品牌店':'买手店'}}</span> -->
          <i class='ico-sp-glb tilt' v-if="trackInfo.businessisglobalpurchase||trackInfo.isglobalpurchase"></i>
          <i class="tilt" :class="trackInfo.businesstype===3?'ico-sp-store':(trackInfo.businesstype===2?'ico-sp-buy':'ico-sp-official')"></i>
          <!-- <span class="icon_shop cart_shop"></span> -->
          <span class="busName">{{trackInfo.businessname}}</span>
        </div>
        <p>共{{trackInfo.count}}件商品</p>
      </section>
      <div class="flex-aic" v-for="unit in trackInfo.item" :key="unit.id">
        <CartInfoUnit :info="unit" :cartEdit="true" :showIcon="false" :showTrack="true" :cango='false' :trackInfo='trackExpress'></CartInfoUnit>
      </div>
    </div>
    <ul v-if="traces&&traces.length>0" class="traces">
      <li v-for="(item,idx) in traces" :key='idx' class="trace-cell" :class="{act:idx===0}">
        <p>{{item.acceptstation}}</p>
        <p>{{item.accepttime}}</p>
      </li>
    </ul>
    <p class="track_tip" v-else>可能由于系统原因，暂时无法获取快递信息，请前往快递官方网站进行查询或稍后再试。</p>
  </div>
</template>
<script>
import { GetExpressTrack } from '../../common/api/order'
import CartInfoUnit from '../templates/cart/CartInfoUnit'
import { mapGetters } from 'vuex'
import { QiyuProd } from '../../common/api/WyQiyu'
import { DateFormat } from '../../common/util'
export default {
  data() {
    return {
      option: {},
      orderType: 1,
      trackExpress: {},
      traces: []
    }
  },
  components: { CartInfoUnit },
  mounted() {
    console.log('trackInfo', this.trackInfo)
    this.option = {
      orderno: this.$route.params.id
    }
    GetExpressTrack(this.option)
      .then(res => {
        console.log('GetExpressTrack res', res)
        let traces = []
        let statedesc = ''
        if (res && res.orderno) {
          if (res.orderstatus == 3) {
            traces.push({
              acceptstation: '您的订单已完成，如有问题请联系在线客服',
              accepttime: DateFormat(res.confirmgoodtime)
            })
          }
          if (res.traces && res.traces.length > 0) traces = traces.concat(res.traces.reverse())
          traces.push({
            acceptstation: '您购买的商品已出库，等待递送',
            accepttime: DateFormat(this.trackInfo.createtime)
          })
          this.traces = traces

          // 2-在途中,3-签收,4-问题件
          if (res.state == 2) statedesc = '物流状态：在途中'
          else if (res.state == 3) statedesc = '物流状态：已签收'
          else if (res.state == 4) statedesc = '物流状态：问题件'
          res.statedesc = statedesc
          delete res.traces
        }

        this.trackExpress = res
      })
      .catch(err => {
        console.log(err)
      })
  },
  computed: {
    ...mapGetters({ trackInfo: 'trackInfo' })
  },
  methods: {
    QiyuProd() {

      QiyuProd.call(this)
    }
  }
}
</script>
<style scoped>
.traces {
  padding: 20px 10px;
}
.trace-cell {
  position: relative;
  margin-left: 30px;
  margin-bottom: 20px;
  color: #ddd;
  border-bottom: 1px solid #ddd;
}
.trace-cell.act {
  color: #ffc700;
}
.trace-cell::before,
.trace-cell::after {
  content: '';
  position: absolute;
}
.trace-cell::before {
  z-index: 3;
  left: -25px;
  top: 5px;
  border: 6px solid;
  border-radius: 50%;
}
.trace-cell::after {
  left: -20px;
  top: 15px;
  width: 0;
  height: 120%;
  border-left: 2px solid #ddd;
}

.trace-cell p {
  color: #666;
  padding-bottom: 10px;
}
.trace-cell p:first-of-type {
  font-size: 14px;
}
.trace-cell p:last-of-type {
  font-size: 12px;
}

.track_item {
  font-size: 14px;
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  margin: 15px 10px;
  padding: 10px;
  margin-top: 50px;
  border-radius: 4px;
}

.cart_shop {
  width: 15px;
  height: 15px;
  margin-right: 5px;
}

.track_item .head_name {
  border-bottom: 1px solid #fafafa;
  padding-bottom: 10px;
}

.track_tip {
  color: #999;
  width: 80%;
  margin: 60px auto;
  font-size: 14px;
  text-align: center;
}
</style>
