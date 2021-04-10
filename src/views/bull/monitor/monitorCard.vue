<template>
  <div class="monitor">
    <loader-app class="load" ref="load" from="2" v-if="!$root.ISAPP">
      <img src="/static/img/bull/download_app.png?c=1" alt />
    </loader-app>
    <div class="monitor_card_box">
      <div class="card">
        <img src="https://files.eyee.com/eyeeh5/img/monitor/mon_image_title_2.png" alt />
      </div>
      <div class="monitor_card_item">
        <img src="https://files.eyee.com/eyeeh5/img/monitor/mon_card_bg_2.png" alt />
        <p class="vip" @click.stop="sercard">
          <img src="https://files.eyee.com/eyeeh5/img/monitor/VIP_sm.png" alt />
        </p>
        <p class="tag">
          <img :src="statuspath" alt />
        </p>
      </div>
    </div>
    <div class="wrap-moni">
      <div class="code_info_box">
        <div class="code_tit flex-center">
          <img src="https://files.eyee.com/eyeeh5/img/monitor/monitor_title_01.png" class="tit-1" />
          <i class="txt">{{moniInfo.boostconfigtotal||0}}</i>
          <img src="https://files.eyee.com/eyeeh5/img/monitor/monitor_title_02.png" class="tit-2" />
        </div>
        <!-- <div class="statu-title flex-center"> -->
        <!-- 倒计时 -->
        <div
          class="flex-center countdown"
          v-if="moniInfo.expiredtime&&moniInfo.expiredtime>0&&moniInfo.boostlist&&moniInfo.boostlist.length<moniInfo.boostconfigtotal"
        >
          剩余时间&nbsp;&nbsp;
          <span class="flex-center" v-html="datatime"></span>
        </div>
        <!-- </div> -->
        <!-- 好友头像 -->
        <!-- 开奖标题 -->
        <div class="share-fri">
          <div class="con">
            <div class="header flex-tops flex-wrap flex-center">
              <div
                class="list flex-col flex-center"
                v-for="(sub,index) in friendheader"
                :key="index+'hea'"
                @click.stop="goshare(sub)"
                v-show="index<(moniInfo.boostconfigtotal||3)"
              >
                <div class="bg flex-center" :class="{'not-border':sub&&sub.userimg}">
                  <img :src="sub&&sub.userimg||''" alt v-if="sub&&sub.userimg" />
                </div>
                <span v-if="sub&&sub.newperson" class="newusertxt flex-center"></span>
              </div>
            </div>
            <!-- 进度条 -->
            <div class="progress-bar-txt">
              <span class>累计邀请{{moniInfo.grandconfigtotal||15}}人，可解锁额外天数</span>
              <span class>({{moniInfo.extracount||0}}/{{moniInfo.grandconfigtotal||15}})</span>
            </div>
            <div class="progress-bar flex-between">
              <div class="bar">
                <i :style="{ width: progress+'%'}"></i>
              </div>
              <div
                class="get-lot flex-center"
                :class="{'act':totalnum>=moniInfo.grandconfigtotal}"
                @click.stop="lotter"
              >领取</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 激活记录 -->
    <div class="record">
      <div class="re-con">
        <div class="title flex-between">
          <!-- 你的激活记录 -->
          <div class="img">
            <img src="https://files.eyee.com/eyeeh5/img/monitor/mon_title.png" alt srcset />
          </div>
          <div class="data-time">领取时间/领取奖励</div>
        </div>
        <!-- 有数据 -->
        <div v-if="activeboostlist&&activeboostlist.length">
          <div class="list flex-btwn" v-for="(item,index) in activeboostlist" :key="index+'rec'">
            <div class="date">
              <div>{{item.receivetime}}</div>
              <span class="newuser" v-if="item.newuser">新用户奖励</span>
            </div>
            <div class="card-type">
              <div class="day">{{item.vipcard}}</div>
              <div class="use-des">{{item.vipservice}}</div>
            </div>
          </div>
        </div>
        <!-- 无数据 -->
        <div class="emy flex-col" v-else>
          <div class="de-img flex-center">
            <img src="https://files.eyee.com/eyeeh5/img/monitor/emy_bg.png" alt />
          </div>
          <div class="flex-center">您还没有激活记录</div>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="btn_box fix-btm">
      <div class="btn flex-center" @click.stop="goActivity">{{btntxt}}</div>
    </div>
    <!-- 弹框 -->
    <div class="mall-modal" :class="{'act':isshowmodal==1}" @click="close">
      <div class="conglat position-abs" @click.stop.prevent v-show="modaltype==1">
        <div class="day yjk flex-center" v-if="modalcardtype==9">
          <img src="https://files.eyee.com/eyeeh5/img/monitor/mon_yjk.png" alt />
        </div>
        <div class="day flex-center" v-else>
          {{modalDay}}
          <i>天</i>
        </div>
        <div class="txt">恭喜获得:</div>
        <div class="data">{{modalDay}}{{modalcardtype==9?"":"天"}} 斗牛VIP监控体验卡！</div>
        <div class="btn flex-center" @click.stop="close">我知道了</div>
      </div>
      <div class="contend" @click.stop.prevent v-show="modaltype==2">
        <span class="close ico-X" @click="close()"></span>
        <p class="title flex-center">分享好友，免费送斗牛VIP球鞋监控卡</p>
        <div class="share flex-center" @click.stop="shareToFriend()">分享微信好友</div>
        <div class="share wec flex-center" @click.stop="draw()">分享朋友圈</div>
      </div>
    </div>
    <!-- 分享卡片 -->
    <div class="share-img position-abs flex-center">
      <div id="poster" class="wrap-cont">
        <div class="user-header flex-aic">
          <div class="header" v-if="user">
            <img :src="user.imageurl|https" alt />
          </div>
          <div class="name">{{user.username}}&nbsp;&nbsp;&nbsp;送你</div>
        </div>
        <div class="img_box" id="posterProd">
          <img src="https://files.eyee.com/eyeeh5/img/monitor/share_bg.png" alt />
        </div>
        <div class="qrcode flex-center">
          <div class="qr-img">
            <img :src="shareinfo.qrcode" alt />
          </div>
          <div class="txt-info">
            <img src="https://files.eyee.com/eyeeh5/img/monitor/mon_qrcode.png" alt />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { FormatSeconds } from "@/common/util";
