<template>
  <div class="pop_box" :class="{'show': css.show}">
    <div class="pi-bg" @click="close()"></div>
    <!-- 选择尺码B可选尺码(单选) || 全网最低价 可选尺码-->
    <div
      class="bottom-box size_box border-D-Box"
      :class="{'border-D': Isinclusion == 3}"
      v-if="curStatus === 4"
    >
      <span class="close ico-X" @click="close()"></span>
      <div class="sizeBox">
        <p class="tit">请选择你的尺码</p>
        <div v-if="Isinclusion != 3">
          <p class="hint" v-if="isAll">本场抢购先到先得！选好之后请及时付款哦~</p>
          <p class="hint" v-else>部分尺码库存暂被抢完，请3分钟后刷新重试</p>
        </div>
        <p class="hint" v-else>“低价尺码” 数量有限，先到先得！请及时支付哦～</p>
        <div class="sizeB">
          <ul class="list">
            <li
              class="sizeItem"
              v-for="(sizeItem,sizeIndex) in sizeList.list"
              :key="sizeIndex"
              :class="{'disable':!sizeItem.num, 'act':(sizeItem.active && Isinclusion != 3), 'current': (sizeItem.active && Isinclusion == 3)}"
              @click="choose(sizeItem)"
            >
              <span :class="{'b_price': Isinclusion == 3}">{{sizeItem.size}}</span>
              <em v-if="sizeList.showprice">￥{{sizeItem.price}}</em>
              <div class="size_status_b" v-if="!sizeItem.num">
                <div class="size_status_text">已抢光</div>
              </div>
              <p class="minprice" v-if="Isinclusion == 3 && sizeItem.isminprice"></p>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="Isinclusion == 3" class="fix-btm p_box">
        <p
          class="p"
          v-if="isMinpriceendCountDown"
          :class="{'cover':!storageSize}"
          @click="buy()"
        >请在 {{timeData_8}} 内完成购买</p>
        <p class="p cover" v-else>马上抢</p>
      </div>
      <p class="next fix-btm" v-else :class="{'cover':!allNum}" @click="nextClick()">下一步</p>
    </div>
    <!-- 选择意向尺码 多选 可反选-->
    <div class="bottom-box bottom-box-f chooseLikeSize" v-else-if="curStatus === 6">
      <span class="close ico-X" @click="close()"></span>
      <div class="sizeBox">
        <p class="tit">请选择{{chooseSizeNum}}个你最想要的尺码</p>
        <p class="hint">尺码随机发放,排名前 {{intentionsizenum}} ,必抽意向尺码之一</p>
        <div class="sizeB">
          <ul class="list">
            <li
              class="sizeItem"
              v-for="(sizeItem,sizeIndex) in chooseSizeList"
              :key="sizeIndex"
              :class="{'act':sizeItem.active}"
              @click="chooseSize(sizeItem)"
            >
              <span>{{sizeItem.size}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="btn_box fix-btm">
        <div class="p" @click="confirm">确认</div>
      </div>
    </div>
    <!-- 登记成功 -->
    <div class="bottom-box bottom-box-f register_success" v-else-if="curStatus === 7">
      <span class="close ico-X" @click="close()"></span>
      <div class="register_success_content">
        <p class="success_tit">
          <img src="//files.eyee.com/eyeeh5/img/crunchies/image_word_dengjichenggong@2x.png" alt />
        </p>
        <div class="content">
          <p>你的意向尺码为：{{showWantSize}}</p>
        </div>
        <div class="titInfoBox">
          <div class="bar" :class="{'max': wantsizerandomsize == 0}">
            <img
              :src="`https://files.eyee.com/eyeeh5/img/crunchies/${wantsizerandomsize == 0?'ear_max_be':'ear_min_be'}.png`"
              alt
            />
          </div>
          <div class="tit_info_box">
            <p class="tit_info" v-if="opentInfo.popularconfig.wantsize">
              人气榜单
              <span>前{{opentInfo.popularconfig.intentionsizenum}}名</span>必中意向尺码
            </p>
            <p class="tit_info" v-if="opentInfo.popularconfig.randomsize">
              人气榜单
              <span>前{{opentInfo.popularconfig.randomsizemaxnum}}名</span>必中随机尺码
            </p>
          </div>
          <div class="bar after" :class="{'max': wantsizerandomsize == 0}">
            <img
              :src="`https://files.eyee.com/eyeeh5/img/crunchies/${wantsizerandomsize == 0?'ear_max_be':'ear_min_be'}.png`"
              alt
            />
          </div>
        </div>
      </div>
      <div class="btn_box fix-btm">
        <div class="p" @click.stop="shareToFriend()">分享{{GetActcode.list[0].count}}个好友助力，即可参与抢购</div>
      </div>
    </div>
    <!--  提醒下载app -->
    <div class="conten_box download_app" v-else-if="curStatus === 8">
      <span class="close ico-X" @click="close()"></span>
      <div class="download_app_info">
        <p class="head">温馨提示</p>

        <p class="info">【斗牛APP】每天都有限量商品低价预售，抢到即可转让，或者到期可提货。</p>
        <p class="info">新朋友下载APP可领取“520元新人大礼包”，潮流好物买买买~</p>
        <p class="tit">【斗牛APP】下载链接：</p>
        <p
          class="link"
        >https://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee&channel=0002160650432d595942&fromcase=60001</p>
      </div>
      <div class="app_info_btn" @click="copy(2)" :data-clipboard-text="appInfo">复制</div>
    </div>
    <!-- D分享激活 B 分享 -->
    <div
      class="bottom-box bottom-box-f share flex-aic flex-col share_D"
      v-else-if="curStatus === 9"
    >
      <span class="close ico-X" @click="close()"></span>
      <div class="my-code flex-aic flex-col">
        <div v-if="GetActcode.list[0].count > 0">
          <div class="code-title">
            分享
            <span
              class="red"
            >{{GetActcode.list[0].count}} 个{{opentInfo.canhelpuser == 2?'新用户':'用户'}}</span>助力，即可激活
          </div>
        </div>
        <div v-else-if="GetActcode.list[0].count < 1 && activityType == 5 && !isOverpoplar">
          <div class="code-title">持续分享才能保持排名哦~</div>
        </div>
      </div>
      <div class="BtnBox">
        <div class="wechat circle-friends" @click.stop="shareToFriend()">分享微信好友</div>
        <div class="wechat wechat-friend" @click.stop="draw()">分享朋友圈</div>
      </div>
    </div>
    <!-- 什么是人气榜单 -->
    <div class="conten_box clickQuery" v-if="curStatus === 10">
      <span class="close ico-X" @click="close()"></span>
      <div class="content" v-if="opentInfo.popularconfig">
        <div v-html="opentInfo.popularconfig.popularrule"></div>
      </div>
    </div>
    <div class="share-img-D">
      <div id="poster" class>
        <div class="img_box flex-aic flex-col" id="posterProd">
          <img :src="opentInfo.sharebackgroundimgurl" alt />
          <!-- <img class="send_img" :src="user.imageurl" alt /> -->
        </div>

        <div class="share_info">
          <div class="get-wx-code flex-center">
            <div class="code">
              <img :src="(GetActcode.list&&GetActcode.list[0].qrcode||'')" alt />
            </div>
            <div class="txt">
              <p class="tag">
                限量团购 先到先得
                <i></i>
              </p>
              <p class="info">识别小程序码，帮我助力！</p>
              <p class="info">
                <span>{{opentInfo.activityuv}}</span>人正在抢购
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  Checkcodev2i,
  Addcouponorderv2i,
  Getusercouponv2i,
  Newuseraddvaluev2i
} from "../../../common/api/bull";
import Clipboard from "clipboard";
import { html2canvas } from "@/utils/html2canvas.js";
import { Upload } from "@/common/api/user";
var loader;
export default {
  name: "TicketModel",
  components: {},
  data() {
    return {
      proCode: "", //E44998 暂时可用
      posterUrl: "", // 生成分享图片地址
      activityid: "",
      curStatus: 0,
      storageSize: "", // 暂存选中的尺码 单选/多选 三个尺码字符串拼接用逗号隔开
      showWantSize: "", //三个尺码用斜杠隔开
      sizeNumber: 0, // 选中尺码的个数
      storageSizeArry: [], // 暂存选中的尺码 数组
      appInfo:
        "【斗牛APP】每天都有限量商品低价预售，抢到即可转让，或者到期可提货。 新朋友下载APP可领取“520元新人大礼包”，潮流好物买买买~【斗牛APP】下载链接：https://a.app.qq.com/o/simple.jsp?pkgname=com.etechs.eyee&channel=0002160650432d595942&fromcase=60001",
      css: {
        show: false
      }
    };
  },
  props: {
    cssShow: { type: Boolean, default: false },
    ModelStatus: { type: Number, default: 0 },
    // preInfo: { type: Object, default: {} },
    opentInfo: { type: Object, default: {} },
    GetActcode: { type: Object, default: {} },
    sizeList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    allNum: { type: Number, default: 0 },
    activityType: { type: Number, default: 0 },
    isAll: { type: Boolean, default: false },
    fCode: { type: String, default: "" },
    chooseSizeNum: { type: Number, default: 0 }, // 需要选择意向尺码的个数
    intentionsizenum: { type: Number, default: 0 }, // 榜单必中意向尺码人数
    chooseSizeList: {
      type: Array,
      default: function() {
        return [];
      }
    }, // 选择意向尺码列表
    wantsizerandomsize: { type: Number, default: 0 }, // 意向和随机类型
    appversion: { type: String, default: "" }, // app版本号
    Isinclusion: { type: Number, default: 0 }, // 入围情况 0 未入围 1 进入必中随机 2 进入必中意向 //此时也有随机 3 进去全网最低价 可选尺码
    isMinpriceendCountDown: { type: Boolean, default: false }, // 入围情况 0 未入围 1 进入必中随机 2 进入必中意向 //此时也有随机 3 进去全网最低价 可选尺码
    timeData_8: { type: String, default: "" }, // 开始抢券的倒计时 全网最低特殊通道关闭的倒计时
    isOverpoplar: { type: Boolean, default: false } // 榜单是否截止
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    notloged() {
      return !(this.user && this.user.uid);
    }
  },
  beforeDestroy() {
    this.$root.Bus.$off("tell_child_commit");
  },
  mounted() {
    let _ = this;
    _.activityid = _.$route.query.activityid || ""; // 从路由上获取activityId
    window.callbackSaveImg = json => {
      if (!json) _.toast("保存失败~");
    };
  },
  created() {
    let _this = this;
    _this.$root.Bus.$on("tell_child_commit", function(code, pass_type) {
      _this.commit(code, pass_type);
    });
  },
  methods: {
    changeInfo() {
      let _ = this;
      _.css.show = _.cssShow;
      _.curStatus = _.ModelStatus;
    },
    // 复制客服微信号到剪切板
    copy(type) {
      // type 2 class = .app_info_btn
      let _this = this,
        className = "";
      if (type == 2) {
        className = ".app_info_btn";
      }
      var clipboard = new Clipboard(className);
      _this.toast("已复制到剪贴板!");
    },
    convertImgToBase64(url, callback, outputFormat) {
      var canvas = document.createElement("CANVAS"),
        ctx = canvas.getContext("2d"),
        img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function() {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(
          outputFormat || "image/png" || "image/jpg" || "image/jpeg"
        );
        callback.call(this, dataURL);
        canvas = null;
      };
      img.src = url;
    },
    commit(code, pass_type) {
      // console.log('抢购类型 1 普通 2 意向特殊通道 3 随机特殊通道 4 全网最低', pass_type)
      let _this = this,
        { proCode, activityid } = _this;
      if (code) {
        // 选过尺码后 再验证返回的code 直接抢 接口返回的code
        proCode = code;
      }
      if (!proCode) return;

      Checkcodev2i({ code: proCode, activityid: activityid })
        .then(res => {
          document.body.classList.remove("lock");
          if (res && res.status) {
            // 已经支付成功 code 就已经失效了 所以不存在这种情况
          } else {
            let param = {
              proCode: proCode,
              type: pass_type
            };

            if (param.type == 2) {
              _this.$emit("call-success-2", param);
            } else if (param.type == 3) {
              _this.$emit("call-success-2", param);
            } else if (param.type == 4) {
              console.log(2222, param);
              param.size = _this.storageSize;
              _this.$emit("call-success-2", param);
            } else {
              _this.$emit("call-success", param);
            }
          }
        })
        .catch(e => {
          document.body.classList.remove("lock");
          _this.proCode = "";
          if (e.code != 1511401) {
            _this.close();
            e.msg = "请求异常" + e.code;
            _this.$emit("tghint", 1);
          } else {
            _this.toast(e.msg);
          }
        });
    },
    close() {
      let _ = this;
      _.css.show = false;
      _.curStatus = 0;
      _.storageSize = "";
      _.sizeNumber = 0;
      _.storageSizeArry = [];
      _.showWantSize = "";
      _.$emit("close", "关闭弹框");
      window.scroll(0, 0);
      document.body.classList.remove("lock");
    },
    // 选择尺码 多选 选择任意三个 可反选 先存数组 最后再转为字符串
    chooseSize(sizeItem) {
      let _ = this;
      _.sizeNumber = 0;
      _.storageSizeArry = [];

      if (_.chooseSizeList) {
        _.chooseSizeList.forEach((val, index) => {
          if (val.active) {
            _.sizeNumber += 1;
            _.storageSizeArry.push(val.size);
          }
        });
      }

      if (sizeItem.active) {
        _.$set(sizeItem, "active", false);
        _.sizeNumber--;
        _.storageSizeArry.forEach((val, index) => {
          if (val == sizeItem.size) {
            _.storageSizeArry.splice(index, 1);
          }
        });
      } else {
        if (_.sizeNumber > _.chooseSizeNum - 1) {
          _.toast("最多选" + _.chooseSizeNum + "个尺码");
        } else {
          _.$set(sizeItem, "active", true);
          _.sizeNumber++;
          _.storageSizeArry.push(sizeItem.size);
        }
      }
    },
    // 确认选中的尺码
    confirm() {
      let _ = this,
        activityid = _.activityid;
      let status = 0,
        describe = ""; // status 状态值 describe 状态值的描述

      console.log("sizeNumber", _.sizeNumber);
      if (_.sizeNumber == 0) {
        _.toast("尺码不能为空！");
      } else if (_.sizeNumber > 0 && _.sizeNumber < _.chooseSizeNum) {
        _.toast("请选择" + _.chooseSizeNum + "个最想要的尺码");
      } else {
        status = 19;
        describe = "确认选中的意向尺码";
        // 把数组storageSizeArry转为字符串用逗号隔开存 storageSize
        _.storageSize = _.storageSizeArry.toString();
        console.log("storageSize", _.storageSize);
        let reg = /,/g;
        _.showWantSize = _.storageSize.replace(reg, "/");

        let param = {
          type: 8,
          sizes: _.storageSize
        };
        _.$emit("call-getProCode", param);
      }
      $log({
        e: "ipoclick",
        p: { status: status, describe: describe, activityid: _.activityid }
      });
    },
    // 选择尺码 单选  选择尺码 A、B、C 可选尺码(单选) || 全网最低价 可选尺码
    choose(sizeItem) {
      let _ = this;
      if (!sizeItem.num) {
        return;
      }
      if (_.sizeList.list) {
        _.sizeList.list.forEach((val, index) => {
          _.$set(val, "active", false);
        });
        _.$set(sizeItem, "active", true);
        _.storageSize = sizeItem.size;
      }
    },
    // 下一步
    nextClick() {
      let _ = this;
      if (!_.allNum) {
        return;
      }
      if (!_.storageSize) {
        _.toast("请选择尺码！");
        return;
      }

      $log({
        e: "ipoclick",
        p: {
          name: "selectedSize",
          size: _.storageSize,
          activityid: _.activityid
        }
      });

      console.log("code", _.proCode);
      Addcouponorderv2i({
        size: _.storageSize,
        activityid: _.activityid,
        code: _.proCode
      })
        .then(res => {
          let code = res;
          //验证code
          _.commit(code);
        })
        .catch(e => {
          _.toast(e && e.msg ? e.msg : "");
        });
    },
    // 全网最低价特殊通道 请在多少时间内完成购买
    buy() {
      let _ = this,
        code = _.proCode;
      if (!_.storageSize) {
        _.toast("请选择尺码！");
        return;
      }

      $log({
        e: "ipoclick",
        p: {
          name: "selectedSize",
          size: _.storageSize,
          activityid: _.activityid
        }
      });

      _.commit("", 4);
    },
    // 生成图片
    draw(type) {
      let status = 0,
        describe = ""; // status 状态值 describe 状态值的描述

      let _ = this,
        $prod = document.getElementById("posterProd");
      var drawed = false;
      loader = _.$loader("生成图片中···");

      let activityid = _.activityid;
      if (!_.notloged && _.activityType == 5 && _.opentInfo.status != 1) {
        Newuseraddvaluev2i({ activityid })
          .then(res => console.log("分享接口"))
          .catch(e => _.toast(e && e.msg ? e.msg : ""));
      }

      status = 21;
      describe = "分享朋友圈";

      const doDraw = () => {
        let $layer = document.getElementById("poster");
        html2canvas($layer, { useCORS: true }).then(canvas => {
          let dataUrl = canvas.toDataURL("image/jpg");
          // let dataUrl = canvas.toDataURL("image/png");
          // console.log("dataUrl=======", dataUrl);

          // _.$loader();
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
      $log({
        e: "ipoclick",
        p: { status: status, describe: describe, activityid: _.activityid }
      });
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
          // _.$loader();
        })
        .catch(e => {
          console.error("Upload error: ", e);
          _.toast("分享图片上传失败~");
          loader = _.$loader();
        });
    },
    setPosterUrl(url) {
      let _ = this;
      url = url.replace("http://", "https://");
      _.posterUrl = url;

      if (!!url) {
        // console.log(url, "分享图片地址");
        _.shareToWechat();
      } else {
        _.draw();
      }
    },
    shareToFriend() {
      let _ = this,
        activityid = _.activityid,
        GetActcode = _.GetActcode || {},
        shareInfo = (_.opentInfo && _.opentInfo.share) || {};
      let status = 0,
        describe = ""; // status 状态值 describe 状态值的描述
      if (!_.notloged && _.activityType == 5 && _.opentInfo.status != 1) {
        Newuseraddvaluev2i({ activityid })
          .then(res => console.log("分享接口"))
          .catch(e => _.toast(e && e.msg ? e.msg : ""));
      }
      if (_.$root.ISAPP && GetActcode.list[0].url && shareInfo) {
        status = 20;
        describe = "分享给朋友";

        loader = _.$loader("正在调起微信分享···");
        setTimeout(() => {
          loader.close();
        }, 3000);
        let xcxicon, content;
        if (!_.opentInfo.showprice && _.opentInfo.status == 2) {
          // 分享无价格的图片 无价格的内容
          xcxicon = shareInfo.nopricexcxicon;
          content = shareInfo.nopricecontent;
        } else {
          // 分享正常的图片 内容
          xcxicon = shareInfo.xcxicon;
          content = shareInfo.content;
        }
        _.javascriptBridge({
          name: "callAppDirectlyShare",
          params: {
            sharecontent: content || GetActcode.content,
            sharetitle: content || shareInfo.title,
            xcxurl: GetActcode.list[0].url,
            xcxicon: xcxicon || "",
            xcxid: shareInfo.xcxid || "gh_038ca9308eac",
            shareurl: "",
            type: 2,
            platform: 2,
            callbackname: "_shareCallBack"
          }
        });
      } else if (_.$root.ISAPP) {
        setTimeout(function() {
          _.shareToFriend();
        }, 2000);
      }
      $log({
        e: "ipoclick",
        p: { status: status, describe: describe, activityid: _.activityid }
      });
    },
    shareToWechat() {
      let _ = this,
        GetActcode = _.GetActcode || {};
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
        loader = _.$loader("正在调起微信分享···");
        setTimeout(() => {
          loader.close();
        }, 3000);
        _.javascriptBridge({
          name: "callAppDirectlyShare",
          params: {
            sharepicurl: _.posterUrl,
            type: 1,
            platform: 1,
            callbackname: "_shareCallBack"
          }
        });
      } else _.toast("请在斗牛APP中进行分享~");
    }
  },
  watch: {
    ModelStatus: function(n, o) {
      this.changeInfo();
    },
    fCode: function(n, o) {
      console.log("watch fcode", n, o);
      this.proCode = n;
    }
  }
};
</script>
<style lang="scss" scoped>
.ico-X::after {
  background-size: 100% auto;
}
.conten_box {
  width: 275px;
  background: #fff;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -137.5px;
  padding: 40px 30px 30px;
  transform: translateY(-50%);
  overflow: hidden;
}
.pop_box {
  position: fixed;
  transform: translateZ(0);
  z-index: 101;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  font-family: Arial, Helvetica, sans-serif;
  &.show {
    pointer-events: auto;
    .pi-bg {
      background-color: #000;
      opacity: 0.5;
    }
  }
  .pi-bg {
    width: 100%;
    height: 100%;
    background-color: transparent;
    opacity: 0;
    transition: all 0.2s ease;
  }
}
.close {
  position: absolute;
  top: 5.34vw;
  right: 4vw;
  width: 20px;
  height: 20px;
  color: #646464;
  font-size: 24px;
  line-height: 20px;
  text-align: center;
}
.bottom-box {
  width: 100vw;
  background: #fff;
  padding-bottom: 45px;
  position: fixed;
  transform: translateZ(0);
  bottom: 0;
  .code-title {
    font-size: 20px;
    font-weight: 600;
    height: 20vw;
    line-height: 20vw;
    .red {
      color: #fa2337;
    }
  }
  .my-code {
    .code-title {
      width: 100%;
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      height: 5.8667vw;
      line-height: 5.8667vw;
      border-bottom: 1px dashed #cdcdcd;
      margin-bottom: 4vw;
      height: 9vw;
      line-height: 9vw;
      img {
        width: 3.7333vw;
        height: 2.1333vw;
        margin: 0 2vw;
      }
    }
    .code {
      .activation-code {
        width: 63.7333vw;
        height: 12.8vw;
        background: #f0f0f0;
        justify-content: flex-start;
        .triangle_border_nw {
          width: 0;
          height: 0;
          border-width: 12.8vw 12.8vw 0 0;
          border-style: solid;
          border-color: #232323 transparent transparent transparent;
          position: relative;
        }
        .code-status-text {
          width: 12.8vw;
          transform: rotate(-45deg);
          color: #fff;
          font-size: 11px;
          margin-top: -11.8vw;
          margin-left: -1vw;
        }
        .code-text {
          color: #969696;
          font-size: 24px;
          letter-spacing: 6px;
          text-align: center;
          font-weight: 600;
          width: 100%;
        }
      }
      .copy-btn {
        background: #000;
        color: #fff;
        height: 12.8vw;
        font-size: 11px;
        padding: 7px 6px;
        text-align: center;
      }
    }
    &.my-code-ori {
      background: url("/static/img/bull/buy_code_bg2.png") no-repeat;
      background-size: 100% 100%;
      border-radius: 4px;
      width: 86.6667vw;
      padding: 2%;
      height: 32vw;
    }
  }

  .wechat {
    font-size: 16px;
    width: 92vw;
    height: 13.3333vw;
    border-radius: 6px;
    line-height: 13.3333vw;
    text-align: center;
    margin-top: 4vw;
  }
  .circle-friends {
    color: #fff;
    background: #fa2337;
  }
  .wechat-friend {
    color: #fa2337;
    border: 1px solid #fa2337;
  }
}
.my-code-ori-box {
  background: linear-gradient(
    180deg,
    rgba(75, 75, 75, 1) 0%,
    rgba(36, 36, 36, 1) 100%
  );
  border-radius: 8px;
  padding: 8px;
}
.bottom-box {
  &.share {
    .my-code {
      .code-title {
        border: 0;
        margin-top: 30px;
      }
    }
  }
}
.size_box {
  padding-bottom: 0;
}
.sizeBox {
  .tit {
    height: 50px;
    line-height: 74px;
    font-size: 18px;
    color: #232323;
    padding-left: 20px;
    font-weight: bold;
  }
  .hint {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: #999;
    padding-left: 20px;
    margin-bottom: 20px;
  }
}
.next {
  height: 50px;
  background: #2d2d2d;
  font-size: 16px;
  font-weight: 600;
  color: white;
  line-height: 50px;
  text-align: center;
  width: 100vw;
  &.cover {
    background: #ececec;
    color: #bbb;
  }
}
.p_box {
  padding: 10px 4vw;
  background: white;
  .p {
    width: 100%;
    height: 50px;
    background: #fa2337;
    font-size: 16px;
    font-weight: 600;
    color: white;
    line-height: 50px;
    text-align: center;
    border-radius: 6px;
  }
  .cover {
    background: #cdcdcd;
  }
}

