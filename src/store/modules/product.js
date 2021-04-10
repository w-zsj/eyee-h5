import * as types from '../mutation-types'
const state = {
  productList: [],
  showModale: false,
  productData: {},
  limitSaleList: [],
  limitSaleEndList: [],
  DiscountList: [],
  filterData: {},
  setOption: {
    beginprice: null,
    endprice: null,
    brandid: null,
    categoryid: null,
    category: null,
    size: null,
    priceName: '全部',
    brandName: '全部',
    categoryName: '全部',
    sizeName: '全部',
    type: 0, // 原始数据
    items: {},
    keyword: null
  },
  categorys: [],
  homeOption: {
    beginprice: null,
    endprice: null,
    brandid: null,
    categoryid: null,
    category: null,
    size: null,
    priceName: '全部',
    brandName: '全部',
    categoryName: '全部',
    sizeName: '全部',
    type: 1, // 发现数据
    items: {},
    keyword: null
  },
  searchOption: {
    beginprice: null,
    endprice: null,
    brandid: null,
    categoryid: null,
    category: null,
    size: null,
    priceName: '全部',
    brandName: '全部',
    categoryName: '全部',
    sizeName: '全部',
    type: 2, // 搜索数据
    items: {},
    keyword: null
  },
  shopOption: {
    beginprice: null,
    endprice: null,
    brandid: null,
    categoryid: null,
    category: null,
    size: null,
    priceName: '全部',
    brandName: '全部',
    categoryName: '全部',
    sizeName: '全部',
    type: 3, // 店铺数据
    items: {},
    keyword: null
  },
  brandAll: {},
  bannerList: [],
  shopFilterData: [],
  listType: true,
  shopDetailId: '',
  shopRouteId: '',
  record: {},
  showCoupons: false,
  isKeywordBrand: {
    isBrand: false,
    brandName: null,
    brandId: null
  },
  productInUserHome: []
  // reLimit:false
}
const getters = {
  productData: state => state.productData,
  limitSaleList: state => state.limitSaleList,
  limitSaleEndList: state => state.limitSaleEndList,
  productLists: state => state.productList,
  filterData: state => state.filterData,
  setOptions: state => state.setOption,
  categorylist: state => state.categorys,
  homeOption: state => state.homeOption,
  searchOption: state => state.searchOption,
  shopOption: state => state.shopOption,
  brandAlls: state => state.brandAll,
  bannerList: state => state.bannerList,
  shopFilterData: state => state.shopFilterData,
  getDiscountList: state => state.DiscountList,
  getRecord: state => state.record,
  showCoupons: state => state.showCoupons,
  isKeywordBrand: state => state.isKeywordBrand,
  productInUserHome: state => state.productInUserHome
  // reLimit:state=>state.reLimit
}
const actions = {
  getProductList({ commit, state }, payload) {
    commit(types.PRODUCT_HOME_LIST, payload)
  },
  setLimitSaleList({ commit, state }, payload) {
    commit(types.LIMIT_SALE_LIST, payload)
  },
  setLimitSaleEndedList({ commit, state }, payload) {
    commit(types.LIMIT_SALE_ENDED_LIST, payload)
  },
  getFilterData({ commit, state }, payload) {
    commit(types.PRODUCT_FILTER_LIST, payload)
  },
  getCategory({ commit, state }, payload) {
    commit(types.BASE_CATEGORY_LIST, payload)
  },
  getBrandAll({ commit, state }, payload) {
    commit(types.BASE_BRAND_LIST, payload)
  },
  getBannerList({ commit, state }, payload) {
    commit(types.MALL_BANNER_LIST, payload)
  },
  getShopFilterData({ commit, state }, payload) {
    commit(types.SHOP_FILTER_LIST, payload)
  },
  resetOption({ commit, state }, payload) {
    commit(types.RESET_OPTION, payload)
  },
  confirOption({ commit, state }, payload) {
    commit(types.CONFIR_OPTION, payload)
  },
  // changLimit({ commit, state }, payload) {
  //   commit(types.GET_LIMIT, payload)
  // }
  setDiscountList({ commit, state }, payload) {
    commit(types.DISCOUNT_LIST, payload)
  },
  setRecord({ commit, state }, payload) {
    commit(types.SEARCH_RECORD, payload)
  },
  setKeywordBrand({ commit, state }, payload) {
    commit(types.KEYWORD_BRAND, payload)
  },
  setProductInUserHome({ commit, state }, payload) {
    commit(types.SET_PRODUCT_IN_USER_HOME, payload)
  }
}

const mutations = {
  [types.LIMIT_SALE_LIST](state, payload) {
    state.limitSaleList = payload
  },
  [types.LIMIT_SALE_ENDED_LIST](state, payload) {
    state.limitSaleEndList = payload
  },
  [types.PRODUCT_HOME_LIST](state, payload) {
    state.productList.push(...payload.list)
  },
  [types.PRODUCT_FILTER_LIST](state, payload) {
    state.filterData = payload
  },
  [types.BASE_CATEGORY_LIST](state, payload) {
    state.categorys = payload
  },
  [types.BASE_BRAND_LIST](state, payload) {
    state.brandAll = payload
  },
  [types.MALL_BANNER_LIST](state, payload) {
    state.bannerList = payload
  },
  [types.SHOP_FILTER_LIST](state, payload) {
    state.shopFilterData = payload
  },
  [types.RESET_OPTION](state, payload) {
    // console.log(payload) //1发现页，2搜索页数据 3店铺筛选
    if (payload == 1) state.homeOption = { ...state.setOption }
    if (payload == 2) state.searchOption = { ...state.setOption }
    if (payload == 3) state.shopOption = { ...state.setOption }
  },
  [types.CONFIR_OPTION](state, payload) {
    // 提交类型{data:,type:可选} type 1改变homeOption数据 2搜索页数据 3店铺数据
    if (payload.type) {
      if (payload.type == 1) {
        state.homeOption = { ...state.setOption, ...payload.data }
      }
      if (payload.type == 2) {
        state.searchOption = { ...state.setOption, ...payload.data }
      }
      if (payload.type == 3) {
        state.shopOption = { ...state.shopOption, ...payload.data }
      }
    } else {
      state.searchOption = { ...state.setOption, ...payload.data }
      
    }
  },
  [types.DISCOUNT_LIST](state, payload) {
    state.DiscountList = payload
  },
  [types.SEARCH_RECORD](state, payload) {
    state.record = payload
  },
  [types.KEYWORD_BRAND](state, payload) {
    state.isKeywordBrand = payload
  },
  [types.SET_PRODUCT_IN_USER_HOME](state, payload) {
    state.productInUserHome = payload || []
  }
  // [types.GET_LIMIT](state, payload) {
  //   state.reLimit=payload
  // }
}

export default { state, getters, actions, mutations }
