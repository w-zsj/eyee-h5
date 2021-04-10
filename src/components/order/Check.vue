<template>
  <div v-if="!ill" style="padding-bottom:48px;" :class="{isHeadHide:!$root.ISAPP}">
    <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3>订单结算</h3>
      </div>
    </v-header>
    <!--收货地址  -->
    <UserAddressUint :addressUnit="userDefaultAddress" :addressType="1"></UserAddressUint>
    <!-- 身份证号 -->
    <div v-show="defaultExpress.isneedidcard" class="check_ems flex-between">
      <p>身份证号：</p>
      <p class="exp-cardnum">
        <input type="text" placeholder="海外物流订单需填写收货人身份证号" @input="inputCardnum">
      </p>
    </div>
    <!--订单 单元  -->
    <OrderUnit :orderInfo="getOrder" :truePay="getOrder._allPay" :cutchecktype='1'></OrderUnit>
    <!-- 选择物流 -->
    <div class="check_ems" v-show="userDefaultAddress && userDefaultAddress.addressid">
      <div class="flex-between exp-info">
        <p>选择物流方式</p>
        <p class="flex-center">
          <span>{{defaultExpress.name}}</span>
        </p>
      </div>
      <div class="exp-list">
        <div class="flex-between express_unit" v-for="item in defaultExpressList" :key="item.id" @click="seleExpress(item)">
          <p class="flex-center exp_name">
            <span class="icon_cartSel" :class="{icon_cartSeled:item.selected}"></span>
            <span>{{item.name}} </span>
          </p>
          <p> ¥{{item.expressfee | tofixed}} </p>
        </div>
      </div>
    </div>
    <!--选择优惠券  -->
    <div class="check_coupons" @click.stop="goCoupon">
      <div class="flex-between">
        <p>选择优惠券:
          <span v-if="realCoupon&&useCou&&(getOrder.allPay-couvalue>0)">本券共为您节省</span>
        </p>
        <p>
          <span v-if="realCoupon && useCou && !getOrder.hasOwnProperty('groupBuyType') && !getOrder.isDistribution && (getOrder.allPay-couvalue>0)">-¥{{realCoupon.facevalue}}</span>
          <span v-if="!hasCoupon && !getOrder.hasOwnProperty('groupBuyType') && !getOrder.isDistribution || (getOrder.allPay-couvalue<=0)">您当前没有可用优惠券</span>
          <span v-if="hasCoupon && !useCou&& !getOrder.hasOwnProperty('groupBuyType') && !getOrder.isDistribution && (getOrder.allPay-couvalue>0)">不使用优惠券</span>
          <span v-if="getOrder.hasOwnProperty('groupBuyType') || getOrder.isDistribution || (getOrder.allPay-couvalue<0)" style="color:#999">优惠券不可用</span>
          <span class=" right_icon"></span>
        </p>
      </div>
      <div class="order_coulist" v-if="getOrder.allPay-couvalue>0">
        <!-- <div class="userful_cou clearfix" v-if="realCoupon&&useCou">
          <CouponUnit :cous="realCoupon" :couType="2" class="order_cou_unit"></CouponUnit>
          <span @click.stop="goCoupon"></span>
        </div> -->
        <p @click.stop="cancelCou" v-if="realCoupon&&useCou">有钱任性，我就是不用优惠券</p>

      </div>
       <!-- <p class="buy_tip" v-if="getOrder.hasSpecial">温馨提示：此订单中有商品参与鬼市活动，由于您未获得鬼市购买资格，只能以原价购买</p> -->
    </div>
    <!-- 买家留言 -->
    <div class="usermemo">
      <label for="">买家留言:</label>
      <textarea name="" id=""  placeholder="选填:对本次交易的说明" v-model="usermemo">
        
      </textarea>
    </div>
    <!--底部  -->
    <div class="flex-between flex-center o_footer">
      <p v-if="getOrder.allPay">
        <!-- <span>共{{getOrder.count}}件商品</span> -->
        <span>总计：
          <span class="pay_color">¥{{(getOrder.allPay+defaultExpress.expressfee-couvalue) | tofixed}}</span>
        </span>
      </p>
      <mt-button class="btn_total" @click="payment">提交订单</mt-button>
    </div>
  </div>
  <div v-else></div>
