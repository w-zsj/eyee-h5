<template>
  <div v-if="hasdata==0"> </div>
  <div v-else-if="hasdata==1" :class='{insq:insq}'>
    <v-header>
      <div class="nav-tab2">
        <h3>我的收藏</h3>
      </div>
    </v-header>
    <div class="coll_head">
      <p class="seled-def" :class="{seled:seledType==0}" @click="changType(0)">商品</p>
      <p class="seled-def" v-if="!insq" :class="{seled:seledType==1}" @click="changType(1)">潮店</p>
      <!-- <p class="seled-def" :class="{seled:seledType==2}" @click="changType(2)">资讯</p> -->
    </div>
    <div class="shop_prodlist">
      <v-list class="prodlist" v-if="seledType==0&&prodlists.length>0" :load-handle='reload' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
        <div class="list-item" v-for="(item,index) in prodlists" :key="index"  data-type="0" :data-index="index">
          <div class="proditem list-box" @touchstart.capture="touchStart" @touchend.capture="touchEnd" :data-index="index"  @click="skip">
            <div class="proditem-img"><img :src="item.mainpic"></div>
            <div class="proditem-font" v-if="item.isdel == 1"><span>已下架</span></div>
            <div class="proditem-font" v-if="item.soldout == true && item.isc2c == 0"><span>已售罄</span></div>
            <div class="proditem-right">
              <p class="proditem-name">{{item.name}}</p>
              <div class="proditem-bottom">
                <p class="bottom-price" v-if="item.saleprice == 0">￥<img src="../../../static/img/trend_flat.png" alt=""></p>
                <p class="bottom-price" v-else>￥{{parseFloat(item.saleprice).toFixed(2)}}</p>
                <p class="change-pricedown" v-if="item.upordown==1"><img src="../../../static/img/collect_down.png">&nbsp;￥{{parseFloat(item.pricechange).toFixed(2)}}</p>
                <p class="change-priceup" v-else-if="item.upordown==2"><img src="../../../static/img/collect_up.png">&nbsp;￥{{parseFloat(item.pricechange).toFixed(2)}}</p>
                <p v-if="item.size" class="bottom-size">
                  {{item.producttype==22?item.color+';'+item.size :item.size+'码'}}
                </p>
              </div>
            </div>
          </div>
          <div class="delete" @click="deleteItem" :data-index="index">删除</div>
        </div>
      </v-list>
      <v-list v-if="seledType==1&&shopList.length>0" :load-handle='reload' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
        <template v-for="item in shopList">
          <div class="shop_lis" :key="item.id">
            <ShopUnit :shopInfo="item" :showType='1' class="shop_box"></ShopUnit>
            <section class="six_prods clearfix">
              <ProductUnit v-for="prodShop in item.products" :key='prodShop.id' :productItem='prodShop' class="shopRecoLists" :productType="3"></ProductUnit>
            </section>
          </div>
        </template>
      </v-list>
      <v-list v-if="seledType==2&&articleList.length>0" :load-handle='reload' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
        <template v-for="item in articleList">
          <ArticleUnit :key="item.id" :unit="item" class="gaps"></ArticleUnit>
        </template>
      </v-list>
    </div>
    <div v-if="(seledType==0&&prodlists.length<1)||(seledType==1&&shopList.length<1)||(seledType==2&&articleList.length<1)">
      <Empty :showType='realType' v-if="!isLoading"></Empty>
    </div>
  </div>
  <v-error v-else></v-error>
</template>
<script>
import { mapGetters } from 'vuex'
import { FavProductPage, FavBusinessPage, FavArticlePage, B2CCancelFavor, C2CCancelFavor } from '../../common/api/userFavor'
import ProductUnit from '../templates/ProductUnit'
import ShopUnit from '../templates/shopUnit'
import ArticleUnit from '../templates/ArticleUnit'
import Empty from '../templates/cart/Empty'

const navBars = ['商品', '潮店', '资讯']

