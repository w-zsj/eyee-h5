<template>
  <div class="container">
    <transition name="bounce">
      <img :src="img" class="serve-card" v-if="img" alt="" srcset="" />
    </transition>
    <div style="opacity:0">
      <div ref="serve" v-if="!img" id="serve-card" class="serve-card">
        <div class="heardImg">
          <img :src="heardImg" alt="" srcset="" />
        </div>
        <div class="text-container">
          <div class="text-container-box">
            <span v-for="(item, index) in t2019" :key="index">
              {{ item }}
            </span>
          </div>
          <div class="text-container-box">
            <span v-for="(item, index) in t2020" :key="index">
              {{ item }}
            </span>
          </div>
        </div>
        <img
          v-if="isTest"
          class="qr"
          src="https://files.eyee.com/mcdn/img/fission/qr-test.png"
          alt=""
          srcset=""
        />
        <img
          v-else
          class="qr"
          src="https://files.eyee.com/mcdn/img/fission/qr-z.png"
          alt=""
          srcset=""
        />
        <img
          src="https://files.eyee.com/mcdn/img/fission/save-card.png"
          alt=""
          srcset=""
        />
      </div>
    </div>
    <div class="tip">
      长按可保存至相册
    </div>

    <Loader class="dow" from="14" :showLoadModal="1"></Loader>

    <transition name="mint-indicator">
      <div class="mint-indicator" v-show="visibleLoading">
        <div
          class="mint-indicator-wrapper"
          :style="{ padding: text ? '20px' : '15px' }"
        >
          <Spinner
            class="mint-indicator-spin"
            type="fading-circle"
            :size="32"
          ></Spinner>
          <span class="mint-indicator-text" v-show="text">{{ text }}</span>
        </div>
        <div class="mint-indicator-mask" @touchmove.stop.prevent></div>
      </div>
    </transition>

  </div>
</template>

<script>
let t2019Arr = [
  "囤700",
  "晶洞盖脸",
  "无鞋“不谈”",
  "买就是砍单",
  "犹豫就是起飞",
  "冲就是赔钱",
  "囤就是跌",
  "卖就是涨",
  "线下拳击赛",
  "订单已过期",
  "订单超时取消",
  "PASS没按钮",
  "专属通道已失效",
  "天猫盾盾盾",
  "无法访问奖励",
  "前方通道拥挤",
  "睡就是突袭",
  "我们遇到了问题",
  "守就是不发",
  "柠檬三连",
  "001观看购买权",
  "8k热爱红丝绸",
  "1w升头等舱",
  "3k冲伞兵勇士",
  "3k体验叮当猫",
  "SILK IS GONE"
];

let t2020Arr = [
  "跑道顺滑",
  "告别陪跑",
  "日常三杀",
  "逢抽必中",
  "问就是热爱",
  "屯就是涨",
  "卖就是跌",
  "Got'Emmm",
  "喜提鞋区房",
  "睡就是无事发生",
  "守就是突袭",
  "专属为你而来",
  "订单已生成",
  "XXLB",
  "前去付款",
  "鞋子穿不完",
  "新鞋买买买",
  "SupBro豪华鞋墙",
  "001常客",
  "PASS秒出按钮",
  "卖鞋无瑕疵",
  "买鞋免单",
  "线下必中",
  "1秒预约阿迪",
  "金尊专属礼物",
  "线下排队必提货",
  "原价中中中",
  "生日礼物全是鞋",
  "自穿鞋猛涨",
  "淘宝秒结账"
];

import { html2canvas } from "../../../utils/html2canvas.js";
import Loader from "@/comps/Loader";
import { Spinner } from "mint-ui";

export default {
  components: {
    Loader,
    Spinner
  },
  props: {
    heardImg: ""
  },
  data() {
    function getText(arr) {
      let textArr = [...arr];
      let tempArr = [];
      for (let i = 0; i < 4; i++) {
        let max = textArr.length;
        let num = parseInt(Math.random() * max);
        tempArr.push(textArr.splice(num, 1)[0]);
      }
      return tempArr;
    }
    return {
      t2019: getText(t2019Arr),
      t2020: getText(t2020Arr),
      img: undefined,
      isTest: process.env.NODE_ENV !== "production",
      visibleLoading:false,
      text:"正在计算你的运势..."
    };
  },
  async mounted() {
    await this.loaderImgs();

    this.visibleLoading = true

    setTimeout(()=>{
      this.creatImg();
      this.visibleLoading = false
    },1000)

  },
  methods: {
    creatImg() {
      let serve = this.$refs.serve;

      html2canvas(serve, {
        scale: 2,
        useCORS: true,
        allowTaint: false
      })
        .then(canvas => {
          let dataUrl = canvas.toDataURL("image/jpg");
          console.log("生成图片成功");
          this.img = dataUrl;
        })
        .catch(err => {
          console.error("TCL: mounted -> err", err);
        });
    },
    loaderImgs() {
      return new Promise((resolve, reject) => {
        let imgArr = [
          "https://files.eyee.com/mcdn/img/fission/save-card.png",
          "https://files.eyee.com/mcdn/img/fission/qr-test.png",
          "https://files.eyee.com/mcdn/img/fission/qr-z.png"
        ];
        let tempArr = [];
        imgArr.forEach((item, index) => {
          tempArr[index] = new Image();
          tempArr[index].src = item;
        });
        resolve();
      });
    },
    dataURLtoFile: function(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      });
    }
  }
};
</script>


<style lang="scss" scoped>
@font-face {
  font-family: "SourceHanSansCN-Medium";
  src: url("https://files.eyee.com/mcdn/img/fission/fissionFont1.ttf");
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.serve-card {
  margin-top: 4vw;
  width: 91.7vw;
  height: 125.5vw;
  position: relative;
  img {
    width: 100%;
    height: auto;
  }
  .heardImg {
    position: absolute;
    top: 5.3867vw;
    left: 7.7333vw;
    width: 29.5vw;
    height: 29.5vw;
    border-radius: 50%;
    overflow: hidden;
  }
  .qr {
    position: absolute;
    width: 16.5333vw;
    height: 16.5333vw;
    right: 3.5vw;
    bottom: 3.5vw;
  }
  .text-container {
    position: absolute;
    display: flex;
    font-size: 5.3333vw;
    font-weight: 500;
    font-family: SourceHanSansCN-Medium;
    font-style: italic;
    color: #ffffff;
    top: 61.6vw;
    &-box {
      width: 45.7333vw;
      display: flex;
      flex-direction: column;
      width: 44.2667vw;
      span {
        margin-bottom: 4vw;
        margin-left: 3.7333vw;
      }
    }
  }
}

.tip {
  text-align: center;
  font-size: 19px;
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-style: italic;
  color: #f6e9e9;
  line-height: 30px;
  margin: 18px 0;
}
.dow {
  width: 85.5vw;
  height: 15vw;
  background-image: url("https://files.eyee.com/mcdn/img/fission/to-btn.png?");
  background-repeat: no-repeat;
  background-size: contain;
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


