/*
 * route.js
 * 全局路由配置
 */

import layout from '../components/Layout'
import routerList from '../router/router.js'
// import mallLayout from '../components/mall/Layout'
// import userLayout from '../components/user/Layout'
// import orderLayout from '../components/order/Layout'

const noopLayout = {
  template: `
  <div>
    <router-view></router-view>
  </div>
  `
}

const home = () => import('../views/mall/Home'), // import('../components/Home'),
  // mallHome = () => import('../components/mall/Home'),
  launch = () => import('../components/Launch'),

  // shopHome = () => import('../components/mall/shop/Home'),
  // category = () => import('../components/mall/Category'),
  // couponList = () => import('../components/mall/Coupon'),
  NewCoupon = () => import('../components/mall/NewCoupon'),
  // ghost = () => import('../components/mall/Ghost'),
  // brandHome = () => import('../components/mall/Brand'),
  productDetail = () => import('../components/mall/ProductDetail'),
  playProductVideo = () => import('../components/mall/PlayProductVideo'),
  // shopDetail = () => import('../components/mall/shop/ShopDetail'),
  shopDetail = () => import('../components/mall/shop/Detail'),
  shopInfo = () => import('../components/mall/shop/Info'),
  shopLicense = () => import('../components/mall/shop/License'),
  // shopProduct = () => import('../components/mall/shop/ShopProduct'),
  // shopSummary = () => import('../components/mall/shop/ShopSummary'),
  // limit = () => import('../components/mall/Limit'),
  // discount = () => import('../components/mall/Discount'),
  active = () => import('../components/Active'),
  shopFilter = () => import('../components/mall/shopFilter'),
  productSearch = () => import('../components/mall/ProductSearch'),
  shopNotice = () => import('../components/templates/ShopNotice'),
  ProductSimil = () => import('../components/mall/ProductSimil'),//相似
  // GhostProList
  // GhostProList = () => import('../components/mall/GhostProList'),
  // abouts = () => import('../components/about/abouts'),
  privacy = () => import('../components/about/Privacy'),
  coupon = () => import('../components/about/Coupon'),
  // slas = () => import('../components/about/slas'),
  // sneakIndex = () => import('../components/sneaker/Index'),
  // sneakHome = () => import('../components/sneaker/Home'),
  traceabilityHome = () => import('../components/verify/home'),
  traceabilityDetail = () => import('../components/verify/detail'),
  // sneakSex = () => import('../components/sneaker/SneakerSex'),
  sneakCategory = () => import('../components/sneaker/Category'),
  sneakSearch = () => import('../components/sneaker/Search'),
  sneakerIdentify = () => import('../components/sneaker/SneakerIdentify'),
  // sneakSeries = () => import('../components/sneaker/SneakerSeries'),
  // sneakerDetail = () => import('../components/sneaker/SneakerDetail'),
  sneakDetail = () => import('../components/sneaker/Detail'),
  sneakSell = () => import('../components/sneaker/Sell'),
  sneakMore = () => import('../components/sneaker/More'),
  sneakNewProd = () => import('../components/sneaker/NewProduct'),
  sneakNewCheck = () => import('../components/sneaker/NewCheck'),
  ShoeHotSale = () => import('../components/sneaker/SneakerHotSale'),
  SneakerPayResult = () => import('../components/sneaker/PayResult'),
  Customization = () => import('../components/sneaker/Customization'),//客制周边
  SneakerWxpay = () => import('../components/sneaker/Wxpay'),
  // supremeHome = () => import("../components/supreme/Home"),
  // supremeSale = () => import("../components/supreme/Sale"),
  // supremeClassify = () => import("../components/supreme/Classify"),
  // lookbook = () => import("../components/supreme/LookBook"),
  // classifyList = () => import("../components/supreme/ClassifyList"),
  // supremeDetail = () => import("../components/supreme/SupremeDetail"),
  activityDetail = () => import("../components/mall/ActivityDetail"),
  // login = () => import('../components/Login'),
  newLogin = () => import('../components/newLogin'),
  completeInfo = () => import('../components/user/completeInfo'),
  cart = () => import('../components/cart/Cart'),
  country = () => import('../components/Country'),

  userHome = () => import('../components/user/Home'),
  userAccount = () => import('../components/user/Account'),
  userOrder = () => import('../components/user/Order'),
  userCollection = () => import('../components/user/Collection'),
  userCoupon = () => import('../components/user/Coupon'),
  userCouponhistory = () => import('../components/user/CouponHistory'),
  userAbout = () => import('../components/about/UserAbout'),
  userSlas = () => import('../components/about/Slas'),
  userAboutus = () => import('../components/about/Abouts'),
  userSet = () => import('../components/user/UserSet'),
  addUserInfo = () => import('../components/user/UserAddInfo'),
  uesrSex = () => import('../components/user/Sex'),//注册绑定性别
  // uesrHobby = () => import('../components/user/Hobby'),//爱好
  userAddress = () => import('../components/user/Address'),
  editAddress = () => import('../components/user/EditAddress'),
  feedback = () => import('../components/user/Feedback'),

  orderDetl = () => import('../components/order/Detail'),
  orderTrack = () => import('../components/order/Track'),
  // orderCheck = () => import('../components/order/Check'),
  orderNewCheck = () => import('../components/order/newCheck'),
  // orderExpress = () => import('../components/order/ExpressList'),
  pay = () => import('../components/pay/Pay'),
  SneakerPay = () => import('../components/sneaker/Pay'),
  payJump = () => import('../components/pay/WxJump'),
  payFail = () => import('../components/pay/PayUnit'),
  paySuccess = () => import('../components/pay/PayUnit'),
  wxlogin = () => import('../components/WxLogin'),
  // honeyHome = () => import('../components/honey/Home'),
  orderServiceTemp = () => import('../components/order/service/Temp'),
  orderServiceAdd = () => import('../components/order/service/Add'),
  orderServiceInfo = () => import('../components/order/service/Info'),
  orderAfterSaleTemp = () => import('../components/order/AfterSale/Temp'),
  orderAfterSaleAdd = () => import('../components/order/AfterSale/Add'),
  orderAfterSaleInfo = () => import('../components/order/AfterSale/Info'),
  // groupList = () => import('../components/group/GroupList'),
  // groupDetail = () => import('../components/group/GroupDetail'),
  // shareGroup = () => import('../components/group/ShareGroup'),
  // orderGroup = () => import('../components/group/OrderGroup'),

  helphome = () => import('../components/helpbargain/helphome'),
  // helpList = () => import('../components/helpbargain/helpList'),
  // helporder = () => import('../components/helpbargain/helporder'),
  // helpdetail = () => import('../components/helpbargain/helpdetail'),

  // shopinto = () => import('../components/sc2c/shopinto/shopindex'),
  // autheninfo = () => import('../components/sc2c/shopinto/autheninfo'),
  // shoppay = () => import('../components/sc2c/shopinto/shoppay'),
  // shopcenter = () => import('../components/sc2c/shoporder/shopcenter'),
  // shoporderlist = () => import('../components/sc2c/shoporder/shoporderlist'),
  // sellingdetail = () => import('../components/sc2c/shoporder/sellingdetail'),
  // shoporderdetail = () => import('../components/sc2c/shoporder/shoporderdetail'),
  logistics = () => import('../components/sc2c/shoporder/logistics'),
  // deduct = () => import('../components/sc2c/shoporder/deduct'),
  // shoppaysuccess = () => import('../components/sc2c/shoporder/shoppaysuccess'),
  // businessinfo = () => import('../components/sc2c/shoporder/businessinfo'),
  // shoppayfaill = () => import('../components/sc2c/shoporder/shoppayfaill'),
  // shopwxjump = () => import('../components/sc2c/shoporder/shopwxjump'),
  // returnaddress = () => import('../components/sc2c/shoporder/returnaddress'),
  // autheninfocode = () => import('../components/sc2c/shopinto/autheninfocode'),
  // autheninfofail = () => import('../components/sc2c/shopinto/autheninfofail'),
  // getout = () => import('../components/sc2c/shoporder/getout'),
  editbackaddress = () => import('../components/sc2c/shoporder/editbackaddress'),
  buyerdetail = () => import('../components/sc2c/shoporder/buyerdetail'),
  buyerSellKnow = () => import('../components/sc2c/shoporder/buyerSellKnow'),
  applyAddProduct = () => import('../components/sc2c/shoporder/applyAddProduct'),
  allproductbrand = () => import('../components/sc2c/shoporder/allproductbrand'),

  newGift = () => import('../components/redPacket/newGift'),
  // 抽奖
  examine = () => import('../components/drawLottery/examine'),
  lookRule = () => import('../components/drawLottery/lookRule'),
  lottery = () => import('../components/drawLottery/lottery'),
  // shareLottery = () => import('../components/drawLottery/shareLottery'),
  getPrize = () => import('../components/drawLottery/getPrize'),
  lookRuleDetail = () => import('../components/drawLottery/lookRuleDetail'),
  appShare = () => import('../components/drawLottery/appShare'),

  //B2CMALL改版
  mallLimit = () => import('../views/mall/Limit'),
  mallCategory = () => import('../views/mall/Category'),
  // filterpro = () => import('../comps/FilterProduct'),
  nesearch = () => import('../views/search/Search'),
  searchresults = () => import('../views/search/Results'),
  Presale = () => import('../views/sneaker/Presale'),
  HotSale = () => import('../views/sneaker/HotSale'),

  //年货节
  // Main20190128 = () => import('../views/newyear/MainVenue'),
  // Sub20190128 = () => import('../views/newyear/SubVenue'),
  // Mall20190128 = () => import('../views/newyear/Mall'),
  // RainModel20190128 = () => import('../comps/RainModel'),
  // 拼团分享承接页
  ShareAssemble = () => import('../components/shareUndertake/assemble'),
  // 在线鉴定分享承接页
  ShareOnline = () => import('../components/shareUndertake/onlineidentify'),

  // ClearShoppingCartRule = () => import('../views/activities/clearShoppingCart/Rule'),
  // ClearShoppingCartInfo = () => import('../views/activities/clearShoppingCart/Info'),
  // ClearShoppingCartLottery = () => import('../views/activities/clearShoppingCart/LotteryResult'),
  // ClearShoppingCartResult = () => import('../views/activities/clearShoppingCart/Result'),

  //代古拉K专题
  // DaiGuLaKHome = () => import('../views/activities/dglk/home'),
  // DaiGuLaKVdo = () => import('../views/activities/dglk/vdo'),

  // LuckyCoinHome = () => import('../views/luckycoin/home'),
  // LuckyCoinShare = () => import('../views/luckycoin/share'),
  // Identify = () => import('../views/luckycoin/Identify'),
  // Guide = () => import('../views/luckycoin/guide'),

  NewSneaker = () => import('../views/sneaker/mall'),
  BrandRec = () => import('../views/mall/BrandRec'),
  ShopColl = () => import('../views/mall/ShopColl'),
  ShopRec = () => import('../views/mall/ShopRec'),

  raspHappy = () => import('../views/rasp/raspHappy'),

  // Ballot = () => import('../views/kusoballot/Ballot'),

  // WxCode = () => import('../views/wxhelp/WxCode'),

  CategoryMall = () => import('../views/c2c/categoryMall'),
  CategoryMore = () => import('../views/c2c/categoryMore'),
  userGuide = () => import('../views/activities/userGuide'),
  consign = () => import('../views/activities/consign'),
  proDetialShare = () => import('../views/bull/proDetialShare'),
  platformActive = () => import('../views/activities/bigPromotion/main'), //大促活动
  subplace = () => import('../views/activities/bigPromotion/subplace'), //大促活动
  // downApp = () => import('../views/downApp/downApp'), //引导下载APP--PC端
  loadApp = () => import('../views/downApp/loadApp'), //引导下载APP--H5端

  sneakerticketDetail = () => import('../views/bull/sneakerticket/detail'), //球鞋券抽签
  sneakerticketFriendList = () => import('../views/bull/sneakerticket/friendList'), //助力的好友列表
  sneakerticketCouponSaleList = () => import('../views/bull/sneakerticket/couponSaleList'), //预售券发售列表
  sneakerticketBuylist = () => import('../views/bull/sneakerticket/buylist'), //预售券发售列表 尖货竞拍 最新的
  TicketResult = () => import('../views/bull/sneakerticket/result.vue'), //球鞋券抽签
  riskAsse = () => import('../components/about/riskAsse'), //球鞋券抽签
  presaledesc = () => import('../components/about/presaledesc'), //预售券说明书
  aboutSecret = () => import('../views/about/Secret'),

  mayDayActive = () => import('../views/activities/mayDay/main'), //五一大促
  mayDaySubplace = () => import('../views/activities/mayDay/subPlace'), //五一大促
  mayDayDetail = () => import('../views/activities/mayDay/detail'), //五一大促
  MidyearLottery = () => import('../views/activities/mayDay/Lottery'),

  spotcousaledesc = () => import('../components/about/spotcousaledesc'), //闪电发货商品说明
  CashCoupon = () => import('../components/about/CashCoupon'), //现货券买卖协议

  CompanyInfo = () => import('../components/about/CompanyInfo'),
  FootwearClub = () => import('../views/activities/footwearClub'), //潮友团H5分享承接页
  FootwearClubResponse = () => import('../views/activities/footwearClubResponse'), //潮友团H5响应团页
  FootwearClubTask = () => import('../views/activities/footwearClubTask'), //潮友团H5响应团页
  CreatefootWear = () => import('../views/activities/CreatefootWear'), //创建潮友团
  ShoeRule = () => import('../views/activities/ShoeRule'), //创建潮友团
  RedpacketLayout = () => import('../views/redpacket/Layout'),
  RedpacketGift = () => import('../views/redpacket/Gift'),
  RedpacketLuck = () => import('../views/redpacket/Luck'),
  RedpacketShare = () => import('../views/redpacket/Share'),
  MonitorCard = () => import('../views/bull/monitor/monitorCard'), // 获得监控卡 页面
  InTestInvitation = () => import('../views/bull/monitor/inTestInvitation'), // 斗牛球鞋监控
  // VipDescription = () => import('../views/bull/monitor/vipDescription'), // 斗牛监控VIP说明

  Charts = () => import('../views/winners/charts'),
  Pullnew = () => import('../views/winners/pullnew'),

  GetCookie = () => import('../views/GetCookie'),
  newuserarea = () => import('../views/activities/newuserarea'), //新人专区落地页
  Sercardctd = () => import('../components/about/sercardctd'), //现货券买服务卡介绍卖协议
  // StoreLottery = () => import('../views/activities/storeLottery'), //门店抽奖
  StoreAct = () => import('../views/activities/storeact'), //门店抽奖

  TrendGoods = () => import('../components/mall/trendGoods/index.vue'), // 潮流好物

  BallList = () => import('../views/oxBall/list/index'), //牛丸 邀请好友列表


  OxballDetail = () => import('../views/oxBall/mall/index.vue'),
  OxballGet = () => import('../views/oxBall/mall/get.vue'),
  OxballMarket = () => import('../views/oxBall/mall/market.vue'),
  OxballRecord = () => import('../views/oxBall/mall/record.vue'),

  ServeTabRule = () => import('../views/about/ServeTabRule.vue'), //服务tab 规则页面

  CollectionCard = () => import('../views/activities/collectionCard/index.vue'), //集卡活动
  CollectionCardRule = () => import('../views/activities/collectionCard/rule.vue'), //集卡活动

  // 主会场（限时抢券）
  MainPlace = () => import('../views/activities/mainPlace.vue'), //裂变活动宣传页

  // 销售OA
  oaHome = () => import('../views/oa/Home.vue'),
  oaTeam = () => import('../views/oa/Team.vue'),
  oaFinance = () => import('../views/oa/Finance.vue'),
  oaPersonallyFans = () => import('../views/oa/PersonallyFans.vue'),
  oaTeamFans = () => import('../views/oa/TeamFans.vue'),
  oaBillList = () => import('../views/oa/BillList.vue'),
  oaSettlementDetail = () => import('../views/oa/SettlementDetail.vue'),

  nouse = null//这行别动,用来占位,在上面新加,新加行要加尾逗号 autheninfocode editbackaddress buyerdetail

