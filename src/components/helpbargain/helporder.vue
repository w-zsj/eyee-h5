<template>
  <div>
    <!-- <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3>我的助力</h3>
      </div>
    </v-header> -->
    <!-- <broadcast :bannertype='false'></broadcast> -->
     <!-- 确认收货地址 -->
          <div class="bg" v-if="confirmAdress" @click.stop="close(1)"></div>
          <div class="confirmAdress" v-if="confirmAdress">
            <p class="title">请确认收货地址</p>
            <div class="addressName">
                <span>{{userDefaultAddress.receiver}},</span> <span>{{userDefaultAddress.mobile}}</span>
            </div>
            <p class="dizhi">{{userDefaultAddress.address}}</p>
            <div class="cut_btn">
                  <span @click.stop="close(1)">取消</span>
                  <span @click.stop="cutBegain()">确认</span>
              </div>
          </div>
    <div class="order_box" >
      <v-cutlist :load-handle='reload' v-if="orderLists && orderLists.length>0" :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
        <div class="order_unit padding" v-for="(item,index) in orderLists" :key="index">
            <helporderlist :item="item"></helporderlist>
        </div>
      </v-cutlist>
    </div>
    <div class="EmptyPage" v-if="orderLists.length<1 && !isLoading">
        <div class="Img">
          <img src="/static/img/group.png" alt="">
        </div>
        <div>
            <p>还未参加过助力活动哦</p>
            <p>去看看有什么好东西吧~</p>
        </div>
        <div class="button" @click="golist">
            去逛逛
        </div>
        
      <!-- <Empty :showType="4"></Empty> -->
    </div>
    
    <!-- 弹框 -->
    <model v-if="cutGoingFail" :showBtn='showBtn' :cutText='cutText' modelBgClassBG='modelBgClassBG' @close='close'></model>
  </div>
</template>
<script>
// import { GetMyGroupBuyList } from '../../common/api/group'
import { getUrlParam } from "../../common/util.js";
import { MyCutUserList, StartCut } from "../../common/api/bargain";
import { mapGetters } from "vuex";
import OrderUnit from "../templates/order/OrderUnit";
import helporderlist from "./helporderlist";
import broadcast from "./broadcast.vue"; // 喇叭
import model from "./helppopmodel.vue";
// var vConsole = new VConsole();

