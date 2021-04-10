<template>
  <div>
    <v-header>
      <div class="nav-tab2">
        <h3>我的团购</h3>
      </div>
      <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
    </v-header>
    <div class="order_box">
      <v-list :load-handle='reload' v-if="orderLists && orderLists.length>0" :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
        <div class="order_unit padding" v-for="(item,index) in orderLists" :key="index">
            <OrderGroupList :item="item"></OrderGroupList>
        </div>
      </v-list>
    </div>
    <div class="EmptyPage" v-if="orderLists.length<1 && !isLoading">
        <div class="Img">
          <img src="/static/img/group.png" alt="">
        </div>
        <div>
            <p>还未参加过拼团活动哦</p>
            <p>去看看有什么好东西在开团吧~</p>
        </div>
        <div class="button" @click="golist">
            去逛逛
        </div>
      <!-- <Empty :showType="4"></Empty> -->
    </div>
  </div>
</template>
<script>
import { GetMyGroupBuyList } from '../../common/api/group'
import { mapGetters } from 'vuex'
import OrderUnit from '../templates/order/OrderUnit'
import OrderGroupList from './OrderGroupList'
export default {
  data() {
    return {
      pagedata: { pageindex: 1, sumcount: 0, pagesize: 5 },
      isLoading: false,
      hasLoad: true,
      isEnd: false,
      orderLists: []
    }
  },
  components: { OrderUnit, OrderGroupList },
  mounted() {
    this.$store.dispatch('setOrderList', [])
    this.getOrder()
  },
  computed: {
    ...mapGetters({
      insq: 'insq',
      userInfo: 'userInfo'
    })
  },
  methods: {
    getOrder() {
      if (this.isLoading) return
      this.isLoading = true
      let option = {
        page: this.pagedata.pageindex === 0 ? '' : this.pagedata.pageindex,
        size: this.pagedata.pagesize,
        status: 1
      }
      console.log('测试--提交的参数', option)
      GetMyGroupBuyList(option,this.hasLoad)
        .then(res => {
          console.log('测试orderList', res)
          if (res && res.list) {
            if (res.page === 1) this.orderLists = res.list
            else this.orderLists.push(...res.list)
            if (res.page * res.size >= res.total) this.isEnd = true
          }

          this.isLoading = false
          this.$store.dispatch('setOrderList', this.orderLists)
        })
        .catch(err => {
          this.isLoading = false
          console.error(err)
        })
    },
    golist() {
      // 拼团列表
      this.$router.push('/groupbuy/list')
    },
    reload() {
      // console.log('xiala')
      this.orderLists = []
      this.pagedata.pageindex = 1
      this.isEnd = false
      this.getOrder()
    },
    loadmore() {
      console.log(this.isEnd)
      if (this.isEnd) {
        this.toast('已无更多')
      } else {
        this.pagedata.pageindex += 1
        if (this.pagedata.pageindex > 1)  this.hasLoad = false
        this.getOrder()
      }
    }
  }
}
</script>
<style scoped>
.coupon_head {
  display: flex;
  position: fixed;
  background: #fff;
  z-index: 99;
  width: 100%;
  left: 0;
  top: 48px;
}

.coupon_head p {
  font-size: 12px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  color: #666;
  width: 16.6%;
  text-align: center;
  padding: 10px 0;
}

p.checked {
  border-bottom: 2px solid #333;
  color: #333;
}

.EmptyPage {
  font-size: 14px;
  color: #999;
  text-align: center;
  margin-top: 120px;
}
.EmptyPage .Img {
  width: 76px;
  height: 62px;
  margin: 0 auto;
  margin-bottom: 20px;
  background: #eee;
}
.EmptyPage .button {
  background: #333;
  color: #fff;
  border-radius: 3px;
  width: 88px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin: 20px auto;
}
.padding {
  padding-right: 2px;
}

.cart_shop {
  width: 15px;
  height: 15px;
  margin-right: 5px;
}

.order_unit {
  padding: 0 10px;
  font-size: 12px;
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  border-radius: 4px;
  margin: 15px 10px;
}
</style>
