<template>
  <div class="shop_product" :class="{disShop_fix:styleType ==2}">
    <div :class="{fix_top:isShowNavi,discount_fix:styleType ==2}" :style="insq?'top:0;':''">
      <!-- y!=1&& -->
      <div class="brand_logo" v-if="brandInfo&&showInfo&&brandInfo.logourl&&chadiaoData!=1">
        <img :src="brandInfo.logourl|https" alt />
        <h3 class="brand_name">{{brandInfo.name}}</h3>
        <p class="brand_memo">{{brandInfo.memo}}</p>
      </div>
      <div class="gap" v-if="styleType == 0&&brandInfo.name == 'Supreme'">
        <HomeSupreme :supremes="specialBrand"></HomeSupreme>
      </div>
      <div class="tab_sorttype clearfix">
        <label
          v-for="(sort,index) in sorttypes"
          :key="index"
          :class="{'clicked':sort.selected}"
          @click="selectSort(sort,index)"
        >
          <span class="font-pf">{{sort.name}}</span>
        </label>
        <label :class="{'clicked':sortPrice[0].selected}" @click="selectPrice(sortPrice[0])">
          <span
            class="arrow_span font-pf"
            :class="{'e-down':sortPrice[0].updown,'e-up':!sortPrice[0].updown}"
          >{{sortPrice[0].name}}</span>
        </label>
        <p class="item_nums font-price">
          <span>{{sumAlls }}&nbsp;</span>ITEMS
          <span class="filter_btn" @click="goFilter">
            <!-- <em></em> -->
            筛选
          </span>
        </p>
      </div>
      <ConditionList
        :conditions="styleType == 1?shopOption:searchOption"
        @chadiao="chadiao"
        v-show="Show"
      ></ConditionList>
    </div>
    <div class="shop_prodlist" :class="{shop_fix:!brandInfo}">
      <v-list
        :load-handle="reload"
        :more-handle="loadmore"
        :more-handling="isLoading"
        :isend="isEnd"
      >
        <div class="wait-list-dbl" v-if="listgetting==0"></div>
        <template v-else-if="listgetting==1">
          <template v-if="styleType==2 || styleType ==3">
            <!-- <div class='prod-item' v-for="(item,idx) in prodlists" :key="item.id" @click="goProduct(item,idx)"> -->
            <!-- <ProductUnit v-for="item in prodlists" :key="item.id" :productItem='item' :productType="item.platformactivityicon ? 5 :0 " :isFindSim="1"></ProductUnit> -->
            <ProductUnit
              class="prod-item"
              :showimgTop = '1'
              v-for="(item, idx) in prodlists"
              :key="item.id"
              @click="goProduct(item,idx)"
              :productItem="item"
              :productType="item.platformactivityicon ? 5 :5 "
              :isFindSim="1"
              :issearchclick="1"
            ></ProductUnit>
            <!-- </div> -->
          </template>
          <template v-else>
            <!-- <div class='prod-item' v-for="(item,idx) in prodlists" :key="item.id" @click="goProduct(item,idx)"> -->
            <!-- <ProductUnit v-for="item in prodlists" :key="item.id" :productItem='item' :productType="styleType == 1? 7 :0 " :isFindSim="1"></ProductUnit> -->
            <ProductUnit
              class="prod-item"
              :showimgTop = '1'
              v-for="(item, idx) in prodlists"
              :key="item.id"
              @click="goProduct(item,idx)"
              :productItem="item"
              :productType="styleType == 1? 7 :5 "
              :isFindSim="1"
              :issearchclick="1"
            ></ProductUnit>
            <!-- </div> -->
          </template>
          <!--  <ProductUnit v-if="styleType===3" v-for="item in prodlists" :key="item.id" :productItem='item' :productType="item.platformactivityicon ? 5 :0 " :isFindSim="1"></ProductUnit> -->
        </template>
        <div v-else>
          <div class="no-data">
            <img src="//files.eyee.com/mcdn/static/img/no_product.png" alt />
            <p>暂无相关商品</p>
          </div>
        </div>
      </v-list>
    </div>
    <!-- <div class="no_product" v-if='hasdata==0'></div> -->
  </div>
