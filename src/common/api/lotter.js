import { POST, GETGROUP, POSTGROUP } from '../util'
const url = {
    PrizeShow: '/capi/data/indexdraw/prizeshow',
    NoTokenPrizeShow: '/capi/data/indexdraw/open/prizeshow',
    draw: '/capi/data/indexdraw/draw',
    history: '/capi/data/indexdraw/open/history', // 往期查看
    submitaddress: '/capi/data/indexdraw/submitaddress',
    getShowPrize: '/capi/data/indexdraw/showprize', // 领取奖品页面展示
    Rule: '/capi/data/indexdraw/open/rule',
    QiuxiePin: '/capi/data/indexdraw/open/detail',
    relate: '/capi/data/indexdraw/relate', // 关联推荐人
    recommend: "/capi/product/qiuxie/open/searchList",
    winninginfo: '/capi/data/indexdraw/winninginfo',
    NoTokenWinninginfo: '/capi/data/indexdraw/open/winninginfo',
    StoreActivityinfo: '/capi/activity/open/activityinfo',  // 门店抽奖 主接口
    StoreUserinfo: '/capi/activity/storesdraw/userinfo', // 门店抽奖 用户报名状态信息
    StoreApply: '/capi/activity/storesdraw/apply', // 门店抽奖 立即报名
    Doorapply: '/capi/activity/open/getstoreactivity', //获取门店活动信息 open 接口
    Getuserenrollinfo: '/capi/activity/storeactivity/getuserenrollinfo', //获取用户活动报名信息
    Enroll: '/capi/activity/storeactivity/enroll', //填写报名表单

}
function NoTokenWinninginfo(params = {}) {
    return POSTGROUP(url.NoTokenWinninginfo, params, false);
}
function winninginfo(params = {}) {
    return POSTGROUP(url.winninginfo, params, false);
}
function Recommend(params = {}) {
    return POSTGROUP(url.recommend, params, false);
}
function QiuxiePin(id) {
    return POSTGROUP(url.QiuxiePin, { id }, false)
}
function PrizeShow({ userid = 0, id }) {
    return POSTGROUP(url.PrizeShow, { userid, id }, false)
}
function NoTokenPrizeShow({ userid = 0, id, os = 'h5' }) {
    return POSTGROUP(url.NoTokenPrizeShow, { userid, id, os }, false)
}
function draw(params) {
    return POSTGROUP(url.draw, params, false)
}
function history(params) {
    return POSTGROUP(url.history, params, false)

    // okfunc()
}
function Rule(params) {
    return POSTGROUP(url.Rule, params, false)

}
function getShowPrize(params) {
    return POSTGROUP(url.getShowPrize, params, false)

}
function submitaddress(params) {
    return POSTGROUP(url.submitaddress, params, false)

}
function relate({ userid = 0, id }) {
    return POSTGROUP(url.relate, { userid, id }, false)

}

function StoreActivityinfo() {
    return POSTGROUP(url.StoreActivityinfo, {}, 1)

}
function StoreUserinfo({ activityid }) {
    return POSTGROUP(url.StoreUserinfo, { activityid }, false)

}
function StoreApply({ activityid }) {
    return POSTGROUP(url.StoreApply, { activityid }, false)

}
function Doorapply() {
    return POSTGROUP(url.Doorapply, {}, 1)

}
function Getuserenrollinfo({ activityid }) {
    return POSTGROUP(url.Getuserenrollinfo, { activityid }, 1)

}
function Enroll({ activityid, username, mobile, idno, province, district, detailaddress }) {
    return POSTGROUP(url.Enroll, { activityid, username, mobile, idno, province, district, detailaddress }, 1)

}

export {
    PrizeShow, draw, history, NoTokenPrizeShow, submitaddress, getShowPrize, Rule, relate, QiuxiePin,
    Recommend, winninginfo, NoTokenWinninginfo, StoreActivityinfo, StoreUserinfo, StoreApply, Doorapply,
    Getuserenrollinfo, Enroll
}