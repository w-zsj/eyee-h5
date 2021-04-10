import { POST } from '../util'

const url = {
  StockXHome: '/api/Article/StockXHome',
  StockXByDate: '/api/Article/StockXByDate',
  StockXSearch: '/api/Article/StockXSearch',
  StockXInfo: '/api/Article/StockXInfo'
}

// 鞋榜首页（滚屏列表，搜索背景）
function StockXHome(params = {}) {
  return POST(url.StockXHome, params, false)
}
// 鞋榜列表（按日期获取）=>发售日历
function StockXByDate(params = {}) {
  return POST(url.StockXByDate, params, false)
}
// 鞋榜搜索（分页）
function StockXSearch(params = {}) {
  return POST(url.StockXSearch, params, false)
}
// 鞋榜详情
function StockXInfo(params = {}) {
  return POST(url.StockXInfo, params, false)
}

export { StockXHome, StockXByDate, StockXSearch, StockXInfo }
