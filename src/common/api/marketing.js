import { POST ,POSTGROUP} from '../util'

const url = {
  LimitSales: '/api/Marketing/LimitSales',
  LimitSaleEndedPage: '/api/Marketing/LimitSaleEndedPage',
  SpecialSale: '/api/Marketing/GetSpecialSaleV238',
  GetSpecialSaleProductList: '/api/Marketing/GetSpecialSaleProductListV238',  // 鬼市商品列表
  DiscountZone: '/api/Marketing/DiscountZone',
  GetCouponByCdKey: '/api/Marketing/GetCouponByCdKey',
  GetCoupon: '/api/Marketing/GetCouponV325',
  // GetCoupon: '/api/Marketing/GetCoupon',
  GetCouponGroup: '/api/Marketing/GetCouponGroup',
  GetPlatformActivity: '/api/Marketing/GetPlatformActivity',
  GetPlatformActivityProduct: '/api/Marketing/GetPlatformActivityProduct',
  GetUserCoupon: '/api/Marketing/GetUserCouponV235',
  FindRedpacketList: '/capi/redpacket/shareActivity/findRedpacketList',
  FindRedpacketHistoryList: '/capi/redpacket/shareActivity/findRedpacketHistoryList',
  PlatformActivitySearch: '/api/Product/PlatformActivitySearch',
  GetCouponInProduct: '/api/Marketing/GetCouponInProduct',
  GetSneakerOrderCoupon:'/capi/account/coupon/getOrderNewUserCoupon', // C2C选择优惠
  GetOrderCoupon: '/api/Marketing/GetNewOrderUserCoupon',  // B2C选择优惠
  GouponCenterFirst: '/api/Marketing/CouponCenterFirst',
  GetAllCouponList: '/api/Marketing/GetAllCouponList',
  GetCategoryCouponList:'/api/Marketing/GetCategoryCouponList'

}
const GetCategoryCouponList = (params={}) => { //领券中心类目优惠券列表
  return POST(url.GetCategoryCouponList, params, true)
}
const GouponCenterFirst = () => { //领券中心轮播和一级类目Tab
  return POST(url.GouponCenterFirst, { }, true)
}
//领券中心全部优惠券列表
const GetAllCouponList = (params={}) => { //领券中心轮播和一级类目Tab
  return POST(url.GetAllCouponList, params, true)
}
//  鬼市商品列表
function GetSpecialSaleProductList(params = {}) {
  return POST(url.GetSpecialSaleProductList, params, true)
}
// 限量发售（在售和预售）
function LimitSales(params = {}) {
  return POST(url.LimitSales, params, false)
}
// 已结束的限量发售（分页）
function LimitSaleEndedPage(params = {}) {
  return POST(url.LimitSaleEndedPage, params, false)
}
// 鬼市/特卖
function SpecialSale(params = {}) {
  return POST(url.SpecialSale, params, true)
}
// 折扣商品（分页）
function DiscountZone(params = {}) {
  return POST(url.DiscountZone, params, false)
}
// 兑换码领取优惠券
function GetCouponByCdKey(params = {}) {
  return POST(url.GetCouponByCdKey, params, false)
}
// 领取优惠券
function GetCoupon(params = {}) {
  return POST(url.GetCoupon, params)
}
// 获取所有券
function GetCouponGroup(params = {}) {
  return POST(url.GetCouponGroup, params, false)
}
// 平台大促专区信息
function GetPlatformActivity(params = {}) {
  return POST(url.GetPlatformActivity, params, true)
}
// 平台大促专区的商品（分页）
function GetPlatformActivityProduct(params = {}) {
  return POST(url.GetPlatformActivityProduct, params, true)
}
// 用户优惠券列表（分页，使用状态筛选）
function GetUserCoupon(params = {}) {
  return POST(url.GetUserCoupon, params, false)
}
// 查看红包列表
function FindRedpacketList(params = {}) {
  return POSTGROUP(url.FindRedpacketList, params, false)
}
// 查看红包历史
function FindRedpacketHistoryList(params = {}) {
  return POSTGROUP(url.FindRedpacketHistoryList, params, false)
}
// 大促专区商品搜索
function PlatformActivitySearch(params) {
  return POST(url.PlatformActivitySearch, params, false)
}
// C2C选择优惠
function GetSneakerOrderCoupon(params = {}) {
  return POSTGROUP(url.GetSneakerOrderCoupon, params, false)
}
// B2C选择优惠
function GetOrderCoupon(params = {}) {
  return POST(url.GetOrderCoupon, params, false)
}
const GetCouponInProduct = productid => {
  return POST(url.GetCouponInProduct, { productid }, false)
}

export {
  PlatformActivitySearch,
  LimitSales,
  LimitSaleEndedPage,
  SpecialSale,
  DiscountZone,
  GetCouponByCdKey,
  GetCoupon,
  GetCouponGroup,
  GetPlatformActivity,
  GetPlatformActivityProduct,
  GetUserCoupon,
  FindRedpacketList,
  FindRedpacketHistoryList,
  GetCouponInProduct,
  GetSpecialSaleProductList,
  GetSneakerOrderCoupon,
  GetOrderCoupon,
  GouponCenterFirst,
  GetAllCouponList,
  GetCategoryCouponList

}
