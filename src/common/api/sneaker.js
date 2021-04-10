import {
  POST,
  GET,
  POSTGROUP,
  GETGROUP
} from "../util";

const url = {
  ShoeGetTabs: "/api/Marketing/ShoeGetTabs",
  ShoeTabPage: "/api/Marketing/ShoeTabPage",
  ShoeSearch: "/api/Marketing/ShoeSearch",
  SneakerSearch: "/capi/product/qiuxie/open/searchList",
  ShoeDetail: "/api/Marketing/ShoeDetail",
  ShoeSeriesPage: "/api/Marketing/ShoeSeriesPage",
  ShoeHotSale: "/api/Marketing/ShoeHotSale",
  LookMore: "/capi/product/open/lookMore",
  NewProd: "/capi/product/open/getNewProductV268",

  // ProductDetails: "/capi/product/open/productDetails",
  ProductDetails: "/capi/product/open/productDetailsV35",

  // ProductDetailsLogin: "/capi/product/collect/productDetails",
  ProductDetailsLogin: "/capi/product/collect/productDetailsV35",

  // GetItems: '/capi/channel/qiuxie/getNewItemsV300',

  Firstpageshow: '/capi/product/qiuxie/open/firstpageshowV268',
  IndexRecommend: '/capi/product/qiuxie/open/recommend',
  GetExpress: '/capi/product/open/GetExpress/',
  // Publicsell: '/capi/channel/qiuxie/publicsell',
  Publicsell: '/capi/channel/qiuxie/publicsellv35',
  CategoryRecommend: '/capi/product/qiuxie/open/categoryRecommendV268',
  getTag: "/capi/product/qiuxie/open/getTag",
  brandList: "/capi/product/qiuxie/open/brandList",
  seriesList: "/capi/product/qiuxie/open/seriesList",
  tagList: "/capi/product/qiuxie/open/tagList",
  GetOrderExpress: '/capi/product/express/GetOrderExpress',
  // GetOrderUserCoupon: '/capi/account/coupon/getOrderUserCoupon',
  GetOrderUserCoupon: '/api/Marketing/GetNewOrderUserCoupon',
  // Submitsell: '/capi/channel/qiuxie/submitsell',
  Submitsell: '/capi/channel/qiuxie/submitsellv35',
  Submitpresell: '/capi/channel/qiuxie/submitpresell',
  AddOrder: '/capi/order/front/channel/addOrder',
  GetCustomization: '/capi/channel/open/getCustomizationByType',
  productRecord: "/capi/channel/open/productRecord",
  sneakerIdentify: "/capi/channel/open/findIdentifiesByType",
  HintInfo: '/capi/order/front/hintInfo',
  GetOrderDetail: '/capi/order/front/getOrderDetail',
  PayTypeList: '/capi/pay/public/pay/payTypeList',
  H5Prepay: '/capi/pay/public/pay/h5Prepay',
  BuyPrePay: '/capi/pay/public/pay/appPrepay',
  Sellsuccess: '/capi/channel/qiuxie/sellsuccess',

  SearchSizelist: '/capi/product/qiuxie/open/sizelist',
  FaileSearchSizelist: '/capi/product/qiuxie/open/sizelistv3',
  C2CBrandAll: '/capi/product/inner/brandnamelist',
  ApplyAddProduct: '/capi/channel/qiuxie/applyaddproduct',

  CollectSizeList: '/capi/product/collect/collectsizelist',
  CollectSizeListLogin: '/capi/product/open/collectsizelist',
  ConfirmCollect: '/capi/product/collect/confirmcollect',
  Judgeearnestmoney: '/capi/channel/inner/judgeearnestmoney', // 重新出价判断保证金
  Salingnum: '/capi/channel/qiuxie/salingnum', // 重新出价出售中数量

  Presell: '/capi/channel/qiuxie/publishpresell',
  PresellAgreement: '/capi/channel/qiuxie/presellagreement'
}
// 鞋区类目品牌
function ShoeGetTabs(params = {}) {
  return POST(url.ShoeGetTabs, params, false);
}
// 鞋区类目品牌页的轮播与系列
function ShoeTabPage(params = {}) {
  return POST(url.ShoeTabPage, params, false);
}
function ShoeSearch(params = {}) {
  return POST(url.ShoeSearch, params, false);
}
// 鞋子搜索
function SneakerSearch(params = {}) {
  return POSTGROUP(url.SneakerSearch, params, false);
}
// 鞋子详情
function ShoeDetail(params = {}) {
  return POST(url.ShoeDetail, params, false);
}
// 品牌的系列页
function ShoeSeriesPage(params = {}) {
  return POST(url.ShoeSeriesPage, params, false);
}
// 热销榜
function ShoeHotSale(params = {}) {
  return POST(url.ShoeHotSale, params, false);
}

