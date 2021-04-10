<template>
    <svg v-if="ani" viewBox="0, 0, 365, 482" class="steps_anim">
      <foreignObject class="box" width="365" height="482">
        <div ref="ani" class="img"></div>
      </foreignObject>
    </svg>
</template>

<script>
export default {
  data() {
    return {
      ani: false
    };
  },
  mounted() {
    let pp = new Image();
    pp.onload = () => {
      console.log("图片加载完成");
      this.ani = true;
    };
    pp.src = "http://files.eyee.com/mcdn/img/setcaed/ani_2.png";
  }
};
</script>

<style lang="scss" scoped>
.steps_anim {
  width: 97.3333vw;
  height: 128.5333vw;
}
.box {
  width: 365px;
  height: 482px;
}
.img {
  width: 29200px;
  height: 482px;
  background: url('//files.eyee.com/mcdn/img/setcaed/ani_2.png') 0 0 no-repeat;
  background-size: 29200px 482px;
  animation: step 5s steps(79) 1;
  animation-fill-mode: forwards;
}

@keyframes step {
  100% {
    background-position: -28835px 0;
  }
}
</style>

