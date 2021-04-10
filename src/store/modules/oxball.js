import * as types from '../mutation-types'

const state = {
  oxballNowOwn: 0,
  oxballTodayGet: 0,
  oxballTotalGet: 0,
  showBallToCash: false
}
const getters = {
  oxballNowOwn: state => state.oxballNowOwn,
  oxballTodayGet: state => state.oxballTodayGet,
  oxballTotalGet: state => state.oxballTotalGet,
  showBallToCash: state => state.showBallToCash
}

const actions = {
  getOxBallData({ commit, state }, data) {
    commit(types.OXBALL_INFO, data)
  }
}

const mutations = {
  [types.OXBALL_INFO](state, payload) {
    state.oxballNowOwn = payload.nownewballnum// 当前拥有
    state.oxballTodayGet = payload.todaynewballnum// 今日获得
    state.oxballTotalGet = payload.totalnewballnum// 累计获得
    state.showBallToCash = payload.showBallToCash// 是否展示牛丸兑换现金
  }
}
export default { state, getters, actions, mutations }