// c2c球鞋商品详情
// function ProductDetails(params = {}) {
//   return POST(url.ShoeHotSale, params, false);
// }

// 球鞋尺码详情
function GetItems(params = {}) {
  return GETGROUP('/capi/channel/qiuxie/getNewItemsV300', params, true);
}
// function GetItems(params = {}) {
//   return GETGROUP('/capi/channel/goods/sizepricelist', params, true);
// }
const GetSkcSizes = ({ productid, colorid }) => {
  return POSTGROUP('/capi/channel/qiuxie/getsizelist', { productid, colorid })
}

// 首页轮播
function Firstpageshow(params = {}) {
  return GETGROUP(url.Firstpageshow, params, false);
}

// 首页推荐

function IndexRecommend(params = {}) {
  return GETGROUP(url.IndexRecommend, params, false);
}

// 商品详情
function ProductDetails(params = {}) {
  return POSTGROUP(url.ProductDetails, params)
}
// 商品详情（登录后）
function ProductDetailsLogin({ productid, issearchclick = false, requestid = '' }) {
  return POSTGROUP(url.ProductDetailsLogin, { productid, issearchclick, requestid })
}

// 相关商品
function LookMore(params = {}) {
  return POSTGROUP(url.LookMore, params)
}

// 球鞋详情物流
function GetExpress(templateId) {
  return GETGROUP(url.GetExpress + templateId)
}

// 球鞋出售
function Publicsell(params = {}) {
  return POSTGROUP(url.Publicsell, params)
}


// 分类中的为你推荐
function CategoryRecommend(params = {}) {
  return GETGROUP(url.CategoryRecommend, params);
}
// 分类
function getTag(params = {}) {
  return GET(url.getTag, params);
}
// 分类中的品牌
function getBrandList(params = {}) {
  return GETGROUP(url.brandList, params);
}
// 分类中的系列
function getSeriesList(params = {}) {
  return GETGROUP(url.seriesList, params);
}
// 分类中的风格,功能,元素,话题,综合
function getTagList(params = {}) {
  return GETGROUP(url.tagList, params);
}
// 新品发售
function NewProd(params = {}) {
  return POSTGROUP(url.NewProd, params);
}

// 获取订单物流模板
function GetOrderExpress(params = {}) {
  return POSTGROUP(url.GetOrderExpress, params);
}

// 获取订单优惠券
function GetOrderUserCoupon(params = {}) {
  return POSTGROUP(url.GetOrderUserCoupon, params);
}

// 提交出售订单
function Submitsell(params = {}) {
  return POSTGROUP(url.Submitsell, params);
}

// 添加订单
function AddOrder(params = {}) {
  return POSTGROUP(url.AddOrder, params);
}

// 客制周边的商品列表
function Customization(params = {}) {
  return POSTGROUP(url.GetCustomization, params)
}

// 鉴定秘籍
function getSneakerIdentify(params = {}) {
  return POSTGROUP(url.sneakerIdentify, params);
}
// 商品详情小喇叭
function productRecord(params = {}) {
  return GETGROUP(url.productRecord, params, false);
}

// 下单提示用户的信息
function HintInfo(params = {}) {
  return GETGROUP(url.HintInfo, params, false);
}

// 订单详情
function GetOrderDetail(params = {}) {
  return GETGROUP(url.GetOrderDetail, params);
}

// 支付方式
function PayTypeList(params = {}) {
  return POSTGROUP(url.PayTypeList, params);
}

