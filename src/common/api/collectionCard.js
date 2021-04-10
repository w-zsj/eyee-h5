import { POSTGROUP, GETGROUP } from "../util";
const url = {
  AjcardIndex: '/capi/activity/ajcard/index', // 登录态 集卡首页接口
  OpenAjcardIndex: '/capi/activity/open/ajcard/index', // 非登录态 集卡首页接口
  AjcardHelpshare: '/capi/activity/ajcard/helpshare', // 助力分享接口
  AjcardHelpui: '/capi/activity/open/ajcard/helpui', // 助力界面接口
  AjcardHelpta: '/capi/activity/ajcard/helpta', // 帮他助力接口
  AjcardGivecard: '/capi/activity/ajcard/givecard', // 送卡分享接口
  AjcardCardui: '/capi/activity/open/ajcard/cardui', // 领卡界面接口
  AjcardGetcard: '/capi/activity/ajcard/getcard', // 领取赠卡接口
  AjcardDraw: '/capi/activity/ajcard/draw', // 抽卡接口
  AjcardBuild: '/capi/activity/ajcard/build', // 合成接口
  AjcardReceive: '/capi/activity/ajcard/receive', // 兑奖接口
  AjcardUploadinfo: '/capi/activity/ajcard/uploadinfo', // 上传领奖信息接口 尺码 地址信息
  AjcardQuerycard: '/capi/activity/ajcard/querycard', // 查询卡片数量
}

// 登录态 集卡首页接口
function AjcardIndex({}) {
  return POSTGROUP(url.AjcardIndex, {}, true)
}
// 非登录态 集卡首页接口
function OpenAjcardIndex({}) {
  return POSTGROUP(url.OpenAjcardIndex, {}, true)
}
// 助力分享接口
function AjcardHelpshare({}) {
  return POSTGROUP(url.AjcardHelpshare, {}, true)
}
// 助力界面接口
function AjcardHelpui({invitecode}) {
  return POSTGROUP(url.AjcardHelpui, {invitecode}, true)
}
// 帮他助力接口
function AjcardHelpta({invitecode}) {
  return POSTGROUP(url.AjcardHelpta, {invitecode}, true)
}
// 送卡分享接口 
function AjcardGivecard({code}) {
  return POSTGROUP(url.AjcardGivecard, {code}, true)
}
// 领卡界面接口
function AjcardCardui({cardid,code}) {
  return POSTGROUP(url.AjcardCardui, {cardid,code}, true)
}
// 领取赠卡接口
function AjcardGetcard({cardid}) {
  return POSTGROUP(url.AjcardGetcard, {cardid}, true)
}
// 抽卡接口
function AjcardDraw({type}) {
  return POSTGROUP(url.AjcardDraw, {type}, true)
}
// 合成接口
function AjcardBuild({}) {
  return POSTGROUP(url.AjcardBuild, {}, true)
}
// 兑奖接口
function AjcardReceive({prizeid}) {
  return POSTGROUP(url.AjcardReceive, {prizeid}, true)
}
// 上传领奖信息接口 尺码 地址信息
function AjcardUploadinfo({prizeid, size, name, phone, ctry, address}) {
  return POSTGROUP(url.AjcardUploadinfo, {prizeid, size, name, phone, ctry, address}, true)
}
// 查询卡片数量
function AjcardQuerycard({code}) {
  return POSTGROUP(url.AjcardQuerycard, {code}, true)
}

export {
  AjcardIndex,
  OpenAjcardIndex,
  AjcardHelpshare,
  AjcardHelpui,
  AjcardHelpta,
  AjcardGivecard,
  AjcardCardui,
  AjcardGetcard,
  AjcardDraw,
  AjcardBuild,
  AjcardReceive,
  AjcardUploadinfo,
  AjcardQuerycard
}
