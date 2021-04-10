<template>
  <div>
    <div class="red-packet">
      <img
        @click="receive"
        class="reserve-btn"
        src="../../../static/img/redPacket/gift-button.png"
        alt
      />
      <p class="receive-rules" @click="showType = 0">领取规则</p>
    </div>

    <transition-group name="newGift">
      <div class="mask-public" key="0" v-show="showType == 0" @click="showType = null">
        <div class="mask-rules-info" @click.stop>
          <img
            class="mask-rules-close"
            @click.stop="showType = null"
            src="../../../static/img/gray_close.png"
            alt
          />
          <div class="mask-rules-title">领取规则</div>
          <div class="mask-rules-content">
            <div class="mask-rules-content-item">
              <span>1.</span>
              <span>新人大礼包只有未注册用户完成注册后才可领取。</span>
            </div>
            <div class="mask-rules-content-item">
              <span>2.</span>
              <span>新人大礼包内的优惠券有效期从领取时当天开始计算。</span>
            </div>
            <div class="mask-rules-content-item">
              <span>3.</span>
              <span>优惠券过期未使用的，不予以返还。</span>
            </div>
            <div class="mask-rules-content-item">
              <span>4.</span>
              <span>新人大礼包的额度平台会根据不同情况发放不同额度。</span>
            </div>
            <div class="mask-rules-content-item">
              <span>5.</span>
              <span>优惠券的使用规则，平台拥有最终解释权。</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mask-public" key="2" v-show="showType == 2">
        <div class="result-tip">
          <div class="result-tip-title">
            <img src="../../../static/img/redPacket/success.png" alt />
            <span>恭喜您，领取成功！</span>
          </div>
          <div class="result-tip-info">
            <p>520元大礼包已放入您的账户中</p>
            <p>请至 “我的-红包卡券”中查看</p>
          </div>
          <div class="submit-info submit" @click="toCoupon()">立即查看</div>
          <img
            @click="showType = null"
            class="mask-close"
            style="bottom: -18.6667vw;"
            src="../../../static/img/redPacket/close-tip.png"
            alt
          />
        </div>
      </div>

      <div class="mask-public" key="3" v-show="showType == 3">
        <div class="result-tip">
          <div class="result-tip-title">
            <img src="../../../static/img/redPacket/fail.png" alt />
            <span>抱歉，领取失败！</span>
          </div>
          <div class="result-tip-info">
            <p>当前手机号已领取过新人大礼包</p>
            <p style="font-size: 4vw; color: #333">您可通过邀请好友获得额外红包</p>
          </div>
          <div class="submit-info submit" @click="toSharePacket()">邀请好友得红包</div>
          <img
            @click="showType = null"
            class="mask-close"
            style="bottom: -18.6667vw;"
            src="../../../static/img/redPacket/close-tip.png"
            alt
          />
        </div>
      </div>
    </transition-group>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getRedPacket } from "../../common/api/user";
