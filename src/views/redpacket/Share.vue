<template>
  <div>
    <p class="link" @click="modalType = 1">领取规则</p>

    <div class="steps-box">
      <ul class="steps">
        <template v-for="(si, sIdx) in steps">
          <li class="step" :class="{act:si.act}" :key="'steps'+sIdx">
            <div class="step-cell">
              <img v-lazy="'https://files.eyee.com/activity/redpacket/cell_bg.png'" alt />
              <div class="flex-center flex-col">
                <p>
                  <span class="sup">￥</span>
                  <span class="bold">{{si.momey}}</span>
                </p>
                <p class="mid">优惠券</p>
                <p class="sub">({{si.act?'已':'未'}}获得)</p>
              </div>
            </div>
            <div class="step-dot">
              <img
                v-lazy="`https://files.eyee.com/activity/redpacket/dot${si.act?'-act':''}.png`"
                alt
              />
            </div>
            <p>{{si.registercount>0?`${si.registercount}位好友`:'分享成功'}}</p>
          </li>
        </template>
      </ul>
    </div>

    <div class="sec-box">
      <p class="rp-sec-title bold">
        <i class="pendant"></i>
        <i class="pendant"></i>
        <span>红包排行榜</span>
        <i class="pendant"></i>
        <i class="pendant"></i>
      </p>
      <ul>
        <template v-if="rankList.length>0">
          <li
            v-for="(ri, ridx) in rankList"
            :key="'rank'+ridx"
            class="flex-aic flex-btwn rank-cell"
            v-show="ridx<3||(ridx>2&&tgRankList)"
          >
            <img class="avatar" v-lazy="ri.imageurl" alt />
            <div class="flex-col flex-btwn">
              <p class="bold">{{ri.mobile}}</p>
              <p v-if="ri.invitatecount>0">邀请{{ri.invitatecount}}位好友注册</p>
              <p v-else>分享成功</p>
            </div>
            <p>{{ri.totalmoney}}元红包已入账</p>
          </li>
          <li class="more flex-center" @click="tgRankList=!tgRankList" v-show="rankList.length>3">
            <span>{{tgRankList?'向上收起':'查看更多'}}</span>
            <i :class="{'ico-arrow-t':tgRankList,'ico-arrow-b':!tgRankList}"></i>
          </li>
        </template>
        <li v-else>未加载到排行榜数据~</li>
      </ul>
    </div>

    <div class="fix-btm" @click="callShare">
      <div class="btn">
        <img v-lazy="'https://files.eyee.com/activity/redpacket/btn_invite.png'" alt />
      </div>
    </div>

    <div class="modal" :class="{act:modalType>0}" @click="closeHandle">
      <div class="popup-box" :class="{share:modalType == 3}" v-if="modalType>1">
        <template v-if="modalType ==2">
          <img
            class="popup-banner"
            v-lazy="'https://files.eyee.com/redpacket/photo/popup_title.png'"
            alt
          />
          <div class="cpn-box">
            <img v-lazy="'https://files.eyee.com/activity/redpacket/cpn_bg.png'" alt />
            <div class="flex">
              <p class="flex-col flex-center cpn-title">
                <span>优</span>
                <span>惠</span>
                <span>券</span>
              </p>
              <div class="flex-col flex-center cpn-info">
                <p class="flex-btwn">
                  <span>
                    <span class="cpn-sub">￥</span>
                    <span class="cpn-price">{{steps[0].momey}}</span>
                  </span>
                  <span class="cpn-name">{{steps[0].name}}</span>
                </p>
                <p class="cpn-time">有效期：{{steps[0].starttime}} ～ {{steps[0].endtime}}</p>
              </div>
            </div>
          </div>
          <div class="btn" @click.stop="modalHandle">查看我的红包</div>
          <div class="ico-close" @click="closeModal"></div>
        </template>
        <template v-else-if="modalType == 3">
          <img
            class="popup-guide"
            v-if="$root.ISWX"
            v-lazy="'https://files.eyee.com/activity/redpacket/share_guide.png'"
            alt
          />
          <p class="share-title">{{$root.ISWX?'点击右上角':'复制链接'}}分享好友</p>
          <p class="share-desc">
            <span>邀请新用户注册即可获得拉新红包</span>
            <br />
            <span>注册数越多，红包越多</span>
          </p>
          <div
            v-if="!$root.ISWX"
            class="share-btn"
            @click="copyLink"
            :data-clipboard-text="shareUrl"
          >复制链接</div>
        </template>
      </div>
      <div class="main" v-else-if="modalType==1">
        <p class="modal-title">{{modalData.title}}</p>
        <div class="modal-info" :class="modalData.class">
          <p v-html="rule"></p>
        </div>
        <div class="btn" @click="modalHandle">{{modalData.btn}}</div>
        <i class="ico-X" @click="closeModal"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  GetShareRule,
  GetInviteUid,
  // GetShareList,
  GetStandardList,
  GetRankList,
  UpdPopupStatus,
  GiveOutRedPacket
} from "@/utils/api/redpacket";
import Clipboard from "clipboard";

