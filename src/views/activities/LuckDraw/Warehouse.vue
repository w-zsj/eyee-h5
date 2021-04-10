<template>
  <div class="wrapper">
    <!-- 头部 -->
    <v-headerscopy v-if="!$root.ISAPP"
                   bg="luckDraw">
      <div class="nav-tab2">
        <h3 style="color: #000;font-weight: 600;">积存柜</h3>
      </div>
    </v-headerscopy>
    <div v-if="productList.length">
      <div class="productList-wrapper">
        <div class="productList">
          <div class="productList-top flex flex-between">
            <div class="user-info flex">
              <img :src="user.imageurl"
                   class="user-img">
              <span class="user-name">{{user.username}}</span>
            </div>
            <div class="btn-group flex">
              <div class="btn-item">
                <div class="btn-content-time"
                     @click="changeValue('createdat')"><span :class="createdat == 1?'up':'down'"></span>{{createdat == 1? '时间正序': '时间倒序'}}</div>
              </div>
              <div class="btn-item btn-content-checkall"
                   @click="changeCheck">
                {{allcheck?'取消全选':'全选商品'}}
              </div>
            </div>
          </div>

          <div class="flex flex-wrap itemLsit-wrapper flex-between">
            <div v-for="(item, index) in productList"
                 :key="'product'+index"
                 class="item-wrapper"
                 :class="item.lockd?'lock-item':''"
                 @click="chooseGoods(item)">
              <div class="item-img-wrapper flex flex-center">
                <div class="action flex flex-between">
                  <div class="grade">
                    {{item.goodslevel}}
                  </div>

                </div>
                <img :src="item.image"
                     class="item-img">
              </div>
              <div class="flex flex-col word-wrapper">
                <p class="item-title ellipsis-2">{{item.goodsname}}</p>
                <div class="item-quantity flex flex-between">
                  拥有数量: {{item.count}}
                  <i class="default-circle"
                     :class="{'act-cirlce': item.ischeck || item.lockd}"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-wrapper flex fix-btm">
        <div class="footer-againdraw"
             :class="isdrawrenew || (!isdrawrenew && iscontinue) ?'':'disable'"
             @click="toggleShow">我要重抽</div>
        <div class="footer-btn"
             :class="[!iscontinue?'disable':'']"
             @click="toRoute('/activity/confirmOrder')">
          提货
        </div>
      </div>
    </div>
    <div v-else
         class="empty">
      <img src="http://files.eyee.com/mcdn/img/img/image_empty.png"
           width="200vw"
           heihgt="auto">
    </div>
    <Popup :visible="visible"
           @cancel="toggleShow">

      <div class="contentWrapper flex flex-col flex-center">
        <img src="https://files.eyee.com/eyeeh5/img/lottery/again_bg.png"
             class="contentWrapper-header"
             width="100%"
             height="auto">
        <div>
          <p class="contentWrapper-txt">邀请 <span class="contentWrapper-blod">{{this.bannerInfo.member - 1}}</span> 名{{this.bannerInfo.newuser? '新用户': '好友'}}即可消耗当前物品所在系列的重抽次数（注意抽取是随机事件，请知悉）。</p>
          <div class="contentWrapper-btn"
               @click="inviteNow">已阅，立即邀请</div>
        </div>

      </div>
    </Popup>
  </div>
</template>

