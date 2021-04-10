<template>
  <div class="load-app">
    <img
      class="half_circle"
      src="/static/imgs/downapp/loadapp_logo2.png"
      alt
      :style="{ height: imgbgheight + 'px', width: '100vw' }"
    />
    <div class="box_one">
      <img class="load_logo" src="/static/imgs/downapp/loadapp_logo3.png" alt />
      <!-- <img class="logo_word" src="/static/imgs/downapp/loadapp_logo.png" alt />
      <img class="little_circle" src="/static/imgs/downapp/loadapp_circle.png" alt /> -->
      <loader
        class="and-ios flex-center"
        :from="from"
        :id="id"
        ref="$loader"
        v-if="$root.ISWX"
      >
        <p class="flex-center">新人领取520红包</p>
      </loader>
      <!-- <p class="load-hint">请前往 {{$root.ISIOS?'AppStore':'应用市场'}} 下载最新版本~</p> -->
      <div class="and-ios flex-center" @click="gotoIos()" v-else>
        <p class="flex-center">新人领取520红包</p>
      </div>
    </div>
    <!-- <div class="red_box">
      <div class="flex-center flex-ctr-end">
        <div class="flex-tops">
          <img class="img_quote" src="/static/imgs/downapp/loadapp_quote3.png" alt />
          <img class="word_neib" src="/static/imgs/downapp/loadapp_word2.png" alt />
        </div>
        <img class="img_quote" src="/static/imgs/downapp/loadapp_quote4.png" alt />
      </div>
      <p class="app_word">发现潮流球鞋穿搭/表达最真实的态度</p>
      <img class="load_img" src="/static/imgs/downapp/loadapp_neib.png" alt />
    </div>
    <div class="box_three">
      <div class="flex-center flex-ctr-end">
        <div class="flex-tops">
          <img class="img_quote" src="/static/imgs/downapp/loadapp_quote.png" alt />
          <img class="word_neib" src="/static/imgs/downapp/loadapp_word3.png" alt />
        </div>
        <img class="img_quote" src="/static/imgs/downapp/loadapp_quote2.png" alt />
      </div>
      <p class="app_word">汇聚全网限量球鞋发售信息/轻松原价入鞋</p>
      <img class="load_img_shadow" src="/static/imgs/downapp/loadapp_pic2.png" alt />
    </div>
    <!-- <div class="red_box">
      <div class="flex-center flex-ctr-end">
        <div class="flex-tops">
          <img class="img_quote" src="/static/imgs/downapp/loadapp_quote3.png" alt />
          <img class="word_neib" src="/static/imgs/downapp/loadapp_word4.png" alt />
        </div>
        <img class="img_quote" src="/static/imgs/downapp/loadapp_quote4.png" alt />
      </div>
      <p class="app_word">多重鉴别，确保正品/海量鞋款任你选购</p>
      <img class="load_img" src="/static/imgs/downapp/loadapp_shoes.png" alt />
    </div>
    <div class="box_three">
      <div class="flex-center flex-ctr-end">
        <div class="flex-tops">
          <img class="img_quote" src="/static/imgs/downapp/loadapp_quote.png" alt />
          <img class="word_neib" src="/static/imgs/downapp/loadapp_word.png" alt />
        </div>
        <img class="img_quote" src="/static/imgs/downapp/loadapp_quote2.png" alt />
      </div>
      <p class="app_word">潮牌定期品牌特卖/精选全球潮流品牌正品</p>
      <img class="load_img_shadow" src="/static/imgs/downapp/loadapp_pic1.png" alt />
    </div>-->
    <div class="footer-box flex-center flex-col" ref="footer">
      <!-- <p class="business_name">上海砸立电子商务有限公司</p> -->
      <p>地址：上海市金山区张堰镇工业区振帆路51号</p>
      <!-- <p>联系电话：021-60298566</p> -->
      <p class="flex-aic">
        <a
          class="flex-aic"
          target="_blank"
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31011602001329"
        >
          <img src="/static/img/biaopc.png" alt="" />
          <span>沪公网安备 31011602001329号</span></a
        >
        | 沪ICP备15055176号-1
      </p>
    </div>
  </div>
