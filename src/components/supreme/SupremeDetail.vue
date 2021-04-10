<template>
      <div class="salesDetail">
        <v-header>
            <div class="nav-tab2"></div>
            <v-cart :isshow="true" :isdark="true"></v-cart>
        </v-header>
        <div class="info_sales" v-if="saleListNav.length>0">
            <div class="baseImages">
                <img :src="supremeInfo.brandcover|https" alt="">
            </div>
            <div class="salescontent">
                <div class="salesDetailTitle flex-center">
                    <img width="250" height="250" v-lazy="https(saleListNav[selectIndex].url)" alt="">
                </div>
                <p class="salesName font-price">{{supremeInfo.name}}</p>
                <p class="salesDate font-price">
                    <span class="spanLeft">{{supremeInfo.styleid}}</span>
                    <span class="">{{supremeInfo.releasedate}}</span>
                    <span class="spanRight">{{saleListNav[selectIndex].color}}</span>
                </p>
                <div>
                    <swiper :options="swiperOption">
                        <swiper-slide v-for="(item,index) in saleListNav" :key="index"  @click.native="select(item,index)">
                            <img width="35" height="35" :class="{selected:index==selectIndex}"  v-lazy="https(item.url)" alt=""/>
                        </swiper-slide>
                    </swiper>
                </div>
            </div>
        </div>
        <div class="onShopping">
            <h3>在售商家</h3>
            <template v-if="supremeInfo.stock>0">
                <OnsaleUnit v-for="(item,index) in supremeInfo.productlist" :key="index" :onsaleInfo="item" ></OnsaleUnit>
            </template>
            <template v-if="supremeInfo.stock<0">
                <div class="goodsOnShopping goodComing">
                    COMEING SOON
                </div>
            </template>
            <template v-if="supremeInfo.stock==0">
                <div class="goodsOnShopping soldOut">
                    SOLD OUT
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    import { BrandSpecialDetail } from '../../common/api/supreme'
    import { DateDiffFormat } from '../../common/util'
    import OnsaleUnit from '../templates/OnsaleUnit'
    export default{
      data() {
        return {
          supremeInfo: {},
          selectIndex: 0,
          saleListNav: [],
          swiperOption: {
            slidesPerView: 8,
            spaceBetween: 2
          }
        }
      },
      components: { OnsaleUnit },
      mounted() {
        this.supremeInfosData()

},
      methods: {
        supremeInfosData() {
          BrandSpecialDetail({ seriesProductId: this.$route.params.id }).then((res) => {
            this.initShare({ type: res.share.type, info: { title: res.share.title, img: res.share.icon, desc: res.share.content }})
            console.log('suprem detl', res)
            if (res) {
              this.supremeInfo = res.single
        //   .releasedate.split('+8')[0].split(' ')[0]
          this.supremeInfo.releasedate = DateDiffFormat(this.supremeInfo.releasedate)
              this.saleListNav = JSON.parse(res.single.seriesproductpic)
            }
          }).catch(err => {
            this.toast('数据请求失败')
          })
        },
        select(item, index) {
          this.selectIndex = index
    }
      }
    }
</script>
<style scoped>
    .nav-top,.nav-top-light{
        background-color: transparent!important;
    }
    .salesDetail{
        width: 100%;
        padding-bottom: 64px;
    }
    .info_sales{
        padding: 0 15px;
    }
    .baseImages{
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: -1;
        opacity: 0.5;
        height: 200px;
        filter: blur(2px);
        overflow: hidden;
    }
    .salesDetail .selected{
        border: 1px solid red;
    }
    .salescontent{
        position: relative;
        z-index: 1;
        /* background: white; */
        border-radius:8px;
    }
    .salesDetailTitle{
        /*border-radius: 20px;*/
        position: relative;
        background:#ffffff;
        box-shadow:0 0 8px 0 rgba(204,204,204,0.50);
        border-radius:8px;
        margin-top: 64px;
        padding: 20px 48px;
    }
    .salesDetailTitle img{
        border-radius: 8px;
    }
    .salesDetail .salesName{
        margin-top: 20px;
        font-size:18px;
        color:#ff0000;
        letter-spacing:0;
        line-height:18px;
        text-align: center;
    }
    .salesDetail .salesDate{
        display: flex;
        margin: 10px auto;
        font-weight: bold;
        color: #333333;
        font-size: 14px;
    }
    .salesDetail span{
        flex:1;
        text-align: center
    }
    .salesDetail .spanLeft{
        text-align: left;
    }
    .salesDetail .spanRight{
        text-align: right;
    }
    .salesDetail .onShopping h3{
        text-align: center;
        font-size: 14px;
        position: relative;
        margin-bottom: 20px;
    }
    .salesDetail .onShopping h3::before{
        content:'';
        position: absolute;
        width: 24px;
        border: 1px solid #333333;
        bottom: -11px;
        left: 50%;
        transform: translateX(-50%)
    }
    .salesDetail .onShopping .goodsOnShopping{
        display: flex;
        align-items:center;
        justify-content: space-between;
        background:#ffffff;
        box-shadow:0 0 4px 0 rgba(204,204,204,0.50);
        border-radius:4px;
        margin-top: 20px;
        height: 90px;
    }
    .salesDetail .onShopping  .goodComing,.salesDetail .onShopping  .soldOut{
        font-size: 40px;
        color:#cccccc;
        letter-spacing:0;
        line-height:80px;
        justify-content: center;
        font-weight: bold;
        height: 80px;
    }
</style>
