<template>
  <div>
    <v-header class="flex-btwn" v-if="!$root.ISAPP && !$root.ISWX">
      <div class="nav-tab2 text2">
        潮友团任务
      </div>
      <img
        class="icon-share"
        @click="handleVisibleShareMsk(true)"
        src="/static/img/share.png"
        alt=""
        srcset=""
      />
    </v-header>

    <section v-if="css.taskShow">
      <div class="task">
        <div class="task-head">
          <div class="task-head-title">{{ taskData.teamname }}</div>
          <div class="task-head-slogan">{{ taskData.description }}</div>
          <div class="task-head-boosInfo flex" v-if="taskData.nickname">
            <img
              class="task-head-boosInfo-avatar"
              :src="taskData.headurl"
              alt=""
              srcset=""
            />
            <div>
              <div class="task-head-boosInfo-name">{{ taskData.nickname }}</div>
              <div class="task-head-boosInfo-label flex-center">
                <img src="/static/imgs/footwear_club/icon_h5_flag.png" alt="" srcset=""> {{ taskData.teamname }} 团长
              </div>
            </div>
          </div>
        </div>

        <div class="task-content">
          <div class="task-content-title">
            我发布了<span style="color:#FA2337">现金</span>任务
          </div>
          <div class="task-content-product flex" v-if="taskData.type == 1 && taskData.productid">
            <div class="task-content-product-img flex-between">
              <img :src="taskData.productimage" alt="" srcset="" />
            </div>
            <div class="task-content-product-title">
              {{ taskData.productname }}
            </div>
          </div>
          <div>任务内容：{{ taskData.content }}</div>
          <div>任务时限：{{ taskData.timelimit }}小时</div>
          <div>任务奖励：￥{{ taskData.bonus }}</div>
          <div>任务数量有限，先到先得！</div>
          <div class="button button-fill" @click="handleGetTask">
            领取任务
          </div>
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
        <div
        v-if="this.$root.ISWX"
        @click="css.isShowShare = false"
        class="shareMsk-wx"
      >
        <img
          class="shareMsk-wx-img"
          src="https://files.eyee.com/activity/redpacket/share_guide.png"
          alt=""
          srcset=""
        />
        <div class="shareMsk-wx-text">
          <div>点击右上角分享好友</div>
        </div>
      </div>
     </mt-popup>
  </div>
</template>