let routes = [
  {
    path: '/', component: layout, children: [
      { path: '', name: 'home', component: () => import('../views/mall/newmall'), meta: { tab: 'MENU_HOME', isbindHobby: 'BIND_HOBBY' } },// , shell: 'waiting-home'
      { path: 'sneaker/mall', name: 'NewSneaker', component: NewSneaker, meta: { tab: 'MENU_SNEAK' } },
      // { path: 'home', redirect: '/' },// , shell: 'waiting-home'
      // {
      //   path: 'mall', component: mallLayout, children: [
      //     // { path: '', component: mallHome, meta: { tab: 'MENU_MALL', b2cTab: 'B2C_HOME' } },
      //     { path: '', redirect: '/' },
      //     { path: 'brand', component: brandHome, meta: { tab: 'MENU_MALL', b2cTab: 'B2C_BRAND' } },
      //     { path: 'shop', component: shopHome, meta: { tab: 'MENU_MALL', b2cTab: 'B2C_SHOP' } },
      //     { path: 'ghost', component: ghost, meta: { tab: 'MENU_MALL', b2cTab: 'B2C_GMALL' } },
      //     // { path: 'limit', component: limit, meta: { tab: 'MENU_MALL', b2cTab: 'B2C_LIMIT' } },
      //     { path: 'discount', component: discount, meta: { tab: 'MENU_MALL', b2cTab: 'B2C_DISCOUNT' } },
      //   ]
      // },
      // { path: 'GhostProList', component: GhostProList, meta: { hideMenu: true } },
      // { path: 'category', component: category, meta: { hideMenu: true } },
      { path: 'category', name: 'mallCategory', component: mallCategory, meta: { tab: 'MENU_CATE' } },
      // { path: 'coupon', component: couponList, meta: { hideMenu: true } },
      { path: 'coupon', component: NewCoupon, meta: { hideMenu: true } },
      { path: 'shop/shopdetail/:id', component: shopDetail, meta: { hideMenu: true } },
      { path: 'shop/info/:id', component: shopInfo, meta: { hideMenu: true } },
      { path: 'shop/license/:url', component: shopLicense, meta: { hideMenu: true } },
      // { path: 'shop/shopsummary', component: shopSummary, meta: { hideMenu: true } },
      { path: 'ProductSimil/:id', component: ProductSimil, name: 'ProductSimil', meta: { hideMenu: true } },
      { path: 'productDetail/:id?', name: 'product-detail', component: productDetail, meta: { hideMenu: true, shell: 'waiting-product' } },
      { path: '/playProductVideo', name: 'product-product-video', component: playProductVideo, meta: { hideMenu: true } },
      // 助力砍价
      {
        path: 'helpbargain', component: helphome, children: [
          { path: '', name: 'cutbargain', component: null, meta: { hideMenu: true, title: '助力享低价' } },
          { path: 'helporder', component: null, meta: { hideMenu: true, title: '助力享低价' } },
        ]
      },
      // { path: 'helpbargain/helpdetail/:id', component: helpdetail, meta: { hideMenu: true, title: '助力享低价' } },
      // 球鞋c2c
      // { path: 'shopinto', name: 'shopinto', component: shopinto, meta: { hideMenu: true } },
      // { path: 'autheninfo', name: 'autheninfo', component: autheninfo, meta: { hideMenu: true } },
      // { path: 'shoppay', name: 'shoppay', component: shoppay, meta: { hideMenu: true } },
      // { path: 'shopcenter', name: 'shopcenter', component: shopcenter, meta: { hideMenu: true } },
      // { path: 'shoporderlist/:per', name: 'shoporderlist', component: shoporderlist, meta: { hideMenu: true } },
      // { path: 'sellingdetail/', name: 'sellingdetail', component: sellingdetail, meta: { hideMenu: true } },
      // { path: 'shoporderdetail/:id', name: 'shoporderdetail', component: shoporderdetail, meta: { hideMenu: true } },
      // { path: 'deduct', name: 'deduct', component: deduct, meta: { hideMenu: true } },
      // { path: 'businessinfo', name: 'businessinfo', component: businessinfo, meta: { hideMenu: true } },
      // { path: 'returnaddress', name: 'returnaddress', component: returnaddress, meta: { hideMenu: true } },
      // { path: 'autheninfofail', name: 'autheninfofail', component: autheninfofail, meta: { hideMenu: true } },
      // { path: 'autheninfocode', name: 'autheninfocode', component: autheninfocode, meta: { hideMenu: true } },
      // { path: 'getout', name: 'getout', component: getout, meta: { hideMenu: true } },
      { path: 'editbackaddress', name: 'editbackaddress', component: editbackaddress, meta: { hideMenu: true } },
      { path: 'buyerSellKnow', name: 'buyerSellKnow', component: buyerSellKnow, meta: { hideMenu: true } },
      { path: 'buyerdetail/:id', name: 'buyerdetail', component: buyerdetail, meta: { hideMenu: true } },
      //查看物流 // deduct  查看激励  autheninfofail editbackaddress buyerdetail
      { path: 'logistics/:orderno/:role', name: 'logistics', component: logistics, meta: { hideMenu: true } },

      { path: 'applyAddProduct', name: 'applyAddProduct', component: applyAddProduct, meta: { hideMenu: true } },
      { path: 'allproductbrand', name: 'allproductbrand', component: allproductbrand, meta: { hideMenu: true } },

      //抽奖 lookRuleDetail
      { path: 'drawLottery/examine', name: 'examine', component: examine, meta: { hideMenu: true, title: '规则明细' } },
      { path: 'drawLottery/lookRule', name: 'lookRule', component: lookRule, meta: { hideMenu: true, title: '查看往期' } },
      { path: 'drawLottery/lookRuleDetail/:id', name: 'lookRuleDetail', component: lookRuleDetail, meta: { hideMenu: true, title: '查看详情' } },
      { path: 'drawLottery/lottery', name: 'lottery', component: lottery, meta: { hideMenu: true, title: '0元抽奖' } },
      // { path: 'drawLottery/shareLottery', name: 'shareLottery', component: shareLottery, meta: { hideMenu: true } },
      { path: 'drawLottery/getPrize/:id', name: 'getPrize', component: getPrize, meta: { hideMenu: true, title: '领取奖品' } },
      { path: 'drawLottery/appShare', name: 'appShare', component: appShare, meta: { hideMenu: true, title: '限时抽奖' } },

      // { path: 'groupbuy/list', component: groupList, meta: { hideMenu: true } },
      // { path: 'groupbuy/detail/:id', component: groupDetail, meta: { hideMenu: true, requireAuth: true } },
      // { path: 'groupbuy/share/:id', component: shareGroup, meta: { hideMenu: true } },
      // { path: 'groupbuy/order', component: orderGroup, meta: { hideMenu: true, requireAuth: true } },
      // { path: 'shoe/detail/:id&:type', component: shoeDetail, meta: { hideMenu: true } },
      // { path: 'shoe/search/:key', component: shoeSearch, meta: { hideMenu: true } },
      // { path: 'brand', component: brand, name: 'brandstore', meta: { hideMenu: true } },
      // { path: 'brandInfo/:id?', component: brandInfo, meta: { hideMenu: true } },
      // { path: 'brandDetail/:id?', component: brandDetail, meta: { hideMenu: true } },
      // { path: 'search/:type', component: search, meta: { hideMenu: true } },
      { path: 'shopFilter/:type', component: shopFilter, meta: { hideMenu: true } },
      { path: 'mall/Search/:key?', component: productSearch, meta: { hideMenu: true } },
      // { path: '/sneaker', component: sneakIndex, meta: { tab: 'MENU_SNEAK' } },
      // { path: '/sneaker/home', component: sneakHome, meta: { tab: 'MENU_SNEAK' } },

      // { path: '/sneakerSex/:sexid/:brandid', component: sneakSex, meta: { tab: 'MENU_SNEAK' } },
      { path: '/sneaker/category/:tabid', component: sneakCategory, meta: { hideMenu: true } },
      { path: '/sneaker/search/:key?', component: sneakSearch, meta: { hideMenu: true } },
      { path: '/sneaker/SneakerIdentify', component: sneakerIdentify, meta: { hideMenu: true, title: '鉴定秘籍' } },
      // { path: '/sneakerSeries/:catyname/:seriesid', component: sneakSeries, meta: { hideMenu: true } },
      // { path: '/sneakerDetail/:catyname&:shoeid', component: sneakerDetail, meta: { hideMenu: true } },
      { path: '/sneaker/detail/:id', component: sneakDetail, meta: { hideMenu: true } },
      { path: '/sneaker/NewCheck', component: sneakNewCheck, meta: { hideMenu: true } },
      { path: '/sneakerHotSale/:category?', component: ShoeHotSale, meta: { hideMenu: true } },
      { path: '/sneaker/sell/:selltype', component: sneakSell, meta: { hideMenu: true } },
      { path: '/sneaker/more/:id', component: sneakMore, meta: { hideMenu: true } },
      { path: '/sneaker/Customization', component: Customization, meta: { hideMenu: true } },  //客制周边
      { path: '/sneaker/newProduct', component: sneakNewProd, meta: { hideMenu: true } },
      { path: '/sneaker/pay/:orderId?', component: SneakerPay, meta: { hideMenu: true } },
      { path: '/sneaker/payResult/:orderId?', component: SneakerPayResult, meta: { hideMenu: true } },

      { path: '/sneaker/wxpay', component: SneakerWxpay, meta: { hideMenu: true } },
      // { path: '/sneaker/wxpay/:orderno', name: 'WxCode', component: WxCode, meta: { hideMenu: true } },

      { path: '/verify/:id', component: traceabilityHome, meta: { hideMenu: true } },
      { path: '/verify/detail/:id', component: traceabilityDetail, meta: { hideMenu: true } },

      {
        path: '/user', component: noopLayout, redirect: { path: '/user/home' }, meta: { requireAuth: true, }, children: [
          { path: 'home', component: userHome, meta: { tab: 'MENU_YOU', requireAuth: true, } },
          { path: 'account', component: userAccount, meta: { requireAuth: true, hideMenu: true } },
          { path: 'order', component: userOrder, meta: { requireAuth: true, hideMenu: true } },
          { path: 'collection', component: userCollection, meta: { requireAuth: true, hideMenu: true } },
          { path: 'coupon', component: userCoupon, meta: { requireAuth: true, hideMenu: true, couponType: 0 } },//用户优惠券
          { path: 'couponhistory/:type', component: userCouponhistory, meta: { requireAuth: true, hideMenu: true } },
          { path: 'about', component: userAbout, meta: { requireAuth: true, hideMenu: true, title: '关于斗牛' } },
          { path: 'address', component: userAddress, meta: { requireAuth: true, hideMenu: true } },
          { path: 'editAddress/:type', component: editAddress, meta: { requireAuth: true, hideMenu: true } },
          { path: 'feedback', component: feedback, meta: { requireAuth: true, hideMenu: true } },
          // { path: 'honey', component: honeyHome, meta: { requireAuth: true, hideMenu: true } },
        ]
      },
      {
        path: '/order', component: noopLayout, redirect: '/user/order', children: [
          { path: 'detail/:id?', name: 'orderDetail', component: orderDetl, meta: { requireAuth: true, hideMenu: true } },
          { path: 'track/:id', component: orderTrack, meta: { requireAuth: true, hideMenu: true } },
          // { path: 'express', component: orderExpress, meta: { requireAuth: true, hideMenu: true } },
          { path: 'coupon', component: userCoupon, meta: { requireAuth: true, hideMenu: true, couponType: 1 } },//订单优惠券选择
          { path: 'service/temp', component: orderServiceTemp, meta: { requireAuth: true, hideMenu: true } },
          { path: 'service/add', component: orderServiceAdd, meta: { requireAuth: true, hideMenu: true } },
          { path: 'service/info', component: orderServiceInfo, meta: { requireAuth: true, hideMenu: true } },
          { path: 'AfterSale/temp/:id', component: orderAfterSaleTemp, meta: { requireAuth: true, hideMenu: true } },
          { path: 'AfterSale/add', component: orderAfterSaleAdd, meta: { requireAuth: true, hideMenu: true } },
          { path: 'AfterSale/info/:id', component: orderAfterSaleInfo, meta: { requireAuth: true, hideMenu: true } },
        ]
      },
      // {
      //   path: '/honey', component: honeyLayout, meta:{ requireAuth: true,  hideMenu:true }, children:[
      //     // { path:'home', component: userHome, meta: { tab: 'MENU_YOU', requireAuth: true, hideMenu:true } },
      //   ]
      // },
      { path: '/cart', component: cart, meta: { tab: 'MENU_CART', requireAuth: true, } },
      // 潮流好物
      { path: '/trendGoods', name: 'TrendGoods', component: TrendGoods, meta: { hideMenu: true, title: '潮流好物' } },
    ],
  },
  { path: '/sneaker/presale', name: 'Presale', component: Presale, meta: { title: '新品预售' } },
  { path: '/sneaker/hotsale', name: 'HotSale', component: HotSale, meta: {} },

  { path: '/redPacket/newGift', component: newGift, meta: { hideMenu: true } },

  { path: '/order/NewCheckout', component: orderNewCheck, meta: { requireAuth: true, hideMenu: true } },
  // { path: '/order/checkout', component: orderCheck, meta: { requireAuth: true, hideMenu: true } },
  { path: '/sex', component: uesrSex, },
  // { path: '/uesrHobby', component: uesrHobby },
  { path: '/addUserInfo', component: addUserInfo },//都要绑定
  { path: '/launch', component: launch },
  { path: '/active/:id', name: 'custom-activity', component: active },

  { path: '/shoppingtips', component: shopNotice, meta: { title: '购物说明' } },
  { path: '/aboutus', component: userAboutus, meta: { title: '关于我们' } },
  { path: '/privacy', component: privacy, meta: { title: '用户服务协议' } },
  { path: '/slas', component: userSlas, meta: { title: '服务协议' } },
  { path: '/coupondescription', component: coupon },
  { path: '/about/secret', name: 'AboutSecret', component: aboutSecret, meta: { title: '斗牛隐私政策' } },
  { path: '/company/information', name: 'CompanyInfo', component: CompanyInfo, meta: { title: '公司信息' } }, // 公司信息
  { path: '/about/riskAsse', name: 'riskAsse', component: riskAsse, meta: { title: '尖货竞拍商品买卖服务协议' } },
  { path: '/presale/desc', name: 'presaledesc', component: presaledesc, meta: { title: '尖货竞拍说明' } },
  { path: '/spotcousale/desc', name: 'spotcousaledesc', component: spotcousaledesc, meta: { title: '闪电发货商品说明' } }, // 现货券买卖协议
  { path: '/cashcoupon/desc', name: 'CashCoupon', component: CashCoupon, meta: { title: '闪电发货商品买卖服务协议' } }, // 现货券买卖协议
  //服务tab规则页
  { path: '/about/ServeTabRule', component: ServeTabRule, name: 'ServeTabRule', meta: { title: '规则说明' } },

  // { path: '/activities/fisstion', component: Fission, name: 'fisstion', meta: { title: '活动' } }, //裂变活动

  // supreme
  // { path: '/lookbook/:id', name: 'lookbook', component: lookbook },
  // {
  //   path: '/sales', component: supremeHome,
  //   children: [
  //     { path: 'sale/:id', name: 'sale', component: supremeSale },
  //     { path: 'category/:id', name: 'supremeClassify', component: supremeClassify },
  //   ]
  // },
  // { path: '/salesList/:name/:id', name: 'classifyList', component: classifyList },
  // { path: '/BrandSpecialDetail/:id', component: supremeDetail },

  { path: '/platformActivity/:id', name: 'platform-activity', component: activityDetail },
  // { path: '/login', component: login },
  { path: '/login', component: newLogin, meta: { title: '登录' } },
  { path: '/user/completeInfo', component: completeInfo },

  // { path: '/cart', component: cart, meta: { tab: 'MENU_CART', requireAuth: true, } },
  // { path: '/about/slas', component: userSlas },
  // { path: '/about/abouts', component: userAboutus },
  { path: '/user/set/:type', component: userSet },
  { path: '/country', component: country },
  { path: '/pay/:orderId?', component: pay },
  { path: '/payjump/:orderId?', component: payJump },
  { path: '/payfail/:orderId?', name: 'payfail', component: payFail },
  { path: '/paysuccess/:orderId?', name: 'paysuccess', component: paySuccess },
  { path: '/wxlogin', component: wxlogin },

  // c2c扩品类
  { path: '/c2c/CategoryMall', name: 'CategoryMall', component: CategoryMall },
  { path: '/c2c/CategoryMore', name: 'CategoryMore', component: CategoryMore },

  //B2CMALL改版
  { path: '/limit', name: 'malllimit', component: mallLimit, meta: { hideMenu: true } },

  // { path: '/category', name: 'mallCategory', component:  mallCategory, meta: { hideMenu: true } },

  // { path: '/filterpro', name: 'filterpro', component: filterpro, meta: { hideMenu: true } },

  //年货节
  // { path: '/20190128/main', name: 'mainVenue', component: Main20190128, meta: { title: '斗牛春节不打烊' } },
  // { path: '/20190128/sub', name: 'subVenue', component: Sub20190128, meta: { title: '斗牛春节不打烊' } },
  // { path: '/20190128/mall', name: 'venueMall', component: Mall20190128, meta: { title: '斗牛春节不打烊' } },
  // { path: '/20190128/RainModel', name: 'RainModel', component: RainModel20190128, meta: { title: '斗牛春节不打烊' } },

  // 拼团活动分享承接页ShareAssemble
  { path: '/shareUndertake/assemble', component: ShareAssemble },
  // 在线鉴定分享承接页
  { path: '/shareUndertake/onlineidentify/:id?', component: ShareOnline },
  // 清空购物车活动
  // { path: '/cspc/rule', name: 'ClearShoppingCartRule', component: ClearShoppingCartRule, meta: { hideMenu: true } },
  // { path: '/cspc/info', name: 'ClearShoppingCartInfo', component: ClearShoppingCartInfo, meta: { hideMenu: true } },
  // { path: '/cspc/result', name: 'ClearShoppingCartResult', component: ClearShoppingCartResult, meta: { hideMenu: true } },
  // { path: '/lottery/draw', name: 'ClearShoppingCartLottery', component: ClearShoppingCartLottery, meta: { hideMenu: true } },

  { path: '/nesearch', name: 'nesearch', component: nesearch, meta: { hideMenu: true } },
  { path: '/results/:key', name: 'searchresults', component: searchresults, meta: { hideMenu: true } },
  { path: '/mall/BrandRec', name: 'BrandRec', component: BrandRec, meta: { hideMenu: true } },
  { path: '/mall/ShopColl/:id', name: 'ShopColl', component: ShopColl, meta: { hideMenu: true } },
  { path: '/mall/ShopRec', name: 'ShopRec', component: ShopRec, meta: { hideMenu: true } },

  //恶搞标签
  // { path: '/ballot', name: 'DNKRS', component: Ballot },

  //代古拉K专题
  // { path: '/dglk', name: 'dglkHome', component: DaiGuLaKHome, meta: { title: '抖音“毁舞王”代古拉K 送你猪年福利!' } },
  // { path: '/dglk/vdo', name: 'dglkVdo', component: DaiGuLaKVdo, meta: { title: '抖音“毁舞王”代古拉K 送你猪年福利!' } },

  // 瓜分红包
  // { path: '/luckycoin/home', name: 'luckyhome', component: LuckyCoinHome },
  // { path: '/luckycoin/share', name: 'luckyshare', component: LuckyCoinShare },
  // { path: '/luckycoin/identify', name: 'identify', component: Identify },
  // { path: '/luckycoin/guide', name: 'guide', component: Guide },

  {
    path: '/rasp/raspHappy', name: 'raspHappy', component: raspHappy, meta: {
      title: '每天10个限量商品免费送', bgcolor: "#E94C4E", textcolor: "#ffffff", showshoppingcarticon: false
    }
  },
  // { path: '/wxcode/:orderno?', name: 'WxCode', component: WxCode },
  //社区用户指南
  { path: '/user/guide', name: 'userGuide', component: userGuide, meta: { title: '抽签指南' } },
  { path: '/user/consign', name: 'consign', component: consign, meta: { title: '关于寄存' } },

  // { path: '/downApp', name: 'downApp', component: downApp, meta: { hideMenu: true, title: '下载APP 体验更多功能', downApp: true } },
  { path: '/downApp', name: 'downApp', component: loadApp, meta: { hideMenu: true, title: '下载APP 体验更多功能' } },
  { path: '/loadApp', name: 'loadApp', component: loadApp, meta: { hideMenu: true, title: '下载APP 体验更多功能' } },
  { path: '/platform/activity', name: 'platformActive', component: platformActive, meta: { title: '大促活动' } },
  { path: '/platform/subplace', name: 'subplace', component: subplace, meta: { title: '大促活动' } },

  { path: '/sneakerticket/detail', name: 'sneakerticketDetail', component: sneakerticketDetail, meta: { title: '预售团购' } },
  { path: '/sneakerticket/friendList', name: 'sneakerticketFriendList', component: sneakerticketFriendList, meta: { title: '好友助力列表' } },
  { path: '/sneakerticket/couponSaleList', name: 'sneakerticketCouponSaleList', component: sneakerticketCouponSaleList, meta: { title: '预售券发售列表' } },
  { path: '/sneakerticket/buylist', name: 'sneakerticketBuylist', component: sneakerticketBuylist, meta: { title: '尖货竞拍' } },

  { path: '/sneakerticket/result', name: 'TicketResult', component: TicketResult, meta: {} },

  { path: '/bull/proDetialShare/:id', name: 'proDetialShare', component: proDetialShare },

  { path: '/mayDay/active', name: 'mayDayActive', component: mayDayActive, meta: { title: '潮人出游 换装必选' } }, //五一大促
  { path: '/mayDay/subPlace', name: 'mayDaySubplace', component: mayDaySubplace }, //五一大促
  { path: '/mayDay/detail', name: 'mayDayDetail', component: mayDayDetail }, //五一大促
  // { path: '/618', name: 'mayDayActive', component: mayDayActive, meta: { title: '「斗牛」6·18年中狂欢 潮货1折疯抢' } },
  // { path: '/618/lottery', name: 'MidyearLottery', component: MidyearLottery, meta: { title: '「斗牛」6·18 玩转盘 赢大奖' } },
  // { path: '/618/:themetype', name: 'mayDaySubplace', component: mayDaySubplace },

  { path: '/footwearclub/response', component: FootwearClubResponse, name: 'FootwearClubResponse', meta: { title: '响应潮友团' } },
  { path: '/footwearclub/task', component: FootwearClubTask, name: 'FootwearClubTask', meta: { title: '潮友团任务' } },
  { path: '/create/shoes', component: CreatefootWear, name: 'CreatefootWear', meta: { title: '创建潮友团' } },
  { path: '/shoe/rule', component: ShoeRule, name: 'ShoeRule', meta: { title: '规则' } },

  { path: '/footwearclub', name: 'FootwearClub', component: FootwearClub, meta: { title: '加入潮友团' } }, // 潮友团H5承接页
  { path: '/newuser/welf', name: 'newuserarea', component: newuserarea, meta: { title: '新人专享' } }, // 新人专区落地页
  {
    path: '/redpacket', component: RedpacketLayout, children: [
      { path: 'gift', component: RedpacketGift, name: 'RedpacketGift', meta: { title: '新人大礼包' } },
      { path: 'luck', component: RedpacketLuck, name: 'RedpacketLuck', meta: { title: '拼手气红包' } },
      { path: 'share', component: RedpacketShare, name: 'RedpacketShare', meta: { title: '分享领礼包' } },
    ]
  },
  { path: '/monitor/card', name: 'MonitorCard', component: MonitorCard, meta: { title: '斗牛VIP服务卡' } },
  { path: '/monitor/inTestInvitation', name: 'InTestInvitation', component: InTestInvitation, meta: { title: '斗牛球鞋监控' } },
  { path: '/monitor/vipDescription', redirect: '/about/sercard' },


  { path: '/winners/charts', name: 'Charts', component: Charts, meta: { title: '预售券龙虎榜' } },
  { path: '/winners/pullnewuser', name: 'Pullnew', component: Pullnew, meta: { title: '斗牛新人福利' } },

  { path: '/getck', name: 'GetCookie', component: GetCookie },
  { path: '/about/sercard', name: 'Sercardctd', component: Sercardctd, meta: { title: '斗牛服务卡介绍' } },//服务卡介绍
  { path: '/store/lottery', name: 'StoreAct', component: StoreAct, meta: { title: '斗牛球鞋原价发售' } },

  { path: '/arrivals', component: () => import('../views/c2c/ArrivalNotice.vue'), name: 'ArrivalNotice', meta: { title: '到货通知' } },

  // 拍卖
  {
    path: '', component: {
      ...noopLayout,
      name: 'AuctionLayout',
      beforeMount() {
        let _ = this;
        if (!(ENV.ua.eyee || ENV.ua.mini))
          _.confirm({
            msg: "请在【斗牛DoNew】APP内操作?",
            okText: "立即前往",
            cancelBtn: 1,
            ok: () => {
              _.openAppClient();
              setTimeout(() => {
                _.$router.replace("/loadapp");
              }, 800);
            }
          });
        else if (ENV.ua.eyee) {
          let version = $DONEW.env && $DONEW.env.version || '9.9.9'
          if (version < '3.6.3')
            setTimeout(() => {
              _.confirm({
                title: "请升级至V3.6.3或更高的版本~",
                cancelBtn: 1,
                ok: () => {
                  _.$router.replace("/loadapp");
                }
              });
            }, 300);
        }
      }
    }, children: [
      { path: '/auction/detail/:id', component: () => import('../views/auction/Detail.vue'), name: 'AuctionDetail', meta: { title: '斗牛拍卖', disbounce: true } },
      { path: '/auction/joined', component: () => import('../views/auction/Joined.vue'), name: 'AuctionJoined', meta: { title: '我参与的', disbounce: true } },
      {
        path: '', component: () => import('../views/auction/MgrLayout.vue'), name: 'AuctionMgr', children: [
          { path: '/auction/sales', component: () => import('../views/auction/Orders.vue'), name: 'AuctionSales', meta: { title: '我发布的' } },
          { path: '/auction/orders', component: () => import('../views/auction/Orders.vue'), name: 'AuctionOrders', meta: { title: '我发布的' } }
        ]
      },
      { path: '/auction/:id', component: () => import('../views/auction/Home.vue'), name: 'AuctionHome', meta: { title: '斗牛拍卖', disbounce: true, keepAlive: true } }
    ]
  },
  { path: '/coopseller', component: () => import('../views/auction/coopseller.vue'), name: 'coopseller', meta: { title: '申请成为合作卖家' } },

  //  牛丸
  {
    path: '/ball/list', component: BallList, name: 'BallList', meta: { title: '邀请列表' }
  },
  { path: '/ball/share', component: () => import('../views/oxBall/share.vue'), name: 'share', meta: { title: '赚牛丸,换现金' } },
  { path: '/ball/summmon', component: () => import('../views/oxBall/summmon/index.vue'), name: 'summmon', meta: { title: '邀请送牛丸' } },



  //获取牛丸 牛丸商城 牛丸记录
  {
    path: '/oxballdetail', component: OxballDetail, redirect: "/oxballdetail/get", children: [
      { path: 'get', component: OxballGet, name: 'OxballGet', meta: { title: '获取牛丸' } },
      { path: 'market', component: OxballMarket, name: 'OxballMarket', meta: { title: '牛丸商城' } },
      { path: 'record', component: OxballRecord, name: 'OxballRecord', meta: { title: '牛丸记录' } },
    ]
  },
  // 大促活动
  { path: '/plat/gift', component: () => import('../views/activities/plat/lotter.vue'), name: 'lotter', meta: { title: '斗牛周年庆，幸运大奖天天抽' } },
  { path: '/plat/main', component: () => import('../views/activities/plat/main.vue'), name: 'main', meta: { title: '斗牛周年庆，专享潮品6折封顶!' } },
  { path: '/plat/session', component: () => import('../views/activities/plat/session.vue'), name: 'session', meta: { title: '斗牛周年庆专享潮货直降精选' } },
  { path: '/getcoupon', component: () => import('../views/activities/getCoupon.vue'), name: 'getcoupon', meta: { title: '斗牛DoNew' } },
  { path: '/wheel', component: () => import('../views/activities/Wheel.vue'), name: 'wheel', meta: { title: '斗牛DoNew' } },

  //红包雨
  { path: '/rainhall', component: () => import('../views/activities/redpackrain/index.vue'), name: 'rainhall', meta: { title: '双旦红包雨,抢200无门槛红包' } },
  { path: '/rainindex', component: () => import('../views/activities/redpackrain/rainindex.vue'), name: 'rainindex', meta: { title: '双旦红包雨,抢200无门槛红包' } },
  { path: '/raincountdown', component: () => import('../views/activities/redpackrain/raincountdown.vue'), name: 'raincountdown', meta: { title: '双旦红包雨,抢200无门槛红包' } },
  { path: '/raingame', component: () => import('../views/activities/redpackrain/raingame.vue'), name: 'raingame', meta: { title: '双旦红包雨,抢200无门槛红包' } },
  { path: '/raingameover', component: () => import('../views/activities/redpackrain/raingameover.vue'), name: 'raingameover', meta: { title: '双旦红包雨,抢200无门槛红包' } },
  { path: '/rainallover', component: () => import('../views/activities/redpackrain/rainallover.vue'), name: 'rainallover', meta: { title: '双旦红包雨,抢200无门槛红包' } },
  { path: '/rainrule', component: () => import('../views/activities/redpackrain/rainrule.vue'), name: 'rainrule', meta: { title: '双旦红包雨,抢200无门槛红包' } },

  //营销裂变活动
  { path: '/fission', component: () => import('../views/activities/fission/index.vue'), name: 'fission', meta: { title: '2019-2020' } },

  // 集卡活动
  { path: '/collectionCard', component: CollectionCard, name: 'CollectionCard', meta: { title: '集卡活动' } },
  { path: '/collectionCard/rule', component: CollectionCardRule, name: 'CollectionCardRule', meta: { title: '活动规则' } },
  // 主会场（限时抢券）
  { path: '/mainPlace', name: 'MainPlace', component: MainPlace },

  // 交叉持仓活动
  { path: '/activity/hold', name: 'holdPositin', component: () => import('../views/activities/holdPositin.vue'), meta: { title: '库存发电站' } },

  // 抽抽乐
  { path: '/activity/luckDraw', name: 'luckDraw', component: () => import('../views/activities/LuckDraw/LuckDraw.vue'), meta: { title: '抽抽乐' } },
  // 确认订单
  { path: '/activity/confirmOrder', name: 'confirmOrder', component: () => import('../views/activities/LuckDraw/ConfirmOrder.vue'), meta: { title: '确认订单' } },
  // 购买抽取次数
  { path: '/activity/purchaseTimes', name: 'purchaseTimes', component: () => import('../views/activities/LuckDraw/PurchaseTimes.vue'), meta: { title: '购买抽取次数' } },
  // 积存仓
  { path: '/activity/warehouse', name: 'warehouse', component: () => import('../views/activities/LuckDraw/Warehouse.vue'), meta: { title: '积存仓' } },
  // 组队
  { path: '/activity/teamup/:id', name: 'warehouse', component: () => import('../views/activities/LuckDraw/TeamUp.vue'), meta: { title: '组队抽取SSR' } },

  // 年卡会员
  { path: '/vip/weal/receive/:id?', name: 'vipWealReceive', component: () => import('../views/vip/WealReceive'), meta: { title: '领取盲盒礼包' } },
  { path: '/vip/video', name: 'vipVideo', component: () => import('../views/vip/Video'), meta: { title: '视频' } },
  { path: '/vip/fans', name: 'vipFans', component: () => import('../views/vip/Fans'), meta: { title: '我的邀请' } },
  { path: '/vip/prejoin', name: 'vipPreJoin', component: () => import('../views/vip/PreJoin'), meta: { title: '推荐附近潮牌合伙人' } },
  { path: '/vip/join', name: 'vipJoin', component: () => import('../views/vip/Join'), meta: { title: '加入潮牌合伙人' } },
  { path: '/vip/invite', name: 'vipInvite', component: () => import('../views/vip/Invite'), meta: { title: '邀好友做潮牌主理人' } },
  { path: '/vip', name: 'vipHome', component: () => import('../views/vip/Home'), meta: { title: '潮牌合伙人' } },

  // 双11签到
  { path: '/activity/signin', name: 'signIn', component: () => import('../views/activities/SignIn/Index.vue'), meta: { title: '签到双十一' }},
  { path: '/activity/signinintroduction', name: 'signIn', component: () => import('../views/activities/SignIn/ActivityIntroduction.vue'), meta: { title: '活动细则' }},
  { path: '/activity/luckdrawpromote', name: 'signIn', component: () => import('../views/activities/SignIn/LuckDrawPromote.vue'), meta: { title: '斗牛抽抽乐' }},

  // 新品推荐 - 新人专场大礼包
  { path: '/activity/newrecommend', name: 'signIn', component: () => import('../views/activities/NewRecommend'), meta: { title: '新品推荐' }},

  {
    path: '/oa', component: noopLayout, redirect: { path: '/oa/home' }, meta: { requireAuth: true, }, children: [
      { path: 'home', component: oaHome, meta: { requireAuth: true, hideMenu: true } },
      { path: 'team', component: oaTeam, meta: { requireAuth: true, hideMenu: true } },
      { path: 'finance', component: oaFinance, meta: { requireAuth: true, hideMenu: true } },
      { path: 'personallyFans', component: oaPersonallyFans, meta: { requireAuth: true, hideMenu: true } },
      { path: 'teamFans', component: oaTeamFans, meta: { requireAuth: true, hideMenu: true } },
      { path: 'billList', component: oaBillList, meta: { requireAuth: true, hideMenu: true } },
      { path: 'settlementdetail', component: oaSettlementDetail, meta: { requireAuth: true, hideMenu: true } },
    ]
  },
  ...routerList,// 对应目录 src/router/routerlist  在此目录下添加路由
  // ↑↑↑ 此行上面增加路由
  { path: '*', redirect: '/' },

];
export default routes
