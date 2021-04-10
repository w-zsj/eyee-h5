export default
    {
        path: '/promotion/goods',
        name: 'vipPromotionGoods',
        component: () => import('../../views/vip/PromotionGoods'),
        meta: { title: '推广商城' },
        hidden: false // 路由是否隐藏 
    }