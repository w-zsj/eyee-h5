<template>
  <div class="share-modal" :class="{act:isShow}">
    <div class="fix-foot">
      <p>分享</p>
      <div class="flex-around lsm-btns gaps">
        <div @click="share(2)">
          <img src="//files.eyee.com/mcdn/static/imgs/share-wx.png" alt="">
          <span>微信好友</span>
        </div>
        <div @click="share(1)">
          <img src="//files.eyee.com/mcdn/static/imgs/share-wx-pyq.png" alt="">
          <span>微信朋友圈</span>
        </div>
      </div>
      <div class="lsm-btn" @click="cancel">取消</div>
      <div class="fix-iphoneX"></div>
    </div>
    <slot></slot>
  </div>
</template>
<script>
/**
 * {
 *  "sharecontent":"分享内容",
 *  "sharepicurl":"分享图片地址",
 *  "shareurl":"分享链接",
 *  "sharetitle":"分享标题",
 *  "callbackname":"分享结果回调方法名",
 *  "xcxurl":"小程序的分享地址",
 *  "xcxicon":"小程序的封面图",
 *  "xcxid":"小程序的原始id",
 *  "type":"分享内容内型，1：是只支持分享图片，2：是支持分享H5链接 和 小程序",
 *  "platform":"分享平台，1：是分享到朋友圈，2：是分享给微信好友 ，3: 分享到 QQ 4:分享到QQ空间"
 * }
 */
let _loader;
export default {
  name: "ShareModal",
  props: {
    shareData: Object,
    // [分享到朋友圈的类型, 分享到好友的类型]
    shareType: { type: Array, default: () => [1, 2] },
    show: Boolean
  },
  data() {
    return {
      isShow: this.show
    };
  },
  watch: {
    show(val) {
      this.isShow = val;
    }
  },
  methods: {
    cancel() {
      this.$emit("update:show", false);
    },
    share(type) {
      let _ = this;
      _loader = _.$loader("正在调起分享···");
      let { shareData, shareType } = _;
      let toType = shareType[type - 1];
      if (toType === 1 && !shareData.poster) return _.toast("异常分享数据");

      _.javascriptBridge({
        name: "callAppDirectlyShare",
        params: {
          sharecontent: shareData.content,
          sharetitle: shareData.title,
          shareurl: shareData.url || "",
          sharepicurl: toType === 1 ? shareData.poster || "" : "",
          xcxurl: shareData.xcxurl,
          xcxicon: shareData.xcxicon,
          xcxid: shareData.xcxid,
          type: toType,
          platform: type,
          callbackname: "_shareCallBack"
        }
      });
      setTimeout(() => {
        _loader && _loader.close();
      }, 3000);
    }
  }
};
</script>
<style lang="scss">
.share-modal {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  text-align: center;
  pointer-events: none;

  &.act {
    background: rgba(0, 0, 0, 0.4971);
    pointer-events: all;

    .fix-foot {
      bottom: 0;
    }
  }

  .fix-foot {
    z-index: 39;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    box-shadow: 0 -10px 15px 0 rgba(0, 0, 0, 0.03);
    transform: translateZ(0);
    transition: bottom 0.2s ease-out;
    bottom: -100vh;
    border-radius: 12px 12px 0 0;
    font-weight: 500;
    font-size: 15px;
    overflow: hidden;

    p {
      margin: 20px 0 10px;
      line-height: 21px;
    }

    img {
      display: block;
      width: 40px;
      height: 40px;
      margin: 0 auto 5px;
    }

    span {
      font-size: 11px;
      color: #b4b4b4;
      line-height: 16px;
    }
  }
  .lsm-btns {
    padding: 10px 30px 20px;
  }
  .lsm-btn {
    line-height: 60px;
    color: #b4b4b4;
  }
}
</style>