<template>
  <div>
    <div class="login_mask" @touchmove.prevent v-if="isshowType">
      <!-- 中奖 -->
      <div class="win" v-if="upType == 1">
        <div class="wining-popup">
          <div class="winning-close" @click="closePopUp">
            关闭
            <span>{{ time }}</span>
          </div>
          <div class="winning-text">
            <p>恭喜“ {{ parentData.nickname }} ”刮中大奖</p>
            <span>还剩{{ parentData.remainwinningnum }}张可中刮刮乐</span>
          </div>
          <div class="wining-cap">
            <img
              src="https://files.eyee.com/activity/ggl/cap.png"
              alt=""
              class="wining-cap-img"
            />
            <p>斗牛刮刮乐</p>
            <span>每天10个单品免费送</span>
            <div class="win-shose flex-center">
              <img :src="parentData.productimageurl" />
            </div>
          </div>

          <div class="winning-message">
            <p class="winning-code">{{ parentData.code }}</p>
            <div class="message flex-aic">
              <img :src="parentData.userimageurl" />
              <p>{{ parentData.nickname }}{{ parentData.winningtime }}</p>
            </div>
          </div>
        </div>
        <!-- <div class="wining-bottom" @click="ticketShare">
          <p>恭喜TA 继续刮</p>
        </div> -->
      </div>
      <!-- 红包 -->
      <div class="win" v-if="upType == 3">
        <div class="red-packet flex-center">
          <div class="close-img flex-end" @click="closePopUp">
            <img src="https://files.eyee.com/activity/ggl/closeicon.png" />
          </div>
          <p class="money">{{ lotterInfo.money || luckMoney }}元</p>
          <div class="red-packet-text">
            <p>斗牛刮刮乐</p>
            <p>每天10个单品免费送</p>
          </div>
          <p class="remind-text">红包已发放至您的账号中</p>
          <div class="red-btn" @click="goShopping">去使用红包</div>
          <div class="yellow-btn" @click="ticketShare">得更多刮刮乐</div>
          <div class="remind-ruls">
            <p>一位好友参与刮奖=再得一个抽奖码</p>
            <p>新用户参与并下载注册=额外再得3个抽奖码</p>
          </div>
        </div>
      </div>
      <!-- 获得刮刮乐 -->
      <div class="win" v-if="upType == 4">
        <div class="close-red-packet flex-center">
          <div class="closebtn-img" @click="closePopUp">
            <img src="https://files.eyee.com/activity/ggl/closeicon.png" />
          </div>
          <div class="packket-top-text">
            <p>人品大爆发！</p>
            <span>您有好友赞助的未刮开的刮刮乐</span>
          </div>
          <p class="ticket-num">{{ parentData.helpRemainCount || 3 }}</p>
        </div>
        <div class="tombola-btn" @click="goSwitchType">去刮奖</div>
      </div>

      <!-- 刮刮乐 -->
      <div class="win" v-if="upType == 2">
        <!-- <div class="nolatombola"></div> -->
        <div class="my_code good_firend cardCanvas flex-center" ref="my_code">
          <canvas
            id="cardCanvas"
            class="flex-center cardCanvasStyle"
            :width="Width"
            :height="150"
          ></canvas>
          <div v-if="isShowCan" class="canModel" @click="ticketShare"></div>
        </div>
        <div class="latombola flex-center">
          <div class="closebtn-img" v-if="!latombola" @click="closePopUp">
            <img src="https://files.eyee.com/activity/ggl/closeicon.png" />
          </div>
          <div class="latombola-top-text" @click="closePopUp" v-if="iconShow">
            <!-- <img  class="greet" src="https://files.eyee.com/activity/ggl/greet.png"> -->
            <p class="one-more-time">{{ randMsg() }}</p>
            <span>很遗憾本次未刮中！</span>
            <span>{{ lotterInfo.code }}</span>
            <div class="latombola-btn" @click="ticketShare">得更多刮刮乐</div>
            <p>邀请一位好友参与≈3张刮刮乐</p>
          </div>
          <div
            class="latombola-top-text"
            @click="closePopUp"
            v-else-if="losingLottery"
          >
            <span>恭喜你~~~</span>
          </div>
          <div class="latombola-top-text" v-else>
            <span>再刮刮，马上出结果啦~</span>
          </div>
        </div>
      </div>
      <!-- APP分享 -->
      <div class="win" v-if="upType == 5">
        <div class="bottom-share">
          <p>邀请一位好友参与≈3张刮刮乐</p>
          <div class="wechat" @click="draw">
            <img
              class="wechat-img"
              src="https://files.eyee.com/activity/ggl/Circleoffriends.png"
            />
            <p>分享到朋友圈</p>
            <div class="promptwechat">
              &nbsp;&nbsp;&nbsp;&nbsp; 中奖率提升10倍
            </div>
            <img
              class="arrowicon-img"
              src="https://files.eyee.com/activity/ggl/arrowicon.png"
            />
          </div>
          <div class="wechat" @click="shareToFriend">
            <img
              class="wechat-img"
              src="https://files.eyee.com/activity/ggl/wechat.png"
            />
            <p>分享给微信好友</p>
            <img
              style="margin-left: 44vw"
              class="arrowicon-img"
              src="https://files.eyee.com/activity/ggl/arrowicon.png"
            />
          </div>
          <div class="link"></div>
          <p @click="closePopUp">取消</p>
        </div>
      </div>
      <!-- H5分享 -->
      <div class="win" v-if="upType == 6" @click="goShare">
        <img
          class="handshare"
          src="https://files.eyee.com/activity/ggl/handshare.png"
        />
        <div class="h5text">
          <p>点击上面分享</p>
          <span>邀请一位好友参与≈3张刮刮乐</span>
        </div>
      </div>
    </div>
    <!-- 海报 -->
    <div class="flex-col flex-center draw-layer" id="poster">
      <div class="dl-sec dl-main">
        <img
          src="https://files.eyee.com/activity/ggl/posterbg2.png"
          class="dl-main-bg"
        />
        <div>
          <img
            class="dl-lid"
            src="https://files.eyee.com/activity/ggl/postercap.png"
          />
          <div class="flex-ctr-end dl-shoe">
            <img :src="wxShareInfo.imageurl" id="posterProd" />
          </div>
          <p class="ellipsis dl-name">{{ wxShareInfo.productname }}</p>
        </div>
      </div>
      <div class="dl-sec dl-btm">
        <img src="https://files.eyee.com/activity/ggl/figure.png" />
        <div class="flex-aic">
          <div class="dl-qrcode">
            <canvas id="codeShow"></canvas>
          </div>
          <div class="dl-tips">
            <p>每天2场：14-16点；20-22点 准时开放</p>
            <p>第一个刮开的100%中奖！记得调好闹钟哦～</p>
            <img
              src="https://files.eyee.com/activity/ggl/donewlogo.png"
              alt=""
            />
          </div>
          <!-- <img class="dl-tips" src="https://files.eyee.com/activity/ggl/bottomtext.png"> -->
        </div>
      </div>
      <!-- <div class="posterbg flex-center">
        <img class="posterbg2" src="https://files.eyee.com/activity/ggl/posterbg2.png">
        <img class="postershare" src="https://files.eyee.com/activity/ggl/postercap.png">
        <img class="postershose" :src="wxShareInfo.imageurl">
        <p>{{wxShareInfo.productname}}</p>
      </div>
      <img class="figure" src="https://files.eyee.com/activity/ggl/figure.png">
      <div class="qr-code">
        <canvas id="codeShow"></canvas>
      </div>

      <img class="bottomtext" src="https://files.eyee.com/activity/ggl/bottomtext.png">-->
    </div>
    <div class="draw-layer-cover"></div>
    <div id="code" style="display: none"></div>
  </div>
