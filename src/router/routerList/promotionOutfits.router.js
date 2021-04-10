export default {
    path: "/promotion/outfits",
    name: "outfits",
    component: () => import("../../views/activities/promotion/outfits"),
    meta: { title: "斗牛穿搭学院", keepAlive: false },
    hidden: false, // 路由是否隐藏
};
