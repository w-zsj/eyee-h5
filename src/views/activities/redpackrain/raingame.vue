<template>
  <div class="red-rain-wrap">
    <div class="time-unit-wrap">
      <div class="time-unit">{{ time }}s</div>
      <div class="num">剩余时间</div>
    </div>
    <div class="red-pack-wrap ticket">
      <div class="red-pack"></div>
      <div class="num">{{ ticket_num || 0 }}个</div>
    </div>
    <div class="red-pack-wrap money">
      <div class="red-pack"></div>
      <div class="num">{{ money_num.toFixed(2) || 0 }}元</div>
    </div>

    <div class="rain-container">
      <template v-for="(item, index) in list">
        <div
          v-if="item.show"
          :style="item.boxStyle"
          :key="index"
          class="redPacket"
        >
          <img
            :style="item.itemStyle"
            @click="handlebomb(index,item.value)"
            v-if="!item.bomb && item.show"
            src="/static/imgs/redpackrain/game/rain_money.png"
            alt=""
            srcset=""
          />

          <transition v-on:after-enter="handleBombEnd(index,item.value)" name="bomb">
            <img
              v-if="item.bomb && item.show"
              src="/static/imgs/redp/bomb.png"
              alt=""
              srcset=""
            />
          </transition>
        </div>
      </template>
    </div>

    <!-- <ul v-if="showRainList">
      <li
        class="red-rain"
        :class="{
          ticket: i == -1 && rainListEnd[index].shown,
          money: i > 0 && rainListEnd[index].shown,
          hidden: rainListEnd[index].hidden
        }"
        v-for="(i, index) in rainList"
        :style="rainListEnd[index].styleText"
        @click.once="rainClickFun(index)"
        :key="index"
      >
        <div class="num" v-if="i > 0 && rainListEnd[index].shown">{{ i }}</div>
        <div class="num" v-if="!rainListEnd[index].shown">￥</div>
      </li>
    </ul> -->
    <ul v-if="showRainList">
      <li
        class="rainLight"
        v-for="(i, index) in lightList"
        :class="{ red: i.k == 0, yellow: i.k == 1 }"
        :style="i.styleText"
        :key="index"
      ></li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "raingame",
  data() {
    return {
      list: [],
      show: true,
      baozao: false,
      time: 30,
      ticket_num: 0,
      money_num: 0,
      rainList: JSON.parse(localStorage.getItem("rainList")),
      rainListEnd: {},
      showRainList: false, //渲染红包雨按钮组件
      timeUnitIntervel: null,
      lightList: []
    };
  },
  mounted() {
    let _ = this;
    if (!this.rainList) {
      console.error("没有阅读到数组")
      // this.rainList = [0,0.07,0.05,0.06,0.05,0.01,0.03,0.04,0.05,0.19,0.02,0.04,0.04,0.21,0.08,0.06,0.03,0.08,0.08,0.07,0.05,0.03,0.17,0.16,0.11,0.09,0.09,0.07,0.06,0.04,0.03,0.07,0.1,0.07,0,0.15,0.26,0.02,0.03,0.01,0,0.01,0.16,-1,0.04,0,0.11,0,0.03,0.04,0.07,0,0.05,0.08,0.11,0.11,0.15,0.03,0.08,0,0.18,0.1,0.09,0.05,0,0.11,0.02,0.08,-1,0]
      return;
    }
    this.redPageList();
    // _.rainList.forEach((i, s) => {
    //   _.rainListEnd[s] = new Object();
    //   _.rainListEnd[s].shown = false;
    //   _.rainListEnd[s].hidden = false;
    //   _.rainListEnd[s].val = i;
    //   _.rainListEnd[s].left = Math.random() * 100 + "%";
    //   _.rainListEnd[s].top = -1 * Math.random() * 150 + "%";
    //   _.rainListEnd[s].delay = Math.random() * 38 + "s"; //动画延迟时间
    //   _.rainListEnd[s].duration = Math.random() * 4 + 8 + "s"; //动画进行时间
    //   _.rainListEnd[s].scale = 1 - Math.random() * 0.3;
    //   _.rainListEnd[s].styleText = {
    //     animationDelay: _.rainListEnd[s].delay,
    //     webkitAnimationDelay: _.rainListEnd[s].delay,
    //     animationDuration: _.rainListEnd[s].duration,
    //     webkitAnimationDuration: _.rainListEnd[s].duration,
    //     marginLeft: _.rainListEnd[s].left,
    //     marginTop: _.rainListEnd[s].top,
    //     transform:
    //       "rotate(21.5deg) translateX(50vw) translateY(-60vw) scale(" +
    //       _.rainListEnd[s].scale +
    //       ")",
    //     webkitTransform:
    //       "rotate(21.5deg) translateX(50vw) translateY(-60vw) scale(" +
    //       _.rainListEnd[s].scale +
    //       ")"
    //   };
    // });

    //光线
    for (let i = 0; i < 100; i++) {
      _.lightList.push({
        i: i,
        k: parseInt(Math.random() * 2),
        styleText: {
          transform:
            "rotate(21.5deg) translateX(50vw) translateY(-60vw) scale(" +
            (1 - Math.random() * 0.7) +
            ")",
          webkitTransform:
            "rotate(21.5deg) translateX(50vw) translateY(-60vw) scale(" +
            (1 - Math.random() * 0.7) +
            ")",
          marginLeft: Math.random() * 100 + "%",
          marginTop: -1 * Math.random() * 100 + "%",
          animationDelay: Math.random() * 38 + "s",
          webkitAnimationDelay: Math.random() * 38 + "s",
          animationDuration: Math.random() * 2 + 5 + "s",
          webkitAnimationDuration: Math.random() * 2 + 5 + "s"
        }
      });
    }
    console.log(_.lightList);
    _.showRainList = true;
    _.timeUnitFun();
  },
  methods: {
    handlebomb(index,value) {
      this.list[index].bomb = true;
    },
    handleBombEnd(index,value) {
      this.list[index].show = false;
      this.numCount(value)
    },
    redPageList() {
      let maxW =
        document.documentElement.clientWidth || document.body.clientWidth;

      let tempList = [];

      this.rainList.forEach((item, index) => {
        let rotate = parseInt(Math.random() * (45 - -45) - 45) + "deg"; // 旋转角度
        let durTime = parseInt(Math.random() * 30); //延迟时间
        let scales = (Math.random() * (12 - 8 + 1) + 8) * 0.1; // 图片尺寸

        let itemObj = {
          value: item,
          bomb: false,
          show: true,
          boxStyle: {
            left: parseInt(Math.random() * (maxW - 50) + 0) + "px",
            top: -parseInt(Math.random() * 50+ 100) + "px",
            animationDelay: `${durTime}s`
            // animationDuration:`3s`
          },
          itemStyle: {
            transform: `rotate(${rotate}) scale(${scales})`
          }
        };
        tempList.push(itemObj);
      });

      console.log("TCL: redPageList -> tempList", tempList);
      this.list = tempList;
    },
    timeUnitFun() {
      let _ = this;
      if (_.timeUnitIntervel) clearInterval(_.timeUnitIntervel);
      _.timeUnitIntervel = setInterval(() => {
        _.time--;
        //console.log(_.time);
        if (_.time <= 0) {
          clearInterval(_.timeUnitIntervel);
          //游戏结束
          let gameOverParams = [_.money_num, _.ticket_num];
          localStorage.setItem("rainList", JSON.stringify(gameOverParams));
          _.$router.replace("/raingameover");
        }
        _.$forceUpdate();
      }, 1000);
    },
    numCount(value) {
      if (value == -1) {
        this.ticket_num++;
      } else if (value > 0) {
        this.money_num += parseFloat(value);
      }
    },
    rainClickFun(index) {
      let _ = this;
      var _k = _.rainListEnd[index].val;
      console.log(_k, index, "~~~~");
      if (_k == 0) {
        _.rainListEnd[index].hidden = true;
      } else {
        _.rainListEnd[index].shown = true;
        setTimeout(function() {
          _.rainListEnd[index].hidden = true;
          _.$forceUpdate();
        }, 300);
      }
      if (_k == -1) {
        _.ticket_num++;
      } else if (_k > 0) {
        _.money_num += parseFloat(_k);
      }
    }
  }
};
</script>

