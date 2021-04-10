export default {
    path: "/promote",
    name: "promote",
    component: () => import("../../views/activities/promote"),
    meta: { title: "长按识别二维码,咨询了解详情", keepAlive: true },
    hidden: false, // 路由是否隐藏
};
