import { POSTGROUP } from '@/common/util'

const pre = '/capi/auction/'
// 拍卖活动首页
export const AuctionInfo = auctionid =>
  POSTGROUP(pre + 'open/auction', { auctionid })

// 场次商品列表 /capi/auction/open/scenes/product  /capi/auction/scenes/product
export const SceneGoods = ({ loged = false, auctionid, sceneid, page = 1, size = 20 } = {}) =>
  POSTGROUP(`${pre}${loged ? '' : 'open/'}scenes/product`, { auctionid, sceneid, page, size }, 0)

// 推荐拍品
export const Recommends = ({ auctionid = '', auctiongoodid = '', userid = "" }) =>
  POSTGROUP(pre + 'open/recommand/product', { auctionid, auctiongoodid, userid }, 0)

// 中标支付提醒+分享数据
export const AuctionExtInfo = ({ auctionid = '', auctiongoodid = '' }) =>
  POSTGROUP(pre + 'index/pop', { auctionid, auctiongoodid }, 0)

// 拍品详情 /capi/auction/open/good/item  /capi/auction/good/item
export const AuctionGoodInfo = (auctiongoodid, loged = false) =>
  POSTGROUP(`${pre}${loged ? '' : 'open/'}product/item`, { auctiongoodid })

// 出价记录
export const BidRecords = ({ auctiongoodid, page = 1, size = 10 }) =>
  POSTGROUP(pre + 'open/product/bidrecord', { auctiongoodid, page, size }, page > 1)

// 出价
export const AuctionBid = ({ auctiongoodid, bid }) =>
  POSTGROUP(pre + 'product/bid', { auctiongoodid, bid })

// 参与的
export const ParticipateList = ({ page = 1, size = 10, type = 3 }) =>
  POSTGROUP(pre + 'index/myparticipate', { page, size, type })

// 设置提醒
export const SetRemind = (auctiongoodid, status) =>
  POSTGROUP(pre + 'product/remind', { auctiongoodid, status })
// 商品详情
export const ProductParams = auctiongoodid => {
  return POSTGROUP(pre + 'business/open/productdetail', { auctiongoodid })
}


// 我发布的-拍品管理、订单管理数量
export const AuctionCount = () => {
  return POSTGROUP(pre + 'business/auctioncount', {})
}
// 我发布的-拍品管理列表
export const AuctionGoodsList = ({ status, page = 1, size = 10 }) => {
  return POSTGROUP(pre + 'business/auctiongoodslist', { status, page, size })
}

// 我发布的- 订单管理列表
export const AuctionOrderList = ({ status, page = 1, size = 10 }) => {
  return POSTGROUP(pre + 'business/auctionorderlist', { status, page, size })
}
// 一键上架
export const OneKeyShelf = ({ auctiongoodid }) => {
  return POSTGROUP(pre + 'business/onekeyshelf', { auctiongoodid })
}

// 重新编辑信息
export const Reeditinfo = ({ productid }) => {
  return POSTGROUP(pre + 'business/reeditinfo', { productid })
}

// 我发布的- 我不卖了
export const Cancelsell = ({ productid }) => {
  return POSTGROUP(pre + 'business/cancelsell', { productid })
}

// 保存买家保证金记录
export const Savebuyermargin = ({ auctiongoodid, margin, productname }) => {
  return POSTGROUP(pre + 'business/savebuyermargin', { auctiongoodid, margin, productname })
}

// 点击发布按钮判断当前是否有活动
export const GetIsauctions = () => {
  return POSTGROUP(pre + 'open/getisauctionsv2', {})
}

// 判断是否合作商家
export const Cooperativeseller = () => {
  return POSTGROUP(pre + 'business/cooperativeseller', {})
}
// 合作商家查询
export const CheckQuery = () => {
  return POSTGROUP(pre + 'cooperative/biz/query', {})
}
// 合作商家更新
export const Operate = (params) => {
  return POSTGROUP(pre + 'cooperative/biz/operate', params, 1)
}

// 设置是否想要
export const IsWant = (auctiongoodid, iswant) =>
  POSTGROUP(pre + 'product/iswant', { auctiongoodid, iswant }, 0)
// 拍卖主页 轮播
export const MallBanners = () => {
  return POSTGROUP(pre + 'open/banners', {}, 1)
}
// 评论列表
export const CommentList = ({ page, size = 10, auctiongoodid, uid = '' }) => {
  return POSTGROUP('/capi/community/open/auction/comments/list', { index: page, size, auctiongoodid, uid }, 0)
}
// 评论点赞
export const HandPraiseComments = ({ refid, type, receiveuserid }) => {
  return POSTGROUP(pre + 'auction/praisecomment', { refid, type, receiveuserid }, 0)
}
// 评论
// "targetid": "评论或回复的对象id：商品id(operationtype=1) | 评论id(operationtype=2)",
//   "operationtype": "用户操作类型 1: 评论 2：回复",
//     "content": "评论内容（限制200字）"
export const CommentorReplay = ({ targetid, operationtype, content }) => {
  return POSTGROUP(pre + 'auction/comments/commentorreplay', { targetid, operationtype, content }, 0)
}