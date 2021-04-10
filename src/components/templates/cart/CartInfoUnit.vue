<template>
  <div class="flex-aic cart_content" :class="{track_h:showTrack}" @click="cango?goDetail():''">
    <p v-if="showIcon&&info.isok" class="cart_chang" :class="{icon_cartSel:!info.checked,icon_cartSeled:info.checked}" @click.stop="checkItem(info)"></p>
    <p v-if="showIcon&&!info.isok" class="cart_chang" :class="{'unUser_icon':!info.isok}" @click.stop='noop'>无效</p>
    <div class="img_box">
      <img :src="info.colorimg" alt="">
      <span v-if="showIcon&&!info.isok" class="unUser_pro">此商品已下架</span>
    </div>
    <div class="cart_info" v-if="!showTrack">
      <template v-if="cartEdit">
        <div>
          <!-- info.cutSurplusPrice||cutminprice ishelpcutorder|| v-if='info.cutSurplusPrice||cutminprice'-->
          <p class="ellipsis-2">{{info.productname}}</p>
          <!-- 购物车专有逻辑 -->
          <div v-if="isCart">
            <p v-if="producttype==10||info.producttype==10">
              单价：¥{{info.salemoneytotal||originalprice||info.salemoney}}&nbsp;&nbsp;&nbsp;
              <span v-if='info.cutSurplusPrice||cutminprice||cutpriceInfo.cutminprice'>可砍至：<em class="cutminprice" >¥{{info.cutSurplusPrice||cutminprice||cutpriceInfo.cutminprice}}</em></span>
            </p>
            <p v-else-if="(info.saleprice&&info.specialprice==0)||info.saleprice==info.specialprice">
              单价：¥{{info.saleprice}}
            </p>
            <p v-else-if="info.saleprice&&info.specialprice&&info.specialprice<info.saleprice&&info.specialprice>0">
              单价：¥{{info.specialprice}}
            </p>
          </div>
          <!-- 订单列表 订单详情 逻辑 B2C商品-->
          <div v-if="!isC2C && !isCart">
            <p v-if="producttype==10||info.producttype==10">
              单价：¥{{info.salemoneytotal||originalprice||info.salemoney}}&nbsp;&nbsp;&nbsp;<span v-if="usenewballs">+{{usenewballs}}牛丸</span>
              <span v-if='info.cutSurplusPrice||cutminprice||cutpriceInfo.cutminprice'>可砍至：<em class="cutminprice" >¥{{info.cutSurplusPrice||cutminprice||cutpriceInfo.cutminprice}}</em></span>
            </p>
            <p v-else-if="info.saleprice">
              单价：¥{{info.saleprice}}<span v-if="usenewballs">+{{usenewballs}}牛丸</span>
            </p>
          </div>
          <p :class="{overcount:info.overCount}">{{info.color}} , {{info.size}} , x{{info.count}}</p>
        </div>
      </template>
      <template v-else>
        <div class="flex">
          <div @click.stop="updataCart(info)" class="edit_box">
            <div class="input_div">
              <span>-</span>
              <input type="number" name="" v-model="info.count" readonly>
              <span>+</span>
            </div>
            <p class="sele_box flex">
              <span class="ellipsis">{{info.color}}</span>
              <span class="ellipsis">{{info.size}} </span>
            </p>
          </div>
          <div @click.stop="deleCart(info)" class="btn_dele flex-center">删除</div>
        </div>
      </template>
    </div>
    <div v-else class="track_box">
      <p class="ellipsis">{{info.productname}}</p>
      <p v-if="trackInfo&&trackInfo.statedesc">{{trackInfo.statedesc}}</p>
      <p v-if="trackInfo&&trackInfo.expresscompany">承运来源：{{trackInfo.expresscompany}}</p>
      <p v-if="trackInfo&&trackInfo.expresscompany">运单编号：{{trackInfo.expressno}}</p>
    </div>
    <div class="aftersale" v-if="orderType===2&&info.assdesc " @click.stop.prevent="goService">{{info.assdesc}}</div>
  </div>
