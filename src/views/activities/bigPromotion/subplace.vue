<template>
    <div class="big-wrap">
        <div class="banner">
             <img :src="banner" alt="">
        </div>
        <div class="big-content">
            <!-- 店铺推荐 -->
            <div class="recd-title flex-center" v-if="shopList&&shopList.length>0">精选好店</div>
                 <!-- 专区 -->
                <div class="activity-area flex-aic  flex-wrap" v-if="shopList&&shopList.length>0">
                    <div class="plate" v-for="(item,index) in shopList" :key="'shop'+index" @click.stop="goShopDetail(item)">
                        <img :src="item.coverurl" alt="">
                    </div>
                </div>

             <!-- 推荐商品 -->
            <div class="recd-title flex-center">精选好物</div>
            <complate @banner='getbanner' :themetype='themetype'></complate>
        </div>
        
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import complate from "./complate";
import { BigStorerecommend } from "../../../utils/api/activities";
export default {
  components: { complate },
  data() {
    return {
      banner: "",
      shopList: [],
      isShowShop: false,
      themetype: 0
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" }),
    shop(){
      let s =  this.$route.query.themetype ==2;
      return s
    }
  },
  watch:{
    'shop':function(n,o){ // 新品专区时 显示店铺
      if(n)this.shoprecd();
      else this.shopList=[]
    }
  },
  mounted() {
    let _ = this;
    _.themetype = Number(_.$route.query.themetype) || 0;
     scrollTo(0, 0);
    // 新品专区时 显示店铺
    if(_.themetype==2)_.shoprecd();
    else _.shopList=[]
    // 获取app参数
    if (_.$root.ISAPP) _.getAppParams();
  },
  methods: {
    // 获取app参数
    getAppParams(pa) {
      let _ = this;
      _.getQueryParamUser(pa)
        .then(res => {})
        .catch(e => {
          console.error("链接参数处理异常: ", e);
          //  _.toast("参数处理异常, 退出重进试试~");
        });
    },
    getbanner(banner) {
      if (banner) this.banner = banner;
    },
    shoprecd() {
      let _ = this;
      BigStorerecommend()
        .then(res => {
          if (res && res.list && res.list.length > 0) {
            _.shopList = res.list;
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    goShopDetail(item) {
      let _ = this;
      _.$router.push(`/shop/shopdetail/${item.businessid}`);
    }
  },
  destroyed(){
    document.body.classList.remove("lock");
  }
};
</script>
<style scoped>
.big-wrap{
  max-width: 750px;
  margin: 0 auto;
}
img {
  display: block;
  width: 100%;
}

.big-content .activity-area {
  margin: 2.5vw;
}
.activity-area .plate {
  width: 32%;
  margin-bottom: 2.66vw;
}
.activity-area .plate:nth-child(1) {
  width: 100%;
}
.activity-area .plate:nth-child(2),
.activity-area .plate:nth-child(3),
.activity-area .plate:nth-child(7),
.activity-area .plate:nth-child(8) {
  width: 49%;
}
.activity-area .plate:nth-child(3) ,.activity-area .plate:nth-child(8){
  margin-left: 2%;
}
.activity-area .plate:nth-child(4),
.activity-area .plate:nth-child(5),
.activity-area .plate:nth-child(6) {
  width: 32.6%;
}
.activity-area .plate:nth-child(5) {
  margin: 0 1% 2.66vw 1%;
}
.recd-title {
  margin-top: 4%;
  color: #131313;
  font-size: 16px;
  font-weight: bold;
  font-family: PINGFANG;
  position: relative;
}
.recd-title::before,
.recd-title::after {
  content: "";
  position: absolute;
  top: 0;
  left: 3.6vw;
  width: 33.33vw;
  height: 5.49vw;
  background: url("https://files.eyee.com/eyeeh5/img/icon-curve.png") 0 0
    no-repeat;
  background-size: cover;
}
.recd-title::after {
  left: auto;
  right: 3.6vw;
  transform: rotate(180deg);
}
</style>


