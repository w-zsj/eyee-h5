<template>
  <div v-if="hasdata==0"></div>
  <div class="page-footer sneakdetail" v-else-if="hasdata==1">
    <v-header>
      <div class="nav-tab2">
        <h3 style="color:#000;">{{detlInfo.seriesname}}</h3>
      </div>
      <v-cart :isshow="true" :isdark="true"></v-cart>
    </v-header>
    <div class="detl_cont">
      <div class="bg_imgs" :style="{marginBottom: deviceWidth*0.92*0.64/2+10+'px'}">
        <!-- :style="{height:spaceHeight+'px'}" -->
        <div class="brand_img">
          <img :src="detlInfo.brandcover|https" alt=""><!--  :style="{height:deviceWidth*0.43+'px'}" -->
          <div></div>
        </div>
        <div class="sneak_img flex-center" :style="{height:deviceWidth*0.92*0.64+'px'}">
          <img :src="detlInfo.imageurl|https" alt="">
        </div>
      </div>
      <div class="info_shoe dt-dtl">
        <p class="name_shoe font-price">{{detlInfo.title}}</p>
        <p class="color_shoe">鞋款颜色<br>
          <span class="font-price">{{detlInfo.colorway}}</span>
        </p>
        <div class="flex-center">
          <div>
            <p class="black">官方货号</p>
            <p class="font-price">{{detlInfo.styleid}}</p>
          </div>
          <!-- <div>
            <p class="black">官方发售价</p>
            <p class="font-price">{{detlInfo.retailprice}}</p>
          </div> -->
          <div>
            <p class="black">发售日期</p>
            <p class="font-price" v-if="detlInfo.releasedate">{{dateFormat(detlInfo.releasedate,'yyyy-M-d')}}</p>
            <p class="font-price" v-if="!detlInfo.releasedate">---</p>
          </div>
        </div>
      </div>
      <div class="sneak_title" v-if="shopsList">在售商家</div>
      <div class="shop_list">
        <OnsaleUnit v-for="(item ,index) in shopsList" :key="index" :onsaleInfo="item"></OnsaleUnit>
      </div>
    </div>
    <!---->
    <!-- <v-delay :delay="800"> -->
    <div class="detailSlideMask" v-if="showDetailImg">
      <div class="dsm-bg"></div>
      <span class="close" @click="close">×</span>
      <div class="detlInfoName font-price">{{detlInfo.seriesname}}</div>
      <swiper :options="slideType" class="swiperWrap">
        <swiper-slide class="swiperSlide" v-for="(it,index) in detailimglist" :key="index">
          <img :src="it|https">
        </swiper-slide>
        <div class="swiper-scrollbar bar" slot="scrollbar"></div>
      </swiper>
    </div>
    <!-- </v-delay> -->
    <div class="lookDetails" v-if="detailImg" @click="showDetailImage">查看鞋款细节</div>
  </div>
  <div v-else-if="hasdata==2" class="ClassDefault" style="margin-top:150px;">
    <v-header>
      <div class="nav-tab2">
        <h3 style="color:#333;">返回</h3>
      </div>
    </v-header>
    <img src="//files.eyee.com/mcdn/static/img/no_shoe.png" alt="">
    <p>暂无相关数据...</p>
    <!-- <span @click="$router.go(-1)">随便逛逛</span> -->
  </div>
  <v-error v-else></v-error>
