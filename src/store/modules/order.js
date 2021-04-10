import * as types from '../mutation-types'
import addRes from './user'

const PayingOrderKey = 'PY_ON'

const state = {
  orderItem: {},
  expressT: [],
  defaultExpress: {},
  defaultExpressList: [],
  orderState: 0,
  orderList: [],
  cutpriceInfo: {},
  trackInfo: {},
  expressPostData: {},
  canUseCoupon: [],
  unCanUseCoupon: [],
  orderCouponList: [],
  selectedCoupon: [], // {}
  unOrderCouponList: [],
  CancelOrderStatus: false, // 取消订单改变团状态
  fromType: 0, // 订单结算 0默认购物车 1详情立即购买
  orderServiceInfo: {}, // 存储订单号和退款类型
  setOrderAdd: {},
  reCause: [], // 待发货退回原因
  changeInformation: {}, // 回传修改申请信息
  discounts: { // 选择优惠 参数值
    redpacket: [],
    couponuserid: '',
    isusecoup: true
  },
  applyaddproduct: {
    name: '',
    sku: '',
    productname: ''
  },
  payingOrder: ''

}
const getters = {
  applyaddproduct: state => state.applyaddproduct,
  discounts: state => state.discounts,
  cutpriceInfo: state => state.cutpriceInfo,
  CancelOrderStatus: state => state.CancelOrderStatus,
  changeInformation: state => state.changeInformation,
  orderItem: state => state.orderItem,
  expressT: state => state.expressT,
  defaultExpress: state => state.defaultExpress,
  defaultExpressList: state => state.defaultExpressList,
  orderState: state => state.orderState,
  orderList: state => state.orderList,
  trackInfo: state => state.trackInfo,
  expressPostData: state => state.expressPostData,
  canUseCoupon: state => state.canUseCoupon,
  unCanUseCoupon: state => state.unCanUseCoupon,
  orderCouponList: state => state.orderCouponList,
  selectedCoupon: state => state.selectedCoupon,
  unOrderCouponList: state => state.unOrderCouponList,
  fromType: state => state.fromType,
  orderServiceInfo: state => state.orderServiceInfo,
  setOrderAdd: state => state.setOrderAdd,
  reCause: state => state.reCause,

  payingOrder: state => {
    if (!state.payingOrder) state.payingOrder = window.localStorage.getItem(PayingOrderKey)
    return state.payingOrder
  }
}
const actions = {
  Applyaddproduct({ commit, state }, payload) {
    commit(types.APPLY_ADD_PRODUCT, payload)
  },
  Discounts({ commit, state }, payload) {
    commit(types.DIS_COUNTs, payload)
  },
  CutPriceInfo({ commit, state }, payload) {
    commit(types.Cut_PRICE_INFO, payload)
  },
  CancelOrderStatus({ commit, state }, payload) {
    commit(types.CANCEL_ORDER_STATUS, payload)
  },
  reCause({ commit, state }, payload) {
    commit(types.RE_CAUSE, payload)
  },
  ChangeInfo({ commit, state }, payload) {
    commit(types.CHANGE_INFO, payload)
  },
  setOrderOut({ commit, state }, payload) {
    commit(types.SET_ORDER_OUT, payload)
  },
  setExpressTemplate({ commit, state }, payload) {
    commit(types.SET_EXORESS_T, payload)
  },
  setOrderState({ commit, state }, payload) {
    commit(types.SET_ORDER_STATE, payload)
  },
  setOrderList({ commit, state }, payload) {
    commit(types.SET_ORDER_LIST, payload)
  },
  setTrackInfo({ commit, state }, payload) {
    commit(types.SET_TRACKINFO, payload)
  },
  setdefaultExpress({ commit, state }, payload) {
    commit(types.SET_DEFAULT_EXPRESS, payload)
  },
  setPostData({ commit, state }, payload) {
    commit(types.SET_POSTDATA_EXPRESS, payload)
  },
  setOrderCoupon({ commit, state }, payload) {
    commit(types.SET_ORDER_COUPON, payload)
  },
  setFromeType({ commit, state }, payload) {
    commit(types.SET_FROMTYPE, payload)
  },
  setOrderServiceInfo({ commit, state }, payload) {
    commit(types.SET_ORDERSERVICE_INFO, payload)
  },
  setOrderAdd({ commit, state }, payload) {
    commit(types.SET_ORDER_ADD, payload)
  },
  updPayingOrder({ commit, state }, payload) {
    commit('updPayingOrder', payload)
  }
}
const mutations = {
  [types.APPLY_ADD_PRODUCT](state, payload) {
    state.applyaddproduct = payload
  },
  // DIS_COUNTs
  [types.DIS_COUNTs](state, payload) {
    state.discounts = payload
  },
  [types.Cut_PRICE_INFO](state, payload) {
    state.cutpriceInfo = payload
  },
  [types.CANCEL_ORDER_STATUS](state, payload) {
    state.CancelOrderStatus = payload
  },
  // RE_CAUSE
  [types.RE_CAUSE](state, payload) {
    state.reCause = payload
  },
  [types.CHANGE_INFO](state, payload) {
    state.changeInformation = payload
  },
  [types.SET_ORDER_OUT](state, payload) {
    state.orderItem = payload
  },
  [types.SET_EXORESS_T](state, payload) {
    let tm = payload.expresstemplates
    // let tm = payload
    console.log('物流信息', payload)
    let CurSddRes = { ...addRes.state.userDefaultAddress }
    if (tm && tm.length > 0) {
      let firstArea = ''
      if (CurSddRes.address) firstArea = CurSddRes.address.split(' ')[0]

      let [group, defaults, showList] = [{}, {}, []]

      // 物流名分组
      tm.forEach(i => {
        if (group[i.name]) group[i.name].push(i)
        else group[i.name] = [i]
      })

      // 组中选出匹配项或默认项
      for (const k in group) {
        const item = group[k]
        item.sort((a, b) => a.isdefault < b.isdefault).forEach(i => {
          if (i.area && i.area.indexOf(firstArea) > -1 || i.isdefault) defaults[i.name] = i
        })
      }

      // 选中物流格式转换并添加选中状态
      for (const k in defaults) {
        defaults[k].selected = false
        showList.push(defaults[k])
      }
      showList.sort((a, b) => a.expressfee > b.expressfee)

      console.log('===订单物流处理', group, defaults, showList)

      showList[0].selected = true
      state.defaultExpressList = showList
      state.defaultExpress = showList[0]

      /*
      let [t, s, n, defaultM] = [tm, [], [], []]
      let firstArea = ''
      if (CurSddRes.address) firstArea = CurSddRes.address.split(' ')[0]

      for (var i = 0; i < t.length; i++) {
        if (t[i] && t[i].area) {
          if (t[i].area.indexOf(firstArea) > -1 || t[i].isdefault) {
            if (n.indexOf(t[i].name) == -1) {
              n.push(t[i].name)
              t[i].selected = false
              defaultM.push(t[i])
            }
          }
        }
        // if (t[i].isdefault) {

        // }
      }
      // console.log(n, '运费模板的name----------------------------------------')
      if (n.length > 0) {
        for (var i = 0; i < n.length; i++) {
          var name = n[i]
          s.push({ name: name, item: [] })
          for (var j = 0; j < t.length; j++) {
            if (name == t[j].name) {
              s[i].item.push(t[j])
            }
          }
        }
        // 归类运费模板
        state.expressT = s
        // 默认的运费模板
      }
      defaultM[0].selected = true
      if (defaultM.length > 1) {
        defaultM.sort((a, b) => {
          return a.expressfee - b.expressfee
        })
      }

      state.defaultExpressList = defaultM
      // console.log('默认模板', defaultM)
      state.defaultExpress = defaultM[0]
      // console.log('归类运费模板', state.expressT)
      */
    } else {
      let op = { name: '', expressfee: 0, expresstemplateitemid: '', expressfreeid: payload.expressfreeid || '' }
      if (payload.isexpressfree && payload.expressfreeid) op.name = '包邮'
      else op.name = '未获取到物流'
      state.defaultExpress = op
    }
  },
  [types.SET_ORDER_STATE](state, payload) {
    state.orderState = payload
  },
  [types.SET_ORDER_LIST](state, payload) {
    state.orderList = payload
  },
  [types.SET_TRACKINFO](state, payload) {
    state.trackInfo = payload
  },
  [types.SET_DEFAULT_EXPRESS](state, payload) {
    state.defaultExpress = payload
  },
  [types.SET_POSTDATA_EXPRESS](state, payload) {
    state.expressPostData = payload
  },
  [types.SET_ORDER_COUPON](state, payload) {
    state.canUseCoupon = payload.canUseCoupon,
    state.unCanUseCoupon = payload.unCanUseCoupon,
    state.unOrderCouponList = payload.unCanUseCoupon
    state.orderCouponList = payload.canUseCoupon
    // if (state.orderCouponList && state.orderCouponList.length > 1) {
    //   state.orderCouponList.sort((a, b) => {
    //     return b.facevalue - a.facevalue
    //   })
    // }
    // var orl = state.orderCouponList
    // if (state.orderCouponList.length > 0) {
    //   for (var i = 0; i < orl.length; i++) {
    //     orl.selected = false
    //   }
    //   orl[0].selected = true
    // }
    // console.log(state.orderCouponList[0])

    // state.selectedCoupon = state.orderCouponList[0]
  },
  [types.SET_FROMTYPE](state, payload) {
    // 0购物订单 1立即购买订单
    state.fromType = payload
  },
  [types.SET_ORDERSERVICE_INFO](state, payload) {
    state.orderServiceInfo = payload
  },
  [types.SET_ORDER_ADD](state, payload) {
    state.setOrderAdd = payload
  },
  updPayingOrder(state, payload) {
    state.payingOrder = payload
    window.localStorage.setItem(PayingOrderKey, payload)
  }
}
export default { state, getters, actions, mutations }
