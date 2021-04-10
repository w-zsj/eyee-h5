<template>
  <ul :class="{hasC:selectIndex==1||selectIndex==3}">
    <li
      v-for="(item,index) in selectItem"
      :key="index"
      class="ellipsis"
      :class="{selected:(item.name==dataOptions.brandName&&selectIndex==1)
            ||(item.id==dataOptions.categoryid&&selectIndex==2)
            ||(item.beginprice==dataOptions.beginprice&&selectIndex==3)
            ||(item.text==dataOptions.size&&selectIndex==4)

    }"
      @click="changSelected(item,index)"
    >
      <span v-show="item.name">{{item.name}}</span>
      <span
        v-show="item.endprice"
      >{{item.beginprice}}{{item.endprice==(-1)?'以上':('-'+item.endprice)}}</span>
      <span v-show="item.text">{{item.text}}</span>
    </li>
    <li v-if="showInput" class="input_price">
      <input
        type="number"
        placeholder="请输入最低价格"
        v-model="beginprice"
        ref="beginprice"
        @keydown="keydown($event,1)"
      />
      <span>-</span>
      <input
        type="number"
        placeholder="请输入最高价格"
        v-model="endprice"
        ref="endprice"
        @keydown="keydown($event,2)"
      />
    </li>
  </ul>
