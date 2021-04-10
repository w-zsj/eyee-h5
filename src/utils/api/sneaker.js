import { POSTGROUP, GETGROUP } from '@/common/util'

const HomeSneakerSearch = ({ page = 1, size = 20, hometabid, brandid = '', sneakersize = '', sorttype = 0, ordertype = 1 }) => {
  return POSTGROUP('/capi/product/qiuxie/open/sneakerslistv322', { page, size, hometabid, brandid, sneakersize, sorttype, ordertype }, page === 1)
}
const CostumeSearch = ({ page = 1, pagesize = 20, hometabid, brandid = '', keyword = '', size = '', categoryid, businessid, isc2c = 1, activityid = '', beginprice = '',
  endprice = '', tagid = '', seriesid = '', sorttype = 0, ordertype = 1 }) => {
  return POSTGROUP('/capi/product/qiuxie/open/clotheslist', {
    page, pagesize, hometabid, size, brandid, keyword, categoryid, businessid, isc2c, activityid, beginprice,
    endprice, tagid, seriesid, sorttype, ordertype
  }, page === 1)
}

const PresaleList = ({ page = 1, size = 20 }) => {
  return POSTGROUP('/capi/channel/open/minadvancelist', { page, size }, page === 1)
}
const NewSneakerBrandList = () => {
  return GETGROUP('/capi/product/qiuxie/open/brandSeriesList', {})
}
const BannerPicList = () => {
  return POSTGROUP('/capi/product/qiuxie/open/markethomecluster', { os: 3 })
}

const GetArrivalNotices = ({ page = 1, size = 10 }) => POSTGROUP('/capi/exchange/open/getreceivenotice', { page, size, isall: 0 })

const classifyTabsList = () => {
  return POSTGROUP('/capi/product/classification/open/channellist', {})
}
const classifyItemList = (channelid) => {
  return POSTGROUP('/capi/product/classification/open/itemlist', { channelid })
}

export { HomeSneakerSearch, PresaleList, NewSneakerBrandList, BannerPicList, CostumeSearch, GetArrivalNotices, classifyTabsList, classifyItemList }
