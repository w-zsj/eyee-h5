<template>
  <div class="mall-ghost" v-if="hasdata">
    <!-- <v-list :load-handle='reload' > -->
    <!-- :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd' -->
    <!-- <div v-if="false">
      <template v-if="solding.length">
        <div class="bdcolor">
          <img v-lazy="https(ghostInfo[0].img)" alt="">
        </div>
          <GhostUnit v-for="item in solding" :key="item.id" :guishiIcon='1' :ghostShopInfos="item"></GhostUnit>
      </template>
      <template v-if="forecast.length">
        <div class="bdcolor">
          <img v-lazy="https(ghostInfo[1].img)" alt="">
        </div>
        <GhostUnit v-for="item in forecast" :key="item.id" :guishiIcon='1' :ghostShopInfos="item" ></GhostUnit>
      </template>
    </div>-->
    <!-- <div> -->
    <div class="beginTime" v-if="true">
      <!-- <template> -->
      <ul>
        <li class="nowSale" v-if="ghostListInfoNow&&ghostListInfoNow.length>0">
          <span>
            <em>正在进行</em>
            <!-- <i class="leftCircle"></i>
            <i class="rightCircle"></i>-->
          </span>
        </li>
        <li v-for="item in ghostListInfoNow" :key="item.id" @click.stop="ghostProListItem(item.id)">
          <div class="setTime">
            <img :src="item.logourl">
            <CountDown :countInfos="item" class="soldingTime"></CountDown>
          </div>
        </li>

        <li class="nowSale soon" v-if="ghostListInfoSoon&&ghostListInfoSoon.length>0">
          <span>
            <em>即将开始</em>
            <!-- <i class="leftCircle"></i>
            <i class="rightCircle"></i>-->
          </span>
        </li>
        <li
          v-for="item in ghostListInfoSoon"
          :key="item.id"
          @click.stop="ghostProListItem(item.id)"
        >
          <div class="setTime">
            <img :src="item.logourl">
            <CountDown :countInfos="item" class="soldingTime"></CountDown>
          </div>
        </li>
      </ul>
      <div class="no-more" v-show="showend">已经到底啦~~</div>
      <!-- </template> -->
    </div>
    <!-- </div> -->
    <!-- </v-list> -->
  </div>
  <div v-else class="ghostPause">
    <img :src="ghostPause" alt>
    <p>
      <span>暂无活动</span>
    </p>
  </div>
