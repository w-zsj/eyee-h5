/*
 * enum.js
 * 全局枚举类
 * 通过工具类导入使用
 * 如果值保存的为对象时,必须有以val为键名的枚举值
 */

/* 存储键名 键:全大写,值:KEY开头的全大写以下划线分隔 */
const StorageKey = {
  SEARCH: 'KEY_SEARCH_' // 接搜索类型
}

/* 结果状态码(仅存放有特殊处理的) 键:驼峰 */
const StatusCode = {
  // 请求完成
  success: 1511200,
  // 特殊处理 商家不能退出入驻
  exsuccess: 1511507,
  // 服务器错误
  errorServer: 1511500,
  // 已下架
  unShelved: 1511789
}

/* 搜索的类型 键:驼峰
 * val 枚举值,递增,唯一
 * url 结果跳转地址(以 地址/:key 形式带参跳转,不带结尾斜杠),
 * type 热门关键字类型(0 无,1 商品,2 资讯)
 */
const SearchType = {
  newsSearch: { val: 0, url: '/news/Search', type: 2 },
  newsShoe: { val: 1, url: '/shoe/Search', type: 0 },
  // product: { val: 2, url: '/mall/Search', type: 1 },
  product: { val: 2, url: '/news/Search', type: 1 },
  oldsneaker: { val: 3, url: '/news/Search', type: 3 },
  sneaker: { val: 4, url: '/sneaker/search', type: 4 },

  get(val) {
    let item
    Object.keys(this).forEach(key => {
      if (this[key].val === val) {
        item = this[key]
        return
      }
    })
    return item
  }
}
const FilterType = {
  mallHome: { val: 1 }, // 发现栏进入筛选
  productSearch: { val: 2 }, // 产品搜索进入筛选
  shopSearch: { val: 3 }, // 潮店进入筛选
  sneakerSearch: { val: 4 }, // sneaker进入筛选
  discountSearch: { val: 5 } // 折扣进入筛选
}
const shareType = {
  shoeHome: { val: 1 } // 潮鞋榜单首页
}
// 购物筛选数据模板
const cartType = {
  add: { val: 0 }, // 添加到购物车
  buyNow: { val: 1 }, // 立即购买
  buyLimit: { val: 2 }, // 限量购买
  update: { val: 3 } // 更新购物车列表
}
const editAddressType = {
  add: { val: 0 }, // 添加到购物车
  edit: { val: 1 }
}

/*
 * product type 商品类型
 * 0 普通，1 限量，2 特卖/鬼市，4 促销折扣，5 牛币兑换，6 签到领取，7平台大促
 * 3 混合商品类型 保留用于订单
 */
const ProductType = {
  normal: 0,
  limit: 1,
  special: 2,
  discount: 4,
  bees: 5,
  sign: 6,
  activity: 7
}

const SecretKeys = "eyJjMmN4Y3giOiJNVFV4TVdGc01EZ3lOaW94TldWNVpXVXdNVEklM0QiLCJoNSI6Ik1UVXhNWE5vTVRneE1WNHhOV1Y1WldVd01ETSUzRCIsInd4IjoiTVRVeE1YTjNNVGN3TVNRd05HVjVaV1V3TURVJTNEIiwiaW9zIjoiTVRVeE1YTnBNVFV4TUVBeE5HVjVaV1V3TURFJTNEIiwiYW5kcm9pZCI6Ik1UVXhNWE5oTVRVeE1DTXhOR1Y1WldVd01ESSUzRCJ9"
// 'eyJoNSI6Ik1UVXhNJ%2BTJCWE5vTVRneE1WNHhOV1Y1WlclMkZVd01ETSUzR%2BCIsInFxem9uZSI6Ik1UVX%2FhNWE54TSUyQlRneE1Tb3hOV1Y1WiUyRldVd01EWSUz%2FRCIsImlvcyI6Ik1UVXhNWCUyQk5wTVR%2BVeE1FQXhOR1Y1WldVd00lMkZERSUzRCIsImFuZHJ%2FvaWQiOiJNVFV4TVhOaE1UVXhNJTJCQ014Tk%2BdWNVolMkZXVXdNREklM0QifQ%3D%3D'

export { StorageKey, StatusCode, SearchType, FilterType, shareType, cartType, editAddressType, ProductType, SecretKeys }
