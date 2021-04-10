<template>
  <!-- productType == 13?goToProductDetail() -->
  <div
    v-if="!isfilter"
    class="productItem"
    @click="getProductDetail(info)"
    :class="{
      type9:
        productType === 9 ||
        productType === 10 ||
        productType == 13 ||
        productType == 14,
      type13: productType == 13,
      type14: productType == 14,
      grouptype: grouptype == 1,
      grouptypeBox: grouptype == 2,
      bordBox: productType == 10,
    }"
    ref="productUnit"
  >
    <template
      v-if="
        productType != 9 &&
        productType != 10 &&
        productType != 11 &&
        productType != 3 &&
        productType != 13 &&
        productType != 14
      "
    >
      <div class="product_img" :class="{ soldout: info.soldout }">
        <div :class="{ 'product-img-top': showimgTop }">
          <img v-lazy="https(info.mainpic[0])" alt />
        </div>
        <label></label>
        <div
          v-if="
            (info.platformactivityicon || activityImg) && info.producttype == 7
          "
          class="activityicon"
        >
          <img
            width="100%"
            :src="activityImg ? activityImg : info.platformactivityicon | https"
            alt
          />
        </div>
      </div>
      <p
        class="product_name"
        style="-webkit-box-orient: vertical"
        :class="{ low: info.crawminprice || !!info.crawweeksalecount }"
        v-if="productType == 20 || position == 2"
      >
        {{ info.name }}
      </p>
      <div
        class="exchange-price"
        v-if="
          (productType == 20 || productType == 0) && isFindSim && info.exchange
        "
      >
        <div class="flex">
          <div
            class="exchange-bull"
            :style="info.positive ? 'color:#0AB978' : 'color:#FA4B4B'"
          >
            {{ info.bull }}
          </div>
          <div class="ic_product_more" @click.stop="openSim">
            <img src="/static/img/ic_product_more.png" />
          </div>
        </div>
        <div class="flex-between">
          <productPrice
            :prodInfos="info"
            :prodType="productType"
          ></productPrice>
          <div class="exchange-pay-number">{{ info.paynumber || 0 }}人付款</div>
        </div>
      </div>
      <div v-else class="info-title">
        <div class="info_box">
          <div>
            <!-- <div class="product_names"></div> -->
            <!-- <p class="del_price">
              {{ info.specialprice ? "￥" : ""
              }}{{
              info.specialprice
              ? info.saleprice
              ? info.saleprice
              : "--"
              : ""
              }}
            </p>-->
            <div class="flex-aic sale-count" @click.stop="checkLow(info)">
              <!-- 有特价 显示特价 没有特价 显示原价(有原价 就显示原价 没有原价 显示--) -->
              <div class="flex-aic-btwn _left">
                <span class="price flex-center">
                  <i class="txt flex-center" v-if="info.crawminprice"
                    >全网低价</i
                  >
                  <span class="rmb">¥</span>
                  <em v-if="info.crawminprice">{{ info.crawminprice }}</em>
                  <em v-else>{{
                    info.specialprice
                      ? info.specialprice
                      : info.saleprice
                      ? info.saleprice
                      : "--"
                  }}</em>
                </span>
                <span class="isPay" :class="{ yellow: info.crawweeksalecount }">
                  <i class="txt" v-if="info.crawweeksalecount">全网销量</i>
                  {{ info.crawweeksalecount || info.paynumber || 0 }}人付款
                </span>
              </div>
              <div class="point flex-col-ctr" v-if="info.crawweeksalecount">
                <!-- <span>•</span>
                <span>•</span>
                <span>•</span> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="findSim_mask"
        @click.stop="findSimilarHide"
        :class="{ findSimAnimate: classFindSim == 0 }"
        v-if="isFindSim"
      >
        <!--找相似按钮-->
        <div class="findSim_wrap flex-center flex-col">
          <div
            v-if="info.isc2c == 0"
            class="addSim flex-center"
            @click.prevent.stop="goFavor(info)"
          >
            <img class="icon" src="/static/img/icon_similar.png" />
            <span>加收藏</span>
          </div>
          <div
            class="findSim flex-center"
            @click.prevent.stop="goSimil(info.id, info.isc2c)"
          >
            <img class="icon" src="/static/img/icon_collect.png?c=1" />
            <span>找相似</span>
          </div>
        </div>
      </div>

      <!-- 全网最低价弹框 -->
      <div
        class="low-price-modal"
        v-if="isShowLowPrice && info.crawweeksalecount"
        @click.stop="checkLow(info)"
      >
        <div class="li flex-aic">
          <div class="day flex-center">7天</div>
          <div class="total-peop">{{ info.crawweeksalecount }}人付款</div>
        </div>
        <div class="li flex-aic">
          <div class="day flex-center">15天</div>
          <div class="total-peop">{{ info.crawhalfmonthsalecount }}人付款</div>
        </div>
        <div class="li flex-aic">
          <div class="day flex-center">30天</div>
          <div class="total-peop">{{ info.crawmonthsalecount }}人付款</div>
        </div>
      </div>
    </template>
    <template v-else>
      <template v-if="productType == 11">
        <div class="product_img" :class="{ soldout: info.soldout }">
          <!--  ref="product_img" -->
          <img v-lazy="https(info.mainpic[0])" alt />
          <label></label>
        </div>
        <p class="prod_honeyPrice font-price">
          <template v-if="!info.isallexchange">¥{{ info.price }}+</template>
          <em></em>
          {{ info.bees }}
        </p>
        <div class="product_names">
          <brandName :bName="info.brandname" :upStyle="upStyle"></brandName>
          <businessName
            v-if="!insq"
            :BusName="info.businessname"
            :upStyle="upStyle"
            :BusType="info.businesstype"
          ></businessName>
        </div>
      </template>

      <template v-else-if="productType == 3">
        <div class="product_img" :class="{ soldout: info.soldout }">
          <!--  ref="product_img" -->
          <img v-lazy="https(info.mainpic[0])" alt />
          <label></label>
          <div
            v-if="
              (info.platformactivityicon || activityImg) &&
              info.producttype == 7
            "
            class="activityicon"
          >
            <img
              width="100%"
              :src="
                activityImg ? activityImg : info.platformactivityicon | https
              "
              alt
            />
          </div>
        </div>
        <productPrice1
          :prodInfos="info"
          :prodType="productType"
        ></productPrice1>
        <div class="product_names" style="text-align: left">
          <div class="businessName">
            <brandName1 :bName="info.brandname"></brandName1>
            <productName :pName="info.name"></productName>
            <!-- <businessName v-if='!insq' :BusName="info.brandname" :BusType="info.producttype"></businessName> -->
          </div>
        </div>
      </template>
      <template v-else>
        <div class="ImgWrap">
          <img :src="https(info.mainpic[0])" alt />
        </div>
        <div class="textWrap">
          <div class="product_names">
            <p v-if="productType == 10" class="prod_honeyPrice font-price">
              <template v-if="!info.isallexchange">¥{{ info.price }}+</template>
              <em></em>
              {{ info.bees }}
            </p>
            <brandName :bName="info.brandname" :upStyle="upStyle"></brandName>
            <template v-if="productType == 9">
              <productName :pName="info.name"></productName>
            </template>
            <template v-if="productType == 9">
              <productPrice
                :prodInfos="info"
                :prodType="productType"
                :upStyle="upStyle"
              ></productPrice>
            </template>
            <businessName
              v-if="!insq"
              :BusName="info.businessname"
              :upStyle="upStyle"
              :BusType="info.businesstype"
            ></businessName>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import { FavorProduct } from "../../common/api/userFavor";
