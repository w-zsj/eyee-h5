<template>
  <div class="fission-container">
    <div class="fission-container-start" v-if="css.startShow">
      <div class="fission-container-card"></div>
      <div class="fission-container-btn" @click="handleGetInfo">
        <img
          src="https://files.eyee.com/mcdn/img/fission/start.png"
          alt=""
          srcset=""
        />
      </div>
    </div>

    <transition name="bounce">
      <serverCard v-if="!css.startShow" :heardImg="heardImg"></serverCard>
    </transition>
  </div>
</template>


<script>
import { weixinApp } from "../../../common/api/oauthAPI";
import * as api from "../../../common/api/user";

import serverCard from "./saveCard";

export default {
  components: {
    serverCard
  },
  data() {
    return {
      css: {
        startShow: true
      },
      heardImg: undefined
    };
  },
  mounted() {
    this.wx_code();
    this.initShare({
      info: {
        title: "测测你的2020年球鞋中签运势>>",
        desc: "我的2020年 逢签必中！",
        img: "https://files.eyee.com/mcdn/img/fission/share.jpg"
      }
    });
  },
  methods: {
    handleGetInfo() {
      var path = window.location.origin + window.location.pathname;
      console.log("TCL: handleGetInfo -> path", path);
      var link = weixinApp.get_authorize_base_link(path, "weixinJ");
      console.log("TCL: handleGetInfo -> link", link);
      window.location = link;
    },
    wx_code() {
      if (window.location.href.indexOf("code") > 0) {
        console.log(
          "TCL: wx_code -> window.location.href",
          window.location.href
        );
        var weixincode = window.location.href
          .split("code=")[1]
          .split("&state")[0];
        api
          .WXRegisterAuth({
            WXCode: weixincode
          })
          .then(res => {
            console.log("TCL: handleGetInfo -> res", res);
            this.css.startShow = false;
            this.heardImg = res.headimgurl;
          })
          .catch(err => {
            console.error(err);
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "SourceHanSansCN-Medium";
  src: url("https://files.eyee.com/mcdn/img/fission/fissionFont1.ttf");
}

.fission-container {
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  background-image: url("https://files.eyee.com/mcdn/img/fission/bg.png");
  background-repeat: no-repeat;
  background-size: cover;

  &-start {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-card {
    margin-top: 14.9333vw;
    width: 95.8667vw;
    height: 85.0667vw;
    background-image: url("https://files.eyee.com/mcdn/img/fission/card.png");
    background-repeat: no-repeat;
    background-size: cover;
  }
  &-btn {
    width: 89.8667vw;
    margin-top: 16vw;
    img {
      width: 100%;
      height: auto;
    }
  }
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