</template>
<script>
import { addchance } from "@/utils/api/activities";
import { setTimeout, clearTimeout } from "timers";
import { Indicator } from "mint-ui";
import { mapGetters } from "vuex";
import { Upload } from "@/common/api/user";
import {
  GetPosterUrl,
  SetPosterUrl,
  // SetShareStatus,
  updateisopen,
  shareproductinfo,
  shareforhelp,
} from "@/utils/api/activities";
import { html2canvas } from "@/utils/html2canvas.js";
// import QRCode from "qrcodejs2";

const _wx_auth_key = "WECHAT_AUTH_USER",
  msgs = [
    "换个姿势，再刮一次！",
    "1234，再来一次！",
    "以前有个人天天玩刮刮乐，后来他中奖惹！",
    "刮奖姿势不对，喊你妈妈一起来！",
    "刮奖姿势不对，喊你大舅一起来！",
    "刮奖姿势不对，喊你爸爸一起来！",
    "刮奖姿势不对，喊你二姨一起来！",
    "刮奖姿势不对，喊你大姨一起来！",
    "刮奖姿势不对，喊你三姑一起来！",
    "刮奖姿势不对，喊你旁边人的一起来！",
    "分享3个以上好友，中奖概率更高！",
    "听说换左手刮，中奖概率更高！",
    "听说分享给闺蜜，中奖概率更高！",
    "听说分享给哥们，中奖概率更高！",
    "听说刮奖10次以上，中奖概率更高！",
    "助攻的Buff越多，中奖的概率越高！",
    "老铁，别放弃！",
    "哥们，你不该就这么放弃的！",
    "不要半途而废嘛，再刮一次试试？",
    "梦里寻鞋千百次，刮不出来我不服！",
    "你这手气，是太久没有买鞋了吧？",
    "看你刮那么用力还没有中奖，心疼你！",
    "想中奖嘛？安利给伙伴斗牛APP试试！",
    "刮奖之前要不要先买双Air Jordan？",
    "如果你一直用斗牛APP，这双鞋迟早会是你的！",
  ];

