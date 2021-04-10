<template>
    <div class="main">
        <!-- <ul class="tab">
           
            <li class="tab-item flex-center" v-for="(item,index) in tabList" :class="[item.tab === categoryIndex ? 'tab-active' : '']"  @click="switchTab(item.tab)" :key='index'>{{item.tagname}}</li>
        </ul> -->
        <!-- <div class="content category-swiper" v-if="bannersList&&bannersList.length>0">
            <swiper :options="hfOption" class="homeflash">
                <swiper-slide v-for="(item,index) in list" :key="item.id" class="home_flash" v-if="list&&list.length>0">
                    <div class="flex-center" style="height: 26.6667vw;overflow: hidden;" @click="goFlash(item,index)">
                        <img :src="item.img" :alt="item.title" ref="imgs" class="slideImg">
                    </div>
                </swiper-slide>
                <div class="swiper-scrollbar bar" slot="scrollbar"></div>
            </swiper>
        </div>       -->
         
        <!-- <div class="content" v-show="brandsList.length>0">
                <h2 class="title flex-center">- 热门品牌 -</h2>
                <div class="main-list flex">
                    <div class="list-item flex-col flex-center" v-for="(item,index) in brandsList" @click="goSearchByBrandid(item.brandid,item.brandname)" :key='index'>
                        <img :src="item.imgurl" alt="">
                        
                    </div>
                </div>
        </div>    -->
            <!-- :class="{'list-item2': tabid === 3}"  -->
        <div class="content" v-show="hotseriesList.length>0">
            <h2 class="title flex-center">- 热门系列 -</h2>
            <div class="main-list flex">
                <div class="list-item flex-col flex-center category-item" v-for="(item,index) in hotseriesList" :key='index' @click="openHotSeries(item,index)" ref='element'>
                    <img v-lazy="https(item.imgurl)" alt="">
                    <span>{{item.seriesname}}</span>
                    <img src="/static/imgs/ico-arrow.png" alt="" class="category-img" :class="{'hide-child':item.child&&item.child.length > 0,rotate:item.seriseJudge}" >
                    <div class="child-item" v-show="item.seriseJudge" ref="dialogSeries">
                        <div class="list-item flex-col flex-center category-item category-child-item" 
                        v-for="(child,index) in childHotSeriesList" :key='index' :class="{'lookmore':child.lookmore}"  
                        @click.stop="goSearchBySeriesid(child.seriesid,child.seriesname)">
                            <img v-lazy="https(child.imgurl)" alt="">
                            <span class="ellipsis ">{{child.seriesname}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
        <div class="content"  v-for="(item,index) in seriesList" :key='index' v-show="seriesList.length>0 && item.hotseries.length>0">
            <h2 class="title flex-center">- <img v-lazy="https(item.brandimgurl)" alt="" class="seriesImg"> -</h2>
            <div class="main-list flex">
                <div class="list-item flex-col flex-center category-item" v-for="(series,cindex) in item.hotseries" :key='cindex' @click="openSeries(series,index,cindex)" ref='seriesElement'>
                    <img v-lazy="https(series.imgurl)" alt="">
                    <span>{{series.seriesname}}</span>
                    <img src="/static/imgs/ico-arrow.png" alt="" class="category-img" :class="{'hide-child':series.child &&series.child.length > 0,rotate:series.seriseJudge}" >
                    <div class="child-item" v-show="series.seriseJudge" ref="seriesDialog">
                        <div class="list-item flex-col flex-center category-item category-child-item" v-for="(child,index) in childSeriesList" :key='index' :class="{'lookmore':child.lookmore}"
                          @click.stop="goSearchBySeriesid(child.seriesid,child.seriesname)">
                            <img v-lazy="https(child.imgurl)" alt="">
                            <span class="ellipsis ">{{child.seriesname}}</span>  
                        </div>
                    </div>
                </div>
            </div>
        </div> 
          
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getSeriesList } from "../common/api/sneaker";
export default {
  name:"SneakerSeries",
  computed: {
    ...mapGetters({
      insq: "insq",
      tabid: "tabid"
    }),
    
  },
  components: {
  },
  data() {
    return {
      brandsList: [],
      hotseriesList: [],
      seriesList: [],
      publicCategoryList: [],
      childSeriesList: [],
      childHotSeriesList: [],
      OneSeriesname:'',
      hfOption: {
        autoplay: 2200,
        autoplayDisableOnInteraction: false,
        roundLengths: true,
        updateOnImagesReady: true,
        scrollbar: ".swiper-scrollbar",
        scrollbarHide: false,
        onInit: this.slideChange,
        onSlideChangeEnd: this.slideChange
      }
    };
  },
  mounted() {
    this.getSeriesList();
    // let tab = this.$route.params.tabid;
    // if(!/[a-z]/i.test(tab)){
    //     tab=Number(tab)
    // }
    // console.log(tab)
    // this.switchTab(tab)
  },
  methods: {
    openHotSeries(item, index) {
      var _ = this;
      var numberSerise;
      console.log('item',item);
      if (item.child && item.child.length > 0) {
        console.log(_.$refs.element[index].offsetHeight);
        if (!item.seriseJudge) {
          console.log("展开");
          _.$refs.element.map(item => {
            item.style.height = 21.3333 + "vw";
          });
          _.hotseriesList.map(item => {
            item.seriseJudge = false;
          });
          item.seriseJudge = true;
          var addMoreHotSeriesList = [
            {
              seriesid: item.seriesid,
              lookmore: true,
              seriesname: "全部",
              order:0,
              keyword:item.seriesname
            }
          ];
          addMoreHotSeriesList.unshift(...item.child);
          _.childHotSeriesList = addMoreHotSeriesList;
          _.OneSeriesname = item.seriesname
          // _.childHotSeriesList = item.child;
          numberSerise = Math.ceil((index + 1) / 3);
          _.$refs.dialogSeries[index].style.top =
            numberSerise * (21.3333 + 2.6667) + "vw";
          _.$refs.element[index].style.height =
            Math.ceil(_.childHotSeriesList.length / 3) * 17.3333 +
            (21.3333 + 2.6667) +
            2.6667 +
            "vw";
        } else {
          console.log("收起");
          item.seriseJudge = false;
          _.childHotSeriesList = [];
          _.$refs.element[index].style.height = 21.3333 + "vw";
        }
      } else {
        this.goSearchBySeriesid(item.seriesid, item.seriesname);
      }
    },
    openSeries(item, index, cindex) {
      var _ = this;
      var numberSerise;
      console.log("index:" + index + "；cindex:" + cindex);
      console.log("item:", item);
      let num = 0;
      let total;
      if (item.child && item.child.length > 0) {
        for (var i = 0; i < index; i++) {
          num = num + this.seriesList[i].hotseries.length;
        }
        total = num + cindex;
        console.log('total',total);
        if (!item.seriseJudge) {
          console.log("展开");
          _.seriesList.map(item => {
            item.hotseries.map(item2 => {
              item2["seriseJudge"] = false;
            });
            return item;
          });
          // if(_.$refs.seriesElement&&_.$refs.seriesElement.length>0){
          _.$refs.seriesElement.map(item => {
            item.style.height = 21.3333 + "vw";
          });
          // }
          item.seriseJudge = true;
          var addMoreSeriesList = [
            {
              seriesid: item.seriesid,
              lookmore: true,
              seriesname: "全部"
            }
          ];
          addMoreSeriesList.unshift(...item.child);
          _.childSeriesList = addMoreSeriesList;
          _.OneSeriesname = item.seriesname
          console.log(" _.childSeriesList", _.childSeriesList);
          // console.log(_.childSeriesList)
          numberSerise = Math.ceil((cindex + 1) / 3);
          console.log(numberSerise * (21.3333 + 1) + "vw");
          _.$refs.seriesDialog[total].style.top =
            numberSerise * (21.3333 + 1) + "vw";
          _.$refs.seriesElement[total].style.height =
            Math.ceil(_.childSeriesList.length / 3) * 17.3333 +
            (21.3333 + 1) +
            1 +
            "vw";
        } else {
          console.log("收起");
          item.seriseJudge = false;
          _.childSeriesList = [];
          _.$refs.seriesElement[total].style.height = 21.3333 + "vw";
        }
      } else {
        this.goSearchBySeriesid(item.seriesid, item.seriesname);
      }
    },
    
    // goSearchByBrandid(brandid, brandname) {
    //   this.$router.push({
    //     path: "/sneaker/search",
    //     query: { brandid, brandname }
    //   });
    // },
    goSearchBySeriesid(seriesid, brandname) {
      // console.log(seriesid,'this.OneSeriesname',this.OneSeriesname);
      if(brandname=='全部') brandname = this.OneSeriesname
      this.$router.push("/results/" + encodeURIComponent(brandname)+"?seriesid=" +seriesid+ "&isc2c=1" )
      // this.$router.push({
      //   path: "/sneaker/search",
      //   query: { seriesid: seriesid, brandname }
      // });
     
    },
    // getBrandList() {
    //   var _ = this;
    //   getBrandList()
    //     .then(res => {
    //       _.brandsList = res;
    //     })
    //     .catch(err => {
    //       this.toast("加载失败");
    //     });
    // },
    getSeriesList() {
      var _ = this;
      getSeriesList()
        .then(res => {
          _.hotseriesList = res.hotseries.map(item => {
            item["seriseJudge"] = false;
            return item;
          });
          _.seriesList = res.series.map(item => {
            item.hotseries.map(item2 => {
              item2["seriseJudge"] = false;
            });
            return item;
          });
          console.log(_.seriesList);
        })
        .catch(err => {
          this.toast("加载失败");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.tab {
  width: 24vw;
  position: fixed;
  left: 0;
  top: 48px + 14px;
  .tab-item {
    height: 13.3333vw;
    width: 100%;
    background-color: rgb(242, 242, 242);
    border-bottom: 1px solid #fff;
    border-left: 1.0667vw solid rgb(242, 242, 242);
    font-size: 14px;
    color: #666;
  }
  .tab-active {
    background-color: #fff;
    border-left: 1.0667vw solid #333;
    border-bottom: none;
    color: #333;
    font-weight: 600;
  }
}
.slideImg {
  width: 100%;
}
.content {
  // margin-left: 24vw;
  // padding-top: 14px;
  .title {
    font-size: 14px;
    color: #333;
    width: 100%;
    padding-top: 2.4vw;
    font-weight: 500;
  }
  .seriesImg {
    width: 10.4vw;
  }
  .main-list {
    flex-wrap: wrap;
    margin: 4vw 1vw 0;
    position: relative;
    .list-item {
      width: 33%;
      height: 17.3333vw;
      margin-bottom: 1vw;
      justify-content: flex-start;
      float: left;
      img {
        width: 18.6667vw;
        // height: 10.1333vw;
      }
      span {
        font-size: 11px;
        padding-top: 0.8vw;
        display: inline-block;
        width: 90%;
        text-align: center;
      }
      .category-img {
        width: 14px;
        height: 14px;
        margin-top: 2px;
        visibility: hidden;
      }
    }
    .child-item {
      // width: 70.4vw;
      // height: 21.3333vw;
      background-color: rgb(247, 247, 247);
      position: absolute;
      left: 0;
      padding: 2.6667vw 0 0;
      .category-child-item {
        height: 17.3333vw;
        margin-bottom: 0;
        width: 33%;
      }
      .lookmore {
        line-height: 17.3333vw;
        text-align: center;
        span {
          font-size: 16px;
        }
      }
    }
    .category-item {
      height: 21.3333vw;
      .hide-child {
        // visibility: hidden;
        visibility: visible;
      }
    }
  }
}
.synthesize.content .main-list .list-item {
  width: 100%;
  margin-bottom: 30px;
}
.synthesize.content .main-list .list-item img {
  width: 100%;
}
.category-swiper {
  padding: 20px 20px 0;
}
.series-child {
  flex-wrap: wrap;
  margin: 0 2.6667vw;
  background: rgb(247, 247, 247);
}
.hide-div {
  display: none;
}
</style>

