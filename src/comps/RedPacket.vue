<template>
  <div>
    <!-- 拼手气红包入口-->
    <div class="red-packet" @click="goSharePacket()">
      <img src="https://files.eyee.com/EYEE/icons/redpacket-order-enter.png" alt>
    </div>
    <div id="shareLink"></div>
    <div class="pop-sharePacket contentText" @click.stop="goSharePacket()" v-show="sharePacketShow">
      <transition name="fadeTuihuo">
        <div class="wrap redpakt-box">
          <img :src="redpaktImg">
          <div class="title-pakt">斗牛送您无门槛现金红包！</div>
          <div>复制链接分享给小伙伴，看看谁的最大</div>
          <div class="btns-sharePakt flex-center">
            <span class="cancl-sharebtn" @click.stop="goHidePacket()">暂时不要</span>
            <span @click.stop="copyLink">复制链接</span>
          </div>
        </div>
      </transition>

      <input type="text" v-model="url" class="fix-input" id="copyUrl">
    </div>
  </div>
</template>
<script>
import { CopyToClipboard } from "@/utils/util";
export default {
  name: "red-packet",
  props: {
    url: { type: String, default: "" },
    isShow: { type: Number, default: 0 }
    // goHidePacket: Function,
    // goAppPakt: Function
  },
  data() {
    return {
      sharePacketShow: false,
      redpaktImg: "https://files.eyee.com/EYEE/icons/redpacket-popbg.png"
    };
  },
  beforeMount() {},
  mounted() {
    if (this.isShow == 1) {
      this.sharePacketShow = true;
    }
  },
  computed: {},
  methods: {
    goSharePacket() {
      this.sharePacketShow = !this.sharePacketShow;
    },
    gotoAppPakt() {
      console.log("分享红包");
      this.loadApp();
    },
    goHidePacket() {
      this.sharePacketShow = !this.sharePacketShow;
    },
    copyLink() {
      CopyToClipboard("#copyUrl");
      this.toast("复制成功！");
      // var oInput = document.createElement("input");
      // var linkInpt = document.getElementById("shareLink");
      // oInput.value = this.url;
      // console.log("oInput.value", oInput.value);
      // if (this.url) {
      //   linkInpt.appendChild(oInput);
      //   oInput.select();
      //   document.execCommand("Copy");
      //   this.toast("复制成功！");
      // }
      // linkInpt.removeChild(oInput);
    }
  }
};
</script>
<style scoped>
.red-packet {
  margin: 10px;
}
.wrap.redpakt-box {
  width: 70%;
  padding: 0;
  bottom: 50%;
  transform: translate(-50%,50%);
}
.fix-input {
  position: fixed;
  top: -100vh;
}
</style>
