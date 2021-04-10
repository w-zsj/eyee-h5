import { POSTGROUP, GETGROUP } from "../util";
const url = {
  ProductPrice: '/capi/channel/open/productprice',
  ProductDetailCluster: '/capi/product/open/productdetailcluster',
  // 预售v2
  Activityinfov2i: '/capi/exchange/open/activityinfov2',
  HasLoginActivityinfov2i: '/capi/exchange/drawlotv2/activityinfo', // 登录态接口
  Getcodev2i: '/capi/exchange/drawlotv2/getcode',
  Checkcodev2i: '/capi/exchange/drawlotv2/checkcode',
  TradeInfoListv2i: '/capi/order/open/tradeinfolist',
  Updateshoecouponv2i: '/capi/exchange/drawlotv2/cancelsnapup', // 放弃购买
  Getsizev2i: '/capi/exchange/drawlotv2/getsize', // 抢购-选择尺码
  Addcouponorderv2i: '/capi/exchange/drawlotv2/addcouponorder', // 点击抢购

  Popularlist: '/capi/exchange/open/popularlist', // 人气榜单列表
  Helpuserlist: '/capi/exchange/drawlotv2/helpuserlist', // 好友助力列表

  Sizelistv2i: '/capi/exchange/drawlotv2/sizelist', // 选择意向尺码列表

  Couponsalelist: '/capi/exchange/open/couponsalelist', // 预售券发售列表


  Luckidentifysuccessv2i: '/capi/exchange/drawlotv2/luckidentifysuccess', // 专属通道抢券接口 生成鞋券信 意向
  Randomidentifysuccessv2i: '/capi/exchange/drawlotv2/randomidentifysuccess', // 专属通道抢券接口 生成鞋券信 随机
  Minpriceidentifysuccessv2i: '/capi/exchange/drawlotv2/minpriceidentifysuccess', // 专属通道抢券接口 生成鞋券信 全网最低

  Cancelpurchasev2i: '/capi/exchange/drawlotv2/cancelpurchase', // 全网最低价 专属通道用户取消抢购 code不失效 释放库存

  Newuseraddvaluev2i: '/capi/exchange/drawlotv2/newuseraddvalue', // 新用户分享增加人气值

  Profitlist: '/capi/exchange/open/profitlist', // 龙虎榜

  FootwearClubHInfos: '/capi/exchange/open/shoeteaminvitation', // 潮友团受邀打开页面
  FootwearClubJoin: '/capi/exchange/shoeteam/joinshoeteam', // 加入潮友团

  Shoecouponrank: '/capi/exchange/rank/open/shoecouponrank', // 鞋券榜单(往期回顾)

  Activityhistorylistv2: '/capi/exchange/open/activityhistorylistv2', // 往期抢购 尖货竞拍 历史
  Couponsalelistv356: '/capi/exchange/open/couponsalelistv356', // 往期抢购 尖货竞拍 发售列表
  Couponsaletablist: '/capi/exchange/open/couponsaletablist', // 往期抢购 尖货竞拍 发售列表tab
  Setpush: '/capi/exchange/drawlotv2/setpush', // 往期抢购 尖货竞拍 单场活动设置提醒

  FootwearClubResponse: '/capi/exchange/shoeteam/open/sharetoresponseinfo', // 潮友团-响应页面数据
  FootwearClubResponseShare: '/capi/exchange/shoeteam/open/shareforresponse', // 潮友团-分享数据
  FootwearClubResponseItem: '/capi/exchange/shoeteam/responseshoeteam', // 潮友团-立即响应
  FootwearClubTask: '/capi/exchange/open/getsharetask', // 潮友团任务
  FootwearClubTaskGettask: '/capi/exchange/shoeteam/gettask', // 潮友团-任务页面-领取任务

  ExclusiVeidentifySuccess: '/capi/exchange/drawlotv2/exclusiveidentifysuccess',// vip专属通道抢购
  VipUpdateShoeCoupon: '/capi/exchange/drawlotv2/cancelsnapup'//vip专属通道放弃购买
}

// 商品价格
function ProductPrice(params = {}) {
  return POSTGROUP(url.ProductPrice, params, false)
}
// 交易记录
function TradeInfoList(params = {}) {
  return POSTGROUP(url.TradeInfoList, params, false)
}