export default {
  data() {
    return {
      lotterInfo: {}, // 刮奖后中奖信息
      wxShareInfo: {}, //微信分享的商品信息--卡片
      upType: null,
      latombola: false,
      time: 10,
      Width: "",
      clearTimer: null,
      disPlay: true,
      posterUrl: "",
      totalprice: 0,
      doDraw: false,
      authUser: {},
      isShowCan: false,
      iconShow: false, // 默认未中奖背景图
      losingLottery: false, // 默认 中奖背景图
    };
  },
  props: {
    modelType: { type: Number, default: 0 },
    isshowType: { type: Boolean, default: false },
    modelData: { type: Object },
    activityid: { type: String },
    codeid: { type: String, default: "" },
    luckMoney: { type: Number, default: 0 },
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    parentData() {
      return this.modelData;
    },
  },
  mounted() {
    let _ = this;
    _.dealType();
    window._shareCallBack = function (res, via) {
      // _.toast("回调的参数值" + JSON.stringify(res));
      Indicator.close();
      // if (res == 1) _.goShare(); // 201902021526 放在 分享调起的地方调用
    };
  },
  methods: {
    randMsg() {
      let rand = Math.floor(Math.random() * msgs.length);
      return msgs[rand];
    },
    dealType() {
      let _ = this;
      _.upType = _.modelType;

      _.authUser = JSON.parse(localStorage.getItem(_wx_auth_key) || "{}");
      console.log("父组件传值", _.modelData);
      if (_.upType == 1) {
        _.time = 10;
        _.timeCount();
      }
      if (_.upType == 2) {
        if (_.$refs.my_code) _.Width = _.$refs.my_code.offsetWidth * 0.9;

        setTimeout(() => {
          _.preToggle();
        }, 200);
      } else if (_.upType == 5) {
        let qrJs = document.getElementById("_qrcodeJs");
        if (qrJs) _.madeCode();
        else
          document.getElementById("_qrcodeJs").onload = () => {
            _.madeCode();
          };
      }
    },
    madeCode() {
      let _ = this;
      let params = {
        activityid: _.activityid || "",
        uid: _.user.uid || "",
        unionid: _.authUser && _.authUser.unionid ? _.authUser.unionid : "",
      };
      shareproductinfo(params)
        // shareproductinfo({ activityid: "54ee769f2fa04cecb516213bf95396e0",uid:_.user.uid,unionid:"oQrXDvjI2VwAfNs4zuQ-WmOzMX40" })
        .then((res) => {
          if (res) {
            _.wxShareInfo = res;
            console.log("中奖信息", _.wxShareInfo);

            let { width, height } = document
              .querySelector(".dl-qrcode")
              .getBoundingClientRect();
            width = Math.floor(width) - 20;
            height = Math.floor(height) - 20;

            let qrcode = new QRCode("code", {
              width,
              height, // 高度
              // style:'display:block',
              text: res.shareurl, // 二维码内容
              image: "",
              // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
              // background: '#f0f'
              // foreground: '#ff0'
            });
            document.querySelector("#code img").onload = function () {
              console.log("made qrcode: ", this.src);
              const $canvas = document.getElementById("codeShow");
              $canvas.width = width;
              $canvas.height = height;
              let ctx = $canvas.getContext("2d");
              ctx.drawImage(this, 0, 0, width, height);
            };
          }
        })
        .catch((e) => {
          console.error("shareproductinfo error: ", e);
        });
    },
    timeCount() {
      let _ = this;
      _.time--;
      _.clearTimer = setTimeout(() => {
        if (_.time >= 1) {
          _.timeCount();
        } else {
          clearTimeout(_.clearTimer);
          _.closePopUp();
        }
      }, 1000);
    },
    ticketShare() {
      let _ = this;
      if (_.$root.ISAPP) {
        _.upType = 5;
        _.isshowType = true;
        let qrJs = document.getElementById("_qrcodeJs");
        if (qrJs) _.madeCode();
        else
          document.getElementById("_qrcodeJs").onload = () => {
            _.madeCode();
          };
      } else {
        _.upType = 6;
        _.isshowType = true;
      }
    },
    closePopUp() {
      this.$emit("close", "close");
      this.isShowCan = false;
      this.iconShow = false; // 默认未中奖背景图
      this.losingLottery = false; // 默认 中奖背景图
    },
    goShare() {
      let _ = this,
        authUser = _.authUser,
        params = {};

      if (authUser) {
        params = {
          uid: (_.user && _.user.uid) || "",
          unionid: (authUser && authUser.unionid) || "", //Y
          activityid: _.activityid,
          nickname: authUser.nickname || "", //Y
          image: authUser.headimgurl || "", //Y
          helpunionid: "",
          helpnickname: "",
          helpuserimage: "",
          type: 2, //Y
        };
      }

      addchance(params)
        .then((res) => {
          _.closePopUp();
        })
        .catch((e) => {
          console.log(e);
          _.closePopUp();
          if (e) _.toast(e.msg);
        });
    },
    goShopping() {
      let _ = this;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppMallCenterPage",
          params: { type: -1 },
        });
      } else {
        _.toast(
          "请前往斗牛APP刮卡，新人使用微信授权登录，再得3张刮刮乐，还可拿520元新人大礼包~"
        );
        _.openAppClient();
      }
    },
    goSwitchType() {
      let _ = this;
      if (_.$root.ISAPP) {
        _.upType = 2;
        setTimeout(() => {
          _.preToggle();
        }, 200);
      } else {
        _.toast(
          "请前往斗牛APP刮卡，新人使用微信授权登录，再得3张刮刮乐，还可拿520元新人大礼包~"
        );
        _.openAppClient();
      }
    },
    // 刮刮乐图层
    preToggle(e) {
      let _ = this;
      const c = window.document.getElementById("cardCanvas");
       if (!c) return;
      const ctx = c.getContext("2d");

      let cW = c.clientWidth,
        cH = c.clientHeight;

      // c.width = 200; //画布宽
      // c.height = 100; //画布高

      // ctx.beginPath(); //画布的第一层
      // ctx.fillStyle = "#E2E2E2";
      // ctx.fillRect(0, 0, c.width, c.height);
      // ctx.closePath();
      // //画布的第二层
      // ctx.font = "bold 20px Microsoft Yahei";
      // ctx.textAlign = "left";
      // ctx.fillStyle = "#A01914";
      // ctx.fillText("刮TA有惊喜", (cW - 100) / 2, (cH - 20) / 2 + 10);

      let coverImg = new Image();
      coverImg.src = "/static/imgs/acts/guajiangBg.png";
      coverImg.onload = function () {
        ctx.drawImage(coverImg, 0, 0, cW, cH);

        ctx.globalCompositeOperation = "destination-out"; //新图像和原图像重合部分变透明
      };

      c.addEventListener("touchstart", _.start, false);
      c.addEventListener(
        "touchend",
        function () {
          _.clearC();
          document.body.classList.remove("lock");
        },
        false
      );
      // // 触摸事件结束
      // c.addEventListener("touchend", _.clearC, false);
      // // 触摸事件 移出元素
      // c.addEventListener("touchleave", _.clearC, false);
      // // 触摸事件 取消
      // c.addEventListener("touchcancel", _.clearC, false);

      _.isShowCan = false;
      _.iconShow = false;
      _.losingLottery = false;
    },
    update() {
      // 获取刮奖结果
      let _ = this,
        activityid = _.activityid || "";

      const c = window.document.getElementById("cardCanvas");
       if (!c) return;
      const ctx = c.getContext("2d");
      updateisopen({
        activityid,
        codeid: _.codeid || "",
        uid: _.user.uid || "",
        unionid: (_.authUser && _.authUser.unionid) || "",
      })
        .then((res) => {
          if (res) {
            this.lotterInfo = res;
            if (res.money) {
              this.iconShow = false;
              this.losingLottery = true;
            } else {
              this.iconShow = true;
              this.losingLottery = false;
            }
            if (this.losingLottery) this.upType = 3;
          }
        })
        .catch((e) => {
          if (e) _.toast(e.msg);
          // _.clearC();
          document.body.classList.remove("lock");
          ctx.clearRect(0, 0, c.width, c.height);

          this.iconShow = true;
          this.losingLottery = false;
        });
    },
    start(e) {
      let _ = this;
      const c = window.document.getElementById("cardCanvas");
       if (!c) return;
      const ctx = c.getContext("2d");
      // const c = window.document.getElementById("cardCanvas");
      let { left: x, top: y } = c.getBoundingClientRect();

      // const ctx = c.getContext("2d");
      var e = e || window.event;
      var mX = e.touches[0].clientX - x;
      var mY = e.touches[0].clientY - y;
      // console.log(
      //   "touchstart",
      //   c.getBoundingClientRect(),
      //   e.touches[0].clientX,
      //   c.offsetLeft,
      //   "Y",
      //   e.touches[0].clientY,
      //   c.offsetTop
      // );
      ctx.moveTo(mX, mY);
      c.addEventListener("touchmove", _.gmove, false);
    },
    gmove(e) {
      //刮卡函数
      document.body.classList.add("lock");
      const c = window.document.getElementById("cardCanvas");
       if (!c) return;
      const ctx = c.getContext("2d");
      let { left: x, top: y } = c.getBoundingClientRect();
      if (typeof e.touches != "undefined") {
        e = e.touches[0];
      }
      var mx = e.clientX - x;
      var my = e.clientY - y;
      ctx.strokeStyle = "white";
      ctx.lineCap = "round"; //绘制的线结束时为圆形
      ctx.lineJoin = "round"; //当两条线交汇时创建圆形边角
      ctx.lineWidth = 20;
      ctx.lineTo(mx, my);
      ctx.stroke();
      //  alert(mx)
    },
    clearC() {
      //刮开一定面积执行擦除画布函数

      let _ = this;

      document.body.classList.remove("lock");
      const c = window.document.getElementById("cardCanvas");
      if (!c) return;
      const ctx = c.getContext("2d");
      var data = ctx.getImageData(0, 0, c.width, c.height).data;
      for (var i = 0, j = 0; i < data.length; i += 4) {
        //data.length=c.width*c.heigth*4,一个像素块是一个对象RGBA四个值,A范围为0~255
        if (data[i] && data[i + 1] && data[i + 2] && data[i + 3]) {
          //存在imageData对象时j加1  PS:该像素区域透明即为不存在该对象
          j++;
        }
      }

      // j 为未刮开区域
      if (j <= c.width * c.height * 0.85) {
        //超过canvas面积的20%，就清除画布
        ctx.clearRect(0, 0, c.width, c.height);
        // _.iconShow = true;
        _.isShowCan = true;
        // setTimeout(() => {
        _.update();
        // }, 500);
      }
    },
    // 生成图片
    draw(upload) {
      let _ = this,
        $prod = document.getElementById("posterProd");
      var drawed = false;
      _.loading("生成海报中···");
      if (!_.$root.isdebug)
        window.gio("track", "ShareToWeChatCircle", "h5分享到朋友圈");
      const doDraw = () => {
        let $layer = document.getElementById("poster");
        html2canvas($layer, { useCORS: true }).then((canvas) => {
          let dataUrl = canvas.toDataURL("image/jpeg");
          // console.log("dataUrl=======", dataUrl);

          // _.loading();
          drawed = true;

          _.uploadImg(dataUrl);
        });
      };

      // 主图加载完再画
      $prod.onload = () => {
        doDraw();
      };

      // 加延迟再执行一次 防止主图加载崩
      setTimeout(() => {
        if (!drawed) doDraw();
      }, 1500);
    },
    uploadImg(data) {
      let _ = this;
      _.loading("海报上传中···");
      Upload({ stream: data.split(",")[1] })
        .then((res) => {
          console.log("Upload res: ", res);
          if (res && res.url) {
            _.setPosterUrl(res.url);
          } else _.toast("海报上传失败~");
          // _.loading();
        })
        .catch((e) => {
          console.error("Upload error: ", e);
          _.toast("海报上传失败~");
          _.loading();
        });
    },
    setPosterUrl(url) {
      let _ = this;
      url = url.replace("http://", "https://");
      _.posterUrl = url;

      if (!!url) {
        _.shareToWechat();
      } else {
        _.draw();
      }
    },
    loading(title) {
      if (title) {
        Indicator.open({
          text: title,
          spinnerType: "triple-bounce", // 'snake''fading-circle''double-bounce''triple-bounce'
        });
      } else Indicator.close();
    },
    shareToFriend() {
      let _ = this,
        h5Share = _.modelData.share;
      if (!_.$root.isdebug)
        window.gio("track", "ShareToWeChatFriend", "h5分享给微信好友");
      if (_.$root.ISAPP) {
        _.loading("正在调起微信分享···");

        // 这里调用分享加次数
        _.goShare();

        _.javascriptBridge({
          name: "callAppDirectlyShare",
          params: {
            sharecontent: h5Share.content,
            sharetitle: h5Share.title,
            shareurl:
              h5Share.url +
              "&unionid=" +
              ((_.authUser && _.authUser.unionid) || ""),
            sharepicurl: h5Share.icon,
            type: 2,
            platform: 2,
            callbackname: "_shareCallBack",
          },
        });
      } else _.toast("请在斗牛APP中进行分享~");
    },
    shareToWechat() {
      let _ = this;
      // console.log("shareToWechat:", _.posterUrl);
      /**
       * callAppDirectlyShare
        {
          "sharecontent":"分享内容",
          "sharepicurl":"分享图片地址",
          "shareurl":"分享链接",
          "sharetitle":"分享标题",
          "callbackname":"分享结果回调方法名",
          "xcxurl":"小程序的分享地址",
          "xcxicon":"小程序的封面图",
          "xcxid":"小程序的原始id",
          "type":"分享内容内型，1：是分享图片，2：是分享H5链接",
          "platform":"分享平台，1：是分享到朋友圈，2：是分享给微信好友"
        }
       */
      if (_.$root.ISAPP) {
        _.loading("正在调起微信分享···");

        // 这里调用分享加次数
        _.goShare();

        _.javascriptBridge({
          name: "callAppDirectlyShare",
          params: {
            sharepicurl: _.posterUrl,
            type: 1,
            platform: 1,
            callbackname: "_shareCallBack",
          },
        });
      } else _.toast("请在斗牛APP中进行分享~");
    },
  },
  watch: {
    modelType: function (n, o) {
      this.dealType();
    },
  },
};
</script>
<style scoped>
.draw-layer-cover {
  z-index: -998;
  position: fixed;
  top: -50vh;
  left: 0;
  width: 100vw;
  height: 200vh;
  background: #fff;
}
.draw-layer {
  width: 100vw;
  min-height: 100vh;
  background: url("https://files.eyee.com/activity/ggl/posterbg.png") no-repeat;
  background-size: 100% 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -999;
}
.draw-layer img {
  display: block;
}

