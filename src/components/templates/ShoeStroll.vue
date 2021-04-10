<template>
  <div class="stroll-box flex-center" :class="{'stroll-tran':istran}" :style="[transStyle]">
    <div class="flex-center stroll-unit" :style="'width:'+clientW+'px;'" v-for="(item,idx) in stroll" :key="idx" @touchstart.stop="tcStart" @touchmove.stop.prevent="tcMove" @touchend.stop="tcEnd" @touchcancel="tcCancel" @click.stop="tapGo(item.id)">
      <span>{{item.tickersymbol}}</span>
      <div :style="trendColor(item.lowestisup)">
        <span class="font-price">${{item.lowestprice}}</span>
        <img :src="trendImg(item.lowestisup)" alt="">
      </div>
      <span>~</span>
      <div :style="trendColor(item.highestisup)">
        <span class="font-price">${{item.highestprice}}</span>
        <img :src="trendImg(item.highestisup)" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'shoe-stroll',
  props: { strolls: { type: Array, default: [] }},
  data() {
    return {
      flatImg: '//files.eyee.com/mcdn/static/img/trend_flat.png', // require('../../assets/img/trend_flat.png'),
      upImg: '//files.eyee.com/mcdn/static/img/trend_up.png', // require('../../assets/img/trend_up.png'),
      downImg: '//files.eyee.com/mcdn/static/img/trend_down.png', // require('../../assets/img/trend_down.png'),
      tsStep: 1,
      dura: 20,
      ts: 0,
      ists: true,
      timer: null,
      tPos: 0
    }
  },
  mounted() {
    this.move()
  },
  computed: {
    stroll() {
      let stroll = this.strolls
      if (stroll[0] != stroll[stroll.length - 1]) { stroll.push(stroll[0]) }
      return stroll
    },
    clientW() {
      return window.innerWidth
    },
    istran() {
      return this.ists
    },
    transStyle() {
      let winW = this.clientW, strollW = winW * this.stroll.length
      this.ists = true
      if (this.ts > (strollW - winW - this.tsStep)) {
        this.ists = false; this.ts = -this.tsStep
      }
      if (this.ts < -this.tsStep) {
        this.ists = false; this.ts = strollW - winW - this.tsStep
      }

      return {
        width: strollW + 'px',
        transform: 'translateX(' + (-1 * this.ts) + 'px)'
      }
    }
  },
  methods: {
    move() {
      this.ts += this.tsStep
      this.timer = setTimeout(() => { this.move() }, this.dura)
    },
    tcStart(event) {
      this.ists = false
      this.tPos = event.targetTouches[0].clientX
      clearTimeout(this.timer)
    },
    tcMove(event) {
      let cX = event.targetTouches[0].clientX, tag = cX - this.tPos, step = 0
      // console.log(event);
      step = Math.ceil(Math.abs(tag) / this.tsStep) * this.tsStep
      if (tag > 0) this.ts -= step
      else this.ts += step
      this.tPos = cX
    },
    tcEnd() {
      this.ists = true
      this.move()
    },
    tcCancel() {
      this.tcEnd()
    },
    trendImg(trend) {
      return trend == 0 ? this.downImg : (trend == 1 ? this.upImg : this.flatImg)
    },
    trendColor(trend) {
      return 'color:#' + (trend == 0 ? '0ebd06' : (trend == 1 ? 'af3c03' : '000')) + ';'
    },
    tapGo(id) {
      // console.log('tapGo', id);
      this.$router.push('/shoe/detail/' + id + '&0')
    }
  }
}
</script>
<style scoped>
.stroll-box {
  height: 100%;
}

.stroll-tran {
  transition: transform 0s linear;
}

.stroll-unit {
  width: 100%;
  height: 48px;
  font-weight: bold;
}

.stroll-unit>div {
  margin: 0 2px;
}

.stroll-unit>div:first-of-type {
  padding-left: 3px;
}

.stroll-unit img {
  width: 16px;
  margin: 0 3px;
}
</style>
