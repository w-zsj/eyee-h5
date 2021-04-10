import { POST } from '../util'

const url = {
  GetCreditsInfo: '/api/Integral/GetCreditsInfo',
  GetExchangeProduct: '/api/Integral/GetExchangeProduct',
  getFlowPackage: '/api/Integral/GetFlowPackage'
}

// 获取 积分/牛币 信息
function GetCreditsInfo(params = {}) {
  	return POST(url.GetCreditsInfo, params)
}
// 获取兑换商品（分页）
function GetExchangeProduct(params = {}) {
  	return POST(url.GetExchangeProduct, params, false)
}
// 充流量
function GetFlowPackage(params = {}) {
  return POST(url.getFlowPackage, params)
}
export { GetCreditsInfo, GetExchangeProduct, GetFlowPackage }
