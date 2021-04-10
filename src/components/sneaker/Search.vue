<template>
    <div class="main">
        <v-header v-if="!$root.ISAPP">
            <div class="nav-tab2" style="width:90%;">
                <SearchBox :type="2" style="width:100%;height:100%;"></SearchBox>
            </div>
        </v-header>

        <!-- <div class="sort flex flex-center" v-if ="isrecommend" :class="{'insq':insq}">
          <img class="recommend-img" src="../../../static/img/isrecommend.png">
          <span class="recommend">暂无搜索结果 为你推荐热门商品</span>
        </div> -->
        <ul class="sort flex"  :class="{'insq':insq}">
        <!-- <ul class="sort flex" v-if="!keyword&&!isrecommend" :class="{'insq':insq}"> -->
            <li v-for="(item,index) in newsortList" :key='index' :class="{'active-sort' :(index == sortType)||index==4}" @click="switchSort(index)" v-show="index !=1">
              {{item}}
              <img v-show="index == 3&&sortType !== 3" class="price-sort" :src="orderType == 0?'../../../static/img/ascend.png':'../../../static/img/descend.png'">
              <img v-show="index == 3&&sortType === 3" class="price-sort" :src="orderType == 0?'../../../static/img/ascend_active.png':'../../../static/img/descend_active.png'" @click="changeSort(sortType)">

              <img v-show="index == 4" class="price-sort" :src="showsizetablemark?'../../../static/img/product list_icon_up.png':'../../../static/img/product list_icon_down.png'">
              <!-- <img v-show="index == 3" class="price-sort" :src="showsizetablemark?'../../../static/img/product list_icon_up.png':'../../../static/img/product list_icon_down.png'" @click="sizetableshow()"> -->
            </li>
        </ul>
        <div class="selectsize" v-show="showsizetablemark">
          <div class="sizetable" v-show="showsizetablemark">
            <p class="sizeblock" :class="{sizeclick:clckindex == index}" v-for="(item, index) in sizetable" :key="index" @click="selectsize(index)">{{item.size}}</p>
           
          </div>
        </div>
        
        
        <v-list  :load-handle='getCommodityListDataLoad' :more-handle='loadmore' :more-handling='css.isLoading' :isend='css.isEnd'>
            <div class="productnull" v-if ="isrecommend"  :class="{'insq':insq}">
              <p class="nulltext" > 暂时没有找到商品</p>
              <div class="addproduct" @click.stop="applyAddProduct"><p class="addtext">申请添加商品</p></div>

              <p class="recommendtext"> - 为你推荐 -</p>
            </div>
            <div class="commodit flex">
                <div class="commodit-item flex-center flex-col" v-for="(item,index) in commodityList" :key='index' @click="goDetail(item.productid)">
                    <img :src="item.productimgurl" alt="">
                    <span class="commodit-item-name font-price ellipsis ">{{item.productname}}</span>
                    <span class="commodit-item-price font-price">{{item.productprice&&item.productprice.toFixed(2)||'¥ — —'}}</span>
                    <div v-if="index < 10&&!keyword&&!isrecommend" class="sub font-price flex-center" :class='[index<3?"sub-y":"sub-g"]'><span>{{index+1}}</span></div>
                </div>
            </div>
        </v-list>
      </div>
    
</template>

