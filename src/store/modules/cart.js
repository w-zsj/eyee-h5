import * as types from '../mutation-types'

const state = {
  hasCart: false,
  cartList: [],
  showCartModel: false,
  productSeleItem: {},
  editData: {},
  cartType: 0,
  cartEditShow: false,
  cartDoDel: false,
  cartEditUnit: {}
}
const getters = {
  hasCart: state => state.hasCart,
  cartList: state => state.cartList,
  showCartModel: state => state.showCartModel,
  productSeleItem: state => state.productSeleItem,
  editData: state => state.editData,
  cartType: state => state.cartType,
  cartEditShow: state => state.cartEditShow,
  cartDoDel: state => state.cartDoDel,
  cartEditUnit: state => state.cartEditUnit
}
const actions = {
  setCartList({ commit, state }, payload) {
    commit(types.SET_CART_LIST, payload)
  },
  editCart({ commit, state }, payload) {
    commit(types.EDIT_CART, payload)
  },
  setProductItems({ commit, state }, payload) {
    commit(types.PRODUCT_SELE_ITEM, payload)
  }
}

const mutations = {
  [types.SET_CART_LIST](state, payload) {
    state.cartList = payload
  },
  [types.EDIT_CART](state, payload) {
    state.editData = payload.data
    state.showCartModel = true
  },
  [types.PRODUCT_SELE_ITEM](state, payload) {
    state.productSeleItem = payload
  },
  [types.SET_CART_EDIT_SHOW](state, payload) {
    console.log('[*mutations]SET_CART_EDIT_SHOW', payload)
    state.cartEditShow = payload
  },
  [types.SET_CART_EDIT_UNIT](state, payload) {
    console.log('[*mutations]SET_CART_EDIT_UNIT', payload)
    state.cartEditUnit = payload
  },
  [types.SET_CART_DO_DEL](state, payload) {
    console.log('[*mutations]SET_CART_DO_DEL', payload)
    state.cartDoDel = payload
  }
}

export default { state, getters, actions, mutations }
