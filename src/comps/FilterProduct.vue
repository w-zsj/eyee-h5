<template>
  <div class="mall-filter flex-end" :class="{act:showfliterlist}" @click="close">
    <!-- B2C筛选列表 -->
    <div class="filter-panel" @click.stop>
      <div class="duds-list">
        <div class="listitem item-border" v-if="!isSneaker">
          <p class="title">价格</p>
          <div class="item-for flex-aic flex-wrap">
            <div
              class="ellipsis ck-cell"
              :class="{'selected': item.orderby == select.price.orderby}"
              v-for="(item, index) in pricelist"
              :key="index"
              @click="item.orderby == select.price.orderby?'':selectitem(item,1)"
            >
              <!-- <p v-if=" item.orderby == -1 ">全部</p> -->
              <p v-if="item.endprice>-1">{{item.beginprice}}-{{item.endprice}}</p>
              <p v-else>{{item.beginprice}}以上</p>
              <div class="selected-icon" v-show="item.orderby == select.price.orderby">
                <img src="/static/imgs/mall/ico-mark.png" alt>
              </div>
            </div>
            <div class="inputprice flex-between">
              <input  placeholder="最低价" v-model="minprice">—
              <input  placeholder="最高价" v-model="maxprice">
            </div>
          </div>
        </div>
        <div class="listitem item-border">
          <div class="flex-between">
            <p class="title">尺码</p>
            <p class="up-down flex-center" @click="togglePanel(1)">
              收起
              <img :class="{'reverse':!toggle.size}" src="/static/imgs/mall/ico-arrow-up.png" alt>
            </p>
          </div>
          <div class="item-for flex-aic flex-wrap" v-show="toggle.size">
            <div
              class="ellipsis ck-cell"
              :class="{'selected': item.value == select.size.value}"
              v-for="(item, index) in sizes"
              :key="index"
              @click="item.value == select.size.value?'':selectitem(item,2)"
            >
              {{item.text}}
              <div v-show="item.value == select.size.value" class="selected-icon">
                <img src="/static/imgs/mall/ico-mark.png" alt>
              </div>
            </div>
          </div>
        </div>
        <div class="listitem item-border">
          <div class="flex-between">
            <p class="title">品牌</p>
            <p class="up-down flex-center" @click="togglePanel(2)">
              收起
              <img
                :class="{'reverse':!toggle.brand}"
                src="/static/imgs/mall/ico-arrow-up.png"
                alt
              >
            </p>
          </div>
          <div class="item-for flex-aic flex-wrap" v-show="toggle.brand">
            <div
              class="ellipsis ck-cell"
              :class="{'selected':item.id == select.brandid}"
              v-for="(item, index) in brands"
              :key="index"
              @click="item.id == select.brandid?'':selectitem(item,3)"
            >
              {{item.name}}
              <div v-show="item.id == select.brandid" class="selected-icon">
                <img src="/static/imgs/mall/ico-mark.png" alt>
              </div>
            </div>
          </div>
        </div>
        <div class="listitem" v-if="hasCate||searchType==1">
          <div class="flex-between">
            <p class="title">分类</p>
            <p class="up-down flex-center" @click="togglePanel(3)">
              收起
              <img :class="{'reverse':!toggle.cate}" src="/static/imgs/mall/ico-arrow-up.png" alt>
            </p>
          </div>
          <div class="item-for flex-aic flex-wrap" v-show="toggle.cate">
            <div
              class="ellipsis ck-cell"
              :class="{'selected':item.id == select.categoryid || select.categoryid==categoryid&&index==0}"
              v-for="(item, index) in categories"
              :key="index"
              @click="item.id == select.categoryid?'':selectitem(item,4)"
            >
              {{item.name}}
              <div
                class="selected-icon"
                v-show=" item.id == select.categoryid||select.categoryid==categoryid&&index==0"
              >
                <img src="/static/imgs/mall/ico-mark.png" alt>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="btn flex-around">
        <div class="btn-item reset" @click="reset">
          <p>重置</p>
        </div>
        <div class="btn-item submit" @click="confirmSearch">
          <p>确认</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { B2CSearchCondition } from "@/utils/api/mall";
