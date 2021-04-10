<template>
  <div class="promote">
    <div class="banner">
      <img v-lazy="'https://files.eyee.com//eyeeh5/img/code/3_01.jpg'" alt="" style="marginBottom:0vw;" />
      <img class="footer" v-lazy="'https://files.eyee.com//eyeeh5/img/code/3_02.jpg'" alt="" />
    </div>

    <div class="fingerprint flex-center">
      <img :src="codeUrl" alt="" class="qcode" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      arr: [
        `https://files.eyee.com//eyeeh5/img/code/code1.jpeg?c=${new Date().getTime()}`,
        `https://files.eyee.com//eyeeh5/img/code/code2.jpeg?c=${new Date().getTime()}`,
        `https://files.eyee.com//eyeeh5/img/code/code3.jpeg?c=${new Date().getTime()}`,
      ],
      codeUrl: `https://files.eyee.com//eyeeh5/img/code/code1.jpeg?c=${new Date().getTime()}`,
    };
  },
  mounted() {
    let random = Math.floor(Math.random() * 3);
    this.codeUrl = this.arr[random];
    console.log("random", this.codeUrl);
  },
};
</script>
<style scoped lang='scss'>
.promote {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url('https://files.eyee.com//eyeeh5/img/code/line.jpg')0 0 repeat-y;
  background-size: 100% auto;
  .banner {
    position: relative;
    img {
      display: block;
      width: 100%;
      font-size: 0;
    }
  }
  .footer {
    position: fixed;
    width: 100%;
    height: auto;
    left: 0;
    bottom: 0;
  }

  .fingerprint {
    position: relative;
    z-index: 2;
    .qcode {
      width: 34.66vw;
      height: 34.66vw;
      margin: 0 auto;
    }
  }
}
</style>