<template>
  <div>
    <v-headerscopy v-if="!$root.ISAPP && !$root.ISMP" bg="luckDraw">
      <div class="nav-tab2">
        <h3 style="color: #000">活动细则</h3>
      </div>
    </v-headerscopy>
    <div class="activity-introduction">
      <div>1、11月2日-11月11日，累积签到满6天，即可在11月11日当天获得一次免费抽潮物的机会，必中奖品，可随机抽取到热门球鞋、潮流服饰等实物奖品，参与用户需备注所需尺码。</div>
      <div>2、11月2日-11月11日，每日进入该页面签到，即可获得无门槛红包或盲盒抽奖机会，无门槛红包可在11月11日当天使用，所有红包可一次性叠加使用，可与优惠券同享。</div>
      <div>3、11月6日-11月11日，每日超低价发售两款热门限量款球鞋，先到先得。</div>
      <br/>
      <div>4、活动期内，可进入“今日抽奖”页面免费参与限量潮流单品抽奖活动，周一至周五每日下午4点直播开奖，分享即可获取更多抽奖码，提高中奖率。</div>
      <br/>
      <div>5、活动期间，如发现任何用户存在违规行为（包括但不限于作弊、套现、刷单、虚假交易、洗钱、网络攻击，或损害其他用户、斗牛平台及任何第三方合法权益的行为等），斗牛平台将有权撤销用户活动参与资格、取消活动权益并关闭使用优惠权益的相关订单、暂停且限制斗牛平台服务（包括不限于斗牛平台上其他形式的营销活动等）。</div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {}
  },
  created() {
    this.setToolBar({ title: '活动细则' });
  }
}
</script>

<style lang="scss">
  .activity-introduction {
    color: #232323;
    padding: 5.33333vw;
    font-size: 3.73333vw;
  }
</style>
