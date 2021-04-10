<template>
    <div>
         <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>限时抽奖</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
         <div class="hb-wrap"  >
            <!-- 抽奖规则 悬浮 -->
            <div  class="look-guize flex-col flex-center" @click.stop="examine"><span>抽奖</span><span>规则</span></div>
            <div class="countdown flex-aic">
                <div class="describe flex-col">
                  <span class="describe-text">开奖 </span>
                  <span>时间</span>
                </div>
                <div class="countdown-time">
                  <span v-if="detailList.drawstatus==4">{{detailList.starttime}}</span>
                  <span v-else>{{detailList.drawtime}}</span>
                </div>
            </div>
            <div class="hb-info">
                <img :src="detailList.prizepic">
            </div>
            <p class="product-name flex-aic"><span class="ellipsis name">{{detailList.name}} {{detailList.sku}}</span> </p>
            <div class="price flex-between">
                <div class="discount-price  flex-center">
                    <span class="discount-money">¥{{detailList.drawprice}}</span>
                    <span>抽奖价</span>
                </div>
                <div class="origin-price  flex-center">
                    <span class="del">原价¥{{detailList.saleprice}}</span>
                    <!-- <span>{{detailList.size}}码</span> -->
                </div>
            </div>
        </div>
        <!-- 中奖号码 -->
        <div class="winning-record">
            <p class="winning-title">
               {{detailList.iswinning==0?'本期您未参与':detailList.iswinning==1?'恭喜你抽中本期大奖':'本期您未中奖'}}
            </p>
            <div class="winning-number " v-if="detailList.targetcode">
                <span><img :src="detailList.targetcode.icon" alt=""></span>
                <span>中奖号码 {{detailList.targetcode.drawcode}}</span>
            </div>
        </div>
        <!-- 抽奖码 -->
        <div class="nowLotter"  v-if="detailList.iswinning==2">
            我的抽奖码
        </div>
        <div class="wrap-lotter" v-if="detailList.iswinning==2">
            <ul class="chou-jiang-ma">
                <li class="flex-between oli" v-for="(items,i) in detailList.drawcode" :key="i">
                    <div class="head-portrait ">
                        <span><img :src="items.icon" alt=""></span>
                        <span>{{items.text}}</span>
                    </div>
                    <div class="lotter-num">{{items.drawcode}}</div>
                </li>
            </ul>
        </div>
         <div v-if="detailList.isget==3" class="get-share" style='width:100%;text-align:center;background:#ccc;' catchtap='outTime'>
            您已超时未领取
          </div>
         <div class="get-share flex-tops" v-if="detailList.iswinning==1">
            <span @click="share">炫耀一下</span>
            <span @click="getPrize(detailList.id)">{{detailList.isget==1?'我的领取信息':'立即领取'}}</span>
        </div>
         <!-- 领取成功 提示弹框 -->
        <div class="share-model" v-if="getPrizeModel" @click.stop="close">
            <div class="content">
                <p>领取信息登记完成，请耐心等待奖品哦~</p>
                <p class="prize-info">奖品将于领取之后的7个工作日内为您邮寄，若有任何疑问可联系我们的客服小姐姐哦~</p>
                <div class="share-btn flex-center"><img class="kefu" src="/static/img/tel.png" alt=""> 客服电话 34567890</div>  
                <span class="close" @click.stop="close">X</span>     
            </div>
            
        </div>
         <!-- 分享提示框 -->
        <shareModel @closeShareModel='shareClose' v-if="closeShareModel" :shareContent="shareContent"></shareModel>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import shareModel from "../templates/h5ShareModel";
import { PrizeShow } from "../../common/api/lotter.js";
export default {
  components: {
    shareModel
  },
  data() {
    return {
      shareContent: "好友参与抽奖后 你可以额外获得一张抽奖码,传递好运获得更多抽奖码",
      closeShareModel: false,
      detailList: {},
      getPrizeModel: false
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    })
  },
  mounted() {
    console.log(this.$route.params);
    let _ = this;
    let op = {
      userid: 0,
      id: this.$route.params.id
    };
    PrizeShow(op)
      .then(res => {
        console.log("往期详情", res);
        _.detailList = res[0];
      })
      .catch(e => {
        console.error(e);
      });
  },
  methods: {
    outTime() {
      this.toast("您已超时未领取");
    },
    examine() {
      this.$router.push("/drawLottery/examine?id=" + this.detailList.id);
    },
    share() {
      this.closeShareModel = true;
    },
    getPrize(id) {
      let _ = this;
      if (_.detailList.isget == 2) {
        this.$router.push("/drawLottery/getPrize/" + id);
      } else {
        this.getPrizeModel = true;
      }
    },
    close() {
      this.getPrizeModel = false;
    },
    shareClose() {
      this.closeShareModel = false;
    }
  }
};
</script>

