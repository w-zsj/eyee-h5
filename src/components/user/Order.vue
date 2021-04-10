<template>
  <div>
    <v-header>
      <div class="nav-tab2">
        <h3>我的订单</h3>
      </div>
    </v-header>
    <div class="coupon_head">
      <p
        v-for="item in orderBar"
        :key="item.name"
        @click="checkType(item.type)"
        :class="{checked:item.type==activeindex}"
      >{{item.name}}</p>
    </div>
    <div class="order_box">
      <v-list
        :load-handle="reload"
        v-if="orderList&&orderList.length>0"
        :more-handle="loadmore"
        :more-handling="isLoading"
        :isend="isEnd"
      >
        <div v-for="(item,index) in orderList" :key="index" @click.stop="goOrderDetail(item)">
          <OrderUnit
            :orderInfo="item"
            :orderType="1"
            :planfinishtime="item.planfinishtime"
            :index="index"
          ></OrderUnit>
        </div>
      </v-list>
    </div>
    <!-- <div class="group-entrance" v-if="isShowGroupBtn" @click.stop="gotoOrderGroup" @touchstart='touchstart'  @touchmove="touchmove" :style="{ top: pageY+'px', left: pageX + 'px' }">
      <p>我的</p>
      <p>团购</p>
    </div>-->
    <div v-if="orderLists.length<1&&!isLoading">
      <Empty :showType="4"></Empty>
    </div>
  </div>
