import {
  POST,
  GET,
  POSTGROUP,
  GETGROUP
} from "../util";
const url = {
  Refreshpanicbuy: "/api/user/panicbuydetail",//抢购详情
  RelationWxUse:'/api/user/relationwxuser',//关联微信用户


  OnlineHelper:'/capi/channel/checkonlineshare/open/helper',//助力者微信授权后看到的界面
  OnlineShare:'/capi/channel/checkonlineshare/open/help',//点击立即助力
}
// 抢购详情
function RefreshPanicBuy(params = {}) {
  return POST(url.Refreshpanicbuy, params, false);
}
// 关联微信用户
function RelationWxUse(params = {}) {
  return POST(url.RelationWxUse, params, false);
}



// 助力者微信授权后看到的界面
function OnlineHelper(params = {}) {
  return POSTGROUP(url.OnlineHelper, params, false);
}
// 点击立即助力
function OnlineShare(params = {}){
  return POSTGROUP(url.OnlineShare,params,false)
}
export {
  RefreshPanicBuy,RelationWxUse,
  OnlineHelper,OnlineShare
}
