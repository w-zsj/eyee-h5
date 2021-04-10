<template>
    <div>
        <div class="nav-back flex-aic" @click.stop.prevent="navBack">
            <span class="icon-left" v-if='!hide'>
              <!-- <img src="../../assets/img/star.png" style="width:1.5rem"> -->
            </span>
        </div>
    </div>
</template>
<script>
// 头部返回组件
export default {
  data() {
    return {
      hide: false
    };
  },
  props: {
    returnBack: { type: Number }
  },
  methods: {
    navBack() {
      if (this.hide) return;
      if (this.returnBack) {
        this.$router.push("/user/home");
        return;
      }
      if (window.history.length < 2) {
        this.$router.push("/");
      } else this.$router.go(-1); // 单独进入时后退到首页
    }
  }
};
</script>
<style scoped>
.icon-left:after {
  content: "";
  display: inline-block;
  border: solid #969696;
  margin-left: 1.6vw;
  padding: 0.65vw;
  transform: rotate(135deg);
  border-width: 0 2px 2px 0;
  margin-left: 15px;
}
.back {
  background: transparent!important;
  color: #969696!important;
  margin-left: 1rem!important;
  width: 14px!important;
  height: 14px!important;
}
</style>

