<template>
  <div :class="{hasPadding:fixBar}">
    <div :class='{fixBar:fixBar}'>
      <div class="FilterBar" :class="{sneakerHide:moodsIsShow,insq:insq}">
        <!-- <p :class="{isSelected:type==0}" @click='changSelected(0)'>
          <span>资讯</span>
        </p> -->
        <p :class="{isSelected:type==1}" @click='changSelected(1)'>
          <span>商品</span>
          <i></i>
        </p>
        <p :class="{isSelected:type==3}" @click='changSelected(3)' v-if="!moodsIsShow&&!insq">
          <span>潮店</span>
          <i></i>
        </p>
        <!-- <p :class="{isSelected:type==2}" @click='changSelected(2)' v-if="!moodsIsShow">
          <span>SNEAKER</span>
        </p> -->
        <span class="cleaBoth"></span>
      </div>
    </div>
    <div class="searchContent">
      <div v-if='list.length==0&&isLoading==false&&type==0||productList.length==0&&isLoading==false&&type==1&&moodsIsShow||sneakerList.length==0&&isLoading==false&&type==2||shopList.length==0&&isLoading==false&&type==3'
        class="noNews">
        <img :src="noNews" alt="">
        <p>没有找到相关的<span>{{typeNew}}</span></p>
      </div>
      <template v-else>
        <v-list v-if='type==0' :load-handle='loadNews' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
          <div class="baidu_con" v-if="baiduInfo && baiduInfo.baidupic">
            <div class="baidu_theme">
              <p class="bg_baidu blur" :style="{backgroundImage: 'url('+https( baiduInfo.icon) +')'}"></p>
              <div class="con_baidu flex-aic">
                <p class="img_box">
                  <img v-lazy="https(baiduInfo.icon)" alt="">
                </p>
                <p class="word_box">
                  #{{baiduInfo.name}}#专题<br>为你推荐更多与{{baiduInfo.name}}有关的资讯
                </p>
              </div>
            </div>
            <div class="baidu_baike">
              <p class="title_baike"><span>{{baiduInfo.name}}</span>_百科</p>
              <div class="con_baike flex-aic">
                <p class="words_baike">
                  {{baiduInfo.baiduabstract}}
                </p>
                <p class="img_baike">
                  <img :src="baiduInfo.baidupic|https" alt="">
                </p>
              </div>
            </div>
          </div>
          <ArticleUnit v-for="item in list" :key="item.id" :unit="item" class="gaps"></ArticleUnit>
        </v-list>
        <ProductSearchList v-if='type==1&&newHasproduct&&!moodsIsShow' :keywordP='keyword'> </ProductSearchList>
        <v-list v-if='type==1&&newHasproduct&&moodsIsShow' :load-handle='loadNews' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
          <div v-for="item in productList" :key='item.id'>
            <ProductUnit   v-if="!item.isc2c"  :productItem='item' class="ul_artilces productList" ></ProductUnit>
            <SneakerUnit v-else  :sneakItem='item' :SneakType='1' class="ul_artilces sneakerList"></SneakerUnit>
          </div>
        </v-list>
        <v-list v-if='type==2&&newHassneaker' :load-handle='loadNews' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
          <div class="flex" style="flex-wrap: wrap;">
            <ShoeUnit v-for="item in sneakerList" :key='item.id' :sneakItem='item' :SneakType='1' class="ul_artilces sneakerList"></ShoeUnit>
          </div>
        </v-list>
        <v-list v-if='type==3' :load-handle='loadNews' :more-handle='loadmore' :more-handling='isLoading' :isend='isEnd'>
          <ShopUnit v-for="item in shopList" :key='item.id' :shopInfo="item" :showType = '3' class="shop_box"></ShopUnit>
        </v-list>
      </template>
    </div>
  </div>
</template>
<script>
  import * as api from '../../common/api/article'