</template>
<script>
// import * as CartApi from '../../../common/api/cart'
// import { ENUM } from '../../../common/util'
import { mapGetters, mapMutations } from 'vuex'
// import { QiyuProd } from "../../../common/api/WyQiyu";
export default {
  props: {
    info: Object,
    cango: { type: Boolean, default: true },
    cartEdit: { type: Boolean, default: false },
    showIcon: { type: Boolean, default: true },
    showTrack: { type: Boolean, default: false },
    trackInfo: Object,
    status: { type: Number },
    orderType: { type: Number },
    orderitemid: Array,
    originalprice: { type: Number },
    cutminprice: { type: Number },
    producttype:{ type: Number },
    ishelpcutorder: { type: Boolean },
    usenewballs: {type: Number}, // 该订单使用了多少牛丸
    isC2C: {type: Number}, // 订单列表来的 该订单是不是c2c订单
    isCart: {type: Number} // 购物车来的
  },
  data() {
    return {
      // insq: window.INSQ,
      option: {},
      checked: false
    }
  },
  mounted() {
  // console.log('订单列表', this.cutminprice)
  },
  methods: {
    ...mapMutations({ editShow: 'SET_CART_EDIT_SHOW', setEditUnit: 'SET_CART_EDIT_UNIT', doDel: 'SET_CART_DO_DEL' }),
    goDetail() {
      // console.log(this.info)
      // if (this.orderType == 2) {
     
      this.$router.push('/productDetail/' + this.info.productid)
      // }
    },
    updataCart(info) {
      if (!info.isok) {
        this.toast('商品已下架')
        return
      }
      this.setData(info)
      console.log('updataCart----', info)
      this.setEditUnit(info)
      this.editShow(true)
      // this.$store.state.cart.cartType = ENUM.cartType.update.val
      // this.$store.dispatch('editCart', { data: info })
    },
    deleCart(info) {
      this.setData(info)
      console.log('deleCart----', info)
      this.setEditUnit(info)
      this.doDel(true)

      // CartApi.Delete(this.option)
      //   .then(res => {
      //     var lt = this.cartList
      //     for (var i = 0; i < lt.length; i++) {
      //       if (info.businessid == lt[i].businessid) {
      //         if (lt[i].items) {
      //           var t = lt[i].items
      //           for (var j = 0; j < t.length; j++) {
      //             if (info.productitemid == t[j].productitemid) {
      //               t.splice(j, 1)
      //             }
      //           }
      //         }
      //         if (lt[i].items.length < 1) {
      //           lt.splice(i, 1)
      //         }
      //       }
      //     }
      //     this.toast('删除成功!')
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    },
    setData(info) {
      this.option.id = info.id
      this.option.productitemid = info.productitemid
      this.option.businessid = info.businessid
      this.option.productid = info.productid
      this.option.token = this.insq ? '' : this.userInfo.token
    },
    checkItem(info) {
      if (info.isok) info.checked = !info.checked
      this.$emit('cartCheck', info)
    },
    goService() {
      let _ = this
      //  console.log('goService----------',_.info.issupportaftersale,_.info)
      _.$store.dispatch('setOrderServiceInfo', _.info)
      if (_.info.aftersalestatus === 0) {
        _.$router.push('/order/service/temp')
      } else {
        _.$router.push('/order/service/info')
      }
    },
    noop() {}
  },
  computed: {
    ...mapGetters({ insq: 'insq', userInfo: 'userInfo', cartList: 'cartList',cutpriceInfo:'cutpriceInfo' })
  }
}
</script>
<style scoped>
.cart_content {
  width: 100%;
  position: relative;
  height: 110px;
  border-bottom: 1px solid #fafafa;
  padding: 0 10px;
}

.cart_content .cart_info {
  width: 75%;
  font-size: 12px;
}

.cart_content .img_box {
  position: relative;
  width: 23%;
  margin-right: 6px;
}
.cart_content .img_box .unUser_pro {
  position: absolute;
  display: inline-block;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  padding: 0 5px;
  color: #fff;
  text-align: center;
}

.cart_chang {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 6px;
  top: 0;
  left: 0;
  color: #fff;
  display: flex;
  padding: 0 20px;
  align-items: center;
  line-height: 17px;
}
.cart_chang.unUser_icon {
  display: block;
  line-height: 20px !important;
  width: 40px;
  font-size: 11px;
  color: #fff;
  background: #666;
  border-radius: 4px;
  line-height: 10px;
  padding: 0;
  text-align: center;
}
.cart_info p {
  margin: 5px 0;
}
.cart_info .spec_sale {
  text-decoration: line-through;
  color: #666;
}
.edit_box {
  width: 70%;
}

.edit_box .input_div {
  width: 100%;
  border: 1px solid #666;
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.input_div input {
  width: 60%;
  height: 100%;
  text-align: center;
  float: left;
  border-left: 1px solid #666;
  border-right: 1px solid #666;
}

.input_div span {
  width: 20%;
  height: 100%;
  text-align: center;
  float: left;
}

.sele_box {
  width: 100%;
  justify-content: space-between;
}

.edit_box .sele_box span {
  display: inline-block;
  border: 1px solid #666;
  padding: 5px;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
  width: 40%;
}

.btn_dele {
  height: 100%;
  width: 56px;
  font-size: 16px;
  background: #333;
  color: #fff;
  position: absolute;
  right: 0;
  top: 0;
}
.track_box {
  font-size: 12px;
  width: 70%;
}
.track_box p {
  line-height: 20px;
}
.track_h {
  border-bottom: none;
}
#app .overcount {
  color: #af3c03;
}
.aftersale {
  width: 80px;
  height: 26px;
  border-radius: 4px;
  line-height: 26px;
  text-align: center;
  margin-top: 40px;
  border: 1px solid darkgray;
}
.cutminprice{
  color: #ffc700;
}
</style>
