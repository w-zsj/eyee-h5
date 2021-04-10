<template>
  <div>
    <div class="finall">
       <div class="videoBg ">
            <div class="videoBg firstPage">
              <div id="snkrs">
                <img  :src="snkrs" class="snkrs"/>
              </div>
              <div id="phone">
                <img  :src="phone" class="phone"/>
              </div>
            </div>
            <div class="videoBg ">
                <div id="dnkrs">
                  <img  :src="dnkrs" class="dnkrs"/>
                </div>
                <div id="car">
                  <img  :src="car" class="car"/>
                </div>
            </div>
        </div>
    </div>

    <div
      class="login_register"
      :style="{height: deviceHei + 'px', backgroundImage: 'url('+https( baseRegImg) +')'}"
    >
     <div>
        <img :src="topCircle" class="topCircle"/>
      </div>
      <div>
        <img :src="shose" class="shose">
      </div>
      <div>
        <img :src="happy" class="happy"/>
      </div>
      <div>
        <img :src="newyear" class="new"/>
      </div>
      <div>
        <img :src="left" class="left"/>
      </div>
      <div>
        <img :src="purplBall" class="purple"/>
      </div>
      <div>
        <img :src="right" class="right"/>
      </div>
      <div>
        <img :src="logo" class="logo"/>
      </div>
      <div class="boder flex-center" style="font-size:15px;bottom: 5%;z-index:99;" @click="doBallot()">参与抽签</div>

    </div>
    <div v-if="showCover" class="cover">
      <div id="light">
        <span class="circle top1 dark"></span>
        <span class="circle top2 dark"></span>
        <span class="circle top3 light"></span>
      </div>
      <div>
        <p class="content1">{{content1}}</p>
        <p class="content2">{{content2}}</p>
      </div>
      <div class="corver_boder" @click="goAhead()" id="secs">{{"等不及了( "+secs +"s )"}}</div>
    </div>
    <div v-if="isGoAhead && !$root.ISWX" class="bg" id="poster" >
      <div class="goImage">
         <div v-if="hasNickname" class="nickname" style="z-index:99">{{username}}</div>
         <div class="content3">{{content3}}</div>
        <img :src="goImg" style="max-width: 85%; margin-left: 9%;margin-bottom: 2%;">
      </div>
      <div
          class="boder flex-center"
          style="font-size:15px;bottom:11%;margin-left: 6%;z-index:99;"
          @click.stop="reBallot()"
          id="continueBtn"
        >继续抽签</div>
        <div v-if="$root.ISAPP" class="shareQR"  @click.stop="share()">
          <img :src="shareQR">
        </div>
        <div v-if="!$root.ISAPP" class="shareQR"  @click.stop="share()">
          <img :src="longQR">
        </div>
  </div>

    <!-- 微信 -->
     <div v-if="isGoAhead && $root.ISWX" class="bg" id="poster" >
          <div class="goImageWX">
            <div v-if="hasNickname" class="nickname">{{username}}</div>
           <div class="content3">{{content3}}</div>
           <img :src="goImgWX" style="max-width: 82%; margin-left: 9%;margin-bottom: 2%;">
           <!-- <img src="/static/imgs/ballot/1WX@2x.jpg" style="max-width: 78%; margin-left: 11%;margin-bottom: 7%;"> -->
        </div>
        <div
          class="boder flex-center"
          style="font-size:15px; bottom: 6%;margin-bottom: 3%;margin-left: 8%;"
          @click.stop="reBallot()"
          id="continueBtn"
        >继续抽签</div>
    </div>
    <div v-if="isShare">
      <div class="share-top" @click.stop="closeModel">
        <div class="postBg" id="posterImg" @click.stop.prevent>
          <div class="goShareImage postGo">
            <img :src="goImg">
          </div>
          <div class="flex-between postgoing">
           <div v-if="$root.ISAPP" class="shareAppQR">
              <img :src="pressBallot">
            </div>
            <div v-if="!$root.ISAPP" class="shareAppQR">
              <img :src="pressBallot">
            </div>
          </div>
        </div>
      </div>
      <div class="share-btm">
        <div style="margin-top:13px" class="flex-center" >
          <div class="icon" style="display:inline-block;" @click="doShare()">
            <div class="iconImg">
              <img :src="wxImg">
            </div>
            <div class="flex-center">微信</div>
          </div>
          <div class="icon" style="display:inline-block;" >
            <div class="iconImg" @click="doShareToPYQ()">
              <img :src="pyqImg">
            </div>
            <div class="flex-center">朋友圈</div>
          </div>
          <!-- <div class="icon" style="display:inline-block;" >
            <div class="iconImg" @click="draw('longPressShare')">
              <img :src="downloadImg">
            </div>
            <div class="flex-center">保存图片</div>
          </div> -->
        </div>
      </div>
    </div>

    <div class="share-top" @click.stop="closeModel" style="z-index:-999">
      <div class="postBg"  id="longPressShare">
        <div class="goShareImage postGo">
          <img :src="goImg">
        </div>
        <div class="flex-between postgoing">
          <div class="ballotQR">
            <img :src="pressBallot">
          </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import Vue from "vue";
