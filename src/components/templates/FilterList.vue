<template>
  <div class="filter_list">
    <template v-for='(item,index) in (filterType==3?shopFilterData:filterData)' >
      <div class="filter_title clearfix" @click="changSelect(index)" :key="index">
        <p class="title_name">{{item.title}}</p>
        <div class="title_item">
          <span v-if='index==0'>{{dataOptions.brandName}}</span>
          <span v-if='index==1'><span class="categotySpan">{{dataOptions.category}}</span>{{dataOptions.categoryName}}</span>
          <span v-if="index==2&&dataOptions.beginprice==null">{{dataOptions.priceName}}</span>
          <span v-if="index==2&&dataOptions.beginprice>=0&&dataOptions.beginprice!=null">
            <!--{{dataOptions.beginprice}}{{dataOptions.endprice==(-1)||dataOptions.endprice==(0)?'以上':('-'+dataOptions.endprice)}}-->
            {{dataOptions.showPrice}}
          </span>
          <span v-if='index==3'>{{dataOptions.sizeName}}<span class="categotySpan">{{dataOptions.size}}</span></span>
          <div class="arrow-box">
            <p class="top"><i class="icon_up" :class="{icon_down:!item.show}"></i>{{item.show}}</p>
          </div>
        </div>
        <!-- <i class="triangle-up"></i>
        <i class="triangle-down"></i> -->
      </div>
      <div style="overflow: hidden;">
        <transition enter-active-class="animated fadeIn" >
          <div v-show='item.show&&item.type==0&&filterType!=3' >
            <p class="hotbrand_title" v-if="index ==0 ">热门品牌</p>
            <SelectListUnit :items='item.hotlist' :selectIndex='item.index' :showInput='item.index==3'></SelectListUnit>
            <p class="letter_choose" v-if="index==0" @click.stop="Modal(1)">按首字母查询品牌</p>
          </div>
        </transition>
        <transition enter-active-class="animated fadeIn" >
          <SelectListUnit v-show='item.show&&item.type==0&&filterType==3' :items='item.list' :selectIndex='item.index' :showInput='item.index==3'></SelectListUnit>
        </transition>
        <transition enter-active-class="animated fadeIn" >
          <SelectList v-show='item.show&&item.type==1' :items='item.list' :selectIndex='item.index' class="filter_l"></SelectList>
        </transition>
        <transition enter-active-class="animated fadeIn" >
          <SelectListUnit v-show='item.show&&item.type==2' :items='item.list' :selectIndex='item.index' :showInput='item.index==3'></SelectListUnit>
        </transition>
      </div>
    </template>
    <transition name='fade' enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
      <div class="modalBox" v-show="showModal">
        <p @click.stop='Modal(0)'>×</p>
        <BrandAll :show="showModal"></BrandAll>
      </div>
    </transition>
  </div>
</template>
<script>
  import * as api from '../../common/api/base'