<style scoped>
.hb-wrap {
  background: #fff;
  padding: 12px 15px;
  box-shadow: rgb(204, 204, 204) 0px 0px 7px 0px;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  width: 90%;
  margin: 60px auto 0;
}
.look-guize {
  position: absolute;
  right: -10px;
  top: 15px;
  background: #f8f8f8;
  font-size: 9px;
  color: #999;
  width: 60px;
  height: 60px;
  padding: 0;
  border-radius: 50%;
}
.hb-info {
  /* width: 50%; */
  margin: 0 auto;
}
.countdown {
  font-size: 10px;
  color: #000;
  margin-bottom: 15px;
}
.countdown .describe {
  width: 15%;
  text-align: left;
}
.countdown .describe-text {
  font-size: 13px;
  font-weight: bold;
}
.countdown .countdown-time {
  font-size: 20px;
  font-weight: bold;
  width: 70%;
  text-align: left;
}
.product-name {
  width: 100%;
  color: #000;
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  margin: 24px auto 12px;
}
.price {
  text-align: left;
}
.discount-price {
  font-size: 12px;
}
.discount-price .discount-money {
  font-size: 26px;
  font-weight: bold;
}
.discount-price span:nth-child(2) {
  padding-top: 10px;
}
.origin-price {
  font-size: 11px;
  padding-top: 10px;
  color: #000;
}
.origin-price .del {
  text-decoration: line-through;
  color: #999;
  margin-right: 5px;
}
.nowLotter {
  background: #333333;
  height: 35px;
  font-size: 12px;
  color: #fff;
  text-align: center;
  padding-top: 3px;
  width: 83%;
  margin: 0 auto;
  border-radius: 5px;
  margin-top: 40px;
  position: relative;
}
.winning-record {
  margin-top: 25px;
}
.winning-record .winning-title {
  font-size: 14px;
  color: #000;
  font-weight: bold;
  text-align: center;
}
.winning-number {
  height: 52px;
  line-height: 52px;
  font-size: 18px;
  color: #333;
  font-weight: bold;
  text-align: center;
  box-shadow: rgb(204, 204, 204) 0px 0px 7px 0px;
  width: 90%;
  margin: 25px auto;
  border-radius: 5px;
  position: relative;
}
.winning-number span:nth-child(1) {
  width: 24px;
  height: 24px;
  background: #333;
  border-radius: 50%;
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 12%;
  overflow: hidden;
}
.winning-number span:nth-child(1) img{
  display: block;
}
.get-share {
  height: 52px;
  line-height: 52px;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 3;
  font-size: 16px;
  color: #fff;
  background: #333;
}
.get-share span {
  text-align: center;
  width: 50%;
  font-weight: bold;
}
.get-share span:nth-child(2) {
  background: #ffc700;
  color: #333;
}
.nowLotter {
  background: url("/static/img/lotterBg.png") 0 0 no-repeat;
  background-size: 100% 100%;
  height: 35px;
  font-size: 12px;
  color: #fff;
  text-align: center;
  padding-top: 3px;
  width: 83%;
  margin: 0 auto;
  border-radius: 5px;
  margin-top: 40px;
  position: relative;
}
.wrap-lotter {
  overflow: hidden;
  position: relative;
  top: -2.3vw;
  z-index: 2;
  /* background: #fff; */
}
.chou-jiang-ma {
  position: relative;
  transition: all 2s linear;
  width: 71%;
  margin: 0 auto;
  overflow: hidden;
  padding-bottom: 5px;
  /* background: rgb(0, 0, 0, 0.1);
  border-right: 1px solid #DEDEDE;
  border-left: 1px solid #DEDEDE; */
}
.chou-jiang-ma li {
  height: 52px;
  line-height: 52px;
  background: url("/static/img/lotcode.png") 0 0 no-repeat;
  background-size: 100% 100%;
  color: #333;
  font-size: 10px;
  margin: 0 auto;
  padding: 10px 25px;
  margin-bottom: -5px;
  /* box-shadow:0px 10px 26px #999; */
}
.chou-jiang-ma li .head-portrait span:nth-child(1) {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
  position: relative;
  top: 7px;
}
.chou-jiang-ma li .head-portrait span:nth-child(1) img {
  width: 100%;
  height: 100%;
  display: block;
}
.chou-jiang-ma li .lotter-num {
  font-size: 20px;
  font-weight: bold;
}
.share-model {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
}
.close {
  position: absolute;
  width: 15px;
  height: 15px;
  top: 10px;
  right: 10px;
}
.share-model .content {
  position: absolute;
  width: 90%;
  background: #fff;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;
  padding: 10% 8.5%;
  font-size: 14px;
  color: #333;
}
.prize-info {
  color: #979797;
  font-size: 11px;
  margin: 17px;
}
.share-btn {
  border-radius: 20px;
  line-height: 40px;
  text-align: center;
  color: #4a90e2;
  font-size: 16px;
  margin-top: 15px;
}
.share-btn .kefu {
  width: 20px;
  margin-right: 10px;
}
</style>

