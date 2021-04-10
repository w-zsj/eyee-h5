import { POST, POSTGROUP, GET, GETGROUP } from '@/common/util'


const ClothesBanner = () => {
  return POSTGROUP('/capi/product/clothes/open/banner', {}, false)
}
const SeriesList = (params = {}) => {
  return POSTGROUP('/capi/product/clothes/classification', params, false)
}
const RecommendList = (params = {}) => {
  return POSTGROUP('/capi/product/clothes/open/recommend', params, false)
}
export {
  ClothesBanner, RecommendList, SeriesList
}