import { mapGetters } from "vuex";

const FindSimHandleName = "_product_findsim";

export default {
  name: "ProductUnit",
  props: {
    showimgTop: { type: [Number, String], default: 1 }, // 控制图片上方是否显示蒙层
    productItem: { type: Object }, // 传数组
    productType: { type: Number, default: 0 },
    grouptype: { type: Number, default: 0 }, // 1 拼团详情 头部产品样式模板  2 是‘其他潮人还在拼这些潮品’样式模板
    activityImg: { type: String, default: null },
    guishiIcon: { type: Number, default: 0 },
    // isActivity:{type:Boolean,default:false},
    isFindSim: { type: Number, default: 0 }, // 找相似；0：不需要触发；1：触发
    issearchclick: { type: Number, default: 0 }, // 搜索结果页 数据上报 1 搜索结果商品 进入 0 正常商品
    qzone: { type: Boolean, default: false },
    upStyle: { type: Boolean, default: false },

    searchResult: { type: Boolean, default: false }, //搜索结果页 埋点 用
    index: { type: Number, default: 0 }, //搜索结果页 埋点 用
    home: { type: Boolean, default: false }, //商城首页页 埋点 用
    homeLocation: { type: Number, default: 0 }, //商城首页 埋点 用
    sneakerHome: { type: Boolean, default: false }, //商城首页页 埋点 用
    senakeLocation: { type: Number, default: 0 }, //商城首页 埋点 用
    trendGoods: { type: Number, default: 0 }, //潮流好物 埋点 用
    trafficport: { type: String, default: "" }, //潮流好物 传进来的频道名称
    position: { type: Number, default: 0 }, // 商城首页 传1  潮流好物 传2  这个是当前价、划掉价和多少人付款 的位置变化 3 大促活动
  },
  data() {
    return {
      classFindSim: -1,
      time: null,
      guishiIconType: false,
      isShowLowPrice: false,
    };
  },
  components: {
    brandName: {
      template: `<p class='ellipsis brand_name' :style="upStyle?'text-align:center;font-family:DINOT-CondBlack;font-size:12px;':'text-align:left;'">{{bName}}</p>`,
      props: {
        bName: { type: String },
        upStyle: { type: Boolean, default: false },
      },
    },
    brandName1: {
      template: `<p class='ellipsis brand_name' style="text-align:left;padding:0;">{{bName}}</p>`,
      props: {
        bName: { type: String },
      },
    },
    productName: {
      template: `<p class="pro-title product_name" style="-webkit-box-orient: vertical">{{pName}}</p>`,
      props: {
        pName: { type: String },
      },
    },
    businessName: {
      // template: `<p class="ellipsis business_name"><span class="mall_brandShop" :class="{mall_buyers:BusType==2}">{{nameShop}}</span>{{BusName}}</p>`,
      template: `<p v-if="!upStyle" class="ellipsis business_name"><i :class="typeClass"></i>{{BusName}}</p>`,
      props: {
        BusName: { type: String },
        BusType: { type: Number },
        upStyle: { type: Boolean, default: false },
      },
      computed: {
        // nameShop() {
        //   return this.BusType == 1 ? '品牌店' : '买手店'
        // }
        typeClass() {
          let typeClass = "";
          switch (this.BusType) {
            case 1: // 官方店
              typeClass = "ico-sp-official";
              break;
            case 2: // 买手店
              typeClass = "ico-sp-buy";
              break;
            case 3: // 专营店
              typeClass = "ico-sp-store";
              break;
          }
          return typeClass;
        },
      },
    },
    productPrice: {
      // template: `<p class="ellipsis product_price  font-price"   :style="upStyle?'text-align:center;font-size:15px;margin-bottom:0;':'text-align:left;'" :class="{pc2c: prodInfos.isc2c==1&&(!prodInfos.exchange),exhange: prodInfos.exchange }">
      //             <span v-if='prodInfos.salestatus!=1&&prodInfos.salestatus!=3 && prodInfos.isc2c==0 && prodType!=20'>???</span>
      //             <span v-if="!prodInfos.unOpen&&prodInfos.specialprice&&prodInfos.specialprice!=0&&prodInfos.specialprice!=prodInfos.saleprice&&prodType!=1" >
      //             ¥{{(prodInfos.specialprice?prodInfos.specialprice:prodInfos.saleprice)}}
      //             </span>
      //             <span v-if="!prodInfos.specialprice && prodInfos.saleprice">￥{{prodInfos.saleprice}}</span>
      //           </p>`,
      template: `<p class="ellipsis product_price  font-price"   :style="upStyle?'text-align:center;font-size:14px;margin-bottom:0;':'text-align:left;'" :class="{pc2c: prodInfos.isc2c==1&&(!prodInfos.exchange),exhange: prodInfos.exchange }">
                  <span v-if='prodInfos.salestatus!=1&&prodInfos.salestatus!=3 && prodInfos.isc2c==0 && prodType!=20'>???</span>
                  <span v-if="!prodInfos.unOpen&&prodInfos.specialprice&&prodInfos.specialprice!=0&&prodInfos.specialprice!=prodInfos.saleprice&&prodType!=1" >
                  ¥{{(prodInfos.specialprice)}}
                  </span>
                  <span :class='{gui:prodInfos.special}'><span style="font-size: 14px">￥</span><span style="font-size: 18px">{{(prodInfos.saleprice?prodInfos.saleprice:' — —')}}</span></span>
                </p>`,
      props: {
        prodInfos: {},
        prodType: { type: Number },
        upStyle: { type: Boolean, default: false },
        exchangeStyle: { type: Boolean, default: false },
      },
    },
    // prodInfos.unOpen
    productPrice1: {
      // template: `<p class="ellipsis product_price font-price"  style="text-align:left;padding:0;">
      //   <span v-if='prodInfos.salestatus!=1&&prodType==1'>???</span>
      //   <span v-if="!prodInfos.unOpen&&prodInfos.specialprice!=0&&prodInfos.specialprice!=prodInfos.saleprice&&prodType!=1" >
      //   ¥{{(prodInfos.specialprice)}}</span>
      //   <span :class='{gui:prodInfos.special}' v-if='this.productType!=13'>¥{{(prodInfos.saleprice) }}
      //   </span>
      //   </p>`,
      template: `<p class="ellipsis product_price font-price"  style="text-align:left;padding:0;">
        <span v-if='prodInfos.salestatus!=1&&prodType==1'>???</span>
        <span v-if="!prodInfos.unOpen&&prodInfos.specialprice!=0&&prodInfos.specialprice!=prodInfos.saleprice&&prodType!=1" >
        ¥{{(prodInfos.specialprice)}}</span>
        <span :class='{gui:prodInfos.special}' v-if='this.productType!=13'>¥{{(prodInfos.saleprice) }}
        </span>
        </p>`,
      props: {
        prodInfos: {},
        prodType: { type: Number },
      },
    },
  },
  mounted() {
    let _ = this;
    if (_.isFindSim === 1) _.findSimilar();

    if (_.guishiIcon === 1) _.guishiIconType = true;
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      localUserInfos: "userInfo",
      baseValue: "baseValue",
    }),
    info: function () {
      // pstatus:0正常1未开始2已经卖完 productType
      // productType: 0默认正常全展示商品，1:鬼市产品 ,2品牌商品,3潮店商品,4分类页商品,5折扣商品 6详情推荐商品 7潮店店铺详情商品 8 潮店折扣商品 9.找相似(左图右文布局) 10.牛币兑换（左图右文）11:牛币商城 产品列表  12.找相似推荐商品13.拼团  20 新商城首页
      // producttype: 0 普通,1 限 ,2 特卖/ 市,4 促销折扣,5 牛币兑换,6 签到领取,7 平台大促
      let info = this.productItem;
      var ty = typeof info.mainpic;
      if (info && ty === "string") {
        info.mainpic = info.mainpic.split("|");
      }

      info.unOpen = false;
      if (
        info.specialprice &&
        info.specialprice > 0 &&
        info.specialprice !== info.saleprice
      ) {
        info.realprice = info.specialprice;
        info.special = true;
        if (info.producttype === 7 && info.salestatus === 2) {
          info.unOpen = true; // 平台大促 状态
        }
      } else {
        info.special = false;
        info.realprice = info.saleprice;
      }
      if (info.realprice) {
        info.realprice = info.realprice;
      }

      if (info.isc2c && info.minprice == 0) info.saleprice = "— —";
      return info;
    },
    isfilter() {
      let _ = this,
        { id } = _.productItem,
        base = _.baseValue,
        filter = false;
      if (_.insq && base && base.configs && base.configs.filtergoodsinfront)
        filter = base.configs.filtergoodsinfront.indexOf(id) > -1;
      // console.log("=====>filter", id, filter)
      return filter;
    },
    // localUserInfos() {
    //   return JSON.parse(localStorage.getItem('currentUser'))
    // }
  },
  methods: {
    checkLow(info) {
      let _ = this;

      _.$parent.$children.forEach((i) => {
        if (i != _) i.isShowLowPrice = false;
        else _.isShowLowPrice = !_.isShowLowPrice;
      });
      // console.log('123',_.isShowLowPrice,_.info.crawweeksalecount)
    },
    findSimilar() {
      // 找相似.长按事件
      let _ = this;
      // let productImg = _.$refs.product_img;
      let productUnit = _.$refs.productUnit;
      // let time = null
      if (!productUnit) return;

      productUnit.addEventListener(
        "touchstart",
        () => {
          // 互斥关闭其他找相似蒙层
          _.$parent.$children.forEach((i) => {
            // console.log("i----", i);
            if (i != _) i.classFindSim = -1;
          });

          if (_.isFindSim === 1) {
            _.time = setTimeout(() => {
              _.classFindSim = 0;
            }, 400);
          }
        },
        false
      );
      productUnit.addEventListener(
        "touchmove",
        () => {
          clearTimeout(_.time);
        },
        false
      );
      productUnit.addEventListener(
        "touchend",
        () => {
          clearTimeout(_.time);
        },
        false
      );
    },
    openSim() {
      this.classFindSim = 0;
    },
    // 拼团
    // goToProductDetail(id) {
    //   console.log("拼团");
    //   this.$router.push({
    //     path: "/productDetail/"+id
    //   });
    // },
    findSimilarHide(ev) {
      clearTimeout(this.time);
      this.classFindSim = -1;
    },
    goSimil(id, isc2c) {
      this.$router.push(`/ProductSimil/${id}?t=${isc2c}`);
    },
    goFavor(item) {
      let _ = this;
      // console.log(item);
      // _.findSimilarHide()
      if (_.localUserInfos && _.localUserInfos.token) {
        var postData = {
          productid: item.id,
        };
        // console.log('收藏参数', postData)
        FavorProduct(postData)
          .then((res) => {
            // console.log(res);
            _.toast("收藏成功");
            _.findSimilarHide();
          })
          .catch((err) => {
            console.error("FavorProduct err", err);
            _.toast("收藏失败");
            // _.toast(err.msg)
          });
      } else {
        // if (_.$root.ISWX) {
        //   _.$router.push('/wxlogin')
        // } else {
        //   _.$router.push('/login')
        // }
        _.$router.push("/login");
      }
    },
    getProductDetail(proitem) {
      console.log("proitem", this.$route.params);
      let _ = this;
      // return
      let id = proitem.id;
      let isc2c = proitem.isc2c;

      if (_.searchResult || _.home || _.sneakerHome || _.trendGoods) {
        // 埋点处理
        let i = 0,
          name = "",
          setpara = {};
        if (_.searchResult) {
          i = _.index;
          name = "searchResultProductClick";
          setpara.shop = "";
          setpara.keyword = _.$route.params.key;
          setpara.t = 0;
        } else if (_.home) {
          name = "mallHomeProductClick";
          i = _.homeLocation;
          setpara.trafficport = i;
          setpara.t = 2;
        } else if (_.sneakerHome) {
          i = _.senakeLocation;
          name = "c2cHomeProductClick";
          setpara.t = 2;
        } else if (_.trendGoods) {
          name = "mall_fashiongood_product_click";
          setpara.trafficport = _.trafficport;
        }

        // 埋点
        setpara = {
          ...setpara,
          location: i,
          productid: id,
        };
        $log({ e: name, p: setpara, ext: 1 });
      }

      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: isc2c ? "gotoAppSneakerDetailPage" : "gotoAppProductDetailPage",
          params: { productid: id },
        });
      } else {
        _.$router.push(
          isc2c
            ? `/sneaker/detail/${id}${
                proitem.requestid ? `?rq=` + proitem.requestid : ``
              }`
            : `/productDetail/${id}?issearchclick=${
                _.issearchclick
              }&requestid=${proitem.requestid || ``}`
        );
      }
      // if (isc2c == 1) {
      //   return this.$router.push(
      //     "/sneaker/detail/" +
      //       id +
      //       (proitem.requestid ? "?rq=" + proitem.requestid : "")
      //   );
      // }
      // const qzoneProxy = process.env.GS_DONMIN; // 'https://1105091322.urlshare.cn'
      // const adChannel = "ADTAG";
      // let url = "/productDetail/" + id;
      // if (this.insq) {
      //   if (this.qzone) {
      //     this.qzoneGo(url);
      //     return;
      //   } else {
      //     // 20180414 列表商品跳转增加qzone代理跳转方式
      //     if (window.mqq) {
      //       url =
      //         qzoneProxy +
      //         url +
      //         "?_proxy=1&pf=wanba_ts.106" +
      //         "&" +
      //         adChannel +
      //         "=qzone";
      //       window.mqq.invoke("ui", "openUrl", {
      //         url: url,
      //         // 0为当前webview打开,1为新的webview打开,2为外部浏览器打开
      //         target: 1,
      //         // 0: 顶部标题栏模式（无底部工具栏）,1: 顶部标题栏无分享入口（无底部工具栏）,2: 底部工具栏模式（顶部标题依然会存在）,3: 底部工具栏模式且顶部无分享入口（顶部标题依然会存在）
      //         style: 0
      //       });
      //       return;
      //     }
      //   }
      // }
      // this.$router.push({
      //   path: url,
      //   query: {
      //     issearchclick: this.issearchclick,
      //     requestid: proitem.requestid ? proitem.requestid : ""
      //   }
      // });
      // this.insq ? this.qzoneGo(url) : this.$router.push(url)
    },
  },
};
</script>
<style scoped>
.info-title {
  width: 100%;
}
.productItem {
  background: #fff;
  position: relative;
}
.product-img-top {
  position: relative;
  min-height: 100px;
}

