<template>
  <transition name="modal-slide">
    <div class="modal-slide" v-show="type>0" key="modal-slide">
      <div class="ms-panel" :class="type==5?'btm fix-btm':type?'ctr':''">
        <div class="ms-box" v-if="type==1||type==2||type==3">
          <!-- <div class="flex-end">
            <i class="ico-X" @click="handle('close')"></i>
          </div> -->
          <!-- <img class="ms-title" :src="`https://files.eyee.com/mcdn/img/auc/title${6+type}.png`" alt /> -->
          <template v-if="type==1">
            <img class="ms-title" v-lazy="'https://files.eyee.com/mcdn/img/auction/title_1.png'" alt />
            <div class="ms-sharehint" v-html="shareMsg" v-if="shareMsg"></div>
            <!-- <img class="ms-imghint" src="https://files.eyee.com/mcdn/img/auc/txt1.png" alt /> -->
          </template>
          <template v-else-if="type==2">
            <img class="ms-title" v-lazy="'https://files.eyee.com/mcdn/img/auction/title_2.png'" alt />
            <p class="flex-center font-price ms-cdcell">
              <span>{{cd.m.charAt(0)||0}}{{cd.m.charAt(1)||0}}</span>
              <i>：</i>
              <span>{{cd.s.charAt(0)||0}}{{cd.s.charAt(1)||0}}</span>
              <i>：</i>
              <span>{{cd.ms||0}}</span>
            </p>
            <p class="ms-txtsub time-txtsub" v-if="info.currentbid">
              <span>若无更高出价，将以</span>
              <span class="ms-midsub">¥{{info.currentbid}}</span>
              <span>成交</span>
            </p>
            <p class="ms-txtsub" v-else>即将结束，请尽快出价</p>
          </template>
          <template v-else-if="type==3">
            <img v-lazy="info.imageurl" class="ms-pro-img" alt />
            <img class="ms-title ms-pro-tit" v-lazy="'https://files.eyee.com/mcdn/img/auction/title_3.png'" alt />
            <div class="ms-prod">
              <div>
                <p class="price">¥<span>{{info.dealprice||0}}</span></p>
                <p>竞拍价</p>
              </div>
              <div class="market">
                <p class="price">¥<span>{{info.marketprice||0}}</span></p>
                <p>参考价</p>
              </div>
            </div>
            <p class="ms-txtsub">{{info.remark}}</p>
          </template>
          <div class="ms-foot">
            <span @click="handle('close')">取消</span>
            <span class="submit" @click="handle(type)">{{type==3?'立即付款':type==2?'立即出价':'分享得红包'}}</span>
          </div>
        </div>
        <div class="ms-redpacket" v-else-if="type==4">
          <img v-lazy="'https://files.eyee.com/mcdn/img/auc/red_pack.png'" alt />
          <i class="ico-X" @click="handle('close')"></i>
          <div class="msr-info">
            <img v-lazy="'https://files.eyee.com/mcdn/img/auc/txt11.png'" alt />
            <p class="msr-price">
              <span>¥</span>
              <span class="font-price">{{info.redpacket}}</span>
            </p>
            <p class="ms-txtsub">已为你放入“斗牛-我的卡券”，竞拍成功直接可抵扣</p>
          </div>
          <div class="ms-btn-share" @click="handle('doShare')">继续分享好友</div>
        </div>
        <div class="ms-share" v-else-if="type==5">
          <!-- <div class="flex-end">
            <i class="ico-X" @click="handle('close')"></i>
          </div> -->
          <div class="ms-head" @click="handle('close')"></div>
          <img class="ms-title" v-lazy="'https://files.eyee.com/mcdn/img/auction/envelope_title.png'" alt />
          <div class="ms-redbag-info">
            <router-link to="/buyerSellKnow?type=21" tag="p" class="ms-96 rule">
              <span>红包规则</span>
              <i class="more-arrow"></i>
            </router-link>
            <div class="ms-midhint" v-html="shareMsg" v-if="shareMsg"></div>
          </div>
          <!-- <div class="flex-center ms-midimg">
            <img src="https://files.eyee.com/mcdn/img/auc/ears.png" alt />
            <img src="https://files.eyee.com/mcdn/img/auc/txt1.png" alt />
            <img src="https://files.eyee.com/mcdn/img/auc/ears.png" alt />
          </div>-->
          <div class="ms-btn ms-btn-red" @click="handle('makeCard')">生成分享海报</div>
          <div class="ms-btn ms-btn-plain" @click="handle('doShare')">分享微信好友</div>

          <div class="ms-card" id="msPoster">
            <div class="flex-aic msc-title">
              <img :src="info.avatar" alt />
              <div>
                <p class="name">{{info.nickname}}</p>
                <p>{{info.title}}</p>
              </div>
            </div>
            <div class="msc-cont">
              <img
                v-if="info.posterimage"
                id="msPosterImg"
                class="msc-img"
                :src="info.posterimage"
                alt
              />
              <div class="msc-price">
                <p class="msc-price-left"><span>¥<em>&nbsp;{{info.initbid}}</em></span>起拍</p>
                <p class="msc-del" v-if="info.subprice>0">市场价&nbsp;<span>¥{{info.subprice}}</span></p>
              </div>
              <div class="msc-foot">
                <div class="msc-info">
                  <p :class="{'ms-96':info.isProd}">{{info.content}}</p>
                  <p class="look">{{info.onlookers}}人正在围观</p>
                  <p>{{info.slogan}}</p>
                </div>
                <div class="msc-qr">
                  <div class="qr-mod" v-if="info.qrcodeurl"><img :src="$zip(info.qrcodeurl,3)" alt /></div>
                  <p class="ms-96">识别图片 参与竞拍</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { html2canvas } from "@/utils/html2canvas.js";