<style scoped>
.red-rain-wrap {
  width: 100vw;
  height: 100%;
  position: fixed;
  background: url("/static/imgs/redpackrain/game.png") no-repeat center 0;
  background-repeat: repeat-y;
  background-size: 100vw 178.27vw;
  overflow: hidden;
}
.red-rain-wrap .time-unit-wrap {
  width: 17.33vw /* 130/7.5 */;
  height: auto;
  float: left;
  padding-top: 9.47vw /* 71/7.5 */;
  margin-left: 7.6vw /* 57/7.5 */;
}
.red-rain-wrap .time-unit-wrap .time-unit {
  width: 15.07vw /* 113/7.5 */;
  height: 15.07vw /* 113/7.5 */;
  background: #f83548;
  border-radius: 7.53vw /* 56.5/7.5 */;
  margin: 0 auto;
  color: #fff4b5;
  font-size: 6.4vw /* 48/7.5 */;
  line-height: 15.07vw /* 113/7.5 */;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.2vw /* 9/7.5 */;
  box-shadow: 0 0 2.67vw /* 20/7.5 */ 2.67vw /* 20/7.5 */ rgba(255, 54, 74, 0.2);
}
.red-rain-wrap .num {
  font-size: 4vw /* 30/7.5 */;
  line-height: 4vw /* 30/7.5 */;
  width: 100%;
  text-align: center;
  color: #fff4b5;
}
.red-rain-wrap .red-pack-wrap {
  width: 17.73vw /* 133/7.5 */;
  height: auto;
  float: right;
  padding-top: 10.67vw /* 80/7.5 */;
}
.red-rain-wrap .red-pack-wrap .red-pack {
  width: 10.27vw /* 77/7.5 */;
  height: 13.07vw /* 98/7.5 */;
  margin: 0 auto 2.67vw /* 20/7.5 */ auto;
}
.red-rain-wrap .red-pack-wrap.money .red-pack {
  background: url("/static/imgs/redpackrain/game/red_$_03.png") no-repeat center
    center;
  background-size: 100%;
}
.red-rain-wrap .red-pack-wrap.ticket {
  margin-right: 5.87vw /* 44/7.5 */;
}
.red-rain-wrap .red-pack-wrap.ticket .red-pack {
  background: url("/static/imgs/redpackrain/game/red_ticket_03.png") no-repeat
    center center;
  background-size: 100%;
}

