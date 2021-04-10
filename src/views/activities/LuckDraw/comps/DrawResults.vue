<template>
  <transition name="opacity">
    <div class="modalWarapper flex flex-center" v-if="visible">
      <transition name="animate">
        <div class="wrapper" :class="{'bg1': type == 1, 'bg2': type == 2, 'bg3': type == 1 && theme == 'onebuy', 'bg4': type == 2 && theme == 'onebuy'}">
          <span class="close" :class="btnState.close?'close-act': ''" @touchstart="btnState.close = true" @touchend="btnState.close = false" @click="toggle"></span>
          <div class="img-wraper" :class="[`img-wraper-${theme}`]">
            <div class="img-wraper-content">
              <div class="img-item flex flex-center" :class="['SSR', 'LAST赏'].includes(picUrl.goodslevel)?'bigreward':theme == 'onebuy'? 'normal-onebuy': 'normal'">
                <img :src="picUrl.image" class="img">
                <p class="img-item-level">{{picUrl.goodslevel}}</p>
              </div>
            </div>
          </div>
          <div class="resultList flex flex-wrap" v-if="type == 2">
            <div v-for="(item, index) in rewardInfo" :key="'resultList' + index" class="flex-center">
              <div class="resultList-item" :class="[`resultList-item-${theme}`]" @click="viewPic(item, index)">
                <div class="resultList-item-content flex flex-center">
                  <div class="content-item" :class="[['SSR', 'LAST赏'].includes(item.goodslevel)?'bigreward':theme == 'onebuy'? 'normal-onebuy': 'normal', currentIndex == index?'content-item-act':'']">
                    <div class="content-item-img">
                      <img :src="item.image" class="resultList-item-img">
                    </div>
                    <p class="content-item-level">{{item.goodslevel}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="btngroup-wrapper flex flex-center" :class="`btngroup-wrapper-${type}`" v-if="Object.keys(rewardInfo).length">
            <div v-if="type == 1" class="one flex flex-center" :class="{'one-act':btnState.drawone,'advEnter':advEnter}" @touchstart="btnState.drawone = true" @touchend="btnState.drawone = false" @click="drawAgain"></div>
            <div v-if="type == 2 && theme != 'onebuy'" class="onemore flex flex-center" :class="{'onemore-act':btnState.drawfive,'advEnter':advEnter}" @touchstart="btnState.drawfive = true" @touchend="btnState.drawfive = false" @click="drawAgain"></div>
          </div>
        </div>
      </transition>

    </div>
  </transition>
</template>

<script>
export default {
  name: "DrawResults",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Number,
      default: 2,
    },
    rewardInfo: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
    theme: {
      type: String,
      default: "",
    },
    advEnter: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    rewardInfo(val) {
      if (val.length) {
        this.picUrl = val[0];
      }
    },
  },
  data() {
    return {
      currentIndex: 0,
      picUrl: {},
      btnState: {
        close: false,
        drawone: false,
        drawfive: false,
      },
    };
  },
  methods: {
    toggle() {
      this.$emit("toggle");
    },
    toRoute(path) {
      this.$router.push(path);
    },
    viewPic(item, index) {
      this.picUrl = item;
      this.currentIndex = index;
    },
    drawAgain() {
      this.$emit("toggle", this.type);
    },
  },
};
</script>

<style scoped>
.modalWarapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
}

.opacity-enter {
  /* transform: translateX(100%); */
  opacity: 0;
}
.opacity-enter-active {
  transition: all 0.5s ease;
}
.opacity-leave {
  opacity: 1;
}
.opacity-leave-active {
  opacity: 0;
  transition: all 0.5s ease;
}

