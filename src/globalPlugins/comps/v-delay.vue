<template>
    <div>
        <div>
            <slot v-if="show"></slot>
        </div>
    </div>
</template>
<script>
// 延迟渲染模版
export default {
  props: {
    delay: {
      type: Number,
      default() {
        return 30;
      }
    }
  },
  data() {
    return {
      show: true
    };
  },
  created() {
    // console.log('v-delay', this.delay)
    this.delayShow();
  },
  methods: {
    delayShow() {
      this.show = false;
      let delay = this.delay;
      delay = delay < 30 ? 30 : delay;
      setTimeout(() => {
        this.show = true;
        this.$emit("loaded");
      }, delay);
    }
  }
};
</script>
