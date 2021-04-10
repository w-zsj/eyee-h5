<template>
  <div class="main">
    <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3>新品发售</h3>
      </div>
    </v-header>
    <!-- 滑动选择月份日期 -->
    <div class="swiper-date" :style=" $root.ISAPP?'top:0':''">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide class="flex-center year-info-left" data-year-info="-1">{{curYear-1}}</swiper-slide>
        <swiper-slide v-for="(item ,index) in curMonth" :key="item">
          <span :class="curVal == index+1 ? 'swiper-active':''">{{item}}月</span>
        </swiper-slide>
        <swiper-slide></swiper-slide>
        <!-- <swiper-slide class="flex-center year-info-right" data-year-info="1">{{curYear+1}}</swiper-slide> -->
      </swiper>
      <div class="swiper-triangle"></div>
    </div>

    <div v-if="newProdList.length > 0">
      <div class="commodit" v-for="(prod,index) in newProdList" :key="index">
        <div class="new-product-date flex-aic" :style=" $root.ISAPP?'top:60px':''">
          <img src="//files.eyee.com/mcdn/static/img/calendar.png" alt />
          {{prod.starttime | changeDate}}
        </div>
        <div
          class="commodit-item flex-center"
          v-for="(item,index) in prod.productlist"
          :key="index"
          @click="goDetail(item.productid)"
        >
          <div class="item-info item-img flex-center">
            <img :src="item.imgurl" alt />
          </div>
          <div class="item-name">
            <p class="brand">{{item.brand}}</p>
            <p class="name">{{item.name}}</p>
            <!-- <p class="sale-font date"><img src="../../../static/img/sale_calendar.png"><span>发售日期：</span></p> -->
            <!-- <p class="sale-font">{{item.starttime}}</p> -->
          </div>
          <div class="item-price">
            <p class="sale-font">市场价格：</p>
            <p class="font-price">¥{{item.saleprice}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="sale-empty" v-else>
      <div class="empty-img">
        <img src="../../../static/img/new_sale.png" />
        <p>本月暂无发售信息</p>
      </div>
    </div>
  </div>
</template>

<script>
import { NewProd } from "../../common/api/sneaker";
import { DateFormat } from "../../common/util";
const toUppercase = val => {
  console.log(val);
  let upVal = "";
  let one = parseInt(val % 10);
  let two = parseInt((val % 100) / 10);
  switch (two) {
    case 0:
      upVal += "";
      break;
    case 1:
      upVal += "十";
      break;
    case 2:
      upVal += "二十";
      break;
    case 3:
      upVal += "三十";
      break;
  }
  switch (one) {
    case 0:
      upVal += "";
      break;
    case 1:
      upVal += "一";
      break;
    case 2:
      upVal += "二";
      break;
    case 3:
      upVal += "三";
      break;
    case 4:
      upVal += "四";
      break;
    case 5:
      upVal += "五";
      break;
    case 6:
      upVal += "六";
      break;
    case 7:
      upVal += "七";
      break;
    case 8:
      upVal += "八";
      break;
    case 9:
      upVal += "九";
      break;
  }
  return upVal;
};
export default {
  data() {
    return {
      newProdList: [],
      appShare: {},
      curMonth:new Date().getMonth() + 1,
      curVal: new Date().getMonth() + 1,
      curYear: new Date().getFullYear(),
      tPos: { pre: 99, next: 99 },
      swiperOption: {
        initialSlide: new Date().getMonth() + 1,
        slidesPerView: 6, //显示的slides数量
        freeModeMomentumBounce: false, //动量反弹
        centeredSlides: true, //设定为true时，活动块会居中，而不是默认状态下的居左
        touchRatio: 0.5, //触摸距离与slide滑动距离的比率
        slideToClickedSlide: true, // 点击slide会过渡到这个slide

        onInit: swiper => {
          this.swInit(swiper);
        },
        onSetTranslate: (swiper, translate) => {
          this.translate(swiper, translate);
        },
        onTransitionEnd: swiper => {
          this.curVal = swiper.activeIndex;
          this.getNewProdList();
        },
        onTap: (swiper, event) => {
          this.toggleYear(swiper, event);
        }
      }
    };
  },
  filters: {
    changeDate(val) {
      let _ = this,
        month,
        day;
      month = toUppercase(Number(DateFormat(val, "M")));
      day = toUppercase(Number(DateFormat(val, "d")));
      return month + "月" + day + "日";
    }
  },
  mounted() {
    // this.getNewProdList();
  },

  methods: {
    toggleYear(swiper, e) {
      let _ = this,
        info = e.target;
      if (info && info.dataset && info.dataset.yearinfo) {
        _.curYear = _.curYear + parseInt(info.dataset.yearinfo);
        console.log("3333333");
        _.getNewProdList();
      }
    },
    swInit(swiper) {
      let winhalfW = window.innerWidth / 2;
      this.tPos.pre = winhalfW - this.getTranslate(swiper, 1);
      this.tPos.next =
        winhalfW - this.getTranslate(swiper, swiper.slides.length - 2);
    },
    getTranslate(swiper, idx) {
      let trans = 0;
      for (var i = 0; i < swiper.slides.length; i++) {
        if (swiper.slides[i]) {
          if (i < idx) trans += swiper.slides[i].offsetWidth;
          if (i == idx) trans += swiper.slides[i].offsetWidth / 2;
        }
      }
      return trans;
    },
    translate(swiper, translate) {
      let b = false,
        toidx = 1;
      if (this.tPos.pre != 99 && translate > this.tPos.pre) {
        b = true;
        toidx = 1;
        swiper.setWrapperTranslate(this.tPos.pre);
      }
      if (this.tPos.next != 99 && translate < this.tPos.next) {
        b = true;
        toidx = swiper.slides.length - 2;
        swiper.setWrapperTranslate(this.tPos.next);
      }
      if (b == true && this.currM != swiper.realIndex) {
        this.currM = toidx;
        swiper.slideTo(toidx);
      }
    },
    getNewProdList() {
      let _ = this;
      _.newProdList = [];
      NewProd({ year: _.curYear, month: _.curVal })
        .then(res => {
          _.newProdList = res.list;
          // app 分享信息
          if (res.share) {
            _.appShare.sharecontent = res.share.content;
            _.appShare.sharetitle = res.share.title;
            _.appShare.sharepicurl = res.share.icon;
            _.appShare.shareurl = res.share.url;
            _.appShare.xcxurl = res.share.xcxurl || "";
            _.appShare.callbackname = "";

            _.initShare({
              info: {
                title: res.share.title,
                desc: res.share.content,
                img: res.share.icon,
                url: res.share.url
              }
            });
          }

          if (_.$root.ISAPP) {
            _.javascriptBridge({
              name: "getAppActivityShareContent",
              params: _.appShare
            });
          }
        })
        .catch(e => {
          console.error(e);
          // this.toast(e && e.msg ? e.msg : ('error:' + e))
        });
    },

    goDetail(id) {
      if (this.$root.ISAPP) {
        let opt = {
          name: "gotoAppSneakerDetailPage",
          params: {
            productid: id
          }
        };
        this.javascriptBridge(opt);
      } else {
        this.$router.push("/sneaker/detail/" + id);
      }
    }
  }
};
</script> 

<style lang="scss" scoped>
.main {
  width: 100%;
}
.nav-top {
  border-bottom: 1px solid #f5f5f5;
}
.commodit {
  justify-content: space-between;
  .commodit-item {
    width: 100%;
    height: 33.0667vw;
    padding: 3.2vw 2.6667vw;
    position: relative;
    color: #333;
    justify-content: space-between;
    // border-bottom: 2px solid #F5F5F5;
    .item-img {
      width: 26.6667vw;
    }
    .item-name {
      padding: 0 2vw;
      width: calc(100% - 26.6667vw - 16vw);
    }
    .item-price {
      width: 16vw;
    }
    .sale-font {
      color: #666;
      font-size: 12px;
      position: relative;
      img {
        position: absolute;
        top: 2px;
        margin: 0;
        padding: 0;
        height: 13px;
        width: 13px;
      }
    }
    img {
      width: 100%;
    }
    .brand {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 37.0667vw;
      font-size: 4vw;
      padding-bottom: 2vw;
      color: #333;
    }
    .name {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      // width: 30vw;
      font-size: 4vw;
      // padding-bottom: 3.4667vw;
      color: #333;
    }
    .date {
      width: 37.0667vw;
      padding-bottom: 1.3333vw;
      span {
        padding-left: 19px;
      }
    }
    .font-price {
      color: #af3c03;
      font-size: 20px;
    }
    .commodit-item-name {
      margin-top: 1.8667vw;
      font-size: 13px;
      font-family: BASE_PRICE;
      font-weight: 800;
      width: 38.1333vw;
      height: 8.5333vw;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .commodit-item-price {
      color: #999;
      margin-top: 2.1333vw;
    }
  }
}
.sale-empty {
  width: 100vw;
  height: 120vw;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.empty-img {
  width: 29.4667vw;
  height: 11.8667;
  display: inline-block;
  p {
    color: #999;
    font-size: 13px;
    margin-top: 8.9333vw;
  }
}
.swiper-date {
  width: 100%;
  height: 60px;
  line-height: 60px;
  color: #999;
  font-weight: 600;
  position: sticky;
  position: -webkit-sticky;
  background: #fff;
  top: 47px;
  z-index: 2;
  border-bottom: 1px solid #f0f0f0;

  .swiper-triangle {
    width: 0;
    height: 0;
    border-width: 0 1.3333vw 2.6667vw;
    border-style: solid;
    border-color: transparent transparent #f2f2f2;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -1.3333vw;
  }
  .swiper-active {
    color: #333;
  }
}
.new-product-date {
  padding: 5px 10px;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  position: -webkit-sticky;
  top: 107px;
  background: #fff;
  z-index: 1;
  img {
    width: 25px;
    height: 25px;
    display: inline-block;
    margin-right: 10px;
  }
}
.year-info-left {
  position: relative;
  left: -11.6667vw;
  font-size: 6vw;
}
.year-info-left::after {
  content: "";
  width: 0;
  display: inline-block;
  height: 0;
  border-width: 4vw 4vw 4vw 0;
  border-style: solid;
  border-color: transparent #ccc transparent transparent;
  position: relative;
  left: 8.3333vw;
}
.year-info-right {
  position: relative;
  right: -14.6667vw;
  font-size: 6vw;
}
.year-info-right::after {
  content: "";
  width: 0;
  display: inline-block;
  height: 0;
  border-width: 4vw 0 4vw 4vw;
  border-style: solid;
  border-color: transparent transparent transparent #ccc;
  position: relative;
  left: -23.6666vw;
}
</style>


