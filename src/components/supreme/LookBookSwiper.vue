<template>
   <div class="Banner" >
       <p class="Banner_title">
         <span class="fashion font-price">{{listWrapper.name}}</span>
         <span class="index font-price">{{setnumber}}/{{listWrapper.lookbookitem.length}}</span>
       </p>
     <div class="banner_wrap ">
       <ul class="content" id="content" ref="content">
         <li class="slide" v-for="(item,index) in listWrapper.lookbookitem" :key="index" >
             <a><img :src="item.coverpic|https"/></a>
         </li>
       </ul>
       <ul class="sublist" v-for="(item,index) in listWrapper.lookbookitem" :key="index" :class="{animate: index === NowIndex }">
         <li v-for="(prod,index) in item.lookbookprod" :key="index" class="" @click="ToBrandSpecialDetail(prod.seriesproductid)">{{prod.lookprodname}}</li>
       </ul>
     </div>
   </div>
</template>
<script>
  import * as api from '../../assets/js/slider'
  export default{
    data() {
      return {
        Id: null, // 外层ul
        ArrAttr: [], // 属性数组
        Length: null, // 滑块s数量
        aSlide: null, // 滑块容器
        auto: null, // 定时器
        StartTouchX: 0,
        ix: 0,
        NowIndex: 0,
        NowNumber: 1,
        newListWrapper:[],
        lookbookitem:[],
      }
    },
    props: {
      listWrapper: {
        type: Object
      },
      autoPlay: false,
      autoTime: {
        type: Number,
        default: 5000
      }
    },
    computed: {
      setnumber() {
        if (this.NowIndex === 0) {
          return this.NowNumber = this.NowIndex + 1
        } else if (this.NowIndex + 1 > this.Length) {
          return this.NowNumber = this.NowIndex
        } else {
          return this.NowNumber = this.NowIndex + 1
        }
      }
    },
    created() {},
    methods: {
      addAttribute() {
        this.ID = this.$refs.content
        this.aSlide = this.ID.getElementsByTagName('li')
        let wOul = parseInt(api.getStyle(this.ID, 'width'))// ul宽度
        let wLi3 = wOul - parseInt(api.getStyle(this.aSlide[2], 'width'))// 第3个的边距
        let wLi4 = wOul - parseInt(api.getStyle(this.aSlide[3], 'width'))// 第4个的边距
        // this.aSlide[2].style.left = wLi3 / 1.8 + 'px'
        // this.aSlide[3].style.left = wLi4 / 1.1 + 'px'
        this.Length = this.aSlide.length
        for (let i = 0; i < this.Length; i++) {
          this.ArrAttr.push([
            parseInt(api.getStyle(this.aSlide[i], 'left')), parseInt(api.getStyle(this.aSlide[i], 'top')), api.getStyle(this.aSlide[i], 'opacity') * 100, api.getStyle(this.aSlide[i], 'zIndex'), parseInt(api.getStyle(this.aSlide[i], 'width')), parseInt(api.getStyle(this.aSlide[i], 'height'))])
        }
      },
      push() {
        for (let i = 0; i < this.Length; i++) {
          this.aSlide[i].style.zIndex = this.ArrAttr[i][3]
          api.startMove(this.aSlide[i], {
            left: this.ArrAttr[i][0],
            top: this.ArrAttr[i][1],
            opacity: this.ArrAttr[i][2],
            width: this.ArrAttr[i][4],
            height: this.ArrAttr[i][5]
          }
          )
        }
      },
      rightSlide() {
        this.ArrAttr.push(this.ArrAttr[0])
        this.ArrAttr.shift()
        this.push()
        if (this.NowIndex <= 0) {
          this.NowIndex = this.Length - 1
        } else {
          this.NowIndex--
        }
        this.NowIndex
        console.log('右')
      },
      leftSlide() { // 左
        this.ArrAttr.unshift(this.ArrAttr[this.Length - 1])
        this.ArrAttr.pop()
        this.push()
        if (this.NowIndex >= this.Length - 1) {
          this.NowIndex = 0
        } else {
          this.NowIndex++
        }
      },
      touchstart(ev) {
        clearInterval(this.auto)
        ev = ev.changedTouches[0]
        this.StartTouchX = ev.pageX
      },
      touchend(ev) {
        ev = ev.changedTouches[0]
        this.ix = ev.pageX - this.StartTouchX
        //          console.log('抬起坐标',this.ix);
        if (this.ix < -80) {
          this.leftSlide()
        } else if (this.ix > 80) {
          this.rightSlide()
        }
        // this.auto = setInterval(this.leftSlide,this.autoLbtime);
        this.auto = null
      },
      isAutoPlay() {
        if (this.autoPlay) {
          this.auto = setInterval(this.leftSlide, this.autoTime)
        }
      },
      ToBrandSpecialDetail(id){
        this.$router.push('/BrandSpecialDetail/'+id)
      }
      // swiper1(){
      //   new Swiper(".banner_wrap",{
      //     lazy:{
      //       loadPrevNext:true
      //     }
      //   })
      // }
    },
    mounted() {
    //           console.log('组件渲染完成'),
     console.log(this.listWrapper,'-------------')
     let _ = this
     _.newListWrapper = _.listWrapper;
     _.lookbookitem = _.newListWrapper.lookbookitem;
     _.lookbookitem.unshift(_.lookbookitem[_.lookbookitem.length-1])
     _.lookbookitem=_.lookbookitem.slice(0,_.lookbookitem.length-1)
     _.newListWrapper.lookbookitem = _.lookbookitem
      _.addAttribute(),
      api.bindEvent(_.ID, 'touchstart', _.touchstart),
      api.bindEvent(_.ID, 'touchend', _.touchend),
      _.isAutoPlay()
    },
    updated() {
      // this.swiper1()
    },
    components: {}
  }
