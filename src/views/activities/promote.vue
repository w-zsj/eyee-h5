<template>
  <div class="promote">
    <div class="banner">
      <img v-lazy="'https://files.eyee.com//eyeeh5/img/code/code11.png'" alt="" style="marginBottom:0vw;" />
      <div class="code">
        <img v-lazy="'https://files.eyee.com//eyeeh5/img/code/code12.png'" alt="" />
      </div>
    </div>

    <div class="fingerprint flex-center">
      <img :src="codeUrl" alt="" class="qcode" />
      <img v-lazy="'https://files.eyee.com//eyeeh5/img/code/code13.png'" alt="" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      arr: [
        `https://files.eyee.com//eyeeh5/img/code/wx1.jpeg?c=${new Date().getTime()}`,
        `https://files.eyee.com//eyeeh5/img/code/wx2.jpeg?c=${new Date().getTime()}`,
        `https://files.eyee.com//eyeeh5/img/code/wx3.jpeg?c=${new Date().getTime()}`,
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
  .banner {
    position: relative;
    margin-bottom: 13.2vw;
    .code {
      position: absolute;

      bottom: -10.133vw;
      left: 9.066vw;
      right: 9.066vw;
    }
  }

  .fingerprint {
    img {
      width: 32;
      height: 32vw;
    }
    overflow: hidden;
    .qcode {
      width: 34.66vw;
      height: 34.66vw;
      margin-right: 12vw;
    }
  }
}
</style>