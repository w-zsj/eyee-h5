import { POSTGROUP, POST, GET } from '@/common/util'
// 校验邀请码是否合法
const VipCheckCode = ({ code }) => {
  return POSTGROUP('/capi/account/vipuser/checkcode', { code }, true)
}
const RecommendVipList = () => {
  return POSTGROUP('/capi/account/vipuser/recommendviplist', {}, true)
}
// 会员首页相关信息
const RecommendInfo = (recommendcode = '') => {
  return POSTGROUP('/capi/account/vipindex/info', { recommendcode }, true)
}
const fanslist = (params) => {
  return POSTGROUP('/capi/account/relation/fans', params, false)
}
const withdraw = (params) => {
  return POSTGROUP('/capi/account/commisson/withdraw', params, false)
}
const vipindexInfo = (params) => {
  return POSTGROUP('/capi/account/vipindex/info', params, false)
}
const vipindexUnlogin = (params) => {
  return POSTGROUP('/capi/account/vipindex/open/info', params, false)
}
const getGift = (params) => {
  return POSTGROUP('/capi/account/vipuser/getgift', params, false)
}
// 1、推广商城列表Tab
const PromotionTab = () => {
  return POST('/api/product/promotiontab', {}, false)
}
// 推广商城商品列表
const PromotionList = ({ pagesize = 20, pageindex, categoryid }) => {
  return POST('/api/product/promotionlist', { pageindex, categoryid, pagesize }, 1)
}
// 奖励明细
const Bonus = ({ page, size = 20 }) => {
  return POSTGROUP('/capi/account/vipuser/bonus', { page, size }, false)
}
// 累计收益
const GetTotalAmount = (params) => {
  return POSTGROUP('/capi/account/transrebate/gettotalamount', params, false)
}
// 发售活动状态
const GetRecentActivity = (params) => {
  return GET('/capi/exchange/open/getrecentactivity', params, false)
}
// 潮品推广
const Productlist = (params) => {
  return POSTGROUP('/capi/distribution/index/open/productlist', params, false)
}
export {
  VipCheckCode, RecommendVipList, RecommendInfo, fanslist, withdraw,
  vipindexInfo, vipindexUnlogin, getGift, PromotionTab, PromotionList, Bonus,
  GetTotalAmount, GetRecentActivity, Productlist
}
