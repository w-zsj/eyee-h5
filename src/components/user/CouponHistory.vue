<template>
  <div style="padding-bottom:50px;" :class="{insq:insq}">
    <v-header>
      <div class="nav-tab2">
        <h3 v-if="activeTab==0">优惠券历史</h3>
        <h3 v-if="activeTab==1">会员卡历史</h3>
        <h3 v-if="activeTab==2">红包历史</h3>
        <router-link to="/coupondescription" class="icon_qus flex-center">
          <span class=""></span>
        </router-link>
      </div>
    </v-header>
    <div class="coupon_head" v-if="pageType==0">
      <p v-for="(item,index) in tabBar" @click="checkType(item.type)" :class="{checked:item.type==activeindex}" :key="index">{{item.name}}</p>
    </div>
    <div :class="{order_cou:pageType==1,coupon_content:pageType==0}" id="order_cou">
      <div v-if="isIphonex">
          <div v-for="(item,index) in userCouponList" class="userful_cou cou_list" :key="index">
            <CouponUnit v-if="activeTab == 0" :cous="item" class="user_cou" :couType="1" :seleIcon='(pageType==1&&selectedCoupon!=null)?(item.couponuserid==selectedCoupon.couponuserid):false'></CouponUnit>
            <RedpacketUnit v-if="activeTab == 2" :redpec="item" class="user_cou" :status="1" :couType="1" :seleIcon='(pageType==1&&selectedCoupon!=null)?(item.couponuserid==selectedCoupon.couponuserid):false'></RedpacketUnit>
            <CardUnit v-if="activeTab == 1" :cardInfos="item" :cardStatus="activeindex" @showRules="cardRules"></CardUnit>
            <span v-if="activeTab == 0" @click="seleCoupon(item)"></span>
          </div>
      </div>
      <v-list :load-handle='reload' v-if="userCouponList&&userCouponList.length>0&&!isIphonex" :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
        <div v-for="(item,index) in userCouponList" class="userful_cou cou_list" :key="index">
          <CouponUnit v-if="activeTab == 0" :cous="item" class="user_cou" :couType="1" :seleIcon='(pageType==1&&selectedCoupon!=null)?(item.couponuserid==selectedCoupon.couponuserid):false'></CouponUnit>
          <RedpacketUnit v-if="activeTab == 2" :redpec="item" class="user_cou" :status="1" :couType="1" :seleIcon='(pageType==1&&selectedCoupon!=null)?(item.couponuserid==selectedCoupon.couponuserid):false'></RedpacketUnit>
          <CardUnit v-if="activeTab == 1" :cardInfos="item" :cardStatus="activeindex" @showRules="cardRules"></CardUnit>
          <span v-if="activeTab == 0" @click="seleCoupon(item)"></span>
        </div>
      </v-list>
    </div>
    <div v-if="userCouponList.length<1&&!isLoading">
      <Empty v-if="activeTab==0&&activeBar==1" :showType=8></Empty>
      <Empty v-if="activeTab==0&&activeBar==2" :showType=11></Empty>
      <Empty v-if="activeTab==2&&activeBar==1" :showType=9></Empty>
      <Empty v-if="activeTab==2&&activeBar==2" :showType=12></Empty>
      <Empty v-if="activeTab==1&&activeBar==1" :showType=10></Empty>
      <Empty v-if="activeTab==1&&activeBar==2" :showType=13></Empty>
    </div>
  </div>