.dl-sec {
  position: relative;
}
.dl-sec > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.dl-main {
  position: relative;
  z-index: 2;
}
.dl-lid {
  width: 62.4%;
  margin: 45% auto -37%;
  position: relative;
  z-index: 4;
}
.dl-shoe {
  width: 48%;
  height: 30%;
  margin: 0 auto;
  position: relative;
  z-index: 3;
  left: 2%;
  top: -1%;
}
.dl-name {
  font-size: 14px;
  font-weight: 400;
  color: #fff;
  text-align: center;
  width: 70%;
  margin: 6% auto 0;
}

.dl-btm {
  margin-top: -9vw;
}
.dl-btm > div {
  padding-top: 10%;
}
.dl-qrcode {
  width: 25vw;
  height: 25vw;
  background-color: #f0f8ff;
  border: 2px solid #ffcf97;
  margin: 0 5.5%;
  padding: 2px;
  position: relative;
}
#codeShow {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.dl-tips {
  width: 62vw;
  color: #fff;
}
.dl-tips p {
  font-size: 12px;
  line-height: 20px;
}
.dl-tips img {
  width: 60%;
}
/* .posterbg {
  width: 100vw;
  height: 185vw;
  position: absolute;
  flex-wrap: wrap;
}
.posterbg p {
  font-size: 14px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #ffffff;
  position: absolute;
  top: 110vw;
  z-index: 6;
}
.posterbg2 {
  width: 100vw;
  position: absolute;
  left: 50%;
  top: 0vw;
  transform: translateX(-50%);
  z-index: 2;
}
.postershare {
  width: 63%;
  position: relative;
  top: 20.5vw;
  z-index: 4;
}
.postershose {
  width: 50vw;
  z-index: 3;
  position: relative;
  top: -57vw;
}
.figure {
  width: 100vw;
  position: absolute;
  bottom: 0;
  z-index: 3;
}
.qr-code {
  width: 22vw;
  height: 22vw;
  position: absolute;
  bottom: 8vw;
  z-index: 3;
  left: 5vw;
  background-color: #f0f8ff;
  border: 2px solid #ffcf97;
} */
/* .qr-code #msg {
  transform: scale(0.7) translate(-50%, -50%);
  left: 28%;
  top: 25%;
  position: absolute;
} */
.bottomtext {
  position: absolute;
  bottom: 8vw;
  z-index: 3;
  width: 65%;
  left: 32vw;
}