</template>
<script>
import { mapGetters } from "vuex";
import { PRODUCT_Filter_LIST } from "../../store/mutation-types";
export default {
  props: {
    items: Array,
    showInput: false,
    selectIndex: Number, // 1品牌2分类3价格4尺码,
    listType: { type: Number, default: 0 }
  },
  data() {
    return {
      itemList: [],
      beginprice: null,
      endprice: null,
      keycode1: 0
    };
  },
  mounted() {
    // console.log(this.dataOptions,'');
    // 新增价格筛选记录功能

    this.itemList = this.selectItem;
    // this.$store.state.mall.setprice.beginprice = this.beginprice
    // this.$store.state.mall.setprice.endprice = this.endprice
  },
  watch: {
    beginprice: {
      handler: function(val, oldval) {
        if (!(this.keycode && this.keycode == 8)) {
          if (val && val != "NAN") {
            this.beginprice = parseInt(val);
          } else if (oldval && oldval != "NAN") {
            // this.beginprice = parseInt(oldval)
          }
        }
        if (val && val.length == 8) {
          this.beginprice = parseInt(oldval);
          this.toast("最多8位数");
        }
        // this.dataOptions.beginprice = this.beginprice
        this.$store.state.mall.setprice.beginprice = this.beginprice;
      },
      deep: true
    },
    endprice: {
      handler: function(val, oldval) {
        if (!(this.keycode && this.keycode == 8)) {
          if (val && val != "NAN") {
            this.endprice = parseInt(val);
          } else if (oldval && oldval != "NAN") {
            // this.endprice = parseInt(oldval)
            this.endprice = "";
          }
        }
        if (val && val.length == 8) {
          this.endprice = parseInt(oldval);
          this.toast("最多8位数");
        }
        // if(this.beginprice==''&&this.beginprice!=0){this.endprice = ''}
        // this.dataOptions.endprice = this.endprice
        this.$store.state.mall.setprice.endprice = this.endprice;
      },
      deep: true
    },
    dataOptions: function(n, o) {
      // console.log("dataOptions------>>>", n);
      // 新增价格筛选记录功能
      let price = n;
      if (price.beginprice || price.beginprice == 0) {
        this.beginprice = price.beginprice;
      } else {
        this.beginprice = null;
      }
      if (price.endprice) {
        if (price.endprice == -1) {
          this.endprice = "";
        } else {
          this.endprice = price.endprice;
        }
      } else {
        this.endprice = "";
      }
    }
  },
  computed: {
    selectItem: function() {
      return this.items;
    },
    ...mapGetters({
      filterData: "filterData",
      setOptions: "setOptions",
      homeOption: "homeOption",
      searchOption: "searchOption",
      shopOption: "shopOption",
      filterType: "filterType"
    }),
    dataOptions() {
      let param = this.$route.params;
      if (param.type == 2) {
        return this.searchOption;
      } else if (this.filterType == 3) {
        return this.shopOption;
      } else {
        return this.setOptions;
      }
    },
    keycode() {
      return this.keycode1;
    },
    searchOption() {
      return this.$store.state.product.searchOption;
    }
  },
  methods: {
    changSelected(item, index) {
      // console.log(this.listType, this.selectIndex)
      // console.log('seeeelel', item, index)
      var param = this.$route.params;
      var set = {};
      if (param) {
        if (param.type == 2) {
          set = this.searchOption;
          // this.setOptions = set
        } else if (this.filterType == 3) {
          set = this.shopOption;
        }
      }
      if (this.listType == 0) {
        //  set = this.setOptions
        if (this.selectIndex == 1) {
          set.brandName = item.name;
          set.brandid = item.id;
          var brandkeyword = {};
          brandkeyword.isBrand = true;
          brandkeyword.brandName = item.name;
          brandkeyword.brandId = item.id;
          this.$store.dispatch("setKeywordBrand", brandkeyword);
        } else if (this.selectIndex == 2) {
          set.category = set.items.name;
          set.categoryName = item.name;
          set.categoryid = item.id;
        } else if (this.selectIndex == 3) {
          this.$refs.beginprice.focus(); // 获得焦点
          // 新增 价格筛选和输入框双向绑定
          if (item.beginprice == 0 || item.beginprice) {
            this.beginprice = item.beginprice;
          } else {
            this.beginprice = "";
          }
          if (item.endprice && !item.name) {
            if (item.endprice == -1) {
              this.endprice = "";
            } else {
              this.endprice = item.endprice;
            }
          } else {
            this.endprice = "";
          }
          //
          set.beginprice = item.beginprice;
          set.endprice = item.endprice;
          if (set.endprice != -1)
            set.showPrice = item.beginprice + "-" + item.endprice;
          else set.showPrice = item.beginprice + "以上";
        } else if (this.selectIndex == 4) {
          // set.sizeName = set.items.name
          if (item.type == 0) {
            set.sizeName = "服饰";
          } else if (item.type == 1) {
            set.sizeName = "鞋子";
          }
          set.size = item.text;
          set.value = item.value;
          // set.keyword = item.value
        }
        if (this.filterType == 3) {
          this.$store.dispatch("confirOption", {
            data: set,
            type: this.filterType
          });
        } else {
          // console.log(set)
          this.$store.dispatch("confirOption", { data: set, type: param.type });
        }
      } else {
        var set = {};
        set.items = this.searchOption.items;
        this.$router.push(
          "/mall/Search/" + (index == 0 ? set.items.name : item.name)
        );
        set.categoryid = item.id;
        set.categoryName = item.name;
        set.category = set.items.name;
        console.log(set);
        this.$store.dispatch("confirOption", { data: set, type: 2 });
      }
    },
    keydown(e, type) {
      this.keycode1 = e.keyCode;
    }
  }
  // watch: {
  // searchOption:function(newO,oldv){
  //   // console.log('lilililllliiii')
  //   // this.searchOption = newO
  //   // if(this.$route.params.type == 2){
  //   //   this.dataOptions = newO
  //   // }
  // }
  //}
};
</script>
<style scoped>
ul {
  margin: 6px auto 7px;
}

ul.hasC {
  width: 90%;
}

ul li {
  display: inline-block;
  text-align: center;
  width: 31.3%;
  margin: 0px 3% 7px 0;
  font-size: 0.875rem;
  height: 35px;
  line-height: 35px;
  border-radius: 5px;
  background-color: #f7f7f7;
}

ul li:nth-of-type(3n) {
  margin-right: 0;
}

.selected {
  background-color: #ffc700;
  color: #fff;
}

ul li.input_price {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
}

ul li.input_price input {
  display: inline-block;
  width: 45%;
  border: 1px solid #eee;
  font-size: 0.75rem;
  line-height: 30px;
  height: 30px;
  text-align: center;
}
</style>