let actId = "",
  iUid = "",
  memberStatus = -1,
  shareInfo = {};
export default {
  name: "RedpacketShare",
  data() {
    return {
      modalType: 0, // 1 规则，2 红包弹框，3 分享
      rule: "",
      shareUrl: "",

      steps: [],

      rankList: [],
      tgRankList: false
    };
  },
  watch: {
    modalType(val, old) {
      let _ = this;
      if (val === 1 && !_.rule) {
        GetShareRule()
          .then(res => {
            _.rule = res.sharerule;
          })
          .catch(e => {
            console.error("GetShareRule error: ", e);
          });
      }
    }
  },
  computed: {
    ...mapGetters({
      user: "userInfo"
    }),
    modalData() {
      let _ = this,
        { modalType } = _,
        data = {};
      switch (modalType) {
        case 1:
          data.title = "领取规则";
          data.btn = "确认";
          data.class = "rule";
          break;
        case 2:
          break;
        case 3:
          break;
      }
      return data;
    }
  },
  mounted() {
    let _ = this,
      {
        $root: { loging }
      } = _;

    window._shareCallBack = function(res, via) {
      if (res == 1) _.shareOk();
    };

    actId = _.$route.query.activityid;

    if (loging) {
      loging.then($ => {
        _.getStandardList();
        _.getRankList();
        _.getInviteUid();
      });
    } else {
      _.getStandardList();
      _.getRankList();
      _.getInviteUid();
    }

    // _.$nextTick(() => {
    //   _.getShareBroadcast();
    // });
  },
  methods: {
    getInviteUid() {
      let _ = this,
        { ISAPP, ISMP } = _.$root;
      GetInviteUid()
        .then(res => {
          console.log("GetInviteUid res ", res);
          iUid = res.inviteduserid;

          let shareurl = `${
            window.origin
          }/redpacket/gift?activityid=${actId}&inviteduserid=${encodeURIComponent(
            iUid
          )}`;
          shareInfo = {
            sharecontent: "买潮流服装、买球鞋、买联名！更有520元礼包助力！",
            sharepicurl:
              "https://files.eyee.com/activity/redpacket/share_gift.png",
            shareurl,
            sharetitle: "新人大礼包",
            xcxurl: `/pages/home/web?url=${encodeURIComponent(shareurl)}`,
            xcxicon:
              "https://files.eyee.com/activity/redpacket/share_gift_wx.png",
            xcxid: "gh_2bb2ac4a7aff",
            callbackname: "_shareCallBack"
          };
          _.shareUrl = shareurl;

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
          console.error("GetInviteUid error: ", e);
        });
    },
    closeModal() {
      this.modalType = 0;
    },
    closeHandle() {
      let _ = this;
      if (_.modalType == 3) _.closeModal();
    },
    modalHandle() {
      let _ = this,
        {
          modalType,
          closeModal,
          $router,
          $route: { query },
          $root: { ISAPP, ISMP }
        } = _;
      closeModal();
      // 1 规则，2 红包弹框，3 分享
      switch (modalType) {
        case 2:
          if (ISAPP) {
            _.javascriptBridge({
              name: "gotoAppRedPacketCouponPage"
            });
          } else if (ISMP) {
            wx.miniProgram.navigateTo({ url: "/pages/user/coupon" });
          } else $router.push("/user/coupon");
          break;
      }
    },
    getShareBroadcast() {
      let _ = this;
      GetShareList()
        .then(res => {
          console.log("getShareBroadcast res ", res);
        })
        .catch(e => {
          console.error("getShareBroadcast error: ", e);
        });
    },
    getStandardList(check) {
      let _ = this;
      GetStandardList(actId)
        .then(res => {
          /*
            "sharesuccessmoney":"分享成功金额"，
            "progress":"达标进度（0.分享成功达标，1-max:后台配置的达标阶梯数）"，
            "popupstatus":"红包页面弹窗（0.未弹窗提示1.已弹窗提示）",
            "sspopupstatus":"分享成功红包页面弹窗（0.未弹窗提示1.已弹窗提示）",
            "sharesuname":"分享成功红包名称",
            // "sharesuplatformtype":"分享成功平台类型0 平台 1 店铺  2 商品 3 定向",
            "sharesutarttime":"分享成功开始时间",
            "sharesuendtime":"分享成功结束时间",
            "list":[{
                "registercount":"注册人数",
                "momey":"奖励金额",
                "name":"红包名称",
                // "platformtype":"平台类型0 平台 1 店铺  2 商品 3 定向",
                "starttime":"开始时间",
                "endtime":"结束时间",
              }]
          */
          console.log("GetStandardList res ", res);
          if (res && res.list)
            _.steps = [
              {
                starttime: res.starttime,
                endtime: res.endtime,
                name: res.sharesuname,
                momey: res.sharesuccessmoney,
                registercount: 0
              },
              ...res.list
            ].map((i, idx) => {
              i.act = res.progress >= idx;
              return i;
            });

          memberStatus = res.sspopupstatus;

          if (check === 1 && res.sspopupstatus == 0) {
            // 更新分享成功弹框状态
            UpdPopupStatus({
              activityid: actId,
              progress: res.progress,
              sspopupstatus: res.sspopupstatus
            })
              .then($ => {})
              .catch(e => {
                console.error("UpdPopupStatus error: ", e);
              });
            // 分享成功发放红包
            GiveOutRedPacket(actId)
              .then($ => {})
              .catch(e => {
                console.error("GiveOutRedPacket error: ", e);
              });

            _.modalType = 2;
          }
        })
        .catch(e => {
          console.error("GetStandardList error: ", e);
        });
    },
    getRankList() {
      let _ = this;
      GetRankList(actId)
        .then(res => {
          // console.log("GetRankList res ", res);
          if (res && res.list)
            _.rankList = res.list.map(i => {
              i.mobile = i.mobile.replace(
                /.*?-(\d{3})\d{4}(\d{3})/,
                "$1****$2"
              );
              return i;
            });
        })
        .catch(e => {
          console.error("GetRankList error: ", e);
        });
    },
    shareOk() {
      let _ = this;
      _.modalType = 0;

      if (memberStatus != 1) _.getStandardList(1);
    },
    callShare() {
      let _ = this,
        {
          user,
          $route: { query },
          $root: { ISAPP, ISMP }
        } = _;
      if (!(user && user.uid)) {
        if (ISMP)
          wx.miniProgram.navigateTo({
            url: query.from == "c2c" ? "/pages/home/bind" : "/pages/other/bind"
          });
        else _.$router.push("/login");
      } else {
        if (ISAPP) {
          _.javascriptBridge({
            name: "callAppShareDialog",
            params: shareInfo
          });

          // 模拟分享成功
          // window._shareCallBack(1);
        } else {
          _.modalType = 3;
        }
      }
    },
    copyLink() {
      let _ = this;
      var clipboard = new Clipboard(".share-btn");

      _.toast("复制成功，快去分享吧~");

      _.shareOk();
    }
  }
};
</script>