</script>
<style scoped>
    .Banner{
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      padding: 0 10px;
    }
    .Banner_title{
      display: flex;
      width: 100%;
      margin: 10px 0;
      font-size:12px;
      line-height:12px;
      font-weight:600;
    }
    .Banner_title .fashion{
      flex: 1;
      color: red;
    }
    .banner_wrap{
      position: relative;
      width: 100%;
      height: 500px;
      padding: 5px 0;
      overflow:hidden;
    }
    .banner_wrap .content img{
      width: 100%;
      height: 100%;
    }
    .banner_wrap .content{
      width: 100%;
      height: 500px;
      position: relative;
    }
    .banner_wrap .content li{
      width: 240px;
      height: 258px;
      overflow: hidden;
      position: absolute;
      border-radius:5px;
      top:58px;
      left: 4px;
      /* left:75px; */
      /*display: none;*/
      box-shadow: 3px 3px 4px #b4b4b4;
      /*transition: width 0.4s,height 0.4s,top 0.4s,left 0.4s,z-index 0.4s;*/
      transform: translateZ(0);
    }
    /*私有样式*/
    /* .banner_wrap .content li:nth-child(1)
    {width:262px; height: 380px; z-index: 2;left:-270px;top:11px;opacity:1;}
    .banner_wrap .content li:nth-child(2)
    {width:270px; height:398px;z-index:3;left:0;top:1px;opacity:1;}
    .banner_wrap .content li:nth-child(3)
    {width:262px; height:380px;z-index: 2;left:54px;top:11px;opacity:1;}
    .banner_wrap .content li:nth-child(4)
    {width:248px;height: 362px ;z-index: 1;left:80px;top:19px;opacity:1;} */
    .banner_wrap .content li:nth-child(1)
    {width:262px; height: 380px; z-index: 2;left:-270px;top:11px;opacity:1;}
    .banner_wrap .content li:nth-child(2)
    {width:270px; height:398px;z-index:4;left:0;top:1px;opacity:1;}
    .banner_wrap .content li:nth-child(3)
    {width:262px; height:308px;z-index: 3;left:50px;top:45px;opacity:1;}
    .banner_wrap .content li:nth-child(4)
    {width:248px;height: 238px ;z-index: 2;left:88px;top:80px;opacity:1;}
     .banner_wrap .content li:nth-child(5)
    {width:232px;height: 188px ;z-index: 1;left:115px;top:105px;opacity:1;}



    .sublist{
      width: 100%;
      position: absolute;
      top: 400px;
      left: 0;
      margin-top: 15px;
      display:none;
    }
    .sublist li{
      font-size:12px;
      color:#333333;
      letter-spacing:0;
      line-height:12px;
      text-align:left;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .sublist li a{
      width:200px;
      display: inline-block;
    }
    .sublist li span{
      display: inline-block;
    }
    .banner_wrap .animate{
      transform:translateZ(0);
      display: block;
    }
</style>
