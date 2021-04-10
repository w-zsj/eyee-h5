<template>
  <div v-if="hasdata" class="store-shop">
    <loader-app class="load" ref="load" from="11" :id="activityid" v-if="!$root.ISAPP">
      <img src="/static/img/bull/download_app.png?c=1" alt />
    </loader-app>
    <div
      class="content"
      :style="{backgroundImage : 'url(' + storeInfo.headimg + ')', backgroundRepeat:'no-repeat', backgroundPosition:'0 0', backgroundSize: '100% auto'}"
    >
      <!-- 地址 -->
      <div class="address">{{storeInfo.activitytime}}{{storeInfo.site}}</div>
      <!-- 商品信息版块 -->
      <section
        class="product-info"
        :style="{backgroundImage : 'url(' + storeInfo.backgroundimg + ')', backgroundRepeat:'no-repeat', backgroundPosition:'0 0', backgroundSize: '100% auto'}"
      >
        <div class="douwn flex-center">
          <em>{{isend?"活动报名已结束":"报名截止"}}</em>
          <span v-if="!isend">{{datatime}}</span>
        </div>
        <div class="pro-img pro-img-1" @click="goAppDetail(storeInfo.productid)"></div>
        <div
          class="pro-name ellipsis-2"
          style="-webkit-box-orient: vertical;"
        >{{storeInfo.productname}}</div>
        <div class="price flex-between">
          <div class="sell-price flex-aic">
            <span class="active">活动价￥</span>
            <span class="cur-price">{{storeInfo.price}}</span>
          </div>
          <div class="mark-price">参考价￥{{storeInfo.marketprice}}</div>
        </div>
        <div class="sign-enter flex-between">
          <div class="flex-between btn1 btn" @click.stop="clickCode">
            <span class>{{signUpTxt}}</span>
          </div>
          <div class="flex-between btn2 btn">
            <span class @click.stop="shareToWechat">转发好友</span>
          </div>
        </div>
        <!-- 抽奖码 -->
        <div class="lotter">
          <div class="code" v-if="activitycode">
            <p class="tit">我的活动码</p>
            <p class="codeText">{{activitycode}}</p>
            <p class="exp1">凭中签短信和活动码到线下门店参与抽签</p>
            <p class="exp" @click="lookExp">
              <span>使用说明</span>
              <i></i>
            </p>
          </div>
        </div>
      </section>

      <!-- 更多活动商品 -->
      <div
        class="more-pro"
        v-if="storeInfo.moreproductlist && storeInfo.moreproductlist.length > 0"
      >
        <div class="title">更多活动商品</div>
        <div class="cont flex-btwn flex-wrap">
          <div
            class="list"
            @click="goAppDetail(item.productid)"
            v-for="(item,index) in storeInfo.moreproductlist"
            :key="index+'rec'"
          >
            <div class="pro-img">
              <img :src="item.productimage" />
            </div>
            <div
              class="pro-name ellipsis-2"
              style="-webkit-box-orient: vertical;"
            >{{item.productname}}</div>
            <div class="price">
              <span class="fress" v-if="item.price">￥{{item.price}}</span>
              <span class="fress" v-else>免费</span>
              <span class="mark-price">￥{{item.marketprice}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 活动规则 -->
      <div class="rule">
        <div class="title">活动规则</div>
        <div class="cont">
          <p>报名截止时间：2019年10月11日上午10:00。</p>
          <p style="margin-bottom:18px;">中签短信通知：2019年10月11日下午2:00-6:00。</p>
          <p>线下抽签时间：2019年10月12日下午3:00。</p>
          <p style="margin-bottom:18px;">发售店铺地址：上海徐汇区田林路140号9号楼斗牛门店。</p>
          <p style="margin-bottom:18px;">详细活动规则：10月11日收到中签短信后，10月12日下午3:00到线下门店，出示中签短信和活动码，参与二次抽签。</p>
          <p style="margin-bottom:18px;">由于本次活动商品数量有限，故购买现场不提供试穿，产品一经购买不能退换。</p>
          <p>在法律允许的范围内，斗牛官方保留变更、调整、终止本次活动及活动规则的权利。</p>
        </div>
      </div>
    </div>

    <!-- 登录组件 -->
    <login :isShow="loginmodal" @close="close" @loginSuc="loginSuc"></login>

    <!-- 公共弹框 -->
    <div class="compBox" :class="{'act':showmodal}" @click="close">
      <div class="cont" @click.stop.prevent>
        <div class="title">
          <img
            class="img1"
            v-if="status == 1"
            src="https://files.eyee.com/eyeeh5/img/store/txt2.png"
          />
          <img
            class="img2"
            v-else-if="status == 2"
            src="https://files.eyee.com/eyeeh5/img/store/txt3.png"
          />
          <img
            class="img3"
            v-else-if="status == 3"
            src="https://files.eyee.com/eyeeh5/img/store/txt4.png"
          />
          <img
            class="img4"
            v-else-if="status == 4"
            src="https://files.eyee.com/eyeeh5/img/store/txt5.png"
          />
          <img
            class="img5"
            v-else-if="status == 5"
            src="https://files.eyee.com/eyeeh5/img/store/txt6.png"
          />
        </div>
        <!-- 报名成功 -->
        <div class="msg" v-if="status == 1">
          <div class="msg_info">收到中签短信后，凭中签短信</div>
          <div class="msg_info">和活动码到线下门店参与抽签</div>
        </div>
        <!-- 报名人数已满 -->
        <div class="msg" v-else-if="status == 2">
          <div class="msg_info">本场活动报名人数已满，</div>
          <div class="msg_info" v-if="!$root.ISAPP">
            下载
            <span>斗牛APP</span>，关注下次活动
          </div>
          <div v-else class="msg_info">请关注下次门店活动</div>
        </div>
        <!-- 活动已结束 -->
        <div class="msg" v-else-if="status == 3">
          <div class="msg_info">本场活动已经结束，</div>
          <div class="msg_info" v-if="!$root.ISAPP">
            下载
            <span>斗牛APP</span>，关注下次活动
          </div>
          <div v-else class="msg_info">请关注下次门店活动</div>
        </div>
        <!-- 查看完整活动码 -->
        <div class="msg marb" v-else-if="status == 4">
          <div class="msg_info">收到中签短信后，凭中签短信</div>
          <div class="msg_info">和活动码到线下门店参与抽签</div>
        </div>
        <!-- H5点击商品 查看 -->
        <div class="msg" v-else-if="status == 5">
          <div class="msg_info">
            下载
            <span>斗牛APP</span>，查看商品详情
          </div>
          <div class="msg_info">和更多活动信息</div>
        </div>
        <div class="showCodeBox" v-if="status == 4">{{activitycode}}</div>
        <div class="btn_B flex-center">
          <div class="btn" v-if="status == 1" @click="close">知道了</div>
          <div class="btn" v-else-if="status == 2 || status == 3 || status == 5">
            <div v-if="!$root.ISAPP">
              <loader-app class="load" ref="load" from="11" :id="activityid">下载斗牛APP</loader-app>
            </div>
            <div v-else @click="close">知道了</div>
          </div>
          <div class="btn_b flex-center" v-else-if="status == 4">
            <div v-if="!$root.ISAPP" class="btn3" @click="close">稍后查看</div>
            <div v-if="!$root.ISAPP" class="btn4">
              <loader-app
                class="load"
                ref="load"
                from="11"
                :id="activityid"
                v-if="!$root.ISAPP"
              >立即查看</loader-app>
            </div>
            <div class="btn" v-if="$root.ISAPP" @click="close">知道了</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 微信分享弹框 -->
    <div class="load-modal act" @click="close" v-if="shareModal">
      <div>
        <img src="https://files.eyee.com/activity/redpacket/share_guide.png" alt />
        <p>1. 点击右上角【···】</p>
        <p>2. 选择【发送给好友或分享到朋友圈】</p>
      </div>
    </div>
  </div>
  <!-- 缺省页面 -->
  <div v-else class="empty flex-col flex-center">
    <img src="https://files.eyee.com/eyeeh5/img/image_empty.png" alt />
    {{errorMsg}}
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { FormatSeconds } from "@/common/util";
import LoaderApp from "@/comps/Loader";
import {
  StoreActivityinfo,
  StoreUserinfo,
  StoreApply
} from "@/common/api/lotter";
import login from "@/comps/comLogin";
let lavetimer = null,
  loader;
const elBody = document.getElementsByTagName("body")[0];
export default {
  components: { login, LoaderApp },
  data() {
    return {
      hasdata: 1,
      files: "https://files.eyee.com/eyeeh5/img/store/",
      storeInfo: {}, // 主页面信息
      shareinfo: {}, // 分享信息
      loginmodal: false, // 登录弹框
      shareModal: false, //微信内提示分享
      datatime: "00:00:00", // 倒计时
      activityid: "", // 活动id
      activitycode: "", //活动码
      isend: false, // 活动是否结束
      applystatus: 0, // 0 立即报名 1 已经报名 2 报名已结束
      signUpTxt: "立即报名", // 立即报名 已经报名 报名已结束
      showmodal: false,
      status: 0,
      errorMsg: "暂无数据，稍后再试~~"
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    uid() {
      return !!(this.user && this.user.uid);
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
    if (lavetimer) clearInterval(lavetimer);
    // 登录回调
    window.callbacklogin = json => {
      if (json) {
        _.getQueryParamUser(json)
          .then(res => _.applyinfo()) // console.log("app登录成功");
          .catch(err => console.error("登录失败", err));
      } else _.toast("获取登录信息失败~");
    };

    // 页面信息接口
    _.mainreq().then(activityid => {
      // 获取app 地址栏传参
      if (_.$root.ISAPP) {
        _.getQueryParamUser()
          .then(res => _.applyinfo(activityid)) // 登录成功 处理事件
          .catch(err => console.error("参数获取失败", err));
      } else if (_.uid) _.applyinfo(activityid); // h5 登录态时 需处理的事件
    });
  },
  methods: {
    log() {
      var args = Array.prototype.slice.call(arguments),
        fr = args[0];
      args.shift();
      args.unshift(fr + "---->>>");
      console.log.apply(console, args);
    },
    close(e) {
      let _ = this;
      elBody.classList.remove("lock");
      e && _.log(e);
      _.showmodal = false;
      _.shareModal = false;
      _.status = 0;
      _.loginmodal = false;
    },
    loginSuc() {
      let _ = this;
      // h5 登录成功回调  重新请求 用户报名接口
      _.signCode(_.activityid);
    },
    // 活动页面信息
    mainreq() {
      let _ = this;
      return new Promise((resolve, reject) => {
        StoreActivityinfo()
          .then(res => {
            if (res) {
              _.log("主接口信息", res);
              _.storeInfo = res;
              _.shareinfo = res.share;
              if(_.shareinfo) {
                if (_.$root.ISAPP) {
                  _.javascriptBridge({
                    name: "getAppActivityShareContent",
                    params: {
                      sharetitle: '斗牛APP线下店开业！YEEZY350“做旧天使”原价发售！',
                      sharecontent: _.shareinfo.content,
                      sharepicurl: _.shareinfo.icon,
                      shareurl: _.shareinfo.url
                    }
                  });
                } else {
                  _.initShare({
                    type: 2,
                    info: {
                      title: '斗牛APP线下店开业！YEEZY350“做旧天使”原价发售！',
                      url: _.shareinfo.url,
                      img: _.shareinfo.icon,
                      desc: _.shareinfo.content
                    }
                  });
                }
              }
              // 倒计时
              if (lavetimer) clearInterval(lavetimer);
              if (res.applyendtimesecond > 0) {
                _.countdown(res.applyendtimesecond);
                _.isend = false;
              } else {
                _.isend = true;
                _.signUpTxt = "报名已结束";
              }
              //   活动id
              if (res.activityid) {
                _.activityid = res.activityid + "";
                resolve(_.activityid);
              }
            }
          })
          .catch(e => {
            _.hasdata = 0;
            if (e.code == 1511412)
              _.errorMsg = (e && e.msg) || "暂无数据，稍后再试~~";
            else _.errorMsg = "暂无数据，稍后再试~~";
            // _.toast((e && e.msg) || "");
            console.error(e);
          });
      });
    },
    // 立即报名 已经结束报名 已经报名
    clickCode() {
      let _ = this;
      if (_.applystatus == 1) {
        _.toast("已报名！");
        return;
      } else if (_.isend || _.applystatus == 2) {
        // 报名已结束
        _.showmodal = true;
        _.status = 3;
        elBody.classList.add("lock");
        return;
      }
      if (_.$root.ISAPP) {
        // 判断是否登录 走app的登录
        if (!_.uid) {
          _.callAppLogin();
        } else {
          _.signCode(_.activityid);
        }
      } else {
        // 判断是否登录 走H5的登录
        if (!_.uid) {
          _.loginmodal = true;
          elBody.classList.add("lock");
        } else {
          _.signCode(_.activityid);
        }
      }
    },
    // app 登录 交互
    callAppLogin() {
      this.javascriptBridge({
        name: "callAppLoginPage",
        params: { callbackname: "callbacklogin" }
      });
    },
    // 用户报名状态信息 接口
    applyinfo(activityid) {
      let _ = this;
      if (!activityid) activityid = _.activityid || "";
      StoreUserinfo({ activityid })
        .then(res => {
          if (res) {
            _.log("用户报名状态信息", res);
            _.applystatus = res.applystatus || 0; //#报名状态 0.未报名 1.已报名
            if (_.storeInfo && _.storeInfo.applyendtimesecond <= 0) {
              _.applystatus = 3; // 已结束
            }
            switch (_.applystatus) {
              case 0:
                // 未报名
                _.signUpTxt = "立即报名";
                break;
              case 1:
                // 已报名
                _.signUpTxt = "已经报名";
                break;
              case 3:
                // 已结束
                _.signUpTxt = "报名已结束";
                break;
            }
            _.activitycode = res.activitycode || ""; //#活动码
            if (!_.$root.ISAPP && _.activitycode) {
              let acl = _.activitycode.length;
              var sub = _.activitycode.substr(acl - 2, acl);
              _.activitycode = _.activitycode.replace(sub, "**");
            }
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    //   报名接口
    signCode(activityid) {
      let _ = this,
        title,
        content;
      //   applystatus: 1, // 0 立即报名 1 已经报名 2 报名已结束
      StoreApply({ activityid })
        .then(res => {
          _.applyinfo(activityid);
          _.showmodal = true;
          _.status = 1;
          elBody.classList.add("lock");
        })
        .catch(e => {
          console.error(e);
          if (e && e.code === 1511413) {
            _.showmodal = true;
            _.status = 2;
            elBody.classList.add("lock");
          }
        });
    },
    // 跳APP商品详情
    goAppDetail(productid) {
      let _ = this;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "gotoAppSneakerDetailPage",
          params: {
            productid
          }
        });
      } else {
        _.showmodal = true;
        _.status = 5;
        elBody.classList.add("lock");
      }
    },

    countdown(time) {
      // 倒计时
      let _ = this;
      $timer(
        (timer, count) => {
          lavetimer = timer;
          time--;
          _.datatime = FormatSeconds(time, 2);
          if (_.datatime === "end") {
            _.isend = true;
            clearTimeout(lavetimer);
            _.datatime = "00:00:00";
            _.mainreq().then(res => _.applyinfo(res));
          } else {
            _.isend = false;
          }
        },
        1000,
        1
      );
    },
    shareToWechat() {
      let _ = this;
      // "sharecontent":"分享内容",
      //     "sharepicurl":"分享图片地址",
      //     "shareurl":"分享链接",
      //     "sharetitle":"分享标题",
      //     "callbackname":"分享结果回调方法名",
      //     "xcxurl":"小程序的分享地址",
      //     "xcxicon":"小程序的封面图",
      //     "xcxid":"小程序的原始id",
      //     "type":"分享内容内型，1：是分享图片，2：是分享H5链接",
      //     "platform":"分享平台，1：是分享到朋友圈，2：是分享给微信好友"
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: "callAppDirectlyShare",
          params: {
            shareurl: _.shareinfo.url,
            sharepicurl: _.shareinfo.icon,
            sharetitle: '斗牛APP线下店开业！YEEZY350“做旧天使”原价发售！',
            sharecontent: _.shareinfo.content,
            type: 2,
            platform: 2,
            callbackname: ""
          }
        });
      } else {
        _.shareModal = true;
        elBody.classList.add("lock");
      }
    },
    // 查看活动使用说明
    lookExp() {
      let _ = this;
      _.showmodal = true;
      _.status = 4;
      elBody.classList.add("lock");
    }
  },
  destroyed() {
    elBody.classList.remove("lock");
  }
};
</script>
<style scoped lang="scss">
// 尺寸
$px: 0.02rem;
.store-shop {
  background: linear-gradient(to bottom, #000000, #414141);
  min-height: 100vh;
  font-size: 12 * $px;
  font-family: Arial, Helvetica, sans-serif;
  .content {
    padding: 319 * $px 15 * $px 40 * $px;
    position: relative;
    .address {
      position: absolute;
      font-style: italic;
      left: 40 * $px;
      top: 124 * $px;
      font-size: 12 * $px;
      color: #fff;
      font-weight: bold;
      text-align: left;
    }
    .product-info {
      padding: 22 * $px 10 * $px 0 * $px;
      margin-bottom: 20 * $px;
      min-height: 515 * $px;
      box-sizing: border-box;
      .douwn {
        width: 250 * $px;
        height: 48 * $px;
        margin: 0 auto 10 * $px;
        font-weight: bold;
        font-family: "DIN";
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        em {
          font-size: 16 * $px;
          padding-top: 3 * $px;
        }
        span {
          font-size: 28 * $px;
          margin-left: 10 * $px;
        }
      }
      .pro-img {
        width: 305 * $px;
        margin: 0 auto 21 * $px;
        height: 215 * $px;
      }
      .pro-name {
        font-size: 14 * $px;
        color: #fff;
        text-align: center;
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
      }
      .price {
        color: #fff;
        font-size: 16 * $px;
        margin: 0 50 * $px;

        .sell-price {
          margin-right: 10 * $px;
          span {
            font-weight: bold;
            font-family: Arial, Helvetica, sans-serif;
            white-space: nowrap;
            &.cur-price {
              font-size: 30 * $px;
            }
            &.active {
              margin-top: 7 * $px;
            }
          }
        }
        .mark-price {
          white-space: nowrap;
          text-decoration: line-through;
        }
      }
      .sign-enter {
        margin: 19 * $px 25 * $px 23 * $px;
        .btn {
          width: 47.45%;
          padding: 4 * $px;
          border-radius: 6 * $px;
          border: 4 * $px;
          box-sizing: border-box;
          span {
            color: #fff;
            width: 100%;
            color: #fff;
            line-height: 40 * $px;
            text-align: center;
            font-size: 16 * $px;
            font-weight: bold;
            font-family: Arial, Helvetica, sans-serif;
            border-radius: 5px;
          }
        }
        .btn1 {
          background: linear-gradient(
            180deg,
            rgba(255, 231, 145, 1),
            rgba(255, 163, 0, 1),
            rgba(255, 160, 0, 1)
          );
          box-shadow: 0px 4px 0px 0px rgba(73, 24, 1, 1);
          span {
            background: linear-gradient(
              180deg,
              rgba(255, 206, 0, 1) 0%,
              rgba(255, 160, 0, 1) 52%,
              rgba(255, 180, 55, 1) 100%
            );
          }
        }
        .btn2 {
          background: linear-gradient(180deg, #c08dff, rgba(90, 47, 183, 1));
          // box-shadow: 0px 4px 0px 0px rgba(73, 24, 1, 1);
          box-shadow: 0px 4px 0px 0px rgba(9, 2, 80, 0.81);
          span {
            background: linear-gradient(
              180deg,
              rgba(126, 71, 223, 1) 0%,
              rgba(62, 8, 183, 1) 46%,
              rgba(89, 47, 198, 1) 100%
            );
            // box-shadow: 0px 4px 0px 0px rgba(9, 2, 80, 0.81);
          }
        }
      }
      .lotter {
        position: relative;
        width: 325 * $px;
        background: url("https://files.eyee.com/eyeeh5/img/store/code.png") 0 0
          no-repeat;
        background-size: 100% auto;
        padding: 20 * $px 0 0;
        min-height: 40 * $px;
        .code {
          width: 296 * $px;
          // height: 194 * $px;
          height: 0 * $px;
          background: url("https://files.eyee.com/eyeeh5/img/store/lotter_bg.png")
            0 0 no-repeat;
          background-size: 100% auto;
          margin: 0 auto;
          animation: move 2s linear forwards;
          overflow: hidden;
          // padding-top: 36 * $px;
          text-align: center;
          overflow: hidden;
          .tit {
            height: 25 * $px;
            font-size: 18px;
            font-weight: 600;
            color: #232323;
            line-height: 25 * $px;
            margin: 36 * $px auto 10 * $px;
          }
          .codeText {
            height: 49 * $px;
            font-size: 40px;
            font-weight: bold;
            color: #232323;
            line-height: 49 * $px;
            margin-bottom: 7 * $px;
          }
          .exp1 {
            margin-bottom: 8 * $px;
            font-size: 12px;
            font-weight: 400;
            color: #969696;
            height: 17 * $px;
            line-height: 17 * $px;
          }
          .exp {
            height: 17 * $px;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              font-size: 12px;
              font-weight: 400;
              color: #969696;
              height: 17 * $px;
              line-height: 17 * $px;
            }
            i {
              background: url("/static/img/exp.png") 0 0 no-repeat;
              background-size: cover;
              width: 12 * $px;
              height: 12 * $px;
            }
          }
        }
      }
    }
    @keyframes move {
      from {
        height: 0 * $px;
      }
      to {
        height: 194 * $px;
      }
    }
    .more-pro {
      // padding: 10 * $px 0 15 * $px;
      margin-bottom: 20 * $px;
      .title {
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
        color: #fff;
        font-size: 18px;
        margin-bottom: 15 * $px;
      }
      .list {
        width: 49%;
        margin-bottom: 2%;
        border-radius: 10 * $px;
        overflow: hidden;
        background: #fff;
        padding: 10 * $px 5 * $px 15 * $px;
        .pro-img {
          margin-bottom: 10 * $px;
        }
        .pro-name {
          color: #232323;
          font-size: 13 * $px;
          margin: 0 12 * $px 5 * $px;
        }
        .price {
          .fress {
            color: #232323;
            font-weight: bold;
            font-size: 16 * $px;
            margin: 0 10 * $px 0 12 * $px;
            font-family: Arial, Helvetica, sans-serif;
          }
          .mark-price {
            color: #969696;
            font-size: 14 * $px;
            text-decoration: line-through;
            font-family: "DIN";
          }
        }
      }
    }
    .rule {
      .title {
        color: #fff;
        font-size: 18 * $px;
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
        margin-bottom: 15 * $px;
      }
      .cont {
        background: #fff;
        border-radius: 10 * $px;
        padding: 20 * $px;
        font-size: 14 * $px;
      }
    }
  }
  .compBox {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 11;
    pointer-events: none;
    background: transparent;
    display: none;
    &.act {
      display: block;
      pointer-events: unset;
      background: rgba(0, 0, 0, 0.5);
      .cont {
        transform: translate(-50%, -50%);
      }
    }
    .cont {
      position: absolute;
      width: 87.77vw;
      min-height: 96vw;
      background: url("https://files.eyee.com/eyeeh5/img/store/modal_bg_1.png")
        0 0 no-repeat;
      background-size: 100% 100%;
      left: 51.5%;
      top: 45%;
      transform: translate(-50%, -50%);
      transition: transform 0.2s ease-in;
      z-index: 200;
      padding: 65 * $px 35 * $px 10 * $px 22 * $px;
      box-sizing: border-box;
      .title {
        img {
          display: block;
          &.img1 {
            width: 133 * $px;
            height: 32 * $px;
            margin-bottom: 101 * $px;
          }
          &.img2 {
            width: 164 * $px;
            height: 29 * $px;
            margin-bottom: 104 * $px;
          }
          &.img3 {
            width: 142 * $px;
            height: 30 * $px;
            margin-bottom: 103 * $px;
          }
          &.img4 {
            width: 152 * $px;
            height: 32 * $px;
            margin-bottom: 83 * $px;
          }
          &.img5 {
            width: 113 * $px;
            height: 30 * $px;
            margin-bottom: 103 * $px;
          }
        }
      }
      .msg {
        margin-bottom: 30 * $px;
        &.marb {
          margin-bottom: 8 * $px;
          .msg_info {
            font-size: 16 * $px;
            line-height: 25 * $px;
            font-weight: bold;
          }
        }
        .msg_info {
          text-align: center;
          color: #232323;
          font-weight: 600;
          line-height: 26 * $px;
          font-size: 18 * $px;
          span {
            color: #e40030;
          }
        }
      }
      .showCodeBox {
        width: 171 * $px;
        height: 50 * $px;
        line-height: 50 * $px;
        text-align: center;
        background: rgba(255, 249, 249, 1);
        box-shadow: 0px 2px 5px 0px rgba(234, 190, 183, 0.4) inset;
        border-radius: 6 * $px;
        margin: 0 auto 19 * $px;
        color: #e40030;
        font-size: 23px;
        font-weight: bold;
      }
      .btn_B {
        margin-bottom: 32 * $px;
        .btn {
          width: 43vw;
          height: 11.73vw;
          background: linear-gradient(
            180deg,
            rgba(216, 103, 116, 1) 0%,
            rgba(222, 73, 75, 1) 12%,
            rgba(193, 5, 34, 1) 100%
          );
          box-shadow: 0px 2px 5px 0px rgba(83, 0, 14, 1);
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          line-height: 11.73vw;
          text-align: center;
        }
      }
      .btn_b {
        width: 100%;
        .btn3 {
          font-size: 16 * $px;
          font-weight: 600;
          color: rgba(228, 0, 48, 1);
          width: 117 * $px;
          height: 44 * $px;
          line-height: 44 * $px;
          border-radius: 6 * $px;
          border: 1px solid rgba(193, 5, 34, 1);
          margin-right: 15 * $px;
          text-align: center;
        }
        .btn4 {
          width: 117 * $px;
          background: linear-gradient(
            180deg,
            rgba(216, 103, 116, 1) 0%,
            rgba(222, 73, 75, 1) 12%,
            rgba(193, 5, 34, 1) 100%
          );
          border-radius: 6px;
          height: 44 * $px;
          line-height: 44 * $px;
          border-radius: 6 * $px;
          font-size: 16 * $px;
          font-weight: 600;
          color: #fff;
          text-align: center;
        }
      }
    }
  }
}

.empty {
  font-size: 13px;
  color: #969696;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.nav-tab2 {
  font-size: 0.24rem;
}
</style>