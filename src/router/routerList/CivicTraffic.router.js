export default {
    path: "/civic/traffic",
    name: "civictraffic",
    component: () => import("../../views/activities/civictraffic"),
    meta: { title: "长按识别二维码,咨询了解详情", keepAlive: true },
    hidden: false, // 路由是否隐藏
};
