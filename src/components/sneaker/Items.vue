<template>
  <div class="product-items" :class="{show:show}">
    <div class="pi-bg" @click="close"></div>
    <div class="pi-main">
      <div class="flex pi-top">
        <div class="pi-img">
          <img :src="https(info.mainpic||skc.ck.headimg)" alt>
        </div>
        <div class="pi-info">
          <p class="font-price">
            <span>¥{{(isExt ? skc.ck.saleprice : info.price) || ' — —'}}</span>
            <span class="del" v-if="info.delprice > 0">{{info.delprice.toFixed(2)}}</span>
          </p>
          <p class="flex-between">
            已选：{{info.size?'"'+info.size+'"':(`"${skc.ck.color || ''}${skc.ck.size?'，':''}${skc.ck.size || ''}"`)}}
            <img
              v-if="type === 1"
              src="/static/imgs/search/realthing.png"
              alt
              class="reminder"
            >
          </p>
          <i class="ico-X close" @click="close"></i>

          <template v-if="type === 0">
            <span
              class="merchant merchant-become"
              v-if="seller === 1"
              @click.stop="applyShop"
            >成为入驻商家赚更多</span>
            <p class="merchant merchant-is flex-aic" v-else-if=" seller !== 1">
              <i class="ico-yes"></i>
              <span>您已是入驻商家</span>
            </p>
          </template>
        </div>
      </div>

      <div class="pi-content pi-wrap" v-if="!isExt">
        <div
          class="flex-col flex-center size-cell"
          v-for="(item,index) in sizes"
          :key="index"
          :class="{active:selectedIndex === index}"
          @click="selectSize(index)"
        >
          <span class="font-price" style="font-size:20px;  margin-bottom: 1.3333vw;">{{item.size}}</span>
          <span>¥ {{item.lowerprice || ' --'}}</span>
        </div>
      </div>
      <div class="pi-content" v-else>
        <div v-show="skc.colors.length>0">
          <p>颜色</p>
          <div class="flex-wrap">
            <div
              class="flex-center color-cell"
              v-for="(ci, cIdx) in skc.colors"
              :key="'color'+cIdx"
              :class="{active:ci.colorid === skc.ck.colorid}"
              @click="toggleSkc(0,ci)"
            >
              <span>{{ci.color}}</span>
            </div>
          </div>
        </div>
        <div v-show="skc.sizes.length>0">
          <p>规格</p>
          <div class="flex-wrap">
            <div
              class="flex-col flex-center size-cell"
              v-for="(si,sIdx) in skc.sizes"
              :key="'size'+sIdx"
              :class="{active:si.sku === skc.ck.sku}"
              @click="toggleSkc(1,si)"
            >
              <span class="font-price">{{si.size}}</span>
              <span>¥ {{si.saleprice || ' --'}}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-show="info.size||isExt">
        <template v-if="isExt">
          <button
            class="pi-bottom flex-center fix-btm"
            :disabled="type == 1&&!skc.ck.saleprice"
            @click="skcSubmit"
          >
            <span>{{type == 0 ?'发布出售':(skc.ck.saleid&&skc.ck.saleprice?`¥${skc.ck.saleprice} 立即购买`:'暂无售价 不能购买')}}</span>
          </button>
        </template>
        <template v-else>
          <div
            v-if="isadvancesale == 0"
            class="pi-bottom flex-center fix-btm"
            @click="submit(0)"
            :class="{unselected : noitem}"
          >
            <span v-if="type === 0">现货出售</span>
            <span v-else-if="type === 1">{{buyText}}</span>
          </div>
          <div
            v-if="isadvancesale == 1 && type === 0"
            class="pi-bottom flex-center fix-btm"
            @click="submit(1)"
            :class="{unselected : noitem}"
            style="width:50%"
          >
            <span>发布预售</span>
          </div>
          <div
            v-if="isadvancesale == 1 && type === 0"
            class="pi-bottom flex-center fix-btm"
            @click="submit(0)"
            :class="{unselected : noitem}"
            style="margin-left:50%;width:50%;background-color:#FFC700"
          >
            <span>发布现货</span>
          </div>
          <div
            v-show="showBtnLeft && showBtnRight  && type === 1"
            v-if="isadvancesale == 1"
            class="pi-bottom flex-center fix-btm"
            @click="submit(1)"
            :class="{unselected : noitem}"
            style="width:50%"
          >
            <span>{{advanceBuyText}}</span>
          </div>
          <div
            v-show="showBtnLeft && showBtnRight  && type === 1"
            v-if="isadvancesale == 1"
            class="pi-bottom flex-center fix-btm"
            @click="submit(0)"
            :class="{unselected : noitem}"
            style="margin-left:50%;width:50%;background-color:#FFC700"
          >
            <span>{{buyText}}</span>
          </div>
          <div
            v-show="showBtnLeft && !showBtnRight  && type === 1"
            v-if="isadvancesale == 1"
            class="pi-bottom flex-center fix-btm"
            @click="submit(1)"
            :class="{unselected : noitem}"
          >
            <span>{{advanceBuyText}}</span>
          </div>
          <div
            v-show="!showBtnLeft && showBtnRight  && type === 1"
            v-if="isadvancesale == 1"
            class="pi-bottom flex-center fix-btm"
            @click="submit(0)"
            :class="{unselected : noitem}"
          >
            <span>{{buyText}}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { GetItems, GetSkcSizes } from "@/common/api/sneaker";

