<template>
    <div class="main newprod-list">
        <v-header v-if="!$root.ISAPP">
            <div class="nav-tab2">
                <h3>客制周边</h3>
            </div>
        </v-header>
        <div class="customization-list" v-show="list.length != 0">

          <div :class="$root.ISAPP?'app-type-list':'type-list'">
            <div class="type-item" v-for="(item,index) in typeList" :key="index" :class="{'active-type':index===typeItem}" @click="switchType(index)">
              <p>{{item}}</p>
            </div>
          </div>

          <v-list :load-handle='getCustListDataLoad' :more-handle='loadmore' :more-handling='css.isLoading' :isend='css.isEnd'>
            <div class="commodit flex">
                <div class="commodit-item flex-center flex-col" v-for="(item,index) in list" :key='index' @click="goDetail(item.productid)">
                    <img :src="item.imgurl" alt="">
                    <span class="commodit-item-name font-price ellipsis ">{{item.name}}</span>
                    <span class="commodit-item-price font-price">{{item.color}}</span>
                    <span class="commodit-item-price font-price">¥{{item.price}}</span>
                </div>
            </div>
          </v-list>

          <!-- <v-list :load-handle='getCustListDataLoad' :more-handle='loadmore' :more-handling='css.isLoading' :isend='css.isEnd'>
              <div class="commodit customization-list font-price">
                  <div class="commodit-item flex-center" v-for="(item,index) in list" :key='index' @click="goDetail(item.productid)">
                      <div class="item-info item-img"><img :src="item.imgurl" alt=""></div>
                      <div class="item-brand">
                          <div class="shoseName ellipsis"><span>{{item.name}}</span></div>
                          <div class="shoseColor"><span>{{item.color}}</span></div>
                      </div>
                      <div class="item-price">
                          <span class="font-price">¥{{item.price}}</span>
                      </div>
                  </div>
              </div>
          </v-list> -->
        </div>
    </div>
</template>


<script>
import { Customization } from "../../common/api/sneaker";
import { GetGroupProductList } from "../../common/api/group";
export default {
 
data() {
    return {
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
        pagetype: "ALL",
        hasLoad: true
      },
      typeList: ["全部", "球鞋定制", "洗护", "潮玩"],
      typeItem: 0,
      isEnd: false,
      isLoading: false,
      sortIndex: 0,
      sortType: 0,
      orderIndex: 0,
      list: [],
      appShare: {},
    };
  },

  mounted() {
    this.getCustListData(this.sortIndex, this.orderIndex)
    // this.initShare({ type: 2 })
  },

  methods: {
    getCustListDataLoad() {
      this.pagination.pageindex = 1;
      this.pagination.pagesize = 20;
      this.list = [];
      this.getCustListData();
    },
    loadmore() {
      if (this.css.isEnd === true) {
        this.toast("已无更多");
      } else {
        this.pagination.pageindex += 1;
        
        // if (this.pagination.pageindex > 1) {
        //   this.pagination.hasLoad = false;
        // }
        this.getCustListData();
      }
    },
    getCustListData() {
      if (this.css.isLoading) return;
      this.css.isLoading = true;
      // this.isEnd = true;
      let postParams = {
        page: this.pagination.pageindex,
        size: this.pagination.pagesize,
        type: this.pagination.pagetype
      };
      if (postParams.page === 1) {
        this.css.isEnd = false;

        window.scrollTo(0, 0);
      }
      Customization(postParams)
        .then(res => {
          if (res && res.total && res.list.length > 0) {
            this.list.push(...res.list);
            
            this.css.hasData = true;

            if (res.page * res.size >= res.total&&this.list.length!=1) this.css.isEnd = true;
          } else {
            this.css.isEnd = true;
            if (this.list.length == 0) {
              this.css.hasData = false;
            }
            //
          }
          this.css.isLoading = false;
          // app 分享信息
          this.appShare.sharecontent = res.share.content;
          this.appShare.sharetitle = res.share.title;
          this.appShare.sharepicurl = res.share.icon;
          this.appShare.shareurl = res.share.url;
          this.appShare.xcxurl = res.share.xcxurl || "";
          this.appShare.callbackname = "";

          this.initShare({ type: 2, info: {
            title: res.share.title,
            desc: res.share.content,
            img: res.share.icon,
            url: res.share.url
          }})
          if (this.$root.ISAPP) {
            this.javascriptBridge({
              name: "getAppActivityShareContent",
              params: this.appShare
            });
          }
        })
        .catch(e => {
          console.error(e);

          this.css.isLoading = false;
          this.css.hasData = false;
          // this.toast(e && e.msg ? e.msg : ('error:' + e))
        });
    },
    switchSort(index) {
      this.sortIndex = index;
    },

    goDetail(id) {
      if (this.$root.ISAPP) {
        let opt = {
          name: 'gotoAppProductDetailPage',
          params: {
            productid: id
          }
        }
        this.javascriptBridge(opt)
      }else{
        this.$router.push('/productDetail/' + id)
      }
    },

    // goCustomization() {
    //   let postParams = {
    //     page: this.pagination.pageindex,
    //     size: this.pagination.pagesize,
    //     type: this.pagination.pagetype
    //   };
    //   Customization(postParams).then(res => {
    //     this.list = res.list
    //     this.initShare({ type: 2, info: {
    //       title: res.share.title,
    //       desc: res.share.content,
    //       img: res.share.icon,
    //       url: res.share.url
    //     }})
    //   }).catch(err => {
    //     this.toast("加载失败")
    //   })
    // },
    init() {
      this.css = {
        isLoading: false,
        isEnd: false,
        hasData: true
      };
      this.pagination.pageindex = 1;
      this.list = [];
      window.scrollTo(0, 0);
    },
    switchType(index) {
      if (index === this.typeItem) return;
      this.init();
      this.typeItem = index;
      switch(index)
      {
        case 0:
          this.pagination.pagetype = "ALL";
          break;
        case 1:
          this.pagination.pagetype = "SHOW_MADE";
          break;
        case 2:
          this.pagination.pagetype = "WASH";
          break;
        case 3:
          this.pagination.pagetype = "TIDE_PLAY";
          break;
        default:
          this.console("notype");
      }
      this.getCustListData();
    }
  }
};
</script> 

