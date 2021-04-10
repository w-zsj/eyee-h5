import * as types from "../mutation-types";
const ls = window.localStorage;

const state = {
  rewardList: [],
  teamid: "",
  activeid: "",
  isRemand: (ls.getItem("isRemand") !== null && ls.getItem("isRemand")) || 1 // 是否需要每次提醒所在系列
};

const getters = {
  rewardList: (state) => state.rewardList,
  activeid: (state) => state.activeid,
  isRemand: (state) => {
    return state.isRemand;
  }
};

const mutations = {
  [types.UPDATE_REWARDLIST](state, payload) {
    state.rewardList = Object.assign([], payload);
  },
  [types.UPDATE_ACTIVEID](state, payload) {
    state.activeid = payload;
    console.log('activeid-----', payload)
  },
  [types.UPDATE_ISREMAND](state, payload) {
    state.isRemand = payload;
    ls.setItem("isRemand", payload);
  }
};
export default { state, getters, mutations };
