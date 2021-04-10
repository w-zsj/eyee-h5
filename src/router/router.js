const routerList = []
const requireRouter = require.context('./routerList', true, /\.router\.js$/);
requireRouter.keys().forEach(key => {
    if (key && requireRouter(key)) {
        let item = requireRouter(key)
        if (!item.default.hidden) routerList.push(item.default || item)
    }
});
// console.log('requireRouter----', routerList)
export default routerList