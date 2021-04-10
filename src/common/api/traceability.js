import { POST ,POSTGROUP ,GET,GETGROUP} from '../util'

const url = {
  order: '/capi/order/open/getOrder',
  orderDetail: '/capi/order/trace/getOrderDetail',
}
 
// 订单回溯
function getOrder(params = {}) {
  return GETGROUP(url.order, params)
}
// 订单回溯
function getOrderDetail(params = {}) {
  return GETGROUP(url.orderDetail, params)
}

export { getOrder,getOrderDetail}