// 预支付
function H5Prepay(params = {}) {
  return POSTGROUP(url.H5Prepay, params);
}
const BuyPrePay = (params = {}) => {
  return POSTGROUP(url.BuyPrePay, params);
}

// 出售成功信息
function Sellsuccess(params = {}) {
  return GETGROUP(url.Sellsuccess, params);
}

const FenQiLePayCalc = load_amount => {
  return POSTGROUP('/capi/pay/public/fql/fixedpayment', { load_amount }, 1)
}

const AntPayCalc = load_amount => {
  return POSTGROUP('/capi/pay/public/ali/fixedpayment', { load_amount }, 1)
}

const AntPrepay = ({ orderno, paymenttypeid, paysource, hbfqnum, ordersystemtype, returnurl, quiturl } = {}) => {
  return POSTGROUP('/capi/pay/public/pay/h5hbfqPrepay', { orderno, paymenttypeid, paysource, hbfqnum, ordersystemtype, returnurl, quiturl }, 1)
}

// 商品列表-尺码展示（C2C2.0）
function SearchSizelist(params = {}) {
  return POSTGROUP(url.SearchSizelist, params, false);
}

function FaileSearchSizelist({ brandid }) {
  return POSTGROUP(url.FaileSearchSizelist, { brandid, seiesid: '' }, false);
}
// 品牌列表（C2C2.0）
function C2CBrandAll(params = {}) {
  return POSTGROUP(url.C2CBrandAll, params, false);
}

// 申请添加商品（C2C2.0）
function ApplyAddProduct(params = {}) {
  return POSTGROUP(url.ApplyAddProduct, params, false);
}
// 收藏尺码列表-已登录 （C2C2.0）
function CollectSizeList(params = {}) {
  return POSTGROUP(url.CollectSizeList, params, false);
}

// 收藏尺码列表-未登录 （C2C2.0）
function CollectSizeListLogin(params = {}) {
  return POSTGROUP(url.CollectSizeListLogin, params, false);
}

// 确认收藏 （C2C2.0）
function ConfirmCollect(params = {}) {
  return POSTGROUP(url.ConfirmCollect, params, false);
}


// 重新出价判断保证金 （C2C2.0）
function JudgeMoney(params = {}) {
  return POSTGROUP(url.Judgeearnestmoney, params, false);
}
// 重新出价判断数量在 （C2C2.0）
function SalingNum(params = {}) {
  return POSTGROUP(url.Salingnum, params, false);
}

// 球鞋预售计算总收入
function Presell(params = {}) {
  return POSTGROUP(url.Presell, params)
}

// 提交预售的订单
function Submitpresell(params = {}) {
  return POSTGROUP(url.Submitpresell, params);
}

// 预售买家，卖家须知

function PresellAgreement(params = {}) {
  return GETGROUP(url.PresellAgreement, params, false);
}

export {
  ShoeGetTabs,
  ShoeTabPage,
  ShoeSearch,
  SneakerSearch,
  ShoeDetail,
  ShoeSeriesPage,
  ShoeHotSale,

  ProductDetails,
  ProductDetailsLogin,
  GetItems, GetSkcSizes,
  Firstpageshow,
  IndexRecommend,
  LookMore,
  NewProd,
  GetExpress,
  Publicsell,
  CategoryRecommend,
  getTag,
  getBrandList,
  getSeriesList,
  getTagList,

  Customization,
  productRecord,
  getSneakerIdentify,
  GetOrderExpress,
  GetOrderUserCoupon,
  Submitsell,
  AddOrder,
  HintInfo,
  GetOrderDetail,
  PayTypeList,
  H5Prepay,
  BuyPrePay,
  Sellsuccess,

  FenQiLePayCalc,
  AntPayCalc,
  AntPrepay,

  FaileSearchSizelist,
  SearchSizelist,
  C2CBrandAll,
  ApplyAddProduct,

  CollectSizeList,
  CollectSizeListLogin,
  ConfirmCollect,


  JudgeMoney, SalingNum,

  Presell, Submitpresell,
  PresellAgreement
};
