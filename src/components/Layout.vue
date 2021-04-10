<template>
  <div>
    <!-- :class="{mb60:showTab}" -->
    <div>
      <!--<transition name="vt" appear>-->
      <router-view></router-view>
      <!--</transition>-->
    </div>
    <transition name="vt">
      <div
        v-show="showBackTop"
        class="back-top flex-center"
        @click.stop.prevent="backTop"
      >
        <img src="http://files.eyee.com/c2cxcx/img/scroll_top.png" alt />
      </div>
    </transition>
    <footer v-if="showTab">
      <ul class="tab-bar flex-aic-btwn fix-btm">
        <template v-for="(item, index) in tabbar">
          <router-link
            :to="item.url"
            :class="{ 'act-bar': actTab === item.id }"
            tag="li"
            :key="index"
          >
            <a class="flex-center">
              <img :src="actTab === item.id ? item.actico : item.ico" alt />
              <span>{{ item.name }}</span>
            </a>
          </router-link>
        </template>
        <!-- <li @click.stop.prevent="loadApp">
          <a href="javascript:;" class="flex-center">
            <img :src="loadImg" alt="">
            <span>LOAD</span>
          </a>
        </li>-->
      </ul>
    </footer>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
// import { BrandAll } from '../common/api/base'
// import { LoginAuto } from '../common/api/user'
export default {
  data() {
    return {
      // topImg: "//files.eyee.com/static/img/back_top.png", // require('../assets/img/back_top.png'),
      loadImg: "//files.eyee.com/mcdn/static/img/load.png", // require('../assets/img/load.png'),
      tabbar: [
        {
          name: "商城",
          id: "MENU_HOME",
          url: "/home",
          ico: "../static/imgs/mall/m_shop.png",
          actico: "../static/imgs/mall/m_shop1.png",
        },
        // {
        //   name: "首页",
        //   id: "MENU_HOME",
        //   url: "/home",
        //   ico: "//files.eyee.com/mcdn/static/img/menu/m_home.png",
        //   actico: "//files.eyee.com/mcdn/static/img/menu/m_home1.png"
        // },
        // {
        //   name: "资讯",
        //   id: "MENU_NEWS",
        //   url: "/news",
        //   ico: "//files.eyee.com/mcdn/static/img/menu/m_news.png",
        //   actico: "//files.eyee.com/mcdn/static/img/menu/m_news1.png"
        // },
        // {
        //   name: "分类",
        //   id: "MENU_CATE",
        //   url: "/category",
        //   ico: "/static/img/menu/m_cate.png?c=1",
        //   actico: "/static/img/menu/m_cate1.png"
        // },
        // {
        //   name: "球鞋",
        //   id: "MENU_SNEAK",
        //   url: "/sneaker/mall",
        //   ico: "//files.eyee.com/mcdn/static/img/menu/m_sneaker.png",
        //   actico: "//files.eyee.com/mcdn/static/img/menu/m_sneaker1.png"
        // },
        // {
        //   name: "购物",
        //   id: "MENU_MALL",
        //   url: "/mall",
        //   ico: "//files.eyee.com/mcdn/static/img/menu/m_shop.png",
        //   actico: "//files.eyee.com/mcdn/static/img/menu/m_shop1.png"
        // },
        // {
        //   name: "购物车",
        //   id: "MENU_CART",
        //   url: "/cart",
        //   ico: "/static/img/menu/m_cart.png?c=1",
        //   actico: "/static/img/menu/m_cart1.png"
        // },
        {
          name: "我的",
          id: "MENU_YOU",
          url: "/user/home",
          ico: "../static/imgs/mall/m_user.png",
          actico: "../static/imgs/mall/m_user1.png",
        },
      ],
      scrollY: 0,
    };
  },
  mounted() {
    window.addEventListener("scroll", () => {
      this.scrollY = window.scrollY;
    });
    // if (this.mallBrands.length === 0) {
    //   this.BrandAll()
    // }
  },
  computed: {
    ...mapGetters({ insq: "insq", mallBrands: "mallBrands" }),
    actTab() {
      let meta = this.$route.meta;
      let selectTab = "MENU_HOME";
      if (meta && meta.tab) selectTab = meta.tab;
      return selectTab;
    },
    // insq() {
    //   return window.INSQ
    // },
    showTab() {
      if (this.insq) return false;
      let meta = this.$route.meta;
      let show = true;
      if (meta && meta.hideMenu === true) show = false;
      return show;
    },
    showBackTop() {
      return this.scrollY > window.innerHeight * 1;
    },
  },
  methods: {
    backTop() {
      window.scrollTo(0, 0);
    }, // ,
    // BrandAll() { // 页面进来的时候获取所有品牌的信息
    //   BrandAll().then(res => {
    //     if (res) {
    //       console.log(res)
    //       var brandList = [], codes = []
    //       for (var i = 0; i < res.length; i++) {
    //         var code = res[i].code, same = null
    //         codes.map((val) => {
    //           if (val.code == code) { same = val }
    //         })
    //         if (same == null || same == undefined) {
    //           codes.push({ code: code, index: i, list: [] })
    //         }
    //       }
    //       this.codes = codes
    //       for (var i = 0; i < codes.length; i++) {
    //         var cd = codes[i].code
    //         for (var j = 0; j < res.length; j++) {
    //           if (res[j].code == cd) {
    //             codes[i].list.push(res[j])
    //           }
    //         }
    //       }
    //       // console.log(codes,'codes')
    //       this.$store.dispatch('setMallBrandLists', codes)
    //     }
    //     // console.log(codes, 'dsdsdssd')
    //   }).catch(err => {
    //     this.toast(err)
    //   })
    // }
  },
};
</script>
<style>
/*.vt-enter,
.vt-leave-active {
  opacity: 0;
}

.vt-enter-active {
  transition: opacity .2s linear;
}

.vt-leave-active {
  transition: opacity 0s linear;
}*/
/* html,
body {
  height: 100%;
  overflow: auto;
  margin: 0;
} */
.act-bar img {
  transition: transform 0.3s ease-in;
  animation: scaleIn 0.3s;
}

@keyframes scaleIn {
  0% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1.1);
  }
}

footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  z-index: 99;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  overflow: hidden;
}

.mb60 {
  margin-bottom: 60px;
}

.tab-bar {
  padding: 0;
  background: #fff;
  /* box-shadow: 0 -2px 4px 0 rgba(238, 238, 238, 0.5); */
  border-top: 1px solid #e6e6e6;
  position: absolute;
  width: 100%;
  bottom: 0;
  width: 100%;
  left: 0;
  overflow: hidden;
}

.tab-bar li {
  flex: 1;
  height: 50px;
  padding-top: 2px;
}

.tab-bar a {
  flex-direction: column;
  height: 50px;
  font-size: 9px;
}

.tab-bar img {
  width: 34px;
  /*margin-bottom: 3px;*/
}
.tab-bar li:nth-of-type(3) img {
  width: 28px;
}
.tab-bar li:nth-of-type(3) span {
  margin-top: 2px;
}

.tab-bar span {
  color: #969696;
  font-weight: bold;
  font-size: 12px;
}

.act-bar span {
  color: #c8af6e;
}
</style>