.win {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: -20px;
}
.login_mask {
  position: fixed;
  z-index: 15;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}
.wining-popup {
  width: 100%;
  height: 134vw;
  background-image: url("https://files.eyee.com/activity/ggl/winning.png");
  background-size: 100% 100%;
  position: relative;
  top: 8vw;
}
.winning-close {
  border: 1px solid #eee;
  border-radius: 4vw;
  width: 18vw;
  text-align: center;
  line-height: 6.6vw;
  float: right;
  color: #eee;
  font-size: 14px;
  margin: 1.5vw 5vw 0 0;
}
.winning-close span {
  color: #fbc876;
}
.wining-cap {
  width: 63vw;
  height: 54vw;
  background-image: url("https://files.eyee.com/activity/ggl/cap.png");
  background-size: 100% 100%;
  position: absolute;
  top: 45.8vw;
  left: 19vw;
  color: #efb87f;
  text-align: center;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  z-index: 2;
}
.wining-bottom {
  width: 65%;
  height: 10vh;
  background-image: url("https://files.eyee.com/activity/ggl//bottombtn.png");
  background-size: 100% 100%;
  position: relative;
  text-align: center;
  top: 15vw;
  left: 17%;
}
.wining-bottom p {
  width: 100%;
  font-size: 17px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color: #efb87f;
  line-height: 10vh;
  padding-bottom: 1vh;
}
.winning-text {
  width: 100vw;
  position: absolute;
  top: 22vw;
  text-align: center;
  color: rgba(255, 255, 255, 1);
}
.winning-text p {
  font-size: 16px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  line-height: 8vw;
}
.winning-text span {
  font-size: 13px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  line-height: 8vw;
}
.wining-cap p {
  margin-top: 3vw;
  font-size: 16px;
  line-height: 8vw;
  position: relative;
  z-index: 6;
}
.wining-cap span {
  font-size: 18px;
  line-height: 8vw;
  position: relative;
  z-index: 6;
}
.winning-message {
  width: 100%;
  position: relative;
  top: 100vw;
  display: flex;
  justify-content: center;
  text-align: center;
  flex-wrap: wrap;
}
.winning-code {
  width: 100%;
  font-size: 15px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #ffcf97;
  line-height: 8vw;
}
.message {
  width: 45%;
  line-height: 13vw;
  color: #eee;
  font-size: 10px;
}
.message img {
  width: 10vw;
  height: 10vw;
  border: 2px solid #efb87f;
  border-radius: 50%;
  margin-right: 10px;
}
.wining-cap-img {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 5;
}
.win-shose {
  width: 100%;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}
