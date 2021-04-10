<template>
    <div>
        <mt-loadmore ref="loadmore" v-infinite-scroll="loadmore" infinite-scroll-disabled="isend" infinite-scroll-distance="50" infinite-scroll-immediate-check="false" :auto-fill="false">

            <!-- :bottom-method="loadmore" :bottom-all-loaded="isend"  :bottom-pull-text="'加载更多'" :bottom-drop-text="'释放加载'"-->
            <div class="clearfix">
                <slot></slot>
            </div>
            <p class='no-more' v-show="isend">— THE END —</p>
            <p class='load-more' :class='{act:moreHandling}' v-show='!isend'><span>正在加载更多…</span></p>
        </mt-loadmore>
    </div>
</template>
<script>
export default {
  props: {
    loadHandle: { type: Function },
    moreHandle: { type: Function, default: () => {} },
    isend: { type: Boolean, default: false },
    moreHandling: { type: Boolean, default: false }
  },
  methods: {
    reload() {
      this.loadHandle(this.$refs.loadmore);
      this.$refs.loadmore.onTopLoaded();
    },
    loadmore() {
      if (this.moreHandling === true) return false;
      this.moreHandle(this.$refs.loadmore);
      this.$refs.loadmore.onBottomLoaded();
    }
  }
};
</script>
<style lang="scss" scoped>
.no-more {
  line-height: 16vw;
  color: #505050!important;
  font-size: 3.466vw;
}
</style>