<script>
import { DrawStock, DrawActBanner, Invitation } from '@/common/api/active'
import { mapMutations, mapGetters } from 'vuex'
import Popup from './comps/Popup'
export default {
  name: 'Warehouse',
  components: { Popup },
  data() {
    return {
      bannerInfo: {},
      visible: false,
      allcheck: false,
      createdat: 1,
      productList: [],
      iscontinue: false,
      isdrawrenew: false,
      goodid: ''
    }
  },
  computed: {
    ...mapGetters({ user: 'userInfo' }),
    loged() {
      return !!(this.user && this.user.uid);
    }
  },
  created() {
    const _ = this
    if (this.$root.ISAPP) {
      if (_.$root.loging) {
        _.$root.loging
          .then(($) => {
            this.getDetail()
          })
          .catch((e) => {
            this.getDetail()
            console.error('query prams auto login error:', e)
          })
        return;
      } else {
        this.GoAppLogin()
      }
    } else {
      if (!this.loged) {
        this.$router.push('/login')
      }
    }
    this.getDetail()
    console.log('userInfo -----', this.user)
    window.callbacklogin = (json) => {
      if (json) {
        _.toast('登录成功~')
        _.getQueryParamUser(json)
        _.getDetail()
      } else _.toast('获取登录信息失败~')
    }
  },
  mounted() {
    this.setToolBar({
      title: '积存柜',
      bgcolor: '#f5f5f5',
      textcolor: '#323232'
    })
  },
  methods: {
    ...mapMutations({ upreward: 'UPDATE_REWARDLIST' }),
    // 立即邀请
    inviteNow() {
      Invitation({ goodid: this.goodid })
        .then((res) => {
          console.log('立即邀请 ===>', res)
          if (res) {
            this.$router.push({
              path: '/activity/teamup/' + res.teamid,
              query: {
                goodid: this.goodid
              }
            })
          }
        })
        .catch((err) => {
          console.error('立即邀请 ===>', err)
        })
    },
    islogin() {
      const _ = this
      if (!this.loged) {
        _.confirm({
          title: '登录提示',
          msg: '请登录后重试~',
          okText: '前往登录',
          cancelText: '容我想想',
          ok: () => {
            if (ENV.ua.eyee) {
              this.GoAppLogin()
            } else if (ENV.ua.mini) {
              wx.miniProgram.navigateTo({
                url: '/pages/other/bind'
              })
            } else _.$router.push('/login')
          }
        })
        return
      } else {
        this.getDetail()
      }
    },
    // app 登录
    GoAppLogin() {
      let _ = this
      let callAppLoginPageParams = {
        name: 'callAppLoginPage',
        params: { callbackname: 'callbacklogin' }
      }
      _.javascriptBridge(callAppLoginPageParams)
    },
    goto() {
      this.openAppClient()
    },
    toggleShow() {
      let body = document.getElementsByTagName('body')[0]
      if (!this.visible) {
        const lockindex = this.productList.findIndex((ele) => ele.lockd)
        if (lockindex > -1) {
          this.goodid = this.productList[lockindex].id
        } else {
          let chooseArr = []
          let index
          this.productList.forEach((ele, dex) => {
            if (ele.ischeck) {
              chooseArr.push(ele)
              index = dex
            }
          })
          if (!chooseArr.length) {
            this.toast('请先选择一个物品')
            return
          } else if (chooseArr.length > 1) {
            this.toast('只能一个一个来哦!')
            return
          }
          this.goodid = this.productList[index].id
        }

        DrawActBanner({ goodid: this.goodid })
          .then((res) => {
            console.log('获取组队状态 ===>', res)
            this.bannerInfo = Object.assign({}, res)
            if (!res.sponsor) {
              body.classList.add('body-fixed')
              this.visible = !this.visible
            } else {
              this.$router.push({
                path: '/activity/teamup/' + res.teamid,
                query: {
                  goodid: this.goodid
                }
              })
            }
          })
          .catch((err) => {
            this.toast(err.msg)
            console.error('获取组队状态 ===>', err)
          })
      } else {
        body.classList.remove('body-fixed')
        this.visible = !this.visible
      }
    },
    changeCheck() {
      this.productList = this.productList.map((ele) => {
        if (this.allcheck) {
          ele.ischeck = false
        } else {
          ele.ischeck = true
        }
        return ele
      })
      this.allcheck = !this.allcheck
      this.iscontinue = this.allcheck
    },
    toRoute(path) {
      let rewardList = []
      this.productList.forEach((ele) => {
        if (ele.ischeck && !ele.lockd) {
          ele.extraquantity = ele.count
          rewardList.push(ele)
        }
      })
      if (rewardList.length) {
        this.upreward(rewardList)
        this.iscontinue = true
      } else {
        this.iscontinue = false
        this.toast('请先选择提货商品')
        return
      }

      this.$router.push('/activity/confirmOrder')
    },
    chooseGoods(item) {
      if (item.lockd) return
      item.ischeck = !item.ischeck
      let rewardList = []
      this.productList.forEach((ele) => {
        if (ele.ischeck) {
          ele.extraquantity = ele.count
          rewardList.push(ele)
        }
      })
      if (rewardList.length) {
        this.iscontinue = true
      } else {
        this.iscontinue = false
      }
    },
    getDetail() {
      const _ = this
      const { createdat } = _
      DrawStock({ createdat })
        .then((res) => {
          if (res && res.length) {
            _.productList = res.map((ele) => {
              if (ele.lockd) {
                _.isdrawrenew = true
              }
              ele.ischeck = false // 是否选中
              return ele
            })
          }
        })
        .catch((err) => {
          console.log('积存仓详情报错 ===> ', err)
        })
    },
    changeValue(type, value) {
      if (type === 'createdat') {
        if (this[type] === 1) {
          this[type] = 2
        } else {
          this[type] = 1
        }
        this.productList.reverse()
      } else {
        this[type] = value
      }
    }
  }
}
</script>

