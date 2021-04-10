import * as types from '../mutation-types'

const state = {
  supremeBrand: []
}

const getters = {
  supremeBrands: state => state.supremeBrand
}

const actions = {
  setSpecialsBrand({ commit, state }, payload) {
    commit(types.SUPREME_BRANDS, payload)
  }
}

const mutations = {
  [types.SUPREME_BRANDS](state, payload) {
    state.specialsBrand = payload
  }
}

export default { state, getters, actions, mutations }
