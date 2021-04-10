<template>
  <div>
    <v-header>
      <div class="nav-tab2">
        <h3>{{headData}}</h3>
      </div>
      <p class="head_p" v-if="params==0||params==1" @click="save">保存</p>
    </v-header>
    <div class="user_set" :class="{paddingTop:(params==1)}">
      <div class="set_name flex-aic" v-if="params==0">
        <label for>昵称</label>
        <input type="text" placeholder="请输入昵称" v-model="userName" name value />
      </div>
      <div v-if="params==1" class="set_sex">
        <select v-model="currentSex">
          <option value="男">男</option>
          <option value="女">女</option>
        </select>
      </div>
      <div v-if="params==2" class="set_phoneBox">
        <div class="set_phone">
          <label for class="flex-center">
            <span class="icon_setPhone"></span>
            <span>+86</span>
            <span class="icon_bottom"></span>
          </label>
          <span>{{phone| phonestar}}</span>
        </div>
        <div class="set_phone flex-between">
          <label for class="flex-center">
            <span class="icon_setMsg"></span>
          </label>
          <input type="text" maxlength="6" placeholder="请输入验证码" v-model="ChangeCode" />
          <button type="button" @click="getCode(0)">{{valiWords}}</button>
        </div>
        <div class="setBtn" @click="setNext">下一步</div>
      </div>
      <div v-if="params ==3" class="set_phoneBox">
        <div class="set_phone">
          <label for class="flex-center">
            <span class="icon_setPhone"></span>
            <span>+86</span>
            <span class="icon_bottom"></span>
          </label>
          <input type="number" maxlength="13" v-model="newPhone" placeholder="请输入新手机号码" />
        </div>
        <div class="set_phone flex-between">
          <label for class="flex-center">
            <span class="icon_setMsg"></span>
          </label>
          <input type="text" maxlength="6" placeholder="请输入验证码" v-model="ChangeCodeNew" />
          <button type="button" @click="getCode(1)">{{revaliWords}}</button>
        </div>
        <div class="bing_newPhone" @click="bindNewPhone">完成绑定</div>
      </div>
      <div v-if="params==4" class="set_passwordBox">
        <div class="set_phone">
          <label for class="flex-center">
            <span class="icon_setPhone"></span>
            <span>+86</span>
            <span class="icon_bottom"></span>
          </label>
          <span>{{phone| phonestar}}</span>
        </div>
        <div class="set_phone flex-between">
          <label for class="flex-center">
            <span class="icon_setMsg"></span>
          </label>
          <input type="text" maxlength="6" placeholder="请输入验证码" v-model="pwdInfo.valicode" />
          <button type="button" @click="getCode(0)">{{valiWords}}</button>
        </div>
        <div class="set_phone flex-between">
          <label for class="flex-center">
            <span class="icon_setMsg"></span>
          </label>
          <input
            type="password"
            minlength="8"
            maxlength="16"
            placeholder="请设置8-16位数字和字母的密码"
            v-model="pwdInfo.password"
          />
        </div>
        <div class="set_phone flex-between">
          <label for class="flex-center">
            <span class="icon_setMsg"></span>
          </label>
          <input
            type="password"
            minlength="8"
            maxlength="16"
            placeholder="请再次输入密码"
            v-model="pwdInfo.repassword"
          />
        </div>
        <div class="setBtn" @click="changePwd()">确认</div>
      </div>
    </div>
    <CaptchaWithImg v-if="isCaptchaWithImg" :isPassValidate="isPassValidate" :captchaWithImgInfo="captchaWithImgInfo"
                    @changeIsPassValidate="isPassValidate = !isPassValidate" @cancel="cancelVerifyCaptchaCode" @verifyCode="verifyCaptchaCode" ></CaptchaWithImg>

  </div>
