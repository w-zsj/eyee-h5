<template>
  <div class="red-rain-wrap">
    <div class="gamewrap">
      <div class="myredpack" key="maskByMyReaPackBox">
        <div class="title">
          红包金额:
          <span>{{ amount.toFixed(2) }}</span
          >元
        </div>
        <div class="subtitle" v-if="amount > 0">活动结束后发放</div>
        <div class="line"></div>
        <div v-if="coupon.length > 0">
          <div class="myredpack_list">
            <!-- <div class="myredpack_info">
               <div class="myredpack_info_left">
                 <div class="number"><span>¥</span>200</div>
               </div>
               <div class="myredpack_info_right">
                 <div class="name">红包雨奖励</div>
                 <div class="range">适用品类:斗牛全平台</div>
                 <div class="range">限2019/11/04-2019/11/20</div>
               </div>
            </div>-->
            <div
              class="myredpack_info"
              v-for="(item, index) in coupon"
              :key="'g' + index"
            >
              <div class="myredpack_info_left">
                <div class="text">{{ item.faceValue }}</div>
                <div class="text_s">{{ item.useCondition }}</div>
              </div>
              <div class="myredpack_info_right">
                <div class="name">{{ item.title }}</div>
                <div class="range">适用品类:{{ item.useType }}</div>
                <div class="range">
                  限{{ item.useBeginTime }}-{{ item.useEndTime }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="null" v-if="coupon.length === 0">暂无记录</div>
        <div class="myredpack_btn" @click="useCoupon()">
          {{ btnText }}
        </div>
        <div class="sharebtn" @click="showShare()"></div>
      </div>
      <!--分享提示框-->
      <transition-group name="fade">
        <div class="mask" v-if="shareBox" key="shareBoxMask"></div>
        <div class="order_box" v-if="shareBox" key="shareBox">
          <div class="order_box_title">奖励发放中</div>
          <div class="order_box_text">
            邀请好友组队，最高抢200元无门槛红包！最多可邀请10人组队！
            <br />邀新斗牛新用户组队参与活动，即可额外获得受邀新用户之后每场红包雨所抢到红包金额的30%！
            <br />邀新斗牛老用户组队参与活动，即可额外获得受邀老用户之后每场红包雨所抢到红包金额的5%！
          </div>
          <div class="order_box_btn red" @click="invitationFriend">
            立即邀请
          </div>
          <div class="order_box_btn white" @click.stop="showShare">
            以后再说
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
import {
  RedPackRainGameOverApi,
  shareRainToFriendApi,
  RedPackRainMainApi,
  RedPackRainBeginGameApi
} from "@/utils/api/redpackrain";
export default {
  name: "raingameover",
  data() {
    return {
      amount: 0,
      coupon: [],
      shareBox: false,
      overcount: 0,
      start: false
    };
  },
  computed: {
    btnText() {
      if (!this.start) {
        return "活动已结束";
      }

      if (this.overcount > 0) {
        return "再来一次";
      } else {
        return "游戏明天继续";
      }
    }
  },
  mounted() {
    let _ = this;
    _.gameOver();
    this.getGameInfo();
  },
  methods: {
    getGameInfo() {
      RedPackRainMainApi()
        .then(res => {
          console.log("TCL: getGameInfo -> res", res);
          this.overcount = res.overcount;
          this.start = res.start;
        })
        .catch(err => {
          console.error(err);
        });
    },
    gameOver() {
      let _ = this;
      let params = JSON.parse(localStorage.getItem("rainList"));
      console.log("TCL: gameOver -> params", params);
      if (!params) {
        return;
      }
      RedPackRainGameOverApi({
        amount: +params[0].toFixed(2),
        coupon: params[1]
      })
        .then(res => {
          _.amount = res.amount;
          _.coupon = res.coupon;
        })
        .catch(e => {
          console.error(e);
        });
      localStorage.removeItem("rainList");
    },
    useCoupon() {
      if (!this.start) {
        return;
      }

      if (this.overcount <= 0) {
        return;
      } else {
        RedPackRainBeginGameApi()
          .then(res => {
            let rainList = res.repacketRain;
            localStorage.setItem("rainList", JSON.stringify(rainList));
            this.$router.push("/raincountdown");
          })
          .catch(e => {
            this.toast(e.msg);
          });
      }
      // let _ = this;
      // if (_.$root.ISAPP) {
      //   _.javascriptBridge({ name: "gotoAppRedPacketCouponPage" });
      // } else if (_.$root.ISMP) {
      //   wx.miniProgram.navigateTo({ url: "/pages/user/coupon" });
      // }
    },
    showShare() {
      let _ = this;
      if (_.$root.ISAPP) {
        //_.shareBox = !_.shareBox;
        _.invitationFriend();
      } else if (_.$root.ISMP) {
        wx.miniProgram.navigateTo({
          url: "/pages/home/rainshare?id=2"
        });
      }
    },
    invitationFriend() {
      let _ = this;
      shareRainToFriendApi()
        .then(res => {
          let loader = _.$loader("正在调起微信分享···");
          setTimeout(() => {
            loader.close();
          }, 3000);
          let shareInfo = {
            sharecontent: res.sharecontent || "",
            sharepicurl: window.location.origin + res.sharepicurl || "",
            shareurl: window.location.origin + res.shareurl || "",
            sharetitle: res.sharecontent || "",
            callbackname: res.callbackname || "",
            xcxurl: res.xcxurl || "",
            xcxicon: window.location.origin + res.xcxicon || "",
            xcxid: res.xcxid || "",
            type: 2,
            platform: 2
          };
          if (_.$root.ISAPP) {
            _.javascriptBridge({
              name: "callAppDirectlyShare",
              params: shareInfo
            });
          } else if (_.$root.ISMP) {
            wx.miniProgram.postMessage({ data: shareInfo });
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>
<style scoped>
.red-rain-wrap {
  width: 100vw;
  height: 100%;
  position: absolute;
  background: url("/static/imgs/redpackrain/game.png") no-repeat center 0;
  background-repeat: repeat-y;
  background-size: 100vw 178.27vw;
  overflow: hidden;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: rgba(0, 0, 0, 0.6);
}
.myredpack {
  position: absolute;
  top: 9.6vw;
  left: 5.6vw;
  width: 88.8vw;
  max-height: 92vh;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8vw;
  background: #ee243e;
  background-image: url("/static/imgs/redpackrain/top.png"),
    url("/static/imgs/redpackrain/bottom.png");
  background-position: top left, bottom right;
  background-size: 50% 50%;
  background-repeat: no-repeat;
  z-index: 2;
  border: 5px solid transparent;
  border-image: linear-gradient(#fdd9ad, #d18546, #fdd9ad, #d18546) 30 30 30 30;
}
.myredpack .close_btn {
  position: absolute;
  right: 0vw;
  top: 0vw;
  width: 8vw;
  height: 7.6vw;
  background: url("/static/imgs/redpackrain/close_btn.png") no-repeat;
  background-size: 100% 100%;
}
.myredpack .title {
  margin: 8.8vw auto 0;
  background: #a92434;
  border-radius: 5px;
  width: 73.0667vw;
  height: 10.6667vw;
  line-height: 10.6667vw;
  text-align: center;
  font-size: 23px;
  font-weight: 800;
  color: #ffe5c5;
}
.myredpack .title span {
  font-family: OswaldBold;
}
.myredpack .subtitle {
  margin: 0 auto;
  text-align: center;
  font-size: 13px;
  color: #ffe5c5;
  line-height: 9.3333vw;
}
.myredpack .line {
  width: 73.0667vw;
  height: 1px;
  background: #a92424;
  margin: 0 auto;
}
.myredpack .myredpack_list {
  width: 77.7333vw;
  height: auto;
  margin: 4.8vw auto 0;
  padding-bottom: 2.1333vw;
}
.myredpack .myredpack_info {
  width: 77.7333vw;
  height: 21.2vw;
  background: url("/static/imgs/redpackrain/pro_bg.png") no-repeat;
  background-size: 100% 100%;
  margin-bottom: 3.7333vw;
}
.myredpack .myredpack_info_left {
  float: left;
  height: 17.7333vw;
  width: 27.0667vw;
  margin-left: 1.7333vw;
  margin-top: 1.7333vw;
}
.myredpack .myredpack_info_left .number {
  font-size: 24px;
  color: #000;
  font-weight: bold;
  font-family: OswaldBold;
  text-align: center;
  line-height: 17.7333vw;
}
.myredpack .myredpack_info_left .number span {
  font-size: 18px;
  color: #000;
  font-weight: bold;
}
.myredpack .myredpack_info_left .text {
  font-size: 24px;
  color: #000;
  font-weight: bold;
  text-align: center;
  margin-top: 0.5333vw;
  line-height: 11.2vw;
}
.myredpack .myredpack_info_left .text_s {
  font-size: 10px;
  color: #585858;
  text-align: center;
}
.myredpack .myredpack_info_right {
  float: right;
  height: 17.7333vw;
  width: 47.0667vw;
  margin-right: 1.7333vw;
  margin-top: 1.7333vw;
  padding-left: 6vw;
}
.myredpack .myredpack_info_right .name {
  color: #373737;
  font-size: 19px;
  font-weight: bold;
  line-height: 8.8vw;
}
.myredpack .myredpack_info_right .range {
  color: #585858;
  font-size: 10px;
  line-height: 3.7333vw;
  white-space: nowrap;
}
.myredpack .myredpack_btn {
  margin-left: 4.2667vw;
  margin-bottom: 6.2vw;
  width: 79.4667vw;
  height: 14.6667vw;
  background: url("/static/imgs/redpackrain/red-end.png") no-repeat;
  background-size: 100% 100%;

  font-size: 20px;
  font-weight: 800;
  color: #ffe5c5;
  line-height: 12.5vw;
  text-align: center;
}
.myredpack .null {
  width: 100%;
  height: 45.8667vw;
  font-size: 14px;
  color: #fff;
  line-height: 45.8667vw;
  text-align: center;
}
.sharebtn {
  width: 31.3333vw;
  height: 5.8667vw;
  background: url("/static/imgs/redpackrain/sharetext.png") no-repeat;
  background-size: 100% 100%;
  margin: 0 auto;
}
.order_box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 76vw;
  height: auto;
  background: rgba(246, 246, 246, 1);
  border-radius: 6px;
  z-index: 2;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
.order_box_title {
  font-size: 20px;
  font-weight: 800;
  line-height: 16vw;
  text-align: center;
  color: #0f0f0f;
}
.order_box_text {
  padding: 0 5.5155vw 4.8vw;
  font-size: 14px;
  color: #444444;
  text-align: justify;
  line-height: 6.9333vw;
}
.order_box_btn {
  margin: 0 auto;
  width: 65.3333vw;
  height: 11.7333vw;
  line-height: 11.7333vw;
  text-align: center;
  font-size: 16px;
  text-align: center;
  border-radius: 5px;
}
.order_box_btn.red {
  background: #f13237;
  color: #f7f7f7;
}
.order_box_btn.white {
  color: #444444;
}
</style>
