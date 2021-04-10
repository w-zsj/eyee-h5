<template>
  <div class="cart" v-if="hasdata>0">
    <v-header :showback='false'>
      <div class='nav-back'></div>
      <div class="nav-tab2">
        <h3>购物车</h3>
      </div>
      <div class="server_box flex-center">
        <span class="icon_server" @click.stop="QiyuProd">
        </span>
      </div>
    </v-header>
    <div v-if="hasdata>1&&cartList.length<1">
      <Empty></Empty>
    </div>
    <div v-else-if="cartList&&cartList.length>0" :style="'margin-top:'+(insq?10:50)+'px'">
      <shopCartUnit v-for="(item,index) in cartList" :key="index" :cartInfo="item" :index="index"></shopCartUnit>
    </div>
    <!-- <CartModal></CartModal> -->

    <product-items :show="cartEditShow" :product-info="cartEditUnit" @close='itemsClose'></product-items>
  </div>
  <v-error v-else></v-error>
</template>
<script>
import * as cart from '../../common/api/cart'
import shopCartUnit from '../templates/cart/ShopCartUnit'
// import CartModal from '../templates/CartModal'
import ProductItems from '@/comps/ProductItems'
import Empty from '../templates/cart/Empty'
import { mapGetters, mapMutations } from 'vuex'
import { QiyuProd } from '../../common/api/WyQiyu'
const ls = window.localStorage
const cartkey = 'FC_LOCAL_CART'