<script>
import { SneakerSearch, SearchSizelist } from "../../common/api/sneaker";
import SearchBox from "../templates/SearchBox";
import { GetGroupProductList } from "../../common/api/group";
import { getUrlParam } from "@/common/util";
import { mapGetters } from "vuex";
export default {
  components: {
    SearchBox
  },
  computed: {
    ...mapGetters({
      insq: "insq"
    }),
    newsortList() {
      // v-if="(index == 3 && sizetable[clckindex] == '全部' )? item: sizetable[clckindex]"
        // console.log("1111",this.sizetable[this.clckindex])
        this.sortList[4] = '尺码'
      if (this.sizetable[this.clckindex].size != '全部'  && this.sizetable.length >0 ) {
        this.sortList[4] = this.sizetable[this.clckindex].size
      } else {
        this.sortList[4] = '尺码'
      }
      return this.sortList
     
    }
  },
  data() {
    return {
      css: {
        isLoading: false,
        isEnd: false,
        hasData: true
      },
      pagination: {
        sumcount: 0,
        pagesize: 10,
        pageindex: 1,
        hasLoad: true
      },
      // sortList: ["人气", "销量", "新品", "价格"],
      sortList: ["人气", "销量", "新品", "价格", "尺码"],
      isEnd: false,
      isLoading: false,
      sortType: 0,
      orderType: 0,
      commodityList: [],
      isrecommend: false,
      keyword: "",
      param: {
        seriesid: "",
        tagid: "",
        brandid: ""
      },

      showsizetablemark: false,
      sizetable: [{size:''}],
      clckindex: 0
    };
  },

  mounted() {
    for (const key in this.param) {
      if (this.param.hasOwnProperty(key)) {
        this.param[key] = getUrlParam(key);
      }
    }
    this.keyword = this.$route.params.key;
    
    this.getCommodityListData();
    this.sizetablecount();

  },

  methods: {
    getCommodityListDataLoad() {
      this.pagination.pageindex = 1;
      this.pagination.pagesize = 10;
      this.commodityList = [];
      this.getCommodityListData();
    },
    loadmore() {
      if (this.css.isEnd === true) {
        this.toast("已无更多");
      } else {
        this.pagination.pageindex += 1;

        // if (this.pagination.pageindex > 1) {
        //   this.pagination.hasLoad = false;
        // }
        this.getCommodityListData();
      }
    },
    getCommodityListData() {
      if (this.css.isLoading) return;
      this.css.isLoading = true;
      // this.isEnd = true;
      let { seriesid, tagid, brandid } = this.param;
      console.log(this.param,'this.param')
      // return
      let keyword = this.keyword
      // if (keyword) {
      //   this.sortType = 1;
      // }
      let sizeselected = ''
      if (this.sizetable[this.clckindex].size == '全部') {
        sizeselected = ''
      } else {
        sizeselected = this.sizetable[this.clckindex].size
      }
      
      let postParams = {
        page: this.pagination.pageindex,
        size: this.pagination.pagesize,
        ordertype: this.sortType === 3 ? this.orderType : 1,
        sorttype: this.sortType,
        seriesid,
        tagid,
        brandid,
        keyword,
        sneakersize: sizeselected
      };
      console.log("postParams", postParams)
      if (postParams.page === 1) {
        this.css.isEnd = false;

        window.scrollTo(0, 0);
      }
      // let sortType = this.sortType;
      // let ordertype = this.orderType;
      SneakerSearch(postParams)
        .then(res => {
          this.isrecommend = res.isrecommend;
          if (res && res.total && res.list.length > 0) {
            this.commodityList.push(...res.list);

            this.css.hasData = true;

            if (
              res.page * res.size >= res.total &&
              this.commodityList.length != 1
            )
              this.css.isEnd = true;
          } else {
            this.css.isEnd = true;
            if (this.commodityList.length == 0) {
              this.css.hasData = false;
            }
            //
          }
          this.css.isLoading = false;
        })
        .catch(e => {
          console.error(e);

          this.css.isLoading = false;
          this.css.hasData = false;
          // this.toast(e && e.msg ? e.msg : ('error:' + e))
        });
    },
    init() {
      this.css = {
        isLoading: false,
        isEnd: false,
        hasData: true
      };
      this.pagination.pageindex = 1;
      this.commodityList = [];
      window.scrollTo(0, 0);
    },
    switchSort(index) {
     
      if (index !== 4) {
         if (index === this.sortType) return;
      this.init();
      this.sortType = index;
      // console.log('this.sortType',this.sortType)

      this.showsizetablemark = false
        this.getCommodityListData();
      }else if (index == 4){
        this.sizetableshow(index)
      }
    },
    changeSort(sortType) {
      this.init();
      if (this.orderType == 0) {
        this.orderType = 1;
      } else if (this.orderType == 1) {
        this.orderType = 0;
      }
      this.getCommodityListData();
    },

    goDetail(id) {
      this.$router.push("/sneaker/detail/" + id);
    },


    sizetablecount() {
      // this.sizetable
      // let size = 35
      // let sizeMax = 47
      // while (size <= sizeMax) {
      //   this.sizetable.push(size)
      //   size = size + 0.5
      // }
      // this.sizetable.push("全部")

      let params = {
        seiesid: this.param.seriesid,
        brandid: this.param.brandid
      }
      SearchSizelist(params)
        .then(res => {
          let data = res
          if (data) {
            this.sizetable = []
            this.sizetable = data.list
            this.sizetable.push({size:'全部'})
            this.clckindex = this.sizetable.length - 1
          } else {
            this.sizetable = []
            // this.sizetable = ["暂无尺码信息"]
            this.clckindex = this.sizetable.length - 1
          }
        }).catch(e => {
          this.toast('尺寸信息加载失败', e)
          console.error('尺寸信息加载失败', e)
        });
     
    },
    sizetableshow(index) {
      if (index == 4) {
        this.showsizetablemark = !this.showsizetablemark
      }
    },
    selectsize(index) {
      this.clckindex = index
      this.showsizetablemark = !this.showsizetablemark

      this.commodityList = [];
      this.getCommodityListData();
    },
    applyAddProduct() {
      this.$router.push("/applyAddProduct");
    }
  }
};
</script>