<style>
.body-fixed {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
.fix-body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.wrapper {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  overflow: hidden;
  padding-bottom: 29.6vw;
}
.productList-wrapper {
  width: 100%;
  min-height: 519px;
  padding: 0 4vw;
}
.productList-bg {
  width: 100%;
  height: 100%;
  padding: 2.67vw;
  background: linear-gradient(180deg, #1c2022, #191d20);
  position: relative;
  border-radius: 8px;
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.5) inset;
  z-index: 2;
}
.productList {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  position: relative;
}
.productList-content-bg1 {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(
    116deg,
    #939495 18%,
    rgba(31, 42, 45, 0.54) 33%,
    rgba(167, 167, 167, 0.01) 45%
  );
  border-radius: 6px;
  padding: 0.33vw;
  opacity: 0.2;
  z-index: -1;
}

.productList-content-bg2 {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 6px;
  transform: translate(-50%, -50%);
  opacity: 0.2;
  background: linear-gradient(
    131deg,
    rgba(249, 249, 249, 0.81) 3%,
    rgba(250, 250, 250, 0.52) 9%,
    rgba(255, 255, 255, 0.15) 16%,
    rgba(202, 202, 202, 0) 18%,
    rgba(0, 0, 0, 0) 34%
  );
  z-index: -1;
}
.productList-top {
  width: 100%;
  padding: 2.67vw 0;
}
.user-info {
  font-size: 3.73vw;
  font-weight: 600;
  color: #cacaca;
  display: flex;
  align-items: center;
}
.user-img {
  width: 9.067vw;
  height: 9.067vw;
  border-radius: 50%;
  margin-right: 1.333vw;
}
.user-name {
  font-size: 4vw;
  color: #646464;
}
.btn-item {
  background-color: #fff;
  height: 7.73vw;
  line-height: 7.73vw;
  border-radius: 6px;
  font-size: 3.2vw;
  text-align: center;
  position: relative;
  margin-left: 2.67vw;
  color: #646464;
  font-weight: bold;
}

.btn-content-time {
  width: 20.8vw;
}

.up {
  display: inline-block;
  width: 4vw;
  height: 4vw;
  background: url('//files.eyee.com/eyeeh5/img/lottery/sort.png') no-repeat;
  background-size: contain;
  vertical-align: middle;
}

.down {
  display: inline-block;
  width: 4vw;
  height: 4vw;
  background: url('//files.eyee.com/eyeeh5/img/lottery/sort.png') no-repeat;
  background-size: contain;
  vertical-align: middle;
  transform: rotate(180deg);
}

.btn-content-checkall {
  width: 16.53vw;
}

.itemLsit-wrapper {
  width: 100%;
}

.item-wrapper {
  width: 44.27vw;
  height: 67.73vw;
  margin-bottom: 2.67vw;
  background: #ffffff;
  border-radius: 12px;
  padding: 2.67vw 2.67vw 5.33vw 2.67vw;
  display: flex;
  flex-direction: column;
  position: relative;
}

.lock-item::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
}

