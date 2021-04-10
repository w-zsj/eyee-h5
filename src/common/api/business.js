import { POST } from '../util'

const url = {
  GetListByCategory: '/api/Business/GetListByCategory',
  BusinessDetail: '/api/Business/DetailV238',
  SearchProduct: '/api/Business/SearchProduct',
  DiscountProduct: '/api/Business/DiscountProduct',
  GetCoupon: '/api/Business/Coupon'
}

// 商城店铺列表（根据类目、分类）
function GetListByCategory(params = {}) {
  return POST(url.GetListByCategory, params, params.pageindex === 1)
}
// 商城店铺首页（基础信息，券、新品）
function BusinessDetail(params = {}) {
  return POST(url.BusinessDetail, params, true, '/' + params.businessid)
}
// 商城店铺商品（筛选，分页）
function SearchProduct(params = {}) {
  return POST(url.SearchProduct, params, false)
}

const DiscountProduct = ({ businessid, pageindex = 1, pagesize } = {}) => {
  return POST(url.DiscountProduct, { businessid, pageindex, pagesize }, pageindex === 1)
}

const GetCoupon = businessid => {
  return POST(url.GetCoupon, { businessid })
}

export { GetListByCategory, BusinessDetail, SearchProduct, DiscountProduct, GetCoupon }