</template>
<script>
import { mapGetters } from 'vuex'
import OrderUnit from '../templates/order/OrderUnit'
import UserAddressUint from '../templates/user/UserAddressUnit'
import CouponUnit from '../templates/CouponUnit'
import { GetOrderExpress, UserOrderCoupon, OrderAdd, AddOrderZone } from '../../common/api/order'
import { AddGroupOrder } from '../../common/api/group'
import { AddressDefault } from '../../common/api/user'
import { _getDate } from '../../common/util'
import { saveOrderno } from '../../common/api/distribution'
import { addDistributionOrder } from '../../common/api/distribution'

var couponGetting = false
var queryOrder = {}

export default {
  data() {
    return {
      expressTemplate: [],
      address: {},
      hasAddress: false,
      // userDefaultAddress: {},
      postdata: {},
      defaultCoupon: {},
      couvalue: 0,
      useCou: false,
      couponuseid: "",
      couponType: "",
      expressDate: [],
      getOrder: {},
      cardnum: "",
      usermemo:''
    };
  },
  components: {
    OrderUnit,
    UserAddressUint,
    CouponUnit
  },
  computed: {
    // user() {
    //   return JSON.parse(window.localStorage.getItem('currentUser') || '{}')
    // },
    // getOrder() {
    //   return queryOrder.count > 0 ? queryOrder : this.orderItem
    // },
    dealLocal() {
      return this.insq && !this.user.token;
    },
    ill() {
      return !(this.insq || this.user.token);
    },
    ...mapGetters({
      insq: "insq",
      orderItem: "orderItem",
      user: "userInfo",
      userAddressList: "userAddressList",
      expressT: "expressT",
      defaultExpress: "defaultExpress",
      defaultExpressList: "defaultExpressList",
      expressPostData: "expressPostData",
      orderCouponList: "orderCouponList", // 可以使用的优惠券
      selectedCoupon: "selectedCoupon", // 选定使用的优惠券
      fromType: "fromType", // 0订单来之购物车 1来之详情立即购买
      userDefaultAddress: "userDefaultAddress"
    }),
    hasCoupon() {
      // console.log('有可用优惠券？', this.orderCouponList > 0, this.orderCouponList)
      return (this.orderCouponList || []).length > 0;
    },
    realCoupon() {
      // console.log('选中的优惠券', this.selectedCoupon)
      if (this.selectedCoupon && this.selectedCoupon.facevalue > 0) {
        // for (var i = 0; i < this.orderCouponList.length; i++) {
        //   this.orderCouponList.selected = false
        // }
        // this.orderCouponList[0].selected = true
        return this.selectedCoupon;
      }
      //  else {
      //   return null
      // }
      return null;
    },
    cardnumVal() {
      return this.cardnum;
    }
  },
  beforeMount() {
    // this.GetExpress()
    if (this.ill) this.$router.go(-1);

    let query = this.$route.query;

    queryOrder = JSON.parse(query.p || "{}");
    if (queryOrder.item && queryOrder.item.length > 0) {
      let item = queryOrder.item[0];
      item.id = item.productitemid;
      item.productid = queryOrder.productid;
      item.salestatus = 1;
      item.checked = true;
      item.isok = true;
      item.soldout = false;
      item.exchange = queryOrder.exchange;
      item.delprice = 0;
      if (item.specialprice > 0 && item.saleprice !== item.specialprice) {
        item.delprice = item.saleprice;
        item.price = item.specialprice;
      } else item.price = item.saleprice;

      item.salemoney = item.saleprice;
      item.saleprice = item.price;
      item.specialprice = item.price;

      queryOrder = {
        ...queryOrder,
        ...item,
        id: queryOrder.productid,
        allPay: item.count * item.price,
        item: [item]
      };
    }

    console.log("订单详细:", this.orderItem);
    this.getOrder = queryOrder.count > 0 ? queryOrder : this.orderItem;
  },
  mounted() {
    let _ = this



    console.log('优惠券', this.couvalue, this.getOrder.allPay)
    var ids = _.getOrder.item
    console.log("优惠券couvalue", this.couvalue, '商品总额allPay',this.getOrder.allPay);

    if (!(ids && ids.length > 0)) ids = _.getOrder.items;

    let option = {
      businessid: _.getOrder.businessid,
      productmoney: _.getOrder.allPay,
      quantity: _.getOrder.count,
      productids: ""
    };

    if (ids && ids.length > 0) {
      let a = option.productids;
      for (var i = 0; i < ids.length; i++) {
        if (ids[i].checked && a.indexOf(ids[i].productid) === -1) {
          a += ids[i].productid + ",";
        }
      }
      a = a.substring(0, a.lastIndexOf(","));
      option.productids = a;
    }

    if (_.user.token) {
      setTimeout(() => {
        _.GetExpress();
      }, 600);
    }

    _.postdata = option;
    if (_.ill || _.getOrder.count < 1) {
      // _.$router.go(-1)
      console.log("nononononono");
    } else {
      let [ps, ep] = [_.postdata, _.expressPostData];
      // 同一个条件不需要重新获取运费模板
      if (
        !(
          _.defaultExpress &&
          _.defaultExpress.name &&
          ps.businessid === ep.businessid &&
          ps.productmoney === ep.productmoney &&
          ps.quantity === ep.quantity &&
          ps.productids === ep.productids
        )
      ) {
        // _.$store.dispatch('setOrderCoupon', { 'canUseCoupon': [], 'unCanUseCoupon': [] })

        if (_.user.token) _.GetExpress();
        else {
          setTimeout(() => {
            _.GetExpress();
          }, 600);
        }
      }
      //  else {
      // }
    }
    if (!(_.userDefaultAddress && _.userDefaultAddress.mobile)) {
      if (_.user.token) _.GetAddressDefault();
      else {
        setTimeout(() => {
          _.GetAddressDefault();
        }, 800);
      }
    }
    // console.log('选dddddd的优惠券', _.selectedCoupon)
    if (_.getOrder.hasOwnProperty('groupBuyType') || _.getOrder.isDistribution) {
      return
    } else {
      _.calc();
      _._checkItems();
      if (!(_.orderCouponList && _.orderCouponList.length > 0)) {
        if (_.user.token) _.getUserOrderCoupon();
        else {
          setTimeout(() => {
            _.getUserOrderCoupon();
          }, 600);
        }
      }
    }
  },
  methods: {
    calc() {
      if (this.realCoupon) {
        // console.log('存在选中优惠券')
        this.useCou = true;
        // if (this.useCou) {
        this.couvalue = this.realCoupon.facevalue;
        this.couponuseid = this.realCoupon.couponuseid;
        this.couponType = this.realCoupon.platformtype;
        // } else {
        //   this.couvalue = 0
        //   this.couponuseid = ''
        //   this.couponType = ''
        // }
        // if (this.defaultExpress && this.defaultExpress.expresstemplateitemid) {
        //   // this.useCou = true
        // } else {
        //   this.useCou = false
        //   this.couvalue = 0
        //   this.couponuseid = ''
        //   this.couponType = ''
        // }
      } else {
        // console.log('不存在优惠券')
        this.couvalue = 0;
        this.couponuseid = "";
        this.couponType = "";
      }
      // console.log('是否使用', this.useCou)
    },
    // checkCoupon() {
    //   if (!(this.selectedCoupon && this.selectedCoupon.facevalue)) {
    //     this.getUserOrderCoupon()
    //     // console.log('没有选择优惠券')
    //   } else {
    //     this.getUserOrderCoupon()
    //     // console.log('选择了默认的优惠券', this.realCoupon)
    //   }
    // },
    GetExpress() {
      console.log("GetExpress setPostData------------------", this.postdata);
      var _ = this;
      this.$store.dispatch("setPostData", this.postdata);
      setTimeout(() => {
        GetOrderExpress(_.postdata)
          .then(res => {
            console.log("获取结算物流模板", res);
            if (res) {
              if (_.userDefaultAddress.addressid)
                _.expressDate = res; // 收件地址存在
              else _.expressDate = []; // 收件地址bu存在 运费为 0

              _.$store.dispatch("setExpressTemplate", _.expressDate);
            }
          })
          .catch(e => {
            console.error("获取物流失败", e);
          });
      },500);
    },
    getUserOrderCoupon() {
      if (couponGetting) return;
      couponGetting = true;
      let _ = this;
      UserOrderCoupon({ token: _.user.token })
        .then(res => {
          couponGetting = false;
          let [canUseCoupon, unCanUseCoupon] = [[], []];
          // console.log('礼券列表', res)
          if (res && res.length > 0) {
            for (var i = 0; i < res.length; i++) {
              // 判断是否在使用时间内
              var today = _getDate(new Date()).getTime();
              var start = _getDate(res[i].usebegintime).getTime();
              var end = _getDate(res[i].useendtime).getTime();
              res[i].isUse = !!(today >= start && today <= end);
              var t = res[i];

              if (t.platformtype != 2) {
                if (
                  t.isUse &&
                  t.usestatus == 0 &&
                  (t.businessid == _.getOrder.businessid ||
                    t.platformtype == 0 ||
                    t.platformtype == 3)
                ) {
                  if (
                    t.usecondition <= _.getOrder.allPay &&
                    _.getOrder.allPay >= t.facevalue
                  ) {
                    canUseCoupon.push(t);
                  }
                }
              } else {
                // console.log('ememememememememem',t.goods)
                var productid = t.productid;
                var tid = "";
                if (_.fromType == 0) {
                  tid = JSON.stringify(_.getOrder.item) || "";
                } else {
                  tid = _.getOrder.productid;
                }
                // console.log(_.getOrder)
                if (
                  tid.indexOf(productid) >= 0 &&
                  t.isUse &&
                  t.usestatus == 0
                ) {
                  canUseCoupon.push(t);
                } else {
                  unCanUseCoupon.push(t);
                }
              }
            }
            // console.log('可以使用的券', canUseCoupon, canUseCoupon.length)
            // console.log('不可以使用的券', unCanUseCoupon)
            if (canUseCoupon.length > 1) {
              // console.log('youyouoyouo')
              canUseCoupon.sort((a, b) => {
                return b.facevalue - a.facevalue;
              });
              this.useCou = true;
            }
            _.$store.dispatch("setOrderCoupon", {
              canUseCoupon: canUseCoupon,
              unCanUseCoupon: unCanUseCoupon
            });
            _.$store.state.order.selectedCoupon = canUseCoupon[0];
            this.defaultCoupon = { ...canUseCoupon[0] };
          }

          _.calc();
          _._checkItems();
        })
        .catch(e => {
          couponGetting = false;
          console.error("获取优惠券失败", e);
        });

      // 获取用户下单的礼券
      /**
       * 1. 优惠券状态必须是“可使用”状态 （userstatus)
       * 2. 优惠券面额<订单商品总额 (facevalue)
       * 3. 优惠券使用条件<=订单商品总额 （usecondition,满500使用30，订单商品总额必须>=500)
       * 4. 优惠券要么是当前店铺优惠券要么是平台券 (businessid或platformtype)
       * 5. 优惠券必须在可使用时间范围内(usebegintime<now<useendtime)
       * 6. 如果商品不参与包邮，则不能使用包邮活动
       * 7. 如果商品不能使用优惠券，则无法使用优惠券
       * 8. 若使用商品券，则只有参与商品券的商品才能平摊使用，其他商品不能使用优惠券（涉及商品金额计算，关税计算）
       * 9. 如果是商品券，商品购物项productid与商品券对应的productid不匹配，则不能使用
       */
    },
    GetAddressDefault() {
      AddressDefault({ token: this.user.token })
        .then(res => {
          console.log("默认地址", res);
          if (res) {
            res.mobile = res.mobile.split("-")[1];
            // this.userDefaultAddress = res
            this.$store.dispatch("setDefaultAddress", res);
          }
        })
        .catch(e => {
          console.error("获取默认地址失败", e);
        });
    },
    _checkItems() {
      // 两种计算方式 1.单品劵只对单品   2.平台劵 店铺劵对订单全部商品
      // 商品券
      // console.log('优惠券类型', this.couponType)
      if (!(this.getOrder && this.getOrder.item)) return;
      if (this.couponType === 2) {
        // console.log('商品券呀呀呀呀呀呀', this.realCoupon, this.couvalue)
        for (let i = 0; i < this.getOrder.item.length; i++) {
          if (this.getOrder.item[i].saleprice) {
            this.getOrder.item[i].salemoney = this.getOrder.item[i].saleprice;
          }
          // let regex = /([0-9]+\.[0-9]{2})[0-9]*/
          var productid = this.selectedCoupon.productid;
          if (this.getOrder.item[i].productid == productid) {
            // console.log(this.getOrder.item[i].productid)
            for (var j = 0; j < this.getOrder.item[i].count; j++) {
              this.getOrder.item[i].percent = 1 / this.getOrder.item[i].count;
            }
            this.getOrder.item[i].pay =
              this.getOrder.item[i].salemoney -
              this.getOrder.item[i].percent * this.couvalue;
            this.getOrder.item[i].specialprice = this.getOrder.item[i].pay;
            // console.log(this.getOrder.item[i])
          } else {
            this.getOrder.item[i].percent = 0;
            this.getOrder.item[i].pay = this.getOrder.item[i].salemoney;
            this.getOrder.item[i].specialprice = 0;
          }
        }
        // 优惠后商店商品总价
        this.getOrder._allPay = (this.getOrder.allPay - this.couvalue>0)?(this.getOrder.allPay - this.couvalue):this.getOrder.allPay
      //  this.getOrder._allPay = this.getOrder.allPay - this.couvalue;
       
        
      }
      // 非商品券
      if (this.couponType !== 2) {
        let regex = /([0-9]+\.[0-9]{2})[0-9]*/;
        for (let i = 0; i < this.getOrder.item.length; i++) {
          if (this.getOrder.item[i].saleprice) {
            this.getOrder.item[i].salemoney = this.getOrder.item[i].saleprice;
          }
          if (this.getOrder.item[i].checked) {
            this.getOrder.item[i].percent =
              this.getOrder.item[i].salemoney *
              this.getOrder.item[i].count /
              this.getOrder.allPay;
            this.getOrder.item[i].percent = this.getOrder.item[i].percent
              .toString()
              .replace(regex, "$1");
            // console.log(this.getOrder.item[i].percent)
          } else {
            this.getOrder.item[i].percent = 0;
          }
        }
        this.getOrder.item = this.getOrder.item.sort(function(a, b) {
          return a.salemoney * a.count - b.salemoney * b.count;
        });
        // console.log(this.getOrder.item)
        var percent = 0;
        for (var j = 0; j < this.getOrder.item.length; j++) {
          if (j < this.getOrder.item.length - 1) {
            this.getOrder.item[j].percent = Number(
              this.getOrder.item[j].percent
            );
            percent += this.getOrder.item[j].percent;
          }
          if (j === this.getOrder.item.length - 1) {
            // console.log(percent)
            this.getOrder.item[j].percent = 1 - percent;
          }
          // 计算使用优惠劵后价格
          // 优惠后商品单价
          // console.log('优惠券面值', this.couvalue)
          // if(this.couvalue !='undefined'){
          //   this.couvalue = 0
          //   this.couponuseid = ''
          //   this.couponType = ''
          // }
          this.getOrder.item[j].pay =
            this.getOrder.item[j].salemoney -
            this.couvalue *
              this.getOrder.item[j].percent /
              this.getOrder.item[j].count;
          // console.log(this.getOrder.item[j].pay)
          this.getOrder.item[j].pay = Number(
            this.getOrder.item[j].pay.toString().replace(regex, "$1")
          );
          this.getOrder.item[j].specialprice = this.getOrder.item[j].pay;
          // console.log(this.getOrder.item[j].pay)
        }
        this.getOrder._allPay = (this.getOrder.allPay - this.couvalue>0)?(this.getOrder.allPay - this.couvalue):this.getOrder.allPay
        // console.log('优惠后商店商品总价',this.getOrder)
      }
    },
    payment() {
      let _ = this;
      var or = _.getOrder;
      var option = {
        // 订单数量
        quantity: or.count,
        // 邮费
        expressfee: parseFloat(_.defaultExpress.expressfee).toFixed(2),
        // 订单支付金额(优惠劵)
        paymoney: parseFloat(
          or.allPay + _.defaultExpress.expressfee - _.couvalue
        ).toFixed(2),
        // 商品总金额(优惠劵)
        productmoney: parseFloat(or.allPay - _.couvalue).toFixed(2),
        // 商品总金额
        salemoney: parseFloat(or.allPay).toFixed(2),
        // 海关税(优惠劵)
        tariffmoney: 0,
        // 优惠劵减额
        discountmoney: parseFloat(_.couvalue).toFixed(2),
        // 商家标识
        BusinessId: or.businessid,
        // 收货地址id
        UserAddressId: _.userDefaultAddress.addressid,
        // 是否是海购
        isoverseas: false,
        // 发货地模板标识
        expresstemplateitemid: _.defaultExpress.expresstemplateitemid,
        // 订单商品类型
        // producttype: isNaN(or.item[0].producttype) ? or.producttype : or.item[0].producttype,
        // 订单来源
        ordersource: 4,
        // 是否包邮 0不包邮 1包邮
        isexpressfree: !_.defaultExpress.expresstemplateitemid,
        // 包邮标识
        expressfreeid: _.defaultExpress.expresstemplateitemid
          ? ""
          : _.defaultExpress.expressfreeid,
        // 用户留言
        // buyermessage: '',
        // 使用优惠说明
        // promotionname: '',
        // 使用的用户礼劵标识
        // 8ad5ee174dd148b4bcad38c2f9d23eab
        couponuseid: _.couponuseid,
        // 使用的积分
        // credits: '',
        // 用户token
        token: _.user.token,
        // 默认0, 1 秒杀,2 普货
        wspushstatus: isNaN(or.wspushstatus) ? 0 : or.wspushstatus,
        // 收货人身份证号，物流模板isneedidcard为true时必须
        idcard: _.cardnum.replace(/\s/g, ""),
        // 商品列表
        items: [],
        // 订单类型 默认0普通订单 1开团 2参团
        type: 0
      };

      var m = or.item;
      // console.log('下单',m)
      for (var i = 0; i < m.length; i++) {
        if (m[i].checked) {
          var c = {};
          c.productid = m[i].productid;
          c.paymoney = m[i].pay ? m[i].pay : or.allPay || _.getOrder.groupPrice;
          c.salemoney = m[i].salemoney;
          c.count = m[i].count;
          c.brandname = m[i].brandname;
          c.prokey = m[i].prokey;
          c.color = m[i].color;
          // c.mainpic = m[i].colorimg
          // c.productname = m[i].productname
          c.size = m[i].size;
          c.contentid = m[i].contentid ? m[i].contentid : "";
          c.producttype = isNaN(m[i].producttype)
            ? option.producttype
            : m[i].producttype;
          c.productitemid = m[i].productitemid;
          c.tariffmoney = 0;
          if (m[i].distributionid) {
            m[i].prostatus = 0  // 非准入门槛商品
          }
          if (typeof m[i].prostatus !== undefined) {
            c.prostatus = m[i].prostatus
            if (m[i].parentid) c.parentid = m[i].parentid
            if (m[i].distributionid) c.distributionid = m[i].distributionid
          }
          // console.log('orderadd', c)
          option.items.push(c);
        }
      }
      console.log("添加订单参数", option);
      if (option.UserAddressId === "undefined" || !option.UserAddressId) {
        _.toast("请添加收货地址");
        return;
      }
      if (
        (!option.isexpressfree && option.expresstemplateitemid === "") ||
        (option.isexpressfree && option.expressfreeid === "")
      ) {
        _.toast("没有运费模板暂时不能支付");
        return;
      }

      if (_.defaultExpress.isneedidcard) {
        if (!/^(\d{14}|\d{17})[0-9xX]$/.test(option.idcard)) {
          _.toast("请输入正确的收货人身份证号");
          return;
        }
      }
      if (_.getOrder.hasOwnProperty("groupBuyType")) {
        option.type = _.getOrder.groupBuyType;
        if (_.getOrder.groupBuyType === 1) {
          option.activityid = _.getOrder.groupActivityId;
        } else {
          option.teamid = _.getOrder.groupBuyTeamId;
        }
        
        AddGroupOrder(option)
          .then(res => {
            if (res && res.mustpay) {
              _.distributionCallback(function () {
                if (_.$root.ISAPP) {
                  let opt = {
                    name: 'callAppPaymentPage',
                    params: {
                      orderid: res.orderno,
                      callbackSuccessUrl: document.location.protocol + '//' + document.location.host + '/distribution/success',
                      callbackFailUrl: document.location.protocol + '//' + document.location.host + '/distribution/product'
                    }
                  }
                  if (!_.getOrder.isDistribution) {
                    opt.params.callbackSuccessUrl = ''
                    opt.params.callbackFailUrl = ''
                  }
                  _.javascriptBridge(opt)
                } else {
                  let url = '/pay/' + res.orderno
                  if (_.insq) url = `/frame/${encodeURIComponent(url)}`
                  _.$router.replace(url)
                }
              }, res.orderno)
            }
          })
          .catch(e => {
            _.toast(e.msg);
          });
      } else {
        // console.log(_.getOrder,'kkk')
        if(_.getOrder.cutparamsType)
        {
          option.cuttingid = _.getOrder.cuttingid;
        }
        option.usermemo = this.usermemo
        let add = _.insq ? AddOrderZone : OrderAdd;
        // console.trace('=== do order', option)
        add(option)
          .then(res => {
            window.TDH5SDK &&
              window.TDH5SDK.iap.placeOrder(
                res.orderno,
                option.paymoney,
                "CNY",
                option.items
              );




            // console.log('orAdd', res)
            if (res && res.mustpay) {
              _.getUserOrderCoupon()
              _.distributionCallback(function () {
                if (_.$root.ISAPP) {
                  let opt = {
                    name: 'callAppPaymentPage',
                    params: {
                      orderid: res.orderno,
                      callbackSuccessUrl: document.location.protocol + '//' + document.location.host + '/distribution/success',
                      callbackFailUrl: document.location.protocol + '//' + document.location.host + '/distribution/product'
                    }
                  }
                  if (!_.getOrder.isDistribution) {
                    opt.params.callbackSuccessUrl = ''
                    opt.params.callbackFailUrl = ''
                  }
                  _.javascriptBridge(opt)
                } else {
                  let url = '/pay/' + res.orderno
                  if (_.insq) url = `/frame/${encodeURIComponent(url)}`
                  _.$router.replace(url)
                }
              }, res.orderno)
            }
          })
          .catch(e => {



            console.error("订单添加失败", e);
            _.toast("订单添加失败：" + e.msg);
          });
      }
    },
    goExpress() {
      let param = `${
        this.defaultExpress.expresstemplateitemid ? "" : "没"
      }有物流模版`;



      if (!this.defaultExpress.expresstemplateitemid)
        this.toast("未获取到物流");
      else this.$router.push("/order/express");
    },
    goCoupon() {
      console.log("goCoupon", this.realCoupon, this.defaultCoupon);
      // if (this.defaultCoupon && this.defaultExpress.expresstemplateitemid) {realCoupon
      // if (this.defaultCoupon && this.defaultCoupon.couponuseid) {
      if (this.getOrder.hasOwnProperty('groupBuyType') || this.getOrder.isDistribution) {
        this.toast('优惠券不可用')
        return
      }
      if (this.getOrder.allPay - this.couvalue <= 0) {
        this.toast("当前活动下优惠券不可用");
        return;
      }
      let param = `${
        this.orderCouponList && this.orderCouponList.length > 0 ? "" : "没"
      }有可用优惠券`;


      if (this.orderCouponList && this.orderCouponList.length > 0) {
        // this.useCou = true
        this.$router.push("/order/coupon");
      } else this.toast("无可用优惠券");
    },
    cancelCou() {
      this.useCou = false;
      this.$store.state.order.selectedCoupon = null;
      this.calc();
      this._checkItems();
      // console.log('不使用优惠券', this.realCoupon, this.useCou)
    },
    seleExpress(item) {
      [...this.defaultExpressList].map(data => {
        data.selected = false;
        return data;
      });

      item.selected = true;
      this.$store.dispatch("setdefaultExpress", item);
    },
    inputCardnum(e) {
      let val = e.target.value
      val = val.replace(/\s|[^0-9xX]/g, '')
      let len = val.length
      if (len > 18) val = val.slice(0, 18)
      if (len === 18) val = val.replace(/(\d{6})(\d{8})(\d{3}[0-9xX])/, '$1 $2 $3')
      else if (len === 15) val = val.replace(/(\d{6})(\d{6})(\d{2}[0-9xX])/, '$1 $2 $3')

      this.cardnum = val
      e.target.value = val
    },
    distributionCallback(callback, orderno) {
      if (this.getOrder.isDistribution) {
        saveOrderno({ orderno: orderno })
          .then(res => {
            callback && callback()
          })
          .catch(e => {
            console.log(e)
          })
      } else {
        callback && callback()
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (
        from.path.indexOf("user/address") > -1 ||
        from.path.indexOf("user/editAddress") > -1 ||
        from.path.indexOf("productDetail") > -1
      ) {
        vm.GetExpress();
      }
    });
  }
};
</script>
<style scoped>
.check_ems,
.check_coupons {
  padding: 0 10px;
  /* height: 50px; */
  font-size: 14px;
  line-height: 50px;
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  font-size: 14px;
  margin: 15px 10px;
}

