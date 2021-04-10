<template>
    <div class="wrap-share">
       <!-- <v-header v-if="!insq">
            <div class="nav-tab2">
                <h3>限时抽奖</h3>
            </div>
        </v-header> -->
        <div class="bg"></div>
        <div class="regulation  flex-col flex-center" v-if="shareList.iswinning!=1" @click.stop="examine(shareList.id)"><span>抽奖</span><span>规则</span></div>
        <div class="content">
            <div v-if="shareList.iswinning==1&&shareList.drawstatus==1" style="color:#fff;margin-bottom:20px;">
              <p class="title">人品大爆发</p>
             <span>{{shareList.winningtext}}</span>
            </div>
            <div v-else>
                <p class="title">免费抽奖</p>
                <div class="count-down ">
                    <span>{{timeData.H}}</span>:<span>{{timeData.m}}</span>:<span>{{timeData.s}}</span>
                </div>
            </div>
            <div class="product">
                <div class="draw-price flex-center flex-col">
                    <span>¥{{shareList.drawprice}}</span>
                    <span>抽奖价</span>
                </div>
                <div class="product-img">
                    <img :src="shareList.prizepic" alt="">
                </div>
                <div class="product-name flex-aic">
                   <span class="ellipsis name">{{shareList.name}} {{shareList.sku}}</span> 
                </div>
                <div class="price">
                    <span class="del">原价¥{{shareList.saleprice}}</span>
                    <!-- <span>{{shareList.size}}码</span> -->
                </div>
                <div class="load" @click="goapp">下载斗牛app参与抽奖</div>
            </div>
            
        </div>
        <div class="login-bg" v-show="showBaseModal"></div>
        <login v-show="showBaseModal" @register='register'></login>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { DateDiff } from "../../common/util";
import { getUrlParam } from "../../common/util";
import login from "./reglogin";
import { winninginfo, relate,NoTokenWinninginfo } from "../../common/api/lotter.js";
export default {
  data() {
    return {
      timeData: { H: "00", m: "00", s: "00" },
      clearTime: null,
      showBaseModal: true,
      shareList: {},
      query: { userid: null, id: null }
    };
  },
  components: {
    login
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo"
    })
  },
  mounted() {
    if (this.userInfo && this.userInfo.token) {
      this.showBaseModal = false;
    }
    this.query.userid = Number(getUrlParam("userid") || 0);
    this.query.id = getUrlParam("id") || null;
    this.PrizeShow();
  },
  methods: {
    PrizeShow() {
      let _ = this;
      let api = _.userInfo && _.userInfo.token ? winninginfo : NoTokenWinninginfo
      api(this.query)
        .then(res => {
          _.shareList = res[0];
          _.setentime(_.shareList.drawtime, "H");
        })
        .catch(e => {
          console.error(e);
        });
    },
    goapp() {
      this.loadApp();
    },
    examine(id) {
      this.$router.push("/drawLottery/examine?id=" + id);
    },
    register(val) {
      if (val) {
        relate(this.query)
          .then(res => {
            this.showBaseModal = false;
          })
          .catch(e => {
            console.log(e);
          });
        this.PrizeShow();
      }
    },
    countdownTime(time, type) {
      this.timeData = DateDiff({ destination: time, type: type });
      let t = this.timeData;
      this.timetype = true;
      if (
        this.timeData.H <= 0 &&
        this.timeData.m <= 0 &&
        this.timeData.s <= 0
      ) {
        this.timetype = false;
        clearInterval(this.clearTime);
        t.H = t.m = t.s = "00";
        return;
      }

      t.H = t.H < 10 ? "0" + t.H : t.H;
      t.m = t.m < 10 ? "0" + t.m : t.m;
      t.s = t.s < 10 ? "0" + t.s : t.s;
    },
    setentime(time, type) {
      let _ = this;
      _.clearTime = setInterval(() => {
        _.countdownTime(time, type);
      }, 1000);
    }
  }
};
</script>
<style scoped>
.login-bg {
  position: fixed;
  width: 100%;
  background: #000;
  opacity: 0.5;
  z-index: 2;
  left: 0;
  top: 0;
  bottom: 0;
}
.wrap-share {
  position: fixed;
  background: url("/static/img/ghost_bg.png") 0 0 no-repeat;
  background-size: 100% 100%;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
}
.wrap-share .bg {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  width: 1000%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
}
.wrap-share .content {
  width: 90%;
  left: 50%;
  top: 50%;
  position: absolute;
  z-index: 2;
  transform: translate(-50%, -50%);
  text-align: center;
}
.wrap-share .regulation {
  position: absolute;
  right: -10px;
  top: 40px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #f8f8f8;
  font-size: 10px;
  color: #666;
  z-index: 2;
}
.wrap-share .content .title {
  color: #fff;
  font-weight: bold;
  font-size: 26px;
}
.wrap-share .content .count-down {
  font-size: 30px;
  font-weight: bold;
  color: #ffc700;
  text-align: center;
  margin: 15px auto 25px;
}
.wrap-share .content .count-down span {
  width: 55px;
  height: 55px;
  background: #ffc700;
  color: #333;
  line-height: 50px;
  display: inline-block;
  border-radius: 10px;
}
.wrap-share .content .product {
  background: #fff;
  border-radius: 15px;
  padding-top: 8vw;
  position: relative;
}
.draw-price {
  position: absolute;
  background: #ffc700;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  left: 17px;
  top: 34px;
  color: #333;
  font-size: 12px;
}
.draw-price span:nth-child(1) {
  font-size: 18px;
  font-weight: bold;
}
.product .product-img {
  width: 90%;
  margin: 0 auto;
  /* height: 0;*/
  padding-top: 20%;
}
.product .product-name {
  font-size: 13px;
  color: #333;
  font-weight: bold;
  margin: 20px auto 0;
  width: 90%;
}
.product .price {
  font-size: 12px;
  color: #333;
  margin: 15px auto 25px;
}
.content .load {
  font-size: 17px;
  color: #333;
  font-weight: bold;
  background: #ffc700;
  height: 54px;
  line-height: 54px;
  border-radius: 0 0 15px 15px;
}
</style>

