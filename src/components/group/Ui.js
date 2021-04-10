
function groupUI(uiData, orderno) {
  // let currentUser = JSON.parse(window.localStorage.getItem('currentUser')).uid
  let curOrderno = null
  let ispaid = null
  // if (uiData.userid === currentUser) {
  //   curOrderno = uiData.order.orderstatus
  //   ispaid = !!uiData.order.payedat
  // } else {
  //   for (let i = 0; i < uiData.joins.length; i++) {
  //     if (uiData.joins[i].userid === currentUser) {
  //       curOrderno = uiData.joins[i].order.orderstatus
  //       ispaid = !!uiData.joins[i].order.payedat
  //     }
  //   }
  // }
  // 用==的目的是因为 数据类型不一样 一个是数字一个是字符串 不想转换了
  if (uiData.order.orderno == orderno) {
    curOrderno = uiData.order.orderstatus
    ispaid = !!uiData.order.payedat
  } else {
    for (let i = 0; i < uiData.joins.length; i++) {
      if (uiData.joins[i].order.orderno == orderno) {
        curOrderno = uiData.joins[i].order.orderstatus
        ispaid = !!uiData.joins[i].order.payedat
      }
    }
  }
  // var GroupType = {}
  switch (uiData.status) {
    case 0:
    case 1:
      if (curOrderno === 0 && !ispaid) {
        // GroupType.statusOne = '拼团中,未支付'
        return 1 // 拼团中（a2，b3，c3）
      } else if (curOrderno === 4 && !ispaid) {
        return 2 // 拼团失败（a5，b2，c2）
      } else if (ispaid) {
        return 3 // 拼团中（a3，b4，c4）
      }
      break
    case 2:
      if (curOrderno === 0 && !ispaid) {
        return 4 // 拼团中（a2，b3，c3）
      } else if (curOrderno === 4 && !ispaid) {
        return 5 // 拼团失败（a5，b2，c2）
      } else if (ispaid) {
        return 6 // 拼团成功（a4，b5，c5）
      }
      break
    case 3:
      if (curOrderno === 4 && uiData.order.orderno == orderno && !ispaid) {
        return 7 // 拼团失败（a1，b1，c1）
      } else {
        if (uiData.order.orderno == orderno && ispaid) {
          return 8 // 拼团失败（b6，c6）
        } else {
          return 9 // 拼团失败（b6，c7）
        }
      }
    // break
  }
}

export { groupUI }
