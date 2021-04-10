<template>
    <div class="big-wrap">
        <div class="banner" @click.stop="gosub">
            <!-- <img src="https://files.eyee.com/eyeeh5/img/banner.png" alt=""> -->
            <img :src="banner" alt="">
        </div>
        <div class="big-content">
             <!-- 专区 -->
            <div class="activity-area flex-btwn flex-wrap" >
                <div class="plate" :class="{'last':index==2}" v-for="(item,index) in prefecture" :key="index" @click.stop="goPromotion(item)">
                    <img :src="item.pic" alt="">
                </div>
               
            </div>
            <!-- 推荐商品 -->
            <div class="recd-title flex-center">精选好物</div>
            <complate @banner='getbanner'></complate>
        </div>
       

    </div>
</template>
<script>
import { mapGetters } from "vuex";
import complate from "./complate";
export default {
  components: { complate },
  data() {
    return {
      prefecture: [
        {
          pic: "https://files.eyee.com/eyeeh5/img/new-pro.png",
          themetype: 2,
          name:'新品专区'
        },
        {
          pic: "https://files.eyee.com/eyeeh5/img/niu.png",
          themetype: 3,
          name:'最In英伦风'
        },
        {
          pic: "https://files.eyee.com/eyeeh5/img/fashion.png",
          themetype: 4,
          name:'潮搭推荐'
        }
      ],
      banner: ""
    };
  },
  computed: {
    ...mapGetters({ user: "userInfo" })
  },
  mounted() {
    let _ = this;
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
      console.log("banner", banner);
      if (banner) this.banner = banner;
    },
    gosub() {
      let _ = this;
      _.$router.push(`/platform/subplace?themetype=1`);
      if(!_.$root.isdebug) window.gio("track", "H5PlatBaner",{'platBanner':'banner图'});
    },
    goPromotion(item) {
      console.log(item);
      let _ = this;
      if(!_.$root.isdebug)  window.gio("track", "H5PlatBaner",{'platBanner':item.name});
      if(item.themetype==4){
        _.$router.push(`/active/21422fca8b2b48029cffaecbfde63d67`);
      }else
      _.$router.push(`/platform/subplace?themetype=${item.themetype}`);
       
    }
  },
  destroyed() {
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
  width: 49%;
  margin-bottom: 2.66vw;
}
.activity-area .plate.last {
  width: 100%;
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


