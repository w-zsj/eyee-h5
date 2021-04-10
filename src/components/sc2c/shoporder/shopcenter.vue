<template>
    <div>
      <!-- v-if="!insq" -->
      <v-header v-if="!insq" :returnBack='1'>
            <div class="nav-tab2">
                <h3>我的出售</h3>
            </div>
            <!-- <v-cart :isshow="true" :isdark="true"></v-cart> -->
        </v-header>
        <div class="main">
          <div class="banner-top flex-between">
            <div class="banner-info">
                <h4>{{personageShop?'剩余保证金':'入驻商家 手续费更优惠'}}</h4>
                <div class="sign" v-show="accountstatus==1" @click="goShoppayinback()"><p>补缴保证金</p></div>
                <div class="text" v-show="accountstatus==0">
                  <!-- <p>1. 可以同时出售多双球鞋</p> -->
                  <p>1. 可以同时出售多个商品</p>
                  <p>2. 可享受0佣金优惠</p>
                  <p>3. 不必每次缴纳保证金</p>
                </div>
                <div class="text" v-show="accountstatus==2">
                  <pre class="alerm"><img src="/static/img/alerm.png">{{freezedescription}}</pre>
                </div>
                <div class="text" v-show="accountstatus==1">
                  <pre class="alerm">{{freezedescription}}</pre>
                </div>
            </div>
            <div class="applyShop flex-col flex-end" :class="{'margintop':!personageShop}">
              <span class="price" v-if="personageShop" :class="{'frozenprice':accountstatus!=0}">￥{{mysell.pledgemoney>0?(mysell.pledgemoney|tofixed):mysell.pledgemoney}}</span>
              <span class="shopBtn" @click.stop="shop(1)" v-if="!personageShop">成为入驻商家</span>
              <span class="shopBtn" :class="{'border':!personageShop}" @click.stop="shop(2)">保证金记录</span>
            </div>
          </div>
          <!-- <button @click.stop="shop">申请入驻商家</button> -->
          <div class="productSale flex-center ">
             <div class="salenum">
                <span>{{mysell.sellsuccesscount||0}}</span>
                <p>出售成交量</p>
             </div>
             <div class="salemoney">
               <span>￥{{mysell.sellsummoney|tofixed}}</span>
               <p>销售总金额</p>
             </div>
             <span class="deposit" @click.stop="deposit">提现</span>
          </div>
          <div class="list">
            <div class="flex-between orderstatus" v-for="(item,index) in orderpage" :key="index" @click="orderStatus(item.type)">
                <span class="sale" :class="{'hint':item.type===1&&item.count>0}">{{item.status}}
                  <em :class="item.icon"></em> </span>
                <span class="salenum" :class="{markedRed: item.status=='待发货'&& item.count>0 }">{{item.count||0}} <em>></em></span>
            </div>
          </div>
          <div class="flex-between orderstatus list"  v-if="personageShop" @click.stop="businessinfo">
             <span class="sale">入驻信息 <em class="icon iconinto"></em> </span><span class="salenum"><em>></em></span>
          </div>
          <div class="flex-between orderstatus list" @click.stop="getout">
             <span class="sale">违规查询记录 <em class="icon"></em> </span><span class="salenum"><em>></em></span>
          </div>
          <div class="flex-between orderstatus list" @click.stop="QiyuProd">
             <span class="sale">联系客服 <em class="icon_service"></em> </span><span class="salenum"><em>></em></span>
          </div>
          <div class="flex-between orderstatus list" @click.stop="applyAddProduct">
             <span class="sale">申请添加商品 <em class="icon_add"></em> </span><span class="salenum">没有找到商品？这里提交申请哦<em>></em></span>
          </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { mysell } from "../../../common/api/snekc2c.js";
