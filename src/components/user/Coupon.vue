<template>
  <div style="padding-bottom:50px;" :class="{insq:insq}">
    <v-header>
      <div class="nav-tab2">
        <h3>{{pageType?'选择优惠':'红包卡券'}}</h3>
      </div>
      <router-link v-show="!pageType" to="/coupondescription" class="icon_qus flex-center">
        <span class=""></span>
      </router-link>
    </v-header>
    <!-- 红包卡券 -->
    <div v-if="!pageType" class="coupon_head">
      <p v-for="(item,index) in typeBar" @click="checkType(item.type)" :class="{checked:item.type==activeindex}" :key="index">{{item.name}}</p>
    </div>
    <!-- 选择优惠 -->
    <div v-if="pageType" class="coupon_head">
      <p v-for="(item,index) in tabBar" @click="checkTab(item.type)" :class="{checked:item.type==activeindex}" :key="index">{{item.name}}</p>
    </div>
    <!-- 红包卡券列表 -->
    <div v-if="!pageType" class="coupon_content" id="order_cou">
      <div class="prompt" v-if="activeTab==2&&showPropt">
        <img class="prompt-icon" src="../../../static/img/sign_in.png">
        <img class="prompt-close" src="../../../static/img/black_close.png" @click="closePrompt()">
        <p>下单红包抵扣，您在确认订单时可以看到红包的折扣消息。</p>
      </div>
      <div v-if="isIphonex">
        <div v-for="(item,index) in userCouponList" class="userful_cou cou_list" :key="index">
          <CouponUnit v-if="activeTab == 0" :cous="item" :isOverdue="overDue(item.useendtime)" class="user_cou" :couType="1" :seleIcon='(pageType==1&&selectedCoupon!=null)?(item.couponuserid==selectedCoupon.couponuserid):false'></CouponUnit>
          <RedpacketUnit v-if="activeTab == 2" :redpec="item" class="user_cou" :status="0" :couType="1" :seleIcon='(pageType==1&&selectedCoupon!=null)?(item.couponuserid==selectedCoupon.couponuserid):false'></RedpacketUnit>
          <CardUnit v-if="activeTab == 1" :cardInfos="item" :cardStatus="activeindex" @showRules="cardRules"></CardUnit>
          <span v-if="activeTab == 0" @click="seleCoupon(item)"></span>
        </div>
      </div>
      <v-list :load-handle='reload' v-if="userCouponList&&userCouponList.length>0&&!isIphonex" :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
        <div v-for="(item,index) in userCouponList" class="userful_cou cou_list" :key="index">
          <CouponUnit v-if="activeTab == 0" :cous="item" :isOverdue="overDue(item.useendtime)" class="user_cou" :couType="1" :seleIcon='(pageType==1&&selectedCoupon!=null)?(item.couponuserid==selectedCoupon.couponuserid):false'></CouponUnit>
          <RedpacketUnit v-if="activeTab == 2" :redpec="item" class="user_cou" :status="0" :couType="1" :seleIcon='(pageType==1&&selectedCoupon!=null)?(item.couponuserid==selectedCoupon.couponuserid):false'></RedpacketUnit>
          <CardUnit v-if="activeTab == 1" :cardInfos="item" :cardStatus="activeindex" @showRules="cardRules"></CardUnit>
          <span v-if="activeTab == 0" @click="seleCoupon(item)"></span>
        </div>
        <div style="text-align:center;">
          <div class="checkout">
            <p v-if="activeTab==0" @click="gohistory(0)">查看历史优惠券</p>
            <p v-if="activeTab==2" @click="gohistory(2)">查看历史红包</p>
            <p v-if="activeTab==1" @click="gohistory(1)">查看历史会员卡</p>
          </div>
        </div>
      </v-list>
    </div>
    <!-- 选择优惠列表 -->
    <div v-if="pageType" class="order_cou" id="order_cou">
      <div v-show="activeTab == 0">
        <div v-for="(item,index) in canUseCoupon" class="userful_cou cou_list" :key="index">
          <OrderCouponUnit :cous="item" :usable="true" :isOverdue="overDue(item.useendtime)" class="user_cou" :seleIcon='(item.operationstatus == 0)?true:false'  ></OrderCouponUnit>
          <!-- <span @click="selectUseCoupon(item)"></span> -->
          <span v-if="item.operationstatus != 1" @click="selectUseCoupon(item)"></span>
        </div>
      </div>
      <div  v-show="activeTab == 1">
        <div v-for="(item,index) in unCanUseCoupon" class="userful_cou cou_list" :key="index">
          <OrderCouponUnit :cous="item" :usable="false" :isOverdue="overDue(item.useendtime)" class="user_cou"></OrderCouponUnit>
        </div>
      </div>
    </div>
    <!-- 红包卡券缺省状态 -->
    <div v-else-if="!pageType&&userCouponList.length<1&&!isLoading">
      <Empty v-if="activeTab==0" :showType=3></Empty>
      <Empty v-if="activeTab==1" :showType=6></Empty>
      <Empty v-if="activeTab==2" :showType=7></Empty>
      <div style="text-align:center;">
        <div class="checkout">
          <p v-if="activeTab==0" @click="gohistory(0)">查看历史优惠券</p>
          <p v-if="activeTab==2" @click="gohistory(2)">查看历史红包</p>
          <p v-if="activeTab==1" @click="gohistory(1)">查看历史会员卡</p>
        </div>
      </div>
    </div>
    <!-- 选择优惠缺省状态 -->
    <div v-else-if="pageType&&canUseCoupon.length<1">
      <Empty v-if="activeTab==0" :showType=14></Empty>
    </div>
    <div v-else-if="pageType&&unCanUseCoupon.length<1">
      <Empty v-if="activeTab==1" :showType=15></Empty>
    </div>

    <div v-if="pageType==0" class="coupon_footer" @click.stop="popupVisible=true">输入兑换码领取福利</div>
    <mt-popup v-if='pageType==0' v-model="popupVisible" position="center" class="code_pop">
      <transition enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
        <div class="code_box" v-show="popupVisible">
          <p>输入兑换码领取福利</p>
          <input type="" name="" value="" v-model="couponCode" placeholder="请输入兑换码">
          <p @click.stop="getCode">确认兑换</p>
        </div>
      </transition>
    </mt-popup>
    <transition name='fade' enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
      <div class="ruleBox" v-show="showRules&& cardRulesInfo">
        <div class="rule_con" v-if="cardRulesInfo.type == 0">
          <section class="top_rules">使用规则</section>
          <section class="bottom_rules">
            <p class="title_card">{{cardRulesInfo.name}}</p>
            <ul class="box_ruleItem">
              <li v-for="(item,index) in cardRulesInfo.memo" :key="index">
                <em></em>{{item}}</li>
            </ul>
          </section>
        </div>
        <div class="rechargeBox" v-if="cardRulesInfo.type == 1" :class="{getFlowS:getFlowsSuccess}">
          <span class="close_reChabox" @click.stop.prevent="closeCardRulesBox()">×</span>
          <template v-if="getFlowsSuccess">
            <p class="label_getImg">
              <img :src="getSuccessImg" alt="">
            </p>
          </template>
          <template v-else>
            <p class="title_reCharge clearfix">输入手机号领取流量</p>
            <label class="flex-aic">
              <span>+86</span><input type="text" placeholder="请输入手机号" v-model="flowMobile"></label>
            <p class="tips_word">仅支持中国境内有效的移动、联通、电信手机号（除港澳台），以领取100M流量</p>
            <p class="msg_tips">{{rechargeWord}}</p>
            <p class="recharge_btn" @click="GetFlows(cardRulesInfo)">确认</p>
          </template>
        </div>
        <span class="close_rulebox" v-if="cardRulesInfo.type == 0" @click.stop.prevent="closeCardRulesBox()"></span>
      </div>
    </transition>
  </div>
