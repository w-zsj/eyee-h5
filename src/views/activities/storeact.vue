<template>
  <div class="store" :class="{'ipx':getIsIphonex}" v-if="baseData&&baseData.activityid">
    <div
      class="content"
      :style="{backgroundImage : 'url(' + baseData.headimg + ')', backgroundRepeat:'no-repeat', backgroundPosition:'0 0', backgroundSize: '100% auto'}"
    >
      <!-- 头图 -->
      <div class="addr">{{baseData.activitytime}}{{baseData.address}}</div>
      <!-- 报名信息 -->
      <div class="reg-info">
        <div class="insetbg">
          <div class="cont">
            <!-- 商品图片 -->
            <div class="prod-img" @click.stop="goproddetail(baseData.productid)">
              <img :src="baseData.productcoverimg" alt />
            </div>
            <!-- 商品名称 -->
            <div class="prod-name ellipsis flex-center">{{baseData.productname}}</div>
            <!-- 商品价格 -->
            <div class="wrap-price">
              <div class="prod-price flex-center">
                <div class="sale-txt">
                  <img src="https://files.eyee.com/mcdn/img/store/tit_fsprice.png" alt />
                </div>
                <div class="rmb">
                  <img src="https://files.eyee.com/mcdn/img/store/rmb.png" alt />
                </div>
                <div class="price">{{baseData.price||'--'}}</div>
              </div>
            </div>
            <!-- 市场价 -->
            <div class="mark-price flex-center">参考价 ￥ {{baseData.marketprice||'--'}}</div>
            <!-- 按钮 -->
            <!-- red blue gray -->

            <!-- 助力好友列表 -->
            <div class="friend-list" v-if="!insetBtn">
              <div class="list">
                <div class="title flex-center">
                  <img src="https://files.eyee.com/mcdn/img/store/tit_share.png" class="fe-pic" />
                  {{lognInfo.activeinvitenums}}
                  <img
                    src="https://files.eyee.com/mcdn/img/store/tit_helpHead.png"
                    class="af-pic"
                  />
                </div>
                <!-- 好友头像 -->
                <div class="header flex-aic flex-wrap">
                  <div
                    class="item"
                    v-for="(item,indx) in invitenums"
                    :key="indx"
                    @click.stop="goshare(item)"
                  >
                    <img :src="item" alt srcset />
                  </div>
                </div>
                <div
                  class="clickbtn flex-center"
                  :class="btnclass"
                  @click.stop="dealclick"
                >{{btnTxt}}</div>
              </div>
            </div>
            <!-- 只显示按钮 -->
            <div
              class="clickbtn flex-center"
              :class="btnclass"
              v-else
              @click.stop="dealclick"
            >{{btnTxt}}</div>
          </div>
        </div>
      </div>
      <!-- <div class="test" @click="test">
        <button>此按钮 仅限开发人员张三军使用</button>
      </div>-->
      <!-- 活动规则 -->
      <div class="act-rule">
        <div class="title">活动规则</div>
        <div class="gradient">
          <div class="act-txt" v-html="baseData.rule"></div>
        </div>
      </div>
      <!-- 往期活动Î -->
      <div class="history" v-if="baseData.previousactivity&&baseData.previousactivity.length">
        <div class="title">往期活动</div>
        <div class="gradient" v-for="(sub,index) in baseData.previousactivity" :key="index+'his'">
          <div class="pic flex-center">
            <img :src="sub" alt srcset />
          </div>
        </div>
      </div>
      <!-- app大小标题 -->
      <div class="app-title flex-center">
        <div class="logo">
          <img :src="baseData.appurl" alt srcset />
        </div>
        <div class="title flex-col">
          <div class="big">{{baseData.appbigtitle}}</div>
          <div class="small">{{baseData.appsmalltitle}}</div>
        </div>
      </div>
    </div>

    <!-- 弹框 -->
    <div class="modal" :class="{'act':IsShowModal}">
      <div class="ct">
        <div class="close" @click="close"></div>
        <div class="icon-txt" :class="{'suc':modaltype==1}">
          <img
            :src="`https://files.eyee.com/mcdn/img/store/${modaltype==1?`tit_write`:`tit_success`}.png`"
          />
        </div>
        <div>
          <img src="https://files.eyee.com/mcdn/img/store/pop_bg_head.png?c=1" alt />
        </div>
        <!-- 报名信息 -->
        <div class="reg-label">
          <div v-if="modaltype==1">
            <div class="user-info flex-between">
              <label for="name">姓&nbsp;&nbsp;&nbsp;名</label>
              <input type="text" id="name" v-model="relData.username" placeholder="真实姓名" />
            </div>
            <div class="user-info flex-between">
              <label for="mb">手机号</label>
              <input type="text" id="mb" placeholder="11位手机号码" v-model="relData.mobile" />
            </div>
            <div class="user-info flex-between">
              <label for="uid">身份证</label>
              <input type="text" id="uid" placeholder="身份证号" v-model="relData.idno" />
            </div>
            <div
              class="user-info flex-between"
              :class="{'selcet':relData.citys}"
              @click="showModal()"
            >
              <label for="addr">居住地</label>
              <input
                type="text"
                id="addr"
                class="ellipsis"
                placeholder="选择省市"
                readonly
                v-model="relData.citys"
              />
              <i></i>
            </div>
            <div class="user-info flex-between">
              <label for="name"></label>
              <input type="text" placeholder="居住地址" v-model="relData.detailaddress" />
            </div>
            <!-- 提交按钮 -->
            <div class="submit flex-center" @click="sumtUserInfo">提交报名</div>
            <div class="desc">请确认无误后再提交</div>
          </div>
          <div v-else class>
            <div class="title">{{regSucdata.content||'中签用户将在报名活动截止后收到短信通知'}}</div>
            <div class="submit flex-center" @click="close">知道了</div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="showBaseModal" class="addressBg" @click="cancel">
      <transition name="addresstrans">
        <baseProvinceId class="addresstrans" v-show="showBaseModal" @hasselect="hasselect"></baseProvinceId>
      </transition>
    </div>
  </div>
  <div v-else class="flex-col flex-center nodata">
    <div>
      <img src="https://files.eyee.com/eyeeh5/img/image_empty.png" alt srcset />
    </div>暂无活动
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Picker } from "mint-ui";
import { Doorapply, Getuserenrollinfo, Enroll } from "@/common/api/lotter";
import baseProvinceId from "../../components/templates/baseProvinceId";
var loader;
const elBody = document.getElementsByTagName("body")[0];
const rgxMobile = /^(\+?0?\d{1,3})-?\d{9,11}$/;
export default {
  components: { baseProvinceId },
  data() {
    return {
      baseData: {},
      lognInfo: {},
      btnTxt: "邀请好友助力",
      btnclass: "red",
      invitenums: new Array(), //需要邀请人数
      IsShowModal: false,
      relData: {},
      modaltype: 0,
      regSucdata: {}
    };
  },
  computed: {
    ...mapGetters({
      user: "userInfo",
      showBaseModal: "showBaseModal",
      editAddressData: "editAddressData"
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
    },
    insetBtn() {
      let _ = this,
        bol = 0;
      if (!_.uid) bol = 1;
      else if (_.baseData.status == 0) bol = 1;
      else if (_.baseData.status == 2) bol = 1;
      return !!bol;
    }
  },
  mounted() {
    let _ = this;
    // 登录回调
    window.callbacklogin = json => {
      if (json) {
        _.getQueryParamUser(json)
          .then(res => _.mainReq()) // console.log("app登录成功");
          .catch(err => console.error("登录失败", err));
      } else _.toast("获取登录信息失败~");
    };
    _.mainReq();
    if (_.$root.ISAPP) {
      elBody.classList.remove("lock");
      _.javascriptBridge({
        name: "getAppActivityShareContent",
        params: { hideshareicon: true }
      });
      _.getQueryParamUser()
        .then(res => _.mainReq()) // 登录成功 处理事件
        .catch(err => console.error("参数获取失败", err));
    } else {
      // _.loadApp();
      _.confirm({
        msg: "请在【斗牛DoNew】APP内操作?",
        okText: "立即前往",
        cancelBtn: 1,
        ok: () => {
          _.openAppClient();
          setTimeout(() => {
            _.$router.replace("/loadapp");
          }, 800);
        }
      });
      elBody.classList.add("lock");
    }
    // _.relData = _.editAddressData;
  },
  methods: {
    mainReq() {
      let _ = this;
      Doorapply()
        .then(res => {
          console.log(res);
          if (res) {
            _.baseData = res;
            if (!_.uid) {
              if (res.status == 2) {
                _.btnTxt = "报名已截止";
                _.btnclass = "gray";
              } else {
                _.btnTxt = "点击登录";
                _.btnclass = "blue";
              }
            } else {
              return res;
            }
          }
        })
        .then(data => {
          if (_.uid && _.$root.ISAPP) {
            Getuserenrollinfo({
              activityid: data.activityid
            }).then(info => {
              console.log("登录态信息", info);
              //   status : Integer //0：报名没开始;1：助力中;2：助力成功，3：已经报名4：已经结束
              if (info) {
                _.lognInfo = info;
                if (info.xcxurl) _.baseData.share.xcxurl = info.xcxurl;
                //  助力头像处理 //需要邀请人数
                if (info.activeinvitenums)
                  _.invitenums = new Array(info.activeinvitenums);
                if (info.invitheadimgs && info.invitheadimgs.length) {
                  // 头像处理
                  info.invitheadimgs.map((i, index) => {
                    if (i) {
                      _.invitenums[index] = i;
                    }
                    return _.invitenums;
                  });
                }
                // 按钮文案处理
                _.btnclass = "red";
                switch (info.status) {
                  case 0:
                    _.btnTxt = "报名即将开始";
                    _.btnclass = "blue";
                    break;
                  case 1:
                    _.btnTxt = "邀请好友助力";
                    break;
                  case 2:
                    _.btnTxt = "点击报名";
                    break;
                  case 3:
                    _.btnTxt = "已成功报名";
                    _.btnclass = "gray";
                    break;
                  case 4:
                    _.btnTxt = "报名已截止";
                    _.btnclass = "gray";
                    break;
                }
              }
            });
          } else {
            _.btnTxt = "点击登录";
            _.btnclass = "blue";
          }
        });
    },
    dealclick() {
      let _ = this,
        status = _.lognInfo.status;
      if (_.$root.ISAPP) {
        //   status : Integer //0：报名没开始;1：助力中;2：助力成功，3：已经报名4：已经结束
        if (_.baseData.status == 2) return;
        else if (!_.uid) _.callAppLogin();
        else if (status) {
          if (status == 1) {
            _.shareToFriend();
          } else if (status == 2) {
            //   _.toast("填写报名信息");
            _.IsShowModal = true;
            _.modaltype = 1;
            elBody.classList.add("lock");
          }
        }
      }
    },
    hasselect(v) {
      console.log("收货地址", v);
      let _ = this;
      if (v) {
        let c = v.split(" ");
        _.relData.citys = c[0] + c[1];
      }
    },
    test() {
      let _ = this;
      _.IsShowModal = true;
      _.modaltype = 1;
      elBody.classList.add("lock");
    },
    goproddetail(id) {
      if (this.$root.ISAPP) {
        this.javascriptBridge({
          name: "gotoAppSneakerDetailPage",
          params: { productid: id }
        });
      }
    },
    cancel() {
      this.$store.dispatch("selectCity", { open: false });
    },
    sumtUserInfo() {
      let _ = this;
      if (_.relData.citys) {
        _.relData.province = _.relData.citys.split(" ")[0] || "";
        _.relData.district = _.relData.citys.split(" ")[1] || "";
      }
      let {
        username,
        mobile,
        idno,
        province,
        district,
        detailaddress
      } = _.relData;
      if (username && mobile && idno && province && detailaddress) {
        if (rgxMobile.test(mobile)) {
          Enroll({
            activityid: _.baseData.activityid,
            username,
            mobile,
            idno,
            province,
            district,
            detailaddress
          })
            .then(res => {
              _.modaltype = 2;
              _.regSucdata = res;
              _.mainReq();
            })
            .catch(e => {
              _.toast(e && e.msg);
            });
        } else _.toast("请输入正确的手机号");
      } else _.toast("请填写完成信息");
    },
    close() {
      let _ = this;
      _.IsShowModal = false;
      _.modaltype = 0;
      elBody.classList.remove("lock");
    },
    showModal() {
      //   console.log(data, "------eee");
      // t:0选择国家 t：1 选择城市
      this.$store.dispatch("selectCity", { type: 1, data: "", open: true });
    },
    // app 登录 交互
    callAppLogin() {
      this.javascriptBridge({
        name: "callAppLoginPage",
        params: { callbackname: "callbacklogin" }
      });
    },
    goshare(item) {
      console.log("item", this.invitenums, item);
      let _ = this;
      if (_.$root.ISAPP && !item) _.shareToFriend();
    },
    shareToFriend() {
      let _ = this;
      loader = _.$loader("正在调起微信分享···");
      let sinfo = _.baseData.share;
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
  }
};
</script>
<style lang="scss">
html,
body {
  background: #525252;
}
.nodata {
  width: 30vw;
  margin: 30vw auto;
  color: #969696;
}
.store {
  background: linear-gradient(180deg, #000000, #525252);
  .store.ipx {
    padding-bottom: 9.066vw;
  }
  img {
    display: block;
    width: 100%;
  }
  .content {
    min-height: 100vh;
    position: relative;
    padding: 83.466vw 4vw 5.333vw 4vw;
    .addr {
      position: absolute;
      left: 5.333vw;
      top: 36vw;
      font-size: 12px;
      color: #fff;
      font-weight: bold;
      font-family: "DIN";
    }
    .reg-info {
      //   width: 92vw;
      //   height: 400px;
      min-height: 106vw;
      margin: 0 auto;
      padding: 4px;
      border-radius: 4vw 4vw 2vw 2vw;
      background: linear-gradient(
        180deg,
        #f68170 0%,
        rgba(127, 0, 19, 1) 20%,
        rgba(127, 0, 19, 1) 90%,
        rgba(134, 0, 23, 1) 100%
      );
      .insetbg {
        position: relative;
        height: 100%;
        background: linear-gradient(
          180deg,
          #f68170 0%,
          rgba(209, 3, 31, 1) 7%,
          rgba(209, 3, 31, 1) 11%,
          rgba(134, 0, 23, 1) 100%
        );
        border-radius: 4vw 4vw 2vw 2vw;
        padding: 5.333vw 0 8vw 0;
        &.insetbg::before {
          content: "";
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: 1;
          left: 0;
          top: 0;
          background: url(http://api.thumbr.it/whitenoise-60x60.png?background=00000000&noise=626262&density=20&opacity=15)
            0 0;
        }
        .cont {
          position: relative;
          z-index: 2;
          .prod-img {
            width: 81.33vw;
            // height: 48.533vw;
            // width: 100%;
            margin: 0 auto;
            // background: #000000;
            border-radius: 14px;
            overflow: hidden;
          }
          .prod-name {
            width: 74.666vw;
            font-size: 14px;
            color: #fff;
            font-family: DIN;
            font-weight: bold;
            margin: 4.26vw auto 2.133vw;
          }
          .wrap-price {
            width: 45.06vw;
            height: 16.442vw;
            border-radius: 6px;
            margin: 0 auto;
            overflow: hidden;
            position: relative;
            box-shadow: 0px 4px 0px 0px rgba(73, 24, 1, 1);
            font-family: "DIN";
            .prod-price {
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              background: linear-gradient(
                180deg,
                rgba(255, 206, 0, 1) 0%,
                rgba(255, 160, 0, 1) 52%,
                rgba(255, 180, 55, 1) 100%
              );
              border-radius: 6px;
              border: 4px solid;
              border-image: linear-gradient(
                  180deg,
                  rgba(255, 231, 145, 1),
                  rgba(255, 163, 0, 1),
                  rgba(255, 160, 0, 1)
                )
                4 4;
              border-radius: 6px;
              .sale-txt {
                width: 4vw;
                font-size: 12px;
                font-weight: bold;
                color: #000000;
                font-family: DIN;
                height: 10.4vw;
                img {
                  height: 100%;
                  width: 100%;
                }
              }
              .rmb {
                width: 18px;
                margin: 5% 3px 0;
              }
              .price {
                color: #000000;
                font-size: 48px;
                font-family: "OswaldBold";
                height: 10.4vw;
                line-height: 10.4vw;
              }
            }
          }
          .mark-price {
            font-size: 16px;
            color: #fff;
            font-weight: bold;
            font-family: "OswaldBold";
            text-decoration: line-through;
            margin: 2.666vw auto 4.533vw;
          }
          .clickbtn {
            width: 71.733vw;
            height: 13.333vw;
            color: #fff;
            font-weight: bold;
            font-size: 16px;
            margin: 0 auto;
            background: linear-gradient(
              180deg,
              rgba(245, 140, 119, 1) 0%,
              rgba(176, 0, 26, 1) 31%,
              rgba(129, 0, 21, 1) 100%
            );
            box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.5);

            border-radius: 6px;
            &.blue {
              background: linear-gradient(
                180deg,
                rgba(96, 95, 255, 1) 0%,
                rgba(63, 45, 175, 1) 31%,
                rgba(48, 44, 135, 1) 80%,
                rgba(16, 17, 70, 1) 100%
              );
              box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.5);
            }
            &.gray {
              background: linear-gradient(
                180deg,
                rgba(121, 121, 121, 1) 0%,
                rgba(94, 94, 94, 1) 31%,
                rgba(49, 49, 49, 1) 100%
              );
              box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.5);
            }
          }
          .friend-list {
            background: linear-gradient(180deg, #7f0013, #c2392c);
            border-radius: 2.666vw;
            padding: 1.6vw;
            width: 81.33vw;
            margin: 0 auto;
            .list {
              background: #fff
                url("https://files.eyee.com/mcdn/img/store/friend_bg.png") 0 0
                no-repeat;
              background-size: 100% 100%;
              border-radius: 1.333vw;
              padding: 3.733vw 3.199vw 5.066vw 3.199vw;
              .title {
                width: 71.475%;
                margin: 0 auto;
                margin-bottom: 4vw;
                color: #e1001f;
                font-size: 4.8vw;
                font-family: 'OswaldBold';
                .fe-pic {
                  width: 9.6vw;
                  margin-right: 2px;
                }
                .af-pic {
                  width: 44vw;
                  margin-left: 2px;
                }
              }
            }
            .clickbtn {
              width: 100%;
            }
            .header {
              padding: 0 4.533vw;
              .item {
                width: 13.33vw;
                height: 13.33vw;
                background: url("https://files.eyee.com/mcdn/img/store/add.png")
                  0 0 no-repeat;
                background-size: 100% 100%;
                border-radius: 50%;
                margin-bottom: 5.555%;
                overflow: hidden;
                &:nth-child(3n + 2) {
                  margin: 0 15.925% 5.555%;
                }
              }
            }
          }
        }
      }
    }
    .history {
      padding: 5.333vw 0 5.34vw;
      .title {
        font-size: 4.8vw;
        color: #fff;
        font-weight: bold;
        margin-bottom: 4vw;
      }
      .gradient {
        background: linear-gradient(#000000, #5d5d5d);
        padding: 1.6vw;
        border-radius: 2.666vw;
        // border: 1.6vw solid;
        margin-bottom: 2.66vw;
        // height: 32vw;
        overflow: hidden;
        .pic {
          background: #fff;
          border-radius: 1.333vw;
          overflow: hidden;
        }
      }
    }
    .act-rule {
      padding-top: 5.333vw;
      .title {
        font-size: 4.8vw;
        color: #fff;
        font-weight: bold;
        margin-bottom: 4vw;
      }
      .gradient {
        background: linear-gradient(#000000, #5d5d5d);
        padding: 1.6vw;
        border-radius: 2.666vw;
        .act-txt {
          padding: 6.4vw 3.7333vw 9.066vw 3.7333vw;
          font-size: 14px;
          color: #646464;
          background: #fff
            url("https://files.eyee.com/mcdn/img/store/rule_bg.png") 0 0
            no-repeat;
          background-size: 100% 100%;
          border-radius: 1.333vw;
        }
      }
    }
    .app-title {
      font-size: 6.4vw;
      color: #fff;
      font-weight: bold;
      margin-bottom: 5.33vw;
      .logo {
        width: 12.2666vw;
        height: 12.2666vw;
        margin-right: 1.6vw;
        // background: #000000;
      }
      .small {
        font-size: 4vw;
      }
    }
  }

  .modal {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: transparent;
    transition: background 0.3s ease-in;
    pointer-events: none;
    z-index: 10;
    &.act {
      pointer-events: unset;
      background: rgba(0, 0, 0, 0.6);
      .ct {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
    }
    .ct {
      position: absolute;
      width: 87.533vw;
      bottom: auto;
      left: auto;
      left: 50%;
      top: 50%;
      border-radius: 8rpx;
      padding-bottom: 32px;
      transform: translateX(-50%) translateY(-200vh);
      .icon-txt {
        position: absolute;
        width: 37.33vw;
        left: 6.133vw;
        top: 17.333vw;
        &.suc {
          width: 47.7733vw;
        }
      }
      .close {
        width: 8vw;
        height: 8vw;
        position: absolute;
        right: 0;
        top: 8vw;
        background: url("https://files.eyee.com/mcdn/img/store/close.png") 0 0
          no-repeat;
        background-size: 100% 100%;
      }
      .reg-label {
        // padding: 6vw 7vw 8.533vw 7vw;
        padding: 0 7vw 5.533vw 7vw;
        // background: white;
        // background-size: 100% auto;
        // box-shadow: 0px -4px 9px 0px rgba(38, 0, 0, 0.15) inset,
        //   0px 0px 19px 2px rgba(163, 90, 90, 0.69) inset;
        // border-radius: 0 0 8px 8px;
        background: url("https://files.eyee.com/mcdn/img/store/pop_bg.png") left
          bottom no-repeat;
        background-size: cover;
        margin-top: -2px;
        // margin: -4.5vw 3.59vw 0 2.47vw;
        .title {
          font-size: 4.8vw;
          color: #232323;
          font-weight: bold;
          text-align: center;
          width: 58.6vw;
          margin: 0 auto;
        }
        .user-info {
          margin-bottom: 3.2vw;
          margin-right: 1vw;
          position: relative;
          i {
            position: absolute;
            width: 0;
            height: 0;
            transform: rotate(45deg);
            border-width: 1.333vw;
            border-radius: 0.665vw;
            border-color: #e99195 transparent transparent #e99195;
            border-style: solid;
            border-top-left-radius: 0.665vw;
            right: 4vw;
            top: 50%;
            transform: translateY(-50%) rotate(-135deg);
          }
          &.selcet {
            i {
              top: 56%;
              transform: translateY(-50%) rotate(45deg);
            }
          }
          label {
            font-size: 4.5333vw;
            color: #232323;
            font-weight: bold;
            // width: 15.77%;
            white-space: nowrap;
          }
          input {
            width: 55vw;
            height: 13.333vw;
            color: #b4b4b4;
            font-size: 4vw;
            background: rgba(255, 249, 249, 1);
            box-shadow: 0px 2px 5px 0px rgba(234, 190, 183, 0.4) inset;
            border-radius: 6px;
            padding-left: 4vw;
          }
        }
        .submit {
          width: 42.93vw;
          height: 11.733vw;
          font-size: 4.266vw;
          color: #fff;
          font-weight: bold;
          margin: 5.333vw auto 2.666vw;
          background: linear-gradient(
            180deg,
            rgba(216, 103, 116, 1) 0%,
            rgba(222, 73, 75, 1) 12%,
            rgba(193, 5, 34, 1) 100%
          );
          box-shadow: 0px 2px 5px 0px rgba(83, 0, 14, 1);
          border-radius: 6px;
        }
        .desc {
          color: #cc9090;
          font-size: 12px;
          font-weight: bold;
          text-align: center;
        }
      }
    }
  }
  .addresstrans-enter-active,
  .addresstrans-leave-active {
    transition: all 0.5s;
    /* bottom:0; */
  }
  .addresstrans-enter,
  .addresstrans-leave-to {
    transform: translateY(100px);
    opacity: 0;
  }
  .addressBg {
    background: rgba(0, 0, 0, 0.2);
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 100;
    font-size: 14px;
  }
  .addresstrans {
    position: fixed;
    height: 350px;
    background: #fff;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 100;
  }
}
</style>