import { Condition } from "@/utils/api/search";
import {
  getBrandList,
  SearchSizelist,
  FaileSearchSizelist
} from "../common/api/sneaker";
import { HomeTabType } from "@/utils/enum";

import { mapGetters } from "vuex";

var memberCid = "";

export default {
  name: "MallFilter",
  components: {},
  props: {
    show: { type: Boolean, default: false },
    categoryid: { type: String, defalut: "" },
    sizetype: { type: Number, default: 0 }, //#尺码类型 0.服饰，1.鞋靴
    searchType: { type: Number, default: 0 }, // 搜索类型
    scParam: { type: Object }, // 搜索参数
    type: {
      type: Number
    } //#频道类型 1.推荐，2.特卖，3.球鞋，4.B2C类目，5.supreme
  },
  data() {
    return {
      showfliterlist: false,
      toggle: {
        size: true,
        brand: true,
        cate: true
      },

      minprice: "",
      maxprice: "",
      select: {
        brandid: "",
        size: { text: "", value: "" },
        categoryid: "",
        price: { beginprice: "", endprice: "", orderby: -1 }
      },
      pricelist: [],
      brands: [],
      categories: [],
      sizes: []
    };
  },
  watch: {
    show(val, old) {
      console.log("watch show", val);
      let _ = this,
        { type, categoryid } = _;
      _.showfliterlist = val;
      if (val) {
        document.body.classList.add("lock");
        if (_.searchType) _.searchFile();
        else if (!(memberCid && memberCid == categoryid) && _.searchType == 0) {
          _.reset();

          memberCid = categoryid;
          if (type == HomeTabType.sneaker|| type == HomeTabType.costume) {
            _.getBrandList();
          } else if (
            type == HomeTabType.mallCategory ||
            type == HomeTabType.supreme
          ) {
            _.getB2CFilterList();
          }
        }
      } else document.body.classList.remove("lock");
    },
    maxprice(newval,oldval){
      if(newval&&isNaN(newval)){
        this.maxprice=''
      }
    },
    minprice(newval,oldval){
      if(newval&&isNaN(newval)){
        this.minprice=''
      }
    },
    // type(val, old) {
    //   let _ = this;
    //   _.reset();
    //   if (val == HomeTabType.sneaker) {
    //     _.getBrandList();
    //   } else if (
    //     val == HomeTabType.mallCategory ||
    //     val == HomeTabType.supreme
    //   ) {
    //     _.getB2CFilterList();
    //   }
    // }
  },
  computed: {
    isSneaker() {
      return this.type == HomeTabType.sneaker|| this.type == HomeTabType.costume;
    },
    hasCate() {
      return this.type == HomeTabType.mallCategory;
    },
    filterType() {
      let { type } = this;
      if (
        type == HomeTabType.sneaker ||
        type == HomeTabType.mallCategory ||
        type == HomeTabType.supreme
      )
        return type;
      else return HomeTabType.mallCategory;
    }
  },
  // mounted() {
  // let _ = this;
  // if (_.filterType == HomeTabType.sneaker) {
  //   _.getBrandList();
  // } else {
  //   _.getB2CFilterList();
  // }
  // },
  methods: {
    close() {
      let _ = this;
      _.showfliterlist = false;
      _.$emit("close");

      // 关闭也触发搜索
      _.confirmSearch();
    },
    //filterType=3,球鞋，显示的筛选条件
    getBrandList() {
      var _ = this;
      getBrandList()
        .then(res => {
          // 改成B2C品牌结构
          _.brands = [
            // {
            //   name: "全部",
            //   id: ""
            // }
          ];
          if (res) {
            _.brands = _.brands.concat(
              res.map(i => {
                return {
                  name: i.brandname,
                  id: i.brandid
                };
              })
            );
          }
          _.getSneakerSize();
        })
        .catch(err => {
          _.toast("加载失败");
        });
    },
    // 搜索请求筛选数据
    searchFile() {
      let _ = this;
      let params = {
        keyword: _.scParam.keyword,
        isc2c: _.scParam.isc2c
      };
      // let api = _.searchType == 1 ? Condition : B2CSearchCondition;
      Condition(params)
        .then(res => {
          _.pricelist = [...(res.price || [])];
          // orderby
          _.pricelist = _.pricelist.map((i, indx) => {
            i.orderby = indx;
            return i;
          });
          _.brands = [];
          _.categories = [...(res.category || [])];
          _.sizes = [...(res.size || [])];
          let f = [];
          _.sizes.map(i => {
            let fi = {};
            fi.text = i;
            fi.value = i;
            f.push(fi);
            return f;
          });
          // console.log(f)
          _.sizes = f;
          if (_.filterType == HomeTabType.supreme) {
            _.brands = res.brand || [];
            _.select.brandid = _.brands[0].id;
          } else _.brands = _.brands.concat(res.brand || []);
        })
        .catch(err => {
          _.toast("加载失败");
        });
    },
    //请求B2C筛选列表
    getB2CFilterList() {
      let _ = this;
      let params = {
        categoryid: _.categoryid,
        sizetype: _.sizetype,
        type: _.filterType
      };

      B2CSearchCondition(params)
        .then(res => {
          _.pricelist = [...(res.pricerange || [])];
          _.brands = [];
          _.categories = [...(res.category || [])];
          _.sizes = [...(res.size || [])];

          if (_.filterType == HomeTabType.supreme) {
            _.brands = res.hotbrand || [];
            _.select.brandid = _.brands[0].id;
          } else _.brands = _.brands.concat(res.hotbrand || []);
        })
        .catch(err => {
          _.toast("加载失败");
        });
    },
    getSneakerSize(brandid = "") {
      let _ = this;
      let bl = _.searchType == 1 && _.scParam.isc2c;
      let api = bl ? FaileSearchSizelist : SearchSizelist;
      api({ brandid })
        .then(res => {
          let data = res;
          // 改成和B2C尺码一样的结构
          _.sizes = [];
          if (data) {
            if (bl) {
              _.sizes = _.sizes.concat(
                data.size.map(i => {
                  return { text: i, value: i };
                })
              );
            } else {
              _.sizes = _.sizes.concat(
                data.list.map(i => {
                  return { text: i.size, value: i.size };
                })
              );
            }
          }
        })
        .catch(e => {
          _.toast("尺寸信息加载失败", e);
          console.error("尺寸信息加载失败", e);
        });
    },

    //点击选择的事件
    selectitem(item, selecttype) {
      // selecttype: 1 价格，2 尺码，3 品牌，4 分类
      // console.log("select item info", item);
      let _ = this;
      switch (selecttype) {
        case 1: // 价格
          if (item.orderby == _.select.price.orderby) return;
          else {
            _.select.price = item;
            _.minprice = item.beginprice;
            _.maxprice = item.endprice < 0 ? "" : item.endprice;
          }
          break;
        case 2: // 尺码
          if (item.value == _.select.size.value) return;
          else {
            _.select.size.value = item.value;
            _.select.size.text = item.text;
          }
          break;
        case 3: // 品牌
          if (item.id == _.select.brandid) return;
          else {
            _.select.brandid = item.id;
          }
          if (_.isSneaker || _.scParam&&_.scParam.isc2c) {
            // C2C品牌切换重置尺码
            _.select.size.value = "";
            _.select.size.text = "";
            _.getSneakerSize(item.id);
          }
          break;
        case 4: // 分类
          if (item.id == _.select.categoryid) return;
          else {
            _.select.categoryid = item.id;
          }
          break;
      }
    },

    togglePanel(type) {
      let _ = this;
      switch (type) {
        case 1:
          _.toggle.size = !_.toggle.size;
          break;
        case 2:
          _.toggle.brand = !_.toggle.brand;
          break;
        case 3:
          _.toggle.cate = !_.toggle.cate;
          break;
      }
    },
    reset() {
      let _ = this;

      if (_.isSneaker && _.select.brandid) {
        _.sizes = [];
        _.sizes.push({ text: "", value: "" });
        _.getSneakerSize();
      }
      // else {
      // }

      _.select.brandid = "";
      _.select.size.value = "";
      _.select.size.text = "";
      _.select.categoryid = "";
      // _.select.price.orderby = -1;
      _.select.price = { beginprice: "", endprice: "", orderby: -1 };
      _.maxprice = "";
      _.minprice = "";
    },
    confirmSearch() {
      let _ = this;
      if(_.maxprice&& _.minprice){
        if(Number(_.maxprice)<Number(_.minprice)){
          _.toast('最高价要大于最低价哦~')
          return
        }
      }
      if (!_.select.categoryid) _.select.categoryid = _.categoryid || "";
      let payload = { ..._.select };
      payload.price.beginprice = _.minprice
        ? _.minprice
        : _.select.price.beginprice;
      payload.price.endprice = _.maxprice
        ? _.maxprice
        : _.select.price.endprice;
      console.log("submit select info", payload);
      // if (payload.price.orderby == -1) {
      //   payload.price = {
      //     beginprice: "",
      //     endprice: ""
      //   };
      // }

      _.$emit("search", payload);

      _.showfliterlist = false;
    }
  }
};
</script>

