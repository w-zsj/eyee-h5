<template>
  <div>
    <new-header type="search" class="categ_header"></new-header>

    <div class="typetab flex flex-center">
      <p
        class="tabitem"
        v-for="(item, index) in typetablist"
        :key="index"
        :class="{'selected': item.id==selecttype}"
        @click="gopages(item.id)"
      >{{item.title}}</p>
    </div>

    <!-- 分类  -->
    <div v-if="selecttype == 1">
      <div class="tab_cate flex">
        <div class="nav" :style="insqFix">
          <p class="nav_btns" :class="{'choosen':showsneaker}" @click.prevent="gosneaker()">球鞋</p>
          <p
            class="nav_btns"
            v-for="(item,index) in category"
            :key="index"
            @click.prevent="selectSwi(item.name,index)"
            :class="{'choosen':index == indNow && !showsneaker}"
          >{{item.name}}</p>
        </div>
        <div class="page-tab-container">
          <div><img src="https://files.eyee.com/weapp/c2c/authenticate.png?i=123" alt=""></div>
          <div v-if="showsneaker">
            <SneakerSeries></SneakerSeries>
          </div>
          <mt-tab-container v-else class="page-tabbar-tab-container" v-model="active">
            <mt-tab-container-item
              v-for="(itemP,indexP) in category"
              :key="indexP"
              :id="itemP.name"
            >
              <mt-cell v-for="(childI,indexI) in itemP.child" :key="indexI" title>
                <div class="child_img" @click="searchCate(childI,indexI,itemP.name)">
                  <img v-lazy="https( childI.logourl)" alt>
                  <span>{{childI.name}}</span>
                </div>
                <!-- 
                  :style="{backgroundImage: 'url('+https( childI.logourl) +')'}" 
                <span>{{childI.name}}</span>-->
              </mt-cell>
            </mt-tab-container-item>
          </mt-tab-container>
        </div>
      </div>
    </div>

    <!-- 品牌 -->
    <div v-if="selecttype == 2">
      <div class="hotbrands">
        <p class="brandtitle bggray">- 热门品牌 -</p>
        <div class="brandlist flex-aic flex-wrap">
          <div
            class="imgitem"
            v-for="(item , index) in hotbrandslist"
            :key="index"
            @click="goSearchByBrandid(item.brandid,item.brandname)"
          >
            <img class v-lazy="https(item.coverurl)" alt>
          </div>
        </div>

        <div class="allbrands">
          <p class="brandtitle">- 全部品牌 -</p>
          <BrandAll></BrandAll>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import FilterList from '../templates/FilterList'
