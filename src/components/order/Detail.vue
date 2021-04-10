<template>
  <div class="express_box">
    <v-header>
      <div class="nav-tab2">
        <h3>订单详情</h3>
      </div>
    </v-header>
    <!-- c2c -->
    <div v-if="sneakC2C">
      <div class="statustext">物流查询</div>
      <div class="zhuizong">
        <em class="icon"></em>
        <div class="flex-between ordersta">
          <span>买家已发货</span>
          <span>订单跟踪 &nbsp;></span>
        </div>
        <p></p>
      </div>
    </div>
    <!-- 团购 -->
    <GroupCallbackPage
      :insq="insq"
      :orderno="orderNum"
      :pay-type="2"
      @passBack="callback"
      v-show="isShow"
    ></GroupCallbackPage>
    <!-- ==================================== -->
    <div v-if="detail&&detail.mobile">
      <UserAddressUint :addressUnit="detail" :addressType="3"></UserAddressUint>
      <OrderUnit :orderInfo="detail" :orderType="2" :teamGroup="isShow?1:0"></OrderUnit>
    </div>
    <!--拼手气红包-->
    <redPacket v-if="detail&&detail.share&&detail.share.isshowredpacket==1" :url="url"></redPacket>
  </div>
</template>
<script>
import * as orderApi from "../../common/api/order";
import UserAddressUint from "../templates/user/UserAddressUnit";
import redPacket from "@/comps/RedPacket";
import OrderUnit from "../templates/order/OrderUnit";
import { DateDiff } from "../../common/util";
// import { GetGroupBuyInfoByOrderId } from "../../common/api/group";
import GroupCallbackPage from "../group/GroupCallbackPage";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      detail: {},
      orderNum: this.$route.params.id,
      isShow: false,
      productid: "",
      statusInfo: "拼团中",
      groupBtn: "",
      orderPayInfo: "",
      infoByOrderData: {},
      payTime: {},
      sneakC2C: false, // 是否是c2c 球鞋 订单
      img: "//files.eyee.com/mcdn/static/img/home_b2c.png", // require('../../assets/img/home_b2c.png')
      url: ""
    };
  },
  components: {
    UserAddressUint,
    OrderUnit,
    GroupCallbackPage,
    redPacket
  },
  mounted() {
    this.getOrderDetail();
    console.log("cutpriceInfo", this.cutpriceInfo);
  },
  computed: {
    ...mapGetters({
      insq: "insq"
    })
  },
  methods: {
    goBack() {
      // 选择快递方式
      this.$router.go(-1);
    },
    getOrderDetail() {
      let option = {
        orderno: this.$route.params.id
      };
      console.log(option);
      orderApi
        .OrderDetail(option)
        .then(res => {
          // console.log('订单详情', res)
          res.mobile = res.mobile.split("-")[1];
          this.detail = res;
          this.url = (res.share || {}).url;
          console.log("this.detail.item.productid", res);
          this.productid = JSON.parse(this.detail.detailitem)[0].productid;
        })
        .catch(err => {
          console.log(err);
          // this.toast(err.msg)
          // setTimeout(()=>{
          //   this.$router.go(-1)
          // },1500)
        });
    },
    backtoMainArticle: function() {
      this.$router.replace("/");
    },
    callback(v) {
      if (v) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    }
  }
};
</script>
<style scoped>
/* .express_box{
  margin-top: 48px !important;
} */
.statustext {
  background: #333;
  color: #fff;
  font-size: 20px;
  padding-left: 15px;
  line-height: 80px;
  font-weight: bold;
}
.zhuizong {
  padding-left: 28px;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
  background: #fff;
  margin-top: 10px;
  padding-right: 10px;
}
.ordersta {
  font-size: 12px;
  color: #333;
  font-weight: bold;
}
.zhuizong p {
  font-size: 12px;
  color: #666;
  padding: 10px 0;
}
.zhuizong .icon {
  position: absolute;
  width: 15px;
  height: 15px;
  background: yellowgreen;
  left: 7px;
  top: 0;
}
</style>
