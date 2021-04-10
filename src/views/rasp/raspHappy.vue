<template>
  <div class="rasp-happy">
    <!-- app 提示登录框 -->
    <div class="app-login" v-if="$root.ISAPP&&!uid">
       <div class="content">
          <p class="title">登录之后才能参与刮奖~</p>
          <span>每天10个限量单品免费送!</span>
          <div class="btn" @click.stop="GoAppLogin">去登录</div>
       </div>
    </div>
    <!-- 顶部提示下载 @click.stop="downloadApp"-->
    <div class="load-app" v-if="!$root.ISAPP" @click="downapp">
      <a href="https://gio.ren/oeO8yy3">
         <img class="load-app-img" v-lazy="`https://files.eyee.com/activity/year-shopping/loadApp.jpg?r=1`" alt>
      </a>

    </div>
    <!-- tabs -->
    <div class="tabs flex-center">
      <div
        class="list flex-col flex-center"
        v-for="(oi,oIdx) in overs"
        :key="'over'+oIdx"
        :class="{'act':currAct.activityid==oi.activityid}"
        @click="toggleTab(oi,'over')"
      >
        <span>已结束</span>
        <span>{{oi.overtabtime}}</span>
      </div>
      <div
        class="list flex-col flex-center"
        v-if="now.activityid"
        :class="{'act':currAct.activityid==now.activityid}"
        @click="toggleTab(now,'now')"
      >
        <span>进行中</span>
      </div>
      <div
        class="list flex-col flex-center"
        v-for="(ni,nIdx) in next"
        :key="'next'+nIdx"
        :class="{'act':currAct.activityid==ni.activityid}"
        @click="toggleTab(ni,'next')"
      >
        <span>即将开始</span>
        <span>{{ni.beginhour}}</span>
      </div>
    </div>

    <!-- 奖品信息 -->
    <div class="main-home">
      <div class="count-time">
        <div v-if="actTab!='over'" class="flex-center">
          <div class="txt">{{actTab=='now'?'距离结束':'距离开始'}}</div>
          <div class="time">
            <span class="flex-center">{{cd.H}}</span> :
            <span class="flex-center">{{cd.m}}</span> :
            <span class="flex-center">{{cd.s}}</span>
          </div>
        </div>
        <div v-else class="next-meet">下一场再见</div>
      </div>
      <!-- 抽奖图片 -->
      <div class="lotter">
        <div class="poduct-img">
          <img src="https://files.eyee.com/activity/ggl/rasp-bg.png" alt>
          <div class="flex-ctr-end lotter-img" @click.stop="productGo(currAct.productid)">
            <img :src="currAct.productimageurl" alt>
          </div>
          <div class="drap">
            <img v-lazy="`https://files.eyee.com/activity/ggl/drop.png`" alt>
            <span class="price">￥{{currAct.productprice}}</span>
          </div>
          <div class="product-name">{{currAct.productname}}</div>
        </div>
      </div>
      <!-- 刮刮乐剩余数量 -->
      <v-delay :delay="200" class="ticket-num">
        <div class="meng-ceng" v-if="actTab=='next'"></div>
        <div class="tk-last flex-btwn">
          <div class="flex-col flex-center hc-rasp">
            <span class="mtb">{{actTab=='over'?"总送出刮刮乐（张）":"剩余刮刮乐"}}</span>
            <span class="flex-center">
              <i v-for="(rc,rcIdx) in remainCount" :key="'rc'+rcIdx" class="flex-center">{{rc}}</i>
            </span>
          </div>
          <div class="flex-col flex-center hc-course">
            <span class="mtb">{{actTab=='over'?"本场送出单品":actTab=='next'?"本场待送出单品":"本场待领单品"}}</span>
            <span class="flex-center">
              <i
                v-for="(rwc,rwcIdx) in remainWinCount"
                :key="'rwc'+rwcIdx"
                class="flex-center"
              >{{rwc}}</i>
            </span>
          </div>
        </div>
      </v-delay>
      <!-- 活动文言 -->
      <div class="classical flex-center flex-col" @click="ruleShow=true">
        <div class="send-stamps flex-center">本场送出100,000张刮刮乐，送出5个单品，全场首刮必中! ></div>
        <!-- <div class="active-txt flex-center">活动开始才能刮呦~本场第 一个刮开100%中奖</div> -->
      </div>
    </div>

    <!-- 中奖码 -->
    <v-delay
      :delay="500"
      class="course-code"
      v-if="actTab!='next'&&currAct.winninglist&&currAct.winninglist.length>0"
    >
      <div class="cc-int"></div>
      <div class="btn flex-center">本场中奖码</div>
      <div class="content">
        <div class="title">刮中任意一个号码则中奖</div>
        <div class="list flex-between flex-wrap benchang">
          <div class="flex-between flex-wrap">
            <div v-for="(wi,wIdx) in currAct.winninglist" :key="'win'+wIdx" class="span" :class="{'span_first':wIdx==0}">
              <!-- <em class="shou-gua" v-if="wIdx==0">金猪送鞋,首刮必中</em> -->

              <span class="user_info flex-center" v-if="wi.imageurl" :class="{'flex-aic':wIdx==0}">
                <i class="header_img">
                  <img :src="wi.imageurl" alt>
                </i>
                <i class="name  flex-col" :class="{'flex-center':wIdx!=0}">
                  <em>{{wi.nickname}}</em>
                  <em>{{wi.winningtime}}</em>
                </i>
                <i class="code">{{wi.code}}</i>
                <span class="jieshao flex-col flex-ctr-end" v-if="wIdx==0">
                  <i>金猪送鞋，首刮必中</i>
                  <i>本场第一个刮开的100%中奖</i>
                </span>
              </span>
              <span class="span wait flex-center" v-else-if="!wi.imageurl&&wi.code">
                <i class="flex-center">等你兑奖！</i>
                <i class="flex-center">{{wi.code}}</i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </v-delay>

    <!-- 获得的刮刮乐 -->
    <v-delay :delay="800" class="course-code">
      <div class="cc-int"></div>
      <div class="btn flex-center">获得的刮刮乐</div>
      <div class="content">
        <!-- 有code -->
        <div class="list">
          <div v-if="codes&&codes.length>0">
            <div v-for="(ci,cIdx) in codes" :key="'code'+cIdx">
              <!-- 已刮奖 -->
              <div
                class="my_code flex-between code-flag"
                :class="ci.typeClass+'_0'"
                v-if="ci.amount&&ci.isopen"
                @click.stop="showLuck(ci.amount)"
                v-show="cIdx<2||codeShowMore"
              >
                <div class="code_list flex-col">
                  <span class="lotter_tx">恭喜抽中{{ci.amount}}元红包！看详情 ></span>
                  <span class="code-num">{{ci.code}}</span>
                </div>
                <div class="us-header flex-aic">
                  <img :src="ci.image" alt>
                  {{ci.nickname}}
                </div>
              </div>
              <!-- 待刮奖 -->
              <div
                class="my_code cardCanvas flex-center code-flag"
                :class="ci.typeClass+'_2'"
                v-else-if="!ci.isopen"
                v-show="cIdx<2||codeShowMore"
                @click.stop="doRasp(ci.uid)"
              >
                <div class="wait_gua_bg">
                  <img v-lazy="`https://files.eyee.com/activity/ggl/guajiangBg.png`" alt>
                  <p>
                    <span>刮TA有惊喜</span>
                    <br>
                    <span>（刮中本场中奖号码任意一个，可得单品一个！）</span>
                  </p>
                </div>
              </div>
              <!-- 刮开的
              style="width:100%;position:relative;margin-bottom:10px;"-->
              <div
                class="code-flag"
                :class="ci.typeClass+'_1'"
                v-else-if="ci.isopen"
                v-show="cIdx<2||codeShowMore"
              >
                <div class="not-the flex-aic">
                  <span>
                    很遗憾未刮中
                    <span class="code-num">{{ci.code}}</span>
                  </span>
                  <span class="flex-around">
                    <img v-lazy="ci.image" alt>
                    {{ci.nickname}}
                  </span>
                </div>
              </div>
            </div>
            <div
              class="down_up"
              :class="{act:codeShowMore}"
              v-if="codes.length>2"
              @click="codeShowMore=!codeShowMore"
            >
              <img v-lazy="`https://files.eyee.com/activity/ggl/down.png`" alt>
              <p class="flex-center" v-show="codeShowMore">收起</p>
            </div>
          </div>
          <!-- 未参与 -->
          <div class="defa-code flex-col flex-center" v-else-if="actTab=='over'">
            <div class="title">{{joined?"本场未中奖":"本场未参与"}}</div>
            <div class="txt">原本有一个可以得到免费单品的机会摆在我面前...</div>
            <div class="defa-img">
              <img v-lazy="`https://files.eyee.com/activity/ggl/certificate_error.png`" alt>
            </div>
          </div>
        </div>
      </div>
    </v-delay>

    <!-- 春节不打烊入口 -->
    <!-- <div @click.stop="gomain()">
      <img v-lazy="`https://files.eyee.com/activity/ggl/chunjie.png`" alt>
    </div> -->

    <!-- 底部 -->
    <v-delay :delay="1000" class="footer">
      <img v-lazy="`https://files.eyee.com/activity/ggl/footer.png`" alt>
      <div
        class="bottombtn flex-center"
        :class="{'bottombtn_1':actTab=='next'&&!alarm,'bottombtn_2':actTab=='next'&&alarm}"
        @click.stop="btmHandle"
      >{{actTab=='now'?(openedCount>0?"得更多刮刮乐":"去刮TA"):(actTab=="over"?'去逛逛球鞋':"")}}</div>
      <!-- <div class="figure">
        <img v-lazy="`https://files.eyee.com/activity/ggl/per.png`" alt>
      </div> -->
    </v-delay>

    <!-- 球鞋频道入口 -->
    <!-- <div class="c2c" @click.stop="sneakerMall()">
      <img v-lazy="`https://files.eyee.com/activity/ggl/c2c.png`" alt>
    </div> -->
    <!-- 主会场入口 -->
    <div class="main-active" v-if="entrance==1" @click.stop="gomain()">
      <img src="https://files.eyee.com/activity/ggl/main.png" alt>
    </div>
    <!-- 弹框 -->
    <model
      :model-type="modelType"
      :isshow-type="isshowType"
      :activityid="actId"
      :codeid="currCodeId"
      :model-data="modelData"
      :luck-money="luckMoney"
      @close="closeModel"
    ></model>
    <!-- 活动规则弹框 -->
    <div class="ggl-rule" :class="{act:ruleShow}" @click="ruleShow=false">
      <div>
        <p>斗牛刮刮乐活动规则</p>
        <p>1. 每场送出10万张刮刮乐；当前场次开始前公布4个中奖号码，刮刮乐刮开后与当前场次中奖号码一致即可获得免费单品；</p>
        <p>2. 当前场次首个成功刮开刮刮卡的用户必中单品；</p>
        <p>3. 部分鞋款码数有限，先中先选；</p>
        <p>4. 分享可获得更多刮刮卡（斗牛老用户助力可双方各得1张刮刮卡，新用户助力可双方各得3张刮刮卡）；</p>
        <p>5. 刮刮卡请在获得的场次结束前刮开，该场次结束后未刮开的刮刮卡将作废，本场已送出所有鞋款、刮刮卡，时间结束，三个条件满足任何一个视为本场活动结束，未刮开的卡立即作废；</p>
        <p class="imp">6. 中奖后请在页面填写收件信息地址、信息，在下场开始前未填写的视为自动放弃奖品，实物奖品将在刮刮乐活动结束后的15个工作日陆续发出；</p>
        <p>7. 如发现不正当获得刮刮乐卡，将无视作弊账户中奖号重归刮奖号码池；</p>
        <p>8. 最终活动解释权归斗牛。</p>
      </div>
    </div>
  </div>