.lock-item::before {
  content: '';
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 21.33vw;
  height: 21.33vw;
  background: url('https://files.eyee.com/eyeeh5/img/lottery/lock.png')
    no-repeat;
  background-size: contain;
  z-index: 10;
}

.item-img-wrapper {
  width: 100%;
  height: 38.93vw;
  position: relative;
  border-radius: 8px;
  background: #f5f5f5;
  overflow: hidden;
}

.item-img {
  width: 100%;
  display: block;
  height: auto;
  border-radius: 8px;
}
.word-wrapper {
  flex: 1;
  justify-content: space-between;
}
.item-title {
  font-size: 3.47vw;
  color: #232323;
  padding: 3.2vw 0 2.67vw 0;
}
.item-quantity {
  font-size: 3.73vw;
  color: #232323;
  font-weight: 600;
}

.action {
  width: 100%;
  padding: 2.13vw;
  position: absolute;
  top: 0;
  left: 0;
}

.grade {
  padding: 0 1.6vw;
  height: 6.13vw;
  line-height: 6.13vw;
  text-align: center;
  font-size: 3.2vw;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
}

.default-circle {
  width: 4.267vw;
  height: 4.267vw;
  border-radius: 50%;
  border: 2px solid #b4b4b4;
}

.act-cirlce {
  border: none;
  background: url('//files.eyee.com/eyeeh5/img/draw/draw07.png') no-repeat;
  background-size: contain;
}

.footer-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  min-height: 18.67vw;
  z-index: 10;
  background: #fff;
  padding-top: 3.2vw;
  padding-left: 4vw;
  padding-right: 4vw;
}

.footer-againdraw {
  width: 44.53vw;
  height: 12.27vw;
  line-height: 12.27vw;
  text-align: center;
  border: 1px solid #fa2337;
  border-radius: 26.67vw;
  font-weight: 600;
  font-size: 4.27vw;
  color: #fa2337;
}

.footer-btn {
  width: 44.53vw;
  height: 12.27vw;
  line-height: 12.27vw;
  text-align: center;
  border-radius: 45px;
  background: #fa2337;
  color: #fff;
  margin: 0 auto;
  font-weight: bold;
}

.btn {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    #eecda8 2%,
    #fdcb73 6%,
    #f29c3c 99%,
    #2a0f05
  );
  border-radius: 8px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.91);
  font-size: 4.8vw;
  font-weight: 600;
  color: #000000;
}
.disable {
  opacity: 0.5;
}

.contentWrapper {
  width: 76vw;
  height: 85.6vw;
  background-color: #fff;
  padding: 6.67vw 5.33vw;
  justify-content: flex-end;
  border-radius: 4.8vw;
  position: relative;
}

.contentWrapper-header {
  position: absolute;
  top: -5.6vw;
  left: 0;
}

.contentWrapper-btn {
  width: 100%;
  height: 11.73vw;
  line-height: 11.73vw;
  background: #fa2337;
  border-radius: 8vw;
  font-weight: 600;
  font-size: 4.27vw;
  text-align: center;
  color: #ffffff;
}

.contentWrapper-txt {
  font-size: 16px;
  line-height: 22px;
  color: #232323;
  margin-bottom: 5.33vw;
}

.contentWrapper-blod {
  font-family: OswaldBold;
  font-weight: 600;
  font-size: 8vw;
  color: #232323;
}
</style>