export default {
  data() {
    return {
      isLoading: false,
      isEnd: false,
      prodlists: [],
      seledType: 0,
      shopList: [],
      articleList: [],
      pagedata: { sumcount: 0, pagesize: 0, pageindex: 1 },
      hasdata: 0,
      startX : 0 ,
      endX : 0 
    }
  },
  computed: {
    ...mapGetters({ insq: 'insq', userInfo: 'userInfo' }),
    realType() {
      if (this.seledType == 0) {
        return 1
      } else if (this.seledType == 1) {
        return 2
      } else {
        return 5
      }
    }
  },
  components: {
    ProductUnit,
    ShopUnit,
    Empty,
    ArticleUnit
  },
  mounted() {
    this.FavProductPage()
    // this.FavBusinessPage(option)

  },
  methods: {
    FavProductPage() {
      this.isLoading = true
      let page = this.pagedata
      let type = 0
      var pa = {
        type: type,
        pageindex: page.pageindex,
      }
      console.log('canshu',pa)
      FavProductPage(pa)
        .then(res => {
          console.log('产品列表', res)
          this.hasdata = 1
          if (res && res.list) {
            if (res.pageindex == 1) this.prodlists = res.list
            else this.prodlists.push(...res.list)
            if (res.pageindex > 0) page.pageindex = res.pageindex
            if (res.sumcount > -1) page.sumcount = res.sumcount
            if (res.pagesize > -1) page.pagesize = res.pagesize
            if (page.pageindex * page.pagesize >= page.sumcount) {
              this.isEnd = true
            }
          }
          this.isLoading = false
          console.log(res)
        })
        .catch(e => {
           if (this.insq) this.hasdata = 1
           else this.hasdata = 2
             this.isLoading = false
           // this.toast(e && e.msg ? e.msg : ('error:' + e));
          console.error(e)
        })
      // 收藏商品列表
    },
    FavBusinessPage() {
      this.isLoading = true
      let page = this.pagedata
      var pa = {
        pageindex: page.pageindex,
        token: this.userInfo.token
      }
      // 收藏店铺列表
      FavBusinessPage(pa)
        .then(res => {
          console.log('店铺列表', res)
          if (res && res.list) {
            if (res.pageindex == 1) this.shopList = res.list
            else this.shopList.push(...res.list)
            if (res.pageindex > 0) page.pageindex = res.pageindex
            if (res.sumcount > -1) page.sumcount = res.sumcount
            if (res.pagesize > -1) page.pagesize = res.pagesize
            if (page.pageindex * page.pagesize >= page.sumcount) {
              this.isEnd = true
            }
          }
          this.isLoading = false
        })
        .catch(e => {
          if (this.insq) this.hasdata = 1
          else this.hasdata = 2
          this.isLoading = false
          console.log(e)
        })
    },
    FavArticlePage() {
      this.isLoading = true
      let page = this.pagedata
      var pa = {
        pageindex: page.pageindex,
        token: this.userInfo.token
      }
      // 收藏资讯列表
      FavArticlePage(pa)
        .then(res => {
          console.log('资讯列表', res)
          if (res && res.list) {
            if (res.pageindex == 1) this.articleList = res.list
            else this.articleList.push(...res.list)
            if (res.pageindex > 0) page.pageindex = res.pageindex
            if (res.sumcount > -1) page.sumcount = res.sumcount
            if (res.pagesize > -1) page.pagesize = res.pagesize
            if (page.pageindex * page.pagesize >= page.sumcount) {
              this.isEnd = true
            }
          }
          this.isLoading = false
        })
        .catch(e => {
          if (this.insq) this.hasdata = 1
          else this.hasdata = 2
          this.isLoading = false
          console.log(e)
        })
    },
    B2CCancelFavor(index) {
      var pa ={
          productid:this.prodlists[index].id
          }
      B2CCancelFavor(pa)
        .then(res => {
          console.log('b2c删除收藏成功')
        })
        .catch(e => {
          console.log("b2c删除收藏失败",e)
        })
    },
    C2CCancelFavor(index) {
      let productid = this.prodlists[index].id,size = this.prodlists[index].size,color=this.prodlists[index].color||''
      var pa = {
        productid:productid,
        size:size,
        color
      }
      console.log(pa)
      C2CCancelFavor(pa)
        .then(res => {
          console.log('c2c删除收藏成功')
        })
        .catch(e => {
          console.log("c2c删除收藏失败",e)
        })
    },
    reload() {
      this.pagedata.pageindex = 1
      if (this.seledType == 0) {
        this.FavProductPage()
      } else if (this.seledType == 1) {
        this.FavBusinessPage()
      } else if (this.seledType == 2) {
        this.FavArticlePage()
      }
    },
    loadmore($el) {
      if (this.isEnd === true) {
        this.toast('已无更多')
      } else {
        this.pagedata.pageindex += 1
        if (this.seledType == 0) {
          this.FavProductPage()
        } else if (this.seledType == 1) {
          this.FavBusinessPage()
        } else if (this.seledType == 2) {
          this.FavArticlePage()
        }
      }
    },
    changType(n) {

      this.seledType = n
      this.pagedata.pageindex = 1
      if (n == 0) {
        this.FavProductPage()
      } else if (n == 1) {
        this.FavBusinessPage()
      } else {
        this.FavArticlePage()
      }
    },
    //跳转
    skip(e){
      let index = e.currentTarget.dataset.index;
      if(this.prodlists[index].isdel == 0){
        if( this.checkSlide() ){
         this.restSlide();
         console.log("复位")
       }else{
         if(this.prodlists[index].isc2c == 1){
           this.$router.push('/sneaker/detail/' + this.prodlists[index].id)
         }else{
           this.$router.push('/productDetail/' + this.prodlists[index].id)
         }
       }
      }else{
        this.toast('商品已下架')
      }
      
    },
    //滑动开始
    touchStart(e){
      this.startX = e.touches[0].clientX;
    },
    //滑动结束
    touchEnd(e){
      let parentElement = e.currentTarget.parentElement;
      this.endX = e.changedTouches[0].clientX;
      // 左滑
      if( parentElement.dataset.type == 0 && this.startX - this.endX > 30 ){
        this.restSlide();
        parentElement.dataset.type = 1;
      }
      if(parentElement.dataset.type == 1 && this.startX - this.endX < 20){
        this.restSlide();
      }
    //  console.log('this.startX',this.startX,'this.endX',this.endX)
      this.startX = 0;
      this.endX = 0;
    },
    //判断当前是否有滑块处于滑动状态
    checkSlide(){
      let listItems = document.querySelectorAll('.list-item');
      for( let i = 0 ; i < listItems.length ; i++){
        if( listItems[i].dataset.type == 1 ) {
           return true;
        }
      }
      return false;
    },
    //复位滑动状态
    restSlide(){
      let listItems = document.querySelectorAll('.list-item');
      // 复位
      for( let i = 0 ; i < listItems.length ; i++){
        listItems[i].dataset.type = 0;
      }
    },
    //删除
    deleteItem(e){
      let index = e.currentTarget.dataset.index;
      this.restSlide();
      if(this.prodlists[index].isc2c == 1){
        this.C2CCancelFavor(index)
      }else{
        this.B2CCancelFavor(index)
      }
      this.prodlists.splice(index,1);
    }
  }
}
</script>
<style scoped>
.coll_head {
  display: flex;
  justify-content: space-around;
  position: fixed;
  top:45px;
  width: 100%;
  background: #F5F5F5;
  color:#666666;
  z-index: 100;
  text-align: center;
}
.insq .coll_head {
  top: 0;
}

