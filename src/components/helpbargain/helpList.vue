<template>
  <div class="puzzle">
    <!-- <img src="https://files.eyee.com/EYEE/share/weixin/wx_share_list_white_1x.png!30" alt="" style="display:none;"> -->
    <div v-if="css.hasData" class="main">
      <!-- <broadcast :bannertype='true'></broadcast> -->
      <v-cutlist
        :load-handle="getGroupListDataLoad"
        :more-handle="loadmore"
        :more-handling="css.isLoading"
        :isend="css.isEnd"
      >
        <div class="group_product_list">
          <div
            class="productItem"
            v-for="(groupItem, index) in groupBuyList"
            :key="index"
            v-show="groupBuyList.length>0"
          >
            <div class="ImgWrap" @click.stop="productDetail(groupItem.productid)">
              <img :src="groupItem.productimageurl" alt />
            </div>
            <div class="textWrap" @click.stop="productDetail(groupItem.productid)">
              <div class="product_names">
                <p class="ellipsis brand_name">{{groupItem.brand}}</p>
                <p class="ellipsis product_name">{{groupItem.productname}}</p>
                <p
                  class="ellipsis product_price font-price"
                  style="text-align: left; padding: 0px;"
                >
                  <span>¥{{groupItem.minprice}}</span>
                  <span class="gui">¥{{groupItem.saleprice}}</span>
                </p>
                <p class="ellipsis business_name">
                  <i
                    :class="groupItem.businesstype===1?'ico-sp-official':groupItem.businesstype===2?'ico-sp-buy':'ico-sp-store'"
                  ></i>
                  {{groupItem.businessname}}
                </p>
                <p class="pin">
                  <span class="pnu">{{groupItem.successcount}}人已成功助力</span>
                </p>
              </div>
            </div>
            <div class="gototuan" @click.stop="getProductOptions(groupItem)">
              <div class="goContent">
                <span>邀请助力</span>
              </div>
            </div>
          </div>
          <product-items
            v-if="css.showItems"
            :show="css.showItems"
            :helpType="true"
            :product-info="realInfo"
            @close="itemsClose"
          ></product-items>
          <!-- <ProductUnit v-for="(groupItem, index) in groupBuyList" :key='index' v-if="groupBuyList.length>0"   :productItem='groupItem' :productType="14"></ProductUnit> -->
        </div>
      </v-cutlist>
    </div>
    <div class="no_cut" v-if="!css.hasData">
      <span>暂时没有任何助力商品哦~</span>
    </div>
    <!-- 确认收货地址 -->
    <div class="bg" v-if="confirmAdress" @click.stop="close"></div>
    <div class="confirmAdress" v-if="confirmAdress">
      <p class="title">请确认收货地址</p>
      <div class="addressName">
        <span>{{userDefaultAddress.receiver}},</span>
        <span>{{userDefaultAddress.mobile}}</span>
      </div>
      <p class="dizhi">{{userDefaultAddress.address}}</p>
      <div class="cut_btn">
        <span @click.stop="close">取消</span>
        <span @click.stop="cutBegain()">确认</span>
      </div>
    </div>
    <!-- 弹框 -->
    <model
      v-if="cutGoingFail"
      :showBtn="showBtn"
      :cutText="cutText"
      :modelBgClassBG="modelBgClassBG"
      @close="close"
    ></model>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