</template>
<script>
import { mapGetters } from "vuex";
import * as userApi from "../../common/api/user";
import { MD5, Checking } from "../../common/util";
import { AntiBrushCaptchaWithImg } from "../../common/anti-brush";
import CaptchaWithImg from "@/comps/CaptchaWithImg";
export default {
  data() {
    return {
      params: 0,
      headData: "",
      phone: 0,
      option: {},
      currentSex: "",
      valiWords: "获取验证码",
      revaliWords: "获取验证码",
      ChangeCode: "",
      newPhone: "",
      ChangeCodeNew: "",
      pwdInfo: {},
      userName: "",
      captchaWithImgInfo: {},
      isCaptchaWithImg: false,
      isPassValidate: true
    };
  },
  components: {
    CaptchaWithImg
  },
  computed: {
    // user() {
    //   return JSON.parse(localStorage.getItem('currentUser'))
    // }
    ...mapGetters({ user: "userInfo" })
  },
  mounted() {
    let _ = this,
      { user } = _;
    _.currentSex = user.sex == 0 ? "男" : "女";
    _.params = _.$route.params.type;
    _.phone = user.mobile;
    _.userName = user.username;
    let n = Number(_.params);
    switch (n) {
      case 0:
        _.headData = "设置昵称";
        break;
      case 1:
        _.headData = "设置性别";
        break;
      case 2:
        _.headData = "更换手机号";
        break;
      case 3:
        _.headData = "添加新号码";
        break;
      case 4:
        _.headData = "重置密码";
        break;
      default:
        break;
    }
    if (_.params != 2) {
      var ul = document.querySelector(".user_set");
      var r = screen.height;
      ul.style.height = r + "px";
    }
  },
  methods: {
    save() {
      this.setdata();
      console.log(this.option, "保存");
      let p = this.$route.params.type;
      let rexUsename = /^[a-zA-Z0-9\u4E00-\u9FA5_-]{2,15}$/;
      if (!rexUsename.test(this.option.username) && p == 0) {
        this.toast("只能填写中文，字母，数字，下划线，中划线，长度2至15");
        return;
      }

      userApi
        .UpdateInfo(this.option)
        .then(res => {
          if (res) {
            this.$store.dispatch("setUserInfo", res);
            // localStorage.setItem('currentUser', JSON.stringify(res))
            this.$router.go(-1);
            this.toast("设置成功");
          } else {
            this.toast("保存失败");
          }
        })
        .catch(err => {
          // console.log(err);
          // this.toast(err.msg);
          this.toast((e && e.msg) || "操作失败~");
        });
    },
    setNext() {
      console.log("点击下一步", this.ChangeCode);
      userApi
        .VerifyCaptcha({ validcode: this.ChangeCode })
        .then(res => {
          if (!res) {
            this.$router.replace("/user/set/" + 3);
          }
        })
        .catch(e => {
          console.log(e);
          this.toast((e && e.msg) || "无效的验证码");
        });
    },
    decpadleft(val) {
      if (val < 10) return "0" + val;
      else return val;
    },
    getCode(type) {
      console.log("获取验证码");
      let checkTypes = 2, _ = this,
        mobile = this.user.mobile;

      const option = {
        checktype: checkTypes,
        mobile: mobile
      };
      if (type == 1) {
        option.checktype = 3;
        option.mobile = "+86-" + this.newPhone;
        // 验证手机号
        if (!Checking(this.newPhone, "phone")) {
          this.toast("请输入合法的手机号码");
          return false;
        }
      }
      // console.log(option);
      this.validSendCaptchaInfo = option;
      this.chooseType = type;
      AntiBrushCaptchaWithImg((res, params) => {
        if (res === 'success') {
          _.isCaptchaWithImg = true;
          _.captchaWithImgInfo = params;
        }
        if (res === 'jump') {
          this.apiValidSendCaptcha({ ...this.validSendCaptchaInfo });
        }
        if (res === 'error') {
          _.toast("验证码获取失败", 'error');
        }
      })
    },
    apiValidSendCaptcha(params) {
      const _ = this;
      userApi.ValidSendCaptcha(params)
        .then(res => {
          if (!res) {
            console.log(res);
            let time_secs = 60;
            let tips_word = "";
            this.toast("发送成功");
            _.isCaptchaWithImg = false;
            _.isPassValidate = true;
            this.timeRun = setInterval(() => {
              if (time_secs > 1) {
                time_secs--;
                tips_word = "已发送" + this.decpadleft(time_secs) + "s";
                if (this.chooseType == 0) {
                  this.valiWords = tips_word;
                } else if (this.chooseType == 1) {
                  this.revaliWords = tips_word;
                }
              } else {
                if (this.chooseType == 0) {
                  this.valiWords = "再次发送";
                } else if (this.chooseType == 1) {
                  this.revaliWords = "再次发送";
                }
                clearInterval(this.timeRun);
                this.timeRun = null;
              }
            }, 1000);
          }
        })
        .catch(e => {
          _.isPassValidate = false;
          this.toast((e && e.msg) || "操作失败~");
        });
    },
    verifyCaptchaCode(prop) {
      this.apiValidSendCaptcha({ ...prop, ...this.validSendCaptchaInfo });
    },
    cancelVerifyCaptchaCode() {
      this.isCaptchaWithImg = false;
    },
    setdata() {
      let n = Number(this.params);
      // let token = this.userInfo.token
      let imageurl = this.user.imageurl;
      let sex = this.currentSex == "男" ? 0 : 1;
      console.log("sex", sex);
      if (n == 0) {
        this.option = {
          imageurl: imageurl,
          username: this.userName,
          sex: sex
        };
      } else if (n == 1) {
        this.option = {
          imageurl: imageurl,
          username: this.userName,
          sex: sex
        };
      }
      console.log(this.params);
      // username 用户昵称,imageurl:头像地址,sex:性别(0男 1女 2保密)
    },
    bindNewPhone() {
      if (!Checking(this.newPhone, "phone")) {
        this.toast("请输入合法的手机号码");
        return false;
      }
      if (Checking(this.ChangeCodeNew, "validcode")) {
        this.toast(Checking(this.ChangeCodeNew, "validcode"));
        return false;
      }
      var op = {
        mobile: "+86-" + this.newPhone,
        validcode: this.ChangeCodeNew
      };
      userApi
        .ChangeMobile(op)
        .then(res => {
          this.$store.dispatch("setUserInfo", res);
          // localStorage.setItem('currentUser', JSON.stringify(res))
          this.$router.go(-1);
        })
        .catch(e => {
          // console.log(e);
          // if (e && e.code == 1511544) {
          //   this.toast("请使用新手机号注册");
          // }
          this.toast((e && e.msg) || "操作失败~");
        });
    },
    changePwd() {
      let _ = this,
        { valicode, password, repassword } = _.pwdInfo || {};
      let check = Checking(valicode, "validcode");
      if (check) {
        this.toast(check);
        return false;
      }
      check = Checking(password, "password");
      if (check) {
        this.toast(check);
        return false;
      }
      // 验证密码是否相同
      if (repassword && password !== repassword) {
        this.toast("两次输入的密码不一致");
        return false;
      }
      check = Checking(repassword, "repassword");
      if (check) {
        this.toast(check);
        return false;
      }
      var op = {
        ValidCode: valicode,
        password: MD5(password)
      };
      // userApi
      //   .VerifyCaptcha({ ValidCode: valicode })
      //   .then(res => {
      //     if (!res) {
      userApi
        .UpdatePassword(op)
        .then(res => {
          if (res) {
            this.$store.dispatch("setUserInfo", res);
            // localStorage.setItem('currentUser', JSON.stringify(res))
            this.$router.go(-1);
          }
        })
        .catch(e => {
          // console.log(e);
          // if (e && e.code == 1511533) this.toast("无效的验证码");
          this.toast((e && e.msg) || "操作失败~");
        });
      //   }
      // })
      // .catch(e => {
      //   if (e && e.code == 1511533) {
      //     this.toast("无效的验证码");
      //   }
      // });
    }
  },
  watch: {
    "$route.params.type": function(val, old) {
      console.log(val, old);
      this.params = val;
    }
  }
};
</script>
<style scoped>
.paddingTop {
  padding-top: 10px;
}

