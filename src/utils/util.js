
/**
 * 复制到剪切板
 * @param {String|DOMElement} el 包含要复制内容的input或textarea的 选择器字符串或DOM元素
 */
const CopyToClipboard = el => {
  // resolve the element
  el = (typeof el === 'string') ? document.querySelector(el) : el

  el.select()

  // handle iOS as a special case
  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    // save current contentEditable/readOnly status
    var editable = el.contentEditable
    var readOnly = el.readOnly

    // convert to editable with readonly to stop iOS keyboard opening
    el.contentEditable = true
    el.readOnly = true

    // create a selectable range
    var range = document.createRange()
    range.selectNodeContents(el)

    // select the range
    var selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    el.setSelectionRange(0, 999999)

    // restore contentEditable/readOnly to original state
    el.contentEditable = editable
    el.readOnly = readOnly
  }
  // else {
  //   el.select()
  // }

  // execute copy command
  document.execCommand('copy')
}
/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
const debounce = (func, wait, immediate) => {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait);
    }
  }
}

/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
const throttle = (func, wait, type) => {
  let timeout;
  let previous;
  if (type === 1) {
    previous = 0;
  } else if (type === 2) {
  }
  return function () {
    let context = this;
    let args = arguments;
    if (type === 1) {
      let now = Date.now();

      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args)
        }, wait)
      }
    }
  }
}
export { CopyToClipboard, throttle, debounce }