<style lang="scss" scoped>
.recommend-img {
  height: 16px;
  margin-right: 10px;
}
.recommend {
  color: #333;
  font-size: 14px;
}
.sort {
  position: fixed;
  top: 48px;
  left: 0;
  width: 100%;
  height: 10.6667vw;
  align-items: center;
  background-color: #fff;
  z-index: 2;
  li {
    width: 24%;
    text-align: center;
    font-size: 14px;
    color: #999;
    height: 10.6667vw;
    line-height: 10.6667vw;
  }
  .active-sort {
    font-weight: 600;
    font-size: 16px;
    color: #333;
  }
  .price-sort {
    height: 14px;
    width: 20px;
    position: absolute;
    margin-top: -7px;
    top: 50%;
    margin-left: 2px;
  }
  .price-sort-act {
    height: 14px;
    width: 20px;
    position: absolute;
    margin-top: -7px;
    top: 50%;
    margin-left: 2px;
  }
}
.sort.insq {
  top: 0;
}
.commodit {
  flex-wrap: wrap;
  padding: 10.6667vw 2.6667vw;
  justify-content: space-between;

  .commodit-item {
    width: 47.2vw;
    position: relative;
    color: #333;
    img {
      width: 37.8667vw;
    }
    .commodit-item-name {
      margin-top: 1.8667vw;

      font-size: 13px;
      font-family: BASE_PRICE;
      font-weight: 800;
      width: 38.1333vw;
      height: 8.5333vw;
      text-align: center;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 2;
      // -webkit-box-orient: vertical;
    }
    .commodit-item-price {
      color: #999;
      margin-top: 2.1333vw;
    }
    .sub {
      width: 20px;
      height: 26px;
      background-size: 100% 100%;
      position: absolute;
      top: 1.3333vw;
      left: 1.3333vw;
      span {
        position: relative;
        top: 5px;
        font-size: 14px;
      }
    }
    .sub-y {
      background-image: url("/static/img/sneaker/hot_brand.png");
    }
    .sub-g {
      background-image: url("/static/img/sneaker/hot_brand_three.png");
      color: #fff;
    }
  }
}

.selectsize {
  background-color: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  z-index: 4;
  position: fixed;
  top: 88px;
  left: 0;
  width: 100%;
  height: 100%;

  .sizetable {
    width: 100%;
    background-color: #f5f5f5;
    // padding: 0 0 8px 8px ;
    // margin-top: 88px;
    padding: 0 2%;
    overflow: hidden;
    position: fixed;
    top: 88px;
    left: 0;

    p.sizeblock {
      width: 23%;
      margin: 8px 1%;
      color: #333333;
      font-size: 16px;
      line-height: 26px;
      text-align: center;
      padding: 5px 0;
      background-color: #fff;
      float: left;
    }
    p.sizeclick {
      color: #ffffff;
      background-color: #333333;
    }
    p.sizenulltext {
        color: #333;
        font-size: 16px;
        font-weight: 600;
        padding:20px;
        text-align: center;
    }
  }
}

.productnull {
  width: 100%;
  text-align: center;
  overflow: hidden;

  .nulltext {
    color: #333333;
    font-size: 18px;
    line-height: 14px;
    margin: 90px auto 40px auto;
  }
  .recommendtext {
    color: #333333;
    font-size: 14px;
    line-height: 12px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
  }
  .addproduct {
    width: 50%;
    margin: 40px auto 60px auto;
    border: 1px #cccccc solid;
    border-radius: 20px;
    padding: 6px 27px;
    .addtext {
      color: #666666;
      font-size: 16px;
      line-height: 17px;
    }
  }
}
</style>


