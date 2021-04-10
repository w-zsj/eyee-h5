<template>
  <div>
    <!-- 顶部 -->
    <v-header :showback="true" v-if="!$root.ISAPP && !$root.ISMP">
      <div class="nav-tab2 ellipsis">{{title}}</div>
    </v-header>
    <div class="ruleBox" v-if="hasdata == 1">
      <div class="head">集AJ赢新年大礼活动规则：</div>
      <div class="info">1.活动期间，每天开箱抽卡，集齐6张卡片，可合成一张星耀卡，用户可凭星耀卡免费兑换相应奖励；</div>
      <div class="info">2.每次开箱均可随机获得1张卡片；</div>
      <div class="info">3.活动期间，每天登录活动页面将赠送2次开箱机会；</div>
      <div class="info">4.消耗8牛丸可额外兑换一次开箱机会，每人每天最多有10次机会使用牛丸开箱；</div>
      <div class="info">5.完成好友助力任务将会获得额外开箱机会，每次发起助力活动有效期为8小时，过期后助力进度重置，可重新发起助力；</div>
      <div class="info">6.每个用户每天最多可帮其他用户助力2次，仅能帮一位好友助力1次，助力成功后72小时内不能再次帮助同一好友再次助力该活动；</div>
      <div class="info">7.所获得的AJ卡片可通过微信分享赠送给好友，若某类AJ卡片数量只有1张，则该类AJ卡片无法赠送给其他好友；</div>
      <div class="info">8.星耀卡无法赠送给其他好友，只能通过合成的方式获得；</div>
      <div class="info">9.本活动及所有奖品与苹果公司无关。</div>
      <div class="head">奖励说明：</div>
      <div class="info">1、奖品兑换时间为在2020年1月24日22:00-2020年1月26日24:00，逾期未兑换奖品则星耀卡失效，不予兑换；</div>
      <div class="info">2、每种奖品每位用户只能兑换1件，兑换成功后剩余星耀卡将不能用于再次兑换该奖品；</div>
      <div class="info">3、优惠券类奖品兑换后将直接发放到【我的】-【卡券】中，优惠券兑换后过期未使用将不予再次发放；</div>
      <div class="info">4、实物奖品兑换后需填写姓名、电话、地址和尺码等个人信息，填写后信息不可更改。奖品将于2020年2月15日前陆续发出；</div>
      <div class="info lastinfo">5、实物奖品数量有限，先兑先得，兑完即止。</div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  components: { },
  data() {
    return {
      title: "活动规则",
      hasdata: 1
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    notloged() {
      return !(this.user && this.user.uid);
    },
   
  },
  mounted() {
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
.ruleBox{
  padding: 8vw 6.6667vw 14.6667vw;
  background: #fff;
  min-height: 100vh;
  .head{
    line-height: 5.8667vw;
    margin-bottom: 5.8667vw;
    font-size: 4.8vw;
    color: #1f1f1f;
    font-weight: bold;
  }
  .info{
    margin-bottom: 5.8667vw;
    line-height: 5.8667vw;
    font-size: 4.2667vw;
    color: #1f1f1f;
    font-weight: 400;
    &.lastinfo{
      margin-bottom: 0;
    }
  }
}
</style>

