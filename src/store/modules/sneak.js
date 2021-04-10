import * as types from '../mutation-types'

const state = {
  sneakBrandCate: {},
  newsSearchSneaker: 0,
  saleSneakInfo: {},
  tabid:''
  // HotSale:{}
}

const getters = {
  tabid: state => state.tabid,
  sneakBrandCate: state => state.sneakBrandCate,
  newsSearchSneaker: state => state.newsSearchSneaker,
  saleSneakInfo: state => state.saleSneakInfo
  // HotSale: state => state.HotSale,
}

const actions = {
  tabid({ commit, state }, payload) {
    commit(types.TABID, payload)
  },
  setSneakBrandCate({ commit, state }, payload) {
    commit(types.SNEAK_BRAND_CATE, payload)
  },
  setNewsSearchSneaker({ commit, state }, payload) {
    commit(types.NEWS_SEARCH_SNEAKER, payload)
  },
  addSaleSneakInfo({ commit, state }, payload) {
    commit(types.ADD_SALE_SNEAK_INFO, payload)
  }
}

const mutations = {
  [types.TABID](state, payload) {
    state.tabid = payload
  },
  [types.SNEAK_BRAND_CATE](state, payload) {
    state.sneakBrandCate = payload
  },
  [types.NEWS_SEARCH_SNEAKER](state, payload) {
    state.newsSearchSneaker = payload
  },
  [types.ADD_SALE_SNEAK_INFO](state, payload) {
    state.saleSneakInfo = payload
  }
}

export default { state, getters, actions, mutations }
