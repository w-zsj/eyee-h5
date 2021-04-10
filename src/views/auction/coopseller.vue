<template>
  <div class="cooperative-merchant" :class="{'ipx':getIsIphonex}">
    <!-- <v-header v-if="!$root.ISAPP&&!$root.ISMP">
      <div class="nav-tab2 ellipsis">申请成为合作卖家</div>
    </v-header>-->
    <div class="form">
      <div class="borbot">
        <div class="label flex-aic">
          <label class="xing">
            <span>姓名</span>
          </label>
          <input type="text" v-model="options.username" placeholder="请填写您的真实姓名" />
        </div>
        <div class="label flex-aic">
          <label class="xing">
            <span>手机号</span>
          </label>
          <input type="text" v-model="options.mobile" placeholder="请填写手机号" />
        </div>
        <div class="label flex-aic">
          <label>
            <span>微信号</span>
          </label>
          <input type="text" v-model="options.wechat" placeholder="方便我们便捷联系您" />
        </div>
      </div>
      <div class="label prod">
        <label class="xing flex-aic">
          <span>商品信息</span>
        </label>
        <div class="txt-area">
          <textarea
            placeholder="请介绍下你的想申请上架的鞋款、数量、瑕疵程度等，描述越详细申请概率越高哦～"
            v-model="options.productdesc"
          ></textarea>
          <span class="txt-num" v-if="txtnum>0">{{txtnum}}</span>
        </div>
      </div>
    </div>
    <!-- 推广图 -->
    <div class="promotion" v-if="options.url&&options.url!=' '">
      <img :src="options.url" alt />
    </div>

    <!-- 按钮 -->
    <div
      class="applybtn"
      :class="[{'ipx':getIsIphonex},{'red':options.username&&options.mobile&&options.productdesc}]"
      @click="updetaOperate"
    >
      <button>提交申请</button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { CheckQuery, Operate } from "@/utils/api/auction";
const regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
// const regpoint = /[\ |\~|\`|\!|\@|\#|\$|\￥\?|\？|\!|\！|\{|\}|\/|\“|\“|\.|\、|\~|\;|\:|\(|\)|\《|\》|\【|\】|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g;
const regpoint = /[^\a-zA-Z\u4E00-\u9FA5]/g;
export default {
  name: "coopseller",
  data() {
    return {
      options: {
        id: "",
        username: "",
        mobile: "",
        wechat: "",
        productdesc: "",
        url: ""
      },

      txtnum: 500 // 提示输入内容限制
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo"
    }),
    uid() {
      return !!(this.user && this.user.uid);
    },
    // ISIOS
    getIsIphonex() {
      if (this.$root.ISIOS) {
        if (screen.height == 812 && screen.width == 375) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  watch: {
    "options.username": {
      handler: function(val, oldval) {
        this.options.username = val
          .replace(regpoint, "")
          .replace(regStr, "")
          .replace(/(0|[1-9][0-9]*)$/i, "")
          .replace(/\s+/g, "");
        if (val.length > 7) {
          this.options.username = val.substring(0, 7);
          this.toast("长度不能超过七位");
          return;
        }
      },
      deep: true
    },
    "options.productdesc": {
      handler: function(val, oldval) {
        if (val) {
          if (val.length > 500) {
            this.toast("您输入的内容过长,请控制在500个字之内~");
            this.options.productdesc = val.substring(0, 500);
            this.txtnum = 0;
          } else {
            this.txtnum = 500 - this.options.productdesc.length;
          }
        } else this.txtnum = 500;
        this.options.productdesc = this.options.productdesc
          .replace(regStr, "")
          .replace(/\s+/g, "");
      },
      deep: true
    },
    "options.mobile": {
      handler: function(val, oldval) {
        if (val) {
          this.options.mobile = val.replace(regStr, "").replace(/\s+/g, "");
          if (val.length > 11) {
            this.options.mobile = val.substring(0, 11);
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    let _ = this;
    _.setToolBar({ title: "申请成为合作卖家", bgcolor: "#191919", textcolor: "#FFFFFF" });
    if (_.$root.loging) {
      _.$root.loging
        .then($ => {
          // 已登录
          console.log("自动登录返回信息", $);
          _.checkQuery();
        })
        .catch(e => {
          console.error("query prams auto login error:", e);
        });
    } else if (_.uid) _.checkQuery();
    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json).then(res => {
          _.getInfo();
        });
      } else _.toast("登录失败~");
    };
  },
  methods: {
    getParams() {
      let _ = this;
      _.getQueryParamUser()
        .then(res => {
          _.checkQuery();
        }) // 登录成功 处理事件s
        .catch(err => console.error("参数获取失败", err));
    },
    checkQuery() {
      let _ = this;
      CheckQuery()
        .then(res => {
          if (res && res.id && res.productdesc) {
            _.options = { ...res };
          } else _.options.url = res.url || "";
          if (res.share) {
            let domain = _.$root.isdebug
              ? "http://qzone.eyee.com/"
              : "http://m.eyee.com/";
            let path = `/pages/home/web?url=${encodeURIComponent(
                domain + `coopseller`
              )}`,
              share = {};
            share.sharetitle = res.share.title;
            share.sharecontent = res.share.content;
            share.xcxurl = path;
            share.xcxicon = res.share.xcxurl;

            if (_.$root.ISMP) wx.miniProgram.postMessage({ data: { share } });
            else if (_.$root.ISAPP) {
              _.javascriptBridge({
                name: "getAppActivityShareContent",
                params: {
                  sharecontent: share.sharecontent,
                  sharetitle: share.sharetitle,
                  shareurl: domain + `coopseller`,
                  sharepicurl: res.share.url,
                  hideshareicon: false
                }
              });
            } else {
              _.initShare({
                info: {
                  title: share.sharetitle,
                  desc: share.content,
                  img: res.share.url,
                  url: domain + `coopseller`
                }
              });
            }
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    updetaOperate() {
      let _ = this,
        { options } = _;
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!_.uid) {
        if (_.$root.ISAPP) {
          _.javascriptBridge({
            name: "callAppLoginPage",
            params: { callbackname: "_appLoginCallback" }
          });
        } else if (_.$root.ISMP) {
          wx.miniProgram.navigateTo({
            url: "/pages/home/bind"
          });
        } else {
          _.$router.push("/login");
        }
      } else {
        if (!options.username) {
          _.toast("请输入您的真实姓名");
          return;
        } else if (options.username.length > 7) {
          _.toast("名字长度不能大于7");
          return;
        } else if (!myreg.test(options.mobile)) {
          _.toast("请输入正确的手机号");
          return;
        } else if (!options.productdesc) {
          _.toast("请输入商品信息");
          return;
        }
        Operate(options)
          .then(res => {
            _.toast("提交成功请等待回复");
            setTimeout(() => {
              if (ENV.ua.mini) {
                wx.miniProgram.navigateBack();
              } else _.$router.go(-1);
            }, 500);
          })
          .catch(e => {
            console.error(e);
            _.toast(e && e.msg);
          });
      }
    }
  }
};
</script>
<style lang="scss">
html, body {
  background-color: #191919;
}
input,
textarea,
input:focus,
textarea:focus {
  list-style: none;
  outline-style: none;
  background: none;
  padding: 0;
  margin: 0;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  -webkit-appearance: none;
  caret-color: #646464;
}
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #505050;
  font-size: 4vw;
}
img {
  display: block;
  width: 100%;
}
.cooperative-merchant {
  padding: 2.666vw 0 18.666vw;
  .form {
    color: #fff;
    font-size: 4vw;
    .label {
      min-height: 13.333vw;
      padding: 0 4vw;

      label {
        min-width: 13.33vw;
        margin-right: 10.9333vw;
        &.xing {
          span {
            position: relative;
            &::before {
              content: "*";
              position: absolute;
              right: -2.1333vw;
              top: 0;
            }
          }
        }
      }
      input {
        width: 100%;
        color: #C8C8C8;
        font-size: 4vw;
      }

      &.prod {
        .xing {
          min-height: 13.333vw;
        }
        .txt-area {
          position: relative;
          margin-top: 2.666vw;
          padding-bottom: 10.933vw;
          background-color: #282828;
          border-radius: 3.2vw;
          .txt-num {
            position: absolute;
            right: 4vw;
            bottom: 2.666vw;
            color: #969696;
            font-size: 3.2vw;
          }
        }
        textarea {
          display: block;
          background-color: #282828;
          border-radius: 3.2vw;
          min-height: 40vw;
          width: 100%;
          resize: none;
          padding: 4vw;
          color: #C8C8C8;
          font-size: 4vw;
        }
      }
    }
  }
  .promotion {
    margin: 4vw 4vw 5.33vw 4vw;
    border-radius: 4px;
    overflow: hidden;
  }
  .applybtn {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    height: 18.666vw;
    display: flex;
    align-items: center;
    padding: 0 4vw;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    &.red {
      button {
        opacity: 1;
        color: #000;
      }
    }
    &.ipx {
      height: 27.732vw;
      padding-bottom: 9.06666vw;
    }
    button {
      opacity: 0.5;
      width: 100%;
      height: 12.2666vw;
      line-height: 12.2666vw;
      background: linear-gradient(180deg,#f5e6aa, #876e37);
      border-radius: 6.133vw;
      text-align: center;
      font-size: 4.8vw;
      color: rgba(0,0,0,0.5);
      font-weight: 600;
    }
  }
}
</style>