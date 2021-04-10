<template>
  <div style="padding-bottom:20px;">
    <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3>出售中</h3>
      </div>
    </v-header>
    <!-- <div class="alerm-box flex-tops" v-show="statusVal != 1&&statusVal != 4">
      <div class="alerm">
        <img src="/static/img/alerm.png">账户冻结中，商品将不再被人购买
      </div>
      <div class="alerm-rid" v-if="statusVal == 2" @click="contactService() ">联系客服解冻</div>
      <div class="alerm-rid" v-else-if="statusVal == 3" @click="goShoppayinback()">点此补缴保证金</div>
    </div> -->
    <v-cutlist :more-handle="loadmore" :more-handling="css.isLoading" :isend="css.isEnd" v-if="css.hasData">
      <div class="sellingdetaillist">
        <div class="productwrap">
          <div class="flex-between productorder" @click.stop="goDetail()">
            <div class="productimg">
              <img :src="productimgurl" alt>
            </div>
            <div class="productinfo flex-col">
              <div class="productname">{{productname}} {{productcolor}}</div>
            </div>
          </div>
        </div>
        <div v-for="(item,ind) in detaillist" :key="ind">
          <div class="productwrap">
            <div
              class="colorsize flex-between flex-wrap"
              @click.stop="goSellingDetail(item.sneakerssalesid)"
            >
              <div>
                {{item.producttype==22?(item.color+item.productsize):(item.productsize+'码')}}, 数量X{{item.count}}
                <span class="ispresell" v-if="item.isadvancesale">预售</span>
                <!-- <div>{{item.productsize}}码, 数量X{{item.count}} -->
                <div class="paying" :class="statusVal == 1&&statusVal != 4 ? '':'unable'" v-show="!!item.payingnum">付款中
                  <div v-show="item.count>1" class="pay-mount">x {{item.payingnum}}</div>
                </div>
              </div>
              <div
                :class="(statusVal == 1 || statusVal == 4)&&item.isRed ?'newproductprice':'productprice'"
              >￥{{item.payprice|tofixed}}</div>
            </div>

            <div class="flex-between flex-wrap">
              <div
                :class="statusVal != 1&&statusVal != 4 ? 'lowprice unable ':(item.isRed?'newlowprice':'lowprice')"
              >当前最低出价 ￥ {{item.lowestprice||item.advancesaleprice}}</div>
              <div class="flex-end">
                <div
                  class="nosale flex-center"
                  :class="statusVal != 1&&statusVal != 4 ? 'unable':''"
                  @click.stop="model(item,1)"
                >我不卖了</div>
                <div
                  class="flex-center"
                  :class="(statusVal != 1&&statusVal != 4 || item.count == item.payingnum)? 'nosale unable':(item.isRed?'newprice':'nosale')"
                  @click.stop="newPrice(item)"
                >重新出价</div>
                <!-- <div class="nosale yelloeColor flex-center" @click.stop="model(item,3)" v-if="$root.ISWX">喊人来买</div>       -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-cutlist>
    <!-- 缺省状态 -->
    <div v-else class="default">
      <img :src="defaultMessageImgUrl" alt>
      您暂无出售中商品哦~
      <div class="gosell" @click.stop="gosell">去出售</div>
    </div>
    <div class="h5share" v-if="css.h5share" @click.stop="close">
      <img src="/static/img/h5shareIcon.png" alt>
      <img src="/static/img/h5shareiconknow.png" alt>
    </div>
  </div>