<style scoped>
.mall-filter {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: transparent;
  transition: background 0.3s ease-in;
}
.mall-filter.act {
  pointer-events: unset;
  background: rgba(0, 0, 0, 0.4);
}

.filter-panel {
  width: 80%;
  height: 100%;
  /* position:relative; */
  background: #fff;
  position: relative;
  transform: translate(100vw, 0);
  transition: transform 0.2s ease-in;
}
.mall-filter.act .filter-panel {
  transform: translate(0, 0);
}

.filter-panel .sneaker-list,
.filter-panel .duds-list {
  width: 100%;
  padding: 32px 12px;
  height: calc(100% - 52px - 12px);
  overflow: scroll;
}
/* .filter-panel .duds-list {
  width: 100%;
  padding: 32px 12px 0px 12px;
  height: calc(100% - 52px - 12px);
  overflow: scroll;
} */
.filter-panel .btn {
  width: 100%;
  height: 52px;
  margin-top: 12px;
  /* position: absolute;
  bottom: 0%;
  right:0%; */
  padding: 3%;
  /* margin-top:3%; */
}
.filter-panel .btn .btn-item {
  width: 40%;
  border-radius: 18px;
  color: #fff;
  font-size: 16px;
  line-height: 22px;
  text-align: center;
}
.btn .btn-item p {
  padding: 6px 0;
}
.reset {
  background-color: #9aa1ff;
}
.submit {
  background-color: #707afc;
}
.listitem {
  padding-bottom: 12px;
  margin-bottom: 12px;
}

