<template>
  <div
    class="lu"
    :class="{'lu-slide':isSlide}"
    v-if="info!=null"
    :id="info.productid"
    :isactiveEnd="limitInfo.salestatus"
  >
    <template v-if="!isSlide">
      <div
        v-if="flag!=0"
        class="lu-flag"
        :class="{'lu-gray':info.salestatus==3,'lu-black':info.salestatus==2}"
      >
        <div class="flex-center font-price">
          <span>{{info.day}}</span>
          <span>{{info.month}}</span>
        </div>
        <hr v-if="flag==2" class="lu-line">
      </div>
    </template>
    <div class="lu-main" @click.stop.prevent="go">
      <div
        class="lu-img"
        :style="imgH"
        :class="{'sold-out':isSlide&&info.issoldout,'coming':isSlide&&info.salestatus==2}"
      >
        <img :src="info.picurl|https" alt>
      </div>
      <template v-if="isSlide">
        <CountDown :countInfos="countMsg" :countType="1"></CountDown>
        <!-- <div v-if="info.specialprice>0&&info.specialprice<info.saleprice&&info.salestatus!=3" class="slidePrice font-price">
          <label>¥{{info.specialprice}}</label>
        </div>
        <div v-else class="slidePrice font-price">
          <span>¥{{info.saleprice}}</span>
        </div>-->
        <div class="slidePrice font-price">
          <span>¥{{info.price}}</span>
          <span class="del" v-if="info.del>0">¥{{info.del}}</span>
        </div>
      </template>
      <template v-else>
        <p class="info_title ellipsis">{{info.title}}</p>
        <div class="price_time flex-between">
          <!-- <p v-if="info.saleprice" class="info_price">
            <span class="lu-anred">¥{{info.specialprice}}</span>
          </p>-->
          <div class="info_price font-price">
            <span>¥{{info.price}}</span>
            <span class="del" v-if="info.del>0">¥{{info.del}}</span>
          </div>
          <div class="info_time">
            <p v-if="info.issoldout||info.salestatus==3" class="info_sold">SOLD OUT</p>
            <div v-if="info.salestatus==2||info.salestatus==1">
              <CountDown :countInfos="countMsg"></CountDown>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
  <div v-else>加载失败</div>
</template>
<script>
import { DateFormat, DateBetween, DateDiff } from "../common/util"; // , DateDiff
import CountDown from "./CountDown";
export default {
  name: "LimitUnit",
  props: {
    isSlide: { type: Boolean, default: false },
    flag: { type: Number, default: 0 }, // 左侧浮标，0无，1有但无连接线，2有且有连接线
    limitInfo: { type: Object },
    qzone: { type: Boolean, default: false },
    swiperIndex: { type: Number, default: 0 }
  },
  components: { CountDown },
  data() {
    return {
      countMsg: {
        begintime: this.limitInfo.begintime,
        endtime: this.limitInfo.endtime,
        isactive: DateBetween({
          begin: this.limitInfo.begintime,
          end: this.limitInfo.endtime
        })
      },
      imgH: "",
      // countDownArr: {},
      // month: [
      //   "",
      //   "Jan.",
      //   "Feb.",
      //   "Mar.",
      //   "Apr.",
      //   "May.",
      //   "Jun.",
      //   "Jul.",
      //   "Aug.",
      //   "Sep.",
      //   "Oct.",
      //   "Nov.",
      //   "Dec."
      // ],
      counttime: null
    };
  },
  mounted() {
    this.countMsg.begintime = this.limitInfo.begintime;
    this.countMsg.endtime = this.limitInfo.endtime;
    this.countMsg.isactive = DateBetween({
      begin: this.limitInfo.begintime,
      end: this.limitInfo.endtime
    });

    this.counttime = DateDiff({
      destination: this.limitInfo.endtime,
      type: "H"
    });

    // console.log(
    //   this.countMsg,
    //   "countMsg--------------------------------------"
    // );
    if (this.info != null) {
      let ref = document.getElementsByClassName("lu-img"),
        h = 0;
      if (ref && ref.length > 0) {
        h = ref[0].clientWidth / (1920 / 1080);
      }
      this.imgH = "max-height:" + h + "px";
    }
  },
  computed: {
    info() {
      let _ = this,
        info = null;
      if (_.limitInfo && _.limitInfo.productid) {
        info = _.limitInfo;
        // info.typedesc = info.salestatus == 1 ? '发售中' : info.salestatus == 2 ? '预告中' : '已售罄'
        let diff = DateFormat(
          info.salestatus == 1
            ? info.begintime
            : info.salestatus == 2
            ? info.foreshowtime
            : info.endtime,
          "dd-ｍ"
        );
        // console.log(diff)
        info.day = diff.split("-")[0];
        info.month = diff.split("-")[1];
        // info.day = DateFormat(info.begintime, "dd");
        // info.month = _.month[parseInt(DateFormat(info.begintime, "MM"))];
        info.del = 0;
        info.price = info.saleprice;
        if (info.specialprice > 0 && info.specialprice != info.saleprice) {
          info.price = info.specialprice;
          info.del = info.saleprice;
        }
      }
      return info;
    }
  },
  methods: {
    go() {
      let info = this.info;

      let url = "/productDetail/" + info.productid;
      if (info.salestatus == 3) this.toast("已结束");
      else {
        this.qzone ? this.qzoneGo(url) : this.$router.push(url);
      }
    }
  }
};
</script>
<style scoped>
.flex-center {
  flex-direction: column;
}

