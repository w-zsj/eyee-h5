import { GetAntiBrushJs } from './api/user'
import { GetCaptchaWithImg } from "@/common/api/user";
const dom = window.document
const TencentCaptchaJsId = '_TencentCaptchaJs'
const TencentCaptchaEleId = '_TencentCaptcha'

const _initJs = callback => {
  let js = dom.getElementById(TencentCaptchaJsId)
  if (!js) {
    GetAntiBrushJs().then(res => {
      console.log('GetAntiBrushJs res', res)
      if (res) {
        js = dom.createElement('script')
        js.id = TencentCaptchaJsId
        js.src = res
        dom.head.appendChild(js)
        js.onload = callback
      // }else console.error('GetAntiBrushJs error', res)
      } else callback()
    }).catch(e => {
      if (e.code === 1511757) {
        callback()
      }
      console.error('GetAntiBrushJs error', e)
    })
  } else callback()
}
const AntiBrush = (payload = {}, callback) => {
  _initJs(() => {
    // if (!window.capInit) console.error('未加载到验证码组件！')
    if (!window.capInit) callback({ ...payload })
    else {
      let ele = dom.getElementById(TencentCaptchaEleId)
      if (!ele) {
        ele = dom.createElement('div')
        ele.id = TencentCaptchaEleId
        dom.body.appendChild(ele)
      }
      window.capInit(ele, { callback: res => {
        if (res && res.ret === 0) callback({ ...payload, ticket: res.ticket })
        else {
          callback(false)
        }
      }, themeColor: 'ffc700', showHeader: false, type: 'popup' })
    }
  })
}
const AntiBrushCaptchaWithImg = (callback) => {
  GetCaptchaWithImg().then(res => {
    callback('success', res)
  })
    .catch(err => {
      if (err.code === 1511757) {
        callback('jump')
      } else {
        callback('error')
      }
    })
}
export { AntiBrush, AntiBrushCaptchaWithImg }