import { ProdSearch } from '../../common/api/product'
import { ShoeSearch } from '../../common/api/sneaker'
import { SearchShop } from '../../common/api/base'
import ArticleUnit from '../templates/ArticleUnit'
import ProductUnit from '../templates/ProductUnit'
import SneakerUnit from '../templates/SneakerUnit'
import ShoeUnit from '../templates/ShoeUnit'
import ShopUnit from '../templates/shopUnit'
// import { endWithGif } from '../../common/util'
import { mapGetters } from 'vuex'
  import ProductSearchList from '../templates/ProductSearchList'
export default {
    props: {
      keyword: String,
      brandId: [String, Number],
      fixBar: Boolean,
      isShow: { type: Number }
    },
    data() {
      return {
        selected: true,
        isEnd: false,
        isLoading: false,
        list: [],
        childCate: [],
        articleCate: [],
        pagedata: { sumcount: 0, pagesize: 0, pageindex: 1 },
        type: 0,
        productList: [],
        sneakerList: [],
        shopList: [],
        hasproduct: false,
        hasSneaker: false,
        typeNew: '资讯',
        noNews: '//files.eyee.com/mcdn/static/img/no_news.png', // require('../../assets/img/no_news.png'),
        baiduInfo: {}
      }
    },
    components: { ArticleUnit, ProductUnit, SneakerUnit,ShoeUnit, ProductSearchList, ShopUnit },
    mounted() {
      // this.loadSneaker();
      this.pagedata.pageindex = 1
      if (this.newsSearchSneaker == 3) {
        this.type = this.newsSearchSneaker - 1
        this.loadSneaker()
      } else if (this.newsSearchSneaker == 0) {
        this.req(this.keyword, this.brandId)
      } else {
        this.type = this.newsSearchSneaker - 1
        console.log('prodod')
        this.loadGood()
        // this.req(this.keyword, this.brandId);
      }
      // console.log(this.type,'this.type---------------------------------------')
      // console.log(this.type,'this.type')
      this.screen
      this.judgeType()
  },
    methods: {
      judgeType() {
        if (this.type == 0) {
          this.typeNew = '资讯'
        } else if (this.type == 1) {
          this.typeNew = '商品'
        } else if (this.type == 2) {
          this.typeNew = 'SNEAKER'
        } else if (this.type == 3) {
          this.typeNew = '潮店'
        }
      },
      req(keyword, id) {
        this.isLoading = true
        let page = this.pagedata
        api.ArticleSearch({ keyword: keyword, pageindex: page.pageindex }).then(res => {
          console.log('brand article search', res)
          // 百度百科 专题
          if (res.label) {
            this.baiduInfo = res.label
          }
          if (res.article) {
            if (res.article.pageindex == 1) {
              this.list = res.article.list
            } else {
              this.list.push(...res.article.list)
            }

            this.hasdata = 1
            page.pageindex = res.article.pageindex
            page.sumcount = res.article.sumcount
            page.pagesize = res.article.pagesize
            if (page.pageindex * page.pagesize >= page.sumcount) this.isEnd = true
          }

          this.isLoading = false
        }).catch(e => {
          this.hasdata = 2
          this.isLoading = false
          this.toast(e && e.msg ? e.msg : ('error:' + e))
        })
      },
      loadmore($el) {
        if (this.isEnd === true) {
        } else {
          this.pagedata.pageindex += 1
          if (this.type == 0) {
            this.req(this.keyword, this.brandId)
          } else if (this.type == 1) {
            this.loadGood()
          } else if (this.type == 2) {
            this.loadSneaker()
          } else if (this.type == 3) {
            this.loadShops()
          }
        }
      },
      loadNews() {
        this.pagedata.pageindex = 1
        this.hasdata = 2
        this.isEnd = false
        if (this.type == 0) {
          this.list = []
          this.req(this.keyword, this.brandId)
        } else if (this.type == 1) {
          this.productList = []
          this.loadGood()
        } else if (this.type == 2) {
          this.sneakerList = []
          this.loadSneaker()
        } else if (this.type == 3) {
          this.shopList = []
          this.loadShops()
        }
      },
      loadGood() {
        console.log('加载一次')
        if (this.type == 1 && this.newHasproduct && this.moodsIsShow) {
          this.isLoading = true
          let page = this.pagedata
          var pa = {
            issearchall: 0,
            keyword: this.keyword,
            pageindex: page.pageindex,
            brandid: this.brandId,
            // categoryid:this.brandId,
            // beginprice:0,
            // endprice:0,
            sorttype: 0,
            ordertype: 0
          }
          var that = this
          console.log(pa, 'pa')
          ProdSearch(pa).then((res) => {
            if (res && res.list) {
              console.log('rr-------', res)
              if (res.pageindex == 1) that.productList = res.list
              else that.productList.push(...res.list)
            } else {
              // this.toast('没有找到相关的商品');
              // this.isEnd = true
              that.productList = []
            }
            page.pageindex = res.pageindex
            page.sumcount = res.sumcount
            page.pagesize = res.pagesize
            if (page.pageindex * page.pagesize >= page.sumcount) { this.isEnd = true }
            this.isLoading = false
          }).catch(e => {
            this.hasdata = 2
            this.isLoading = false
            this.toast(e && e.msg ? e.msg : ('error:' + e))
          })
        }
      },
      loadShops() {
        this.isLoading = true
        let page = this.pagedata
        var papram = {
          keyword: this.$route.params.key,
          pageindex: page.pageindex
        }
        var that = this
        console.log(papram, '潮店参数222')
        SearchShop(papram).then((res) => {
          if (res) {
            if (res.list) {
              console.log(res)
              if (res.pageindex == 1) that.shopList = res.list
              else that.shopList.push(...res.list)
            }// else {
            //   this.toast('加载完成')
            // }
            page.pageindex = res.pageindex
            page.sumcount = res.sumcount
            page.pagesize = res.pagesize
            if (page.pageindex * page.pagesize >= page.sumcount) { this.isEnd = true }
          }
          this.isLoading = false
        }).catch(e => {
          this.hasdata = 2
          this.isLoading = false
          this.toast(e && e.msg ? e.msg : ('error:' + e))
        })
      },
      loadSneaker() {
        this.isLoading = true
        let page = this.pagedata
        var papra = {
          keyword: this.$route.params.key,
          // page: page.pageindex,
          pageindex: page.pageindex,
          sorttype: 0,
          size: 10,
          ordertype: 1,
        }
        var that = this
        ShoeSearch(papra).then((res) => {
          if (res && res.list) {
            // console.log(res,'ShoeSearch-----------------------------------')
            if (res.pageindex == 1) that.sneakerList = res.list
            else that.sneakerList.push(...res.list)
          }// else {
          //   this.toast('加载完成')
          // }
          page.pageindex = res.pageindex
          page.sumcount = res.sumcount
          page.pagesize = res.pagesize
          if (page.pageindex * page.pagesize >= page.sumcount) { this.isEnd = true }
          this.isLoading = false
        }).catch(e => {
          this.hasdata = 2
          this.isLoading = false
          this.toast(e && e.msg ? e.msg : ('error:' + e))
        })
      },
      changSelected(n) {
        if (n === this.type) return
        window.scrollTo(0, 0)
        // console.log('changSelected n', n, this.type)// isSelected:type
        this.pagedata.pageindex = 1
        this.productList = []
        this.list = []
        this.sneakerList = []
        this.shopList = []
        this.isEnd = false
        var n = parseInt(n)
        if (n == 0) {
          this.type = 0
          this.typeNew = '资讯'
          this.req(this.$route.params.key, this.brandId)
        } else if (n == 1) {
          // console.log(this.newHasproduct, 'newHasproduct')
          this.type = 1
          this.typeNew = '商品'
          this.loadGood()
          // console.log(this.productList, 'this.productList')
        } else if (n == 2) {
          this.type = 2
          this.typeNew = 'SNEAKER'
          this.loadSneaker()
        } else if (n == 3) {
          this.type = 3
          this.typeNew = '潮店'
          this.loadShops()
        }
        // console.log(this.type,'this.type')
      }
    },
    computed: {
      ...mapGetters(['insq', 'newsSearchSneaker']),
      newHasproduct: function () {
        if (this.productList) {
          this.hasproduct = true
        } else {
          this.hasproduct = false
        }
        return this.hasproduct
      },
      newHassneaker: function () {
        if (this.sneakerList && this.sneakerList.length > 0) {
          this.hasSneaker = true
        } else {
          this.hasSneaker = false
        }
        return this.hasSneaker
      },
      searchOption: {
        get: function () {
          return this.$store.state.product.searchOption
        },
        set: function () {
          return this.$store.state.product.searchOption
        }

      },
      // searchOption() {
      //   return this.$store.state.product.searchOption
      // },
      moodsIsShow() {
        if (this.isShow == 1) return true
        else return false
      },
      screen() {
        if (sessionStorage.getItem('screen')) {
          this.type = 1
          sessionStorage.removeItem('screen')
        }
      }
    },
    watch: {
      searchOption: function (newO, oldv) {
        // console.log('searrrrrrrrrrrr', newO)
        this.searchOption = newO
        // this.initKey()
      }
    }
  }