import NewHeader from "../../comps/NewHeader";
import { CategoryAll } from "../../common/api/base";
import { ENUM, getUrlParam } from "../../common/util";
import { mapGetters } from "vuex";
import BrandAll from "../../comps/BrandAll";
import SneakerSeries from "../../comps/SneakerSeries";
// import { GroupList } from "@/common/api/cart";
import { getHotBrandList } from "../../utils/api/mall";
export default {
  components: { NewHeader, BrandAll, SneakerSeries },
  data() {
    name: "MallCategory";
    return {
      //   insqFix: window.INSQ ? { top: '10px' } : {},
      active: "",
      sImg: "//files.eyee.com/mcdn/static/img/search_h.png", // require('../../assets/img/search_h.png'),
      category: [],
      indNow: 0,
      // cartSect:0, // 购物车标识
      allImg: "",
      typetablist: [{ title: "分类", id: 1 }, { title: "品牌", id: 2 }],
      selecttype: 1,
      hotbrandslist: [],
      showsneaker: true
    };
  },
  mounted() {


    this.initShare({ type: 1 });
    this.getCategoty();
    console.log(this.searchOption);
    this.getHotBrandList();
  },
  methods: {
    getHotBrandList() {
      let _ = this;
      getHotBrandList()
        .then(res => {
          _.hotbrandslist = res;
        })
        .catch(err => {
          this.toast("加载失败");
        });
    },
    goSearchByBrandid(brandid, brandname) {
      // this.$router.push({
      //   path: "/sneaker/search",
      //   query: { brandid, brandname }
      // });
      let url =
        "/mall/search/" + encodeURIComponent(brandname) + "?brandid=" + brandid;
      this.qzone
        ? this.qzoneGo(url)
        : this.$router.push("/results/" + encodeURIComponent(brandname)+"?brandid=" + brandid);
      var set = {},
        brandkeyword = {};
      set.keyword = brandname;
      brandkeyword.isBrand = true;
      brandkeyword.brandName = brandname;
      brandkeyword.brandId = brandid;
      this.$store.dispatch("setKeywordBrand", brandkeyword);
      console.log(set);
      this.$store.dispatch("confirOption", { data: set });
    },

    gosneaker() {
      let _ = this;
      // console.log('_.showsneaker  1',_.showsneaker)
      _.showsneaker = !_.showsneaker;
      // console.log('_.showsneaker 2',_.showsneaker)
    },
    gopages(id) {
      let _ = this;
      _.selecttype = id;
    },
    selectSwi(name, ind) {
      this.active = name;
      this.indNow = ind;
      this.showsneaker = false;
      console.log(name);
    },
    getCategoty() {
      CategoryAll()
        .then(res => {
          console.log("category res", res);
          if (res) {
            // this.category.push({name:'球鞋' })
            for (var i = 0; i < res.length; i++) {
              if (res[i].haschildren == true) {
                this.category.push(res[i]);
              } else if (res[i].name == "all") {
                this.allImg = res[i].logourl;
              }
            }
            for (var i = 0; i < this.category.length; i++) {
              if (this.category[i].id != null) {
                var id = this.category[i].id,
                  imgurl = this.allImg;
                this.category[i].child = [
                  { name: "全部", id: id, logourl: imgurl }
                ];
                for (var j = 0; j < res.length; j++) {
                  if (res.parentid == 0) {
                    continue;
                  }
                  if (id == res[j].parentid) {
                    this.category[i].child.push(res[j]);
                  }
                }
              }
            }
            console.log(this.category);

            // console.log("cid",this.$route.query.cid)
            let cid = getUrlParam("cid");
            if (cid) {
              for (let i = 0; i < this.category.length; i++) {
                if (cid == this.category[i].id) {
                  this.showsneaker = false;
                  this.indNow = i;
                  this.active = this.category[i].name;
                }
              }
            }
            // GroupList()
            //   .then(res => {
            //     if (res && res.length > 0) {
            //       this.cartSect = 1;
            //     } else this.cartSect = 0;
            //     // console.log('购物车',res)
            //   })
            //   .catch(e => {
            //     console.error(e);
            //   });
          } else {
            this.toast("加载失败");
          }
        })
        .catch(err => {
          this.toast("加载失败");
        });
    },
    searchCate(item, index, catename) {
      sessionStorage.setItem("zhekou", "2");
      console.log("searchCate", item.id);
      var set = {};
      set.items = this.searchOption.items;
      if (index == 0) {
        set.items.name = this.category[this.indNow].name;
      }
      if (this.qzone) {
        this.$router.push(
          "/mall/Search/" + (index == 0 ? set.items.name : item.name)
        );
      }else{
        this.$router.push("/results/" + (index == 0 ? set.items.name : item.name)+'?categoryid='+item.id);
      }
      

      set.categoryid = item.id;
      set.brandName = "全部";
      set.categoryName = item.name;
      set.category = catename;
      this.$store.dispatch("confirOption", { data: set, type: 2 });
      //   console.log('searchOption-----',this.searchOption)
    }
  },
  computed: {
    searchUrl() {
      return "/search/" + ENUM.SearchType.product.val;
    },
    ...mapGetters({
      insq: "insq",
      searchOption: "searchOption"
    }),
    insqFix() {
      return this.insq ? { top: "10px" } : {};
    }
  }
};
</script>
<style scoped>
.allbrands {
  height: 600px;
  overflow: hidden;
}
.hotbrands {
  width: 100%;
}
.brandlist {
  width: 100%;
  /* padding:8px 0px 19px 23px; */
  padding: 0 2%;
}
.brandlist .imgitem {
  width: 21%;
  margin: 0 2%;
  margin-bottom: 4px;
}
.brandlist .imgitem image {
  width: 100%;
}
.brandtitle {
  font-size: 14px;
  font-family: PingFangSC-Regular;
  color: rgba(51, 51, 51, 1);
  line-height: 20px;
  font-weight: 500;
  text-align: center;
  padding: 5px 0;
}
.bggray {
  background: rgba(249, 249, 249, 1);
}
.typetab {
  margin: 12px 0;
}
.typetab .selected {
  color: rgba(255, 255, 255, 1) !important;
  background: rgba(51, 51, 51, 1) !important;
}
.typetab .tabitem {
  color: rgba(51, 51, 51, 1);
  background: rgba(255, 255, 255, 1);
  padding: 4px 30px;
  line-height: 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(51, 51, 51, 1);
}
.categ_header {
  height: 48px;
}
.categ_header p {
  font-weight: 600;
}
.seackBtn {
  position: absolute;
  right: 40px;
  top: 13px;
  text-align: center;
  width: 60px;
}

.seackBtn img {
  vertical-align: middle;
  width: 20px;
}
.cates {
  width: 95%;
  margin: 0 auto;
}
.tab_cate {
  padding-top: 10px;
  /* border-top: 1px solid #f2f2f2; */
}
.tab_cate .nav {
  /* position: fixed; */
  height: 30px;
  line-height: 30px;
  /* top: 90px;
  left: 0; */
  z-index: 1;
  width: 30%;
}
.tab_cate .nav .nav_btns {
  display: block;
  height: 40px;
  padding: 0 10px;
  line-height: 40px;
  background: #f2f2f2;
  border-bottom: 1px solid #fff;
  text-align: center;
  font-size: 14px;
  color: #333;
}
.tab_cate .nav .nav_btns.choosen {
  background: #fff;
  border-left: 2px #8050ff solid;
}
.tab_cate .page-tab-container {
  width: 100%;
}
.child_img {
  position: relative;
  width: 100%;
  height: 100px;
  text-align: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.child_img p {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.2);
}
.child_img span {
  position: absolute;
  z-index: 1;
  display: block;
  /* top: 50%; */
  bottom: 0;
  color: #333333;
  font-size: 11px;
  width: 100%;
  text-align: center;
  /* height: 20px;
  margin-top: -10px; */
}
.page-tab-container {
  padding-left: 20px;
  padding-right: 7px;
}
</style>