export default {
  data() {
    return {
      // insq: window.INSQ,
      hasdata: 1,
      cartLists: []
    }
  },
  computed: {
    ...mapGetters({
      cartList: 'cartList',
      user: 'userInfo',
      insq: 'insq',
      cartEditShow: 'cartEditShow',
      cartEditUnit: 'cartEditUnit',
      cartDoDel: 'cartDoDel'
    }),
    // user() {
    //   return JSON.parse(ls.getItem('currentUser'))
    // },
    dealLocal() {
      // return window.INSQ && !(this.user || {}).uid
      return this.insq && !(this.user || {}).uid
    }
  },
  mounted() {
    let _ = this
    // if (_.dealLocal) _.getLocalCart()
    // else _.getCartList()
    if (_.user.token) _.getCartList()
    else {
      setTimeout(() => {
        _.getCartList()
      }, 800)
    }
  },
  components: {
    shopCartUnit,
    // CartModal,
    ProductItems,
    Empty
  },
  watch: {
    cartDoDel(val, oldval) {
      console.log('watch cartDoDel', val, oldval)
      if (val) {
        let _ = this
        _.doDel(false)
        if (_.dealLocal) _.delLocalCart()
        else _.delCart()
      }
    }
  },
  methods: {
    ...mapMutations({ editShow: 'SET_CART_EDIT_SHOW', setEditUnit: 'SET_CART_EDIT_UNIT', doDel: 'SET_CART_DO_DEL' }),
    splitArray(arr) {
      var newarr = new Array()
      var arr_len = 0
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].newItem.length; j++) {
          newarr[newarr.length] = {
            businessid: arr[i].businessid,
            businessname: arr[i].businessname,
            businesstype: arr[i].businesstype,
            isglobalpurchase: arr[i].isglobalpurchase,
            createtime: arr[i].createtime,
            isopen: arr[i].isopen,
            // 'cartItem' : arr[i].newItem[j],
            items: arr[i].newItem[j].data
          }
        }
      }
      // console.log(newarr)
      return newarr
    },
    getLocalCart() {
      let carts = JSON.parse(ls.getItem(cartkey) || '[]')
      this.hasdata = 2
      this.dealCart(carts)
    },
    getCartList() {
      cart
        .GroupList()
        .then(res => {
          this.hasdata = 2
          // console.log('购物车列表', res)
          this.dealCart(res)
        })
        .catch(e => {
          this.hasdata = 0
          this.toast('购物车加载失败')
          console.error('✖购物车加载失败', e)
        })
    },
    updLocalCart(item) {
      let unit = this.cartEditUnit
      let cart = JSON.parse(ls.getItem(cartkey) || '[]')
      cart = cart.map(c => {
        if (c.businessid === item.businessid) {
          let delIdx = -1
          let del = false
          c.items = c.items.map((i, idx) => {
            if (i.id === unit.id) {
              if (i.productitemid === item.productitemid) i.count = item.count
              else {
                delIdx = idx
                i = { ...item }
              }
            } else {
              if (i.productitemid === item.productitemid) {
                i.count += item.count
                del = true
              }
            }
            return i
          })
          if (delIdx > -1 && del) c.items.splice(delIdx, 1)
        }
        return c
      })
      console.log('updLocalCart', cart)
      ls.setItem(cartkey, JSON.stringify(cart))
      this.dealCart(cart)
      this.toast('修改成功')
    },
    updCart(item) {
      cart
        .Update({ id: this.cartEditUnit.id, productitemid: item.productitemid, count: item.count })
        .then(res => {
          // console.log('购物车修改成功', res)
          this.dealCart(res)
          this.toast('修改成功')
        })
        .catch(e => {
          console.error('购物车修改失败', e)
          this.toast('修改失败')
        })
    },
    delLocalCart() {
      let unit = this.cartEditUnit
      let cart = JSON.parse(ls.getItem(cartkey) || '[]')
      let pDelIdx = -1
      cart = cart.map((c, cidx) => {
        if (c.businessid === unit.businessid) {
          let delIdx = c.items.findIndex(i => i.id === unit.id)
          if (delIdx > -1) c.items.splice(delIdx, 1)
        }
        if (!(c.items && c.items.length > 0)) pDelIdx = cidx
        return c
      })
      if (pDelIdx > -1) cart.splice(pDelIdx, 1)
      console.log('delLocalCart', cart)
      ls.setItem(cartkey, JSON.stringify(cart))
      this.dealCart(cart)
      this.toast('删除成功')
    },
    delCart() {
      let unit = this.cartEditUnit
      cart
        .Delete({ id: unit.id, productitemid: unit.productitemid })
        .then(res => {
          // console.log('购物车删除成功', res)
          this.dealCart(res)
          this.toast('删除成功')
        })
        .catch(e => {
          console.error('购物车删除失败', e)
          this.toast('删除失败')
        })
    },
    dealCart(res) {
      let carts = []
      if (res) {
        for (let s = 0; s < res.length; s++) {
          var map = {}
          var dest = []
          for (var i = 0; i < res[s].items.length; i++) {
            var ai = res[s].items[i]
            if (!map[ai.expresstemplateid]) {
              dest.push({
                expresstemplateid: ai.expresstemplateid,
                data: [ai]
              })
              map[ai.expresstemplateid] = ai
            } else {
              for (var j = 0; j < dest.length; j++) {
                var dj = dest[j]
                if (dj.expresstemplateid == ai.expresstemplateid) {
                  dj.data.push(ai)
                  break
                }
              }
            }
          }
          res[s].newItem = [].concat(dest)
        }
        res = [].concat(this.splitArray(res))
        res = res.map(data => {
          data.count = 0
          data.checked = false
          data.disable = true
          data.allPay = 0
          data.cartEdit = true
          data.item = data.items.map(i => {
            i.checked = false
            if (i.specialprice > 0) {
              i.pay = i.count * i.specialprice
              i.saleprice = i.specialprice
            } else {
              i.pay = i.count * i.saleprice
            }
            return i
          })
          return data
        })
        carts = res
        this.cartLists = carts
        console.log('deal cart***', carts)
      }
      this.$store.dispatch('setCartList', carts)
    },
    QiyuProd() {

      QiyuProd.call(this)
    },
    itemsClose(item) {
      // console.log('itemsClose', item)
      let _ = this
      _.editShow(false)
      if (item && item.id) {
        if (_.dealLocal) _.updLocalCart(item)
        else _.updCart(item)
      }
    }
  }
}
</script>
