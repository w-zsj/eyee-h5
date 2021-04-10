<template>
  <div class="luck-draw-promote-container">
    <v-headerscopy v-if="!$root.ISAPP && !$root.ISMP" bg="luckDraw">
      <div class="nav-tab2">
        <h3 style="color: #000">斗牛抽抽乐</h3>
      </div>
    </v-headerscopy>
    <img width="100%" src="https://files.eyee.com/eyeeh5/img/sign_in/37.png" alt="">
  </div>
</template>

<script>

export default {
  data() {
    return {}
  },
  created() {
    this.setToolBar({ title: '斗牛抽抽乐' });
  }
}
</script>

<style lang="scss">
  .luck-draw-promote-container {
    font-size: 0;
  }
</style>
