import { POST, GET, POSTGROUP } from '../util'

const url = {
  BaseHome: '/api/Base/Home',
  BaseValue: '/api/Base/Basics',
  IsReceive: "/api/User/isreceive",
  HotSearchKey: '/api/Base/HotSearchKey',
  BrandAll: '/api/Base/BrandAll',
  BrandHotSale: '/api/Base/BrandHotSale',
  CategoryAll: '/api/Base/CategoryAll',
  CategoryInIntegral: '/api/Base/CategoryInIntegral',
  // CityGanged: '/api/Base/CityGanged',
  Countries: '/api/Base/Countries',
  SearchCondition: '/api/Base/SearchCondition',
  SearchBusiness: '/api/Base/SearchConditionInBusiness',
  WxShareHelp: '/api/Imp/WxShareHelp',
  NewBaseHome: '/api/base/HomeV233',
  SearchShop: '/api/base/SearchShop',
  HomeFirst: '/api/base/HomeFirstV268',
  HomeOther: '/api/base/HomeOther',
  HomeFirstQ: '/api/base/HomeFirstQQV268',
  HomeOtherQ: '/api/base/homeotherqq',
  BaseProvinces: '/api/base/Provinces',
  BaseGetCitiesAndDistricts: '/api/base/GetCitiesAndDistricts',
  MoreSetPoints: '/capi/actionlogservice/log/open/addmorev2',
  SetPoints: '/capi/actionlogservice/log/open/addv2',
  Flashfrequency: '/capi/product/qiuxie/open/imageconfig'
}
// 批量收集
// ud	登录用户id	N
// dd	设备id	N
// ia	广告标识idfa	N
// i	登录ip
// tl	终端类型
// v	版本号
// mt	app市场
// ts	时间戳
// pp	前一个页面位置	N
// cp	当前页面位置	N
// e	事件名称	N
// p	业务参数	N
// ext	扩展字段	N
// sig	签名	Y
// tsp	时间戳	Y
// t	事件类型	Y	int
function MoreSetPoints(params = {}) {
  return POSTGROUP(url.MoreSetPoints, params, false)
}
// 单次收集
function SetPoints(params = {}) {
  return Promise.resolve()
  // return POSTGROUP(url.SetPoints, params, false)
}
// 省份
function BaseProvinces(params = {}) {
  return POST(url.BaseProvinces, params)
}
// 区县
function BaseGetCitiesAndDistricts(params = {}) {
  return POST(url.BaseGetCitiesAndDistricts, params, false, params.provinceId)
}
// 首页集合
function BaseHome() {
  return POST(url.BaseHome, null)
}
// 基础数据
function BaseValue(params = {}) {
  return POST(url.BaseValue, params, false)
}
function IsReceive(params = {}) {
  return POST(url.IsReceive, params, false)
}

// 热门搜索关键字
function HotSearchKey(params = {}) {
  return POST(url.HotSearchKey, params, false)
}
// 所有品牌
function BrandAll(params = {}) {
  return POST(url.BrandAll, params, false)
}
// 热销品牌列表（附带商品）（b2c品牌栏）
function BrandHotSale(params = {}) {
  return POST(url.BrandHotSale, params, false)
}
// 所有类目
function CategoryAll(params = {}) {
  return POST(url.CategoryAll, params, false)
}
// 类目有积分商品的
function CategoryInIntegral(params = {}) {
  return POST(url.CategoryInIntegral, params, false)
}
// 基础城市
// function CityGanged(params = {}) {
//   return POST(url.CityGanged, params, false)
// }
const Countries = () => {
  return POST(url.Countries, {}, false)
}
// 商品搜索条件
function SearchCondition(params = {}) {
  return POST(url.SearchCondition, params, false)
}
// 商城店铺的商品搜索条件
function SearchBusiness(params = {}) {
  return POST(url.SearchBusiness, params, false)
}
// 微信分享辅助
function WxShareHelp(params = {}) {
  return GET(url.WxShareHelp, params, false)
}
// v2.33首页接口
function NewBaseHome() {
  return POST(url.NewBaseHome)
}
const HomeFirst = () => {
  return POST(url.HomeFirst)
}
const HomeOther = () => {
  return POST(url.HomeOther, {}, false)
}

const HomeFirstQ = () => {
  return POST(url.HomeFirstQ, {}, false)
}
const HomeOtherQ = () => {
  return POST(url.HomeOtherQ, {}, false)
}

// 店铺搜索
function SearchShop(params = {}) {
  return POST(url.SearchShop, params, false)
}

// 闪屏数据
function FlashFrequency() {
  return POSTGROUP(url.Flashfrequency, { os: 3 }, false)
}
export {
  BaseValue,
  IsReceive,
  HotSearchKey,
  BrandAll,
  BrandHotSale,
  CategoryAll,
  CategoryInIntegral,
  // CityGanged,
  Countries,
  SearchCondition,
  SearchBusiness,
  BaseHome,
  WxShareHelp,
  NewBaseHome,
  HomeFirst, HomeOther,
  HomeFirstQ, HomeOtherQ,
  SearchShop,
  BaseProvinces,
  BaseGetCitiesAndDistricts,
  MoreSetPoints,
  SetPoints,
  FlashFrequency
}
