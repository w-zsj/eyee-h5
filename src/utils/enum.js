/**
 * 首页轮播和预置位跳转类型
 * 0.店铺 1.品牌 2.分类 3.产品详情 4.资讯详情 5.资讯搜索 6.自定义专题 7.鬼市 9.限量 10.品牌库 11.球鞋榜 12.平台大促 13.球鞋搜索 14.C2C球鞋 15.C2C服饰 16.B2C搜索，17.全站搜索
 * 移除 8.潮店 18 预售券详情
 */
const CarouselLinkType = {
  shopDetail: 0,
  brandSearch: 1,
  categorySearch: 2,
  productDetail: 3,
  newsDetail: 4,
  newsSearch: 5,
  activity: 6,
  specialSaleDetail: 7,
  // shopList: 8,
  limitSale: 9,
  brandLib: 10,
  newsShoes: 11,
  platformActivity: 12,
  sneakerSearch: 13,
  sneakerMall: 14,
  costume: 15,
  b2cSearch: 16,
  allSearch: 17,
  bullPreDetail: 18,
  cutgetcoupon: 40
}

/**
 * 首页宫格跳转类型
 * 1.助力砍价 2.拼团 3.新品预售 4.品牌 5.店铺 6.平台大促 7.自定义专题 8.天天抽奖 9.限量发售
 * 3.新品预售 跳转C2C商品详情
 *
 *  // "showtype":#"0:常规商品卡片,1助力砍价、2拼团、3新品预售、 4 B2C 品牌， 5 C2C品牌、6 店铺、7 平台大促、8 自定义专题、9 天天抽奖、10 限量发售、
// 11 球鞋入口、12 分类、 13系列、
// 14在线鉴定，15拉新抢购，16  supreme类目，17 supreme，18 B2C产品详情 ,19 C2C 产品详情，20 鬼市，21 球鞋榜，22 球鞋搜索，23 领券中心 24 costume 25.B2C搜索，26.全站搜索
28 预售券详情 29 发售日历，30：预售抢购，31：寄存搜索,32邀请鞋头 33 日历详情页 34 图文帖子详情页 35 视频帖子详情 36 话题详情页" 40 助力领券 抽抽乐 49 分类,


 */
const GridLinkType = {
  helpBargain: 1,
  groupBuy: 2,
  newSale: 3,
  brandSearch: 4,
  brandSearchC2c: 5,
  shopDetail: 6,
  platformActivity: 7,
  activity: 8,
  sneakerLottery: 9,
  limitSale: 10,
  sneakerEnter: 11,
  classify: 12,
  seriesList: 13,
  onlineIdentification: 14,
  PullTheNew: 15,
  Supreme: 16,
  SupremeSearch: 17,
  DetailB2c: 18,
  DetailC2c: 19,
  SpecialSaleDetail: 20,
  SneakersHotSale: 21,
  sneakerSearch: 22,
  getCouponCenter: 23,
  costume: 24,
  b2cSearch: 25,
  allSearch: 26,
  bullPreDetail: 28,
  presellRush: 30,
  toeCap: 32,
  calendarDetail: 33,
  imgInvitationDetail: 34,
  flashInvitationDetail: 35,
  topicInvitationDetail: 36,
  trendGoods: 39,
  cutgetcoupon: 40,
  classification: 49
}



/**
 * 首页tab类型
 * 1.推荐 2.特卖 3.球鞋 4.B2C类目 5.supreme 6. costume c2c 服饰 7. 自定义
 */
const HomeTabType = {
  recommend: 1,
  specialSale: 2,
  sneaker: 3,
  mallCategory: 4,
  supreme: 5,
  costume: 6,
  c2ccustom: 7
}

/**
 * tabbar枚举值
 * 0.社区 1.商城 2.球鞋 3.消息 4.个人中心
 */
const TabBar = {
  community: 0,
  mall: 1,
  sneaker: 2,
  notify: 3,
  user: 4
}


// 下载/打开 APP场景
const LoadScene = {
  // 邀新抢购
  newUserHelp: 1
}

export { CarouselLinkType, GridLinkType, HomeTabType, TabBar, LoadScene }