.product-img-top::after {
  content: "";
  display: inline-block;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  position: absolute;
  top: 0;
  left: 0;
}
/*找相似*/
.findSim_mask {
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.61);
  transform: scale(0, 0);
  z-index: 3;
}
.findSimAnimate {
  transform: scale(1, 1);
  transition: transform 0.3s;
}
.findSim_mask .findSim_wrap {
  margin: 0 auto;
  width: 40%;
  height: 100%;
  /* justify-content: space-around; */
}
.findSim_mask .findSim,
.findSim_mask .addSim {
  width: 32vw;
  height: 11.734vw;
  line-height: 11.734vw;
  background: #ffffff;
  border-radius: 5.867vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.addSim {
  margin-bottom: 30px;
}
.findSim .icon,
.addSim .icon {
  width: 5.86667vw;
  height: 5.86667vw;
  margin: 0 3px 0 0;
}
.findSim span,
.addSim span {
  color: #232323;
  font-size: 16px;
}
.productItem {
  box-sizing: border-box;
  /* border-radius: 1rem; */
  /* productItem */
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
  /* margin-bottom: 13px; */
}
.productItem.bordBox {
  border: 1px solid #f2f2f2;
}
/* .logo_prod {
  display: inline-block;
  position: absolute;
  z-index: 1;
  width: 42px;
  height: 38px;
  border-radius: 50%;
  right: 2px;
  top: 5px;
  background-size: 40px;
} */
/* .logo_prod.beeIcon {
  background-image: url(/static/img/prod_honey.png);
}
.logo_prod.ghostIcon {
  background-image: url(//files.eyee.com/mcdn/static/img/prod_ghost.png);
}
.logo_prod.delGhostIcon {
  background: none;
}
.logo_prod.discountIcon {
  background-size: 42px 38px;
  background-image: url(//files.eyee.com/mcdn/static/img/prod_discount.png);
}
.logo_prod.saleIcon {
  background-size: 42px 38px;
  background-image: url(//files.eyee.com/mcdn/static/img/prod_sale.png);
} */
.discount_num {
  display: inline-block;
  position: absolute;
  width: 42px;
  height: 20px;
  line-height: 20px;
  font-weight: 600;
  text-align: center;
  right: 2px;
  top: 8px;
  z-index: 2;
  font-size: 13px;
  color: #ffc700;
}
.productItem .product_img {
  width: 100%;
  overflow: hidden;
  height: 0px;
  padding-bottom: 100%;
  /*margin: 0;*/
  position: relative;
  margin: 0 0 2.666vw 0;
  /* border-radius: 1rem; */
}
/* .puzzle .productItem {
  margin: 0 1% 1% 1%;
  margin-bottom: 10px;
}
.puzzle .productItem .product_img{
    width: 40%;
} */
.product_img .activityicon {
  position: absolute;
  bottom: 0;
  width: 100%;
  /* height: 25px; */
  z-index: 1;
}
.product_img img {
  display: block;
}
.businessName p {
  float: left;
}
.businessName p:nth-child(2) {
  width: 90%;
}
.productItem p {
  text-align: left;
  margin: 0;
  width: 100%;
}
.productItem p span.product_pri {
  font-size: 20px;
  /* text-align: center;
  font-size:15px; */
  /* font-family:DINOT-CondBlack; */
  /* font-weight:normal; */
  /* color:rgba(51,51,51,1); */
  /* line-height:20px; */
}
.productItem p.product_price {
  /* padding: 0 5px; */
  text-align: left;
  font-size: 3.73vw;
  margin: 4.2667vw 0;
  font-weight: 700;
  font-family: OswaldBold;
}
.brand_name,
.product_name,
.business_name {
  font-size: 0.55rem;
  /* padding: 0 5px; */
  margin: 2px 0;
}
.brand_name {
  color: #333;
  font-weight: 600;
}
.productItem .product_name {
  color: #333;
  /* font-weight: 600; */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 9.166vw;
  font-size: 13px;
  margin-bottom: 5.866vw;
}
.productItem .product_name.low {
  margin-bottom: 5.866vw;
}
.pro-title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
}
.productItem p.pc2c {
  margin-bottom: 4.2667vw;
}
.exhange {
  font-size: 24px !important;
  /* font-family:PingFangSC-Semibold; */
  font-weight: 600;
  margin-bottom: 0;
}
.business_name {
  color: #a5a5a5;
}
.product_price {
  font-size: 0.94rem;
  color: #333;
}

