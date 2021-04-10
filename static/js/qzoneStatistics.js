;
(function (g, d, t, e, v, n, s) {
  if (g.gdt) return;
  v = g.gdt = function () {
    v.tk ? v.tk.apply(v, arguments) : v.queue.push(arguments)
  };
  v.sv = '1.0';
  v.bt = 0;
  v.queue = [];
  n = d.createElement(t);
  n.async = !0;
  n.src = e;
  // s = d.getElementsByTagName(t)[0];
  d.getElementsByTagName('head')[0].appendChild(n);
  // s.parentNode.insertBefore(n, s);
}(window, document, 'script', '//qzonestyle.gtimg.cn/qzone/biz/gdt/dmp/user-action/gdtevent.min.js'));
window.gdt('init', '1110959195');
window.gdt('track', 'PAGE_VIEW');
