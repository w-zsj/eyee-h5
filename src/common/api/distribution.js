
import { POSTGROUP, GETGROUP } from '../util'
const url = {
  entryProducts: '/capi/distribution/front/getProducts',
  isDistribution: '/capi/distribution/front/isDistributor',
  sendMark: '/capi/distribution/imageText/save',
  jumpProduct: '/capi/distribution/front/toBeDistributor',
  distribution: '/capi/distribution/front/tideCargoCenter',
  saveOrderno: '/capi/distribution/imageText',
  orderInfo: '/capi/distribution/imageText/getInfo',
  collection: '/capi/distribution/imageText/imageTextEnshrine',
  switchClass: '/capi/distribution/front/tideCargoCenters',
  imgTextDetailOpen: '/capi/distribution/open/getImageTextDetail',
  imgTextDetail: '/capi/distribution/imageText/getImageTextDetail',
  like: '/capi/distribution/imageText/imageTextLike',
  comment: '/capi/distribution/imageText/allComment',
  saveComment: '/capi/distribution/imageText/saveComment',
  commentLike: '/capi/distribution/imageText/commentIsLike',
  saveShare: '/capi/distribution/imageText/saveShareNum',
  myGraphic: '/capi/distribution/personalContro/myPageText',
  incomeInfo: '/capi/distribution/balanceContro/getIncomeInfo',
  newOrder: '/capi/distribution/orderServer/getOrderRecent',
  myBee: '/capi/distribution/orderServer/myBee',
  histroyIncome: '/capi/distribution/personalContro/getHistroyCome',
  monthIncome: '/capi/distribution/personalContro/getMonthIncome',
  mychildIncome: 'capi/distribution/personalContro/myChildIncome',
  myChildCount: 'capi/distribution/personalContro/myChildCount',
  message: 'capi/distribution/personalContro/message',
  shareToBeDistributionUrl: 'capi/distribution/front/shareToBeDistributionUrl'
}

// 判断是否分销商
function isDistribution(params = {}) {
  return POSTGROUP(url.isDistribution, params)
}

// 获取入门商品
function GetEntryProducts(params = {}) {
  return POSTGROUP(url.entryProducts, params)
}

// 标记进入入门商品
function SendMark(params = {}) {
  return POSTGROUP(url.sendMark, params)
}

// 跳过入门商品
function jumpProduct(params = {}) {
  return POSTGROUP(url.jumpProduct, params)
}

// 保存入门商品订单
function saveOrderno(params = {}) {
  return GETGROUP(url.saveOrderno + '/' + params.orderno)
}

// 查询入门商品订单
function orderInfo(params = {}) {
  return GETGROUP(url.orderInfo)
}

// 潮货中心
function GetDistribution(params = {}) {
  return POSTGROUP(url.distribution, params)
}

// 收藏
function collection(params = {}) {
  return POSTGROUP(url.collection, params)
}

// 点赞
function like(params = {}) {
  return POSTGROUP(url.like, params)
}

// 评论
function comment(params = {}) {
  return POSTGROUP(url.comment, params)
}

// 写评论
function saveComment(params = {}) {
  return POSTGROUP(url.saveComment, params)
}

// 评论点赞
function commentLike(params = {}) {
  return POSTGROUP(`${url.commentLike}/${params.commentid}/${params.islike}`)
}

// 切换分类
function switchClass(params = {}) {
  return POSTGROUP(url.switchClass + '/' + params.id, params)
}

// 图文详情
function imgTextDetail(params = {}) {
  return GETGROUP(url.imgTextDetail, params)
}

// 图文详情open
function imgTextDetailOpen(params = {}) {
  return GETGROUP(url.imgTextDetailOpen, params)
}

// 分享图文
function saveShare(params = {}) {
  return GETGROUP(url.saveShare, params)
}

// 我的潮货
function getIncomeInfo(params = {}) {
  return POSTGROUP(url.incomeInfo, params)
}

// 最新订单
function getNewOrder(params = {}) {
  return POSTGROUP(url.newOrder, params)
}

// 我的买手
function getMybee(params = {}) {
  return POSTGROUP(url.myBee, params)
}

// 我的图文
function getMyGraphic(params = {}) {
  return POSTGROUP(url.myGraphic, params)
}

// 累计收入
function getHistroyIncome(params = {}) {
  return POSTGROUP(url.histroyIncome, params)
}

// 累计收入
function getMonthIncome(params = {}) {
  return POSTGROUP(url.monthIncome, params)
}

// 二级分销商收入列表
function mychildIncome({ distributionid } = {}) {
  return POSTGROUP(url.mychildIncome, {
    distributionid
  })
}

// 二级分销商累计收入
function myChildCount({ distributionid } = {}) {
  return POSTGROUP(url.myChildCount, {
    distributionid
  })
}

function message(params = {}) {
  return GETGROUP(url.message, params)
}

function shareToBeDistributionUrl(params = {}) {
  return GETGROUP(url.shareToBeDistributionUrl, params)
}

export {
  GetEntryProducts,
  isDistribution,
  GetDistribution,
  SendMark,
  jumpProduct,
  saveOrderno,
  orderInfo,
  collection,
  switchClass,
  imgTextDetail,
  imgTextDetailOpen,
  like,
  comment,
  saveComment,
  commentLike,
  getIncomeInfo,
  getNewOrder,
  getMybee,
  getMyGraphic,
  saveShare,
  getHistroyIncome,
  getMonthIncome,
  mychildIncome,
  myChildCount,
  message,
  shareToBeDistributionUrl
}

