<template>
  <div class="add-info-mask" v-if='hasdata==1'>
    <div class="add-info">
      <div class="add-info-img">
        <img src="//files.eyee.com/mcdn/static/img/liwu03.png" alt="">
      </div>
      <span id="close" @click.stop="offClose">x</span>
      <div class="give" >
        <i>当前手机号已领取过红包</i><br>
        <em>您可通过该手机号登录</em>
        <div class="go-btn" @click.stop="gotoLogin">立即登录</div>
      </div>
    </div>
  </div>
</template>
<script>
const elBody = document.getElementsByTagName("body")[0];
export default {
  data() {
    return {
      hasdata: 1
    };
  },
  methods: {
    offClose() {
      this.hasdata = 2;
      sessionStorage.setItem("flg", "1");
      elBody.classList.remove("lock");
    },
    gotoLogin() {
      this.$router.push("/login");
      elBody.classList.remove("lock");
    }
  },
  mounted(){
    elBody.classList.add("lock");
  }
};
</script>
<style scoped>
.add-info-mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.add-info {
  /*居中*/
  width: 240px;
  height: 316px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  border-radius: 14px;
  background: #000;
}
.add-info-img {
  width: 50%;
  margin: 0 auto;
  margin-top: 20px;
}
#close {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 15px;
  /* width: 15px;
    height: 15px; */
  color: #fff;
  font-size: 20px;
  line-height: 20px;
}
.add-info.bgbold {
  background: #000;
}
.add-info.bgbold .title {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: #ffffff;
  letter-spacing: 0;
  line-height: 20px;
  text-align: center;
  margin-top: 30px;
}
.add-info .img-wrap {
  width: 260px;
  height: 200px;
}
.add-info .img-wrap img {
  width: 100%;
  height: 100%;
}
.give {
  width: 80%;
  margin: 10px auto 0;
  font-size: 12px;
}
.give i,
.give em {
  color: #fff;
  position: absolute;
  bottom: 100px;
  width: 100%;
  left: 0;
  text-align: center;
  font-style: normal;
  font-size: 16px;
}
.give em {
  bottom: 80px;
  font-size: 12px;
}
.give .give-info {
  width: 100%;
  text-align: center;
  line-height: 18px;
  color: #3ca0d1;
}
.give .go-btn {
  height: 35px;
  line-height: 35px;
  width: 200px;
  background: #ffc700;
  border-radius: 4px;
  text-align: center;
  margin: 5px auto;
  color: white;
  position: absolute;
  left: 50%;
  margin-left: -100px;
  bottom: 30px;
  font-size: 18px;
  /* float: left; */
}

.close {
  position: absolute;
  width: 30px;
  height: 30px;
  left: 50%;
  margin-left: -15px;
  bottom: -50px;
  border-radius: 50%;
  border: 1px solid #ccc;
  overflow: hidden;
  text-align: center;
}
.close img {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  margin-top: 3px;
}
</style>