</template>
<script>
import { businessProcessSellDetail } from "../../../common/api/snekc2c.js";
import { mapGetters } from "vuex";
import { ProductDetails } from "../../../common/api/sneaker";
import { lowerFrame } from "../../../common/api/snekc2c.js";
import { DateDiff, _getDate } from "../../../common/util";
import { QiyuProd } from "./../../../common/api/WyQiyu";
export default {
  data() {
    return {
      css: {
        isLoading: false,
        isEnd: false,
        hasData: true,
        sellingdetaillist: [],
        h5share: false
      },
      pagination: {
        sumcount: 0,
        pagesize: 20,
        pageindex: 1,
        hasLoad: true
      },
      defaultMessage: "",
      defaultMessageImgUrl: "/static/img/salepage_image_empty.png", //  /static/img/page_image_empty.png
      activeindex: 0,
      detaillist: [],
      productid: "",
      productimgurl: "",
      productname: "",
      productcolor: "",
      lowerprice: true,
      itemInfo: {},
      statusVal: 1, //账户状态  1-正常,2-售假冻结,3-保证金不足冻结
      minprice: 100, // 判断重新出价最低可出价
      isadvancesale: 0, // 预售商品 0-否,1-是
      advancesaleprice: 0 ,// 预售商品最低价
      proisadvancesale: 0 // 属否是预售出价
    };
  },
  components: {},
  computed: {
    ...mapGetters({
      shopType: "shopType",
      userInfo: "userInfo"
    })
  },
  mounted() {
    let id = this.$route.query.id;
    let imgurl = this.$route.query.url;
    let name = this.$route.query.name;
    let color = this.$route.query.color;
    this.proisadvancesale = this.$route.query.isadvanceproduct;
    this.productid = id;
    this.productimgurl = imgurl;
    this.productname = name;
    this.productcolor = color;
    this.activeindex = this.shopType;
    console.log("shoptype c2c订单类型标识", this.shopType);
    this.sneakerListDataLoad();
    this.getProductDetail(id);
  },
  methods: {
    loadmore() {
      if (this.css.isEnd === true) {
        this.toast("已无更多");
      } else {
        this.pagination.pageindex += 1;
        this.sneakerListDataLoad();
      }
    },
    gosell() {
      this.$router.push("/");
    },
    sneakerListDataLoad() {
      if (this.css.isLoading) return;
      this.css.isLoading = true;
      // this.isEnd = true;
      let postParams = {
        productid: this.productid,
        page: this.pagination.pageindex,
        size: this.pagination.pagesize
      };
      if (postParams.page === 1) {
        this.css.isEnd = false;

        window.scrollTo(0, 0);
      }
      console.log("获取团购列表参数: ", postParams, this.pagination.hasLoad);

      businessProcessSellDetail(postParams)
        .then(res => {
          console.log("sellingdetail", res);
          // this.statusVal = 2
          this.statusVal = res.status;
          this.minprice = res.minprice;
          if (res && res.total && res.list.length > 0) {
            this.detaillist = res.list.map(i => {
              if (i.payprice > i.lowestprice) {
                i.isRed = true;
              } else {
                i.isRed = false;
              }
              return i;
            });
            this.css.hasData = true;

            if (
              postParams.page * res.size >= res.total &&
              this.detaillist.length != 1
            )
              this.css.isEnd = true;
          } else {
            this.css.isEnd = true;
            if (this.detaillist.length == 0) {
              this.css.hasData = false;
            }
          }
          this.css.isLoading = false;
        })
        .catch(e => {
          console.error(e);
          this.css.isLoading = false;
          this.css.hasData = false;
        });
    },
    close() {
      this.h5share = false;
    },
    goDetail() {
      this.$router.push(`../../sneaker/detail/${this.productid}`);
    },
    goSellingDetail(sneakerssalesid) {
      if (this.statusVal != 1 && this.statusVal != 4) return;
      this.$router.push("/shoporderdetail/" + sneakerssalesid);
    },
    model(item, type) {
      if (this.statusVal != 1 && this.statusVal != 4) return;
      let option = {
        title: "",
        okText: "我再想想",
        cancelText: "确定",
        confirmButtonClass: "confirm",
        cancelButtonClass: "cancel",
        msg: "商品出售信息将从平台上删除,<br>用户和自己将不再看到。",
        cancel: () => {
          // this.toast("删除成功");
          // @params  sneakerssalesid  status 1: 正在出售, 2: 等待付款（个人卖），3：下架
          let option = {
            sneakerssalesid: item.sneakerssalesid,
            status: 3
          };
          lowerFrame(option) // 我不卖了
            .then(res => {
              this.toast(res.message);
              this.detaillist = [];
              this.sneakerListDataLoad(); // 删除成功 重新调一下接口
            })
            .catch(err => {
              this.toast(err.msg);
              console.error(err);
            });
        }
      };
      if (type == 1) {
        this.confirm(option);
      } else if (type === 3) {
        if (this.$root.ISWX) {
          this.h5share = true;
          this.initShare({
            detaillist: {
              title: item.shareinfo.title,
              img: item.shareinfo.icon + "!c30",
              desc: item.shareinfo.content,
              url: item.shareinfo.url
            }
          });
        } else {
          this.toast("快去分享给好友吧~");
        }
      } else if (type === 2) {
        this.$router.push("/logistics/" + item.sneakerssalesid + "/1"); // 1 是卖家 2 买家
      }
    },
    getProductDetail(id) {
      // var productid = this.$route. params.id
      let _ = this;

      ProductDetails({
        productid: id
      })
        .then(res => {
          console.log("商品详情", res);
          if (res) {
            // this.itemInfo.brandsizeid: "9QumNz68"
            // this.itemInfo.color = res.color;
            this.itemInfo.expresstemplateid = res.expresstemplateid;
            // this.itemInfo.lowestprice = 100
            // this.itemInfo.mainpic = "http://files.eyee.com/Shop/system/main/72809f70b95b45eaa2db4cc8c9f4a64c.jpg"
            // this.itemInfo.maxprice: 700
            // this.itemInfo.price: 158
            // this.itemInfo.productid = "5yQK0w1o"
            // this.itemInfo.productname = " PUMA Basket Heart 缎带蝴蝶结女板鞋 "
            // this.itemInfo.saleid: "Gcfj599C"
            // this.itemInfo.size = "36.5"
            // this.itemInfo.type = 2

            // _.hasdata = 1;
            // _.productInfo = res;
            // _.img360 = ((res.imgs && res.imgs[1]) || "")
            //   .split(",")
            //   .filter(item => !!item);
            // _.swItem = ((res.imgs && res.imgs[3]) || "")
            //   .split(",")
            //   .filter(item => !!item);
            // res.description+=`<link rel="stylesheet" type="text/css" href="${res.cssurl}" />`
            // _.description = res.description;
            // _.moreCommodity(res.productid);
            // _.$nextTick(() => {
            //   // 获取物流
            //   if (res && res.expresstemplateid) {
            //     _.getExpress(res.expresstemplateid);
            //   }
            // });
            // if (res.share) {
            //   setTimeout(() => {
            //     this.initShare({
            //       info: {
            //         title: res.share.title,
            //         desc: res.share.content,
            //         img: res.share.icon,
            //         url: res.share.url
            //       }
            //     });
            //   }, 1000);
            // }
          }
        })
        .catch(e => {
          _.hasdata = 2;
          _.nodataMsg =
            e.code == 1511900 ? "商品已下架～" : "加载失败：异常商品～";
          _.toast(_.nodataMsg);
          console.error("商品详情异常", e);
        });
    },
    newPrice(i) {
      if (this.statusVal != 1 && this.statusVal != 4) return;
      if (i.count == i.payingnum) {
        this.toast("出售中，暂不能重新出价");
        return;
      }
      console.log("重新出价参数", i);
      this.itemInfo.color = i.color||this.productcolor;
      // this.itemInfo.lowestprice = this.minprice;
      this.itemInfo.mainpic = this.productimgurl;
      this.itemInfo.maxprice = i.maxprice;
      this.itemInfo.price = i.payprice
      this.itemInfo.sku = i.sku
      this.itemInfo.producttype = i.producttype;
      this.itemInfo.productid = this.productid;
      this.itemInfo.productname = this.productname;
      this.itemInfo.saleid = i.sneakerssalesid;
      this.itemInfo.size = i.productsize;
      this.itemInfo.count = i.count - i.payingnum;
      this.itemInfo.type = 2;
      this.itemInfo.brandsizeid = i.brandsizeid;
      this.itemInfo.proisadvancesale = this.proisadvancesale;
      this.itemInfo.isadvancesale = i.isadvancesale;     //isadvancesale":int#卖家发布商品类型 0-现货,1-预售
      this.itemInfo.lowestprice = i.productminprice || i.lowestprice ||_.minprice;
      this.itemInfo.advancesaleprice = i.advancesaleprice;
      this.itemInfo.isReoffer = true; //  判断出售的类型  true:重新出价   false：首次出价
      this.$store.dispatch("addSaleSneakInfo", { ...this.itemInfo });
      console.log("proisadvancesale", this.itemInfo)
      this.$router.push("/sneaker/sell/3");
      
    },
    contactService() {
      QiyuProd.call(this)
      console.log("打开客服");
    },
    goShoppayinback() {
      this.$router.push(`shoppay/1`);
    }
  }
};
</script>
<style scoped>
.tab {
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 10px;
}
.tab span {
  font-size: 14px;
  color: #999;
  line-height: 28px;
  position: relative;
  /* border-bottom: 2px solid #fff; */
}
.tab span.active {
  color: #333;
  font-weight: bold;
  /* border-bottom: 2px solid #333; */
}
.tab span.active::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  background: #333;
  bottom: -3px;
  left: 0;
}
.default {
  text-align: center;
  font-size: 16px;
  color: #333;
}
.default img {
  width: 60%;
  margin: 0 auto;
  display: block;
  margin-top: 44vw;
  margin-bottom: 15px;
}
.gosell {
  position: fixed;
  width: 80%;
  left: 10%;
  bottom: 21vw;
  text-align: center;
  background: #333;
  color: #fff;
  line-height: 44px;
  height: 44px;
  border-radius: 5px;
}
img {
  width: 100%;
  height: auto;
}
/* .morelist-enter-active,
.morelist-leave-active {
  transition: all 0.3s;
  opacity: 0;
  transform: translateY(20px);
}
.morelist-enter,
.morelist-leave-to {
  transform: translateY(-20px);
  opacity: 1;
} */
.productwrap {
  margin: 15px;
  box-shadow: 0 0 5px #ccc;
  border-radius: 5px;
  /* margin-bottom: 0; */
}
.salestatus {
  font-size: 13px;
  color: #333;
  line-height: 40px;
  border-bottom: 1px solid #f5f5f5;
  padding-left: 40px;
  position: relative;
}
.salestatus em {
  position: absolute;
  width: 17px;
  height: 17px;
  left: 15px;
  top: 11px;
  background: url("//files.eyee.com/mcdn/static/img/order-service-exchange.png") 0 0 no-repeat;
  background-size: 100% auto;
}
.productorder {
  padding: 15px;
}
.productimg {
  width: 18.7%;
}
.productimg img {
  display: block;
}
.productinfo {
  width: 80%;
  margin-left: 3%;
  font-size: 12px;
  margin-top: 0px;
}
.productinfo .productname {
  line-height: 20px;
}
.productprice {
  font-size: 16px;
  color: #333;
  /* padding-top: 10px; */
  font-weight: bold;
  /* line-height: 24px; */
}
.newproductprice {
  font-size: 16px;
  color: #eb5b6c;
  /* padding-top: 10px; */
  font-weight: bold;
  /* line-height: 24px; */
}
.paddtop {
  padding-top: 15px;
}
.colorsize {
  font-size: 12px;
  color: #333;
  padding-left: 5px;
  line-height: 16px;
  /* box-shadow: 0 3px 4px #ccc; */
  border-bottom: 1px solid #f7f7f7;
  border-top: 1px solid #f7f7f7;
  padding: 15px;
  /* border-radius: 5px; */
}
.ispresell {
  background: rgba(245, 245, 245, 1);
  font-size: 9px;
  color: rgba(153, 153, 153, 1);
  line-height: 1.7333vw;
  margin-left: 2vw;
  padding: 3px;
  text-align: center;
}

