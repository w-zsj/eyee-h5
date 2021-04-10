<template>
  <div class="countimg_sty" :class="{'homeLimitCont':countType == 1}">
    <p class="flex-center" :class="{'isactive':countInfos.isactive}">
      <span>{{isCounting?'距':''}}{{countInfos.isactive?'结束':'开始'}}{{isCounting?'':'时间'}}:&emsp;</span>
      <label class="font-price" style="font-size:16px;">{{showDate}}</label>
    </p>
  </div>
</template>
<script>
import { DateFormat, DateDiff } from "../../common/util";
export default {
  data() {
    return {
      showDate: null,
      timeRun: {},
      isCounting: false
    };
  },
  props: {
    countInfos: Object,
    // ghostType: { type: Number, default: 0 }, //鬼市列表 
    countType: { type: Number } // 1为首页限量发售倒计时
  },
  computed:{
  },
  mounted() {
    var _ = this;
      _.countDown();

  },
  methods: {
    insq() {
      let openid = this.$route.query.openid;
      return !!openid || !!window.mqq;
    },
    countDown() {
      var desDate;
      //  console.log(this.countInfos,'倒计时 时间')
      if (this.countInfos.isactive) {
        desDate = this.countInfos.endtime;
      } else {
        desDate = this.countInfos.begintime;
      }

      let toDate = DateDiff({ destination: desDate, type: "d" });
      if (
        // !this.insq &&
        toDate &&
        toDate.d > -1 &&
        toDate.H > -1 &&
        toDate.m > -1 &&
        toDate.s > -1
      ) {
        if (toDate.d > 0) {
          this.isCounting = false;
          this.showDate = DateFormat(desDate, "MM月dd日 HH:mm");
        } else {
          this.isCounting = true;
          // let unformtTime = DateDiff({ destination: desDate, type: 'H' })
          this.showDate =
            this.decpadleft(toDate.H) +
            ":" +
            this.decpadleft(toDate.m) +
            ":" +
            this.decpadleft(toDate.s);
          this.timeRun = setTimeout(() => {
            this.countDown();
          }, 1000);
        }
      } else this.showDate = DateFormat(desDate, "MM月dd日 HH:mm");
    },
    decpadleft(val) {
      if (val < 10) return "0" + val;
      else return val;
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeRun);
  }
};
</script>
<style scoped>
.countimg_sty > p {
  height: 34px;
  flex-wrap: wrap;
}
.countimg_sty > p label {
  font-size: 18px;
}
.countimg_sty > p span {
  font-size: 14px;
  /* color: #4db6ca; */
}
.countimg_sty > p.isactive span {
  /* color: #d99485; */
}
.countimg_sty.homeLimitCont > p {
  padding: 10px 15px;
  justify-content: left;
  height: auto;
  text-align: left;
}
.countimg_sty.homeLimitCont > p span {
  font-size: 12px;
  color: #999;
}
.countimg_sty.homeLimitCont > p label {
  display: block;
  width: 100%;
  text-align: left;
  font-size: 24px;
  color: #666;
}
/* .font-price{
      margin-top:6px;
    } */
</style>
