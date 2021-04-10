<template>
  <div>
    <div v-if="hasdata==1">
      <v-header class="nav" v-if="!$root.ISAPP">
        <div class="nav-tab2 ellipsis">{{realInfo.productname}}</div>
        <img :src="showLike?like2:like1" class="collect" @click="pop">
      </v-header>
    </div>
    <div class="load-app" v-if="!$root.ISAPP" @click="guideDownload">
      <div class="down-load flex-btwn">
        <img src="/static/img/details_page_ic_logo.png">
        <p class="down-load-btn">打开APP</p>
      </div>
    </div>
    <div class="product_sw" style="margin-top:5vw;">
      <swiper :options="prodSwiOption" class="product_sw">
        <swiper-slide v-for="(item,index) in calc.imgs" :key="index">
          <img v-lazy="https(item)" class="slideImg" :alt="item">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <div class="around img-360" @click="switchAround" v-if="img360&&img360.length>0">360°</div>
      <div
        class="around-img"
        @touchmove="changeAround"
        v-show="css.showAround"
        @click="switchAround"
      >
        <div class="around-bg">
          <img
            v-for="(item,index) in img360"
            :key="index"
            v-lazy="https(item)"
            :class="{'show-around-img':(index === css.aroundIndex)}"
            class="around-img-item"
          >
          <!-- <img src="/static/img/finger.png" class="finger"> -->
        </div>
      </div>
    </div>
    <div class="tard-detial flex-center flex-col" v-show="tradeinfolist.length>0">
      <div class="tard-title flex-btwn">
        <p>买卖详情</p>
        <span @click="gotoAPP">查看更多></span>
      </div>
      <div class="tard-table">
        <table>
          <tr>
            <th>时间</th>
            <th>尺码(码)</th>
            <th>价格(￥)</th>
          </tr>
          <tr v-for="(item,index) in tradeinfolist" :key="index">
            <td>{{item.createdat}}</td>
            <td>{{item.size}}{{item.ordertype ==  2?"【预售】":""}}</td>
            <td>{{item.price}}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="tip-icon">
      <div class="tip-icon-img flex-center">
        <div class="icon flex-center flex-col" v-for="(item,index) in tipIcon" :key="index">
          <div>
            <img :src="item.icon">
          </div>
          <p>{{item.icText}}</p>
        </div>
      </div>
    </div>
    <div class="tard-detial flex-center flex-col" v-show="quotationlist&&quotationlist.length>0">
      <div class="tard-title flex-btwn">
        <p>行情</p>
        <span @click="gotoAPP">查看更多></span>
      </div>
      <div class="market ">
        <div
          class="flex"
          v-for="(quotation, index) in quotationlist"
          :key="index"
          @click="goPostDetail(quotation.id)"
          v-show="index < 2"
        >
          <div class="market-img flex-center">
            <img :src="quotation.imageurl">
          </div>
          <div class="market-text">
            <div class="market-title" :style="textstyle">{{quotation.content}}</div>
            <div class="market-time">{{quotation.publishtime}}</div>
            <div class="market-people flex-btwn">
              <div class="flex-tops">
                <div class="head-picture">
                  <img :src="quotation.postuserimgurl">
                </div>
                <p>{{quotation.username}}</p>
              </div>
              <p>{{quotation.browsecount}}浏览</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="comments tard-detial flex-center flex-col">
      <div class="tard-title flex-btwn">
        <p>评论({{commentslist.total?commentslist.total:0}})</p>
        <span @click="gotoAPP">查看更多></span>
      </div>
      <div
        class="comment-detial flex-btwn flex-col"
        v-for="(comments,index) in commentslist.list"
        :key="index"
        v-show="index < 2"
      >
        <div class="user-message flex-btwn">
          <div class="flex-tops">
            <div class="head-picture">
              <img :src="comments.userimgurl">
            </div>
            <div class="user-name">
              <p>{{comments.username}}</p>
              <span>{{comments.commenttime}}</span>
            </div>
          </div>
          <div class="position-icon flex-start" @click="gotoAPP">
            <div>
              <img src="/static/img/position_icon.png">
            </div>
            <p>表态</p>
          </div>
        </div>
        <div class="conmment-text">{{comments.content}}</div>
        <div class="comments-list" v-show="comments.replylist&&comments.replylist.length>0">
          <div v-for="(reply, count) in comments.replylist" :key="count">
            <p v-if="!reply.touserid && count<1">
              <span>{{reply.fromusername}}</span>
              :{{reply.content}}
            </p>
            <p v-if="reply.touserid && count<1">
              <span>{{reply.fromusername}}</span>回复
              <span>{{reply.tousername}}</span>
              :{{reply.content}}
            </p>
          </div>
          <p @click="gotoAPP" class="more-comments">共{{comments.replycount}}条回复></p>
        </div>
      </div>
      <div class="oneself-commen flex-btwn">
        <div class="head-picture">
          <img :src="user.imageurl?user.imageurl:'http://api.eyee.com/EYEE/Icons/defaulthead.jpg'">
        </div>
        <div class="comments-list" @click="gotoAPP">插一嘴...</div>
      </div>
    </div>
    <div class="po-picture tard-detial flex-col" v-show="imagelist&&imagelist.length>0">
      <div class="flex-center">
        <div class="tard-title flex-btwn">
          <p>Po照</p>
          <span @click="gotoAPP">查看更多></span>
        </div>
      </div>

      <div class="picture-list flex">
        <div
          class="flex-center"
          style="margin-top:2vw"
          v-for="(item,index) in imagelist "
          :key="index"
          @click="checkDetails(index)"
          v-show="index<6"
        >
          <img v-lazy="https(item)" :alt="item">
        </div>
      </div>
    </div>
    <div class="product-detial">
      <div class="flex-btwn" v-for="(item,index) in productDetial" :key="index">
        <p>
          {{item.one}}
          <span>{{item.two}}</span>
        </p>
        <p>
          {{item.three}}
          <span @click="lookmore(index)">{{item.four}}</span>
        </p>
      </div>
      <div v-if="detialShow" class="details" v-html="description" ref="description"></div>
      <div class="check-btn flex-center" @click="showAllDtial">
        {{detialShow?"向上收起":"更多详情"}}
        <div class="check-style-unequal-width" :class="{rotating:detialShow}"></div>
      </div>
    </div>
    <div class="recommend">
      <div class="recommend-title">为你推荐</div>
      <div class="recommended-goods navBar">
        <v-list
          :load-handle="()=>{}"
          :more-handle="searchloadmore"
          :more-handling="loading"
          :isend="isend"
        >
          <div class="flex-wrap rcd-list flex-between recommend-list">
            <template v-for="(pi,a) in RecommendProductList">
              <product-unit
                :key="a"
                :product-item="pi"
                :product-type="20"
                :is-find-sim="1"
                :exchangeStyle="true"
              ></product-unit>
            </template>
          </div>
        </v-list>
      </div>
    </div>
    <div class="trade-buy fix-btm flex-btwn">
      <div
        class="trading flex-center"
        v-for="(item,index) in sellandBuy"
        :key="index"
        @click="goHandleEvent(index)"
      >
        <div :class="index==0?'sell-left':'buy-left'" class="sellandBuy flex-center flex-col">
          <p>￥{{item.price?item.price:"--"}}</p>
          <span>{{index==0?'最高求购价':'最低出售价'}}({{item.size? (item.size+'码'):"--"}})</span>
        </div>
        <div :class="index==0?'sell-right':'buy-right'" class="sell">{{index==0?"卖出":"买入"}}</div>
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
    <!-- 购买 -->
    <items
      :show="css.showItem"
      :product-info="realInfo"
      :select-color="selectSkc.colorid"
      @close="itemsClose"
      :type="type"
    ></items>
    <!-- 尺码表 -->
    <div class="shoe-size flex-center" v-if="isShow && realInfo.sizeinfo&&realInfo.sizeinfo.length>0">
      <div class="shoe-size-close" @click="isShow = false"></div>
      <div class="cladding flex-aic flex-col">
        <div class="close-btn" @click="isShow = false">×</div>
        <div
          class="flex-center flex-col"
          v-for="(table,tableIndex) in realInfo.sizeinfo"
          :key="tableIndex"
        >
          <div
            v-if="realInfo.sizeinfo.length>1 && tableIndex<1"
            class="select-shose-size flex-center"
          >
            <div :class="{checked: isChoose == 0}" @click="selectionSize(0)">男码</div>
            <div :class="{checked: isChoose == 1}" @click="selectionSize(1)">女码</div>
          </div>
          <div v-if="realInfo.sizeinfo.length<2" class="table-list">{{table.title}}</div>
          <table v-if="isChoose == tableIndex || realInfo.sizeinfo.length<2  ">
            <tr>
              <th v-for="(head,headIndex) in table.head" :key="headIndex">{{head}}</th>
            </tr>
            <tr v-for="(body,bodyIndex) in table.size" :key="bodyIndex">
              <td v-for="(bodyItem,bodyItemIndex) in body" :key="bodyItemIndex">{{bodyItem}}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <!-- 图片 -->
    <div class="picture_list flex-center" v-show="pictureShow">
      <div class="picture_close flex-center" v-show="pictureShow" @click="pictureShow=false">
        <p>×</p>
      </div>
      <swiper :options="imgSwiOption" class="product_sw picture_show flex-center" ref="codeSwiper">
        <swiper-slide v-for="(item,index) in imagelist " :key="index">
          <div class="swiper-zoom-container flex-center">
            <img v-lazy="https(item)" :alt="item">
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </div>
</template>
<script>
import { DateFormat } from "../../common/util";
import ProductUnit from "@/components/templates/ProductUnit";
import Items from "../../components/sneaker/Items";
import CollectSave from "../../components/templates/CollectSave";
import { mapGetters } from "vuex";
import { ActionReport } from "@/utils/api/base";
import {
  ProductDetails,
  IndexRecommend,
  ProductDetailsLogin
} from "../../common/api/sneaker";
import {
  ProductPrice,
  ProductDetailCluster,
  TradeInfoList
} from "../../common/api/bull";
// "producttype":21、鞋子 22、服装
const PT = { sneaker: 21, ext: 22 };
export default {
  components: { ProductUnit, Items, CollectSave },
  data() {
    return {
      hasdata: 0,
      description: "",
      pictureShow: false,
      type: null,
      showLike: 0,
      like1: "/static/img/collection_unselected.png",
      like2: "/static/img/collection_selected.png",
      sellandBuy: [],
      productDetial: [
        { one: "品牌：", two: "", three: "", four: "" },
        { one: "尺码：", two: "", three: "", four: "尺码对照表>" },
        { one: "发售日期：", two: "", three: "配色：", four: "" },
        { one: "发售价格：", two: "", three: "货号：", four: "" }
      ],
      textstyle:
        "overflow:hidden; text-overflow:ellipsis; text-overflow:-o-ellipsis-lastline; display:-webkit-box;-webkit-line-clamp:2; -webkit-box-orient:vertical;",
      isShow: false,
      isChoose: 1,
      RecommendProductList: [],
      page: 1,
      loading: false,
      detialShow: false,
      isend: false,
      tipIcon: [
        { icon: "/static/img/image_identify.png", icText: "多重鉴定" },
        { icon: "/static/img/image_logistics.png", icText: "顺丰到货" },
        { icon: "/static/img/image_process.png", icText: "买卖流程" },
        { icon: "/static/img/image_after-sales.png", icText: "售后须知" }
      ],
      tradeinfolist: [],
      commentslist: [],
      imagelist: [],
      quotationlist: [],
      prodSwiOption: {
        // autoplay: 2200,
        autoplayDisableOnInteraction: false,
        pagination: ".swiper-pagination",
        roundLengths: true,
        preloadImages: true,
        updateOnImagesReady: true
      },
      imgSwiOption: {
        zoom: true,
        initialSlide: 0,
        prevButton: ".swiper-button-prev",
        nextButton: ".swiper-button-next",
        pagination: ".swiper-pagination",
        paginationType: "fraction"
      },
      img360: {},
      css: {
        showItem: false,
        showAround: false,
        aroundIndex: 0,
        clientX: 0,
        showPop: false
      },
      selectSkc: {},
      accountstatus: 0,
      pledgemessage: {},
      isShowSaveModel: false,
      cssShowPop: false,
      choosesize: [],
      productInfo: {},
      url:""
    };
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
    codeSwiper() {
      return this.$refs.codeSwiper.swiper;
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
          if (info.imgs && info.imgs[3]) {
            imgs = info.imgs[3].split(",").filter(i => !!i);
          }
          saleprice = info.saleprice || "";
        }
      return { imgs, saleprice };
    },
    ...mapGetters({
      user: "userInfo",
      insq: "insq",
      userDefaultAddress: "userDefaultAddress"
    })
  },
  mounted() {
    let { id } = this.$route.params;
    this.load(id);
    if (this.$root.isdebug) {
      this.url = "http://qzone.eyee.com/";
    } else {
      this.url = "https://m.eyee.com/";
    }
  },

  methods: {
    load(id) {
      let _ = this;
      if (_.user.token) {
        _.getProductDetailLogin(id);
      } else {
        _.getProductDetail(id);
      }
      _.getTradeInfoList(id);
      _.getProductDetailCluster(id);
      _.getRecommend();
      _.getProductPrice(id);
    },
    // 顶部引导
    guideDownload() {
      this.sceneLoad();
    },
    // 交易记录
    getTradeInfoList(id) {
      TradeInfoList({ productid: id, page: 1, size: 4 })
        .then(res => {
          if (res && res.list) {
            this.tradeinfolist = res.list;
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    // 行情、评论、Po照聚合
    getProductDetailCluster(id) {
      let _ = this;
      ProductDetailCluster({ productid: id })
        .then(res => {
          if (res && res.commentslist) {
            _.commentslist = res.commentslist;
          }
          if (res && res.imagelist) {
            _.imagelist = res.imagelist;
          }
          if (res && res.quotationlist) {
            _.quotationlist = res.quotationlist;
            _.quotationlist = _.quotationlist.filter(i => i.postingtype == 0);
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 商品价格
    getProductPrice(id) {
      let _ = this;
      ProductPrice({ productid: id })
        .then(res => {
          if (res) {
            _.sellandBuy.push(
              { price: res.reqprice, size: res.reqsize },
              { price: res.saleprice, size: res.salesize }
            );
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    getProductDetailLogin(id) {
      let _ = this;
      ProductDetailsLogin({
        productid: id
      })
        .then(res => {
          console.log("登录后商品详情", res);
          if (res) {
            _.hasdata = 1;
            _.dealInfo(res);
          } else {
            _.hasdata = 2;
            _.toast("商品不存在或已下架");
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
    checkDetails(index) {
      let _ = this;
      _.pictureShow = true;
      _.codeSwiper.slideTo(index, 100, false);
    },
    // 获取商品详情
    getProductDetail(id) {
      let _ = this;
      ProductDetails({
        productid: id
      })
        .then(res => {
          console.log("商品详情", res);
          if (res) {
            _.hasdata = 1;
            _.dealInfo(res);
          } else {
            _.hasdata = 2;
            _.toast("商品不存在或已下架");
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
    // 收藏
    pop() {
      let _ = this,
        { realInfo: info, isExt } = _;
      if (this.insq || this.user.token) {
        if (isExt) {
          _.isShowSaveModel = true;
        } else {
          _.cssShowPop = true;
        }
      } else {
        this.$router.push("/login");
      }
    },
    // 商品详情数据处理
    dealInfo(res) {
      let _ = this,
        skc = {};
      if (res) {
        _.productDetial[0].four = res.brandname + ">";
        _.productDetial[2].two = res.starttime;
        _.productDetial[2].four = res.color;
        _.productDetial[3].two = res.marketprice;
        _.productDetial[3].four = res.sku;
      }
      if (res.share) {
        _.initShare({
          info: {
            title: res.share.title,
            desc: res.share.content,
            img: res.share.icon,
            url: res.share.url
            // url: this.url+'bull/proDetialShare/'+res.productid
          }
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
      if (res.producttype == PT.ext) {
        skc = res.clothesimgs.find(i => i.islowest) || res.clothesimgs[0];
      } else if (res.producttype == PT.sneaker) {
        if (res.imgs && res.imgs[1]) {
          _.img360 = res.imgs[1].split(",").filter(i => !!i);
        }
      }
      _.description = res.description;
      delete res.description;
      _.productInfo = res;
      _.selectSkc = skc;
      _.setToolBar({ title: _.productInfo.productname });
    },
    closeSave(v) {
      if (v && v == 1) this.showLike = true;
      else this.showLike = false;
      this.isShowSaveModel = false;
      this.cssShowPop = false;
    },
    itemsClose(item) {
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

      if (type == 1) {
        _.buyNow(item);
      }
    },
    buyNow(item) {
      this.$store.dispatch("updPayingOrder", "");
      this.buyparams(item);
    },
    buyparams(item) {
      let _ = this;
      try {
        ActionReport({
          netuserid: _.user.uid,
          itemid: item.productid,
          actiontype: "buy"
        });
      } catch (e) {}
      _.$router.push({
        path: "/sneaker/NewCheck",
        query: {
          adi: _.userDefaultAddress.addressid,
          c: 1,
          si:
            item.isadvancesale == 1 && item.sellType == 1
              ? item.advancesaleid
              : item.saleid, // "销售记录id",
          pi: item.productid, //  商品id",
          osi: item.saleid,
          r: 1, // 买家/购买
          st: item.seller //商家类型
        }
      });
    },
    // 商品详情查看更多
    lookmore(index) {
      let _ = this;
      if (index == 0) _.gotoAPP();
      else if (index == 1) _.isShow = true;
      else return;
    },
    // 查看帖子详情
    goPostDetail(id) {
      window.location.href = `${this.url}community/posting/detail/${id}`;
    },
    // 选择尺码
    selectionSize(n) {
      this.isChoose = n;
    },
    // 为你推荐
    getRecommend() {
      let _ = this,
        page = _.page;
      _.loading = true;
      IndexRecommend({
        page,
        size: 10
      })
        .then(res => {
          // console.log('res', res)
          if (res && res.list && res.list.length) {
            if (page === 1) _.RecommendProductList = res.list;
            else
              _.RecommendProductList = _.RecommendProductList.concat(res.list);
            if (_.RecommendProductList.length > 0) {
              _.RecommendProductList = _.RecommendProductList.map(i => {
                // i.brandname = ''
                i.id = i.productid;
                i.isc2c = 1;
                i.name = i.productname;
                i.mainpic = i.imageurl + "|";
                i.producttype = 0;
                // i.producttype = 21;
                i.saleprice = i.price;
                i.specialprice = 0;
                i.soldout = false;
                i.sumcount = 0;
                i.discountoff = 0;
                i.paynumber = i.buyersnum || i.paynumber ;
                if (i.pricerate > 0)
                  i.bull = "+" + i.pricerate.toFixed(2) + "%[￥" + i.changeprice + "]";
                else i.bull = i.pricerate.toFixed(2) + "%[￥" + -i.changeprice + "]";
                i.exchange = true;
                // i.positive = /^-$/.test(i.bull) ? false : true;
                i.positive = i.pricerate >= 0 ? false : true;
                return i;
              });
            }
            _.isend =
              res.page * res.size >= res.total &&
              _.RecommendProductList.length > 0;
          } else _.isend = true;
          _.loading = false;
        })
        .catch(e => {
          _.loading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    // 下拉加载
    searchloadmore() {
      let _ = this;
      if (_.loading) return;
      if (_.isend) _.toast("已无更多");
      else {
        _.page++;
        _.getRecommend();
      }
    },
    // 商品详情
    showAllDtial() {
      this.detialShow = !this.detialShow;
    },
    // 买入卖出
    goHandleEvent(index) {
      if (index == 0) this.gotoAPP();
      else this.goBuyProduct(1);
    },
    // 下载APP
    gotoAPP() {
      this.loadApp(-1);
    },
    // 购买
    goBuyProduct(n) {
      if (this.insq || this.user.token) {
        this.type = n;
        this.css.showItem = true;
      } else {
        this.$router.push("/login");
      }
    },
    // 360图
    switchAround() {
      this.css.showAround = !this.css.showAround;
    },
    changeAround(e) {
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
    }
  }
};
</script>
<style lang="scss" scoped>
.load-app {
  background: #fff;
  height: 11.7333vw;
  padding: 0 3vw;
  box-shadow: 0px 2px 4px 0px #e7e6e6;
  font-size: 13px;
  .down-load {
    padding-top: 2vw;
    img {
      height: 7.4667vw;
      width: 17.6vw;
    }
    p {
      text-align: center;
      height: 6.6667vw;
      color: #fff;
      background: #000;
      padding: 1vw 3vw;
      border-radius: 3.7333vw;
    }
  }
}

.collect {
  position: absolute;
  right: 6%;
  top: 25%;
  width: 6%;
  height: 43%;
}
.picture_list {
  position: fixed;
  z-index: 15;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000;
  .picture_close {
    background: #000;
    height: 100vh;
    width: 100vw;
    position: fixed;
    p {
      color: #fff;
      position: fixed;
      top: 15vw;
      right: 5vw;
      font-size: 30px;
    }
  }
}

.shoe-size {
  position: fixed;
  z-index: 15;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  .shoe-size-close {
    position: fixed;
    height: 100vh;
    width: 100vw;
    background: rgba(0, 0, 0, 0.3);
  }
  .cladding {
    background: #fff;
    width: 90vw;
    min-height: 100vw;
    border-radius: 4px;
    z-index: 16;
    .close-btn {
      font-size: 24px;
      font-weight: 900;
      margin-left: 80vw;
      margin-bottom: -2vw;
    }
    .table-list {
      border: 1px solid #eee;
      padding: 2vw 5vw;
    }
    .select-shose-size {
      div {
        border: 1px solid #e6e6e6;
        padding: 2vw 10vw;
      }
      div:nth-child(1) {
        border-radius: 2px 0px 0px 2px;
        border-right: 0;
      }
      div:nth-child(2) {
        border-radius: 0px 2px 2px 0px;
      }
      .checked {
        background: rgba(250, 250, 250, 1);
        color: #969696;
      }
    }
    table {
      width: 86.6667vw;
      margin: 0 2.6667vw;
      font-size: 12px;
      table-layout: fixed;
      border-collapse: collapse;
      margin: 4vw 0;
      th,
      td {
        text-align: center;
        height: 6.6667vw;
        border-right: 0.2667vw solid rgb(236, 236, 240);
      }
      th:last-child,
      td:last-child {
        border: none;
      }
      tr:nth-child(odd) {
        background-color: #fff;
      }

      tr:nth-child(even) {
        background-color: #f5f5f5;
      }

      tr:first-child {
        background-color: #fff;
      }
    }
  }
}
.img-360 {
  background: linear-gradient(180deg, #969696 0%, #646464 100%);
  border-radius: 50%;
  text-align: center;
  line-height: 11.7333vw;
  color: #fff;
  font-size: 14px;
}
.around {
  position: absolute;
  top: 30vw;
  right: 3vw;
  width: 11.7333vw;
  height: 11.7333vw;
}
.around-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background-color: rgba($color: #000000, $alpha: 0.1);
  background: rgba(0, 0, 0, 0.3);
  z-index: 20;
  .around-img-item {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .show-around-img {
    z-index: 9;
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
.tard-detial {
  margin-top: 5vw;
  border-bottom: 3vw solid #f5f5f5;
  .tard-title {
    width: 94%;
    height: 30px;
    line-height: 30px;
    p {
      font-size: 22px;
      font-weight: 600;
    }
    span {
      font-size: 12px;
      font-weight: 400;
    }
  }
  .tard-table {
    margin-top: 2vw;
    table {
      width: 100vw;
      font-size: 12px;
      table-layout: fixed;
      border-collapse: collapse;
      th {
        height: 9.6vw;
        background: #fff;
        font-size: 10px;
      }
      td {
        text-align: center;
        height: 9.6vw;
      }

      th:last-child,
      td:last-child {
        text-align: right;
        padding-right: 20px;
      }
      th:first-child,
      td:first-child {
        text-align: left;
        padding-left: 20px;
      }
      tr:nth-child(odd) {
        background-color: #fff;
      }

      tr:nth-child(even) {
        background-color: #fafafa;
      }

      tr:first-child {
        background-color: rgb(245, 245, 245);
      }
    }
  }
}
.tip-icon {
  border-bottom: 3vw solid #f5f5f5;
  .tip-icon-img {
    background: #fff;
    .icon {
      width: 25%;
      height: 24vw;
      img {
        height: 10vw;
        width: 10vw;
      }
      p {
        margin-top: 2vw;
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
}
.market {
  width: 100%;
  margin: 5vw 0;
  .market-img {
    width: 35vw;
    height: 26.6667vw;
    img {
      width: 26.6667vw;
      height: 26.6667vw;
    }
  }
}
.comments {
  .comment-detial {
    width: 100vw;
    margin-top: 6vw;
    padding: 0 4vw;
    font-weight: 400;
    .user-message {
      margin-bottom: 3vw;
      .head-picture {
        img {
          height: 8vw;
          width: 8vw;
          border-radius: 50%;
        }
      }
      .user-name {
        margin-left: 2vw;
        p {
          font-size: 12px;
          color: #646464;
        }
        span {
          font-size: 10px;
          color: #969696;
        }
      }
      .position-icon {
        font-size: 10px;
        img {
          height: 5.8667vw;
          width: 4.5333vw;
        }
        p {
          margin-left: 1.5vw;
        }
      }
    }
    .conmment-text {
      margin-left: 11vw;
      color: #232323;
      font-size: 14px;
      font-weight: 400;
      line-height: 6.5vw;
    }
    .comments-list {
      margin-left: 11vw;
      background: #fafafa;
      margin-top: 3vw;
      line-height: 5.5vw;
      font-size: 12px;
      padding: 2vw 0;
      p {
        font-weight: 600;
        color: #3a3a3a;
        span {
          color: #8246dc;
        }
      }
      .more-comments {
        color: #646464;
        font-weight: 400;
      }
    }
  }
  .oneself-commen {
    margin: 4vw auto;
    height: 10vw;
    .head-picture {
      img {
        height: 8vw;
        width: 8vw;
        border-radius: 50%;
      }
    }
    .comments-list {
      width: 81vw;
      // line-height: 11vw;
      height: 8.5333vw;
      line-height: 8.5333vw;
      margin-left: 2vw;
      background: #f5f5f5;
      border-radius: 0.5333vw;
      color: #b4b4b4;
      padding-left: 3vw;
    }
  }
}
.market-text {
  width: 63vw;
  font-size: 12px;
  .market-title {
    width: 100%;
    height: 10vw;
    line-height: 5vw;
    font-size: 14px;
    font-weight: 600;
    word-break: break-all;
    word-wrap: break-word;
  }
  .market-people {
    margin-top: 3vw;
    .head-picture {
      img {
        width: 8vw;
        height: 8vw;
        border-radius: 50%;
      }
    }
    p {
      height: 8vw;
      line-height: 8vw;
      margin-left: 1vw;
    }
  }
  .market-time {
    text-align: left;
    margin-top: 1vw;
  }
}
.po-picture {
  border-bottom: 3vw solid #f5f5f5;
  .picture-list {
    flex-wrap: wrap;
    padding: 4vw 2vw;
    div {
      width: 32vw;
      img {
        height: 29.8667vw;
        width: 29.8667vw;
        border-radius: 2px;
      }
    }
  }
}
.product-detial {
  border-bottom: 3vw solid #f5f5f5;
  font-size: 12px;
  font-weight: 400;
  padding: 4vw 3vw;
  div {
    p {
      height: 8vw;
      line-height: 8vw;
      color: #949494;
      span {
        max-width: 30%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #232323;
      }
    }
    img {
      width: 100%;
      margin-top: 2vw;
    }
  }
  .check-btn {
    height: 7vw;
    line-height: 7vw;
    .check-style-unequal-width {
      margin-left: 2vw;
      width: 2vw;
      height: 2vw;
      border-color: #646464;
      border-style: solid;
      border-width: 0px 1.5px 1.5px 0;
      transform: rotate(45deg);
    }
    .rotating {
      margin-top: 1vw;
      transform: rotate(-135deg);
    }
  }
}
.recommend {
  .recommend-title {
    padding-left: 3vw;
    height: 18vw;
    line-height: 18vw;
    font-size: 22px;
    font-weight: 600;
  }
}

.trade-buy {
  box-shadow: 0px -10px 15px 0px rgba(235, 235, 235, 0.5);
  padding: 3% 2%;
  color: #fff;
  font-weight: 600;
  position: fixed;
  bottom: 0;
  background: #fff;
  width: 100%;
  text-align: center;
  .trading {
    width: 49%;
  }
  .sellandBuy {
    height: 16vw;
    width: 70%;
  }
  .sell {
    height: 16vw;
    width: 30%;
    line-height: 16vw;
  }
  .sell-left {
    background: #0ab978;
  }
  .sell-right {
    background: #0aa569;
  }
  .buy-left {
    background: #fa4b4b;
  }
  .buy-right {
    background: #f02d2d;
  }
  p {
    font-family: BASE_PRICE;
    font-size: 22px;
  }
  span {
    font-size: 10px;
    font-weight: 400;
  }
}

.swiper-pagination-fraction {
  top: 25vw;
  left: 40vw;
  width: 20vw;
  height: 10vw;
  color: #fff;
  position: fixed;
}
.recommended-goods {
  width: 100vw;
  background: #f2f2f2;
  margin-bottom: 20vw;
}
.recommend-list {
  width: 100vw;
  border-top: 1px solid #eee;
}
.recommend-list /deep/ .productItem {
  // width: calc(50% - 0.5px);
  /* width:-webkit-calc(50% - 5px); */
  /* width: 50%; */
  width: 50vw;
  padding: 0 2vw;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
  margin-bottom: 0 !important;
  height: 82.6667vw;
}
.recommend-list /deep/ .productItem:nth-child(2n) {
  border-right: 0;
}
.recommend-list /deep/ .productItem .product_name {
  font-weight: 400;
}

.recommend-list /deep/ .productItem .product_img {
  padding-top: 5.3333vw;
}
.recommend-list /deep/ .productItem .product_img img {
  height: 41.8667vw;
  width: 41.8667vw;
}
.recommend-list /deep/ .exchange-price {
  margin: 3vw 0;
}
.recommend-list /deep/ .findSim_mask{
  left: 0;
}
</style>
