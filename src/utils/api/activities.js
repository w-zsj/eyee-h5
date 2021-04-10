import { POST, POSTGROUP, GETGROUP } from '@/common/util'
const Nextraintime = () => { // 获取下一场红包雨开始时间
  return POSTGROUP('/capi/activity/newyeargoods/open/nextraintime', {}, false)
}
const Remaincount = () => { // 获取用户剩余抢红包雨次数
  return POSTGROUP('/capi/activity/newyeargoods/remaincount?activitytype=2', {}, false)
}
const Assignredpacket = (ishit) => { // 分配红包优惠券接口
  return POSTGROUP('/capi/activity/newyeargoods/assignredpacket?ishit=' + ishit + '&activitytype=2', {}, false)
}
const Increasesharecount = () => { // 分享红包雨活动
  return POSTGROUP('/capi/activity/newyeargoods/increasesharecount?activitytype=2', {}, false)
}
const Checkgiftpackage = (businessid) => { // 红包雨-查看礼包
  return POSTGROUP('/capi/activity/newyeargoods/checkgiftpackage?businessid=' + businessid + '&activitytype=2', {}, false)
}

const VenueInfoAndMore = ({ activitytype, themetype, businessid = "" }) => {
  return POSTGROUP('/capi/activity/subtheme/open/moreactivity', { activitytype, themetype, businessid }, true)
}

const RecommendProduct = ({ page = 1, size = 10, activitytype, themetype = 0, businessid = '', category = '', sorttype = 0 }) => {
  return POSTGROUP('/capi/activity/productlist/open/productlist', { page, size, activitytype, themetype, businessid, category, sorttype }, false)
}

// 主会场接口
const MainPrecticeList = () => { // 主会场--榜单分会场列表
  return POSTGROUP('/capi/activity/miantheme/open/precticelist', {}, false)
}
const MainSubList = (activitytype = 5) => { // 主会场--分会场信息列表
  return POSTGROUP('/capi/activity/miantheme/open/subthemeinfo', { activitytype }, false)
}
const MainStoreRecommend = () => { // 主会场--店铺推荐
  return POSTGROUP('/capi/activity/newyeargoods/open/storerecommend', {}, false)
}

const MainCouponList = ({ activitytype = 5, themetype = "", businessid = "" }) => { // 主会场--未登录状态的优惠券信息
  return POSTGROUP('/capi/activity/coupon/open/couponinfo', { activitytype, themetype, businessid }, false)
}
const MainCouponListLogin = ({ activitytype = 5, themetype = '', businessid = "" }) => { // 主会场--登录状态下的优惠券信息
  return POSTGROUP('/capi/activity/coupon/couponinfo', { activitytype, themetype, businessid }, false)
}
const GetCoupon = ({ id, activitytype = 5 }) => { // 主会场--登录状态下的优惠券信息
  return POSTGROUP('capi/activity/coupon/robcoupon', { id, activitytype }, false)
}
const SallGetCoupon = ({ id }) => { // 主会场--登录状态下的优惠券信息
  return POST('/api/Marketing/GetCoupon', { id }, false)
}
// 获取生成海报状态
const GetPosterStatus = () => {
  return POST('/api/ClearCart/GetPosterStatus')
}

// 获取海报地址
const GetPosterUrl = () => {
  return POST('/api/ClearCart/GetSharePic')
}

// 设置快照中的海报地址
const SetPosterUrl = posterurl => {
  return POST('/api/ClearCart/SavePosterUrl', { posterurl })
}

// 设置快照的分享状态
const SetShareStatus = () => {
  return POST('/api/ClearCart/UpdateShareStatus')
}

// 生成购物车快照
const CreateSnapshot = () => {
  return POST('/api/ClearCart/GeneratePic')
}

// 获取快照购物车商品列表
const GetSnapshot = () => {
  return POST('/api/ClearCart/GetProductList')
}

