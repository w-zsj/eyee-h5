<template>
  <div>
    <loader class="load" from="9" ref="load" v-if="!$root.ISAPP&&curr==='luck'">
      <img src="/static/img/bull/download_app.png?c=1" alt />
    </loader>
    <div class="redpacket" :class="curr">
      <img class="bn-bg" v-lazy="'https://files.eyee.com/activity/redpacket/banner_bg.png'" alt />
      <img
        class="img-title"
        v-lazy="`https://files.eyee.com/activity/redpacket/title_${curr+(curr=='gift'?'_new':'')}.png`"
        alt
      />
      <div class="bnr">
        <template v-if="curr=='gift'">
          <img v-lazy="'https://files.eyee.com/activity/redpacket/banner_gift.png'" alt />
        </template>
        <template v-else>
          <img v-lazy="'https://files.eyee.com/activity/redpacket/banner.png'" alt />
          <img
            class="bnr-info"
            v-lazy="`https://files.eyee.com/activity/redpacket/info_${info}.png`"
            alt
          />
        </template>
      </div>
      <router-view></router-view>
      <div class="foot-logo">
        <img v-lazy="'https://files.eyee.com/activity/redpacket/logo.png'" alt />
      </div>
    </div>
  </div>
</template>
<script>
import Loader from "@/comps/Loader";
export default {
  name: "RedpacketLayout",
  components: { Loader },
  computed: {
    curr() {
      return this.$route.name.replace("Redpacket", "").toLowerCase();
    },
    info() {
      let ret = "";
      switch (this.curr) {
        case "luck":
          ret = "10";
          break;
        case "share":
          ret = "30";
          break;
        case "gift":
          ret = "188";
          break;
      }
      return ret;
    }
  },
  mounted() {
    let _ = this,
      { name } = _.$route;
  }
};
</script>
<style lang="scss">
.redpacket {
  $pd: 4vw;

  position: relative;
  min-height: 100vh;
  background: linear-gradient(to bottom, #3f3633 0%, #492a3f 100%);
  z-index: 1;
  padding-top: 20vw;

  .bn-bg {
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
  }

  .bnr {
    z-index: -1;
    position: relative;
    min-height: 80vw;

    .bnr-info {
      position: absolute;
      top: 16.667vw;
      width: 44%;
      left: 27%;
    }
  }

  .btn {
    position: relative;
    background: url(https://files.eyee.com/activity/redpacket/btn_bg.png)
      no-repeat;
    background-size: 100% 100%;
    color: #fff;

    img {
      display: block;
      position: absolute;
      height: 40%;
      width: auto;
      top: 30%;
      left: 50%;
      transform: translate(-50%);
    }
  }

  .btn-full {
    width: 100%;
    height: 16vw;
  }

  .link {
    font-size: 3.733vw;
    font-weight: 400;
    color: #ff5947;
    line-height: 5.333vw;
  }

  .sec-box {
    background: linear-gradient(
      180deg,
      rgba(220, 171, 150, 0.4) 0%,
      rgba(222, 167, 142, 0.8) 20%,
      #dea78e 100%
    );
    box-shadow: 0.133vw 3.467vw 6.533vw 0 rgba(255, 208, 158, 0.25);
    border-radius: 1.333vw;
    margin-left: $pd;
    margin-right: $pd;
    color: #fff;
    padding: 8.667vw 4vw 5.333vw;
  }

  .rp-sec-title {
    text-align: center;
    margin-bottom: 6vw;

    span {
      margin: 0 4vw;
    }
  }

  .pendant {
    display: inline-block;
    vertical-align: middle;
    width: 0.8vw;
    height: 4.8vw;
    background: linear-gradient(
      175deg,
      #fff 0%,
      rgba(255, 255, 255, 0.01) 100%
    );
    border-radius: 0.4vw;
    transform: rotate(15deg);
  }

  .steps-box {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    margin-bottom: 6.667vw;
  }
  .steps {
    width: 100%;
    overflow-x: scroll;
    padding: 0 5.333vw;
  }
  .step {
    display: inline-block;
    width: 36vw;

    & > p {
      color: #fff;
      font-size: 3.2vw;
      font-weight: 600;
      text-align: center;
      padding-right: 0.8vw;
    }

    &.act > p,
    &.act .step-dot {
      color: #ff4835;
    }

    &:not(:last-of-type) .step-dot:after {
      content: "";
      display: block;
      position: absolute;
      z-index: -1;
      top: 41%;
      left: 50%;
      transform: translateY(-50%);
      width: 36vw;
      height: 1.733vw;
      background: currentColor;
    }
  }
  .step-cell {
    position: relative;
    font-weight: bold;
    color: #ff5f32;

    & > div {
      position: absolute;
      left: 11%;
      top: 8%;
      width: 74%;
      height: 80%;
    }

    .sup {
      vertical-align: super;
      font-size: 6.933vw;
      margin-left: -4.8vw;
      margin-right: -1.6vw;
    }
    .bold {
      font-size: 10.667vw;
      line-height: 0.96;
    }
    .mid {
      font-size: 4vw;
      font-style: italic;
    }
    .sub {
      font-size: 2.667vw;
    }
  }
  .step-dot {
    position: relative;
    padding-left: 38.5%;
    color: #f2e1d8;

    img {
      width: 8.533vw;
    }
  }

  .rank-cell {
    width: 100%;
    margin-bottom: 4.8vw;
    font-size: 3.2vw;
    font-weight: 400;

    div {
      width: 48%;
    }

    .bold {
      margin-bottom: 2.4vw;
    }

    & > p {
      width: 30%;
      text-align: right;
    }
  }

  .more {
    font-size: 3.2vw;
    font-weight: 400;

    span {
      margin-right: 1.333vw;
    }

    .ico-arrow-t {
      border-width: 0 1.333vw 1.6vw;
    }
    .ico-arrow-b {
      border-width: 1.6vw 1.333vw 0;
    }
  }

  .bold {
    font-weight: bolder;
    font-size: 5.333vw;
    font-family: DIN-Bold;
  }

  .avatar {
    width: 12vw;
    height: 12vw;
    border-radius: 50%;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.2);
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: transparent;
    pointer-events: none;
    transition: background 0.3s ease;

    .hint-title {
      padding-top: 1.333vw;
      font-size: 4.8vw;
      color: #333;
    }
    .hint-info {
      font-size: 3.733vw;
      color: #666;
      border-bottom: 0.133vw solid #eee;
      padding: 2.667vw 0;
    }
    .hint-btn {
      color: #333;
      font-size: 4.267vw;
      padding: 4vw 0 1.333vw;
    }

    .popup-box {
      text-align: center;

      &.share {
        position: relative;
        margin-top: 60vw;
        color: #fff;
        font-weight: 600;
      }
    }
    .popup-banner {
      width: 80%;
      margin-top: 22vh;
    }

    .popup-guide {
      position: fixed;
      top: 10.667vw;
      right: 16vw;
      width: 19.2vw;
    }
    .share-title {
      font-size: 8vw;
    }
    .share-desc {
      font-size: 3.733vw;
      margin: 5.333vw 0 8vw;
    }
    .share-btn {
      color: #333;
      background: #fff;
      width: 28vw;
      height: 9.6vw;
      line-height: 9.6vw;
      border-radius: 0.533vw;
      margin: 0 auto;
    }

    .main {
      position: absolute;
      width: 74vw;
      top: -200vh;
      transform: translateY(-50%);
      left: 13vw;
      background: #fff;
      border-radius: 0.533vw;
      padding: $pd;
      transition: top 0.2s ease-out;
    }

    &.act {
      background: rgba(0, 0, 0, 0.5);
      pointer-events: all;

      .main {
        top: 48%;
      }
    }

    .modal-title {
      font-size: 4.533vw;
      font-weight: 600;
      color: #232323;
      line-height: 6.4vw;
      margin: 4.8vw 0;
      text-align: center;
    }

    .modal-info {
      margin: 4vw 0;
      font-size: 3.733vw;
      font-weight: 400;
      color: #646464;
      line-height: 5.333vw;

      &.rule {
        font-size: 3.467vw;
      }
      &.got {
        text-align: center;
        font-size: 4.267vw;
        line-height: 1.8;
      }
    }

    .sub-info {
      font-size: 3.733vw;
      color: #969696;
    }

    .ico-X {
      position: absolute;
      top: 2.667vw;
      right: 2.667vw;
      width: 6.667vw;
      height: 6.667vw;
    }

    .btn {
      height: 10.667vw;
      line-height: 10.667vw;
      text-align: center;
      font-size: 3.733vw;
      font-weight: 600;
      background: #fa2337;
    }
  }

  .cpn-box {
    position: relative;

    & > div {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 92%;
      text-align: left;
    }

    & + .btn {
      width: 64vw;
      margin: 2.667vw auto;
    }
  }
  .cpn-title {
    font-size: 5.333vw;
    font-weight: 900;
    color: #fff;
    opacity: 0.8;
    width: 30%;
  }
  .cpn-hint {
    font-size: 4.267vw;
    font-weight: 600;
    color: #fd5948;
    line-height: 6.667vw;
    width: 50%;
    margin-left: 8%;

    p {
      width: 100%;
    }
  }
  .cpn-info {
    width: 50%;
    margin-left: 4%;

    p {
      width: 100%;
      align-items: baseline;
    }
  }
  .cpn-price,
  .cpn-sub {
    font-size: 13.333vw;
    font-family: DIN-Bold;
    font-weight: bold;
    color: #fc5945;
  }
  .cpn-sub {
    font-size: 8vw;
    margin-right: -1.333vw;
  }
  .cpn-name {
    font-size: 3.2vw;
    font-weight: 600;
    color: #646464;
    margin-left: 4vw;
  }
  .cpn-time {
    font-size: 2.667vw;
    font-weight: 400;
    color: #969696;
    margin: 1.333vw 0 5.333vw;
    white-space: nowrap;
  }

  .send-hint {
    font-size: 3.733vw;
    color: #fff;
    text-align: center;
    margin: 1.333vw 0 4vw;
  }
  .use-btn {
    margin-bottom: 4vw;
  }

  .luck-cell {
    margin-bottom: 4.8vw;
    color: #fff;

    .best {
      position: relative;

      &::before,
      &::after {
        position: absolute;
      }
      &::before {
        content: "";
        background: url(https://files.eyee.com/activity/redpacket/luck_avatar.png)
          no-repeat;
        background-size: 100% auto;
        width: 14.4vw;
        height: 13.333vw;
        transform: translate(-13%, -25%);
      }
      &::after {
        content: "手气最佳";
        width: 10.8vw;
        line-height: 3.2vw;
        font-size: 2.4vw;
        font-weight: 500;
        background: linear-gradient(-35deg, #ffa007 0%, #fece65 100%);
        border-radius: 0.533vw;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, -10%);
      }
    }

    .luck-info {
      width: 50%;

      .flex-wrap {
        align-items: baseline;
      }

      .bold {
        margin-right: 4.267vw;
      }
    }

    .time {
      font-size: 2.667vw;
      font-weight: 400;
    }
    .comment {
      font-size: 3.2vw;
      font-weight: 400;
      margin-top: 2.4vw;
    }

    .luck-price {
      width: 26%;
      text-align: right;

      span:first-of-type {
        font-size: 6.667vw;
        margin-right: -1.333vw;
      }
      span:last-of-type {
        font-size: 8vw;
      }
    }
  }

  .ico-close {
    color: #fff;
    width: 9.6vw;
    height: 9.6vw;
    border: 0.8vw solid currentColor;
    border-radius: 50%;
    transform: rotate(45deg);
    margin-top: 13.333vw;

    &::before,
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    &::before {
      width: 64%;
      border-top: 0.933vw solid currentColor;
    }
    &::after {
      height: 64%;
      border-left: 0.933vw solid currentColor;
    }
  }

  .fix-btm {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;

    .btn {
      width: 90vw;
      height: 10.667vw;
      margin: 1.333vw auto;
    }
  }

  .foot-logo {
    width: 33.333vw;
    padding: 6.667vw 0;
    margin: 0 auto;
  }

  &:not(.gift) .img-title {
    display: block;
    width: 66.667vw;
    margin: 0 auto -10vw;
  }

  &.gift {
    padding-left: $pd;
    padding-right: $pd;
    .loader_box {
      min-width: 49%;
      flex: 1;
    }
    .act_btn {
      min-width: 49%;
      flex: 1;
    }
    .link {
      margin: 6.4vw 0;
      text-align: center;
    }
  }

  &.share {
    padding: 20vw 0 10vw;

    .link {
      padding: 0 $pd;
      text-align: right;
    }

    .cpn-box {
      width: 96%;
      margin: 2vw auto;
    }
  }

  &.luck {
    background: linear-gradient(to bottom, #392ca4 0%, #673090 100%);

    .sec-box {
      margin-bottom: 8vw;
    }

    .cpn-box {
      width: 84vw;
      min-height: 32vw;
    }

    .btn {
      width: 100%;
      height: 14.667vw;
    }

    .modal .main {
      text-align: center;
    }
  }
}
</style>
