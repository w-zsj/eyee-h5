<template>
  <div>
    <header ref='header' v-if='!hide' class="flex nav-top bgc" :class="'nav-top-' + bg">
      <v-back v-if="showback" :returnBack="returnBack"></v-back>
      <slot></slot>
    </header>
  </div>
</template>
<script>
// 头部公共组件
export default {
  props: {
    showback: { type: Boolean, default: true },
    bg: { type: String, default: "light" },
    hasgap: { type: Boolean, default: true },
    returnBack: { tyoe: Number }
  },
  data() {
    return {
      hide: false
    };
  },
  mounted() {
    this.$nextTick(function () {
      if (this.hasgap === true && !this.hide) {
        this.$parent.$el.style.marginTop = this.$el.clientHeight + "px";
      } else {
        this.$parent.$el.style.marginTop = 0;
      }
    });

    this.$refs.header.parentElement.style.marginTop = "48px";
    // :top-method="reload"
  }
};
</script>
<style scoped>

</style>