</template>
<script>
import { GetUserCoupon, GetCouponByCdKey, FindRedpacketList, GetSneakerOrderCoupon, GetOrderCoupon } from "../../common/api/marketing";
import { GetFlowPackage } from "../../common/api/integral";
import { Checking,DateDiff } from "../../common/util";
import { mapGetters } from "vuex";
import Empty from "../templates/cart/Empty";
import CouponUnit from "../templates/CouponUnit";
import OrderCouponUnit from "../templates/OrderCouponUnit";
import RedpacketUnit from "../templates/RedpacketUnit";
import CardUnit from "../templates/CardUnit";
export default {
  data() {
    return {
      isOverdue: false,
      showRules: false,
      showPropt: true,
      cardRulesInfo: {},
      qusIcon: "//files.eyee.com/mcdn/static/img/user/icon_question.png", // require('../../assets/img/user/icon_question.png'),
      typeBar: [
        { name: "优惠券", type: 0 },
        { name: "红包", type: 2 },
        { name: "会员卡", type: 1 }
      ],
      tabBar: [
        { name: "可用优惠", type: 0 },
        { name: "不可用优惠", type: 1 }
      ],
      activeindex: 0, // 选中标签的样式
      pagedata: { pageindex: 1, status: 0, sumcount: 0, pagesize: 0 },
      userCouponList: [],
      canUseCoupon: [],
      unCanUseCoupon: [],
      isLoading: false,
      isEnd: false,
      popupVisible: false,
      couponCode: null,
      activeBar: 0, // 选择优惠--列表类型  0：可用优惠  1：不可用优惠
      activeTab: 0, // 红包卡券--列表类型  0：优惠券  1：会员卡  2：红包
      flowMobile: null,
      rechargeWord: "",
      getFlowsSuccess: false,
      isIphonex: false,
      getSuccessImg: "//files.eyee.com/mcdn/static/img/card_success.png" // require('../../assets/img/card_success.png')
    };
  },
  components: { Empty, CouponUnit, CardUnit, RedpacketUnit, OrderCouponUnit },
  mounted() {
    if (this.pageType) {
      if (this.$route.query.type == 1) {
        this.getOrderCoupon()
      } else {
        // type为2时，选择C2C优惠
        this.getSneakerCoupon()
      }
    }

    let _ = this;
    var hadshowpropt = this.getCookie("hadshowpropt");
    if(hadshowpropt) this.showPropt = false;
    if (_.pageType == 0) {


      if (_.insq && !_.userInfo.token) {
        const openDataKey = "FC_QZONE_OPENDATA";
        let query = _.$route.query;
        if (!!query.openid || !!window.mqq || window.INSQ) {
          let openData = window.OPEN_DATA
            ? { openid: window.OPEN_DATA.openid }
            : query;
          let old = JSON.parse(
            window.localStorage.getItem(openDataKey) || "{}"
          );
          if (openData && openData.openid)
            window.localStorage.setItem(
              openDataKey,
              JSON.stringify(openData || "")
            );

          _.$store.dispatch("qqCheckAndLogin", {
            setJs: !window.mqq,
            old: old
          });
        }
        setTimeout(() => {
          _.getUserCoupon();
        }, 600);
      } else _.getUserCoupon();
    }

    if (_.pageType == 1 && _.canUseCoupon && _.canUseCoupon.length > 0) {
      console.log("可用优惠列表", _.canUseCoupon);
      console.log("不可用优惠列表", _.unCanUseCoupon);
    }
    this.isIphonex = /iphone/gi.test(window.navigator.userAgent) && (window.screen.height === 812 && window.screen.width === 375)
    // console.log('cardRulesInfo------------', this.pageType, this.cardRulesInfo)
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo",
      // canUseCoupon: "canUseCoupon",
      // unCanUseCoupon: "unCanUseCoupon",
      orderCouponList: "orderCouponList",
      unOrderCouponList: "unOrderCouponList",
      selectedCoupon: "selectedCoupon",
      discounts: "discounts" // 优惠 和红包id
    }),
    pageType() {
      console.log("this.$route.meta.couponType", this.$route.meta.couponType);
      return this.$route.meta.couponType;
    }
  },
  methods: {
    closePrompt() {
      this.showPropt = false;
      this.setCookie("hadshowpropt", 1, 365);
    },
    overDue(t) {
       let soonover = DateDiff({ type: 'd', destination: t })
      if(soonover && soonover.d > 3) return false
      else return true
      // let endtime = t;
      // var str = Date.parse(new Date(endtime));
      // var timenow = Date.parse(new Date());
      // var timediffer = str - timenow;
      // if(timediffer <= 0) { // 已过期
      //   return true;
      // } else if(timediffer < 259200000) { // 快到期
      //   return true;
      // } else {  // 非快到期
      //   return false;
      // }
    },
    checkType(n) {
      this.isEnd = false;
      this.userCouponList = [];
      this.activeindex = n;
      this.activeTab = n;
      this.pagedata.pageindex = 1;
      // alert(this.activeTab);
      if(this.activeTab==2) {
        this.findRedpacketList();
      } else {
        this.getUserCoupon();
      }
    },
    checkTab(n) {
      this.activeindex = n;
      this.activeTab = n;
    },
    selectUseCoupon(item) {
      // console.log("query", this.$route.query)
      console.log("item", item)
      if (this.$route.query.type == 1) {
        this.getOrderCoupon(item)
      } else {
        // type为2时，选择C2C优惠
        this.getSneakerCoupon(item)
      }
    },
    // B2C选择优惠
    getOrderCoupon(item) {
      let _  = this.$route.query
      // let usecoupon = true
      let usecoupon = this.discounts.isusecoup
      let productitemids =_.productitemids
      // console.log(_,'kkkkkkkkkkk')
      // for (let i of  _.productitemids) {
      //   productitemids.push(i.productitemid)
      // }
      let co = this.discounts
      co.isusecoup = usecoupon

      let couponuseridNew = this.discounts.couponuserid
      let redpacketNew = this.discounts.redpacket
      if (item != null) {
        if (item.operationstatus === 2) {
          co.isusecoup = true
          if (item.type === 1) {
            couponuseridNew = item.couponuserid

            co.couponuserid = couponuseridNew;
            this.$store.dispatch("Discounts", co);
          }

          if (item.type === 2) {
            // co.redpacket.push(item.couponuserid)
            redpacketNew.push(item.couponuserid)
            co.redpacket = redpacketNew;

            this.$store.dispatch("Discounts", co);
            console.log('co--------->', this.discounts)
          }
        }

        if (item.operationstatus === 0) {
          if (item.type === 1) {
            couponuseridNew = ""

            co.couponuserid = couponuseridNew;
            this.$store.dispatch("Discounts", co);
          }
          if (item.type === 2) {
            for (let i = 0 ; i < redpacketNew.length ; i++) {
              if (redpacketNew[i] === item.couponid) {
                redpacketNew.splice(i, 1)

                co.redpacket = redpacketNew;
                this.$store.dispatch("Discounts", co);
              }
            }
          }
        }

        if (couponuseridNew === "" && redpacketNew.length === 0) {
          usecoupon = false

          co.isusecoup = usecoupon
          this.$store.dispatch("Discounts", co);
        }
      }

      let params = {
        usecoupon: co.isusecoup,
        productmoney: _.productmoney,
        productitemids: productitemids,
        couponuserid: couponuseridNew,
        redpacket: redpacketNew,
        ordertype: _.ordertype
      }
      console.log("B2C params", params)
      GetOrderCoupon(params)
        .then(res => {
          this.canUseCoupon = res.usable
          this.unCanUseCoupon = res.unusable

          // for (let i of this.canUseCoupon) {
          //   if (i.operationstatus == 0 && i.type == 1) {
          //     co.couponuserid = i.couponuserid;
          //     this.$store.dispatch("Discounts", co);
          //     console.log("优惠券ID",co)
          //   }
          //   if (i.operationstatus == 0 && i.type == 2) {
          //     // co.redpacket = []

          //     // co.redpacket.push(i.couponuserid);
          //     // this.$store.dispatch("Discounts", co);
          //     // console.log("红包ID",co)
          //   }
          // }
        })
    },
    // C2C选择优惠
    getSneakerCoupon(item) {
      let _  = this.$route.query
      // let usecoupon = true
      let usecoupon = this.discounts.isusecoup
      let couponuseridNew = this.discounts.couponuserid
      let redpacketidsNew = this.discounts.redpacket

      // console.log("C2C redpacketidsNew", this.discounts)


      let co = this.discounts
      co.isusecoup = usecoupon

      if (item != null) {

        if (item.operationstatus == 2) {
          co.isusecoup = true
          if (item.type == 1) {
            couponuseridNew = item.couponuserid

            co.couponuserid = couponuseridNew;
            this.$store.dispatch("Discounts", co);
          }
          if (item.type == 2) {
            redpacketidsNew.push(item.couponuserid)

            co.redpacket = redpacketidsNew;
            this.$store.dispatch("Discounts", co);
          }
        }
        if (item.operationstatus == 0) {

          if (item.type == 1) {
            couponuseridNew = ""

            co.couponuserid = couponuseridNew;
            this.$store.dispatch("Discounts", co);
          }
          if (item.type == 2) {
            for (let i = 0 ; i < redpacketidsNew.length ; i++) {
              if (redpacketidsNew[i] == item.couponid) {
                redpacketidsNew.splice(i, 1)

                console.log("redpacketidsNew",redpacketidsNew)
                co.redpacket = redpacketidsNew;
                this.$store.dispatch("Discounts", co);
              }
            }
          }
        }

        if (couponuseridNew == "" && redpacketidsNew.length == 0) {
          usecoupon = false

          co.isusecoup = usecoupon
          this.$store.dispatch("Discounts", co);
        }
      }

      let params = {
        usecoupon: co.isusecoup,
        productmoney: _.productmoney,
        couponuserid: couponuseridNew,
        redpacket: redpacketidsNew
      }
      console.log("C2CgetSneakerCoupon", params)
      console.log("discunts",this.discounts)
      GetSneakerOrderCoupon(params)
        .then(res => {
          this.canUseCoupon = res.usable
          this.unCanUseCoupon = res.unusable

          // for (let i of this.canUseCoupon) {
          //   if (i.operationstatus == 0 && i.type == 1) {
          //     co.couponuserid = i.couponuserid;
          //     this.$store.dispatch("Discounts", co);
          //     console.log("优惠券ID",co)
          //   }
          //   if (i.operationstatus == 0 && i.type == 2) {
          //     co.redpacket = []

          //     co.redpacket.push(i.couponuserid);
          //     this.$store.dispatch("Discounts", co);
          //     console.log("红包ID",co)
          //   }
          // }

        })


    },
    getUserCoupon() {
      if (this.pageType == 1) {
      } else {
        this.isLoading = true;
        let page = this.pagedata;
        let option = {};
        // option.token = this.userInfo.token
        option.pageindex = this.pagedata.pageindex;
        option.status = this.pagedata.status;
        option.type = this.activeTab;
        console.log("获取优惠券的参数", option);
        GetUserCoupon(option)
          .then(res => {
            console.log("优惠券列表", res);
            if (res && res.list) {
              this.hasdata = 1;
              if (res && res.list) {
                if (res.pageindex == 1) this.userCouponList = res.list;
                else this.userCouponList.push(...res.list);
                if (res.pageindex > 0) page.pageindex = res.pageindex;
                if (res.sumcount > -1) page.sumcount = res.sumcount;
                if (res.pagesize > -1) page.pagesize = res.pagesize;
                if (page.pageindex * page.pagesize >= page.sumcount) {
                  this.isEnd = true;
                }
              }
              this.isLoading = false;
              // this.userCouponList = this.userCouponList.map((data) => {
              //   data.isgeted = 0
              //   return data
              // })
            }
          })
          .catch(err => {
            this.hasdata = 2;
            this.isLoading = false;
            console.error("GetUserCoupon", err);
          });
      }
    },
    findRedpacketList() {
      if (this.pageType == 1) {
      } else {
        this.isLoading = true;
        let page = this.pagedata;
        FindRedpacketList({ page:this.pagedata.pageindex,size:10})
          .then(res => {
            if (res && res.list) {
              this.hasdata = 1;
              if (res && res.list) {
                if (res.pageindex == 1) this.userCouponList = res.list;
                else this.userCouponList.push(...res.list);
                if (res.page > 0) page.pageindex = res.page;
                if (res.total > -1) page.sumcount = res.total;
                if (res.size > -1) page.pagesize = res.size;
                if (page.pageindex * page.pagesize >= page.sumcount) {
                  this.isEnd = true;
                }
              }
              this.isLoading = false;
            }
          })
          .catch(err => {
            this.hasdata = 2;
            this.isLoading = false;
            console.error("FindRedpacketList", err);
          });
      }
    },
    reload() {
      this.pagedata.pageindex = 1;
      this.userCouponList = [];
      if(this.activeTab==2) {
        this.findRedpacketList();
      } else {
        this.getUserCoupon();
      }
    },
    loadmore($el) {
      if (this.isEnd === true) {
        this.toast("已无更多");
      } else {
        this.pagedata.pageindex += 1;
        if(this.activeTab==2) {
        this.findRedpacketList();
        } else {
          this.getUserCoupon();
        }
      }
    },
    getCode() {
      if (this.couponCode) {
        let option = {
          token: this.userInfo.token,
          cdkey: this.couponCode
        };
        GetCouponByCdKey(option)
          .then(res => {
            this.toast("兑换成功!");
            this.popupVisible = false;
            this.checkType(0);
          })
          .catch(err => {
            console.log(err.msg);
            if (err && err.msg) {
              this.toast(err.msg);
              this.popupVisible = false;
            }
          });
      } else {
        this.toast("请输入兑换码!");
      }
    },
    changCou(n) {
      this.activeBar = n;
      if (n == 0) {
        this.userCouponList = this.orderCouponList;
      } else {
        this.userCouponList = this.unOrderCouponList;
      }
    },
    couponCard(n) {

      this.activeTab = n;
      this.pagedata.pageindex = 1;
      this.getUserCoupon();
    },
    seleCoupon(item) {
      if (this.pageType == 1 && this.activeBar == 0) {
        console.log("选中默认优惠券", item);
        let orderCoupon = [...this.orderCouponList];
        orderCoupon = orderCoupon.map(i => {
          i.selected = i.id === item.id;
          return i;
        });

        // this.$store.dispatch("setOrderCoupon", {
        //   unCanUseCoupon: this.unOrderCouponList,
        //   canUseCoupon: orderCoupon
        // });

        // this.orderCouponList = this.orderCouponList.map((data) => {
        //   data.selected = false
        //   return data
        // })
        // item.selected = true
        this.$store.state.order.selectedCoupon = item;
        this.$router.go(-1);
      }
      if (this.pageType == 0 && this.activeindex == 0) {
        if (item.platformtype ==1 && item.businessid)
          this.$router.push("/shop/shopdetail/" + item.businessid);
        else if(item.platformtype ==2&&item.productid){
          this.$router.push("/productDetail/" + item.productid);
        } else 
        this.$router.push(this.insq ? "/mall/discount" : "/");
      }
    },
    cardRules(msg) {
      this.showRules = msg.showRule;
      this.cardRulesInfo = msg;
    },
    closeCardRulesBox() {
      this.showRules = false;
    },
    GetFlows(item) {
      console.log(item);
      if (!Checking(this.flowMobile, "phone")) {
        this.rechargeWord = "请输入合法的手机号码";
        setTimeout(() => {
          this.rechargeWord = "";
        }, 3000);
        return false;
      }
      let option = {
        id: item.cardId,
        mobile: this.flowMobile
      };
      GetFlowPackage(option)
        .then(res => {
          if (!res) {
            this.getFlowsSuccess = true;
          }
        })
        .catch(err => {
          console.log(err.msg);
        });
    },
    gohistory(type) {
      this.$router.push({ path:`couponhistory/${type}`});
    },
    setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = "expires=" + d.toGMTString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    },
    getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
  }
};
</script>
<style scoped>
.coupon_head {
  display: flex;
  justify-content: space-around;
  position: fixed;
  background: #fff;
  z-index: 99;
  width: 100%;
  left: 0;
  top: 48px;
}
.insq .coupon_head {
  top: 0;
}
.order_cou {
  margin-top: 100px;
}

