import { POST, GET, POSTGROUP, GETGROUP } from '../util'
const local = 'http://mock.dev.eyee.com', localhost = 'http://192.168.10.129:3100'

const url = {
  mysell: '/capi/channel/qiuxie/mysellNew',
  selladdress: '/capi/channel/qiuxie/sellAddress',
  deductDetail: '/capi/pay/public/incomeExpense/earnestMoneyList',
  violateList: '/capi/channel/qiuxie/violateList',
  businessExit: '/capi/channel/qiuxie/exitNewBusiness',
  businessSellMessage: '/capi/channel/qiuxie/businessSellMessage',
  getTrace: '/capi/order/front/getordertrace',
  identityToMerchant: '/capi/channel/qiuxie/identityToMerchant', // 芝麻认证
  mobileToMerchantCode: '/capi/channel/qiuxie/mobileToMerchant',
  // mySellDetail: '/capi/channel/qiuxie/mySellDetailV20',
  mySellDetail: '/capi/channel/qiuxie/myselldetailv35',
  businessProcessSellList: '/capi/channel/qiuxie/businessProcessSellList',
  businessProcessSellDetail: '/capi/channel/qiuxie/businessProcessSellDetail',
  buyerDetail: '/capi/order/front/getOrderDetail',
  buyerorderlist: '/capi/order/front/channel/getUserOrders',
  acceptFlaw: '/capi/order/front/acceptFlaw',
  lowerFrame: '/capi/channel/sneaker/lowerFrame',
  returnAddress: '/capi/channel/qiuxie/returnAddress',
  sellOrderDetail: '/capi/channel/qiuxie/sellingProductDetail',
  // sellOldOrderDetail: '/capi/order/front/sellOrderDetail',
  sellOldOrderDetail: '/capi/order/front/sellorderdetailv35',
  shipMents: '/capi/order/front/shipMents',
  receiptOrder: '/capi/order/front/receiptOrder', // 确认收货
  cancleOrder: '/capi/order/front/cancleOrder', // 取消订单
  deleteOrder: '/capi/order/front/deleteOrder', // 删除订单
  becomeBusinessDetail: '/capi/channel/qiuxie/becomeBusinessDetail', // 支付保证金页面
  consciencePledge: '/capi/channel/qiuxie/consciencepledge', // 补缴保证金页面
  getAcountNumber: '/capi/order/inner/getAcountBlanaceAndSellNumberV20', // 补充账户金额和销售数量
  agreement: '/capi/channel/open/agreement',
  getBuyerOrderForStatus: '/capi/order/front/orderStatusNum',
  searchsaleingproduct: 'capi/channel/qiuxie/searchsaleingproduct',
  searchpersonalsalingproduct: 'capi/channel/qiuxie/searchpersonalsalingproduct',
  
  outdeleverylist: '/capi/order/front/outdeleverylist', //上传订单选择商品列表
  shipmentsv20: '/capi/order/front/shipmentsv20', //上传单号
  businessreceiptorder: '/capi/order/front/businessreceiptorder', //卖家确认收货

}
// 个人中心
function getBuyerOrderForStatus(Userid) {
  return GETGROUP(url.getBuyerOrderForStatus, false)
}
// 卖家买家须知
function agreement(params = {}) {
  return GETGROUP(url.agreement + '?type=' + params.type, false)
}
// 补充账户金额和销售数量
function getAcountNumber(params = {}) {
  return GETGROUP(url.getAcountNumber, params, false)
}
// 确认收货
function receiptOrder(params = {}) {
  return POSTGROUP(url.receiptOrder, params, false)
}
// 取消订单
function cCancleOrder(params = {}) {
  return POSTGROUP(url.cancleOrder, params, false)
}
// returnAddress 上传物流单号
function shipMents(params = {}) {
  return POSTGROUP(url.shipMents, params, false)
}
// 删除订单
function deleteOrder(params = {}) {
  return POSTGROUP(url.deleteOrder, params, false)
}
// returnAddress 修改回寄地址
function returnAddress(params = {}) {
  return POSTGROUP(url.returnAddress, params, false)
}
// 卖家下架出售中的球鞋 我不卖了
function lowerFrame(params = {}) {
  return POSTGROUP(url.lowerFrame, params, false)
}
// mySellDetail 卖家出售订单列表
function mySellDetail(params = {}) {
  return POSTGROUP(url.mySellDetail, params, false)
}
// 卖家(商家)的出售订单列表(出售中-优化)
function businessProcessSellList(params = {}) {
  return POSTGROUP(url.businessProcessSellList, params, false)
}
// 商家出售中的详情(优化)
function businessProcessSellDetail(params = {}) {
  return POSTGROUP(url.businessProcessSellDetail, params, false)
}
// sellOldOrderDetail 卖家出售订单详情
function sellOldOrderDetail(params = {}) {
  return GETGROUP(url.sellOldOrderDetail + '?orderno=' + params.orderno, false)
}
function sellOrderDetail(params = {}) {
  return GETGROUP(url.sellOrderDetail + '?sneakerssalesid=' + params.sneakerssalesid, false)
}
// 买家是否接受瑕疵
function acceptFlaw(params = {}) {
  return POSTGROUP(url.acceptFlaw, params, false)
}
// mai家订单列表
function buyerorderlist(params = {}) {
  let requrl = ''
  requrl = '?status=' + params.status + '&page=' + params.page + '&size=' + params.size + '&platform=' + params.platform
  return GETGROUP(url.buyerorderlist + requrl, false)
}
// mai家出售订单详情
function buyerDetail(params = {}) {
  return GETGROUP(url.buyerDetail + '?orderno=' + params.orderno, false)
}
// 我的 商家出售页
function mysell(params = {}) {
  return GETGROUP(url.mysell, params, false)
}
// 商品出售回调地址
function selladdress(params = {}) {
  return POSTGROUP(url.selladdress, params, false)
}
// 违规信息
function violateList(params = {}) {
  return GETGROUP(url.violateList, params, false)
}
// 扣除记录
function deductDetail(params = {}) {
  return POSTGROUP(url.deductDetail, params, false)
}
// 商家入驻信息
function businessSellMessage(params = {}) {
  return GETGROUP(url.businessSellMessage, params, false)
}
// 支付保证金
function becomeBusinessDetail(params = {}) {
  return GETGROUP(url.becomeBusinessDetail, params, false)
}
// 补缴保证金
function consciencePledge(params = {}) {
  return GETGROUP(url.consciencePledge, params, false)
}
// 退出入驻
function businessExit(params = {}) {
  return GETGROUP(url.businessExit, params, false)
}
// 订单追踪
function getTrace(params = {}) {
  return GETGROUP(url.getTrace + '?orderno=' + params.orderno + '&role=' + params.role, false)
}
// 芝麻认证
function identityToMerchant(params = {}) {
  return POSTGROUP(url.identityToMerchant, params, false)
}
// 获取验证码mobileToMerchantCode
function mobileToMerchantCode(params = {}) {
  return POSTGROUP(url.mobileToMerchantCode, params, false)
}
// 出售中搜索（入驻商家）
function searchsaleingproduct(params = {}) {
  return POSTGROUP(url.searchsaleingproduct, params, false)
}
// 出售中搜索（个人卖家）
function searchpersonalsalingproduct(params = {}) {
  return POSTGROUP(url.searchpersonalsalingproduct, params, false)
}
// 上传订单选择商品列表
function outdeleverylist(params = {}) {
  return POSTGROUP(url.outdeleverylist, params, false)
}
// 上传订单选择商品列表
function UploadExpressno(params = {}) {
  return POSTGROUP(url.shipmentsv20, params, false)
}
// 卖家确认收货
function ConfirmGoods(params = {}) {
  return POSTGROUP(url.businessreceiptorder, params, false)
}

export {
  mysell, selladdress, deductDetail, businessExit, businessSellMessage, getTrace, identityToMerchant, mobileToMerchantCode,
  violateList, mySellDetail, businessProcessSellList, businessProcessSellDetail, buyerDetail, buyerorderlist, acceptFlaw, lowerFrame, returnAddress, sellOrderDetail,
  shipMents, deleteOrder, receiptOrder, cCancleOrder, becomeBusinessDetail, consciencePledge, getAcountNumber, agreement,sellOldOrderDetail,getBuyerOrderForStatus,
  searchsaleingproduct, searchpersonalsalingproduct,
  outdeleverylist,UploadExpressno,
  ConfirmGoods
}
