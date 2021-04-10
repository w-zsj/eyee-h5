
const filter = {
    'firstImg': (val) => (val || '').split('|')[0],
    'https': (val) => {
        if (val) {
            let rgx = /http:\/\/files\.eyee\.com(?!\.(jpg|png|gif|jpeg)).+?\.(jpg|png|gif|jpeg)/gi
            return val.replace(rgx, function (match) {
                return match.replace('http://', 'https://')
            })
        } else return val
    },
    'decpadleft': (val) => {//* 十进制补零 */
        if (val < 10) return '0' + val
        else return val
    },
    'tofixed': (val) => {
        // 保留两位小数
        if (val != null && val !== undefined && val >= 0) {
            return parseFloat(val).toFixed(2)
        }
    },
    "phonestar": (val) => {
        // 手机中间四位显示星
        if (val) {
            var mobile = val.includes('-') ? val.split('-')[1] : val
            // console.log('val.includes', mobile)
            let m = mobile.substr(3, 5)
            return mobile.replace(m, '*****')
        }
    }
}
export default filter