</template>
<script>
import { weixinApp } from "../../common/api/oauthAPI";
import { WXRegisterAuth } from "../../common/api/user";
import { Indicator } from "mint-ui";
import {
  ScratchActivitylist,
  ScratchRemaincount,
  currentactivitycodes,
  getuserscratchcode,
  setreminder,
  addchance,
  shareforhelp
} from "@/utils/api/activities";

import model from "./Popup";

import { DateDiff } from "../../common/util";
import { mapGetters } from "vuex";
// import { setTimeout, clearTimeout, setInterval } from "timers";

const _wx_auth_key = "WECHAT_AUTH_USER";
var countNum = 0
var _timer = null,
  remainTimer = null,
  // 刷新剩余数倒计时间隔, s
  remainInterval = 3000;

export default {
  name: "RaspHappy",
  components: { model },
  data() {
    return {
      // 是否从春节不打烊主会场进入
      entrance: 0,

      authUser: {},

      overs: [],
      now: {},
      next: [],

      currAct: {},
      actTab: "",
      selectActId: "",

      // 剩余刮刮乐数量
      remainCount: [1, 0, 0, 0, 0, 0],
      // 剩余可中奖数量
      remainWinCount: [0, 5],
      cd: { H: "00", m: "00", s: "00" },

      codes: [],
      openedCount: 0,
      currCodeId: "",
      joined: false,
      codeShowMore: false,

      btnClass: "",
      alarm: false,

      modelType: null, // 弹框类型
      isshowType: false, // 是否显示 弹框
      luckMoney: 0,
      modelData: {
        remainwinningnum: "",
        productimageurl: "",
        userimageurl: "",
        nickname: "",
        winningtime: "",
        code: ""
      },

      ruleShow: false,
      isappios:false,

      count:0
      // _timer: null
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    actId() {
      return (this.currAct || {}).activityid || "";
    },
    uid() {
      return (this.user || {}).uid || "";
    },
    unionid() {
      return (this.authUser || {}).unionid || "";
    }
  },
  beforeMount() {
    this.authUser = JSON.parse(localStorage.getItem(_wx_auth_key) || "{}");

    const jsId = "_qrcodeJs";
    let js = document.getElementById(jsId);
    if (!js) {
      js = document.createElement("script");
      js.src = "https://files.eyee.com/mcdn/3rd/qrcode.min.js";
      js.id = jsId;
      document.head.appendChild(js);
    }
  },
  mounted() {
    let _ = this,
      { uid, unionid, actId } = _,
      { nickname, headimgurl } = _.authUser,
      qp = _.$route.query;

    window.callbacklogin = json => {
      var result;
      if (json) {
        result = JSON.parse(decodeURIComponent(json));
        // localStorage.setItem("currentUser", JSON.stringify(result));
        // _.$store.dispatch("setUserInfo", result);

        _.isappios =true
        _.getAppParams(json)

        _.getActs();
      }else _.isappios =false

    };
    if (_.$root.ISAPP) {
        _.javascriptBridge({
            name: "getAppActivityShareContent",
            params: {
              hideshareicon: true
            }
          });
      if(!_.isappios)_.getAppParams()

    } else {
      _.urlParams();
      if (!!unionid) _.getActs();
      else _.wx_code();

      _.entrance = qp.entrance;
      if(!_.$root.isdebug)  window.gio("track", "H5PageEnter",'刮刮乐 微信内进入埋点');
    }

  },
  methods: {
    downapp(){
      $log({ e: $log.event.click, p: '刮刮乐下载点击' })
    },
    // app登录
    GoAppLogin(){
      let _=this
      let callAppLoginPageParams = {
          name: "callAppLoginPage",
          params: { callbackname: "callbacklogin" }
        };
      _.javascriptBridge(callAppLoginPageParams);
    },
    // 获取app参数
    getAppParams(pa){
      let _=this,
        { uid, unionid, actId } = _,
        { nickname, headimgurl } = _.authUser
      _.getQueryParamUser(pa)
        .then(res => {
          _.getActs();
          _.modelData.unionid = unionid || "";
          _.modelData.uid = uid || "";
          _.modelData.nickname = nickname || "";
          _.modelData.image = headimgurl || "";
          _.modelData.activityid = actId;
        })
        .catch(e => {
         console.error("链接参数处理异常: ", e);
        //  _.toast("参数处理异常, 退出重进试试~");

        });
    },
    // 地址栏参数
    urlParams() {
      let _ = this,
        { uid, unionid, actId } = _,
        { nickname, headimgurl } = _.authUser,
        qp = _.$route.query;
      if (qp && (qp.unionid || qp.uid)) {
        // alert(JSON.stringify(qp))
        _.modelData.uid = qp.uid;
        _.modelData.helpunionid = unionid || "";
        _.modelData.helpnickname = nickname || "";
        _.modelData.helpuserimage = headimgurl || "";
        _.modelData.unionid = qp.unionid || "";
        _.modelData.nickname = decodeURIComponent(qp.nickname);
        _.modelData.image = decodeURIComponent(qp.image);
        _.modelData.activityid = qp.activityid;
      } else {
        _.modelData.unionid = unionid || "";
        _.modelData.uid = uid || "";
        _.modelData.nickname = nickname || "";
        _.modelData.image = headimgurl || "";
        _.modelData.activityid = actId;
      }
    },
    //#region 微信授权
    wx_code() {
      // 微信静默登录返回uid
      let _ = this,
        wl = window.location;
      if (wl.href.indexOf("code") > 0) {
        let wxcode = wl.href.split("code=")[1].split("&state")[0];
        WXRegisterAuth({ wxcode })
          .then(res => {
            //获取unionid
            console.log("获取WXRegisterAuth", res);

            /**
             * city
             * country
             * headimgurl
             * language
             * nickname
             * openid
             * privilege
             * province
             * sex
             * unionid
             */


            _.authUser = res;
            localStorage.setItem(_wx_auth_key, JSON.stringify(res));

            setTimeout(() => {
              _.getActs();
            }, 300);
            // gio埋点
            if(!_.$root.isdebug)  window.gio("track", "H5WXauth",res.unionid);
          })
          .catch(e => {
            console.error("WXRegisterAuth error: ", e);
            // this.toast("获取uid失败");
            setTimeout(() => {
              _.getActs();
            }, 300);
          });
      } else {
        let path = wl.origin + wl.pathname;
        let link = weixinApp.get_authorize_base_link(path, "weixinJ");
        window.location = link;
      }
    },
    downloadApp() {
      // this.openAppClient();
      window.location.href='https://gio.ren/oeO8yy3'
    },
    //#endregion

    refreshInfo() {
      let _ = this,
        { actId, currAct, actTab } = _;

      // 非结束场的倒计时
      if (actTab != "over") {
        if (_timer) clearTimeout(_timer);
        currAct.countdown = currAct.countdown - _.count
        _.countdown(currAct.countdown);
      }

      // 当前场 是否提醒  0 未提醒，1 已设置提醒
      _.alarm = !!currAct.remind;

      // 获取进行中的中奖码列表
      _.getActingWin();

      // 处理剩余总可刮数
      _.dealRemainCount();

      // 刷新刮刮乐
      _.getCodes();

      _.codeShowMore = false;
    },
    getActs() {
      let _ = this,
        { uid, unionid } = _;
      ScratchActivitylist({ uid, unionid })
        .then(res => {
          console.log("ScratchActivitylist res: ", res);
          if (res) {
            let {
              processactivity: now,
              overactivitys: overs,
              comingactivitys: next
            } = res;

            now = now || {};
            next = next || [];
            overs = overs || [];

            if (!_.$root.isdebug && !res.processactivity) window.gio("track", "NotGoing",'不在进行中埋点');

            let actIdx = next.findIndex(i => i.selected);
            if (actIdx > -1) {
              _.currAct = next[actIdx];
              _.actTab = "next";
            } else if (now.selected) {
              now.winninglist = [];

              _.currAct = now;
              _.actTab = "now";
            } else {
              actIdx = overs.findIndex(i => i.selected);
              _.currAct = overs[actIdx];
              _.actTab = "over";
            }

            // 当前选中场的活动id
            _.selectActId = _.currAct.activityid;

            _.now = now;
            _.next = next;
            _.overs = overs;

            // if (now) _.currAct = now;
            // else if (next) _.currAct = next[0];
            // else if (overs) _.currAct = overs[0];

            // 初次加载的分享信息
            _.getShareInfo();

            // if (
            //   _.$route.query &&
            //   (_.$route.query.uid || _.$route.query.unionid)
            // ) {
            //   _.addChance(3);
            // } // 好友赞助 要有 刮奖的行为 才算赞助
            if (_timer)  clearTimeout(_timer)
            _.count = 0
            _.refreshInfo();
          }
        })
        .catch(e => {
          console.error("ScratchActivitylist error: ", e);
        });
    },
    getActingWin() {
      let _ = this,
        { actId, actTab } = _;
      if (actTab != "now") return;

      currentactivitycodes({ activityid: actId })
        .then(res => {
          if (res && res.winninglist) {
            _.now.winninglist = res.winninglist;
          }
        })
        .catch(e => {
          console.error("getActingWin error: ", e);
        });
    },

    getCodes() {
      const showHelpRemain = "HELP_REMAIN_SHOW";
      let _ = this,
        { actTab, actId, uid, unionid } = _,
        openedCount = 0,
        helpRemainCount = 0,
        helpCodeId = "",
        showed = sessionStorage.getItem(showHelpRemain) == actId;

      getuserscratchcode({ activityid: actId, uid, unionid })
        .then(res => {
          console.log("getCodes res: ", res);
          // 1:参与 0:未参与
          _.joined = !!res.participate;

          if (res && res.list) {
            _.codes = res.list.map(i => {
              // 刮刮乐获取类型 // first_0 首次分享  good_friend_zanzhu_0 好友赞助 meet_0 见面礼 new_0 新人专享 yu_0 预约礼
              // type 1:见面礼 2:首次分享 3:好友赞助 4 新人专享 5 预约礼
              if (i.isopen) openedCount++;

              switch (i.type) {
                case 1:
                  i.typeClass = "meet";
                  break;
                case 2:
                  i.typeClass = "first";
                  break;
                case 3:
                  i.typeClass = "good_friend_zanzhu";

                  if (!i.isopen) {
                    if (!helpCodeId) helpCodeId = i.uid;
                    helpRemainCount++;
                  }
                  break;
                case 4:
                  i.typeClass = "new";
                  break;
                case 5:
                  i.typeClass = "yu";
                  break;
              }

              return i;
            });

            _.openedCount = openedCount;

            // 进行中的场 若有好友赞助未刮开的码 且当前场未弹过框 则弹框提示
            if (actTab == "now" && helpRemainCount > 0 && !showed) {
              sessionStorage.setItem(showHelpRemain, actId);

              _.currCodeId = helpCodeId;
              _.modelData.helpRemainCount = helpRemainCount;

              _.modelType = 4;
              _.isshowType = true;
            }
          }
        })
        .catch(e => {
          console.error("getCodes error: ", e);
          if (e) _.toast(e.msg);
          setTimeout(() => {
            _.getCodes();
          }, 500);
        });
    },

    doRasp(codeid) {
      let _ = this,
        { actTab, actId, openedCount } = _;

      if (actTab == "now") {
        _.currCodeId = codeid;

        if (_.$root.ISAPP) {
          _.modelType = 2;
          _.isshowType = true;
          if (openedCount == 0) {
            if(!_.$root.isdebug)  window.gio("track", "tombolaBehavior",'APP内刮奖行为埋点');
          }
        } else {
          // 非APP 尝试刮时 增加 好友赞助
          if (_.$route.query.unionid || _.$route.query.uid) {
            _.addChance(3);
          }

          // 非APP内 若刮开有 则判定为本场刮开过
          if (openedCount > 0) {
            _.toast(
              "请前往斗牛APP刮卡，新人使用微信授权登录，再得3张刮刮乐，还可拿520元新人大礼包~"
            );
            window.location.href='https://gio.ren/oeO8yy3'
            // _.openAppClient();
          } else {
            // 非APP内 当前场未曾刮开过 则可刮一次

            _.modelType = 2;
            _.isshowType = true;
          }
        }
      } else if (actTab == "over") {
        _.toast("活动已结束");
      } else if (actTab == "next") {
        if(_.$root.ISAPP)  _.toast(
          "活动开始才能刮奖哟！设置提醒多得一张"
        );
        else
        _.toast(
          "活动开始才能刮奖哟！新人下载斗牛APP微信授权登录，再得3张刮刮乐，还可拿520元新人大礼包~"
        );
      } else {
        _.toast("打开刮奖弹框");
      }
    },

    addChance(type) {
      // unionid activityid nickname image 参与人头像  helpunionid 助力者微信id  helpuserimage 助力者微信头像
      // type 1:参与获得 2:首次分享 3:好友赞助 4:设置提醒
      type = type || 2;
      this.urlParams();
      let _ = this,
        { uid, unionid, actId, modelData } = _,
        params = {
          type,
          uid: modelData.uid || uid,
          unionid: modelData.unionid,
          activityid: modelData.activityid || actId,
          nickname: modelData.nickname || "",
          image: modelData.image || "",
          helpunionid: modelData.helpunionid || "",
          helpnickname: modelData.helpnickname || "",
          helpuserimage: modelData.helpuserimage || ""
        };
      // 判断 unionid 是不是数组
      if (!!Array.isArray(params.unionid)) {
        params.unionid = params.unionid.join("");
      }
      // alert(JSON.stringify(params))
      addchance(params)
        .then(res => {
          if (type == 4) _.toast("设置提醒成功~");
          else _.getShareInfo();
        })
        .catch(e => {
          console.error("addChance error: ", e);
          if (e) _.toast(e.msg);
          if (type == 3) {
            setTimeout(() => {
              _.addChance();
            }, 500);
          }
        });
    },
    dealShare(info) {
      let _ = this,
        { uid, selectActId } = _,
        { headimgurl, nickname, unionid } = _.authUser,
        { activityid } = _.$route.query,
        pad = "unionid=" + (unionid || "");
      // 分享链接已拼参数时 直接拼unionid
      // 未拼接参数时 拼 nickname image activityid unionid uid (uid未获取到可不拼)
      if (info.url.indexOf("?") > -1) pad = "&" + pad;
      else
        pad = `?activityid=${activityid || selectActId}&uid=${uid ||
          ""}&unionid=${unionid || ""}&nickname=${encodeURIComponent(
          nickname || ""
        )}&image=${encodeURIComponent(headimgurl || "")}`;
      info.url = info.url + pad;
      return info;
    },
    getShareInfo() {
      let _ = this,
        { uid, unionid, actId } = _;
      //  alert(localStorage.getItem(_wx_auth_key) || "{}")
      shareforhelp({ activityid: actId, uid, unionid })
        .then(res => {
          if (res) {
            let info = _.dealShare(res);
            _.modelData.share = info;

            if (_.$root.ISAPP) {
              _.javascriptBridge({
                name: "getAppActivityShareContent",
                params: {
                  sharetitle: info.title,
                  sharecontent: info.content,
                  sharepicurl: info.icon,
                  shareurl: info.url,
                  hideshareicon: false,
                  pageaction:1
                }
              });
            } else {
              _.initShare({
                type: 2,
                info: {
                  title: info.title,
                  url: info.url,
                  img: info.icon,
                  desc: info.content
                }
              });
            }
          }
        })
        .catch(e => {
          console.error("getShareInfo error:", e);
        });
    },

    getRemainCount() {
      let _ = this,
        { actTab, actId, unionid } = _;
      if (_.$root.ISAPP) unionid = _.user.uid || "";
      ScratchRemaincount(actId, unionid)
        .then(res => {
          if (_.actTab != "now") return;
          remainTimer = setTimeout(() => {
            if (_.actTab == "now") _.getRemainCount();
          }, remainInterval);

          let rc = (res.remainscratchnum || 0).toString().split(""),
            len = rc.length,
            rwc = (res.remainwinningnum || 0).toString().split("");
          if (rc.length < 6)
            for (let i = 0; i < 6 - len; i++) {
              rc.unshift(0);
            }

          if (rwc.length < 2) rwc.unshift(0);

          _.remainCount = rc;
          _.remainWinCount = rwc;

          // 广播中奖者
          if (res.winnernfo && res.winnernfo.code) {
            _.modelData = { ...res.winnernfo };
            setTimeout(() => {
              _.modelType = 1;
              _.isshowType = true;
            }, 5000);
          }
        })
        .catch(e => {
          console.error("getRemainCount error: ", e);
          if (e) _.toast(e.msg);
        });
    },

    dealRemainCount() {
      let _ = this,
        { actTab, currAct } = _;

      if (remainTimer) clearTimeout(remainTimer);

      switch (actTab) {
        case "over":
        case "next":
          // _.remainCount = [1, 0, 0, 0, 0, 0];
          // _.remainWinCount = [1, 0];
          let rc = (currAct.sendoutnum || currAct.remainscratchnum || 0)
              .toString()
              .split(""),
            len = rc.length,
            rwc = (currAct.winningnum || currAct.remainwinningnum || 0)
              .toString()
              .split("");
          if (rc.length < 6)
            for (let i = 0; i < 6 - len; i++) {
              rc.unshift(0);
            }

          if (rwc.length < 2) rwc.unshift(0);

          _.remainCount = rc;
          _.remainWinCount = rwc;
          break;
        case "now":
          if (remainTimer) clearTimeout(remainTimer);
          _.getRemainCount();
          break;
        // case "next":
        // _.remainCount = [1, 0, 0, 0, 0, 0];
        // _.remainWinCount = [1, 0];
        //   break;
      }
    },
    // countdown(time) {
    //   let _ = this;
    //   let t = DateDiff({ destination: time, type: "H" });
    //   if (t.H >= 0 && t.m >= 0 && t.s >= 0) {
    //     if (t.H === 0 && t.m === 0 && t.s === 0) {
    //       if (_timer) clearTimeout(_timer);
    //       _.cd.H = "00";
    //       _.cd.m = "00";
    //       _.cd.s = "00";
    //       Indicator.open()
    //       setTimeout(()=>{
    //         Indicator.close()
    //         _.getActs();
    //       },1300)

    //       return;
    //     }

    //     t.H = (t.H < 10 ? "0" : "") + t.H;
    //     t.m = (t.m < 10 ? "0" : "") + t.m;
    //     t.s = (t.s < 10 ? "0" : "") + t.s;
    //     _.cd = t;
    //     // console.log(_timer)
    //     _timer = setTimeout(() => {
    //       _.countdown(time);
    //     }, 1000);
    //   }
    // },
    countdown(value) {
      let _ = this;
       $timer(function (timer, count) {
        var secondTime = parseInt(value);
        var minuteTime = 0;
        var hourTime = 0;
        _timer = timer
        _.count = count
        value--;
        _.currAct.countdown--
        if (secondTime > 60) {
          //如果秒数大于60，将秒数转换成整数
          //获取分钟，除以60取整数，得到整数分钟
          minuteTime = parseInt(secondTime / 60);
          //获取秒数，秒数取佘，得到整数秒数
          secondTime = parseInt(secondTime % 60);
          //如果分钟大于60，将分钟转换成小时
          if (minuteTime > 60) {
            //获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60);
            //获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60);
          }
        }
        var obj = {
          H: hourTime > 9 ? hourTime : "0" + hourTime,
          m: minuteTime > 9 ? minuteTime : "0" + minuteTime,
          s: secondTime > 9 ? secondTime : "0" + secondTime
        };

        //
        _.cd = obj;
        // console.log(_.currAct.countdown,count)
        if (hourTime == 0 && minuteTime == 0 && secondTime == 0) {
          if (_timer) clearTimeout(_timer);
          // console.log(obj);
          //  _.getActs();
          Indicator.open();
          setTimeout(() => {
            Indicator.close();
            _.getActs();
          }, 1300);
          return;
        }
      }, 1000, 1)

      //  var time = new Date().getMilliseconds()
      //  var  dif=time-countNum
      //   countNum =time
      // _timer = setTimeout(() => {
      //   _.countdown(value);
      // }, 1000-dif);
    },
    btmHandle() {
      let _ = this,
        { actTab, currAct, actId, uid, unionid, openedCount } = _;
      switch (actTab) {
        case "over":
          _.sneakerMall();
          break;
        case "now":
          // 如果进行中刮开过, 则显示得更多并打开分享
          // 否则 直接弹出刮奖框
          if (openedCount > 0) {
            // 去分享
            // _.addChance(2); // 201902021532 放在分享调起的地方调用

            if (_.$root.ISAPP) {
              _.modelType = 5;
            } else _.modelType = 6;
            _.isshowType = true;
          } else {
            // 未刮开的第一个
            let unOpen = _.codes.find(i => !i.isopen),
              firstUnopenCodeId = unOpen.uid;
            _.doRasp(firstUnopenCodeId);
          }
          break;
        case "next":
          // 已设置提醒 不重复操作
          if (_.alarm) return;

          if (_.$root.ISAPP) {
            setreminder(actId, unionid, uid)
              .then(res => {
                currAct.remind = 1;
                _.alarm = true;

                _.addChance(4);
              })
              .catch(e => {
                _.alarm = false;
                console.error("setreminder error: ", e);
                if (e) _.toast(e.msg);
              });
          } else
            _.toast(
              "前往斗牛APP设置提醒，得更多刮刮乐，新人使用微信授权登录，再得3张刮刮乐，还可拿520元新人大礼包~"
            );
          break;
      }
    },

    toggleTab(item, tab) {
      let _ = this;
      if (_.currAct.activityid == item.activityid) return;

      _.actTab = tab;
      _.currAct = item;

      if (_timer) clearTimeout(_timer);
      _.cd.H = "00";
      _.cd.m = "00";
      _.cd.s = "00";

      // setTimeout(() => {
      _.refreshInfo();
      // }, 1000);
    },

    closeModel(val) {
      let _ = this;
      if (val) {
        _.isshowType = false;
        _.modelType = 10;
        if (_timer) clearTimeout(_timer);
        // setTimeout(() => {
        _.refreshInfo();
        // }, 1000);
      }
    },
    showLuck(luckMoney) {
      let _ = this;
      _.luckMoney = luckMoney;
      _.modelType = 3;
      _.isshowType = true;
    },
    productGo(productid) {
      let _ = this;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppSneakerDetailPage",
          params: { productid }
        });
      } else {
        _.$router.push("/sneaker/detail/" + productid);
      }
    },
    sneakerMall() {
      let _ = this;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppC2CSearchResultPage",
          params: {
            brandid: "",
            keyword: ""
          }
        });
      } else _.$router.push("/sneaker/mall");
    },
    gomain() {
      this.$router.push("/20190128/main");
    }
  }
};
</script>
<style scoped>
.app-login{
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  z-index: 100;
}
.app-login .content{
  width: 90%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background: #fff;
  border-radius: 10px;
  text-align: center;
  padding: 30px 0 20px 0;
  font-family: 'PINGFANG';
}
.app-login .content p{
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
  margin-bottom: 10px;
}
.app-login .content span{
  font-size: 12px;
  color: #999;
}
.app-login .content .btn{
  width: 80%;
  background: #333;
  height: 40px;
  line-height: 40px;
  color: #fff;
  margin: 0 auto;
  border-radius: 20px;
  margin-top: 40px;
}
.ggl-rule {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: none;
  pointer-events: none;
  transition: background 0.2s ease-in;
}
.ggl-rule.act {
  background: rgba(0, 0, 0, 0.5);
  pointer-events: unset;
}
.ggl-rule > div {
  position: absolute;
  top: -200vh;
  left: 8%;
  width: 84%;
  height: 90%;
  overflow-y: scroll;
  background: #c43029;
  color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 13px rgba(0, 0, 0, 0.4);
  padding: 20px;
  transition: top 0.3s ease-in;
}
.ggl-rule.act > div {
  top: 5%;
}
.ggl-rule p {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
}
.ggl-rule p:first-of-type {
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 15px;
}
.ggl-rule .imp {
  color: #ffcf97;
}

