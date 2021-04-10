<template>
  <div class="team-up-container">
    <!-- 头部 -->
    <v-headerscopy v-if="!$root.ISAPP"
                   bg="luckDraw">
      <div class="nav-tab2">
        <h3 style="color: #000">组队抽取SSR</h3>
      </div>
    </v-headerscopy>
    <div>
      <!--      <div class="team-leader-info flex" v-if="!teamInfo.myself">-->
      <!--        <img class="leader-avatar" :src="teamInfo.avatar" alt="">-->
      <!--        <div>-->
      <!--          <div class="leader-name">{{teamInfo.nickname}}</div>-->
      <!--          <div class="invite-text">邀你免费抽取SSR！～</div>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="team-up-bg">
        <img :src="teamInfo.detailimage"
             alt="">
      </div>
      <!--    发起人视角/组队结果-->
      <div class="team-up-info">
        <div class="team-up-detail">
          <div class="flex-between team-up-info-top">
            <div>
              <div v-if="teamInfo.status === 2"
                   class="flex-center">
                <img class="icon-luck-success"
                     src="../../../assets/img/icon_luck_success.png" />
                <span class="text">组队成功</span>
              </div>
              <div v-if="teamInfo.status === 3"
                   class="flex-center">
                <img class="icon-luck-success"
                     src="../../../assets/img/icon_luck_error.png" />
                <span class="text">组队失败</span>
              </div>
              <div v-if="teamInfo.status === 1"
                   class="flex-center">
                <div class="time-group flex-center">
                  <div class="time">{{cutTime.H}}</div>
                  <div class="time-sign">:</div>
                  <div class="time">{{cutTime.m}}</div>
                  <div class="time-sign">:</div>
                  <div class="time">{{cutTime.s}}</div>

                </div>
                <span class="text">还差{{teamInfo.member-teamInfo.detail.length-1}}人组队成功</span>
              </div>
            </div>
            <img class="icon-toast"
                 @click="showToast = true"
                 src="../../../assets/img/icon_toast.png" />
          </div>
          <div class="team-up-info-bottom  flex-btwn flex-wrap">
            <div class="img-item"
                 v-for="(img, index) in teammateList"
                 :key="index">
              <img v-if="img"
                   class="avatar"
                   :src="img"
                   alt="">
              <img v-else
                   class="avatar"
                   src="../../../assets/img/icon_luck_add.png"
                   alt=""
                   @click="inviteTeammate">
            </div>
          </div>
        </div>
        <div class="flex-center"
             v-if="teamInfo.status === 1">
          <div class="team-up-button"
               @click="inviteTeammate">邀请好友加入队伍</div>
        </div>
      </div>
      <!--      <div class="flex-center" v-if="!teamInfo.myself">-->
      <!--        <div class="team-up-button join-button" @click="joinAndLottery">立即加入抽一次</div>-->
      <!--      </div>-->
      <div class="team-up-toast"
           v-if="showToast">
        <div class="toast-container">
          <div class="toast-info">
            <div class="title">答疑资讯台</div>
            <div class="detail">
              <div>1.若倒计时内没有完成规定人数的招募，组队失败，参与人的参与次数不退回</div>
              <div>2.幸运值影响后续抽取的奖品概率，幸运值越高获高阶奖品的概率越大</div>
              <div>3.抽取次数当日有效，请尽快抽取别浪费SSR的机会哦～</div>
            </div>
          </div>
          <div class="toast-button"
               @click="showToast = false">知道了</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { TeamInfo, BaseConfig, toJoin } from '@/common/api/active'
