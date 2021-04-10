<template>
  <div class='nav-bar' :style="{top:stickyTop}" v-if="navBars.length>0">
    <ul :class="{'flex-center':!ltr,'flex-aic':ltr}">
      <li class="nav-bar-item" v-for="(i,idx) in navBars" :key="idx" :style="{width:cellWidth+'%'}" @click="toggleHandle(i,idx)">
        <span :class="{'nav-bar-badge':i.id === key}">{{i.title}}</span>
        <!-- <i class="nav-bar-bullet"></i> -->
      </li>
    </ul>
    <i class="nav-bar-bullet" :style="{width:cellWidth/2+'%',left:bulletLeft + cellWidth/4+'%'}"></i>
  </div>
</template>
<script>
export default {
  name: 'nav-bar',
  props: {
    // 至少2个 至多5个,
    // [{title:String,badge:Boolean}]
    bars: { type: Array, required: true },
    // 是否等分，false时 取五等分的宽
    iseq: { type: Boolean, default: true },
    // 是否从左到右，false时居中(个数为5个或等分时此参数无效)
    ltr: { type: Boolean, default: true },
    // 固定头部时距顶部的距离
    stickyTop: { type: Number, default: 0 },
    // 切换回调
    toggle: { type: Function, required: true }
  },
  data() {
    return {
      bulletLeft: 0,
      key: 'index'
    }
  },
  beforeMount() {
    let _ = this
    _.bulletLeft = _.getoffsetLeft()
  },
  computed: {
    navBars() {
      let bars = this.bars
      if (bars.length < 2 || bars.length > 5) bars = []
      console.log(bars)
      return bars
    },
    cellWidth() {
      let _ = this
      let cw = 15
      if (_.iseq) cw = 100 / _.bars.length
      return cw
    }
  },
  mounted() {
    let _ = this
    setTimeout(() => {
      for (let i = 0;i < _.navBars.length;i++) {
        if (_.navBars[i].Active) {
          _.toggleHandle(_.navBars[i], i)
        }
      }
    }, 500)
  },
  methods: {
    getoffsetLeft() {
      let _ = this
      let left = 0
      if (_.bars.length < 5 && !_.iseq && !_.ltr) left = (5 - _.bars.length) * 20 / 2
      return left
    },
    toggleHandle(i, idx) {
      let _ = this
      this.key = i.id
      _.bulletLeft = _.getoffsetLeft() + _.cellWidth * idx
      _.toggle({ ...i }, idx)
    }
  }
}
</script>
<style scoped>
.nav-bar {
  z-index: 109;
  position: sticky;
  top: 0;
  background: #333;
  color: #969696;
  /* margin: .4rem auto; */
  /* width: 60%; */
}
.nav-bar-item {
  /* width: 20%; */
  font-size: 4.267vw;
  font-weight: 600;
  line-height: 42px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
}
.nav-bar-badge {
  /* position: relative; */
  color: #fff;
}
/* .nav-bar-badge::after {
  content: '';
  position: absolute;
  top: 0;
  right: -3px;
  border: 3px solid #e8101c;
  border-radius: 50%;
} */
.nav-bar-bullet {
  position: absolute;
  bottom: 0;
  transition: left 0.3s ease;
}
.nav-bar-bullet:after{
  content: "";
  display: inline-block;
  width: 3.2vw;
  height: 1.06vw;
  border-radius: 2px;
  background: #fff;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
