<template>
    <div class="collectioncard_pop" :class="{'show': css.show}">
      <div class="pi-bg"></div>
      <div class="content_bottom" v-if="css.modelStatus == 1">
        <span class="close ico-X" @click="close()"></span>
        <!-- 选择尺码 -->
        <div class="sizeBox" v-if="css.modelStatus == 1">
          <div class="head">选择尺码（{{exChangeInfo.type == 0?"鞋子":"衣服"}}）</div>
          <div class="sizeList flex">
            <div class="sizeItem"
              :class="{'act': currentIndex == index}"
              v-for="(item,index) in (exChangeInfo.type == 0?size0:size1)"
              @click="chooseSize(item,index)"
              :key="index">
              {{item}}
            </div>
          </div>
          <div class="btn" :class="{'grey': !storageInfo.prizeid}" @click="affirm">确认</div>
        </div>
      </div>
      <div class="content_between" 
        :class="{'xcxCss': $root.ISMP}"
        v-else-if="css.modelStatus == 2 || css.modelStatus == 3 || css.modelStatus == 5">
        <!-- 助力界面弹框 助力结果弹框 -->
        <div class="box helpUiBox" v-if="css.modelStatus == 2">
          <div class="statusInfo">{{helpInfo.msg}}</div>
          <div class="imgBox">
            <img :src="(helpInfo.goods + '?c='+ timestamp)"  alt="">
          </div>
          <div class="pop_btn" @click="helpFun" v-if="helpInfo.status == 1">帮TA一下</div>
          <div class="pop_btn" v-else-if="helpInfo.status == 2 || helpInfo.status == 3" @click="goSelf">立即领取</div>
        </div>
        <!-- 领卡界面弹框 领卡结果弹框-->
        <div class="box drawUiBox" v-if="css.modelStatus == 3">
          <div class="statusInfo">{{drawInfo.msg}}</div>
          <div class="imgBox">
            <img :src="(drawInfo.goods + '?c='+ timestamp)" alt="">
          </div>
          <div class="pop_btn" v-if="drawInfo.status == 1" @click="drawFun">立即领取</div>
          <div class="pop_btn" v-else-if="drawInfo.status == 2" @click="goSelf">点击查看</div>
          <div class="pop_btn" v-else-if="drawInfo.status == 3" @click="goSelf">集AJ赢大奖</div>
        </div>
        <!-- 抽卡结果页 -->
        <div class="box composeCardFruit" v-if="css.modelStatus == 5">
          <div class="statusInfo">{{composeCardInfo.msg}}</div>
          <div class="imgBox">
            <img :src="(composeCardInfo.cardimg + '?c='+ timestamp)" alt="">
          </div>
          <div class="close2" style="bottom:-15vw;" @click="close()"></div>
        </div>
      </div>
      <div class="content_full" v-else-if="css.modelStatus == 4">
        <!-- 抽卡弹框 动画-->
        <div class="box open_box_ani" v-if="css.modelStatus == 4">
          <xlz></xlz>
          <!-- 查看卡片 -->
          <div class="open_box_btn" @click="lookCard"></div>
        </div>
      </div>
    </div>
</template>

