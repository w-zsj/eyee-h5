<template>
  <div>
    <div class="bg">
      <img src="https://files.eyee.com/activity/year-activity/down_1.png" alt class="down_1">
      <div class="no-repeat">
        <img src="https://files.eyee.com/activity/year-activity/down_2.png" alt class="down_2" v-for="(item,inx) in 30" :key="inx">
      </div>
      <img src="https://files.eyee.com/activity/year-activity/down_3.png" alt class="down_3">
     
      <div class="count-time">
        <div class="txt">{{nextData}}</div>
        
        <div class="time">
          <div class="flex-center">{{setdata.H}}</div>:
          <div class="flex-center">{{setdata.m}}</div>:
          <div class="flex-center">{{setdata.s}}</div>
        </div>
        <div class="txt" >剩余{{count}}次机会</div>
        <div class="flex-center">
          <div class="go-home" @click.stop="goshare" v-if="!hasCount">再玩一次</div>
          <div class="go-home" @click.stop="gohome">{{text}}</div>
        </div>
      </div>
     <div class="guize" @click="guize">
       <img src="/static/imgs/mall/guize.png" alt="">
     </div>
    </div>
      <div class="entns" @click.stop="main">
      <img src="https://files.eyee.com/activity/year-activity/fanhuizhuhuichang-2.png" alt="">
    </div>
    <RainModel
      :modelType="modelType"
      :shareInfo="shareInfo"
      @close="closeModel"
      v-if="modelType!=0"
    ></RainModel>
  </div>
