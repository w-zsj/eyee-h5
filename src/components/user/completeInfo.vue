<template>
  <div class="login">
    <!-- <v-header v-if="!sexOrYear">
      <div class="nav-tab2" @click.stop="goSneakMall">跳过</div>
    </v-header>-->
    <!-- 新人注册成功 引导图 -->
    <!-- <div class="GuiFig" v-if="GuideFigure">
      <div class="img">
        <img :src="base.imageurl||base.defaultImg" />
        <span @click.stop="goSneakMall" class="close ico-X"></span>
        <div class="nowused flex-center" @click.stop="goSneakMall">去使用</div>
      </div>
    </div>-->
    <div class="form">
      <div class="log-meth com-color">
        <div class="title">设置个人信息</div>
        <div class="illustrate">完善信息，为你推荐更多专属内容</div>
      </div>
      <div>
        <div class="header flex-center">
          <!-- <img src="/static/img/login/camera.png" alt=""> -->
          <UserImage
            class="user_logo"
            :seletype="0"
            :UpgradeImg="UpgradeImg"
            :unupload="true"
            @upload="updHandle"
          ></UserImage>
        </div>
        <div class="user-name">
          <input type="text" v-model="userName" placeholder="取一个响亮的昵称" @keypress="keypress" />
        </div>
      </div>
      <!-- <div v-if="sexOrYear">
        <div class="sex flex-aic">
          <div class="man" :class="{'act':manGirl==0}" @click.stop="selectSex(0)"></div>
          <div class="girl" :class="{'act':manGirl==1}" @click.stop="selectSex(1)"></div>
        </div>
        <div class="user-name">
          <input type="text" v-model="userName" placeholder="请输入用户昵称" @keypress="keypress" />
        </div>
      </div>
      <div v-else>
        <div class="header flex-center">
          <UserImage class="user_logo" :seletype="0" :UpgradeImg="UpgradeImg"></UserImage>
        </div>
        <div class="page-picker-wrapper">
          <mt-picker :slots="slots" @change="onValuesChange" :visible-item-count="3"></mt-picker>
        </div>
      </div>-->
      <div class="btn act" @click="achieve">完成并登录</div>
    </div>
  </div>
