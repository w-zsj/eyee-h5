<template>
    <div>
       <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>商家入驻</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
        <div class="baozhengjin">
           <span>实名认证—</span>支付保证金
        </div>
        <div class="info">
            <label for="">手机号:</label>
            <input type="text" placeholder="请输入您的手机号" v-model="shopintoinfo.mobile">
        </div>
         <div class="info code">
            <label for="">验证码:</label>
            <input type="text" placeholder="请输入验证码" v-model="shopintoinfo.code">
            <span @click.stop="getcode()">{{coundtext}}</span>
        </div>
        <div class="introduce">
          <p class="title">*以上信息为隐私，不对外展示</p>
        </div>
        <div class="next" :class="{'nextbg':bg}" @click.stop="pay">
          下一步
        </div>
    </div>
</template>
<script>
import { mobileToMerchantCode } from "../../../common/api/snekc2c.js";
import { mapGetters } from "vuex";
import { Checking } from "../../../common/util";
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
export default {
  data() {
    return {
      shopintoinfo: {
        mobile: "",
        code: ""
      },
      portreturnCode: null,
      codeOff: false,
      coundtext: "发送验证码",
      timeRun: null
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    }),
    bg() {
      if (this.shopintoinfo.mobile && this.shopintoinfo.code) {
        return true;
      } else return false;
    }
  },
  mounted() {},
  methods: {
    pay() {
      if (this.shopintoinfo.mobile && this.shopintoinfo.code) {
        if (this.shopintoinfo.code != Number(this.portreturnCode)) {
          this.toast("验证码输入不正确");
        }
        // 调接口 生成订单
        // this.$router.push("/shoppay/180590806109391");
      } else {
        this.toast("请完善信息");
      }
    },
    decpadleft(val) {
      if (val < 10) return "0" + val;
      else return val;
    },
    getcode() {
      if (!Checking(this.shopintoinfo.mobile, "phone")) {
        this.toast("请正确输入手机号");
        return false;
      }
      let params = {
        mobile: this.shopintoinfo.mobile,
        checktype: 1
      };
      if (!this.codeOff) {
        mobileToMerchantCode(params)
          .then(res => {
            if (res) {
              this.portreturnCode = res;
              console.log(this.portreturnCode, "验证码");
              this.toast("发送成功");
              this.codeOff = true;
              var time_secs = 60;
              this.timeRun = setInterval(() => {
                if (time_secs > 1) {
                  time_secs--;
                  this.coundtext = "已发送" + this.decpadleft(time_secs) + "s";
                } else {
                  this.coundtext = "再次发送";
                  this.codeOff = false;
                  clearInterval(this.timeRun);
                  this.timeRun = null;
                }
              }, 1000);
            }
          })
          .catch(err => {
            if (err && err.code == 1511531) {
              this.toast("验证码发送频繁,请60s之后再试");
            }
          });
      }
    }
  }
};
</script>
<style scoped>
.baozhengjin {
  height: 50px;
  line-height: 50px;
  background: #f5f5f5;
  padding-left: 15px;
  color: #ccc;
}
.baozhengjin span {
  color: #333;
  padding-right: 10px;
}
.info {
  padding: 0 15px;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 2px;
}
.info label {
  color: #333;
  font-weight: bold;
  width: 20%;
  display: inline-block;
}
.info input {
  width: 70%;
  height: 98%;
  outline-style: none;
  list-style: none;
  padding: 0;
}
.info.code {
  /* border: 0; */
  position: relative;
}
.info.code span {
  position: absolute;
  right: 10px;
  top: 13px;
  background: #333;
  color: #fff;
  padding: 0 15px;
  line-height: 26px;
  border-radius: 3px;
}
.next {
  background: #cccccc;
  font-size: 16px;
  color: #fff;
  line-height: 44px;
  text-align: center;
  /* margin: 30px 15px; */
  /* border-radius: 3px; */
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
.next.nextbg {
  background: #333;
}
.introduce {
  margin: 15px;
}
.introduce .title {
  font-size: 11px;
  color: #666666;
  margin-bottom: 20px;
}
</style>



