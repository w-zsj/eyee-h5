
// 首字母大写
// function changeStr(str) {
//     return str.charAt(0).toUpperCase() + str.slice(1)
// }
// 全局过滤器
import filtersObj from './filters'
// 全局指令
import directivesObj from './directives'
// console.log('requireComponrnt---->>>', requireComponrnt.keys())
const install = (Vue) => {
    /* 全局通用模版 */
    const requireComponrnt = require.context('./comps', true, /\.vue$/);
    requireComponrnt.keys().forEach(fileName => {
        let item = requireComponrnt(fileName)
        let componentName = fileName.replace(/\.\//, '').replace(/\.\w+$/, '')
        // console.log('TLC item---->>>', componentName, item)
        Vue.component(componentName, item.default || item)

    });
    // 全局过滤器
    for (let key in filtersObj) {
        if (key && filtersObj[key]) {
            Vue.filter(key, filtersObj[key])
        }
    }

    // 全局指令
    for (let key in directivesObj) {
        if (key && directivesObj[key]) {
            Vue.directive(key, directivesObj[key])
        }
    }

}
export default install