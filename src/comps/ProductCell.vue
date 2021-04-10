<template>
  <div
    v-if="cellData&&cellData.id"
    class="product-cell"
    :class="cellClass"
    :style="{backgroundColor:bgColor,color:txtColor}"
    @click="goDetail(info.id)"
  >
    
    <div class="pc-show" :style="{border:borColor}">
      <div class="pc-img">
        <img v-lazy="https(info.imgUrl)" alt>
        <slot name="num"></slot>
      </div>
      <slot name="ico"></slot>
    </div>
    <div class="pc-info" :class=" [{'flex-col flex-btwn':horizontal},{'pc-info-bg':pcinfoBg}]">
      <!-- <p class="pc-name"  :class="{'ellipsis':nameLine===1,'ellipsis-2':nameLine===2,}"  v-if="info.name" >{{info.name}}</p> -->
      <p class="pc-name"  :class="{'ellipsis':nameLine===1}"  v-if="info.name && nameLine===1" >{{info.name}}</p>
      <p class="pc-name" v-if="nameLine===2 && info.name"  style="overflow:hidden; text-overflow:ellipsis; text-overflow:-o-ellipsis-lastline; display:-webkit-box;-webkit-line-clamp:2; -webkit-box-orient:vertical;">{{info.name}}</p>
      <p class="pc-brand ellipsis" v-if="info.brandname">{{info.brandname}}</p>
      <slot name="price" :price="info.price" :delprice="info.delprice"></slot>
    </div>
    <div class="btn" v-if="isShowBtn">
       <slot name="btn"></slot>
    </div>
  </div>
</template>
<script>
/**
 * Usage
  <product-cell col="double" bg-color="transparent" txt-color="#333" :horizontal="false" :cell-data="info" :name-line="2" >
    <template slot="ico">
      <!-- 这里是自定义的图标, 没有时不要 -->
    </template>
    <template slot="price" slot-scope="{ price,delprice }">
      <p class="font-price">
        <!-- 这里是自定义的价格显示, delprice 需判断>0 才显示 -->
      </p>
    </template>
  </product-cell>
 *
 * horizontal 为 true 时, col 无效
 * info.name 不显示时 nameLine 无效
 */

const colorValidation = val =>
  val === "transparent" || /^#([0-9a-f]{6}|[0-9a-f]{3})$/g.test(val);

export default {
  name: "ProductCell",
  props: {
    horizontal: {
      type: Boolean,
      default: false
    },
    col: {
      type: String,
      default: "double",
      validation: val => val === "double" || val === "triple"
    },
    isShowBtn:{
      type: Boolean,
      default: false
    },
    cellData: {
      /**
       * 需转成如下对应格式
       * id,
       * img, 商品图
       * name, 不显示时该字段不传或传空
       * brandname, 不显示时该字段不传或传空
       * saleprice, 原价
       * specialprice, 特价/折扣价
       * isc2c, 是否是C2C商品
       */
      type: Object
    },
    nameLine: {
      type: Number,
      default: 1,
      validation: val => val === 1 || val === 2
    },
    bgColor: {
      type: String,
      default: "transparent",
      validation: colorValidation
    },
    txtColor: {
      type: String,
      default: "#333",
      validation: colorValidation
    },
    borColor: {
      type: String,
      default: "none",
      validation: colorValidation
    },
    flexSan: {
      type: String,
      default: "2"
    },
    pcinfoBg:{
       type: Boolean,
      default: false,
    },
    category:{
      type: String,
      default: ""
    },
    categoryName:{
      type: String,
      default: ""
    }
  },
  computed: {
    info() {
      let _ = this,
        { cellData } = _,
        i = { ...cellData, price: cellData.saleprice, delprice: 0 };

      // price, 当前价, 有特价则传特价, 无特价则传原价
      // delprice, 划掉价, 有特价则传原价, 无特价则传0
      if (i.specialprice > 0 && i.specialprice != i.saleprice) {
        i.price = i.specialprice;
        i.delprice = i.saleprice;
      }

      try {
        i.imgUrl = (i.img||i.imgUrl)
          .replace(/,/g, "|")
          .split("|")[0]
          .replace("http://", "https://");
      } catch (e) {
        console.error(" deal product image url error, ", e);
      }

      return i;
    },
    cellClass() {
      let { horizontal, col, flexSan } = this,
        ret = [];

      if (horizontal) ret.push("flex-btwn", "horizontal");
      else if (flexSan == 3) ret.push("three");
      else ret.push(col);

      return ret;
    }
  },
  methods: {
    goDetail(id) {
      let _ = this,
        { isc2c } = _.info;
      if (_.$root.ISAPP) {
        _.javascriptBridge({
          name: isc2c ? "gotoAppSneakerDetailPage" : "gotoAppProductDetailPage",
          params: { productid: id }
        });
      } else {
        _.$router.push(
          isc2c ? `/sneaker/detail/${id}` : `/productDetail/${id}`
        );
      }
      if(_.pcinfoBg){
         if(!_.$root.isdebug)  window.gio("track", "H5PlatWaterfall",{'recommendProductId':id,'H5PlatCate':_.category,'categoryName':_.categoryName});
      }
    }
  }
};
</script>
<style scoped>
/* .product-cell {
} */
.product-cell.double {
  width: 46.2%;
  margin: 0 1.9% 18px; /* 4份间距 */
  position: relative;
  
}
.product-cell.horizontal{
overflow: hidden;
}
.product-cell.triple {
  width: 30.53%;
  margin: 0 1.4% 18px; /* 8份间距 */
}
.product-cell.three {
  width: 32%;
  background: #fff;
  color: #333;
  padding-bottom: 5px;
}
.product-cell .btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 11.2%;
  height: 100%;
}
.product-cell.three:nth-child(3n + 2) {
  margin: 0 2% 2% 2%;
}
.product-cell.three .pc-name,
.product-cell.three .pc-brand {
  color: #333;
  /* width: 80%; */
}


.pc-show {
  position: relative;
}
.product-cell.horizontal .pc-show {
  width: 28%;
}

.pc-img {
  width: 100%;
  height: 0px;
  overflow: hidden;
  padding-bottom: 100%;
}
.pc-img > img {
  display: block;
}

.product-cell.horizontal .pc-info {
  width: 68%;
  color: #333;
}

.pc-name {
  font-size: 12px;
  /* width: 85%; */
}
.product-cell.horizontal .pc-name{
  width: 85%;
}
.product-cell:not(.horizontal) .pc-name {
  padding: 0 2%;
}
.double .pc-name {
  font-weight: 400;
}
.triple .pc-name {
  font-weight: 200;
}

.pc-brand {
  font-size: 10px;
  padding-bottom: 6px;
  padding-top: 6px;
}
.double .pc-brand {
  font-weight: 300;
}
.triple .pc-brand {
  font-weight: 200;
}
.pc-info{
  padding-top: 6px;
}
.pc-info-bg{
  background: #131313;
  color: #fff;
}
.pc-info-bg .pc-brand {
  padding:2%;
}
</style>