.red-rain-wrap .red-rain.money {
  background: url("/static/imgs/redpackrain/game/rain_money.png") no-repeat
    center center;
  background-size: 100%;
  position: absolute;
}
.red-rain-wrap .red-rain.ticket {
  background: url("/static/imgs/redpackrain/game/rain_ticket.png") no-repeat
    center center;
  background-size: 100%;
  position: absolute;
}
.red-rain-wrap .red-rain {
  background: url("/static/imgs/redpackrain/game/rain_money.png") no-repeat
    center center;
  background-size: 100%;
  position: absolute;
  width: 18.13vw /* 136/7.5 */;
  height: 32.27vw /* 242/7.5 */;
  left: 0;
  top: 0;
  opacity: 1;
  transition: opacity 0.2s;
  -webkit-transition: opacity 0.1s;
  transform: rotate(21.5deg) translateX(50vw) translateY(-60vw);
  -webkit-transform: rotate(21.5deg) translateX(50vw) translateY(-60vw);
  animation: redRain 3s ease-in-out 0s forwards;
  -webkit-animation: redRain 3s ease-in-out 0s forwards;
}
.red-rain-wrap .red-rain.hidden {
  opacity: 0 !important;
}
.red-rain-wrap .red-rain .num {
  width: 100%;
  color: #fff4b5;
  text-align: center;
  font-size: 6.67vw /* 50/7.5 */;
  line-height: 6.67vw /* 50/7.5 */;
  font-weight: bolder;
  padding-top: 17.33vw /* 130/7.5 */;
}

.red-rain-wrap .rainLight.red {
  position: absolute;
  width: 1.07vw /* 8/7.5 */;
  height: 23.87vw /* 179/7.5 */;
  background: url("/static/imgs/redpackrain/game/light_red_03.png") no-repeat
    center center;
  background-size: 100%;
  opacity: 1;
  left: 0;
  top: 0;
  transition: opacity 0.2s;
  -webkit-transition: opacity 0.1s;
  transform: rotate(21.5deg) translateX(50vw) translateY(-30vw);
  -webkit-transform: rotate(21.5deg) translateX(50vw) translateY(-30vw);
  animation: redRain 3s ease-in-out 0s forwards;
  -webkit-animation: redRain 3s ease-in-out 0s forwards;
}
.red-rain-wrap .rainLight.yellow {
  position: absolute;
  width: 2vw /* 15/7.5 */;
  height: 26.27vw /* 197/7.5 */;
  background: url("/static/imgs/redpackrain/game/light_yellow_03.png") no-repeat
    center center;
  background-size: 100%;
  opacity: 1;
  left: 0;
  top: 0;
  transition: opacity 0.2s;
  -webkit-transition: opacity 0.1s;
  transform: rotate(21.5deg) translateX(50vw) translateY(-30vw);
  -webkit-transform: rotate(21.5deg) translateX(50vw) translateY(-30vw);
  animation: redRain 3s ease-in-out 0s forwards;
  -webkit-animation: redRain 3s ease-in-out 0s forwards;
}
@keyframes redRain {
  from {
    top: 0;
    left: 0;
    /*transform: translateX(0) translateY(0) rotate(21.5deg);*/
  }
  to {
    left: -200vw;
    top: 507.7296vw;
    /*transform: translateX(-200vw) translateY() rotate(21.5deg);*/
  }
}
</style>

<style lang="scss" scoped>
.rain-container {
  width: 100vw;
  height: 100vh;
  // background: #ffffff;
  position: relative;
  overflow: hidden;
}

.redPacket {
  position: absolute;
  width: 10.27vw;
  height: 13.07vw;
  top: -100px;
  animation: aim_move 4s linear 1 forwards;
  img {
    width: 100%;
    height: auto;
  }
}

@keyframes aim_move {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(120vh);
  }
}

.bomb-enter-active {
  animation: bounce-in 0.3s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0) rotate(0deg);
  }
  100% {
    transform: scale(1.5) rotate(180deg);
  }
}
</style>
