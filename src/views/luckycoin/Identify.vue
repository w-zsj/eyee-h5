<template>
  <a href="https://gio.ren/dWVL4LV">
        <img src="https://files.eyee.com/activity/year-shopping/loadApp.jpg?r=1" alt>
      </a>
</template>
<script>
//var vConsole = new VConsole();
import { mapGetters } from "vuex";
import {
  MillionRedLotteryActivityStatus,
  MillionRedLotteryJoin,
  MillionRedLotteryActivityDetail,
  MillionRedLotteryDraw,
  MillionLeaderOpen,
  MillionMembersOpen,
} from "@/utils/api/activities";
import shareModel from "@/components/templates/h5ShareModel";
import { DateDiff } from "../../common/util";


export default {
  data() {
    return {
      activityStatusInfo:{
        isjoin:false
      },
    }
  },
  mounted() {
    let _ = this;
    window._callAppBindThirdAccount = function(res, via) {
      console.log("APP绑定微信结果：" + res + "，渠道：" + via);
      if (Number(res) === 1) {
         _.toast("AP微信认证成功");
      }else{
        _.toast("APP微信认证失败");
      }
    };
    window._callAppIdentifyAccount = function(res, via) {
      console.log("APP芝麻认证结果：" + res + "，渠道：" + via);
      if (Number(res) === 1) {
         _.toast("APP芝麻认证成功");
      }else{
        _.toast("APP芝麻认证失败");
      }
  };
  },
  methods: {
    //app交互绑定微信
    bindWeiXin(){
      let _ = this;
          let wxlogin={};
          wxlogin.callbackname="_callAppBindThirdAccount";
          wxlogin.platform=1;//平台类型1：微信，2：QQ，3：微博
          _.javascriptBridge({
            name: "callAppBindThirdAccount",
            params: { ...wxlogin }
          });
    },
    //支付宝芝麻认证
    aliAppIdentify(){
      let _ = this;
          let appIdentify={};
          appIdentify.callbackname="_callAppIdentifyAccount";
          appIdentify.platform=1;//平台类型int 1：支付宝
          _.javascriptBridge({
            name: "callAppIdentifyAccount",
            params: { ...appIdentify }
          });
    }
  }
};
</script>
<style>
.body {
  width: 100%;
  height: 100%;
  background-color: #bc302e;
}
.activitybackground{
  background: url("https://files.eyee.com/activity/luckycoin/home.png") no-repeat;
  width: 100vw;
  height: 100vh;
  -webkit-background-size:100% 100%;
  background-size: 100% 100%;
}
.open{
  background: url("https://files.eyee.com/activity/luckycoin/chai.png") no-repeat;
  width: 68vw;
  height: 15vw;
  background-size: 100% 100%;
  position: absolute;
  left: 16%;
  top: 80%;
}
</style>


