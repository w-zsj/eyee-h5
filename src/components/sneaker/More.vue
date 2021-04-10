<template>
    <div class="main">
        <v-header v-if="!$root.ISAPP">
            <div class="nav-tab2">
                <h3>相关商品</h3>
            </div>
        </v-header>

        <v-list :load-handle='getLookMoreListDataLoad' :more-handle='loadmore' :more-handling='css.isLoading' :isend='css.isEnd'>
            <div class="commodit flex">
                <div class="commodit-item flex-center flex-col" v-for="(item,index) in lookMoreList" :key='index' @click="goDetail(item.productid)">
                    <img :src="item.productimgurl" alt="">
                    <span class="commodit-item-name font-price">{{item.productname}}</span>
                    <span class="commodit-item-price font-price">{{item.productprice&&item.productprice.toFixed(2)||'¥ — —'}}</span>
                </div>
            </div>
        </v-list>
    </div>
</template>

<script>
import { LookMore } from "../../common/api/sneaker";
import { GetGroupProductList } from "../../common/api/group";
export default {
  components: {
  },

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
        pagesize: 10,
        pageindex: 1,
        hasLoad: true
      },
      isEnd: false,
      isLoading: false,
      sortIndex: 0,
      sortType: 0,
      orderIndex: 0,
      lookMoreList: [],
      id:'',
    };
  },

  mounted() {
    this.id = this.$route.params.id
    this.goLookMore(this.sortIndex, this.orderIndex)
  },

  methods: {
    getLookMoreListDataLoad() {
      this.pagination.pageindex = 1;
      this.pagination.pagesize = 10;
      this.LookMoreList = [];
      this.getLookMoreListData();
    },
    loadmore() {
      if (this.css.isEnd === true) {
        this.toast("已无更多");
      } else {
        this.pagination.pageindex += 1;
        
        // if (this.pagination.pageindex > 1) {
        //   this.pagination.hasLoad = false;
        // }
        this.getLookMoreListData();
      }
    },
    getLookMoreListData() {
      if (this.css.isLoading) return;
      this.css.isLoading = true;
      // this.isEnd = true;
      let postParams = {
        page: this.pagination.pageindex,
        size: this.pagination.pagesize,
        productid: this.id
      };
      if (postParams.page === 1) {
        this.css.isEnd = false;

        window.scrollTo(0, 0);
      }
      LookMore(postParams)
        .then(res => {
          if (res && res.total && res.list.length > 0) {
            this.LookMoreList.push(...res.list);
            
            this.css.hasData = true;

            if (res.page * res.size >= res.total&&this.LookMoreList.length!=1) this.css.isEnd = true;
          } else {
            this.css.isEnd = true;
            if (this.LookMoreList.length == 0) {
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
    switchSort(index) {
      this.sortIndex = index;
    },

    goDetail(id){
      this.$router.push(`/sneaker/detail/${id}`)
    },

    goLookMore(){
      LookMore({
        productid: this.id,
        page: this.pagination.pageindex,
        size: this.pagination.pagesize,
      }).then(res => {  
        this.lookMoreList = res.list
      }).catch(err =>{
        this.toast("加载失败")
      })
    }
  }
};
</script> 

<style lang="scss" scoped>
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
    width: 25%;
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
}
.commodit {
  flex-wrap: wrap;
  padding: 2.6667vw 2.6667vw;
  justify-content: space-between;
  .commodit-item {
    width: 47.2vw;
    position: relative;
    color: #333;
    img {
      height: 24.2667vw;
    }
    .commodit-item-name {
      margin-top: 1.8667vw;
      font-size: 13px;
      font-family: BASE_PRICE;
      font-weight: 800;
      width: 38.1333vw;
      height: 8.5333vw;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .commodit-item-price {
      color: #999;
      margin-top: 2.1333vw;
    }
    .sub{
        width: 20px;
        height: 26px;
        background-size: 100% 100%;
        position: absolute;
        top: 1.3333vw;
        left: 1.3333vw;
        span{
            position: relative;
            top: 5px;
            font-size: 14px;
        }
    }
    .sub-y{
        background-image: url('/static/img/sneaker/hot_brand.png');
    }
    .sub-g{
        background-image: url('/static/img/sneaker/hot_brand_three.png');
        color: #fff;
    }
  }
}
</style>


