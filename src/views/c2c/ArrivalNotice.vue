<template>
  <div v-if="preload"></div>
  <div v-else>
    <v-header v-if="!$root.ISAPP&&!$root.ISMP">
      <div class="nav-tab2">
        <h3>{{$route.meta.title||'到货通知'}}</h3>
      </div>
    </v-header>
    <v-list
      class="arrival-notice"
      :load-handle="reload"
      :more-handle="loadmore"
      :more-handling="loading"
      :isend="isend"
      v-if="list.length>0"
    >
      <div v-for="(item, index) in list" :key="index" class="an-cell">
        <p class="flex-aic an-time">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            stroke="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="6" cy="6" r="6" fill="rgba(250,75,75,0.5)" />
            <circle cx="6" cy="6" r="4" fill="#FA4B4B" />
          </svg>
          <span>{{item.time}}</span>
        </p>
        <div class="an-main">
          <p>{{item.text}}</p>
          <div class="flex-aic an-media">
            <div v-if="item.video" class="vdoPlay" :class="{paused:!item.playing}">
              <video
                poster="https://files.eyee.com/mcdn/static/loading.png!w400"
                webkit-playsinline
                playsinline
                @click.stop="togglePlay"
                :src="item.video|https"
                :data-idx="index"
                :controls="item.playing"
              >
                <source :src="item.video|https" type="video/mp4" />
              </video>
            </div>
            <template v-else>
              <img
                :class="item.imgClass"
                v-for="(img, imgIdx) in (item.imgClass=='triple'?3:item.imgs.length)"
                :key="index+'img'+imgIdx"
                v-lazy="https(item.imgs[imgIdx])"
                @click="preview(index,imgIdx)"
                alt
              />
              <span class="font-price" v-if="item.imgs.length>3">{{item.imgs.length-3}} +</span>
            </template>
          </div>
          <div class="flex-aic an-prod" @click="goDetail(item.productinfo)">
            <img v-lazy="item.productinfo.productpic" alt />
            <div>
              <p class="ellipsis">{{item.productinfo.productname}}</p>
              <p class="font-price">
                <span>¥{{item.productinfo.dealprice||' — —'}}&emsp;</span>
                <span
                  :class="item.abs"
                >{{item.productinfo.ranges<0?'-':'+'}}{{item.ranges}}% [ ¥ {{item.rangesprice}} ]</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </v-list>
    <div v-else class="no-data">
      <img src="//files.eyee.com/mcdn/static/img/no_product.png" alt />
      <p>未获取到通知</p>
    </div>
    <div class="preview" :class="{show:pv.show}" @click.stop="closePreview">
      <swiper :options="pv.opt" v-if="pvimgs" ref="pvSwiper">
        <swiper-slide class="flex-aic" v-for="(img,pvIdx) in pvimgs" :key="'pv'+pvIdx">
          <img v-lazy="img" alt />
        </swiper-slide>
      </swiper>
      <div class="pv-dots">{{pv.actIdx+1}}/{{pvimgs.length}}</div>
    </div>
  </div>
</template>
<script>
import { GetArrivalNotices } from "@/utils/api/sneaker";

// let mock = [
//   {
//     time: "2019-08-15 11:27",
//     text:
//       "【Nike Adapt BB Wolf Grey 2019年 回到未来 国内版】部分已到达斗牛共享仓，鉴定师已经开始查验入库。",
//     img:
//       "https://files.eyee.com/Shop/system/main/dfe117ef7bc945bf8c83380ece56dc53.jpg|https://files.eyee.com/Shop/system/main/669d68b08f204cfeaa56daf9d455ca47.jpg|https://files.eyee.com/Shop/system/main/b42704afdef54bfbbd96cc914a984c6e.jpg!c30|https://files.eyee.com/Shop/system/main/669d68b08f204cfeaa56daf9d455ca47.jpg",
//     video: "",
//     productinfo: {
//       productname: "Nike Adapt BB Wolf Grey 2019年 回到未来",
//       productpic:
//         "https://files.eyee.com/Shop/system/main/c6b20853aca44041951ae27fa3698865.png",
//       dealprice: 6300,
//       ranges: 19.35,
//       rangesprice: 2500,
//       productid: "0bi5Y7Sh",
//       size: "38"
//     }
//   },
//   {
//     time: "2019-08-14 06:54",
//     text:
//       "【Adidas Yeezy Boost 700 V2 TEPHRA 火山】已到达斗牛共享仓，开始查验入库。",
//     img: "",
//     video: "https://f1.eyee.com/community/flashnews/190923/1569204399542.mp4",
//     productinfo: {
//       productname: "Adidas Yeezy Boost 700 V2 TEPHRA 火山",
//       productpic:
//         "https://files.eyee.com/Shop/system/main/7e735c3fb1124e549babf54d37a18661.jpg",
//       dealprice: 3325,
//       ranges: -19.35,
//       rangesprice: -1234,
//       productid: "IxdQfQu6",
//       size: "40"
//     }
//   }
// ];

