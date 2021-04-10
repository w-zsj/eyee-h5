<template>
  <div class="ser-card">
    <div class="list">
      <img v-for="(item,index) in imgs" v-lazy="item" :key="index" alt srcset />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgs: [
        "https://files.eyee.com/eyeeh5/img/monitor/service0.png?c=1",
        "https://files.eyee.com/eyeeh5/img/monitor/service1.png?c=1",
        "https://files.eyee.com/eyeeh5/img/monitor/service2.png?c=1",
        "https://files.eyee.com/eyeeh5/img/monitor/service3.png?c=1",
        "https://files.eyee.com/eyeeh5/img/monitor/service4.png?c=1"
      ]
    };
  },
  mounted() {
    let _ = this;
    _.setToolBar({ title: "斗牛服务卡介绍" });
  }
};
</script>
<style scoped>
.list {
  font-size: 0;
  overflow: hidden;
}
img {
  display: block;
  width: 100%;
  height: auto;
  float: left;
}
</style>