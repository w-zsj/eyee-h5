<template>
  <div class="vip-pj" :class="{rcd:isRcd,'ipx':getIsIphonex}">
    <i v-if="!isRcd" class="tri"></i>
    <!-- 开卡邀请码填写 -->
    <div class="invite-card" v-if="!isRcd">
      <div class="tit">潮牌合伙人数量有限，必须通过邀请码加入!</div>
      <div class="code flex-aic">
        <input type="text" placeholder="请输入邀请码" v-model="code" />
      </div>
      <div class="handle flex-col-ctr">
        <button class="open-vip flex-center" @click.stop="getOpen">立即加入</button>
        <button class="not-code flex-center" @click="toggleRcd">没有邀请码?</button>
      </div>
    </div>
    <!-- 推荐会员列表 -->
    <div class="rcd-list" v-else>
      <div v-if="rcdList&&rcdList.length>0">
        <div class="item flex-tops" v-for="(item,index) in rcdList" :key="index">
          <div class="header-icon">
            <img :src="item.imageurl" alt="">
          </div>
          <div class="user-info flex-col ">
            <span class="name ellipsis">{{item.nickname}}</span>
            <span class="fans">累计邀请：{{item.fanscount}}</span>
            <span class="wxcode flex-aic" v-if="item.wechatnumber">
              <em> 微信号：</em>
              <span class='ellipsis'>{{item.wechatnumber||''}}</span>
              <input type="text" v-model="item.wechatnumber" :id="'code_copy_'+index" readonly>
              <i @click.stop="copyText(index)">复制</i>
            </span>
          </div>
          <div class="join flex-center" @click.stop="joinVip(item)">一键加入VIP</div>
        </div>
      </div>
      <div class="no-data" v-else>
        <img src="https://files.eyee.com/eyeeh5/img/image_empty.png" alt />
        <p>附近暂无潮牌合伙人~</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { VipCheckCode, RecommendVipList } from "@/utils/api/vip";

