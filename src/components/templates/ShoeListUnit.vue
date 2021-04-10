<template>
  <!-- <router-link :to="toUrl" tag="div" class="flex-center shoe-unit" :class="'shoe-'+type"> -->
  <div class="flex-center shoe-unit" :class="'shoe-'+type" @click="go">
    <div class="flex-center"><img v-lazy="https(info.imageurl)" alt=""></div>
    <div :style="type==1?'padding:8px;':''">
      <p class="ellipsis f14">{{info.shoe}}</p>
      <p class="ellipsis f14 bold">{{info.name}}</p>
      <template v-if="type==0">
        <div class="f12"><img class="pre-ico" :src="cImg" alt="">
          <span>发售日期：</span>
        </div>
        <p class="f12">{{dateFormat(info.releasedate,'yyyy.MM.dd')}}</p>
      </template>
    </div>
    <div v-if="type==1" style="padding-left:15px;">
      <p class="f12">发售价格：</p>
      <p class="price font-price" style="color:#af3c03;">${{info.retailprice}}</p>
    </div>
    <div v-else>
      <p class="f12">最低报价：</p>
      <div class="price font-price" :style="trendColor">
        <span>${{info.lowestprice}}</span><img :src="trendImg" alt=""></div>
      <p class="f14">SIZE {{info.lowestsize}}</p>
    </div>
    <!-- </router-link> -->
  </div>
</template>
<script>
import { DateFormat } from '../../common/util'
export default {
  name: 'shoe-unit',
  props: {
    unit: { type: Object },
    type: { type: Number, default: 0 }, // 0 默认列表,1 发售日历列表,2 滑块列表
    qzone: { type: Boolean, default: false }
  },
  data() {
    return {
      cImg: '//files.eyee.com/mcdn/static/img/calendar.png', // require('../../assets/img/calendar.png'),
      flatImg: '//files.eyee.com/mcdn/static/img/trend_flat.png', // require('../../assets/img/trend_flat.png'),
      upImg: '//files.eyee.com/mcdn/static/img/trend_up.png', // require('../../assets/img/trend_up.png'),
      downImg: '//files.eyee.com/mcdn/static/img/trend_down.png', // require('../../assets/img/trend_down.png'),
      dateFormat: DateFormat
    }
  },
  computed: {
    info() {
      // console.log('shoe unit item', this.unit)
      return this.unit
    },
    trendImg() {
      return this.unit.lowestisup == 0 ? this.downImg : this.unit.lowestisup == 1 ? this.upImg : this.flatImg
    },
    trendColor() {
      return 'color:#' + (this.unit.lowestisup == 0 ? '0ebd06' : this.unit.lowestisup == 1 ? 'af3c03' : '000') + ';'
    } // ,
    // toUrl() {
    //   return '/shoe/detail/' + this.info.id + '&' + (this.type == 1 ? 1 : 0)
    // }
  },
  methods: {
    go() {
      let url = '/shoe/detail/' + this.info.id + '&' + (this.type == 1 ? 1 : 0)
      this.qzone ? this.qzoneGo(url) : this.$router.push(url)
    }
  }
}
</script>
<style scoped>
.shoe-0 {
  border-bottom: 1px solid #eee;
}

img {
  width: 100%;
}
.shoe-unit > div {
  width: 33.33%;
  padding: 0 10px;
}
.shoe-unit > div:first-of-type {
  height: 100px;
}
.shoe-1 > div:first-of-type {
  width: 30%;
}
.shoe-2 > div {
  width: 100%;
  text-align: left;
}

.pre-ico {
  width: 16px;
  margin-right: 3px;
  margin-top: -2px;
}

.f12,
.f14 {
  line-height: 24px;
}

.f14 {
  font-size: 14px;
  color: #000;
}

.f12 {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.price {
  display: flex;
  align-items: center;
  font-size: 20px;
  line-height: 30px;
}

.price > img {
  width: 24px;
  margin-left: 5px;
  margin-top: 2px;
}
</style>
