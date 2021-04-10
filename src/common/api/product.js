import { POST, POSTGROUP, GETGROUP } from '../util'
let MockDomain = 'http://mock.api.eyee.com'
const url = {
  ProdDetail: '/api/Product/Detail',
  ProdGetItems: '/api/Product/GetItems',
  ProdRelated: '/api/Product/Related',
  RecommendInArticle: '/api/Product/RecommendInArticle',
  ProductSearch: '/api/Product/Search',
  ProductCategorySearch: '/api/Product/CategorySearch',
  BrandAll: '/api/Base/BrandAll',
  SearchSame: '/api/Product/SearchSame',
  DiscountSearch: '/api/Product/DiscountSearch',
  NewDetail: '/api/Product/DetailV236',
  NewOrderCheck: '/api/Mall/B2cOrderSettleDetail',
  NewC2cOrderCheck: '/capi/order/inner/C2cOrderSettleDetail',
  guessWhatYouLike: '/api/product/guessWhatYouLikeV322',
  // 换货商品明细
  GetProductItems: '/api/Mall/GetProductItems',
  DetailExpress: '/api/Product/GetExpressV236',
  DetailFavor: '/api/Product/GetFavorV236',
  uploadUserAction: '/api/base/uploadUserAction', // 上报数据接口
  cloconfirmcollect: '/capi/product/collect/cloconfirmcollect', // 扩品 确认收藏
  NotLogClothessizelist: '/capi/product/open/clothessizelist', // 扩品 服饰收藏颜色尺码列表-未登录
  HaslogCloconfirmcollect: '/capi/product/collect/clothessizelist', // 扩品 服饰收藏颜色尺码列表-登录
  GetProductSizeColor: 'capi/product/open/getproductsizecolor',
  GetBusinessInfo: 'capi/product/open/getbusinessinfo',
  BusRelated: 'capi/product/open/related',
}
// 获取尺码，颜色，颜色图
function GetProductSizeColor(id) {
  return GETGROUP(url.GetProductSizeColor, { id }, false)
}
// 店铺推荐
function GetBusinessInfo(id) {
  return GETGROUP(url.GetBusinessInfo, { id }, false)
}
// 商品推荐
function BusRelated(id) {
  return GETGROUP(url.BusRelated, { id }, false)
}
// 未登录
function NotLogClothessizelist(productid) {
  return POSTGROUP(url.NotLogClothessizelist, { productid }, false)
}
// 登录
function HaslogCloconfirmcollect(productid) {
  return POSTGROUP(url.HaslogCloconfirmcollect, { productid }, false)
}
// 确认收藏
function cloconfirmcollect(params) {
  return POSTGROUP(url.cloconfirmcollect, params, false)
}
// 上报数据接口
function uploadUserAction(params) {
  return POST(url.uploadUserAction, params, false)
}
// 新下单页面数据展示 接口

function guessWhatYouLike(params) {
  return POST(url.guessWhatYouLike, params, true)
}
// 新下单页面数据展示 接口

function NewOrderCheck(params) {
  return POST(url.NewOrderCheck, params, false)
}
// C2C新下单页面数据展示 接口
function NewC2cOrderCheck(params) {
  return POSTGROUP(url.NewC2cOrderCheck, params, false)
}
// 商品子项明细
function GetProductItems(params = {}) {
  return POST(url.GetProductItems, params, false)
}
// 商品详情
function ProdDetail(params = {}) {
  return POST(url.ProdDetail, params, false)
}
// 商品子项
function ProdGetItems(params = {}) {
  return POST(url.ProdGetItems, params, false)
}
// 相关推荐
function ProdRelated(params = {}) {
  return POST(url.ProdRelated, params, false)
}
// 资讯详情推荐商品
function RecommendInArticle(params = {}) {
  return POST(url.RecommendInArticle, params, false)
}
// 商品搜索（分页）
function ProdSearch(params = {}) {
  return POST(url.ProductSearch, params, params.pageindex === 1)
}
// 商城首页分类搜索（分页）
function ProdCategorySearch(params = {}) {
  return POST(url.ProductCategorySearch, params, params.pageindex === 1)
}
// 折扣专区商品检索
function DiscountSearch(params = {}) {
  return POST(url.DiscountSearch, params, params.pageindex === 1)
}
// 找相似（第一页返回）
function SearchSame(params = {}) {
  return POST(url.SearchSame, params, params.pageindex === 1)
}
const NewDetail = (productid, requestid, issearchclick) => {
  let pa = { productid }
  if (requestid) pa.requestid = requestid
  if (issearchclick) pa.issearchclick = issearchclick
  return POST(url.NewDetail, pa, true, productid)
}
const DetailExpress = expressTemplateId => {
  return POST(url.DetailExpress, { expressTemplateId }, false)
}
const DetailFavor = productid => {
  return POST(url.DetailFavor, { productid }, false)
}
export {
  NewOrderCheck, NewC2cOrderCheck, ProdDetail, ProdGetItems, GetProductItems, ProdRelated,
  RecommendInArticle, ProdSearch, ProdCategorySearch, DiscountSearch, SearchSame, NewDetail,
  DetailExpress, DetailFavor, guessWhatYouLike, uploadUserAction, cloconfirmcollect, NotLogClothessizelist, HaslogCloconfirmcollect,
  GetProductSizeColor, GetBusinessInfo, BusRelated
}
