import { POSTGROUP, GETGROUP } from "../util";
const url = {
  MonitorShare: '/capi/community/monitor/open/share', // 监控 内测邀请分享+信息
  Internalactive: '/capi/community/monitor/internalactive', // 监控 内测邀请 激活
  Mymonitorinfo: '/capi/community/monitor/mymonitorinfo', // 页面数据展示
  MonitorCard: '/capi/community/monitor/receivemonitorcard', // 激活监控卡
  Cardshareinfo: '/capi/community/monitor/open/cardshareinfo', // 分享页面信息
  Lssuemonitorcard: 'capi/community/monitor/lssuemonitorcard', // 已过期重新领卡
  Newuserpageinfo: 'capi/exchange/newuserpage/newuserpageinfo', // 新人专享
  Hottideproductlist: 'capi/exchange/open/hottideproductlist',//热门潮品
  StartPurchase: 'capi/exchange/newuserpage/purchase'//立即购买
}

// 监控 内测邀请分享+信息
function MonitorShare({ userid }) {
  return POSTGROUP(url.MonitorShare, { userid }, false)
}
// 监控 内测邀请 激活
function Internalactive(params = {}) {
  return POSTGROUP(url.Internalactive, params, false)
}

// 页面数据展示
function Mymonitorinfo() {
  return POSTGROUP(url.Mymonitorinfo, {}, 1)
}
// 激活监控卡
function MonitorCard(params = { monitorcardid, receivetype: 1 }) {
  return POSTGROUP(url.MonitorCard, params, false)
}
// 分享页面信息
function Cardshareinfo({ cardid }) {
  return POSTGROUP(url.Cardshareinfo, { cardid, type: 2 }, false)
}
// 已过期重新领卡
function Lssuemonitorcard() {
  return POSTGROUP(url.Lssuemonitorcard, {}, 1)
}

// 新人专享
function Newuserpageinfo() {
  return POSTGROUP(url.Newuserpageinfo, {}, 1)
}
function Hottideproductlist() {
  return POSTGROUP(url.Hottideproductlist, {}, 1)
}
function StartPurchase({activityid,size}) {
  return POSTGROUP(url.StartPurchase, { activityid ,size}, false)
}


export {
  MonitorShare,
  Internalactive,
  Mymonitorinfo,
  MonitorCard,
  Cardshareinfo,
  Lssuemonitorcard,
  Newuserpageinfo,
  Hottideproductlist,
  StartPurchase
}
