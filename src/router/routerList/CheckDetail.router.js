export default
    {
        path: '/check/detail',
        name: 'vipDetail',
        component: () => import('../../views/vip/CheckDetail'),
        meta: { title: '奖励明细' },
        hidden: false // 路由是否隐藏 
    }
    