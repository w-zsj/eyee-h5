
import { POST } from '../util'

const url = {
  SpecialCategory: '/api/Marketing/BrandSpecialCategory',
  BrandSpecialSeries: '/api/Marketing/BrandSpecialSeries',
  BrandSpecialSale: '/api/Marketing/BrandSpecialSale',
  BrandSpecialDetail: '/api/Marketing/BrandSpecialSeriesDetail',
  LookBook: '/api/Marketing/LookBook'
}

// 品牌专题类目
function SpecialCategory(params = {}) {
  return POST(url.SpecialCategory, params, false)
}
// 品牌专题系列
function BrandSpecialSeries(params = {}) {
  return POST(url.BrandSpecialSeries, params, false)
}
// 品牌专题系列商品列表
function BrandSpecialSale(params = {}) {
  return POST(url.BrandSpecialSale, params, false)
}
// 品牌专题系列商品详情
function BrandSpecialDetail(params = {}) {
  return POST(url.BrandSpecialDetail, params, false)
}
// 品牌专题系列LOOKBOOK
function LookBook(params = {}) {
  return POST(url.LookBook, params, false)
}

export { SpecialCategory, BrandSpecialSeries, BrandSpecialSale, BrandSpecialDetail, LookBook }
