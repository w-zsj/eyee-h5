export default
    {
        path: '/activity/crazy',
        name: 'activityCrazy',
        component: () => import('../../views/activities/crazy'),
        meta: { title: '球鞋狂欢周' },
        hidden: false // 路由是否隐藏
    }