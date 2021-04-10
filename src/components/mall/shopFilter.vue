<template>
  <div class="page-footer" :class="{shop_filter:filterType!=4}">
    <div class="header nav-top">
      <p>筛选</p>
      <p class="close" @click.stop="goBack"></p>
    </div>
    <FilterList></FilterList>
    <div
      :class="{footer_bar:filterType.type!=3,shopBar:filterType==3}"
      class="footerBtn clearfix fix-btm"
    >
      <div class="filter_btn" @click.stop="resetOption">重置</div>
      <div class="filter_btn" @click.stop="confirOption">确定</div>
    </div>
  </div>
</template>
<script>
import FilterList from "../templates/FilterList";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      params: {}
    };
  },
  components: { FilterList },
  mounted() {
    var set = {};
    if (this.filterType == 3) {
      set = this.shopOption;
    } else {
      set = this.searchOption;
    }
    console.log("searjjjjj", this.searchOption);
    this.$store.dispatch("setRecord", Object.assign({}, set));
    // this.router.params.type 1发现，2搜索
    this.params = this.$route.params;
    if (this.params && this.filterType == 3) {
      this.initShare({ type: 1, info: { ...this.$parent.shareData } });
    } else {
      this.initShare({ type: 1 });
    }
  },
  methods: {
    goBack() {
      this.$store.dispatch("confirOption", {
        data: this.getRecord,
        type: this.filterType
      });
      this.$router.back();
      // 跳回商品这一栏
      sessionStorage.setItem("screen", "1");
    },
    resetOption() {
      var param = this.$route.params;
      if (this.filterType == 3) {
        this.$store.dispatch("resetOption", this.filterType);
      } else {
        this.$store.dispatch("resetOption", param.type);
        // 重置
        var brandkeyword = {};
        brandkeyword.isBrand = true;
        brandkeyword.brandName = "全部";
        brandkeyword.brandId = "";
        brandkeyword.isreset = true;
        this.$store.dispatch("setKeywordBrand", brandkeyword);
      }
      if (this.shopFilterData && this.shopFilterData.length > 0) {
        this.shopFilterData.map(data => {
          data.show = false;
          return data;
        });
      }
      if (this.filterData && this.filterData.length > 0) {
        this.filterData.map(data => {
          data.show = false;
          return data;
        });
      }
      this.toast("重置成功");
    },
    confirOption() {
      var param = this.$route.params;
      var set = {};
      var price = this.setprice;
      console.log("setprice", this.setprice);
      if (param) {
        if (param.type == 1) {
          set = this.homeOption;
        } else if (param.type == 2) {
          set = this.searchOption;
        }
      }
      if (this.filterType == 3) {
        set = this.shopOption;
      }
      if (price) {
        if (price.endprice || price.beginprice) {
          var a = Number(price.endprice);
          var b = Number(price.beginprice);
          if (a != 0 && b != 0) {
            if (a > b) {
              set.beginprice = b;
              set.endprice = a;
            } else {
              set.beginprice = a;
              set.endprice = b;
            }
            set.showPrice = set.beginprice + "-" + set.endprice;
          } else {
            if (a == 0 && b > 0) {
              set.beginprice = b;
              set.endprice = null;
              set.showPrice = set.beginprice + "以上";
            }
            if (a > 0 && b == 0) {
              set.beginprice = 0;
              set.endprice = a;
              set.showPrice = set.beginprice + "-" + set.endprice;
            }
          }
        } else {
          if (set.endprice != -1 && set.endprice >= 0 && set.beginprice >= 0) {
            set.showPrice = set.beginprice + "-" + set.endprice;
            if (set.endprice) {
            } else {
              set.showPrice = set.beginprice + "以上";
            }
          } else {
            set.showPrice = set.beginprice + "以上";
          }
        }
      }
      set.keyword = set.value;
      console.log("筛选数据----", this.filterType, set);
      // set.value =
      if (this.filterType == 3) {
        console.log("筛选数据", set, param.type);
        this.$store.dispatch("confirOption", {
          data: set,
          type: this.filterType
        });
      } else if (this.filterType == 2) {
        // console.log('筛选数据', set, param.type)
        this.$store.dispatch("confirOption", { data: set, type: param.type });
      }
      //  this.$router.push('/news/Search/'+set.keyword);
      this.$router.back();
      // 跳回商品这一栏
      sessionStorage.setItem("screen", "1");
    }
  },

  computed: {
    ...mapGetters({
      filterData: "filterData",
      homeOption: "homeOption",
      searchOption: "searchOption",
      shopOption: "shopOption",
      shopFilterData: "shopFilterData",
      filterType: "filterType",
      getRecord: "getRecord",
      setprice: "setprice"
    })
  },
  destroyed() {
    this.$store.dispatch("setFilteType", 0);
  }
};
</script>
<style scoped>
.shop_filter {
  padding-top: 48px;
}

.header {
  background: #fff;
  text-align: center;
}

.header p {
  line-height: 48px;
  color: #333;
  font-size: 1.125rem;
  display: inline-block;
}

.footerBtn .filter_btn {
  width: 50%;
  background-color: #ffc700;
  border: none;
  float: left;
  color: #fff;
  text-align: center;
  height: 50px;
  line-height: 50px;
}

.footerBtn .filter_btn:nth-last-of-type(1) {
  background-color: #333;
}

.header p.close {
  height: 20px;
  width: 20px;
  position: absolute;
  right: 5%;
  color: #999;
}

.header p.close::before {
  font-size: 30px;
  content: "\2717";
}

#app .shopBar {
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 40px;
}

#app .shopBar .filter_btn {
  height: 40px;
  line-height: 40px;
}
</style>
