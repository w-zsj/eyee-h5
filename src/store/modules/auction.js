import {
  Recommends
} from "@/utils/api/auction";

const types = {
  SET_HOME_RCDS: 'SET_HOME_RCDS'
}

const state = {
  $homeRcds: [],
  $actScenceId: '',
  $sceneReq: {
    page: 1,
    isend: false,
    list: []
  }
}

const getters = {
  homeRcds: state => state.$homeRcds,
  actScenceId: state => state.$actScenceId,
  scenePage: state => state.$sceneReq.page,
  sceneEnd: state => state.$sceneReq.isend,
  sceneList: state => state.$sceneReq.list
}

const actions = {
  setHomeRcds({ commit }, auctionid) {
    Recommends({ auctionid })
      .then(res => {
        console.log("Recommends res:", res);
        commit(types.SET_HOME_RCDS, res || [])
      })
      .catch(e => {
        console.error("Recommends error: ", e);
      });
  }
}

const mutations = {
  [types.SET_HOME_RCDS](state, payload) {
    state.$homeRcds = payload
  },
  toggleScence(state, actScenceId) {
    console.log('toggleScence: ', actScenceId)
    state.$actScenceId = actScenceId
  },
  scenePageLoad(state, payload) {
    console.log('scenePageLoad: ', payload)
    state.$sceneReq = payload
  }
}

export default { state, getters, actions, mutations }