import { mapGetters } from "vuex";
import { getUrlParam } from "../../common/util.js";
import ProductUnit from "../templates/ProductUnit";
import ProductItems from "@/comps/ProductItems";
import { GetGroupProductList } from "../../common/api/group";
import {
  GetCutProductList,
  GetCutProductListOpen,
  StartCut
} from "../../common/api/bargain";
import { NewDetail } from "../../common/api/product";
import broadcast from "./broadcast.vue";
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
  components: { ProductUnit, ProductItems, broadcast, model },
  data() {
    return {
      css: {
        isLoading: false,
        isEnd: false,
        hasData: true,
        showItems: false
      },
      showBtn: 1,
      cutText: "",
      modelBgClassBG: "", // cutgoing进行中  cutOver活动结束 cutLater来晚了 cutFail助理失败 cutorderPass订单超过有效时间 cutSuccess好人缘报账 cutNewpeople新人
      // cutGoing: false,
      confirmAdress: false,
      cutGoingFail: false,
      groupBuyList: [],
      helpPrice: 0, // 代表 已砍的價格
      shareinfo: {},
      appShare: {},
      pagination: {
        sumcount: 0,
        pagesize: 5,
        pageindex: 1,
        hasLoad: true
      },
      cutActiveId: "",
      typeClass: "",
      itemsCloseItem: {}, // 颜色规格我
      productInfoGroupItems: {} // 颜色规格参数
    };
  },
  computed: {
    realInfo() {
      let info = {};
      info =
        (this.productInfoGroupItems && this.productInfoGroupItems.info) || {};

      info.productid = info.id;
      // info.productid = 'dc9ea07760614a178a266c4eface5123'
      // info.mainpic='https://files.eyee.com/Shop/system/main/6c5ff2dc766441f08e9b1795a2babd29.jpeg!c30'
      // info.name = 'eee'
      // info.price=20
      console.log(info.productid, "kk");
      return info;
    },
    businesscutid() {
      return this.$store.state.user.businesscutid;
    },
    ...mapGetters({
      insq: "insq",
      userDefaultAddress: "userDefaultAddress",
      userInfo: "userInfo"
    })
  },
  mounted() {
    let _ = this;

    _.getGroupListData();

    if (_.$store.state.user.cutType) {
      _.confirmAdress = true; //弹框  确认收货地址
    }

    // _.cutBegain();
    // console.log(
    //   "..userDefaultAddress",
    //   _.userDefaultAddress,
    //   _.itemsCloseItem,
    //   "kk"
    // );
    const alert = () => {
      MessageBox({
        title: "更新提示",
        message:
          "砍价现已全新改版！1分钱直接领！更新到最新版本斗牛App即可参与！",
        closeOnClickModal: false,
        confirmButtonText: "立即下载"
      }).then(act => {
        _.openAppClient();
      });
    };
  },
  methods: {
    getGroupListDataLoad() {
      this.pagination.pageindex = 1;
      this.pagination.pagesize = 5;
      this.groupBuyList = [];
      this.getGroupListData();
    },
    loadmore() {
      if (this.css.isEnd === true) {
        this.toast("已无更多");
      } else {
        this.pagination.pageindex += 1;
        // if (this.pagination.pageindex > 1) {
        //   this.pagination.hasLoad = false;
        // }
        this.getGroupListData();
      }
    },
    getGroupListData() {
      if (this.css.isLoading) return;
      this.css.isLoading = true;
      // this.isEnd = true;
      let postParams = {
        page: this.pagination.pageindex,
        size: this.pagination.pagesize
      };
      if (postParams.page === 1) {
        this.css.isEnd = false;

        window.scrollTo(0, 0);
      }
      console.log("获取团购列表参数: ", postParams, this.pagination.hasLoad);
      // console.log("助力列表数据", this.groupBuyList);
      let GetCutProductListApi = this.userInfo.token
        ? GetCutProductList
        : GetCutProductListOpen;
      GetCutProductListApi(postParams, this.pagination.hasLoad)
        .then(res => {
          if (res && res.total && res.list.length > 0) {
            this.groupBuyList.push(...res.list);
            // console.log("助力列表数据", this.groupBuyList.length);
            // 微信分享
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
            // else if (this.$root.ISWX) {

            // }
            this.css.hasData = true;

            if (
              res.page * res.size >= res.total &&
              this.groupBuyList.length != 1
            )
              this.css.isEnd = true;
          } else {
            this.css.isEnd = true;
            if (this.groupBuyList.length == 0) {
              this.css.hasData = false;
            }
            //
          }
          this.css.isLoading = false;
        })
        .catch(e => {
          console.error(e);

          this.css.isLoading = false;
          this.css.hasData = false;
          // this.toast(e && e.msg ? e.msg : ('error:' + e))
        });
    },
    productDetail(id) {
      if (this.$root.ISAPP) {
        // 跳app商品详情
        let appinteractionproductDetail = {
          name: "gotoAppProductDetailPage",
          params: { productid: id }
        };
        this.javascriptBridge(appinteractionproductDetail);
      } else {
        this.$router.push("/productDetail/" + id);
      }
    },
    cutBegain() {
      //  alert(this.cutid)
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
          businesscutid: this.businesscutid,
          productitemid: this.itemsCloseItem.productitemid,
          productname: this.itemsCloseItem.productname
        };
        StartCut(option)
          .then(res => {
            if (res.flag) {
              localStorage.removeItem("helphand");
              this.$store.state.user.cutid = res.cutuserid;
              this.$store.state.user.cutType = false;
              this.$store.state.user.cutToastShare = true; // 进助力详情弹出分享
              this.confirmAdress = false;
              this.$router.push("/helpbargain/helpdetail/" + res.cutuserid);
              // this.goBarGainDetail()
            } else {
              this.cutText = "助力失败,<br>去看看其他商品吧~";
              this.modelBgClassBG = "cutFail";
              this.showBtn = 1;
              this.cutGoingFail = true;
              this.$store.state.user.cutType = false;
              this.confirmAdress = false;
            }
          })
          .catch(err => {
            console.error(err, "err");
            this.cutText = "助力失败,<br>去看看其他商品吧~";
            this.modelBgClassBG = "cutFail";
            this.showBtn = 1;
            this.cutGoingFail = true;
            this.$store.state.user.cutType = false;
            this.confirmAdress = false;
          });
      }
    },
    // 颜色规格回传
    itemsClose(item) {
      console.log("item", item);
      sessionStorage.removeItem("cuttype");
      this.css.showItems = false;
      // document.body.style.overflow = "visible";
      let that = this;
      // document.body.classList.remove('lock')
      document.body.style.overflow = "auto";
      window.removeEventListener("touchmove", that._preventDefault);
      // this.$router.push("/helpbargain/helpdetail/")
      if (item) {
        localStorage.setItem("helphand", JSON.stringify(item));
        this.$router.push({
          path: "/user/address",
          query: { cutType: 1 }
        });
      }
    },
    getProductOptions(groupItem) {
      // isjoin false 不能参加 ture 可以参加
      // cutgoing进行中  cutOver活动结束 cutFail助理失败 cutorderPass订单超过有效时间 cutSuccess好人缘报账 cutNewpeople新人
      // this.$router.push("/login");
      //  this.javascriptBridge(callAppLoginPageParams);
      // this.$store.dispatch("setUserInfo", res);
      // !this.userInfo
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

      this.$store.state.user.businesscutid = groupItem.id;
      this.$store.state.user.cutid = groupItem.cutid;
      console.log(groupItem, "id");
      if (
        !groupItem.isjoin &&
        groupItem.usercutstatus != 0 &&
        groupItem.usercutstatus != 4
      ) {
        // this.cutGoing = true;
        switch (groupItem.usercutstatus) {
          case 1:
            this.cutText = " 当前商品正在助力中,<br>快去邀请更多好友来助力吧!";
            this.modelBgClassBG = "cutgoing";
            this.showBtn = 2;
            break;
          case 2:
            this.cutText = "当前商品您有待付款订单,<br>请先完成支付!";
            this.modelBgClassBG = "gotopay";
            this.showBtn = 6;
            break;
          case 3:
            this.cutText =
              "好人缘爆棚,<br>您已经达到该商品助力的巅峰值,<br>快去看看其他商品吧!";
            this.modelBgClassBG = "cutSuccess";
            this.showBtn = 1;
            break;
          case 5:
            this.cutText = "来晚啦,助力活动已结束,<br>快去看看其他商品吧!";
            this.modelBgClassBG = "cutOver";
            this.showBtn = 1;
            break;
        }

        this.cutGoingFail = true;
      } else {
        // alert(groupItem.productid)
        sessionStorage.setItem("cuttype", 1);
        NewDetail(groupItem.productid)
          .then(res => {
            // console.log("颜色规格：zs", res);
            let that = this;
            this.css.showItems = true;
            document.body.style.overflow = "hidden";
            window.addEventListener("touchmove", that._preventDefault);
            // document.body.classList.add('lock')
            this.productInfoGroupItems = res;
          })
          .catch(e => {
            this.toast("服务器错误");
            console.error(e);
          });
      }
    },
    _preventDefault(e) {
      e.preventDefault();
    },
    goBarGainDetail() {
      // 继续助力
      this.$router.push("/helpbargain/helpdetail/");
    },
    close(type) {
      this.$store.state.user.cutToastShare = true; // 进助力详情弹出分享
      if (type === 2) {
        this.$router.push(
          "/helpbargain/helpdetail/" + this.$store.state.user.cutid
        );
      } else if (type == 6) {
        this.$store.state.user.cutToastShare = false; // 进助力详情弹出分享
        this.$router.push(
          "/helpbargain/helpdetail/" + this.$store.state.user.cutid
        );
      }

      this.$store.state.user.cutType = false;
      this.cutGoingFail = false;
      this.confirmAdress = false;
    }
  }
};
</script>
<style scoped>
/* .puzzle {
  min-height: 90vh;
} */
.main {
  padding-bottom: 60px;
}
/* .cutGoing-enter-active,
.cutGoing-leave-active {
  transition: opacity 0.3s;
}
.cutGoing-enter,
.cutGoing-leave-to {
  opacity: 0;
} */
/* .cutAddress-enter-active,
.cutAddress-leave-active {
  transition: opacity 0.3s;
}
.cutAddress-enter,
.cutAddress-leave-to {
  opacity: 0;
}
.cutAddress {
  position: fixed;
  left: 0;
  width: 100%;
  bottom: 0;
  background: #fff;
  z-index: 103;
  text-align: center;
} */
.cutAddress .title,
.confirmAdress .title {
  text-align: center;
  margin-bottom: -20px;
  margin-top: 20px;
}
.confirmAdress .title {
  margin: 20px;
  font-size: 17px;
}
.addressName,
.dizhi {
  color: #666;
  font-size: 14px;
  padding-left: 20px;
  line-height: 24px;
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
/* .cutinfo {
  width: 275px;
  height: 280px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: url("/static/img/cutgoing.png") 0 0 no-repeat;
  background-size: 100% 100%;
  text-align: center;
  font-size: 14px;
  color: #333;
  border-radius: 10px;
  z-index: 102;
  line-height: 25px;
}
.cutinfo .cut_name {
  margin-top: 145px;
} */
.cutinfo .cut_btn,
.confirmAdress .cut_btn {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.cutinfo .cut_btn span,
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
.cutinfo .cut_btn span:nth-child(1),
.confirmAdress .cut_btn span:nth-child(1) {
  color: #999;
  background: none;
  border: 1px solid #ccc;
}
/* .cutinfo .cut_btn.goto span {
  width: 100%;
  background: #ffc700;
  color: #333;
  border: 1px solid #ffc700;
} */
.no_cut {
  position: relative;
  width: 80%;
  height: 0;
  left: 10%;
  text-align: center;
  padding-top: 60%;
  background: url("/static/img/cutdefaultbg.png") 0 0 no-repeat;
  background-size: 100% auto;
  text-align: center;
}
.no_cut span {
  /* position: absolute;
  bottom: -30px;
  left: 10px; */
}
.group_product_list {
  padding: 0 5px;
  overflow: hidden;
  font-family: PingFangSC-Regular;
}
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.productItem {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  box-sizing: border-box;
  padding: 5px;
  background: #fff;
  box-shadow: 0px 0px 5px #ccc;
  margin: 5px;
  margin-bottom: 15px;
  border-radius: 5px;
  width: 97%;
  /* padding-bottom: 0; */
}
.productItem .ImgWrap {
  position: relative;
  width: 35%;
  /* padding-bottom: 26%; */
  padding-bottom: 35%;
  overflow: hidden;
}
.ImgWrap img {
  width: 100%;
  /* height: 100%; */
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.productItem .textWrap {
  padding: 10px 0px 10px 20px;
  width: 50%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}
.productItem .textWrap .product_names {
  width: 100%;
}
.productItem .textWrap .product_names > p {
  /* margin: 3px 0px; */
  text-align: left;
  /* line-height: 1rem; */
  /* height: 1rem; */
  font-size: 13px;
  color: #333;
}
/* .productItem .textWrap .product_names > p.pin{
  font-size: 10px;
  color: #666;
} */
.product_name {
  counter-reset: #666;
}
.productItem .textWrap p.business_name,
.productItem .textWrap p.pin {
  color: #666;
  font-size: 10px;
}
.productItem .textWrap p.product_price {
  font-size: 22px;
  /* line-height: 24px; */
  margin: 5px 0;
}
.productItem .textWrap p.pin {
  margin-top: 10px;
}
.gototuan {
  position: relative;
  /* overflow: hidden; */
  width: 28%;
}
.gototuan .goContent {
  position: absolute;
  bottom: 15px;
  top: auto;
}
.gototuan span {
  background: #ffc700;
  font-size: 12px;
  color: #333333;
  padding: 5px 7px;
  border-radius: 3px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}
</style>