.load-app-img {
  display: block;
}
html {
  width: 100% !important;
}
.rasp-happy {
  background: #901610;
  min-height: 100%;
  overflow: hidden;
  padding-bottom: 120px;
  position: relative;
}
.footer {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: -2px;
  z-index: 10;
}
.footer .figure {
  position: absolute;
  width: 33.9vw;
  left: 0;
  bottom: 0;
}
.bottombtn {
  position: absolute;
  width: 36.3vw;
  height: 46px;
  left: 50%;
  top: 50%;
  line-height: 20px;
  font-size: 15px;
  color: #efb87f;
  background: url("https://files.eyee.com/activity/ggl/bottombtn.png") 0 0
    no-repeat;
  background-size: 100% 100%;
  transform: translate(-50%, -50%);
}
.bottombtn_2 {
  background: url("https://files.eyee.com/activity/ggl/alarm_greay.png") 0 0
    no-repeat;
  background-size: 100% auto;
}
.bottombtn_1 {
  background: url("https://files.eyee.com/activity/ggl/alarm.png") 0 0 no-repeat;
  background-size: 100% auto;
}
.footer img {
  display: block;
}
.tabs {
  background: linear-gradient(to right, #e94c4e, #ae0c05); /* 标准的语法 */
  height: 40px;
}
.tabs .list {
  width: 33.33%;
  font-size: 12px;
  height: 40px;
  color: #f7d8aa;
  white-space: nowrap;
}
.tabs .list.act {
  background: linear-gradient(#f5d2a2, #f7d8aa); /* 标准的语法 */
  color: #a01914;
  font-weight: bold;
}
.main-home {
  padding-top: 20px;
  /* background: url("https://files.eyee.com/activity/ggl/wrapBg.png") 0 0
    no-repeat;
  background-size: 100% 100%; */
  background: linear-gradient(#E94C4E, #931009); /* 标准的语法 */
  overflow: hidden;
  position: relative;
}
.defa-code {
  width: 100%;
}
.count-time {
  font-size: 12px;
  color: #fff;
}
.count-time .txt {
  margin-right: 17px;
}
.count-time .time {
  font-size: 20px;
  font-weight: bold;
}
.count-time .time span {
  display: inline-block;
  width: 30px;
  height: 26px;
  border-radius: 3px;
  background: #941717;
  text-align: center;
}
.count-time .next-meet {
  text-align: center;
  width: 120px;
  height: 26px;
  line-height: 26px;
  margin: 0 auto;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.5);
}
.lotter .poduct-img {
  position: relative;
  margin-top: 4px;
}
.lotter .poduct-img .drap {
  position: absolute;
  width: 52px;
  left: 25%;
  top: 6%;
}
.lotter .poduct-img .drap .price {
  font-size: 10px;
  color: #941717;
  text-decoration: line-through;
  position: absolute;
  left: 8px;
  bottom: 10px;
  transform: rotate(-10deg);
}
.lotter .poduct-img .lotter-img {
  position: absolute;
  width: 56vw;
  left: 50%;
  height: 37.5vw;
  transform: translateX(-50%);
  top: 12.5vw;
  overflow: hidden;
}
.lotter .poduct-img .lotter-img img {
  width: 100%;
}
.lotter .product-name {
  font-size: 16px;
  color: #f7d8aa;
  text-align: center;
}
.ticket-num {
  width: 90%;
  margin: 22px auto 15px auto;
  /* background: #7A7A7A; */
  background: url("https://files.eyee.com/activity/ggl/num_bg.png") 0 0
    no-repeat;
  background-size: 100% 100%;
  height: 100px;
  /* padding: 10px; */
  overflow: hidden;
  position: relative;
}
.meng-ceng {
  position: absolute;
  width: 94.5%;
  height: 84.5%;
  left: 2.8%;
  top: 3.85%;
  opacity: 0.5;
  background: #9e896b;
  border-radius: 8px;
}
.ticket-num .tk-last {
  /* border: 1px solid #EFB87F;
  border-radius: 5px; */
  height: 100%;
  font-size: 13px;
  font-weight: bold;
  color: #efb87f;
  padding: 0 5%;
}
.ticket-num .tk-last .hc-rasp {
  width: 70%;
}
.ticket-num .tk-last .hc-course {
  width: 30%;
}
.ticket-num .tk-last span i {
  font-style: normal;
  width: 7vw;
  height: 30px;
  background: #efb87f;
  margin-right: 2px;
  color: #3f3131;
  font-weight: bold;
  border-radius: 3px;
  font-size: 34px;
}
.mtb {
  margin-bottom: 6px;
  margin-top: -10px;
  font-size: 10px;
}
.classical {
  color: #fff;
  font-size: 12px;
}
.classical .send-stamps {
  width: 94%;
  background: #cc3234;
  height: 40px;
  border-radius: 20px;
  /* margin-bottom: 40px; */
}
.classical .active-txt {
  background: rgba(0, 0, 0, 0.5);
  height: 50px;
  margin-top: 10px;
  border-radius: 5px;
  width: 80%;
  position: absolute;
}
.course-code {
  min-height: 50px;
  margin: 10px;
  /* overflow: hidden; */
  position: relative;
  margin-bottom: 30px;
  margin-top: 40px;
}
.course-code .content {
  background: url("https://files.eyee.com/activity/ggl/my_lotter_bg.png") 0 0
    no-repeat;
  background-size: 100% 100%;
  position: relative;
  z-index: 2;
  /* padding: 40px 2% 6% 2%; */
  /* margin-top: 10px; */
}
.cc-int {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  border-radius: 10px;
  background: linear-gradient(#fd6450, #c73220);
  z-index: 1;
}
.course-code .btn {
  position: absolute;
  left: 50%;
  top: -5vw;
  transform: translateX(-50%);
  width: 65%;
  background: url("https://files.eyee.com/activity/ggl/btn_bg.png") 0 0
    no-repeat;
  background-size: 100% 100%;
  height: 40px;
  z-index: 4;
  color: #ffd6a7;
  font-size: 12px;
  font-weight: bold;
  padding-bottom: 8px;
}
.course-code .benchang .btn {
  top: -18.5vw;
}
.course-code .title {
  color: #901610;
  font-size: 14px;
  text-align: center;
  position: relative;
  top: 25px;
  font-weight: 500;
}
.course-code .list {
  margin-top:20px;
  padding: 22px 10px;
  position: relative;
  min-height: 50px;
}
.shou-gua {
  position: absolute;
  background: linear-gradient(#f7d8aa, #efb87f);
  font-size: 10px;
  color: #ae231c;
  padding: 3px 5px;
  top: 0px;
  border-radius: 3px;
}

.course-code .list .span {
  width: 49%;
  height: 40px;

  margin-bottom: 2%;
}
/* .course-code .list .span:nth-child(even) {
  margin-left: 2%;
} */
.course-code .list .span.wait {
  color: #ae231c;
  font-size: 14px;
  background: url("https://files.eyee.com/activity/ggl/wait-lotter.png") 0 0
    no-repeat;
  background-size: 100% 100%;
  width: 100%;
}
.course-code .list .span.wait i {
  width: 50%;
  font-style: normal;
}
.course-code .list .span.wait i:nth-child(2) {
  width: 50%;
}
.course-code .list .span .user_info {
  height: 40px;
  background: url("https://files.eyee.com/activity/ggl/win_bg.png") 0 0
    no-repeat;
  background-size: 100% 100%;
  width: 100%;
}
.course-code .list .span.span_first {
  width: 100%;
}

.user_info i {
  font-style: normal;
  font-size: 10px;
  color: #ffcf97;
}
.user_info .header_img {
  width: 25%;
  border-radius: 50%;
  overflow: hidden;
}
.user_info .header_img img {
  transform: scale(0.7);
  border-radius: 50%;
  border: 1px solid #efb87f;
}
.user_info .name {
  width: 40%;
}
.user_info .code {
  width: 40%;
}
.course-code .list .span.span_first .user_info{
  background: url("/static/imgs/win_bg.png") 0 0
    no-repeat;
  background-size: 100% 100%;
}
.course-code .list .span.span_first .user_info .header_img{
    width: 12%;
}
.course-code .list .span.span_first .user_info .name{
   padding-left: 10px;
   width: 20%;
}
.course-code .list .span.span_first .user_info .code{
   width: 20%;
}
.course-code .list .span.span_first .jieshao{
  font-size: 12px;
  width: 45%;
}
.course-code .list .span.span_first .jieshao i:nth-child(2){
  font-size: 10px;
}
.my_code {
  width: 100%;
  color: #a01914;
  font-size: 12px;
  height: 60px;
  margin-bottom: 8px;
  padding-left: 10px;
  background: linear-gradient(#f7d8aa, #efb87f);
  position: relative;
  width: 100%;
}
.my_code .wait_gua_bg {
  width: 97%;
  height: 90%;
  position: absolute;
  left: 50%;
  top: 49%;
  transform: translate(-50%, -50%);
  overflow: hidden;
}
.wait_gua_bg p {
  position: absolute;
  font-size: 16px;
  color: #901610;
  left: 50%;
  top: 50%;
  font-weight: bold;
  white-space: nowrap;
  transform: translate(-50%, -50%);
}
.wait_gua_bg p span:last-of-type {
  font-size: 9px;
}
.my_code.cardCanvas {
  padding: 0;
  text-align: center;
}

.code-flag {
  position: relative;
  margin-bottom: 8px;
}
.good_friend_zanzhu_0::after {
  background: url("https://files.eyee.com/activity/ggl/good_friend_zanzhu_0.png");
}
.good_friend_zanzhu_1::after {
  background: url("https://files.eyee.com/activity/ggl/good_friend_zanzhu_1.png");
}
.good_friend_zanzhu_2::after {
  background: url("https://files.eyee.com/activity/ggl/good_friend_zanzhu_2.png");
}
.first_0::after {
  background: url("https://files.eyee.com/activity/ggl/first_0.png");
}
.first_1::after {
  background: url("https://files.eyee.com/activity/ggl/first_1.png");
}
.first_2::after {
  background: url("https://files.eyee.com/activity/ggl/first_2.png");
}
.meet_0::after {
  background: url("https://files.eyee.com/activity/ggl/meet_0.png");
}
.meet_1::after {
  background: url("https://files.eyee.com/activity/ggl/meet_1.png");
}
.meet_2::after {
  background: url("https://files.eyee.com/activity/ggl/meet_2.png");
}
.new_0::after {
  background: url("https://files.eyee.com/activity/ggl/new_0.png");
}
.new_1::after {
  background: url("https://files.eyee.com/activity/ggl/new_1.png");
}
.new_2::after {
  background: url("https://files.eyee.com/activity/ggl/new_2.png");
}
.yu_0::after {
  background: url("https://files.eyee.com/activity/ggl/yu_0.png");
}
.yu_1::after {
  background: url("https://files.eyee.com/activity/ggl/yu_1.png");
}
.yu_2::after {
  background: url("https://files.eyee.com/activity/ggl/yu_2.png");
}
/* 这个位置要放在上面背景图设置之后 */
.code-flag::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background-repeat: no-repeat;
  background-size: 100% auto;
  width: 54px;
  height: 54px;
}
/*
.good_friend_zanzhu_0::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/good_friend_zanzhu_0.png") 0 0 no-repeat;
  background-size: 100% 100%;
  width: 45px;
  height: 45px;
}
.good_friend_zanzhu_1::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/good_friend_zanzhu_1.png") 0 0 no-repeat;
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
}
.good_friend_zanzhu_2::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/good_friend_zanzhu_2.png") 0 0 no-repeat;
  background-size: 100% 100%;
  width: 45px;
  height: 45px;
}
.first_0::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/first_0.png") 0 0 no-repeat;
  background-size: 100% auto;
  width: 45px;
  height: 45px;
}
.first_1::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/first_1.png") 0 0 no-repeat;
  background-size: 100% auto;
  width: 48px;
  height: 32px;
}
.first_2::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/first_2.png") 0 0 no-repeat;
  background-size: 100% auto;
  width: 45px;
  height: 45px;
}
.meet_0::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/meet_0.png") 0 0 no-repeat;
  background-size: 100% auto;
  width: 48px;
  height: 45px;
}
.meet_1::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/meet_1.png") 0 0 no-repeat;
  background-size: 100% auto;
  width: 48px;
  height: 36px;
}
.meet_2::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/meet_2.png") 0 0 no-repeat;
  background-size: 100% auto;
  width: 48px;
  height: 45px;
}
.new_0::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/new_0.png") 0 0 no-repeat;
  background-size: 100% auto;
  width: 45px;
  height: 45px;
}
.new_1::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/new_1.png") 0 0 no-repeat;
  background-size: 100% auto;
  width: 30px;
  height: 30px;
}
.new_2::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/new_2.png") 0 0 no-repeat;
  background-size: 100% auto;
  width: 45px;
  height: 45px;
}
.yu_0::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/yu_0.png") 0 0 no-repeat;
  background-size: 100% auto;
  width: 45px;
  height: 45px;
}
.yu_1::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/yu_1.png") 0 0 no-repeat;
  background-size: 100% auto;
  width: 48px;
  height: 36px;
}
.yu_2::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  background: url("https://files.eyee.com/activity/ggl/yu_2.png") 0 0 no-repeat;
  background-size: 100% auto;
  width: 48px;
  height: 45px;
} */

.code-num {
  font-weight: 800;
}

.my_code .us-header {
  width: 36%;
}
.my_code .us-header img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 5px;
}
.defa-code .title {
  color: #ffcf97;
  font-size: 18px;
  line-height: 30px;
  top: 0;
}
.defa-code .txt {
  color: #ffcf97;
  font-size: 12px;
  line-height: 24px;
}
.defa-img {
  width: 27%;
}

.code-flag:not(.my_code) {
  border-radius: 5px;
  overflow: hidden;
}
.not-the {
  font-size: 12px;
  color: #fff;
  width: 100%;
  position: relative;
  opacity: 0.8;
  height: 34px;
  padding-left: 10px;
}
.not-the::before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  background: #fff;
  opacity: 0.5;
  left: 0;
  top: 0;
  /* border-radius: 5px; */
}
.not-the span:nth-child(2) {
  margin-left: 20%;
}
.not-the img {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 5px;
}
.down_up {
  margin: 16px auto 0;
  width: 40%;
  position: relative;
}
.down_up img {
  display: block;
}
.down_up.act img {
  transform: scaleY(-1);
}
.down_up p {
  position: absolute;
  color: #fcc394;
  top: 50%;
  left: 46%;
  height: 88%;
  width: 45%;
  font-size: 14px;
  transform: translate(-50%, -50%);
  background: #e13a31;
  background: linear-gradient(
    180deg,
    rgba(195, 13, 13, 1) 0%,
    rgba(253, 100, 80, 1) 100%
  );
}
/* ------------ */
.card_div {
  position: relative;
  height: 300px;
  z-index: 100;
}
.card_view {
  width: 200px;
  height: 50px;
  line-height: 100px;
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  position: relative;
  position: absolute;
  color: #333;
  top: 0px;
  left: 100px;
}
.main-active,
.c2c {
  position: fixed;
  right: 0;
  top: 60%;
  width: 20%;
  z-index: 15;
}
.main-active {
  top: 40%;
}
</style>

