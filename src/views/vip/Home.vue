<template>
  <div class="vip-home" :class="{'ipx':getIsIphonex}">
    <div class="vh-vip">
      <div v-if="!recommendcode" class="vh-head">
        <div class="hd-avatar" :class="userData.openvip?'open':'unopen'">
          <img v-if="user.imageurl" :src="user.imageurl" alt />
        </div>
        <div class="hd-info">
          <h2>
            {{user.username}}
            <span v-if="userData.openvip">有效期至{{userData.expiretime}}</span>
          </h2>
          <p v-if="userData.openvip">
            邀请码：{{userData.code}}
            <em @click.stop="copyText">复制</em>
            <input type="text" v-model="userData.code" id="inviteCode" readonly />
          </p>
          <p v-else>未成为潮牌合伙人</p>
        </div>
        <div class="hd-tip" @click="gotovip"></div>
      </div>
      <div v-else class="vh-head">
        <div class="hd-avatar">
          <img v-if="userData.recommendimage" :src="userData.recommendimage" alt />
        </div>
        <div class="hd-info">
          <h2>
            你的好友 “{{userData.recommendname}}{{userData.recommendcode}}
            <br />邀请您加入潮牌合伙人
          </h2>
        </div>
      </div>
      <!-- <div class="vh-card">
        合伙人
        <div v-if="userData.openvip" class="cd-head">
          <div class="hd-pick">
            <p class="pk-tit flex-aic" @click="checkDetail">
              可提奖励
              <i class="small"></i>
            </p>
            <p class="pk-price font-price">
              ¥
              <span>{{userData.commission||0}}</span>
            </p>
            <p class="pk-btn" @click="pickUp=true,price=''">立即提取</p>
          </div>
          <div class="hd-pick hd-fans">
            <p class="pk-tit">我的邀请</p>
            <p class="pk-price font-price">
              <span>{{userData.fans}}</span>人
            </p>
            <router-link :to="`/vip/fans?via=${userData.recommendcode}`" class="pk-btn" tag="p">立即查看</router-link>
          </div>
        </div>

        非合伙人
        <div v-else class="cd-head">
          <div class="hd-left">
            <h3>
              <img src="//files.eyee.com/activity/vip/font-group.png" alt />
            </h3>
            <p>
              按去年用户消费计算 一年预计省
              <span>¥{{userData.saveamount}}</span>
            </p>
          </div>
          <div class="hd-btn" @click="openBtnHandle">立即加入</div>
        </div>
        伸缩窗
        <div class="ct-cont" :class="isShow?'ct-active':''">
          <div class="ct-head" @click="isShow=!isShow">
            <p>
              查看合伙人
              <em class="font-price">12</em>大权益
            </p>
            <span>{{isShow?'收起':'展开'}}</span>
          </div>
          <div class="ct-info">
            <img src="//files.eyee.com/activity/vip/bg-weal.png" alt />
          </div>
        </div>
      </div>-->

      <!-- 非潮牌合伙人 -->
      <div class="vh-nonPartner" v-if="!userData.openvip">
        <div v-show="apiFinish">
          <img
            :src="'//files.eyee.com/activity/vip/iter/bg-card.png?c=' + new Date().getTime()"
            alt
          />
          <button class="btn" @click="openBtnHandle">立即开通 &yen;399/年</button>
        </div>
      </div>

      <!-- 潮牌合伙人 -->
      <div class="vh-partner" v-if="userData.openvip">
        <ul class="info" v-show="apiFinish">
          <li class="info-item">
            <div class="info-item-title">累计收益</div>
            <div class="info-item-cost">
              <span class="symbol">&yen;</span>
              <span class="num">{{totalAmount || 0}}</span>
            </div>
            <div class="info-item-btn" @click="checkDetail">查看详情</div>
          </li>
          <li class="split"></li>
          <li class="info-item">
            <div class="info-item-title">可提奖励</div>
            <div class="info-item-cost">
              <span class="symbol">&yen;</span>
              <span class="num">{{userData.commission||0}}</span>
            </div>
            <div class="info-item-btn" @click="pickUp=true,price=''">立即提取</div>
          </li>
          <li class="split"></li>
          <li class="info-item">
            <div class="info-item-title">我的邀请</div>
            <div class="info-item-cost">
              <span class="num">{{userData.fans || 0}}</span>
              <span class="symbol">人</span>
            </div>
            <router-link
              :to="`/vip/fans?via=${userData.recommendcode}`"
              tag="div"
              class="info-item-btn"
            >立即查看</router-link>
          </li>
        </ul>
        <div class="checkEquity" @click="isShow=!isShow">
          <div class="checkEquity-desc">
            查看合伙人
            <span class="bold">12</span>大权益
          </div>
          <div class="checkEquity-open" :class="{'active': isShow}">{{isShow?'收起':'展开'}}</div>
        </div>
        <div class="pic" :class="{'active': isShow}">
          <img :src="'//files.eyee.com/activity/vip/bg_allicon.png?c='+ new Date().getTime()" alt />
        </div>
      </div>

      <!-- 省钱 赚钱 服务-->
      <div class="vip-home-tab">
        <ul class="btn-group" @click="btnClike">
          <li
            class="btn-group-item left"
            :class="{'active': btnGroupIndex ==='0'}"
            data-index="0"
          >省钱</li>
          <li class="btn-group-item" :class="{'active': btnGroupIndex ==='1'}" data-index="1">赚钱</li>
          <li
            class="btn-group-item right"
            :class="{'active': btnGroupIndex ==='2'}"
            data-index="2"
          >服务</li>
        </ul>

        <!-- 省钱 -->
        <div class="saveMoney" v-show="btnGroupIndex === '0'">
          <span class="saveMoney-title">开卡立得399+盲盒礼包</span>
          <img
            :src="'//files.eyee.com/activity/vip/iter/display_window.png?c='+ new Date().getTime()"
            alt
          />
          <ul class="saveMoney-imgList">
            <router-link tag="li" class="item1" to="/active/81a5bfa03c8446298466a9f6244f5568"></router-link>
            <router-link tag="li" class="item2" to="/vip/video"></router-link>
            <li tag="li" class="item3" @click="toBlindBox"></li>
          </ul>
          <div class="saveMoney-footer">
            <div class="btn" @click="getGiftHandle">{{!userData.openvip?'开卡后即可领取': '已领取 查看物流'}}</div>
          </div>
          <img :src="'//files.eyee.com/activity/vip/iter/coupon.png?c='+ new Date().getTime()" alt />
        </div>
        <!-- 赚钱 -->
        <div class="makeMoney" v-show="btnGroupIndex === '1'">
          <span class="makeMoney-title">邀请好友开会员得福利</span>
          <router-link :to="{path:'/vip/invite',query:{recommendcode:userData.code||''}}" tag="div">
            <img
              v-if="!userData.openvip"
              :src="'//files.eyee.com/activity/vip/iter/invite_friends.png?c='+new Date().getTime()"
              alt
            />
            <img
              v-else
              :src="'//files.eyee.com/activity/vip/iter/invite_friends_1.png?c='+new Date().getTime()"
              alt
            />
          </router-link>
          <div class="makeMoney-title">
            <span class="left">尖货竞拍 提前抢</span>
          </div>
          <div class="makeMoney-window" @click="toGoodsAuction">
            <span
              class="row1"
            >最近一期 提前抢购：{{status === 1 ? '进行中':status===2?'已结束':status === 3?'即将开始':''}}</span>
            <span class="row2">会员专属通道可提前抢购，先人一步</span>
            <div class="pic">
              <img :src="imageUrl + '?c=' + new Date().getTime()" alt />
            </div>
            <div class="row3">
              更有不定期空投惊喜，尖货商品提前
              <span class="spic">免费送</span>
            </div>
          </div>
          <div class="makeMoney-title">
            <span class="left">潮品推广 最高返30%</span>
            <span class="right" @click="toWXPage('home')">查看更多</span>
          </div>
          <ul class="makeMoney-tidePromotion">
            <li
              class="makeMoney-tidePromotion-item"
              v-for="(item,index) in tidePromotionList"
              :key="'tidePromotion'+index"
              @click="toWXPage('detail', item)"
            >
              <div class="picture">
                <img :src="item.mainpic" class="pic" alt />
                <div class="picture-modal"></div>
              </div>
              <div class="price">
                推广价
                <span
                  class="num"
                >&yen;{{item.specialprice ? item.specialprice:item.saleprice?item.saleprice: 0}}</span>
              </div>
              <div class="normalPrice" v-if="item.specialprice">&yen;{{item.saleprice || 0}}</div>
              <div style="height: 21px;" v-else></div>
              <div class="btn">
                赚
                <span class="num">&yen;{{item.returnmoney}}</span>
              </div>
            </li>
          </ul>
        </div>
        <!-- 服务 -->
        <div class="server" v-show="btnGroupIndex === '2'">
          <div class="server-title">
            <span class="left">斗牛服务卡1年免费使用</span>
            <span class="right" @click="goSneakerMonitorPage">查看更多</span>
          </div>
          <img
            :src="'//files.eyee.com/activity/vip/iter/shoes1.png?c='+ new Date().getTime()"
            @click="goSneakerMonitorPage"
            alt
          />
          <div class="server-title">
            <span class="left">免费10次 在线鉴定</span>
            <span class="right" @click="goSneakerIdentifyPage">查看更多</span>
          </div>
          <img
            :src="'//files.eyee.com/activity/vip/iter/shoes2.png?c=' + new Date().getTime()"
            @click="goSneakerIdentifyPage"
            alt
          />
          <div class="server-title">
            <span class="left">更多服务</span>
          </div>
          <img
            :src="'//files.eyee.com/activity/vip/iter/more_service.png?c=' + new Date().getTime()"
            alt
          />
        </div>
      </div>

      <!-- <h1 class="vh-title">加入立得福利</h1>
      <router-link
        :to="{path:'/vip/invite',query:{recommendcode:userData.code||''}}"
        tag="div"
        class="vh-enter"
      >
        <img src="//files.eyee.com/activity/vip/invite-enter.png" alt />
      </router-link>-->
      <!-- <div class="vh-weal">
        <img src="//files.eyee.com/activity/vip/bg-product.png" alt />
        <router-link to="/vip/video" class="vh-video"></router-link>
        <span @click="getGiftHandle">{{!userData.orderno?'领取礼包 可得3件':'已领取 查看物流'}}</span>
      </div>-->
      <!-- <div class="vh-coupon" @click="joinBtnHandle">
        <img src="//files.eyee.com/activity/vip/bg-coupon.png" alt />
        <span :class="!userData.openvip?'join':'get'">{{!userData.openvip?'加入领取':'已领取'}}</span>
      </div>-->
    </div>
    <div v-if="c2c.list.length>0" class="vh-list">
      <h4>潮货推荐</h4>
      <v-list
        :load-handle="()=>{}"
        :more-handle="c2cloadmore"
        :more-handling="c2c.loading"
        :isend="c2c.isend"
      >
        <div class="plist-dbl flex-wrap rcd-list">
          <template v-for="(iC2c,c2cIdx) in c2c.list">
            <product-unit
              :key="'c2c'+c2cIdx"
              :product-item="iC2c"
              :product-type="20"
              :is-find-sim="1"
              :home="true"
              :homeLocation="c2cIdx"
              :position="1"
            ></product-unit>
          </template>
        </div>
      </v-list>
    </div>
    <div v-if="pickUp" class="dialog" @touchmove.prevent>
      <div class="form">
        <p class="font-price">
          奖励奖池：
          <em>¥</em>
          {{userData.commission}}
        </p>
        <p>
          <input type="number" v-model="price" placeholder="输入你要提取的金额" />
        </p>
        <div class="footer">
          <span class="btn" @click="pickUp=false">取消</span>
          <span class="btn" @click="comfirm">确认提取</span>
        </div>
      </div>
    </div>

    <!-- 底部tab -->
    <div class="flex-btwn footer-tab" :class="{'ipx':getIsIphonex}">
      <div class="flex-col-ctr sub act">
        <img src="https://files.eyee.com/activity/vip/icon_tab.png" />
        <span>会员中心</span>
      </div>
      <div class="flex-col-ctr sub" @click="goback">
        <img src="https://files.eyee.com/activity/vip/icon_tab_money_act.png" />
        <span>推广赚</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ProductUnit from "@/components/templates/ProductUnit";
