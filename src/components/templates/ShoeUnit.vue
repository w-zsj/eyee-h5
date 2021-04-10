<template>
    <div class="sneakItem" :class="{themeItem:SneakType==1}" @click="gotoSneakDetl(sneakerNum,sneakInfo.shoeid)">
         <span v-if="hotIndex<10||hotIndex==0" class="hot_brand font-price" :class="{hot_brand_three:hotIndex>2&&hotIndex<10}">{{hotIndex+1}}</span>
        <p class="pic_box flex-center" v-if="SneakType !=1" style="height:picboxHei">
            <img :src="sneakInfo.imageurl|https" alt="">
        </p>
        <img v-if="SneakType ==1" :src="sneakInfo.imageurl|https" alt="">
        <p class="sneak_title font-price"><span class="tit">{{sneakInfo.title}}</span><span v-show="SneakType ==1">{{sneakInfo.colorway}}</span></p>
        <p class="lowerprice font-price">¥{{sneakInfo.price.toFixed(2)}}+</p>
    </div>
</template>
<script>
    export default {
      props: {
        SneakType: { type: Number, default: 0 },
        sneakItem: { type: Object },
        sneakerCaty: '',
        hotIndex: { type: Number }
      },
      methods: {
        gotoSneakDetl(num, id) {
          console.log(num, id, '------')
          if (typeof (num) === 'undefined') {
            this.$router.push('/sneakerDetail/' + 'n&' + id)
          } else {
            this.$router.push('/sneakerDetail/' + num + '&' + id)
          }
        }
      },
      computed: {
        sneakInfo() {
          return this.sneakItem
        },
        sneakerNum() {
          return this.sneakerCaty
        }
      }
    }

</script>
<style scoped>
    .sneakItem{
        width: 100%;
        text-align: center;
    }
    .sneakItem img{
        display: block;
        width: 100%;
    }
    .sneakItem p{
        font-size: 0.75rem;
        color: #000;
        line-height: 15px;
    }
    .sneakItem p.sneak_title{
        height: 30px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow:ellipsis;
        margin-top: 5px;
        /*text-align: left;*/
    }
    .sneakItem p.sneak_colcor{
        height: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
    }
    .sneakItem p.lowerprice{
        color: #999;
        font-size: .875rem;
        font-weight: 600;
    }
    .sneakItem.themeItem{
        padding: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .sneakItem.themeItem img{
        width: 30%;
    }
    .sneakItem.themeItem p{
        font-size: .875rem;
    }
    .sneakItem.themeItem p.sneak_title {
        width: 100%;
        height: auto;
        text-align: center;
    }
    .sneakItem.themeItem p.sneak_title span{
        display: block;
        height: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
        color: #999;
        padding: 0 10px;
    }
    .sneakItem.themeItem p.sneak_title span.tit {
        color: #333;
        height: 30px;
        line-height: 15px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        white-space: normal;
    }
    .sneakItem.themeItem p.sneak_colcor{
        color: #999;
    }
    .sneakItem.themeItem p.lowerprice{
        color: #333;
        font-size: 1rem;
    }
    .pic_box{
        height: 70px;
        overflow: hidden;
    }
    .hot_brand{
        position: absolute;
        width: 20px;
        height: 26px;
        top:0;
        left: 0;
        background: url('//files.eyee.com/mcdn/static/img/sneaker/hot_brand.png') no-repeat;
        background-size:cover;
        font-size: 10px;
        font-weight: bold;
        color: #ffffff;
        display: flex;
       justify-content: center;
       align-items:flex-end;
    }
    .hot_brand_three{
         background-image: url('//files.eyee.com/mcdn/static/img/sneaker/hot_brand_three.png');
    }
</style>