<script>
import {
  AjcardHelpta,
  AjcardGetcard
} from "../../common/api/collectionCard";
import xlz from "@/comps/collectionCard/xlz";
import { mapGetters } from "vuex";
export default {
  components: { xlz },
  name: "TicketModel",
  data() {
    return {
      css: {
        show: false,
        modelStatus: 0
      },
      exChangeInfo: {}, //兑换奖品信息
      // 鞋子尺码
      size0: ["40","40.5","41","41.5","42","42.5","43","43.5","44","44.5","45","45.5","46","46.5","47","47.5"],
      // 衣服尺码
      size1: ["M","L","XL","XXL","XXXL"],
      currentIndex: -1, // 选中的当前尺码的索引
      storageInfo: {}, // 存储选中的尺码和要兑换的商品的id
      helpInfo: {
        goods: '', //存储助力界面返回的鞋的图片
        invitecode: 0, // 邀请助力码
        status: 1, // 助力的不同状态 1 助力页面 2 助力成功 3 助力失败
        msg: '', //助力失败返回的文言 
      },
      drawInfo: { //领卡 界面 领取赠卡
        goods: '', //存储领卡界面返回的鞋的图片
        cardid: 0, // 存储卡的id
        status: 0, // 领卡的不同状态 1 领卡页面 2领取成功 3 领取失败
        msg: '', // 领卡界面文言 领卡成功失败文言
      },
      composeCardInfo: { // 抽卡的结果
        status: 0,
        cardimg: '',
        msg: ''
      }
    };
  },
  props: {
    cssShow: { type: Boolean, default: false },
    ModelStatus: { type: Number, default: 0 },
    timestamp: { type: Number, default: 0 }, // 当前页面的时间戳
    Helpui: { type: Object, default: {} }, //传过来的助力页面信息
    composeInfo: { type: Object, default: {} }, //传过来的抽卡页面信息
    drawUi: { type: Object, default: {} }, //传过来的领卡页面信息
    goExchangeInfo: { type: Object, default: {} }, //传过来的需要兑换的商品的信息
    device: { type: String, default: "" }, //传过来的设备 H5还是小程序 用于埋点区分
  },
  watch: {
    ModelStatus: function(n, o) {
      this.changeInfo();
    },
  },
  created() {
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    notloged() {
      return !(this.user && this.user.uid);
    }
  },
  mounted() {
    let aniImg = new Image()
    aniImg.onload = () => {
      console.log(222)
    }
    aniImg.src = "//files.eyee.com/mcdn/img/setcaed/ani_2.png"
    this.changeInfo()
  },
  methods: {
    // 更新数据
    changeInfo() {
      let _ = this;
      _.css.show = _.cssShow;
      _.css.modelStatus = _.ModelStatus;
      // 需要兑换的商品信息
      console.log('需要兑换的商品信息', _.goExchangeInfo)
      _.exChangeInfo = _.goExchangeInfo
      // 助力页面信息
      _.helpInfo = {
        goods: _.Helpui.goods,
        invitecode: _.Helpui.invitecode,
        status: 1,
        msg: _.Helpui.msg
      }
      // 领卡页面信息
      _.drawInfo = {
        cardid: _.drawUi.cardid,
        goods: _.drawUi.goods,
        status: 1,
        msg: _.drawUi.msg
      }
      // 抽卡结果页面信息
      _.composeCardInfo = {
        status: _.composeInfo.status,
        cardimg: _.composeInfo.cardimg,
        msg: _.composeInfo.msg
      }
    },
    // 选择尺码
    chooseSize(item,index) {
      console.log(999, this.exChangeInfo)
      this.currentIndex = index
      this.storageInfo = {
        size: item,
        prizeid: this.exChangeInfo.id
      }
      
    },
    affirm() {
      let _ = this
      if(!this.storageInfo.prizeid) {
        return
      } else {
        this.$router.push("/user/address?prizeid="+this.storageInfo.prizeid+"&size="+this.storageInfo.size)
      }
    },
    close() {
      let _ = this
      _.css.show = false
      _.css.modelStatus = 0
      _.exChangeInfo = {}
      _.storageInfo = {}
      _.currentIndex = -1
      _.$emit("close", "关闭弹框")
      window.scroll(0, 0)
      document.body.classList.remove("lock")
    },
    // 助力
    helpFun() {
      let _ = this
      if(_.notloged) {
        console.log('未登录')
        _.$emit("goLogin", "去登录")
      } else {
        console.log('已登录', _.helpInfo.invitecode)
        AjcardHelpta({invitecode: _.helpInfo.invitecode}).then( res => {
          console.log('助力结果', res)
          if(res) {
            if(res.status) { // 助力成功
              $log({ e: "collectcards_help", p: { describe: "帮助助力", device: _.device } });
              _.helpInfo.status = 2
              _.helpInfo.msg = res.msg

            } else { //助力失败
              _.helpInfo.status = 3
              _.helpInfo.msg = res.msg
            }
          } 
        }).catch( e => {
          console.error(e)
        })
      }
      
    },
    // 立即领取
    drawFun() {
      let _ = this
      if(_.notloged) {
        _.$emit("goLogin", "去登录")
      } else {
        AjcardGetcard({cardid: _.drawInfo.cardid}).then( res => {
          if(res) {
            if(res.status) { // 领取成功
              _.drawInfo.status = 2
              $log({ e: "collectcards_received", p: { describe: "收卡", device: _.device } });
            } else { //领取失败
              _.drawInfo.status = 3
            }
            _.drawInfo.msg = res.msg
          } 
        }).catch( e => {
          console.error(e)
        })
      }
    },
    // 查看抽卡结果
    lookCard() {
      this.css.modelStatus = 5
    },
    // 回到自己的页面
    goSelf() {
      this.close()
    }
  }
};
</script>