import { html2canvas } from "@/utils/html2canvas.js";
import { Upload } from "@/common/api/user";
import LoaderApp from "@/comps/Loader";
import {
  Mymonitorinfo,
  MonitorCard,
  Cardshareinfo,
  Lssuemonitorcard
} from "../../../common/api/monitor";
var loader, scrolltimer, lavetimer;
const enumdata = [
  { days: 7, type: 1 },
  { days: 15, type: 2 },
  { days: 30, type: 3 },
  { days: 3, type: 4 },
  { days: 90, type: 5 },
  { days: "永久", type: 9 }
];
// btnOrheaderClick: 1, // 1 按钮点击 2 空头像点击
// sharetype: 1 // 1 分享好友 2 分享朋友圈
export default {
  components: { LoaderApp },
  data() {
    return {
      inof: true,
      posterUrl: "", //  生成分享图片地址
      moniInfo: {}, // 页面展示数据
      // monitorcardtype: "", //#监控卡片类型  1： 7日卡 2：15日卡 3：30日卡 5 90日卡 9：永久卡
      modalDay: "", //弹框显示天数
      modalcardtype: 1,
      statuspath: "https://files.eyee.com/eyeeh5/img/monitor/mon_not_act.png", // 状态图片路径
      datatime: "00 : 00 : 00", // 倒计时
      friendheader: new Array(2), // 好友助力头像  默认是长度为 5 的空数组
      // boostlist: [], // 接口返回 好友头像数据
      isshowmodal: false, // 是否显示弹框
      modaltype: 1, // 1 领奖 2 分享
      activitytype: 0, // 活动状态 0 进行中 1 邀请成功 2 已过期 3 已领完
      btntxt: "邀请好友一起解锁", //立即免费送好友球鞋监控卡 0/5  按钮文言  邀请更多好友使用 重新激活
      totalnum: 0, // 额外助力人数  包括以往人数
      shareinfo: {}, // 分享信息
      activeboostlist: [] // 我的记录是否有数据
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    uid() {
      return !!(this.user && this.user.uid);
    },
    progress() {
      // 进度条
      let _ = this,
        p = 0.5;
      if (_.totalnum >= _.moniInfo.grandconfigtotal) p = 98;
      else if (_.totalnum > 0)
        p = (_.totalnum / _.moniInfo.grandconfigtotal) * 100;
      else p = 0.5;
      return p;
    }
  },
  beforeCreate() {
    (function(win, doc) {
      if (!win.addEventListener) return;
      var html = doc.documentElement;

      function setFont() {
        var cW = html.clientWidth;
        cW = cW > 750 ? 750 : cW < 320 ? 320 : cW;
        html.style.fontSize = 100 * (cW / 750) + "px";
      }
      win.addEventListener("resize", setFont, false);
      setFont();
    })(window, document);
  },
  mounted() {
    let _ = this;
    // _.modaltype = 1;
    // _.isshowmodal = true;
    window.callbacklogin = json => {
      if (json) {
        _.getQueryParamUser(json)
          .then(res => {
            // _.log("app登录成功");
            _.monitor();
          })
          .catch(err => {
            console.error("登录失败", err);
          });
      } else _.toast("获取登录信息失败~");
    };
    if (lavetimer) clearInterval(lavetimer);
    // 获取app 地址栏传参
    if (_.$root.ISAPP) {
      _.javascriptBridge({
        name: "getAppActivityShareContent",
        params: {
          hideshareicon: true
        }
      });
      _.getQueryParamUser()
        .then(res => {
          // 登录成功 处理事件
          // _.log("app地址栏参数登录成功");
          _.monitor();
        })
        .catch(err => {
          console.error("参数获取失败", err);
        });
    } else if (_.uid) {
      // h5 登录态时 需处理的事件
      _.monitor();
    }
  },
  methods: {
    monitor() {
      // 监控卡主接口
      let _ = this;
      let files = "https://files.eyee.com/eyeeh5/img/monitor/";
      if (_.uid) {
        Mymonitorinfo()
          .then(res => {
            if (res) {
              // loader.close()
              _.moniInfo = res;
              if (res.boostconfigtotal)
                if (res.boostlist && res.boostlist.length) {
                  _.friendheader = new Array(res.boostconfigtotal);
                  // 头像处理
                  res.boostlist.map((i, index) => {
                    if (i) {
                      _.friendheader[index] = i;
                    }
                    return _.friendheader;
                  });
                } else _.moniInfo.boostlist = [];
              _.totalnum = res.extracount || 0;
              // activitytype: 0, // 活动状态 0 未激活 1 已激活 2 已过期 3 已领完 库存不足
              _.activitytype = res.status || 0;
              _.monitorcardid = res.monitorcardid;
              // 倒计时
              lavetimer && clearInterval(lavetimer);
              res.expiredtime > 0 && _.countdown(res.expiredtime);

              switch (_.activitytype) {
                case 0:
                  if (res.boostcount >= res.boostconfigtotal)
                    _.btntxt = "继续邀请好友，获取更多天数";
                  else _.btntxt = `邀请好友一起解锁`;
                  _.statuspath = `${files}mon_not_act.png`;
                  break;
                case 1:
                  _.statuspath = `${files}mon_has_act.png`;
                  _.btntxt = "继续邀请好友，获取更多天数";
                  break;
              }
              if (res.activeboostlist && res.activeboostlist.length)
                _.activeboostlist = res.activeboostlist;
              else _.activeboostlist = [];
            }
          })
          .catch(err => {
            console.error("err---", err);
          });
      }
    },
    getcard(receivetype) {
      //  monitorcardid    	监控卡ID		String	当receivetype=1是此字段必填
      // receivetype	激活类型	必填	int	1：助力类型激活 2：额外奖励激活
      let _ = this;
      if (_.inof) {
        _.inof = false;
        MonitorCard({ monitorcardid: _.monitorcardid, receivetype })
          .then(res => {
            _.inof = true;
            if (res.receivecode == 200) {
              document.body.classList.add("lock");
              _.modalcardtype = res.monitorcardtype;
              _.enum(res.monitorcardtype, 2);
              _.modaltype = 1;
              _.isshowmodal = true;
              if (_.moniInfo.extracount == _.moniInfo.grandconfigtotal)
                _.reset();
            }
          })
          .catch(err => {
            _.toast((err && err.msg) || "当前用户助力数不足~");
            _.goActivity();
            _.inof = true;
            console.error(err);
          });
      }
    },
    enum(type, source, title = "") {
      let _ = this,
        t = _.modalDay;
      // t = source == 1 ? _.monitorcardtype : _.modalDay;
      for (let key in enumdata) {
        if (type == 9) t = `永久${title ? "卡" : ""}`;
        else if (enumdata[key].type == type) t = enumdata[key].days + title;
      }
      _.modalDay = t;
      // if (source == 1) _.monitorcardtype = t;
      // else _.modalDay = t;
    },
    lotter() {
      let _ = this;
      _.loadcallback(() => {
        // 调用领取接口
        let type = 1;
        if (
          _.moniInfo.threepersionreceive == 1 &&
          _.moniInfo.boostlist &&
          _.moniInfo.boostlist.length &&
          _.moniInfo.boostlist.length >= 15
        )
          type = 2;
        _.getcard(type);
      });
    },
    goshare(item) {
      // 空头像点击 去分享  记得判断 是否有库存
      let _ = this;
      _.loadcallback(() => {
        $log({
          e: "monitorShareClick",
          p: { btnOrheaderClick: 2, describe: "监控卡头像点击分享" }
        });
        _.goActivity();
      });
    },
    goActivity(type) {
      // 按钮点击
      let _ = this;
      _.loadcallback(() => {
        Cardshareinfo({ cardid: _.monitorcardid })
          .then(res => {
            _.shareinfo = res;
            _.modaltype = 2;
            _.isshowmodal = true;
            document.body.classList.add("lock");
            $log({
              e: "monitorShareClick",
              p: { btnOrheaderClick: 1, describe: "监控卡底部按钮点击分享" }
            });
            // if (type == 1) _.shareToFriend();
            // else {

            // }
          })
          .catch(e => {
            console.error("分享数据获取失败", e);
          });
      });
    },
    reset() {
      let _ = this;
      Lssuemonitorcard()
        .then(res => {
          _.friendheader = new Array(2);
          _.newaddday = 0;
          if (res && res.monitorcardid) _.monitor();
        })
        .catch(e => {
          console.error(e);
          _.toast((e && e.msg) || "");
        });
    },
    sercard() {
      this.$router.push("/about/sercard");
    },
    close() {
      // 关闭弹框
      let _ = this;
      _.isshowmodal = false;
      document.body.classList.remove("lock");
      _.monitor();
    },
    loadcallback(callback = () => {}) {
      // 是否在app 以及是否登录判断
      let _ = this;
      if (_.$root.ISAPP) {
        if (!_.uid) {
          console.log("调用APP登录");
          _.callAppLogin();
          return;
        } else callback();
      } else _.$refs.load.$el.click();
    },
    countdown(time) {
      // 倒计时
      let _ = this;
      $timer(
        (timer, count) => {
          lavetimer = timer;
          time--;
          _.datatime = FormatSeconds(time, 1);
          if (_.datatime === "end") {
            // console.log("倒计时结束");
            clearTimeout(lavetimer);
            _.datatime = "00 : 00 : 00";
            _.monitor();
          }
        },
        1000,
        1
      );
    },
    callAppLogin() {
      this.javascriptBridge({
        name: "callAppLoginPage",
        params: { callbackname: "callbacklogin" }
      });
    },
    // 生成图片
    draw() {
      let _ = this,
        $prod = document.getElementById("posterProd");
      var drawed = false;
      loader = _.$loader("生成图片中···");
      $log({
        e: "monitorShareClick",
        p: { sharetype: 2, describe: "监控卡分享到朋友圈" }
      });
      const doDraw = () => {
        let $layer = document.getElementById("poster");
        // useCORS: true, //（图片跨域相关）
        // allowTaint: false, //允许跨域（图片跨域相关）
        // taintTest: true, //是否在渲染前测试图片
        //  scale: 1.5,
        html2canvas($layer, {
          useCORS: true
        }).then(canvas => {
          // let imageFormat = "image/jpg" || "image/jpg";
          let dataUrl = canvas.toDataURL("image/png", 1.0);
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
      loader = _.$loader("分享图片上传中···");
      Upload({ stream: data.split(",")[1] })
        .then(res => {
          console.log("Upload res: ", res);
          if (res && res.url) {
            _.setPosterUrl(res.url);
          } else _.toast("分享图片上传失败~");
        })
        .catch(e => {
          console.error("Upload error: ", e);
          _.toast("分享图片上传失败~");
          loader.close();
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
    shareToFriend() {
      let _ = this;
      if (_.$root.ISAPP) {
        loader = _.$loader("正在调起微信分享···");
        $log({
          e: "monitorShareClick",
          p: { sharetype: 1, describe: "监控卡分享到好友" }
        });
        let sinfo = _.shareinfo.shareinfo;
        _.javascriptBridge({
          name: "callAppDirectlyShare",
          params: {
            sharecontent: sinfo.content || sinfo.title,
            sharetitle: sinfo.title || sinfo.content,
            xcxurl: sinfo.xcxurl,
            xcxicon: sinfo.xcxicon,
            xcxid: sinfo.xcxid || "gh_038ca9308eac",
            shareurl: "",
            type: 2,
            platform: 2,
            callbackname: "_shareCallBack"
          }
        });
        setTimeout(() => {
          loader.close();
        }, 3000);
      }
    },
    shareToWechat() {
      let _ = this;
      // console.log("shareToWechat:", _.posterUrl);
      if (_.$root.ISAPP) {
        loader = _.$loader("正在调起微信分享···");
        _.javascriptBridge({
          name: "callAppDirectlyShare",
          params: {
            sharepicurl: _.posterUrl,
            type: 1,
            platform: 1,
            callbackname: "_shareCallBack"
          }
        });
        setTimeout(() => {
          loader.close();
        }, 3000);
      } else _.toast("请在斗牛APP中进行分享~");
    }
  },
  destroyed() {
    document.body.classList.remove("lock");
  }
};
</script>
<style>
body,
html {
  background: #31343d !important;
}
</style>
<style scoped lang="scss">
// 尺寸
$px: 0.02rem;
.monitor {
  // min-height: 100vh;
  overflow: hidden;
  background: #31343d;
  position: relative;
  padding-bottom: 80 * $px;
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
  .position-abs {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  img {
    display: block;
    width: 100%;
  }
  .monitor_card_box {
    background: #31343d;

    .card {
      width: 270 * $px;
      margin: 35 * $px 0 15 * $px 25 * $px;
      img {
        position: relative;
        top: 2 * $px;
      }
    }
    .monitor_card_item {
      padding-right: 6 * $px;
      margin-bottom: 6 * $px;
      // padding: 20 * $px 20 * $px 0 20 * $px;
      position: relative;
      .vip {
        position: absolute;
        left: 35 * $px;
        top: 74 * $px;
        width: 158 * $px;
      }
      .tag {
        position: absolute;
        width: 63 * $px;
        height: 31 * $px;
        right: 45 * $px;
        bottom: 68 * $px;
      }
    }
  }
  .wrap-moni {
    padding: 0 15 * $px 0;
    margin-bottom: 30 * $px;
    .code_info_box {
      background: #383b4a;
      overflow: hidden;
      padding: 29 * $px 20 * $px 40 * $px;
      border-radius: 6 * $px;
      .code_tit {
        margin: 0 19 * $px 10 * $px 19 * $px;
        .tit-1 {
          width: 3.733vw;
        }
        .tit-2 {
          width: 62.4vw;
        }
        .txt {
          color: #edcbad;
          font-size: 4.8vw;
          font-weight: bold;
          margin: 0 0.5333vw 0 2.1333vw;
        }
        span {
          position: relative;
          .point {
            width: 4 * $px;
            height: 4 * $px;
            border-radius: 50%;
            background: #454240;
            display: inline-block;
            margin: 0 6 * $px;
          }
          &::before,
          &::after {
            content: "";
            width: 14px;
            height: 8px;
            background: url("https://files.eyee.com/eyeeh5/img/monitor/point_img.png")
              0 0 no-repeat;
            background-size: cover;
            position: absolute;
            left: -22 * $px;
            top: 50%;
            transform: translateY(-50%);
          }
          &::after {
            left: auto;
            right: -22 * $px;
          }
        }
      }
      .countdown {
        color: #edcbad;
        font-size: 13 * $px;
        font-weight: bold;
        padding: 11 * $px 22 * $px;
        border-radius: 20 * $px;
        background: #3e4150;
        width: 193 * $px;
        margin: 0 auto;
        span {
          display: inline-block;
          padding-top: 2 * $px;
          letter-spacing: 1px;
        }
      }

      .share-fri {
        padding-top: 22 * $px;
        .con {
          .header {
            margin-bottom: 30 * $px;
            .list {
              width: 42 * $px;
              font-size: 12 * $px;
              position: relative;
              flex: 1;
              &:last-child {
                margin-right: 0;
              }
              .newusertxt {
                background: url("https://files.eyee.com/eyeeh5/img/monitor/mon_new_add.png")
                  0 0 no-repeat;
                background-size: cover;
                width: 58 * $px;
                height: 39 * $px;
              }
              .bg {
                width: 42 * $px;
                height: 42 * $px;
                border-radius: 50%;
                overflow: hidden;
                color: #61636e;
                font-size: 24 * $px;
                font-weight: bold;
                border: 1px dashed #61636e;
                margin-bottom: 7 * $px;
                background: url("https://files.eyee.com/eyeeh5/img/monitor/add.png")
                  center center no-repeat;
                background-size: 35% 35%;
                img {
                  width: 100%;
                  height: 100%;
                }
                &.not-border {
                  border: 0;
                }
              }
            }
          }
          .progress-bar-txt {
            font-size: 12 * $px;
            font-weight: bold;
            color: #b9babf;
            margin-bottom: 4 * $px;
            font-family: Arial, Helvetica, sans-serif;
          }
          .progress-bar {
            .bar {
              height: 10 * $px;
              border: 1px dashed #61636e;
              border-radius: 5 * $px;
              position: relative;
              width: 248 * $px;
              i {
                display: inline-block;
                min-width: 6 * $px;
                height: 6 * $px;
                border-radius: 3 * $px;
                background: #e6d0bc;
                position: absolute;
                left: 1%;
                top: 50%;
                transform: translateY(-50%);
              }
            }
            .get-lot {
              padding: 4 * $px 9 * $px;
              background: linear-gradient(to right top, #d4baa3, #ecded4);
              color: #4a4038;
              font-size: 12px;
              font-weight: bold;
              border-radius: 2 * $px;
              font-weight: bold;
              font-family: Arial, Helvetica, sans-serif;
              // &.act {
              //   background: #232323;
              // }
            }
          }
        }
      }
    }
  }
  .record {
    padding: 0 15 * $px;
    margin-bottom: 40 * $px;
    .re-con {
      .title {
        margin: 0 5 * $px 16 * $px;
        .img {
          font-size: 18 * $px;
          color: #edcbad;
          font-weight: bold;
          width: 108 * $px;
        }
        .data-time {
          color: #98999e;
          font-size: 12 * $px;
        }
      }
      .list {
        padding: 19 * $px 20 * $px 18 * $px 20 * $px;
        border-radius: 6 * $px;
        background: #383b4a;
        color: #9b9da4;
        font-size: 12 * $px;
        font-weight: bold;
        margin-bottom: 12 * $px;
        &:last-child {
          margin-bottom: 0;
        }
        .date {
          line-height: 20 * $px;
          // overflow: hidden;
          width: 110 * $px;
          white-space: nowrap;
          .newuser {
            color: #383b4a;
            font-size: 12 * $px;
            font-weight: bold;
            padding: 3 * $px 12 * $px;
            background: #9b9da4;
            height: 22 * $px;
            border-radius: 11 * $px;
            line-height: 22 * $px;
          }
        }
        .card-type {
          color: #b4b5ba;
          // line-height: 24 * $px;
          text-align: right;
          letter-spacing: -0.5 * $px;
          font-family: Arial, Helvetica, sans-serif;
          .day {
            font-size: 15 * $px;
            white-space: nowrap;
            margin-bottom: 2 * $px;
          }
          .use-des {
            font-size: 12 * $px;
            white-space: nowrap;
          }
        }
      }
      .emy {
        background: #383b4a;
        color: #595c69;
        font-size: 14 * $px;
        padding: 21 * $px 0 40 * $px 0;
        border-radius: 6 * $px;
        .de-img {
          width: 90 * $px;
          height: 90 * $px;
          margin: 0 auto;
        }
      }
    }
  }
  .scroll {
    width: 100%;
    height: 30px;
    border: 1px solid #ccc;
    overflow: hidden;
    .list {
      height: 30px;
      width: 90%;
      line-height: 30px;
    }
    .anim {
      transition: all 0.8s ease;
      margin-top: -30px;
    }
  }
  .btn_box {
    width: 100%;
    max-width: 750px;
    background: #31343d;
    position: fixed;
    left: 50%;
    right: 0;
    bottom: 0;
    transform: translateX(-50%) translateZ(0);
    padding: 0 15 * $px 27 * $px;

    .btn {
      height: 50 * $px;
      width: 100%;
      font-size: 16 * $px;
      font-family: Arial, Helvetica, sans-serif;
      font-weight: bold;
      color: #413830;
      border-radius: 8 * $px;
      background: url("https://files.eyee.com/eyeeh5/img/monitor/mon_btn_bg.png")
        0 0 no-repeat;
      background-size: 100% 100%;
      // background: linear-gradient(to right, #d4baa3, #d4baa3, #f5e6d9);
      &.over {
        background: #cdcdcd;
      }
    }
  }
  .mall-modal {
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: transparent;
    transition: background 0.3s ease-in;
    .conglat {
      background: url("https://files.eyee.com/eyeeh5/img/monitor/mon_modal_bg.png")
        0 0 no-repeat;
      background-size: 100% 100%;
      width: 275 * $px;
      // height: 323 * $px;
      color: #744925;
      box-sizing: border-box;
      padding: 40 * $px 28 * $px 0;
      font-size: 18 * $px;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 25 * $px;
      transform: translate(-50%, -200vh);
      transition: transform 0.2s ease-in;
      overflow: hidden;
      .day {
        font-size: 57 * $px;
        color: #efd9c3;
        font-family: "OswaldBold";
        margin-top: 25 * $px;
        &.yjk {
          width: 117 * $px;
          height: 39 * $px;
          margin: 25 * $px auto 0;
        }
        i {
          font-size: 17 * $px;
          font-style: normal;
          margin-left: 10 * $px;
          position: relative;
          top: 13 * $px;
          // margin-top: 10px;
        }
      }
      .txt {
        margin: 70 * $px 0 4 * $px 12 * $px;
      }
      .data {
        margin-bottom: 33 * $px;
        margin-left: 12 * $px;
      }
      .btn {
        height: 44 * $px;
        background: linear-gradient(to right, #41403e, #20251f);
        color: #efd2b9;
        font-size: 14 * $px;
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
        border-radius: 6 * $px;
        margin-bottom: 30 * $px;
      }
    }
    .contend {
      width: 100%;
      margin: 0 auto;
      background: #fff;
      position: absolute;
      left: 0;
      bottom: 0;
      padding: 52 * $px 15 * $px 35 * $px;
      border-radius: 10 * $px 10 * $px 0 0;
      transform: translate(-50%, 200vh);
      transition: transform 0.2s ease-in;
      .close {
        width: 20 * $px;
        height: 20 * $px;
        position: absolute;
        right: 15 * $px;
        top: 15 * $px;
      }
      .title {
        color: #31343d;
        font-size: 17 * $px;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bold;
        margin-bottom: 40 * $px;
      }
      .share {
        height: 50 * $px;
        width: 100%;
        background: #31343d;
        color: #fff;
        font-size: 16 * $px;
        border-radius: 6 * $px;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: bold;
        &.wec {
          border: 1px solid #31343d;
          background: none;
          color: #31343d;
          margin-top: 10 * $px;
        }
      }
    }
    &.act {
      pointer-events: unset;
      background: rgba(0, 0, 0, 0.4);
      .contend {
        transform: translate(0, 0);
      }
      .conglat {
        transform: translate(-50%, -50%);
      }
    }
  }

  .share-img {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: -999;
    transform: translateY(1000px);
    .wrap-cont {
      color: #232323;
      width: 335 * $px;
      background: #31343d;
      overflow: hidden;
      position: relative;
      .user-header {
        position: absolute;
        left: 27 * $px;
        top: 31 * $px;
        box-sizing: border-box;
        .header {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 11 * $px;
          border: 1px solid #fff;
        }
        .name {
          font-size: 13 * $px;
          color: #fff;
          font-weight: bold;
          width: 245 * $px;
        }
      }
      .qrcode {
        padding: 25 * $px 0;
        background: #fff;
        .qr-img {
          width: 70 * $px;
          height: 70 * $px;
          margin-right: 11 * $px;
        }
        .txt-info {
          width: 98 * $px;
          height: 48 * $px;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>