window.callbacklogin = json => {
  var result;
  if (json) {
    result = JSON.parse(decodeURIComponent(json));
  }
  localStorage.setItem("currentUser", JSON.stringify(result));

  window.location.reload();
};
export default {
  data() {
    return {
      pagedata: { pageindex: 1, sumcount: 0, pagesize: 10 },
      isLoading: false,
      hasLoad: true,
      isEnd: false,
      confirmAdress: false,
      orderLists: [],
      cutGoingFail: false,
      showBtn: 1,
      cutText: "",
      shareinfo: {},
      appShare: {},
      modelBgClassBG: "" // cutgoing进行中  cutOver来晚了活动结束 cutFail助理失败 cutorderPass订单超过有效时间 cutSuccess好人缘报账 cutNewpeople新人
    };
  },
  components: { OrderUnit, helporderlist, broadcast, model },
  mounted() {
    if (!this.userInfo.token) {
      if (this.$root.ISAPP) {
        let callAppLoginPageParams = {
          name: "callAppLoginPage",
          params: { callbackname: "callbacklogin" }
        };
        this.javascriptBridge(callAppLoginPageParams);
      } else {
        this.$router.push("/login");
      }
    }

    this.$store.dispatch("setOrderList", []);
    this.getOrder();

    if (this.$store.state.user.cutType) {
      this.confirmAdress = true; //弹框  确认收货地址
    }
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      userInfo: "userInfo",
      userDefaultAddress: "userDefaultAddress"
    })
  },
  methods: {
    getOrder() {
      if (this.isLoading) return;
      this.isLoading = true;
      let option = {
        page: this.pagedata.pageindex,
        size: this.pagedata.pagesize
      };
      if (option.pageindex === 1) {
        this.css.isEnd = false;
        window.scrollTo(0, 0);
      }
      console.log("测试--提交的参数", option);
      MyCutUserList(option)
        .then(res => {
          if (res && res.list) {
            if (res.page === 1) this.orderLists = res.list;
            else {
              this.orderLists.push(...res.list);
              this.orderLists.businesstype = 1;
            }

            console.log("测试orderList", this.orderLists);
            if (res.page * res.size >= res.total) this.isEnd = true;
          }

          this.isLoading = false;

          this.shareinfo.title = res.share.title;
          this.shareinfo.desc = res.share.content;
          this.shareinfo.url = res.share.url;

          this.shareinfo.img = res.share.icon;
          // app分享
          this.appShare.sharecontent = res.share.content;
          this.appShare.sharetitle = res.share.title;
          this.appShare.shareurl = res.share.url;

          this.appShare.sharepicurl = res.share.icon;
          this.appShare.xcxurl = res.share.xcxurl || "";
          this.appShare.callbackname = "";
          this.initShare({
            info: {
              title: res.share.title,
              img: res.share.icon + "!c30",
              desc: res.share.content,
              url: res.share.url
            }
          });
          // this.initShare({  info: this.shareinfo });
          // alert(this.shareinfo.img)
          if (this.$root.ISAPP) {
            this.javascriptBridge({
              name: "getAppActivityShareContent",
              params: this.appShare
            });
          }
          // this.$store.dispatch('setOrderList', this.orderLists)
        })
        .catch(err => {
          this.isLoading = false;
          console.error(err);
        });
    },
    golist() {
      // 列表
      this.$router.push("/helpbargain");
    },
    reload() {
      // console.log('xiala')
      this.orderLists = [];
      this.pagedata.pageindex = 1;
      this.isEnd = false;
      this.getOrder();
    },
    loadmore() {
      console.log(this.isEnd);
      if (this.isEnd) {
        this.toast("已无更多");
      } else {
        this.pagedata.pageindex += 1;
        if (this.pagedata.pageindex > 1) this.hasLoad = false;
        this.getOrder();
      }
    },
    close(t) {
      console.log("modal close type：", t);
      if (t == 3 || t == 8) this.$router.push("/helpbargain");
      this.$store.state.user.cutType = false;
      this.confirmAdress = false;
    },
    cutBegain() {
      //发起助力参数
      this.itemsCloseItem = JSON.parse(localStorage.getItem("helphand"));
      //  alert(this.itemsCloseItem.businessid)
      if (
        this.itemsCloseItem &&
        this.userDefaultAddress &&
        this.$store.state.user.cutType
      ) {
        // console.log(this.$store.state.user.cutType, "kkk");
        let option = {};
        option = {
          useraddressid: this.userDefaultAddress.addressid,
          businesscutid: this.$store.state.user.businesscutid,
          productitemid: this.itemsCloseItem.productitemid,
          productname: this.itemsCloseItem.productname
        };

        const failModal = () => {
          this.cutText = "助力失败,<br>去看看其他商品吧~";
          this.modelBgClassBG = "cutFail";
          this.showBtn = 1;
          this.cutGoingFail = true;
          this.$store.state.user.cutType = false;
          this.confirmAdress = false;
        };

        StartCut(option)
          .then(res => {
            if (res.flag) {
              localStorage.removeItem("helphand");
              this.$store.state.user.cutType = false;
              this.$store.state.user.cutToastShare = true;
              this.confirmAdress = false;
              this.$router.push("/helpbargain/helpdetail/" + res.cutuserid);
            } else failModal();
          })
          .catch(e => {
            console.error("StartCut err：", e);
            failModal();
          });
      }
    }
  }
};
</script>
<style scoped>
.order_box {
  padding-bottom: 40px;
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

.EmptyPage {
  font-size: 14px;
  color: #999;
  text-align: center;
  margin-top: 120px;
}
.EmptyPage .Img {
  width: 76px;
  height: 62px;
  margin: 0 auto;
  margin-bottom: 20px;
  background: #eee;
}
.EmptyPage .button {
  background: #333;
  color: #fff;
  border-radius: 3px;
  width: 88px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin: 20px auto;
}
.padding {
  padding-right: 2px;
}

.cart_shop {
  width: 15px;
  height: 15px;
  margin-right: 5px;
}

.order_unit {
  padding: 0 10px;
  font-size: 12px;
  box-shadow: 0px 0px 8px rgba(219, 219, 219, 0.5);
  border-radius: 4px;
  margin: 15px 10px;
}
.confirmAdress .title {
  text-align: center;
  margin-bottom: -20px;
  margin-top: 20px;
  margin: 20px;
  font-size: 17px;
}
.addressName,
.dizhi {
  color: #666;
  font-size: 14px;
  padding:0 20px;
  line-height: 24px;
  width: 100%;
}

.bg {
  background: rgba(0, 0, 0, 0.5);
  z-index: 101;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.confirmAdress {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  /* height: 216px; */
  padding-bottom: 20px;
  background: #fff;
  border-radius: 5px;
  z-index: 105;
}

.confirmAdress .cut_btn {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.confirmAdress .cut_btn span {
  width: 46%;
  height: 38px;
  line-height: 38px;
  border: 1px solid #ffc700;
  background: #ffc700;
  border-radius: 5px;
  color: #333;
}
.confirmAdress .cut_btn span {
  text-align: center;
}
.confirmAdress .cut_btn span:nth-child(1) {
  color: #999;
  background: none;
  border: 1px solid #ccc;
}
</style>
