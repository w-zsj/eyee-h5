<template>
  <div>
    <div class="sec-box">
      <template v-if="status==0">
        <div class="btn" @click="getRedpacket(1)">
          <img v-lazy="'https://files.eyee.com/activity/redpacket/btn_get.png'" alt />
        </div>
      </template>
      <template v-else>
        <div class="cpn-box">
          <img v-lazy="'https://files.eyee.com/activity/redpacket/cpn_bg.png'" alt />
          <div class="flex">
            <p class="flex-col flex-center cpn-title">
              <span>红</span>
              <span>包</span>
            </p>
            <div class="flex-col flex-center cpn-info" v-if="status==1">
              <p class="flex-btwn">
                <span>
                  <span class="cpn-sub">￥</span>
                  <span class="cpn-price">{{cpnInfo.money}}</span>
                </span>
                <!-- <span class="cpn-name"></span> -->
              </p>
              <p class="cpn-time">有效期：{{cpnInfo.starttime}} ～ {{cpnInfo.endtime}}</p>
            </div>
            <div class="flex-col flex-center cpn-hint" v-else>
              <p>来晚了一步</p>
              <p>红包已经被抢完了</p>
            </div>
          </div>
        </div>
        <template v-if="status==1">
          <p class="send-hint">红包已发放至账户：{{cpnInfo.mobile}}</p>
          <div class="btn use-btn" @click="goHome">
            <img v-lazy="'https://files.eyee.com/activity/redpacket/btn_use.png'" alt />
          </div>
        </template>
        <div class="btn" @click="goShare">
          <img v-lazy="'https://files.eyee.com/activity/redpacket/btn_invite.png'" alt />
        </div>
      </template>
    </div>

    <div class="sec-box" v-if="list&&list.length>0">
      <p class="rp-sec-title bold">
        <i class="pendant"></i>
        <i class="pendant"></i>
        <span>拼手气潮咖榜</span>
        <i class="pendant"></i>
        <i class="pendant"></i>
      </p>
      <ul>
        <li
          v-for="(i, idx) in list"
          :key="'list'+idx"
          class="flex-aic flex-btwn luck-cell"
          v-show="idx<3||(idx>2&&tgList)"
        >
          <div :class="{best:i.isbestluck}">
            <img class="avatar" v-lazy="i.imageurl" alt />
          </div>
          <div class="flex-col flex-btwn luck-info">
            <p class="flex-wrap">
              <span class="bold">{{i.username}}</span>
              <span class="time">{{i.createtime}}</span>
            </p>
            <p class="comment">{{i.comments}}</p>
          </div>
          <p class="bold luck-price">
            <span>￥</span>
            <span>{{i.receivemoney}}</span>
          </p>
        </li>
        <li class="more flex-center" @click="tgList=!tgList" v-show="list.length>3">
          <span>{{tgList?'向上收起':'查看更多'}}</span>
          <i :class="{'ico-arrow-t':tgList,'ico-arrow-b':!tgList}"></i>
        </li>
      </ul>
    </div>

    <div class="sec-box">
      <p class="rp-sec-title bold">
        <i class="pendant"></i>
        <i class="pendant"></i>
        <span>活动规则</span>
        <i class="pendant"></i>
        <i class="pendant"></i>
      </p>
      <div class="rule" v-html="rule"></div>
    </div>

    <div class="modal" :class="{act:showInvalid}">
      <div class="main">
        <p class="hint-title">活动提示</p>
        <p class="hint-info">
          该分享链接已失效哦~
          <br />下单后可获取新的红包链接
        </p>
        <div class="hint-btn" @click="goHome">去逛逛</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  GetActivityRules,
  GetOrderShare,
  GetRedpacket,
  GetRedpacketInfo,
  GetRedpacketList
} from "@/utils/api/redpacket";

let orderno = "",
  actId = "",
  shareActId = "",
  isB2C = false;

