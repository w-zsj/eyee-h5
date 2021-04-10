import { POST, GETGROUP, POSTGROUP } from '../util'

const url = {
  sendCaptcha: '/api/User/SendCaptcha',
  validSendCaptcha: '/api/User/SendCaptchaV263', // '/api/User/SendCaptchaV262',
  postUserRegister: '/api/imp/autologin', // 登录注册
  GetAntiBrushJs: '/api/User/CaptchaIframeQuery',
  GetCaptchaWithImg: '/api/User/CaptchaWithImg',

  verifyCaptcha: '/api/User/VerifyCaptcha',
  register: '/api/User/Register',
  adjustRegister: '/api/user/RegisterV235',
  registerOpen: '/api/User/RegisterOpen',
  login: '/api/User/Login',
  // loginByCode: '/api/User/LoginByCode',
  loginByCode: '/api/User/LoginByAuthCode',
  Updatecommunityuser: '/api/user/updatecommunityuser',
  Getyearsandconstella: '/api/user/getyearsandconstella',
  loginAuto: '/api/User/LoginAuto',
  loginOpen: '/api/User/LoginOpen',
  bindOpen: '/api/User/BindOpen',
  unbindOpen: '/api/User/UnbindOpen',
  updatePassword: '/api/User/UpdatePassword',
  findPassword: '/api/User/FindPassword',
  // updateInfo: '/api/User/UpdateInfo',
  updateInfo: '/api/User/UpdateInfoV302',
  changeMobile: '/api/User/ChangeMobile',
  bindHobbyLabels: '/api/User/BindHobbyLabels',
  addressList: '/api/User/AddressList',
  addressDefault: '/api/User/AddressDefault',
  setDefaultAddress: '/api/User/SetDefaultAddress',
  addAddress: '/api/User/AddAddress',
  updateAddress: '/api/User/UpdateAddress',
  removeAddress: '/api/User/RemoveAddress',
  hobbyLabels: '/api/User/HobbyLabels',
  rankRules: '/api/User/RankRules',
  upload: '/api/User/Upload',
  appAdvice: '/api/User/AppAdvice',
  messageCenter: '/api/User/MessageCenter',
  WXRegisterAuth: '/api/user/WXRegisterAuth',
  QQZoneLogin: '/api/user/QQZoneLogin',
  QQZoneBindMobile: '/api/user/QQZoneBindMobile',

  // 成功领取红包
  getRedPacket: '/capi/redpacket/receive/getRedPacket',

  onLogin: '/capi/account/onlogin',
}
// 发送验证码
function SendCaptcha(params = {}) {
  return POST(url.sendCaptcha, params, false)
}
const ValidSendCaptcha = ({ mobile, checktype = 2, ticket, randstr, vcode, uid } = {}) => {
  return POST(url.validSendCaptcha, { mobile, checktype, ticket, randstr, vcode, uid }, false)
}


const GetAntiBrushJs = () => {
  return POST(url.GetAntiBrushJs, {}, 1)
}

const GetCaptchaWithImg = () => {
  return POST(url.GetCaptchaWithImg, {}, 1)
}


// 校验验证码（登录状态下）
function VerifyCaptcha(params = {}) {
  return POST(url.verifyCaptcha, params, false)
}
const postUserRegister = (params) => { // 自动登录注册
  return POSTGROUP(url.postUserRegister, params, false)
}
const Updatecommunityuser = (params = {}) => { // 更新年龄和 星座
  return POST(url.Updatecommunityuser, params, false)
}
const Getyearsandconstella = (params = {}) => { // 账户设置--获取年龄和星座（配置数据）
  return POST(url.Getyearsandconstella, params, false)
}

