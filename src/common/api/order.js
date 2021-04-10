import { POST, TESTPOST, POSTGROUP } from '../util'

const oldDomain = '' // process.env.NODE_ENV !== 'production' ? '' : 'https://qapi.eyee.com'

const url = {
  // 下单物流
  GetOrderExpress: 'api/Mall/GetOrderExpressV235',
  // 取消订单
  CancelOrder: 'api/Mall/CancelOrderV243',
  // 删除订单
  DeleteOrder: '/api/Mall/DeleteOrder',
  // 确认收货
  Receipt: '/api/Mall/ReceiptOrder',
  // 用户订单列表
  OrderPage: '/api/Mall/OrderPageV234',
  // 订单详情
  orderDetail: '/api/Mall/OrderDetail',
  // 订单物流跟踪信息
  GetExpressTrack: '/api/Mall/OrderExpressTrack',
  // 订单
  OrderAdd: '/api/Mall/AddOrderV243',
  AddOrderZone: '/api/Mall/AddOrderZone',
  NewOrderAdd: '/api/Mall/AddOrderV244',
  NewC2cOrderAdd: '/capi/order/front/channel/addOrderV244',
  // 获取用户下单礼券列表
  // UserOrderCoupon: '/api/Marketing/GetOrderUserCoupon',
  UserOrderCoupon: '/api/Marketing/GetNewOrderUserCoupon',
  // 获取支付方式
  PayTypeList: '/api/Mall/PayTypeList',
  NewPayTypeList: '/api/Mall/PayTypeListV263',
  // h5支付预处理
  H5PrePay: oldDomain + '/api/Mall/H5PrePay',
  // h5支付状态查询
  WxOutOrder: '/api/Mall/H5WxOutOrderQuery',
  // 售后服务基础-售后原因、物流方式
  OrderServiceBase: '/api/Mall/OrderServiceBase',
  // 提交售后申请
  ServiceSubmitApply: '/api/mall/ServiceSubmitApplyV238',
  OrderServiceStatus: '/api/Mall/OrderServiceStatus',
  ServiceCancelApply: '/api/Mall/ServiceCancelApply', // 撤销售后服务
  ServiceConfirmReceive: '/api/Mall/ServiceConfirmReceive', // 确认收货
  ServiceApplyIntervene: '/api/Mall/ServiceApplyIntervene', // 平台介入
  // 修改售后申请
  ServiceEditApply: '/api/mall/ServiceEditApplyV238',
  // 上传物流
  ServiceSubmitExpress: '/api/Mall/ServiceSubmitExpress',
  // 修改物流
  ServiceEditExpress: '/api/Mall/ServiceEditExpress',
  // 延长收货时间
  ExtendOrder: '/api/mall/ExtendOrder',
  // 退货原因接口
  RefundCauseFlag: '/api/mall/RefundCauseFlag',
  // 上传凭证
  UploadEvidence: '/api/Mall/UploadEvidence',

  // 售后-申请退款
  apply: '/capi/customer/afterSale/apply',
  // 售后-提交申请
  submit: '/capi/customer/afterSale/submit',
  // 售后-提交单号
  submitExpress: '/capi/customer/afterSale/submitExpress',
  // 售后-上传图片
  uploading: '/capi/file/file/upload',
  // 售后-退款进度页面展示
  refund: '/capi/customer/afterSale/refund',
  // 售后-撤销申请
  revocation: '/capi/customer/afterSale/revocation',
  // 售后-修改申请
  modify: '/capi/customer/afterSale/update'
}

function RefundCauseFlag(params = {}) {
  return POST(url.RefundCauseFlag, params)
}
function ExtendOrder(params = {}) {
  return POST(url.ExtendOrder, params)
}
function GetOrderExpress(params = {}) {
  return POST(url.GetOrderExpress, params)
}
// function GetExpress(params = {}) {
//   return POST(url.GetExpress, params)
// }
function UserOrderCoupon(params = {}) {
  return POST(url.UserOrderCoupon, params, false)
}
function NewC2cOrderAdd(params = {}) {
  return POSTGROUP(url.NewC2cOrderAdd, params)
}
function NewOrderAdd(params = {}) {
  return POST(url.NewOrderAdd, params)
}
function OrderAdd(params = {}) {
  return POST(url.OrderAdd, params)
}
const AddOrderZone = (params = {}) => {
  return POST(url.AddOrderZone, params)
}
function OrderPage(params = {}) {
  return POST(url.OrderPage, params)
}
function DeleteOrder(params = {}) {
  return POST(url.DeleteOrder, params)
}
function Receipt(params = {}) {
  return POST(url.Receipt, params)
}
function OrderDetail(params = {}) {
  return POST(url.orderDetail, params, false)
}
function GetExpressTrack(params = {}) {
  return POST(url.GetExpressTrack, params)
}
function CancelOrder(params = {}) {
  return POST(url.CancelOrder, params)
}
function PayTypeList(params = {}) {
  return POST(url.PayTypeList, params)
}
const NewPayTypeList = orderno => {
  return POST(url.NewPayTypeList, { orderno })
}

