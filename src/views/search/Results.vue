<template>
  <div class="wrap-shop">
    <v-header :showback="true">
      <div class="sc-input flex-center" @click.stop.prevent="goSearch">
        <input type="text" :placeholder="scParam.keyword" :value="scParam.keyword" readonly />
        <img class="ico-search" :src="sImg" alt />
        <div class="searchTop" @click.stop="sneakerMall">
          <img src="/static/imgs/search/searchTop.png" alt />
        </div>
      </div>
    </v-header>
    <div class="sh-tabs flex-center" @click.stop="tabsSwitch" v-if="scParam.isc2c!=1">
      <span :class="{active:tabindex==0}" data-type="0">
        商品
        <i></i>
      </span>
      <span :class="{active:tabindex==1}" data-type="1">
        潮店
        <i></i>
      </span>
    </div>
    <div class="flex-around mh-filters" @click="toggleSort" v-if="tabindex==0">
      <!-- 0:筛选,1综合,2新品,3价格 -->
      <label :class="{act:sort.type==1}" data-type="1">综合</label>
      <label :class="{act:sort.type==4}" data-type="4">销量</label>

      <label :class="{act:sort.type==2}" data-type="2">新品</label>
      <label
        class="filter-price"
        :class="{act:sort.type==3,down:sort.order==0,up:sort.order==1}"
        data-type="3"
      >价格</label>
      <label data-type="0">
        筛选
        <img src="/static/imgs/mall/ico-filter.png" alt />
      </label>
    </div>
    <div class="search-product list-panel">
      <div class="nodata" v-if="recommendwords&&recommendwords.length>0&&tabindex==0">
        <div class="flex-center tj-noda">
          你是不是想找
          <div>
            <span v-for="(item,indx) in recommendwords" :key="indx" @click="recWords(item)">{{item}}</span>
          </div>
        </div>
        <div class="tj-product flex-center">
          为你推荐
          <span
            v-for="(item,indx) in recommendwords"
            :key="indx"
            @click="recWords(item)"
          >{{item}}</span> 相关商品
        </div>
      </div>

      <div class="nodata" v-if="!searchError&&tabindex==0">
        <div class="flex-center tj-noda">未能筛选到相关数据</div>
        <div
          class="add-product flex-center"
          @click.stop="applyAddProduct"
          v-if="scParam.isc2c==1"
        >申请添加商品</div>
        <div class="tj-product flex-center">
          <div style="font-weight:bold;">—— &nbsp;&nbsp;为你推荐&nbsp;&nbsp;——</div>
        </div>
      </div>
      <div class="noshop flex-col flex-center" v-if="shopList.length<1&&tabindex==1">
        <img src="/static/img/shop_default.png" alt />
        <span class="noshopdata">暂无更多店铺</span>
        <span class="gostroll" @click.stop="gostroll">去逛逛</span>
      </div>
      <v-list
        :load-handle="()=>{}"
        :more-handle="rcdloadmore"
        :more-handling="isLoading"
        :isend="isend"
      >
        <div class="plist-dbl flex-wrap flex-between rcd-list" v-if="tabindex==0">
          <product-unit
            v-for="(iRcd,rcdIdx) in rcd.list"
            :key="'rcd'+rcdIdx"
            :product-item="iRcd"
            :product-type="20"
            :searchResult="true"
            :index="rcdIdx"
          ></product-unit>
        </div>
        <div class="shop" v-else>
          <div class="shop-list" v-for="(item,i) in shopList" :key="i">
            <div class="shop-top flex-aic">
              <div class="logo flex-aic">
                <img v-lazy="https(item.headportraiturl)" alt />
                <div class="shop-brand-name flex-col flex-around">
                  <span class="brand-name">{{item.businessname}}</span>
                  <span class="fans">
                    <i :class="item.classIcon"></i>
                    {{item.favorcount}}
                  </span>
                </div>
              </div>
              <div class="shop-product flex-end">
                <span class="flex-center" @click.stop="ShopDetail(item.businessid)">进店逛逛</span>
              </div>
            </div>
            <div class="shop-pro-list flex-aic">
              <div
                class="product"
                v-for="items in item.productlist"
                :key="items.id"
                @click.stop="productDetail(items.id)"
              >
                <div class="img">
                  <img v-lazy="https(items.mainpic)" alt />
                </div>
                <div
                  class="product-name ellipsis-2"
                  style="-webkit-box-orient: vertical;"
                >{{items.name}}</div>
                <div class="price">￥{{items.specialprice>0?items.specialprice:items.saleprice}}</div>
              </div>
            </div>
          </div>
        </div>
      </v-list>
    </div>
    <mall-filter
      :keyword="key"
      :show="filterShow"
      :searchType="1"
      :scParam="scParam"
      @search="filterSearch"
      @close="filterShow=false"
    ></mall-filter>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import ProductUnit from "@/components/templates/ProductUnit";
