<template>
  <div>
    <div class="guishi ">
      <v-header>
        <div class="nav-tab2">
          <h3 style="color:#000;">{{title}}</h3>
        </div>
        <v-cart :isshow="true" :isdark="true"></v-cart>
      </v-header>
      <v-list :load-handle='reload' :isend='true'>
        <!-- <p class="nowSale" :class="countdata.isactive?'':'soon'"> -->
        <!-- <span>
                <em v-if="ghostProList.isactive">正在进行</em>
                <em v-else>即将开始</em>
                <i class="leftCircle"></i><i class="rightCircle"></i>
            </span> -->

        <!-- </p> -->
        <div class="setTime">
          <img :src="countdata.logourl" />
          <CountDown v-if="countdata&&countdata.endtime" :count-infos="countdata" class="soldingTime"></CountDown>
        </div>
        <div style="padding:0 5px;">
          <!-- ghostProList.isactive ? 3:1 -->
          <ProductUnit v-for="(item,ind) in countdata.products" :key='ind' :productItem='item' :productType='countdata.isactive ? 3:1'></ProductUnit>
        </div>
      </v-list>
    </div>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex';
import ProductUnit from "../templates/ProductUnit";
import CountDown from "./CountDown";
import { GetSpecialSaleProductList } from "../../common/api/marketing";
export default {
  components: { ProductUnit, CountDown },
  computed: {
    // ...mapGetters({
    //   ghostProList: "ghostProList"
    // })
  },
  data() {
    return {
      countdata: {},
      title: "鬼市特卖"
    };
  },
  mounted() {
    this.rel();
  },
  methods: {
    reload() {
      this.rel();
    },
    rel() {
      var id = this.$route.query.id;
      try {
        $log({ e: 'ghost', p:  { value: id },t:2,ext:1 })
      } catch (err) {
        console.error("request error report error: ", err);
      }
      GetSpecialSaleProductList({ SpecialSaleId: id })
        .then(res => {
          if (res) {
            this.title = res.name || "鬼市特卖";
            this.countdata = res;
          }
          console.log("鬼市商品列表", this.countdata);
        })
        .catch(e => {
          console.error(e);
        });
    }
  }
};
</script>
<style scoped>
.guishi {
  /* padding-bottom: 30px; */
  padding: 5px 0;
  padding-top: 0;
  overflow: hidden;
  position: relative;
}
.guishi .productItem {
  width: 47.5%;
  float: left;
  margin: 0 1% 1% 1%;
  margin-bottom: 10px;
}
.guishi .productItem:nth-child(2n) {
  margin-left: 2%;
}

.type9 .textWrap {
  text-align: left;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nowSale {
  font-size: 14px;
  color: #6133d8;
  text-align: center;
  line-height: 40px;
  position: relative;
}
.nowSale span {
  position: relative;
  padding-left: 20px;
}
.nowSale span:before {
  position: absolute;
  content: "";
  width: 15px;
  height: 15px;
  left: 0;
  top: 0;
  background: url("/static/imgs/mall/ico-clock.png") 0 0 no-repeat;
  background-size: cover;
}
.nowSale.soon span:before {
  background: url("/static/imgs/mall/ico-clock.png") 0 0 no-repeat;
  background-size: cover;
}
.nowSale span .leftCircle,
.nowSale span .rightCircle {
  position: absolute;
  height: 1px;
  width: 20px;
  left: -30px;
  top: 8px;
  background: #ffc700;
}
.nowSale span .rightCircle {
  left: auto;
  right: -30px;
}
.nowSale span .leftCircle:before,
.nowSale span .rightCircle:before {
  position: absolute;
  content: "";
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #ffc700;
  left: 0;
  top: -1px;
}
.nowSale span .leftCircle:before {
  left: auto;
  right: 0;
}
.solding {
  position: relative;
  height: 142px;
  width: 100%;
  margin-bottom: 10px;
  padding: 0 5px;
}
.solding .bdcolor {
  height: 100%;
  width: 100%;
}
.solding .bdcolor img {
  height: 100%;
  width: 100%;
}
.setTime {
  min-height: 120px;
  position: relative;
  margin-bottom: 10px;
  /* height: 142px; */
}
.setTime img {
  display: block;
  width: 100%;
  /* border: 0; */
  /* height: 100%; */
}
.soldingTime {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 15px;
  color: #fff;
}
.solding .businessname {
  position: absolute;
  top: 25px;
  text-align: center;
  width: 100%;
  font-size: 14px;
  color: #ffc700;
}
.solding .businessname span {
  line-height: 24px;
  border: 1px solid #ffc700;
  border-left: 0;
  border-right: 0;
  padding: 3px 0;
}
</style>
