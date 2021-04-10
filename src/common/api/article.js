import { POST } from '../util'

const url = {
  GetCategory: '/api/Article/GetCategory',
  // Search: '/api/Article/Search',
  Search: '/api/article/searchV236',
  Detail: '/api/Article/DetailV237',
  DetailSub: '/api/Article/DetailSubV236',
  Related: '/api/Article/RelatedV236',
  Comments: '/api/Article/Comments',
  Replies: '/api/Article/Replies',
  LibraryBrands: '/api/Article/LibraryBrands',
  LibraryByBrandId: '/api/Article/LibraryByBrandId',
  LibraryInfo: '/api/Article/LibraryInfo'
}

// 资讯类目
function GetArticleCategory(params = {}) {
  return POST(url.GetCategory, params, false)
}
// 资讯搜索（大数据推荐）
function ArticleSearch(params = {}) {
  return POST(url.Search, params, false)
}
// 资讯详情信息
function ArticleDetail(params = {}) {
  return POST(url.Detail, params, false)
}
// 资讯详情其他信息（相关标签，推荐，点赞，头像列表，热门评论，最新评论10条）
function ArticleDetailSub(params = {}) {
  return POST(url.DetailSub, params, false)
}
// 资讯相关推荐
function ArticleRelated(params = {}) {
  return POST(url.Related, params, false)
}
// 评论列表（分页）
function ArticleComments(params = {}) {
  return POST(url.Comments, params, false)
}
// 回复评论列表（分页，第一页返回根评论信息）
function ArticleReplies(params = {}) {
  return POST(url.Replies, params, false)
}

// 品牌库品牌
function LibraryBrands(params = {}) {
  return POST(url.LibraryBrands, params, false)
}
// 品牌库文章列表（二级页面）
function LibraryByBrandId(params = {}) {
  return POST(url.LibraryByBrandId, params, false)
}
// 品牌库文章详情
function LibraryInfo(params = {}) {
  return POST(url.LibraryInfo, params, false)
}

export { GetArticleCategory, ArticleSearch, ArticleDetail, ArticleDetailSub, ArticleRelated, ArticleComments, ArticleReplies, LibraryBrands, LibraryByBrandId, LibraryInfo }
