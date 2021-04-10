<template>
  <div class="vip-description" v-once>
    <div class="vip-title">
      <img v-lazy="imgurls[0]" alt>
    </div>
    <div class="vip-cont">
      <img v-lazy="imgurls[1]" alt>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      imgurls:[
        'https://files.eyee.com/eyeeh5/img/monitor/monitor_vip01.png',
        'https://files.eyee.com/eyeeh5/img/monitor/monitor_vip02.png',
      ]
    };
  },
  mounted(){

  }
}
</script>
<style lang="scss" scoped>
  .vip-description{
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 5.6vw 5.6vw 0;
    background-color: #31343D;
  }
  .vip-description img{
    display: block;
    width: 100%;
  }
  .vip-title{
    padding: 0 12vw 8vw;
  }
  .vip-cont{
    background-color: #fff;
    border-radius: 4px;
  }
</style>