import { mapGetters } from "vuex";
import { GetContent } from "@/utils/api/activities";
import { stringify } from "querystring";
import { html2canvas } from "@/utils/html2canvas.js";
import { Upload } from "@/common/api/user";
import {
  GetPosterStatus,
  GetPosterUrl,
  SetPosterUrl,
  SetShareStatus,
  CreateSnapshot,
  GetSnapshot
} from "@/utils/api/activities";


import { MD5, Checking } from "@/common/util";
import * as api from "@/common/api/user";
import { weixinApp } from "@/common/api/oauthAPI";

var list1 = [
  "呵呵，又来排队啦",
  "来了老弟",
  "001号选手，准备起跑",
  "恭喜你获得了一个陪跑资格",
  "欢迎，这里是非洲人报到处",
  "抽签吗？反正中不了那种",
  "来啦！抽就vans了",
  "恭喜你进入跑道"
];
var list2 = [
  "你前面还有250个bot，如果你购买成功，我们有可能通知你",
  "你尽管排，我就想告诉你前面又多了1000个bot",
  "在经历了5000次陪跑之后恭喜你又获得了一次陪跑机会",
  "在经历了300次陪跑之后你还是来了，毕竟，万一中了呢"
];
var list3 = [
  "恭喜你中签了",
  "恭喜你成为年度欧神",
  "恭喜你可以盘它了"
];
var imgList = [
  "/static/imgs/ballot/1@2x.png",
  "/static/imgs/ballot/3@2x.png",
  "/static/imgs/ballot/4@2x.png",
  "/static/imgs/ballot/5@2x.png",
  "/static/imgs/ballot/6@2x.png",
  "/static/imgs/ballot/7@2x.png",
  "/static/imgs/ballot/8@2x.png",
  "/static/imgs/ballot/9@2x.png",
  "/static/imgs/ballot/10@2x.png",
  "/static/imgs/ballot/11@2x.png",
  "/static/imgs/ballot/13@2x.png",
  "/static/imgs/ballot/14@2x.png",
  "/static/imgs/ballot/15@2x.png",
  "/static/imgs/ballot/16@2x.png",
  "/static/imgs/ballot/17@2x.png",
  "/static/imgs/ballot/18@2x.png",
  "/static/imgs/ballot/20@2x.png",
  "/static/imgs/ballot/21@2x.png",
  "/static/imgs/ballot/22@2x.png",
  "/static/imgs/ballot/23@2x.png",
  "/static/imgs/ballot/LPT@2x.png",
  "/static/imgs/ballot/SPT@2x.png",
  "/static/imgs/ballot/SZ@2x.png",
  "/static/imgs/ballot/TX@2x.png",
  "/static/imgs/ballot/28@2x.png",
  "/static/imgs/ballot/29@2x.png",
  "/static/imgs/ballot/30@2x.png",
  "/static/imgs/ballot/31@2x.png",
  "/static/imgs/ballot/32@2x.png",
  "/static/imgs/ballot/33@2x.png",
];
var imgWXList = [
  "/static/imgs/ballot/1WX@2x.jpg?r=2",
  "/static/imgs/ballot/3WX@2x.jpg?r=2",
  "/static/imgs/ballot/4WX@2x.jpg?r=2",
  "/static/imgs/ballot/5WX@2x.jpg?r=2",
  "/static/imgs/ballot/6WX@2x.jpg?r=2",
  "/static/imgs/ballot/7WX@2x.jpg?r=2",
  "/static/imgs/ballot/8WX@2x.jpg?r=2",
  "/static/imgs/ballot/9WX@2x.jpg?r=2",
  "/static/imgs/ballot/10WX@2x.jpg?r=2",
  "/static/imgs/ballot/11WX@2x.jpg?r=2",
  "/static/imgs/ballot/13WX@2x.jpg?r=2",
  "/static/imgs/ballot/14WX@2x.jpg?r=2",
  "/static/imgs/ballot/15WX@2x.jpg?r=2",
  "/static/imgs/ballot/16WX@2x.jpg?r=2",
  "/static/imgs/ballot/17WX@2x.jpg?r=2",
  "/static/imgs/ballot/18WX@2x.jpg?r=2",
  "/static/imgs/ballot/20WX@2x.jpg?r=2",
  "/static/imgs/ballot/21WX@2x.jpg?r=2",
  "/static/imgs/ballot/22WX@2x.jpg?r=2",
  "/static/imgs/ballot/23WX@2x.jpg?r=2",
  "/static/imgs/ballot/LPTWX@2x.jpg?r=2",
  "/static/imgs/ballot/SPTWX@2x.jpg?r=2",
  "/static/imgs/ballot/SZWX@2x.jpg?r=2",
  "/static/imgs/ballot/TXWX@2x.jpg?r=2",
  "/static/imgs/ballot/28WX@2x.jpg?r=2",
  "/static/imgs/ballot/29WX@2x.jpg?r=2",
  "/static/imgs/ballot/30WX@2x.jpg?r=2",
  "/static/imgs/ballot/31WX@2x.jpg?r=2",
  "/static/imgs/ballot/32WX@2x.jpg?r=2",
  "/static/imgs/ballot/33WX@2x.jpg?r=2"
];
export default {
  data() {
    return {
      deviceHei: "",
      deviceWid: "",
      showCover: false,
      isGoAhead: false,
      isShare: false,
      drawPoster: true,
      hasNickname: false,
      isPlay:false,
      content1: "", //文案1
      content2: "", //文案2
      content3: "", //文案3
      nickName: "",
      secs: 6,
      home:false,
      posterUrl: "",
      timer: null,
      baseRegImg: "/static/imgs/ballot/bg@2x.png",
      shose:"/static/imgs/ballot/shose.gif",
      newyear:"/static/imgs/ballot/2019@2x.png",
      happy:"/static/imgs/ballot/happynewyear@2x.png",
      logo:"/static/imgs/ballot/logo@2x.png?r=2",
      goImg: "/static/imgs/ballot/1@2x.png",
      goImgWX:"/static/imgs/ballot/1WX@2x.png",
      longQR: "/static/imgs/ballot/app-long@2x.png?r=2",
      shareQR: "/static/imgs/ballot/app-click@2x.png?r=2",
      closeImg: "/static/imgs/ballot/close@2x.png",
      wxImg: "/static/imgs/ballot/wx_icon@2x.png",
      pyqImg: "/static/imgs/ballot/pyq_icon@2x.png",
      downloadImg: "/static/imgs/ballot/download_icon@2x.png",
      topCircle:"/static/imgs/ballot/left_top@2x.png",
      pressBallot:"/static/imgs/ballot/press_ballot@2x.png?r=2",
      purplBall:"/static/imgs/ballot/purplBall@2x.png",
      left:"/static/imgs/ballot/left@2x.png",
      right:"/static/imgs/ballot/right@2x.png",
      snkrs:"/static/imgs/ballot/snkrs.png",
      car:"/static/imgs/ballot/car.png",
      phone:"/static/imgs/ballot/phone.png",
      dnkrs:"/static/imgs/ballot/dnkrs.png"
    };
  },
  computed: {
    ...mapGetters({ baseValue: "baseValue", userInfo: "userInfo" }),
    username(){
      return this.nickName||((this.userInfo||{}).username||'')
    }
  },
  mounted() {
    /* this.getVideoEdd(); */
    this.wx_code();
    this.shareApi();
    if (!this.baseValue.configs) this.$store.dispatch("setBaseValue");
    this.deviceHei = document.documentElement
      ? document.documentElement.clientHeight
      : document.body.clientHeight;

    this.deviceWid = document.documentElement
      ? document.documentElement.clientWidth
      : document.body.clientWidth;
    this.getContent();
    let _ = this;
    // hide app share
    window._shareCallBack = function(res, via) {
      // _.toast("回调的参数值" + JSON.stringify(res));
      Indicator.close();
      if (res == 1) _.setShareStatus();
    };
  },
  methods: {
    closeModel() {
      this.isShare = false;
    },
    getVideoEdd : function (){
      let _ = this;
      var md=document.getElementById("media");
      md.addEventListener("ended",function(){
          _.home = true;
          _.isPlay = true;
          _.createImg();
      })
    },
    doBallot: function() {
      this.showCover = true;
      this.createImg();
      clearTimeout(this.timer);
      this.secs = 6;
      this.setTime();

    },
    wx_code() {
      // 微信静默登录返回uid
      if (window.location.href.indexOf("code") > 0) {
        var weixincode = window.location.href
          .split("code=")[1]
          .split("&state")[0];
        api
          .WXRegisterAuth({ wxcode: weixincode })
          .then(res => {
            //获取unionid
            if (res && res.unionid) {
              this.nickName = res.nickname;
              this.hasNickname = true;
              console.log("3------------",this.nickName)
            }
          })
          .catch(err => {
            /*  this.toast("获取uid失败"); */
          });
      } else {
        if (this.$root.ISWX) {
          var path = window.location.origin + window.location.pathname;
          var link = weixinApp.get_authorize_base_link(path, "weixinJ");
          window.location = link;
        }
      }
    },
    getContent: function() {
      /* GetContent({type : 1})
        .then(res => {
          this.content1 = res.content;
        })
        .catch(e => {
          var index = Math.ceil(Math.random()*list1.length)-1;
          this.content1 = list1[index];
          console.error("GetContent error: ", e);
        });
        GetContent({type : 2})
        .then(res => {
          this.content2 = res.content;
        })
        .catch(e => {
          var index2 = Math.ceil(Math.random()*list2.length)-1;
          this.content2 = list2[index2];
          console.error("GetContent error: ", e);
        });
        GetContent({type : 3})
        .then(res => {
          this.content3 = res.content;
        })
        .catch(e => {
          var index3 = Math.ceil(Math.random()*list3.length)-1;
          this.content3 = list3[index3];
          console.error("GetContent error: ", e);
        }); */
      var index = Math.ceil(Math.random() * list1.length) - 1;
      index = index < 0 ? 0 : index;
      this.content1 = list1[index];
      var index2 = Math.ceil(Math.random() * list2.length) - 1;
      index2 = index2 < 0 ? 0 : index2;
      this.content2 = list2[index2];
      var index3 = Math.ceil(Math.random() * list3.length) - 1;
      index3 = index3 < 0 ? 0 : index3;
      this.content3 = list3[index3];
      var indexImg = Math.ceil(Math.random() * imgList.length) - 1;
      indexImg = indexImg < 0 ? 0 :indexImg;
      this.goImg = imgList[indexImg];
      var indexWXImg = Math.ceil(Math.random() * imgWXList.length) - 1;
      indexWXImg = indexWXImg < 0 ? 0 :indexWXImg;
      this.goImgWX = imgWXList[indexWXImg];
    },

    goAhead: function() {
      this.isGoAhead = true;
      clearTimeout(this.timer);
      this.secs = 0;
    },
    reBallot: function() {
      this.getContent();
      this.isGoAhead = false;
      clearTimeout(this.timer);
      this.secs = 6;
      this.setTime();
    },
    close: function() {
      this.getContent();
      this.isGoAhead = false;
      this.showCover = false;
    },
    share: function() {
      this.isShare = true;
    },
    draw(val) {
      this.drawPoster = false;
      let _ = this;
      _.loading("生成海报中···");

      let $layer = document.getElementById(val);
      html2canvas($layer, { useCORS: true }).then(canvas => {
        let dataUrl = canvas.toDataURL("image/jpeg");
        _.posterUrl = dataUrl;
        _.loading();
        // _.uploadImg(dataUrl);
        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = "doNewPic"+ new Date(); // 设置图片名称
        a.href =  _.posterUrl; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      });
    },
    uploadImg(data) {
      let _ = this;
      Upload({ stream: data.split(",")[1] })
        .then(res => {
          console.log("Upload res: ", res);
          if (res && res.url) {
            _.posterUrl = res.url;
            _.setPosterUrl(res.url);
          } /* else _.toast("海报上传失败~"); */
          _.loading();
        })
        .catch(e => {
          /*   console.error("Upload error: ", e);
          _.toast("海报上传失败~");
          _.loading(); */
        });
    },
    loading(title) {
      if (title) {
        Indicator.open({
          text: title,
          spinnerType: "triple-bounce" // 'snake''fading-circle''double-bounce''triple-bounce'
        });
      } else Indicator.close();
    },
    setPosterUrl(url) {
      let _ = this;
      url = url.replace("http://", "https://");
      _.posterUrl = url;
      SetPosterUrl(url)
        .then(res => {
          console.log("SetPosterUrl res: ", res);
          _.showShareModal();
        })
        .catch(e => {
          console.error("SetPosterUrl error: ", e);
        });
    },
    showShareModal() {
      let _ = this;

      console.log("showShareModal:", _.posterUrl);

      if (!!_.posterUrl) {
        _.showShare = true;

        // IOS下双重保险关闭提示蒙层, 18s
        if (_.$root.ISIOS) {
          _.setShareStatus();

          setTimeout(_.loading, 18000);
        }
      } else {
        _.doDraw = true;
        _.dealTitle(_.totalprice, _.draw);
      }
    },
    setShareStatus() {
      SetShareStatus()
        .then(res => {
          console.log("SetShareStatus res: ", res);
        })
        .catch(e => {
          console.error("SetShareStatus error: ", e);
        });
    },
    doShare() {
      let _ = this;
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
        _.javascriptBridge({
          name: "callAppDirectlyShare",
          params: {
            sharepicurl: _.posterUrl,
            type: 1,
            platform: 2,
            callbackname: "_shareCallBack"
          }
        });
      }
    },
    doShareToPYQ() {
      let _ = this;
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
        _.javascriptBridge({
          name: "callAppDirectlyShare",
          params: {
            sharepicurl: _.posterUrl,
            type: 1,
            platform: 1,
            callbackname: "_shareCallBack"
          }
        });
      }
    },
    closeShare() {
      let _ = this,
        $shareImgBox = document.getElementById('longPressShare');

      _.loading();

      _.showShare = false;
    },
    setShare(info) {
      let _ = this;
      if (!(info && info.title)) return;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "getAppActivityShareContent",
          params: {
            sharecontent: info.content,
            sharepicurl: info.icon,
            shareurl: info.url,
            sharetitle: info.title,
            showshareicon: true
          }
        });
      } else if (_.$root.ISWX) {
        _.initShare({
          info: {
            title: info.title,
            desc: info.content,
            url: info.url,
            img: info.icon
          }
        });
      }
    },
    setTime: function() {
      let _ = this;
      _.secs--;
      if (_.secs == 0) {
        _.goAhead();
      } else {
        _.timer = setTimeout(() => {
          _.setTime();
        }, 1000);
      }
    },
    createImg :function () {
      let _ = this;
      let $layer = document.getElementById('longPressShare');
      html2canvas($layer, { useCORS: true }).then(canvas => {
        let dataUrl = canvas.toDataURL("image/jpeg");
        _.uploadImg(dataUrl);
      });
    },
    shareApi(){
     let _ = this;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "getAppActivityShareContent",
          params: {
            sharetitle: "【DNKRS】SNKRS给不了你的，我来！",
            sharecontent:
              "抽光2018所有热门鞋款，弥补你一年的抽签快感！",
            sharepicurl: window.location.origin +"/static/imgs/ballot/urlIcon@2x.png",
            shareurl: window.location.origin + "/ballot",
            hideshareicon: false
          }
        });
      }
    },

  },
  beforeDestroy() {
    clearTimeout(this.timer);
  }
};
</script>
<style>
.shose {
  position: fixed;
  top: 23%;
}
.topCircle {
  position: fixed;
  top: 8%;
  width: 15%;
}
.happy {
    position: fixed;
    top: 10px;
    width: 60%;
    left: 15px;
}
.new {
    position: fixed;
    right: 10px;
    top: 10px;
    width: 16%;
}
.left {
  position: fixed;
  left: -15%;
  bottom: 19%;
  width: 35%;
}
.right {
  position: fixed;
  right: -10%;
  width: 30%;
  bottom: 13%;
}
.purple {
  position: fixed;
  right: 11%;
  width: 7%;
  top: 10.5%;
}
.logo {
  position: absolute;
  right: 10px;
  bottom: 5%;
  width: 43%;
}
.video {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
}
.videoBg {
  width: 100%;
  background-position: center;
  background-size: 100% 100%;
  padding-top: 5px;
  font-size: 12px;
  /* position: relative; */
  /* background-color: #000; */
  /* min-height: 100vh; */
  /* overflow: hidden; */

}
.videoMV {
  animation: myvideo 2s forwards;
}
@keyframes myvideo {
  from {
    bottom: 0px;
  }
  to {
    bottom: 1000px;
  }
}
.login_register {
  width: 100%;
  background-position: center;
  background-size: 100% 100%;
  padding-top: 48px;
  font-size: 12px;
  position: fixed;
  top: 0;
  background-color: #ccc;
  min-height: 100vh;
  overflow: hidden;
}
.postFont {
  font-size: 10px;
  color: rgba(104, 104, 104, 1);
  line-height: 12px;
  position: relative;
  top: 18vw;
  letter-spacing: 2px;
}
.bg {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-color: rgba(250, 250, 250, 1);
  animation: mymove 2s forwards;
}
@keyframes mymove {
  from {
    top: 800px;
  }
  to {
    top: 0;
  }
}
.postBg {
  position: fixed;
  width: 70%;
  top: 10%;
  left: 15%;
  bottom: 0;
  right: 0;
  height: 67%;
  background-size: 100% 100%;
  background-color: rgba(250, 250, 250, 1);
}
.postGo {
  position: relative;
  top: 10%;
}
.going {
  padding: 0 16px;
  position: relative;
  font-size: 12px;
  top: -24vw;
}
.tops {
  position: relative;
  width: 70%;
}
.topsWX {
    position: fixed;
    width: 70%;
    bottom: 26px;
    left: 20px;
}
.goImage {
  position: absolute;
  width: 100%;
  top: 13%;
}
.goShareImage {
  position: fixed;
  margin-top: 9%;
  width: 68%;
  left: 18%;
}
.ballotQR {
  position: fixed;
  width: 64%;
  bottom: 21%;
  right: 17%;
}
.postgoing {
  padding: 0 4px;
  position: relative;
  font-size: 12px;
  top: -6vw;
}
.boder{
  position: absolute;
  left: 3%;
  width: 26%;
  height: 5%;
  border-radius: 4px;
  bottom: 15%;
  border: 1px solid rgba(51, 51, 51, 1);
}
.posiab {
  position: absolute;
  left: 0;
  bottom: 0;
}
.button {
  position: inherit;
  left: 10px;
  top: 4px;
  width: 72px;
  height: 25px;
  font-size: 18px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 25px;
}
.cover {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
}
.circle {
  position: absolute;
  width: 9px;
  height: 9px;
  left: 49%;
  border-radius: 50%;
  display: inline-block;
}
.light {
  background: rgba(255, 255, 255, 1);
}
.dark {
  background: rgba(154, 154, 154, 1);
}
.corver_boder {
  width: 92%;
  height: 7%;
  background: rgba(255, 255, 255, 1);
  border-radius: 22px;
  position: absolute;
  top: 87%;
  left: 14px;
  text-align: center;
  padding-top: 12px;
  font-size: 14px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
}
.content1 {
  width: auto;
  height: 29px;
  font-size: 26px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color: rgba(255, 255, 255, 1);
  line-height: 29px;
  text-align: center;
  margin-top: 58%;
  padding: 0 10px;
  margin-bottom: 35px;
}
.content2 {
  width: 70%;
  height: 36px;
  font-size: 13px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(212, 212, 212, 1);
  line-height: 18px;
  text-align: center;
  margin-left: 15%;
}
.content3 {
  font-size: 24px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color: rgba(7, 7, 7, 1);
  line-height: 29px;
  margin-top: 1%;
  text-align: center;
}
.goImageWX {
  position: absolute;
  margin-top: 10%;
  bottom: -4%;
  overflow: hidden;
 /*  width: 84%;
  height: 77%;
  left: 4%; */
}
.shareQR {
  position: absolute;
  width: 89%;
  bottom: -4%;
  right: 4%;
}
.shareAppQR {
  position: fixed;
  width: 70%;
  top: 59%;
  right: 15%;
}
.postQR {
  width: 30%;
  height: 15%;
}
.closeImg {
  position: fixed;
  right: 5%;
  top: -3%;
  width: 5%;
  margin-top: 26px;
  background: rgba(255, 255, 255, 1);
}
.join {
  position: fixed;
  left: 20px;
  bottom: 20px;
}
.share-top {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 83%;
  background-size: 100% 100%;
  background: rgba(0, 0, 0, 0.8);
}
.share-btm {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 20%;
  background: rgba(255, 255, 255, 1);
  display: inline-block;
  font-size: 12px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(160, 160, 160, 1);
  line-height: 17px;
}

