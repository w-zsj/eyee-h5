<template>
  <div class="edit_address">
    <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3>{{text.head}}</h3>
      </div>
    </v-header>
<!-- v-if="insq" -->
    <template >
      <section class="ea-reg" v-if="mustReg">
        <p>请填写本人联系方式，以便我们为您提供更好的服务</p>
        <div class="flex">
          <div class="ea-reg-form">
            <div class="flex-center input_box">
              <label for class="flex-aic" @click="goCountry()">
                {{countryCode}}
                <i class="arrow-suffix"></i>
              </label>
              <input type="number" v-model="reg.mobile" @input="mobileInput" placeholder="请输入手机号">
            </div>
            <div class="flex input_box">
              <input type="number" v-model="reg.validcode" placeholder="请输入验证码">
            </div>
          </div>
          <div class="flex-ctr-end">
            <button
              class="btn-send"
              :disabled="!canSend"
              @click="sendCode"
            >{{countDown?countDown:'获取验证码'}}</button>
          </div>
        </div>
      </section>

      <section>
        <div class="flex input_box">
          <label for>收货人</label>
          <input
            type="text"
            @input="inputReceiver"
            :value="relData.receiver"
            placeholder="请输入收货人的姓名"
          >
        </div>
        <div class="flex input_box">
          <label for>手机号码</label>
          <input type="number" v-model="relData.phone" placeholder="请输入收货人的手机号码">
        </div>
        <!-- <div class="flex input_box" @click="showModal(0,relData.country)">
        <label for="">国家地区</label>
        <input type="text" name="" v-model="relData.country" value="中国大陆" readonly>
        </div>-->
        <div class="flex input_box" @click="showModal(1,relData.city)">
          <label for>城市</label>
          <input type="text" v-model="relData.citys" placeholder="请选择城市" readonly>
          <p>
            <span class="rights_icon"></span>
          </p>
        </div>
        <div class="flex input_box">
          <label for>详情地址</label>
          <!-- <input type="text" v-model="relData.detailAddress" placeholder="请输入详情地址"> -->
          <input
            type="text"
            @input="inputAddr"
            :value="relData.detailAddress"
            placeholder="请输入详情地址"
          >
        </div>
        <!-- ========================== -->
        <!-- <div @click="addresstranSel">选择地区</div> -->
        <div v-show="showBaseModal" class="addressBg" @click="cancel">
          <transition name="addresstrans">
            <baseProvinceId class="addresstrans" v-show="showBaseModal"></baseProvinceId>
          </transition>
        </div>
        <!-- v-if="isshowDefout" -->
        <div class="page-part page-switch-padding">
          <p>设置为默认地址</p>
          <mt-switch v-model="defaultVal">
            <label></label>
          </mt-switch>
        </div>
        <!-- ========================== -->
        <div class="add_footer" @click="cofirmEdit">确定{{text.foot}}</div>
      </section>
    </template>

    <!-- <div v-else class="hint">
      <p>{{text.head}}请移步【斗牛】APP或<br>【斗牛app】小程序～</p>
      <button class="btn" @click="openAppClient">立即前往斗牛APP</button>
    </div> -->
    <CaptchaWithImg v-if="isCaptchaWithImg" :isPassValidate="isPassValidate" :captchaWithImgInfo="captchaWithImgInfo"
                    @changeIsPassValidate="isPassValidate = !isPassValidate" @cancel="cancelVerifyCaptchaCode" @verifyCode="verifyCaptchaCode" ></CaptchaWithImg>
  </div>
</template>
<script>
import { ENUM, Checking } from "../../common/util";
import { AntiBrushCaptchaWithImg } from "../../common/anti-brush";
import {
  AddAddress,
  UpdateAddress,
  ValidSendCaptcha,
  QQZoneBindMobile
} from "../../common/api/user";
import baseProvinceId from "../templates/baseProvinceId";
import { mapGetters } from "vuex";
import CaptchaWithImg from "@/comps/CaptchaWithImg";
import * as api from "@/common/api/user";
// import { Switch } from 'mint-ui'
const ls = window.localStorage;
const rgxMobile = /^(\+?0?\d{1,3})-?\d{9,11}$/;

