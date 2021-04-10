import { GET, GETGROUP, POST, POSTGROUP } from "../util";

const url = {
  CargoList: "/api/Imp/GetCargoList",
  CustomSubjectInfo: "/api/Imp/GetCustomSubjectInfo",
  GetByCdkey: "/api/Marketing/GetCouponByCdKey",
  AddBeesBySubject: "/api/User/AddBeesBySubject",
  LuckDrawHome: "/capi/data/pumping/open/info",
  LuckDrawOpen: "capi/data/pumping/info",
  DrawOne: "/capi/data/pumping/one",
  DrawFive: "/capi/data/pumping/five",
  DrawStock: "/capi/data/pumpingDetail/stock",
  DrawPurchase: "/capi/data/pumping/config",
  DrawConfirmOrder: "/capi/order/front/addpumorder",
  DrawDeliveryFee: "/capi/order/pumping/expressfee",
  DrawTab: "/capi/data/pumping/open/activity",
  DrawActBanner: "/capi/data/team/activity",
  TeamInfo: "/capi/data/team/info",
  toJoin: "/capi/data/team/join",
  JoinTeam: "/capi/data/team/join",
  Addlucky: "/capi/data/teampconfig/addlucky",
  Invitation: "/capi/data/team/invite",
  SignList: '/capi/activity/eleven/redpacketlist',
  JoinNum: '/capi/activity/eleven/open/person/num',
  SignCategoryList: '/capi/activity/eleven/open/category/list',
  SignProductList: '/capi/activity/eleven/open/product/list',
  ShareSendRedPacket: '/capi/activity/eleven/sendredpacket',
  ElevenActivityId: '/capi/activity/eleven/open/activityid',
  NewRecommendTab: 'capi/product/recommend/open/tabs',
  // 是否领取新人大礼包
  isReceive: '/api/User/isreceive',
  // 领取新人大礼包
  couponPackage: '/api/User/receive/couponpackage',
  Getweixin: '/capi/data/pumping/open/getweixin',
  // 斗牛穿搭学院
  rebateinfo: "/capi/order/front/sharerebateinfo",
  // 用户实名认证
  identifyinfo: '/capi/pay/public/identifyinfo',
  // 加入队列
  addqueue: '/capi/data/pumping/addqueue',
  // 退出队列
  popqueue: '/capi/data/pumping/popqueue',
  isOpenAdv: '/capi/channel/advertising/open/management'
}
// 根据ids获取产品列表
function CargoList(params = {}) {
  return GET(url.CargoList, params);
}
function CustomSubjectInfo(params = {}) {
  return GET(url.CustomSubjectInfo, params);
}
function GetByCdkey(params = {}) {
  return POST(url.GetByCdkey, params);
}
function AddBeesBySubject(params = {}) {
  return POST(url.AddBeesBySubject, params);
}
// 抽抽不登录首页
function LuckDrawHome(params = {}) {
  return POSTGROUP(url.LuckDrawHome, params, false);
}
// 抽一次
function DrawOne(params = {}) {
  return POSTGROUP(url.DrawOne, params, false);
}
// 抽五次
function DrawFive(params = {}) {
  return POSTGROUP(url.DrawFive, params, false);
}
// 积存仓
function DrawStock(params = {}) {
  return POST(url.DrawStock, params);
}
// 获取购买配置
function DrawPurchase(params = {}) {
  return POSTGROUP(url.DrawPurchase, params);
}
// 确认提交订单
function DrawConfirmOrder(params = {}) {
  return POSTGROUP(url.DrawConfirmOrder, params);
}
// 配置运费
function DrawDeliveryFee(params = {}) {
  return POSTGROUP(url.DrawDeliveryFee, params);
}
// 抽抽首页登录
function LuckDrawOpen(params = {}) {
  return POSTGROUP(url.LuckDrawOpen, params, false);
}
// 活动tab
function DrawTab(params = {}) {
  return GETGROUP(url.DrawTab, params);
}
// 活动banner
function DrawActBanner(params = {}) {
  return POSTGROUP(url.DrawActBanner, params);
}
// 组队页展示用户
function TeamInfo(params = {}) {
  return POSTGROUP(url.TeamInfo, params);
}
// 假如队伍
function toJoin(params = {}) {
  return POSTGROUP(url.toJoin, params);
}
// 基础配置
function BaseConfig(params = {}) {
  return GET("https://files.eyee.com/c2cxcx/config/config.json", params, 0);
}
// 补救包
function Addlucky(params = {}) {
  return POSTGROUP(url.Addlucky, params, 0);
}
// 立即邀请
function Invitation(params = {}) {
  return POSTGROUP(url.Invitation, params, 0);
}
function SignList(params = {}) {
  return POSTGROUP(url.SignList, params)
}
function JoinNum(params = {}) {
  return POSTGROUP(url.JoinNum, params)
}
function SignCategoryList(params = {}) {
  return POSTGROUP(url.SignCategoryList, params)
}
function SignProductList(params = {}) {
  return POSTGROUP(url.SignProductList, params)
}
function ShareSendRedPacket(params = {}) {
  return POSTGROUP(url.ShareSendRedPacket, params)
}
function ElevenActivityId(params = {}) {
  return POSTGROUP(url.ElevenActivityId, params)
}
function NewRecommendTab(params = {}) {
  return POSTGROUP(url.NewRecommendTab, params)
}
function isReceive(params = {}) {
  return POST(url.isReceive, params)
}
function couponPackage(params = {}) {
  return POST(url.couponPackage, params)
}
function Getweixin(params = {}) {
  return POST(url.Getweixin, params)
}
// 斗牛穿搭学院
function rebateinfo(params = {}) {
  return POST(url.rebateinfo, params)
}
// 用户实名信息
function identifyinfo(params = {}) {
  return POST(url.identifyinfo, params)
}
function Addqueue(params = {}) {
  return POSTGROUP(url.addqueue, params)
}
function Popqueue(params = {}) {
  return POSTGROUP(url.popqueue, params)
}
function isOpenAdv(params = {}) {
  return POSTGROUP(url.isOpenAdv, params)
}

export {
  Addqueue,
  Popqueue,
  CargoList,
  CustomSubjectInfo,
  GetByCdkey,
  AddBeesBySubject,
  LuckDrawHome,
  DrawOne,
  DrawFive,
  DrawStock,
  DrawPurchase,
  DrawConfirmOrder,
  DrawDeliveryFee,
  LuckDrawOpen,
  DrawTab,
  TeamInfo,
  toJoin,
  DrawActBanner,
  BaseConfig,
  Addlucky,
  Invitation,
  SignList, SignCategoryList, SignProductList, ShareSendRedPacket, ElevenActivityId, JoinNum,
  NewRecommendTab,
  isReceive,
  couponPackage,
  Getweixin,
  rebateinfo,
  identifyinfo,
  isOpenAdv
};
