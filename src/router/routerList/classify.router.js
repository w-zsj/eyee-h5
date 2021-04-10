export default {
  path: "/classify",
  name: "classify",
  component: () => import("../../views/classify/index"),
  meta: { title: "分类", keepAlive: true },
  hidden: false, // 路由是否隐藏
};
