// 自适应
function setRem(doc, win) {
  let docEl = doc.documentElement, resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth
      if (!clientWidth) return
      docEl.style.fontSize = 20 * (clientWidth / 320) + 'px'// 其中“20”根据你设置的html的font-size属性值做适当的变化
    }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
}
// 动画函数
function startMove(obj, json, endFn) {
  clearInterval(obj.timer)
  obj.timer = setInterval(function () {
    var bBtn = true
    for (var attr in json) {
      var iCur = 0
      if (attr === 'opacity') {
        if (Math.round(parseFloat(getStyle(obj, attr)) * 100) === 0) {
          iCur = Math.round(parseFloat(getStyle(obj, attr)) * 100)
        } else {
          iCur = Math.round(parseFloat(getStyle(obj, attr)) * 100) || 100
        }
      } else {
        iCur = parseInt(getStyle(obj, attr)) || 0
      }
      var iSpeed = (json[attr] - iCur) / 8
      iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed)
      if (iCur !== json[attr]) {
        bBtn = false
      }
      if (attr === 'opacity') {
        obj.style.filter = 'alpha(opacity=' + (iCur + iSpeed) + ')'
        obj.style.opacity = (iCur + iSpeed) / 100
      } else {
        obj.style[attr] = iCur + iSpeed + 'px'
      }
    }
    if (bBtn) {
      clearInterval(obj.timer)
      if (endFn) {
        endFn.call(obj)
      }
    }
  }, 30)
}
// 事件绑定
function bindEvent(obj, ev, fn) {
  if (obj.addEventListener) {
    obj.addEventListener(ev, fn, false)
  } else {
    obj.attachEvent('on' + ev, function () {
      fn.call(obj)
    })
  }
}
// 获取样式值
function getStyle(obj, attr) {
  if (obj.currentStyle) {
    return obj.currentStyle[attr]
  } else {
    return getComputedStyle(obj, false)[attr]
  }
}
// 抓取元素对象
function getEl(el, index, parent) {
  if (!el) {
    return
  } else if (typeof index === 'number') {
    return document.getElementsByTagName(el)[index]
  } else if (typeof index === 'string' && !parent) {
    return index.getElementsByClassName(el)
  } else if (!index && !parent) {
    return document.getElementById(el)
  } else if (parent && index && typeof parent === 'object') {
    return parent.getElementsByTagName(el)[index]
  }
}
// 计算边距
function computedRange(el, attr, parent) {
  if (!parent) {
    return document.body.clientWidth - parseInt(getStyle(el, attr))
  } else if (parent) {
    return parseInt(getStyle(parent, attr)) - parseInt(getStyle(el, attr))
  }
}
function setCss(element, attr, val) {
  if (attr == 'scale' || attr == 'scaleX' ||
    attr == 'scaleY' || attr == 'scaleZ' ||
    attr == 'rotateX' || attr == 'rotateY' ||
    attr == 'rotateZ' || attr == 'rotate' ||
    attr == 'skewX' || attr == 'skewY' ||
    attr == 'translateX' || attr == 'translateY' ||
    attr == 'translateZ') {
    return cssTransform(element, attr, val)
  }
  if (arguments.length == 2) {
    var val = getComputedStyle(element)[attr]
    if (attr == 'opacity') {
      val = Math.round(val * 100)
    }
    return parseFloat(val)
  }
  if (attr == 'opacity') {
    element.style.opacity = val / 100
  } else {
    element.style[attr] = val + 'px'
  }
}
function cssTransform(element, attr, val) {
  if (!element.transform) {
    element.transform = {}
  }
  if (typeof val === 'undefined') {
    if (typeof element.transform[attr] === 'undefined') {
      switch (attr) {
        case 'scale':
        case 'scaleX':
        case 'scaleY':
        case 'scaleZ':
          element.transform[attr] = 100
          break
        default:
          element.transform[attr] = 0
      }
    }
    return element.transform[attr]
  } else {
    element.transform[attr] = val
    var transformVal = ''
    for (var s in element.transform) {
      switch (s) {
        case 'scale':
        case 'scaleX':
        case 'scaleY':
        case 'scaleZ':
          transformVal += ' ' + s + '(' + (element.transform[s] / 100) + ')'
          break
        case 'rotate':
        case 'rotateX':
        case 'rotateY':
        case 'rotateZ':
        case 'skewX':
        case 'skewY':
          transformVal += ' ' + s + '(' + element.transform[s] + 'deg)'
          break
        default:
          transformVal += ' ' + s + '(' + element.transform[s] + 'px)'
      }
    }
    element.style.WebkitTransform = element.style.transform = transformVal
  }
}
// 滚动停止
// function endScroll(el) {
//   var oEl = document.getElementById(el) || el
//   var topValue = 0// 上次滚动条到顶部的距离
//   var interval = null// 定时器
//   var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop// 滚动高度
//   oEl.onscroll = function () {
//     if (interval === null) {
//       interval = setInterval(function () {
//         // 判断此刻到顶部的距离是否和200毫秒前的距离相等
//         if (scrollTop === topValue) {
//           console.log('滚动停止')
//           clearInterval(interval)
//           interval = null
//         } else {
//           topValue = scrollTop
//         }
//       }, 200)
//       topValue = scrollTop
//     }
//   }
// }
// 分割数组，返回新数组
function sliceArray(array, size) {
  var result = []
  for (var x = 0; x < Math.ceil(array.length / size); x++) {
    var start = x * size
    var end = start + size
    result.push(array.slice(start, end))
  }
  return result
}

export {
  setRem, startMove, bindEvent, getStyle, getEl, computedRange, cssTransform, setCss, sliceArray
}
// endScroll,
