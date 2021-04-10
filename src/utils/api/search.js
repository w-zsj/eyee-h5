import { POSTGROUP, POST } from '@/common/util'
const Condition = ({ keyword, isc2c }) => {
  let params = { keyword }
  if (isc2c == 1) {
    params.isc2c = isc2c
  }
  return POSTGROUP('/api/open/product/condition', params)
}
const GetAssWordList = (keyword,type) => {
  return POSTGROUP('/capi/product/open/getAssociationalWordListV20', { keyword,type })
  // return POSTGROUP('/capi/product/open/getAssociationalWordList', { keyword ,type})
}
const searchPro = (params = { ...param, pagesize: 10 }) => {
  let param = params
  // param.pagesize = 10
  // if (param.isc2c=='undefined'||param.isc2c==undefined||param.isc2c=='null'||param.isc2c==null) delete param.isc2c
  delete param.pageindex
  return POSTGROUP('/api/open/product/searchV312', param)
}
const Gettoplist = (type) => {
  // return POSTGROUP('/capi/product/open/hotkeyword/gettoplist', { showtype: 3,type })
  return POSTGROUP('/capi/product/open/hotkeyword/gettoplistV20', { showtype: 3,type })
}
const ShopList = (params) => {
  let param = params
  param.pagesize = 10
  if (param.isc2c == 0) delete param.isc2c
  delete param.pageindex
  return POSTGROUP('/api/open/product/searchshop',params)
}
export { Condition, GetAssWordList, searchPro, Gettoplist,ShopList }
