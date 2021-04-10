<template>
  <div class="footwearClub">
    <v-header class="flex-btwn" v-if="!$root.ISAPP && !$root.ISWX">
      <div class="nav-tab2 text2">
        响应潮友团
      </div>
      <img class="icon-share" @click="handleVisibleShareMsk(true)" src="/static/img/share.png" alt="" srcset="" />
    </v-header>
    <section class="container" v-if="css.containerShow">
      <div class="container-item">
        <div class="userInfo">
          <div>
            <img class="avatar" :src="responseData.teamleaderimage" alt="" />
          </div>
          <div class="userInfo-name">
            {{ responseData.teamleadername }}
          </div>
          <div class="userInfo-title text4">
            我正在创建我的潮友团
          </div>
          <div class="text1 userInfo-clubName">
            {{ responseData.teamname }}
          </div>
          <div class="userInfo-title text4">潮友团公告</div>
          <div class="userInfo-slogan text3">
            {{ responseData.teamdesc }}
          </div>
        </div>
      </div>

      <div class="container-item">
        <div class="club-title text2">
          当前响应人数：<span style="color:#fa2337">{{
            responseData.nowresponsenum
            }}</span>/{{ responseData.needresponsenum }}
        </div>
        <div class="avatar_container flex-aic" v-if="responseData.responderimagelist.length > 0">
          <div v-for="(item, index) in responseData.responderimagelist" :key="index">
            <img v-if="index < 5" :style="index === 4 ? 'margin-right:12px;' : ''" class="avatar" :src="responseData.responderimagelist[index]" alt="" srcset="" />
          </div>
          <span v-if="responseData.responderimagelist.length >= 5">...</span>
        </div>
        <!-- eslint-disable -->
        <div class="club-state text4" v-if="responseData.createstatus === 0">
          响应人数达到要求后，潮友团即成功创建，参与响应的用户将直接成为该团成员，响应的新用户不算邀新用户。
          响应倒计时结束前未满足要求人数，则创建失败。响应期间无法加入其它潮友团。
        </div>
      </div>
      <!-- 响应中 -->
      <div class="container-item" v-if="responseData.createstatus === 0">
        <div class="text2 flex-center">
          响应倒计时:
          <CountDown class="text-active" @callback="handleCountDownEnd" :target="responseData.residuetime" />
        </div>
        <div class="button button-fill" v-if="!responseData.isleader && !responseData.alreadyresponse" @click="handlePromptliResponse">
          立即响应
        </div>
        <div class="button button-fill button-finish" v-if="responseData.alreadyresponse && !responseData.isleader && !$root.ISAPP" @click="openAppClient">
          你已完成响应
          <span v-if="!$root.ISAPP" style="font-size:12px; font-weight:400;">（点击抢先下载斗牛APP体验）</span>
        </div>
        <div class="button" @click="handleVisibleShareMsk()">邀请好友响应</div>
      </div>
      <!-- 响应成功或者失败 -->
      <div class="container-item" v-if="
          responseData.createstatus === 1 || responseData.createstatus === 2
        ">
        <div class="text-active flex-center">
          {{
          responseData.createstatus === 1
          ? "该潮友团已创建成功！"
          : "该潮友团响应失败，未完成创建！"
          }}
        </div>
        <div class="button button-fill" @click="hanldeJoinClob" v-if="responseData.createstatus === 1">
          加入他的潮友团
        </div>
        <div class="button" v-if="!$root.ISAPP" @click="openAppClient">
          下载斗牛APP，查看更多潮友团
        </div>
      </div>
    </section>

    <mt-popup v-model="css.popupVisible" :closeOnClickModal="false">
      <div class="modal">
        <div class="modal-head"><i class="ico-x" @click="css.popupVisible = false" /></div>
        <div class="modal-title" v-if="modal.title">{{ modal.title }}</div>
        <div class="modal-content">{{ modal.message }}</div>
        <div ref="confirmButton" class="confirm_button">{{ modal.confirmButtonText }}</div>
      </div>
    </mt-popup>

    <mt-popup v-model="css.isShowShare" position="bottom">
      <div class="shareMsk" v-if="this.$root.ISAPP">
        <div class="shareMsk-close" @click="css.isShowShare = false">
          <img src="/static/img/black_close.png" alt="" srcset="" />
        </div>
        <div class="shareMsk-content">
          <div class="flex-center" @click="handleAppShare(2)">
            <img src="/static/imgs/share_wx.png" alt="" />
            微信好友
          </div>
          <div class="flex-center" @click="handleAppShare(1)">
            <img src="/static/imgs/share-wx-pyq.png" alt="" />
            微信朋友圈
          </div>
        </div>
      </div>
      <div v-if="this.$root.ISWX" @click="css.isShowShare = false" class="shareMsk-wx">
        <img class="shareMsk-wx-img" src="https://files.eyee.com/activity/redpacket/share_guide.png" alt="" srcset="" />
        <div class="shareMsk-wx-text">
          <div>点击右上角分享好友</div>
          <div>邀请好友响应</div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
