<template>
  <div>
    <v-header>
      <div class="nav-tab2">
        <h3>账户设置</h3>
      </div>
    </v-header>
    <div class="user_account">
      <ul>
        <li>头像
          <section class="flex-center">
            <UserImage class="user_logo" :seletype="0"></UserImage>
            <p>
              <span class="rights_icon"></span>
            </p>
          </section>
        </li>
        <li @click="goSet(0)">昵称
          <section class="flex-center">
            {{localUserInfos.username}}
            <p>
              <span class="rights_icon"></span>
            </p>
          </section>
        </li>
        <li @click="goSet(1)">性别
          <section class="flex-center">
            {{localUserInfos.sex==0?'男':'女'}}
            <p>
              <span class="rights_icon"></span>
            </p>
          </section>
        </li>
      </ul>
      <ul class="opes_account">
        <li @click="goSet(4)">
          <em class="ico_userkey"></em>
          登录密码
          <section class="flex-center">
            <span>立即修改</span>
            <p>
              <span class="rights_icon"></span>
            </p>
          </section>
        </li>
        <li @click="goSet(2)">
          <em class="ico_usermobile"></em>
          手机号码
          <section class="flex-center">
            <span>{{localUserInfos.mobile| phonestar}}</span>
            <p>
              <span class="rights_icon"></span>
            </p>
          </section>
        </li>
      </ul>
      <ul class="opes_account">
        <li @click="QiyuProd">
          <em class="ico_service"></em>
          客服
          <span class="rights_icon"></span>
        </li>
        <router-link to="/user/address" tag="li">
          <em class="ico_address"></em>
          收货地址
          <p>
            <span class="rights_icon"></span>
          </p>
        </router-link>
        <router-link to="/user/about" tag="li">
          <em class="ico_about"></em>
          关于斗牛
          <p>
            <span class="rights_icon"></span>
          </p>
        </router-link>
        <router-link to="/user/feedback" tag="li">
          <em class="ico_feedback"></em>
          反馈
          <p>
            <span class="rights_icon"></span>
          </p>
        </router-link>
      </ul>
      <p class="logo_out" @click="loginOut()">退出登录</p>
    </div>
  </div>
</template>
<script>
import UserImage from "../templates/user/UserImage";
import { mapGetters } from "vuex";
import { QiyuProd } from "../../common/api/WyQiyu";
export default {
  components: {
    UserImage
  },
  computed: {
    // localUserInfos() {
    //   return JSON.parse(localStorage.getItem('currentUser'))
    // }
    ...mapGetters({ localUserInfos: "userInfo" })
  },
  mounted() {
    // console.log(this.userInfo)
    var ul = document.querySelector(".user_account");
    var r = screen.height;
    ul.style.height = r - 50 + "px";
  },
  methods: {
    goSet(n) {
      // n 0设置昵称 1设置性别 2设置手机 3更换手机
      this.$router.push("/user/set/" + n);
    },
    loginOut() {
      let option = {
        msg: "确定退出当前用户吗 ?",
        okText: "确定",
        ok: () => {
          this.logOut();
        }
      };
      this.confirm(option);
    },
    logOut() {
      // 埋点
      $log({ e: "logout", p: {}, t: 0, ext: 1 });
      this.$store.dispatch("setUserInfo", {});
      sessionStorage.setItem("IS_FIRST_OPEN", 1);
      // localStorage.removeItem('currentUser')
      this.$router.push("/");
    },
    QiyuProd() {

      QiyuProd.call(this);
    }
  }
};
</script>
<style scoped>
.user_account {
  padding: 4px 10px;
  background: #fff;
}
.user_account > ul {
  box-shadow: 0px 0px 1px 0px #d3d3d3;
  border-radius: 4px;
  padding: 0 5px;
  margin-bottom: 20px;
}

.user_account > ul li {
  height: 50px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  color: #666;
  font-size: 15px;
  border-bottom: 1px solid #f2f2f2;
}
.user_account > ul li:last-child {
  border-bottom: none;
}
.user_logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}
.user_account li p {
  margin-left: 15px;
}
.logo_out {
  position: fixed;
  bottom: 10px;
  width: 94%;
  left: 3%;
  height: 40px;
  line-height: 40px;
  background: #333;
  color: #fff;
  text-align: center;
  font-size: 16px;
  border-radius: 4px;
}
ul.opes_account > li {
  position: relative;
  padding-left: 25px;
}
ul.opes_account > li em {
  position: absolute;
  display: inline-block;
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: cover;
  left: 3px;
  top: 14px;
}
ul.opes_account > li em.ico_userkey {
  background-image: url(//files.eyee.com/mcdn/static/img/user/icon_key.png);
}
ul.opes_account > li em.ico_usermobile {
  top: 15px;
  background-image: url(//files.eyee.com/mcdn/static/img/user/icon_mobile.png);
}
ul.opes_account > li em.ico_service {
  background-image: url(/static/img/user/icon_service.png);
  background-size: 15px 15px;
  top: 5vw;
}
ul.opes_account > li em.ico_address {
  background-image: url(/static/img/user/icon_address.png);
  background-size: 12px 15px;
  top: 5vw;
}
ul.opes_account > li em.ico_about {
  background-image: url(/static/img/user/icon_about.png);
  background-size: 15px 15px;
  top: 5vw;
}
ul.opes_account > li em.ico_feedback {
  background-image: url(/static/img/user/icon_feedback.png);
  background-size: 15px 15px;
  top: 5vw;
}
</style>
