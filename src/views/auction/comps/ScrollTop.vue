<template>
  <div class="scrolltop" v-if="scrollTop" @click="gotop">
    <slot name="url">
      <img :src="url" alt />
    </slot>
    <slot name="txt"></slot>
  </div>
</template>
<script >
export default {
  data() {
    return {
      scrollTop: false // 判断回顶按钮是否显示
    };
  },
  props: {
    url: {
      type: String,
      default: "//files.eyee.com/mcdn/img/auction/go_top.png"
    },
    txt: String
  },
  mounted() {
    // 开启滚动监听
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    gotop() {
      window.scrollTo(0, 0);
    },
    // 滚动监听 滚动触发的效果写在这里
    handleScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      var winHeight = window.screen.height;
      if (scrollTop > winHeight - 100) this.scrollTop = true;
      else this.scrollTop = false;
    }
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>
<style scoped lang='scss'>
.scrolltop {
  width: 11.733vw;
  height: 11.733vw;
  position: fixed;
  bottom: 34.666vw;
  right: 4vw;
  z-index: 5;
}
</style>