const openDataKey = "FC_QZONE_OPENDATA";

export default {
  name: "page-switch",
  data() {
    return {
      text: { head: "编辑收货地址", foot: "修改" },
      reg: {
        mobile: "",
        validcode: ""
      },
      canSend: false,
      countDown: "",
      value1: false,
      addresstrans: false,
      defaultVal: false,
      relData: {},
      captchaWithImgInfo: {},
      isCaptchaWithImg: false,
      isPassValidate: true
    };
  },
  components: { baseProvinceId, CaptchaWithImg },
  beforeMount() {
    if (this.insq) {
      this.$store.dispatch("setUserInfo", {});
      this.doLogin();
    }
  },
  mounted() {
    // console.log(this.relData,'jjjj')
    let _ = this;
    if (_.doType == ENUM.editAddressType.add.val) {
      _.text = { head: "新增收货地址", foot: "添加" };
      _.$store.state.user.addUserData = {};
      _.relData = _.addUserData;
    } else {
      _.text = { head: "编辑收货地址", foot: "修改" };
      _.relData = _.editAddressData;
      _.defaultVal = _.editAddressData.isdefault;
    }

    _.doLogin();
  },
  methods: {
    doLogin() {
      let _ = this;
      if (_.insq && !_.user.token) {
        let query = _.$route.query;
        if (!!query.openid || !!window.mqq || window.INSQ) {
          let openData = window.OPEN_DATA
            ? { openid: window.OPEN_DATA.openid }
            : query;
          let old = JSON.parse(ls.getItem(openDataKey) || "{}");
          if (openData && openData.openid)
            ls.setItem(openDataKey, JSON.stringify(openData || ""));

          _.$store.dispatch("qqCheckAndLogin", {
            setJs: !window.mqq,
            old: old
          });
        }
      }
    },
    addresstranSel() {
      this.addresstrans = !this.addresstrans;
    },
    goCountry() {
      this.$router.push("/country");
    },
    mobileInput() {
      // console.log('mobileInput', this.reg.mobile)
      this.canSend = rgxMobile.test(this.reg.mobile);
    },
    sendCode() {
      let _ = this;
      const param = {
        mobile: _.countryCode + "-" + _.reg.mobile,
        checktype: 1
      };
      if (!rgxMobile.test(param.mobile)) {
        _.toast("请输入您的联系方式");
        return;
      }
      this.validSendCaptchaInfo = param;
      _.setCountDown(60);

      AntiBrushCaptchaWithImg((res, params) => {
        if (res === 'success') {
          _.isCaptchaWithImg = true;
          _.captchaWithImgInfo = params;
        }
        if (res === 'jump') {
          this.apiValidSendCaptcha({...this.validSendCaptchaInfo});
        }
        if (res === 'error') {
          _.toast("验证码获取失败");
        }
      })
      // SendCaptcha(param)
      //   .then(res => {
      //     _.toast('发送成功')

      //     // 重新检查下登录态
      //     _.doLogin()
      //   })
      //   .catch(e => {
      //     console.error('验证码发送失败', e)
      //     _.toast('发送失败')
      //   })
    },
    apiValidSendCaptcha(param) {
      let _ = this;
      ValidSendCaptcha(param)
        .then(res => {
          _.toast("发送成功");
          _.isCaptchaWithImg = false;
          _.isPassValidate = true;
          // 重新检查下登录态
          _.doLogin();
        })
        .catch(e => {
          console.error("验证码发送失败", e);
          _.isPassValidate = false;
          _.toast("发送失败");
        });
    },
    verifyCaptchaCode(prop) {
      this.apiValidSendCaptcha({ ...prop, ...this.validSendCaptchaInfo });
    },
    cancelVerifyCaptchaCode() {
      this.isCaptchaWithImg = false;
    },
    setCountDown(next) {
      let _ = this;
      _.canSend = next < 1;
      if (next < 1) {
        _.countDown = "";
        return;
      }
      _.countDown = next + "s后重试";
      setTimeout(() => {
        next--;
        _.setCountDown(next);
      }, 1000);
    },
    cofirmEdit() {
      // let rePhone = /^1[0-9][0-9]\d{8}$/
      if (this.doType == ENUM.editAddressType.add.val) {
        // 添加
        // if (Checking(this.relData.phone,'phone')) {
        this.AddressAdd(this.relData);
        // } else {
        //   this.toast('请输入正确的手机号')
        // }
      } else {
        // 修改
        // if (rePhone.test(this.relData.phone)) {
        this.AddressUpdate(this.relData);
        // } else {
        //   this.toast('请输入正确的手机号')
        // }
      }
    },
    showModal(t, data) {
      // t:0选择国家 t：1 选择城市
      this.$store.dispatch("selectCity", { type: 1, data: data, open: true });
    },
    AddressAdd(option) {
      let _ = this;

      const doAdd = () => {
        // 添加地址
        if (_.checkAll(option)) {
          var postData = _.setOption(option);
          console.log("添加地址", postData);
          AddAddress(postData)
            .then(res => {
              console.log(res);
              _.toast("添加成功");
              _.$router.go(-1);
            })
            .catch(err => {
              let opendata = JSON.parse(ls.getItem(openDataKey) || "{}");

              _.toast(err.msg + "：x-" + !!opendata.openid);
              console.log(err);
            });
        }
      };

      if (_.mustReg) {
        let reg = { ..._.reg };
        let err = "";
        if (!reg.mobile) err = "请输入您的联系方式";
        else if (!reg.validcode) err = "请输入验证码";
        else if (reg.validcode.length < 4) err = "请输入正确的验证码";
        if (err) {
          _.toast(err);
          return;
        }
        reg.mobile = _.countryCode + "-" + reg.mobile;
        // reg.id = _.quid
        // reg.registertypecode = ls.getItem('QZ_OPENID')

        console.log("QQZoneBindMobile", reg);
        QQZoneBindMobile(reg)
          .then(res => {
            console.log("QQZoneBindMobile res", res);
            _.$store.dispatch("setUserInfo", res.user);
            doAdd();
          })
          .catch(e => {
            e = e || {};
            console.error("QQZoneBindMobile error", e);
            if (e.code === 1511544) e.msg = "您输入的联系方式已被绑定";
            _.toast(e.msg || "绑定失败");
          });
      } else doAdd();
    },
    AddressUpdate(option) {
      // 修改地址
      console.log("修改地址0", option);
      if (this.checkAll(option)) {
        var postData = this.setOption(option);
        console.log("修改地址1", postData);
        UpdateAddress(postData)
          .then(res => {
            console.log(res);
            this.toast("修改成功");
            this.$router.go(-1);
          })
          .catch(err => {
            this.toast(err.msg);
            console.error(err);
          });
      }
    },
    setOption(option) {
      let params = {};
      params.isdefault = this.defaultVal;
      params.mobile = "+86-" + option.phone;
      params.country = option.country;
      params.receiver = option.receiver;
      params.address = option.citys + " " + option.detailAddress;
      if (option.addressid) {
        params.id = option.addressid;
      }
      if (option.idcard) {
        params.idcard = option.idcard;
      }
      if (option.cardfronturl) {
        params.cardfronturl = option.cardfronturl;
      }
      if (option.cardbackurl) {
        params.cardbackurl = option.cardbackurl;
      }
      return params;
    },
    checkAll(option) {
      var errmsg = null;
      var ph = rgxMobile.test(option.phone);
      if (!option.receiver) errmsg = "请输入收货人姓名";
      else if (!option.phone) errmsg = "请输入收货人手机号码";
      else if (!Checking(option.phone, "phone"))
        errmsg = "请输入正确的收货人手机号码";
      else if (!(option.citys && option.country)) errmsg = "请选择城市";
      else if (!option.detailAddress) errmsg = "请填写详情地址";
      else if (`${option.citys} ${option.detailAddress}`.length > 55)
        errmsg = "地址最多55个汉字哦";
      if (!errmsg) {
        return true;
      } else {
        this.toast(errmsg);
        return false;
      }
    },
    cancel() {
      this.$store.dispatch("selectCity", { open: false });
    },
    inputReceiver(e) {
      // console.log('===inputReceiver', e.target.value)
      this.relData.receiver = e.target.value;
    },
    inputAddr(e) {
      this.relData.detailAddress = e.target.value;
    }
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      user: "userInfo",
      countryCode: "selectCountryCode",
      showBaseModal: "showBaseModal",
      addUserData: "addUserData",
      editAddressData: "editAddressData"
    }),
    doType() {
      // 0 添加地址，1 编辑地址
      return parseInt(this.$route.params.type) || 0;
    },
    isshowDefout() {
      if (this.doType == ENUM.editAddressType.add.val) {
        return true;
      } else {
        return false;
      }
    },
    // user() {
    //   return JSON.parse(ls.getItem('currentUser') || '{}')
    // },
    mustReg() {
      return this.doType === 0 && this.insq && !this.user.mobileconfirmed;
    }
    // ,
    // relData() {
    //   if (this.doType == ENUM.editAddressType.add.val) {
    //     // 添加
    //     return this.addUserData
    //   } else {
    //     return this.editAddressData
    //     // 修改
    //   }
    // }
  }
};
</script>
<style scoped>
.hint {
  padding: 20% 8vw;
  text-align: center;
}
.hint button {
  width: 90%;
  line-height: 40px;
  background: #333;
  color: #fff;
  font-size: 16px;
  border-radius: 4px;
  border: none;
  outline: none;
  margin-top: 30px;
}