// 商品详情(行情、评论、Po照聚合)
function ProductDetailCluster(params = {}) {
  return POSTGROUP(url.ProductDetailCluster, params, false)
}
// 获取活动信息
function Activityinfov2i({ activityid }) {
  return POSTGROUP(url.Activityinfov2i, { activityid }, true)
}
// 登录态获取活动信息
function HasLoginActivityinfov2i({ activityid }) {
  return POSTGROUP(url.HasLoginActivityinfov2i, { activityid }, true)
}
// 获取购买码
function Getcodev2i({ activityid, sizes }) {
  return POSTGROUP(url.Getcodev2i, { activityid, sizes }, false)
}
// 验证兑奖码
function Checkcodev2i({ activityid, code }) {
  return POSTGROUP(url.Checkcodev2i, { activityid, code }, false)
}
// 认证成功之后调的接口生成鞋券信息
// const Identifysuccessv2i = ({ activityid, code, key, ticket }) => {
//   return POSTGROUP('/capi/exchange/drawlotv2/identifysuccessv2/' + key, { activityid, code, ticket }, false)
// }
const Identifysuccessv2i = ({ activityid, code }) => {
  return POSTGROUP('/capi/exchange/drawlotv2/snapupsuccess', { activityid, code }, false)
}
// 专属通道抢券接口 生成鞋券信息 意向
const Luckidentifysuccessv2i = ({ activityid, code }) => {
  return POSTGROUP(url.Luckidentifysuccessv2i, { activityid, code }, false)
}
// 专属通道抢券接口 生成鞋券信息 随机
const Randomidentifysuccessv2i = ({ activityid, code }) => {
  return POSTGROUP(url.Randomidentifysuccessv2i, { activityid, code }, false)
}
// 专属通道抢券接口 生成鞋券信息 全网最低
const Minpriceidentifysuccessv2i = ({ activityid, code, size }) => {
  return POSTGROUP(url.Minpriceidentifysuccessv2i, { activityid, code, size }, false)
}
// 全网最低价 专属通道用户取消抢购 code不失效 释放库存
const Cancelpurchasev2i = ({ activityid, code }) => {
  return POSTGROUP(url.Cancelpurchasev2i, { activityid, code }, false)
}
// vip 专属通道
const ExclusiVeidentifySuccess = ({ activityid, code, key, ticket }) => {
  return POSTGROUP(url.ExclusiVeidentifySuccess + '/' + key, { activityid, code, ticket }, false)
}
// vip 专属通道放弃购买
const VipUpdateShoeCoupon = ({ activityid, code }) => {
  return POSTGROUP(url.VipUpdateShoeCoupon, { activityid, code }, false)
}
// 
// 新用户分享增加人气值
const Newuseraddvaluev2i = ({ activityid }) => {
  return POSTGROUP(url.Newuseraddvaluev2i, { activityid }, false)
}
// 获取guid
const GetIdentifyKeyv2i = ({ activityid }) => {
  return POSTGROUP('capi/exchange/drawlotv2/getuid', { activityid }, false)
}
// 放弃购买
function Updateshoecouponv2i({ activityid, code }) {
  return POSTGROUP(url.Updateshoecouponv2i, { activityid, code }, false)
}
// 抢购-选择尺码
function Getsizev2i({ activityid }) {
  return POSTGROUP(url.Getsizev2i, { activityid }, false)
}
// 选择意向尺码列表
function Sizelistv2i({ activityid }) {
  return POSTGROUP(url.Sizelistv2i, { activityid }, false)
}
// 点击抢购
function Addcouponorderv2i({ activityid, size, code }) {
  return POSTGROUP(url.Addcouponorderv2i, { activityid, size, code }, false)
}

