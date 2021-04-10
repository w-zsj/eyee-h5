<template>
  <div class="main">
    <v-header :showback="false" v-if="!insq">
      <div class="head-classification flex-col flex-center" @click="goCategory(1,'a')">
        <img src="/static/img/shopdtl_choose01.png" alt="">
        <span>分类</span>
      </div>
      <SearchBox :type="2" :qzone='insq'></SearchBox>
    </v-header>
    <!-- 轮播图片太大盖住了按钮 -->
    <!-- <div :style='{height:flashHeight}'> -->
    <div>
      <swiper :options="hfOption" v-if="list&&list.length>0" class="homeflash">
        <swiper-slide v-for="(item,index) in list" :key="index" >
          <div @click="goFlash(item,index)" class='flash flex-center'>
            <img :src="item.img|https" :alt="item.title" ref="imgs" class="slideImg">
          </div>
        </swiper-slide>
        <div class="swiper-scrollbar bar" slot="scrollbar"></div>
      </swiper>
    </div>

    <div class="brand flex-between">
      <div v-for="(item,index) in brandList" :key='index' class="brand-item flex-center flex-col" @click="goCategory(item.lookmore, 'b', item.seriesid,item.seriesname)">
        <img :src="item.imgurl">
        <span class="ellipsis">{{item.lookmore?"MORE":item.seriesname}}</span>
      </div>
    </div>

    <!-- <div class="kind flex-between">
      <div class="kind-item" v-for="(item,index) in kindList"  v-bind:style="{ 'background-image': 'url(' + item.imgurl + ')'}" 
      :key='index' @click="goCategory(item.lookmore, item.tab, item.tagid,item.tagname)"> -->
     
        <!-- <img :src="item.imgurl"> -->
        <!-- <div class="kind-item-title">{{item.tagname}}</div> -->
        <!-- <span class="center">{{item.tagname}}</span> -->
      <!-- </div>
    </div> -->

    <div class="sneaker-item">
      <div v-for="(item,index) in othersList" :key="index">

        <div v-if="index < 4" class="in-row" @click="goNextpage(item)" :style="{'background-image': 'url(' + item.bottompic + ')'}" >
          <p class="item-title">{{item.title}}</p>
          <p class="item-text">{{item.detail}}</p>
        </div>
        </div>  
      </div>
    <div class="identify" v-for="(item,index) in othersList" :key="index"   @click="goNextpage(item)">
      <img v-if="index >= 4 && index < 6 "  :src="item.bottompic" alt="">
    </div>

    <div class="recommend">
      <!-- <h2 class="flex-center" style="font-size:14px;">- 为你推荐 -</h2> -->
        <v-list :load-handle='getRecommendListLoad' :more-handle='loadmore' :more-handling='css.isLoading' :isend='css.isEnd'>
        <div class="recommend-list">

          <div class="recommend-item font-price"  v-for="(item,index) in recommendList" @click="goSneakerDetail(item.productid)" :key='index'>
            <div class="flex-center" style="width: 100%;height: 29.3333vw;">
              <img :src="item.imageurl" alt="">
            </div>
            <span class="recommend-name" style="-webkit-box-orient: vertical;">{{item.productname}}</span>
            <span class="recommend-price">¥{{item.price&&item.price.toFixed(2)||' — —'}}</span>
          </div>
        </div>
      </v-list>
    </div>
    
  </div>
</template>
<script>
import HomeFlash from "../templates/HomeFlash";
import SearchBox from "../templates/SearchBox";
import { mapGetters } from "vuex";
import { GetGroupProductList } from "../../common/api/group";
import { Firstpageshow, IndexRecommend } from "../../common/api/sneaker";

