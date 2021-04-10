<template>
  <div class="main" v-if="hasdata == 1">
    <v-header class="nav" v-if="!$root.ISAPP && !insq">
      <div class="nav-tab2 ellipsis" style="font-size: 12px">商品详情</div>
      <img :src="showLike ? like2 : like1" class="collect" @click="pop" />
    </v-header>
    <div class="product_notice" v-show="productRecordList.length > 0">
      <ul :class="{ product_notice_list: animate == true }">
        <li
          class="product_notice_item"
          v-for="(item, index) in productRecordList"
          :key="index"
        >
          <img class="product_notice_img" v-lazy="https(item.headimgurl)" alt />
          {{ item.content }} {{ item.time | dateDiffFormat }}
        </li>
      </ul>
    </div>
    <!-- 商品图 -->
    <div class="product_sw">
      <swiper :options="prodSwiOption" class="product_sw" ref="swiperBanner">
        <swiper-slide v-for="(item, index) in calc.imgs" :key="index">
          <img v-lazy="https(item)" :alt="item" />
        </swiper-slide>

        <div class="swiper-scrollbar" slot="scrollbar"></div>
      </swiper>

      <img
        src="/static/img/360.png"
        class="around"
        @click="switchAround"
        v-if="img360 && img360.length > 0"
      />
    </div>

    <!-- 服饰颜色 -->
    <div class="flex-aic skcs" v-if="hasSkc">
      <span>{{ realInfo.clothesimgs.length }}色可选</span>
      <div class="skc-cells">
        <template v-for="(cI, cIdx) in realInfo.clothesimgs">
          <img
            :class="{ act: selectSkc.colorid == cI.colorid }"
            v-lazy="https(cI.imgs[0])"
            alt
            :key="'skcImg' + cIdx"
            @click="toggleSkc(cIdx)"
          />
        </template>
      </div>
    </div>
    <!-- 服饰和球鞋收藏 -->
    <CollectSave
      @closeSave="closeSave"
      :cssShowPop="cssShowPop"
      :productid="realInfo.productid"
      :productname="realInfo.productname"
      :isShowSaveModel="isShowSaveModel"
    ></CollectSave>
    <!-- 价格描述部分 -->
    <div class="gaps" v-if="realInfo">
      <div class="info-price font-price">
        <!-- <span class="info-saleprice" v-if="realInfo.saleprice">¥{{realInfo.saleprice.toFixed(2)}}</span>
        <span class="info-saleprice" v-else>¥ — —</span>-->
        <span class="info-saleprice">¥{{ calc.saleprice || " — —" }}</span>
      </div>

      <div class="product_name">
        <section>{{ realInfo.productname }}</section>
        <section class="clearfix">
          <span class="send">发货地：{{ realInfo.sendplace }}</span>
          <span>
            运费 :
            <span v-if="realInfo.destination"
              >至{{ realInfo.destination }}</span
            >
            ¥{{ realInfo.expressfee && realInfo.expressfee.toFixed(2) }} 元
          </span>
          <span>
            <span
              v-if="productInfo.isglobal && productInfo.isoverseas !== 'false'"
              class="isglobalpurchase"
              >海外直邮</span
            >

            <span
              class="isglobalpurchase"
              v-if="productInfo.isglobal && productInfo.isoverseas === 'false'"
              >国内现货</span
            >
          </span>
        </section>
      </div>
    </div>

    <div class="product_trade" @click="goInstruction">
      <!-- <p>
        <img class="product_trade_img" src="../../../static/img/sneaker/product_quality.png" alt>正品保障
      </p>
      <p class="p_second">
        <img class="product_trade_img" src="../../../static/img/sneaker/prodect_check.png" alt>逐一查验
      </p>
      <p>
        <img class="product_trade_img" src="../../../static/img/sneaker/prodect_disting.png" alt>多重鉴定
      </p>
      <p @click="goInstruction">></p>-->
      <img src="/static/imgs/search/clickable.png" alt />
    </div>
    <div
      class="product_logo gaps"
      v-if="realInfo && realInfo.logourl"
      @click.stop="goSearch(realInfo.brandname, realInfo.brandid)"
    >
      <div class="logo_img">
        <img v-lazy="https(realInfo.logourl)" alt />
      </div>
      <p v-if="realInfo.summary">{{ realInfo.summary }}</p>
    </div>

    <!-- 相关商品 -->
    <div class="about" v-if="aboutList && aboutList.length > 0">
      <div class="about-title">
        <span>相关商品</span>
        <span @click="goMore">查看更多 ></span>
      </div>

      <div class="about-commodity">
        <div
          class="about-commodity-item font-price"
          v-for="(item, index) in aboutList"
          :key="index"
          @click="goDetail(item.productid)"
        >
          <div class="flex-center" style="width: 100%; height: 29.3333vw">
            <img v-lazy="https(item.productimgurl)" />
          </div>
          <span class="ellipsis" style="margin-top: 2.6667vw">{{
            item.productname
          }}</span>
          <span>{{
            (item.productprice && item.productprice.toFixed(2)) || "¥ — —"
          }}</span>
        </div>
      </div>
    </div>

    <div class="commodity-info flex-wrap">
      <span>
        <span>配送&emsp;</span>
        <img
          src="/static/img/sneaker/details_icon.png"
          style="
            width: 3.4667vw;
            height: 3.4667vw;
            position: relative;
            top: 0.5vw;
          "
        />
        <span>{{ realInfo.name }}</span>
      </span>
      <span>发售日期 {{ realInfo.starttime }}</span>
      <span v-if="!isExt">配色 {{ realInfo.color }}</span>
      <span>发售价格 ¥{{ realInfo.marketprice }} 仅供参考</span>
      <span v-if="!isExt">货号 {{ realInfo.sku }}</span>
      <span v-if="!isExt">不支持7天无理由退换货</span>
    </div>

    <div class="commodity-details">
      <div class="table">
        <h6 style="font-size: 14px; margin-top: 20px">商品详情</h6>
        <template v-if="!isExt">
          <div
            class="table-list"
            v-for="(table, tableIndex) in realInfo.sizeinfo"
            :key="tableIndex"
          >
            <div class="table-title flex-center">{{ table.title }}</div>
            <table>
              <tr>
                <th v-for="(head, headIndex) in table.head" :key="headIndex">
                  {{ head }}
                </th>
              </tr>

              <tr v-for="(body, bodyIndex) in table.size" :key="bodyIndex">
                <td
                  v-for="(bodyItem, bodyItemIndex) in body"
                  :key="bodyItemIndex"
                >
                  {{ bodyItem }}
                </td>
              </tr>
            </table>
          </div>
        </template>
      </div>

      <div class="details" v-html="description" ref="description"></div>
    </div>

    <div class="fix-btm fix-footer">
      <loader class="load" from="0" ref="load" useConfirm>
        <span class="sale flex-center">出售</span>
      </loader>
      <span class="buy flex-center" @click="showItem(1)">立即购买</span>
    </div>

    <items
      :show="css.showItem"
      :product-info="realInfo"
      :select-color="selectSkc.colorid"
      @close="itemsClose"
      :type="type"
    ></items>

    <div
      class="around-img"
      @touchmove="changeAround"
      v-show="css.showAround"
      @click="switchAround"
    >
      <div class="around-bg">
        <img
          v-for="(item, index) in img360"
          :key="index"
          v-lazy="https(item)"
          :class="{ 'show-around-img': index === css.aroundIndex }"
          class="around-img-item"
        />
        <img src="/static/img/finger.png" class="finger" />
      </div>
    </div>
    <model confirmText="联系客服" @confirm="QiyuProd" v-show="showmodel == 2">
      <img
        class="close_btn"
        src="/static/img/gray_close.png"
        @click="close()"
      />
      <div class="model-content">
        <p>您的账户目前处于冻结状态，退出入驻请联系客服。</p>
      </div>
    </model>
    <model
      confirmText="立即补缴"
      @confirm="goShoppayinback()"
      v-show="showmodel == 1"
    >
      <!-- <model confirmText="立即补缴" @confirm="goShoppayinback()"> -->
      <img class="close_btn" src="/static/img/gray_close.png" @click="close()" />
      <div class="model-content">
        <p class="model-title">保证金余额不足！</p>
        <div class="flex-between pledge-info">
          <p>{{ sellType == 0 ? "现货" : "预售" }}最低保证金金额</p>
          <p>
            ￥{{
              sellType == 0
                ? pledgemessage.lowpledge
                : pledgemessage.advancelowpledge
            }}
          </p>
        </div>
        <div class="flex-between pledge-info">
          <p>当前保证金金额</p>
          <p>￥{{ pledgemessage.nowpledge }}</p>
        </div>
        <div class="flex-between pledge-info">
          <p>需补缴</p>
          <p
            class="pay_color"
          >￥{{sellType==0?pledgemessage.paypledge:pledgemessage.advancepaypledge}}</p>
        </div>
      </div>
    </model>
  </div>
  <div v-else-if="hasdata == 2">
    <div class="no-data">
      <img src="//files.eyee.com/mcdn/static/img/no_product.png" alt />
      <p>{{nodataMsg}}</p>
    </div>
  </div>
