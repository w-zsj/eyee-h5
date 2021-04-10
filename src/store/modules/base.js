import * as types from '../mutation-types'
import { BaseValue, HomeFirst, HomeOther, HomeFirstQ, HomeOtherQ, Countries, HotSearchKey } from '../../common/api/base'
// NewBaseHome

const state = {
  baseBrandList: [],
  baseBrandRecommend: [],
  baseCategoryList: [],
  baseCategoryRecommend: [],
  baseHomeFlash: [],
  baseCouponEnter: {},
  baseSpecialBrand: [],
  baseFashionShop: [],
  baseHomeSubjects: [],
  baseProductHot: [],
  homeSpecialSale: [],
  baseHotSearchKey: {},
  baseHomeShopStreet: [],
  mallBrandList: [],
  baseValue: {},
  wxShareData: {},
  shareData: {
    shoeShareData: {}
  },
  baseCountrys: [],
  gettingBase: null
}

const getters = {
  brands: state => state.baseBrandList,
  brandRecommeds: state => state.baseBrandRecommend,
  categorys: state => state.baseCategoryList,
  categoryRecommeds: state => state.baseCategoryRecommend,
  homeFlash: state => state.baseHomeFlash,
  homeCouponEnter: state => state.baseCouponEnter,
  homeSpecialBrands: state => state.baseSpecialBrand,
  homeFashionShop: state => state.baseFashionShop,
  homeSubjects: state => state.baseHomeSubjects,
  homeSpecialSale: state => state.homeSpecialSale,
  hotSearchKey: state => state.baseHotSearchKey,
  mallBrands: state => state.mallBrandList,
  productRecommends: state => state.baseProductHot,
  homeShopStreet: state => state.baseHomeShopStreet,
  baseValue: state => state.baseValue,
  wxShareData: state => state.wxShareData,
  shoeShareData: state => state.shareData.shoeShareData,
  baseCountrys: state => state.baseCountrys,
  baseReq: state => {
    if (!state.gettingBase) state.gettingBase = BaseValue()
    return state.gettingBase
  }
}

const actions = {
  setBaseBrand({ commit, state }, payload) {
    commit(types.BASE_BRAND_LIST, payload)
  },
  setHotSearchKey({ commit, state }) {
    // commit(types.BASE_HOT_SEARCH_KEY, payload)
    HotSearchKey()
      .then(res => {
        commit(types.BASE_HOT_SEARCH_KEY, res || {})
        console.log('[*actions]热门搜索关键字', res)
        // this.$store.dispatch('setHotSearchKey', res)
      })
      .catch(e => {
        console.error('[*actions]热门搜索关键字', e)
      })
  },
  setMallBrandLists({ commit, state }, payload) {
    commit(types.MALL_BRAND_LIST, payload)
  },
  setHomeGather({ commit, state, getters }) {
    // commit(types.BASE_HOME_GATHER, payload)
    let first = getters.insq ? HomeFirstQ : HomeFirst
    first()
      .then(res => {
        commit(types.BASE_HOME_GATHER, res || {})
        console.log('[*actions]HomeFirst', res, 'insq：', getters.insq)
        let other = getters.insq ? HomeOtherQ : HomeOther
        return other()
      })
      .then(res => {
        commit(types.BASE_HOME_GATHER_OTHER, res || {})
        console.log('[*actions]HomeOther', res)
      })
      .catch(e => {
        console.error('[*actions]setHomeGather请求异常', e)
      })
  },
  setBaseValue({ commit }, payload) {
    commit(types.BASE_VALUE, payload || {})
    // state.gettingBase = BaseValue()
    //   .then(res => {
    //     // 这里默认值空对象(即{})保证与state定义统一
    //     commit(types.BASE_VALUE, res || {})
    //     console.log('[*actions]全局基础数据', res)
    //     // if (res) this.$store.dispatch('setBaseValue', res)
    //   })
    //   .catch(e => {
    //     console.error('[*actions]基础数据加载失败', e)
    //   })
  },
  setWxShareData({ commit, state }, payload) {
    commit(types.BASE_WXSHARE_DATA, payload)
  },
  setBaseCountrys({ commit, state }) {
    // commit(types.BASE_COUNTRYS, payload)
    Countries()
      .then(res => {
        if (res && res.length > 0) res.sort((a, b) => a.orderby > b.orderby)

        commit(types.BASE_COUNTRYS, res)
        console.log('[*actions]baseCitys', res)
        // if (res) this.$store.dispatch('setBaseCountrys', res)
      })
      .catch(e => {
        console.error('[*actions]baseCitys请求异常', e)
      })
  }
}

const mutations = {
  [types.BASE_BRAND_LIST](state, payload) {
    state.baseBrandList = payload
  },
  [types.BASE_HOT_SEARCH_KEY](state, payload) {
    state.baseHotSearchKey = payload
  },
  [types.MALL_BRAND_LIST](state, payload) {
    var a = payload.shift()
    payload.push(a)
    state.mallBrandList = payload
  },
  [types.BASE_HOME_GATHER](state, payload) {
    state.baseHomeFlash = payload.flash
    state.baseBrandRecommend = payload.hotbrand || payload.hotbrandlist
    state.baseCouponEnter = payload.couponenter
    state.homeSpecialSale = payload.speciallist
  },
  [types.BASE_HOME_GATHER_OTHER](state, payload) {
    state.baseCategoryRecommend = payload.hotcategory
    state.baseSpecialBrand = payload.specialbrand
    state.baseFashionShop = payload.fashionshop
    state.baseHomeSubjects = payload.subject
    state.baseProductHot = payload.recommendproduct
    state.baseHomeShopStreet = payload.shopstreet
  },
  [types.BASE_VALUE](state, payload) {
    state.baseValue = payload
  },
  [types.BASE_WXSHARE_DATA](state, payload) {
    state.wxShareData.appId = payload.appId
    state.wxShareData[payload.link] = {
      timestamp: payload.timestamp,
      nonceStr: payload.nonceStr,
      signature: payload.signature
    }
  },
  [types.BASE_COUNTRYS](state, payload) {
    state.baseCountrys = payload
  }
}

export default { state, getters, actions, mutations }