.o_footer {
  width: 100%;
  height: 48px;
  position: fixed;
  bottom: 0;
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  z-index: 9;
  background: #fff;
}

.o_footer p > span:nth-of-type(1) {
  font-size: 12px;
  margin: 0 20px;
}

.o_footer p > span:nth-of-type(2) {
  font-size: 14px;
}

.o_footer .btn_total {
  color: #fff;
  background: #333;
  font-size: 16px;
  height: 100%;
  width: 100px;
}

.order_coulist .order_cou_unit {
  width: 63%;
}

.order_coulist {
  text-align: right;
}
.buy_tip {
  text-align: left;
  color: #e26868;
  font-size: 12px;
  line-height: 16px;
  padding-bottom: 10px;
}

.exp-cardnum {
  width: 75%;
}
.exp-cardnum input {
  width: 100%;
  font-size: 16px;
}
.exp-cardnum input::-webkit-input-placeholder {
  color: #999;
  font-size: 12px;
}
.exp-cardnum input:-ms-input-placeholder {
  color: #999;
  font-size: 12px;
}
.exp-cardnum input:-moz-placeholder {
  color: #999;
  font-size: 12px;
}
.exp-cardnum input::-moz-placeholder {
  color: #999;
  font-size: 12px;
}

.exp-info {
  border-bottom: 1px solid #eee;
}
.exp-list {
  padding: 5px 0;
}
.express_unit {
  line-height: 40px;
}
.exp_name span:first-of-type {
  margin-right: 10px;
}
.usermemo{
  padding: 0 10px;
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  font-size: 14px;
  margin: 15px 10px;
  text-align: left;
  
}
.usermemo label{
  float: left;
  height: 100%;
  margin-top: 15px;
  width: 20%;
 
  /* line-height: 100%; */
}
.usermemo textarea{
  /* float: left; */
  margin-top: 15px;
   width: 80%;
  background: none;
  outline-style: none;
  list-style: none;
}
</style>
