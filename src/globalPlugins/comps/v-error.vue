<template>
    <div>
        <div class="error-req flex-center" @click.stop="reload">
            <img :src="img" alt="">
            <p>请求失败啦~~</p>
            <p>休息一下~~~点击空白处再试试</p>
            <a href="javascript:;" @click.stop.prevent="go">随处逛逛</a>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      img: "//files.eyee.com/mcdn/static/img/error_req.png" // require('./assets/img/error_req.png')
    };
  },
  computed: {
    goUrl() {
      let routes = [
        "/news",
        "/",
        "/mall/shop",
        "/",
        "/mall/limit",
        "/brand",
        "/mall/ghost"
      ];
      let rand = 0;
      let now = Date.now();
      rand = now % routes.length;
      // console.log('rand',rand);
      return routes[rand];
    }
  },
  methods: {
    reload() {
      window.location.reload();
    },
    go() {
      this.$router.replace(this.goUrl);
    }
  }
};
</script>

