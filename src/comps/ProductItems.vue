<template>
  <div class="product-items" :class="{ show: show }">
    <div class="pi-bg" @click="close"></div>
    <div class="pi-main max">
      <p class="head-title">
        {{ info.color || info.size ? "已选:" : "请选择颜色" }}
        {{ info.color ? '"' + info.color + '"' : "" }}
        {{ info.size ? '"' + info.size + '"' : "" }}
      </p>
      <div class="scrollContent">
        <div class="head-img">
          <div class="head-img-left">
            <div class="active-img" v-if="info.delprice > 0">
              <img
                src="../assets/img/imageActive.png"
                style="width: 9.867vw; height: 4.8vw;"
              />
            </div>
            <div class="price-num">
              <span v-if="info.price">
                <i class="rmb">¥</i><span>{{ info.price }}</span>
              </span>
              <!-- <span class="del" v-if="info.delprice > 0">
              <i class="rmb">¥</i>
              <span>{{ info.delprice }}</span>
            </span> -->
            </div>
            <div class="img-code">
              <div class="img-left">
                <img :src="info.brandlogo" style="width: 50px;" />
              </div>
              <div class="img-right">
                <div>
                  <img src="../assets/img/icon_qr.png" style="width: 5rem;" />
                </div>
                <div class="code-num flex flex-btwn">
                  <span
                    v-for="(item, index) in qrcodenumber.split('')"
                    :key="'qr' + index"
                  >
                    {{ item }}
                  </span>
                </div>
                <!-- <div>2222</div> -->
              </div>
            </div>
          </div>
          <div class="head-img-right" v-if="isShowImg">
            <img
              :src="info.colorimg || info.mainpic | https"
              alt
              style="width: 29.3vw; height: 29.3vw;"
            />
          </div>
        </div>
        <div class="pi-opts">
          <div class="flex-col" style="margin-bottom: 5.3vw;">
            <label>规格</label>
            <div class="pi-cells flex-wrap size">
              <span
                v-for="(i, idx) in sizes"
                :key="i.id"
                :class="{
                  disable: !i.ok,
                  act: i.ok && idx === sizeSelectedIdx,
                }"
                @click="ckCell('size', idx)"
                >{{ i.sizeName }}</span
              >
            </div>
          </div>
          <div class="flex-col">
            <label>颜色</label>
            <div class="pi-cells flex-wrap">
              <span
                v-for="(i, idx) in colors"
                :key="i.id"
                :class="{
                  disable: !i.ok,
                  act: i.ok && idx === colorSelectedIdx,
                }"
                @click="ckCell('color', idx)"
                class="flex-center"
              >
                <img :src="https(i.colorimg)" alt srcset />
                {{ i.colorName }}
              </span>
            </div>
          </div>
          <div class="flex-between pi-count-box">
            <label>数量</label>
            <div class="flex-col flex-end">
              <div class="pi-count flex-aic">
                <i
                  v-if="!isDistribution"
                  class="ico-cut"
                  @click="cgCount(-1)"
                ></i>
                <span class="num">{{ count }}</span>
                <i
                  v-if="!isDistribution"
                  class="ico-add"
                  @click="cgCount(1)"
                ></i>
              </div>
              <div>
                <span
                  class="color-red"
                  v-show="info.stockcount > 0 && info.stockcount < 6"
                  >(仅剩{{ info.stockcount }}件)</span
                >
                <span
                  class="color-red"
                  v-show="info.limitcount > 0 && count >= info.limitcount"
                  >(限购{{ info.limitcount }}件)</span
                >
              </div>
            </div>
          </div>
          <span v-if="!isShowImg" style="font-size: 12px; color: #999;"
            >(如多件商品需要跟换颜色规格,请选择具体数量)</span
          >
        </div>
      </div>
      <div class="pi-bottom bottomBtn">
        <button type="button" :disabled="noitem" @click="submit">
          {{ btntxt }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { ProdGetItems } from "@/common/api/product";
import { ENUM } from "@/common/util";
const PT = ENUM.ProductType;
export default {
  name: "ProductItems", // usage tag: product-items
  props: {
    qrcodenumber: { type: [Number, String], default: null },
    show: { type: Boolean, default: false },
    isShowImg: { type: Boolean, default: true }, // 售后传过来  是否显示商品图片 false不显示图片  true 显示图片
    productInfo: Object,
    isGroupBuy: { type: Boolean, default: false },
    isDistribution: { type: Boolean, default: false },
    helpType: { type: Boolean, default: false },
    btntxt: { type: String, default: "确定" },
  },
  data() {
    return {
      ifFirstAjax: true,
      productInfoBase: {},
      count: 1,
      colorSelectedIdx: -1,
      sizeSelectedIdx: -1,
      propertyList: [],
      colors: [],
      sizes: [],
    };
  },
  computed: {
    noitem() {
      return this.colorSelectedIdx < 0 || this.sizeSelectedIdx < 0;
    },
    info() {
      this.productInfoBase = { ...this.productInfo };
      if (this.productInfo && this.productInfo.id) {
        this.productInfoBase.mainpic = this.productInfoBase.mainpic.split(
          "|"
        )[0];
        this.productInfoBase = this.dealPrice(this.productInfoBase);
        if (!this.isDistribution) {
          this.getItems();
        }
      }

      let colorSelectedItem = this.colors[this.colorSelectedIdx] || {};
      let sizeSelectedItem = this.sizes[this.sizeSelectedIdx] || {};

      let okcolor = [];
      let oksize = [];
      let item = {};

      this.propertyList.map((i) => {
        if (
          this.colorSelectedIdx < 0 ||
          (colorSelectedItem.id === i.colorid && i.stockcount > 0)
        )
          oksize.push(i.sizeid);
        if (
          this.sizeSelectedIdx < 0 ||
          (sizeSelectedItem.id === i.sizeid && i.stockcount > 0)
        )
          okcolor.push(i.colorid);

        if (
          colorSelectedItem.id === i.colorid &&
          sizeSelectedItem.id === i.sizeid
        )
          item = { ...i };
      });

      this.colors = this.colors.map((c) => {
        c.ok = okcolor.findIndex((f) => f === c.id) > -1;
        return c;
      });
      this.sizes = this.sizes.map((s) => {
        s.ok = oksize.findIndex((f) => f === s.id) > -1;
        return s;
      });

      if (!item.id) {
        item = {
          ...this.productInfoBase,
          stockcount: 0,
          colorid: colorSelectedItem.id,
          color: colorSelectedItem.colorName,
          sizeid: sizeSelectedItem.id,
          size: sizeSelectedItem.size,
        };
      }

      if (this.isGroupBuy) {
        item.price = this.productInfoBase.price;
      }
      item.limitcount = this.productInfoBase.limitcount;
      item.brandlogo = this.productInfoBase.brandlogo;
      console.log("222222", item);
      return item;
    },
  },
  methods: {
    getItems() {
      if (
        (this.productInfo.productid && this.ifFirstAjax) ||
        (this.productInfo.productid && this.isDistribution)
      ) {
        this.ifFirstAjax = false;
        this.count = 1;
        this.colorSelectedIdx = -1;
        this.sizeSelectedIdx = -1;

        // ProdGetItems
        let optionsparam; // , IsGetProductItems
        // if(this.isShowImg){

        //   IsGetProductItems = ProdGetItems
        // }else{
        //     optionsparam ={
        //       orderItemId: this.productInfoBase.orderitemid
        //     }
        //      IsGetProductItems = GetProductItems
        // }
        optionsparam = {
          productid:
            this.productInfoBase.productid || this.productInfo.productid,
        };
        if (this.isDistribution) {
          optionsparam = {
            productid: this.productInfo.productid,
          };
        }

        ProdGetItems(optionsparam)
          .then((res) => {
            if (res && res.length > 0) {
              console.log("111111");
              let colors = [];
              let sizes = [];
              let colorIndex = 0;
              let sizeIndex = 0;

              let resultTemp = res.map((i) => {
                colorIndex = i.colororder;
                sizeIndex = i.sizeorder;

                if (colors[colorIndex])
                  if (colors[colorIndex].id !== i.colorid) colorIndex++;

                colors[colorIndex] = {
                  colorName: i.color,
                  id: i.colorid,
                  colorimg: i.colorimg,
                  ok: true,
                };

                if (sizes[sizeIndex])
                  if (sizes[sizeIndex].id !== i.sizeid) sizeIndex++;

                sizes[sizeIndex] = {
                  sizeName: i.size,
                  id: i.sizeid,
                  ok: true,
                };

                i = this.dealPrice(i);
                return i;
              });

              if (colors.length > 0) colors = colors.filter((i) => i);
              if (sizes.length > 0) sizes = sizes.filter((i) => i);

              this.colors = colors;
              this.sizes = sizes;
              this.propertyList = resultTemp;
              console.log("deal items: ", colors, sizes);
            } else this.toast("商品已下架");
          })
          .catch((e) => {
            console.error("商品子项加载失败", e);
          });
      }
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
      //  else if(i.helpPrice < 999999 && this.helpType) {
      //   i.price = i.saleprice - i.helpPrice
      // }
      switch (i.producttype) {
        case PT.activity:
          if (i.salestatus !== 1) {
            i.price = i.saleprice;
            i.delprice = 0;
            i.specialprice = 0;
            i.producttype = PT.normal;
          }
          break;
        case PT.bees:
        case PT.sign:
          // 暂时不做 置空特价
          if (i.delprice > 0) i.price = i.delprice;
          i.delprice = 0;
          i.producttype = PT.normal;
          break;
      }
      return i;
    },
    ckCell(name, idx) {
      let current = this[name + "s"][idx];
      let tempIndex = this[name + "SelectedIdx"];
      if (current && current.ok) {
        if (tempIndex === -1) tempIndex = idx;
        else tempIndex = tempIndex === idx ? -1 : idx;
        this[name + "SelectedIdx"] = tempIndex;
      }
    },
    cgCount(payload) {
      let _ = this;
      let info = _.info;
      let count = this.count;
      if (this.helpType && sessionStorage.getItem("cuttype")) {
        this.toast("亲,只能选择一件哦~");
        // sessionStorage.removeItem('cuttype',1)
        return;
      }
      if (_.noitem) {
        this.toast("请选择颜色尺码");
        return;
      }

      count += payload;
      if (count < 1) count = 1;
      if (count > info.stockcount) {
        count = info.stockcount;
        this.toast(`库存仅剩${info.stockcount}件`);
      }
      if (info.limitcount > 0 && count > info.limitcount) {
        count = info.limitcount;
        this.toast(`该商品限购${info.limitcount}件`);
      }
      this.count = count;
    },
    submit() {
      let _ = this;
      if (_.noitem) {
        this.toast("请选择颜色尺码");
        return;
      }
      let info = _.info;
      let ret = {
        ...this.productInfoBase,
        ...info,
        id: info.id,
        productitemid: info.id,
        productname: this.productInfoBase.name,
        count: _.count,
        isok: true,
      };
      // 移除商品主体信息的大体积字段
      delete ret.name;
      delete ret.brandmemo;
      delete ret.description;
      delete ret.sizedesc;
      delete ret.texture;

      // ret.specialprice = 0
      // if (ret.delprice > 0) {
      //   ret.saleprice = ret.delprice
      //   ret.specialprice = ret.price
      // } else ret.saleprice = ret.price

      _._close({ ...ret });
    },
    close() {
      this._close();
    },
    _close(payload = null) {
      let _ = this;

      // console.log('product item submit', payload)
      _.$emit("close", payload);
    },
  },

  watch: {
    productInfo(val, old) {
      let _ = this;
      if (_.productInfo && _.productInfo.id) {
        _.ifFirstAjax = true;
        _.getItems();
      }
      // if(val.id!=old.id) this.getItems()
      // console.log('---------',this.productInfo)
      // if (this.productInfo && this.productInfo.id && this.isDistribution) {
      //   this.getItems();
      // }
    },
  },
};
</script>
<style scoped>
.rmb {
  font-size: 3.7333vw;
  transform: scale(0.833);
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
.head-title {
  text-align: center;
  padding: 1rem 0;
}
.pi-main {
  position: absolute;
  left: 0;
  bottom: 0;
  transform: translateY(150%);
  transition: transform 0.3s ease-out;
  width: 100%;
  /* height: 70%; */
  /* padding-bottom: 13.333vw; */
  background-color: #282828;
  /* border-radius: 1rem 0 0 1rem; */
  border-top-right-radius: 2rem;
  border-top-left-radius: 2rem;
}
.pi-main .close {
  position: absolute;
  right: 5.33vw;
  top: 3.733vw;
  width: 5.866vw;
  height: 5.866vw;
  background: url("https://files.eyee.com/mcdn/img/prddetail/close.png") 0 0
    no-repeat;
  background-size: 100% 100%;
}
.show .pi-main {
  transform: translateY(0);
  max-height: 163vw;
}

.pi-top {
  /* padding-top: 10px; */
  padding: 4vw 0;
  margin: 0 4vw 4vw 4vw;
  /* border-bottom: 1px solid #e6e6e6; */
}

.scrollContent {
  max-height: 105vw;
  overflow-y: auto;
  position: relative;
  padding: 0 5.3vw;
}

.head-img {
  /* border: 1px solid red; */
  margin: 0 auto;
  background: linear-gradient(#505050 0%, #3c3c3c);
  display: flex;
  justify-content: space-between;
  padding: 2.67vw;
  /* border-radius: 1rem; */
  position: relative;
}
.img-right {
  margin-left: 11px;
}
.head-img-left {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-right: 14.67vw;
}
.head-img-right {
  /* margin-right: 1rem; */
}
.head-img .head-img-right img {
  width: 5rem;
  /* border-radius: 1rem; */
}
.textRight {
  text-align: right;
}
.textRight i.ico-X {
  margin-right: 10px;
}
.pi-top .pi-img {
  /* width: 35%; */
  width: 28.8vw;
  height: 28.8vw;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 4vw;
}
.active-img {
  position: absolute;
  /* left: -6.1vw; */
  top: 0;
  left: 0;
}
.code-num {
  font-size: 10px;
  color: #333;
}
.pi-info {
  width: 45%;
}
.pi-info .font-price {
  font-size: 6.4vw;
  color: #fa4b4b;
  font-family: OswaldBold;
}
.pi-info .font-price.block {
  color: #232323;
}
.pi-info .del {
  color: #969696;
  font-size: 12px;
  margin-left: 1.33vw;
  font-family: Arial, Helvetica, sans-serif;
}
.pi-info p:not(.font-price) {
  font-size: 12px;
  color: #666;
  margin-top: 1.6vw;
}
.img-code {
  width: 150px;
  height: 55px;
  /* border:1px solid red; */
  background: #fff;
  padding: 1px;
  display: flex;
  border-radius: 0.5rem;
  align-items: center;
}
.img-code .img-left img {
  border-radius: 0.5rem;
}
.price-num {
  /* margin-top: -1rem; */
  font-size: 4.8vw;
  font-family: OswaldBold;
  background: linear-gradient(#f5e6aa, #876e37);
  -webkit-background-clip: text;
  color: transparent;
  flex: 1;
  display: flex;
  align-items: center;
}
.img-left .img-right {
  height: 45px;
}
.price-num i {
  font-size: 14px;
  /* color: rgba(166,144,84,1);
  font-family: Oswald, Oswald-Bold;
  font-weight: 700; */
}
.price-num span {
  font-size: 25px;
}
.price-num span,
.price-num i {
  /* font-size: 25px; */
  font-family: Oswald, Oswald-Bold;
  font-weight: 700;
}
.pi-opts {
  font-size: 14px;
  line-height: 24px;
  /* padding: 5px 10px; */
  /* max-height: 127vw;
  overflow-y: scroll; */
  margin-bottom: 4vw;
  margin-top: 5.3vw;
}
.pi-opts label {
  /* color: #232323; */
  font-weight: bold;
  font-size: 3.733vw;
  margin-bottom: 2.66vw;
}
.pi-cells {
  width: 90%;
}

.pi-cells > span {
  margin-right: 2.66vw;
  margin-bottom: 2.66vw;
  padding: 1.066vw 0.8vw;
  padding-right: 2.66vw;
  color: #fff;
  background: #3c3c3c;
  border: 1px solid transparent;
  border-radius: 1.5vw;
}
.pi-cells.size > span {
  padding: 0 2.933vw;
  height: 8vw;
  line-height: 8vw;
}
.pi-cells > span img {
  width: 6.933vw;
  margin-right: 2.66vw;
  border-radius: 0.3rem;
}
.pi-cells > span.act {
  /* color: #fff; */
  /* background-color: #fff2f3; */
  border-color: #c8af6e;
  color: #c8af6e;
}
.pi-cells > span.disable {
  position: relative;
  opacity: 0.5;
  border: none;
  /* color: #ccc;
  background-color: #eee;
  border-color: #eee; */
}
.pi-cells > span.disable::before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: #fff;
  border-radius: 1.5vw;
  opacity: 0.5;
}
.pi-count-box {
  /* line-height: 30px; */
  margin-top: 5.3vw;
}
.pi-count-box label {
  margin: 0;
  line-height: 6.933vw;
}
.pi-count {
  color: #969696;
  /* border: 1px solid #cdcdcd; */
  border-radius: 2px;
  margin: 0 10px;
  background: #3c3c3c;
  border-radius: 20px;
}
.pi-count > span {
  width: 10.66vw;
  height: 6.933vw;
  text-align: center;
}
.pi-count > span.num {
  font-size: 14px;
  color: #fff;
  font-weight: bold;
}
.pi-count .ico-cut {
  /* border-right: 1px solid #cdcdcd; */
  color: #c8af6e;
}
/* .pi-count .ico-add { 
  color:#C8AF6E
} */
.pi-count .ico-add::before {
  border-left: 1px solid #c8af6e;
}
.pi-count .ico-add::after {
  border-top: 1px solid #c8af6e;
}
.pi-bottom{
  position: relative;
  left: 0;
  bottom: 0;
  width: 100%;
  border-radius: 2px;
  /* margin-bottom: 10px; */
  /* border-radius: 1rem; */
  background: #282828;
  /* width: 100%; */
}
.pi-bottom button {
  margin: 3.2vw 4vw;
  width: 92vw;
  background: linear-gradient(#f5e6aa, #876e37);
  font-family: PingFangSC, PingFangSC-Semibold;
  font-weight: 600;
  color: #333;
  height: 50px;
  border: none;
  border-radius: 40px;
  font-size: 1rem;
}
.pi-bottom button[disabled] {
  position: relative;
  opacity: 0.5;
  color: #000;
  background: linear-gradient(#f5e6aa, #876e37);
}
/* .pi-btm button[disabled]::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  opacity: 0.5;
} */
</style>