export default {
  components: {
    HomeFlash,
    SearchBox
  },
  mounted() {
    if (this.flash && this.flash.length > 0) {
    } else this.$store.dispatch("setHomeGather");

    Firstpageshow({
      os: this.insq ? 5 : 3
    })
      .then(res => {
        this.homeFlash = res.banners;
        this.brandList = res.serieslist;
        this.kindList = res.tags;
        this.othersList = res.others;
        console.log("this.brandList", this.brandList);
      })
      .catch(e => {
        this.toast(e && e.msg ? e.msg : "error:" + e);
      });

    IndexRecommend({
      page: 1,
      size: 20
    }).then(res => {
      this.recommendList = res.list;
    });
  },
  data() {
    return {
      homeFlash: [],
      flashHeight: window.innerWidth * 0.8 + "px",
      brandList: [],
      kindList: [],
      othersList: [],  

      recommendList: [],
      hfOption: {
        autoplay: 2200,
        autoplayDisableOnInteraction: false,
        roundLengths: true,
        updateOnImagesReady: true,
        scrollbar: ".swiper-scrollbar",
        scrollbarHide: false,
        onInit: this.slideChange,
        onSlideChangeEnd: this.slideChange
      },
      css: {
        isLoading: false,
        isEnd: false,
        hasData: true,
        showItems: false
      },
      pagination: {
        sumcount: 0,
        pagesize: 20,
        pageindex: 1,
        hasLoad: true
      },
      isEnd: false,
      isLoading: false
    };
  },
  computed: {
    ...mapGetters({
      flash: "homeFlash",
      insq: "insq"
    }),

    list() {
      // 轮播类型(店铺0 品牌1 分类2 产品详情3 资讯详情4 资讯搜索5 自定义专题6 鬼市7 潮店8 限量9 品牌库10 球鞋榜11 平台大促12 球鞋搜索13 )
      // 资讯类型（0 综合、1图集、2视频）
      let list = this.homeFlash;
      if (list && list.length > 0) {
        list = list.map(i => {
          i.img = i.url;
          i.url = this.getUrl(i.type, i.articletype, i.link, i.channel);
          i.outside = false;
          if (i.type == 6) i.outside = true;
          return i;
        });
        // if (this.qzone) list = list.filter(i => i.id !== '684e2b28993c4b22bdd455fc5145f4b7')
      }
      return list;
    }
  },
  methods: {
    goCategory(lookmore, tab, tagid, brandname) {
      let op = {
        brandname
      };
      if (tab == "b") {
        op.seriesid = tagid;
      } else {
        op.tagid = tagid;
      }
      console.log(op, "op============>");
      if (lookmore) {
        this.$router.push(`/sneaker/category/${tab}`);
      } else {
        this.$router.push({ path: "/sneaker/search", query: op });
      }
    },

    goNextpage(pagedata) {
      // // 0 - 新品发售，2 - 助力砍价，1 - 每日抽奖，3 - 客制周边, 4 - 球鞋鉴定,5 - 图片链接, "int"
      // console.log('pagedata.url', pagedata.url)
      // if (pagedata.type == 0) {
      //   this.$router.push(`/sneaker/newproduct`);
      // } else if (pagedata.type == 2) {
      //   this.$router.push(`/helpbargain`);
      // } else if (pagedata.type == 1) {   //1 - 每日抽奖

      //   this.$router.push(`/drawLottery/lottery`);

      // } else if (pagedata.type == 3) {
      //   this.$router.push(`/sneaker/Customization`);
      // } else if (pagedata.type == 4) {
      //   this.$router.push(`/sneaker/SneakerIdentify`);
      // } else if (pagedata.type == 5) {
      //   window.location.href = pagedata.url
      // } 
      if (pagedata.url) {
        window.location.href = pagedata.url
      } 
    },
    goNewProd() {
      this.$router.push(`/sneaker/newproduct`);
    },
    goHelpHome() {
      this.$router.push(`/helpbargain`);
    },
    goIdentify() {
      this.$router.push(`/sneaker/SneakerIdentify`);
    },
    goLottery() {

    },
    goCustomization() {
      this.$router.push(`/sneaker/Customization`);
    },
    goSneakerDetail(productid) {
      this.$router.push(`/sneaker/detail/${productid}`);
    },

    goFlash(item, idx) {
      console.log("goFlash", item.url, item.outside);
      if (item.type == 1 || item.type == 2) this.goSearch(item);
      else {
        let match = item.url.match(/.*?eyee\.com\/active\/?/gi);
        if (match && match.length === 1) {
          item.outside = false;
          item.url = "/active/" + item.url.replace(match[0], "");
        }
        item.url = item.url.replace(/http:\/\//, "https://");
        // console.log(item.url, 'item.url===========--------------------------------')
        // this.$router.push(item.url)
        this.qzone
          ? this.qzoneGo(item.url)
          : item.outside
            ? window.open(item.url, "_self")
            : this.$router.push(item.url);
      }
    },

    goSearch(data) {
      let path = "/mall/search";
      var set = {};
      if (data.type == 1 && data.channel == 2) {
        path = "/sneaker/search";
        path = path + "?brandid=" + data.link;
        set.brandid = data.link;
      }
      if (data.type == 2) {
        path = path + "?categoryid=" + data.link;
        set.categoryid = data.link;
      }
      if (data.type == 1 && data.channel == 1) {
        path = path + "?categoryid=" + data.link;
        set.brandid = data.link;
      }
      this.$store.dispatch("confirOption", { data: set });
      // this.$router.push('/mall/search')
      this.qzone ? this.qzoneGo(path) : this.$router.push(path);
    },

    getUrl(type, articletype, data, channel) {
      //channel: 1--B2C    2--C2C
      let url = "";
      switch (type) {
        case 0:
          url = "/shop/shopdetail/" + data;
          break;
        case 1:
        url = "/sneaker/search/";
          // if (channel == 1) {
          //   url = '/mall/search/';
          // } else if (channel == 2) {
          //   url = "/sneaker/search/";
          // }
          break;
          
        case 2:
          url = "/mall/search/";
          break;
        case 3:
          // url = "/sneaker/detail/" + data;
          if (channel == 1) {
            url = '/productDetail/' + data
          } else if (channel == 2) {
            url = "/sneaker/detail/" + data;
          }
          break;
        case 4:
          url = "/news/detail/" + data;
          break;
        case 5:
          url = "/news/search/" + data;
          break;
        case 7:
          url = "/mall/ghost";
          break;
        case 8:
          url = "/mall/shop";
          break;
        case 9:
          url = "/mall/limit";
          break;
        case 10:
          url = "/brand";
          break;
        case 11:
          url = "/shoe";
          break;
        case 12:
          url = "/platformActivity/" + data;
          break;
        case 13:
          url = "/sneaker/search/" + data;
          break;
      }
      if (url == "") url = data;
      return url;
    },
    getRecommendListLoad() {
      this.pagination.pageindex = 1;
      this.pagination.pagesize = 20;
      this.recommendList = [];
      this.getRecommendListData();
    },
    loadmore() {
      if (this.css.isEnd === true) {
        this.toast("已无更多");
      } else {
        this.pagination.pageindex += 1;

        // if (this.pagination.pageindex > 1) {
        //   this.pagination.hasLoad = false;
        // }
        this.getRecommendListData();
      }
    },
    getRecommendListData() {
      if (this.css.isLoading) return;
      this.css.isLoading = true;
      // this.isEnd = true;
      let postParams = {
        page: this.pagination.pageindex,
        size: this.pagination.pagesize
      };
      if (postParams.page === 1) {
        this.css.isEnd = false;

        window.scrollTo(0, 0);
      }
      IndexRecommend(postParams, this.pagination.hasLoad)
        .then(res => {
          if (res && res.total && res.list.length > 0) {
            this.recommendList.push(...res.list);

            this.css.hasData = true;

            if (
              res.page * res.size >= res.total &&
              this.recommendList.length != 1
            )
              this.css.isEnd = true;
          } else {
            this.css.isEnd = true;
            if (this.recommendList.length == 0) {
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
    }
  }
};
</script>

<style lang='scss' rel="stylesheet/scss" scoped>
.main {
  width: 100%;
  overflow: hidden;
}
.head-classification {
  width: 15%;
  font-size: 11px;
  color: rgb(102, 102, 102);
  img {
    width: 5.8667vw;
  }
}

.brand {
  flex-wrap: wrap;
  margin-top: 1.3333vw;
  .brand-item {
    width: 25%;
    margin-top: 3.4667vw;
    position: relative;
    &::before {
      content: "";
      width: 13.3333vw;
      height: 13.3333vw;
      position: absolute;
      left: 50%;
      top: 31%;
      transform: translate(-50%, -50%);
      background-color: rgb(245, 245, 245);
      z-index: -1;
      border-radius: 50%;
    }
    img {
      width: 18.2667vw;
    }
    span {
      font-size: 12px;
      margin-top: 4.5333vw;
      display: inline-block;
      width: 90%;
    }
  }
}

.kind {
  padding: 0 2.6667vw;
  margin-top: 5.3333vw;
  margin-bottom: 8vw;
  .kind-item {
    width: 22.6667vw;
    height: 16vw;
    overflow: hidden;
    border-radius: 1.3333vw;
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
    .kind-item-title {
      // background-color: rgba(0,0,0,0.3);
      height: 100%;
      width: 100%;
      line-height: 16vw;
      color: #fff;
      text-align: center;
    }
    // img{
    //   width: 100%;
    //   // filter: brightness(0.7);
    //   border-radius: 1.3333vw;
    // }
    // span{
    //   position: absolute;
    //   font-size: 3.7333vw;
    //   color: #fff;
    // }
  }
}

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.recommend-list {
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;
  margin-top: 0.6667vw;
  border-top:1px #F5F5F5 solid;
}

.recommend-item {
  display: flex;
  flex-direction: column;
  width: 50%;
  // align-items: center;
  // margin-bottom: 4vw;
  padding:2vw 1vw 2vw 5.3333vw;
  border-bottom:1px #F5F5F5 solid;
  border-right:1px #F5F5F5 solid;
  overflow: hidden;
  position: relative;
  padding-bottom: 9vw;
  img {
    height: 100%;
  }


  .recommend-name {
    margin-top: 2.1333vw;
    font-size: 11px;
    display: inline-block;
    width: 90%;
    // text-align: center;
    color: #333333;
    line-height: 16px;
    font-weight: 400;
    font-family:PingFangSC-Regular;

    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .recommend-price {
    color: #333333;
    font-size: 13px;
    margin-top: 2.3333vw;
    font-weight: 600;
    line-height: 14px;
    font-family:DINOT-CondBlack;
    position:absolute;
    left:5.3333vw;
    bottom:2vw;
  }
}
.sneaker-item {
  height: 36.4vw;
  width: 100%;
  margin: 1.6667vw;
  margin-top: 5vw;
  margin-bottom: 2vw;
  // color:#fff
}
.in-row {
  float: left;
  width: 46.3333vw;
  height: 16.2vw;
  margin: 1vw;
  background-repeat: no-repeat;
  background-size: contain;
}
.item-title {
  color: #fff;
  font-size: 14px;
  margin: 3vw 0 0 2vw;
  font-weight: 600;
  font-family:PingFangSC-Medium;
  text-shadow:2px 2px 4px #000000 ;
}
.item-text {
  color: #fff;
  font-size: 1.3333vw;
  margin: 1vw 0 0 2vw;
  font-family:PingFangSC-Regular;
  text-shadow:2px 2px 4px #000000;
}
.new-prod {
  background-image: url("https://files.eyee.com/EYEE/icons/wx-c2center-xinpin.png");
}
.help-bargin {
  background-image: url("https://files.eyee.com/EYEE/icons/wx-c2center-zhuli.png");
}
// .identify {
//   background-image: url("../../../static/img/sneaker/identify.png");
// }
.lottery {
  background-image: url("https://files.eyee.com/EYEE/icons/wx-c2center-choujiang.png");
}
.customization {
  background-image: url("https://files.eyee.com/EYEE/icons/wx-c2center-kezhi.png");
}
.identify {
  // width:100%;
  // background-image: url("https://files.eyee.com/EYEE/icons/wx-c2center-jianding.png");
  overflow: hidden;
  margin:0 1.6667vw;
}
.identify img {
  max-width:100%;
  margin:1vw 0;
}
.flash {
  height: 33.3333vw;
  overflow: hidden;
}
</style>