</template>
<script>
import {
  Upload,
  UpdateInfo
  // Updatecommunityuser,
  // Getyearsandconstella
} from "../../common/api/user";
import UserImage from "../templates/user/UserImage";
import { mapGetters } from "vuex";
export default {
  components: { UserImage },
  data() {
    return {
      sexOrYear: true, // true 选择性别 昵称 false 填写年代 星座
      manGirl: null, // 性别 0 男 1 女 2 保密
      userName: "", //昵称
      years: "90后",
      constellation: "水瓶座",
      UpgradeImg: "",
      GuideFigure: false, // 新用户 注册成功 引导图判断
      slots: [
        {
          flex: 1,
          values: []
        },
        {
          divider: true,
          content: "-",
          className: "slot2"
        },
        {
          flex: 1,
          values: []
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      baseValue: "baseValue",
      user: "userInfo"
    })
    // base() {
    //   let _ = this,
    //     obj = {};
    //   if (_.baseValue.configs && _.baseValue.configs.newergiftpacks) {
    //     obj = JSON.parse(_.baseValue.configs.newergiftpacks);
    //   }
    //   obj.defaultImg = "https://files.eyee.com/eyeeh5/img/new_user_package.png";
    //   return obj;
    // },
    // isClcik() {
    //   let _ = this,
    //     bol = false;
    //   if (((_.manGirl == 0 || _.manGirl == 1) && _.userName) || !_.sexOrYear)
    //     bol = true;
    //   return bol;
    // }
  },
  mounted() {
    let _ = this,
      { user } = _;
    _.manGirl = user.sex;
    _.UpgradeImg = user.imageurl;
    _.userName = user.username;
  },
  methods: {
    updHandle(e) {
      // console.log("updHandle e: ", e);
      this.UpgradeImg = e;
    },
    selectSex(sex) {
      let _ = this;
      _.manGirl = sex;
      console.log("性别", _.manGirl);
    },
    keypress(event) {
      if (event.keyCode == 13) {
        //如果按的是enter键 13是enter
        event.preventDefault(); //禁止默认事件（默认是换行）
        this.achieve();
      }
    },
    achieve() {
      let _ = this,
        { manGirl: sex, UpgradeImg: imageurl, userName } = _;
      // if (_.sexOrYear) _.namesex();
      // else _.communityuser();
      if (!userName) {
        _.toast("给自己取个好听的名字吧~");
        return;
      }

      let req = null;
      // 如果UpdateInfo 接口报错  在utils.js 中会清除用户信息  而此时不需要清除用户信息
      sessionStorage.setItem("notClearserInfo", "1");
      if (imageurl.includes("data:image/"))
        req = Upload({
          stream: imageurl.split(",")[1]
        }).then(res => {
          // _.toast("头像上传成功~");
          imageurl = res.url;
          return UpdateInfo({ sex, imageurl, userName });
        });
      else req = UpdateInfo({ sex, imageurl, userName });

      req
        .then(res => {
          if (res) {
            _.$store.dispatch("setUserInfo", res);
            sessionStorage.removeItem("notClearserInfo");
            $log({ e: 'completeUserInfo',p:{imageurl:imageurl,username:userName,sex:sex,source:2}})
          }
          _.$router.back();
        })
        .catch(e => {
          $log({ e: 'completeUserInfo',p:{imageurl:'',username:'',sex:'',source:2}})
          if (e.code == 1511548)
            this.toast(
              "只能填写中文、字母、数字、下划线中划线，长度2至10个汉字或3至20个字母"
            );
          else this.toast((e && e.msg) || "");
        });
    },
    // communityuser() {
    //   let _ = this,
    //     params = {
    //       years: _.years || "90后",
    //       constellation: _.constellation || "水瓶座"
    //     };
    //   Updatecommunityuser(params).then(res => {
    //     // if (sessionStorage.getItem("backhistory") == 2) {
    //     //   _.$router.go(-1);
    //     //   return;
    //     // }
    //     let isnewuser = _.$route.query.isnewuser;
    //     if (isnewuser) _.GuideFigure = true;
    //     else {
    //       sessionStorage.getItem("backhistory") == 1
    //         ? _.$router.go(-3)
    //         : _.$router.go(-2);
    //     }
    //   });
    // },
    // namesex() {
    //   let _ = this;
    //   let params = {
    //     userName: _.userName,
    //     sex: _.manGirl || 0
    //     //   birthday: _.birthday || ""
    //   };
    //   if (_.manGirl == null) {
    //     _.toast("请选择性别~");
    //     return;
    //   }
    //   if (!_.userName) {
    //     _.toast("给自己取个有好听的名字吧~");
    //     return;
    //   }

    //   // 如果UpdateInfo 接口报错  在utils.js 中会清除用户信息  而此时不需要清除用户信息
    //   sessionStorage.setItem("notClearserInfo", "1");
    //   UpdateInfo(params)
    //     .then(res => {
    //       if (res) {
    //         this.$store.dispatch("setUserInfo", res);
    //         sessionStorage.removeItem("notClearserInfo");
    //         if (_.sexOrYear) {
    //           _.sexOrYear = false;
    //           _.getyear();
    //         }
    //       }
    //     })
    //     .catch(e => {
    //       console.log(e);
    //       if (e.code == 1511548)
    //         this.toast(
    //           "只能填写中文、字母、数字、下划线中划线，长度2至10个汉字或3至20个字母"
    //         );
    //       else this.toast((e && e.msg) || "");

    //       // this.toast('修改性别失败')
    //     });
    // },
    onValuesChange(picker, values) {
      console.log(picker.getSlotValue(1));
      this.years = values[0];
      this.constellation = values[1];
      //   if (values[0] > values[1]) {
      //     picker.setSlotValue(1, values[0]);
      //   }
    },
    // getyear() {
    //   Getyearsandconstella().then(res => {
    //     console.log("res======>>", res);
    //     let _ = this;

    //     if (res.yearslist && res && res.yearslist.length > 0) {
    //       let i = res.yearslist.findIndex(el => el === "90后");
    //       _.$set(_.slots, 0, {
    //         flex: 1,
    //         values: res.yearslist,
    //         defaultIndex: i
    //       });
    //     }
    //     if (res.constellationlist && res && res.constellationlist.length > 0) {
    //       let index = res.constellationlist.findIndex(el => el === "水瓶座");
    //       _.$set(_.slots, 2, {
    //         flex: 1,
    //         values: res.constellationlist,
    //         defaultIndex: index
    //       });
    //     }
    //   });
    // },
    goSneakMall() {
      let _ = this;
      _.GuideFigure = false;
      this.$router.go(-1);
      // _.$router.push("/sneaker/mall");
    },
    closemodel() {
      this.GuideFigure = false;
    }
  }
};
</script>

<style scoped lang="scss">
.login {
  padding: 0 5vw;
}
.nav-tab2 {
  width: 80%;
  text-align: right;
}
// .GuiFig {
//   position: fixed;
//   width: 100%;
//   height: 100%;
//   left: 0;
//   top: 0;
//   background: rgba(0, 0, 0, 0.5);
//   z-index: 999;
// }

// .GuiFig .img {
//   position: absolute;
//   width: 60%;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%, -50%);
// }
// .GuiFig .close {
//   position: absolute;
//   right: 1vw;
//   top: 17vw;
//   color: #fff;
//   width: 20px;
//   height: 20px;
//   text-align: center;
//   line-height: 30px;
// }
// .GuiFig .nowused {
//   position: absolute;
//   width: 80%;
//   margin: 0 auto;
//   background: #fa2337;
//   left: 50%;
//   bottom: 8vw;
//   transform: translateX(-50%);
//   height: 10.6vw;
//   color: #fff;
//   font-size: 16px;
//   border-radius: 4px;
// }
.form {
  margin: 108px 5.33vw;
  .log-meth {
    margin-bottom: 8vw;
  }
  .title {
    font-size: 8.533vw;
    font-weight: 900;
  }
  .illustrate {
    margin: 2.667vw auto;
    font-size: 3.733vw;
    // line-height: 20px;
  }
  .sex {
    .man {
      width: 80px;
      height: 80px;
      background: url("/static/img/login/sex_man.png") 0 0 no-repeat #f5f5f5;
      background-size: 100% 100%;
      border-radius: 50%;
      margin-right: 30px;
      &.act {
        background: url("/static/img/login/sex_man_act.png") 0 0 no-repeat;
        background-size: 100% 100%;
      }
    }
    .girl {
      width: 80px;
      height: 80px;
      background: #f5f5f5;
      border-radius: 50%;
      background: url("/static/img/login/sex_girl.png") 0 0 no-repeat #f5f5f5;
      background-size: 100% 100%;
      &.act {
        background: url("/static/img/login/sex_girl_act.png") 0 0 no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .user-name {
    height: 50px;
    background: #f0f0f0;
    line-height: 50px;
    padding-left: 10px;
    width: 100%;
    margin: 5.333vw auto;
    border-radius: 5px;
    input {
      margin: 0;
      padding: 0;
      background: none;
      width: 100%;
      height: 50px;
      line-height: 50px;
    }
  }
  .btn {
    height: 50px;
    background: #cdcdcd;
    color: #fff;
    text-align: center;
    line-height: 50px;
    border-radius: 5px;
    &.act {
      background: #fa2337;
    }
  }
}
.header {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #f5f5f5;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}
.user_logo {
  width: 26.667vw;
  height: 26.667vw;
  border-radius: 50%;
}
.page-picker-wrapper {
  margin-bottom: 30px;
}
</style>