/*eslint-disable*/
import { mapGetters } from "vuex";
import { DateDiff } from "@/common/util";
import CountDown from "@/components/CountDown";

import {
  FootwearClubResponse,
  FootwearClubJoin,
  FootwearClubResponseItem,
  FootwearClubResponseShare
} from "@/common/api/bull";
export default {
  components: {
    CountDown
  },
  data() {
    return {
      css: {
        isShowShare: false,
        containerShow: false,
        popupVisible: false
      },
      modal: {
        title: "",
        message: "",
        confirmButtonText: ""
      },
      responseData: {
        teamleadername: "", //"String"#团长名称
        teamleaderimage: "", //"String"#团长头像
        teamname: "", //"String"#潮友团名称
        teamlogo: "", //"String"#潮友团logo
        teamdesc: "", //"String"#潮友团口号/简介
        residuetime: "", //"Long"#响应剩余时间毫秒数
        nowresponsenum: "", //"Integer"#当前响应人数
        needresponsenum: "", //"Integer"#需要响应的人数
        responderimagelist: [], //头像列表
        alreadyresponse: "", //"Boolean"#当前用户是否已经响应 true已经响应 false还未响应
        createstatus: "", //"Integer"#当前潮友团的响应状态 0响应中 1响应成功 2响应失败
        isleader: "" //"Boolean"#当前用户是否为团长 true是 false不是
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    console.log("$route.query", this.$route.query);

    console.log(this.$root);
    if (this.$route.query.teamid) {
      this.teamid = this.$route.query.teamid;
      if (this.$root.loging) {
        this.$root.loging
          .then(() => {
            console.log("1");
            this.initData();
            this.setShareInfo();
          })
          .catch(() => {
            console.log("2");
            this.initData();
            this.setShareInfo();
          });
      } else {
        console.log("3");
        this.initData();
        this.setShareInfo();
      }
    } else {
      console.error("no id");
    }
  },
  methods: {
    setShareInfo() {
      //初始化微信分享
      FootwearClubResponseShare({ teamid: this.teamid })
        .then(res => {
          console.log("TCL: setShareInfo -> res", res);
          this.initShare({
            info: {
              title: res.title,
              img: res.icon,
              desc: res.content,
              url: res.url
            }
          });
          this.javascriptBridge({
            name: "getAppActivityShareContent",
            params: {
              sharecontent: res.content,
              sharepicurl: res.icon,
              shareurl: res.url,
              sharetitle: res.title,
              hideshareicon: false
            }
          });
        })
        .catch(err => {
          console.error(err);
        });
    },
    initData() {
      console.log("初始化页面数据");
      FootwearClubResponse({ teamid: this.teamid })
        .then(res => {
          console.log("TCL: initData -> res", res);
          this.responseData = res;
          this.css.containerShow = true;
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleAppShare(type) {
      FootwearClubResponseShare({ teamid: this.teamid }).then(res => {
        this.javascriptBridge({
          name: "callAppDirectlyShare",
          params: {
            shareurl: res.url,
            sharetitle: res.title,
            sharecontent: res.content,
            sharepicurl: res.icon,
            type: 2,
            platform: type //"分享平台，1：是分享到朋友圈，2：是分享给微信好友"
          }
        });
      });
    },
    async handleVisibleShareMsk(data) {
      if (this.$root.ISAPP) {
        this.css.isShowShare = true;
      } else if (this.$root.ISWX) {
        // this.$root.showLoadModal = true;
        this.css.isShowShare = true;
      } else {
        this.toast("请在微或者斗牛APP中打开");
      }
    },
    hanldeJoinClob() {
      //登录验证
      if (this.userInfo && this.userInfo.token) {
        //已经登录
        FootwearClubJoin({ teamid: this.teamid })
          .then(res => {
            //加入潮友团
            this.toast("加团成功 前往下载斗牛DoNew APP");
            setTimeout(() => {
              this.openAppClient();
            }, 1000);
          })
          .catch(err => {
            //加入潮友团失败提示
            if (err && err.msg == "已经加入该团") {
              this.toast("你已加入该潮友团，打开斗牛DoNew APP查看详情");
            } else if (err && err.msg == "已经加入其他潮友团") {
              this.toast("你已加入其它潮友团，打开斗牛DoNew APP查看详情");
            } else if (err && err.msg == "不是普通鞋头，无法加入潮友团") {
              this.toast("你已加入其它潮友团，打开斗牛DoNew App查看详情");
            } else {
              this.toast(err.msg);
            }
          });
      } else {
        this.toLogin();
      }
    },
    handleCountDownEnd() {
      console.log("倒计时结束");
      this.initData();
    },
    handlePromptliResponse() {
      //登录验证
      if (this.userInfo && this.userInfo.token) {
        //当前用户是否已经响应
        FootwearClubResponseItem({ teamid: this.teamid })
          .then(res => {
            console.log("TCL: handlePromptliResponse -> re", res);
            this.initData();
            if (res.responsestatus === 1) {
              this.toast(res.message);
            } else if (res.responsestatus === 2) {
              this.MessageBox({
                title: "响应成功",
                message: res.message,
                confirmButtonClass: "footwear-confirm-button",
                confirmButtonText: "分享响应链接"
              }).then(resMes => {
                if (resMes === "confirm") {
                  //分享
                  this.handleVisibleShareMsk();
                }
              });
              // this.initData();
            } else {
              this.MessageBox({
                title: "响应失败",
                message: res.message,
                confirmButtonClass: "footwear-confirm-button",
                confirmButtonText: "我知道了"
              }).then(resMes => {
                if (resMes === "confirm") {
                  console.log("响应失败");
                }
              });
              // this.initData();
            }
          })
          .catch(err => {
            console.log("TCL: handlePromptliResponse -> err", err);
          });
      } else {
        this.toLogin();
      }
    },
    toLogin() {
      this.toast("请先完成登录/注册");
      this.$router.push(`/login?teamid=${this.teamid}`);
    },
    MessageBox(msg) {
      this.modal = msg;
      this.css.popupVisible = true;
      return new Promise((resolve, reject) => {
        this.$refs.confirmButton.addEventListener("click", () => {
          this.css.popupVisible = false;
          resolve("confirm");
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$gray-23: #232323;
$gray-96: #969696;
$red-fa: #fa2337;

.text1 {
  font-size: 24px;
  font-weight: 600;
  color: $gray-23;
  line-height: 33px;
}

.text2 {
  font-size: 14px;
  font-weight: 600;
  color: $gray-23;
}

.text3 {
  font-size: 14px;
  font-weight: 400;
  color: $gray-23;
  line-height: 20px;
}

.text4 {
  font-size: 13px;
  font-weight: 400;
  color: $gray-96;
  line-height: 20px;
}

.text-active {
  font-size: 14px;
  color: $red-fa;
  font-weight: 600;
  line-height: 20px;
}

.footwearClub {
  background: #c82e2e;
}

.container {
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  background-image: url("/static/imgs/footwear_club/footwearclub_response_bg.png");
  background-repeat: no-repeat;
  background-size: contain;
  &-item {
    width: 92vw;
    padding: 25px;
    margin: 15px auto 0 auto;
    background: #ffffff;
    border-radius: 12px;
  }
  &-bg {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
  }
}

.userInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  div {
    margin-bottom: 3px;
    overflow: hidden;
  }
  &-name {
    color: #474747;
    font-weight: 600;
  }
  &-clubName {
    margin-bottom: 15px !important;
  }
}
.avatar {
  width: 10.6667vw;
  height: 10.6667vw;
  border-radius: 5.3333vw;
  overflow: hidden;
}

.avatar_container {
  padding-top: 19px;
  padding-bottom: 21px;
  img {
    margin-right: 4.5333vw;
  }
}

.club-state {
  white-space: pre-line;
}

.button {
  height: 50px;
  border-radius: 6px;
  border: 1px solid $red-fa;
  margin-top: 15px;

  font-size: 16px;
  font-weight: 600;
  color: $red-fa;

  display: flex;
  justify-content: center;
  align-items: center;

  &-fill {
    color: #ffffff;
    background: $red-fa;
  }
  &-finish {
    flex-direction: column;
  }
}

.icon-share {
  width: 14px;
  height: 14px;
  margin-right: 15px;
}
.shareMsk {
  width: 100vw;
  height: 62.1333vw;
  padding: 2.8vw 4vw;
  background: #ffffff;
  &-close {
    text-align: right;
    margin-bottom: 12.5333vw;
    overflow: hidden;
    img {
      width: 5.3333vw;
      height: 5.3333vw;
    }
  }
  &-content {
    display: flex;
    justify-content: space-around;
    img {
      width: 16vw;
      height: 16vw;
      margin-bottom: 2.9333vw;
    }
  }
  .flex-center {
    flex-direction: column;
  }
}
.shareMsk-wx {
  width: 100vw;
  height: 100vh;
  color: #ffffff;
  padding-top: 15vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  &-img {
    width: 15.4667vw;
    height: 25.8667vw;
    margin-right: 64px;
    margin-bottom: 15vw;
  }
  &-text {
    width: 100vw;
    overflow: hidden;
    font-size: 30px;
    font-weight: 600;
    text-align: center;
  }
}
.mint-popup {
  background: none;
}

.modal {
  width: 73.3333vw;
  min-height: 155px;
  background: #ffffff;
  border-radius: 0.5333vw;
  overflow: hidden;
  padding: 15px;
  position: relative;

  &-head {
    text-align: right;
  }

  &-title {
    color: #232323;
    font-size: 17px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 15px;
  }

  &-content {
    font-size: 14px;
    color: #646464;
    font-weight: 400;
    min-height: 40px;
    margin-bottom: 50px;
    overflow: hidden;
  }

  .confirm_button {
    background: #fa2337;
    border-width: 0;
    border-radius: 2px;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    padding: 10px 0;
    text-align: center;

    position: absolute;
    bottom: 0;
    left: 0;
    margin: 15px;
    width: calc(100% - 30px);
  }
}
</style>

