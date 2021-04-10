<template>
  <div v-if="groupItemList&&groupItemList.length>0" class="groupon-container">
    <div class="sec-title">
      <p class="ico-btline">最新拼团<br>
        <span>NEW GROUPON</span>
      </p>
      <a href="javascript:;" @click="gotoGrouplist" class="sec-subtitle">查看更多</a>
    </div>


    <div >
      <swiper :options="swiperOption" class="coverflow">
        <swiper-slide v-for="item in groupItemList" :key="item.id" :style="css.borderShadow" :id="item.pid">

          <div>
            <div class="group-item-promotion">
              <div class="left-box" @click="gotoDetail(item)">
                <img :src="item.imageurl|firstImg" alt="">
              </div>

              <div class="right-box">
                <div class="price-tag">
                  <span class="price-now font-price"> ¥{{(item.teamprice || 0).toFixed(2)}}</span>
                  <span class="price-original font-price">{{(item.marketprice || 0).toFixed(2)}}</span>
                </div>

                <div class="middle-box">
                  <span class="title" @click="gotoDetail(item)">{{item.brand}}</span>
                  <span class="subtitle" @click="gotoDetail(item)">{{item.title}}</span>
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
                  <span>{{item.teamlimitcount}}人团</span>
                  <span v-if="item.teamtotalcount>=10">已团{{item.teamtotalcount}}件</span>
                  <span v-else>新开团</span>
                  <button class="join-button" @click="gotoDetail(item)">去开团</button>
                </div>

              </div>
            </div>
          </div>

        </swiper-slide>
      </swiper>
      <!--<div v-if="groupItemList.length>1" class="swiper-page-lu" slot="pagination"></div>-->
    </div>
  </div>

</template>

<script>
import ProductUnit from '../templates/ProductUnit'
import { GetGroupLastedOnHomepage } from '../../common/api/group'

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
      GetGroupLastedOnHomepage({ size: 10 })
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
        this.qzoneGo('/productDetail/' + item.pid)
      } else {
        this.$router.push({ path: '/productDetail/' + item.pid })
      }
    },
    gotoGrouplist() {
      if (this.insq) {
        this.qzoneGo('/groupbuy/list')
      } else {
        this.$router.push({ path: '/groupbuy/list' })
      }
    }
  }
}
</script>