.coll_head p.seled {
  background-color: #666666;
  color:#fff;
}
.seled-def{
  width: 50%;
  height: 35px;
  border-left: 1px solid #cccccc;
  padding: 5px 0;
}

.shop_prodlist {
  margin-top: 86px;
}
.insq .shop_prodlist {
  margin-top: 48px;
}

.shop_prodlist .productItem {
  display: inline-block;
  width: 50%;
  padding: 10px 5px;
}

.shop_box {
  margin: 10px 0;
}

.shop_box:nth-of-type(1) {
  margin: 0;
}
.shop_prodlist .productItem.shopRecoLists {
  float: left;
  width: 33.33%;
}
.shop_prodlist .productItem.shopRecoLists:nth-child(3n) {
  padding: 0 0 0 4px;
}
.shop_prodlist .productItem.shopRecoLists:nth-child(3n + 1) {
  padding: 0 4px 0 0;
}
.shop_prodlist .productItem.shopRecoLists:nth-child(3n + 2) {
  padding: 0 2px 0 2px;
}
.shop_lis {
  margin: 0 8px 14px;
  box-shadow: #f2f2f2 0px 4px 7px 0px;
  border-radius: 4px;
}
.six_prods {
  padding: 0 6px;
}
.prodlist{
    background-color: #F9F9F9;
}
.proditem{
  display: flex;
  width:100%;
  padding: 10px 5px 10px 0;
  margin: 5px 0 0 0;
  background-color: #FFF;
}
.proditem-img{
  width:21.6%;
}
.proditem-font{
  position: absolute;
  left:15px;
  bottom:20px;
  width:21.6%;
  background-color: rgba(0, 0, 0, 0.3);
  color:#fff;
  font-size:10px;
  padding:3px 0;
  text-align: center;
}
.proditem-right{
  width:70%;
  margin: 0px 0 20px 15px;
  font-size: 14px;
}
.proditem-name{
  margin-right: 15px;
  height: 40px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.proditem-bottom{
  position: relative;
  left:-22px;
  margin-top: 16px;
  font-size: 12px;
}
.proditem-bottom .bottom-price{
  position: absolute;
  left:6vw;
  font-size:14px;
  color:#333;
  font-weight: 700;
}
.proditem-bottom .change-pricedown{
  position: absolute;
  left:27vw;
  color:#07C302;
  font-weight: 900;
}
.proditem-bottom .change-priceup{
  position: absolute;
  left:27vw;
  color:#EB5B6C;
  font-weight: 900;
}
.proditem-bottom img{
  width:18px;
}
.bottom-size{
  position: absolute;
  right:0;
}

.list-item{
  position: relative;
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
}
.list-item[data-type="0"]{
  transform: translate3d(0,0,0);
}
.list-item[data-type="1"]{
  transform: translate3d(-4.4rem,0,0);
}
.list-item:after{
  content: " ";
  position: absolute;
  color: #ccc;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}
.list-box{
  display: flex;
  align-items: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  justify-content: flex-end;
}
.list-item .delete{
  width: 70px;
  height: 27.5vw;
  background: #EB5B6C;
  color: #fff;
  text-align: center;
  position: absolute;
  top:0;
  right: -4.4rem;
  padding: 11.5vw 0;
}
</style>