.animate-enter {
  /* transform: translateX(100%); */
  transform: scale(0);
  opacity: 0;
}
.animate-enter-active {
  transition: all 0.5s ease;
}
.animate-leave {
  opacity: 1;
  /* transform: translateX(0); */
  transform: scale(1);
}
.animate-leave-active {
  opacity: 0;
  /* transform: translateX(100%); */
  transform: scale(0);
  transition: all 0.5s ease;
}
.wrapper {
  width: 83.2vw;
  padding-top: 22.93vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.bg1 {
  height: 99.2vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/30.png") no-repeat;
  background-size: contain;
}

.bg2 {
  height: 122.13vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/28.png") no-repeat;
  background-size: contain;
}

.bg3 {
  height: 99.2vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/15.png")
    no-repeat;
  background-size: contain;
}

.bg4 {
  height: 124vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/v23/14.png")
    no-repeat;
  background-size: contain;
}

.img-wraper {
  width: 48vw;
  height: 50.13vw;
  border: 2px solid #000000;
  box-sizing: border-box;
  border-radius: 20px;
}

.img-wraper-lego,
.img-wraper-other,
.img-wraper-girl {
  background: #2167cf;
}

.img-wraper-onebuy {
  background: #815c6b;
}

.img-wraper-content {
  width: 100%;
  height: 46.93vw;
  background: #ffffff;
  border-radius: 18px;
  padding: 1.6vw;
}

.img-item {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  position: relative;
  overflow: hidden;
}

.img-item:after {
  content: "";
  display: inline-block;
  width: 100%;
  height: 100%;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/26.png") no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
.bigreward {
  background-color: #ffeb32;
}

.normal-onebuy {
  background-color: #f6ddd2;
}
.normal {
  background-color: #7de6f5;
}

.img-item-level {
  width: 100%;
  height: 5.87vw;
  line-height: 5.87vw;
  font-size: 4.27vw;
  background-color: #000;
  color: #fff;
  border-radius: 0 0 14px 14px;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
  font-weight: 600;
}

.img {
  width: 57.333vw;
  height: auto;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.title {
  margin-top: 4vw;
  font-size: 3.73vw;
  font-weight: 600;
  color: #ffffff;
}

.titleMar {
  margin-top: 3.2vw;
}

.resultList {
  margin-top: 2.67vw;
  width: 73.6vw;
  padding: 0 2.13vw;
}

.btngroup-wrapper-2 {
  width: 100%;
  padding-top: 1.6vw;
}

.btngroup-wrapper-1 {
  width: 100%;
  padding-top: 3.2vw;
}

.btnMarTop1 {
  margin-top: 4vw;
}

.btnMarTop2 {
  margin-top: 5.33vw;
}

.cancel {
  width: 26.67vw;
  height: 100%;
  background: linear-gradient(
    180deg,
    #a99b96,
    #171717 6%,
    #000000 95%,
    #171717
  );
  border-radius: 8px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.54);

  font-size: 4.533vw;
  font-weight: 600;
  color: #f8de9a;
  text-shadow: 0px 0px 5px 0px #805e23;
}

.one {
  width: 47.2vw;
  height: 16.53vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/29-1.png")
    no-repeat;
  background-size: contain;
}
.one.advEnter,
.onemore.advEnter {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/adv_lot.png")
    no-repeat;
  background-size: cover;
}

.one-act {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/29-2.png")
    no-repeat;
  background-size: cover;
}
.one-act.advEnter,
.onemore-act.advEnter {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/adv_lot_act.png")
    no-repeat;
  background-size: cover;
}

.onemore {
  width: 47.2vw;
  height: 16.53vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/27-1.png")
    no-repeat;
  background-size: contain;
}

.onemore-act {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/27-2.png")
    no-repeat;
  background-size: cover;
}

.resultList-item {
  width: 13.33vw;
  height: 20.27vw;
  box-sizing: border-box;
  border: 0.53vw solid #000000;
  border-radius: 3.2vw;
  position: relative;
  margin-bottom: 1.6vw;
  margin-left: 0.27vw;
  margin-right: 0.27vw;
}

.resultList-item-lego,
.resultList-item-gitl,
.resultList-item-other {
  background: #2167cf;
}

.resultList-item-onebuy {
  background: #815c6b;
}

.resultList-item-act {
  background: linear-gradient(180deg, #efcda8, #f29d3d);
}

.resultList-item-content {
  width: 100%;
  height: 17.6vw;
  background: #ffffff;
  mix-blend-mode: normal;
  border-radius: 10px;
  overflow: hidden;
  padding: 0.8vw;
}

.content-item {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.content-item-img {
  position: absolute;
  top: 0;
  left: -25%;
  width: 16vw;
  height: 16vw;
}

.content-item-act::after {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgba(255, 70, 70, 0) 0%,
    rgba(255, 70, 70, 0.7) 100%
  );
  mix-blend-mode: normal;
  border-radius: 8px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.content-item-level {
  width: 100%;
  height: 4.53vw;
  line-height: 4.53vw;
  text-align: center;
  background-color: #000;
  color: #fff;
  border-radius: 0 0 8px 8px;
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 3.2vw;
  z-index: 1;
  font-weight: bold;
}

.resultList-item-content-act {
  width: 20.267vw;
  height: 20.267vw;
}

.resultList-item-img {
  width: 16vw;
  height: 16vw;
}
.close {
  width: 10.67vw;
  height: 10.67vw;
  background: url("https://files.eyee.com/eyeeh5/img/lottery/25-1.png")
    no-repeat;
  background-size: contain;
  position: absolute;
  top: 2px;
  right: 3px;
}
.close-act {
  background: url("https://files.eyee.com/eyeeh5/img/lottery/25-2.png")
    no-repeat;
  background-size: cover;
}
</style>