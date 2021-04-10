<template>
  <div class="guide-modal" :class="{act:show,loged:loged,dft:!loged}" v-if="!closed">
    <div class="guide-main">
      <template v-if="loged">
        <p class="title">很高兴你来！</p>
        <p class="desc">
          {{gift||'新人大礼包'}}已放置您的账户
          <br />送你一张球鞋体验券，卖出收益全归你！
        </p>
        <div class="info">
          <img v-lazy="'https://files.eyee.com/activity/guide-bg.png'" alt />
          <div>
            <div class="img">
              <img v-lazy="config.image" alt />
              <span>体验券</span>
            </div>
            <div class="msg">
              <p class="subtitle">最新价格</p>
              <p class="price font-price">¥{{config.lastprice}}</p>
              <p class="hint">发放后{{config.indate||3}}天内售出有效</p>
            </div>
          </div>
        </div>
        <div class="opts">
          <button class="btn-load" @click="handle(3)">出售赚收益</button>
          <button class="link" @click="handle(1)">去完善信息</button>
          <button class="link" @click="handle(2)">先逛逛</button>
        </div>
      </template>
      <template v-else-if="bg">
        <img v-lazy="bg" alt />
        <div class="opts">
          <button class="btn-get" @click="goLogin">立即领取</button>
        </div>
        <i class="ico-close" @click.stop="close"></i>
      </template>
    </div>
  </div>
</template>
<script>
let guideInfo = null;
export default {
  name: "GuideModal",
  props: {
    show: Boolean,
    loged: Boolean,
    bg: String,
    gift: String,
    config: { type: Object, default: () => {} }
  },
  data() {
    return {
      closed: false
    };
  },
  methods: {
    close() {
      this.closed = true;
    },
    goLogin() {
      this.close();
      $log({ e: "goLogin", p: {} });
      this.$router.push("/login");
    },
    handle(type) {
      if (type == 3) {
        this.$emit("tap", 2);
        this.sceneLoad();
        return;
      }
      // 1 去完善信息，2 先逛逛
      this.$emit("tap", type);
    }
  }
};
</script>
<style lang="scss">
.guide-modal {
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: none;
  transition: background 0.2s ease;
  pointer-events: none;

  &.act {
    z-index: 999;
    pointer-events: all;
    background: rgba(0, 0, 0, 0.3);

    .guide-main {
      top: 44%;
    }
  }

  .guide-main {
    position: absolute;
    top: -200vh;
    left: 10vw;
    width: 80vw;
    transform: translateY(-50%);
    transition: top 0.3s ease-out;

    & > p {
      color: #fff;
      text-align: center;
    }

    & > img {
      width: 100%;
    }
  }

  .title {
    font-size: 6.667vw;
    font-weight: 900;
    line-height: 9.867vw;
    margin-bottom: 3.467vw;
  }
  .desc {
    font-size: 3.467vw;
    font-weight: 600;
    line-height: 6.4vw;
    margin-bottom: 5.333vw;
    white-space: nowrap;
  }
  .info {
    position: relative;
    min-height: 34.133vw;

    & > img {
      display: block;
    }
    & > div {
      position: absolute;
      top: 18%;
      left: 7%;
      width: 86%;
      height: 72%;
    }

    .img,
    .msg {
      display: inline-block;
      vertical-align: middle;
    }

    .img {
      width: 42%;
      height: 100%;
      position: relative;

      & > img {
        position: absolute;
        display: block;
        width: 85%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      & > span {
        background: #4a90e2;
        border-radius: 0.533vw;
        font-size: 2.4vw;
        font-weight: 600;
        color: #fff;
        padding: 0.533vw 1.6vw;
        position: absolute;
        top: 1.333vw;
        left: 2.667vw;
      }
    }

    .msg {
      width: 52%;
      // height: 80%;
      // margin-top: 5%;
      border-left: 0.267vw dashed #e5e5e5;
      padding: 0.8vw 0 0.8vw 2.667vw;

      .subtitle {
        font-size: 2.667vw;
        font-weight: 600;
        color: #232323;
      }
      .price {
        font-size: 6.4vw;
        font-weight: 600;
        color: #232323;
        line-height: 8.8vw;
      }
      .hint {
        font-size: 2.667vw;
        font-weight: 400;
        color: #969696;
      }
    }
  }

  .opts {
    width: 100%;
  }

  .btn-get {
    display: block;
    margin: 0 auto;
    width: 80%;
    line-height: 10.667vw;
    border-radius: 1.067vw;
    background: #fa2337;
    color: #fff;
    font-size: 4.267vw;
  }

  &.dft {
    .ico-close {
      position: absolute;
      top: 0;
      right: 0;
      width: 8vw;
      height: 8vw;
      color: #fff;

      &::before,
      &::after {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 80%;
        height: 0;
        border-top: 0.4vw solid;
      }
      &::before {
        transform: translate(-50%, -50%) rotate(45deg);
      }
      &::after {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    }

    .opts {
      position: absolute;
      bottom: 10%;
    }
  }

  &.loged {
    .guide-main {
      background: linear-gradient(135deg, #fc5866 0%, #a3141e 100%);
      padding: 6.667vw;
      border-radius: 1.067vw;
    }

    .opts {
      margin-top: 8vw;

      button {
        display: block;
        width: 100%;
      }
    }

    .btn-load {
      position: relative;
      height: 10.133vw;
      background: linear-gradient(180deg, #fff 0%, #fecbcf 100%);
      box-shadow: 0 1.6vw 0.533vw 0 rgba(255, 255, 255, 0.5);
      border-radius: 1.067vw;
      font-size: 3.733vw;
      font-weight: 600;
      color: #fa2337;
      margin-bottom: 4.8vw;
    }
    .link {
      background: none;
      border: none;
      outline: none;
      color: #fff;
      font-size: 2.933vw;
      line-height: 4.267vw;
      margin-top: 3.2vw;
    }
  }
}
</style>