export default {
  props: {
    show: { type: Boolean, default: false },
    productInfo: Object,
    type: { type: Number, default: 0 }, //组件类型，出售为0，购买为1
    selectColor: String
  },
  data() {
    return {
      sizes: [],
      selectedIndex: "",
      firstAjax: true,
      seller: 1, // 1: 个人，2：商家
      lowestprice: null,
      isadvancesale: 0,
      status: 0,
      // earnestmoneystatus: 0
      salemoneystatus: 0, //1-现货保证金不足,2-现货保证金充足
      advancemoneystatus: 0, //1-预售保证金不足,2-预售保证金充足

      pledgemessage: {},

      skc: {
        colors: [],
        sizes: [],
        ck: {}
      }
    };
  },
  computed: {
    // 是否是扩品类
    isExt() {
      // "producttype":21、鞋子 22、服装
      return this.productInfo.producttype == 22;
    },
    ckSize() {
      let { sizes, selectedIndex } = this;
      return (sizes || [])[selectedIndex || 0];
    },
    info() {
      let _ = this,
        { ckSize, isExt } = _,
        info = {};
      info = { ..._.productInfo };
      if (!isExt) {
        info.mainpic = ((info.imgs && info.imgs[3]) || "").split(",")[0];
      }
      info = _.dealPrice(info);
      if (ckSize) {
        if (ckSize.saleprice) {
          info.price = ckSize.saleprice;
        } else if (ckSize.advancesaleprice) {
          info.price = ckSize.advancesaleprice;
        } else {
          info.price = undefined;
        }
        info.size = ckSize.size;
      }else info.price = _.skc.ck.saleprice;
      return info;
    },
    noitem() {
      let _ = this,
        { productInfo } = _;
      if (_.type === 1) {
        // console.log("this.selectedIndex === '' || !this.info || !this.info.price",this.selectedIndex === '' || !this.info || !this.info.price)
        // console.log("this.selectedIndex === '' ", this.selectedIndex )
        // console.log("!this.info ", !this.info,this.info )
        // console.log("!this.info.price ", !this.info.price,this.info.price )
        return _.selectedIndex === "" || !_.info || !_.info.price;
      } else {
        return _.selectedIndex === "";
      }
    },
    buyText() {
      let { ckSize, selectedIndex } = this;
      let price = ckSize && ckSize.saleprice;
      if ((selectedIndex && price) || (selectedIndex === 0 && price)) {
        return `¥${Number(price).toFixed(2)} 立即购买`;
      } else if ((selectedIndex && !price) || (selectedIndex === 0 && !price)) {
        return "暂无售价 不能购买";
      } else {
        return "请选择尺码";
      }
    },
    advanceBuyText() {
      let { ckSize, selectedIndex } = this;
      let advanceprice = ckSize && ckSize.advancesaleprice;
      if (
        (selectedIndex && advanceprice) ||
        (selectedIndex === 0 && advanceprice)
      ) {
        return `预售 ¥${Number(advanceprice).toFixed(2)}`;
      } else if (
        (selectedIndex && !advanceprice) ||
        (selectedIndex === 0 && !advanceprice)
      ) {
        return "暂无售价 不能购买";
      } else {
        return "请选择尺码";
      }
    },
    showBtnLeft() {
      let { ckSize, selectedIndex } = this,
        price,
        advanceprice;
      if (ckSize) {
        price = ckSize.saleprice;
        advanceprice = ckSize.advancesaleprice;
      }
      if (
        (selectedIndex && !advanceprice) ||
        (selectedIndex === 0 && !advanceprice)
      ) {
        if ((selectedIndex && price) || (selectedIndex === 0 && price)) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    showBtnRight() {
      let { ckSize, selectedIndex } = this;
      let price = ckSize && ckSize.saleprice;
      if ((selectedIndex && price) || (selectedIndex === 0 && price)) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    show(val, old) {
      // console.log("watch show ", val);
      let _ = this;
      if (val) {
        _.getItems();
      }
      document.body.classList[val ? "add" : "remove"]("lock");
    }
  },
  // mounted() {
  // },
  beforeDestroy() {
    document.body.classList.remove("lock");
  },
  methods: {
    toggleSkc(isSize, item) {
      let _ = this,
        { colors, sizes, ck } = _.skc;
      if (item.colorid == ck.colorid || item.sku == ck.sku) return;
      _.skc.ck = { ...ck, ...item };
     
      if (!isSize) _.getSkcSizes(item);
    },
    getItems() {
      let _ = this,
        { productInfo: info, selectColor, isExt } = _;
      GetItems({
        productid: info.productid,
        type: _.type
      })
        .then(res => {
          _.isadvancesale = res.isadvancesale;
          _.status = res.status;
          // _.earnestmoneystatus = res.earnestmoneystatus
          _.salemoneystatus = res.salemoneystatus;
          _.advancemoneystatus = res.advancemoneystatus;
          _.seller = res.type;
          _.lowestprice = res.lowestprice;
          // _.sizes = res.list || [];

          if (
            res.lowpledge ||
            res.advancelowpledge ||
            res.nowpledge ||
            res.nowpledge ||
            res.paypledge ||
            res.advancepaypledge
          ) {
            _.pledgemessage = {
              lowpledge: res.lowpledge,
              advancelowpledge: res.advancelowpledge,
              nowpledge: res.nowpledge,
              paypledge: res.paypledge,
              advancepaypledge: res.advancepaypledge
            };
          }

          if (isExt) {
            if( res.list){
              let colors = res.list || [],
              ckColor =
                colors.find(i => i.colorid == selectColor) ||
                colors.find(i => i.colorid == selectColor || i.islowest);

              _.skc.colors = colors;

              _.getSkcSizes(ckColor);
            }
            
          } else {
            _.sizes = (res.list || []).map(i => {
              if (i.saleprice && i.advancesaleprice) {
                if (i.saleprice > i.advancesaleprice) {
                  i.lowerprice = i.advancesaleprice.toFixed(2);
                } else {
                  i.lowerprice = i.saleprice.toFixed(2);
                }
              } else if (i.saleprice && !i.advancesaleprice) {
                i.lowerprice = i.saleprice.toFixed(2);
              } else if (!i.saleprice && i.advancesaleprice) {
                i.lowerprice = i.advancesaleprice.toFixed(2);
              }
              return i;
            })
            console.log("_.sizes", _.sizes);
          }
        })
        .catch(e => {
          console.error("GetItems error: ", e);
        });
    },
    getSkcSizes(color) {
      let _ = this,
        { productInfo: info } = _;
      GetSkcSizes({ productid: info.productid, colorid: color.colorid })
        .then(res => {
          // console.log("GetSkcSizes res: ", res);
          let sizes = res || [],
            ckSize = sizes.find(i => i.islowest) || sizes[0] || {};
          _.skc.sizes = sizes;
          ckSize.saleprice = Number(ckSize.saleprice);
          _.skc.ck = { ...ckSize, ...color };
        })
        .catch(e => {
          console.error("GetSkcSizes error: ", e);
        });
    },
    close() {
      this._close();
    },
    _close(payload = null) {
      this.$emit("close", payload);
    },
    applyShop() {
      let dis = {
        id: this.$route.params.id,
        detailtype: 1
      };
      this.$store.dispatch("detailtype", dis);
      this.$router.push("/shopinto");
    },
    dealPrice(i) {
      i.delprice = 0;
      if (i.specialprice > 0 && i.specialprice !== i.saleprice) {
        i.price = i.specialprice;
        i.delprice = i.saleprice;
      } else if (i.groupPrice < 999999 && this.isGroupBuy) {
        i.price = i.groupPrice;
      } else {
        i.price = i.saleprice;
      }

      return i;
    },

    selectSize(index) {
      if (this.selectedIndex === index) {
        this.selectedIndex = "";
        return;
      }
      this.selectedIndex = index;
    },

    submit(sellType) {
      let _ = this;
      if (_.noitem) {
        return;
      }
      let { info, sizes, selectedIndex } = _,
        ckSize = sizes[selectedIndex];
      let ret = {
        expresstemplateid: info.expresstemplateid,
        saleid: ckSize.saleid,
        advancesaleid: ckSize.advancesaleid,
        brandsizeid: ckSize.brandsizeid,
        type: _.seller,
        price: info.price,
        productid: info.productid,
        color: info.color,
        productname: info.productname,
        size: ckSize.size,
        mainpic: info.mainpic,
        maxprice: ckSize.maxprice,
        advancesaleprice: ckSize.advancesaleprice,
        lowestprice: _.lowestprice,
        isadvancesale: _.isadvancesale,
        // earnestmoneystatus: _.earnestmoneystatus,
        salemoneystatus: _.salemoneystatus,
        advancemoneystatus: _.advancemoneystatus,
        status: _.status,
        sellType: sellType,

        pledgemessage: _.pledgemessage
      };
      if(!_.$root.isdebug)  {
        window.gio("track", "PresaleBuy",{'PresaleId':ret.productid,'PresaleName':ret.productname,'PresaleSource':'h5'});
      }
        
      _._close({ ...ret });
    },
    skcSubmit() {
      let _ = this,
        { info, skc, seller, status, salemoneystatus, pledgemessage } = _;
        // console.log(skc.ck)
      _._close({
        // ...info,
        productid: info.productid,
        brandsizeid: info.brandsizeid || "",
        seller: info.seller,
        count: info.count,
        producttype: info.producttype,
        isadvancesale: info.isadvancesale,
        advancesaleprice: info.advancesaleprice,
        price: info.price,
        pledgemessage: info.pledgemessage,
        productname: info.productname,
        lowestprice: skc.ck.minprice||_.lowestprice,
        ...skc.ck,
        seller,
        status,
        salemoneystatus,
        pledgemessage,
        sellType: 0
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.reminder {
  width: 50%;
  float: right;
}
.product-items {
  position: fixed;
  z-index: 101;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.product-items.show {
  pointer-events: auto;
}
.pi-bg {
  width: 100%;
  height: 100%;
  background-color: transparent;
  opacity: 0;
  transition: all 0.2s ease;
}
.show .pi-bg {
  background-color: #000;
  opacity: 0.5;
}
.pi-main {
  position: absolute;
  left: 0;
  bottom: 0;
  transform: translateY(150%);
  transition: transform 0.3s ease-out;
  width: 100%;
  // height: 75%;
  background-color: rgb(245, 245, 249);
  padding-bottom: 13.333vw;
}
.show .pi-main {
  transform: translateY(0);
}

.pi-top {
  padding-top: 10px;
  height: 20.2667vw;
  background-color: #fff;
  position: relative;
}

.pi-top .pi-img {
  width: 21.3333vw;
  margin: -30px 10px 0;
}
.pi-img img {
  border-radius: 2px;
}
.pi-top .pi-info {
  max-width: 80vw;
}

.pi-info .font-price {
  font-size: 6.4vw;
}
.pi-info p:not(.font-price) {
  font-size: 12px;
  color: #666;
  margin-top: 10px;
}

.close {
  position: absolute;
  top: 2.1333vw;
  right: 4.1333vw;
  width: 5.3333vw;
  height: 5.3333vw;
}

.pi-content {
  padding: 2.1333vw;
  padding-right: 0;
  // padding-bottom: 15.5vw;
  height: 49.5vh;
  overflow: auto;
  
}
.pi-content.pi-wrap{
  padding: 2.1333vw;
  padding-right: 0;
  // padding-bottom: 15.5vw;
  height: 49.5vh;
  overflow: auto;
   display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
.pi-content p {
  margin-bottom: 10px;
  font-size: 14px;
}

.size-cell,
.color-cell {
  width: 22.4vw;
  height: 22.4vw;
  margin-right: 2.05vw;
  margin-bottom: 2.1333vw;
  color: #333;
  background-color: #fff;
  font-size: 14px;
  border-radius: 0.5333vw;
  font-weight: 600;
  transition: all 0.2s ease;
}
.size-cell.active,
.color-cell.active {
  background-color: #333;
  color: #fff;
}
.size-cell span:first-of-type {
  font-size: 20px;
  margin-bottom: 5px;
}

.pi-bottom {
  height: 11.733vw;
  width: 100%;
  font-size: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  box-sizing: content-box;
  background-clip: content-box;
  span {
    color: #fff;
  }
}
.pi-bottom:not(:disabled) {
  background-color: #333;
}

.unselected {
  background-color: rgb(177, 177, 177);
  color: #fff;
}

.pi-info {
  .merchant {
    position: absolute;
    right: 0;
    bottom: 2.3333vw;
    font-size: 2.6667vw;
    padding-right: 2.6667vw;
  }

  .merchant-become {
    border: 1px solid #333;
    // height: 6.4vw;
    width: 33vw;
    text-align: center;
    line-height: 6.4vw;
    border-radius: 3.2vw;
    right: -3vw;
  }
  .merchant.merchant-is {
    right: 3.7333vw;
    line-height: 24px;
    background: #d3d3d3;
    border-radius: 12px;
    color: #fff;
    padding: 0 8px;
  }

  .merchant-is span {
    margin-left: 5px;
  }
}
</style>