.page-part {
  position: relative;
  padding: 10px;
  border-bottom: 1px solid #eee;
  overflow: hidden;
}
.page-part p {
  float: left;
  font-size: 14px;
}
.page-part label {
  position: absolute;
  right: 0;
  top: 4px;
}
.addresstrans-enter-active,
.addresstrans-leave-active {
  transition: all 0.5s;
  /* bottom:0; */
}
.addresstrans-enter,
.addresstrans-leave-to {
  transform: translateY(100px);
  opacity: 0;
}
.addressBg {
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 100;
  font-size: 14px;
}
.addresstrans {
  position: fixed;
  height: 350px;
  background: #fff;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 100;
}
.mint-switch-input:checked + .mint-switch-core {
  border-color: #4cd964 !important;
  background-color: #4cd964 !important;
}
.edit_address {
  padding-bottom: 90px;
}
.edit_address .input_box {
  padding: 10px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.edit_address label {
  width: 30%;
}

.edit_address input {
  width: 65%;
  color: #666;
  font-size: 14px;
}

.ea-reg .input_box {
  padding-bottom: 5px;
}

.ea-reg {
  padding: 20px 10px;
  border-bottom: 10px solid #f1f1f1;
}
.ea-reg p {
  font-size: 13px;
  color: #666;
}
.ea-reg-form {
  width: 70%;
}
.ea-reg-form + div {
  width: 30%;
}

.arrow-suffix {
  margin-left: 5px;
  border-top: 6px solid #999;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}

.btn-send {
  background-color: #333;
  border-radius: 5px;
  border: none;
  outline: 0 none;
  color: #fff;
  font-size: 12px;
  width: 80px;
  height: 32px;
}
.btn-send:disabled {
  background-color: #999;
}
</style>
