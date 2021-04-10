<template>
  <div class="condition_list clearfix flex-" :class="{condition_fix:filterType==3}">
    <label v-if="conditionsData.brandName!='全部'&&conditionsData.brandName" @click="delCond(1)">
      {{conditionsData.brandName}}
      <!-- <span class="close"></span> -->
      <div class="img-style">
        <img src="../../assets/img/close.png" style="width:20px">
      </div>    
    </label>
    <label v-if="conditionsData.category" @click="delCond(2)">
      {{conditionsData.category}}: {{conditionsData.categoryName}}
      <!-- <span class="close"></span> -->
      <div class="img-style"><img src="../../assets/img/close.png" style="width:20px"></div>    
    </label>
    <label v-if="conditionsData.beginprice&&conditionsData.endprice" @click="delCond(3)">
      ¥{{conditionsData.beginprice}}
      <span
        v-if="conditionsData.endprice!=-1&&conditionsData.endprice"
      >-</span>
      <span
        v-if="conditionsData.endprice && conditionsData.endprice !='-1'"
      >{{conditionsData.endprice}}</span>
      <span v-else>以上</span>
      <!-- <span class="close"></span> -->
      <div class="img-style"><img src="../../assets/img/close.png" style="width:20px"></div>
    </label>
    <label v-else-if="conditionsData.beginprice==0" @click="delCond(3)">
      {{conditionsData.endprice}}以内
      <!-- <span class="close"></span> -->
      <div class="img-style"><img src="../../assets/img/close.png" style="width:20px"></div>
    </label>
    <label v-if="conditionsData.size" @click="delCond(4)">
      {{conditionsData.size}}
      <!-- <span class="close"></span> -->
      <div class="img-style"><img src="../../assets/img/close.png" style="width:20px"></div>
    </label>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    conditions: {}
  },
  components: {},
  data() {
    return {
      conditionsData: {}
    };
  },
  mounted() {
    this.conditionsData = { ...this.conditions };
    console.log(this.conditionsData, "conditionsData--->>>ConditionList.vue");
  },
  methods: {
    delCond(ind) {
      // console.log(ind);
      console.log("conditionsData----", ind, this.filterType);

      if (ind == 1) {
        this.conditionsData.brandName = "";
        this.conditionsData.brandid = "";
        // this.conditionsData.keyword =''
        // delete this.conditionsData.brandid
        var brandkeyword = {};
        brandkeyword.isBrand = false;
        brandkeyword.brandName = null;
        brandkeyword.brandId = null;
        // brandkeyword.categoryid = null
        // brandkeyword.brandid =''
        // brandkeyword.keyword =null
        this.$store.dispatch("setKeywordBrand", brandkeyword);
        this.$emit("chadiao", 1);
      } else if (ind == 2) {
        this.conditionsData.categoryName = "";
        this.conditionsData.categoryid = "";
        this.conditionsData.category = "";
        // delete this.conditionsData.category
        // delete this.conditionsData.categoryid
      } else if (ind == 3) {
        // delete this.conditionsData.beginprice
        this.conditionsData.beginprice = null;
        this.conditionsData.endprice = null;
        this.conditionsData.showPrice = null;
        this.$store.state.mall.setprice.beginprice = null;
        this.$store.state.mall.setprice.endprice = null;
      } else if (ind == 4) {
        this.conditionsData.sizeName = "";
        this.conditionsData.keyword = "";
        this.conditionsData.size = "";
        this.conditionsData.value = "";
      }
      if (this.filterType == 3 || this.filterType == 0) {
        this.$store.dispatch("confirOption", {
          data: this.conditionsData,
          type: this.filterType
        });

        this.$parent.reload();
      } else {
        this.$store.dispatch("confirOption", {
          data: this.conditionsData,
          type: 2
        });
      }
    }
  },
  computed: {
    ...mapGetters({
      filterType: "filterType"
    })
  }
};
</script>
<style scoped>
.condition_list {
  /* padding: 0 10px 5px; */
  /*height: 24px;*/
}
.condition_list label {
  /* display: inline-block;
  margin-right: 10px;
  padding: 0 20px 0 10px;
  height: 20px;
  line-height: 20px;
  background-color: #ccc;
  position: relative;
  color: #fff;
  font-size: 11px;
  border-radius: 1rem; */
  /* display: inline-block; */
  margin-right: 10px;
  padding: 2px 10px 0 10px;
  /* height: 20px; */
  /* line-height: 20px; */
  display: flex;
  background-color: #3c3c3c;
  position: relative;
  color: #fff;
  font-size: 11px;
  align-items: center;
  /* border-radius: 1rem; */
  border-radius: 1rem;
}
.condition_fix label {
  /*top:-10px;*/
}
.condition_list label:after,
.condition_list label:before {
  /* border: solid transparent;
  content: " ";
  height: 0;
  left: 100%;
  position: absolute;
  width: 0; */
}

.img-style img {
  width: 20px;
}
.img-style {
  margin-left: 10px;
}
.condition_list label:before {
  border-width: 10px;
  border-left-color: #ccc;
  top: 0px;
}
.close {
  display: inline-block;
  position: absolute;
  top: 10px;
  right: 0px;
  width: 12px;
  height: 1px;
  background: #fff;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
.close:after {
  content: "";
  display: block;
  width: 12px;
  height: 1px;
  background: #fff;
  transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
}
</style>