</template>
<script>
import { SearchProduct } from "../../common/api/business";
import { ProdSearch, DiscountSearch } from "../../common/api/product";
import { PlatformActivitySearch } from "../../common/api/marketing"; //GetPlatformActivity,
import { mapGetters } from "vuex";
import ProductUnit from "../templates/ProductUnit";
import ConditionList from "../templates/ConditionList";
import { ENUM } from "../../common/util";
import HomeSupreme from "../templates/HomeSupreme.vue";
export default {
  props: {
    styleType: { type: Number, default: 0 }, // 默认0正常搜索，1是店铺的检索栏目2是折扣的检索栏目，3是大促销会场搜索
    keywordP: { type: String },
    brandIntroduction: { type: Boolean, default: true },
    mallnewType: { type: Number, default: 1 } // 1 是从product 传值 2 是从searchList 传值 区分要不要显示品牌介绍
  },
  data() {
    return {
      listgetting: 0,
      specialBrandInfo: {},
      chadiaoData: "",
      businessId: "",
      distanceToTop: null,
      prodlists: [],
      sumAlls: 0,
      Show: true,
      sorttypes: [
        { sorttype: 1, name: "人气", updown: false, selected: true },
        { sorttype: 2, name: "销量", updown: false, selected: false },
        { sorttype: 0, name: "新品", updown: false, selected: false }
      ],
      sortPrice: [
        { sorttype: 3, name: "价格", updown: false, selected: false }
      ],
      isEnd: false,
      isLoading: false,
      pagedata: {
        businessid: null,
        pageindex: 1,
        sorttype: 1,
        ordertype: 0,
        keyword: null,
        issearchall: 0,
        brandid: null,
        isc2c: true
      },
      pagelist: { sumcount: 0, pagesize: 0 },
      brandInfo: {},
      showInfo: false,
      hasdata: 0,
      activeIndex: 0,
      paramArr: {},
      activityImg:
        "http://files.eyee.com/Shop/system/main/232a8df4b5664f759f7f97e915e4a8fb.png" // 活动图片
    };
  },
  mounted() {
    // var key = this.$route.params.key
    // if (key) {
    //   this.pagedata.keyword = key
    // }
    this.reload();
    if (this.$route.path.indexOf("discount") > 0) {
      this.Show = false;
    }
  },
  components: { ProductUnit, ConditionList, HomeSupreme },
  watch: {
    searchOption: function(newValue, oldValue) {
      this.req();
    }
  },
  methods: {
    // 按条件排序
    chadiao(val) {
      this.chadiaoData = val;
      console.log("searchOption点击----->>", this.styleType, this.searchOption);
    },
    selectSort(sort, index) {
      // 排序
      // console.log(this.activeIndex,index)
      this.pagedata.sorttype = sort.sorttype;
      if (this.activeIndex != index) {
        this.reload();
      }
      this.activeIndex = index;
      // 高亮所选排序type
      this.sortPrice = this.sortPrice.map(data => {
        data.selected = false;
        return data;
      });
      this.sorttypes = this.sorttypes.map(data => {
        data.selected = false;
        return data;
      });
      this.sorttypes[index].selected = true;
      console.log(this.activeIndex, index);
    },
    selectPrice(sort) {
      console.log(sort, this.activeIndex);
      this.pagedata.sorttype = sort.sorttype;
      // 图标切换
      if (this.activeIndex === 4) {
        sort.updown = !sort.updown;
      } else {
        sort.updown = false;
      }
      this.activeIndex = 4;
      // 排序规则切换
      this.pagedata.ordertype = !sort.updown ? 1 : 0;
      // 高亮所选排序type
      this.sorttypes = this.sorttypes.map(data => {
        data.selected = false;
        return data;
      });
      this.sortPrice[0].selected = true;
      this.reload();
    },
    reload($el) {
      this.listgetting = 0;
      if (this.$parent.$el.children[1]) {
        this.$parent.$el.children[1].style.height = "auto";
      }
      this.prodlists = [];
      this.pagedata.pageindex = 1;
      this.hasdata = 2;
      if (this.styleType == 1) {
        this.$store.dispatch("setShopFixedMenu", false);
        this.$store.dispatch("setShopTopNavi", false);
      }
      this.req();
    },
    loadmore($el) {
      if (this.isEnd === true) {
        this.toast("已无更多");
      } else if (this.hasdata != 0) {
        this.pagedata.pageindex += 1;
        this.req();
      }
    },
    req() {
      // 按条件搜索
      this.isLoading = true;
      this.isEnd = false;
      this.paramArr = this.pagedata;
      var set = this.searchOption;
      // console.log('set',this.styleType)
      if (this.styleType && this.styleType == 1) {
        set = this.shopOption;
      } else {
        set = this.searchOption;
      }

      this.paramArr.brandid = set.brandid;
      this.paramArr.categoryid = set.categoryid;
      this.paramArr.beginprice = set.beginprice;
      if (set.endprice == -1) {
        this.paramArr.endprice = null;
      } else {
        this.paramArr.endprice = set.endprice;
      }
      if (!set.size && this.styleType != 1) {
        if (set.categoryid || set.brandid) {
          set.keyword = null;
        }
      }
      if (set.keyword != null) {
        this.paramArr.keyword = set.keyword;
      }
      if (this.paramArr.brandid || this.paramArr.categoryid) {
        this.paramArr.keyword = set.keyword;
      }
      var params = this.$route.params;
      console.log(this.$route.params, "路由参数");
      if (params && params.id) {
        this.pagedata.businessid = params.id;
      }
      if (
        !this.paramArr.businessid &&
        !this.paramArr.keyword &&
        !this.paramArr.brandid &&
        !this.paramArr.categoryid &&
        !this.paramArr.beginprice &&
        !this.paramArr.endprice
      ) {
        this.paramArr.issearchall = 1;
      }
      // console.log('提交的参数',JSON.stringify( this.pagedata))
      for (var p in this.pagedata) {
        if (this.pagedata[p] || this.pagedata[p] == 0) {
        } else {
          delete this.pagedata[p];
        }
      }
      // 正常搜索
      if (this.styleType == 0) {
        this.prodSearch();
      }
      // 店铺搜索
      if (this.styleType == 1) {
        this.shopSearch();
      }
      // 折扣搜索
      if (this.styleType == 2) {
        this.discountSearch();
      }
      // 平台大促分会场搜索
      if (this.styleType === 3) {
        this.activitySearch();
      }
    },
    activitySearch() {
      var page = this.pagedata;
      this.isLoading = true;
      let searchOption = this.searchOption;
      page.pageindex = this.pagedata.pageindex;
      PlatformActivitySearch({
        pageindex: page.pageindex,
        activityid: this.$route.params.id,
        sorttype: this.pagedata.sorttype,
        ordertype: this.pagedata.ordertype,
        issearchall: 0,
        keyword: searchOption.keyword || "",
        brandid: searchOption.brandid || "",
        categoryid: searchOption.categoryid || "",
        beginprice: searchOption.beginprice || "",
        endprice: searchOption.endprice || ""
      })
        .then(res => {
          if (res) {
            console.log("activity list", res.list);
            this.sumAlls = res.sumcount || 0;
            // for(let i=0;i<res.list.length;i++){
            //   if(this.activityIsBegin){
            //     res.list[i].salestatus = 1
            //   }else{
            //     res.list[i].salestatus = 2
            //   }
            // }
            if (res && res.list && res.list.length > 0) this.listgetting = 1;
            else if (this.pagedata.pageindex === 1) this.listgetting = 2;
            if (res.sumcount == 0) {
              this.isEnd = false;
            } else {
              if (res.pageindex > 0) page.pageindex = res.pageindex;
              if (res.sumcount > -1) page.sumcount = res.sumcount;
              if (res.pagesize > -1) page.pagesize = res.pagesize;
              if (page.pageindex * page.pagesize >= page.sumcount) {
                this.isEnd = true;
              }
            }
            if (res.pageindex == 1) this.prodlists = res.list;
            else this.prodlists.push(...res.list);
          } else this.isEnd = true;
          this.isLoading = false;
        })
        .catch(e => {
          this.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    goFilter() {
      // 跳转到搜索项
      console.log("searchOption点击-----", this.styleType, this.searchOption);
      if (this.styleType == 0) {
        this.$store.dispatch("setFilteType", 2);
        this.$router.push("/shopFilter/" + ENUM.FilterType.productSearch.val);
      } else if (this.styleType == 1) {
        this.$store.dispatch("setFilteType", 3);
        this.$router.push("/shopFilter/" + ENUM.FilterType.shopSearch.val);
      } else if (this.styleType == 2) {
        this.$store.dispatch("setFilteType", 0);
        this.$router.push("/shopFilter/" + ENUM.FilterType.productSearch.val);
        let brandkeyword = {};
        this.$store.dispatch("resetOption", 2);
        this.$store.dispatch("setKeywordBrand", brandkeyword);
      } else if (this.styleType === 3) {
        this.$store.dispatch("setFilteType", 2); // -----------提交的什么？过滤样式？
        this.$router.push("/shopFilter/" + ENUM.FilterType.productSearch.val);
      }
    },
    prodSearch() {
      // let _ = this
      this.pagedata.keyword = this.$route.params.key;
      let set = this.searchOption;
      // console.log('kkkk',this.searchOption)
      if (
        set.brandName == "全部" &&
        !set.keyword &&
        set.categoryName == "全部" &&
        set.keyword == "全部" &&
        set.sizeName == "全部"
      ) {
        this.pagedata.keyword = "";
        this.pagedata.issearchall = 1;
      } else {
        this.pagedata.categoryid = set.categoryid;
        this.pagedata.brandid = set.brandid;
        this.pagedata.keyword = set.keyword || this.$route.params.key;
        console.log("kkkk", set.keyword);
        if (
          this.pagedata.keyword == this.$route.params.key &&
          set.keyword &&
          this.$route.params.key != set.keyword
        ) {
          this.pagedata.keyword = "";
          // this.pagedata.issearchall = 1
        }
      }

      if (
        this.pagedata.keyword == "" &&
        this.pagedata.issearchall == 0 &&
        !set.brandid &&
        !set.categoryid
      ) {
        this.pagedata.issearchall = 1;
      }

      console.log("正常搜索参数111", this.pagedata);
      ProdSearch(this.pagedata)
        .then(res => {
          if (res && res.list && res.list.length > 0) this.listgetting = 1;
          else if (this.pagedata.pageindex === 1) this.listgetting = 2;
          if (res) {
            console.log("返回值", res);
            var brandkeyword = { brandName: "全部" };

            if (res.brand && res.brand.id) {
              // console.log('this.mallnewType',this.mallnewType)
              if (
                this.mallnewType == 1 ||
                (this.mallnewType == 2 && !this.isKeywordBrand.isreset)
              ) {
                this.brandInfo = res.brand;
                brandkeyword.isBrand = true;
                brandkeyword.brandName = res.brand.name;
                brandkeyword.brandId = res.brand.id;
              }
            }
            //  console.log('searchOption-----')
            this.$store.dispatch("setKeywordBrand", brandkeyword);
            if (res.specialbrand && res.specialbrand.id) {
              this.specialBrandInfo = [res.specialbrand];
            }
            this.sumAlls = res.sumcount;
            this.showInfo = true;
            if (this.paramArr.pageindex == 1) this.prodlists = res.list;
            else this.prodlists.push(...res.list);
            if (res.pageindex > 0) this.paramArr.pageindex = res.pageindex;
            if (res.sumcount > -1) this.pagelist.sumcount = res.sumcount;
            if (res.pagesize > -1) this.pagelist.pagesize = res.pagesize;
            if (
              this.paramArr.pageindex * this.pagelist.pagesize >=
              this.pagelist.sumcount
            )
              this.isEnd = true;
            this.hasdata = 1;
            if (res.sumcount == 0) {
              this.hasdata = 0;
              this.isEnd = false;
              this.isLoading = false;
            }
          } else this.toast("加载失败");
          this.isLoading = false;
        })
        .catch(e => {
          if (this.pagedata.pageindex === 1) this.listgetting = 2;
          this.hasdata = 2;
          this.isLoading = false;
          this.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    shopSearch() {
      // console.log('店铺搜索参数222',this.searchOption)
      console.log("店铺搜索参数111", this.paramArr);
      SearchProduct(this.paramArr)
        .then(res => {
          if (res && res.list && res.list.length > 0) this.listgetting = 1;
          else if (this.pagedata.pageindex === 1) this.listgetting = 2;
          if (res) {
            this.sumAlls = res.sumcount;
            if (res.pageindex == 1) this.prodlists = res.list;
            else this.prodlists.push(...res.list);
            if (res.pageindex > 0) this.paramArr.pageindex = res.pageindex;
            if (res.sumcount > -1) this.pagelist.sumcount = res.sumcount;
            if (res.pagesize > -1) this.pagelist.pagesize = res.pagesize;
            if (
              this.paramArr.pageindex * this.pagelist.pagesize >=
              this.pagelist.sumcount
            )
              this.isEnd = true;
            this.hasdata = 1;
          } else this.toast("没有相关商品");
          this.isLoading = false;
        })
        .catch(e => {
          if (this.pagedata.pageindex === 1) this.listgetting = 2;
          this.hasdata = 2;
          this.isLoading = false;
          this.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    discountSearch() {
      // 折扣价
      // this.pagedata.issearchall = 1
      //  if(this.searchOption.value){
      //     this.pagedata.keyword=this.searchOption.value

      //   }else{
      //     this.pagedata.issearchall = 1
      //      this.pagedata.keyword=''
      //   }
      // console.log('店铺搜索参数222', this.searchOption)
      this.pagedata.brandid = "";
      console.log("折扣参数", this.pagedata);

      DiscountSearch(this.pagedata)
        .then(res => {
          if (res && res.list && res.list.length > 0) this.listgetting = 1;
          else if (this.pagedata.pageindex === 1) this.listgetting = 2;
          if (res) {
            this.sumAlls = res.sumcount;
            if (this.paramArr.pageindex == 1) this.prodlists = res.list;
            else this.prodlists.push(...res.list);
            if (res.pageindex > 0) this.paramArr.pageindex = res.pageindex;
            if (res.sumcount > -1) this.pagelist.sumcount = res.sumcount;
            if (res.pagesize > -1) this.pagelist.pagesize = res.pagesize;
            if (
              this.paramArr.pageindex * this.pagelist.pagesize >=
              this.pagelist.sumcount
            )
              this.isEnd = true;
            this.hasdata = 1;
            if (res.sumcount == 0) {
              this.hasdata = 0;
              this.isEnd = false;
              this.isLoading = false;
            }
          } else this.toast("加载失败");
          this.isLoading = false;
        })
        .catch(e => {
          if (this.pagedata.pageindex === 1) this.listgetting = 2;
          this.hasdata = 2;
          this.isLoading = false;
          this.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    goProduct(item, idx) {
      let param = { order: idx + 1, id: item.id, name: item.name };
    }
  },
  computed: {
    ...mapGetters({
      insq: "insq",
      info: "productData",
      productLists: "productLists",
      setOptions: "setOptions",
      searchOption: "searchOption",
      shopOption: "shopOption",
      isShowNavi: "shopTopNavi",
      isKeywordBrand: "isKeywordBrand"
      // ,
      // specialBrand: 'homeSpecialBrands'
    }),
    specialBrand() {
      return this.specialBrandInfo;
    }
  }
};
</script>
<style scoped>
.fix_top {
  width: 100%;
  position: sticky;
  top: 48px;
  background: #fff;
  z-index: 10;
}
.discount_fix {
  width: 100%;
  position: fixed;
  top: 88px;
  background: #fff;
  z-index: 10;
}

.shop_product .tab_sorttype {
  border-top: 1px solid #f2f2f2;
  height: 40px;
  line-height: 40px;
  font-size: 0.75rem;
  color: #999;
  padding: 0 10px;
}

.filter_btn {
  display: inline-block;
  font-size: 14px;
  color: #333;
  margin-left: 20px;
}
.filter_btn > em {
  display: inline-block;
  width: 15px;
  height: 15px;
  background: url(//files.eyee.com/mcdn/static/img/filter_icon.png) no-repeat
    center;
  background-size: 15px 15px;
  vertical-align: -2px;
  margin: 0 2px;
}
.shop_product .tab_sorttype > label {
  position: relative;
  display: block;
  float: left;
  padding: 0 5px;
  font-size: 14px;
}
.shop_product .item_nums {
  float: right;
  font-size: 14px;
  color: #999;
}
.shop_product .item_nums > span:first-child {
  font-weight: 600;
}
.shop_product .tab_sorttype label .arrow_span:before {
  content: "";
  position: absolute;
  content: "";
  display: inline-block;
  width: 5px;
  height: 5px;
  border-bottom: 1px solid #999;
  border-left: 1px solid #999;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  left: 105%;
  top: 50%;
}
.shop_product .tab_sorttype label .arrow_span:after {
  content: "";
  position: absolute;
  content: "";
  display: inline-block;
  width: 5px;
  height: 5px;
  border-top: 1px solid #999;
  border-right: 1px solid #999;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  left: 105%;
  top: 40%;
}
.shop_product .tab_sorttype > label.clicked {
  color: #000;
}

.shop_product .tab_sorttype > label.clicked span.e-down:before {
  border-color: #000;
}

.shop_product .tab_sorttype > label.clicked span.e-up:after {
  /*border-top: none;
    border-bottom: 6px solid #000;*/
  /*bottom: 4.5px;*/
  border-color: #000;
}

.shop_product .shop_prodlist {
  padding: 5px 5px 0;
  width: 100%;
}
.mint-loadmore {
  width: 100%;
}

/* .shop_product .shop_prodlist :not(.prod-item) .productItem */
.shop_product .shop_prodlist .prod-item {
  display: inline-block;
  width: 50%;
  padding: 0px 5px;
}

.brand_logo {
  text-align: center;
  font-size: 0.75rem;
}

.brand_logo img {
  margin-top: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 1px solid #eee;
}

.brand_name {
  font-weight: 600;
  margin: 5px auto 10px;
}

.brand_memo {
  width: 80%;
  margin: 15px auto;
}

.shop_fix {
  /*margin-top: 90px;*/
}
.disShop_fix {
  padding-top: 40px;
}
</style>
