import Vue from 'vue'
let scrollHandle
const directives = {
    "focus": (el, { value }) => {
        // 获取焦点
        if (value) el.focus()
    },
    "dragMove": {// 按钮拖拽 效果
        bind: function (el, binding) {
            var touch, disX, disY, dw = document.documentElement.clientWidth,
                dh = document.documentElement.clientHeight
            Vue.nextTick(function () {
                let ele = el.getBoundingClientRect(),
                    elewidth = ele.width, eleheight = ele.height
                el.ontouchstart = (e) => {
                    if (e.touches) {//有可能对象在e上也有可能对象在e.touches[0]上
                        touch = e.touches[0];
                    } else {
                        touch = e;
                    }
                    disX = touch.clientX - el.offsetLeft;//鼠标位置X减去元素距离左边距离（鼠标到元素左边的距离）
                    disY = touch.clientY - el.offsetTop;//鼠标位置Y减去距离顶部距离（鼠标到元素顶部的高度）
                }
                el.ontouchmove = (e) => {
                    if (e.touches) {//有可能对象在e上也有可能对象在e.touches[0]上
                        touch = e.touches[0];
                    } else {
                        touch = e;
                    }
                    //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                    let left = touch.clientX - disX;
                    let top = touch.clientY - disY;

                    //移动当前元素
                    if (left < 0) left = 0
                    else if (left > dw - elewidth) left = dw - elewidth
                    if (top < 100) top = 100
                    else if (top > dh - eleheight) top = dh - eleheight
                    el.style.left = left + 'px';
                    el.style.top = top + 'px';
                    e.preventDefault();//阻止页面的滑动默认事件
                };
                el.ontouchend = (e) => {
                    // el.ontouchmove = null;
                    // el.ontouchend = null;
                };
            })
        }
    },
    "loadmore": {
        inserted: (el, binding, vnode) => {
            el.addEventListener('scroll', function () {
                if ((el.scrollHeight - el.clientHeight) - el.scrollTop >= 0) {
                    binding.value()
                }
            })
        }
    },
    "scroll": {/* 滚动监听指令*/
        bind: (el, binding) => {
            let handle = binding.value
            if (typeof handle === 'function') {
                window.addEventListener('scroll', (scrollHandle = () => {
                    handle()
                })
                )
            }
        },
        unbind: (el, binding) => {
            window.removeEventListener('scroll', scrollHandle)
            scrollHandle = null
        }
    }
}
export default directives