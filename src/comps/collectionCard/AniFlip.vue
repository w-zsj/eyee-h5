<template>
    <div class="ani-container" ref="ani" :class="status ? 'flip' : ''">
      <img :src="img + '?c='+ timestamp" alt="" srcset="" />
      <div class="overturn overturn1" @click="overturn" v-if="dataItem.status == 1"></div>
      <div class="overturn overturn2" @click="overturn" v-else-if="dataItem.status == 2"></div>
      <div @click="giveCard(dataItem)" class="giveCard" :class="{'grey': dataItem.number == 1}" v-if="dataItem.status == 1">送给朋友</div>
    </div>
</template>

<script>
import {
  AjcardGivecard,
  AjcardQuerycard
} from "../../common/api/collectionCard";
var loader;
export default {
  /**
   *  动画过程改变change 不能触发动画
   */
  props: {
    /**
     * 第一个长图片
     */
    img1: {
      type: String,
      required: false,
      default: ""
    },
    /**
     * 第二张图片
     */
    img2: {
      type: String,
      required: false,
      default: ""
    },
    /**
     * 整个对象
     */ 
    item: {
      type: Object,
      default: {
        code: undefined
      }
    },
    timestamp: { type: Number, default: 0 }, // 当前页面的时间戳
    device: { type: String, default: "" }, //传过来的设备 H5还是小程序 用于埋点区分

  },
  data() {
    return {
      status: true,
      img: "",
      change: true,
      dataItem: {},  // 存储item数据 用于改变数据 便于监听
      giveShareInfo: {}, // 存储赠送卡片分享信息
    };
  },
  watch: {
    change: function(value, oldValue) {
      if (value !== oldValue) {
        this.handleChange();
      }
    },
    'item.code':function(value, oldValue){
      console.log("TCL: oldValue", oldValue)
      console.log("TCL: value", value)
      if (value !== oldValue) {
        if(this.AniIng) {
          this.AniIng = false
          this.status = false;
          this.dataItem.status = 1
        }
          this.dataItem = this.item
          this.change = false
          this.handleChange();
      }
      
    }
  },
  mounted() {
    this.dataItem = this.item
    this.img = this.img1;
    this.change = false
    this.dataItem.status = 1
    this.AniIng = false;
    this.$refs.ani.addEventListener("webkitAnimationEnd", () => {
      console.log("动画结束");
      this.status = false;
      this.AniIng = false;
    });

    this.$refs.ani.addEventListener("webkitAnimationStart", () => {
      console.log("动画开始");
      this.AniIng = true;
    });
  },
  methods: {
    handleChange() {
      if (this.AniIng) {
        console.log("动画正在进行中静止操作");
        return;
      }

      this.status = true;
      if (this.change) { //反面
        this.img = this.img2;
        this.dataItem.status = 2
      } else { //正面
        this.img = this.img1;
        this.dataItem.status = 1
      }
    },
    /**
     * 改变chagne 触发动画
     */
    overturn() {
      console.log('this.change', this.change)
      this.change = !this.change
    },
    // 送卡片给朋友
    giveCard(dataItem) {
      let _ = this
      if(dataItem && dataItem.number <= 1) { // 未刷新接口时判断的
        return
      } else {
      // 再走一个查询卡片数量的接口
        AjcardQuerycard({code:dataItem.code}).then( res => {
          if(res && res.count > 1) { // 查询到当前卡片 大于1时  才可以赠送卡片
            if(_.$root.ISAPP) {
              AjcardGivecard({code:dataItem.code}).then( res => {
                _.giveShareInfo = res
                if (_.$root.ISAPP && _.giveShareInfo && _.giveShareInfo.xcxurl) {
                  $log({ e: "collectcards_giving", p: { describe: "赠送卡片", device: _.device } });
                  loader = _.$loader("正在调起微信分享···");
                  setTimeout(() => {
                    loader.close();
                  }, 3000);
                  _.javascriptBridge({
                    name: "callAppDirectlyShare",
                    params: {
                      sharecontent: "",
                      sharetitle: _.giveShareInfo.xcxtitle,
                      xcxurl: _.giveShareInfo.xcxurl,
                      xcxicon: _.giveShareInfo.xcxicon || "",
                      xcxid: _.giveShareInfo.xcxid || "gh_038ca9308eac",
                      shareurl: "",
                      platform: 2,
                      callbackname: "_shareCallBack",
                      type: 2
                    }
                  });
                }
              }).catch( e => {
                console.error(e)
              })
              
            }else if (_.$root.ISMP) { //小程序内 去往单独的分享页面 type=1 赠卡分享的单独弹框页面
              $log({ e: "collectcards_giving", p: { describe: "赠送卡片", device: _.device } });
              wx.miniProgram.navigateTo({
                url: "/pages/activity/cardShare?type=1&code=" + dataItem.code
              });
            }
          } else {
            _.$emit("close", "重新刷新页面 请求接口")
          }
        }).catch( e => {
          _.$emit("close", "重新刷新页面 请求接口")
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.ani-container{
  width: 100%;
  img{
    width: 100%;
    height: auto;
  }
}

.flip {
  animation: flipInY 1s;
}
@keyframes flipInY {
  from {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
    transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
    transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }

  60% {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
    transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
    opacity: 1;
  }

  80% {
    -webkit-transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
    transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
  }

  to {
    -webkit-transform: perspective(400px);
    transform: perspective(400px);
  }
}
.ani-container{
  position: relative;
  .overturn{
    width: 16vw;
    height: 13.3333vw;
    position: absolute;
    right: -1vw;
    z-index: 5;
    &.overturn1{
      background: url('//files.eyee.com/mcdn/img/setcaed/turn_face.gif') 0 0 repeat-y;
      background-size: 100% 100%;
      bottom: 14.6vw;
    }
    &.overturn2{
      background: url('//files.eyee.com/mcdn/img/setcaed/turn_back.gif') 0 0 repeat-y;
      background-size: 100% 100%;
      bottom: 18vw;
    }
  }
  .giveCard{
    position: absolute;
    bottom: 7.2vw;
    left: 50%;
    transform: translateX(-51%);
    height: 8vw;
    line-height: 8vw;
    width: 43.8vw;
    text-align: center;
    font-size: 5.6vw;
    color: #EB2139;
    font-style:italic;
    font-weight:800;
    &.grey{
      color: #373737;
    }
  }
}

</style>