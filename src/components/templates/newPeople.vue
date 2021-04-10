<template>
<div>
  <div class="add-info-mask" v-if="hasdata==1" @click="gotoHome()">
    <div class="add-info">
      <div class="give" >
        <div class="go-btn" @click.stop="goAddUserInfo">立即领取</div>
        <div class="close" >
          <img src="//files.eyee.com/mcdn/static/img/close.png">
        </div>
      </div>
    </div>
  </div>
  <newPeopleNext v-else-if="hasdata==2"></newPeopleNext>
</div>

</template>
<script>
import newPeopleNext from "./newPeopleNext.vue";
import { mapGetters } from "vuex";
const elBody = document.getElementsByTagName("body")[0];
export default {
  components: {
    newPeopleNext
  },
  data() {
    return {
      hasdata: 1
    };
  },
  computed: {
    ...mapGetters({ selectCountryCode: "selectCountryCode" })
  },
  mounted() {
    if (this.selectCountryCode == "+86") {
      this.hasdata = 1;
    } else {
      this.hasdata = 2;
    }
    elBody.classList.add("lock");

  },
  methods: {
    goAddUserInfo() {
      this.hasdata = 2;
    },
    gotoHome() {
      this.hasdata = 3;
      elBody.classList.remove("lock");
      sessionStorage.setItem("flg", "1");
    }
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
  background: url("//files.eyee.com/mcdn/static/img/liwu00.png") 0 0 no-repeat;
  background-size: 100% 100%;
  /* overflow: hidden; */
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

