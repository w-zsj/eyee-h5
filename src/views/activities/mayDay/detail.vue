<template>
    <div class="big-wrap">
       <!-- <v-header :showback="true" :bg="dark" v-if="!$root.ISAPP">
        <div class="nav-tab2 ellipsis">{{title}}</div>
      </v-header> -->
        <!-- 列表 -->
       <v-delay><complate @banner='getbanner'></complate></v-delay>
    </div>
</template>
<script>
import complate from "./complate";
export default {
  components: { complate },
  data() {
    return {
      title: ""
    };
  },
  mounted() {},
  methods: {
    getbanner(item) {
      this.title = item.title || "";
    }
  },
  destroyed() {
    // document.body.classList.remove("lock");
  }
};
</script>
<style lang="scss" scoped>
.big-wrap {
  max-width: 750px;
  margin: 0 auto;
  min-height: 100%;
}
img {
  display: block;
  width: 100%;
}
</style>


