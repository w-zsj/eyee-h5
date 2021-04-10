<template>
  <div>
    <div class="sellinglist">
      <div class="productwrap">
        <div class="flex-between productorder" @click.stop="goDetailList(info.productid,info.productimageurl,info.productname,info.productcolor,info.isadvanceproduct)">
          <div class="productimg">
            <img :src="info.productimageurl" alt="">
          </div>
         
          <div class="sizeinfo"  >
            <div class="productinfo productname">{{info.productname}} {{info.productcolor}}</div>
            
             <!-- // 扩品 supreme 样式 -->
            <div  v-if='isExt'>
              <div class="shoesize flex-aic flex-wrap"  v-for="(sl,inx) in info.sizelist" :key="'silelist'+inx">
                <p class="sizefont">{{sl.color}}</p>
                <span v-for="(i,index) in sl.clothessize" :key="'list'+index">&nbsp;{{i}};&nbsp;</span>
              </div>
            </div>
             <!-- 原有球鞋样式 -->
            <div v-else>
              <div class="shoesize" v-for="(i,index) in info.sizelist" :key="'list'+index" ><p class="sizefont">{{i.productsize}}</p></div>
            </div>
          </div>

        </div>
        <div class="flex-end alerm-box" v-show="statusVal != 1&&statusVal != 4">
          <div class="alerm"><img src="/static/img/alerm.png">账户冻结中！</div>
        </div>
      </div>
    </div>
      <!-- //分享 -->
    <div class="h5share" v-if="h5share" @click.stop="close">
      <img src="/static/img/h5shareIcon.png" alt="">
      <img src="/static/img/h5shareiconknow.png" alt="">
    </div>
  </div>
</template>
<script>
import { lowerFrame } from "../../../common/api/snekc2c.js";
import { DateDiff, _getDate } from "../../../common/util";
const PT = {
  sneaker: 21,
  ext: 22
};
export default {
  data() {
    return {
      sizelist: [],
      pageindex: 1,
      pagesize: 20,
      h5share: false
    };
  },
  computed: {
    isExt() {
      return this.info.producttype == PT.ext;
    },
  },
  props: {
    info: { type: Object },
    statusVal: { type: Number, default: 1 }
  },
  mounted() {},
  methods: {
    close() {
      this.h5share = false;
    },
    // isadvanceproduct"int #是否支持预售 0-否,1-是(预售新增)
    goDetailList(id, url, name, color, isadvanceproduct) {
      let info = this.info;
      this.$router.push({
        path: "/sellingdetail",
        query: {
          id: id,
          url: url,
          name: name,
          color: color,
          isadvanceproduct: isadvanceproduct
        }
      });
      // this.$router.push(`/sellingdetail/${id}&${url}&${name}&${color}`);
    }
  }
};
</script>
<style scoped>
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
  min-height: 114px;
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
  background: url("//files.eyee.com/mcdn/static/img/order-service-exchange.png")
    0 0 no-repeat;
  background-size: 100% auto;
}
.productorder {
  position: relative;
  padding: 15px;
}
.productimg {
  position: absolute;
  top: 15px;
  width: 16vw;
}
.productimg img {
  display: block;
}
.productinfo {
  font-size: 13px;
  margin: 0 2vw 3vw 2vw;
  max-height: 40px;
  /* overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.productinfo .productname {
  line-height: 20px;
}
.productprice {
  font-size: 16px;
  color: #ffc700;
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
  /* box-shadow: 0 3px 4px #ccc; */
  border-bottom: 1px solid #f7f7f7;
  border-top: 1px solid #f7f7f7;
  padding: 15px;
  /* border-radius: 5px; */
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
  margin: 15px;
  font-size: 12px;
  color: #666;
  border: 1px solid #999;
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
.sizeinfo {
  margin-left: 16.6vw;
  width: 67.2vw;
}
.shoesize {
  float: left;

  color: #999;
  font-size: 12px;
  /* height: 5.3333vw; */
  margin: 0 0 1.8666vw 1.8666vw;
  text-align: center;
  vertical-align: middle;
}
.shoesize p {
  min-width: 9.3333vw;
  padding: 2px 6px;
  background: rgba(245, 245, 245, 1);
}
.sizefont {
  color: #333;
  font-size: 10px;
  line-height: 5.3333vw;
}
.alerm-box {
  margin: 9px 6px;
  padding: 10px 0 2px 0;
  border-top: 1px solid #f5f5f5;
  transform: translate(0, -12px);
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
</style>


