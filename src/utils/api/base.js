import { POSTGROUP } from '@/common/util'

/**
 * 达观数据上报
 * @param {Object} options
 * @param {String} options.netuserid 当前登录用户的id
 * @param {String} options.itemid 商品id
 * @param {String} options.actiontype 用户对item的具体行为, 分享：share；购买：buy；下单：order；支付：pay；下单成功：pay_success；搜索：search；收藏：collect；商品详情：view、rec_click、search_click；浏览推荐：rec_show
 * @param {String} options.cmdtype 操作类型
 */
const ActionReport = ({ netuserid, itemid, actiontype, cmdtype = 'add' }) => {
  return POSTGROUP('/capi/product/open/reportUserAction', { netuserid, itemid, actiontype, cmdtype }, 0)
}

const GetGuideInfo = $ => {
  return POSTGROUP('/capi/exchange/precoupon/isquotationnew', {}, 0)
}
const getIp = $ => {
  return Promise.resolve('')
  // return POSTGROUP('https://actionlog.eyee.com/open/log/queryip', {}, 0)
}

export { ActionReport, GetGuideInfo, getIp }

export const GetWeappQRCode = ({ path, productid = '', ishyaline = null }) =>
  POSTGROUP('/capi/data/indexdraw/getWeiXinQRCodeUrl', { path, productid, ishyaline }, 1)
