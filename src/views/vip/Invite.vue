<template>
  <div class="invite" :class="{'ipx':getIsIphonex}">
    <div class="award flex-aic-btwn">
      <div class="plate flex-col-ctr">
        <span class="price">{{info.totalcommission||0}}</span>
        <span>累计奖励 (¥)</span>
      </div>
      <div class="plate flex-col-ctr">
        <span class="price">{{info.fans||0}}</span>
        <span>累计邀请 (人)</span>
      </div>
    </div>
    <div class="exc-code">
      <div class="flex-aic-btwn">
        <div class="icon flex-col-ctr">
          <img src="https://files.eyee.com/activity/vip/invite-step.png?c=1" alt />
        </div>
      </div>
      <div class="get-code">
        <div class="dec flex-center">{{info.openvip?"专属邀请码":"暂无邀请码"}}</div>
        <div class="code">
          <div class="has-code flex-col-ctr" v-if="info.openvip">
            <span class="cd">
              <input type="text" v-model="info.code" id="code_copy" readonly />
              {{info.code}}
            </span>
            <span class="copy flex-center" @click.stop="copyText">复制</span>
          </div>
          <div class="no-code flex-center" v-else>????</div>
        </div>
      </div>
    </div>
    <div class="btn" :class="{'ipx':getIsIphonex}" @click.stop="getaward">
      <div class="txt flex-center">{{info.openvip?'立即邀请拿奖励':'加入合伙人 获取邀请码'}}</div>
    </div>

    <share-modal :show.sync="showShare" :share-data="shareInfo">
      <!-- 分享朋友圈图片 -->
      <!-- <div class="circle-friend"></div> -->
    </share-modal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { RecommendInfo } from "@/utils/api/vip";
import { GetWeappQRCode } from "@/utils/api/base";

import ShareModal from "@/comps/ShareModal";

const ISDEV = process.env.NODE_ENV !== "production";

let _loader;
export default {
  components: { ShareModal },
  name: "VipInvite",
  computed: {
    ...mapGetters({
      user: "userInfo"
    }),
    loged() {
      return !!(this.user && this.user.uid);
    },
    getIsIphonex() {
      if (this.$root.ISIOS) {
        return !!(
          (screen.width == 375 && screen.height == 812) ||
          (screen.width === 414 && screen.height === 896)
        );
      }
    }
  },
  data() {
    return {
      showShare: false,
      shareInfo: {},
      info: {},
      recommendcode: this.$route.query.recommendcode || "" // 推荐人邀请码
    };
  },
  beforeMount() {
    this.setToolBar({ title: "邀好友做潮牌主理人" });
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
      _.$root.loging
        .then($ => {
          // console.log("登录返回信息", $);
          _.checkLogin(() => {
            _.mainreq();
          });
        })
        .catch(e => {
          console.error("query prams auto login error:", e);
          _.checkLogin(() => {
            _.mainreq();
          });
        });
    } else {
      _.checkLogin(() => {
        _.mainreq();
      });
    }
    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json).then(res => {
          _.mainreq();
        });
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
      const _ = this;
      let share = {};
      RecommendInfo(_.recommendcode)
        .then(res => {
          console.log("主接口", res);
          share = res.share || {};
          _.info = res;

          return GetWeappQRCode({
            path: ISDEV ? "pages/home/index" : "pages/vip/home",
            productid: res.code,
            ishyaline: false
          });
        })
        .then(res => {
          console.log("GetWeappQRCode res: ", res);
          if (res && res.picurl) share.poster = res.picurl;

          _.shareInfo = share;
        })
        .catch(e => {
          _.shareInfo = share;

          console.error(e);
        });
    },
    getaward() {
      let _ = this;
      _.checkLogin(() => {
        if (_.info.openvip) _.showShare = true;
        else _.$router.push(`/vip/prejoin`);
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
    copyText() {
      document.execCommand("Copy");
      var Url2 = document.getElementById("code_copy");
      Url2.select();
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.toast("复制成功！");
    }
    // doShare() {
    //   let _ = this
    //   _loader = _.$loader('正在调起分享···')
    //   let { shareInfo } = _
    //   _.javascriptBridge({
    //     name: 'callAppDirectlyShare',
    //     params: {
    //       sharecontent: shareInfo.content,
    //       sharetitle: shareInfo.title,
    //       xcxurl: shareInfo.xcxurl,
    //       xcxicon: shareInfo.xcxicon || '',
    //       xcxid: shareInfo.xcxid || 'gh_038ca9308eac',
    //       shareurl: '',
    //       type: 2,
    //       platform: 2,
    //       callbackname: '_shareCallBack'
    //     }
    //   })
    //   setTimeout(() => {
    //     _loader && _loader.close()
    //   }, 3000)
    // }
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
$color: #232323;
.invite {
  background: #f5f5f5
    url("https://files.eyee.com/activity/vip/bg-invite.png?c=1") 0 0 no-repeat;
  background-size: 100% auto;
  padding: 44.266vw 4vw 18.666vw 4vw;
  &.ipx {
    padding-bottom: 23.2vw;
  }
  .award {
    height: 24vw;
    background: #fff;
    border-radius: 4px;
    color: $color;
    font-size: $font14;
    margin-bottom: 3.2vw;
    .plate {
      flex: 1;
      position: relative;
      &:nth-child(1):after {
        content: "";
        position: absolute;
        width: 1px;
        height: 10.666vw;
        background: #e6e6e6;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .price {
        color: $color;
        font-size: 5.866vw;
        font-family: OswaldBold;
        margin-bottom: 0.8vw;
      }
    }
  }
  .exc-code {
    padding: 6.133vw 0 6.666vw;
    background: #fff;
    border-radius: 4px;
    .icon {
      margin-bottom: 6.133vw;
      padding: 0 2.666vw;
    }
    .get-code {
      padding: 4.8vw 8vw 5.866vw;
      margin: 0 8vw;
      border-radius: 2px;
      // background-color: transparent;
      background: url("https://files.eyee.com/activity/vip/motley.png") 0 0;
      background-size: auto auto;
      .dec {
        color: $color;
        font-size: 4.533vw;
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
        margin-bottom: 4vw;
      }
      .has-code {
        background: rgba(35, 35, 35, 1);
        border-radius: 2px;
        opacity: 0.7;
        color: #fff;
        padding: 3.2vw 0 4.533vw;
        .cd {
          font-weight: bold;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 6.9333vw;
          margin-bottom: 2.6666vw;
          line-height: 9.866vw;
          position: relative;
          input {
            display: block;
            padding: 0;
            margin: 0;
            opacity: 0;
            position: absolute;
            z-index: -999;
            left: -300vw;
          }
        }
        .copy {
          font-size: $font12;
          color: #f8f8fa;
          width: 17.0666vw;
          height: 6.133vw;
          background: #99989b;
          border-radius: 2px;
        }
      }
      .no-code {
        background: rgba(35, 35, 35, 1);
        border-radius: 2px;
        opacity: 0.7;
        color: #fff;
        width: 35.2vw;
        height: 12vw;
        margin: 0 auto;
        color: #fff;
        font-size: 5.333vw;
        letter-spacing: 4px;
      }
    }
  }
  .btn {
    background: #fff;
    padding: 2.66vw 4vw;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    transform: translateZ(0);
    box-shadow: 0px -2.66vw 4vw 0px rgba(0, 0, 0, 0.03);
    &.ipx {
      padding-bottom: 11.733vw;
    }
    .txt {
      background: $color;
      height: 13.333vw;
      border-radius: 2px;
      color: #ffeede;
      font-size: $font16;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
    }
  }
}
</style>