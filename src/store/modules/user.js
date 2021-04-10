import * as types from '../mutation-types'
import { QQZoneLogin, GetQQZoneInfo } from '../../common/api/user'
// import { Add as CartAdd } from '../../common/api/cart'

// const asDebug = process.env.NODE_ENV !== 'production'
// const dom = window.document
const ls = window.localStorage
// const wss = window.sessionStorage
const userkey = 'currentUser'
// const cartkey = 'FC_LOCAL_CART'
// const callingKey = 'FC_QZONE_CHECKING'

const state = {
  userInfo: {},
  userAddressList: [],
  isSelectId: '',
  cutType: false,
  showBaseModal: false,
  cityType: 1,
  cutToastShare: false, // 发起助力成功 助力详情 弹出 分享框
  businesscutid: '', // 暂存活动id
  cutid: '', // 助力id
  addUserData: {},
  editAddressData: {},
  userDefaultAddress: {},
  selectCountryCode: '+86',
  honeyCates: [],
  newCity: [],
  insq: false
}

const getters = {
  userInfo: state => {
    if (!state.userInfo.uid) state.userInfo = JSON.parse(ls.getItem(userkey) || '{}')
    return state.userInfo
  },
  newCity: state => state.newCity,
  isSelectId: state => state.isSelectId,
  userAddressList: state => state.userAddressList,
  showBaseModal: state => state.showBaseModal,
  cityType: state => state.cityType,
  addUserData: state => state.addUserData,
  editAddressData: state => state.editAddressData,
  userDefaultAddress: state => state.userDefaultAddress,
  selectCountryCode: state => state.selectCountryCode,
  honeyCates: state => state.honeyCates,
  insq: state => {
    return state.insq || !!window.INSQ
  }
}

var logincalling = false

const actions = {
  setUserInfo({ commit, state }, payload) {
    commit(types.USER_INFO, payload)
    /**
     * 检查本地存储并更新购物车
     */
    // let cart = JSON.parse(ls.getItem(cartkey) || '[]')
    // if (cart.length > 0) {
    //   cart.forEach(c => {
    //     if (c.items && c.items.length > 0) {
    //       c.items.forEach(i => {
    //         let param = { ...c, ...i }
    //         CartAdd(param).catch(e => console.error('actions CartAdd', e))
    //       })
    //     }
    //   })

    //   ls.removeItem(cartkey)
    // }
  },
  newCity({ commit, state }, payload) {
    commit(types.NEWCITY, payload)
  },
  isselectid({ commit, state }, payload) {
    commit(types.IS_SELECT_ID, payload)
  },
  setUserAddressList({ commit, state }, payload) {
    commit(types.SET_USER_ADDRESS_LIST, payload)
  },
  selectCity({ commit, state }, payload) {
    commit(types.SELECT_CITY, payload)
  },
  setEditAddressData({ commit, state }, payload) {
    commit(types.SET_EDITADDRESS_DATA, payload)
  },
  setDefaultAddress({ commit, state }, payload) {
    commit(types.SET_DEFAULT_ADDRESS, payload)
  },
  setCountryCode({ commit, state }, payload) {
    commit(types.SET_COUNTRY_CODE, payload)
  },
  setHoneyCates({ commit, state }, payload) {
    commit(types.HONEY_CATEGORY, payload)
  },
  qqCheckAndLogin({ commit, state }, payload) {
    console.log('qqCheckAndLogin payload : ', payload)
    // let getOpenData = () => {
    //   try {
    //     let api = window.chaowuapi && window.chaowuapi.getTicket
    //     api &&
    //       api({ appid: 1105091322 }, openData => {
    //         console.log('getTicket', openData)
    //         if (openData && openData.openid) {
    //           window.INSQ = true
    //           state.insq = true
    //           call(openData)
    //         }
    //       })
    //   } catch (e) {
    //     console.error('window.chaowuapi.getTicket error', e)
    //   }
    // }

    // test
    // const qzoneJsSrc = 'http://192.168.10.66/t.js'

    // debug
    // const qzoneJsSrc = '//h5.qzone.qq.com/proxy/domain/qzonestyle.gtimg.cn/qzone/hybrid/app/show/fashion/api.js'

    // production
    // const qzoneJsSrc = '//qzonestyle.gtimg.cn/qzone/hybrid/app/show/fashion/api.js'

    // var qzoneJs = dom.querySelector(`script[src='${qzoneJsSrc}']`)
    // if (payload && payload.setJs && !qzoneJs) {
    //   // type="text/javascript" charset="utf-8" async="" src="/76.js"
    //   qzoneJs = dom.createElement('script')
    //   qzoneJs.setAttribute('type', 'text/javascript')
    //   qzoneJs.setAttribute('src', qzoneJsSrc)
    //   dom.querySelector('head').appendChild(qzoneJs)
    //   // qzoneJs.onload = qzoneJs.onreadystatechange = function () {
    //   //   if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
    //   //     console.log('--- qzoneJs ready ---')
    //   //     getOpenData()
    //   //   }
    //   // }
    // } // else getOpenData()logincalling

    const call = function (data, lskey) {
      // if (wss.getItem(callingKey)) return
      if (logincalling) {
        setTimeout(() => {
          logincalling = false
        }, 800)
        return
      }
      logincalling = true
      // wss.setItem(callingKey, 'true')

      ls.setItem(lskey, JSON.stringify(data))

      console.log('[*actions]qqCheckAndLogin', data)
      /**
       * 手Q-qzone潮物
       * 登录处理：
       *  openid与本地存储的openid比对：
       *    相同则用存储的用户数据，
       *    不同则清除登录态并尝试登录(openid，提交后台校验存在并登录)
       */
      // const openidkey = 'QZ_OPENID'
      // let openid = ls.getItem(openidkey)
      // if (openid !== data.openid) {
      //   // this.$store.dispatch('setUserInfo', null)
      //   commit(types.USER_INFO, {})
      // }
      if (payload && payload.old) {
        if (payload.old.openid !== data.openid) {
          commit(types.USER_INFO, {})
        }
        data = data || payload.old
      }

      let user = JSON.parse(ls.getItem(userkey) || '{}')
      if (!user.token) {
        let doLogin = (trycount = 0) => {
          if (trycount > 1) return
          QQZoneLogin(data)
            .then(res => {
              logincalling = false
              // wss.setItem(callingKey, '')
              console.log('QQZoneLogin', res)
              if (res && res.user) commit(types.USER_INFO, res.user)
            })
            .catch(e => {
              console.error('QQZoneLogin error', e)
              logincalling = false
              // wss.setItem(callingKey, '')
              trycount++
              doLogin(trycount)
            })
        }
        doLogin()
      } else {
        commit(types.USER_INFO, user)
        logincalling = false
        // wss.setItem(callingKey, '')
      }

      // ls.setItem(openidkey, data.openid)
    }

    const opendatakey = 'FC_QZONE_OPENDATA'
    let openData = JSON.parse(ls.getItem(opendatakey) || '{}')
    if (openData.openid) {
      window.INSQ = true
      state.insq = true
      call(openData, opendatakey)
    }

    // 触发获取QQ信息,不影响正常流程
    try {
      const key = 'UPDATE_USER_INFO_FROM_QQ'
      let isUpd = ls.getItem(key)
      if (!isUpd) {
        if (window.OPEN_DATA && window.OPEN_DATA.openid) {
          let { openid, openkey, pf } = window.OPEN_DATA
          window.getOpenKey && window.getOpenKey(function (res) {
            if (res && res.data && res.data.openid) {
              openid = res.data.openid
              openkey = res.data.openkey
            }

            GetQQZoneInfo({ openid, openkey, pf }).then(res => {
              console.log('GetQQZoneInfo res', res)
              // 更新成功后保存状态
              ls.setItem(key, 1)
            }).catch(e => {
              console.error('GetQQZoneInfo error', e)
            })
          })
        }
      }
    } catch (err) { console.error('do GetQQZoneInfo error', err) }
  }
}

