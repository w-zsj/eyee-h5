<template>
  <div class="lottery-result">
    <div class="flex-center lr-draw-layer">
      <!-- <div class="lr-avatars flex-wrap">
        <template v-for="(ai, aIdx) in imgs">
          <img :src="ai" alt :key="'avatar'+aIdx">
        </template>
      </div>-->
      <div class="lr-qrcode">
        <img src="https://files.eyee.com/activity/cspc-result/qrcode.png" alt>
        <img src="https://files.eyee.com/activity/cspc-result/qrcode-tip.png" alt>
      </div>
      <div class="lr-draw">
        <img src="https://files.eyee.com/activity/cspc-result/choujiangji.png" alt>

        <div>
          <div class="sec-box lr-bubble">
            <img src="https://files.eyee.com/activity/cspc-result/duihuakuang2.png" alt>
            <p class="flex-center">当前参与用户数:</p>
          </div>
          <div class="sec-box lr-bubble">
            <img src="https://files.eyee.com/activity/cspc-result/duihaukuan1.png" alt>
            <p class="flex-center">距离开奖还有:</p>
          </div>
        </div>

        <div>
          <div class="sec-box lr-led">
            <img src="https://files.eyee.com/activity/cspc-result/LED.png" alt>
            <p class="flex-center ft-px">{{userCount|currency}}</p>
          </div>
          <div class="sec-box lr-led">
            <img src="https://files.eyee.com/activity/cspc-result/LED.png" alt>
            <p class="flex-center ft-px">{{cd}}</p>
          </div>
        </div>

        <div class="flex-center lr-main">
          <img src="https://files.eyee.com/activity/cspc-result/jiantouyou.png" alt>
          <div>
            <img src="https://files.eyee.com/activity/cspc-result/chupiaokou.png" alt>
            <div class="lr-info">
              <ul class="flex-center">
                <li
                  class="flex-center lr-num"
                  :class="{fix:ni=='*'}"
                  v-for="(ni, nIdx) in nums"
                  :key="'num'+nIdx"
                  :num="ni"
                ></li>
              </ul>
            </div>
            <div class="sec-box lr-lucky" :class="{act:drawed}" @click="showItems">
              <img src="https://files.eyee.com/activity/cspc-result/zhi.png" alt>
              <p class="flex-col flex-center">
                <span>中奖用户ID:</span>
                <span>{{lucky.username}}</span>
              </p>
            </div>
          </div>
          <img src="https://files.eyee.com/activity/cspc-result/jiantouzuo.png" alt>
        </div>
        <div class="lr-modal" :class="{act:showModal}" @click="closeModal">
          <div @click.stop>
            <div class="lr-user">
              <p>恭喜中奖:</p>
              <img :src="lucky.imgurl" alt>
              <p>{{lucky.username}}</p>
              <p>{{lucky.mobile}}</p>
            </div>
            <p class="lr-gap">
              <span>购物车清单:</span>
              <br>
              <span class="font-price">总计: ¥{{total|currency}}</span>
            </p>
            <div class="flex-wrap flex-around lr-items">
              <template v-for="(pi, pIdx) in items">
                <div :key="'items'+pIdx">
                  <img :src="pi.colorimg||pi.mainpic" alt>
                  <p class="font-price">¥{{dealPrice(pi.saleprice,pi.specialprice)}}</p>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="sec-box lr-drawbtn">
          <img src="https://files.eyee.com/activity/cspc-result/button.png" alt>
          <p class="flex-center" @click="toggleDraw">{{drawing?'开奖':'开始抽奖'}}</p>
        </div>

        <div class="sec-box lr-slogan">
          <img src="https://files.eyee.com/activity/cspc-result/slogan.png" alt>
        </div>
      </div>
      <div class="lr-qrcode">
        <img src="https://files.eyee.com/activity/cspc-result/qrcode.png" alt>
        <img src="https://files.eyee.com/activity/cspc-result/qrcode-tip.png" alt>
      </div>
    </div>
  </div>
</template>
<script>
import {
  GetJoinedUser,
  GetLotteryResult,
  GetLotteryInfo
} from "@/utils/api/activities";

import { DateDiff } from "@/common/util";

const shakeInterval = 20;
var interval = null;