const GetJoinedUser = () => {
  return POST('/api/ClearCart/GetUserInfos', {}, false)
}
const GetLotteryResult = () => {
  return POST('/api/ClearCart/DrawClearCart', {}, false)
}
const GetLotteryInfo = userid => {
  return POST('/api/ClearCart/GetDrawUserInfo', { userid }, false)
}
// 获取文案
const GetContent = ({ type }) => {
  return POSTGROUP('/capi/community/open/getcontent', { type }, 1)
}
// 百万红包瓜分--获取活动状态
const MillionRedLotteryActivityStatus = () => {
  return POSTGROUP('/capi/activity/million/getstatus', {}, false)
}
// 百万红包瓜分--开团
const MillionRedLotteryJoin = activityid => {
  return POSTGROUP('/capi/activity/million/createactivity', { activityid }, false)
}
//  百万红包瓜分--获取活动详情
const MillionRedLotteryActivityDetail = (activityid) => {
  return POSTGROUP('/capi/activity/million/open/getactivity', { activityid }, false)
}
//  百万红包瓜分--授权
const MillionAuth = (unionid, openid, nickname, headimgurl, activityid, shareuserid) => {
  return POSTGROUP('/capi/activity/million/open/authactivity', { unionid, openid, nickname, headimgurl, activityid, shareuserid }, false)
}
//  百万红包瓜分--注册
const MillionRegActivity = (parames) => {
  return POSTGROUP('/capi/activity/million/regactivity', parames, false)
}
//  百万红包瓜分--团长拆红包
const MillionLeaderOpen = (parames) => {
  return POSTGROUP('/capi/activity/million/leaderopen', parames, false)
}
//  百万红包瓜分--团员拆红包
const MillionMembersOpen = (parames) => {
  return POSTGROUP('/capi/activity/million/sendpack', parames, false)
}
//  百万红包瓜分--分享
const MillionShare = () => {
  return POSTGROUP('/capi/activity/million/open/getshareconfig', {}, false)
}
// 刮刮乐
const ScratchActivitylist = ({ uid = '', unionid = '' }) => {
  return POSTGROUP('/capi/data/scratch/open/scratchactivitylist', { uid, unionid })
}
// 剩余刮刮乐数量
const ScratchRemaincount = (activityid, unionid) => {
  return POSTGROUP('/capi/data/scratch/open/remaincount', { activityid, unionid }, false)
}

// 获取本场兑换码
const currentactivitycodes = ({ activityid }) => {
  return POSTGROUP('/capi/data/scratch/open/currentactivitycodes', { activityid }, false)
}

// 我的刮刮乐
const getuserscratchcode = ({ activityid, uid = '', unionid }) => {
  return POSTGROUP('/capi/data/scratch/open/getuserscratchcode', { activityid, uid, unionid }, false)
}
// 即将开始设置提醒--用于push
const setreminder = (activityid, unionid, uid) => {
  return POSTGROUP('/capi/data/scratch/open/setreminder', { activityid, unionid, uid }, 1)
}
// 首次进入、首次分享、好友助力增加次数
// type 1:参与获得 2:首次分享 3:好友赞助 4:设置提醒

const addchance = ({ activityid, unionid, nickname, image, helpunionid = '', uid = '', helpnickname = '', helpuserimage = '', type }) => {
  return POSTGROUP('/capi/data/scratch/open/addchance', { activityid, unionid, nickname, image, helpunionid, helpnickname, helpuserimage, type, uid }, false)
}
// 刮奖
const updateisopen = ({ activityid, codeid, uid, unionid }) => {
  return POSTGROUP('/capi/data/scratch/open/updateisopen', { activityid, codeid, uid, unionid }, false)
}
// 中奖页面信息--红包
const codeinfo = ({ activityid, code, type }) => {
  return POSTGROUP('/capi/data/scratch/open/codeinfo', { activityid, code, type }, false)
}
// 微信分享的商品信息
const shareproductinfo = ({ activityid, unionid, uid }) => {
  return POSTGROUP('/capi/data/scratch/open/shareproductinfo', { activityid, unionid, uid }, false)
}
const shareforhelp = ({ activityid, unionid, uid }) => {
  return POSTGROUP('/capi/data/scratch/open/shareforhelp', { activityid, unionid, uid }, false)
}

const BigPlatProductlist = (productParams) => { // 大促商品推荐
  return POSTGROUP('/capi/activity/productlist/open/productlist', productParams, 1)
}
const BigCategorymessage = ({ themetype = 0, activitytype = 10 }) => {  //  会场——banner图+商品分类 activitytype 这次活动都是8
  return POSTGROUP('/capi/activity/productlist/open/categorymessage', { themetype, activitytype }, false)
}
const BigStorerecommend = (themetype = 0) => {
  return POSTGROUP('/capi/activity/newyeargoods/open/storerecommend', { themetype }, false)
}

