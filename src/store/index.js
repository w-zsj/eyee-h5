import Vue from 'vue'
import Vuex from 'vuex'
import base from './modules/base'
import news from './modules/news'
import product from './modules/product'
import mall from './modules/mall'
import sneak from './modules/sneak'
import snekc2c from './modules/snekc2c'
import supreme from './modules/supreme'
import user from './modules/user'
import order from './modules/order'
import cart from './modules/cart'
import group from './modules/group'
import auction from './modules/auction'
import oxball from './modules/oxball'
import activity from './modules/activity'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: { base, news, product, mall, sneak, supreme, user, order, cart, group, snekc2c, auction, oxball,activity }
})

export default store
