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
  Judgeearnestmoney: '/capi/channel/inner/judgeearnestmoney', // ???????????????????????????
  Salingnum: '/capi/channel/qiuxie/salingnum', // ???????????????????????????

  Presell: '/capi/channel/qiuxie/publishpresell',
  PresellAgreement: '/capi/channel/qiuxie/presellagreement'
}
// ??????????????????
function ShoeGetTabs(params = {}) {
  return POST(url.ShoeGetTabs, params, false);
}
// ???????????????????????????????????????
function ShoeTabPage(params = {}) {
  return POST(url.ShoeTabPage, params, false);
}
function ShoeSearch(params = {}) {
  return POST(url.ShoeSearch, params, false);
}
// ????????????
function SneakerSearch(params = {}) {
  return POSTGROUP(url.SneakerSearch, params, false);
}
// ????????????
function ShoeDetail(params = {}) {
  return POST(url.ShoeDetail, params, false);
}
// ??????????????????
function ShoeSeriesPage(params = {}) {
  return POST(url.ShoeSeriesPage, params, false);
}
// ?????????
function ShoeHotSale(params = {}) {
  return POST(url.ShoeHotSale, params, false);
}

// c2c??????????????????
// function ProductDetails(params = {}) {
//   return POST(url.ShoeHotSale, params, false);
// }

// ??????????????????
function GetItems(params = {}) {
  return GETGROUP('/capi/channel/qiuxie/getNewItemsV300', params, true);
}
// function GetItems(params = {}) {
//   return GETGROUP('/capi/channel/goods/sizepricelist', params, true);
// }
const GetSkcSizes = ({ productid, colorid }) => {
  return POSTGROUP('/capi/channel/qiuxie/getsizelist', { productid, colorid })
}

// ????????????
function Firstpageshow(params = {}) {
  return GETGROUP(url.Firstpageshow, params, false);
}

// ????????????

function IndexRecommend(params = {}) {
  return GETGROUP(url.IndexRecommend, params, false);
}

// ????????????
function ProductDetails(params = {}) {
  return POSTGROUP(url.ProductDetails, params)
}
// ???????????????????????????
function ProductDetailsLogin({ productid, issearchclick = false, requestid = '' }) {
  return POSTGROUP(url.ProductDetailsLogin, { productid, issearchclick, requestid })
}

// ????????????
function LookMore(params = {}) {
  return POSTGROUP(url.LookMore, params)
}

// ??????????????????
function GetExpress(templateId) {
  return GETGROUP(url.GetExpress + templateId)
}

// ????????????
function Publicsell(params = {}) {
  return POSTGROUP(url.Publicsell, params)
}


// ????????????????????????
function CategoryRecommend(params = {}) {
  return GETGROUP(url.CategoryRecommend, params);
}
// ??????
function getTag(params = {}) {
  return GET(url.getTag, params);
}
// ??????????????????
function getBrandList(params = {}) {
  return GETGROUP(url.brandList, params);
}
// ??????????????????
function getSeriesList(params = {}) {
  return GETGROUP(url.seriesList, params);
}
// ??????????????????,??????,??????,??????,??????
function getTagList(params = {}) {
  return GETGROUP(url.tagList, params);
}
// ????????????
function NewProd(params = {}) {
  return POSTGROUP(url.NewProd, params);
}

// ????????????????????????
function GetOrderExpress(params = {}) {
  return POSTGROUP(url.GetOrderExpress, params);
}

// ?????????????????????
function GetOrderUserCoupon(params = {}) {
  return POSTGROUP(url.GetOrderUserCoupon, params);
}

// ??????????????????
function Submitsell(params = {}) {
  return POSTGROUP(url.Submitsell, params);
}

// ????????????
function AddOrder(params = {}) {
  return POSTGROUP(url.AddOrder, params);
}

// ???????????????????????????
function Customization(params = {}) {
  return POSTGROUP(url.GetCustomization, params)
}

// ????????????
function getSneakerIdentify(params = {}) {
  return POSTGROUP(url.sneakerIdentify, params);
}
// ?????????????????????
function productRecord(params = {}) {
  return GETGROUP(url.productRecord, params, false);
}

// ???????????????????????????
function HintInfo(params = {}) {
  return GETGROUP(url.HintInfo, params, false);
}

// ????????????
function GetOrderDetail(params = {}) {
  return GETGROUP(url.GetOrderDetail, params);
}

// ????????????
function PayTypeList(params = {}) {
  return POSTGROUP(url.PayTypeList, params);
}

// ?????????
function H5Prepay(params = {}) {
  return POSTGROUP(url.H5Prepay, params);
}
const BuyPrePay = (params = {}) => {
  return POSTGROUP(url.BuyPrePay, params);
}

// ??????????????????
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

// ????????????-???????????????C2C2.0???
function SearchSizelist(params = {}) {
  return POSTGROUP(url.SearchSizelist, params, false);
}

function FaileSearchSizelist({ brandid }) {
  return POSTGROUP(url.FaileSearchSizelist, { brandid, seiesid: '' }, false);
}
// ???????????????C2C2.0???
function C2CBrandAll(params = {}) {
  return POSTGROUP(url.C2CBrandAll, params, false);
}

// ?????????????????????C2C2.0???
function ApplyAddProduct(params = {}) {
  return POSTGROUP(url.ApplyAddProduct, params, false);
}
// ??????????????????-????????? ???C2C2.0???
function CollectSizeList(params = {}) {
  return POSTGROUP(url.CollectSizeList, params, false);
}

// ??????????????????-????????? ???C2C2.0???
function CollectSizeListLogin(params = {}) {
  return POSTGROUP(url.CollectSizeListLogin, params, false);
}

// ???????????? ???C2C2.0???
function ConfirmCollect(params = {}) {
  return POSTGROUP(url.ConfirmCollect, params, false);
}


// ??????????????????????????? ???C2C2.0???
function JudgeMoney(params = {}) {
  return POSTGROUP(url.Judgeearnestmoney, params, false);
}
// ??????????????????????????? ???C2C2.0???
function SalingNum(params = {}) {
  return POSTGROUP(url.Salingnum, params, false);
}

// ???????????????????????????
function Presell(params = {}) {
  return POSTGROUP(url.Presell, params)
}

// ?????????????????????
function Submitpresell(params = {}) {
  return POSTGROUP(url.Submitpresell, params);
}

// ???????????????????????????

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