.item-border {
  border-bottom: 1px solid #f5f5f5;
}
.listitem p.title {
  color: #666;
  font-size: 11px;
  line-height: 16px;
  padding-left: 8px;
  /* padding: 12px 0; */
}
.listitem .up-down {
  width: 20%;
  height: 20%;
  color: #999;
  font-size: 11px;
  /* line-height: 16px; */
}
.listitem .up-down img {
  width: 25%;
  height: 25%;
  margin-left: 5%;
}
.listitem .up-down img.reverse {
  transform: scaleY(-1);
}

.listitem .item-for {
  width: 100%;
  padding: 12px 0;
}
.listitem .item-for .inputprice {
  width: 100%;
}
.listitem .item-for .inputprice input {
  background: #f4f4f4;
  border-radius: 14px;
  width: 45%;
  text-align: center;
  padding: 8px 0;
  margin-top: 10px;
}
.listitem .item-for .ck-cell {
  width: 23%;
  background: #f4f4f4;
  margin: 4px 2px;
  padding: 0 2px;
  color: #333;
  font-size: 11px;
  text-align: center;
  border-radius: 2px;
  position: relative;
  line-height: 28px;
  height: 28px;
  transition: background 0.2s ease;
}
.listitem .item-for .selected {
  background: #d7daff;
}
.listitem .item-for .selected-icon {
  width: 15px;
  height: 18px;
  color: #fff;
  text-align: center;
  position: absolute;
  bottom: 0;
  right: 0;
}
.listitem .item-for .selected-icon img {
  width: 100%;
}
</style>
