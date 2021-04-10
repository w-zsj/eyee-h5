export default
    {
        path: '/destroyed/rule',
        name: 'destroyedRule',
        component: () => import('../../components/about/destroyedRule'),
        meta: { title: '斗牛平台用户注销规则 ' },
        hidden: false // 路由是否隐藏 
    }