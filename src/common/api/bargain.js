
import { POSTGROUP } from '../util'
// 192.168.10.183:8751  http://api.dev.eyee.com
const url = {
  GetCutProductList: '/capi/cut/customer/getCutProductList',
  GetCutProductListOpen: '/capi/cut/open/getCutProductList',
  MyCutUserList: '/capi/cut/customer/cutUserList',
  Gadio: '/capi/cut/open/radio',
  CutUserProductDetail: '/capi/cut/customer/cutUserProductDetail',
  CutUserProductDetailOpen: '/capi/cut/open/cutUserProductDetail',
  CutProductDetail: '/capi/cut/customer/cutProductDetailV322',
  CutProductDetailOpen: '/capi/cut/open/cutProductDetailV322',
  StartCut: '/capi/cut/customer/startCut',
  FriendCut: '/capi/cut/customer/cut',
  ValidFriendCut: '/capi/cut/customer/cutV263', // '/capi/cut/customer/cutV262',
  FriendCutList: '/capi/cut/open/friendCutList'
}

// 助力列表 登录
function GetCutProductList(params = {}, hasLoad) {
  return POSTGROUP(url.GetCutProductList, params, hasLoad)
}
// 助力列表 未登录
function GetCutProductListOpen(params = {}, hasLoad) {
  return POSTGROUP(url.GetCutProductListOpen, params, hasLoad)
}
// 好友助力列表
function FriendCutList(params = {}, hasLoad) {
  return POSTGROUP(url.FriendCutList, params, hasLoad)
}
// 发起助力
function StartCut(params = {}) {
  return POSTGROUP(url.StartCut, params)
}
// 好友助力
function FriendCut(params = {}, hasLoad) {
  return POSTGROUP(url.FriendCut, params, hasLoad)
}
const ValidFriendCut = ({ cutid, ticket, randstr } = {}) => {
  return POSTGROUP(url.ValidFriendCut, { cutid, ticket, randstr })
}

function MyCutUserList(params = {}, hasLoad) {
  return POSTGROUP(url.MyCutUserList, params, hasLoad)
}
// 广播
function Gadio(params = {}, hasLoad) {
  return POSTGROUP(url.Gadio, params, hasLoad)
}
// 助力详情
function CutUserProductDetail(params = {}, hasLoad) {
  return POSTGROUP(url.CutUserProductDetail, params, hasLoad)
}
// 助力详情
function CutUserProductDetailOpen(params = {}, hasLoad) {
  return POSTGROUP(url.CutUserProductDetailOpen, params, hasLoad)
}
// 助力商品详情
function CutProductDetail(params = {}, hasLoad) {
  return POSTGROUP(url.CutProductDetail, params, hasLoad)
}
// 助力商品详情
function CutProductDetailOpen(params = {}) {
  return POSTGROUP(url.CutProductDetailOpen, params)
}
export { GetCutProductList, MyCutUserList, Gadio, CutUserProductDetail, CutProductDetail, StartCut, FriendCut, ValidFriendCut, FriendCutList, GetCutProductListOpen, CutUserProductDetailOpen, CutProductDetailOpen }