</template>

<script>
import { DateDiff } from "../../common/util";
import { GetCouponInProduct } from "../../common/api/marketing";
import {
  ProductDetails,
  ProductDetailsLogin,
  LookMore,
  GetExpress,
  productRecord,
} from "../../common/api/sneaker";
import Items from "./Items";
import { mapGetters } from "vuex";
import Model from "./Model";
import CollectSave from "../templates/CollectSave";
import { QiyuProd } from "./../../common/api/WyQiyu";
import axios from "axios";
import { MD5 } from "../../common/util";
import { ActionReport } from "@/utils/api/base";
import { SetPoints } from "../../common/api/base";
import Loader from "@/comps/Loader";
// "producttype":21、鞋子 22、服装
const PT = {
  sneaker: 21,
  ext: 22,
};

export default {
  components: {
    Items,
    Model,
    CollectSave,
    Loader,
  },
  data() {
    return {
      animate: false,
      productRecordList: [],
      accountstatus: 0,
      showmodel: 0,
      pledgemessage: {},
      prodSwiOption: {
        autoplayDisableOnInteraction: false,
        pagination: ".swiper-pagination",
        roundLengths: true,
        preloadImages: true,
        updateOnImagesReady: true,
        scrollbar: ".swiper-scrollbar",
        scrollbarHide: false,
      },
      hasdata: 0,
      nodataMsg: "商品已下架～",
      productInfo: {},
      sneakerSizeColl: [],
      choosesize: [],
      showLike: 0,
      aboutList: [],
      disabled: true,
      css: {
        showItem: false,
        showAround: false,
        aroundIndex: 0,
        clientX: 0,
        showPop: false,
      },
      img360: "",
      type: 1, // 0 出售, 1 购买
      description: "",
      like1: "/static/img/d_like1.png",
      like2: "/static/img/d_like2.png",

      issearchclick: false,
      sellType: 0, // 0 现货, 1 预售

      selectSkc: {},

      cssShowPop: false,
      isShowSaveModel: false,
      url: "",
    };
  },
  filters: {
    dateDiffFormat(datetime, format = "yyyy.MM.dd") {
      let diff = DateDiff({ source: datetime });
      let result = "";
      if (diff) {
        if (diff.H >= 168) result = "7天前";
        else if (diff.H >= 24) result = `${Math.floor(diff.H / 24)}天前`;
        else {
          if (diff.H > 0) {
            result = diff.H + "小时前";
          } else {
            if (diff.m > 1) result = diff.m + "分钟前";
            else result = "刚刚";
          }
        }
      }
      return result;
    },
  },
  computed: {
    // 球鞋收藏
    haschoosesize() {
      return !!this.choosesize.length;
    },
    // 是否是扩品类
    isExt() {
      return this.productInfo.producttype == PT.ext;
    },
    realInfo() {
      let _ = this,
        info = this.productInfo;
      return info;
    },
    hasSkc() {
      let { realInfo: info, isExt } = this;
      return isExt && info.clothesimgs && info.clothesimgs.length > 0;
    },
    calc() {
      let { realInfo: info, selectSkc, isExt } = this,
        imgs = [],
        saleprice = "";
      if (info)
        if (isExt) {
          imgs = selectSkc.imgs;

          saleprice = selectSkc.lowestprice || "";
        } else {
          imgs = ((info.imgs && info.imgs[3]) || "")
            .split(",")
            .filter((i) => !!i);

          saleprice = info.saleprice || "";
        }
      return { imgs, saleprice };
    },
    swiperBanner() {
      return this.$refs.swiperBanner.swiper;
    },
    ...mapGetters({
      user: "userInfo",
      insq: "insq",
      userDefaultAddress: "userDefaultAddress",
    }),
  },
  beforeRouteEnter(to, from, next) {
    //sneaker/search
    // console.log("rrrrrrrrr", to, from);

    next((vm) => {
      if (/\/sneaker\/search/i.test(from.path)) vm.issearchclick = true;
    });
  },
  beforeRouteUpdate(to, from, next) {
    let _ = this,
      { id } = to.params;
    _.issearchclick = false;
    _.load(id);
    next();
  },
  mounted() {
    let { id } = this.$route.params;
    this.load(id);
    if (this.$root.isdebug) {
      this.url = "http://qzone.eyee.com/";
    } else {
      this.url = "https://m.eyee.com/";
    }
    $log({
      e: "productDetail",
      p: { productID: this.$route.params.id, type: "C2C" },
      t: 0,
      ext: 1,
    });
  },
  methods: {
    load(id) {
      let _ = this;
      // _.productid = id;
      if (_.user.token) {
        _.getProductDetailLogin(id);
      } else {
        _.getProductDetail(id);
      }
      _.getProductRecord(id);
      _.infoScroll();
    },
    toggleSkc(idx) {
      let _ = this,
        { selectSkc, realInfo: info } = _,
        curr = info.clothesimgs[idx];
      if (selectSkc.colorid == curr.colorid) return;
      _.selectSkc = curr;
      _.swiperBanner.slideTo(0);
    },
    closeSave(v) {
      if (v && v == 1) this.showLike = true;
      else this.showLike = false;
      this.isShowSaveModel = false;
      this.cssShowPop = false;
    },
    infoScroll() {
      this.scroll();
      setTimeout(() => {
        this.infoScroll();
      }, 3000);
    },
    scroll() {
      this.animate = true;
      setTimeout(() => {
        this.productRecordList.push(this.productRecordList[0]);
        this.productRecordList.shift();
        this.animate = false;
      }, 500);
    },
    getProductRecord(id) {
      productRecord({
        productid: id,
      })
        .then((res) => {
          if (res) {
            this.productRecordList = res;
          }
        })
        .catch((e) => {
          this.toast("加载失败");
        });
    },
    getProductDetail(id) {
      // var productid = this.$route. params.id
      let _ = this;

      ProductDetails({
        productid: id,
      })
        .then((res) => {
          console.log("商品详情", res);
          if (res) {
            _.hasdata = 1;

            _.dealInfo(res);
          } else {
            _.hasdata = 2;
            _.toast("商品不存在或已下架");
            // _.error = true
          }
        })
        .catch((e) => {
          _.hasdata = 2;
          _.nodataMsg =
            e.code == 1511900 ? "商品已下架～" : "加载失败：异常商品～";
          _.toast(_.nodataMsg);
          console.error("商品详情异常", e);
        });
    },
    getProductDetailLogin(id) {
      // var productid = this.$route. params.id
      let _ = this,
        { rq } = _.$route.query;

      ProductDetailsLogin({
        productid: id,
        issearchclick: _.issearchclick,
        requestid: rq,
      })
        .then((res) => {
          console.log("登录后商品详情", res);
          if (res) {
            _.hasdata = 1;

            _.dealInfo(res);
          } else {
            _.hasdata = 2;
            _.toast("商品不存在或已下架");
            // _.error = true
          }
        })
        .catch((e) => {
          _.hasdata = 2;
          _.nodataMsg =
            e.code == 1511900 ? "商品已下架～" : "加载失败：异常商品～";
          _.toast(_.nodataMsg);
          console.error("商品详情异常", e);
        });
    },
    dealInfo(res) {
      let _ = this,
        skc = {};

      if (res.share) {
        _.initShare({
          info: {
            title: res.share.title,
            desc: res.share.content,
            img: res.share.icon,
            // url: res.share.url
            url: this.url + "sneaker/detail/" + res.productid,
          },
        });
        delete res.share;
      }

      if (res.summary) {
        let sub = res.summary.substr(0, 57);
        let summary = res.summary;
        summary = summary.length > 57 ? sub + "..." : summary;
        res.summary = summary;
      }

      _.showLike = res.iscollect == 1;
      // if (_.productInfo.iscollect == 1) {
      //   this.showLike = 1;
      // } else {
      //   this.showLike = 0;
      // }

      if (res.producttype == PT.ext) {
        skc = res.clothesimgs.find((i) => i.islowest) || res.clothesimgs[0];
        // console.log("===skc", skc);

        // _.swItem = skc.imgs
      } else if (res.producttype == PT.sneaker) {
        _.img360 = ((res.imgs && res.imgs[1]) || "")
          .split(",")
          .filter((i) => !!i);
        // _.swItem = ((res.imgs && res.imgs[3]) || "")
        //   .split(",")
        //   .filter(i => !!i);
      }

      // res.description+=`<link rel="stylesheet" type="text/css" href="${res.cssurl}" />`
      _.description = res.description;
      delete res.description;

      _.moreCommodity(res.productid);

      _.productInfo = res;
      _.selectSkc = skc;
      _.$nextTick(() => {
        // 获取物流
        if (res && res.expresstemplateid) {
          _.getExpress(res.expresstemplateid);
        }
      });
    },
    getExpress(expressTemplateId) {
      let _ = this;
      GetExpress(expressTemplateId)
        .then((res) => {
          console.log("商品详情物流信息", res);
          if (res) _.productInfo = { ..._.productInfo, ...res };
        })
        .catch((e) => {
          console.error("物流信息加载失败", e);
        });
    },
    goSearch(name, id) {
      // var set = {};
      // if (id) {
      //   set.brandid = id;
      //   set.brandName = name;
      // } else {
      //   set.keyword = name;
      // }
      // this.$store.dispatch("confirOption", { data: set });
      this.$router.push("/results/" + name + "?brandid=" + id + "&isc2c=1");
    },

    ifAbnormal() {
      this.loadApp(-1);
      // this.showItem(0);
    },

    showItem(type) {
      console.log("立即购买", this.qqUrl);
      axios
        .get(this.qqUrl)
        .then((res) => {
          console.log("getQqurl success", res);
        })
        .catch((e) => {
          console.log("getQqurl error", e);
        });
      if (this.insq || this.user.token) {
        this.type = type;
        this.css.showItem = true;
      } else {
        this.$router.push("/login");
      }
    },

    itemsClose(item) {
      console.log("  item: ", item);

      let _ = this,
        { type } = _,
        selltype = 0;
      _.css.showItem = false;

      if (item == null) {
        return;
      } else {
        selltype = item.sellType;
        _.sellType = selltype;
      }

      _.accountstatus = item.status;
      _.pledgemessage = item.pledgemessage;

      if (item.status == 2) {
        _.showmodel = 2;
        return;
      } else if (item.advancemoneystatus == 1 && selltype == 1) {
        //判断点击发布预售时，预售保证金不足
        _.showmodel = 1;
        return;
      } else if (item.salemoneystatus == 1 && selltype == 0) {
        //判断点击发布现货时，现货保证金不足
        _.showmodel = 1;
        return;
      }
      // if (item.earnestmoneystatus == 1||item.earnestmoneystatus == 2&&selltype == 1) {
      //     _.showmodel = 2;
      // }
      if (type === 0) {
        item.lowestprice = item.lowestprice || item.minprice;
        _.$store.dispatch("addSaleSneakInfo", { ...item });
        // _.$router.push("/sneaker/sell");
        _.$router.push({ path: `/sneaker/sell/${selltype}` });
      } else if (type === 1) {
        _.buyNow(item);
      }
    },
    buyNow(item) {
      // console.log("this.item", item);
      // console.log("--buyNow: ", this.realInfo);
      this.$store.dispatch("updPayingOrder", "");
      this.buyparams(item);
      // item.salemoney = item.price;
      // item.saleprice = item.price;
      // item.specialprice = item.price;
      // item.checked = true;
      // item.isok = true;
      // item.count = 1;
      // let tempTotalPrice = item.count * item.saleprice;
      // let pay = {
      //   ...item,
      //   id: item.productid,
      //   allPay: tempTotalPrice,
      //   saleid: item.saleid,
      //   brandsizeid: item.brandsizeid,
      //   count: item.count,
      //   item: [item]
      // };

      // let _ = this;
      // _.$store.dispatch("setOrderCoupon", {
      //   canUseCoupon: [],
      //   unCanUseCoupon: []
      // });
      // _.$store.state.order.selectedCoupon = {};
      // console.log("buyNow", pay);
      // _.$store.dispatch("setOrderOut", { ...pay });
      // _.$store.dispatch("setFromeType", 1);
      // _.$router.push("/sneaker/check");
    },
    buyparams(item) {
      console.log("--buyNow-------------------: ", item);
      console.log(
        "saleid",
        item.isadvancesale == 0 && item.sellType == 0
          ? item.saleid
          : item.advancesaleid
      );
      console.log(" item.saleid", item.saleid);
      console.log("item.advancesaleid", item.advancesaleid);
      let _ = this;
      try {
        ActionReport({
          netuserid: _.user.uid,
          itemid: item.productid,
          actiontype: "buy",
        });
      } catch (e) {}

      _.$router.push({
        path: "/sneaker/NewCheck",
        query: {
          // addressid
          adi: _.userDefaultAddress.addressid,
          // count
          c: 1,
          // saleid
          si:
            item.isadvancesale == 1 && item.sellType == 1
              ? item.advancesaleid
              : item.saleid, // "销售记录id",
          // productid
          pi: item.productid, //  商品id",
          // oldsaleid
          osi: item.saleid,
          // role
          r: 1, // 买家/购买
          // seller
          st: item.seller, //商家类型
        },
      });
    },
    changeAround(e) {
      console.log("touch", e);
      let move = this.css.clientX - e.changedTouches[0].clientX;
      this.css.clientX = e.changedTouches[0].clientX;
      if (move > 0) {
        if (this.css.aroundIndex < this.img360.length) {
          this.css.aroundIndex++;
        } else {
          this.css.aroundIndex = 0;
        }
      } else {
        if (this.css.aroundIndex > 0) {
          this.css.aroundIndex--;
        } else {
          this.css.aroundIndex = this.img360.length;
        }
      }
    },
    pop() {
      let _ = this,
        { realInfo: info, isExt } = _;
      if (_.user && _.user.token) {
        if (isExt) {
          _.isShowSaveModel = true;
        } else {
          _.cssShowPop = true;
        }
      } else {
        _.toast("登录后才可收藏哦~");
      }
    },
    switchAround() {
      this.css.showAround = !this.css.showAround;
    },
    changeImg(e) {
      if (this.insq || this.user.token) {
        let i = e.currentTarget.dataset.index;
        this.sneakerSizeColl[i].iscollect = !this.sneakerSizeColl[i].iscollect;
        //item.iscollect = !item.iscollect
        this.collectsize(e);
      } else {
        this.$router.push("/login");
      }
    },
    collectsize(e) {
      let i = e.currentTarget.dataset.index;
      if (this.sneakerSizeColl[i].iscollect == 1) {
        this.choosesize.push(this.sneakerSizeColl[i].size);
      } else {
        for (var j = 0; j < this.choosesize.length; j++) {
          if (this.choosesize[j] == this.sneakerSizeColl[i].size) {
            this.choosesize.splice(j, 1);
          }
        }
      }
      console.log(this.choosesize);
    },

    moreCommodity(id) {
      LookMore({
        productid: id,
        page: 1,
        size: 3,
      })
        .then((res) => {
          if (res && res.list && res.list.length > 0) {
            this.aboutList = res.list.slice(0, 3);
          }
        })
        .catch((e) => {
          console.error("LookMore error: ", e);
        });
    },

    goMore() {
      if (this.productInfo && this.productInfo.productid) {
        this.$router.push(`/sneaker/more/${this.productInfo.productid}`);
      }
    },
    goDetail(id) {
      this.$router.push(`/sneaker/detail/${id}`);
    },

    goInstruction() {
      this.$router.push("/buyerSellKnow?type=2");
    },
    close() {
      this.showmodel = 0;
    },
    QiyuProd() {
      QiyuProd.call(this);
      console.log("打开客服");
    },
    goShoppayinback() {
      // this.$router.push(`/shoppay/1`);
      // this.$router.push({ path: 'shoppay', query: { payinback: 1, selltype: this.sellType }})
      this.$router.push("/shoppay?payinback=1&selltype=" + this.sellType);
    },
    buyknow() {
      this.$router.push("/buyerSellKnow?type=2");
    },
  },
};
</script>
<style lang="scss" scoped>
.skcs > span {
  width: 21vw;
  text-align: center;
  font-size: 12px;
}
.skc-cells {
  width: 79vw;
  white-space: nowrap;
  overflow-x: scroll;
  padding-right: 6.4vw;
}
.skc-cells img {
  width: 9.06vw;
  margin-left: 6.4vw;
  border-radius: 2px;
  border: 2px solid transparent;
  transition: border 0.2s ease;
}
.skc-cells .act {
  width: 9.06vw;
  border-color: #707afc;
}

