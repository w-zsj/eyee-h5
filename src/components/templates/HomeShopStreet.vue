<template>
  <div v-if="realList&&realList.length>0">
    <div class="sec-title">
      <p class="ico-btline">潮流店铺</p>
      <router-link class="sec-subtitle" to="/mall/shop">更多店铺</router-link>
    </div>
    <div class="ss-box">
      <div class="ss-main" :style="[transStyle]" @touchstart.stop="tcStart" @touchmove.stop.prevent="tcMove">
        <!--@touchend.stop="tcEnd" @touchcancel="tcCancel"-->
        <img :src="sImg" alt="" ref="streetBg">
        <ul>
          <router-link v-for="item in realList" :class="item.class" :style="[item.style,item.transStyle,item.inStyle]" :key="item.id" :to="'/shop/shopdetail/'+item.id" tag="li">
            <a>
              <p>{{item.name}}</p>
              <img :src="item.product&&item.product.mainpic|firstImg|https" alt="">
              <div class="ss-brand flex-center">
                <img v-for="(brand,bi) in item.brands" v-if="bi<3" :key="brand.id" :src="brand.logourl|https" alt="">
              </div>
            </a>
          </router-link>
          <router-link class="ss-btn" to="/mall/shop" :style="[goBtn]"></router-link>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'shop-street',
  props: { shops: { default: [] }},
  data() {
    return {
      sImg: '//files.eyee.com/mcdn/static/img/shop_street.jpg', // require('../../assets/img/shop_street.jpg'),
      bgSize: { w: 0, y: 0 },
      scale: 3, // 比例
      rate: 1, // 倍率
      transX: 0,
      midTansX: window.innerWidth / 2,
      posX: 0,
      goBtn: {
        position: 'absolute',
        top: '115px', // 345,
        left: '2688px', // 8064
        width: '100px', // 300
        height: '50px'// 150
      }
      // dir: -1,//-1左滑，1右滑
      // ease: { moving: false, lastPos: 0, lastTime: 0 },
    }
  },
  mounted() {
    // console.log('shopstreet', this.shops);
    // this.rate = window.innerWidth <= 375 ? 1 : 2;
    let bg = this.$refs.streetBg
    // naturalWidth,naturalHeight
    if (bg) {
      bg.onload = () => {
        this.bgSize.w = bg.naturalWidth / this.scale * this.rate
        this.bgSize.h = bg.naturalHeight / this.scale * this.rate
        // console.log('streetBgW:%s,streetBgH:%s,streetBg:', bg.naturalWidth, bg.naturalHeight, bg);
        bg.style.height = this.bgSize.h + 'px'
        let p = bg.parentElement || bg.parentNode
        p.style.height = bg.style.height
      }
    }
  },
  computed: {
    realList() {
      let list = this.shops
      list = list.map(i => {
        i.class = 'ss-unitX' + this.rate
        let b = i.begin / this.scale * this.rate, e = i.end / this.scale * this.rate,
          iW = e - b, trans = '-100%', inTop = null
        // i.middle = b + iW / 2;
        i.style = { left: b + 'px' }
        // if (i.middle < this.midTansX) trans = iW + 'px';
        i.transStyle = { transform: 'translateX(' + trans + ')' }
        if (this.midTansX >= b && this.midTansX <= e) inTop = 0
        i.inStyle = { top: inTop }

        return i
      })
      // console.log('this.midTansX:%s,list:', this.midTansX, list)
      return list
    },
    transStyle() {
      let trans = 'translateX(' + this.transX + 'px)'
      // console.log('trans:%s,midTansX:%s', trans, this.midTansX);
      return { transform: trans }
    }
  },
  methods: {
    tcStart(event) {
      let cX = event.targetTouches[0].clientX
      this.posX = cX
      // this.ease = { moving: false, lastPos: cX };
    },
    tcMove(event) {
      let cX = event.targetTouches[0].clientX, tX = 0, winW = window.innerWidth, isreverse = false
      tX = (cX - this.posX) * 2
      /* if (tX < 0 && this.dir == 1 || tX > 0 && this.dir == -1) isreverse = true;
      if (isreverse)
        this.ease = { moving: false, lastPos: cX };
      if (tX < 0) this.dir = -1;
      else this.dir = 1;*/

      tX += this.transX
      if (tX > 0) tX = 0
      if (tX < winW - this.bgSize.w) tX = winW - this.bgSize.w

      this.transX = tX
      this.midTansX = Math.abs(this.transX) + winW / 2 + 10
      this.posX = cX
    }
    /* tcEnd(event) {
      let maxX = window.innerWidth - this.bgSize.w;
      if (this.transX >= 0 || this.transX <= maxX) return;
      let cX = this.posX, mX = cX - this.ease.lastPos, c, d = 50,
        t = 0, b = this.transX;
      if (mX == 0) return;
      c = this.transX + mX;
      //console.log('t:%s,b:%s,c:%s,d:%s', t, b, c, d);
      this.ease.moving = true;
      var move = () => {
        if (!this.ease.moving) return;
        t++;
        let temp = this.easeMove(t, b, c - this.transX, d), end = false;
        if (temp > 0) { temp = 0; end = true; }
        if (temp < maxX) { temp = maxX; end = true; }
        //console.log('----t:%s,b:%s,c:%s,d:%s,temp:%s', t, b, c, d, temp);
        this.transX = temp;
        if (end) return;
        if (t < d)
          setTimeout(function () { move(); }, (d / 2 < 20) ? 20 : (d / 2));
      };
      move();
    },
    tcCancel(event) {
      this.tcEnd(event);
    },
    easeMove(t, b, c, d) {
      // * t: current time（当前时间）
      // * b: beginning value（初始值）
      // * c: change in value（变化量）
      // * d: duration（持续时间）
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },*/
  }
}
</script>
<style scoped>
.ss-box {
  position: relative;
  padding-top: 10px;
  overflow: hidden;
}

.ss-main {
  position: relative;
  /*transition: transform 0s linear;*/
}

.ss-main>img {
  max-width: inherit;
}

.ss-main ul {
  position: absolute;
  left: 0;
  top: 10px;
  display: flex;
}

.ss-main ul li {
  position: absolute;
  background-color: #fff;
  box-shadow: 0 0 5px 5px rgba(185, 185, 185, .5);
  border-radius: 4px;
  top: -500px;
  transition: all .3s cubic-bezier(.63, .15, .13, 1.22);
}

.ss-unitX1 {
  width: 120px;
  height: 154px;
  text-align: center;
}

.ss-main ul li a {
  padding: 10px;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.ss-main .ss-unitX1 a {
  padding: 5px;
}

.ss-main ul li p {
  font-size: 12px;
  width: 100%;
  height: 28px;
  margin-top: 5px;
  overflow: hidden;
}

.ss-main ul li a>img {
  width: 65%;
}

.ss-brand {
  height: 30px;
  padding: 1%;
}

.ss-brand img {
  width: 24px;
  margin: 0 5px;
  border-radius: 50%;
  box-shadow: 0 0 4px 1px rgba(219, 219, 219, .5);
}
</style>
