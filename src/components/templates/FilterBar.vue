<template>
  <div class="header">
    <div class="ul">
      <swiper :options="swiperArtMenu" class=" swiperbar">
        <swiper-slide>
          <div @click.stop="goFilter" class="li"><span>品牌:{{dataOption.brandName}}</span></div>
        </swiper-slide>
        <swiper-slide>
          <div @click.stop="goFilter" class="li"><span>分类:{{(dataOption.categoryName!="全部")?dataOption.categoryName:(dataOption.category?dataOption.category:"全部")}}</span></div>
        </swiper-slide>
        <swiper-slide>
          <div @click.stop="goFilter" class="li">
            <span v-if="dataOption.beginprice==null">价格:{{dataOption.priceName}}{{dataOption.beginprice}}</span>
            <span v-if="dataOption.beginprice>=0&&dataOption.beginprice!=null">价格:{{dataOption.showPrice}}</span>
          </div>
        </swiper-slide>
        <swiper-slide>
          <div @click.stop="goFilter" class="li"><span>尺码:{{dataOption.size?dataOption.size:'全部'}}</span></div>
        </swiper-slide>
      </swiper>
    </div>
   <!--  <div class="find-icon" v-if="type==0" @click.stop='changType' :class="{two_line:listType}"><span></span></div> -->
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { ENUM } from '../../common/util'
  export default {
    data() {
      return {
        swiperArtMenu: {
          slidesPerView: 'auto',
          freeMode: true
        }
      }
    },
    props: {
      type: { type: Number, default: 0 } // 默认0正常的筛选页面，1是店铺的筛选页面
    },
    methods: {
      // changType() {
      //   this.$store.state.product.listType = !this.$store.state.product.listType
      //   window.scrollTo(0, 0);
      // },
      goFilter() {
        if (this.type == 0) {
          this.$router.push('/shopFilter/' + ENUM.FilterType.mallHome.val)
        } else {
          console.log('前往店铺筛选页面')
          this.$store.state.mall.isShopSearchPage = false
        // this.$router.replace('/shop/shopdetail/'+this.$route.params.id);
        }
      }
    },
    computed: {
      ...mapGetters({ homeOption: 'homeOption', shopOption: 'shopOption' }),
      listType() {
        return this.$store.state.product.listType
      },
      dataOption() {
        if (this.type == 0) {
          return this.homeOption
        } else {
          return this.shopOption
        }
      }
    }
  }

</script>
<style scoped>
  .header {
    position: fixed;
    top: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: #666;
    padding: 5px 10px;
    width: 100%;
    background: #fff;
    z-index: 2;
  }

  .header div.li {
    display: inline-block;
    padding: 5px 2px;
    background: #eee;
    border-radius: 2px;
    margin-right: 2px;
    /*max-width: 30%;*/
    /*white-space: nowrap;*/
    /*text-overflow: ellipsis;*/
    /*overflow: hidden;*/
  }

  .header div.li span {
    color: #666;
    display: inline-block;
    font-size: 12px;
    -webkit-transform: scale(0.84, 0.84);
    *font-size: 10px;
    max-width: 100%;
  }

  /*.find-icon {
    border-left: 1px solid #f2f2f2;
    padding-left: 10px;
  }

  .find-icon span {
    display: inline-block;
    width: 14px;
    height: 20px;
    background: url('//files.eyee.com/mcdn/static/img/one_line.png') no-repeat center;
    background-size: 100%;
  }
*/
  /*.two_line span {
    background: url('//files.eyee.com/mcdn/static/img/two_line.png') no-repeat center;
    background-size: 100%;
  }*/

  .header div.ul {
    width: 90%;
  }
  .swiperbar .swiper-slide {
    width: auto;
  }
</style>
