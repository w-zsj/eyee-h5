<template>
  <transition name="opacity">
    <div class="mask flex flex-center"
         v-show="visible"
         @click="cancel">
      <transition name="animate">
        <slot></slot>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.mask {
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}
.animate-enter {
  /* transform: translateX(100%); */
  transform: scale(0);
  opacity: 0;
}
.animate-enter-active {
  transition: all 0.5s ease;
}
.animate-leave {
  opacity: 1;
  /* transform: translateX(0); */
  transform: scale(1);
}
.animate-leave-active {
  opacity: 0;
  /* transform: translateX(100%); */
  transform: scale(0);
  transition: all 0.5s ease;
}

.opacity-enter {
  /* transform: translateX(100%); */
  opacity: 0;
}
.opacity-enter-active {
  transition: all 0.5s ease;
}
.opacity-leave {
  opacity: 1;
}
.opacity-leave-active {
  opacity: 0;
  transition: all 0.5s ease;
}
</style>