.lu {
  display: flex;
  padding-top: 5px;
  padding-right: 5px;
}

.lu-flag {
  width: 17%;
  font-size: 12px;
  color: #fff;
  position: relative;
}

.lu-info {
  width: 40%;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
  text-align: left;
}

.lu-info > * {
  margin-top: 5px;
}

.lu-info img {
  width: 18px;
  vertical-align: middle;
  margin: -3px 5px 0 0;
}

.lu-ctd {
  font-size: 30px;
}

.lu-flag > div,
.lu-flag > .lu-line {
  background-color: #9750ff;
}

.lu-gray > div,
.lu-gray > .lu-line {
  background-color: #999;
}
.lu-black > div,
.lu-black > .lu-line {
  background-color: #8050ff;
}
.lu-flag > div {
  margin: auto;
  text-align: center;
}

.lu-flag > div:first-of-type {
  width: 45px;
  height: 45px;
  background-color: #9750ff;
  border-radius: 50%;
  margin-top: 17.3333vw;
  background-position: center;
  background-size: contain;
}
.lu-flag.lu-gray > div:first-of-type {
  background-color: #999999;
}
.lu-flag.lu-black > div:first-of-type {
  background-color: #9750ff;
}

.lu-tip {
  width: 50px;
  line-height: 22px;
  border-radius: 5px;
  transform: scale(0.8);
  transform-origin: center top;
}

.lu-flag > .lu-line {
  /* position: absolute; */
  display: block;
  height: 98%;
  width: 3px;
  border: none;
  /* top: 40px; */
  /* left: 50%; */
  margin-top: -5px;
  margin-left: 48%;
  /* z-index: -1; */
}

.lu-main {
  position: relative;
  width: 80.8%;
  /* padding: 5px; */
  background-color: #fff;
  border-radius: 10px;
  font-size: 14px;
  box-shadow: 0 0 5px 0 #ccc;
  padding-bottom: 13px;
}
.lu-img {
  width: 100%;
  /* height: 100%; */
  min-height: 100px;
  margin: auto;
  /* border-radius: 8px; */
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.lu-img img {
  width: 100%;
  /* border-radius: 8px; */
  border-radius: 8px 8px 0 0;
}

.lu-slide .lu-main {
  width: 100%;
  padding: 0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0px 0px 7px 0px #e3e3e3;
  margin-bottom: 4px;
}
.lu-slide .lu-main .lu-img {
  height: auto;
}
.lu-slide .lu-main .lu-img img {
  border-radius: 0;
  height: auto;
}
.lu-slide .lu-main .lu-img.sold-out::after,
.lu-slide .lu-main .lu-img.coming::after {
  font-weight: 900;
  font-size: 20px;
}

.lu-main p {
  /* padding: 0px 10px; */
  margin: 6px 0;
}

.lu-red .prev_word,
.lu-anred {
  color: #333333;
}

.lu-blue .prev_word {
  color: #3ca1d0;
}

.old_price {
  font-size: 11px;
  color: #999;
}
.lu-date {
  font-size: 15px;
}
.ico-arrow-l {
  position: absolute;
  top: 12px;
  left: -10px;
  border-top-width: 8px;
  border-bottom-width: 8px;
  border-right-width: 10px;
  border-right-color: #fff;
}
.lu-arrow {
  position: absolute;
  width: 12px;
  height: 16px;
  top: 14px;
  left: -12px;
  overflow: hidden;
}
.lu-arrow::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  background-color: #fff;
  width: 12px;
  height: 12px;
  transform: translate(100%, 0) rotate(45deg);
  transform-origin: 0 0;
  box-shadow: 0 0 5px 0 #ccc;
}

.info_title {
  color: #666666;
  line-height: 17px;
  max-height: 42px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 0 25px;
}
p.info_price {
  /* text-align: center; */
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  line-height: 18px;
  /* padding: 0 25px; */
}
.info_sold {
  color: #999;
  font-size: 15px;
  line-height: 17px;
  text-align: center;
  margin-bottom: 25px;
  margin-top: 10px;
  font-weight: 600;
}
.soldOut {
  display: none;
}
.info_time {
  color: #666666;
  line-height: 17px;
}
.info_time .font-price {
  font-size: 22px;
}
.info_shoptype {
  text-align: center;
  color: #333;
  font-size: 11px;
}
.slidePrice {
  position: absolute;
  right: 15px;
  bottom: 3px;
  font-size: 24px;
}
.slidePrice > label {
  display: block;
  text-align: left;
}
.price_time {
  padding: 0 20px;
  line-height: 18px;
}

.info_price {
  font-size: 18px;
}
</style>
