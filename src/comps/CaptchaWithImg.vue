<template>
  <div class="captcha-with-img-container act">
    <div class="captcha-with-img">
      <div class="captcha-info">
        <div class="title">安全验证</div>
        <input class="captcha-input" type="text" placeholder="请输入验证码":maxLength="5" v-model="verificationCode.vcode">
        <div class="captcha-img-container flex-between">
          <img class="captcha-img" :src="verificationCode.captcha" />
          <div class="get-captcha-txt" :class="{ disable: !clickFlag }" @click="getNewPic">{{ verificationCode.txt }}</div>
        </div>
      </div>
      <div class="flex bottom-btn-list">
        <div class="bottom-btn cancel" @click="cancel">取消</div>
        <div class="bottom-btn" @click="submitVerifyCode">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
  import { GetCaptchaWithImg } from "@/common/api/user";

  export default {
    name: "CaptchaWithImg",
    props: {
      captchaWithImgInfo: {
        type: Object
      },
      /**
       * 校验是否通过，不通过则自动重新获取验证码
       */
      isPassValidate: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        verificationCode: {
          txt: '获取验证码',
          vcode: '',
          captcha: '',
          uid: ''
        },
        clickFlag: true
      }
    },
    watch: {
      isPassValidate(value) {
        const _ = this;
        if (!value) {
          _.verificationCode.vcode = undefined;
          _.$emit("changeIsPassValidate")
          _.apiGetCaptchaWithImg();
        }
      }
    },
    created() {
      this.verificationCode.captcha = this.captchaWithImgInfo.captcha;
      this.verificationCode.uid = this.captchaWithImgInfo.uid;
    },
    destroyed() {
      clearInterval(this.timer);
    },
    methods: {
      submitVerifyCode() {
        const _ = this;
        let { verificationCode } = _;
        if (!verificationCode.vcode) {
          _.toast('请输入图形验证码')
          return;
        }
        if (verificationCode.vcode.length < 5) {
          _.toast('请输入正确的图形验证码')
          return;
        }
        _.$emit("verifyCode", {
          vcode: verificationCode.vcode,
          uid: verificationCode.uid
        });
      },
      getNewPic() {
        const _ = this,
          { verificationCode } = _;
        if (!_.clickFlag) return;
        _.verificationCode.vcode = undefined;
        _.apiGetCaptchaWithImg();
        // 开始倒计时
        _.startClock();
      },
      apiGetCaptchaWithImg() {
        const _ = this;
        GetCaptchaWithImg().then(res => {
          this.verificationCode.captcha = res.captcha;
          this.verificationCode.uid = res.uid;
        })
          .catch(err => {
            _.toast(err.msg);
          })
      },
      startClock() {
        let _ = this,
          time = 60;
        _.clickFlag = false;
        _.verificationCode.txt = time + "s后重新获取";
        _.timer = setInterval(() => {
          if (time > 0) {
            time -= 1;
            _.verificationCode.txt = time + "s后重新获取";
          } else {
            _.verificationCode.txt = "获取验证码";
            _.clickFlag = true;
            clearInterval(_.timer);
          }
        }, 1000);
      },
      cancel() {
        const _ = this;
        _.$emit("cancel");
      }
    }
  }
</script>
<style lang="scss" scoped>
  .captcha-with-img-container {
    position: fixed;
    width: 100%;
    pointer-events: none;
    top: 0;
    left: 0;
    height: 100%;
    background: none;
    transition: background 0.2s ease-in;
    z-index: 999;
    color: #fff;
  }
  .captcha-with-img-container.act {
    pointer-events: auto;
    background: rgba(0, 0, 0, 0.5);
  }
  .captcha-with-img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 76vw;
    background: #3c3c3c;
    border-radius: 4.8vw;
    overflow: hidden;
  }
  .captcha-info {
    padding: 6.6667vw 8vw 5.3333vw 8vw;
    .title {
      font-size: 4.8vw;
      font-weight: bold;
      text-align: center;
      margin-bottom: 4vw;
    }
    .captcha-input {
      width: 60vw;
      height: 13.3333vw;
      background: #282828;
      border-radius: 13.3333vw;
      padding: 3.466vw 5.3333vw;
      font-size: 4.5333vw;
      color: #C8AF6E;
      line-height: 6.4vw;
    }
    input::-webkit-input-placeholder {
      color: #505050;
    }
    .captcha-img-container {
      padding-top: 4vw;
      .captcha-img {
        width: 24vw;
        height: 100%;
        margin-left: 1.3333vw;
      }
      .get-captcha-txt {
        font-size: 4vw;
      }
      .disable {
        color: #969696;
      }
    }
  }
  .bottom-btn-list {
    border-top: 1px solid #323232;
  }
  .bottom-btn {
    flex: 1;
    line-height: 16vw;
    background: #373737;
    text-align: center;
    font-weight: bold;
    &:not(:first-child) {
      border-left: 1px solid #323232;
    }
  }
  .bottom-btn.cancel {
    color: #969696;
  }
</style>