</script>
<style scoped>
  .FilterBar {
    box-sizing: border-box;
    margin-bottom: 2px;
  }

  .FilterBar p {
    width: 50%;
    float: left;
    box-sizing: border-box;
    text-align: center;
    padding: 8px 5px;
    position: relative;
  }
  .FilterBar.insq p {
    width: 33.33%;
  }
 .sneakerHide p{
    width: 50%;
 }
  .FilterBar p span {
    font-size: 0.93rem;
    padding: 8px 0px;
  }

  .FilterBar p.isSelected i {
    position: absolute;
    width: 20px;
    height: 4px;
    background: #707AFC;
    border-radius: 2px;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    /* border-bottom: 2px solid #707AFC; */
  }

  .FilterBar .cleaBoth:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .fixBar {
    position: fixed;
    top: 48px;
    z-index: 200;
    width: 100%;
    background-color: #fff;
  }

  .hasPadding {
    margin-top: 86px;
  }

  .noNews {
    width: 50%;
    font-size: 0.75rem;
    text-align: center;
    padding: 20% 0;
    margin: 0 auto;
  }

  .noNews img {
    width: 35%;
    margin: 0 auto;
    margin-bottom: 5%;
  }

  .productList {
    width: 47%;
    box-sizing: border-box;
    display: inline-block;
    margin: 2%;
    text-align: center;
  }

  .productList:nth-of-type(2n+1) {
    margin-left: 0;
  }
  .baidu_con .baidu_theme{
    position: relative;
    overflow: hidden;
  }
  .baidu_con .baidu_theme .bg_baidu{
    width: 100%;
    height: 100%;
    position: absolute;
    background-position: center;
    background-size: cover;
  }
  .baidu_con .baidu_theme .con_baidu{
    padding: 10px;
    color: #fff;
  }
  .baidu_con .baidu_theme .con_baidu .img_box{
    position: relative;
    overflow: hidden;
    z-index: 1;
    margin-right: 10px;
  }
  .baidu_con .baidu_theme .con_baidu .img_box>img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .baidu_con .baidu_theme .con_baidu .word_box{
    z-index: 1;
  }
  .baidu_con .baidu_baike .title_baike{
    color: #666;
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f2f2f2;
  }
  .baidu_con .baidu_baike .title_baike>span{
    color: #ffc700;
  }
  .baidu_con .baidu_baike .con_baike {
    padding: 10px;
  }
  .baidu_con .baidu_baike .con_baike .words_baike{
    width: 70%;
    font-size: 14px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
  }
</style>