export default {
  data() {
    return {
      isShowError: false,
      showType: null, //0：领取规则   1：手机号验证码   2：领取成功  3：领取失败
      reserveCode: "获取验证码",
      mobileCode: "",
      mobile: "",
      submitCode: "",
      submitClass: "",
      tokenVal: ""
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo"
    })
  },
  beforeRouteEnter(to, from, next) {
    console.log("from", from.path.indexOf("country"));
    next(vm => {
      if (from.path.indexOf("country") > -1) {
        vm.showType = 1;
      }
    });
  },
  mounted() {},
  methods: {
    receive() {
      let _ = this,
        { user } = _;
      if (!(user && user.uid)) _.$router.push("/login");
      else _.getRedPacket();
    },
    getRedPacket() {
      let _ = this,
        { user, $route } = _;
      let options = {
        inviteduserid: $route.query.inviteduserid,
        activityid: $route.query.activityid,
        mobile: user.mobile,
        receivetype: 3,
        activitytype: 1
      };
      getRedPacket(options)
        .then(res => {
          if (res.receivestatus == 0) {
            _.closePacket();
            _.showType = 2;
          } else if (res.receivestatus == 1 || res.receivestatus == 2) {
            _.closePacket();
            _.showType = 3;
          }
        })
        .catch(err => {
          _.toast(err.msg);
        });
    },
    closePacket() {
      this.showType = null;
      this.mobileCode = "";
      this.mobile = "";
      this.isShowError = false;
      // this.reserveCode = "获取验证码"
    },
    toCoupon() {
      this.$router.push("/user/coupon");
    },
    toSharePacket() {
      this.closePacket();
      console.log("this.tokenVal", this.tokenVal);
      // 上线时切换成正式域名 http://m.eyee.com/a/
      let url = "";
      if (this.$root.isdebug) {
        url = "http://qzone.eyee.com/a";
      } else {
        url = "https://m.eyee.com/a";
      }
      window.location.href = `${url}/20180926redPacket/sharePacket.html?activityid=${this.$route.query.activityid}&t=${this.tokenVal}`;
    }
  }
};
</script>
<style scoped>
.red-packet {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("../../../static/img/redPacket/gift-bg.jpg") no-repeat center;
  background-size: 100% 100%;
  z-index: 1;
}
.reserve-btn {
  width: 33.8667vw;
  height: 10.1333vw;
  position: absolute;
  bottom: 20%;
  /* bottom: 30.6667vw; */
  margin-left: -16.9333vw;
  left: 50%;
}
.receive-rules {
  color: #fff;
  font-size: 3.4667vw;
  line-height: 4.8vw;
  border-bottom: 1px solid #fff;
  display: inline-block;
  position: absolute;
  bottom: 7.2vw;
  margin-left: -6.9333vw;
  left: 50%;
  font-weight: 500;
}
.mask-public {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2;
}
.mask-rules-info {
  width: 73.3333vw;
  height: 84.5333vw;
  background: #fff;
  border-radius: 1.0667vw;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  padding: 2.6667vw;
}
.mask-rules-close {
  width: 3.2vw;
  height: 3.2vw;
  position: absolute;
  right: 2.6667vw;
  top: 2.6667vw;
}
.mask-rules-title {
  text-align: center;
  color: #333333;
  font-size: 4.2667vw;
  padding: 2.6667vw 0 5.3333vw;
  border-bottom: 1px dashed #cccccc;
}
.mask-rules-content {
  padding: 5.3333vw 1.3333vw 1.6vw;
}
.mask-rules-content-item {
  display: flex;
  justify-content: flex-start;
  color: #666;
  font-size: 3.4667vw;
  line-height: 5.0667vw;
  margin-bottom: 2.4vw;
}
.mask-rules-content-item :first-child {
  margin-right: 1.8667vw;
}
.mask-reserve {
  width: 73.3333vw;
  height: 80.2667vw;
  background: url("../../../static/img/redPacket/receive-bg.png") no-repeat
    center;
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  padding: 4vw;
}
.mask-reserve-title {
  color: #fff;
  text-align: center;
  font-size: 4.8vw;
  /* line-height: 6.6667vw;
    margin-top: 1.8667vw; */
  line-height: 12.5333vw;
  letter-spacing: 0.1333vw;
}
.reserve-info {
  margin-top: 3.2vw;
}
.reserve-info-item {
  margin-top: 8vw;
  border-bottom: 1px solid #333;
  color: #333;
  font-size: 3.4667vw;
  padding-bottom: 1.3333vw;
  /* display: flex; */
  display: -moz-box;
  display: -webkit-box;
  display: box;
}
.reserve-info-item > span.country_code {
  display: block;
  margin-right: 2.9333vw;
  padding: 3px 1.3333vw;
}
.reserve-info-item > span.country_code > em {
  display: inline-block;
  margin-left: 1.0667vw;
  width: 0;
  height: 0;
  border-left: 1.2vw solid transparent;
  border-right: 1.2vw solid transparent;
  border-top: 1.4667vw solid #666;
}
.reserve-info-item input {
  background: none;
  color: #333;
  display: block;
  box-flex: 1;
  -moz-box-flex: 1;
  -webkit-box-flex: 1;
  /* flex: 1; */
  -moz-appearance: textfield;
}
.reserve-info-item input::-webkit-input-placeholder {
  color: #999;
}
.reserve-info :last-child {
  border-bottom: none;
}
.reserve-info :last-child > input {
  border-bottom: 1px solid #333;
  margin-right: 4.5333vw;
  line-height: 6.9333vw;
  width: calc(100% - 28.5333vw);
}
.reserve-info-code {
  width: 24vw;
  text-align: center;
  line-height: 7.7333vw;
  background: #cccccc;
  color: #fff;
  border-radius: 1.0667vw;
}
.errer-info {
  color: #d90c0c;
  font-size: 3.2vw;
  line-height: 4.5333vw;
  /* margin-top: 2vw; */
}
.submit-info {
  width: 100%;
  text-align: center;
  letter-spacing: 0.5333vw;
  line-height: 10.6667vw;
  background: #cccccc;
  color: #fff;
  border-radius: 1.0667vw;
  margin-top: 4vw;
  font-size: 4.5333vw;
}
.mask-close {
  width: 9.6vw;
  height: 9.6vw;
  position: absolute;
  left: 50%;
  margin-left: -4.8vw;
  bottom: -25.6vw;
}
.result-tip {
  width: 73.3333vw;
  height: 58.6667vw;
  background: url("../../../static/img/redPacket/result-info.png") no-repeat
    center;
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  padding: 4vw;
}
.result-tip-title {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 4.5333vw;
  margin-top: 4vw;
}
.result-tip-title img {
  width: 6.6667vw;
  height: 6.6667vw;
  margin-right: 3.3333vw;
}
.result-tip-info {
  margin-top: 7.7333vw;
  font-size: 4.2667vw;
  text-align: center;
  line-height: 5.8667vw;
  color: #333;
}
.result-tip-info :last-child {
  font-size: 3.2vw;
  color: #999;
}
.hidden {
  visibility: hidden;
}
.submit {
  background: #333333;
}

.newGift-enter-active,
.newGift-leave-active {
  transition: all 0.5s;
}
.newGift-enter,
.newGift-leave-to {
  opacity: 0;
}
</style>