const LotteryInfo = (activitytype = 10) => {
  return POSTGROUP('/capi/activity/lottery/drawpage', { activitytype }, 1)
}
const LotteryInfoOpen = (activitytype = 10) => {
  return POSTGROUP('/capi/activity/lottery/open/drawpage', { activitytype }, 1)
}
const LotteryDraw = (activitytype = 10) => {
  return POSTGROUP('/capi/activity/lottery/circledraw', { activitytype }, 0)
}
const LotteryDrawInfo = (activitytype = 10) => {
  return POSTGROUP('/capi/activity/lottery/judgefirst', { activitytype }, 0)
}
const LotteryShare = (activitytype = 10) => {
  return POSTGROUP('/capi/activity/lottery/share', { activitytype }, 0)
}
const LotteryAddr = ({ activitytype = 10, prizeid, name, phone, address }) => {
  return POSTGROUP('/capi/activity/lottery/submitaddress', { activitytype, prizeid, name, phone, address }, 0)
}

// 20191212 大促活动
const Stylepavilion = ({ themetype = 0, activitytype = 8, page = 1, size = 20 }) => {
  return POSTGROUP('/capi/activity/doubletwelve/open/stylepavilion', { themetype, activitytype, page, size }, 0)
}
// 查询用户中奖记录
const UserGetRecord = (activitycode = 'BIGTURNTABLE') => {
  return POSTGROUP('/capi/activity/bigturntable/record', { activitycode }, 0)
}
// 最近中奖记录
const UserWinRecord = (activitycode = 'BIGTURNTABLE') => {
  return POSTGROUP('/capi/activity/open/bigturntable/winrecord', { activitycode }, 0)
}
// 获取当前活动奖品图片
const PrizeProdList = (activitycode = 'BIGTURNTABLE') => {
  return POSTGROUP('/capi/activity/open/bigturntable/prize', { activitycode }, 0)
}
// 分享活动加抽奖次数
const AddLotterCount = (activitycode = 'BIGTURNTABLE') => {
  return POSTGROUP('/capi/activity/bigturntable/share', { activitycode }, 0)
}
// 抽奖go
const NowGo = (activitycode = 'BIGTURNTABLE') => {
  return POSTGROUP('/capi/activity/bigturntable/go', { activitycode }, 0)
}

// 保存收货地址
const AddAddr = ({ activitycode = 'BIGTURNTABLE', addressid, address, id }) => {
  return POSTGROUP('/capi/activity/bigturntable/draw', { activitycode, addressid, address, id }, 0)
}

// 交叉活动基本信息
const ChargingStation = ({ code, loged }) => {
  return POSTGROUP(`/capi/exchange/chargingstation/${loged ? '' : `open/`}info`, { code }, 1)

}
// 奖励兑换
const ExChange = ({ code }) => {
  return POSTGROUP('/capi/exchange/chargingstation/exchange', { code }, 1)
}
// 奖励金页面 规则查看
const Ruleconfiginfo = () => {
  return GETGROUP('/capi/exchange/traderebate/open/ruleconfiginfo', {}, 0)
}

// 奖励金页面 规则查看
const rebateorders = ({ page = 1, size = 10, status = 0 }) => {
  return POSTGROUP('/capi/order/front/rebateorders', { page, size, status }, 1)
}

export {
  ChargingStation, ExChange, VenueInfoAndMore, RecommendProduct, Nextraintime, Remaincount, Assignredpacket, Increasesharecount, Checkgiftpackage,
  MainPrecticeList, MainSubList, MainStoreRecommend, MainCouponList, MainCouponListLogin, GetCoupon,
  GetPosterStatus, GetPosterUrl, SetPosterUrl, SetShareStatus, CreateSnapshot, GetSnapshot,
  GetJoinedUser, GetLotteryResult, GetLotteryInfo,
  MillionRedLotteryActivityStatus, MillionRedLotteryJoin, MillionRedLotteryActivityDetail, MillionAuth, MillionRegActivity, MillionLeaderOpen, MillionMembersOpen, MillionShare,
  ScratchActivitylist, ScratchRemaincount, currentactivitycodes,
  getuserscratchcode, setreminder, addchance, updateisopen, shareproductinfo, codeinfo, GetContent, shareforhelp, BigPlatProductlist, BigCategorymessage, BigStorerecommend,
  LotteryInfo, LotteryInfoOpen, LotteryDraw, LotteryDrawInfo, LotteryShare, LotteryAddr, Stylepavilion, UserWinRecord, UserGetRecord, PrizeProdList,
  AddLotterCount, NowGo, AddAddr, Ruleconfiginfo, rebateorders
}