let page = 1;
const dealItem = i => {
  i.imgs = (i.img && i.img.split("|")) || [];
  i.imgClass = i.imgs.length > 2 ? "triple" : i.imgs.length > 1 ? "double" : "";

  i.playing = false;

  let ranges = i.productinfo.ranges;
  i.ranges = Math.abs(ranges);
  i.rangesprice = Math.abs(i.productinfo.rangesprice);
  i.abs = "trend-" + (ranges > 0 ? "up" : ranges < 0 ? "down" : "plat");

  return i;
};
export default {
  name: "ArrivalNotice",
  data() {
    return {
      preload: true,
      loading: true,
      isend: false,
      list: [],

      pv: {
        show: false,
        actIdx: 0,
        listIdx: 0,
        opt: {
          onSlideChangeEnd: this.pvSlideChange
        }
      }
    };
  },
  computed: {
    pvimgs() {
      let _ = this,
        curr = _.list && _.list[_.pv.listIdx];
      return (curr && curr.imgs) || [];
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.pv.show) {
      this.closePreview();
      next(false);
    } else next();
  },
  mounted() {
    this.reload();
  },
  beforeDestroy() {
    this.closePreview();
  },
  methods: {
    reload() {
      page = 1;
      this.load();
    },
    loadmore() {
      let _ = this,
        { isend, load } = _;
      if (isend) return;
      page++;
      load();
    },
    load() {
      let _ = this,
        list = [];

      // _.list = mock.map(dealItem);
      // console.log("GetArrivalNotices res: ", _.list);
      // _.loading = false;
      // _.isend = true;
      // return;

      _.loading = true;
      GetArrivalNotices({ page })
        .then(res => {
          // res = {
          //   list: mock,
          //   page: 1,
          //   size: 10,
          //   total: 2
          // };
          console.log("GetArrivalNotices res: ", res);
          if (res.list && res.list.length > 0) {
            list = res.list.map(dealItem);

            if (page === 1) _.list = list;
            else _.list = _.list.concat(list);

            _.isend = res.page * res.size >= res.total && _.list.length > 0;
          } else if (page === 1) _.list = [];

          if (page === 1 && res.share) {
            window._shareCallBack = function() {};
            let shareInfo = {
              sharecontent: res.share.content,
              sharepicurl: res.share.icon,
              shareurl: res.share.url,
              sharetitle: res.share.title,
              callbackname: "_shareCallBack"
            };

            if (_.$root.ISAPP) {
              _.javascriptBridge({
                name: "getAppActivityShareContent",
                params: {
                  ...shareInfo,
                  hideshareicon: false
                }
              });
            } else {
              _.initShare({
                type: 2,
                info: {
                  title: shareInfo.sharetitle,
                  url: shareInfo.shareurl,
                  img: shareInfo.sharepicurl,
                  desc: shareInfo.sharecontent
                }
              });
            }
          }

          _.loading = false;
          _.preload = false;
        })
        .catch(e => {
          console.error("GetArrivalNotices error: ", e);
          _.loading = false;
          this.toast("加载失败~");
          _.preload = false;
        });
    },
    togglePlay(e) {
      // console.log("togglePlay:", e.target, e);
      let curr = e.target,
        videos = document.querySelectorAll(".an-media video"),
        playing = !curr.paused;
      // curr.dataset.idx
      this.list.forEach((i, idx) => {
        if (idx == curr.dataset.idx) i.playing = !i.playing;
        else if (i.playing) i.playing = false;
      });
      videos.forEach(i => {
        i.pause();
      });
      if (!playing) curr.play();
    },
    goDetail(prod) {
      // console.log("goDetail:", prod);
      let _ = this,
        { ISAPP, ISMP } = _.$root;

      if (ISAPP) {
        // prod.type = 1;
        this.javascriptBridge({
          name: "gotoAppCouponTradePage",
          params: {
            // productid: "商品id",
            // size: "尺码，可空",
            // type: "1：预售券，2：现货券"
            ...prod
          }
        });
      } else if (ISMP) {
        wx.miniProgram.navigateTo({
          url: "/pages/sneaker/detail?id=" + prod.productid
        });
      } else _.$router.push("/sneaker/detail/" + prod.productid);
    },
    preview(listIdx, idx) {
      // console.log("preview: ", listIdx, idx);
      let pv = this.pv;
      pv.show = true;
      pv.listIdx = listIdx;
      pv.actIdx = idx;
      this.$refs.pvSwiper.swiper.slideTo(idx);
      document.body.classList.add("lock");
    },
    closePreview() {
      document.body.classList.remove("lock");
      this.pv.show = false;
    },
    pvSlideChange(swiper) {
      // console.log("pvSlideChange", swiper);
      this.pv.actIdx = swiper.activeIndex;
    }
  }
};
</script>
<style lang="scss">
$pdLR: 5.333vw;
.arrival-notice {
  padding-top: 2.667vw;

  .trend-up {
    color: #fa2337;
  }
  .trend-down {
    color: #0ab978;
  }
  .trend-plat {
    color: #646464;
  }

  .an-cell {
    padding: 0 $pdLR;
    margin-bottom: 0.8vw;
    font-size: 16px;
    font-weight: 400;
    color: #232323;
  }

  .an-time {
    font-size: 4.267vw;
    font-weight: 600;
    color: #646464;
    line-height: 5.867vw;

    > svg {
      margin-right: 2.667vw;
      transform: translateX(-50%);
    }
  }

  .an-main {
    border-left: 0.267vw solid #f0f0f0;
    padding: 1.867vw 0 7.2vw $pdLR;
    word-break: break-all;
  }

  .an-media {
    position: relative;
    margin-top: 2.933vw;

    img,
    video {
      display: block;
      max-width: 66.667vw;
      max-height: 66.667vw;
      // background: #d8d8d8;
      border-radius: 0.533vw;
      border: 0.267vw solid #f0f0f0;
    }

    .vdoPlay {
      position: relative;
      // video {
      //   pointer-events: auto;
      // }
      &.paused {
        &::before,
        &::after {
          content: "";
          display: block;
          position: absolute;
          pointer-events: none;
        }
        &::before {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }
        &::after {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0;
          height: 0;
          border-top: 3.333vw solid transparent;
          border-bottom: 3.333vw solid transparent;
          border-left: 5.067vw solid #fff;
          border-radius: 1.333vw;
        }
      }
    }

    .double {
      height: 34.667vw;
      margin-right: 2.4vw;
    }

    .triple {
      width: 32%;

      &:not(:last-of-type) {
        margin-right: 2%;
      }
    }

    > span {
      position: absolute;
      bottom: 1.333vw;
      right: 1.333vw;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 0.533vw;
      font-size: 16px;
      color: #fff;
      line-height: 4.533vw;
      padding: 0.533vw 1.867vw;
    }
  }

  .an-prod {
    background: #f5f5f5;
    border-radius: 0.533vw;
    margin-top: 2.133vw;
    padding: 1.333vw;
    min-height: 13.333vw;

    > img {
      width: 13.333vw;
      margin-right: 2.667vw;
    }

    > div {
      width: 75%;
      line-height: 4.533vw;
    }

    .ellipsis {
      margin-bottom: 1.333vw;
      font-size: 12px;
    }

    .font-price {
      font-size: 14px;
    }
  }
}

.preview {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: none;
  pointer-events: none;
  transition: background 0.2s ease-in;

  .swiper-container {
    margin-top: -200vh;
    transition: margin 0.3s ease-out;
  }

  .swiper-slide {
    height: 98vh;
  }

  img {
    display: block;
    width: 95vw;
    margin: auto 2.5vw;
  }

  .pv-dots {
    position: absolute;
    bottom: 8vh;
    right: -50vw;
    font-size: 18px;
    font-weight: 900;
    background: rgba(0, 0, 0, 0.2);
    color: #fff;
    padding: 1.067vw 2.667vw;
    border-radius: 0.8vw;
    transition: right 0.3s ease-in;
  }

  &.show {
    background: rgba(0, 0, 0, 0.78);
    pointer-events: all;

    .swiper-container {
      margin-top: 0;
    }

    .pv-dots {
      right: 6vw;
    }
  }
}
</style>