import { addZero } from '@/common/util'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      visible: false,
      teammateList: [],
      showToast: false,
      teamid: this.$route.params.id,
      teamInfo: {},
      cutTime: {},
      popupInfo: {
        text: '',
        btntxt: ''
      },
      goodid: ''
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    }),
    loged() {
      return !!(this.userInfo && this.userInfo.uid)
    }
  },
  created() {
    const _ = this
    const { goodid } = this.$route.query
    if (goodid) {
      this.goodid = goodid
    }
    window.callbacklogin = (json) => {
      if (json) {
        // _.getQueryParamUser(json).then(() => {
        //   _.getTeamInfo()
        // })
        var result
        result = JSON.parse(decodeURIComponent(json))
        localStorage.setItem('currentUser', JSON.stringify(result))
        window.location.reload()
      } else _.toast('获取登录信息失败~')
    }
    _.init()
    _.baseData()
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    toggleShow(type) {
      this[type] = !this[type]
    },
    init() {
      let _ = this
      if (_.$root.ISAPP) {
        if (_.userInfo && _.userInfo.token) {
          console.log('是app 一定登录,  banner    H5登录成功')
          _.getTeamInfo()
        } else {
          console.log('是app,从通知进入组队页面')
          if (_.$root.loging) {
            _.$root.loging
              .then(($) => {
                if (_.loged) {
                  console.log('app已经登录----')
                  _.getTeamInfo()
                } else {
                  console.log('app未登录----')
                  _.GoAppLogin()
                }
              })
              .catch((e) => {
                console.error('query prams auto login error:', e)
                _.GoAppLogin()
              })
          } else {
            _.GoAppLogin()
          }
        }
      } else {
        console.log(
          'h5--->',
          _.userInfo,
          _.userInfo.token,
          _.userInfo && _.userInfo.token
        )
        if (_.userInfo && _.userInfo.token) {
          _.getTeamInfo()
        } else {
          _.$router.push('/login')
        }
      }
    },
    GoAppLogin() {
      let _ = this
      let callAppLoginPageParams = {
        name: 'callAppLoginPage'
      }
      _.javascriptBridge(callAppLoginPageParams)
    },
    baseData() {
      BaseConfig().then((res) => {
        if (this.goodid) {
          this.teamshareinfo = res.teamagainshareinfo
        } else {
          this.teamshareinfo = res.teamshareinfo
        }
      })
    },
    getTeamInfo() {
      const _ = this
      const { teamid, goodid } = _
      let params = {}
      params.teamid = teamid
      if (goodid) {
        params.goodid = goodid
      }
      TeamInfo(params).then((res) => {
        _.teamInfo = res
        _.teammateList = [res.avatar, ...res.detail]
        if (_.teammateList.length !== res.member) {
          _.teammateList.length = res.member
        }
        if (_.timer) clearInterval(_.timer)
        if (res.myself && res.status === 1) {
          _.calcCutTime(res.time)
        }
      })
    },
    calcCutTime(time) {
      this.timer = setInterval(() => {
        let o = {
          s: Math.floor(time / 1000),
          m: Math.floor(time / 60000), // 1000*60
          H: Math.floor(time / 3600000), // 1000*60*60
          d: Math.floor(time / 86400000) // 1000*60*60*24
        }
        this.cutTime = {
          s: addZero(o.s % 60),
          m: addZero(o.m % 60),
          H: addZero(o.H),
          d: 0
        }
        if (time <= 0) {
          clearInterval(this.timer)
          this.getTeamInfo()
        } else {
          time -= 1000
        }
      }, 1000)
    },
    inviteTeammate() {
      let _ = this,
        { ISAPP } = _.$root,
        { teamid } = _
      /**
         * callAppDirectlyShare
         {
          "sharecontent":"分享内容",
          "sharepicurl":"分享图片地址",
          "shareurl":"分享链接",
          "sharetitle":"分享标题",
          "callbackname":"分享结果回调方法名",
          "xcxurl":"小程序的分享地址",
          "xcxicon":"小程序的封面图",
          "xcxid":"小程序的原始id",
          "type":"分享内容内型，1：是分享图片，2：是分享H5链接",
          "platform":"分享平台，1：是分享到朋友圈，2：是分享给微信好友"
        }
         */
      const shareimgUrl = this.goodid
        ? 'https://files.eyee.com/eyeeh5/img/lottery/wx_again_share.jpg?c='
        : 'https://files.eyee.com/eyeeh5/img/lottery/share_wx.jpg?c='
      const shareurl = this.goodid ? `/pages/subPage/lottery/team?teamid=${teamid}&goodid=${this.goodid}` : `/pages/subPage/lottery/team?teamid=${teamid}`
      let shareInfo = {
        sharetitle:
          this.teamshareinfo || 'homie我的队伍需要你加入，一起免费抽抽乐',
        xcxicon: shareimgUrl + new Date().getTime(),
        xcxid: 'gh_038ca9308eac',
        xcxurl: shareurl,
        type: 2,
        platform: 2
      }
      if (ISAPP) {
        _.javascriptBridge({
          name: 'callAppDirectlyShare',
          params: {
            ...shareInfo
          }
        })
      }
    },
    joinAndLottery() {
      const _ = this
      const { teamid } = _
      toJoin({ teamid })
        .then(() => {
          _.popupInfo.text = '是亲姐妹了，我已经成功了！'
          _.popupInfo.btntxt = '抽抽乐'
          _.visible = true
        })
        .catch((e) => {
          // code=1511404 message = "组队已结束"
          // code=1511407 message="是亲姐妹了，我已经成功了!"
          // code=1511401 message = "是亲姐妹了，我已经失败了!"
          // code=1511450 message = "每人每天可助力2次队伍"
          // code=1511451 message="你需要抽一次抽抽乐才可以加入队伍哦"

          _.popupInfo.text = e.msg
          _.popupInfo.btntxt = '抽抽乐'
          _.visible = true

          if (e && e.code == 1511401) {
            _.$store.dispatch('setTeamId', { teamid })
          }
        })
    }
  }
}
</script>
<style lang="scss">
body {
  background: #f5f5f5;
}
.team-leader-info {
  padding: 10px 16px 20px;
  background: #fff;
  .leader-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .leader-name {
    font-size: 16px;
    color: #646464;
    font-weight: bold;
    line-height: 34px;
  }
  .invite-text {
    font-size: 20px;
    font-weight: bold;
    color: #232323;
  }
}
.team-up-bg {
  font-size: 0;
  img {
    width: 100%;
    height: auto;
  }
}
.team-up-info {
  position: relative;
  top: -10.666vw;
}
.team-up-detail {
  background: #fff;
  border-radius: 5.3333vw;
  margin: 0 4.266vw 8vw;
  padding: 3.2vw 4.2666vw 3.2vw 4.2666vw;
}
.team-up-info-top {
  border-bottom: 0.5px solid #e6e6e6;
  padding-bottom: 3.2vw;
  .text {
    color: #646464;
    font-size: 3.7333vw;
    line-height: 7.4666vw;
    font-weight: bold;
  }
  .time-group {
    font-size: 3.4666vw;
    font-family: 'OswaldBold';
    margin-right: 3.2vw;
  }
  .time {
    display: inline-block;
    min-width: 6.1333vw;
    height: 6.9333vw;
    line-height: 6.9333vw;
    background: #000;
    border-radius: 1.6vw;
    color: #fff;
    text-align: center;
    padding: 0 1.0666vw;
  }
  .time-sign {
    display: inline-block;
    width: 3.2vw;
    text-align: center;
  }
}
.icon-toast {
  width: 4.266vw;
  height: 4.266vw;
}
.icon-luck-success {
  width: 4.266vw;
  height: 4.266vw;
  margin-right: 2.133vw;
}
.team-up-info-bottom {
  margin: 5.8666vw 0;
  .avatar {
    width: 14.4vw;
    height: 14.4vw;
    border-radius: 50%;
  }
  .img-item {
    height: 14.4vw;
  }
}
.team-up-button {
  background: #fa2337;
  border-radius: 21.3333vw;
  width: 68vw;
  line-height: 12.2666vw;
  font-size: 5.3333vw;
  color: #ffffff;
  text-align: center;
  font-weight: bold;
  animation: opacity-alt 1s infinite;
  margin-top: 40px;
}
@keyframes opacity-alt {
  0% {
    transform: scale(0.94);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.94);
  }
}
.team-up-toast {
  &::before {
    content: '';
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
  }
  .toast-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 4.8vw;
    overflow: hidden;
    width: 76vw;
  }
  .toast-info {
    padding: 6.6666vw 5.3333vw 5.3333vw;
    .title {
      color: #232323;
      font-size: 4.8vw;
      font-weight: bold;
      text-align: center;
      margin-bottom: 4vw;
    }
    .detail {
      font-size: 3.7333vw;
      color: #646464;
    }
  }
  .toast-button {
    text-align: center;
    color: #232323;
    font-weight: bold;
    font-size: 4.2666vw;
    line-height: 16vw;
    background: #f5f5f5;
  }
}
.teamPopup-wrapper {
  width: 76vw;
  height: 85.33vw;
  border-radius: 18px;
  background: url('https://files.eyee.com/eyeeh5/img/lottery/team_bg.png')
    no-repeat;
  background-size: contain;
  padding: 6.67vw 5.33vw;
  justify-content: flex-end;
}
.teamPopup-dec {
  font-size: 4.27vw;
  color: #232323;
  margin-bottom: 5.33vw;
}
.blodFont {
  display: inline-block;
  margin: 0 1.33vw;
  font-family: OswaldBold;
  font-weight: 600;
  font-size: 8vw;
  color: #232323;
}
.teamPopup-btn {
  width: 100%;
  height: 11.73vw;
  line-height: 11.73vw;
  text-align: center;
  background: #fa2337;
  border-radius: 30px;
  color: #fff;
  font-size: 4.27vw;
}
</style>
