<template>
  <div class="main" v-if="saleInfo" style="padding-bottom: 80px;">
    <v-header>
      <div class="nav-tab2">
        <h3>发布</h3>
      </div>
    </v-header>
    <div class="top">
      <img :src="saleSneakInfo.mainpic||saleSneakInfo.headimg">
      <div class="des">
        <!-- <p class="name">{{saleSneakInfo.productname}}</p> -->
        <div class="flex flex-aic" style="align-items: center">
          <div class="sellitem flex-col presell" v-show=" clickbtn == 1 || (selltype == 3 && saleSneakInfo.isadvancesale==1 ) ">
            <span class="font-price" style="font-size:20px;" >¥ {{saleSneakInfo.advancesaleprice || '----'}}</span>
            <span class="lowest" v-if="saleSneakInfo" >{{saleSneakInfo.advancesaleprice ? '最低预售' : '暂无售价'}}</span>
          </div>
          <div class="sellitem flex-col">
            <span class="font-price" style="font-size:20px;">¥ {{saleSneakInfo.price || '----'}}</span>
            <span class="lowest" v-if="saleSneakInfo">{{saleSneakInfo.price ? '最低现货' : '暂无售价'}}</span>
          </div>
        </div>
      </div>
      <div class="">
        <span class="flex-center" v-if="saleSneakInfo">{{ isExt?saleSneakInfo.color+'；'+saleSneakInfo.size:saleSneakInfo.size+'码'  }}</span>
        <div class="count flex-center" v-if="saleSneakInfo&&cloSneakType === 2">
          <!-- <span class="lowest">{{saleSneakInfo.price ? '最低现货' : '暂无售价'}}</span>     -->
          <div class="count-input">
            <label @click="less">—</label>
            <input
              type="number"
              :disabled="saleSneakInfo.isReoffer"
              v-model="count"
              @input="changeCount"
            >
            <label @click="more">+</label>
          </div>
        </div>
      </div>
    </div>

    <div class="presell-sell-btns flex-center" v-if=" selltype == 3 ? false : saleSneakInfo.isadvancesale == 1">
      <p
        v-for="(item, index) in pre_sellbtns"
        :key="index"
        class="itembtn"
        :class=" {'selected': item.value == clickbtn}"
        @click="changeselltype(item)"
      >{{item.title}}</p>
    </div>

    <div class="pricing flex-between">
      <!-- <p class="pricing-des">出价必须以8结尾，如1288、2458、9758</p> -->
      <div class="pricing-input flex-between">
        <div>
          <span class="enter font-price">
            ¥
            <input
              type="number"
              maxlength  ="3"
              :class="{'inputnumber': salePrice==''}"
              placeholder="在此输入您想卖的价格 "
              v-model.number="salePrice"
              @change="publicsell"
              pattern="[0-9]*"
              @blur="confirmPrice"
             
            >
          </span>
        </div>
        <div class="input-right">
          <p class="pricing-des">出价必须以8结尾</p>
          <span class="margin">
            <img src="/static/img/question-mark.png" @click="goAgreement(4)">
            保证金
            <span
              class="font-price"
              :class="{'del-margin':(saleSneakInfo&&cloSneakType === 2)}"
            >¥{{margin | tofixed}}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="income">
      <!-- <div style="padding-bottom: 3.2vw;">
              <span style="font-size:2.9333vw;border-bottom: 3px solid rgb(255,200,3);" v-show="salePrice !== ''&&saleInfo.isdiscounts">特惠阶段 服务费为 {{saleInfo.discountservicemoney || 0.00}}</span>
      </div>-->
      <div class="service-fee">
        <span>
          服务费总额
          <span v-show="salePrice !== ''">
            （{{saleInfo.beforeservicemoneyrate*100|tofixed(2) || 0}}%
            <!-- <span v-show="saleInfo.salePrice" >优惠后 {{saleInfo.afterservicemoneyrate*100 || 0.00}}%</span> -->
            <span style="font-size:13px;color:#FFC700; font-family: PingFangSC;padding:0 2px;" v-if="salePrice !== ''&&saleInfo.isdiscounts"
             >特惠后 {{saleInfo.discountservicemoney || 0}}%</span>
            ）
          </span>
        </span>
        <span class="font-price">
          <span class="price-original font-price" v-show="salePrice !== ''&&saleInfo.isdiscounts">¥{{saleInfo.beforeservicemoney|tofixed(2) || '0.00'}}</span>
          <span >¥{{(saleInfo.isdiscounts?saleInfo.afterservicemoney:saleInfo.beforeservicemoney)|tofixed(2) || '0.00'}}</span>
        </span>
      </div>
      <div class="total">
        <span style="font-size:13px;">预计总收入</span>
        <span class="font-price" style="font-size:20px;">¥ {{saleInfo.sumincome || '0.00'}}</span>
      </div>
    </div>

    <div class="address" @click="goEdit">
      <div class="address-box" v-if="userDefaultAddress&&userDefaultAddress.mobile">
        <div>
          <span style="padding-right:25.3333vw;">收货人：{{userDefaultAddress.receiver}}</span>
          <span>{{userDefaultAddress.mobile}}</span>
        </div>
        <p style="margin-top: 1.3333vw;">{{userDefaultAddress.address}}</p>
        <p
          style="margin-top: 5.3333vw;font-size:11px;color:rgb(102,102,102);"
        >商品不符合平台查验标准时，将顺丰到付寄还给您</p>
      </div>

      <div class="no-address" @click="goEdit" v-else>
        <div>
          <span style="font-size:14px;color:#333;padding-right:25.3333vw">收货人：{{sellAddress.name}}</span>
          <span style="font-size:14px;color:#333;margin-bottom:1.6vw">{{sellAddress.mobile}}</span>
        </div>
        <p
          style="font-size:12px;color:#333;margin-top:1.3333vw;margin-bottom:6vw"
        >{{sellAddress.address}}</p>
        <p v-if="saleInfo" style="font-size:11px;color:#666">商品不符合平台查验标准时，将顺丰到付寄还给您</p>
      </div>

      <span class="right_icon arrow"></span>
    </div>

    <!-- 预售的文言提醒 -->
    <div class="preselltext" v-show="clickbtn == 1">
      <p v-for="(item,index) in presellRichText" :key="index" v-html="item"></p>
    </div>

    <div class="bottom fix-btm">
      <p class="flex-center">
        <span class="checkbox flex-center" @click="switchAgree">
          <img src="/static/img/d_apply_choose1.png" v-show="!isAgree">
          <img src="/static/img/d_apply_choose2.png" v-show="isAgree">
        </span>
        <span @click="switchAgree">我已阅读并同意</span>
        <a @click="goAgreement(1)">卖家须知</a>
      </p>
      <button
        class="flex-center"
        :class="{selected:(salePrice !== ''&&isAgree)}"
        @click="transfer()"
      >提交</button>
    </div>

    <model
      title="出价过高"
      confirmText="返回修改"
      @confirm="close"
      v-show="css.showHighPrice"
      @cancel="close"
    >
      <div class="model-content">您填写的出售价格过高，为了有一个良好的球鞋交易环境，请重新出价！</div>
    </model>

    <model
      title="保证金扣除说明"
      confirmText="同意并提交"
      @confirm="submitsell"
      v-show="css.showMargin"
      @cancel="close"
    >
      <div class="margin-content">
        <p>为保证商品信息真实有效及买家权益保障，如出现以下情况平台将扣除卖家保证金：</p>
        <ul>
          <li>1. 卖家超过48小时未发货或虚假发货；</li>
          <li>2. 商品未通过鉴定；</li>
          <li>3. 其他违约或侵害平台或买家权益的行为或事件。</li>
        </ul>
      </div>
    </model>

    <!-- <model title="" confirmText='好的' @confirm='jumpPath' v-show="css.showSuccess" @cancel='close'>
          <div class='model-content-success'>
            出价成功
          </div>
    </model>-->
    <model confirmText="同意并提交" @confirm="submitsell" v-show="css.showDefect" @cancel="close">
      <div class="margin-content" v-html="saleInfo.agreement"></div>
    </model>

    <model confirmText="立即补缴" @confirm="goShoppayinback" v-show="showmodel==1">
      <!-- <model confirmText="立即补缴" @confirm="goShoppayinback()"> -->
      <img class="close_btn" src="/static/img/gray_close.png" @click="closepledge()">
      <div class="model-content" v-if="saleSneakInfo.pledgemessage">
        <p class="model-title">保证金余额不足！</p>
        <div class="flex-between pledge-info">
          <p>{{selltype==0?'现货':'预售'}}最低保证金金额</p>
          <p>￥{{selltype==0?saleSneakInfo.pledgemessage.lowpledge:saleSneakInfo.pledgemessage.advancelowpledge}}</p>
        </div>
        <div class="flex-between pledge-info">
          <p>当前保证金金额</p>
          <p>￥{{saleSneakInfo.pledgemessage.nowpledge}}</p>
        </div>
        <div class="flex-between pledge-info">
          <p>需补缴</p>
          <p
            class="pay_color"
          >￥{{selltype==0?saleSneakInfo.pledgemessage.paypledge:saleSneakInfo.pledgemessage.advancepaypledge}}</p>
        </div>
      </div>
    </model>

    <pay-item
      @close="closePay"
      :dataid="saleSneakInfo.saleid"
      v-if="css.showPay&&saleSneakInfo"
      successUrl="/sneaker/payResult"
      :price="pledge"
    ></pay-item>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  Publicsell,
  Submitsell,
  JudgeMoney,
  SalingNum,
  Presell,
  Submitpresell,
  PresellAgreement
} from "../../common/api/sneaker";
import Model from "./Model";
import PayItem from "./PayItem";
import { AddressDefault } from "../../common/api/user";
import { selladdress } from "../../common/api/snekc2c";
const PT = {
  sneaker: 21,
  ext: 22
};
// selltype 0 现货 1 预售 3 重新出家
export default {
  data() {
    return {
      saleInfo: {},
      count: 1,
      salePrice: "",
      sellAddress: {},
      css: {
        showMargin: false,
        showHighPrice: false,
        showDefect: false,
        showPay: false,
        pledge: 0,
        showSuccess: false
      },
      isAgree: false,
      saleid: "",

      pre_sellbtns: [
        { title: "发布预售", value: 1 },
        { title: "发布现货", value: 0 }
      ],
      clickbtn: 1,
      // saleSneakInfo.isadvancesale: 1,  //#是否支持预售  0-否,1-是(预售新增)
      presellRichText: [],
      selltype: 0, //0:现货   ， 1：预售,
      showmodel: 0
    };
  },

  components: {
    Model,
    PayItem
  },

  computed: {
    ...mapGetters({
      userDefaultAddress: "userDefaultAddress",
      saleSneakInfo: "saleSneakInfo",
      user: "userInfo",
      baseValue: "baseValue",
      insq: "insq"
    }),
    isExt() {
      return this.saleSneakInfo.producttype == PT.ext;
    },
    cloSneakType(){
      let _=this,
      type = _.isExt?_.saleSneakInfo.seller:this.saleSneakInfo.type
      if(_.saleSneakInfo.isReoffer)type=2
      return type
    },
    margin() {
      if (this.saleInfo && this.saleInfo.pledgeprice) {
        return this.saleInfo.pledgeprice;
      }
      return 28;
    }
  },
  mounted() {
    console.log( "saleSneakInfo-------->",this.$route.params.selltype,this.saleSneakInfo);
    let _ = this;
    _.GetSellAddress();
    if (!(_.userDefaultAddress && _.userDefaultAddress.mobile)) {
      if (_.user.token) _.GetAddressDefault();
      else {
        setTimeout(() => {
          _.GetAddressDefault();
        }, 800);
      }
    }
    this.throttlePublicsell = this.throttle(this.publicsell, 800, 2000);
    if (this.saleSneakInfo && this.cloSneakType != 1) {
      this.isAgree = true;
    }
    this.count = this.saleSneakInfo.count || 1;

    _.selltype = _.$route.params.selltype;
    if (_.selltype == 3) {
      _.clickbtn = _.saleSneakInfo.isadvancesale;
      console.log(
        "_.$route.params.selltype",
        _.selltype,
        _.saleSneakInfo.isadvancesale
      );
    } else {
      if (_.saleSneakInfo.isadvancesale == 1) {
        _.clickbtn = _.selltype;
      } else {
        _.clickbtn = _.saleSneakInfo.isadvancesale;
      }
    }

    _.getAgreement();
  },

  methods: {
    //补缴保证金
    goShoppayinback() {
      // this.$router.push(`/shoppay/1`);
      this.$router.push("/shoppay?payinback=1&selltype=" + this.selltype);
    },
    closepledge() {
      console.log("1111111111111111111111111111111111111111   showmodel");
      this.showmodel = 0;
    },
    //获取预售须知
    getAgreement() {
      let _ = this;
      let role = 2;
      // alert( _.cloSneakType)
      PresellAgreement({ role: role, type: _.cloSneakType })
        .then(res => {
          if (res && res.length > 0) {
            // this.rulesList = res;
            let presellRichText = [];
            this.presellRichText = res;
            // console.log("this.rulesList",rulesList )
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    //改变出售类型
    changeselltype(item) {
      let _ = this;
      _.clickbtn = item.value;
      _.salePrice = "";
      _.saleInfo.sumincome = 0;

      _.selltype = item.value;
      if (item.value == 1 && _.saleSneakInfo.advancemoneystatus == 1) {
        _.clickbtn = 0;
        return (_.showmodel = 1);
      } else if (item.value == 0 && _.saleSneakInfo.salemoneystatus == 1) {
        _.clickbtn = 1;
        return (_.showmodel = 1);
      }
    },
    goEdit() {
      sessionStorage.setItem("address", "1");
      this.$router.push("/user/address");
    },

    close() {
      this.css.showMargin = false;
      this.css.showHighPrice = false;
      this.css.showDefect = false;
      this.css.showSuccess = false;
    },
    GetAddressDefault() {
      AddressDefault({ token: this.user.token })
        .then(res => {
          console.log("默认地址", res);
          if (res) {
            res.mobile = res.mobile.split("-")[1];
            this.$store.dispatch("setDefaultAddress", res);
          }
        })
        .catch(e => {
          console.error("获取默认地址失败", e);
        });
    },
    GetSellAddress() {
      selladdress({})
        .then(res => {
          console.log("回寄地址", res);
          if (res) {
            this.sellAddress = res;
          }
        })
        .catch(e => {
          console.error("获取回寄地址失败", e);
        });
    },

    confirmPrice() {
      let _ = this;
      if (!_.saleSneakInfo.isReoffer) {
        if (this.salePrice % 10 !== 8) {
          this.toast("价格必须以8结尾");
          return;
        }
      }
    },

    publicsell() {
      let _ = this;
      if (_.salePrice % 10 !== 8 || this.count < 1) {
        return;
      }
      let opt = {
        type:_.cloSneakType,
        sellcount: _.count,
        sellprice: _.salePrice || 0,
        productid:_.saleSneakInfo.productid||'',
        saleid:_.saleSneakInfo.saleid||''
      };
      if (_.saleSneakInfo.saleid) {
        opt.saleid = _.saleSneakInfo.saleid;
      }
      //预计总收入的预售和现货出售的接口
      if (_.clickbtn == 1) {
        Presell(opt)
          .then(res => {
            _.saleInfo = res || "";
          })
          .catch(e => {
            _.toast(e);
          });
      } else {
        Publicsell(opt)
          .then(res => {
            _.saleInfo = res || "";
          })
          .catch(e => {
            _.toast(e);
          });
      }
    },

    throttlePublicsell() {},

    less() {
      if (this.saleSneakInfo.isReoffer) return;
      if (this.count > 1) {
        this.count--;
        if (this.salePrice) {
          this.throttlePublicsell();
        }
      }
    },

    more() {
      if (this.saleSneakInfo.isReoffer) return;
      if (
        this.baseValue &&
        this.baseValue.configs &&
        this.count < this.baseValue.configs.upperlimit
      ) {
        this.count++;
        if (this.salePrice) {
          this.throttlePublicsell();
        }
      }
    },

    changeCount() {
      if (
        this.baseValue &&
        this.baseValue.configs &&
        Number(this.count) > Number(this.baseValue.configs.upperlimit)
      ) {
        this.count = this.baseValue.configs.upperlimit;
      }
      this.throttlePublicsell();
    },

    throttle(fn, delay, mustRunDelay) {
      var timer = null;
      var t_start;
      return function() {
        var context = this,
          args = arguments,
          t_curr = +new Date();
        clearTimeout(timer);
        if (!t_start) {
          t_start = t_curr;
        }
        if (t_curr - t_start >= mustRunDelay) {
          fn.apply(context, args);
          t_start = t_curr;
        } else {
          timer = setTimeout(function() {
            fn.apply(context, args);
          }, delay);
        }
      };
    },

    closePay() {
      this.css.showPay = false;
    },

    // 判断是否是重新出价
    transfer() {
      let _ = this
      if (_.salePrice === "" && !_.isAgree) {
        return;
      }

      if (_.saleSneakInfo && _.saleSneakInfo.maxprice < _.salePrice) {
        _.css.showHighPrice = true;
        return;
      }

      if (_.salePrice % 10 !== 8) {
        _.toast("价格必须以8结尾");
        return;
      }
      if (_.salePrice < (_.saleSneakInfo.lowestprice||100)) {
        _.toast("出价请大于" + (_.saleSneakInfo.lowestprice||100) + "，请重新出价！");
        return;
      }
      if (!_.userDefaultAddress.mobile) {
        _.toast("请填写回寄地址");
        return;
      }
      if (!_.isAgree) {
        return;
      }

      if (_.count < 1) {
        _.toast("数量至少为1");
        return;
      }
      console.log("是否是重新出价", _.saleSneakInfo.isReoffer);
      if (!!_.saleSneakInfo.isReoffer) {
        let opts = {
            saleprice: _.salePrice,
            saleid: _.saleSneakInfo.saleid
          },
          count = _.saleSneakInfo.count;
        SalingNum(opts)
          .then(res => {
            if (res.count == 0) {
              let option = {
                title: " ",
                okText: "确定",
                cancelText: "取消",
                confirmButtonClass: "confirm",
                cancelButtonClass: "cancel",
                msg: "您当前商品已全部被拍下，暂不可重新出价。",
                ok: () => {
                  console.log("点击了确认按钮");
                },
                cancel: () => {
                  console.log("点击了关闭按钮");
                }
              };
              _.confirm(option);
            }
            //  "count"int #出售数量
            // "type":int #1,保证金不足,2保证金充足
            if (res.type == 2) {
              _.count = res.count;
              if (res.count == count) {
                let option = {
                  title: " ",
                  okText: "确定",
                  cancelText: "取消",
                  confirmButtonClass: "confirm",
                  cancelButtonClass: "cancel",
                  msg: `您即将重新出价${res.count}件商品。`,
                  ok: () => {
                    console.log("点击了确认按钮");
                    _.judegmoney();
                  }
                };
                _.confirm(option);
              } else if (res.count < count) {
                let option = {
                  title: " ",
                  okText: "确定",
                  cancelText: "取消",
                  confirmButtonClass: "confirm",
                  cancelButtonClass: "cancel",
                  msg: `由于部分商品已被拍下，您当前可重新出价${
                    res.count
                  }件商品。`,
                  ok: () => {
                    console.log("点击了确认按钮");
                    _.judegmoney();
                  },
                  cancel: () => {
                    console.log("点击了关闭按钮");
                  }
                };
                _.confirm(option);
              } else if (res.count > count) {
                let option = {
                  title: " ",
                  okText: "确定",
                  cancelText: "取消",
                  confirmButtonClass: "confirm",
                  cancelButtonClass: "cancel",
                  msg: `由于买家取消支付，您当前可重新出价${res.count}件商品。`,
                  ok: () => {
                    console.log("点击了确认按钮");
                    _.judegmoney();
                  },
                  cancel: () => {
                    console.log("点击了关闭按钮");
                  }
                };
                _.confirm(option);
              }
            } else if (res.type == 1) {
              let option = {
                title: " ",
                okText: "重新出价",
                cancelText: "保留原价",
                confirmButtonClass: "confirm",
                cancelButtonClass: "cancel",
                msg: "您当前的保证金不足以支付重新出价。",
                ok: () => {
                  console.log("点击了确认按钮");
                },
                cancel: () => {
                  console.log("点击了关闭按钮");
                }
              };
              _.confirm(option);
            }
          })
          .catch(err => {
            if (err && err.msg) {
              _.toast(err.msg);
            }
            console.log("重新出价判断出售中数量", err);
          });
      } else {
        if (_.cloSneakType === 1) {
          _.css.showDefect = true;
        } else {
          if (_.clickbtn == 1) {
            //发布预售时，css.showMargin弹窗不显示
            _.css.showMargin = false;
            _.submitsell();
          } else {
            _.css.showMargin = true;
          }
        }
      }
    },

    judegmoney() {
      let _ = this;
      let opts = {
        saleprice: _.salePrice,
        count: _.count,
        saleid: _.saleSneakInfo.saleid
      };
      JudgeMoney(opts)
        .then(res => {
          //  "type" int#2-数量不对,不能出价,3-出价成功
          if (res.type == 2) {
            let option = {
              title: " ",
              okText: "确定",
              cancelText: "取消",
              confirmButtonClass: "confirm",
              cancelButtonClass: "cancel",
              msg: "当前商品库存发生变化，暂无法出价，请返回重新确认",
              ok: () => {
                console.log("点击了确认按钮");
              },
              cancel: () => {
                console.log("点击了关闭按钮");
              }
            };
            _.confirm(option);
          } else if (res.type == 3) {
            _.toast("重新出价成功，商品已重新上架");
            _.submitsell();
          }
        })
        .catch(err => {
          if (err && err.msg) {
            _.toast(err.msg);
          }
          console.log("重新出价判断保证金", err);
        });
    },
    // jumpPath(){
    //   let _ = this
    //   let saleid = _.saleSneakInfo.saleid
    //   _.$router.replace(`/sneaker/payResult?dataid=${saleid}&type=2`);
    // },
    submitsell() {
      let _ = this;
      _.close();
      let opt = {};
      if (_.saleSneakInfo && _.userDefaultAddress && _.salePrice) {
        opt = {
          productid: _.saleSneakInfo.productid,
          brandsizeid: _.saleSneakInfo.brandsizeid||'',
          sellcount: _.count,
          sellprice: _.salePrice,
          type: _.cloSneakType,
          color: _.saleSneakInfo.color,
          size: _.saleSneakInfo.size,
          consignee: _.userDefaultAddress.receiver,
          mobile: _.userDefaultAddress.mobile,
          address: _.userDefaultAddress.address,
          productname: _.saleSneakInfo.productname,
          clothessku:_.saleSneakInfo.sku||''
        };
      }
      // if (_.clickbtn == 0 && _.sellId) {
      //   _.pledge = _.sellPledge;
      //   _.css.showPay = true;
      // } else if (_.clickbtn == 1 && _.presellId) {
      //   _.pledge = _.presellPledge;
      //   _.css.showPay = true;
      // } else {
      //clickbtn:是否支持预售  0-否,1-是(预售新增)
      if (!_.clickbtn) {
        Submitsell(opt)
          .then(res => {
            if (res && res.ispay) {
              // _.css.showPay = true;
              // _.$store.dispatch("addSaleSneakInfo", {
              //   ..._.saleSneakInfo,
              //   saleid: res.saleid
              // });
              // _.saleid = res.saleid;
              // _.pledge = res.pledge;
              _.$store.dispatch("addSaleSneakInfo", {
                ..._.saleSneakInfo,
                saleid: res.saleid
              });
              _.saleid = res.saleid;
              _.pledge = res.pledge;
              _.sellPledge = res.pledge;

              _.sellId = res.saleid;
              _.sellPledge = res.pledge;

              // 空间潮物支付 跳转支付页
              if (_.insq) {
                let url = `/sneaker/pay/sell_pay_bail?pledge=${
                  res.pledge
                }&dataid=${res.saleid}`;
                if (_.insq) url = `/frame/${encodeURIComponent(url)}`;
                _.$router.replace(url);
              } else _.css.showPay = true;
            } else if (res && !res.ispay && _.cloSneakType === 2) {
              if (!!_.saleSneakInfo.isReoffer) {
                _.$router.go(-1);
              } else {
                //  _.css.showSuccess = true;
                _.$router.replace(
                  `/sneaker/payResult?dataid=${res.saleid}&type=2`
                );
              }
            }
          })
          .catch(e => {
            _.$toast(e.msg);
            console.log(e);
          });
      } else if (_.clickbtn == 1) {
        //预售商品的提交预售接口
        Submitpresell(opt)
          .then(res => {
            if (res && res.ispay) {
              // _.css.showPay = true;
              // _.$store.dispatch("addSaleSneakInfo", {
              //   ..._.saleSneakInfo,
              //   saleid: res.saleid
              // });
              // _.saleid = res.saleid;
              // _.pledge = res.pledge;
              _.$store.dispatch("addSaleSneakInfo", {
                ..._.saleSneakInfo,
                saleid: res.saleid
              });
              _.saleid = res.saleid;
              _.pledge = res.pledge;

              _.presellId = res.saleid;
              _.presellPledge = res.pledge;

              // 空间潮物支付 跳转支付页
              if (_.insq) {
                let url = `/sneaker/pay/sell_pay_bail?pledge=${
                  res.pledge
                }&dataid=${res.saleid}`;
                if (_.insq) url = `/frame/${encodeURIComponent(url)}`;
                _.$router.replace(url);
              } else _.css.showPay = true;
            } else if (res && !res.ispay && _.cloSneakType === 2) {
              if (!!_.saleSneakInfo.isReoffer) {
                _.$router.go(-1);
              } else {
                // _.css.showSuccess = true;
                _.$router.replace(
                  `/sneaker/payResult?dataid=${res.saleid}&type=2`
                );
              }
            }
          })
          .catch(e => {
            _.$toast(e.msg);
            console.log(e);
          });
      }
      // }
    },

    switchAgree() {
      this.isAgree = !this.isAgree;
    },

    goAgreement(type) {
      this.$router.push(`/buyerSellKnow?type=${type}`);
    }
  },
  watch:{
    'salePrice':function(newval,oldval){
        newval = String(newval)
        if(newval&&newval.length>7){
          this.salePrice = Number(newval.slice(0,7))
        }
    }
  }
};
</script>

<style lang="scss" scoped>
.top {
  height: 26.6667vw;
  display: flex;
  align-items: center;
  padding: 0 2.9333vw;
  box-shadow: 0 3px 5px 0 rgba(210, 210, 210, 0.37);
  img {
    width: 17.0667vw;
  }
}
.presell-sell-btns {
  width: 50%;
  margin: 0 auto;
  padding-top: 3.2vw;
  border-radius: 2px;
  .itembtn {
    // padding: 1.0667vw 4vw;
    width: 50%;
    padding: 4px 0;
    text-align: center;
    color: #ffffff;
    font-size: 14px;
    line-height: 20px;
    background-color: #cccccc;
  }
  .selected {
    background-color: #333333;
  }
}
.des {
  flex: 1;
  padding-left: 3.7333vw;
}
.name {
  font-size: 14px;
  height: 10.6667vw;
}
.sellitem {
  text-align: center;
  margin: 0 1vw;
}

.close_btn {
  position: absolute;
  top: 3.3333vw;
  right: 3.8667vw;
  height: 15px;
}
.model-content {
  margin-top: 4vw;
  margin-bottom: 9.0667vw;
}
.model-title {
  color: #d71414;
  font-size: 16px;
  font-weight: 400;
  margin: 6vw 2.4vw 2.6667vw 2.4vw;
  text-align: center;
  font-weight: 600;
}
.pledge-info {
  margin-top: 16px;
}

.lowest,
.lowest2 {
  font-size: 2.6667vw;
  display: inline-block;
  // padding-left: 5vw;
  // height: 5.8667vw;
  // width: 23.2vw;
  line-height: 3.7333vw;
  position: relative;
  // margin-left: 5vw;
  // background-image: url("/static/img/sale_bg_lable.png");
  background-size: 100% 100%;
  background-color: #d8d8d8;
  opacity: 0.6;
  color: #333333;
  padding: 0.8vw 2.6667vw;
  margin-top: 2.1333vw;
}

.lowest2 {
  width: 21.3333vw;
  height: 6.5333vw;
  background-image: url("/static/img/sneaker/sale_bg_lable2.png");
}

.size-info {
  position: absolute;
  right: 0;
  margin-right: 5vw;
  color: #333;
  font-size: 14px;
}

.pricing {
  width: 94.6667vw;
  height: 24.8vw;
  box-shadow: 0 2px 8px 0 rgba($color: #000000, $alpha: 0.1);
  margin: 2.6667vw auto;
}

.pricing-des {
  font-size: 10px;
  color: rgb(153, 153, 153);
  padding-left: 2.6667vw;
  padding-top: 2.6667vw;
  padding-bottom: 2.6667vw;
}

.pricing-input {
  width: 100%;
  padding-top: 5.3333vw;
  padding-left: 2.6667vw;
  padding-right: 2.6667vw;
  padding-bottom: 5.3333vw;

  // margin-top: 5.3333vw;
  // margin-left: 2.6667vw;
  .enter {
    font-size: 25px;
    width: 40vw;
    padding: 6px 0;
    border-bottom: 1px solid rgb(245, 245, 245);
    input {
      width: 40vw;
      font-size: 34px;
    }
    input.inputnumber {
      font-size: 12px;
      color: #333;
      font-weight: 500;
    }
  }
  .input-right {
    text-align: right;
  }
  .margin {
    font-size: 12px;
    margin-left: 8vw;
    color: rgb(102, 102, 102);

    span {
      color: rgb(255, 199, 0);
      margin-left: 1vw;
    }

    .del-margin {
      color: rgb(204, 204, 204);
      text-decoration: line-through;
    }

    img {
      width: 3.2vw;
      height: 3.2vw;
      margin-right: 1.0667vw;
      position: relative;
      top: 0.2vw;
    }
  }
}

.income {
  width: 94.6667vw;
  box-shadow: 0 2px 8px 0 rgba($color: #000000, $alpha: 0.1);
  margin: 2.6667vw auto;
  font-weight: 600;
  padding: 3.2vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 13px;
  .service-fee {
    display: flex;
    justify-content: space-between;
    margin-bottom: 3.2vw;
  }
  .price-original {
    text-decoration: line-through;
    color: #999999;
    padding-right: 4vw;
  }

  .total {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.address {
  width: 94.6667vw;
  box-shadow: 0 2px 8px 0 rgba($color: #000000, $alpha: 0.1);
  margin: 2.6667vw auto;
  font-size: 14px;
  padding: 3.2vw;
  position: relative;
  .arrow {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%) rotate(-45deg);
    right: 2.6667vw;
  }
}

.bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  p {
    font-size: 12px;
    color: rgb(102, 102, 102);
    margin-bottom: 4vw;
    a {
      font-weight: 600;
      color: #000000;
      padding-left: 1.6vw;
    }
  }
  button {
    width: 100%;
    height: 44px;
    background-color: rgb(204, 204, 204);
    color: #fff;
    border: none;
  }

  .selected {
    background-color: #333;
    color: #fff;
  }
}

.model-content {
  font-size: 13px;
  margin-top: 4vw;
  margin-bottom: 9.0667vw;
}
.model-content-success {
  text-align: center;
  font-size: 20px;
  margin: 40px 0;
}
.count {
  display: flex;
  align-items: center;
  margin-top: 3.3333vw;
}

.lowest2 {
  width: 21.3333vw;
  height: 6.9333vw;
  background-image: url("/static/img/sale_bg_lable2.png");
  text-align: center;
  padding-left: 0;
  line-height: 8vw;
  margin-left: 0;
}

.count-input {
  height: 6.4vw;
  // margin-left: 16.5333vw;
  border: 1px solid #333;
  label {
    width: 6.6667vw;
    border-right: 1px solid #333;
    display: inline-block;
    text-align: center;
  }
  label:last-child {
    border-right: none;
    border-left: 1px solid #333;
  }
  input {
    height: 6.4vw;
    width: 9.6667vw;
    background-color: rgba(0, 0, 0, 0);
    text-align: center;
  }
}

.checkbox img {
  width: 4.2667vw;
  height: 4.2667vw;
  margin-right: 3.2vw;
}

.margin-content {
  font-size: 13px;
  margin-top: 4vw;
  margin-bottom: 7.2vw;
  ul {
    margin-top: 4vw;
  }
  li {
    font-size: 11px;
  }
}
.preselltext {
  padding: 3.2vw;
  font-size: 12px;
  line-height: 17px;
  color: #999999;
}
</style>