const getQueryParam = query => {
  let ret = {};
  query
    .split("?")[1]
    .split("&")
    .forEach(i => {
      let arr = i.split("=");
      ret[arr[0]] = arr[1];
    });
  return ret;
};
export default {
  name: "RedpacketLuck",
  data() {
    return {
      rule: "",

      status: 0, // 0 可领取，1 已领取，2 来晚了
      cpnInfo: {},

      list: [],
      tgList: false,

      showInvalid: false
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo"
    })
  },
  mounted() {
    let _ = this,
      {
        user,
        $route: { query },
        $root: { loging }
      } = _;
    console.log("luck query", _.$route.query);
    orderno = query.orderno;
    actId = query.activityid;
    isB2C = orderno[0] === "1";

    // if (_.$root.ISMP) {
    //   _.getParams();
    // } else
    if (loging) {
      loging.then($ => {
        _.getRule();
        _.getShareInfo();
      });
    } else {
      _.getRule();
      if (user && user.uid) _.getShareInfo();
    }

    // setTimeout(() => {
    //   _.getRedpacket();
    // }, 1300);
  },
  methods: {
    getParams() {
      let _ = this;
      _.getQueryParamUser()
        .then(res => {
          // console.log("res----", res);
          _.getRule();
          _.getShareInfo();
        }) // 登录成功 处理事件s
        .catch(err => console.error("参数获取失败", err));
    },
    getRule() {
      let _ = this;
      GetActivityRules({ activityid: actId, orderno })
        .then(res => {
          console.log("GetActivityRules res ", res);
          _.rule = res.activityrules;

          // "isvalidity":#是否失效 1.是，2.否
          if (res.isvalidity == 1) {
            _.showInvalid = 1;
          } else {
            _.getRedpacket();
          }
        })
        .catch(e => {
          console.error("GetActivityRules error: ", e);
        });
    },
    getShareInfo() {
      let _ = this,
        { ISAPP, ISMP } = _.$root;
      GetOrderShare({ orderno, isB2C })
        .then(res => {
          console.log("GetOrderShare res ", res);
          let shareInfo = {
            sharecontent: res.content,
            sharepicurl: res.icon,
            shareurl: res.url,
            sharetitle: res.title,
            xcxurl: res.xcxurl,
            xcxicon: res.xcxicon,
            xcxid: res.xcxid,
            callbackname: "_shareCallBack"
          };

          if (ISAPP) {
            _.javascriptBridge({
              name: "getAppActivityShareContent",
              params: {
                ...shareInfo,
                hideshareicon: false
              }
            });
          } else if (ISMP) {
            wx.miniProgram.postMessage({ data: { share: shareInfo } });
          } else {
            _.initShare({
              type: 2,
              info: {
                title: shareInfo.sharetitle,
                url: shareInfo.shareurl,
                img: shareInfo.sharepicurl,
                desc: shareInfo.sharecontent
              }
            });
          }
        })
        .catch(e => {
          console.error("GetOrderShare error: ", e);
        });
    },
    getRedpacketList(shareid) {
      let _ = this;
      GetRedpacketList(shareid)
        .then(res => {
          console.log("GetRedpacketList res ", res);
          if (res && res.list) _.list = res.list;
        })
        .catch(e => {
          console.error("GetRedpacketList error: ", e);
        });
    },
    getRedpacket(mustlogin) {
      let _ = this,
        {
          user,
          $route: { query },
          $root: { ISMP }
        } = _;
      console.log("user--->>>", user);
      if (!(user && user.uid)) {
        if (mustlogin) {
          if (ISMP)
            wx.miniProgram.navigateTo({
              url:
                query.from == "c2c" ? "/pages/home/bind" : "/pages/other/bind"
            });
          else _.$router.push("/login");
        }
      } else {
        GetRedpacket({ orderno, activityid: actId })
          .then(res => {
            console.log("GetRedpacket res ", res);
            shareActId = res.shareactivityid;
            $log({ e: "getRedpacket", p: { type: 2 } });
            _.getInfo(res.receiveid);
            _.getRedpacketList(res.shareid);
          })
          .catch(e => {
            console.error("GetRedpacket error: ", e);
            let msgRet = getQueryParam(e.msg);
            shareActId = msgRet.shareactivityid;

            if (e.code == 1511447 || e.code == 1511448) {
              _.getInfo(msgRet.receiveid);

              _.toast(
                e.code == 1511447 ? "您已领取过该红包~" : "已达到领取上限~"
              );
            } else if (e.code == 1511666) {
              _.toast("红包已领完~");
              _.status = 2;
            } else _.toast("领取失败~");

            _.getRedpacketList(msgRet.shareid);
          });
      }
    },
    getInfo(receiveid) {
      let _ = this;
      GetRedpacketInfo(receiveid)
        .then(res => {
          console.log("GetRedpacketInfo res ", res);
          res.mobile = res.mobile.replace(
            /.*?-(\d{3})\d{4}(\d{3})/,
            "$1****$2"
          );
          _.cpnInfo = res;

          _.status = 1;
        })
        .catch(e => {
          console.error("GetRedpacketInfo error: ", e);
        });
    },
    goShare() {
      this.$router.push(`/redpacket/share?activityid=${shareActId}`);
    },
    goHome() {
      let {
        $router,
        $root: { ISAPP, ISMP }
      } = this;
      if (ISAPP) {
        this.javascriptBridge({
          name: "gotoAppMallCenterPage",
          params: {
            homepageindex: 2
          }
        });
      } else if (ISMP) {
        wx.miniProgram.reLaunch({ url: "/pages/home/index" });
      } else $router.replace("/");
    }
  }
};
</script>

