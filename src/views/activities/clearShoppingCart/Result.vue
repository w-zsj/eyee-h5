<template>
  <div class="cspc">
    <img src="/static/imgs/cspc/r-banner.png" alt>
    <v-delay :delay="200" class="sec-box">
      <img src="/static/imgs/cspc/r-info.png" alt>
      <div class="r-info">
        <img :src="lucky.imgurl" alt>
        <p class="r-username">{{lucky.username}}</p>
        <p class="r-mobile">{{lucky.mobile}}</p>
        <p class="font-price r-total">{{total|currency}}</p>
      </div>
    </v-delay>
    <v-delay :delay="400" class="sec-box">
      <img src="/static/imgs/cspc/r-vdo.png" alt>
      <div class="r-vdo">
        <video
          controls="controls"
          preload="auto"
          playsinline="playsinline"
          width="100%"
          height="auto"
          poster
          :src="vdo"
        ></video>
      </div>
    </v-delay>
    <div class="flex-wrap flex-center r-items">
      <div class="r-cart" v-for="(pci, pcIdx) in items" :key="'items'+pcIdx">
        <img src="/static/imgs/cspc/poster-rect.png" alt>
        <img :src="(!!pci.colorimg?pci.colorimg:pci.mainpic)|https" alt>
        <span class="font-price">¥{{dealPrice(pci.saleprice,pci.specialprice)}}</span>
      </div>
    </div>
    <v-delay :delay="600" class="sec-box">
      <img src="/static/imgs/cspc/r-enter.png" alt>
      <div class="r-enters">
        <!-- 年货节 -->
        <div class="cspc-list flex-center" @click="goto('/20190110/main')">
          <div class="cspc-item" v-for="(li, lIdx) in list" :key="'list'+lIdx">
            <img src="/static/imgs/cspc/border-rect.png" alt>
            <img :src="li.img" alt>
          </div>
          <div class="cspc-enter">
            <img src="/static/imgs/cspc/arrow-bgx.png" alt>
            <span>24个潮货榜单疯狂来袭, 速去围观></span>
          </div>
        </div>
        <!-- 会场 -->
        <div class="cspc-venue">
          <div
            v-for="(vi, vIdx) in venue"
            :key="'venue'+vIdx"
            class="flex-center"
            :class="{'flex-reverse':vIdx%2==1}"
            @click="goto(vi.url)"
          >
            <div class="venue-avatar">
              <img src="/static/imgs/cspc/border-circle.png" alt>
              <img :src="vi.avatar" alt>
            </div>
            <div class="venue-title">
              <img src="/static/imgs/cspc/arrow-bg.png" alt>
              <p v-html="vi.title"></p>
            </div>
            <img class="venue-flag" :src="`/static/imgs/cspc/flag-${vi.flag}.png`" alt>
          </div>
        </div>
      </div>
    </v-delay>
  </div>
</template>
<script>
import { GetLotteryInfo } from "@/utils/api/activities";

export default {
  name: "ClearShoppingCartResult",
  data() {
    return {
      lucky: {},
      items: [],
      vdo:
        "https://f1.eyee.com/Lottery.mp4",

      list: [
        {
          img: "/static/imgs/cspc/act-enter-1.png",
          url: ""
        },
        {
          img: "/static/imgs/cspc/act-enter-2.png",
          url: ""
        },
        {
          img: "/static/imgs/cspc/act-enter-3.png",
          url: ""
        }
      ],
      venue: [
        {
          avatar: "/static/imgs/cspc/av-supreme.png",
          title: "Supreme等海量潮牌五折疯抢!另有满399再减100!",
          flag: "half",
          url: "/20190110/sub?at=4&tt=11"
        },
        {
          avatar:
            "https://files.eyee.com/Shop/system/main/e121f131baa04788a1203b6de752bcfb.jpg",
          title: "Champion热销榜单5折起购！<br>进店购买另享399减100！",
          flag: "half",
          url: "/20190110/sub?at=4&tt=10"
        }
      ]
    };
  },
  computed: {
    total() {
      let _ = this,
        { items } = _,
        total = 0;
      items.forEach(i => {
        total += _.dealPrice(i.saleprice, i.specialprice) * i.count;
      });
      return total;
    }
  },
  beforeMount() {
    let _ = this;
    _.getLucky();

    _.setToolBar({
      title: "开奖 | 清空购物车",
      showshoppingcarticon: false
    });
    _.setShare();
  },
  methods: {
    setShare() {
      let _ = this,
        info = {
          title: "喜报 | 斗牛免费清空10万购物车获奖人揭幕",
          desc: "清空10万购物车大奖得主揭幕，请速来与我们联系~",
          img: window.location.origin + "/static/imgs/cspc/r-share.jpg",
          url: window.location.origin + "/cspc/result"
        };
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "getAppActivityShareContent",
          params: {
            sharetitle: info.title,
            sharecontent: info.desc,
            sharepicurl: info.img,
            shareurl: info.url,
            hideshareicon: false
          }
        });
      } else if (_.$root.ISWX) {
        _.initShare({ info });
      }
    },
    getLucky() {
      let _ = this;
      GetLotteryInfo("")
        .then(res => {
          console.log("GetLotteryInfo res: ", res);
          _.lucky = res.drawuser;
          _.items = res.productItems;
        })
        .catch(e => {
          console.error("GetLotteryInfo error: ", e);
        });
    },
    goto(url) {
      console.log("goto url: ", url);
      this.$router.push(url);
    },
    dealPrice(sale, special) {
      return special > 0 && special != sale ? special : sale;
    }
  },
  filters: {
    currency(val) {
      if (val && val != null) {
        let suffix = "";
        if (val > 100000) {
          suffix = "w";
          val = Number((val / 10000).toFixed(2));
        }

        val = String(val);
        var left = val.split(".")[0],
          right = val.split(".")[1];
        right = right ? "." + right.substr(0, 2) : "";
        var temp = left
          .split("")
          .reverse()
          .join("")
          .match(/(\d{1,3})/g);
        return (
          (Number(val) < 0 ? "-" : "") +
          temp
            .join(",")
            .split("")
            .reverse()
            .join("") +
          right +
          suffix
        );
      } else if (val === 0) return "0";
      else return "";
    }
  }
};
</script>
<style scoped>
.sec-box {
  position: relative;
}
.sec-box > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.r-info img {
  position: absolute;
  top: 1.8%;
  left: 49.5%;
  transform: translate(-50%, 0);
  width: 19.5vw;
  border-radius: 50%;
}
.r-info p {
  position: absolute;
  color: #fff;
  font-weight: 800;
}
.r-username {
  top: 23%;
  left: 50%;
  transform: translate(-50%, 0);
}
.r-mobile {
  top: 43%;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 5.4vw;
}
.r-total {
  top: 64%;
  left: 40%;
  font-size: 12vw;
}