</template>
<script>
import Loader from "@/comps/Loader";

export default {
  components: { Loader },
  data() {
    return {
      from: "",
      id: "",
      imgbgheight: document.documentElement.clientHeight - 80,
    };
  },
  mounted() {
    let _ = this,
      {
        query: { _f, _i },
      } = _.$route;
    // console.log("sssssss", _f, _i);
    _.from = _f || "";
    _.id = _i || "";

    if (_f && !isNaN(_f))
      _.$nextTick(() => {
        _.$refs.$loader.$el.click();
      });
    _.imgbgheight =
      document.documentElement.clientHeight - this.$refs.footer.offsetHeight;
    console.log("height", _.imgbgheight);
  },
  methods: {
    gotoIos: function () {
      let { ua, android } = ENV;
      if (ua.ios) {
        window.location = "https://itunes.apple.com/cn/app/id962223967?mt=8";
      } else {
        window.location =
          "https://files.eyee.com/app/donew_official_website.apk";
      }
    },
    gotoAnd: function () {
      window.location.href =
        "https://files.eyee.com/app/donew_official_website.apk";
    },
  },
};
</script>
<style scoped>
.load-hint {
  margin: 14.4vw 0 0;
  color: #ff4150;
  font-weight: 700;
}
img {
  display: block;
  margin: 0 auto;
}
.load-app {
  position: relative;
  min-height: 100vh;
}

.box_one {
  position: absolute;
  left: 50%;
  top: 5.866vw;
  transform: translateX(-50%);
  width: 96vw;
}
.logo_word {
  width: 52.8vw;
}
.little_circle {
  position: absolute;
  width: 5.9vw;
  right: 13.3vw;
  top: 54.7vw;
}
.and-ios {
  width: 66.66vw;
  height: 13.33vw;
  background: url("/static/imgs/downapp/loadapp_btn.png") 0 0 no-repeat;
  background-size: 100% 100%;
  animation: btnanimation 0.5s linear infinite alternate;
  position: absolute;
  left: 50%;
  top: 115.66vw;
  transform: scale(1) translateX(-50%);
  z-index: 9;
  font-size: 4.267vw;
  transform-origin: 0 0;
}
.and-ios > p {
  color: #fff;
  border-radius: 6px;
  font-weight: 600;
}
@keyframes btnanimation {
  0% {
    transform: scale(1) translateX(-50%);
  }
  100% {
    transform: scale(0.8) translateX(-50%);
  }
}

.red_box {
  background-color: #ff4150;
  padding: 12vw 0 0;
}
.app_word {
  font-size: 12pt;
  font-weight: 600;
  color: #ffe3e3;
  line-height: 17px;
  margin-top: 10px;
  text-align: center;
}
.img_quote {
  width: 6.4vw;
}
.word_neib {
  width: 32.3vw;
  margin: 0 10px;
}
.load_img {
  width: 67.7vw;
  margin: 17.6vw auto 0;
}
.load_img_shadow {
  width: 51.7vw;
  margin: 14.9vw auto 0;
  box-shadow: 0px 9px 68px #f9cacd;
}
.box_three {
  padding: 12vw 0 0;
  overflow: hidden;
}
.box_three .app_word {
  color: #fc868d;
}
.footer-box {
  background-color: #ffa000;
  color: #fff;
  min-height: 63px;
  font-size: 12px;
  font-weight: 600;
  line-height: 17px;
  padding: 5.33vw 8vw;
  width: 100%;
}
.footer-box p:nth-child(1) {
  margin-bottom: 6px;
}
.business_name {
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 10px;
}
</style>