.bigItem {
  padding: 15px;
}
.logo_head {
  width: 85%;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px auto 0;
}
.Info_logo {
  width: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.Info_logo div {
  font-size: 0.875rem;
  width: 75%;
}
.fev {
  text-align: center;
  position: absolute;
  right: 0;
  font-size: 0.75rem;
  color: #999;
}
.fev span {
  display: block;
  width: 20px;
  height: 20px;
  background-size: 100%;
  margin: 0 auto;
}
.Info_logo img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1px solid #f2f2f2;
  margin-right: 15px;
}
.bigItem .product_name,
.bigItem .brand_name {
  font-size: 0.875rem;
  color: #333;
  /* text-align: left; */
  padding: 0;
}
.bigItem .product_name {
  font-size: 0.75rem;
  color: #999;
}
.bigItem .product_price {
  width: 85%;
  background-color: #333;
  color: #fff;
  text-align: center;
  margin: 20px auto 0;
  border-radius: 5px;
  font-size: 0.875rem;
  height: 38px;
  line-height: 38px;
  font-size: 18px;
}

/*传入type9 的样式*/
.type9 {
  position: relative;
  display: flex;
  width: 100%;
  /* height:150px; */
  padding: 8px;
  background: #fff;
  margin-bottom: 0;
}
.type9 .ImgWrap {
  position: relative;
  width: 35%;
  /* padding-bottom: 26%; */
  padding-top: 35%;
  overflow: hidden;
}
.type9 .ImgWrap img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.type9 .textWrap {
  padding: 10px 0px 10px 20px;
  width: 60%;
  display: flex;
  align-items: center;
}
.type13 {
  box-shadow: 0px 0px 5px #ccc;
  margin: 5px;
  margin-bottom: 15px;
  border-radius: 5px;
  width: 97%;
}

