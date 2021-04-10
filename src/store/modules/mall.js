import * as types from '../mutation-types'

const state = {
  shopLists: [],
  shopFixedMenu: false,
  shopMainCont: true,
  isShowTopNavi: false,
  shopDetail: {},
  isShopSearchPage: false,
  setprice: { beginprice: null, endprice: null },
  ghostInfo: {},
  ghostProList: [],
  ghostList: {},
  ghostForecast: [],
  ghostSolding: [],
  filterType: 0,
  shopSummary: [],
  shopSumDesc: []
}

const getters = {
  setprice: state => state.setprice,
  getMallShopList: state => state.shopLists,
  shopFixed: state => state.shopFixedMenu,
  shopMains: state => state.shopMainCont,
  shopTopNavi: state => state.isShowTopNavi,
  shopDetail: state => state.shopDetail,
  ghostInfo: state => state.ghostInfo,
  ghostProList: state => state.ghostProList,
  ghostList: state => state.ghostList,
  filterType: state => state.filterType,
  isShopSearchPage: state => state.isShopSearchPage,
  shopSummary: state => state.shopSummary,
  shopSumDesc: state => state.shopSumDesc,
  forecast: state => state.ghostForecast,
  solding: state => state.ghostSolding
}

const actions = {
  GhostProList({ commit, state }, payload) {
    commit(types.GHOST_PRO_INFO, payload)
  },
  setGhostInfo({ commit, state }, payload) {
    commit(types.GHOST_INFO, payload)
  },
  setShopLists({ commit, state }, payload) {
    commit(types.MALL_SHOP_LIST, payload)
  },
  setShopFixedMenu({ commit, state }, payload) {
    commit(types.SHOP_FIXED_MENU, payload)
  },
  setShopTopNavi({ commit, state }, payload) {
    commit(types.SHOP_TOP_NAVI, payload)
  },
  setShopDetail({ commit, state }, payload) {
    commit(types.MALL_SHOP_DETAIL, payload)
  },
  setFilteType({ commit, state }, payload) {
    commit(types.FILTER_TYPE, payload)
  },
  setShopSummary({ commit, state }, payload) {
    commit(types.SHOP_SUMMARY, payload)
  },
  setShopSumDesc({ commit, state }, payload) {
    commit(types.SHOP_SUMDESC, payload)
  }

}

const mutations = {
  // GHOST_PRO_INFO
  [types.GHOST_PRO_INFO](state, payload) {
    state.ghostProList = payload
  },
  [types.MALL_SHOP_LIST](state, payload) {
    state.shopLists = payload
  },
  [types.SHOP_FIXED_MENU](state, payload) {
    state.shopFixedMenu = payload
  },
  [types.SHOP_TOP_NAVI](state, payload) {
    state.isShowTopNavi = payload
  },
  [types.MALL_SHOP_DETAIL](state, payload) {
    state.shopDetail = payload
  },
  [types.GHOST_INFO](state, payload) {
    state.ghostInfo = JSON.parse(payload.banner)
    state.ghostList = payload.list
    var index = payload.list.length
    for (var i = 0; i < payload.list.length; i++) {
      if (!payload.list[i].isactive) {
        index = i
        break
      }
    };
    state.ghostSolding = payload.list.slice(0, index)
    state.ghostForecast = payload.list.slice(index)
  },
  [types.FILTER_TYPE](state, payload) {
    state.filterType = payload
  },
  [types.SHOP_SUMMARY](state, payload) {
    state.shopSummary = payload
  },
  [types.SHOP_SUMDESC](state, payload) {
    state.shopSumDesc = payload
  }
}

export default { state, getters, actions, mutations }