function H5PrePay(params = {}) {
  return POST(url.H5PrePay, params)
}
function WxOutOrder(params = {}) {
  return POST(url.WxOutOrder, params, false)
}

// 售后服务基础-售后原因/物流方式
function OrderServiceBase(params = {}) {
  return POST(url.OrderServiceBase, params)
}
// 提交售后申请
function ServiceSubmitApply({ orderno = '', orderitemid, ProductItemId = '', Count = '', type, causeflag, goodstatus = '', returnproductmoney = '', returnlogisticsmoney = '', memo = '', evidenceurls = '' } = {}) {
  return POST(url.ServiceSubmitApply, { orderno, ProductItemId, Count, orderitemid, type, causeflag, goodstatus, returnproductmoney: parseFloat(returnproductmoney || 0), returnlogisticsmoney: parseFloat(returnlogisticsmoney || 0), memo, evidenceurls })
}

// 订单售后信息
function OrderServiceStatus(params = {}) {
  return POST(url.OrderServiceStatus, params, true)
}
// 撤销售后服务
function ServiceCancelApply(params = {}) {
  return POST(url.ServiceCancelApply, params)
}
// 确认收货
function ServiceConfirmReceive(params = {}) {
  return POST(url.ServiceConfirmReceive, params)
}
// 平台介入
function ServiceApplyIntervene(params = {}) {
  return POST(url.ServiceApplyIntervene, params)
}
// 修改申请
function ServiceEditApply({ orderno, aftersaleid, orderitemid, type, ProductItemId, Count, causeflag, goodstatus, returnproductmoney, returnlogisticsmoney, memo = '', evidenceurls = '' } = {}) {
  return POST(url.ServiceEditApply, { orderno, aftersaleid, ProductItemId, Count, orderitemid, type, causeflag, goodstatus, returnproductmoney: parseFloat(returnproductmoney || 0), returnlogisticsmoney: parseFloat(returnlogisticsmoney || 0), memo, evidenceurls })
}
// 上传单号
function ServiceSubmitExpress({ aftersaleid, orderitemid, type, expresscompany, expressno }) {
  return POST(url.ServiceSubmitExpress, { aftersaleid: aftersaleid, orderitemid: orderitemid, type: type, expresscompany: expresscompany, expressno: expressno })
}
// 修改物流
function ServiceEditExpress({ aftersaleid, orderitemid, type, expresscompany, expressno }) {
  return POST(url.ServiceEditExpress, { aftersaleid: aftersaleid, orderitemid: orderitemid, type: type, expresscompany: expresscompany, expressno: expressno })
}

const UploadEvidence = ({ orderitemid, stream }) => {
  return POST(url.UploadEvidence, { orderitemid, stream })
}

const TestPay = (param = {}) => {
  return TESTPOST('http://api.dev.eyee.com/capi/pay/public/pay/h5Prepay', param)
}
const TestWxpayIn = code => {
  return TESTPOST('http://api.dev.eyee.com/capi/pay/public/pay/h5Prepay', {
    "paymenttypeid": 7,
    "paysource": 1,
    "paysourceitem": 2,
    "orderno": 10000,
    "authcode": code,
    "inout": 1,
    "returnurl": "https://qzone.eyee.com/paytest"
  })
}


// 售后-申请退款
function getApplyInfo(params = {}) {
  // return POSTGROUP(url.apply+'?orderno='+params.orderno+'&refundtype='+params.refundtype, params)
  return POSTGROUP(url.apply, params)
}
// 售后-提交申请
function afterSaleSubmit(params = {}) {
  return POSTGROUP(url.submit, params)
}
// 售后-提交单号
function submitExpress(params = {}) {
  return POSTGROUP(url.submitExpress, params)
}
// 售后-上传图片
function uploadFile(params = {}) {
  return POSTGROUP(url.uploading, params)
}
// 售后-退款进度页面展示
function getRefund(params = {}) {
  return POSTGROUP(url.refund, params)
  // return POSTGROUP(url.refund+'?refundid='+params.refundid)
}
// 售后-撤销申请
function getRevocation(params = {}) {
  return POSTGROUP(url.revocation, params)
}
// 售后-修改申请
function modifyApply(params = {}) {
  return POSTGROUP(url.modify, params)
}


export {
  GetOrderExpress, CancelOrder, DeleteOrder, Receipt, OrderPage, OrderDetail, GetExpressTrack,
  OrderAdd, AddOrderZone, NewOrderAdd, NewC2cOrderAdd,
  UserOrderCoupon,
  PayTypeList, NewPayTypeList, H5PrePay,
  WxOutOrder, OrderServiceStatus,
  ServiceCancelApply, RefundCauseFlag, ServiceConfirmReceive, ServiceApplyIntervene,
  OrderServiceBase, ServiceSubmitApply, ServiceEditApply, ServiceSubmitExpress, ExtendOrder,
  ServiceEditExpress, UploadEvidence,
  TestPay, TestWxpayIn,

  getApplyInfo,
  afterSaleSubmit,
  submitExpress,
  uploadFile,
  getRefund,
  getRevocation, modifyApply
}

