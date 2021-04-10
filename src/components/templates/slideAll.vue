<template>
    <div class="slideAll" :class="{'slideshow':slide,slidehide:!slide}" id="slideAll">
      <div class="left" @click="more">
      </div>
      <div class="right">
        <ul>
          <li v-for="(item,index) in activities" :key="index" @click="goPlatFrom(item.id)">
            <span>{{item.name}}</span>
          </li>
        </ul>
      </div>
    </div>
</template>
<script>
  import { bindEvent } from '../../assets/js/slider'
  export default {
    data() {
      return {
        slide: false
      }
    },
    props: {
      activities: { default: [] }
    },
    computed: {},
    watch: {},
    methods: {
      more() {
        this.slide = !this.slide
      },
      sl() {
        let that = this
        let slideX, StartTouchX
        let oSlideAll = document.getElementById('slideAll')
        bindEvent(oSlideAll, 'touchstart', function (ev) {
          ev = ev.changedTouches[0]
          StartTouchX = ev.pageX
          bindEvent(oSlideAll, 'touchmove', function () {
          })
        })
        bindEvent(oSlideAll, 'touchend', function (ev) {
          ev = ev.changedTouches[0]
          slideX = Math.abs(ev.pageX - StartTouchX)
          if (slideX > 60) {
            that.slide = !that.slide
          }
          StartTouchX = 0
          bindEvent(oSlideAll, 'touchstart', null)
          bindEvent(oSlideAll, 'touchmove', null)
        })
      },
      goPlatFrom(id) {
        this.slide = !this.slide
        this.$router.push('/platformActivity/' + id)
      }
    },
    mounted() {
      this.sl()
    }
  }
</script>
<style scoped>
  .slideAll{
    position: fixed;
    top:40%;
    z-index: 101;
    width:178px ;
    height: 202px;
    right: -146px;
    color: white;
    font-size: 10px;
    display: flex;
    align-items: center;
  }
  .slideAll .left{
    width: 39px;
    height: 66px;
    position: relative;
    text-align: center;
    border-radius: 8px 0 0 8px;
    background-image:url("//files.eyee.com/mcdn/static/img/other@2x.png");
    background-size:cover;
  }
  .slideAll .right{
    width: 146px;
    background: #333333;
    padding: 14px 0;
    border-radius: 4px;
  }
  .slideAll .right li{
    text-align: center;
    width: 100%;
    height:20px;
    font-size:13px;
    margin-bottom:12px ;
  }
  .slideAll .right li:last-child{
    margin-bottom:0px ;
  }
  .slideshow{
    transform: translate3d(-146px,0,0);
    transition:transform .3s;
  }
  .slidehide{
    transform: translate3d(0,0,0);
    transition:transform .3s;
  }
</style>