.win-shose img {
  width: 70%;
  /* position: absolute;
  top: 60vw; */
}
.red-packet {
  width: 100%;
  height: 130vw;
  background: url("https://files.eyee.com/activity/ggl/redpacket.png") center
    center no-repeat;
  background-size: 90% 100%;
  position: relative;
  top: 22vw;
  flex-wrap: wrap;
}
.money {
  position: absolute;
  top: 20vw;
  font-size: 45px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color: #ae231c;
}
.red-packet-text {
  position: relative;
  top: -17vw;
  text-align: center;
  font-size: 14px;
  color: #ae231c;
  font-family: PingFangSC-Regular;
}
.red-packet-text p {
  line-height: 6vw;
}
.remind-text {
  position: absolute;
  font-size: 16px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color: #ffcf97;
}
.red-btn {
  width: 100%;
  height: 14vw;
  position: absolute;
  top: 74vw;
  background: url("https://files.eyee.com/activity/ggl/bottombtn.png") center
    center no-repeat;
  background-size: 60% 100%;
  text-align: center;
  font-size: 16px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color: #efb87f;
  line-height: 13vw;
}
.yellow-btn {
  width: 100%;
  height: 14vw;
  position: absolute;
  top: 88vw;
  background: url("https://files.eyee.com/activity/ggl/yellowbtn.png") center
    center no-repeat;
  background-size: 60% 100%;
  font-size: 16px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color: #a01914;
  line-height: 13vw;
  text-align: center;
}
.remind-ruls {
  width: 100%;
  position: absolute;
  top: 105vw;
  font-size: 11px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #eee;
  text-align: center;
  line-height: 6vw;
}
.close-img {
  position: absolute;
  width: 8vw;
  height: 8vw;
  top: -50vw;
  top: -2vw;
  right: 10vw;
}
.close-red-packet {
  width: 100%;
  height: 80vw;
  background: url("https://files.eyee.com/activity/ggl/closeRedPacket.png")
    center center no-repeat;
  background-size: 90% 100%;
  position: relative;
  top: 30vw;
}
.closebtn-img {
  width: 8vw;
  height: 8vw;
  position: absolute;
  top: -10vw;
  right: 5vw;
}
.packket-top-text {
  position: absolute;
  text-align: center;
  top: 7vw;
  font-size: 20px;
  font-family: PingFangSC-Semibold;
  font-weight: 500;
  color: #ffcf97;
  margin-left: 2%;
}
.packket-top-text span {
  font-size: 15px;
}
.ticket-num {
  position: absolute;
  font-size: 32px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color: #ffcf97;
  top: 42.8vw;
  right: 25vw;
}
.tombola-btn {
  width: 100%;
  height: 15vw;
  background: url("https://files.eyee.com/activity/ggl/bottombtn.png") center
    center no-repeat;
  background-size: 50% 100%;
  position: relative;
  text-align: center;
  color: #efb87f;
  font-size: 16px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  line-height: 14vw;
  top: 38vw;
}
.latombola {
  width: 100%;
  height: 55vw;
  position: fixed;
  bottom: 0;
  background: url("https://files.eyee.com/activity/ggl/latombola.png");
  background-size: 100% 100%;
  text-align: center;
  color: #a01914;
  font-size: 12px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
}
.nolatombola {
  width: 100%;
  height: 55vw;
  position: fixed;
  bottom: 0;
  background: url("https://files.eyee.com/activity/ggl/Nolatombola.png");
  background-size: 100% 100%;
  z-index: 2;
}
.greet {
  position: absolute;
  right: 0;
  width: 20vw;
  top: 0vw;
}
.latombola-btn {
  width: 100%;
  height: 14vw;
  background: url("https://files.eyee.com/activity/ggl/bottombtn.png") center
    center no-repeat;
  background-size: 60% auto;
  line-height: 13vw;
  font-size: 16px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color: #efb87f;
}
.one-more-time {
  font-size: 18px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
}
.latombola-top-text span {
  display: flex;
  justify-content: center;
  font-size: 13px;
  color: #000000;
  line-height: 6vw;
}
.bottom-share {
  background-color: white;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60vw;
  border-radius: 7vw 7vw 0 0;
  font-size: 15px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
}
.bottom-share p {
  text-align: center;
  line-height: 15vw;
}
.wechat {
  width: 100%;
  height: 16vw;
  /* text-align: center; */
  display: flex;
  flex-wrap: nowrap;
}
.wechat p {
  width: 27vw;
  margin-left: 2vw;
  line-height: 12vw;
  font-size: 12px;
  font-family: PingFang-SC-Regular;
  font-weight: 400;
}
.wechat-img {
  width: 11vw;
  height: 11vw;
  float: left;
  margin-left: 5vw;
}