import {
  withdraw,
  vipindexInfo,
  vipindexUnlogin,
  GetTotalAmount,
  GetRecentActivity,
  Productlist
} from "@/utils/api/vip";
import { Searchpproduct } from "@/utils/api/mall";
import { getUrlParam } from "../../common/util";
export default {
  components: { ProductUnit },
  name: "VipHome",
  data() {
    return {
      apiFinish: false, // 接口是否调用完毕标识
      tidePromotionList: [], // 潮品推广列表
      imageUrl: "", // 尖货竞拍图片地址
      status: null,
      totalAmount: 0, // 累计收益
      btnGroupIndex: "0",
      isShow: false,
      price: "",
      pickUp: false,
      query: {
        amount: "",
        type: 1
      },
      inviteCode: "12214fxdd2",
      c2c: {
        list: [],
        loading: false,
        isend: false,
        pageindex: 1
      },
      c2cParam: {
        hometabid:
          process.env.NODE_ENV !== "production"
            ? "ca42a9d1969a46b29003702b8f587517"
            : "10742b21e9c444369b360a9ff6b02f05"
      },
      userData: {},
      recommendcode: null
    };
  },
  watch: {
    price: function(newVal, oldVal) {
      if (newVal.toString().includes("-")) {
        this.price = Number(newVal.toString().replace(/\-/g, ""));
      }
      if (newVal === "" && oldVal.toString().indexOf(".") > 0) {
        this.price = oldVal;
        return;
      }
      if (newVal) {
        newVal = newVal.toString();
        var pointIndex = newVal.indexOf(".");
        if (pointIndex > 0 && newVal.length - pointIndex > 3) {
          this.price = oldVal;
          return;
        }
      }
    }
  },
  beforeMount() {
    let _ = this;
    _.setToolBar({
      title: "潮牌合伙人"
    });
  },
  mounted() {
    let _ = this;
    if (!_.$root.ISAPP) {
      // _.confirm({
      //   msg: "请在【斗牛DoNew】APP内操作?",
      //   okText: "立即前往",
      //   cancelBtn: 1,
      //   ok: () => {
      //     _.openAppClient();
      //     setTimeout(() => {
      //       _.$router.replace("/loadapp");
      //     }, 800);
      //   }
      // });
      _.loadUnlogin();
    } else if (_.$root.loging) {
      _.$root.loging
        .then($ => {
          // console.log("登录返回信息", $);
          _.checkLogin(() => {
            _.load();
            _.getVersion();
          });
        })
        .catch(e => {
          console.error("query prams auto login error:", e);
          _.loadUnlogin();
        });
    } else {
      _.loadUnlogin();
    }
    // 登录回调
    window._appLoginCallback = function(json) {
      if (json) {
        _.getQueryParamUser(json).then(res => {
          _.load();
        });
      } else _.toast("登录失败~");
    };
    // 隐藏分享按钮
    _.javascriptBridge({
      name: "getAppActivityShareContent",
      params: {
        hideshareicon: true
      }
    });
    _.c2cSearch();
    // _.load();

    // 尖货竞拍
    _.getRecentActivity();
    // 潮品推广
    _.getProductlist();
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    loged() {
      return !!(this.user && this.user.uid);
    },
    getIsIphonex() {
      if (this.$root.ISIOS) {
        return !!(
          (screen.width == 375 && screen.height == 812) ||
          (screen.width === 414 && screen.height === 896)
        );
      }
    }
  },
  methods: {
    // 尖货竞拍
    toGoodsAuction(type) {
      const _ = this;
      _.$router.push("/sneakerticket/detail?activityid=" + _.activityid);
    },
    // 潮品推广跳转
    toWXPage(type, item) {
      const _ = this;
      let params = {};
      params.username = "gh_01d963c62cf5";
      if (type === "home") {
        params.path = "/pages/home/index";
      } else {
        params.path = "/pages/product/detail?id=" + item.id;
      }
      // app
      if (_.$root.ISAPP) {
        let appinteractionproductDetail = {
          name: "callAppOpenMiniProgram",
          params
        };
        _.javascriptBridge(appinteractionproductDetail);
      } else {
        // 提示下载app
        _.confirm({
          msg: "请到APP参加抢购活动哦~",
          okText: "立即前往",
          cancelText: "我再想想",
          ok: _.openAppClient
        });
      }
    },
    // 跳转app球鞋监控页面
    goSneakerMonitorPage() {
      const _ = this;
      // app
      if (_.$root.ISAPP) {
        let appinteractionproductDetail = {
          name: "gotoAppSneakerMonitorPage",
          params: {}
        };
        _.javascriptBridge(appinteractionproductDetail);
      } else {
        // 提示下载app
        _.confirm({
          msg: "请到APP参加抢购活动哦~",
          okText: "立即前往",
          cancelText: "我再想想",
          ok: _.openAppClient
        });
      }
    },
    // 跳转app球鞋鉴定页面
    goSneakerIdentifyPage() {
      const _ = this;
      // app
      if (_.$root.ISAPP) {
        let appinteractionproductDetail = {
          name: "gotoAppSneakerIdentifyPage",
          params: {}
        };
        _.javascriptBridge(appinteractionproductDetail);
      } else {
        // 提示下载app
        _.confirm({
          msg: "请到APP参加抢购活动哦~",
          okText: "立即前往",
          cancelText: "我再想想",
          ok: _.openAppClient
        });
      }
    },
    // 潮品推广
    getProductlist() {
      const _ = this;
      Productlist({
        page: 0,
        size: 6,
        channelid: ""
      })
        .then(res => {
          if (res && res.list.length > 0) {
            if (
              res.list[0].products &&
              res.list[0].products.productlist.length > 0
            ) {
              const list = res.list[0].products.productlist;
              _.tidePromotionList = list.map(item => item);
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 去盲盒商品详情页
    toBlindBox() {
      let id = null;
      console.log("process.env.NODE_ENV", process.env.NODE_ENV);
      if (process.env.NODE_ENV == "production") {
        id = "21425ae2501440fd8938a07d7da504e4";
      } else {
        id = "ee85a74cdc174ac8ac3e30374854cbe6";
      }
      // app
      if (this.$root.ISAPP) {
        let appinteractionproductDetail = {
          name: "gotoAppProductDetailPage",
          params: { productid: id }
        };
        this.javascriptBridge(appinteractionproductDetail);
      } else {
        // h5 /productDetail/商品id
        this.$router.push("/productDetail/" + id);
      }
    },
    btnClike(e) {
      const _ = this;
      _.btnGroupIndex = e.target.dataset.index;
    },
    checkLogin(call = () => {}) {
      let _ = this;
      if (_.loged) call();
      else {
        _.confirm({
          title: "登录提示",
          msg: "请登录后重试~",
          okText: "前往登录",
          cancelText: "容我想想",
          ok: () => {
            _.javascriptBridge({
              name: "callAppLoginPage",
              params: { callbackname: "_appLoginCallback" }
            });
          }
        });
      }
    },
    checkDetail() {
      this.$router.push("/check/detail");
    },
    goback() {
      let _ = this;
      _.$router.push(`/promotion/goods`);
    },
    getVersion() {
      //  判断APP 版本
      let _ = this,
        param = "";
      let UrlParam = getUrlParam("param");

      if (UrlParam && UrlParam != "undefined") {
        param = JSON.parse(decodeURIComponent(getUrlParam("param"))) || "";
        // console.log("地址栏参数", window.ENV.version);
        localStorage.setItem("APP_Version", param.version);
      }
    },
    load() {
      let _ = this;
      let { toast, recommendcode } = _;
      vipindexInfo()
        .then(res => {
          _.userData = res;
          if (res.openvip) {
            _.btnGroupIndex = "1";
            // 查询累计收益
            _.getTotalAmount();
          } else {
            _.btnGroupIndex = "0";
          }
          sessionStorage.setItem(
            "vipInfo",
            JSON.stringify({
              payamount: res.payamount,
              viptexturl: res.viptexturl,
              saveamount: res.saveamount,
              orderno: res.orderno,
              recommendcode: res.recommendcode,
              openvip: res.openvip
            })
          );
        })
        .catch(e => {
          toast("加载失败");
        });
    },
    // 获取累计收益
    getTotalAmount() {
      const _ = this;
      GetTotalAmount({})
        .then(res => {
          if (res) {
            _.totalAmount = res.totalamount;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 尖货竞拍 提前抢
    getRecentActivity() {
      const _ = this;
      GetRecentActivity()
        .then(res => {
          if (res) {
            _.activityid = res.id;
            _.status = res.status;
            _.imageUrl = res.image;
            _.apiFinish = true;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    loadUnlogin() {
      let _ = this;
      let { toast, recommendcode } = _;
      vipindexUnlogin()
        .then(res => {
          _.userData = res;
          if (res.openvip) {
            _.btnGroupIndex = "1";
          } else {
            _.btnGroupIndex = "0";
          }
          sessionStorage.setItem(
            "vipInfo",
            JSON.stringify({
              payamount: res.payamount,
              viptexturl: res.viptexturl,
              saveamount: res.saveamount,
              orderno: res.orderno,
              recommendcode: res.recommendcode,
              openvip: res.openvip
            })
          );
        })
        .catch(e => {
          toast("加载失败");
        });
    },
    gotovip() {
      let _ = this;
      window.location.href = _.userData.viptexturl;
    },
    openBtnHandle() {
      let _ = this;
      let { toast, user, confirm } = _;
      if (!user || !user.token) {
        confirm({
          title: "登录提示",
          msg: "请登录后重试~",
          okText: "前往登录",
          cancelText: "容我想想",
          ok: () => {
            _.javascriptBridge({
              name: "callAppLoginPage",
              params: { callbackname: "_appLoginCallback" }
            });
          }
        });
        return;
      }
      let { recommendcode } = _.userData;
      if (recommendcode) {
        _.$router.push(`/vip/join?via=${recommendcode}`);
      } else {
        _.$router.push("/vip/prejoin");
      }
    },
    joinBtnHandle() {
      let _ = this;
      let { toast, user, confirm } = _;
      if (!user || !user.token) {
        confirm({
          title: "登录提示",
          msg: "请登录后重试~",
          okText: "前往登录",
          cancelText: "容我想想",
          ok: () => {
            _.javascriptBridge({
              name: "callAppLoginPage",
              params: { callbackname: "_appLoginCallback" }
            });
          }
        });
        return;
      }
      let { openvip, recommendcode } = _.userData;
      if (!openvip) {
        if (recommendcode) {
          _.$router.push(`/vip/join?via=${recommendcode}`);
        } else {
          _.$router.push("/vip/prejoin");
        }
      }
    },
    getGiftHandle() {
      let _ = this;
      let { toast, user, confirm } = _;
      if (!user || !user.token) {
        confirm({
          title: "登录提示",
          msg: "请登录后重试~",
          okText: "前往登录",
          cancelText: "容我想想",
          ok: () => {
            _.javascriptBridge({
              name: "callAppLoginPage",
              params: { callbackname: "_appLoginCallback" }
            });
          }
        });
        return;
      }
      let { orderno, productid, openvip } = _.userData;
      if (!orderno) {
        if (openvip) {
          _.$router.push(`/vip/weal/receive/${productid}`);
        } else {
          _.$router.push("/vip/prejoin");
        }
      } else {
        _.javascriptBridge({
          name: "callAppOrderDetail",
          params: {
            type: 3, // vip
            orderno: _.userData.orderno // 订单号
          }
        });
      }
    },
    c2cSearch() {
      let _ = this,
        pageindex = _.c2c.pageindex;
      _.c2c.loading = true;
      Searchpproduct({ pageindex, hometabid: _.c2cParam.hometabid })
        .then(res => {
          if (res && res.list && res.list.length) {
            res.list = res.list.map(i => {
              if (i.showtype == 0 || !i.showtype)
                return {
                  /**
                   * "{"id":"","name":"","sumcount":186,"isc2c":0,"businessname":"","businesstype":2,"brandname":"","mainpic":"","saleprice":188,"specialprice":0,"soldout":false,"producttype":0,"discountoff":0,"salestatus":1,"requestid":""}"
                   */
                  id: i.productid,
                  name: i.productname,
                  mainpic: i.productimg,
                  saleprice: i.saleprice,
                  specialprice: i.specialprice,
                  isc2c: i.isc2c,
                  paynumber: i.paynum,
                  producttype: i.producttype,
                  discountoff: i.discountoff,
                  platformactivityicon: i.platformactivityicon
                };
              else {
                // 处理 showtype>0 时 vicetitle
                if (i.showtype > 0 && i.vicetitle) {
                  i.vicetitle0 = i.vicetitle.split(",")[0];
                  i.vicetitle1 = i.vicetitle.split(",")[1];
                }
                return i;
              }
            });
            if (pageindex === 1) _.c2c.list = res.list;
            else _.c2c.list = _.c2c.list.concat(res.list);
            _.c2c.isend =
              res.page * res.size >= res.total && _.c2c.list.length > 0;
          } else _.c2c.isend = true;

          _.c2c.loading = false;
        })
        .catch(e => {
          _.c2c.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    c2cloadmore() {
      let _ = this;
      if (_.c2c.loading) return;
      if (_.c2c.isend) _.toast("已无更多");
      else {
        _.c2c.pageindex++;
        _.c2cSearch();
      }
    },
    comfirm() {
      let _ = this;
      let { query, price, toast, load } = _;
      if (!price) {
        toast("请输入提取金额");
        return;
      }
      if (price * 1 === 0) {
        toast("提取金额需大于0");
        return;
      }
      if (price * 1 > _.userData.commission * 1) {
        toast("提取金额需小于钱包余额");
        return;
      }
      _.query.amount = price;
      withdraw(query)
        .then(res => {
          toast("提取成功，已存入你账户余额");
          _.pickUp = false;
          load();
        })
        .catch(e => {
          toast("提取失败");
          _.pickUp = false;
        });
    },
    copyText() {
      document.execCommand("Copy");
      var inviteCode = document.getElementById("inviteCode");
      inviteCode.select();
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.toast("复制成功！");
    }
  }
};
</script>
<style lang="scss">
.vip-home {
  padding-bottom: 13.0666vw;
  &-tab {
    width: 100%;
    margin-top: 30px;
    padding: 0 15px;
    .btn-group {
      color: #f2b776;
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(242, 183, 118, 1);
      display: flex;
      width: 270px;
      margin: 0 auto 10px auto;
      &-item {
        width: 90px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        background: rgba(60, 59, 59, 1);
        &.left {
          border-radius: 94px 0px 0px 94px;
        }
        &.right {
          border-radius: 0px 100px 100px 0px;
        }
        &.active {
          background: #c5945f;
          color: rgba(0, 0, 0, 1);
        }
      }
    }
    &-title {
      display: block;
      font-size: 18px;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      height: 70px;
      line-height: 70px;
    }
    .saveMoney,
    .makeMoney,
    .server {
      img {
        display: block;
        width: 100%;
      }
      &-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        font-family: "PingFangSC-Semibold, PingFang SC";
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        height: 70px;
        line-height: 70px;
        .right {
          font-size: 13px;
          font-weight: 400;
          color: rgba(150, 150, 150, 1);
          display: flex;
          justify-content: center;
          align-items: center;
          &::after {
            display: inline-block;
            content: "";
            width: 12px;
            height: 12px;
            background: url(//files.eyee.com/activity/vip/iter/icon_more.png)
              no-repeat;
            background-size: cover;
            overflow: hidden;
            margin-left: 5px;
          }
        }
      }
      &-imgList {
        display: flex;
        flex: 1;
        li {
          width: 30.9vw;
          height: 64px;
          &.item1 {
            background: url(//files.eyee.com/activity/vip/iter/brand.png)
              no-repeat;
            background-size: cover;
            overflow: hidden;
          }
          &.item2 {
            background: url(//files.eyee.com/activity/vip/iter/dress.png)
              no-repeat;
            background-size: cover;
            overflow: hidden;
          }
          &.item3 {
            background: url(//files.eyee.com/activity/vip/iter/style.png)
              no-repeat;
            background-size: cover;
            overflow: hidden;
          }
        }
      }
      &-footer {
        height: 123px;
        background: url(//files.eyee.com/activity/vip/iter/foot_box.png)
          no-repeat;
        background-size: cover;
        overflow: hidden;
        position: relative;
        margin-bottom: 30px;
        .btn {
          width: 53.3vw;
          height: 60px;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          padding: 20px 0 0 0;
          color: rgba(35, 35, 35, 1);
          background: linear-gradient(
            180deg,
            rgba(226, 153, 73, 1) 0%,
            rgba(255, 205, 149, 1) 13%,
            rgba(230, 131, 59, 1) 14%,
            rgba(239, 181, 135, 1) 100%
          );
          border-radius: 6px;
          position: absolute;
          bottom: 21px;
          right: 10px;
        }
      }
      &-window {
        width: 100%;
        // min-height: 294px;
        background: rgba(51, 51, 51, 1);
        border-radius: 6px 0px 0px 6px;
        padding: 15px;
        box-sizing: border-box;
        font-size: 13px;
        line-height: 25px;
        .pic {
          width: 100%;
          // min-height: 165px;
          margin: 10px 0;
          img {
            border-radius: 6px;
          }
        }
        .row1 {
          display: block;
          font-weight: 600;
          color: rgba(255, 198, 137, 1);
        }
        .row2 {
          display: block;
          font-weight: 400;
          color: rgba(205, 205, 205, 1);
        }
        .row3 {
          font-weight: 400;
          color: rgba(205, 205, 205, 1);
          .spic {
            color: #ffc689;
          }
        }
      }
      &-tidePromotion {
        display: flex;
        overflow-y: hidden;
        &-item {
          background: #fff;
          border-radius: 4px;
          overflow: hidden;
          text-align: center;
          border-radius: 4px;
          min-width: 140px;
          &:not(:first-child) {
            margin-left: 15px;
          }
          .picture {
            position: relative;
            &-modal {
              width: 140px;
              height: 140px;
              position: absolute;
              top: 0;
              left: 0;
              background: rgba(0, 0, 0, 0.04);
            }
            .pic {
              width: 140px;
              height: 140px;
              line-height: 30px;
            }
          }

          .price {
            font-size: 12px;
            color: #232323;
            font-weight: 600;
            margin-top: 5px;
            .num {
              font-family: OswaldBold;
            }
            .height {
              line-height: 35px;
            }
          }
          .normalPrice {
            font-size: 12px;
            color: #969696;
            text-decoration: line-through;
            min-height: 16px;
            margin-top: 5px;
          }
          .btn {
            width: 110px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background: linear-gradient(
              180deg,
              rgba(218, 173, 118, 1) 0%,
              rgba(186, 135, 84, 1) 100%
            );
            border-radius: 16px;
            color: #fff;
            font-size: 17px;
            font-weight: 600;
            margin: 6px auto 10px auto;
            .num {
              font-family: OswaldBold;
            }
          }
        }
      }
    }
  }
  &.ipx {
    padding-bottom: 22.4vw;
  }
  img {
    display: block;
  }
  .vh-vip {
    padding-bottom: 20px;
    background-color: #232323;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.05);
  }
  .vh-head {
    display: flex;
    padding: 15px 20px;
    align-items: center;
  }
  .hd-avatar {
    width: 40px;
    height: 40px;
    background: url(//files.eyee.com//user/defaultUserIcon.png) no-repeat;
    background-size: contain;
    border-radius: 100%;
    overflow: hidden;
  }
  .open {
    border: 1px solid #eac39d;
  }
  .unopen {
    border: 1px solid #fff;
  }
  .hd-info {
    flex: 1;
    line-height: 20px;
    padding-left: 10px;

    h2 {
      padding-right: 5px;
      font-size: 16px;
      color: #fff;

      span {
        padding-left: 10px;
        font-size: 12px;
        color: #7e7e7e;
        font-weight: normal;
      }
    }
    p {
      font-size: 12px;
      color: #cbcbcb;

      input {
        opacity: 0;
        width: 60px;
      }
    }
    em {
      display: inline-block;
      background-color: #545454;
      line-height: 20px;
      padding: 0 5px;
      margin-left: 5px;
      border-radius: 10px;
      font-size: 10px;
      transform: scale(0.84);
    }
  }
  .hd-tip {
    width: 16px;
    height: 16px;
    background: url(//files.eyee.com/activity/vip/ico-rule.png) no-repeat;
    background-size: contain;
  }
  .vh-nonPartner {
    border-radius: 6px 0 0 6px;
    min-height: 428px;
    margin-left: 15px;
    overflow: hidden;
    position: relative;
    .btn {
      font-size: 16px;
      font-family: "PingFangSC-Semibold, PingFang SC";
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
      width: 77.3vw;
      height: 47px;
      background: linear-gradient(
        180deg,
        rgba(218, 173, 118, 1) 0%,
        rgba(186, 135, 84, 1) 100%
      );
      border-radius: 24px;
      margin: 0 auto;
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
  .vh-partner {
    border-radius: 6px 0 0 6px;
    margin-left: 15px;
    padding: 20px 20px 0 20px;
    background: url(//files.eyee.com/activity/vip/iter/bg_big1.png) no-repeat;
    background-size: cover;
    overflow: hidden;
    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .split {
        width: 1px;
        height: 82px;
        background: rgba(97, 87, 77, 1);
      }
      &-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &-title {
          font-size: 12px;
          font-weight: 400;
          color: rgba(196, 153, 120, 1);
        }
        &-cost {
          color: #ffc689;
          font-family: OswaldBold;
          font-weight: 500;
          font-size: 14px;
          .num {
            font-size: 30px;
          }
        }
        &-btn {
          width: 64px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          border-radius: 15px;
          border: 1px solid rgba(96, 85, 75, 1);
          font-size: 12px;
          font-weight: 600;
          color: rgba(196, 153, 120, 1);
          margin: 10px 0;
        }
      }
    }
    .checkEquity {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      color: rgba(255, 198, 137, 1);
      font-weight: 400;
      font-size: 12px;
      padding: 7px 0px 20px 0;
      &-desc {
        font-family: OswaldBold;
        .bold {
          font-weight: 500;
          font-size: 20px;
        }
      }
      &-open {
        &::after {
          display: inline-block;
          content: "";
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid #ba967a;
          transition: all 0.2s linear;
          margin: 0 5px;
        }
        &.active::after {
          transform: rotate(-180deg);
        }
      }
    }
    .pic {
      height: 0;
      transition: all 0.2s linear;
      &.active {
        margin-bottom: 25px;
        height: auto;
      }
    }
  }
  .vh-card {
    min-height: 135px;
    // background: linear-gradient(153deg, #f9e2cb 0%, #e6ba90 100%);
    background: url(//files.eyee.com/activity/vip/bg-card.png) no-repeat;
    background-size: cover;
    border-radius: 6px 0 0 6px;
    margin-left: 15px;
    padding: 20px 20px 0 20px;
    overflow: hidden;
  }
  .cd-head {
    display: flex;
  }
  .hd-pick {
    padding-bottom: 9px;
    line-height: 17px;
  }
  .hd-pick:first-child {
    padding-left: 4px;
  }
  .hd-fans {
    position: relative;
    margin-left: 30px;
    padding-left: 30px;
    flex: 1;

    &::after {
      position: absolute;
      content: "";
      top: 10px;
      bottom: 10px;
      left: 0;
      width: 1px;
      background-color: #61574d;
      transform: translateX(50%);
    }
  }
  .pk-tit {
    font-size: 12px;
    color: #c49978;
    .small {
      display: inline-block;
      transform: scale(0.833);
      // margin-left: 2px;
      position: relative;
      &::after {
        content: "";
        width: 3.466vw;
        height: 3.466vw;
        background: url("https:files.eyee.com/activity/vip/icon_right.png") 0 0
          no-repeat;
        background-size: 100% 100%;
        top: 55%;
        transform: translateY(-50%);
        position: absolute;
        right: -3.733vw;
      }
    }
  }
  .pk-price {
    line-height: 45px;
    padding-bottom: 2px;
    color: #ffc689;

    span {
      font-size: 30px;
      font-weight: 500;
    }
  }
  .pk-btn {
    width: 64px;
    line-height: 25px;
    border: 1px solid #60554b;
    border-radius: 20px;
    text-align: center;
    font-size: 12px;
    color: #c49978;
  }
  .hd-left {
    flex: 1;
    line-height: 28px;

    h3 {
      margin: 4px 0 15px;
      width: 114px;
      height: 22px;
      overflow: hidden;
    }
    p {
      font-size: 12px;
      color: #c49978;
    }
    span {
      font-weight: bold;
      color: #ffc689;
    }
  }
  .hd-btn {
    width: 72px;
    height: 27px;
    line-height: 27px;
    margin-top: 10px;
    background-color: #ffc689;
    border-radius: 14px;
    color: #3c3c3b;
    font-size: 12px;
    text-align: center;
    font-weight: 500;
  }
  .ct-head {
    display: flex;
    align-items: center;
    padding: 7px 20px 27px 0;
    color: #ffc689;
    font-size: 12px;

    p {
      flex: 1;
    }
    em {
      padding: 0 3px;
      font-weight: 500;
      font-size: 18px;
    }
    span {
      position: relative;
      top: 4px;
      display: block;
      color: #c49978;
      font-size: 12px;

      &::after {
        position: absolute;
        left: 30px;
        top: 6px;
        content: "";
        width: 0;
        height: 0;
        border-width: 5px;
        border-style: solid;
        border-color: #ba967a transparent transparent transparent;
        transition: all 0.2s linear;
      }
    }
  }
  .ct-info {
    height: 0;
    background: linear-gradient(
      153deg,
      rgba(54, 54, 54, 0.89) 0%,
      rgba(63, 63, 63, 0.89) 100%
    );
    transition: all 0.2s linear;
    padding: 0 5%;
    border-radius: 4px;
  }
  .ct-active {
    .ct-info {
      padding: 20px 5%;
      height: auto;
      margin-bottom: 20px;
    }
    span {
      &::after {
        top: 2px;
        transform: rotate(-180deg);
      }
    }
  }
  .vh-title {
    position: relative;
    padding: 20px 15px 8px 45px;
    font-size: 18px;
    color: #fff;

    &::after {
      position: absolute;
      top: 24px;
      left: 15px;
      content: "";
      width: 20px;
      height: 20px;
      background: url(//files.eyee.com/activity/vip/ico-vip.png) no-repeat;
      background-size: contain;
    }
  }
  .vh-enter {
    padding: 0 15px;
  }
  .vh-weal {
    position: relative;
    padding: 20px 15px 15px 15px;

    .vh-video {
      position: absolute;
      top: 10%;
      right: 7%;
      left: 7%;
      height: 67%;
    }
    span {
      position: absolute;
      top: 83%;
      right: 8.8%;
      width: 53.3%;
      height: 11.1%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 4px;
      border-radius: 6px;
      background: linear-gradient(
        #e29949 0%,
        #ffcd95 10%,
        #e6833b 11%,
        #efb587 100%
      );
      font-size: 18px;
      color: #232323;
      font-weight: bold;
    }
  }
  .vh-list {
    h4 {
      padding: 5px 15px 0 15px;
      line-height: 54px;
      color: #232323;
      font-size: 18px;
    }
    .plist-dbl {
      padding: 0 10px;
    }
  }
  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    .form {
      border-radius: 4px;
      padding: 20px;
      text-align: center;
      background-color: #fff;
      line-height: 30px;
      p {
        font-size: 18px;
        color: #232323;
        font-weight: bold;
        em {
          font-size: 14px;
        }
      }
      input {
        background-color: #f0f0f0;
        width: 100%;
        padding: 10px;
        line-height: 24px;
        margin: 20px 0;
        font-size: 14px;
      }
      .footer {
        display: flex;
        span {
          width: 118px;
          line-height: 44px;
          border-radius: 2px;
          border: 1px solid #fa2337;
          background-color: #fa2337;
          text-align: center;
          font-size: 16px;
          color: #fff;
          font-weight: 500;
        }
        span:first-child {
          margin-right: 10px;
          background-color: #fff;
          color: #fa2337;
        }
      }
    }
  }
  .vh-coupon {
    position: relative;
    padding: 0 15px;
    span {
      position: absolute;
      top: 38%;
      right: 7%;
      width: 25.3%;
      height: 39.1%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .get {
      border: 1px solid #979797;
      font-size: 16px;
      color: #959595;
      border-radius: 4px;
    }
    .join {
      padding-top: 4px;
      border-radius: 6px;
      background: linear-gradient(
        #e29949 0%,
        #ffcd95 10%,
        #e6833b 11%,
        #efb587 100%
      );
      font-size: 18px;
      color: #232323;
      font-weight: bold;
    }
  }
  .productItem {
    background-color: #fafafa !important;
    width: calc(50% - 10px);
    margin: 5px;
    padding: 0;
    border-radius: 6px;
    overflow: hidden;
    .product_name {
      margin-top: 10px;
      padding: 0 10px !important;
      font-size: 13px;
      font-weight: normal;
    }
    .product_img {
      position: relative !important;
      &::after {
        position: absolute;
        content: "";
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.04);
      }
    }
    .isPay {
      margin-top: 5px;
    }
  }
}
.footer-tab {
  position: fixed;
  transform: translateZ(0);
  width: 100vw;
  left: 0;
  bottom: 0;
  background: #fff;
  box-shadow: 0 0 2.667vw 0 rgba(0, 0, 0, 0.1);
  padding-bottom: 1.333vw;
  &.ipx {
    padding-bottom: 9.0666vw;
  }
  .sub {
    flex: 1;
    color: #b4b4b4;
    font-size: 12px;
    font-weight: bold;
    &.act {
      color: #232323;
    }
    img {
      width: 9.0666vw;
      height: 9.0666vw;
    }
    span {
      display: inline-block;
      transform: scale(0.833);
    }
  }
}
</style>