import * as types from '../mutation-types'

const state = {
  shopType: 0,
  backaddress: {},
  detailtype: {}, // 1 商品详情进来的 支付成功后回调到商品详情  0  我的出售页进来的 回调到我的出售页
  snkInfo: {}  // 鞋券信息
}

const getters = {
  shopType: state => state.shopType,
  backaddress: state => state.backaddress,
  detailtype: state => state.detailtype,
  snkInfo: state => state.snkInfo
}

const actions = {
  shoptype({ commit, state }, payload) {
    commit(types.SHOP_TYPE, payload)
  },
  backaddress({ commit, state }, payload) {
    commit(types.BACK_ADDRESS, payload)
  },
  detailtype({ commit, state }, payload) {
    commit(types.DETAIL_TYPE, payload)
  },
  snkInfo({ commit, state }, payload) {
    commit(types.SNK_INFO, payload)
  }
}

const mutations = {
  [types.SHOP_TYPE](state, payload) {
    state.shopType = payload
  },
  [types.BACK_ADDRESS](state, payload) {
    state.backaddress = payload
  },
  [types.DETAIL_TYPE](state, payload) {
    state.detailtype = payload
  },
  [types.SNK_INFO](state, payload) {
    state.snkInfo = payload
  }
}

export default { state, getters, actions, mutations }
