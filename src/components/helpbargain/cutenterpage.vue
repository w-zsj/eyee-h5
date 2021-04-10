<template>
  <div v-if="groupItemList&&groupItemList.length>0" class="groupon-container">
    <div class="sec-title">
      <p class="ico-btline">助力<br>
        <span>DISCOUNTS</span>
      </p>
      <a href="javascript:;" @click="gotoGrouplist" class="sec-subtitle">查看更多</a>
    </div>


    <div >
      <swiper :options="swiperOption" class="coverflow">
        <swiper-slide v-for="item in groupItemList" :key="item.id" :style="css.borderShadow" :id="item.productid">

          <div>
            <div class="group-item-promotion">
              <div class="left-box" @click="gotoDetail(item)">
                <img :src="item.productimageurl|firstImg" alt="">
              </div>

              <div class="right-box">
                <div class="price-tag">
                  <span class="price-now font-price"> ¥{{(item.minprice || 0).toFixed(2)}}</span>
                  <span class="price-original font-price">{{(item.saleprice || 0).toFixed(2)}}</span>
                </div>

                <div class="middle-box">
                  <!-- <span class="title" @click="gotoDetail(item)">{{item.businessname}}</span> -->
                  <span class="subtitle ellipsis" @click="gotoDetail(item)">{{item.productname}}</span>
                  <div class="place">
                    <span class="info " >
                      <i v-if="item.businesstype === 1" class="ico-sp-official"></i>
                      <i v-else-if="item.businesstype === 2" class="ico-sp-buy"></i>
                      <i class="ico-sp-store" v-else ></i>
                    </span>
                    <span class="location ellipsis"> {{item.businessname}} </span>
                  </div>
                </div>

                <div class="join-groupon">
                  <span>{{item.successcount}}人</span>
                  <span>助力成功</span>
                  
                </div>
                  <button class="join-button" @click="gotoDetail(item)">邀请助力</button>
              </div>
            </div>
          </div>

        </swiper-slide>
      </swiper>
      <!--<div v-if="groupItemList.length>1" class="swiper-page-lu" slot="pagination"></div>-->
    </div>
  </div>

</template>
<style scoped>
  .join-button{
    /* top: 20px; */
        position: absolute;
    right: 5%;
    bottom: 20px;
    border: none;
    color: #333333;
    padding: 6px 10px;
    background-color: #FFC700;
    border-radius: 6px;
  }
  .right-box{
    width: 30%;
  }
</style>

<script>
import ProductUnit from '../templates/ProductUnit'
import { GetCutProductListOpen } from '../../common/api/bargain'

export default {
  name: 'group-promotion-on-home-page',
  props: {
    insq: {
      defaul: false,
      type: Boolean
    }
  },
  components: { ProductUnit },
  data() {
    return {
      css: {
        borderShadow: {
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 4px 10px 1px #ccc',
          height: '160px',
          background: '#ffffff',
          position: 'relative'
        }
      },

      groupItemList: [],

      swiperOption: {
        slidesPerView: 1.1,
        centeredSlides: true,
        loop: true,
        roundLengths: true,
        effect: 'coverflow',
        coverflowEffect: {
          rotate: 30,
          stretch: 10,
          depth: 60,
          modifier: 2,
          slideShadows: true
        },
        onClick: swiper => {
          var mys = swiper.clickedSlide.getAttribute('id')
          if (swiper.activeIndex == 0 || swiper.isEnd) {
            if (this.insq) {
              this.qzoneGo('/productDetail/' + mys)
            } else {
              this.$router.push('/productDetail/' + mys)
            }
          }
        }
      }
    }
  },

  computed: {},

  mounted: function () {
    this.getGroupDataList()
  },

  methods: {
    reload() {
      this.getGroupDataList()
    },

    getGroupDataList() {
      GetCutProductListOpen({page:1, size: 10 })
        .then(res => {
          if (res) {
            this.groupItemList = res.list
          }
        })
        .catch(e => {
          console.error(e)
        })
    },

    gotoDetail(item) {
      if (this.insq) {
        this.qzoneGo('/productDetail/' + item.productid)
      } else {
        this.$router.push({ path: '/productDetail/' + item.productid })
      }
    },
    gotoGrouplist() {
      if (this.insq) {
        this.qzoneGo('/helpbargain')
      } else {
        this.$router.push({ path: '/helpbargain' })
      }
    }
  }
}
</script>