.insq .order_cou {
  margin-top: 10px;
}
.coupon_head p {
  padding: 10px 0;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  color: #666;
}

p.checked {
  border-bottom: 2px solid #333;
  color: #333;
}

.icon_qus {
  position: absolute;
  top: 0;
  right: -3px;
  width: 48px;
  height: 48px;
}

.icon_qus span {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url("//files.eyee.com/mcdn/static/img/user/icon_question.png")
    no-repeat;
  background-size: cover;
}

.coupon_content {
  margin-top: 100px;
}
.insq .coupon_content {
  margin-top: 50px;
}

.coupon_footer {
  position: fixed;
  bottom: 6px;
  z-index: 20;
  /* background: #e26868; */
  background: linear-gradient(308deg,rgba(96,170,255,1) 0%,rgba(133,89,249,1) 100%);
  border-radius: 7vw;
  color: #fff;
  font-size: 14px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  width: 94%;
  margin-left: 3%;
  letter-spacing: 1vw;
}

.prompt {
  width: 100%;
  height: 25px;
  margin-bottom: 6px;
  background:linear-gradient(135deg,rgba(255,214,48,0.35) 0%,rgba(255,200,7,0.352) 100%);
  /* opacity:0.5; */
  position: relative;
}
.prompt p {
  padding: 4px 0 0 34px;
  color: #666;
  font-size: 12px;
}
.prompt-icon {
  position: absolute;
  left: 15px;
  width: 14px;
  transform: translateY(5.7px);
  opacity: 0.8;
}
.prompt-close {
  position: absolute;
  right: 15px;
  width: 10px;
  transform: translateY(7.4px);
}
.user_cou {
  margin-bottom: 10px;
}

