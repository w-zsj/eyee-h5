<template>
  <div
    v-if="!$root.ISAPP && !$root.ISMP"
    class="loader_box"
    :data-clipboard-text="copyVal"
    @click="handle"
  >
    <slot></slot>
  </div>
</template>
<script>
/**
 * usage
 * 
    <loader from="2" :id='id' use-confirm>
      ...slot dom...
    </loader>
 */
import Clipboard from "clipboard";

const channel = [
  // 0 默认通用下载APP
  "load",
  // 1 球鞋限量抢购
  "ipo",
  // 2 日历监控卡
  "vipmonitor",
  // 3 潮友团
  "snkgroup",
  // 4 助力砍价
  "helpbargain",
  // 5 新人福利
  "pullnewuser",
  // 6 商城首页
  "homeindex",
  // 7 球鞋首页
  "snkindex",
  // 8 新人大礼包
  "redpacketgift",
  // 9 拼手气红包
  "redpacketluck",
  // 10 新人专区
  "newcomerarea",
  // 11 门店抽奖
  "storelotter",
  // 12 自定义专题
  "active",
  // 13 车轮
  "wheel",
  // 14 裂变活动
  "fission",
];
const appStore = "https://itunes.apple.com/cn/app/eyee/id962223967?mt=8";
// 配置渠道包apk 索引对应channel
const apk = [
  "https://files.eyee.com/app/donew_official_website.apk",
  "https://files.eyee.com/app/h5activity/app-H51.apk",
  "https://files.eyee.com/app/h5activity/app-H52.apk",
  "https://files.eyee.com/app/h5activity/app-H53.apk",
  "https://files.eyee.com/app/h5activity/app-H54.apk",
  "https://files.eyee.com/app/h5activity/app-H55.apk",
  "https://files.eyee.com/app/h5activity/app-H56.apk",
  "https://files.eyee.com/app/h5activity/app-H57.apk",
  "https://files.eyee.com/app/h5activity/app-H58.apk",
  "https://files.eyee.com/app/h5activity/app-H59.apk",
];
export default {
  name: "Loader",
  props: {
    from: { type: String, validation: (val) => channel[val] },
    id: String,
    useConfirm: Boolean,
    showLoadModal: { type: Number, default: 0 },
  },
  computed: {
    val() {
      let _ = this,
        { from, id } = _,
        cnl = channel[from] || channel[0];
      id = (id && "&" + id) || "";
      return encodeURIComponent(btoa(cnl + id));
    },
    copyVal() {
      return "ZG9uZXde" + this.val;
    },
  },
  methods: {
    handle() {
      var clipboard = new Clipboard(".loader_box");
      // 补充添加剪切板
      document.execCommand("copy");

      let _ = this,
        { from, ua, dpr } = ENV,
        loadurl = ua.ios ? appStore : apk[from] || apk[0],
        exp = new Date();

      // cookie 过期时间 30分
      exp.setMinutes(exp.getMinutes() + 30);

      const call = () => {
        // DoNew Channel
        $ck.set("DNCNL", _.val, { expires: exp, path: "/" });

        // 延时 确保剪切板添加成功
        setTimeout(() => {
          if (ua.wx) window.open(loadurl, "_blank");
          else window.location = loadurl;
        }, 300);
      };

      if (ua.wx) {
        let tempUrl = `/loadApp?_f=${_.from}&_i=${_.id || ""}`;
        if (_.showLoadModal) window.location = loadurl;
        else {
          if (ua.ios) _.$router.push(tempUrl);
          else history.replaceState("donewLoadApp", document.title, tempUrl);
          // alert("右上角");
          _.$root.showLoadModal = true;
        }
      } else if (_.useConfirm) {
        _.confirm({
          msg: "下载斗牛APP体验更多功能",
          okText: "立即下载",
          cancelText: "容我想想",
          ok: call,
        });
      } else call();
    },
  },
};
</script>