import SelectListUnit from '../templates/SelectListUnit'
import SelectList from '../templates/SelectList'
import BrandAll from '../templates/BrandAll'
import { mapGetters } from 'vuex'
  export default {
    props: {
      selectType: { type: Number, default: 0 }// 0是默认筛选条件数据1是店铺筛选条件
    },
    components: { SelectListUnit, SelectList, BrandAll },
    data() {
      return {
        brandLists: [],
        category: [],
        pricers: [],
        clothessize: [],
        shoessize: [],
        down: true,
        showModal: false,
        codes: [],
        selectItem: [
          // type 0是没有子选，type1有自选项  show控制选项显示隐藏
          { title: '品牌', name: '全部', index: 1, list: [], hotlist: [], show: false, type: 0 },
          { title: '分类', name: '全部', index: 2, list: [], show: false, type: 1 },
          { title: '价格', name: '全部', index: 3, list: [], show: false, type: 2 },
          { title: '尺码(仅筛选平台主营商品)', name: '全部', index: 4, list: [], show: false, type: 1 }
        ],
        params: {}
      }
    },
    mounted() {
      this.params = this.$route.params
      console.log('searchOption2222', this.shopOption)
      if (this.params && this.filterType == 3) {
        if (!(this.shopFilterData && this.shopFilterData.length > 0)) {
          this.$store.state.product.shopDetailId = this.params.id
          this.getFilter()
        }
      } else {
        if (!(this.filterData && this.filterData.length > 0)) {
          this.getFilter()
        }
      }
      //  if(this.searchOption.brandName){
      //     this.searchOption.brandName ='全部'
      //   }
    },
    methods: {
      changSelect(index) {
        if (this.params && this.filterType === 3) {
          this.shopFilterData[index].show = !this.shopFilterData[index].show
        } else {
          this.filterData[index].show = !this.filterData[index].show
        }
      },
      checkOut(res) {
        console.log('shopfilter', res)
        this.brandLists = res.brand
        this.brandLists.unshift({ name: '全部', id: null, selected: true })
        this.selectItem[0].list = res.brand

        // 热门品牌
        if (res.hotbrand && res.hotbrand.length > 0) {
          res.hotbrand.unshift({ name: '全部', id: null, selected: true })
          this.selectItem[0].hotlist = res.hotbrand
        }
        var codes = []
        for (var i = 0; i < res.brand.length; i++) {
          var code = res.brand[i].code, same = null
          codes.map((val) => {
            if (val.code == code) { same = val }
          })
          if (same == null || same == undefined) {
            codes.push({ code: code, index: i, list: [] })
          }
        }
        this.codes = codes
        for (var i = 0; i < codes.length; i++) {
          var cd = codes[i].code
          for (var j = 0; j < res.brand.length; j++) {
            if (res.brand[j].code == cd) {
              codes[i].list.push(res.brand[j])
            }
          }
        }
        let tempCo = codes.splice(0, 1)
        codes.push(tempCo)
        // 注释的原因是因为 在获取平台时已经用了这个方法  再用冲突了
        // 如果这个方法还有用 建议 在store里面重新申请变量 查看全部品牌
        // this.$store.dispatch('setMallBrandLists', codes)

        for (var i = 0; i < res.category.length; i++) {
          res.category[i].selected = false
          if (res.category[i].haschildren == true) {
            this.category.push(res.category[i])
          }
        }
        this.category.unshift({ name: '全部', id: null, selected: true })
        this.selectItem[1].list = this.category
        for (var i = 0; i < this.category.length; i++) {
          if (this.category[i].id != null) {
            var id = this.category[i].id
            this.category[i].child = [{ name: '全部', id: id, selected: false }]
            for (var j = 0; j < res.category.length; j++) {
              if (res.category.parentid == 0) {
                continue
              }
              if (id == res.category[j].parentid) {
                this.category[i].child.push(res.category[j])
              }
            }
          }
        }
        res.pricerange.unshift({ name: '全部', id: null, selected: true })
        this.selectItem[2].list = res.pricerange
        var cl = [
          { name: '全部', id: null, selected: true },
          // 类型服饰为0 鞋子尺码 为1
          { name: '服饰', id: null, selected: false, type: 0, child: res.clothessize },
          { name: '鞋子', id: null, selected: false, type: 1, child: res.shoessize }
        ]
        this.selectItem[3].list = cl
        if (this.params && this.filterType == 3) {
          this.$store.dispatch('getShopFilterData', this.selectItem)
        } else {
          this.$store.dispatch('getFilterData', this.selectItem)
        }
      },
      getFilter() {
        console.log(this.params)
        var busId = this.$store.state.product.shopRouteId
        if (this.params && this.filterType == 3) {
          if (busId) {
            api.SearchBusiness({ businessid: busId }).then((res) => {
              console.log('商家筛选条件', res)
              if (res) {
                this.checkOut(res)
              } else {
                this.toast('加载失败')
              }
            }).catch((err) => {
              this.toast('加载失败')
            })
          } else {
            this.toast('网络繁忙')
          }
        } else {
          api.SearchCondition().then((res) => {
            console.log('筛选模板', res)
            if (res) {
              this.checkOut(res)
            } else {
              this.toast('加载失败')
            }
          }).catch((err) => {
            // console.error(err)
            this.toast('加载失败')
          })
        }
      },
      Modal(type) {
        // type 1打开，0关闭
        this.showModal = !!type
      }
    },
    computed: {
      ...mapGetters({
        filterData: 'filterData',
        homeOption: 'homeOption',
        searchOption: 'searchOption',
        shopOption: 'shopOption',
        shopFilterData: 'shopFilterData',
        filterType: 'filterType',
        isKeywordBrand: 'isKeywordBrand'
      }),
      dataOptions() {
        let param = this.$route.params

        if (param && param.type == 1) {
          return this.homeOption
        } else if (param.type == 2) {
          console.log(this.searchOption, 'searchOption')
          console.log('isKeywordBrand', this.isKeywordBrand)
          if (this.isKeywordBrand.data) {
            this.searchOption.brandName = this.isKeywordBrand.data.brandName || '全部'
            this.searchOption.brandid = this.isKeywordBrand.data.brandId
          } else {
            this.searchOption.brandName = this.isKeywordBrand.brandName || '全部'
            this.searchOption.brandid = this.isKeywordBrand.brandId
          }
          return this.searchOption
        }
        if (this.filterType == 3) {
          return this.shopOption
        }
      },
      shopDetailId() {
        return this.$store.state.product.shopDetailId
      }
    }

  }

