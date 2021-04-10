<template>
  <div class="creat-shoe">
    <div class="bonus-imgs">
      <img v-for="(item,index) in imgs" :key="index" v-lazy="item+`?clear=${clearPicCache}`" alt="">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgs: [
        "https://files.eyee.com/eyeeh5/img/monitor/shoe01.png",
        "https://files.eyee.com/eyeeh5/img/monitor/shoe02.png",
        "https://files.eyee.com/eyeeh5/img/monitor/shoe03.png"
      ],
      clearPicCache: new Date().getTime()
    };
  },
  mounted() {
    document.body.classList.add("bg-color");
  },
  destroyed() {
    document.body.classList.remove("bg-color");
  }
};
</script>
<style>
body.bg-color {
  min-height: 100vh;
  background: #be0009 !important;
}
</style>
<style scoped>
img {
  display: block;
  width: 100%;
}
</style>