.head_p {
  line-height: 48px;
  width: 48px;
  text-align: center;
}

.user_set {
  background: #f0f0f0;
}

.user_set > div {
  background: #fff;
  color: #444;
  padding-bottom: 30px;
}

.set_name {
  padding: 10px 0;
}

.set_name label {
  display: inline-block;
  width: 30%;
  padding-left: 10px;
}

.set_name input {
  display: inline-block;
  width: 70%;
}

.set_sex select {
  width: 100%;
  padding: 10px;
  border: none;
}

.set_sex option {
  padding: 10px;
  line-height: 50px;
}

.set_sex select:focus,
.set_sex option:focus {
  outline: none;
}

.set_phoneBox {
  width: 100%;
}

.setBtn {
  background: #333;
  color: #fff;
  width: 80%;
  height: 36px;
  margin: 50px auto 0;
  border-radius: 5px;
  line-height: 36px;
  font-size: 14px;
  text-align: center;
}

.set_phone {
  border-bottom: 1px solid #f0f0dd;
  padding: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}

.set_phone:nth-of-type(2) {
  justify-content: space-between;
}

.set_phone:nth-of-type(2) button {
  padding: 8px;
  font-size: 12px;
  border: none;
  background: #333;
  color: #fff;
  border-radius: 5px;
}
.set_phone input {
  width: 70%;
}
.icon_bottom {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-top: 4px solid #999;
  margin: 10px;
}
.bing_newPhone {
  width: 94%;
  margin: 0 auto;
  height: 40px;
  line-height: 40px;
  background: #333;
  color: #fff;
  font-size: 16px;
  text-align: center;
  margin-top: 40px;
  border-radius: 4px;
}
</style>