// 人气榜单列表
function Popularlist({ activityid, page, size, uid }) {
  return POSTGROUP(url.Popularlist, { activityid, page, size, uid }, true)
}
// 人气榜单列表
function Helpuserlist({ activityid, page, size }) {
  return POSTGROUP(url.Helpuserlist, { activityid, page, size }, true)
}
// 预售券发售列表
function Couponsalelist(params = {}) {
  return POSTGROUP(url.Couponsalelist, params, true)
}
// 龙虎榜
function Profitlist() {
  return POSTGROUP(url.Profitlist, {}, true)
}
// 潮友团受邀打开页面
function FootwearClubHInfos({ teamid, userid }) {
  return POSTGROUP(url.FootwearClubHInfos, { teamid, userid }, true)
}
// 加入潮友团
function FootwearClubJoin({ teamid }) {
  return POSTGROUP(url.FootwearClubJoin, { teamid }, true)
}

// 潮友团任务
function FootwearClubTask({ taskid }) {
  return POSTGROUP(url.FootwearClubTask, { taskid }, true)
}
// 潮友团-响应页面数据
function FootwearClubResponse({ teamid }) {
  return POSTGROUP(url.FootwearClubResponse, { teamid }, true)
}
// 潮友团-响应页面-立即响应
function FootwearClubResponseItem({ teamid }) {
  return POSTGROUP(url.FootwearClubResponseItem, { teamid }, true)
}
// 潮友团-响应页面-分享数据
function FootwearClubResponseShare({ teamid }) {
  return POSTGROUP(url.FootwearClubResponseShare, { teamid }, true)
}

// 潮友团-任务页面-领取任务
function FootwearClubTaskGettask({ taskid }) {
  return POSTGROUP(url.FootwearClubTaskGettask, { taskid }, true)
}
// 鞋券榜单(往期回顾) ranktype 1-涨幅榜 2-跌幅榜 3-成交量榜 4-新品榜 5-发售至今(爆款)
function Shoecouponrank({ ranktype, page, size }) {
  return POSTGROUP(url.Shoecouponrank, { ranktype, page, size }, false)
}
// 往期抢购 尖货竞拍 历史
function Activityhistorylistv2({ page, size }) {
  return POSTGROUP(url.Activityhistorylistv2, { page, size }, false)
}
// 往期抢购 尖货竞拍 发售列表
function Couponsalelistv356({ saletime, uid }) {
  return POSTGROUP(url.Couponsalelistv356, { saletime, uid }, false)
}
// 往期抢购 尖货竞拍 发售列表tab
function Couponsaletablist() {
  return POSTGROUP(url.Couponsaletablist, {}, false)
}
// 往期抢购 尖货竞拍 单场活动设置提醒
function Setpush({ activityid, token }) {
  return POSTGROUP(url.Setpush, { activityid }, false, token)
}

// 抢购-订单结算
function GetProdInfo({ code, addressid, activityid }) {
  console.log('获取现货商品列表', code, addressid, activityid)
  return POSTGROUP('capi/exchange/sale/settlement', { addressid, code, activityid }, false)
}
// 预售抢购-下单
function AddOrder({ code, addressid, activityid, expresstemplateitemid }) {
  return POSTGROUP('capi/exchange/sale/addorder', { addressid, code, activityid, expresstemplateitemid }, false)
}
export {
  ProductPrice,
  TradeInfoList,
  ProductDetailCluster,
  Activityinfov2i,
  HasLoginActivityinfov2i,
  Getcodev2i,
  Checkcodev2i,
  Identifysuccessv2i,
  GetIdentifyKeyv2i,
  Updateshoecouponv2i,
  Getsizev2i,
  Addcouponorderv2i,
  Popularlist,
  Luckidentifysuccessv2i,
  Randomidentifysuccessv2i,
  Minpriceidentifysuccessv2i,
  Cancelpurchasev2i,
  Newuseraddvaluev2i,
  Sizelistv2i,
  Helpuserlist,
  Couponsalelist,
  Profitlist,
  FootwearClubHInfos,
  FootwearClubJoin,
  Shoecouponrank,
  Activityhistorylistv2,
  Couponsalelistv356,
  Couponsaletablist,
  Setpush,
  FootwearClubTask,
  FootwearClubResponse,
  FootwearClubResponseItem,
  FootwearClubResponseShare,
  FootwearClubTaskGettask,
  ExclusiVeidentifySuccess,
  VipUpdateShoeCoupon,
  GetProdInfo,
  AddOrder

}