</template>
<script>
import {
  Nextraintime,
  Remaincount,
  Increasesharecount
} from "../../utils/api/activities";
import RainModel from "../../comps/RainModel";
import { DateDiff } from "../../common/util";
import { mapGetters } from "vuex";
import { setTimeout } from "timers";
import { getUrlParam } from "@/common/util";
document.title = "斗牛春节不打烊";
export default {
  components: { RainModel },
  data() {
    return {
      modelType: 0,
      setdata: { H: 0, m: 0, s: 0 },
      isprocessing: 0,
      nextData: "距离下一场",
      text: "先去逛逛",
      shareInfo: {},
      appShare: {},
      count: 0,
      hasCount:false
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    })
  },
  mounted() {
    // this.countdown();

    let _ = this;
   
    if (_.$root.ISAPP) {
      _.getQueryParamUser().then(res=>{})
    }
    _.Nexttime();
    _.NumberCount();
    window._appShareCallback = function(res, via) {
      console.log("APP分享结果：" + res + "，渠道：" + via);
      // var result
      if (Number(res) === 1) {
        Increasesharecount()
          .then(res => {
            Remaincount().then(res => {
              if (res.remaincount) {
                _.toast("分享成功，去抢红包吧~");
                _.text = "去抢红包";
                _.hasCount=true
                _.count = res.remaincount;
              }
            });
          })
          .catch(e => {
            console.error(e);
          });
      }
    };
  },
  methods: {
    shareNum() {
      Increasesharecount()
        .then(res => {
          this.modelType = 0;
        })
        .catch(e => {
          console.error(e);
        });
    },
    NumberCount() {
      let _ = this;
      if (_.userInfo && _.userInfo.token) {
        Remaincount().then(res => {
          if (res.remaincount) {
            _.count = res.remaincount;
            _.hasCount=true
            _.text = "去抢红包";
          }else{
            _.text = "先去逛逛";
          }
        });
      } else {
        setTimeout(() => {
          _.NumberCount();
        }, 800);
      }
    },
    guize() {
      this.modelType = 2;
    },
    closeModel() {
      if (this.modelType == 7) {
        this.shareNum();
        this.NumberCount();
      } else this.modelType = 0;
      //
    },
    gohome() {
      let _ = this;
      if(_.hasCount)  {
        if (_.$root.ISAPP) {
          _.javascriptBridge({
            name: "gotoAppMallCenterPage",
            params:{type:1}
          });
        }else{
           _.$router.replace('/');
        }
       
      }
      else  _.$router.replace(`/20190128/main`);
    },
    goshare() {
      let _ = this;
      let shareInfo = _.shareInfo;
      _.appShare.sharecontent = shareInfo.content;
      _.appShare.sharetitle = shareInfo.title;
      _.appShare.sharepicurl = shareInfo.icon;
      _.appShare.shareurl = shareInfo.url;
      _.appShare.xcxurl = shareInfo.xcxurl || "";
      _.appShare.callbackname = "_appShareCallback";
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "callAppShareDialog",
          params: { ..._.appShare }
        });
      } else {
        _.modelType = 7;
      }
    },
    setShare(info) {
      let _ = this;
      if (!(info && info.title)) return;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "getAppActivityShareContent",
          params: {
            sharecontent: info.content,
            sharepicurl: info.icon,
            shareurl: info.url,
            sharetitle: info.title,
            showshareicon: true
          }
        });
      } else if (_.$root.ISWX) {
        _.initShare({
          info: {
            title: info.title,
            desc: info.content,
            url: info.url,
            img: info.icon
          }
        });
      }
    },
    Nexttime() {
      let _ = this;
      Nextraintime()
        .then(res => {
          if (res) {
            if (res.isprocessing) {
              _.nextData = "正在进行";
              // _.text = "去抢红包";
              // _.$router.push(`/20190110/main?isprocessing=${res.isprocessing}`);
            } else {
              _.nextData = "距离下一场";
              // _.text = "先去逛逛";
              if (res.nextrainbegintime) _.countdown(res.nextrainbegintime);
            }
            _.shareInfo = res.share;
            _.setShare(res.share);

            // console.log('分享信息',_.shareInfo)
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    countdown(time) {
      let _ = this,
        t = DateDiff({ destination: time, type: "H" });
      if (t.H === 0 && t.m === 0 && t.s === 0) {
        clearTimeout(this.timer);
        _.setdata.H = 0;
        _.setdata.m = 0;
        _.setdata.s = 0;
        // _.$router.push("/20190110/main?isprocessing=1");
        return;
      }
      t.H = t.H <= 0 ? "00" : t.H < 10 ? "0" + t.H : t.H;
      t.m = t.m <= 0 ? "00" : t.m < 10 ? "0" + t.m : t.m;
      t.s = t.s < 0 ? "00" : t.s < 10 ? "0" + t.s : t.s;
      _.setdata = t;
      _.timer = setTimeout(() => {
        _.countdown(time);
      }, 1000);
    },
      main(){
      this.$router.push('/20190128/main')
    },
  },
  watch: {
    userInfo: function(newVal, oldVal) {
      this.NumberCount();
    }
  }
};
</script>
<style scoped>
.entns{
  position: fixed;
  width: 17.3vw;
  right: 0;
  bottom: 35vw;
  z-index: 10;;
}
.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: url('https://files.eyee.com/activity/year-activity/beijing.png')0 0 no-repeat;
  background-size: 100% 100%;
}
.bg img{
  display: block;
}
.no-repeat {
 font-size: 0;
  /* display: block;
  width: 90%;
  margin: 0 auto;
  height: 200px;
  background: url('/static/active/down_2.png') center center; */
}
.down_3 {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
}
.guize {
  position: fixed;
  right: 0;
  top:60%;
  transform: translateY(-50%);
  width: 30vw;
  height: 15vw;
  z-index: 3;
}

.count-time {
  position: absolute;
  left: 50%;
  bottom:20vh;
  transform: translateX(-50%);
  z-index: 2;
  color: #fff;
  text-align: center;
  width: 100%;
}

.count-time .txt {
  font-size: 14px;
  /* font-weight: bold; */
  margin: 10px 0;
}

.time {
  font-size: 22px;
  font-weight: bold;
  margin-top: 5vw;
}

.time div {
  display: inline-block;
  background:url('https://files.eyee.com/activity/year-activity/shuzi.png')0 0 no-repeat;
  background-size: 100% 100%;
  padding: 3px 5px;
  border-radius: 5px;
  width: 40px;
}

.go-home {
  background:url('https://files.eyee.com/activity/year-activity/denglu-2.png')0 0 no-repeat;
  background-size: 100% 100%;
  font-size: 14px;
  padding: 5px 10px;
  margin-top: 6vw;
  display: inline-block;
  border: 1px solid #333;
  border-radius: 4px;
  margin: 5px;
}
</style>