.grouptype {
  margin: 0;
  width: 100%;
}
.grouptypeBox {
  margin: 0;
  width: 100%;
  box-shadow: none;
  border-bottom: 1px solid #f2f2f2;
  /* padding: 0; */
}
/* .type13 .ImgWrap {
  width: 43%;
} */
.type13 .textWrap {
  width: 40%;
  padding-left: 10px;
}
.type13 .textWrap p {
  font-size: 12px;
}
.type13 .textWrap p.font-price {
  font-size: 16px;
}
.type13 .textWrap .product_names p.pin {
  color: #999;
  margin-top: 6px;
}
.type13 .textWrap p.pin .pnu {
  color: #ffc700;
  position: relative;
  margin-right: 5px;
}
.type13 .textWrap p.pin .pnu.red {
  color: #999;
}
.type13 .textWrap p.pin .pnu::after {
  content: "";
  position: absolute;
  width: 2px;
  height: 2px;
  background: #999;
  border-radius: 50%;
  right: -6px;
  top: 6px;
}
.gototuan {
  position: relative;
  /* overflow: hidden; */
  width: 20%;
}
.gototuan .headImg img {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  float: left;
  margin-right: 2px;
}
.gototuan .goContent {
  position: absolute;
  bottom: 10px;
  top: auto;
}
.gototuan .goContent .headImg {
  margin-bottom: 5px;
  overflow: hidden;
}
.gototuan span {
  background: #ffc700;
  font-size: 12px;
  color: #333333;
  padding: 2px 6px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.type9 .textWrap .product_names {
  width: 100%;
}
.type9 .textWrap .product_names > p {
  margin: 3px 0px;
}
.type9 .textWrap .product_names .product_name {
  margin-bottom: 10px;
}
.prod_honeyPrice {
  font-size: 14px;
  color: #333;
}
.prod_honeyPrice > em {
  display: inline-block;
  width: 13px;
  height: 14px;
  background: url(/static/img/honey_black.png) no-repeat center;
  background-size: cover;
  vertical-align: middle;
  margin: 0 3px;
}
.type9 .textWrap .product_names .font-price-type9 {
  margin-top: 20px;
  font-size: 16px;
  margin-bottom: 6px;
}
.product_img.soldout > label {
  position: absolute;
  display: inline-block;
  width: 100%;
  height: 40px;
  top: 50%;
  margin-top: -20px;
  background: url(//files.eyee.com/mcdn/static/img/sneaker/soldout.png)
    no-repeat center;
  background-size: contain;
}

.productItem .sale-count {
  font-size: 10px;
  font-weight: 400;
  color: #999;
  line-height: 14px;
  height: 1rem;
  margin-bottom: 12px;
  align-items: flex-end;
}
.sale-count ._left {
  flex: 1;
}
.sale-count ._left .price {
  position: relative;
}
.sale-count ._left .price .rmb {
  margin-top: 1.066vw;
}
.sale-count ._left .price .txt {
  position: absolute;
  left: -2.133vw;
  top: -5.733vw;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  height: 5.687vw;
  width: 16vw;
  background: #232323;
  border-radius: 2px;
  transform: scale(0.75);
}
.sale-count .point {
  font-style: normal;
  width: 50px;
  padding: 12px;
  text-align: right;
  display: inline-block;
  line-height: 5px;
  background: url("/static/point.png") 0 0 no-repeat;
  background-size: 100% auto;
}
.sale-count .point span {
  width: 3px;
  height: 3px;
  /* display: inline-block; */
}
.exchange-price div {
  line-height: 7vw;
}
.exchange-pay-number {
  font-size: 12px;
  width: 100%;
  text-align: right;
  margin-bottom: 4.2667vw;
}
.ic_product_more {
  height: 5vw;
  width: 4vw;
  margin-left: 2vw;
}
.exchange-bull {
  text-align: left;
  width: 90%;
}
/* .productItem .info_box {
  padding-right: 2.66vw;
} */
.productItem .info_box span {
  padding: 0;
}
.productItem .info_box .del_price {
  text-decoration: line-through;
  height: 4.8vw;
  line-height: 4.8vw;
  position: relative;
  top: 0.5333vw;
  font-size: 12px;
  color: #969696;
  font-weight: bold;
}
.productItem .info_box .sale-count {
  margin-bottom: 5.3333vw;
  height: 7.2vw;
  position: relative;
}
.productItem .info_box .sale-count .price {
  height: 7.2vw;
  /* line-height: 6.2vw; */
  font-size: 18px;
  color: #232323;
  font-family: "OswaldBold";
  margin-right: 1.3333vw;
}
.productItem .info_box .sale-count .price span {
  font-size: 14px;
}
.productItem .info_box .sale-count .isPay {
  font-size: 12px;
  color: #646464;
  font-weight: 400;
  padding-top: 1.6vw;
  position: relative;
  font-weight: bold;
}
.productItem .info_box .sale-count .isPay.yellow {
  color: #c8af6e;
}
.isPay .txt {
  position: absolute;
  left: 0;
  top: -4vw;
  font-size: 12px;
  color: #c8af6e;
  font-weight: bold;
}
.productItem .info_box .sale-count .point {
  /* width: 4.266vw; */
  /* margin: 0; */
  /* line-height: 5px;
  position: absolute;
  bottom: 2vw;
  right: 0; */
  width: 14px;
  height: 8vw;
  position: relative;
}

.low-price-modal {
  position: absolute;
  right: 0;
  bottom: -29.333vw;
  width: 37.33vw;
  background: #ffffff;
  border: 1px solid #e6e6e6;
  border-radius: 2.133vw;
  padding: 3.2vw 0;
  z-index: 3;
}

.low-price-modal .li {
  margin-bottom: 2.133vw;
  margin-left: 3.2vw;
}

.low-price-modal .day {
  height: 3.733vw;
  padding: 0 1.6vw;
  background: #c8af6e;
  border-radius: 1.866vw;
  font-size: 2.133vw;
  font-weight: 600;
  color: #ffffff;
  margin-right: 1.6vw;
}

.low-price-modal .total-peop {
  font-size: 3.466vw;
  font-weight: 600;
  color: #c8af6e;
}
</style>