export default {
  name: "LotteryResult",
  data() {
    return {
      drawing: false,

      userCount: 9999999,

      drawTime: "",
      cd: "23:59:59",

      imgs: [],
      mobiles: [],
      shakeIdx: 0,

      lucky: {},
      showModal: false,
      items: [],

      nums: ["D", "o", "*", "N", "e", "w", "*", "!"] // ["*", "*", "*", "*", "*", "*", "*", "*"]
    };
  },
  computed: {
    drawed() {
      return !!(this.lucky && this.lucky.username);
    },
    total() {
      let _ = this,
        { items } = _,
        total = 0;
      items.forEach(i => {
        total += _.dealPrice(i.saleprice, i.specialprice) * i.count;
      });
      return total;
    }
  },
  beforeMount() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      let _ = this,
        imgs = [],
        mobiles = [];
      GetJoinedUser()
        .then(res => {
          console.log("GetJoinedUser res: ", res);
          if (res) {
            _.userCount = res.usercount;
            _.drawTime = res.drawtime;

            res.userList.forEach(i => {
              imgs.push(i.imgurl);

              mobiles.push(_.getMobileSplit(i.mobile));
            });

            _.imgs = imgs;
            _.mobiles = mobiles;
            _.shakeIdx = mobiles.length - 1;

            _.countdown();
          }
        })
        .catch(e => {
          console.error("GetJoinedUser error: ", e);
        });
    },
    getLucky(userid) {
      let _ = this;
      GetLotteryInfo(userid)
        .then(res => {
          console.log("GetLotteryInfo res: ", res);
          _.lucky = res.drawuser;
          _.stopShake(_.getMobileSplit(res.drawuser.mobile));

          _.items = res.productItems;
        })
        .catch(e => {
          console.error("GetLotteryInfo error: ", e);
        });
    },
    drawLottery() {
      let _ = this;
      GetLotteryResult()
        .then(res => {
          console.log("GetLotteryResult res: ", res);
          if (res) {
            _.getLucky(res);
          }
        })
        .catch(e => {
          console.error("GetLotteryResult error: ", e);
        });
    },
    getMobileSplit(mobile) {
      let temp = mobile.indexOf("-") > -1 ? mobile.split("-")[1] : mobile;
      temp = temp.replace(/\*+/, "*");
      return temp.split("");
    },
    toggleDraw() {
      let _ = this,
        { drawing, cd } = _;

      if (drawing) {
        _.drawLottery();
        _.drawing = false;
      } else {
        // if (cd !== "00:00:00") {
        //   _.toast("还未到开奖时间~");
        //   return;
        // }

        _.lucky = {};

        _.drawing = true;
        _.shakeNum();
      }
    },
    showItems() {
      let _ = this,
        { drawed } = _;
      if (drawed) _.showModal = true;
    },
    closeModal() {
      let _ = this;
      _.showModal = false;
    },
    shakeNum() {
      let _ = this,
        { mobiles, shakeIdx, drawed } = _;

      interval = setTimeout(() => {
        _.nums = mobiles[shakeIdx];

        shakeIdx--;
        _.shakeIdx = shakeIdx < 0 ? mobiles.length - 1 : shakeIdx;

        _.shakeNum();
      }, shakeInterval);
    },
    stopShake(nums) {
      if (interval) clearTimeout(interval);

      this.nums = nums;
    },
    countdown() {
      let _ = this,
        { drawTime } = _;

      let diff = DateDiff({ destination: drawTime });

      if (diff) {
        _.cd = `${diff.H < 10 && diff.H >= 0 ? "0" : ""}${diff.H}:${
          diff.m < 10 ? "0" : ""
        }${diff.m}:${diff.s < 10 ? "0" : ""}${diff.s}`;

        if (diff.H == 0 && diff.m == 0 && diff.s == 0) return;
        else if (diff.H >= 0 && diff.m >= 0 && diff.s >= 0)
          setTimeout(() => {
            _.countdown();
          }, 1000);
        else _.cd = "00:00:00";
      }
    },
    dealPrice(sale, special) {
      return special > 0 && special != sale ? special : sale;
    }
  },
  filters: {
    currency(val) {
      if (val && val != null) {
        let suffix = "";
        // if (val > 100000) {
        //   suffix = "w";
        //   val = Number((val / 10000).toFixed(2));
        // }

        val = String(val);
        var left = val.split(".")[0],
          right = val.split(".")[1];
        right = right ? "." + right.substr(0, 2) : "";
        var temp = left
          .split("")
          .reverse()
          .join("")
          .match(/(\d{1,3})/g);
        return (
          (Number(val) < 0 ? "-" : "") +
          temp
            .join(",")
            .split("")
            .reverse()
            .join("") +
          right +
          suffix
        );
      } else if (val === 0) return "0";
      else return "";
    }
  }
};
</script>
<style scoped>
/* https://files.eyee.com/activity/cspc-result/ */
@font-face {
  font-family: PIXEL;
  src: url("https://files.eyee.com/activity/cspc-result/LLPIXEL.TTF");
}

@font-face {
  font-family: HEICUTI;
  src: url("https://files.eyee.com/activity/cspc-result/OswaldBold.ttf");
}

@font-face {
  font-family: YAHEI;
  src: url("https://files.eyee.com/activity/cspc-result/msyh.ttc");
}

.ft-px {
  font-family: PIXEL;
}

.ft-bd {
  font-family: HEICUTI;
}

.lottery-result {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: url("https://files.eyee.com/activity/cspc-result/bg.png")
    no-repeat;
  background-size: 100% auto;
  background-position: center center;
}

.lottery-result img {
  display: block;
}

.lr-draw-layer {
  width: 100%;
  height: 100%;
}

.lr-avatars {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: flex-start;
}

.lr-qrcode {
  width: 17.23%;
}

.lr-qrcode img:last-of-type {
  margin-top: 18px;
  animation: blink 1.2s ease-out infinite;
}

