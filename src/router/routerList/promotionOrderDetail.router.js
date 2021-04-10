export default {
    path: "/promotion/order/detail",
    name: "orderDetail",
    component: () => import("../../views/activities/promotion/orderDetail"),
    meta: { title: "推广订单明细", keepAlive: false },
    hidden: false, // 路由是否隐藏
};