.sizeB {
  max-height: 300px;
  overflow: auto;
  .list {
    width: 100vw;
    background: #f4f4f4;
    display: flex;
    padding-left: 2.5vw;
    padding-top: 2.5vw;
    flex-wrap: wrap;
    .sizeItem {
      width: 21.875vw;
      height: 21.875vw;
      margin-right: 2.5vw;
      margin-bottom: 2.5vw;
      background: #fff;
      color: #333;
      border-radius: 4px;
      text-align: center;
      position: relative;
      .minprice {
        position: absolute;
        top: -4px;
        left: 44%;
        display: block;
        width: 13.34vw;
        height: 5.6vw;
        background: url("https://files.eyee.com/eyeeh5/img/crunchies/all_network.png")
          center center no-repeat;
        background-size: cover;
      }
      .size_status_b {
        position: absolute;
        top: 0;
        right: 0;
        border-color: #d1d1d1 transparent transparent transparent;
        width: 0;
        height: 0;
        border-width: 14vw 0 0 14vw;
        border-style: solid;
        .size_status_text {
          color: #fff;
          width: 13vw;
          transform: rotate(45deg);
          font-size: 12px;
          position: absolute;
          top: -11vw;
          right: -2vw;
        }
      }
      &.disable {
        background: #eee;
        color: #ccc;
      }
      &.act {
        background-color: #333;
        color: #fff;
      }
      &.current {
        border: 1px solid #fa2337;
        color: #fa2337;
      }
      span {
        display: block;
        width: 100%;
        height: 12.875vw;
        line-height: 20vw;
        font-size: 20px;
        &.b_price {
          font-family: "OswaldBold";
          height: 11vw;
          line-height: 17vw;
        }
      }
      em {
        display: block;
        width: 100%;
        height: 9vw;
        line-height: 8vw;
        font-size: 13px;
      }
    }
  }
}
.bottom-box-f {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding-bottom: 0;
  .btn_box {
    height: 70px;
    background: #fff;
    padding: 10px 15px;
    .p {
      height: 50px;
      line-height: 50px;
      background: #fa2337;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      text-align: center;
    }
  }
}
.chooseLikeSize {
  .sizeBox {
    // padding: 0 1.5vw;
    .tit {
      height: 55px;
      font-size: 18px;
      font-weight: bold;
      line-height: 85px;
    }
    .hint {
      color: #232323;
    }
    .sizeB {
      padding: 0 1.5vw;
      background: #f0f0f0;
    }
    .list {
      width: 100%;
      background: #f0f0f0;
      .sizeItem {
        width: 21.125vw;
        height: 21.125vw;
        line-height: 21.125vw;
        span {
          height: 21.125vw;
          line-height: 21.125vw;
          color: #232323;
          font-size: 22px;
          font-family: "OswaldBold";
        }
        &.act {
          border: #fa2337 solid 1px;
          background-color: #fff;
          span {
            color: #fa2337;
          }
        }
      }
    }
  }
}
.download_app {
  width: 300px;
  padding-left: 20px;
  padding-right: 20px;
  margin-left: -150px;
  .download_app_info {
    margin-bottom: 24px;
    p {
      line-height: 20px;
      font-size: 13px;
      &.head {
        height: 24px;
        font-size: 17px;
        font-weight: 600;
        color: #232323;
        line-height: 24px;
        margin-bottom: 18px;
        text-align: center;
      }
      &.info {
        margin-bottom: 20px;
      }
      &.tit {
      }
      &.link {
        word-wrap: break-word;
      }
    }
  }
  .app_info_btn {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #fa2337;
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
  }
}
.register_success {
  background: #fff;
  padding-top: 43px;
}
.register_success_content {
  .success_tit {
    height: 26px;
    margin-bottom: 17px;
    img {
      display: block;
      margin: 0 auto;
      height: 26px;
    }
  }
  .content {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    p {
      height: 60px;
      background: #f0f0f0;
      border-radius: 30px;
      font-size: 17px;
      font-weight: 600;
      color: #646464;
      line-height: 60px;
      text-align: center;
      padding: 0 30px;
    }
  }
}
.titInfoBox {
  width: 100%;
  margin-bottom: 20px;
  align-items: center;
  justify-content: center;
  display: flex;
  height: 40px;
  .bar {
    display: block;
    width: 10px;
    height: 25px;
    margin-right: 5px;
    &.after {
      margin-left: 5px;
      -moz-transform: rotateY(180deg);
      -o-transform: rotateY(180deg);
      -ms-transform: rotateY(180deg);
      transform: rotateY(180deg);
    }
    &.max {
      width: 17px;
      height: 39px;
      img {
        display: block;
        width: 17px;
        height: 39px;
      }
    }
    img {
      display: block;
      width: 10px;
      height: 25px;
    }
  }

  .tit_info_box {
    .tit_info {
      color: #646464;
      font-size: 14px;
      height: 20px;
      line-height: 20px;
      font-weight: 400;
      text-align: center;
      span {
        color: #f92438;
      }
    }
  }
}
.share_D {
  padding-top: 50px;
  .code-title {
    margin-top: 0 !important;
    .red {
      color: #fa2337;
    }
  }
  .BtnBox {
    &.padt_60 {
      padding-top: 60px;
    }
    padding-bottom: 30px;
  }
}
.share-img-D {
  position: absolute;
  width: 94%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  z-index: -999;
  transform: translateY(1000px);
  background: #fff;
  #poster {
    width: 100%;
  }
  .img_box {
    position: relative;
    .share_img {
      display: block;
      width: 100%;
    }
    .send_img {
      display: block;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 25px;
      border: solid 3px #fff;
    }
  }
  .share_info {
    background: #fff;
    padding: 30px 0 35px;
    .get-wx-code {
      .code {
        width: 21.334vw;
        height: 21.334vw;
        border-radius: 50%;
        margin-right: 3.734vw;
      }
      .txt {
        .tag {
          font-size: 14px;
          font-weight: bold;
          color: #fff;
          background: #fa2337;
          width: 39.2vw;
          height: 30px;
          line-height: 30px;
          position: relative;
          text-align: center;
          margin-bottom: 5px;
          i {
            display: block;
            border-right: solid 4px #fa2337;
            width: 0;
            height: 0;
            border: 4px solid transparent;
            border-right: 4px solid #fa2337;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: -8px;
          }
        }
        .info {
          height: 20px;
          font-size: 13px;
          font-weight: bold;
          color: #232323;
          line-height: 20px;
          span {
            color: #fa2337;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.clickQuery {
  width: 82vw !important;
  margin-left: -42vw !important;
  .content {
    p {
      span {
        font-size: 14px !important;
      }
    }
  }
}
.border-D-Box {
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>