<style lang="scss" scoped>
.collectioncard_pop {
  position: fixed;
  transform: translateZ(0);
  z-index: 101;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  font-family: Arial, Helvetica, sans-serif;
  &.show {
    pointer-events: auto;
    .pi-bg {
      background-color: #000;
      opacity: 0.5;
    }
  }
  .pi-bg {
    width: 100vw;
    height: 100vh;
    background-color: transparent;
    opacity: 0;
    transition: all 0.2s ease;
  }
  
}
.content_bottom{
  width: 100vw;
  background: #fff;
  position: fixed;
  transform: translateZ(0);
  bottom: 0;
  left: 0;
  right: 0;
  .close {
    position: absolute;
    top: 4.54vw;
    right: 4vw;
    width: 20px;
    height: 20px;
    color: #646464;
    font-size: 24px;
    line-height: 20px;
    text-align: center;
  }
}
.sizeBox{
  background: #fff;
  .head{
    height: 16vw;
    padding: 5.8667vw 0 5.0667vw 4.5333vw;
    line-height: 4.8vw;
    color: #303030;
    font-weight:bold;
    font-size: 5.0667vw;
  }
  .sizeList{
    background: #f5f5f9;
    padding: 2.6667vw 2vw 1.3333vw;
    flex-wrap: wrap;
    .sizeItem{
      margin-right: 1.3333vw;
      margin-bottom: 1.3333vw;
      width: 18.1333vw;
      height: 15.4667vw;
      line-height: 14.6667vw;
      text-align: center;
      &:nth-child(5n){
        margin-right: 0;
      }
      background: #fff;
      font-size: 14px;
      font-weight:bold;
      color: #303030;
      border-radius: 0.5333vw;
      border: solid 0.4vw #f5f5f9;
      &.act{
        border-color: #000;
      }
    }
  }
  
}
.btn{
  width: 100%;
  height: 16vw;
  line-height: 16vw;
  text-align: center;
  font-size: 5.6vw;
  color: #fff;
  font-weight: bold;
  background: #F3283E;
  &.grey{
    background: #D9D9D9;
  }
}
.content_between{
  width: 67.2vw;
  background: transparent;
  padding-bottom: 45px;
  position: fixed;
  transform: translateZ(0) translateX(-50%) translateY(-50%);
  top: 50%;
  left: 50%;
}
.box{
  position: relative;
  .imgBox{
    width: 67.2vw;
    img{
      display: block;
      width: 100%;
      height: auto;
    }
  }
  .pop_btn{
    position: absolute;
    width: 54.6667vw;
    height: 10.9333vw;
    line-height: 10.9333vw;
    text-align: center;
    font-size: 5.3333vw;
    left: 50%;
    bottom: 7.7333vw;
    transform: translateX(-50%);
    color: #D82F1F;
    font-weight:800;
  }
  .statusInfo{
    line-height: 5.3333vw;
    padding: 0 5.3333vw;
    text-align: center;
    color: #fff;
    font-size: 3.7333vw;
    margin-bottom: 3.2vw;
  }
}
.content_full{
  width: 100vw;
  height: 100vh;
  background: transparent;
  position: fixed;
  transform: translateZ(0);
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
}
.open_box_ani{
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .open_box_btn{
    position: absolute;
    left: 50%;
    height: 8vh;
    width: 47vw;
    bottom: 43vh;
    transform: translateX(-50%);
  }
}
.close2{
  height: 7.4667vw;
  width: 7.4667vw;
  background: url('//files.eyee.com/mcdn/img/setcaed/close.png') 0 0 no-repeat;
  background-size: 100% 100%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>