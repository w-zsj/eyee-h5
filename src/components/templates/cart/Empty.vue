<template>
  <div class="cart_blank">
    <img :src="realdata.icon|https" :class="{coupon_bank:showType==3}">
    <p> {{realdata.text}}<br>{{realdata.des}}</p>
    <template v-if="!insq">
      <router-link class="to-home-button" :to="realdata.tolink">去逛逛</router-link>
      <p class="reco_title"></p>
      <Recomd-prods v-if="recomdPros.length>0" :recodsList='recomdPros' :isHideTitle='true' :upStyle="true"></Recomd-prods>
    </template>
  </div>
</template>
<script>
import { ProdSearch } from '../../../common/api/product'
import RecomdProds from '../RecomdProds'
import { mapGetters } from 'vuex'
export default {
  props: {
    showType: { type: Number, default: 0 }
  },
  data() {
    return {
      nocart: '//files.eyee.com/mcdn/static/img/cart_blank.png', // require('../../../assets/img/cart_blank.png'),
      recomdPros: [],
      postData: { issearchall: 1, pageindex: 1 }, // issearchall:0有条件1是无条件
      showData: [
        // { type: 0, text: '购物车还是空的', des: '去挑几件中意的商品吧', icon: require('../../../assets/img/cart_blank.png'), tolink: this.insq ? '/mall/discount' : '/mall' },
        // { type: 1, text: '您还没有收藏商品哦', des: '赶紧收藏几个吧', icon: require('../../../assets/img/favproduct_blank.png'), tolink: '/mall' },
        // { type: 2, text: '您还没有收藏潮店哦', des: '赶紧收藏几个吧', icon: require('../../../assets/img/favproduct_blank.png'), tolink: '/mall' },
        // { type: 3, text: '您没有可用的优惠券', des: '', icon: require('../../../assets/img/user/coupon_blank.png'), tolink: '/coupon' },
        // { type: 4, text: '您暂时还没有相关订单', des: '', icon: require('../../../assets/img/user/order_blank.png'), tolink: '/' },
        // { type: 5, text: '您还没有收藏资讯哦', des: '赶紧收藏几个吧', icon: require('../../../assets/img/favproduct_blank.png'), tolink: '/news' },
        // { type: 6, text: '您没有可用的卡包', des: '', icon: require('../../../assets/img/user/coupon_blank.png'), tolink: '/coupon' }
        { type: 0, text: '购物车还是空的', des: '去挑几件中意的商品吧', icon: '//files.eyee.com/mcdn/static/img/cart_blank.png', tolink: this.insq ? '/mall/discount' : '/' },
        { type: 1, text: '您还没有收藏商品哦', des: '赶紧收藏几个吧', icon: '//files.eyee.com/mcdn/static/img/favproduct_blank.png', tolink: '/' },
        { type: 2, text: '您还没有收藏潮店哦', des: '赶紧收藏几个吧', icon: '//files.eyee.com/mcdn/static/img/favproduct_blank.png', tolink: '/' },
        { type: 3, text: '您没有可用的优惠券', des: '', icon: '//files.eyee.com/mcdn/static/img/user/coupon_blank.png', tolink: '/coupon' },
        { type: 4, text: '您暂时还没有相关订单', des: '', icon: '//files.eyee.com/mcdn/static/img/user/order_blank.png', tolink: '/' },
        { type: 5, text: '您还没有收藏资讯哦', des: '赶紧收藏几个吧', icon: '//files.eyee.com/mcdn/static/img/favproduct_blank.png', tolink: '/news' },
        { type: 6, text: '您没有可用的卡包', des: '', icon: '//files.eyee.com/mcdn/static/img/user/coupon_blank.png', tolink: '/home' },
        { type: 7, text: '您没有可用的红包', des: '', icon: '//files.eyee.com/mcdn/static/img/user/coupon_blank.png', tolink: '/home' },
        { type: 8, text: '您没有已使用的优惠券', des: '', icon: '//files.eyee.com/mcdn/static/img/user/coupon_blank.png', tolink: '/coupon' },
        { type: 9, text: '您没有已使用的红包', des: '', icon: '//files.eyee.com/mcdn/static/img/user/coupon_blank.png', tolink: '/home' },
        { type: 10, text: '您没有已使用的卡包', des: '', icon: '//files.eyee.com/mcdn/static/img/user/coupon_blank.png', tolink: '/home' },
        { type: 11, text: '您没有已过期的优惠券', des: '', icon: '//files.eyee.com/mcdn/static/img/user/coupon_blank.png', tolink: '/coupon' },
        { type: 12, text: '您没有已过期的红包', des: '', icon: '//files.eyee.com/mcdn/static/img/user/coupon_blank.png', tolink: '/home' },
        { type: 13, text: '您没有已过期的卡包', des: '', icon: '//files.eyee.com/mcdn/static/img/user/coupon_blank.png', tolink: '/home' },
        { type: 14, text: '您没有可用优惠', des: '', icon: '//files.eyee.com/mcdn/static/img/user/coupon_blank.png', tolink: '/coupon' },
        { type: 15, text: '您没有不可用优惠', des: '', icon: '//files.eyee.com/mcdn/static/img/user/coupon_blank.png', tolink: '/coupon' },
      ]
    }
  },
  components: {
    RecomdProds
  },
  mounted() {
    if (this.realdata.type !== 3 && !this.insq) this.getRecomtPro()
  },
  methods: {
    getRecomtPro() {
      ProdSearch(this.postData)
        .then(res => {
          if (res) {
            console.log('prod search', res)
            this.recomdPros = res.list
          }
        })
        .catch(e => {
          this.toast(e && e.msg ? e.msg : 'error:' + e)
        })
    },
  },
  computed: {
    ...mapGetters({ insq: 'insq' }),
    realdata() {
      console.log(this.showType)
      let option = {}
      for (var i = 0; i < this.showData.length; i++) {
        if (this.showType == this.showData[i].type) {
          option = this.showData[i]
        }
      }
      return option
    }
  }
}
</script>
<style scoped>
.cart_blank {
  text-align: center;
}

.cart_blank > img {
  display: block;
  width: 20% !important;
  margin: 30% auto 0;
}

.cart_blank > p {
  margin: 20px auto;
  line-height: 20px;
  color: #999;
  font-size: 14px;
}

.cart_blank > p.reco_title {
  position: relative;
  width: 150px;
  height: 30px;
  color: #333;
  margin: 35px auto 20px;
  border-top: 1px solid #333;
}

.to-home-button {
  display: inline-block;
  color: #fff;
  font-size: 15px;
  background: #333;
  padding: 5px 30px;
  -webkit-border-radius: 2px;
  border-radius: 2px;
}

.cart_blank > p.reco_title {
  position: relative;
  width: 150px;
  height: 30px;
  color: #333;
  margin: 35px auto 20px;
  border-top: 1px solid #333;
}

.reco_title:after {
  content: '商品推荐';
  position: absolute;
  width: 100px;
  background: #fff;
  top: 50%;
  left: 50%;
  margin-left: -50px;
  margin-top: -25px;
}
</style>