// 手机号密码注册
function Register(params = {}) {
  _logout()
  return POST(url.register, params, false)
}
// 第三方注册
function RegisterOpen(params = {}) {
  _logout()
  return POST(url.registerOpen, params, false)
}
// 调整注册接口
function AdjustRegister(params = {}) {
  _logout()
  return POST(url.adjustRegister, params, false)
}
// 手机号密码登录
function Login(params = {}) {
  _logout()
  return POST(url.login, params, false)
}
// 手机号验证登录
function LoginByCode(params = {}) {
  _logout()
  return POST(url.loginByCode, params, false)
}
// 自动登录（token 登录）
function LoginAuto(params = {}) {
  return POST(url.loginAuto, params, false)
}
// 第三方登录（包含是否注册的校验）
function LoginOpen(params = {}) {
  return POST(url.loginOpen, params, false)
}
// 绑定第三方账号
function BindOpen(params = {}) {
  return POST(url.bindOpen, params, false)
}
// 解绑第三方账号
function UnbindOpen(params = {}) {
  return POST(url.unbindOpen, params, false)
}
// 更新/修改密码（登录状态下）
function UpdatePassword(params = {}) {
  return POST(url.updatePassword, params, false)
}
// 找回密码
function FindPassword(params = {}) {
  _logout()
  return POST(url.findPassword, params, false)
}
// 修改账号信息
function UpdateInfo(params = {}) {
  return POST(url.updateInfo, params, true)
}
// 换绑手机
function ChangeMobile(params = {}) {
  return POST(url.changeMobile, params, false)
}
// 绑定兴趣标签
function BindHobbyLabels(params = {}) {
  return POST(url.bindHobbyLabels, params, false)
}
// 收件地址列表
function AddressList(params = {}) {
  return POST(url.addressList, params, false)
}
// 默认收件地址
function AddressDefault(params = {}) {
  return POST(url.addressDefault, params, false)
}
// 设置默认收件地址
function SetDefaultAddress(params = {}) {
  return POST(url.setDefaultAddress, params, false)
}
// 添加收件地址
function AddAddress(params = {}) {
  return POST(url.addAddress, params, false)
}
// 修改收件地址
function UpdateAddress(params = {}) {
  return POST(url.updateAddress, params, false)
}
// 删除收件地址
function RemoveAddress(params = {}) {
  return POST(url.removeAddress, params, false)
}
// 兴趣标签组
function HobbyLabels(params = {}) {
  return POST(url.hobbyLabels, params, false)
}
// 用户等级规则
function RankRules(params = {}) {
  return POST(url.rankRules, params, false)
}
// 用户上传图片
function Upload(params = {}) {
  return POST(url.upload, params, true)
}
// 用户反馈
function AppAdvice(params = {}) {
  return POST(url.appAdvice, params, false)
}
// 消息中心
function MessageCenter(params = {}) {
  return POST(url.messageCenter, params, false)
}
// 微信公众号注册授权获取unionid
function WXRegisterAuth(params = {}) {
  return POST(url.WXRegisterAuth, params, false)
}


// 成功领取红包
function getRedPacket(params = {}) {
  return POSTGROUP(url.getRedPacket, params, 1)
}


function QQZoneLogin({ openid, openkey, pf }) {
  return POST(url.QQZoneLogin, { QQZoneOpenId: openid, QQZoneOpenKey: openkey, QQZonePf: pf }, false)
}
const QQZoneBindMobile = ({ mobile, validcode }) => {
  return POST(url.QQZoneBindMobile, { mobile: mobile, validcode: validcode })
}

const GetQQZoneInfo = ({ openid, openkey, pf }) => {
  return GETGROUP(`/api/User/getQQZoneInfo?openid=${openid}&openkey=${openkey}&pf=${pf}`)
}
// 用以 向后端的通知登录成功，以做相应操作；当前有

// 1对 相应邀新唤老的发起人做相关奖励操作  牛丸用
const onLogin = () => {
  return POSTGROUP(url.onLogin, {})
}

const userKey = 'currentUser'
const _logout = function () {
  window.localStorage.removeItem(userKey)
}

export {
  SendCaptcha, ValidSendCaptcha,
  GetAntiBrushJs,
  GetCaptchaWithImg,
  VerifyCaptcha,
  Register, RegisterOpen,
  Login, LoginByCode, LoginAuto, LoginOpen,
  BindOpen, UnbindOpen,
  UpdatePassword, FindPassword,
  UpdateInfo,
  ChangeMobile,
  BindHobbyLabels,
  AddressList, AddressDefault, SetDefaultAddress, AddAddress, UpdateAddress, RemoveAddress,
  HobbyLabels,
  RankRules,
  Upload,
  AppAdvice,
  MessageCenter,
  WXRegisterAuth,
  AdjustRegister,
  QQZoneLogin, QQZoneBindMobile, GetQQZoneInfo,
  getRedPacket, postUserRegister, Updatecommunityuser, Getyearsandconstella, onLogin
}
