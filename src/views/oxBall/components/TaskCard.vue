<template>
  <div class="list">
    <li class="li">
      <div class="right-box">
        <div class="gold">
          <img src="/static/imgs/ball/gold.png?c=1" alt srcset />
          <span>+{{item.newballnum}}</span>
        </div>

        <div class="title-box">
          <div class="title">{{ item.name }}</div>
          <div class="intro">完成 {{ item.completetimes }}/{{ item.times }}</div>
        </div>
      </div>

      <div
        class="btn"
        v-show="item.completestatus === 0"
        @click="goToTask(item.type, item.auctionid)"
      >{{ item.type | typeToText }}</div>
      <div class="btn can" @click="getBall(item.code)" v-show="item.completestatus === 1">领取</div>
      <div class="btn done" v-show="item.completestatus === 2">已领取</div>
    </li>
  </div>
</template>

<script>
import { GetBallApi } from "@/utils/api/oxball";
export default {
  props: {
    item: {
      type: Object,
      required: false,
      default: () => {
        return {
          code: "",
          source: 1,
          type: 1,
          name: "",
          times: 1,
          completetimes: 1,
          completestatus: 1
        };
      }
    }
  },
  data() {
    return {};
  },
  filters: {
    typeToText(type) {
      let text;
      switch (type) {
        case 3:
          text = "去社区发帖";
          break;
        case 4:
          text = "分享内容";
          break;
        case 5:
          text = "发表评论";
          break;
        case 6:
          text = "去点赞";
          break;
        case 7:
          text = "未完成"; //消息推送
          break;
        case 8:
          text = "去拍卖会场";
          break;
        case 9:
          text = "去发拍";
          break;
        case 10:
          text = "去发帖";
          break;
      }
      return text;
    }
  },
  methods: {
    goToTask(type, auctionid) {
      let _ = this;
      if (type === 7) {
      } else if (type === 8) {
        if (auctionid) _.$router.push("/auction/" + auctionid);
      } else if (type === 9) {
        _.javascriptBridge({
          name: "gotoAppSearchAuctionProductPage"
        });
      } else {
        _.javascriptBridge({
          name: "gotoAppMallCenterPage"
        });
      }
    },
    getBall(code) {
      let _ = this;
      let { user } = _;

      GetBallApi(code)
        .then(res => {
          //   _.getTaskList();
          //   _.getUserBall();
          this.$emit("change");
          _.toast("领取牛丸成功");
          $log({
            e: "click_get_ball_task",
            p: { code: code, userid: user.uid }
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  margin: 0 auto;
  width: 92vw;
  height: auto;
  overflow: hidden;
}

.li {
  width: 100%;
  height: 19.466vw;
  border-radius: 6px;
  margin-bottom: 2.666vw;
  background: #fff;
  position: relative;
  padding: 2.6667vw 5.3333vw 2.6667vw 4vw;

  display: flex;
  align-items: center;
  justify-content: space-between;

  .right-box {
    display: flex;

    .gold {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 12.8vw;
      height: 14.1333vw;
      border-radius: 0.5333vw;
      overflow: hidden;
      background: linear-gradient(
        180deg,
        rgba(255, 250, 243, 1) 0%,
        rgba(254, 244, 227, 1) 100%
      );

      font-size: 3.2vw;
      color: #903d0c;
      font-weight: 600;
      margin-right: 4vw;

      img {
        width: 7.4667vw;
        height: auto;
      }
    }

    .title-box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 14.1333vw;

      .title {
        color: #232323;
        font-size: 3.7333vw;
        font-weight: 600;
        margin-bottom: 0.8vw;
      }
      .intro {
        font-size: 3.7333vw;
        font-weight: 400;
        color: #646464;
      }
    }
  }
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 21.3333vw;
  height: 8.8vw;
  border-radius: 0.5333vw;
  border: 1px solid #fa4b4b;
  font-size: 3.7333vw;
  font-weight: 600;
  color: #fa2337;
}

.can {
  background: #fa2337;
  color: #fff;
}

.done {
  background: #dcdcdc;
  color: #fff;
  border: none;
}
</style>