.cspc .r-vdo {
  top: 28%;
  left: 4%;
  width: 92%;
  height: 40%;
  padding: 1%;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #ccaea4;
  background: url('/static/imgs/cspc/looterBg.jpg') 0 0 no-repeat;
  background-size: 100% 100%;
}
.r-vdo video {
  position: absolute;
  width: 96%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  border-radius: 6px;
}

.r-items {
  background: #241e4b;
}
.r-cart {
  position: relative;
  width: 24%;
  margin: 0 3.2%;
  padding-bottom: 24%;
}
.r-cart > img:first-of-type {
  position: absolute;
  z-index: 1;
}
.r-cart > img:last-of-type {
  position: absolute;
  top: 4%;
  left: 5%;
  width: 91%;
}
.r-cart span {
  z-index: 3;
  position: absolute;
  left: 5%;
  bottom: 0;
  width: 90%;
  line-height: 32px;
  font-size: 18px;
  font-weight: bolder;
  color: #fff;
  text-align: center;
}

.r-enters > div {
  position: absolute;
}

.cspc-list {
  top: 16.74%;
}
.cspc-venue {
  top: 60%;
}

.cspc-item {
  position: relative;
  width: 27%;
  overflow: hidden;
}
.cspc-item:nth-child(2) {
  width: 33%;
}
.cspc-item > img:last-of-type {
  position: absolute;
  top: 50%;
  left: 9%;
  width: 82%;
  transform: translate(0, -50%);
  border-radius: 5px;
}
.cspc-enter {
  position: absolute;
  width: 75%;
  bottom: -60px;
  line-height: 33px;
}
.cspc-enter img {
}
.cspc-enter span {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  color: #fff;
  font-size: 4.2vw;
  font-weight: 800;
  text-decoration: underline;
}

/* .cspc-venue {
  padding: 0 8%;
} */
.cspc-venue > div {
  position: relative;
  margin-bottom: 24px;
}
.venue-avatar {
  position: relative;
  width: 19.73%;
  margin: 0 1%;
}
.venue-avatar img:last-of-type {
  position: absolute;
  top: 50%;
  left: 7%;
  width: 87%;
  transform: translate(0, -50%);
  border-radius: 50%;
}
.venue-title {
  position: relative;
  width: 52.8%;
}
.flex-reverse .venue-title > img {
  transform: scaleX(-1);
}
.venue-title p {
  position: absolute;
  top: 50%;
  left: 12%;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  transform: translate(0, -50%);
}
.venue-flag {
  position: absolute;
  width: 18.53%;
  top: 0;
  right: 8%;
  transform: translate(0, -50%);
}
.flex-reverse .venue-flag {
  /* top: 15px; */
  left: 6%;
  right: unset;
  transform: rotate(-30deg);
  top: -8px;
}
.flex-reverse .venue-title p {
  left: 9%;
}

/* ------------------- */

.cspc {
}
.cspc img {
  display: block;
}
.cspc-main {
  position: relative;
}
.cspc-main > div {
  position: absolute;
  left: 0;
  width: 100%;
}

.cspc-main .cspc-date {
  top: 6%;
  width: 70%;
  margin-left: 15%;
}
.cspc-date p {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  line-height: 28px;
  text-align: center;
}
.cspc-date p,
.cspc-join p {
  color: #fff;
  font-size: 3.5vw;
  font-weight: bold;
}

.cspc-join {
  top: 25%;
}
.cspc-join p {
  width: 64%;
  height: 16vw;
}
.cspc-join .cspc-step1 {
  line-height: 16vw;
  margin-top: 8vw;
  margin-left: 36%;
}
.cspc-join .cspc-step2 {
  margin-top: 11.6vw;
  margin-left: 10.8vw;
  width: 55%;
}
.cspc-join .cspc-step3 {
  margin-top: 12.6vw;
  margin-left: 34%;
}

.cspc-rule {
  padding: 20px 30px;
}
.cspc-rule p {
  color: #fff;
  align-items: flex-start;
  margin-bottom: 2.67vw;
}
.cspc-rule p span:first-of-type {
  background: #c59560;
  margin-top: 3px;
  margin-right: 10px;
  width: 3.2vw;
  height: 3.2vw;
  line-height: 3.47vw;
  font-weight: 900;
  font-size: 4vw;
  text-align: center;
}
.cspc-rule p span:last-of-type {
  max-width: 90%;
  font-size: 3.2vw;
}
.cspc-btn {
  position: relative;
  width: 94%;
  left: 3%;
  padding: 5px;
}
.cspc-btn button {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  outline: none;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}
</style>