// 作用  其他页面回退到本页面时  是显示开通页面 还是推荐页面
const storage = way => {
  switch (way) {
    case "getItem":
      return sessionStorage.getItem("VIP_ROUTER_BACK");
      break;
    case "removeItem":
      sessionStorage.removeItem("VIP_ROUTER_BACK");
      break;
    case "setItem":
      sessionStorage.setItem("VIP_ROUTER_BACK", "LEAVE");
      break;
  }
};
export default {
  name: "VipPreJoin",
  data() {
    return {
      isRcd: false,
      code: "",
      rcdList: []
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo"
    }),
    getIsIphonex() {
      if (this.$root.ISIOS) {
        return !!(
          (screen.width == 375 && screen.height == 812) ||
          (screen.width === 414 && screen.height === 896)
        );
      }
    },
    loged() {
      return !!(this.user && this.user.uid);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (storage("getItem")) {
        vm.isRcd = true;
        vm.toggleRcd();
        storage("removeItem");
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    let _ = this;
    if (_.isRcd && !storage("getItem")) {
      _.isRcd = false;
      _.setTitle("加入潮牌合伙人");
      next(false);
    } else
      next(() => {
        storage("removeItem");
      });
  },
  beforeMount() {
    this.setTitle("加入潮牌合伙人");
  },
  mounted() {
    let _ = this;
    document.body.classList.add("bg-color");
    if (!_.$root.ISAPP) {
      _.confirm({
        msg: "请在【斗牛DoNew】APP内操作?",
        okText: "立即前往",
        cancelBtn: 1,
        ok: () => {
          _.openAppClient();
          setTimeout(() => {
            _.$router.replace("/loadapp");
          }, 800);
        }
      });
    } else if (_.$root.loging) {
      _.$root.loging.catch(e => {
        console.error("query prams auto login error:", e);
        _.checkLogin();
      });
    } else _.checkLogin();
    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json);
      } else _.toast("登录失败~");
    };
    // 隐藏分享按钮
    _.javascriptBridge({
      name: "getAppActivityShareContent",
      params: {
        hideshareicon: true
      }
    });
  },
  methods: {
    mainreq() {
      let _ = this;
      RecommendVipList()
        .then(res => {
          console.log("获取推荐列表", res);
          if (res && res.length) _.rcdList = res;
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 立即开通
    getOpen() {
      let _ = this,
        code = _.code;
      code = code.replace(/\s/gi, "");
      _.checkLogin(() => {
        if (code) {
          VipCheckCode({ code })
            .then(res => {
              _.$router.replace(`/vip/join?via=${code}`);
            })
            .catch(e => {
              console.error(e);
              _.toast((e && e.msg) || "邀请码不正确");
            });
        } else _.toast("请输入邀请码");
      });
    },
    toggleRcd() {
      const _ = this;
      _.checkLogin(() => {
        _.isRcd = true;
        _.setToolBar({
          title: "推荐附近潮牌合伙人",
          bgcolor: "#ffffff",
          textcolor: "#232323"
        });
        _.mainreq();
      });
    },
    joinVip(item) {
      let _ = this;
      storage("setItem");
      _.checkLogin(() => {
        if (item.invitcode) {
          _.$router.replace(`/vip/join?via=${item.invitcode}`);
          setTimeout(() => {
            storage("removeItem");
          }, 1000 * 60);
        }
      });
    },
    checkLogin(call = () => {}) {
      let _ = this;
      if (_.loged) call();
      else {
        _.confirm({
          title: "登录提示",
          msg: "请登录后重试~",
          okText: "前往登录",
          cancelText: "容我想想",
          ok: () => {
            _.javascriptBridge({
              name: "callAppLoginPage",
              params: { callbackname: "_appLoginCallback" }
            });
          }
        });
      }
    },
    copyText(index) {
      document.execCommand("Copy");
      var Url2 = document.getElementById("code_copy_" + index);
      Url2.select();
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.toast("复制成功！");
    },
    setTitle(title) {
      this.setToolBar({
        title,
        bgcolor: "#232323",
        textcolor: "#ffffff"
      });
    }
  },
  destroyed() {
    document.body.classList.remove("bg-color");
  }
};
</script>
<style>
body.bg-color {
  background: #f5f5f5 !important;
}
</style>
<style lang="scss" scoped>
$font12: 3.2vw;
$font13: 3.4666vw;
$font14: 3.733vw;
$font16: 4.266vw;
input,
input:focus {
  list-style: none;
  outline-style: none;
  background: none;
  padding: 0;
  margin: 0;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  -webkit-appearance: none;
  caret-color: #646464;
}
input::-webkit-input-placeholder {
  color: #b4b4b4;
  font-size: $font16;
}
.vip-pj {
  // min-height: 100vh;
  background: #f5f5f5;
  padding: 0 4vw;
  overflow: hidden;
  position: relative;
  &.ipx {
    padding-bottom: 9.0666vw;
  }
  &:not(.rcd) {
    i {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 48.5333vw;
      background: linear-gradient(
        360deg,
        rgba(70, 69, 69, 1) 0%,
        rgba(35, 35, 35, 1) 100%
      );
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
      &:before,
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0;
        height: 0;
        border-width: 0.8vw 0 0 4vw;
        border-color: transparent #f5f5f5;
        border-style: solid;
      }
      &::after {
        content: "";
        left: auto;
        right: 0;
        border-width: 0 0 0.8vw 4vw;
        border-color: #f5f5f5 transparent;
      }
    }
  }
  .invite-card {
    margin-top: 8vw;
    width: 100%;
    padding: 8vw 6.666vw;
    background: rgba(255, 255, 255, 1);
    border-radius: 1.6vw;
    position: relative;
    z-index: 2;
    .tit {
      color: #232323;
      font-size: 4.8vw;
      text-align: left;
      margin-bottom: 4vw;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
    }
    .code {
      height: 13.3333vw;
      margin-bottom: 6.666vw;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
      label {
        font-size: 3.733vw;
        width: 14.933vw;
      }
      input {
        height: 100%;
        background: #f5f5f5;
        padding-left: 4vw;
        flex: 1;
        border-radius: 2px;
        font-size: $font16;
      }
    }
    .handle {
      button {
        height: 13.3333vw;
        border-radius: 2px;
        border: 1px solid rgba(35, 35, 35, 1);
        color: #232323;
        font-size: $font16;
        background: #fff;
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
        width: 100%;
        margin-bottom: 4vw;
        &.open-vip {
          color: #FFEEDE;
          background: linear-gradient(
            360deg,
            rgba(70, 69, 69, 1) 0%,
            rgba(35, 35, 35, 1) 100%
          );
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
        }
      }
    }
  }
  .rcd-list {
    margin-top: 4vw;
    .item {
      margin-bottom: 2.66vw;
      padding: 4.266vw;
      background: #fff;
      border-radius: 4px;
      font-size: $font12;
      color: #646464;
    }
    .header-icon {
      width: 18.133vw;
      height: 18.133vw;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid #e6e6e6;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .user-info {
      width: 40.66vw;
      margin-left: 2.66vw;
      line-height: 18px;
      margin-top: 0.8vw;
      .name {
        font-size: $font16;
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
        margin-bottom: 2.66vw;

        width: 40.66vw;
        display: block;
      }
      // .fans {
      //   margin-bottom: 0.533vw;
      // }
      .wxcode {
        position: relative;
        em {
          width: 34%;
          white-space: nowrap;
        }
        span {
          max-width: 50%;
        }
        input {
          position: absolute;
          z-index: -999;
        }
        i {
          // position: absolute;
          padding: 0.9327vw 2.33275vw;
          display: inline-block;
          // right: -2.133vw;
          // top: 50%;
          transform: scale(0.75);
          background: #f5f5f5;
          font-size: $font12;
          border-radius: 2px;
          white-space: nowrap;
        }
      }
    }

    .join {
      // width: 83px;
      padding: 1.6vw 2.133vw;
      // height: 30px;
      background: rgba(35, 35, 35, 1);
      border-radius: 2px;
      color: #ffeede;
      font-size: $font12;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
      white-space: nowrap;
    }
  }
}
</style>