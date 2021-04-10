import { POST } from '../util'

const url = {
  Add: '/api/Mall/AddShoppingCartV243',
  GroupList: '/api/Mall/GetShoppingCartV243',
  Delete: '/api/Mall/DeleteShoppingCartV243',
  Update: '/api/Mall/EditShoppingCart'
}

// 添加购物车
function Add({ productitemid, businessid, producttype, count, contentid = '', distributionid }) {
  return POST(url.Add, { productitemid: productitemid, businessid: businessid, type: producttype, count: count, contentid: contentid, distributionid })
}
// 购物车列表
function GroupList(params = {}) {
  return POST(url.GroupList, params)
}
// 删除购物车商品
function Delete({ id, productitemid }) {
  return POST(url.Delete, { id: id, productitemid: productitemid })
}
// 编辑购物车
function Update({ id, productitemid, count }) {
  return POST(url.Update, { id: id, productitemid: productitemid, count: count })
}
export { Add, GroupList, Delete, Update }
