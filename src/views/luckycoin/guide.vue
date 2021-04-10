<template>
  <div>
      <div class="activitybackground">
        <div @click="isDown=true" class="open"></div>
      </div>
        <!--跳转到app-->
        <div v-show="isDown" class="flex-center dialog" @touchmove.prevent>
            <div class="confirm-content goapp-dialog">
            <div style="line-height:8vw">即将离开微信</div>
            <div  style="line-height:8vw">打开"APP Store"</div>
            <div class="flex-between">
                <div class="noallow" @click="isDown=false">取消</div>
                <div class="allow" @click="toApp()">允许</div>
            </div>
            </div>
        </div>
    </div>
</template>
<script>
//var vConsole = new VConsole();
import shareModel from "@/components/templates/h5ShareModel";
import { DateDiff } from "../../common/util";


export default {
  components: {
    shareModel
  },
  data() {
    return {
      isDown:false
    };
  },
  methods: {
    //分享
    toApp:function(){
        this.openAppClient();
    }
  }
};
</script>
<style>
.open{
  background: url("//files.eyee.com/activity/luckycoin/chai.png") no-repeat;
   -moz-background-size: 100% 100%;
   width: 68vw;
  height: 15vw;
  background-size: 100% 100%;
  position: absolute;
  left: 16%;
  top: 80%;

}
.activitybackground{
  background: url("//files.eyee.com/activity/luckycoin/home.png") no-repeat;
  background-size: 100% 100%; 
  -moz-background-size: 100% 100%;
    height: 100vh;
  width: 100vw;
}
.dialog {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9;
}
.dialog .confirm-content {
  width: 85vw;
  /* height: 46.6667vw; */
  border-radius: 2.1333vw;
  padding: 5.3333vw 3.2vw 3.2vw;
}
.confirm-name {
  width: 100%;
  text-align: center;
  font-size: 4.2667vw;
  line-height: 5.8667vw;
  font-weight: 500;
}
.confirm-info {
  width: 100%;
  text-align: center;
  line-height: 5.3333vw;
  margin: 7.2vw 0 9.6vw;
  font-size: 3.7333vw;
}
.confirm-btn {
  width: 48%;
  height: 10.1333vw;
  text-align: center;
  font-size: 4.2667vw;
  border-radius: 5.0667vw;
  line-height: 10.1333vw;
}
.confirm-close {
  border: 1px solid #707afc;
  color: #707afc;
}
.confirm-sure {
  color: #fff;
  background-color: #707afc;
}
.close {
  background: url("https://files.eyee.com/activity/luckycoin/close.png");
  background-size: 100% 100%;
  height: 10vw;
  width: 10vw;
  margin-top: 10vw;
}
.goapp-dialog{
  width: 85vw;
  height: 40vw;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}
.allow{
  margin-top: 5vw;
  height: 12vw;
  line-height: 12vw;
  border-top: 1px solid #eee;
   border-left: 1px solid #eee;
  width: 50%;
}
.noallow{
    margin-top: 5vw;
  height: 12vw;
  line-height: 12vw;
  border-top: 1px solid #eee;
  width: 50%;
}
</style>

