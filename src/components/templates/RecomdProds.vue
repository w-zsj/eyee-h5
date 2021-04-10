<template>
    <div class="recomd_prods" v-if="prodsList.length>0">
        <p class="title_recomdProd" v-show="!isHideTitle">推荐商品</p>
        <swiper :options="swiperProds" class="swiper-container swiperProds">
            <swiper-slide v-for="(item,index) in prodsList" :key='index'>
                <ProductUnit :productItem='item' :productType="item.prodTp" :upStyle="upStyle"></ProductUnit>
            </swiper-slide>
        </swiper>
    </div>
</template>
<script>
    import { RecommendInArticle } from '../../common/api/product'
import ProductUnit from '../templates/ProductUnit'
export default {
      name: 'RecomdProds',
      data() {
        return {
          prodsList: [],
          swiperProds: {
            slidesPerView: this.showNum,
            freeMode: true,
            // slideToClickedSlide: true,
            lazyLoading: true,
            spaceBetween: 10
          },
          prodtype: { type: Number, default: 3 }
        }
      },
      props: {
        recomdId: { },
        isHideTitle: { type: Boolean, default: true },
        recodsList: {},
        upStyle:{type:Boolean,default:false},
        showNum: { type: Number, default: 2.5 }
      },
      components: {
        ProductUnit
      },
      mounted() {
        let _this = this
        let param = this.$route.params
        let isIDs
        if ((this.$route.name == 'article-detail') || (this.$route.name == 'newsPicsPage')) {
          isIDs = true
        } else {
          isIDs = false
        }
        // console.log(isIDs)
        if (param.id && isIDs) {
          RecommendInArticle({ ArticleId: param.id }).then(function (res) {
            if (res) {
              console.log('推荐商品', res)
              for (var i = 0; i < res.length; i++) {
                res[i].coverimg = res[i].mainpic.split('|')[0]
              }
              _this.prodsList = res
            } else {
              console.log('Internet busy')
            }
          }).catch(function (err) {
            console.log('Internet busy')
          })
        } else {
          // console.log(_this.$route.path)
          for (var i = 0; i < _this.recodsList.length; i++) {
            if (_this.$route.path.indexOf('shop/shopdetail/') >= 0) {
              _this.recodsList[i].prodTp = 3
              if (_this.recodsList[i].producttype == 7) {
                _this.recodsList[i].prodTp = 8
              }
            } else if (_this.$route.path.indexOf('productDetail') >= 0) {
              _this.recodsList[i].prodTp = 6
            }
          }
          // console.log(_this.recodsList)
          _this.prodsList = _this.recodsList
        }
      },
      computed: {
      }
    }
</script>
<style scoped>
	.recomd_prods .title_recomdProd{
		color: #999;
        font-size: .875rem;
        height: 20px;
        line-height: 20px;
        margin:30px 10px 15px 10px;
	}
    .productItem{
        width: 100%;
    }
    .swiperProds{
        margin: 0 10px;
    }
</style>