</template>
<script>
import { GetUserCoupon, GetCouponByCdKey, FindRedpacketHistoryList } from "../../common/api/marketing";
import { GetFlowPackage } from "../../common/api/integral";
import { Checking } from "../../common/util";
import { mapGetters } from "vuex";
import Empty from "../templates/cart/Empty";
import CouponUnit from "../templates/CouponUnit";
import RedpacketUnit from "../templates/RedpacketUnit";
import CardUnit from "../templates/CardUnit";
export default {
  data() {
    return {
      // list:[{
      //   name: '小额满减红包',
      //   price: 10,
      //   starttime: "2016-4-16",
      //   endtime: "2026-4-16",
      //   platformtype: 0,
      // },
      // {
      //   name: '小额满减红包',
      //   price: 20,
      //   starttime: "2016-4-16",
      //   endtime: "2026-4-16",
      //   platformtype: 1
      // },
      // {
      //   name: '小额满减红包',
      //   price: 30,
      //   starttime: "2016-4-16",
      //   endtime: "2026-4-16",
      //   platformtype: 2
      // }],
      showRules: false,
      cardRulesInfo: {},
      qusIcon: "//files.eyee.com/mcdn/static/img/user/icon_question.png", // require('../../assets/img/user/icon_question.png'),
      tabBar: [
        { name: "已使用", type: 1 },
        { name: "已过期", type: 2 }
      ],
      activeindex: 1,
      pageType: 0,
      pagedata: { pageindex: 1, status: 1, sumcount: 0, pagesize: 0 },
      userCouponList: [],
      isLoading: false,
      isEnd: false,
      popupVisible: false,
      couponCode: null,
      activeBar: 1,
      activeTab: 0, //0: 优惠券  1：会员卡  2：红包
      flowMobile: null,
      rechargeWord: "",
      isIphonex: false,
    };
  },
  components: { Empty, CouponUnit, CardUnit, RedpacketUnit },
  mounted() {
    this.activeTab = this.$route.params.type
    // alert(this.activeTab);
    let _ = this;
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
          if(_.activeTab==2) {
            _.findRedpacketHistoryList();
            this.userCouponList = this.list;
          } else {
            _.getUserCoupon();
          }
        }, 600);
      } else if(_.activeTab==2) {
        _.findRedpacketHistoryList();
      } else {
        _.getUserCoupon();
      }
    }

    this.isIphonex = /iphone/gi.test(window.navigator.userAgent) && (window.screen.height === 812 && window.screen.width === 375)
    // console.log('cardRulesInfo------------', this.pageType, this.cardRulesInfo)
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo",
      orderCouponList: "orderCouponList",
      unOrderCouponList: "unOrderCouponList",
      selectedCoupon: "selectedCoupon"
    }),
    // pageType() {
    //   console.log("this.$route.meta.couponType", this.$route.meta.couponType);
    //   return this.$route.meta.couponType;
    // }
  },
  methods: {
    checkType(n) {
      this.isEnd = false;
      this.userCouponList = [];
      this.activeindex = n;
      this.activeBar = n;
      this.pagedata.status = n;
      this.pagedata.pageindex = 1;
      this.status = n;
      // alert(this.status);
      if(this.activeTab==2) {
        this.findRedpacketHistoryList();
      } else {
        this.getUserCoupon();
      }
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
    findRedpacketHistoryList() {
      if (this.pageType == 1) {
      } else {
        this.isLoading = true;
        let page = this.pagedata;

        FindRedpacketHistoryList({ type: Number(this.status)-1, page:this.pagedata.pageindex,size:10 })
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
            console.error("FindRedpacketHistoryList", err);
          });
      }
    },
    reload() {
      this.pagedata.pageindex = 1;
      this.userCouponList = [];
      if(this.activeTab==2) {
        this.findRedpacketHistoryList();
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
        this.findRedpacketHistoryList();
      } else {
        this.getUserCoupon();
      }
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

        this.$store.dispatch("setOrderCoupon", {
          unCanUseCoupon: this.unOrderCouponList,
          canUseCoupon: orderCoupon
        });

        // this.orderCouponList = this.orderCouponList.map((data) => {
        //   data.selected = false
        //   return data
        // })
        // item.selected = true
        this.$store.state.order.selectedCoupon = item;
        this.$router.go(-1);
      }
      if (this.pageType == 0 && this.activeindex == 0) {
        if (item.platformtype > 0 && item.businessid)
          this.$router.push("/shop/shopdetail/" + item.businessid);
        else this.$router.push(this.insq ? "/mall/discount" : "/");
      }
    },
    cardRules(msg) {
      this.showRules = msg.showRule;
      this.cardRulesInfo = msg;
    },
    closeCardRulesBox() {
      this.showRules = false;
    },
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
  margin-top: 50px;
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
  bottom: 0;
  z-index: 11;
  background: #e26868;
  color: #fff;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  width: 100%;
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
  background: url(//files.eyee.com/mcdn/static/img/user/coupon_code_bg.png)
    no-repeat;
  background-size: cover;
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
</style>