<script>
import {
  FootwearClubTask,
  FootwearClubTaskGettask,
  FootwearClubJoin
} from "@/common/api/bull";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      css: {
        taskShow: false,
        isShowShare: false,
        popupVisible: false
      },
      modal: {
        title: "",
        message: "",
        confirmButtonText: ""
      },
      taskData: {
        title: "", // String  #分享标题
        content: "", // String #任务内容
        bottom: "", // String #卡券底部描述
        taskid: "", // String # 任务编号
        teamid: "", // String #团队编号
        type: "", // Integer #任务类型
        invitenum: "", // Integer#邀请新人数目
        timelimit: "", // Integer #活动持续时间
        bonus: "", // BigDecimal #任务奖励
        producttypedesc: "", // String #产品类型描述
        productid: "", // String #产品编号
        productname: "", // String #产品名称
        productimage: "", // String #产品图片 http://files.eyee.com/Shop/system/main/b9721902804947eca59191429727955f.jpg
        teamname: "", // String  #团名字胖虎的潮友团
        description: "", // String #潮友团描述
        nickname: "", // String # 团长昵称
        headurl: "" // Strinig #团长头像 https://s2.ax1x.com/2019/10/10/uTlRKI.png
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    console.log();
    if (this.$route.query.taskid) {
      this.taskid = this.$route.query.taskid;
      this.initData();
    } else {
      console.error("no id");
    }
  },
  methods: {
    initData() {
      if (this.$route.query.taskid) {
        FootwearClubTask({ taskid: this.taskid })
          .then(res => {
            console.log("TCL: initData -> res", res);
            this.taskData = res;
            this.initShare({ info: {
              url: res.share.url,
              desc: res.share.content,
              title: res.share.title,
              img: res.share.icon
            }});
            this.css.taskShow = true;
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        console.error("no taskid");
      }
    },
    handleVisibleShareMsk(data) {
      if (this.$root.ISWX) {
        // this.$root.showLoadModal = true;
        this.css.isShowShare = data
      } else {
        this.toast("请在微信中打开")
      }
    },
    MessageBox(msg) {
      this.modal = msg;
      this.css.popupVisible = true;
      return new Promise((resolve, reject) => {
        this.$refs.confirmButton.addEventListener('click', () => {
          this.css.popupVisible = false
          resolve('confirm')
        })
      })
    },
    handleGetTask() {
      // 登录验证
      if (this.userInfo && this.userInfo.token) {
        FootwearClubTaskGettask({ taskid: this.taskid })
          .then(res => {
            console.log("TCL: handleGetTask -> res", res);
            this.MessageBox({
              message: `领取成功，任务时限${this.taskData.timelimit}小时，快去斗牛APP完成任务！`,
              confirmButtonClass: "footwear-confirm-button",
              confirmButtonText: "打开/下载APP"
            }).then(res => {
              if (res === "confirm") {
                // APP交互
                this.openAppClient();
              }
            });
          })
          .catch(err => {
            console.log("TCL: handleGetTask -> err", err);
            if (err.code === 1511417) {
              // 未加入任何团
              this.MessageBox({
                message: `领取该任务需要加入${this.taskData.nickname}潮友团，请确认！`,
                confirmButtonClass: "footwear-confirm-button",
                confirmButtonText: "确认并领取"
              }).then(res => {
                if (res === "confirm") {
                  // 加入团
                  FootwearClubJoin({ teamid: this.taskData.teamid })
                    .then(res => {
                      console.log("TCL: handleGetTask加入成功 -> res", res);
                      this.handleGetTask();
                    })
                    .catch(err => {
                      // 加团失败
                      this.toast(err.msg);
                      console.log("TCL: handleGetTask加团失败 -> err", err);
                    });
                }
              });
            } else {
              this.MessageBox({
                message: err.msg,
                confirmButtonClass: "footwear-confirm-button",
                confirmButtonText: "我知道了"
              });
            }
          });
      } else {
        // 未登录，提示后跳转登录页面
        this.toast("请先完成登录/注册");
        this.$router.push("/login?id=123123");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$gray-23: #232323;
$gray-96: #969696;
$red-fa: #fa2337;

.text2 {
  font-size: 14px;
  font-weight: 600;
  color: $gray-23;
}

section {
  width: 100vw;
  height: calc(100vh - 48px);
  background: #ebebeb;
  overflow: hidden;
}

.task {
  width: 89.0667vw;
  // min-height: 133.3333vw;
  background: #fff;
  border-radius: 3.2vw;
  margin: 15.7333vw auto 0 auto;
  overflow: hidden;
  &-head {
    color: #ffffff;
    padding: 6.6667vw;
    min-height: 44.5333vw;
    background-image: url("/static/imgs/footwear_club//footwearClob_tast_bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    font-weight: 600;
    &-title {
      font-size: 20px;
    }
    &-slogan {
      font-size: 13px;
    }
    &-boosInfo {
      margin-top: 8vw;
      &-avatar {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        border: 2px solid #ffffff;
        margin-right: 11px;
      }
      &-name {
        font-size: 14px;
      }
      &-label {
        height: 20px;
        background: #ffb159;
        border-radius: 2px;
        padding: 2px 5px;
        font-size: 11px;
        img{
          width:12px;
          height:12px;
          margin-right: 6px;
        }
      }
    }
  }
  &-content {
    padding: 20px 25px 30px 25px;
    color: #232323;
    font-size: 14px;
    font-weight: 400;
    > div {
      margin-bottom: 10px;
    }
    &-title {
      font-size: 16px;
      font-weight: 600;
      color: #232323;
    }
    &-product {
      background: #f5f5f5;
      border-radius: 4px;
      height: 18.4vw;
      align-items: center;
      overflow: hidden;

      &-img {
        margin: 2px;
        width: 17.3333vw;
        height: 17.3333vw;
        overflow: hidden;
        background: #fff;
        margin-right: 2.6667vw;
      }
      &-title {
        width: 52.8vw;
        font-size: 12px;
        font-weight: 600;
      }
    }
  }
}

.button {
  height: 50px;
  border-radius: 6px;
  border: 1px solid $red-fa;
  margin-top: 20px;
  margin-bottom: 0 !important;

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
.mint-popup{
  background: none;
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
</style>

<style lang="scss">
.mint-msgbox .footwear-confirm-button {
  background: #fa2337;
  border-width: 0;
  border-radius: 2px;

  font-size: 14px;
  font-weight: 600;
}
.mint-msgbox-message {
  color: #646464;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
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