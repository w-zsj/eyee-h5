import { POST, POSTGROUP } from '@/common/util'

// 分类中的品牌的热门品牌展示
function getHotBrandList(params = {}) {
  return POST('/api/base/hotbrand', params);
}

// 限量发售
const LimitList = (pageindex = 1, pageSize = 20, type = 1) => {
  return POST('/api/Marketing/LimitSaleV300', { pageindex, pageSize, type });
}

// 请求B2C筛选信息列表
const B2CSearchCondition = ({ categoryid, sizetype, type }) => {
  return POST('/api/Base/SearchConditionV30', { categoryid, sizetype, type });
}

/**
 * 首页首屏
 * @param {Number} os 1 IOS 2 Android 3 H5 4 小程序 5 QQZone
 */
const HomeFirst = (os = 3) => {
  // POSTGROUP
  return POSTGROUP('/capi/product/qiuxie/open/homefirstv322', { os })
}

/**
 * 推荐商品
 * @param {Number} pageindex 页码
 */
const RecommendProduct = (pageindex = 1, hometabid = '') => {
  return POST('/api/product/guessWhatYouLikeV322', { pageindex, isc2clist: 1, hometabid }, 0)
}

const ProductSearch = ({ pageindex = 1, pagesize = 20, isc2c = true, keyword = '', hometabid, brandid = '', categoryid = '', beginprice = 0, endprice = -1, issearchall = 0, sorttype = 0, ordertype = 0 }) => {
  let param = { pageindex, pagesize, isc2c, keyword, hometabid, brandid, categoryid, issearchall, sorttype, ordertype }
  if (beginprice >= 0 && endprice != 0) {
    param.beginprice = beginprice
    param.endprice = endprice == -1 ? '' : endprice
  }
  return POST('/api/product/channelproductv322', param, pageindex === 1)
}
// 商城优化 /capi/product/open/searchproduct  新增 c2c商品列表 tab.type==7
const Searchpproduct = ({ hometabid, pageindex, pagesize = 20 }) => {
  return POSTGROUP('/capi/product/open/searchproduct', { hometabid, pageindex, pagesize });
}
// 商城优化 20191125 潮流好物 入口 轮播数据
const ShowShopList = () => {
  return POSTGROUP('/capi/product/open/showshoplist', {});
}
// 商城优化 20191125 斗牛拍卖展示 入口 轮播数据
const Showauctionlist = () => {
  return POSTGROUP('/capi/auction/open/mall/showauctionlistv2', {});
}
// 潮流好物 频道，轮播
const Hometab = () => {
  return POSTGROUP('/capi/product/open/hometab', {});
}
// 潮店
const Searchshop = ({ pageindex, pagesize = 20, userid = '' }) => {
  return POSTGROUP('/capi/product/open/searchshop', { pageindex, pagesize, userid });
}

// 首页频道列表
const homeTabList = () => {
  return POSTGROUP('/capi/product/mall/open/hometablist', {});
}
const homeBannerGg = (hometabid) => {
  return POSTGROUP('/capi/product/mall/open/homefirst', { hometabid });
}

// 抽奖
const activity = (hometabid) => {
  return POSTGROUP('/capi/data/indexdraw/open/activity', { hometabid });
}
const productList = ({ page, hometabid }) => {
  return POSTGROUP('/capi/product/mall/open/productlist', { page, size: 20, hometabid });
}
// 斗牛榜单
const bigdataRank = (params) => {
  return POSTGROUP('capi/bigdata/rank/open/homelist', params, 1, 1)
}
// 第二屏自定义商品列表
// 
export {
  getHotBrandList,
  HomeFirst,
  RecommendProduct, ProductSearch,
  LimitList,
  B2CSearchCondition,
  ShowShopList,
  Showauctionlist,
  Hometab,
  Searchshop,
  Searchpproduct,
  homeTabList,
  homeBannerGg,
  activity,
  productList,
  bigdataRank
}
