<template>
  <div class="red-rain-wrap">
    <div class="myredpack">
      <div class="title">我的中奖</div>
      <div v-if="amount>0 || coupon.length>0">
        <div class="myredpack_list">
          <div class="myredpack_info" v-if="amount>0">
            <div class="myredpack_info_left">
              <div class="number">
                <span>¥</span>
                {{amount.toFixed(2)}}
              </div>
            </div>
            <div class="myredpack_info_right">
              <div class="name">红包雨奖励</div>
              <div class="range">适用品类:斗牛全平台</div>
              <div class="range">限{{amountStartTime}}-{{amountEndTime}}</div>
            </div>
          </div>
          <div v-if="coupon.length>0">
            <div class="myredpack_info" v-for="(item, index) in coupon" :key="'c'+index">
              <div class="myredpack_info_left">
                <div class="text">{{item.faceValue}}</div>
                <div class="text_s">{{item.useCondition}}</div>
              </div>
              <div class="myredpack_info_right">
                <div class="name">{{item.title}}</div>
                <div class="range">适用品类:{{item.useType}}</div>
                <div class="range">限{{item.useBeginTime}}-{{item.useEndTime}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="myredpack_btn" @click="useCoupon()"></div>
      </div>
      <div class="null" v-if="amount===0 && coupon.length===0">暂无记录</div>
      <div class="line"></div>
      <div class="title">邀请记录</div>
      <div class="invitation_list" v-if="invitationRecord.length>0">
        <div class="invitation_list_total">红包金额：{{invitationAmount.toFixed(2)}}</div>
        <div
          class="invitation_list_record"
          v-for="(item,index) in invitationRecord"
          :key="'i'+index"
        >
          <span>{{index+1}}</span>
          <span>{{item.nickName|formatName}}</span>
          <span>{{item.playCount}}次</span>
          <span>累计{{item.totalAmount}}元</span>
          <span>奖励{{item.rebate}}元</span>
        </div>
      </div>
      <div class="null" v-if="invitationRecord.length===0">暂无记录</div>
    </div>
  </div>
</template>
<script>
import { RedPackRainAllOverApi } from "@/utils/api/redpackrain";
export default {
  name: "rainallover",
  data() {
    return {
      amount: 0, // 活动结束抢到红包雨总金额
      amountStartTime:0,
      amountEndTime:0,
      coupon: [], // 活动结束抢到券
      invitationAmount: 0, // 邀请用户所获得的金额
      invitationRecord: [] // 活动结束邀请用户列表
    };
  },
  mounted() {
    let _ = this;
    _.myPackRed();
  },
  methods: {
    myPackRed() {
      let _ = this;
      RedPackRainAllOverApi()
        .then(res => {
          console.log(res)
          _.amount = res.amount;
          _.amountStartTime=res.amountStartTime;
          _.amountEndTime=res.amountEndTime;
          _.coupon = res.coupon;
          _.invitationAmount = res.rebateAmount;
          _.invitationRecord = res.inviteList;
        })
        .catch(e => {
          console.log(e);
        });
    },
    useCoupon(){
      let _ = this
      if(_.$root.ISAPP){
        _.javascriptBridge({ name: "gotoAppRedPacketCouponPage" });
      }else if(_.$root.ISMP){
        wx.miniProgram.navigateTo({ url: "/pages/user/coupon" });
      }
    },
  },
  filters:{
    formatName(name) {
      let newStr;
      if (name.length === 2) {
        newStr = name.substr(0, 1) + '*';
      } else if (name.length > 2) {
        let char = '';
        for (let i = 0;i < (name.length - 2); i++) {
          char = '**';
        }
        newStr = name.substr(0, 1) + char + name.substr(-1, 1);
      } else {
        newStr = name;
      }
      return newStr;
    }
  },
};
</script>
<style scoped>
.red-rain-wrap {
  width: 100vw;
  height: 100%;
  position: absolute;
  background: url("/static/imgs/redpackrain/game.png") no-repeat center 0;
  background-repeat: repeat-y;
  background-size: 100vw 178.27vw;
  overflow: hidden;
}
.myredpack {
  position: absolute;
  top: 9.6vw;
  left: 5.6vw;
  width: 88.8vw;
  max-height: 92vh;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 8vw;
  background: #ee243e;
  background-image: url("/static/imgs/redpackrain/top.png"),
    url("/static/imgs/redpackrain/bottom.png");
  background-position: top left, bottom right;
  background-size: 50% 50%;
  background-repeat: no-repeat;
  z-index: 2;
  border: 5px solid transparent;
  border-image: linear-gradient(#fdd9ad, #d18546, #fdd9ad, #d18546) 30 30 30 30;
}
.myredpack .title {
  margin: 8.8vw auto 0;
  background: #a92434;
  border-radius: 5px;
  width: 73.0667vw;
  height: 10.6667vw;
  line-height: 10.6667vw;
  text-align: center;
  font-size: 23px;
  font-weight: 800;
  color: #ffe5c5;
}
.myredpack .null {
  width: 100%;
  height: 45.8667vw;
  font-size: 14px;
  color: #fff;
  line-height: 45.8667vw;
  text-align: center;
}
.myredpack .line {
  width: 73.0667vw;
  height: 1px;
  background: #a92424;
  margin: 0 auto;
}
.myredpack .myredpack_list {
  width: 77.7333vw;
  height: auto;
  margin: 5.6vw auto 0;
  padding-bottom: 2.1333vw;
}
.myredpack .myredpack_info {
  width: 77.7333vw;
  height: 21.2vw;
  background: url("/static/imgs/redpackrain/pro_bg.png") no-repeat;
  background-size: 100% 100%;
  margin-bottom: 3.7333vw;
}
.myredpack .myredpack_info_left {
  float: left;
  height: 17.7333vw;
  width: 27.0667vw;
  margin-left: 1.7333vw;
  margin-top: 1.7333vw;
}
.myredpack .myredpack_info_left .number {
  font-size: 24px;
  color: #000;
  font-weight: bold;
  font-family: 'OswaldBold';
  text-align: center;
  line-height: 17.7333vw;
}
.myredpack .myredpack_info_left .number span {
  font-size: 18px;
  color: #000;
  font-weight: bold;
}
.myredpack .myredpack_info_left .text {
  font-size: 24px;
  color: #000;
  font-weight: bold;
  text-align: center;
  margin-top: 0.5333vw;
  line-height: 11.2vw;
}
.myredpack .myredpack_info_left .text_s {
  font-size: 10px;
  color: #585858;
  text-align: center;
}
.myredpack .myredpack_info_right {
  float: right;
  height: 17.7333vw;
  width: 47.0667vw;
  margin-right: 1.7333vw;
  margin-top: 1.7333vw;
  padding-left: 6vw;
}
.myredpack .myredpack_info_right .name {
  color: #373737;
  font-size: 19px;
  font-weight: bold;
  line-height: 8.8vw;
}
.myredpack .myredpack_info_right .range {
  color: #585858;
  font-size: 10px;
  line-height: 3.7333vw;
  white-space: nowrap;
}
.myredpack .myredpack_btn {
  margin-left: 4.2667vw;
  margin-bottom: 6.8vw;
  width: 79.4667vw;
  height: 14.6667vw;
  background: url("/static/imgs/redpackrain/myredpack_btn.png") no-repeat;
  background-size: 100% 100%;
}
.myredpack .invitation_list {
  padding-left: 7.4667vw;
  color: #ffe5c5;
}
.myredpack .invitation_list_total {
  font-size: 14px;
  font-weight: bold;
  line-height: 11.7333vw;
}
.myredpack .invitation_list_record {
  font-size: 14px;
  line-height: 5.8667vw;
  overflow: hidden;
}
.myredpack .invitation_list_record span {
  float: left;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.myredpack .invitation_list_record span:nth-child(1) {
  width: 6%;
}
.myredpack .invitation_list_record span:nth-child(2) {
  width: 17%;
}
.myredpack .invitation_list_record span:nth-child(3) {
  width: 13%;
}
.myredpack .invitation_list_record span:nth-child(4) {
  width: 33%;
}
.myredpack .invitation_list_record span:nth-child(5) {
  width: 28%;
}
</style>