import { Upload } from "@/common/api/user";

let _loader;
export default {
  name: "AuctionModal",
  data() {
    return {
      callShareThrottling: true // 防止分享生成卡片连续点击
    };
  },
  props: {
    type: Number, // 0 不显示，1 出价成功，2 截拍倒计时，3 竞拍成功，4 红包，5 分享
    cd: Object,
    info: Object
  },
  computed: {
    shareMsg() {
      let { redpacket, needinvations, remaininvations, min, max, isused } =
          this.info || {},
        txt = "",
        sub = "";
      // console.log("this.info ", this.info);
      // if (isused) txt = "";
      // else
      if (redpacket > 0)
        txt = `<p>已领<span class="ms-midsub">&nbsp;¥${redpacket}&nbsp;</span>红包</p><p>下单可直接抵扣</p>`;
      else {
        sub =
          min === 0 && max === 0
            ? ""
            : `<span class="ms-midsub">&nbsp;${min}~${max}元&nbsp;</span>`;
        txt = `<p>${
          needinvations == remaininvations ? "" : "再"
        }分享<span class="ms-midsub">&nbsp;${remaininvations}&nbsp;</span>好友围观即可领</p><p>${sub}随机红包<em>红包规则></em>`;
      }
      return txt;
    }
  },
  methods: {
    handle(action) {
      let _ = this;
      console.log("modal handle: ", action);
      action += "";
      switch (action) {
        case "1":
          action = "doShare";
          break;
        case "2":
          action = "callBid";
          break;
        case "3":
          action = "callCheck";
          break;
        case "makeCard":
          if (_.callShareThrottling) {
            _.callShareThrottling = false;
            // $log({
            //   e: "click_ag_doshare",
            //   p: {
            //     // 0 出价成功后，1 红包弹框，2 面板分享好友，3 面板海报
            //     type: 3,
            //     auctionid: _.info.auctionid || "",
            //     agid: _.info.agid || ""
            //   }
            // });
            _.draw();
          }

          return;
      }
      _.$emit("close", action, _.type);
    },
    draw() {
      let _ = this,
        drawed = false,
        $poster = document.getElementById("msPosterImg");

      _loader = _.$loader("生成海报中···");

      const doDraw = () => {
        let $layer = document.getElementById("msPoster");
        html2canvas($layer, {
          scale: _.$route.query.s || 2,
          useCORS: true
        }).then(canvas => {
          let dataUrl = canvas.toDataURL("image/jpg");
          // let dataUrl = canvas.toDataURL("image/png");
          // console.log("dataUrl=======", dataUrl);

          // document.write(`<img style='width:100%' src='${dataUrl}'>`);
          _loader.close();
          drawed = true;
          _.uploadImg(dataUrl);
        });
      };

      // 主图加载完再画
      if ($poster)
        $poster.onload = () => {
          doDraw();
        };

      // 加延迟再执行一次 防止主图加载崩
      setTimeout(() => {
        if (!drawed) doDraw();
      }, 1500);
    },
    uploadImg(data) {
      let _ = this;
      _loader = _.$loader("分享图片上传中···");
      Upload({ stream: data.split(",")[1] })
        .then(res => {
          console.log("Upload res: ", res);
          _.callShareThrottling = true;
          if (res && res.url) {
            _loader = _.$loader("正在调起分享···");
            _.javascriptBridge({
              name: "callAppDirectlyShare",
              params: {
                sharepicurl: res.url,
                type: 1, // 1：是分享图片，2：是分享H5链接",
                platform: 1, // 1：是分享到朋友圈，2：是分享给微信好友"
                callbackname: "_shareCallBack"
              }
            });
            setTimeout(() => {
              _loader.close();
            }, 3000);
          } else _.toast("分享图片上传失败~");
        })
        .catch(e => {
          console.error("Upload error: ", e);
          _.toast("分享图片上传失败~");
          _.callShareThrottling = true;
        });
    }
  }
};
</script>
<style lang="scss">
.ms-redbag-info {
  position: relative;
  .ms-96 {
    font-size: 3.467vw;
    color: #969696;
  }
  .rule {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    right: 19vw;
    z-index: 20;
  }
}
.modal-slide {
  $red: #fa2337;
  z-index: 16;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  font-weight: 600;
  color: #fff;

  .ms-panel {
    position: absolute;
    width: 100%;
    left: 0;
    text-align: center;

    .ms-head::after {
      position: absolute;
      content: '';
      padding-top: 100vw;
      width: 100%;
      top: -100vw;
      left: 0;
    }
    img {
      // display: initial;
      display: inline-block;
      width: auto;
      // width: 38.133vw;
    }
  }
  .btm {
    bottom: 0;
    background: #282828;
    border-radius: 4.8vw 4.8vw 0 0;
  }
  .ctr {
    top: 46%;
    transform: translateY(-50%);
  }
  .ico-X {
    width: 25px;
    height: 25px;
  }
  .ms-head {
    margin: 0 auto 7.2vw;
    width: 10.666vw;
    height: 1.6vw;
    border-radius: 0.8vw;
    background-color: #505050;
  }
  .ms-title {
    height: 6.4vw;
  }

  .ms-box {
    width: 76vw;
    margin-left: 12vw;
    padding-top: 6.933vw;
    background: #3C3C3C;
    border-radius: 4.8vw;
    overflow: hidden;

    .ico-X {
      margin-top: -2.933vw;
      margin-right: -2.667vw;
    }

    .ms-btn {
      margin-top: 3.2vw;
    }
  }

  .ms-sharehint {
    font-size: 4vw;
    color: #C8C8C8;
    line-height: 5.867vw;
    padding: 3.5vw 4vw 0;
    p {
      padding-top: 0.533vw;
    }
  }

  .ms-foot {
    display: flex;
    margin-top: 5.333vw;
    background-color: #373737;
    border-top: 1px solid #323232;
    align-items: center;

    span {
      display: block;
      line-height: 16vw;
      width: 50%;
      text-align: center;
      color: #fff;
      font-size: 4.266vw;
      color: #C8C8C8;
    }
    .submit {
      color: #fff;
      border-left: 1px solid #323232;;
    }
  }
  .ms-midsub {
    color: #C8AF6E;
  }
  .ms-imghint {
    width: 82%;
  }
  .ms-cdcell {
    font-size: 6.933vw;
    margin: 6vw 0 4vw;

    i {
      width: 9.333vw;
      font-size: 8vw;
      font-weight: bold;
      transform: translate(18.1%, -10%);
    }

    span {
      color: #505050;
      width: 12.267vw;
      line-height: 12.267vw;
      border-radius: 2.133vw;
      background-color: #fff;
      position: relative;
      overflow: hidden;

      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        // background: rgba(0, 0, 0, 0.23);
        background: linear-gradient(180deg, #1e130d 0%, #21100f 100%);
        opacity: 0.23;
      }

      &:last-of-type {
        width: 9.066vw;
        background: #C8AF6E;

        &::after {
          // background: rgba(255, 255, 255, 0.23);
          background: linear-gradient(180deg, #3c3c3c 0%, #fff 100%);
        }
      }
    }
  }
  .ms-txtsub {
    color: #C8C8C8;
    font-size: 3.467vw;
  }
  .ms-txtsub {
    color: #969696;
    font-weight: normal;
  }
  .ms-pro-img {
    width: 21.333vw;
    height: 21.333vw;
    display: block;
    position: absolute;
    left: 50%;
    top: -10%;
    transform: translate(-50%, 0);
    background-color: #fff;
    border-radius: 3.2vw;
    border: 1.066vw solid #505050;
  }
  .ms-pro-tit {
    margin-top: 14vw;
  }
  .ms-prod {
    display: flex;
    padding: 0 5.333vw;
    margin: 4vw 0 5.333vw;
    height: 16vw;
    font-size: 12px;
    &>div {
      width: 50%;
    }
    .price {
      font-family: "OswaldBold";
      margin-bottom: 1.6vw;
      span {
        font-size: 4.8vw;
      }
    }
    .market {
      color: #969696;
      border-left: 1px solid #323232;
    }
  }

  .ms-redpacket {
    min-height: 53.333vw;
    margin: 0 3.2vw;
    position: relative;

    .ico-X {
      position: absolute;
      top: -2.133vw;
      right: 6.133vw;
      width: 8vw;
      height: 8vw;
      color: #adadad;
      border: 2px solid;
      border-radius: 50%;
    }
  }

  .msr-info {
    position: absolute;
    width: 76%;
    left: 12%;
    bottom: 35%;

    img {
      width: 60%;
      margin-bottom: 1.333vw;
    }
    .ms-txtsub {
      margin: 4.267vw 5.333vw;
      text-align: left;
      font-weight: 400;
    }
  }
  .msr-price {
    font-size: 5.867vw;
    font-weight: 600;
    color: $red;
    // line-height:8vw;
    .font-price {
      font-size: 13.333vw;
    }
  }
  .ms-btn-share {
    position: absolute;
    width: 70%;
    left: 15%;
    bottom: 21%;
    font-size: 3.733vw;
    font-weight: 600;
    color: #b23905;
    line-height: 11.733vw;
    background: linear-gradient(
      180deg,
      #fcf2d0 0%,
      #fff4cf 15%,
      #f9e7ad 55%,
      #f6e098 100%
    );
    box-shadow: 0 0.533vw 2.4vw 0 #bc1b1c;
    border-radius: 5.867vw;
  }

  .ms-share {
    position: relative;
    padding: 3.466vw 4vw 2.667vw;
    .ms-title {
      height: 11.2vw;
      margin-bottom: 5vw;
    }

    .ico-lg {
      width: 2.133vw;
      height: 2.133vw;
    }
    .ms-midhint {
      margin-bottom: 8.533vw;
      color: #C8C8C8;
      font-size: 4.266vw;
      em {
        visibility: hidden;
      }
    }
    .ms-btn {
      margin-top: 2.667vw;
    }
  }

  .ms-card {
    position: fixed;
    top: -200vh;
    left: 0;
    right: 0;
    height: 100vh;
    padding: 6.666vw 5.4vw;
    background: #191919;
    color: #969696;
    font-size: 3.2vw;
    font-weight: 600;
    text-align: left;
    overflow: hidden;

    > img {
      display: block;
      margin: 4vw 0;
      background: #d1cbcb;
      border-radius: 1.067vw;
    }
  }
  .msc-title {
    padding: 0 2.666vw;
    &>div {
      padding-left: 2.133vw;
    }
    img {
      width: 10.666vw;
      height: 10.666vw;
      border-radius: 50%;
    }
    .name {
      font-size: 3.733vw;
      color: #fff;
    }
  }
  .msc-cont {
    margin-top: 4vw;
    background-color: #282828;
    border-radius: 4.8vw;
    padding: 3.2vw 3.2vw 6.666vw 3.2vw;
  }
  .msc-img {
    border-radius: 4.8vw;
    display: block!important;
  }
  .msc-price {
    padding: 0 2.133vw;
    margin-top: 2.666vw;
    display: flex;
    height: 16.266vw;
    align-items: flex-end;
    font-size: 3.466vw;

    .msc-price-left {
      flex: 1;

      span {
        display: inline-block;
        font-family: "OswaldBold";
        color: #C8AF6E;
        // background: linear-gradient(180deg,#f5e6aa, #876e37);
        // -webkit-background-clip: text; 
        // -webkit-text-fill-color: transparent; 
        margin-right: 1.6vw;
      }
      em {
        font-size: 10.133vw;
      }
    }
    
    .msc-del {
      display: flex;
      padding-bottom: 1.3vw;
      span {
        font-family: "OswaldBold";
        text-decoration: line-through;
      }
    }
  }
  .msc-foot {
    display: flex;
    margin-top: 4vw;
    padding: 0 2.133vw;
  }
  .msc-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    flex: 1;
    .look {
      margin: 2.4vw 0 3.2vw;
    }
    .ms-96 {
      height: 9.6vw;
      overflow: hidden;
      margin: 0;
    }
    p {
      width: 100%;

      &:not(.ms-96) {
        font-size: 3.7333vw;
        color: #fff;
      }
      &:last-of-type {
        position: relative;
        width: 46.4vw;
        color: #2C2C2C;
        background: linear-gradient(137deg,#bfa963 2%, #ae914f 109%);
        text-align: center;
        font-size: 3.2vw;
        height: 7.2vw;
        line-height: 7vw;
        border-radius: 26.666vw;
        font-weight: 600;
        // &::after {
        //   content: "";
        //   position: absolute;
        //   right: 0;
        //   bottom: 0;
        //   width: 0;
        //   height: 0;
        //   transform: translate(98%);
        //   border-bottom: 2.4vw solid $red;
        //   border-right: 2.4vw solid transparent;
        // }
      }
    }
  }
  .msc-qr {
    display: flex;
    flex-direction: column;
    align-items: center;
    .qr-mod {
      display: inline-block;
      background-color: #fff;
      border-radius: 100%;
      width: 24vw;
      height: 24vw;
    }
    p {
      margin-top: 2.4vw;
      font-size: 3.2vw;
      white-space: nowrap;
      transform: scale(0.8);
    }
  }

  .ms-btn {
    width: 92vw;
    line-height: 12.266vw;
    border-radius: 6.133vw;
    text-align: center;
    border: 0.266vw solid #282828;
  }
  .ms-btn-red {
    background: linear-gradient(180deg,#f5e6aa, #876e37);
    color: #000;
  }
  .ms-btn-plain {
    border: 0.266vw solid #c8af6e;
    color: #C8AF6E;
  }
  .more-arrow {
    display: block;
    width: 3.2vw;
    height: 3.2vw;
    background: url("//files.eyee.com/mcdn/img/auction/icon_more.png") 0 0 no-repeat;
    background-size: cover;
  }
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: background 0.3s ease-in;
  & > div {
    transition: top 0.2s ease-out, bottom 0.2s ease-out;
  }
}
.modal-slide-enter,
.modal-slide-leave-to {
  background: transparent;

  & > .btm {
    bottom: -100vh;
  }
  & > .ctr {
    top: -100vh;
  }
}
</style>