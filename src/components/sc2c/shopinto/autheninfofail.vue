<template>
    <div>
         <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>芝麻认证</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
       <div class="failimg">
            <img src="/static/img/certificate_error.png" alt="">
            <h4>认证失败!</h4>
            <p>您提供的身份信息与当前登录账户实名信息不一致，请确认后重新提交</p>
        </div>
        <div class="power-return ">
            返回({{returntime}}s之后自动返回)
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      returntime: 30
    };
  },
  mounted() {
    setInterval(() => {
      this.returntime--;
      if (this.returntime < 1) {
        this.$router.back(-1);
      }
    },1000);
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    })
  }
};
</script>
<style scoped>
.failimg {
  text-align: left;
  padding: 20vw;
  font-family: "PingFangSC";
  color: #ef0000;
}
.failimg img {
  width: 39vw;
  display: block;
  margin: 0 auto;
}
.failimg h4 {
  text-align: center;
  margin: 25px 0;
  font-size: 14px;
}
.failimg p {
  font-size: 14px;
}
.power-return{
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    text-align: center;
    background: #333;
    position: fixed;width: 100vw;
    bottom: 0;
    left: 0;
}
</style>