</template>
<script>
import { buyerorderlist } from "../../common/api/snekc2c.js";
import { OrderPage } from "../../common/api/order";
import { GetMyGroupBuyList } from "../../common/api/group";
import { mapGetters } from "vuex";
import Empty from "../templates/cart/Empty";
import OrderUnit from "../templates/order/OrderUnit";
export default {
  data() {
    return {
      orderBar: [
        { type: 0, name: "全部" },
        { type: 1, name: "待付款" },
        { type: 2, name: "待发货" },
        { type: 3, name: "待收货" },
        { type: 4, name: "已完成" },
        { type: 5, name: "已关闭" }
      ],
      activeindex: 0,
      pagedata: { pageindex: 1, status: 0, sumcount: 0, pagesize: 20 },
      isLoading: false,
      isEnd: false,
      orderLists: [],
      // isShowGroupBtn: false,
      pageX: 0.7 * document.documentElement.clientWidth,
      pageY: 0.8 * document.documentElement.clientHeight,
      docLeft: 0,
      docTop: 0
    };
  },
  components: { Empty, OrderUnit },
  mounted() {
    this.$store.dispatch("setOrderList", []);
    this.getOrder();
    this.activeindex = this.orderState;

    // GetMyGroupBuyList({ page: 1, size: 5, status: 1 })
    //   .then(res => {
    //     if (res && res.list.length > 0) {
    //       this.isShowGroupBtn = true;
    //     } else {
    //       console.log("暂无拼团数据");
    //     }
    //   })
    //   .catch(e => {
    //     console.error(e);
    //   });
  },
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
      orderState: "orderState",
      orderList: "orderList"
    })
  },
  methods: {
    gotoOrderGroup() {
      this.$router.push("/groupbuy/order");
    },
    touchstart(e) {
      this.docLeft = e.targetTouches[0].clientX - e.currentTarget.offsetLeft;
      this.docTop = e.targetTouches[0].clientY - e.currentTarget.offsetTop;
    },
    touchmove(e) {
      e.preventDefault();
      let _ = this,
        tar = e.targetTouches[0],
        dc = document.documentElement,
        screenWidth = dc.clientWidth,
        screenHeight = dc.clientHeight;

      // alert(tar.clientX - docLeft)
      _.pageX = tar.clientX - this.docLeft;
      _.pageY = tar.clientY - this.docTop;

      if (_.pageX >= screenWidth - 65) {
        _.pageX = screenWidth - 65;
      } else if (_.pageX < 0) {
        _.pageX = 0;
      }
      if (_.pageY >= screenHeight - 65) {
        _.pageY = screenHeight - 65;
      } else if (_.pageY < 0) {
        _.pageY = 0;
      }
      // console.log("-------------->", tar.clientX, tar.clientY);
    },
    checkType(n) {
      this.isEnd = false;
      this.orderLists = [];
      this.$store.dispatch("setOrderList", []);
      this.activeindex = n;
      this.$store.dispatch("setOrderState", n);
      this.pagedata.pageindex = 1;
      this.getOrder();
    },
    getOrder() {
      this.isLoading = true;
      let page = this.pagedata;
      let option = {
        page: this.pagedata.pageindex, // this.pagedata.pageindex === 0 ? "" :
        status: this.orderState === 0 ? "" : this.orderState - 1,
        size: this.pagedata.pagesize === 0 ? "" : this.pagedata.pagesize,
        platform: 4
      };
      // OrderPage
      buyerorderlist(option)
        .then(res => {
          if (res && res.list) {
            if (res.pageindex === 1) this.orderLists = res.list;
            else this.orderLists.push(...res.list);
            if (res.page >= 0) page.pageindex = res.page;
            if (res.total > -1) page.sumcount = res.total;
            if (res.size > -1) page.pagesize = res.size;
            if (page.pageindex * page.pagesize >= page.sumcount) {
              this.isEnd = true;
            }
          }
          this.isLoading = false;
          this.orderLists = this.orderLists.filter(i => i.ordertype != 4);
          console.log("orderLists", this.orderLists);
          this.$store.dispatch("setOrderList", this.orderLists);

          // console.log("订单列表~~~", this.orderList); isShowGroupBtn
        })
        .catch(err => {
          this.isLoading = false;
          console.error(err);
        });
    },
    reload() {
      // console.log('xiala')
      this.orderLists = [];
      this.pagedata.pageindex = 1;
      this.getOrder();
    },
    loadmore() {
      if (this.isEnd === true) {
        this.toast("已无更多");
      } else {
        this.pagedata.pageindex += 1;
        this.getOrder();
      }
    },
    goOrderDetail(item) {
      // console.log('跳转订单详情', item)
      let cuthelpOrder =
        typeof item.detailitem === "string"
          ? JSON.parse(item.detailitem)[0]
          : item.detailitem[0];
      let CutPriceInfo = {
        originalprice: cuthelpOrder.originalprice,
        cutminprice: item.cutminprice,
        ishelpcutorder: cuthelpOrder.ishelpcutorder,
        producttype: item.producttype
      };
      // console.log("商品信息rrr", item);
      // console.log("商品信息", JSON.parse(item.detailitem));
      // if (cuthelpOrder.cutminprice) {
      // }
      this.$store.dispatch("CutPriceInfo", CutPriceInfo);
      if (item.isc2c) {
        this.$router.push("/buyerdetail/" + item.orderno);
      } else {
        this.$router.push("/order/detail/" + item.orderno);
      }
    }
  }
  // ,
  // watch: {
  //   orderList: function (newv) {
  //     console.log('changegegege', newv)
  //     // this.$store.dispatch('setOrderList',newv)
  //   }
  // }
};
</script>
<style scoped>
.group-entrance {
  position: fixed;
  width: 65px;
  height: 65px;
  background: #000;
  box-shadow: 0px 0px 6px #000;
  border-radius: 50%;
  font-size: 14px;
  color: #ffc700;
  text-align: center;
  line-height: 20px;
  z-index: 105;
  bottom: 80px;
  right: 30px;
}
.group-entrance p:nth-child(1) {
  margin-top: 12px;
}
.coupon_head {
  display: flex;
  position: fixed;
  background: #fff;
  z-index: 99;
  width: 100%;
  left: 0;
  top: 48px;
}

.coupon_head p {
  font-size: 12px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  color: #666;
  width: 16.6%;
  text-align: center;
  padding: 10px 0;
}

p.checked {
  border-bottom: 2px solid #333;
  color: #333;
}

.order_box {
  margin-top: 80px;
}

.order_box /deep/ .model .pay_paylist {
  bottom: 30px;
}
.mint-loadmore {
  overflow: unset;
}
</style>
