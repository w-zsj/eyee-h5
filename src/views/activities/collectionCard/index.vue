<template>
  <div>
    <!-- 顶部 -->
    <v-header :showback="true" v-if="!$root.ISAPP && !$root.ISMP">
      <div class="nav-tab2 ellipsis">{{title}}</div>
    </v-header>
    <div class="collectionCardBox" v-if="hasdata == 1">
      <div class="rule" @click="goRule">活动规则</div>
      <!-- 大卡片 -->
      <div class="cardBigBox">
        <div class="cardTit"></div>
        <div class="cardBig">
          <!-- 正面 灰面 星耀卡-->
          <div v-if="ajBig.code == 0" class="startCardBox">
            <!-- 星耀卡是正面 且活动已经开始 -->
            <div v-if="ajBig.status == 1 && ajcardInfo.start != 0 && ajcardInfo.start != 3" class="cardImgBox">
              <img :src="isShowComposeCard?('//files.eyee.com/mcdn/img/setcaed/compose_card.gif?c='+ timestamp):(ajBig.masterface + '?c='+ timestamp)" alt="">
              <div class="compose_card" @click="composeCard">立即合成</div>
            </div>
            <div v-else>
              <img :src="(ajBig.mastergray + '?c='+ timestamp)" alt="">
              <div class="compose_card grey">立即合成</div>
            </div>
          </div>
          <!-- 正反面切换 组件 -->
          <AniFlip 
          :timestamp ="timestamp"
          :device="device"
          @close="closeModel" 
          v-else-if="ajBig.code != 0 && ajBig.status != 3" 
          :img1="ajBig.masterface" :img2="ajBig.masterback" 
          :item="ajBig"></AniFlip>
          <!-- 灰面-->
          <div class="otherCardBox" v-else-if="ajBig.code != 0 && ajBig.status == 3">
            <img :src="(ajBig.mastergray + '?c='+ timestamp)" alt="">
            <div class="giveCard grey" >送给朋友</div>
          </div>
          
        </div>
      </div>
      <!-- 小卡片 -->
      <div class="cardSamllBox flex">
        <div class="cardSmallItem" v-for="(ajSmallItem,ajSmallIndex) in ajcard" :key="ajSmallIndex" @click="changeTab(ajSmallItem, ajSmallIndex)">
          <img :src="ajSmallItem.number>0?(ajSmallItem.branchface + '?c='+ timestamp):(ajSmallItem.branchgray + '?c='+ timestamp)" alt="">
          <div class="name">{{ajSmallItem.code == 0?'星耀卡':'AJ'+ ajSmallItem.code}}</div>
          <div class="number">X{{ajSmallItem.number || 0}}</div>
        </div>
      </div>
      <!-- 各种状态按钮 -->
      <div class="btnBox">
        <div class="btn" v-if="notloged" @click="loginConfirm()">登录开箱</div>
        <div class="btn" v-else :class="statusBtn1.css" @click="statusBtn1.fun">{{statusBtn1.text}}</div>
      </div>
      <!-- 邀请进度 -->
      <div class="inviteBox" v-if="!notloged">
        <div class="link_icon"></div>
        <div class="progress_bar"> 
          <div class="cut-bar" :style="{width: percentBar + '%'}"></div>
          <div class="shade"></div>
        </div>
        <!-- 邀请进度倒计时 -->
        <div class="inviteCountDown" >
          <div v-if="ajcardInfo.invitecount < 8">
            <div class="info" v-if="(timeData2.h != '00' || timeData2.m != '00' || timeData2.s != '00')">{{timeData2.h}}:{{timeData2.m}}:{{timeData2.s}}后邀请人数失效</div>
          </div>
        </div>
        <div class="btn2Box">
          <div class="btn2" :class="statusBtn2.css" @click="statusBtn2.fun">{{statusBtn2.text}}</div>
        </div>
      </div>
      <!-- 兑换中心 -->
      <div class="exchangeBox">
        <!-- 兑换优惠券 -->
        <div class="changeCoupon" v-if="couponList && couponList.length > 0">
          <div class="couponItem" v-for="(item,index) in couponList" :key="index" @click="exchange(item,1)">
            <img :src="(item.picture + '?c='+ timestamp)" alt="">
            <div v-if="ajcard && ajcard.length > 0" class="status" :class="{'status3':(ajcard[0].number < 1 || !isExchange), 'status0': item.status == 0, 'status1': item.status == 1, 'status2': item.status == 2}"></div>
          </div>
        </div>
        <!-- 兑换商品 -->
        <div class="changeGoods flex" v-if="prizeList && prizeList.length > 0">
          <div class="goodsItem" v-for="(item,index) in prizeList" :key="index">
            <div class="imgBox">
              <img :src="(item.picture + '?c='+ timestamp)" alt="">
            </div>
            <div class="name ellipsis-2">{{item.name}}</div>
            <div class="price"><span></span>{{item.facevalue}}</div>
            <div class="changeBtn">
              <!--grey isExchange false 不在兑奖时间内 item.usestar > ajcard[0].number 星耀卡数量不足以兑换该商品 -->
              <div @click="exchange(item,2)" class="status1" :class="{'grey': (!isExchange || item.usestar > ajcard[0].number)}" v-if="item.status == 0">
                <div class="info1">免费兑换</div>
                <div class="info2">
                  <div class="span">消耗{{item.usestar}}张星耀卡</div></div>
              </div>
              <div class="status" v-else-if="item.status == 1">已兑换</div>
              <div class="status" v-else-if="item.status == 2">已抢完</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 各种弹框 -->
      <ticket-model
        :cssShow="cssShow"
        :ModelStatus="ModelStatus"
        @close="closeModel"
        @goLogin="goLoginFun"
        :timestamp ="timestamp"
        :Helpui="Helpui"
        :composeInfo="composeInfo"
        :drawUi="drawUi"
        :goExchangeInfo="goExchangeInfo"
        :device="device"
      ></ticket-model>
    </div>
    <div class="empty flex flex-center" v-else-if="hasdata == 2">
      <img style="display: block;width:100%;height:auto;" src="//files.eyee.com/mcdn/img/setcaed/ajCard_empty.png" alt="">
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  AjcardIndex,
  OpenAjcardIndex,
  AjcardHelpshare,
  AjcardHelpui,
  AjcardHelpta,
  AjcardCardui,
  AjcardGetcard,
  AjcardDraw,
  AjcardBuild,
  AjcardReceive
} from "../../../common/api/collectionCard";
import AniFlip from "@/comps/collectionCard/AniFlip";
import TicketModel from "@/comps/collectionCard/collectioncard_pop";
var loader;
export default {
  components: { AniFlip, TicketModel },
  data() {
    return {
      title: "集AJ赢新年大礼",
      hasdata: 3,
      ajcardInfo: {}, //集卡 登录态接口信息 非登录态接口信息
      ajcard: [], // 卡片数组
      ajBig: {},  // 页面展示aj大卡
      timer1: 0, // 活动开始倒计时timer  
      timeData1: '', //活动开始倒计时
      timer2: 0, // 邀请倒计时时timer
      timeData2: '', //邀请倒计时时
      // 组件参数
      cssShow: false,
      ModelStatus: 0,
      Helpui: {}, //助力页面信息
      composeInfo: {}, //抽卡结果页
      drawUi: {}, //领卡结果页
      goExchangeInfo: {}, //需要兑换的商品的信息

      isShowComposeCard: false, // 是否展示合成卡片的动画
      couponList: [], //兑换的优惠券数组
      prizeList: [], //兑换的商品数组
      helpShareInfo: {}, // 分享助力的分享信息 
      // 路由上的参数
      invitecode: '', // 助力分享链接上带的参数 用户信息
      cardid: 0, // AJ卡的id 赠送卡片分享链接上带的参数
      code: 0, // AJ卡的变好 赠送卡片分享链接上带的参数

      timestamp: 0, // 获取到当前时间戳 拼接到图片地址后面清除缓存

      isClick: true, // 开箱按钮是否可以点击 禁止点击多次

      isBtn2Fixed: false, // 按钮是否是悬浮状态
      device: 'H5', // 设备是H5还是小程序  用于埋点区分
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    notloged() {
      return !(this.user && this.user.uid);
    },
    // statusBtn1: { // 第一部分按钮 活动状态下的 相同按钮不同状态下的文言样式要执行的函数
    //   css: null, // 增加的类名
    //   text: null, // 按钮文言
    //   fun: null  // 需要执行的函数
    // },
    statusBtn1() {
      let _ = this
      function emptyFun () {
        return
      }
      switch (_.ajcardInfo.start) {
        case 0: // 活动未开始
          return {
            text: "剩余" + _.timeData1.h + "小时" + _.timeData1.m + "分" + _.timeData1.s + "秒开始",
            fun: emptyFun
          }
        case 1: // 活动进行中
          let css, text, fun
          if(_.ajcardInfo.drawcount) { // 有抽奖次数
            css = null
            text = "开箱有惊喜 (剩余" + _.ajcardInfo.drawcount + "次)"
            fun = _.openBoxFun
          } else if(_.ajcardInfo.newballcount > 0) { // 有牛丸抽奖次数
            css = null
            text = "8牛丸开箱 (剩余" + _.ajcardInfo.newballcount + "次)"
            fun = _.openBoxFun
          } else {
            css = 'grey'
            text = "8牛丸开箱 (剩余0次)"
            fun = _.hintFun
          }
          return {
            css: css,
            text: text,
            fun: fun
          }
        case 2: // 奖品兑换中 也就是集卡已结束
          return {
            css: null,
            text: "集卡已结束",
            fun: emptyFun
          }
        case 3: // 活动结束
          return {
            css: null,
            text: "活动已结束",
            fun: emptyFun
          }
      }
    },
    // statusBtn2: { // 第二部分按钮 邀请进度下的 相同按钮不同状态下的文言样式要执行的函数
    //   text: null, // 按钮文言
    //   fun: null  // 需要执行的函数
    //   css = null // 样式
    // },
    statusBtn2() {
      let _ = this
      function emptyFun () {
        if(_.ajcardInfo.start == 2) { //集卡结束
          _.toast('不能再邀请朋友助力获取开箱次数了哦！  快快合成星耀卡兑换大奖吧~')
          
        } else if(_.ajcardInfo.start == 3) { // 活动结束
          _.toast('活动已经结束啦~ 下次活动见！')
        }
      }
      if(_.ajcardInfo.start == 1) {
        switch (_.ajcardInfo.invitestatus) {
          case 0: //邀请任务未开始
            return {
              text: "立即邀请",
              css: null,
              fun: _.inviteFun
            }
          case 1:// 邀请任务进行中
            let text, fun, count
            if(_.ajcardInfo) {
              if(_.ajcardInfo.invitecount >= 8) {
                text = "立即邀请"
              } else if(_.ajcardInfo.invitecount < 8 && _.ajcardInfo.invitecount >= 5){
                count = 8 - _.ajcardInfo.invitecount
                text = "再邀请" + count + "人+3次"
              } else if(_.ajcardInfo.invitecount < 5 && _.ajcardInfo.invitecount >= 2){
                count = 5 - _.ajcardInfo.invitecount
                text = "再邀请" + count + "人+2次"
              } else if(_.ajcardInfo.invitecount < 2 && _.ajcardInfo.invitecount >= 0){
                count = 2 - _.ajcardInfo.invitecount
                text = "再邀请" + count + "人+1次"
              }
            }
            return {
              text: text,
              css: null,
              fun: _.inviteFun
            }
          case 2: // 邀请任务超时
            return {
              text: "立即邀请",
              css: null,
              fun: _.inviteFun
            }
          case 3: // 邀请任务已完成
            return {
              text: "立即邀请",
              css: null,
              fun: _.inviteFun
            }
        }
      } else {
        return {
          text: "立即邀请",
          fun: emptyFun,
          css: 'grey'
        }
      }
      
    },
    // 邀请进度
    percentBar() {
      let _ = this, percentBar = 0
      if(_.ajcardInfo.invitecount >= 8) {
        percentBar = 100
      } else if(_.ajcardInfo.invitecount < 8 && _.ajcardInfo.invitecount >= 1) {
        percentBar =( _.ajcardInfo.invitecount/8) * 100
      } else if(_.ajcardInfo.invitecount < 1) {
        percentBar = 0
      }
      return percentBar
    },
    // isExchange: false, //兑换按钮状态是否可点击 不可点击时 为灰色
    // 不在兑换时间内
    isExchange() {
      let _ = this, isExchange = false
      if(_.ajcardInfo.start != 2) {
        isExchange = false
      } else {
        isExchange = true
      }
      return isExchange
    }
  },
  mounted() {
    let _ = this
    _.setToolBar({ title: _.title });
    // 图片预加载
    let imgArr = ['//files.eyee.com/mcdn/img/setcaed/compose_card.gif']
    imgArr.forEach((item,index)=>{
      let temp = new Image()
      temp.onload = ()=>{
        console.log("tupian",index)        
      }
      temp.src = item
    })
    // 获取当前时间戳 放到图片后面 防止图片缓存
    _.timestamp = new Date().getTime()
    console.log('获取当前时间戳', _.timestamp)

    window.callbacklogin = json => {
      if (json) {
        _.getQueryParamUser(json).then( res => {
          _.getAjcardIndex();
        })
      } else _.toast("获取登录信息失败~");
    }
     //判断用户是否在APP或者小程序登录  _.$root.loging
    if (_.$root.loging) {
      _.$root.loging
        .then($ => {
          _.getAjcard()
        })
        .catch(e => {
          _.getAjcard()
        });
    } else {
      _.getAjcard();
    }
    // 获取路由上的参数
    let _query = _.$route.query
    console.log('获取路由上的参数', _.$route.query)
    _.invitecode = parseInt(_query.invitecode || '')
    _.cardid = parseInt(_query.cardid || '')
    _.code = parseInt(_query.code || '')
    
    if(_.$root.ISMP){ // 在小程序内展示
      if(_.invitecode) { //助力界面
        _.getHelpUi(_.invitecode)
      } else if(_.cardid && _.code) { //领卡界面
        _.getCardUi(_.cardid,_.code)
      }
      _.device = '小程序'
    } else {
      _.device = 'H5'
    }
    if (!_.$root.ISAPP && !_.$root.ISMP) {
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
    }

  },
  methods: {
    // 登录态接口和非登录态接口合在一起
    getAjcard() {
      let _ = this
      let interfaceFun
      if(_.notloged) { // 非登录
        interfaceFun = OpenAjcardIndex
      } else { // 登录
        interfaceFun = AjcardIndex
      }
      interfaceFun({}).then( res => {
        _.hasdata = 1
        _.ajcardInfo = res
        _.couponList = res.coupon
        _.prizeList = res.prize
     
        // 活动倒计时
        if(_.ajcardInfo.activitycountdown > 0 && _.ajcardInfo.start == 0) {
          clearTimeout(_.timer1);
          _.countdown(_.ajcardInfo.activitycountdown, 'timer1');
        } else {
          _.timeData1 = { d: '0', h: '00', m: '00', s: '00' }
        }
        // 邀请倒计时
        if(_.ajcardInfo.invitecountdown > 0 && _.ajcardInfo.start == 1) {
          clearTimeout(_.timer2);
          _.countdown(_.ajcardInfo.invitecountdown, 'timer2');
        } else {
          _.timeData2 = { d: '0', h: '00', m: '00', s: '00' }
        }
        // 集卡
        _.ajcard = res.ajcard
        // console.log('aj集卡', _.ajcard)
        // 给卡增加一个状态 大卡和小卡的状态
        if(_.ajcard && _.ajcard.length > 0) {
          _.ajcard.forEach( (val,index) => {
            if(_.notloged) {
              _.$set(val,'status', 3) // 1展示正面2展示反面3展示灰面 当数量大于0时 默认展示正面
            } else {
              if(index > 0) {
                if(val.number>0) {
                  _.$set(val,'status', 1) //1展示正面2展示反面3展示灰面 当数量大于0时 默认展示正面
                } else {
                  _.$set(val,'status', 3)
                }
              } else {
                _.$set(val,'status', 1) // 星耀卡为正面 星耀卡的正面和反面一样的
              }
            }
            
          })
          _.ajBig = Object.assign(_.ajcard[1])
        }
      }).catch( e => {
        _.hasdata =2
        console.error(e)
      })
    },
    // 点击小图 大图跟着切换
    changeTab(ajSmallItem, ajSmallIndex) {
      let _ = this
      _.ajBig = Object.assign(_.ajcard[ajSmallIndex])
      console.log('存大图展示的对象', _.ajBig)
    },
    // 倒计时
    countdown(next,type) { //type=timer1 活动开始倒计时 type=timer2邀请倒计时
      let _ = this, cleartimer,
      datatime = {
        d: '0',
        h: '0',
        m: '0',
        s: '0'
      }
      if (next > 0) {
        const pad = num => {
            return Math.floor(num).toString()
        }
        datatime.d = pad((next / 864e5)) || '0'
        datatime.h = pad(next / 36e5) > 9 ? pad(next / 36e5) : '0' + pad(next / 36e5)
        datatime.m = pad((next / 6e4) % 60) > 9 ? pad((next / 6e4) % 60) : '0' + pad((next / 6e4) % 60)
        datatime.s = pad((next / 1e3) % 60) > 9 ? pad((next / 1e3) % 60) : '0' + pad((next / 1e3) % 60) || "00"
        if(type == 'timer1') {
          _.timeData1 = datatime
          _.timer1 = cleartimer
        } else if(type == 'timer2') {
          _.timeData2 = datatime
          _.timer2 = cleartimer
        }
        next -= 1000;
        cleartimer = setTimeout(
            () => {
              _.countdown(next,type);
            },
            next > 0 ? 1000 : 0
        );
      } else {
        datatime = { d: '0', h: '00', m: '00', s: '00' }
        if(type == 'timer1') {
          _.timeData1 = datatime
        } else if(type == 'timer2') {
          _.timeData2 = datatime
        }
        if (cleartimer) {
          clearTimeout(cleartimer)
        } 
        _.getAjcard()
      }
    },
    // 开箱
    openBoxFun() {
      let _ = this
      if(!_.ajcardInfo.drawcount) { //使用牛丸次数时 有提示
        _.confirm({
          title: "温馨提示",
          msg: "确认消耗8牛丸进行抽奖吗？",
          okText: "确认",
          cancelText: "取消",
          ok: _.openBox
        });
      } else _.openBox(0)  // 使用抽奖次数抽奖
    },
    // 开箱函数
    openBox(type) { //type = 0 普通抽奖 type = 1 牛丸抽奖
      let _ = this
      if(_.isClick) {
        if(type == 0) {
          type = 0
        } else {
          type = 1
        }
        _.isClick = false
        AjcardDraw({type}).then( res => {
          _.isClick = true
          _.cssShow = true
          _.ModelStatus = 4
          _.composeInfo = res
          $log({ e: "collectcards_openbox", p: { describe: "开箱", device: _.device } });
        }).catch( e => {
          _.isClick = true
          console.error(e)
        })
      }
    },
    hintFun() { // 提示牛丸不足和牛丸使用次数不足
      let _ = this, msg = ""
      if(_.ajcardInfo.newball < 8) {
        msg = "当前牛丸不足，请前往APP赚牛丸"
      } else {
        msg = "今日抽奖次数已用完"
      }
      let cancelBtn
      if(_.$root.ISAPP) {
        cancelBtn = false
      } else cancelBtn = true
      _.confirm({
        title: "温馨提示",
        msg: msg,
        okText: "确认",
        cancelBtn: cancelBtn,
        ok: _.handleFun
      });
      
    },
    // 进行对应的操作
    handleFun() {
      let _ = this
      // 前往牛丸商城 oxballdetail/market
      if(_.$root.ISAPP) {
        _.$router.push("/oxballdetail/market");
      }
      
    },
    // 前往活动规则页面
    goRule() {
      this.$router.push("/collectionCard/rule");
    },
    // 邀请助力分享
    inviteFun() {
      let _ = this
      if(_.$root.ISAPP) {
        AjcardHelpshare({}).then( res => {
          $log({ e: "collectcards_share", p: { describe: "分享", device: _.device } });
          _.helpShareInfo = res
          loader = _.$loader("正在调起微信分享···");
          setTimeout(() => {
            loader.close();
          }, 3000);
          _.javascriptBridge({
            name: "callAppDirectlyShare",
            params: {
              sharecontent: "",
              sharetitle: _.helpShareInfo.xcxtitle,
              xcxurl: _.helpShareInfo.xcxurl,
              xcxicon: _.helpShareInfo.xcxicon || "",
              xcxid: _.helpShareInfo.xcxid || "gh_038ca9308eac",
              shareurl: "",
              platform: 2,
              callbackname: "_shareCallBack",
              type: 2
            }
          });
        }).catch( e => {
          console.error(e)
        })
      } else if (_.$root.ISMP) { //小程序内 去往单独的分享页面 type=2 邀请助力分享的单独弹框页面
        console.log('小程序内 去往单独的分享页面 type=2 邀请助力分享的单独弹框页面')
        $log({ e: "collectcards_share", p: { describe: "分享", device: _.device } });
        wx.miniProgram.navigateTo({
          url: "/pages/activity/cardShare?type=2"
        });
      }
      
    },
    // 兑换 type = 1优惠券 type = 2商品
    exchange(item,type) {
      let _ = this
      if(_.notloged) {
        _.loginConfirm()
      } else {
        if(_.ajcardInfo.start == 1 || _.ajcardInfo.start == 0) {
          _.toast('兑换时间还没到呢~  先去收集更多AJ吧')
        } else if(_.ajcardInfo.start == 3) {
          _.toast('真遗憾！兑奖时间已经过了 T_T')
        } else if(_.ajcardInfo.start == 2) { // 可以兑换
          if(item.status != 0) { //item.status 0.未兑换 1.已兑换 2.库存不足
            return
          } else {
            if(type == 1) { //type = 1优惠券
              if(_.ajcard[0].number < 1) {
                _.toast('星耀卡数量不足！')
              } else {
                _.goExchange(item,type)
              }
            } else if(type == 2){ // type = 2商品
              if(_.ajcard[0].number < item.usestar) {
                _.toast('星耀卡数量不足！')
              } else {
                _.goExchange(item,type)
              }
            }
          }
        }
        
      }
      
    },
    // 进行兑换 type = 1优惠券 type = 2商品
    goExchange(item,type) {
      let _ = this
      if(type == 1) {
        item.name = "鼠年礼券"
      }
      _.confirm({
        title: "温馨提示",
        msg: "您确定要使用星耀卡兑换"+ item.name + "吗？每位用户每样奖品只能兑换1次，奖品兑换完成后将不可进行变更。",
        okText: "立即兑换",
        cancelText: "以后再说",
        ok: (() => {
          AjcardReceive({prizeid: item.id}).then( res => {
            if(res && res.status) { // 兑换成功
              if(type == 1) { // 优惠券
                $log({ e: "collectcards_cash", p: { describe: "兑奖", device: _.device } });
                _.toast('兑换成功')
                //  重新请求主接口
                _.getAjcard()
              } else if(type == 2) { // 商品
                _.cssShow = true
                _.ModelStatus = 1
                _.goExchangeInfo = item
                console.log('goExchangeInfo', _.goExchangeInfo, item)
              }
            } else { // 兑换失败
               _.toast(res.msg)
              //  重新请求主接口
               _.getAjcard()
            }
          }).catch( e => {
            console.error(e);
          })
        })
      })
      
    },
    closeModel(v) {
      let _ = this;
      if (v) {
        _.cssShow = false;
        _.ModelStatus = 0;
      }
      _.getAjcard()
    },
    goLoginFun() {
      this.loginConfirm()
    },
    // 合成卡片
    composeCard() {
      let _ = this, wouldCompose = true // wouldCompose能否合成 除了星耀卡外 AJ1-Aj6 每个至少有一个卡片
      if(_.ajcard && _.ajcard.length > 0) {
        _.ajcard.forEach( (val,index) => {
          if(index > 0) {
            if(!val.number) {
              wouldCompose = false
            }
          }
        })
      }
      if(wouldCompose) {
        AjcardBuild({}).then( res => {
          if(res.status) {
            $log({ e: "collectcards_complete", p: { describe: "合成", device: _.device } });
            // 合成成功 展示合成卡片的动画
            _.isShowComposeCard = true
            setTimeout( () => {
              _.toast(res.msg)
              _.isShowComposeCard = false
              _.getAjcard()
            },3000)
          } else {
            _.toast(res.msg)
          }
        }).catch( e => {
          _.toast(e.msg)
          console.error(e)
        })
      } else {
        _.toast('AJ卡不足，不能合成星耀卡！')
      }
    },
    // 提醒登录函数
    loginConfirm() {
      let _ = this
      _.confirm({
        title: "登录提示",
        msg: "请登录后重试~",
        okText: "前往登录",
        cancelText: "容我想想",
        ok: () => {
          if (_.$root.ISAPP) {
            _.javascriptBridge({
              name: "callAppLoginPage",
              params: { callbackname: "callbacklogin" }
            });
          } else if (_.$root.ISMP) {
            wx.miniProgram.navigateTo({
              url: "/pages/other/bind"
            });
          } else {
            _.$router.push("/login");
          }
        }
      })
    },
    // 获取 助力界面信息
    getHelpUi(invitecode) {
      let _ = this
      console.log('获取 助力界面信息 请求接口', invitecode)
      AjcardHelpui({invitecode}).then( res => {
        console.log('获取 助力界面信息', res)
        let goods = res.goods
        let msg = res.msg
        _.cssShow = true
        _.ModelStatus = 2
        let param = {
          goods,
          invitecode,
          msg: msg
        }
        this.Helpui = param
      }).catch( e => {
        console.error(e)
      })
      
    },
    // 获取领卡界面信息
    getCardUi(cardid,code) {
      let _ = this
      AjcardCardui({cardid,code}).then( res => {
        let goods = res.goods
        let msg = res.msg
        _.cssShow = true
        _.ModelStatus = 3
        let param = {
          cardid,
          goods,
          msg
        }
        _.drawUi = param
      }).catch( e => {
        console.error(e)
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.collectionCardBox{
  min-height: 100vh;
  background: url('//files.eyee.com/mcdn/img/setcaed/bg_bar.png') 0 0 repeat-y;
  background-size: 100% 100%;
  padding-bottom: 8.8vw;
}
.rule{
  background: rgba(43,43,43,.5);
  color: #fff;
  font-size: 12px;
  text-align: center;
  width: 18.4vw;
  height: 7.0667vw;
  line-height: 7.0667vw;
  border-top-left-radius:7.0667vw;
  border-bottom-left-radius:7.0667vw;
  position: fixed;
  right: 0;
  top: 17.3333vw;
  z-index: 6;
  font-weight:500;
}
.cardBigBox{
  height: 129.0667vw;
  width: 100%;
  background: url('//files.eyee.com/mcdn/img/setcaed/card_bg.png') 0 0 no-repeat;
  background-size: 100% 100%;
  padding: 25.0667vw 10.4vw 0 9.6vw;
  margin-bottom: 1.6vw;
  position: relative;
  .cardTit{
    height: 9.4667vw;
    width: 57.7333vw;
    background: url('//files.eyee.com/mcdn/img/setcaed/card_tit.png') 0 0 no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    top: 17.3333vw;
    transform: translateX(-50%);
    z-index: 2;
  }
  .cardBig{
    height: 97.8667vw;
    width: 80vw;
    overflow: hidden;
    .startCardBox{
      width: 100%;
      height: 100%;
      background: url('//files.eyee.com/mcdn/img/setcaed/start_bg.png') 0 0 no-repeat;
      background-size: 100% 100%;
      position: relative;
      padding: 4.5333vw 6.1333vw 0 5.3333vw;
      .cardImgBox{
        background: #183045;
        border-radius: 1.3333vw;
        overflow: hidden;
        img{
          display: block;
          width: 100%;
          height: auto;
        }
      }
      .compose_card{
        position: absolute;
        bottom: 6.2vw;
        left: 50%;
        transform: translateX(-51%);
        height: 8vw;
        line-height: 8vw;
        width: 43.8vw;
        text-align: center;
        font-size: 5.6vw;
        color: #EB2139;
        font-style:italic;
        font-weight:800;
        &.grey{
          color: #373737;
        }
      }
    }
  }
}
.cardSamllBox{
  padding-left: 1.8667vw;
  width: 100vw;
  &.mb30{
    margin-bottom: 2.9762vh;
  }
  .cardSmallItem{
    width: 12.2667vw;
    margin-right: 1.8667vw;
    position: relative;
    img{
      display: block;
      width: 12.2667vw;
      height: 16.5333vw;
      margin-bottom: 1.8667vw;
    }
    .name{
      font-size: 12px;
      text-align: center;
      color: #C7C6C6;
      line-height: 3.2vw;
      margin-bottom: 2.4vw;
    }
    .number{
      font-size: 12px;
      font-style: italic;
      color: #EB2139;
      line-height: 4vw;
      position: absolute;
      top: 12.533vw;
      right: 0;
      width: 8vw;
      text-align: center;
      font-weight:900;
    }
  }
}
.btnBox{
  margin-bottom: 1.6369vh;
  height: 16.1333vw;
  padding: 0 6vw 0 6.5333vw;
  &.fixed{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 2.4802vh;
    z-index: 5;
    margin: 0;
  }
  .btn{
    width: 100%;
    height: 16.1333vw;
    line-height: 16.1333vw;
    background: url('//files.eyee.com/mcdn/img/setcaed/btn_1.png') 0 0 no-repeat;
    background-size: 100% 100%;
    font-size: 5.0667vw;
    color: #EB2139;
    font-weight:800;
    font-style:italic;
    text-align: center;
    &.grey{
      color: #353535;
    }
  }
}
.inviteBox{
  width: 100%;
  height: 63.3333vw;
  background: url('//files.eyee.com/mcdn/img/setcaed/open_box_bg.png') 0 0 no-repeat;
  background-size: 100% 100%;
  padding: 25.6vw 15.4667vw 0 13.3333vw;
  margin-bottom: 4.8vw;
  position: relative;
  .link_icon{
    position: absolute;
    bottom: -7.8667vw;
    left: 0;
    right: 0;
    background: url('//files.eyee.com/mcdn/img/setcaed/link.png') 0 0 no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 7.8667vw;
  }
}
.progress_bar{
  position: relative;
  width: 100%;
  background: #EB2139;
  height: 5.6vw;
  border: solid 1px #000;
  border-radius: 5.6vw;
  margin-bottom: 2.1333vw;
  .cut-bar{
    height: 4.8vw;
    background: #dbd5d5;
    border-radius: 5.6vw;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }
  .shade{
    width: 100%;
    height: 5.6vw;
    background: url('//files.eyee.com/mcdn/img/setcaed/shade.png') 0 0 no-repeat;
    background-size: 100% 100%;
    top: 0;
    left: 0;
    z-index: 3;
    position: absolute;
  }
}
.inviteCountDown{
  width: 100%;
  margin-bottom: 2.6667vw;
  height: 3.2vw;
  text-align: center;
  .info{
    color: #E6E6E6;
    font-size: 3.2vw;
    font-weight:900;
    font-style:italic;
    height: 3.2vw;
    line-height: 3.2vw;
  }
}
.btn2Box{
  width: 100%;
  padding: 0 10vw 0 9.8667vw;
  .btn2{
    width: 100%;
    height: 13.2vw;
    line-height: 13.2vw;
    text-align: center;
    color: #EB2139;
    font-size: 4.8vw;
    font-weight:800;
    font-style:italic;
    background: url('//files.eyee.com/mcdn/img/setcaed/btn_2.png') 0 0 no-repeat;
    background-size: 100% 100%;
    &.grey{
      color: #353535;
    }
  }
}
.exchangeBox{
  background: url('//files.eyee.com/mcdn/img/setcaed/exchange_bg.png') 0 0 no-repeat;
  background-size: 100% 100%;
  width: 100%;
  height: 302.2667vw;
  padding: 30.6667vw 15.4667vw 0 12.8vw;
}
.changeCoupon{
  margin-bottom: 1.7333vw;
  .couponItem{
    margin-bottom: 2.6667vw;
    width: 100%;
    position: relative;
    img{
      display: block;
      width: 100%;
    }
    .status{
      position: absolute;
      width: 17.3333vw;
      height: 12.2667vw;
      z-index: 2;
      right: 3.7333vw;
      top: 50%;
      transform: translateY(-50%);
      &.status0{
        background: url('//files.eyee.com/mcdn/img/setcaed/status_0.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &.status1{
        background: url('//files.eyee.com/mcdn/img/setcaed/status_1.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &.status2{
        background: url('//files.eyee.com/mcdn/img/setcaed/status_2.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
      &.status3{
        background: url('//files.eyee.com/mcdn/img/setcaed/status_3.png') 0 0 no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}
.changeGoods{
  flex-wrap: wrap;
  .goodsItem{
    width: 34.8vw;
    margin-right: 2.1333vw;
    margin-bottom: 2.1333vw;
    border: 1px solid rgba(0,0,0,1);
    border-radius:1.0667vw;
    overflow: hidden;
    background: #E33526;
    padding-bottom: 1.8667vw;
    position: relative;
    &:nth-child(2n) {
      margin-right: 0;
    }
    .imgBox{
      width: 100%;
      height: 30.4vw;
      overflow: hidden;
      position: relative;
      background: #fff;
      margin-bottom: 1.0667vw;
      img{
        width: 100%;
        height: auto;
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .name{
      line-height: 3.75vw;
      height: 7.5vw;
      color: #fff;
      font-size: 3.2vw;
      margin-bottom: 2.4vw;
      padding: 0 1.3333vw;
    }
    .price{
      color: #fff;
      padding-left: 3.4666vw;
      height: 8.2667vw;
      line-height: 8.2667vw;
      font-family: 'OswaldBold';
      text-decoration:line-through;
      font-size: 3.7333vw;
      position: relative;
      font-style:italic;
      span{
        display: block;
        width: 2.1333vw;
        height: 3.4667vw;
        background: url('//files.eyee.com/mcdn/img/setcaed/rmb.png') 0 0 no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 1.3333vw;
        top: 48%;
        transform: translateY(-50%);
      }
    }
    .changeBtn{
      position: absolute;
      right: 1.8667vw;
      bottom: 1.8667vw;
      width: 20.2667vw;
      height: 8.2667vw;
      border: solid 1px #000;
      border-radius: 1.0667vw;
      overflow: hidden;
      .status{
        background: #929292;
        height: 100%;
        line-height: 8.2667vw;
        font-size: 3.7333vw;
        color: #D22236;
        font-weight:900;
        font-style:italic;
        width: 100%;
        text-align: center;
      }
      .status1{
        height: 100%;
        background: #E4A230;
        padding-top: 1.0667vw;
        box-sizing: border-box;
        &.grey{
          background: #929292;
        }
        .info1{
          font-weight:900;
          font-style:italic;
          color: #D22236;
          font-size: 3.7333vw;
          height: 3.6vw;
          line-height: 3.6vw;
          text-align: center;
        }
        .info2{
          width: 100%;
          position: relative;
          overflow: hidden;
          height: 3.4667vw;
          .span{
            font-size: 3.2vw;
            font-weight:900;
            font-style:italic;
            color: #D22236;
            width: 30vw;
            position: absolute;
            top: -1.75vw;
            left: 50%;
            transform: translateX(-50%) scale(0.65);
            height: 6.4vw;
            line-height: 6.4vw;
            text-align: center;
          }
        }
      }
    }
  }
}
.otherCardBox{
  position: relative;
  .giveCard{
    position: absolute;
    bottom: 7.2vw;
    left: 50%;
    transform: translateX(-51%);
    height: 8vw;
    line-height: 8vw;
    width: 43.8vw;
    text-align: center;
    font-size: 5.6vw;
    color: #EB2139;
    font-style:italic;
    font-weight:800;
    &.grey{
      color: #373737;
    }
  }
}
.empty{
  background: #e8e5e5;
  width: 100vw;
  height: 100vh;
}
</style>