</template>
<script>
import { ENUM } from '../../common/util'
import { DateFormat } from '../../common/util'
import { ShoeDetail } from '../../common/api/sneaker'
import OnsaleUnit from '../templates/OnsaleUnit'
export default {
  data() {
    return {
      deviceWidth: 0,
      deviceHeight: 0,
      spaceHeight: 0,
      detlInfo: {},
      dateFormat: DateFormat,
      shopsList: [],
      cartimg: '//files.eyee.com/mcdn/static/img/cart_light.png', // require('../../assets/img/cart_light.png'),
      hasdata: 0,
      detailimglist: [],
      slideType: {
        scrollbar: '.swiper-scrollbar',
        scrollbarHide: false
        // scrollbarDraggable: true,
        // scrollbarSnapOnRelease: true
      },
      detailImg: null,
      showDetailImg: false
    }
  },
  components: { OnsaleUnit },
  mounted() {
    // console.log(this.hasdata,'this.detlInfo.hasdata------------------------')
    let deviceWid = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth,
      deviceHei = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight
    this.deviceWidth = deviceWid
    this.deviceHeight = deviceHei
    // this.spaceHeight = deviceWid * 0.92 * 0.64 + deviceHei * 0.1 + 20
    this.getDetlInfos()
  },
  computed: {
    searchUrl() {
      return '/search/' + ENUM.SearchType.newsShoe.val
    },
    sneakid() {
      return this.$route.params.shoeid
    },
    sneakerCate() {
      console.log(this.$route.params, 'catyname')
      if (this.$route.params.catyname == 0) {
        return '男鞋'
      } else if (this.$route.params.catyname == 1) {
        return '女鞋'
      } else if (this.$route.params.catyname == 'n') {
        return null
      }
      // return this.$route.params.catyname == 0 ? '男鞋' : '女鞋';
    }
  },
  methods: {
    getDetlInfos() {
      // console.log(this.sneakid,'sneakid')
      // let id = '8a70c467a196498d9f7d3128237affd8' // 测试数据商品id this.sneakerCate
      //        this.sneakid //原本的参数id
      ShoeDetail({ shoeid: this.sneakid, categoryname: this.sneakerCate })
        .then(res => {
          if (res && res.info) {
            this.hasdata = 1
            this.detlInfo = res.info
            this.shopsList = res.items
            if (res.info.detailimglist && res.info.detailimglist.length > 0) {
              this.detailimglist = res.info.detailimglist
              this.detailImg = true
            } else if (!res.info.detailimglist || res.info.detailimglist.length === 0) {
              this.detailImg = false
            }
            let s = res.share
            this.initShare({ type: s.type, info: { title: s.title, img: s.icon, desc: s.content }})
          } else {
            this.hasdata = 2
          }
        })
        .catch(e => {
          this.hasdata = 3
          console.error('数据加载失败', e)
        })
    },
    close() {
      this.showDetailImg = false
    },
    showDetailImage() {
      this.showDetailImg = true
    }
  }
}
</script>
<style scoped>
.detailSlideMask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  /* border: 1px solid; */
}
.dsm-bg {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
}
.ClassDefault {
  width: 150px;
  margin: 0 auto;
  margin-top: 200px;
  font-size: 14px;
  text-align: center;
}
.ClassDefault img {
  width: 100px;
}
.ClassDefault p {
  margin-top: 20px;
}
.detlInfoName {
  width: 100%;
  text-align: center;
  /* height: 10px; */
  /* line-height: 18px; */
  /* font-family:DINOT-CondBlack; */
  font-size: 18px;
  /* color:#333333; */
  margin-top: 90px;
}
.close {
  /*border: 1px solid #8e8dff;*/
  display: block;
  width: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 40px;
  color: #333333;
  position: absolute;
  top: 5%;
  left: 5%;
}
.detailSlideMask .swiperWrap {
  width: 95%;
  height: 350px;
  margin: 30px auto 0;
  overflow: hidden;
}
.detailSlideMask .swiperWrap .swiperSlide {
  width: 100%;
  /* height: 335px; */
  max-height: 300px;
  border-radius: 10px;
  /* background: #ffffff; */
}
.detailSlideMask .swiperWrap .swiperSlide img {
  width: 100%;
  height: auto;
}
.detailSlideMask .swiperWrap .bar {
  height: 2px;
}
.lookDetails {
  position: fixed;
  border-radius: 10px 10px 0 0;
  bottom: 0;
  background: #333333;
  width: 100%;
  height: 45px;
  z-index: 99;
  color: white;
  line-height: 45px;
  text-align: center;
}
/**/

.sneakdetail {
  margin-top: 0 !important;
}

.nav-top {
  background: transparent !important;
}

.bg_imgs .brand_img {
  position: relative;
  padding-top: 150px;
  overflow: hidden;
  filter: blur(3);
}

.bg_imgs .brand_img > div {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(255, 255, 253, 0.5);
  /* filter: blur(3px); */
}

.bg_imgs .brand_img img {
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.sneak_img {
  position: absolute;
  width: 94%;
  left: 3%;
  top: 10%;
  border-radius: 14px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 10px 14px 0 rgba(0, 0, 0, 0.1);
}

.sneak_img img {
  width: 60%;
  max-height: 100%;
}

.info_shoe p {
  padding: 0 15px;
  line-height: 20px;
  text-align: center;
  color: #000;
  font-size: 0.875rem;
  margin-bottom: 10px;
}

.info_shoe p span {
  color: #999;
}

.info_shoe p.name_shoe {
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 15px;
}

.black {
  color: #000;
  font-weight: 600;
}

.dt-dtl {
  padding: 20px 0;
  margin: 20px 0;
}

.dt-dtl > div {
  margin-top: 10px;
}

.dt-dtl > div div {
  flex: 1;
}

.dt-dtl > div div p.font-price {
  color: #999;
}

.sneak_title {
  position: relative;
  height: 20px;
  line-height: 20px;
  margin: 10px 0 20px;
  font-size: 0.875rem;
  color: #000;
  text-align: center;
  letter-spacing: 2px;
  font-weight: 600;
}

.sneak_title:after {
  content: '';
  position: absolute;
  height: 2px;
  background: #333;
  width: 24px;
  left: 50%;
  margin-left: -12px;
  bottom: -5px;
}
</style>