.user_cou:nth-of-type(1) {
  margin-top: 2px;
}

.cou_list {
  padding: 0 10px;
}

.code_box {
  width: 216px;
  height: 167px;
  background: url(//files.eyee.com/mcdn/static/coupon/Cashbox_background.png)
    no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  color: #fff;
  padding: 20px;
}

.code_box input {
  height: 30px;
  width: 90%;
  border-radius: 5px;
  background-color: #fff;
}

.order_nav {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75%;
  text-align: center;
}

.order_navBox {
  border: 1px solid #333;
  border-radius: 5px;
  display: flex;
  width: 60%;
}

.order_navBox div {
  width: 50%;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
}

.order_navBox div.active {
  background: #333;
  color: #fff;
  transition: all 0.3s;
}
.mint-popup {
  background: transparent;
}
.ruleBox {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.ruleBox .rule_con {
  position: absolute;
  width: 80%;
  left: 50%;
  margin-left: -40%;
  top: 22%;
  z-index: 101;
}
.ruleBox .rule_con .top_rules,
.ruleBox .rule_con .bottom_rules {
  width: 100%;
  background-image: url(//files.eyee.com/mcdn/static/img/card_rule.png);
}
.ruleBox .rule_con .top_rules {
  height: 50px;
  text-align: center;
  line-height: 53px;
  background-size: 100%;
  background-position: top;
  font-size: 18px;
}
.ruleBox .rule_con .bottom_rules {
  min-height: 150px;
  padding: 10px;
  padding-bottom: 40px;
  background-size: 100%;
  background-position: bottom;
  color: #666;
  font-size: 12px;
  /* background: #fff; */
}
.ruleBox .rule_con .bottom_rules .title_card {
  position: relative;
  height: 30px;
  line-height: 30px;
  color: #333;
  font-size: 16px;
  padding-left: 8px;
  margin: 10px 0;
  margin-top: 5px;
}
.ruleBox .rule_con .bottom_rules .title_card:before {
  content: "";
  position: absolute;
  width: 2px;
  height: 14px;
  background-color: #333;
  left: 0;
  top: 7px;
}
.ruleBox .rule_con .bottom_rules .box_ruleItem {
  border: 1px solid #eee;
  padding: 10px;
  height: 150px;
  overflow-x: hidden;
  overflow-y: auto;
}
.ruleBox .rule_con .bottom_rules .box_ruleItem li em {
  display: inline-block;
  width: 0;
  height: 0;
  border-bottom: 4px solid #666;
  border-left: 6px solid transparent;
  vertical-align: middle;
  margin-right: 4px;
}
.ruleBox .close_rulebox {
  position: absolute;
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #fff;
  left: 50%;
  margin-left: -20px;
  bottom: 18%;
  font-size: 38px;
  text-align: center;
  line-height: 36px;
  z-index: 102;
}
.ruleBox .close_rulebox:after {
  content: "×";
}
.ruleBox .rechargeBox {
  position: absolute;
  width: 80%;
  height: 319px;
  left: 50%;
  margin-left: -40%;
  top: 50%;
  margin-top: -159.5px;
  border-radius: 14px;
  padding: 20px 20px 34px;
  background: #fff;
  color: #999;
  z-index: 101;
}
.ruleBox .rechargeBox.getFlowS {
  background: url(//files.eyee.com/mcdn/static/img/card_gets.png) no-repeat
    center;
  background-size: contain;
  background-color: #fff;
}
.ruleBox .rechargeBox .close_reChabox {
  display: inline-block;
  float: right;
  height: 20px;
  line-height: 20px;
  color: #333;
  font-size: 40px;
}
.ruleBox .rechargeBox .title_reCharge {
  margin: 21px 0 35px;
  color: #333;
  font-size: 20px;
  text-align: center;
}
.ruleBox .rechargeBox > label {
  display: block;
  font-size: 14px;
  padding: 5px 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #333;
}
.ruleBox .rechargeBox > label span {
  display: inline-block;
  margin-right: 10px;
}
.ruleBox .rechargeBox > label input {
  padding: 0 5px;
  color: #999;
  font-size: 14px;
}
.ruleBox .rechargeBox .tips_word {
  font-size: 14px;
  color: #999;
  line-height: 20px;
  text-align: center;
}
.ruleBox .rechargeBox .msg_tips {
  font-size: 14px;
  color: #e26868;
  height: 18px;
  line-height: 18px;
  margin: 10px 0;
  text-align: center;
}
.ruleBox .rechargeBox .recharge_btn {
  width: 100%;
  background: rgba(3, 3, 3, 0.9);
  border-radius: 5px;
  margin-top: 10px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  font-size: 18px;
}
.ruleBox .label_getImg {
  margin-top: 190px;
}
.checkout {
  display: inline-block;
  margin: 16px auto;
  font-size: 11px;
  color: #999;
  border-bottom: #ccc 2px solid;
  padding: 2px;
}
</style>