.main {
  color: #333;
  padding-bottom: 45px;
}
.collect {
  position: absolute;
  right: 6%;
  top: 25%;
  width: 6%;
  height: 43%;
}
.product_notice {
  padding: 0 1.3333vw;
  max-width: 61.6vw;
  background-color: #ccc;
  border-radius: 1.3333vw;
  line-height: 26px;
  height: 26px;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  position: fixed;
  left: 4vw;
  top: 60px;
  z-index: 10;
  .product_notice_list {
    transition: all 0.5s;
    margin-top: -26px;
    .product_notice_item {
      height: 26px;
      line-height: 26px;
    }
  }
  .product_notice_img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    float: left;
    margin-top: 3px;
    margin-right: 5px;
  }
}
.product_sw {
  max-width: 600px;
  max-height: 600px;
  height: 100vw;
  margin: 0 auto;
  background-color: #fff;
  position: relative;
}

// 收藏
.mask {
  position: fixed;
  font-size: 1.2em;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  .mengceng {
    width: 20%;
    height: 100%;
    background: rgba(51, 51, 51, 0.2);
    float: left;
  }
  .maskBox {
    position: absolute;
    right: 0;
    height: 100%;
    width: 80%;
    padding: 25% 0 0 5%;
    background-color: #fff;
    opacity: 1;
    .rightImg {
      position: absolute;
      right: 5%;
      top: 5%;
      width: 10%;
    }
    .detailName {
      padding: 7% 10% 7% 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .shoucang {
      color: #ccc;
      font-size: 0.6em;
      margin-bottom: 12%;
    }
    .chooseSize {
      height: 70%;
      overflow-y: scroll;
      .shoeSize {
        border-bottom: 1px solid #ccc;
        position: relative;
        padding: 3% 0;
        .shoeImg {
          width: 7%;
          position: absolute;
          right: 6%;
        }
      }
    }
  }
  .confirm {
    position: fixed;
    bottom: 0;
    right: 0;
    color: #fff;
    height: 7%;
    width: 80%;
    line-height: 13vw;
    text-align: center;
    background: #000;
  }
}

.info-price {
  display: inline-block;
  font-size: 16px;
  background: #eee;
  padding: 0px 20px;
  height: 42px;
  line-height: 42px;
  text-align: center;
  margin-top: 10px;
}

.info-saleprice {
  font-size: 22px;
}

.product_name {
  margin: 0 20px;
  font-size: 15px !important;
  word-break: break-all;
}

.product_name section:nth-of-type(1) {
  font-weight: 600;
  margin: 10px auto;
  line-height: 20px;
  font-size: 15px;
}

.send span {
  float: left;
  width: 14px;
  height: 14px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-right: 5px;
}

.send {
  margin-right: 10px;
  float: left;
  display: flex;
  align-items: center;
}

.time_color {
  color: #af3c03;
}

.product_name section:nth-of-type(2) {
  // font-size: 0.75rem;
  color: #666;
  padding-bottom: 20px;
}
.product_trade {
  height: 12vw;
  border-bottom: 5px solid #f2f2f2;
  box-sizing: content-box;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #333333;
  line-height: 12vw;
}

.product_trade p {
  position: relative;
  box-sizing: border-box;
  left: 27px;
}
.product_trade p:last-child {
  color: #666666;
  position: relative;
  left: -2vw;
}
.product_trade_img {
  width: 18px;
  height: 18px;
  position: relative;
  right: 7px;
  top: 4px;
}
.product_logo {
  height: 22.1333vw;
  border-bottom: 5px solid rgb(242, 242, 242);
  display: flex;
  align-items: center;
  padding: 0 5.3333vw;
}

.product_logo .logo_img {
  height: 12vw;
  width: 12vw;
  border-radius: 50%;
  border: 1px solid #eee;
  overflow: hidden;
  margin-right: 4.2667vw;
}

.logo_img img {
  width: 100%;
  height: 100%;
}

.product_logo p {
  font-size: 12px;
  flex: 1;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.fix-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 45px;
  width: 100%;
  display: flex;
  box-sizing: content-box;
  background-color: #fff;
  .sale {
    width: 32vw;
    background-color: #fff;
    display: inline-block;
    height: 100%;
    line-height: 45px;
    text-align: center;
  }
  .buy {
    width: 68vw;
    background-color: #333;
    color: #fff;
  }
}

.around {
  position: absolute;
  top: 2.4vw;
  right: 0.5333vw;
  width: 16.2667vw;
  height: 16.2667vw;
}

.around-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($color: #000000, $alpha: 0.1);
  .around-img-item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
  .show-around-img {
    z-index: 2;
  }

  .around-bg {
    width: 100%;
    height: 114.6667vw;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }

  .finger {
    width: 13.0667vw;
    height: 13.3333vw;
    position: absolute;
    bottom: 3.3333vw;
    left: 50%;
    transform: translate(-50%, 0);
  }
}

.about {
  width: 100%;
  background-color: #fff;
  margin: 1.3333vw 0;
  padding-bottom: 0;
  border-bottom: 5px solid #f2f2f2;
}

.about-title {
  font-size: 12px;
  color: rgb(153, 153, 153);
  display: flex;
  justify-content: space-between;
  padding: 0 4vw;
  margin-top: 5.3333vw;
  span:first-child {
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
}
.about-commodity {
  display: flex;
  margin: 5.3333vw 0;
  padding-left: 4vw;
  font-size: 10px;
}
.about-commodity-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #333;
  margin-right: 2.1333vw;
  width: 29.3333vw;
  span {
    width: 29.3333vw;
    text-align: center;
  }
}

.commodity-info {
  margin-top: 1.3333vw;
  font-size: 12px;
  color: rgb(102, 102, 102);
  padding: 5.3333vw 4vw;
  border-bottom: 5px solid #f2f2f2;

  span {
    width: 50%;
    white-space: pre;
    margin-bottom: 2.6667vw;
  }
}

.table {
  width: 92vw;
  margin: 0 auto;
  .table-list {
    background-color: rgb(245, 245, 245);
    margin-top: 5.3333vw;
    padding-bottom: 2.6667vw;
    .table-title {
      background-color: rgb(90, 95, 109);
      height: 9.3333vw;
      font-size: 14px;
      color: #fff;
    }
    table {
      width: 86.6667vw;
      margin: 0 2.6667vw;
      font-size: 12px;
      table-layout: fixed;
      border-collapse: collapse;
      th {
        height: 9.8667vw;
      }
      td {
        text-align: center;
        height: 6.6667vw;
        border-right: 0.2667vw solid rgb(236, 236, 240);
      }
      td:last-child {
        border: none;
      }
      tr:nth-child(odd) {
        background-color: #fff;
      }

      tr:nth-child(even) {
        background-color: rgb(209, 209, 221);
      }

      tr:first-child {
        background-color: rgb(245, 245, 245);
      }
    }
  }
}

.details {
  padding-top: 5.3333vw;
}
.model-content {
  margin-top: 4vw;
  margin-bottom: 9.0667vw;
}
.close_btn {
  position: absolute;
  top: 3.3333vw;
  right: 3.8667vw;
  height: 15px;
}
.model-title {
  color: #d71414;
  font-size: 16px;
  font-weight: 400;
  margin: 6vw 2.4vw 2.6667vw 2.4vw;
  text-align: center;
  font-weight: 600;
}
.model-text {
  color: #d71414;
  font-size: 13px;
  margin: 6vw 2.4vw 4vw 2.4vw;
}
.model-info {
  color: #333;
  font-size: 16px;
  margin: 0.8vw 2.4vw 0 2.4vw;
}
// 活动
.Ev {
  padding: 5px 0 5px 20px;
  /* margin: 10px 0; */
}

.productDetail .hasEv {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  margin: 10px auto;
}

.productDetail .hasEv > span {
  background-repeat: no-repeat;
  display: inline-block;
  width: 34px;
  height: 16px;
  background-size: 100%;
  margin-right: 5px;
}

.pledge-info {
  margin-top: 16px;
}
</style>