<style lang="scss" scoped>
.nav-top{
    border-bottom: 1px solid #f5f5f5;
  }
.type-list {
  z-index: 20;
  position: fixed;
  top: 48px;
  left: 0;
  width: 100%;
  // height: 11.6667vw;
  // padding: 0 4vw;
  background: rgba(245,245,245,1);
}
.app-type-list {
  z-index: 20;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  // height: 11.6667vw;
  // padding: 0 4vw;
  background: rgba(245,245,245,1);
}
.type-item {
  float: left;
  text-align: center;
  // background: rgba(245,245,245,1);
  // border-radius: 4px;
  // height: 24px;
  // margin:  3.2vw;
  // padding: 3px 12px;
  // p {
  //   color: #282828;
  //   font-size: 13px;
  // }
  width:25%;
  padding: 8px 12px;
  border-right: 1px #CCCCCC solid;
  color:#666666;
  font-size: 14px;
  line-height: 20px;
}
.active-type {
  // float: left;
  // background: #666666;
  // // border-radius: 4px;
  // // height: 24px;
  // margin:  3.2vw;
  // padding: 3px 12px;
  // p {
  //   color: #ffffff;
  //   font-size: 13px;
  // }
  float: left;
  background: #666666;
  padding: 8px 12px;
  p {
    color: #ffffff;
    font-size: 14px;
    line-height: 20px;
  }
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
      font-size: 14px;
      font-family: BASE_PRICE;
      font-weight: 800;
      width: 38.1333vw;
      text-align: center;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // display: -webkit-box;
      // -webkit-line-clamp: 2;
      // -webkit-box-orient: vertical;
    }
    .commodit-item-price {
      font-size: 14px;
      color: #999;
      margin-top: 2.1333vw;
    }
  }
}
.customization-list {
  width: 100%;
  padding: 0;
}
// .commodit-item {
//   width: 100%;
//   height: 26.6667vw;
//   position: relative;
//   overflow: hidden;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 0 4vw;
//   margin-top: 1.3333vw;
//   border-bottom: 2px solid #F5F5F5;
// }

// .item-img img {
//   width: 26.6667vw;
// }
// .shoseName span{
//   font-size: 14px;
//   color: #333333;
// }
// .shoseColor{
//   margin-top: 2.6667vw;
//   font-size: 14px;
//   color: #999999;
// }
// .item-price span{
//   font-size: 16px;
//   color: #333333;
// }

// .item-brand{
//   width: 50%;
// }
    
</style>
