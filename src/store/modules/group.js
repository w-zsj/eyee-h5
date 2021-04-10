import * as types from '../mutation-types'
const state = {
  groupbuyList: []
}
const getters = {
  groupbuyList: state => state.groupbuyList
}
const actions = {
  GroupbuyList({ commit, state }, payload) {
    commit(types.GROUP_BUY_LIST, payload)
  }
}
const mutations = {
  [types.GROUP_BUY_LIST](state, payload) {
    state.groupbuyList = payload
  }
}
export default { state, getters, actions, mutations }