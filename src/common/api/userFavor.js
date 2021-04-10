import { POSTGROUP, POST } from '../util'

const url = {
  DigArticle: '/api/UserFavor/DigArticle',
  DigComment: '/api/UserFavor/DigComment',
  FavorArticle: '/api/UserFavor/FavorArticle',
  FavorProduct: '/api/UserFavor/FavorProduct',
  FavorBusiness: '/api/UserFavor/FavorBusiness',
  FavArticlePage: '/api/UserFavor/GetFavorArticle',
  FavProductPage: '/api/UserFavor/GetFavorProductV268',
  FavBusinessPage: '/api/UserFavor/GetFavorBusiness',
  B2CCancelFavor: '/api/UserFavor/b2cCancelFavor',
  C2CCancelFavor: '/capi/product/collect/c2ccancelcollect'
}

// 资讯 点赞/取消点赞
function DigArticle(params = {}) {
  return POST(url.DigArticle, params, false)
}
// 评论 点赞/取消点赞
function DigComment(params = {}) {
  return POST(url.DigComment, params, false)
}
// 资讯 收藏/取消收藏
function FavorArticle(params = {}) {
  return POST(url.FavorArticle, params, false)
}
// 资讯收藏列表（分页）
function FavArticlePage(params = {}) {
  return POST(url.FavArticlePage, params, false)
}
// 商品收藏列表（分页）
function FavProductPage(params = {}) {
  return POST(url.FavProductPage, params, false)
}
// 店铺收藏列表（分页）
function FavBusinessPage(params = {}) {
  return POST(url.FavBusinessPage, params, false)
}
// 商品 收藏/取消收藏
function FavorProduct(params = {}) {
  return POST(url.FavorProduct, params, false)
}

// 商城店铺 收藏/取消收藏
function FavorBusiness(params = {}) {
  return POST(url.FavorBusiness, params, false)
}

// 删除b2c收藏商品
function B2CCancelFavor(params = {}) {
  return POST(url.B2CCancelFavor, params, false)
}
// 删除c2c收藏商品
function C2CCancelFavor(params = {}) {
  return POSTGROUP(url.C2CCancelFavor, params, false)
}
export { DigArticle, DigComment, FavorArticle, FavArticlePage, FavProductPage, FavBusinessPage, FavorProduct,
  FavorBusiness, B2CCancelFavor, C2CCancelFavor

}
