import * as types from '../mutation-types'

const state = {
  shoeList: [],
  salesShoe: { key: '', month: '', list: [] },
  swiperShoe: [],
  strollShoe: [],
  searchBanner: '',
  brandList: [],
  codeList: [],
  newsArticle: [],
  newsCateId: '1',
  newsAllCates: []
}

const getters = {
  shoeList: state => state.shoeList,
  salesShoe: state => state.salesShoe,
  swiperShoe: state => state.swiperShoe,
  strollShoe: state => state.strollShoe,
  searchBanner: state => state.searchBanner,
  brandList: state => state.brandList,
  codeList: state => state.codeList,
  newsArticle: state => state.newsArticle,
  newsCateId: state => state.newsCateId,
  newsAllCates: state => state.newsAllCates
}

const actions = {
  setShoeList({ commit, state }, payload) {
    commit(types.SHOE_LIST, payload)
  },
  setSalesShoe({ commit, state }, payload) {
    commit(types.SHOE_SALES_LIST, payload)
  },
  setSwiperShoe({ commit, state }, payload) {
    commit(types.SHOE_SWIPER_LIST, payload)
  },
  setStrollShoe({ commit, state }, payload) {
    commit(types.SHOE_STROLL_LIST, payload)
  },
  getBrandList({ commit, state }, payload) {
    commit(types.NEWS_BRAND_LIST, payload)
  },
  setNewsArticle({ commit, state }, payload) {
    commit(types.NEWS_HOME_ARTICLE, payload)
  },
  setNewsCateId({ commit, state }, payload) {
    commit(types.NEWS_HOME_CATEID, payload)
  },
  setNewsAllCates({ commit, state }, payload) {
    commit(types.NEWS_ALL_CATES, payload)
  },
  getCodeList({ commit, state }, payload) {
    commit(types.NEWS_BRANDCODE_LIST, payload)
  }
}

const mutations = {
  [types.SHOE_LIST](state, payload) {
    state.shoeList = payload
  },
  [types.SHOE_SALES_LIST](state, payload) {
    state.salesShoe = payload
  },
  [types.SHOE_SWIPER_LIST](state, payload) {
    state.swiperShoe = payload
  },
  [types.SHOE_STROLL_LIST](state, payload) {
    state.strollShoe = payload.stroll
    state.searchBanner = payload.banner
  },
  [types.NEWS_BRAND_LIST](state, payload) {
    state.brandList = payload
  },
  [types.NEWS_HOME_ARTICLE](state, payload) {
    state.newsArticle = payload
  },
  [types.NEWS_HOME_CATEID](state, payload) {
    state.newsCateId = payload
  },
  [types.NEWS_ALL_CATES](state, payload) {
    state.newsAllCates = payload
  },
  [types.NEWS_BRANDCODE_LIST](state, payload) {
    if (payload && payload.length > 0) {
      var codes = [], list = payload
      for (var i = 0; i < list.length; i++) {
        var code = list[i].code, same = null
        codes.map(function (val) {
          if (val.code == code) {
            same = val
          }
        })
        if (same == null || same == undefined) {
          codes.push({ code: code, index: i })
        }
      }
      state.codeList = codes
    }
  }
}

export default { state, getters, actions, mutations }