</script>
<style scoped>
  .filter_list{
    padding: 0 10px;
  }
  .arrow-box {
    width: 20px;
    height: 50px;
    position: relative;
    display: inline-block;
  }

  .top_arrow1,
  .top_arrow2,
  .bottom_arrow1,
  .bottom_arrow2 {
    width: 0;
    height: 0;
    display: block;
    position: absolute;
    left: 0;
    top: -3px;
    z-index: 5;
    border-top: 6px transparent dashed;
    border-left: 6px transparent dashed;
    border-right: 6px transparent dashed;
    border-bottom: 6px #f2f2f2 solid;
    overflow: hidden;
    transition: all 0.2s linear;
  }

  .top_arrow1 {
    border-bottom: 6px #ccc solid;
  }

  .top_arrow2 {
    top: -3px;
    border-bottom: 6px #f2f2f2 solid;
  }

  .bottom_arrow1,
  .bottom_arrow2 {
    top: 0;
    border-bottom: 6px transparent dashed;
    border-top: 6px #f2f2f2 solid;
  }

  .bottom_arrow1 {
    top: 0px;
    border-top: 6px #ccc solid;
  }

  .bottom_arrow2 {
    border-top: 6px #f2f2f2 solid;
  }

  .top {
    height: 8px;
    /*position: absolute;*/
    /*top: 6px;*/
    /*transform: translateY(-50%);*/
    margin: 0 8px;
  }

  .filter_title {
    height: 50px;
    line-height: 50px;
    background: #8e8e8e;
    position: relative;
    font-size: 15px;
    color: #fff;
    margin-bottom: 10px;
    border-radius: 5px;
  }

  .triangle-down,
  .triangle-up {
    position: absolute;
    width: 0;
    height: 0;
    border-width: 50px 10px 50px 10px;
    border-style: solid;
    top: 0;
    border-color: transparent transparent #fff #fff;
  }

  .triangle-down {
    right: 0;
    z-index: 2;
    border-width: 50px 10px 50px 10px;
    border-color: transparent #fff #fff transparent;
  }

  .title_name {
    position: absolute;
    left: 20px;
  }

  .title_item {
    float: right;
    right: 5px;
    display: flex;
    padding-right: 20px;
    font-size: 15px;
  }

  .title_item span {
    font-size: 0.75rem;
    color: #ffc700;
  }

  .filter_l {
    width: 90%;
    margin: 14px auto 7px;
  }

  .letter_choose{
    width: 90%;
    margin: 0 auto;
    line-height: 30px;
    margin-bottom: 15px;
    background: #f9f9f9 url(//files.eyee.com/mcdn/static/img/letter.png) no-repeat 5px center;
    background-size: 20px 19px;
    padding-left: 30px;
    height: 30px;
    font-size:12px;
    color:#999;
  }
  .modalBox {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .8);
    width: 100%;
    height: 100%;
    z-index: 200;
  }
  .modalBox p {
    color: #eee;
    position: absolute;
    right: 0;
    text-align: center;
    font-size: 2rem;
    width: 80px;
    height: 50px;
    line-height: 60px;
    z-index: 1;
  }
  .hotbrand_title{
    position: relative;
    width: 90%;
    font-size: 12px;
    color: #666;
    height: 30px;
    line-height: 30px;
    margin: 0 auto;
    padding: 0 10px;
    margin-top: 10px;
  }
  .hotbrand_title:after{
    content: '';
    position: absolute;
    left: 0;
    top: 9px;
    height: 12px;
    width: 1px;
    background: #666;
  }
  .arrow-box .top .icon_up,.arrow-box .top .icon_up.icon_down{
    display: inline-block;
    transition: all 0.2s linear;
    vertical-align: middle;
  }
  .arrow-box .top .icon_up{
    transform: rotate(180deg);
  }
  .arrow-box .top .icon_up.icon_down{
    transform: rotate(0deg);
  }
</style>