.lr-draw {
  position: relative;
  width: 52.13%;
  margin: 0 3%;
}

.sec-box {
  position: absolute;
}
.sec-box > p {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.lr-bubble {
  width: 32.27%;
  top: 20.27%;
  animation: shake ease infinite;
}
.lr-bubble:first-of-type {
  left: -4.7%;
  animation-duration: 2.5s;
}
.lr-bubble:last-of-type {
  right: -4.7%;
  animation-duration: 2.1s;
}
.lr-bubble p {
  height: 70%;
  color: #b14329;
  font-size: 1.875vw;
  font-family: YAHEI;
}

.lr-led {
  width: 34.07%;
  top: 33.4%;
}
.lr-led:first-of-type {
  left: 8.19%;
}
.lr-led:last-of-type {
  right: 8.19%;
}
.lr-led p {
  padding-bottom: 3%;
  font-size: 2.5vw;
  color: #f6d11f;
  animation: txt-blink 1s ease infinite;
}

.lr-main {
  position: absolute;
  top: 44.81%;
  z-index: 19;
}
.lr-main > img {
  width: 10.89%;
}
.lr-main > div {
  position: relative;
  width: 63.34%;
  margin-left: 1.3%;
}
.lr-info {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 58%;
}
.lr-info ul {
  padding: 3.28% 2.47%;
}
.lr-info li {
  position: relative;
  width: 10%;
  margin-right: 2.3%;
  color: #fff;
  font-size: 4.09vw;
  height: 5.62vw;
}
.lr-num::before {
  content: attr(num);
  font-family: HEICUTI;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.lr-num.fix::before {
  top: 70%;
}
.lr-num::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 5%;
  width: 90%;
  border-bottom: 2px solid #080c0d;
}

.lr-lucky {
  top: 73.05%;
  left: 18.86%;
  width: 62.46%;
  overflow: hidden;
  transition: 0.01s linear 0.6s;
}
.lr-lucky.act {
  top: 67.05%;
  cursor: pointer;
}
.lr-lucky img {
  transform: translateY(-70%);
  transition: transform 0.6s cubic-bezier(0.895, 0.03, 0.685, 0.22);
}
.lr-lucky.act img {
  transform: translateY(0);
}
.lr-lucky p {
  font-size: 2.6vw;
  font-family: YAHEI;
  padding-bottom: 5%;
  opacity: 0;
}
.lr-lucky.act p {
  opacity: 1;
  transition: 0.3s ease-in 0.8s;
}

.lr-drawbtn {
  left: 69.03%;
  top: 71.64%;
  width: 26.47%;
  cursor: pointer;
  transition: all 0.3s ease;
}
.lr-drawbtn p {
  font-size: 2vw;
  color: #fff;
  font-weight: 600;
  font-family: YAHEI;
}
.lr-drawbtn:hover {
  transform: scale(0.98);
}
.lr-drawbtn:active {
  transform: scale(0.95);
}
.lr-drawbtn:hover p {
  text-shadow: 0 0 20px rgba(234, 122, 0.55);
}

.lr-slogan {
  left: 3.3%;
  top: 83.89%;
  width: 31.87%;
}

.lr-modal {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.lr-modal.act {
  opacity: 1;
  pointer-events: all;
}
.lr-modal > div {
  width: 40%;
  height: 100%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.9);
  overflow-y: scroll;
  opacity: 0;
  transition: opacity 0.3s ease-in 0.3s;
}
.lr-modal.act > div {
  opacity: 1;
}
.lr-user {
  padding: 10% 5% 3%;
  text-align: center;
  border-bottom: 2px dashed #ccc;
}
.lr-user img {
  width: 26%;
  margin: 10px auto;
  border-radius: 50%;
}
.lr-user p {
  font-size: 3vw;
  line-height: 1.5;
  font-weight: 600;
  font-family: YAHEI;
}
.lr-user p:first-of-type {
  font-size: 3.6vw;
  color: #b14329;
  font-weight: 800;
}

.lr-gap {
  text-align: center;
  font-size: 2.2vw;
  line-height: 2;
  margin-top: 3%;
  letter-spacing: 1px;
  font-family: YAHEI;
}
.lr-gap span:last-of-type {
  color: #b14329;
}

.lr-items {
  padding: 3%;
}
.lr-items > div {
  width: 30%;
  margin-bottom: 5%;
  border-radius: 5px;
  background: #fff;
  overflow: hidden;
}
.lr-items p {
  text-align: center;
  font-size: 2vw;
  color: #b14329;
  line-height: 1.8;
}

/* animations */
@keyframes shake {
  20% {
    transform: translate(2%, 1%);
  }
  50% {
    transform: translate(1%, -2%);
  }
  70% {
    transform: translate(2%, -1%);
  }
}

@keyframes blink {
  60% {
    opacity: 0.78;
  }
}

@keyframes txt-blink {
  30% {
    text-shadow: 0 0 22px rgba(234, 122, 0.55);
  }
  70% {
    text-shadow: 0 0 22px rgba(234, 122, 0.55);
  }
}
</style>