.link {
  border: 0.5px solid #eee;
  width: 90%;
  margin-left: 5%;
}
.promptwechat {
  width: 33vw;
  height: 7vw;
  background: url("https://files.eyee.com/activity/ggl/promptwechat.png")
    no-repeat;
  background-size: 100% 100%;
  line-height: 7vw;
  margin-left: 12vw;
  margin-top: 2vw;
  float: right;
  font-size: 10px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #eb4343;
  text-align: center;
}
.arrowicon-img {
  width: 6vw;
  height: 6vw;
  float: right;
  margin-top: 3vw;
  line-height: 6vw;
}
.handshare {
  width: 25vw;
  height: 25vw;
  float: right;
  margin-top: 10vw;
  margin-right: 10vw;
}
.h5text {
  width: 80%;
  float: right;
  text-align: center;
  color: #eee;
  line-height: 10vw;
  font-weight: 600;
}
.h5text span {
  font-size: 18px;
  font-weight: 500;
}

/*刮刮乐 */
.my_code {
  width: 100%;
  height: 70vw;
  margin-bottom: 8px;
  padding-left: 10px;
  /* background: linear-gradient(#f7d8aa, #efb87f); */
  position: relative;
}
.my_code.cardCanvas {
  padding: 0;
  text-align: center;
  position: fixed;
  bottom: -5vw;
  height: 60vw;
  z-index: 5;
}
.good_firend::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  /* background: url("https://files.eyee.com/activity/ggl/good_friend_zanzhu.png") 0 0 no-repeat; */
  background-size: 100% 100%;
  width: 45px;
  height: 45px;
}
.my_code .us-header {
  width: 30%;
}
.my_code .us-header img {
  width: 30px;
  height: 30px;
  /* border-radius: 50%; */
  margin-right: 5px;
}
.canModel {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}
/* .cardCanvasStyle {
  height: 44.5vw;
  width: 89vw;
} */
</style>
