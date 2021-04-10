import { POSTGROUP } from '../util'
export const oahome = (params) => {
  return POSTGROUP('/capi/account/vipuser/oahome', params, false)
}
export const fanshomepage = (params) => {
  return POSTGROUP('/capi/account/vipuser/fanshomepage', params, false)
}
export const directfanslist = (params) => {
  return POSTGROUP('/capi/account/vipuser/directfanslist', params, false)
}
export const teamfansinfo = (params) => {
  return POSTGROUP('/capi/account/vipuser/teamfansinfo', params, false)
}
export const teamfanslist = (params) => {
  return POSTGROUP('/capi/account/vipuser/teamfanslist', params, false)
}
export const financeinfo = (params) => {
  return POSTGROUP('/capi/account/vipuser/financeinfo', params, false)
}
export const financelist = (params) => {
  return POSTGROUP('/capi/account/vipuser/financelist', params, false)
}
export const withdraw = (params) => {
  return POSTGROUP('/capi/account/commisson/withdraw', params, false)
}
export const billlist = (params) => {
  return POSTGROUP('/capi/account/vipuser/billlist', params, false)
}
export const settlementdetail = (params) => {
  return POSTGROUP('/capi/account/vipuser/settlementdetail', params, false)
}

