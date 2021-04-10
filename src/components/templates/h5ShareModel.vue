<template>
  <div>
    <div class="model" @click.stop="closeShareModel">
      <div class="h5shareIcon">
        <img src="/static/img/sharemodelbg.png" alt class>
        <div v-html="shareContent" class="flex-center flex-col share-text"></div>
      </div>

      <img src="/static/img/h5shareiconknow.png" alt class="h5shareiconknow">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    shareContent: String
  },
  mounted() {
    // console.log("shareData", this.shareData);
  },
  methods: {
    closeShareModel() {
      this.$emit("closeShareModel", "close");
    }
  }
};
</script>
<style scoped>
.model {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.model .h5shareIcon {
  width: 70%;
  position: absolute;
  top: 2vw;
  right: 6.13vw;
}
.model .h5shareiconknow {
  width: 50%;
  position: absolute;
  top: 83vw;
  right: 25.86vw;
}
.share-text {
  width: 78%;
  position: absolute;
  left: 16%;
  top: 65%;
  /* transform: translate(-50%, -50%); */
  font-size: 14px;
  color: #333;
  font-weight: bold;
}
</style>


