<template>
  <div>
    <loader class="load" from="4" ref="load" v-if="!$root.ISAPP"></loader>
    <v-header v-if="!$root.ISAPP">
      <div class="nav-tab2">
        <h3>助力享低价</h3>
      </div>
    </v-header>
    <broadcast :bannertype="bannertype"></broadcast>
    <router-view></router-view>
    <div class="fix-btm">
      <div class="helpTap">
        <span
          :class="activeIndex===index?'active':''"
          v-for="(item,index) in url"
          :key="index+'bar'"
          @click.stop="push(item.pushUrl,index)"
        >{{item.title}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { getUrlParam } from "../../common/util.js";
import broadcast from "./broadcast.vue";
import { MessageBox } from "mint-ui";
import Loader from "@/comps/Loader";
export default {
  data() {
    return {
      url: [
        { pushUrl: "/helpbargain", title: "助力商品" },
        { pushUrl: "/helpbargain/helporder", title: "我的助力" }
      ],
      activeIndex: 0,
      bannertype: true
    };
  },
  components: { broadcast, Loader },
  created() {
    try {
      if (this.$root.ISAPP) {
        let param = getUrlParam("param");
        param = JSON.parse(decodeURIComponent(param));
        if (param.token) {
          localStorage.setItem("currentUser", JSON.stringify(param));
        }
      }
    } catch (e) {
      console.error(" ", e);
    }
  },
  mounted() {
    let _ = this;
    if (window.location.href.indexOf("helpbargain/helporder") > 0) {
      _.bannertype = false;
      _.activeIndex = 1;
    } else {
      _.bannertype = true;
      _.activeIndex = 0;
    }
    MessageBox({
      title: "更新提示",
      message: "砍价现已全新改版！1分钱直接领！更新到最新版本斗牛App即可参与！",
      closeOnClickModal: false,
      confirmButtonText: "立即下载"
    }).then(act => {
      _.$refs.load.$el.click();
    });
  },
  watch: {
    //监听路由变化
    $route(to, from) {
      if (to.fullPath.indexOf("helpbargain/helporder") > 0) {
        this.bannertype = false;
        this.activeIndex = 1;
      } else {
        this.bannertype = true;
        this.activeIndex = 0;
      }
    }
  },
  computed: {},
  methods: {
    push(url, index) {
      this.activeIndex = index;
      this.$router.replace(url);
    }
  }
};
</script>
<style scoped>
/* .in-out-translate-fade */
body {
  padding-bottom: 0 !important;
}
.fix-btm {
  position: fixed;
  left: 0;
  bottom: -1px;
  width: 100%;
  background: #fff;
  z-index: 1;
}
.active {
  background: #333;
}
.helpTap {
  height: 44px;
  text-align: center;
  background: #ccc;
}
.helpTap span {
  float: left;
  width: 50%;
  line-height: 44px;
  color: #fff;
  /* background: #ccc; */
}
.helpTap span.active {
  background: #333;
}
</style>


