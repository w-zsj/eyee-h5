<template>
    <div class="rule">
        <p>1.分享给好友，好友识别团邀新海报中的二维码完成注册并加入你所在的团，你的邀新有效</p>
        <p>2.你于{{info.starttime}}后的{{info.duration}}{{info.unit==0?'月':'日'}}内邀请到的新用户，ta在斗牛交易尖货团购和闪电发货，你就可以赚{{info.teamcommission}}%奖励金，会自动计入你的账户</p>
        <p>3.奖励金上不封顶，有效邀新越多交易越多，奖励金越多</p>
        <p>4.好友需是之前未使用过斗牛的新用户，发送邀请后24小时内，加入同一团皆为有效邀新</p>
        <p>5.若使用非正常手段获取奖励金（含使用非法技术行为骗取奖励金，恶意代刷），斗牛有权追回所有奖励金及延伸价值，并将视情况追究法律责任</p>
        <p>6.可提取的奖励金池的金额将通过斗牛审核后到账，请耐心等待我们审核</p>
        <p class="copyright">*本规则最终解释权在法律允许范围内，归斗牛所有</p>
    </div>
</template>
<script >
import { Ruleconfiginfo } from "../../utils/api/activities";
export default {
  data() {
    return {
      info: {}
    };
  },
  mounted() {
    this.initdata();
  },
  methods: {
    initdata() {
      Ruleconfiginfo()
        .then(res => {
          this.info = res;
        })
        .catch(e => {
          console.error(e);
        });
    }
  }
};
</script>
<style scoped>
.rule {
  font-size: 14px;
  line-height: 24px;
  color: #232323;
  padding: 15px;
}
.copyright {
  margin-top: 30px;
}
</style>

