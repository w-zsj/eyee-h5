import { POSTGROUP, GETGROUP, POST } from '@/common/util'
// 与被推荐人建立关联
export const BallRelateto = (userid = "", isnew = 0) => {
  // userId	关联到谁	Y	String	推荐用户的userId
  return POSTGROUP('/capi/account/relateto', { userid, isnew })
}
// 获取关系发起人信息
export const BallShareInfo = (userid = "") => {
  return GETGROUP('/capi/account/open/related/user', { userId: userid })
}
// 获取当前用户做关联（邀新/唤老）用户活动时，统计信息
// type 0,1=邀新，2=唤老，默认1
export const BallListInfo = type => {
  return POSTGROUP('/capi/account/relation/info', { type })
}
// 用户列表分页请求
export const BallListInviteUser = ({ page, size = 10, type = 1 }) => {
  return POSTGROUP('/capi/account/relation/users', { page, size, type })
}

// 关联用户提醒登录
export const BallListInviteRemind = ({ userid, type = 1 }) =>
  POSTGROUP('/capi/account/relation/remind', { userid, type })

// 获取牛丸账户牛丸数量
export const GetUserBallNumApi = () => {
  return POSTGROUP('/capi/newball/account/newballnum')
}

// 获取牛丸任务列表
export const GetBallTaskListApi = () => {
  return POSTGROUP('/capi/newball/task/tasklist')
}

// 点击领取获得牛丸
export const GetBallApi = (code) => {
  return POSTGROUP('/capi/newball/task/receivetasknewball', { code })
}

// 牛丸记录
export const GetBallRecordApi = ({ page, size }) => {
  return POSTGROUP('/capi/newball/transfer/transferlist', { page, size })
}

// 获取牛丸兑换现金列表
export const BallToCashListApi = () => {
  return POSTGROUP('/capi/newball/exchangecash/exchangecashlist')
}

// 点击按钮兑换现金
export const BallToCashActionApi = (code) => {
  return POSTGROUP('/capi/newball/exchangecash/exchangecash', { code })
}

// 商品兑换分类
export const BallMarketCategoryApi = () => {
  return POST('/api/Base/CategoryInIntegral')
}

// 商品兑换列表
export const BallMarketListApi = ({ categoryid, pageindex }) => {
  return POST('/api/Integral/GetExchangeProduct', { categoryid, pageindex })
}
// 邀请新人页面
export const BallSommmonNew = () => {
  return GETGROUP('/capi/account/relation/invite', {}, 0)
}
// 唤醒老友
export const BallSommmonOld = () => {
  return GETGROUP('/capi/account/relation/awake', {}, 0)
}
// 领取额外奖励
export const BallExtraAwake = ({number}) => {
  return POSTGROUP('/capi/account/relation/awakeextra', {number}, 0)
}

// 牛丸兑换优惠券列表
export const GetCouponList = () => {
  return POSTGROUP('/capi/product/coupon/getcouponlist', {}, 0)
}

// 牛丸兑换优惠券
export const GetCoupon = (params) => {
  return POSTGROUP('/capi/product/coupon/getcoupon', params, 0)
}

// 签到列表
export const SigninShow = (params) => {
  return POSTGROUP('/capi/newball/signin/signinshow', params, 0)
}

// 签到列表
export const ReceiveReward = (params) => {
  return POSTGROUP('/capi/newball/signin/receivereward', params, 0)
}

// 牛丸邀新召老
export const getInviteTask = (params) => {
  return POSTGROUP('/capi/newball/task/invitetask', params, 0)
}
