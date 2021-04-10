
import { GETGROUP, POST, POSTGROUP } from '../util'
// http://api.dev.eyee.com/api/pintuan/open/list
const url = {
  groupLastedOnHomepage: '/capi/pintuan/open/lasted',
  groupList: '/capi/pintuan/open/list',
  productDetailGroup: '/capi/pintuan/open/openList',
  newOrderForProductDetailGroup: '/capi/pintuan/admin/open',
  adminList: '/capi/pintuan/front/adminList',
  retrieve: '/capi/pintuan/front/retrieve',
  openRetrieve: '/capi/pintuan/open/retrieve',
  infoByOrderId: '/capi/pintuan/front/infoByOrderId',
  AddGroupOrder: '/api/Mall/addOrderV242'
}

// 首页拼团列表
function GetGroupLastedOnHomepage(params = {}) {
  return POSTGROUP(url.groupLastedOnHomepage, params)
}
// 拼团列表
function GetGroupProductList(params = {}, hasLoad) {
  return POSTGROUP(url.groupList, params, hasLoad)
}
// 某个商品下的拼团列表
function GetProductDetailGroup(params = {}) {
  return POSTGROUP(url.productDetailGroup, params)
}
// 开团生成订单
function PostNewGroupOrder(params = {}) {
  return POSTGROUP(url.newOrderForProductDetailGroup, params)
}

// 我的团购
function GetMyGroupBuyList(params = {}, hasLoad) {
  return POSTGROUP(url.adminList, params, hasLoad)
}
// 拼团详情
function GetGroupBuyDetail(params = {}) {
  return GETGROUP(url.retrieve + '/' + params.teamId)
}
// 分享的拼团详情
function GetGroupBuyDetailOpen(params = {}) {
  return GETGROUP(url.openRetrieve + '/' + params.teamId)
}
// 订单详情
function GetGroupBuyInfoByOrderId(params = {}) {
  return GETGROUP(url.infoByOrderId + '/' + params.orderNo)
}
// 下单
function AddGroupOrder(params = {}) {
  return POST(url.AddGroupOrder, params)
}
export { GetProductDetailGroup, GetGroupLastedOnHomepage, GetGroupProductList, PostNewGroupOrder, GetMyGroupBuyList, GetGroupBuyDetail, GetGroupBuyInfoByOrderId, AddGroupOrder, GetGroupBuyDetailOpen }