/* .nomargin {
  margin: 0;
  box-shadow: 0 3px 4px #ccc;
} */
.nosale {
  padding: 0 10px;
  line-height: 26px;
  /* width: 75px; */
  text-align: center;
  height: 26px;
  margin: 15px 15px 15px 0;
  font-size: 12px;
  color: #666;
  border: 1px solid #999;
  border-radius: 3px;
}
.newprice {
  padding: 0 10px;
  line-height: 26px;
  /* width: 75px; */
  text-align: center;
  height: 26px;
  margin: 15px 15px 15px 0;
  font-size: 12px;
  color: #fff;
  border: 1px solid #ffc700;
  background-color: #ffc700;
  border-radius: 3px;
}
.shipped {
  color: #eb3e3e;
  /* height: 26px; */
  padding: 15px;
  border-bottom: 1px solid #f7f7f7;
  font-size: 12px;
  text-align: right;
}
.toastColor {
  color: #eb3e3e;
  border: 0;
  padding-right: 0;
  position: relative;
}
.toastColor::before {
  content: "";
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1px solid #eb3e3e;
  left: -10px;
  top: 7px;
}
.toastColor::after {
  content: "";
  position: absolute;
  height: 5px;
  width: 5px;
  left: -5px;
  top: 10px;
  border-left: 1px solid #eb3e3e;
  border-bottom: 1px solid #eb3e3e;
}
.toastColor span {
  display: inline-block;
  width: 50px;
  padding-right: 15px;
  font-weight: bold;
  font-family: "PingFang";
}
.yelloeColor {
  color: #ffc700;
  border-color: #ffc700;
}
/* .shadownone,
.shadowntwo {
  width: 85%;
  background: #f5f5f5;
  height: 20px;
  margin: 0 auto;
  position: relative;
  z-index: -1;
  border-radius: 3px;
  box-shadow: 0 0 5px #ccc;
}
.shadowntwo {
  width: 80%;
  z-index: -2;
} */
.lookmore {
  width: 100%;
  text-align: center;
  /* padding: 25px;
  padding-bottom: 10px; */
  font-size: 12px;
  color: #333;
}
.lookmore img {
  width: 20px;
  height: auto;
  display: block;
  margin: 0 auto;
}
.shouqi {
  /* padding: 15px; */
}
.h5share {
  position: fixed;
  text-align: right;
  width: 100vw;
  left: 0;
  bottom: 0;
  top: 0;
  padding-top: 50px;
  background: rgba(0, 0, 0, 0.5);
  padding-right: 6.1%;
  z-index: 105;
}
.h5share img {
  width: 50%;
}
.flex-wrap,
.flex-end {
  height: 12vw;
}
.paying {
  float: right;
  margin-left: 16px;
  color: #eb5b6c;
  font-size: 10px;
}
.pay-mount {
  float: right;
  margin-left: 6px;
  line-height: 16px;
}
.newlowprice {
  margin-left: 15px;
  color: #eb5b6c;
  font-size: 10px;
}
.lowprice {
  margin-left: 15px;
  color: #666;
  font-size: 10px;
}
.alerm-box {
  padding: 8px 15px 0 15px;
}
.alerm {
  font-size: 12px;
  color: #ef0000;
}
.alerm img {
  margin-right: 5px;
  height: 15px;
  width: 16px;
  transform: translate(0, 2.6px);
}
.alerm-rid {
  padding: 2px 0 0 25px;
  font-size: 12px;
  color: #ffc700;
  text-decoration: underline;
}
.unable {
  color: #999;
}
</style>