.share-btm .icon {
  width: 15%;
  margin: 2% 12%;
}

.snkrs {
  position: absolute;
  left: 10%;
  width: 60%;
  animation: mysnkrs 4s forwards;
}
@keyframes mysnkrs {
  from {
    opacity : 0;
  }
  to {
    opacity : 1;
  }
}
.phone {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 89%;
  opacity : 0;
  animation: myphone 3s forwards;
  animation-delay: 1s;
}
@keyframes myphone {
  from {
    opacity : 0;
    bottom : -500px;
  }
  to {
    opacity : 1;
    bottom : 0;
  }
}
.firstPage {
  animation: myFirst 3s forwards;
  animation-delay: 4s;
}
@keyframes myFirst {
  from {
    opacity : 1;
    left : 0;
  }
  to {
    opacity : 0;
    left : -500px;
  }
}
.dnkrs {
  position: absolute;
  top: 1%;
  width: 60%;
  opacity : 0;
  animation: mydnkrs 3s forwards;
  animation-delay: 4.5s;
}
@keyframes mydnkrs {
  from {
    opacity : 0;
    right : -50%;
  }
  to {
    opacity : 1;
    right : 27%;
  }
}
#car {
  position: absolute;
  width: 98%;
  bottom: 0;
  opacity : 0;
  animation: mycar 3s forwards;
  animation-delay: 7s;
}
@keyframes mycar {
  from {
    opacity : 0;
    right : -50%;
  }
  to {
    opacity : 1;
    right : 0;
  }
}
.finall {
  z-index: 1;
  position: relative;
  animation: myfinall 3s forwards;
  animation-delay: 11s;
  background-color: #000;
  min-height: 100vh;
}
@keyframes myfinall {
  from {
    opacity : 1;
    z-index: 99;
  }
  to {
    opacity : 0;
    z-index: -99;
  }
}
.top1 {
  top: 20%;
  background: rgba(255, 255, 255, 1);
  animation: myfirst 3s;
  -moz-animation: myfirst 3s; /* Firefox */
  -webkit-animation: myfirst 3s; /* Safari and Chrome */
  -o-animation: myfirst 3s; /* Opera */
  animation-iteration-count: 1000;
}

.top2 {
  top: 23%;
  background: rgba(80, 80, 80, 1);
  animation: myfirst 3s;
  -moz-animation: myfirst 3s; /* Firefox */
  -webkit-animation: myfirst 3s; /* Safari and Chrome */
  -o-animation: myfirst 3s; /* Opera */
  animation-iteration-count: 1000;
  animation-delay: 1s;
}

.top3 {
  top: 26%;
  background: rgba(80, 80, 80, 1);
  animation: myfirst 3s;
  -moz-animation: myfirst 3s; /* Firefox */
  -webkit-animation: myfirst 3s; /* Safari and Chrome */
  -o-animation: myfirst 3s; /* Opera */
  animation-iteration-count: 1000;
  animation-delay: 2s;
}

@keyframes myfirst {
  from {
    background: rgba(255, 255, 255, 1);
  }
  to {
    background: rgba(80, 80, 80, 1);
  }
}

.nickname {
  font-size: 24px;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  color: rgba(7, 7, 7, 1);
  line-height: 29px;
  margin-top: 2%;
  text-align: center;
}
</style>