const mutations = {
  [types.NEWCITY](state, payload = {}) {
    state.newCity = payload
  },
  [types.USER_INFO](state, payload = {}) {
    ls.setItem(userkey, JSON.stringify(payload))
    state.userInfo = payload
  },
  [types.IS_SELECT_ID](state, payload) {
    state.isSelectId = payload
  },
  [types.SET_USER_ADDRESS_LIST](state, payload) {
    if (payload && payload.length > 0) {
      state.userAddressList = payload
      for (var i = 0; i < payload.length; i++) {
        payload[i].mobile = payload[i].mobile.split('-')[1]
        if (payload[i].isdefault) {
          state.userDefaultAddress = payload[i]
        }
      }
      console.log('默认地址的', state.userDefaultAddress)
    }
  },
  [types.SELECT_CITY](state, payload) {
    state.showBaseModal = payload.open
    state.cityType = payload.type
    var setData = state.addUserData
    if (!payload.isAddData) {
      // 添加信息
      setData = state.editAddressData
    }
    if (payload.data) {
      if (state.cityType == 0) {
        setData.country = payload.data
      } else {
        setData.citys = payload.data
        setData.country = '中国大陆' // 默认是中国
      }
    }
  },
  [types.SET_EDITADDRESS_DATA](state, payload) {
    console.log('编辑信息', payload)
    payload.phone = payload.mobile
    var ci = payload.address.split(' ')
    payload.citys = ci[0] + ' ' + ci[1] + ' ' + ci[2]
    payload.detailAddress = ci.slice(3, ci.length).join(' ')
    state.editAddressData = payload
  },
  [types.SET_DEFAULT_ADDRESS](state, payload) {
    state.userDefaultAddress = payload
  },
  [types.SET_COUNTRY_CODE](state, payload) {
    state.selectCountryCode = payload
  },
  [types.HONEY_CATEGORY](state, payload) {
    state.honeyCates = payload
  }
}

export default { state, getters, actions, mutations }