// import ShopUnit from "../../components/templates/shopUnit";
import MallFilter from "@/comps/FilterProduct";
import { RecommendProduct } from "@/utils/api/mall";
import { SearchShop } from "../../common/api/base";
import { searchPro, Condition, ShopList } from "../../utils/api/search.js";
const defaultSearch = {
  pageindex: 1,
  keyword: "",
  brandid: "",
  categoryid: "",
  businessid: "",
  size: "",
  isc2c: 2,
  // beginprice: "",
  // endprice: "",
  seriesid: "",
  pagesize: 10
};
export default {
  name: "SearchResults",
  components: { ProductUnit, MallFilter },
  data() {
    return {
      key: "",
      keywordValue: "",
      sImg: "//files.eyee.com/mcdn/static/img/search_gray.png", // require('../../assets/img/search_gray.png'),
      tabindex: 0,
      scParam: { ...defaultSearch },
      sort: {
        type: 4, // 0:筛选,1综合,2新品,3价格,4销量
        order: 0
      },
      rcd: {
        list: [],
        pageindex: 1
      },
      filterShow: false,
      shopList: [],
      isLoading: false,
      isend: false,
      pagedata: { sumcount: 0, pagesize: 0, pageindex: 1 },
      recommendwords: [],
      searchError: true
    };
  },
  computed: {
    ...mapGetters({
      baseValue: "baseValue"
    })
  },
  mounted() {
    let _ = this;
    let Query = _.$route.query;
    _.scParam.keyword =
      _.$route.params.key != "''" && _.$route.params.key != "undefined"
        ? _.$route.params.key
        : "";
    _.scParam.brandid = Query.brandid || "";
    _.scParam.categoryid = Query.categoryid || "";
    _.scParam.seriesid = Query.seriesid || "";
    _.scParam.isc2c = Query.isc2c;

    // 排序类型 1综合人气 2 销量 3新品 4 价格
    if (this.baseValue && this.baseValue.sorttype) {
      switch (this.baseValue.sorttype) {
        case 1:
          _.sort.type = 1;
          break;
        case 2:
          _.sort.type = 4;
          break;
        case 3:
          _.sort.type = 2;
          break;
        case 4:
          _.sort.type = 3;
          break;
      }
    }
    _.searchProduct();
    // console.log("baseValue---------", this.baseValue);
  },
  methods: {
    sneakerMall() {
      this.$router.push("/sneaker/mall");
    },
    goSearch() {
      let path =
        "/nesearch" +
        (this.scParam.isc2c == 1 && !this.scParam.seriesid ? "?isc2c=1" : "");
      this.$router.replace(path);
    },
    tabsSwitch(e) {
      let _ = this;
      let { type } = e.target.dataset;
      if (_.tabindex == type) return;
      else {
        _.tabindex = type;
        _.scParam.keyword = _.$route.params.key;
        _.sort.order = 0;
        _.reset();
        _.clearFil();
        if (type == 1) {
          _.shopList = [];
          _.loadShops();
        } else {
          _.rcd.list = [];
          _.searchProduct();
        }
      }
      if (_.tabindex != type) {
        _.tabindex = type;
      }
    },
    gostroll() {
      this.$router.replace("/");
    },
    clearFil() {
      let _ = this;
      _.scParam.beginprice = "";
      _.scParam.endprice = "";
      _.scParam.size = "";
      _.scParam.brandid = "";
      _.scParam.categoryid = "";
    },
    reset(setAll) {
      let _ = this;
      _.isLoading = false;
      _.pagedata.pageindex = 1;
      _.rcd.pageindex = 1;
      _.isend = false;
    },
    toggleSort(e) {
      let _ = this;
      let { type } = e.target.dataset;
      let { sort, tabindex } = _;
      if (isNaN(type) || (type != 3 && sort.type == type)) return;
      if (type > 0) {
        // 类型为价格时改变排序
        if (sort.type == 3 && type == 3) sort.order = Number(!sort.order);
        else sort.order = 0;
        // if (sort.type != type)
        // _.clearFil();
        sort.type = Number(type);
        _.scParam.keyword = _.$route.params.key;
        _.reset();

        _.$nextTick(() => {
          scrollTo(0, _.tabTop);
        });
        _.searchProduct();
        console.log("sort.type", _.sort);
      } else {
        // toggleFilter
        _.scParam.keyword = _.recommendwords.join(" ")
          ? _.recommendwords.join(" ")
          : _.$route.params.key;
        _.filterShow = true;
      }
    },
    loadShops() {
      let _ = this;
      _.isLoading = true;
      let page = _.pagedata;
      console.log(_.scParam, "潮店参数222");
      ShopList({ ..._.scParam, page: page.pageindex, pagesize: 20 })
        .then(res => {
          if (res) {
            if (res.list) {
              console.log(res);
              if (res.pageindex == 1) _.shopList = res.list;
              else _.shopList.push(...res.list);
              _.shopList = _.shopList.map(i => {
                if (i.isglobalpurchase) {
                  i.classIcon = "ico-sp-glb";
                } else {
                  switch (i.businesstype) {
                    case 1:
                      i.classIcon = "ico-sp-official";
                      break;
                    case 2:
                      i.classIcon = "ico-sp-buy";
                      break;
                    case 3:
                      i.classIcon = "ico-sp-store";
                      break;
                  }
                }

                return i;
              });
            }
            page.pageindex = res.pageindex;
            page.sumcount = res.sumcount;
            page.pagesize = res.pagesize;
            if (page.pageindex * page.pagesize >= page.sumcount) {
              _.isend = true;
            }
          } else _.isend = true;
          _.isLoading = false;
        })
        .catch(e => {
          _.isLoading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    ShopDetail(businessid) {
      this.$router.push("/shop/shopdetail/" + businessid);
    },
    productDetail(id) {
      this.$router.push("/productDetail/" + id);
    },
    applyAddProduct() {
      this.$router.push("/applyAddProduct");
    },
    recWords(keyword) {
      let _ = this;
      _.scParam.keyword = keyword;
      _.recommendwords = [];
      _.searchProduct();
    },
    searchProduct() {
      let _ = this,
        { sc, scParam, sort } = _;
      // 排序类型转换
      // 0:筛选,1综合,2新品,3价格 4 销量 => 1-综合;4-价格;2-销量;3-新品;5-热度
      let sorttype = 0;
      let ordertype = sort.order;
      _.isLoading = true;
      switch (sort.type) {
        case 1:
          sorttype = 1;
          ordertype = 2;
          break;
        case 2:
          sorttype = 3;
          ordertype = 2;
          break;
        case 3:
          sorttype = 4;
          if (sort.order) ordertype = 1;
          else ordertype = 2;
          break;
        case 4:
          sorttype = 2;
          ordertype = 2;
          break;
      }
      searchPro({ ...scParam, sorttype, ordertype, page: scParam.pageindex })
        .then(res => {
          let _ = this;
          if (res.recommendwords && res.recommendwords.length > 0) {
            console.log(res.recommendwords, "res.recommendwords");
            _.recommendwords = res.recommendwords;
            _.searchError = true;
          }
          if (res && res.list && res.list.length) {
            _.searchError = true;
            res.list = res.list.map(i => {
              i.paynumber = i.sumcount;
              i.mainpic = i.mainpic + "|";
              return i;
            });
            // console.log("ProductSearch res", res);
            if (_.scParam.pageindex === 1) _.rcd.list = res.list;
            else _.rcd.list = _.rcd.list.concat(res.list);
            _.isend =
              res.pageindex * res.pagesize >= res.sumcount &&
              _.rcd.list.length > 0;
          } else if (_.scParam.pageindex === 1) {
            _.rcd.list = [];
            _.searchError = false;
          }
          if (_.scParam.pageindex === 1 && _.rcd.list.length === 0) {
            _.isend = false;
            if (!res.recommendwords || res.recommendwords.length == 0) { _.searchError = false; }
            _.getRecommend();
          }
          _.isLoading = false;
        })
        .catch(e => {
          _.getRecommend();
          _.searchError = false;
          console.error(e);
        });
    },
    getRecommend() {
      let _ = this,
        pageindex = _.rcd.pageindex;
      _.isLoading = true;
      RecommendProduct(pageindex)
        .then(res => {
          if (res && res.list && res.list.length) {
            res.list = res.list.map(i => {
              i.paynumber = i.sumcount;
              return i;
            });
            if (pageindex === 1) _.rcd.list = res.list;
            else _.rcd.list = _.rcd.list.concat(res.list);
            _.isend =
              res.pageindex * res.pagesize >= res.sumcount &&
              _.rcd.list.length > 0;
          } else _.isend = true;
          _.isLoading = false;
        })
        .catch(e => {
          _.isLoading = false;
          _.toast(e && e.msg ? e.msg : "error:" + e);
        });
    },
    rcdloadmore() {
      let _ = this;
      if (_.isLoading) return;
      if (_.isend) _.toast("已无更多");
      else {
        if (_.tabindex == 1) {
          _.pagedata.pageindex++;
          _.loadShops();
        } else {
          if (_.searchError) {
            _.scParam.pageindex++;
            _.searchProduct();
          } else {
            _.rcd.pageindex++;
            _.getRecommend();
          }
        }
      }
    },
    filterSearch(res) {
      console.log("筛选值", res);

      let _ = this;
      let scParam = _.scParam;
      _.filterShow = false;
      _.$nextTick(() => {
        scrollTo(0, _.tabTop);
      });
      if (
        !(
          scParam.brandid == res.brandid &&
          scParam.categoryid == res.categoryid &&
          scParam.endprice == res.price.endprice &&
          scParam.beginprice == res.price.beginprice &&
          scParam.size == res.size.value
        )
      ) {
        scParam.brandid = res.brandid;
        scParam.categoryid = res.categoryid;
        scParam.endprice = res.price.endprice;
        scParam.beginprice = res.price.beginprice;
        scParam.size = res.size.value;
        _.searchProduct();
      }
    }
  },
  watch: {}
};
</script>
<style scoped>
.mint-loadmore {
  background: none;
}
.wrap-shop {
  min-height: 100vh;
  background: #f2f2f2;
}
.shop {
  font-size: 12px;
  /* padding: 0 16px; */
  box-shadow: 0 0 10px #999;
  background: #f2f2f2;
  padding: 0 2vw;
  overflow: hidden;
  padding-bottom: 4.66vw;
}
.shop .shop-list {
  background: #fff;
  margin-top: 4.666vw;
  border-radius: 6px;
  box-shadow: 0px 2px 11px 0px rgba(211, 211, 211, 0.71);
}
.shop .shop-top {
  padding: 6px;
}
.shop .logo {
  width: 80%;
}
.shop .brand-name {
  font-weight: bold;
  font-size: 13px;
}
.shop-brand-name span {
  width: 100%;
  display: inline-block;
}
.shop-brand-name {
  min-height: 54px;
  margin-left: 10%;
}
.shop-brand-name span:nth-child(1) {
  width: 100%;
  text-align: left;
}
.shop-brand-name i {
  transform: rotate(6deg);
}
.shop .logo img {
  width: 25%;
}
.shop-product {
  width: 40%;
  text-align: right;
}
.shop-product span {
  width: 64px;
  height: 20px;
  border-radius: 10px;
  background: #707afc;
  color: #fff;
  font-size: 10px;
}
.shop-pro-list {
  background: #f5f5f5;
  padding: 10px 6px 6px 6px;
  border-radius: 6px;
}
.shop-pro-list .product {
  width: 32%;
  background: #fff;
  border-radius: 6px;
  padding: 0 1.333vw;
}
.shop-pro-list .product:nth-child(2) {
  margin: 0 2.5%;
}
.shop-pro-list .product .img {
  height: 0;
  width: 100%;
  padding-bottom: 100%;
}
.shop-pro-list .product .product-name {
  height: 30px;
  font-size: 11px;
  color: #333;
}
.shop-pro-list .product .price {
  font-size: 14px;
  color: #333;
  font-weight: bold;
  line-height: 35px;
}
.add-product {
  margin: 0 auto;
  padding: 5px 10px;
  border: 1px solid #ccc;
  width: 30%;
  text-align: center;
  border-radius: 15px;
  height: 30px;
  margin-bottom: 20px;
  background: #fff;
}
.sh-tabs span {
  width: 50%;
  text-align: center;
  font-size: 14px;
  color: #999;
  background: #fff;
  line-height: 50px;
  position: relative;
}
.sh-tabs span.active {
  font-weight: bold;
  color: #333;
}
.sh-tabs span.active i {
  position: absolute;
  width: 20px;
  height: 4px;

  background: #707afc;
  left: 50%;
  bottom: 7px;
  border-radius: 2px;
  transform: translateX(-50%);
}
.mh-filters {
  position: sticky;
  top: 48px;
  z-index: 5;
}
.mh-filte,
.mh-filters label {
  font-size: 13px;
  font-weight: 400;
  color: #666;
  line-height: 34px;
  width: 22%;
  text-align: center;
  transition: font 0.2s ease;
}
.mh-filters .act {
  font-weight: bold;
  color: #333;
}

.mh-filters img {
  width: 13px;
  vertical-align: middle;
}
.filter-price {
  position: relative;
  padding-right: 10px;
}
.filter-price::after {
  content: "";
  display: block;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(20px, -2px);
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  transition: border 0.2s ease;
}
.filter-price.down::after {
  border-top: 4px solid;
}
.filter-price.up::after {
  border-bottom: 5px solid;
}
/* .search-product,
.plist-dbl, */
.mh-filters {
  background: #f2f2f2;
}
.plist-dbl {
  padding: 0 2%;
}
.plist-dbl .productItem {
  width: 49%;
  margin: 3vw 0 0;
  /* margin:  0 2% 1% 0; */
  padding: 0;
  border-radius: 8px;
  /* overflow: hidden; */
}
.plist-dbl /deep/ .productItem p {
  padding: 0 10px;
}
.plist-dbl /deep/ .productItem p.product_price {
  margin: 2vw 0;
}
.search-product .nodata {
  font-size: 12px;
  color: #666;
}
.tj-noda {
  height: 80px;
}
.search-product .nodata span {
  color: #707afc;
  border: 1px solid #707afc;
  padding: 4px 8px;
  margin: 0 4px;
  border-radius: 4px;
}
.search-product .nodata .tj-product {
  margin-bottom: 10px;
}
.search-product .nodata .tj-product span {
  border: 0;
}

.noshop {
  padding: 60px 0;
  font-size: 14px;
  color: #333;
}
.noshop img {
  width: 94px;
}
.noshopdata {
  margin: 30px 0;
}
.gostroll {
  color: #fff;
  background: #707afc;
  width: 100px;
  height: 34px;
  text-align: center;
  line-height: 34px;
  border-radius: 17px;
}
.searchTop {
  width: 10%;
  margin-left: 10px;
}
</style>

