<template>
  <div v-if="realList&&realList.length>0">
    <div class="sec-title">
      <p class="ico-btline">潮流店铺</p>
      <router-link class="sec-subtitle" to="/mall/shop">更多店铺</router-link>
    </div>
    <div class="ss-box">
      <div class="ss-main" :style="[transStyle]" @touchstart.stop="tcStart" @touchmove.stop.prevent="tcMove">
        <template v-for="item in realList">
          <img :src="item.picurl|https" :style="[imgStyle]" alt="" ref="streetBg">
        </template>
        <ul>
          <router-link v-for="item in realList" v-if="item.businessname" :class="item.class" :style="[item.style,item.transStyle,item.inStyle]"
            :key="item.businessid" :to="'/shop/shopdetail/'+item.businessid" tag="li">
            <a>
              <p>{{item.businessname}}</p>
              <div class="bigLogo">
               <img :src="item.product&&item.product.mainpic|firstImg|https" alt="">
              </div>
              <div class="ss-brand flex-center">
                <img v-for="(brand,bi) in item.brands" v-if="bi<3" :key="brand.id" :src="brand.logourl|https" alt="">
              </div>
            </a>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'shop-street',
    props: { shops: { default() {
      return []
  } }},
    data() {
      return {
        bgSize: { w: 0, y: 0 },
        scale: 3, // 比例
        rate: 1, // 倍率
        transX: 0,
        midTansX: window.innerWidth / 2,
        posX: 0,
        imgStyle: {},
        imgWidth: 0
      }
    },
    mounted() {
      // console.log('shopstreet', this.shops);
      let bg = this.$refs.streetBg
      let lg = document.querySelector('.ss-box')
      if (bg && bg.length > 0) {
        bg[0].onload = () => {
          this.imgWidth = bg[0].naturalWidth / this.scale * this.rate
          this.bgSize.h = bg[0].naturalHeight / this.scale * this.rate
          this.bgSize.w = this.imgWidth * bg.length
          this.imgStyle = { height: this.bgSize.h }
          lg.style.height = this.bgSize.h + 'px'
          lg.style.width = this.bgSize.w + 'px'
          for (var i = 0; i < bg.length; i++) {
            bg[i].style.width = this.imgWidth + 'px'
            bg[i].style.height = this.bgSize.h + 'px'
          }
        }
        var lastBg = bg[bg.length - 1]
        lastBg.onclick = () => {
          this.$router.push('/mall/shop')
        }
      }
    },
    computed: {
      realList() {
        let list = this.shops
        list = list.map((i, index) => {
          i.class = 'ss-unitX' + this.rate
          let b = this.imgWidth * (index), e = b + this.imgWidth,
            trans = '-100%', inTop = null
          i.style = { left: b + 'px' }
          i.transStyle = { transform: 'translateX(' + trans + ')' }
          if (this.midTansX >= b && this.midTansX <= e) inTop = 0
          i.inStyle = { top: inTop }
          if (Math.abs(this.transX) >= b) {
            i.style = { left: b + this.imgWidth + 'px' }
          }

          return i
        })
        return list
      },
      transStyle() {
        let trans = 'translateX(' + this.transX + 'px)'
        return { transform: trans }
      }
    },
    methods: {
      tcStart(event) {
        let cX = event.targetTouches[0].clientX
        this.posX = cX
      },
      tcMove(event) {
        let cX = event.targetTouches[0].clientX, tX = 0, winW = window.innerWidth, isreverse = false
        tX = (cX - this.posX) * 2
        tX += this.transX
        if (tX > 0) tX = 0
        if (tX < winW - this.bgSize.w) tX = winW - this.bgSize.w
        this.transX = tX
        this.midTansX = Math.abs(this.transX) + winW / 2 + 10
        this.posX = cX
      }
    }
  }

</script>
<style scoped>
  .ss-box {
    position: relative;
    overflow: hidden;
    padding-top: 10px;
  }

  .ss-main>img {
    float: left;
    border: none;
  }

  .ss-main {
    position: relative;
    overflow-x: scroll
    /*transition: transform 0s linear;*/
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
    transition: top .3s cubic-bezier(.63, .15, .13, 1.22),left 1s ;
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

  .ss-main ul li a div.bigLogo {
    width: 65%;
    max-height: 70px;
    max-width: 70px;
    overflow: hidden;
  }
div.bigLogo img{
  width: 100%;
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