</template>
<script>
import { SpecialSale } from "../../common/api/marketing"; // , GetSpecialSaleProductList
// import { DateDiff, DateFormat } from '../../common/util'
import GhostUnit from "./../../components/templates/GhostUnit";
import CountDown from "./CountDown";
import { mapGetters } from "vuex";
export default {
  name: "MallGhost",
  components: { GhostUnit, CountDown },
  data() {
    return {
      hasdata: true,
      ghostBg: "",
      // isActive: false,
      ghostPause: "//files.eyee.com/mcdn/static/img/ghostPause.png", // require('../../assets/img/ghostPause.png'),
      countDownArr: { H: 0, m: 0, s: 0 },
      beginTime: "",
      endTime: "", // ,
      ghostListInfoNow: [],
      ghostListInfoSoon: []
      // isEnd: false,
      // isLoading: false
    };
  },
  computed: {
    ...mapGetters({
      ghostInfo: "ghostInfo",
      ghostList: "ghostList",
      forecast: "forecast",
      solding: "solding"
    }),
    showend() {
      return (
        (this.ghostListInfoNow && this.ghostListInfoNow.length > 0) ||
        (this.ghostListInfoSoon && this.ghostListInfoSoon.length > 0)
      );
    }
  },
  mounted() {
    //  sessionStorage.setItem("guishiIcon","1");
    this.initShare({ type: 1 });
    if (!(this.ghostInfo && this.ghostList && this.ghostList.length > 0)) {
      this.req();
    } else {
      // console.log(this.ghostInfo,'jjj')
    }
  },
  methods: {
    ghostProListItem(id) {
      this.$router.push({
        path: "/GhostProList",
        query: { id }
      });
    },
    reload($el) {
      this.req();
    },
    // loadmore($el) {
    //   if (this.isEnd === true) {
    //     this.toast('已无更多')
    //   }
    //   this.isLoading = true
    // },
    // req() {
    //   // this.isLoading = true
    //   SpecialSale()
    //     .then(res => {
    //       // console.log('ghost', res)
    //       if (res && res.list.length > 0) {
    //         this.$store.dispatch('setGhostInfo', res)
    //       } else {
    //         this.hasdata = false
    //       }
    //       // this.isLoading = false
    //     })
    //     .catch(e => {
    //       console.error('SpecialSale', e)
    //       this.hasdata = false
    //       this.toast('网络繁忙！请稍后再试')
    //     })
    // },
    req() {
      // this.isLoading = true
      SpecialSale()
        .then(res => {
          if (res && res.list.length > 0) {
            this.ghostListInfo = res;
            console.log("鬼市列表", this.ghostListInfo);
            res.list.map(i => {
              if (i.isactive) this.ghostListInfoNow.push(i);
              else this.ghostListInfoSoon.push(i);
            });
          } else {
            this.hasdata = false;
          }
        })
        .catch(e => {
          console.error("SpecialSale", e);
          this.hasdata = false;
          this.toast("网络繁忙！请稍后再试");
        });
    }
  }
};
</script>
<style scoped>
.beginTime {
  padding: 0 10px;
}
.beginTime ul li {
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
}
.beginTime .nowSale {
  margin-bottom: 0;
  /* padding-top: 10px; */
}
.nowSale {
  font-size: 14px;
  color: #6133d8;
  text-align: center;
  line-height: 40px;
  position: relative;
}
.nowSale span {
  position: relative;
  padding-left: 20px;
}
.nowSale span:before {
  position: absolute;
  content: "";
  width: 15px;
  height: 15px;
  left: 0;
  top: 0;
  background: url("/static/imgs/mall/ico-clock.png") 0 0 no-repeat;
  background-size: cover;
}
.nowSale.soon span:before {
  background: url("/static/imgs/mall/ico-clock.png") 0 0 no-repeat;
  background-size: cover;
}
/* .nowSale span .leftCircle,
.nowSale span .rightCircle {
  position: absolute;
  height: 1px;
  width: 20px;
  left: -30px;
  top: 8px;
  background: #ffc700;
}
.nowSale span .rightCircle {
  left: auto;
  right: -30px;
}
.nowSale span .leftCircle:before,
.nowSale span .rightCircle:before {
  position: absolute;
  content: '';
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #ffc700;
  left: 0;
  top: -1px;
}
.nowSale span .leftCircle:before {
  left: auto;
  right: 0;
} */
.solding {
  position: relative;
  height: 142px;
  width: 100%;
}
.solding .bdcolor {
  height: 100%;
  width: 100%;
}
.solding .bdcolor img {
  height: 100%;
  width: 100%;
}
.setTime {
  position: relative;
  min-height: 120px;
  /* height: 142px; */
}
.setTime img {
  display: block;
  height: 100%;
  width: 100%;
}
.soldingTime {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 15px;
  color: #fff;
}
.solding .businessname {
  position: absolute;
  top: 25px;
  text-align: center;
  width: 100%;
  font-size: 14px;
  color: #ffc700;
}
.solding .businessname span {
  line-height: 24px;
  border: 1px solid #ffc700;
  border-left: 0;
  border-right: 0;
  padding: 3px 0;
}
.ghostPause {
  position: fixed;
  /* top: 80px; */
  width: 100%;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.ghostPause > img {
  width: 40%;
}
.ghostPause > p {
  margin-top: 30px;
}
.bdcolor {
  padding: 5px;
  background: white;
}
</style>
