<template>
  <div class="sales">
    <v-header class="v-header" :showback='insq'>
      <ul class="category">
        <router-link tag="li" replace :to="{name:'sale',params: { id:$route.params.id }}">
          <span>发售</span>
        </router-link>
        <router-link tag="li" replace :to="{name:'supremeClassify',params: { id:$route.params.id}}">
          <span>分类</span>
        </router-link>
        <router-link tag="li" replace :to="{name:'lookbook',params: { id:$route.params.id}}">
          <span class="font-price">LOOKBOOK</span>
        </router-link>
      </ul>
      <v-cart></v-cart>
    </v-header>
    <!-- <transition name="slide" mode="out-in"> -->
    <router-view></router-view>
    <!-- </transition> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  // data() {
  //   return {
  //     insq: !window.INSQ
  //   }
  // }
  computed: {
    ...mapGetters({ insq: 'insq' })
  }
}
</script>

<style scoped>
.v-header {
  border: 1px solid #fff;
}
.category {
  display: flex;
  flex: 1;
  font-size: 15px;
  font-weight: bold;
}
.category li {
  line-height: 48px;
  flex: 1;
  text-align: center;
  color: #999999;
}
.category li span {
  padding: 13px 0px;
}
.category .router-link-active span {
  border-bottom: 2px solid red;
  font-size: 16px;
  color: #333333;
  letter-spacing: 0;
}
.slide-enter {
  transform: translate3d(100%, 0, 0);
  opacity: 0;
}
.slide-enter-to,
.slide-leave {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.slide-leave-to {
  transform: translate3d(-100%, 0, 0);
  opacity: 1;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}
</style>