import { QiyuProd } from '@/common/api/WyQiyu';
export default {
  data() {
    return {
      personageShop: true, // true商家 false个人
      accountstatus: 0,
      mysell: {},
      freezedescription:"",
      orderpage: [
        { status: "出售中", ico: "insale", count: 0 },
        { status: "待发货", ico: "sending", count: 0 },
        { status: "已发货", ico: "sended", count: 0 },
        { status: "交易成功", ico: "ok", count: 0 },
        { status: "交易失败", ico: "fail", count: 0 }
      ]
    };
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      shopType: "shopType",
      userInfo: "userInfo"
    })
  },

  mounted() {
    let sellOption = {
      userid: this.userInfo.uid,
      businesssellid: ""
    };
    this.myOrShopSell(sellOption);
  },
  methods: {
    myOrShopSell() {
      // 出售列表
      mysell()
        .then(res => {
          console.log("我的出售列表", res);
          if (res && res.list) {
            this.mysell = res;
            this.personageShop = res.type === 1 ? false : true;
            this.accountstatus = res.status;
            this.freezedescription = res.freezedescription ? res.freezedescription.replace(/[↵\r\n]/g,'\n'):""
            this.orderpage = this.mysell.list;
            this.orderpage.map(i => {
              switch (i.type) {
                case 0:
                  i.status = "出售中";
                  i.icon = "saleing";
                  break;
                case 1:
                  i.status = "待发货";
                  i.icon = "sendGoods";
                  break;
                case 2:
                  i.status = "已发货";
                  i.icon = "shipped";
                  break;
                case 3:
                  i.status = "交易成功";
                  i.icon = "dealsSuccess";
                  break;
                case 4:
                  i.status = "交易失败";
                  i.icon = "dealsFaill";
                  break;
              }
            });
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    shop(type) {
      if (type === 1) {
        let dis = {
          id: "",
          detailtype: 0
        };
        this.$store.dispatch("detailtype", dis);
        this.$router.push("/shopinto");
      } else this.$router.push("/deduct");
    },
    orderStatus(type) {
      let per = 0;
      if (this.personageShop) {
        per = 1;
      }
      this.$store.dispatch("shoptype", type);
      this.$router.push(`/shoporderlist/${per}`);
    },
    deposit() {
      this.loadApp();
    },
    businessinfo() {
      this.$router.push("/businessinfo");
    },
    getout() {
      this.$router.push("/getout");
    },
    goShoppayinback() {
      this.$router.push(`shoppay/1`);
    },
    QiyuProd() {

      QiyuProd.call(this)
    },
    applyAddProduct() {
      this.$router.push("/applyAddProduct");
    }
  }
};
</script>

<style scoped>
.main {
  padding-bottom: 20px;
  background: #fff;
}

.banner-top {
  background: #333333;
  color: #fff;
  font-size: 12px;
  padding: 15px 15px 10px 20px;
}
.banner-top h4 {
  font-size: 16px;
  line-height: 30px;
  font-weight: bold;
  margin-bottom: 10px;
}
.banner-top p {
  line-height: 20px;
  color: #dedede;
}
.banner-top .alerm {
  color: #e53e3e;
}
.sign {
  position: absolute;
  top: 67px;
  left: 115px;
  width: 65px;
  height: 19px;
  background: #ffc700;
  border-radius: 4px;
  border: 2px solid rgba(255, 199, 0, 1);
}
.sign p {
  color: #333;
  font-size: 10px;
  transform: translate(0, -2px);
  text-align: center;
}
.text {
  height: 16vw;
}
.text img {
  margin-right: 4px;
  padding-top: 1px;
  height: 14px;
  transform: translate(0, 2px);
}
.text pre {
  line-height: 22px;
}
.banner-info {
  width: 45vw;
}
.applyShop.margintop {
  /* margin-top: -65px; */
}
.applyShop .price {
  font-size: 24px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 15px;
}
.frozenprice {
  font-size: 24px;
  color: #ccc;
  font-weight: bold;
  margin-bottom: 15px;
}
.shopBtn {
  padding: 0 10px;
  color: #333;
  background: #fff;
  line-height: 24px;
  border-radius: 3px;
}
.shopBtn.border {
  background: none;
  border: 1px solid #fff;
  color: #dedede;
  margin-top: 20px;
}
.productSale {
  margin: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px #ccc;
  min-height: 88px;
  text-align: center;
  position: relative;
}
.productSale span.deposit {
  position: absolute;
  height: 24px;
  width: 55px;
  font-size: 12px;
  background: #333;
  border-radius: 22px 0 0 22px;
  color: #fff;
  text-align: center;
  line-height: 24px;
  top: 20px;
  right: 0;
}
.productSale .salenum {
  width: 40%;
  position: relative;
}
.productSale .salenum::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 70px;
  width: 2px;
  background: #f5f5f5;
}
.productSale .salemoney {
  width: 60%;
  padding-right: 10%;
}
.productSale span {
  color: #333333;
  font-size: 26px;
  font-weight: bold;
}
.productSale p {
  font-size: 13px;
  line-height: 24px;
  font-weight: bold;
}
.list {
  margin: 10px;
  border-radius: 5px;
  box-shadow: 0 0 5px #ccc;
  font-size: 14px;
}
.orderstatus {
  height: 60px;
  border-bottom: 1px solid #f5f5f5;
}
.orderstatus span.sale {
  padding-left: 42px;
  position: relative;
}
.orderstatus span.hint:before {
  content: "";
  position: absolute;
  width: 5px;
  height: 5px;
  right: -10px;
  top: 1px;
  border-radius: 50%;
  background: #e73131;
}
/* "saleing" },
"sendGoods" },
"shipped" },
: "dealsSuccess" },
: "dealsFaill" } */
.orderstatus span.sale em {
  position: absolute;
  width: 25px;
  height: 25px;

  left: 15px;
  top: 0px;
}
.orderstatus span.sale em.saleing {
  background: url("/static/img/order1.png") 0 0 no-repeat;
  background-size: 100% auto;
}
.orderstatus span.sale em.sendGoods {
  background: url("/static/img/order2.png") 0 0 no-repeat;
  background-size: 100% auto;
}
.orderstatus span.sale em.shipped {
  background: url("/static/img/order3.png") 0 0 no-repeat;
  background-size: 100% auto;
}
.orderstatus span.sale em.dealsSuccess {
  background: url("/static/img/order4.png") 0 0 no-repeat;
  background-size: 100% auto;
}
.orderstatus span.sale em.dealsFaill {
  background: url("/static/img/order5.png") 0 0 no-repeat;
  background-size: 100% auto;
}
.orderstatus span.sale em.icon {
  background: url("/static/img/order6.png") 0 0 no-repeat;
  background-size: 100% auto;
}
.orderstatus span.sale em.icon_service {
  background: url("/static/img/order details page_icon_service.png") 0 0 no-repeat;
  background-size: 20px 20px;
}
.orderstatus span.sale em.icon_add {
  background: url("/static/img/order_icon_add.png") 0 0 no-repeat;
  background-size: 20px 20px;
}

.orderstatus span.sale em.iconinto {
  width: 20px;
  height: 20px;
  background: url("/static/img/salepage_icon_information_default.png") 0 0
    no-repeat;
  background-size: 100% auto;
}
.orderstatus span.salenum {
  padding-right: 20px;
  position: relative;
  color: #999999;
  font-size: 10px;
}
.orderstatus span.markedRed {
  color:#E73131;
}
.orderstatus span.salenum em {
  color: #ccc;
  padding-left: 10px;
}
</style>

