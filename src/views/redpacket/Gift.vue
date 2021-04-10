<template>
  <div>
    <div class="btn btn-full" @click="getGift">
      <img src="https://files.eyee.com/activity/redpacket/btn_get.png" alt />
    </div>

    <p class="link" @click="modalType = 1">领取规则</p>

    <div class="modal" :class="{act:modalType>0}">
      <div class="main">
        <p class="modal-title">{{modalData.title}}</p>
        <div class="modal-info" :class="modalData.class">
          <template v-if="modalType==1">
            <p>1.新人大礼包只有未注册用户完成注册后才可领取。</p>
            <p>2.新人大礼包内的优惠券有效期从领取时当天开始计算。</p>
            <p>3.优惠券过期未使用的，不予以返还。</p>
            <p>4.新人大礼包的额度平台会根据不同情况发放不同额度。</p>
            <p>5.优惠券的使用规则，平台拥有最终解释权。</p>
          </template>
          <template v-else-if="modalType==2">
            <p>520元大礼包已放入你的账户中</p>
            <p class="sub-info">请至“我的-红包卡券”中查看</p>
          </template>
          <template v-else-if="modalType==3">
            <p>当前手机号已领取过新人大礼包，你可通过邀请好友获得额外红包</p>
          </template>
        </div>
        <div class="flex-btwn">
          <loader class="load" from="8" ref="load" v-if="modalType==3" style="margin-right:2%;">
            <div class="btn">下载斗牛APP</div>
          </loader>
          <div class="btn act_btn" @click="modalHandle">{{modalData.btn}}</div>
        </div>
        <i class="ico-X" @click="closeModal"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getRedPacket } from "@/common/api/user";
import Loader from "@/comps/Loader";
export default {
  name: "RedpacketGift",
  components: { Loader },
  data() {
    return {
      modalType: 0 // 1 规则，2 成功，3 失败
    };
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
          data.title = "恭喜你，领取成功！";
          data.btn = "立即查看";
          data.class = "got";
          break;
        case 3:
          data.title = "抱歉，领取失败！";
          data.btn = "邀请好友得红包";
          data.class = "fail";
          break;
      }
      return data;
    }
  },
  methods: {
    getGift() {
      let _ = this,
        {
          user,
          $route: { query },
          $root: { ISMP }
        } = _;
      if (!(user && user.uid)) {
        if (ISMP)
          wx.miniProgram.navigateTo({
            url: query.from == "c2c" ? "/pages/home/bind" : "/pages/other/bind"
          });
        else _.$router.push("/login");
      } else _.getRedPacket();
    },
    getRedPacket() {
      let _ = this,
        {
          user,
          $route: { query }
        } = _,
        options = {
          inviteduserid: query.inviteduserid,
          activityid: query.activityid,
          mobile: user.mobile,
          receivetype: 3,
          activitytype: 1
        };
      getRedPacket(options)
        .then(res => {
          if (res.receivestatus == 0) {
            _.closeModal();
            _.modalType = 2;
            $log({ e: "getRedpacket", p: { type:1 } });
          } else if (res.receivestatus == 1 || res.receivestatus == 2) {
            _.closeModal();
            _.modalType = 3;
          }
        })
        .catch(err => {
          _.toast(err.msg);
        });
    },
    closeModal() {
      this.modalType = 0;
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
      // 1 规则，2 成功，3 失败
      switch (modalType) {
        case 1:
          closeModal();
          break;
        case 2:
          if (ISAPP) {
            _.javascriptBridge({
              name: "gotoAppRedPacketCouponPage"
            });
          } else if (ISMP) {
            wx.miniProgram.navigateTo({ url: "/pages/user/coupon" });
          } else $router.push("/user/coupon");
          break;
        case 3:
          $router.push(`/redpacket/share?activityid=${query.activityid}`);
          break;
      }
    }
  }
};
</script>